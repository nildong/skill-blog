'use strict';

const { buildPageProfile } = require('../../shared/profile');
const { extractTerms } = require('../../shared/terms');
const { scoreRelation, buildEvidence } = require('./scorer');
const { suggestAnchor, buildReason } = require('./suggestions');
const { buildLinkGraph } = require('../../seo-auditor/src/link-graph');
const { MIN_SCORE, MAX_SUGGESTIONS_PER_PAGE } = require('./analyzer');

/**
 * Modo `--simulate` (Fase 5 da V2 — orquestração pré-escrita). Aditivo e
 * opt-in: nada aqui é chamado pelo fluxo padrão de `npm run suggest` sem a
 * flag. `analyzeInternalLinking` (usado sem --simulate) não é tocado.
 *
 * Para uma proposta de artigo que ainda não existe, responde às duas
 * perguntas da etapa 7 da arquitetura V2:
 *   - de quais páginas existentes a proposta DEVERIA RECEBER link;
 *   - para quais páginas existentes a proposta DEVERIA ENVIAR link.
 *
 * Reaproveita o mesmo `scoreRelation`/`MIN_SCORE`/`MAX_SUGGESTIONS_PER_PAGE`
 * do fluxo real — mesmos pesos, mesmo limite de qualidade sobre volume.
 */

function buildProposalPseudoPost(proposal) {
  if (!proposal || !proposal.slug) {
    throw new Error('simulate: a proposta precisa de "slug".');
  }
  const title = proposal.title || proposal.theme || '';
  return {
    slug: proposal.slug,
    title,
    page_type: 'post',
    headings: (proposal.headings || []).map((text) => ({ tag: 'h2', text, empty: !text })),
    internal_links: [],
    url_path: `/${proposal.slug}/`,
  };
}

/**
 * `posts` = site-index.json posts. `bodyTextByPath` = Map(path -> texto do
 * body), no mesmo formato que src/index.js já constrói para o modo normal
 * (obrigatório aqui também — sem isso o componente de conteúdo do score
 * fica sempre zerado para o lado das páginas reais).
 */
function simulateLinksForProposal(proposal, posts, bodyTextByPath) {
  const allPosts = posts || [];
  const pseudoPost = buildProposalPseudoPost(proposal);
  const pseudoProfile = {
    ...buildPageProfile(pseudoPost, ''),
    titleTerms: extractTerms(`${pseudoPost.title} ${proposal.keyword_candidate || ''}`),
  };

  const postsWithLinks = allPosts.map((p) => ({ ...p, internal_links: p.internal_links || [] }));
  const { inboundCount } = buildLinkGraph(postsWithLinks);

  const shouldLinkTo = []; // proposta (origem) -> página existente (destino)
  const shouldReceiveLinksFrom = []; // página existente (origem) -> proposta (destino)

  for (const post of allPosts) {
    if (post.page_type !== 'post') continue;
    if (post.slug === proposal.slug) continue;

    const profile = buildPageProfile(post, (bodyTextByPath && bodyTextByPath.get(post.path)) || '');
    const contextExisting = { inboundCount: inboundCount.get(post.url_path) || 0 };
    const contextNew = { inboundCount: 0 }; // página nova: 0 inbound é o dado real, não uma omissão

    const outbound = scoreRelation(pseudoProfile, profile, pseudoPost, post, contextNew, contextExisting);
    if (outbound.score >= MIN_SCORE) {
      shouldLinkTo.push({
        target: post.url_path,
        target_slug: post.slug,
        score: outbound.score,
        anchor: suggestAnchor(post),
        reason: buildReason({
          score: outbound.score,
          sameCluster: outbound.components.cluster.overlap > 0,
          isOrphanTarget: false,
          isPillarSatellite: outbound.components.pillar_satellite.overlap > 0,
        }),
        evidence: buildEvidence(pseudoProfile, profile, outbound.components),
        relationship: outbound.relationship,
      });
    }

    const inbound = scoreRelation(profile, pseudoProfile, post, pseudoPost, contextExisting, contextNew);
    if (inbound.score >= MIN_SCORE) {
      shouldReceiveLinksFrom.push({
        source: post.url_path,
        source_slug: post.slug,
        score: inbound.score,
        anchor: suggestAnchor(pseudoPost),
        reason: buildReason({
          score: inbound.score,
          sameCluster: inbound.components.cluster.overlap > 0,
          isOrphanTarget: false,
          isPillarSatellite: inbound.components.pillar_satellite.overlap > 0,
        }),
        evidence: buildEvidence(profile, pseudoProfile, inbound.components),
        relationship: inbound.relationship,
      });
    }
  }

  shouldLinkTo.sort((a, b) => b.score - a.score);
  shouldReceiveLinksFrom.sort((a, b) => b.score - a.score);

  return {
    version: 1,
    generated_at: new Date().toISOString(),
    proposal_slug: proposal.slug,
    method: 'simulate: aproximado (headings planejados opcionais da proposta — sem corpo de texto real, artigo ainda não existe)',
    should_link_to: shouldLinkTo.slice(0, MAX_SUGGESTIONS_PER_PAGE),
    should_receive_links_from: shouldReceiveLinksFrom.slice(0, MAX_SUGGESTIONS_PER_PAGE),
  };
}

module.exports = { buildProposalPseudoPost, simulateLinksForProposal };
