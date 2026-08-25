'use strict';

const { SEVERITY, makeIssue } = require('../rules');

const CATEGORY = 'technical';

/**
 * Checagens técnicas de baixo nível que não se encaixam em metadata
 * (que é sobre title/description/canonical) — lang e charset.
 */
function checkTechnical(page) {
  const issues = [];

  if (!page.language) {
    issues.push(
      makeIssue({
        id: 'LANGUAGE_MISSING',
        category: CATEGORY,
        severity: SEVERITY.WARNING,
        evidence: 'Atributo lang ausente em <html>',
        recommendation: 'Adicionar lang="pt-BR" na tag <html>.',
      })
    );
  }

  if (!page.charset) {
    issues.push(
      makeIssue({
        id: 'CHARSET_MISSING',
        category: CATEGORY,
        severity: SEVERITY.WARNING,
        evidence: 'Declaração de charset não encontrada',
        recommendation: 'Adicionar <meta charset="UTF-8"> no <head>.',
      })
    );
  } else if (page.charset.toUpperCase() !== 'UTF-8') {
    issues.push(
      makeIssue({
        id: 'CHARSET_NOT_UTF8',
        category: CATEGORY,
        severity: SEVERITY.WARNING,
        evidence: `charset declarado como "${page.charset}"`,
        recommendation: 'Padronizar para UTF-8.',
      })
    );
  }

  // robots ausente não é erro — o padrão do navegador/crawler é index,follow.
  if (page.robots && /noindex/i.test(page.robots)) {
    issues.push(
      makeIssue({
        id: 'ROBOTS_NOINDEX',
        category: CATEGORY,
        severity: SEVERITY.WARNING,
        evidence: `meta robots contém "noindex": "${page.robots}"`,
        recommendation: 'Confirmar se noindex é intencional para esta página; se não for, remover.',
      })
    );
  }

  return issues;
}

module.exports = { checkTechnical };
