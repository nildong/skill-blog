'use strict';

const { SEVERITY, THRESHOLDS, PAGE_TYPES, makeIssue } = require('../rules');

const CATEGORY = 'headings';

/**
 * Reutiliza os `structural_warnings` já computados pelo Site Indexer
 * (fonte única de verdade para "o que o HTML realmente tem" — evita
 * duplicar a lógica de parsing de heading aqui). Este módulo só decide a
 * severidade/recomendação de cada warning já detectado, e adiciona uma
 * observação de oportunidade (INFO) para estrutura rasa em posts.
 */
function checkHeadings(page) {
  const issues = [];
  const w = page.structural_warnings || [];

  if (w.includes('no_h1')) {
    issues.push(
      makeIssue({
        id: 'H1_MISSING',
        category: CATEGORY,
        severity: SEVERITY.ERROR,
        evidence: 'Nenhum <h1> encontrado na página',
        recommendation: 'Adicionar um único <h1> descrevendo o tema principal da página.',
      })
    );
  }

  if (w.includes('multiple_h1')) {
    issues.push(
      makeIssue({
        id: 'H1_MULTIPLE',
        category: CATEGORY,
        severity: SEVERITY.WARNING,
        evidence: `${page.heading_summary.h1_count} tags <h1> encontradas`,
        recommendation: 'Manter apenas um <h1> por página; rebaixar os demais para <h2>.',
      })
    );
  }

  if (w.includes('h2_before_h1')) {
    issues.push(
      makeIssue({
        id: 'H2_BEFORE_H1',
        category: CATEGORY,
        severity: SEVERITY.WARNING,
        evidence: 'Um <h2> aparece antes do primeiro <h1> no documento',
        recommendation: 'Reordenar a estrutura para que o <h1> seja o primeiro heading da página.',
      })
    );
  }

  if (w.includes('empty_heading')) {
    issues.push(
      makeIssue({
        id: 'HEADING_EMPTY',
        category: CATEGORY,
        severity: SEVERITY.WARNING,
        evidence: 'Um ou mais headings (h1-h4) estão vazios',
        recommendation: 'Remover ou preencher os headings vazios.',
      })
    );
  }

  // Oportunidade (não erro): posts com estrutura muito rasa (poucos H2).
  // Threshold conservador e documentado em rules.js — nunca ERROR por si só.
  if (page.page_type === PAGE_TYPES.POST && page.heading_summary.h2_count <= THRESHOLDS.THIN_H2_COUNT) {
    issues.push(
      makeIssue({
        id: 'HEADING_STRUCTURE_THIN',
        category: CATEGORY,
        severity: SEVERITY.INFO,
        evidence: `Apenas ${page.heading_summary.h2_count} <h2> nesta página`,
        recommendation: 'Considerar expandir a estrutura com mais seções (H2), se o tema permitir aprofundamento.',
      })
    );
  }

  return issues;
}

module.exports = { checkHeadings };
