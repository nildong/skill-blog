#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');

const { loadDataSources } = require('./loader');
const { analyzeArticle } = require('./analyze-article');
const { generateContentForArticle } = require('./generate'); // V1 — intocado
const { detectSimilarityWarnings } = require('./similarity'); // intocado
const { checkPieceV2 } = require('./quality-gate-v2');
const { CALIBRATION2_REEL_POST } = require('./piloto-v2-calibration2-reel-post-data');
const { buildSpacingRecommendations } = require('./spacing-rule-v2');
const { deriveV2FromV1, buildCarouselV2, buildStoriesV2, buildEngagementV2 } = require('./generate-v2-piloto');
const { hashAllPostHtml } = require('./validate');

const CALIBRATION2_SLUGS = [
  'porta-eletronica-x-alcapao-tradicional',      // COMPARISON
  'brinquedo-interativo-pilha-x-recarregavel',    // COMPARISON, mais curto da amostra
  'duvidas-coleira-gps-pet',                       // FAQ
  'duvidas-brinquedo-interativo-gato',             // FAQ
  'cat-mate-c500-review',                          // REVIEW
  'brinquedo-interativo-gato-idoso-vale-a-pena',   // REVIEW-style / SATELLITE
  'como-instalar-porta-eletronica-pet',            // HOW_TO
  'como-funciona-coleira-gps-cachorro',            // HOW_TO
  'soprador-pet',                                   // atípico (role=FAQ na tag, mas conteúdo é REVIEW)
  'cerca-virtual-para-cachorro',                    // atípico/informacional, cluster null, sem FAQ
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

  const analyses = CALIBRATION2_SLUGS.map((slug) => {
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
    const reelPostData = CALIBRATION2_REEL_POST[slug];

    const v1Generated = generateContentForArticle(analysis); // V1 intocado — decide sozinho generated/insufficient_source
    const v1Content = v1Generated.content;

    const pieces = {};

    if (reelPostData) {
      const reelGate = checkPieceV2(reelPostData.reel, { article });
      pieces.reel = { ...reelPostData.reel, quality_checks: reelGate.checks, quality_passed: reelGate.passed, status: reelGate.status };

      const postGate = checkPieceV2(reelPostData.post, { article });
      pieces.post = { ...reelPostData.post, quality_checks: postGate.checks, quality_passed: postGate.passed, status: postGate.status };
    }

    // Carrossel/Stories/Engagement: SEM seleção editorial pré-definida nesta
    // calibração — sempre tentados, e o próprio V1 (threshold de slides,
    // presença de heading-pergunta, par comparativo do título) decide se
    // vira `generated` ou `insufficient_source`. O gate V2 só formaliza a
    // fonte quando o V1 já decidiu gerar.
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

module.exports = { run, CALIBRATION2_SLUGS };

if (require.main === module) {
  console.log(JSON.stringify(run(), null, 2));
}
