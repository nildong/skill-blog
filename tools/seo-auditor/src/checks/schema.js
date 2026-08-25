'use strict';

const { SEVERITY, PAGE_TYPES, makeIssue } = require('../rules');

const CATEGORY = 'schema';

/**
 * Nenhum tipo de schema é tratado como obrigatório para TODAS as páginas —
 * as expectativas variam por page_type (posts vs. institucional/home/autor).
 */
function checkSchema(page) {
  const issues = [];

  if (page.schema_invalid_count > 0) {
    issues.push(
      makeIssue({
        id: 'JSONLD_INVALID',
        category: CATEGORY,
        severity: SEVERITY.ERROR,
        evidence: `${page.schema_invalid_count} bloco(s) JSON-LD com erro de parsing`,
        recommendation: 'Corrigir a sintaxe JSON do(s) bloco(s) <script type="application/ld+json"> inválido(s).',
      })
    );
  }

  if (page.schema_count === 0) {
    issues.push(
      makeIssue({
        id: 'JSONLD_MISSING',
        category: CATEGORY,
        severity: page.page_type === PAGE_TYPES.POST ? SEVERITY.WARNING : SEVERITY.INFO,
        evidence: 'Nenhum bloco JSON-LD encontrado na página',
        recommendation: 'Adicionar structured data apropriado ao tipo de página (BlogPosting para posts, Organization/WebSite para institucionais).',
      })
    );
    return issues; // sem schema nenhum, as checagens abaixo não se aplicam
  }

  if (page.page_type === PAGE_TYPES.POST) {
    const hasArticleType = page.schema_types.includes('BlogPosting') || page.schema_types.includes('Article');
    if (!hasArticleType) {
      issues.push(
        makeIssue({
          id: 'SCHEMA_ARTICLE_TYPE_MISSING',
          category: CATEGORY,
          severity: SEVERITY.WARNING,
          evidence: `Tipos de schema presentes: ${page.schema_types.join(', ') || '(nenhum)'}`,
          recommendation: 'Adicionar schema BlogPosting (ou Article) para este post.',
        })
      );
    }

    if (!page.schema_types.includes('BreadcrumbList')) {
      issues.push(
        makeIssue({
          id: 'SCHEMA_BREADCRUMB_MISSING',
          category: CATEGORY,
          severity: SEVERITY.INFO,
          evidence: 'Schema BreadcrumbList não encontrado',
          recommendation: 'Considerar adicionar BreadcrumbList para reforçar a arquitetura de navegação nos resultados de busca.',
        })
      );
    }
  }

  return issues;
}

module.exports = { checkSchema };
