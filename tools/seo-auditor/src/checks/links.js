'use strict';

const { SEVERITY, THRESHOLDS, PAGE_TYPES, makeIssue } = require('../rules');

const CATEGORY = 'internal_links';

/**
 * IMPORTANTE (conforme exigido pelo prompt da Fase 2): "não possui links
 * internos de SAÍDA" (outbound) e "página órfã" (sem links de ENTRADA,
 * inbound, vindos de outras páginas) são conceitos diferentes e são
 * checados separadamente aqui:
 *
 *  - NO_INTERNAL_LINKS / LOW_INTERNAL_LINKS -> outbound (page.internal_link_count)
 *  - ORPHAN_PAGE -> inbound (context.linkGraph.inboundCount, calculado a
 *    partir do grafo do site inteiro em link-graph.js)
 *  - BROKEN_INTERNAL_LINK -> href que não corresponde a nenhuma url_path
 *    conhecida do site (só sinalizado quando o alvo não "parece um
 *    arquivo", ver link-graph.js — evita falso positivo em links para
 *    recursos que não são páginas).
 */
function checkLinks(page, context) {
  const issues = [];
  const { inboundCount, brokenLinksBySource } = context.linkGraph;

  if (page.internal_link_count === 0) {
    issues.push(
      makeIssue({
        id: 'NO_INTERNAL_LINKS',
        category: CATEGORY,
        severity: SEVERITY.WARNING,
        evidence: 'Nenhum link interno de saída encontrado nesta página',
        recommendation: 'Adicionar links para páginas relacionadas (pilar, satélites do mesmo cluster).',
      })
    );
  } else if (page.internal_link_count <= THRESHOLDS.LOW_INTERNAL_LINKS) {
    issues.push(
      makeIssue({
        id: 'LOW_INTERNAL_LINKS',
        category: CATEGORY,
        severity: SEVERITY.INFO,
        evidence: `Apenas ${page.internal_link_count} links internos de saída`,
        recommendation: 'Considerar adicionar mais links contextuais para conteúdo relacionado.',
      })
    );
  }

  // Órfã = ninguém aponta para ela. A home é a raiz de entrada do site e
  // não precisa de inbound de outras páginas para não ser órfã.
  if (page.page_type !== PAGE_TYPES.HOME) {
    const inbound = inboundCount.get(page.url_path) || 0;
    if (inbound === 0) {
      issues.push(
        makeIssue({
          id: 'ORPHAN_PAGE',
          category: CATEGORY,
          severity: page.page_type === PAGE_TYPES.POST ? SEVERITY.ERROR : SEVERITY.WARNING,
          evidence: 'Nenhuma outra página do site linka para esta URL',
          recommendation: 'Adicionar pelo menos um link de entrada a partir de uma página relacionada (pilar do cluster ou artigo irmão).',
        })
      );
    }
  }

  const broken = brokenLinksBySource.get(page.url_path) || [];
  for (const link of broken) {
    issues.push(
      makeIssue({
        id: 'BROKEN_INTERNAL_LINK',
        category: CATEGORY,
        severity: SEVERITY.ERROR,
        evidence: `Link interno para "${link.href}" (resolvido como "${link.resolved_path}") não corresponde a nenhuma página existente`,
        recommendation: 'Corrigir o href ou remover o link; confirmar se a página de destino foi renomeada/removida.',
      })
    );
  }

  return issues;
}

module.exports = { checkLinks };
