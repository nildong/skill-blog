#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');

const { loadDataSources } = require('./loader');
const { analyzeArticle } = require('./analyze-article');
const { generateContentForArticle } = require('./generate'); // V1 — intocado
const { detectSimilarityWarnings } = require('./similarity'); // intocado
const { checkPieceV2 } = require('./quality-gate-v2');
const { ESCALA_LOTE1_REEL_POST } = require('./escala-lote1-reel-post-data');
const { buildSpacingRecommendations } = require('./spacing-rule-v2');
const { deriveV2FromV1, buildCarouselV2, buildStoriesV2, buildEngagementV2 } = require('./generate-v2-piloto');
const { hashAllPostHtml } = require('./validate');

const ESCALA_LOTE1_SLUGS = [
  'brinquedo-interativo-automatico-para-gato',              // PILLAR
  'brinquedo-automatico-cachorro-sozinho',                   // SATELLITE
  'brinquedo-interativo-sensor-infravermelho-como-funciona', // SATELLITE
  'brinquedo-interativo-substitui-brincadeira-tutor',        // SATELLITE
  'como-escolher-brinquedo-interativo-gato-entediado',       // HOW_TO
  'erros-comuns-brinquedo-interativo-gato',                  // SATELLITE
  'melhor-bolinha-inteligente-para-gato',                    // SATELLITE
  'camera-pet-resolucao-1080p-x-2k',                         // COMPARISON
  'camera-pet-x-coleira-gps-qual-escolher',                  // COMPARISON
];

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

  const analyses = ESCALA_LOTE1_SLUGS.map((slug) => {
    const post = siteIndex.posts.find((p) => p.path === `${slug}/index.html`);
    if (!post) throw new Error(`Artigo não encontrado no site-index: ${slug}`);
    return analyzeArticle(post, { root, contentStrategy, affiliateProducts });
  });

  const similarityWarnings = detectSimilarityWarnings(analyses);
  const spacingRecommendations = buildSpacingRecommendations(similarityWarnings);

  const articleResults = [];

  for (const analysis of analyses) {
    const { article } = analysis;
    const slug = article.slug;
    const reelPostData = ESCALA_LOTE1_REEL_POST[slug];

    const v1Generated = generateContentForArticle(analysis);
    const v1Content = v1Generated.content;

    const pieces = {};

    if (reelPostData) {
      const reelGate = checkPieceV2(reelPostData.reel, { article });
      pieces.reel = { ...reelPostData.reel, quality_checks: reelGate.checks, quality_passed: reelGate.passed, status: reelGate.status };

      const postGate = checkPieceV2(reelPostData.post, { article });
      pieces.post = { ...reelPostData.post, quality_checks: postGate.checks, quality_passed: postGate.passed, status: postGate.status };
    }

    const carouselV2 = buildCarouselV2(v1Content.carousel[0], article);
    const carouselGate = checkPieceV2(carouselV2, { article });
    pieces.carousel = { ...carouselV2, quality_checks: carouselGate.checks, quality_passed: carouselGate.passed, status: carouselGate.status };

    const storiesV2 = buildStoriesV2(v1Content.stories, article);
    pieces.stories = storiesV2.map((p) => {
      const gate = checkPieceV2(p, { article });
      return { ...p, quality_checks: gate.checks, quality_passed: gate.passed, status: gate.status };
    });

    const engagementV2 = buildEngagementV2(v1Content.engagement, article);
    pieces.engagement = engagementV2.map((p) => {
      const gate = checkPieceV2(p, { article });
      return { ...p, quality_checks: gate.checks, quality_passed: gate.passed, status: gate.status };
    });

    articleResults.push({
      slug,
      role: article.role,
      title: article.title,
      url: article.url,
      cluster: article.cluster,
      word_count: article.word_count,
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

module.exports = { run, ESCALA_LOTE1_SLUGS };

if (require.main === module) {
  console.log(JSON.stringify(run(), null, 2));
}
