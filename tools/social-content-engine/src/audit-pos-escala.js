#!/usr/bin/env node
'use strict';

/**
 * Auditoria pós-escala — consolida os 7 lotes de geração V2 já executados
 * (Calibração 1, Piloto V2 completo, Calibração 2, Escala Lotes 1-4) numa
 * única passada de leitura, SEM regenerar nem alterar nada.
 *
 * Reexecuta cada script `run()` já existente (determinístico, somente
 * leitura) e:
 *  1. agrega métricas de tentativa/aprovação/bloqueio/needs_review;
 *  2. reverifica rastreabilidade literal de TODAS as peças aprovadas,
 *     de forma independente do quality-gate-v2 (dupla checagem);
 *  3. reverifica ausência de preço em TODAS as peças, de forma
 *     independente do gate;
 *  4. checa duplicidade de content_id entre lotes;
 *  5. roda uma passada de similaridade GLOBAL sobre os 66 artigos juntos
 *     (cada lote só comparou dentro de si mesmo — aqui capturamos overlap
 *     entre lotes diferentes que nenhum relatório individual via);
 *  6. confirma html/afiliados inalterados ao final de toda a auditoria.
 */

const path = require('path');
const fs = require('fs');

const { loadDataSources } = require('./loader');
const { analyzeArticle } = require('./analyze-article');
const { detectSimilarityWarnings } = require('./similarity');
const { PRICE_RE } = require('./quality-gate');
const { hashAllPostHtml } = require('./validate');
const { buildSpacingRecommendations } = require('./spacing-rule-v2');

function defaultRoot() {
  return path.resolve(__dirname, '..', '..', '..');
}

function readAffiliateSnapshot(root) {
  const p = path.join(root, '.data', 'affiliate-products.json');
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
}

function run() {
  const root = defaultRoot();
  const { siteIndex, contentStrategy, affiliateProducts } = loadDataSources(root);

  const affiliateBefore = readAffiliateSnapshot(root);
  const htmlHashesBefore = hashAllPostHtml(root, siteIndex);

  // 1. Reexecuta os 7 scripts já validados (somente leitura, determinísticos).
  const batches = [
    { name: 'calibracao1', mod: require('./generate-v2-calibration') },
    { name: 'piloto_v2_completo', mod: require('./generate-v2-piloto') },
    { name: 'calibracao2', mod: require('./generate-v2-calibration2') },
    { name: 'escala_lote1', mod: require('./generate-escala-lote1') },
    { name: 'escala_lote2', mod: require('./generate-escala-lote2') },
    { name: 'escala_lote3', mod: require('./generate-escala-lote3') },
    { name: 'escala_lote4', mod: require('./generate-escala-lote4') },
  ];

  const allArticleResults = [];
  const seenSlugs = new Set();
  const duplicateSlugs = [];
  const perBatchIntegrity = [];

  for (const batch of batches) {
    const result = batch.mod.run();
    perBatchIntegrity.push({
      batch: batch.name,
      htmlUnchanged: result.htmlUnchanged,
      affiliateUnchanged: result.affiliateUnchanged,
    });

    // Normaliza o formato: a Calibração 1 (generate-v2-calibration.js) usa um
    // shape diferente (`results` + `pieces.{tipo}.v2_piece` aninhado, sem
    // stories/engagement em array) porque foi o script mais antigo da série.
    // Os demais 6 scripts usam `articleResults` + `pieces.{reel,post,carousel,
    // stories[],engagement[]}` diretamente. Normalizamos aqui, sem alterar
    // nenhum dos scripts originais.
    const rawResults = result.articleResults || result.results || [];
    for (const ar of rawResults) {
      if (ar.error) continue;
      if (seenSlugs.has(ar.slug)) duplicateSlugs.push(ar.slug);
      seenSlugs.add(ar.slug);

      let normalizedPieces = ar.pieces;
      if (batch.name === 'calibracao1') {
        // pieces = { reel: {v2_piece, v1_piece}, post: {...}, ... } — extrai só v2_piece,
        // que é a peça V2 real com quality_checks/status (v1_piece é só referência histórica).
        normalizedPieces = {};
        for (const [type, both] of Object.entries(ar.pieces)) {
          if (type === 'reel' || type === 'post' || type === 'carousel') {
            normalizedPieces[type] = both.v2_piece;
          } else {
            // stories/engagement na calibração 1 também vêm como {v2_piece} único,
            // não array — envolve em array de 1 para bater com o shape comum.
            normalizedPieces[type] = [both.v2_piece];
          }
        }
      }

      allArticleResults.push({ ...ar, pieces: normalizedPieces, batch: batch.name });
    }
  }

  // 2-4. Agrega peças, reverifica rastreabilidade e preço de forma independente do gate.
  const allPieces = [];
  for (const ar of allArticleResults) {
    const p = ar.pieces;
    const list = [
      p.reel && { ...p.reel, format: 'reel' },
      p.post && { ...p.post, format: 'post' },
      p.carousel && { ...p.carousel, format: 'carousel' },
      ...(p.stories || []).map((s) => ({ ...s, format: 'stories' })),
      ...(p.engagement || []).map((e) => ({ ...e, format: 'engagement' })),
    ].filter(Boolean);
    for (const piece of list) {
      allPieces.push({ slug: ar.slug, batch: ar.batch, role: ar.role, cluster: ar.cluster, ...piece });
    }
  }

  const contentIdCounts = new Map();
  for (const piece of allPieces) {
    if (!piece.content_id) continue;
    contentIdCounts.set(piece.content_id, (contentIdCounts.get(piece.content_id) || 0) + 1);
  }
  const duplicateContentIds = [...contentIdCounts.entries()].filter(([, count]) => count > 1);

  // Reverificação independente: para cada peça `generated`, confirma que
  // source_excerpt existe literalmente em body_text_full do artigo (lido
  // direto do HTML via analyzeArticle, sem depender do resultado do gate).
  const analysesBySlug = new Map();
  for (const slug of seenSlugs) {
    const post = siteIndex.posts.find((p) => p.path === `${slug}/index.html`);
    if (!post) continue;
    analysesBySlug.set(slug, analyzeArticle(post, { root, contentStrategy, affiliateProducts }));
  }

  let traceabilityChecked = 0;
  let traceabilityOk = 0;
  const traceabilityFailures = [];
  let priceChecked = 0;
  let priceViolations = [];
  let needsReviewCount = 0;
  const needsReviewList = [];

  let tried = 0;
  let generated = 0;
  let blocked = 0;

  for (const piece of allPieces) {
    tried++;
    if (piece.status === 'generated') generated++;
    else if (piece.status === 'insufficient_source') blocked++;
    else if (piece.status === 'needs_review') {
      needsReviewCount++;
      needsReviewList.push({ slug: piece.slug, batch: piece.batch, content_id: piece.content_id });
    }

    // preço: checa em qualquer status, não só generated — nunca deve aparecer
    priceChecked++;
    const allText = JSON.stringify(piece);
    if (PRICE_RE.test(allText)) {
      priceViolations.push({ slug: piece.slug, batch: piece.batch, content_id: piece.content_id });
    }

    if (piece.status === 'generated' && piece.source && piece.source.source_excerpt) {
      traceabilityChecked++;
      const analysis = analysesBySlug.get(piece.slug);
      const body = analysis ? analysis.article.body_text_full : '';
      if (body.includes(piece.source.source_excerpt)) {
        traceabilityOk++;
      } else {
        traceabilityFailures.push({ slug: piece.slug, batch: piece.batch, content_id: piece.content_id });
      }
    }
  }

  // 5. Similaridade GLOBAL sobre os artigos únicos juntos (independente de lote).
  const allAnalyses = [...analysesBySlug.values()];
  const globalSimilarityWarnings = detectSimilarityWarnings(allAnalyses);
  const globalSpacingRecommendations = buildSpacingRecommendations(globalSimilarityWarnings);

  // Compara com os warnings já reportados por lote para achar pares NOVOS
  // (cross-lote) que nenhum relatório individual via, porque cada lote só
  // comparava consigo mesmo.
  const previouslyReportedPairs = new Set();
  for (const ar of allArticleResults) {
    for (const detail of ar.similarity_details || []) {
      const pair = [ar.slug, detail.with].sort().join('|');
      previouslyReportedPairs.add(pair);
    }
  }

  const newCrossBatchPairs = [];
  const seenPairs = new Set();
  for (const [slug, details] of globalSimilarityWarnings) {
    for (const d of details) {
      const pair = [slug, d.with].sort().join('|');
      if (seenPairs.has(pair)) continue;
      seenPairs.add(pair);
      if (!previouslyReportedPairs.has(pair)) {
        newCrossBatchPairs.push({ slug_a: slug, slug_b: d.with, overlap: d.overlap, same_cluster: d.same_cluster });
      }
    }
  }

  // 6. Confirma html/afiliados inalterados ao FINAL de toda a auditoria (além do
  // htmlUnchanged reportado por cada run() individual).
  const htmlHashesAfter = hashAllPostHtml(root, siteIndex);
  const affiliateAfter = readAffiliateSnapshot(root);

  // Distribuições
  const byRole = {};
  const byCluster = {};
  const byFormat = { reel: { g: 0, b: 0, nr: 0 }, post: { g: 0, b: 0, nr: 0 }, carousel: { g: 0, b: 0, nr: 0 }, stories: { g: 0, b: 0, nr: 0 }, engagement: { g: 0, b: 0, nr: 0 } };
  for (const ar of allArticleResults) {
    byRole[ar.role] = (byRole[ar.role] || 0) + 1;
    const clusterKey = ar.cluster || 'null (unknown)';
    byCluster[clusterKey] = (byCluster[clusterKey] || 0) + 1;
  }
  for (const piece of allPieces) {
    const bucket = byFormat[piece.format];
    if (!bucket) continue;
    if (piece.status === 'generated') bucket.g++;
    else if (piece.status === 'insufficient_source') bucket.b++;
    else if (piece.status === 'needs_review') bucket.nr++;
  }

  const uniqueArticleCount = seenSlugs.size;
  const dedupTried = tried - duplicateContentIds.length; // cada duplicata é 1 peça a mais tentada além da original
  const dedupGenerated = generated - duplicateContentIds.length; // todas as duplicatas confirmadas são pares idênticos já 'generated'

  return {
    totalArticleResultsRaw: allArticleResults.length,
    uniqueArticleCount,
    duplicateSlugs,
    duplicateContentIds,
    dedupTried,
    dedupGenerated,
    globalSpacingRecommendations,
    perBatchIntegrity,
    overallHtmlUnchanged: JSON.stringify(htmlHashesBefore) === JSON.stringify(htmlHashesAfter),
    overallAffiliateUnchanged: affiliateBefore === affiliateAfter,
    tried,
    generated,
    blocked,
    needsReviewCount,
    needsReviewList,
    traceabilityChecked,
    traceabilityOk,
    traceabilityFailures,
    priceChecked,
    priceViolations,
    newCrossBatchPairs,
    totalSimilarityPairs: seenPairs.size,
    byRole,
    byCluster,
    byFormat,
  };
}

module.exports = { run };

if (require.main === module) {
  console.log(JSON.stringify(run(), null, 2));
}
