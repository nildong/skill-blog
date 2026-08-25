'use strict';

const { CATEGORIES, SEVERITY } = require('./rules');
const { buildLinkGraph } = require('./link-graph');

const { checkMetadata } = require('./checks/metadata');
const { checkHeadings } = require('./checks/headings');
const { checkContent } = require('./checks/content');
const { checkLinks } = require('./checks/links');
const { checkImages } = require('./checks/images');
const { checkMedia } = require('./checks/media');
const { checkSchema } = require('./checks/schema');
const { checkFaq } = require('./checks/faq');
const { checkTechnical } = require('./checks/technical');
const { checkSiteStructure } = require('./checks/site_structure');

const CHECKS = [checkTechnical, checkMetadata, checkHeadings, checkContent, checkLinks, checkImages, checkMedia, checkSchema, checkFaq, checkSiteStructure];

function buildContext(posts) {
  const titleCounts = new Map();
  const descriptionCounts = new Map();

  for (const p of posts) {
    if (p.title) {
      const k = p.title.trim();
      titleCounts.set(k, (titleCounts.get(k) || 0) + 1);
    }
    if (p.meta_description) {
      const k = p.meta_description.trim();
      descriptionCounts.set(k, (descriptionCounts.get(k) || 0) + 1);
    }
  }

  return {
    titleCounts,
    descriptionCounts,
    linkGraph: buildLinkGraph(posts),
  };
}

function statusFromIssues(issues) {
  if (issues.some((i) => i.severity === SEVERITY.CRITICAL || i.severity === SEVERITY.ERROR)) return 'error';
  if (issues.some((i) => i.severity === SEVERITY.WARNING)) return 'warning';
  return 'pass';
}

function auditPage(page, context) {
  const issues = CHECKS.flatMap((check) => check(page, context));
  return {
    path: page.path,
    url: page.url_path,
    slug: page.slug,
    page_type: page.page_type,
    title: page.title,
    status: statusFromIssues(issues),
    issues,
  };
}

function emptyCategoryCounts() {
  const c = {};
  for (const cat of CATEGORIES) c[cat] = { critical: 0, error: 0, warning: 0, info: 0 };
  return c;
}

function aggregate(pageResults) {
  const summary = { critical: 0, errors: 0, warnings: 0, info: 0 };
  const categories = emptyCategoryCounts();

  for (const page of pageResults) {
    for (const issue of page.issues) {
      const sevKey = { CRITICAL: 'critical', ERROR: 'errors', WARNING: 'warnings', INFO: 'info' }[issue.severity];
      summary[sevKey] += 1;

      const catKey = { CRITICAL: 'critical', ERROR: 'error', WARNING: 'warning', INFO: 'info' }[issue.severity];
      categories[issue.category][catKey] += 1;
    }
  }

  return { summary, categories };
}

/**
 * Ponto de entrada principal: recebe o objeto já carregado de
 * site-index.json (não lê arquivo — isso é responsabilidade do CLI) e
 * retorna o relatório completo da auditoria.
 */
function auditSite(siteIndex) {
  const posts = siteIndex.posts || [];
  const context = buildContext(posts);
  const pages = posts.map((p) => auditPage(p, context));
  const { summary, categories } = aggregate(pages);

  return {
    version: 1,
    generated_at: new Date().toISOString(),
    site: {
      total_pages: pages.length,
      source_index_generated_at: siteIndex.generated_at || null,
    },
    summary,
    categories,
    pages,
  };
}

module.exports = { auditSite, auditPage, buildContext, statusFromIssues };
