'use strict';

/**
 * collect-source.js — FASE 2, arquivo NOVO.
 *
 * Reúne, sem modificar nenhum dos arquivos-fonte, todas as peças V2
 * "fato-do-corpo" já aprovadas (63 artigos, geradas por 6 scripts V1
 * que já existiam no repo: generate-v2-calibration.js,
 * generate-v2-calibration2.js, generate-v2-piloto.js,
 * generate-escala-lote1..4.js). Esses scripts exportam uma função
 * `run()` pura (não escrevem arquivo, só retornam o resultado em
 * memória quando importados como módulo — só fazem console.log se
 * executados diretamente como CLI, o que este arquivo NUNCA faz).
 *
 * Achado confirmado ao explorar o repo (documentado no relatório
 * final): não existe hoje um JSON único com as 307 peças V2 — elas só
 * existem como retorno em memória desses 6 `run()`. Este arquivo é a
 * primeira vez que esse conjunto é materializado e persistido, em
 * `.data/social-content-v2-source.json` (arquivo NOVO, paralelo).
 *
 * Formato de saída de `pieces` varia entre os scripts-fonte:
 *  - generate-v2-calibration.js: pieces.reel = { v2_piece: {...} } (só reel+post)
 *  - generate-v2-calibration2.js / generate-v2-piloto.js / generate-escala-lote1..4.js:
 *    pieces.reel = peça direta (reel, post, carousel, stories[], engagement[])
 * normalizePieces() abaixo unifica os dois formatos.
 *
 * Dedupe: comedouro-gato-x-cachorro-diferenca, duvidas-camera-para-monitorar-pet
 * e tapete-higienico-para-cachorro aparecem tanto em calibration.js quanto em
 * piloto.js (mesmo conteúdo, reaproveitado deliberadamente — ver comentário no
 * topo de piloto-v2-reel-post-data.js). Mantemos a versão do piloto (mais completa:
 * 5 formatos em vez de 2).
 *
 * Os 5 artigos "comedouro-*" sem V2 (ver reports/social-content/social-content-audit-v2.md)
 * entram como STUB_PENDENTE, sem peças reais — nunca inventamos copy nova aqui.
 */

const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..', '..');

const STUB_SLUGS = [
  'comedouro-cachorro',
  'comedouro-newpet-2l-review',
  'comedouro-newpet-4l-review',
  'comedouro-vdrbg-4l-wifi-review',
  'comedouro-x-bebedouro-automatico',
];

function loadSiteIndex() {
  // eslint-disable-next-line global-require
  return require(path.join(ROOT, '.data', 'site-index.json'));
}

/** Extrai peça "crua" de dentro do wrapper v2_piece quando presente. */
function unwrap(piece) {
  if (!piece) return null;
  return piece.v2_piece ? { ...piece.v2_piece, quality_passed: piece.quality_passed, status: piece.status, quality_checks: piece.quality_checks } : piece;
}

function normalizeArticlePieces(articleResult) {
  const { pieces } = articleResult;
  const flat = [];
  if (pieces.reel) flat.push({ formato: 'reel', ...unwrap(pieces.reel) });
  if (pieces.post) flat.push({ formato: 'post', ...unwrap(pieces.post) });
  if (pieces.carousel) flat.push({ formato: 'carousel', ...unwrap(pieces.carousel) });
  if (Array.isArray(pieces.stories)) {
    pieces.stories.forEach((p, i) => flat.push({ formato: 'stories', story_index: i, ...unwrap(p) }));
  }
  if (Array.isArray(pieces.engagement)) {
    pieces.engagement.forEach((p, i) => flat.push({ formato: 'engagement', engagement_index: i, ...unwrap(p) }));
  }
  return flat;
}

function collectRealSources() {
  const sources = [
    require('../generate-v2-calibration'),
    require('../generate-v2-calibration2'),
    require('../generate-v2-piloto'),
    require('../generate-escala-lote1'),
    require('../generate-escala-lote2'),
    require('../generate-escala-lote3'),
    require('../generate-escala-lote4'),
  ];

  const bySlug = new Map(); // slug -> articleResult (last writer wins, piloto after calibration overrides on purpose)
  for (const mod of sources) {
    const result = mod.run();
    const list = result.results || result.articleResults || [];
    for (const articleResult of list) {
      const existing = bySlug.get(articleResult.slug);
      const flatCount = normalizeArticlePieces(articleResult).length;
      const existingCount = existing ? normalizeArticlePieces(existing).length : -1;
      // Mantém a versão com mais peças (piloto/lote têm 5 formatos, calibration só 2)
      if (!existing || flatCount >= existingCount) {
        bySlug.set(articleResult.slug, articleResult);
      }
    }
  }
  return bySlug;
}

function collectSource() {
  const siteIndex = loadSiteIndex();
  const postBySlug = new Map(siteIndex.posts.map((p) => [p.slug, p]));

  const realBySlug = collectRealSources();
  const articles = [];
  let totalPieces = 0;

  let totalInsufficient = 0;
  for (const [slug, articleResult] of realBySlug.entries()) {
    const allPieces = normalizeArticlePieces(articleResult);
    // `insufficient_source` = a peça foi deliberadamente NÃO gerada por falta de
    // material real no artigo (motivo documentado em `.reason`), não é um erro.
    // Excluída do pipeline de enrichment/score/publicação; contada à parte.
    const flatPieces = allPieces.filter((p) => p.status !== 'insufficient_source');
    const skipped = allPieces.filter((p) => p.status === 'insufficient_source');
    totalPieces += flatPieces.length;
    totalInsufficient += skipped.length;
    articles.push({
      slug,
      title: articleResult.title,
      url: articleResult.url,
      cluster: articleResult.cluster || null,
      role: articleResult.role || null,
      status: 'V2_REAL',
      pieces: flatPieces,
      pieces_insufficient_source: skipped.map((p) => ({ formato: p.formato, content_id: p.content_id, reason: p.reason })),
    });
  }

  for (const slug of STUB_SLUGS) {
    const post = postBySlug.get(slug);
    articles.push({
      slug,
      title: post ? post.title : null,
      url: post ? post.canonical || `https://smartpetgadgets.com.br/${slug}/` : `https://smartpetgadgets.com.br/${slug}/`,
      cluster: 'comedouro-automatico-para-pet',
      role: null,
      status: 'STUB_PENDENTE',
      pieces: [],
      observacao: 'Sem copy V2 fato-do-corpo aprovada ainda (ver reports/social-content/social-content-audit-v2.md secao 4). Excluído do pipeline de enrichment principal nesta FASE 2 — pendente para lote de escrita futuro.',
    });
  }

  return {
    generated_at: new Date().toISOString(),
    total_articles_real: realBySlug.size,
    total_articles_stub: STUB_SLUGS.length,
    total_pieces: totalPieces,
    total_pieces_insufficient_source: totalInsufficient,
    articles,
  };
}

module.exports = { collectSource, STUB_SLUGS, normalizeArticlePieces };

if (require.main === module) {
  const fs = require('fs');
  const out = collectSource();
  const dest = path.join(ROOT, '.data', 'social-content-v2-source.json');
  fs.writeFileSync(dest, JSON.stringify(out, null, 2));
  console.log(`OK: ${out.total_articles_real} artigos reais (${out.total_pieces} peças) + ${out.total_articles_stub} stub -> ${dest}`);
}
