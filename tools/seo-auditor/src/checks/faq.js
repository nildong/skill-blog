'use strict';

const { SEVERITY, PAGE_TYPES, makeIssue } = require('../rules');

const CATEGORY = 'faq';

/**
 * Ausência de FAQ nunca é erro — é, no máximo, uma oportunidade (INFO).
 * As únicas checagens com severidade mais alta são inconsistências reais
 * entre o que está visível na página e o que está declarado em schema.
 */
function checkFaq(page) {
  const issues = [];
  const { detected, schema_detected, heading_detected, question_count } = page.faq;

  if (heading_detected && !schema_detected) {
    issues.push(
      makeIssue({
        id: 'FAQ_HEADING_WITHOUT_SCHEMA',
        category: CATEGORY,
        severity: SEVERITY.WARNING,
        evidence: 'Heading menciona FAQ/perguntas frequentes, mas não há schema FAQPage correspondente',
        recommendation: 'Adicionar JSON-LD FAQPage para tornar o conteúdo elegível a rich results de FAQ.',
      })
    );
  }

  if (schema_detected && question_count === 0) {
    issues.push(
      makeIssue({
        id: 'FAQ_SCHEMA_EMPTY',
        category: CATEGORY,
        severity: SEVERITY.ERROR,
        evidence: 'Schema FAQPage presente, mas sem nenhuma Question em mainEntity',
        recommendation: 'Preencher mainEntity com as perguntas/respostas reais, ou remover o schema FAQPage vazio.',
      })
    );
  }

  if (page.page_type === PAGE_TYPES.POST && !detected) {
    issues.push(
      makeIssue({
        id: 'FAQ_OPPORTUNITY',
        category: CATEGORY,
        severity: SEVERITY.INFO,
        evidence: 'Nenhum FAQ detectado nesta página',
        recommendation: 'Avaliar se um bloco de perguntas frequentes com schema FAQPage agregaria valor a este conteúdo.',
      })
    );
  }

  return issues;
}

module.exports = { checkFaq };
