'use strict';

const { SEVERITY, THRESHOLDS, makeIssue } = require('../rules');

const CATEGORY = 'metadata';

/**
 * Regras de metadata. DETERMINÍSTICAS: title ausente, description ausente,
 * duplicatas, canonical ausente/inconsistente. OPORTUNIDADES (INFO): faixas
 * de tamanho de title/description — nunca tratadas como penalização
 * garantida do Google, apenas como recomendação técnica (thresholds em
 * rules.js, documentados).
 */
function checkMetadata(page, context) {
  const issues = [];
  const t = page.title;
  const d = page.meta_description;

  if (!t) {
    issues.push(
      makeIssue({
        id: 'TITLE_MISSING',
        category: CATEGORY,
        severity: SEVERITY.ERROR,
        evidence: '<title> ausente ou vazio',
        recommendation: 'Adicionar um <title> único e descritivo para a página.',
      })
    );
  } else {
    const dupCount = context.titleCounts.get(t.trim()) || 0;
    if (dupCount > 1) {
      issues.push(
        makeIssue({
          id: 'TITLE_DUPLICATE',
          category: CATEGORY,
          severity: SEVERITY.ERROR,
          evidence: `Title "${t}" é compartilhado por ${dupCount} páginas`,
          recommendation: 'Tornar o title único, refletindo o ângulo específico desta página.',
        })
      );
    }
    if (t.length > THRESHOLDS.TITLE_MAX_LEN) {
      issues.push(
        makeIssue({
          id: 'TITLE_TOO_LONG',
          category: CATEGORY,
          severity: SEVERITY.INFO,
          evidence: `Title com ${t.length} caracteres (recomendado até ${THRESHOLDS.TITLE_MAX_LEN})`,
          recommendation: 'Considerar encurtar o title para reduzir risco de truncamento no SERP.',
        })
      );
    } else if (t.length < THRESHOLDS.TITLE_MIN_LEN) {
      issues.push(
        makeIssue({
          id: 'TITLE_TOO_SHORT',
          category: CATEGORY,
          severity: SEVERITY.INFO,
          evidence: `Title com apenas ${t.length} caracteres (recomendado a partir de ${THRESHOLDS.TITLE_MIN_LEN})`,
          recommendation: 'Considerar um title mais descritivo, incluindo a keyword principal.',
        })
      );
    }
  }

  if (!d) {
    issues.push(
      makeIssue({
        id: 'DESCRIPTION_MISSING',
        category: CATEGORY,
        severity: SEVERITY.WARNING,
        evidence: 'meta description ausente ou vazia',
        recommendation: 'Adicionar meta description única resumindo o conteúdo da página.',
      })
    );
  } else {
    const dupCount = context.descriptionCounts.get(d.trim()) || 0;
    if (dupCount > 1) {
      issues.push(
        makeIssue({
          id: 'DESCRIPTION_DUPLICATE',
          category: CATEGORY,
          severity: SEVERITY.WARNING,
          evidence: `meta description compartilhada por ${dupCount} páginas`,
          recommendation: 'Escrever uma meta description específica para esta página.',
        })
      );
    }
    if (d.length > THRESHOLDS.DESCRIPTION_MAX_LEN) {
      issues.push(
        makeIssue({
          id: 'DESCRIPTION_TOO_LONG',
          category: CATEGORY,
          severity: SEVERITY.INFO,
          evidence: `meta description com ${d.length} caracteres (recomendado até ${THRESHOLDS.DESCRIPTION_MAX_LEN})`,
          recommendation: 'Considerar encurtar para reduzir risco de truncamento no SERP.',
        })
      );
    } else if (d.length < THRESHOLDS.DESCRIPTION_MIN_LEN) {
      issues.push(
        makeIssue({
          id: 'DESCRIPTION_TOO_SHORT',
          category: CATEGORY,
          severity: SEVERITY.INFO,
          evidence: `meta description com apenas ${d.length} caracteres (recomendado a partir de ${THRESHOLDS.DESCRIPTION_MIN_LEN})`,
          recommendation: 'Considerar expandir a description para melhor aproveitar o espaço do SERP.',
        })
      );
    }
  }

  if (!page.canonical) {
    issues.push(
      makeIssue({
        id: 'CANONICAL_MISSING',
        category: CATEGORY,
        severity: SEVERITY.WARNING,
        evidence: '<link rel="canonical"> ausente',
        recommendation: 'Adicionar canonical self-referencing apontando para a própria URL.',
      })
    );
  } else {
    const normalized = normalizeCanonical(page.canonical);
    if (normalized && normalized !== page.url_path) {
      issues.push(
        makeIssue({
          id: 'CANONICAL_MISMATCH',
          category: CATEGORY,
          severity: SEVERITY.WARNING,
          evidence: `canonical aponta para "${page.canonical}", mas a URL da página é "${page.url_path}"`,
          recommendation: 'Confirmar se o canonical diferente é intencional (ex: duplicata proposital); caso não seja, corrigir para self-referencing.',
        })
      );
    }
  }

  return issues;
}

function normalizeCanonical(canonical) {
  try {
    const url = new URL(canonical);
    return url.pathname.endsWith('/') || /\.[a-z0-9]{2,5}$/i.test(url.pathname) ? url.pathname : `${url.pathname}/`;
  } catch {
    return null; // canonical não é uma URL absoluta válida — não determinável localmente
  }
}

module.exports = { checkMetadata };
