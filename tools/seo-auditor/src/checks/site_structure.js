'use strict';

const { SEVERITY, PAGE_TYPES, makeIssue } = require('../rules');

const CATEGORY = 'site_structure';

/**
 * Checagens que só fazem sentido olhando o grafo do site inteiro (não uma
 * página isolada). ORPHAN_PAGE (sem inbound) já é reportado por
 * checks/links.js — aqui tratamos especificamente o caso mais grave:
 * páginas ISOLADAS (sem nenhum link de entrada E sem nenhum link de
 * saída), que ficam efetivamente fora da malha de navegação do site.
 *
 * LIMITAÇÃO DOCUMENTADA: análise de "clusters com poucos artigos" não é
 * implementada nesta fase — o Site Indexer não determina `cluster` de
 * forma confiável (campo sempre null, ver tools/site-indexer/README.md),
 * então não há base de dados real para essa regra ainda. Adicionar essa
 * checagem exigiria primeiro popular `cluster` (retroativamente ou via
 * convenção de nome de pasta), o que está fora do escopo desta fase.
 */
function checkSiteStructure(page, context) {
  const issues = [];
  if (page.page_type === PAGE_TYPES.HOME) return issues;

  const inbound = context.linkGraph.inboundCount.get(page.url_path) || 0;
  const outbound = page.internal_link_count;

  if (inbound === 0 && outbound === 0) {
    issues.push(
      makeIssue({
        id: 'ISOLATED_PAGE',
        category: CATEGORY,
        severity: SEVERITY.ERROR,
        evidence: 'Página sem nenhum link interno de entrada e sem nenhum link interno de saída',
        recommendation: 'Conectar esta página à malha de navegação do site: adicionar links de/para páginas relacionadas.',
      })
    );
  }

  return issues;
}

module.exports = { checkSiteStructure };
