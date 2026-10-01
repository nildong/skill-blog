'use strict';

const { buildReels, buildPosts, buildCarousel, buildStories, buildEngagement } = require('./content-templates');
const { runQualityGate } = require('./quality-gate');

/**
 * Gera as 8 peças (2 Reels, 2 Posts, 1 Carrossel, 2 Stories, 1 Pergunta)
 * para um artigo já analisado (saída de analyzeArticle), roda o quality
 * gate em cada peça, e retorna o pacote atualizado. Peças que não têm
 * gancho real suficiente na fonte ficam `status: "insufficient_source"`
 * em vez de inventar conteúdo — contam para o total de "peças" mas não
 * para "peças prontas para fila editorial".
 */
function generateContentForArticle(articleAnalysis) {
  const { article, signals } = articleAnalysis;

  const rawContent = {
    reels: buildReels(article, signals),
    posts: buildPosts(article, signals),
    carousel: [buildCarousel(article, signals)],
    stories: buildStories(article, signals),
    engagement: buildEngagement(article),
  };

  const content = runQualityGate(article, rawContent);

  const allPieces = [...content.reels, ...content.posts, ...content.carousel, ...content.stories, ...content.engagement];
  const generatedCount = allPieces.filter((p) => p.status === 'generated').length;
  const needsReviewCount = allPieces.filter((p) => p.status === 'needs_review').length;
  const insufficientCount = allPieces.filter((p) => p.status === 'insufficient_source').length;

  return {
    ...articleAnalysis,
    content,
    generation_summary: {
      total_pieces: allPieces.length,
      generated: generatedCount,
      needs_review: needsReviewCount,
      insufficient_source: insufficientCount,
    },
    status: needsReviewCount > 0 ? 'needs_review' : (insufficientCount > 0 ? 'generated_partial' : 'generated'),
  };
}

module.exports = { generateContentForArticle };
