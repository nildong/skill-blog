'use strict';

const { buildPageProfile } = require('../../shared/profile');
const { scoreRelation, buildEvidence } = require('./scorer');
const { suggestAnchor, alreadyLinksTo, buildReason } = require('./suggestions');

/**
 * Thresholds documentados aqui (não escondidos em número mágico):
 *  - MIN_SCORE: abaixo disso a relação é fraca demais para virar sugestão
 *    (evita "sugerir tudo com todo mundo" nas 72 páginas). Escolhido de
 *    forma conservadora — ver README.md, seção "Qualidade sobre volume".
 *  - MAX_SUGGESTIONS_PER_PAGE: limite de sugestões por página de origem,
 *    conforme exigido pelo prompt da Fase 3 ("não sugerir dezenas de links
 *    para cada artigo"). Motivo documentado: mais de 5 sugestões por
 *    página tende a diluir a atenção editorial e incentivar links de baixa
 *    qualidade só para "preencher a cota".
 */
const MIN_SCORE = 35;
const MAX_SUGGESTIONS_PER_PAGE = 5;

/**
 * Recebe os posts do site-index.json, um mapa de textos de body (slug/path
 * -> texto, extraído fora daqui — ver src/index.js) e o resultado do
 * seo-audit.json (para saber quais páginas são órfãs). Retorna a lista de
 * sugestões, limitada por página e ordenada por score.
 */
function analyzeInternalLinking(posts, bodyTextByPath, seoAudit) {
  const { normalizeInternalPath, buildLinkGraph } = requireLinkGraph();

  const profiles = posts.map((p) => buildPageProfile(p, bodyTextByPath.get(p.path) || ''));
  const profileByPath = new Map(profiles.map((p) => [p.path, p]));
  const postByPath = new Map(posts.map((p) => [p.path, p]));

  const linkGraph = buildLinkGraph(posts);
  const orphanUrlPaths = new Set(
    (seoAudit ? seoAudit.pages : [])
      .filter((p) => p.issues.some((i) => i.id === 'ORPHAN_PAGE'))
      .map((p) => p.url)
  );
  const inboundCountByUrlPath = linkGraph.inboundCount;

  const suggestionsByPage = new Map();

  for (let i = 0; i < posts.length; i++) {
    for (let j = 0; j < posts.length; j++) {
      if (i === j) continue; // nunca sugerir self-link

      const source = posts[i];
      const target = posts[j];

      // páginas institucionais/home não recebem sugestão de saída aqui —
      // o foco desta fase é a malha de posts do blog (decisão de escopo,
      // ver README). page_type home/institutional/author como ORIGEM são
      // ignorados; como DESTINO continuam elegíveis normalmente.
      if (source.page_type !== 'post') continue;

      if (alreadyLinksTo(source, target.url_path, normalizeInternalPath)) continue;

      const profileA = profileByPath.get(source.path);
      const profileB = profileByPath.get(target.path);
      const contextA = { inboundCount: inboundCountByUrlPath.get(source.url_path) || 0 };
      const contextB = { inboundCount: inboundCountByUrlPath.get(target.url_path) || 0 };
      const { score, components, relationship } = scoreRelation(profileA, profileB, source, target, contextA, contextB);

      if (score < MIN_SCORE) continue;

      const isOrphanTarget = orphanUrlPaths.has(target.url_path);
      const sameCluster = components.cluster.overlap > 0;
      // Usa o componente (já passou pela guarda de base mínima em
      // scorer.js), não o `relationship` bruto — evita mencionar
      // "pilar↔satélite" no motivo quando o bônus não foi de fato aplicado
      // por falta de overlap textual real (ver PILLAR_SATELLITE_MIN_BASE).
      const isPillarSatellite = components.pillar_satellite.overlap > 0;

      const suggestion = {
        source: source.url_path,
        source_slug: source.slug,
        target: target.url_path,
        target_slug: target.slug,
        score,
        score_breakdown: {
          title: Math.round(components.title.contribution * 10) / 10,
          heading: Math.round(components.heading.contribution * 10) / 10,
          content: Math.round(components.content.contribution * 10) / 10,
          slug: Math.round(components.slug.contribution * 10) / 10,
          cluster: Math.round(components.cluster.contribution * 10) / 10,
          pillar_satellite: Math.round(components.pillar_satellite.contribution * 10) / 10,
        },
        anchor: suggestAnchor(target),
        reason: buildReason({ score, sameCluster, isOrphanTarget, isPillarSatellite }),
        evidence: buildEvidence(profileA, profileB, components),
        target_is_orphan: isOrphanTarget,
        relationship,
      };

      if (!suggestionsByPage.has(source.path)) suggestionsByPage.set(source.path, []);
      suggestionsByPage.get(source.path).push(suggestion);
    }
  }

  const allSuggestions = [];
  for (const [, list] of suggestionsByPage) {
    // Prioriza órfãs primeiro (prioridade máxima conforme prompt), depois
    // por score desc.
    list.sort((a, b) => {
      if (a.target_is_orphan !== b.target_is_orphan) return a.target_is_orphan ? -1 : 1;
      return b.score - a.score;
    });
    allSuggestions.push(...list.slice(0, MAX_SUGGESTIONS_PER_PAGE));
  }

  allSuggestions.sort((a, b) => {
    if (a.target_is_orphan !== b.target_is_orphan) return a.target_is_orphan ? -1 : 1;
    return b.score - a.score;
  });

  return {
    suggestions: allSuggestions,
    lowConnectivityPages: findLowConnectivityPages(posts, linkGraph),
  };
}

function findLowConnectivityPages(posts, linkGraph) {
  return posts
    .filter((p) => p.page_type === 'post')
    .map((p) => ({
      slug: p.slug,
      url_path: p.url_path,
      inbound: linkGraph.inboundCount.get(p.url_path) || 0,
      outbound: p.internal_link_count,
    }))
    .filter((p) => p.inbound <= 1 || p.outbound <= 1)
    .sort((a, b) => a.inbound + a.outbound - (b.inbound + b.outbound));
}

// require tardio para evitar dependência circular de path/ciclos de carga
// entre os módulos irmãos tools/seo-auditor e tools/internal-linking.
function requireLinkGraph() {
  return require('../../seo-auditor/src/link-graph');
}

module.exports = { analyzeInternalLinking, MIN_SCORE, MAX_SUGGESTIONS_PER_PAGE, findLowConnectivityPages };
