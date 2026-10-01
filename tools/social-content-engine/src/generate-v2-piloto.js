#!/usr/bin/env node
'use strict';

const path = require('path');

const { loadDataSources } = require('./loader');
const { selectDiversifiedPilot, PILOT_SIZE } = require('./select-pilot');
const { analyzeArticle } = require('./analyze-article');
const { generateContentForArticle } = require('./generate'); // V1 — intocado
const { detectSimilarityWarnings } = require('./similarity'); // intocado
const { checkPieceV2 } = require('./quality-gate-v2');
const { getFormatSelection } = require('./format-selection-v2');
const { PILOTO_V2_REEL_POST } = require('./piloto-v2-reel-post-data');
const { buildSpacingRecommendations } = require('./spacing-rule-v2');
const { hashAllPostHtml } = require('./validate');
const fs = require('fs');

function defaultRoot() {
  return path.resolve(__dirname, '..', '..', '..');
}

function readAffiliateSnapshot(root) {
  const p = path.join(root, '.data', 'affiliate-products.json');
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
}

/** O H1 impresso no corpo do artigo às vezes difere da tag <title> usada em
 * `article.title` (achado real do quality-gate-v2 nesta geração — ver relatório).
 * Por isso nunca assumimos que article.title é literal em body_text_full: extraímos
 * o H1 real cortando o texto antes do primeiro " Publicado em " (padrão fixo do byline). */
function extractRealH1(bodyTextFull) {
  const idx = bodyTextFull.indexOf(' Publicado em ');
  return idx > 0 ? bodyTextFull.slice(0, idx).trim() : bodyTextFull.slice(0, 120).trim();
}

/** Deriva uma peça V2 a partir da peça V1 já gerada (carousel/stories/engagement),
 * anexando `source` com excerpt literal (heading ou título, ambos garantidamente
 * presentes em body_text_full). Não reescreve o conteúdo — só formaliza a fonte. */
function deriveV2FromV1(v1Piece, article, { sourceType, excerpt, section }) {
  if (v1Piece.status === 'insufficient_source') return v1Piece;
  return { ...v1Piece, source: { article_slug: article.slug, source_type: sourceType, source_excerpt: excerpt, section: section || null } };
}

/** Slide-âncora do carrossel para fins de rastreabilidade: o heading do slide
 * "Problema", mas só se tiver texto substancial (achado real na calibração 2 —
 * headings curtos como "Pilha Comum" não sustentam prova de fonte sozinhos).
 * Cai para o próximo slide com heading mais longo, e por fim para o H1 real. */
function pickCarouselAnchorExcerpt(slides, article) {
  const MIN_LEN = 15;
  const problemSlide = slides.find((s) => s.papel === 'Problema');
  if (problemSlide && problemSlide.titulo.length >= MIN_LEN) return { excerpt: problemSlide.titulo, section: problemSlide.papel };
  const longEnough = slides.find((s) => s.titulo && s.titulo.length >= MIN_LEN && s.papel !== 'Gancho' && s.papel !== 'CTA');
  if (longEnough) return { excerpt: longEnough.titulo, section: longEnough.papel };
  return { excerpt: extractRealH1(article.body_text_full), section: 'H1 do artigo' };
}

function buildCarouselV2(v1Carousel, article) {
  if (v1Carousel.status === 'insufficient_source') return v1Carousel;
  const { excerpt, section } = pickCarouselAnchorExcerpt(v1Carousel.slides, article);
  return deriveV2FromV1(v1Carousel, article, { sourceType: 'heading', excerpt, section });
}

function buildStoriesV2(v1Stories, article) {
  return v1Stories.map((s) => {
    if (s.status === 'insufficient_source') return s;
    if (s.tipo === 'enquete') return deriveV2FromV1(s, article, { sourceType: 'faq_question', excerpt: s.conteudo, section: 'FAQ/pergunta real do artigo' });
    // stories tipo 'cta' usa o H1 real impresso no corpo (não a tag <title>, que pode divergir — ver extractRealH1)
    return deriveV2FromV1(s, article, { sourceType: 'title', excerpt: extractRealH1(article.body_text_full), section: 'H1 do artigo' });
  });
}

function buildEngagementV2(v1Engagement, article) {
  return v1Engagement.map((e) => {
    if (e.status === 'insufficient_source') return e;
    // Pergunta pode vir de FAQ real (excerpt = pergunta) ou de par comparativo do título (excerpt = título)
    const isLiteralFaqQuestion = article.question_headings.some((q) => q.text === e.pergunta);
    if (isLiteralFaqQuestion) return deriveV2FromV1(e, article, { sourceType: 'faq_question', excerpt: e.pergunta, section: 'FAQ/pergunta real do artigo' });
    return deriveV2FromV1(e, article, { sourceType: 'title', excerpt: extractRealH1(article.body_text_full), section: 'H1 do artigo (par comparativo A x B)' });
  });
}

function run() {
  const root = defaultRoot();
  const { siteIndex, contentStrategy, affiliateProducts } = loadDataSources(root);

  const affiliateBefore = readAffiliateSnapshot(root);
  const htmlHashesBefore = hashAllPostHtml(root, siteIndex);

  const selection = selectDiversifiedPilot({ siteIndex, contentStrategy, affiliateProducts }, PILOT_SIZE);
  const analyses = selection.selected.map((c) => {
    const post = siteIndex.posts.find((p) => p.path === c.path);
    return analyzeArticle(post, { root, contentStrategy, affiliateProducts });
  });

  const similarityWarnings = detectSimilarityWarnings(analyses);
  const spacingRecommendations = buildSpacingRecommendations(similarityWarnings);

  const articleResults = [];

  for (const analysis of analyses) {
    const { article, signals } = analysis;
    const slug = article.slug;
    const formatSel = getFormatSelection(slug);
    if (!formatSel) {
      articleResults.push({ slug, error: `Sem seleção de formato V2 definida para ${slug}` });
      continue;
    }

    const v1Generated = generateContentForArticle(analysis); // gerador V1 intocado — usado como base p/ carousel/stories/engagement
    const v1Content = v1Generated.content;
    const reelPostData = PILOTO_V2_REEL_POST[slug];

    const pieces = {};
    const included = new Set(formatSel.included);

    if (included.has('reel') && reelPostData) {
      const gate = checkPieceV2(reelPostData.reel, { article });
      pieces.reel = { ...reelPostData.reel, quality_checks: gate.checks, quality_passed: gate.passed, status: gate.status };
    }
    if (included.has('post') && reelPostData) {
      const gate = checkPieceV2(reelPostData.post, { article });
      pieces.post = { ...reelPostData.post, quality_checks: gate.checks, quality_passed: gate.passed, status: gate.status };
    }
    if (included.has('carousel')) {
      const v2Piece = buildCarouselV2(v1Content.carousel[0], article);
      const gate = checkPieceV2(v2Piece, { article });
      pieces.carousel = { ...v2Piece, quality_checks: gate.checks, quality_passed: gate.passed, status: gate.status };
    }
    if (included.has('stories')) {
      const v2Pieces = buildStoriesV2(v1Content.stories, article);
      pieces.stories = v2Pieces.map((p) => {
        const gate = checkPieceV2(p, { article });
        return { ...p, quality_checks: gate.checks, quality_passed: gate.passed, status: gate.status };
      });
    }
    if (included.has('engagement')) {
      const v2Pieces = buildEngagementV2(v1Content.engagement, article);
      pieces.engagement = v2Pieces.map((p) => {
        const gate = checkPieceV2(p, { article });
        return { ...p, quality_checks: gate.checks, quality_passed: gate.passed, status: gate.status };
      });
    }

    articleResults.push({
      slug,
      role: article.role,
      title: article.title,
      url: article.url,
      cluster: article.cluster,
      format_selection: formatSel,
      pieces,
      similarity_warning: similarityWarnings.has(slug),
      similarity_details: similarityWarnings.get(slug) || [],
    });
  }

  const htmlHashesAfter = hashAllPostHtml(root, siteIndex);
  const affiliateAfter = readAffiliateSnapshot(root);

  return {
    articleResults,
    spacingRecommendations,
    htmlUnchanged: JSON.stringify(htmlHashesBefore) === JSON.stringify(htmlHashesAfter),
    affiliateUnchanged: affiliateBefore === affiliateAfter,
  };
}

module.exports = { run, deriveV2FromV1, buildCarouselV2, buildStoriesV2, buildEngagementV2, extractRealH1 };

if (require.main === module) {
  const result = run();
  console.log(JSON.stringify(result, null, 2));
}
