'use strict';

const { buildPageProfile } = require('../../shared/profile');
const { extractTerms } = require('../../shared/terms');
const { scoreCannibalization } = require('./scorer');
const { buildLinkGraph } = require('../../seo-auditor/src/link-graph');

/**
 * Modo `--simulate` (Fase 5 da V2 — orquestração pré-escrita). Aditivo e
 * opt-in: NADA neste arquivo é chamado pelo fluxo padrão de
 * `npm run detect` sem a flag. O comportamento existente (analyzeCannibalization,
 * usado por src/index.js sem --simulate) não é tocado por este módulo.
 *
 * Permite comparar uma PROPOSTA de artigo (que ainda não existe como
 * arquivo/URL) contra todas as páginas reais já publicadas, reaproveitando
 * o mesmo `scoreCannibalization` usado na detecção real — mesmos pesos,
 * mesmos thresholds, mesma lógica de desconto pilar↔satélite.
 *
 * Limitação, sempre explícita no resultado: a proposta não tem conteúdo
 * real (o artigo ainda não foi escrito), só título/keyword/headings
 * planejados — o componente de CONTENT do score fica zerado, então o
 * score tende a subestimar o risco real. Reavaliação obrigatória depois
 * que o artigo existir de fato.
 */

/**
 * `proposal` esperado (formato compatível com
 * tools/orchestrator article-proposal.json, mas sem depender dele):
 *   { slug, theme|title, keyword_candidate?, headings? }
 * `headings`, se fornecido, é um array de strings (headings planejados) —
 * usado para dar mais sinal ao score sem inventar conteúdo.
 */
function buildProposalPseudoPost(proposal) {
  if (!proposal || !proposal.slug) {
    throw new Error('simulate: a proposta precisa de "slug".');
  }
  const title = proposal.title || proposal.theme || '';
  const pseudoPost = {
    slug: proposal.slug,
    title,
    page_type: 'post',
    headings: (proposal.headings || []).map((text) => ({ tag: 'h2', text, empty: !text })),
    faq: null,
  };
  const profile = {
    ...buildPageProfile(pseudoPost, ''),
    titleTerms: extractTerms(`${title} ${proposal.keyword_candidate || ''}`),
  };
  return { pseudoPost, profile };
}

/**
 * Compara a proposta contra todos os posts reais (`page_type: 'post'`,
 * excluindo o próprio slug se já existir por coincidência). Retorna as
 * top `limit` comparações por score desc, mais o pior nível encontrado.
 */
function simulateAgainstExisting(proposal, posts, { limit = 10 } = {}) {
  const allPosts = posts || [];
  const postsWithLinks = allPosts.map((p) => ({ ...p, internal_links: p.internal_links || [] }));
  const { inboundCount } = buildLinkGraph(postsWithLinks);

  const { pseudoPost, profile } = buildProposalPseudoPost(proposal);

  const comparisons = [];
  for (const post of allPosts) {
    if (post.page_type !== 'post') continue;
    if (post.slug === proposal.slug) continue;

    const otherProfile = buildPageProfile(post, '');
    const result = scoreCannibalization(profile, otherProfile, pseudoPost, post, {}, {
      inboundCount: inboundCount.get(post.url_path),
    });

    comparisons.push({
      slug: post.slug,
      url: post.url_path,
      title: post.title,
      score: result.score,
      level: result.level,
      relationship: result.relationship,
      differentiation_signals: result.differentiationSignals,
    });
  }

  comparisons.sort((a, b) => b.score - a.score);
  const topMatches = comparisons.slice(0, limit);

  const levelOrder = { low: 0, complementary: 0, possible: 1, high: 2 };
  const worstLevel = topMatches.reduce(
    (worst, c) => (levelOrder[c.level] > levelOrder[worst] ? c.level : worst),
    'low'
  );

  return {
    version: 1,
    generated_at: new Date().toISOString(),
    proposal_slug: proposal.slug,
    method: 'simulate: aproximado (title/slug/headings planejados da proposta — sem conteúdo real, artigo ainda não existe)',
    compared_against: comparisons.length,
    top_matches: topMatches,
    worst_level: worstLevel,
    limitations: [
      'Componente de CONTENT do score é sempre 0 aqui (artigo ainda não escrito) — score tende a subestimar o risco real comparado a uma detecção pós-publicação.',
    ],
  };
}

module.exports = { buildProposalPseudoPost, simulateAgainstExisting };
