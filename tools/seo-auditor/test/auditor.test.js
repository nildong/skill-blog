'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { makePage } = require('./support/helpers');
const { auditSite, statusFromIssues } = require('../src/auditor');

test('statusFromIssues: CRITICAL/ERROR resultam em status "error"', () => {
  assert.equal(statusFromIssues([{ severity: 'ERROR' }]), 'error');
  assert.equal(statusFromIssues([{ severity: 'CRITICAL' }]), 'error');
});

test('statusFromIssues: só WARNING resulta em status "warning"', () => {
  assert.equal(statusFromIssues([{ severity: 'WARNING' }]), 'warning');
});

test('statusFromIssues: só INFO (ou nenhum issue) resulta em status "pass"', () => {
  assert.equal(statusFromIssues([{ severity: 'INFO' }]), 'pass');
  assert.equal(statusFromIssues([]), 'pass');
});

test('auditSite: audita todas as páginas do índice e soma summary corretamente', () => {
  const home = makePage({ slug: null, url_path: '/', page_type: 'home', title: 'Home', internal_link_count: 1, internal_links: [{ href: '/a/', anchor_text: 'a', type: 'relative' }] });
  const a = makePage({ slug: 'a', url_path: '/a/', title: null }); // TITLE_MISSING (ERROR)
  const b = makePage({ slug: 'b', url_path: '/b/', internal_links: [], internal_link_count: 0 }); // órfã (ERROR) + NO_INTERNAL_LINKS (WARNING)

  const siteIndex = { generated_at: '2026-01-01T00:00:00.000Z', posts: [home, a, b] };
  const result = auditSite(siteIndex);

  assert.equal(result.site.total_pages, 3);
  assert.ok(result.summary.errors >= 2); // TITLE_MISSING + ORPHAN_PAGE, no mínimo
  assert.ok(result.summary.warnings >= 1);

  const pageA = result.pages.find((p) => p.slug === 'a');
  assert.equal(pageA.status, 'error');
  assert.ok(pageA.issues.some((i) => i.id === 'TITLE_MISSING'));

  const pageB = result.pages.find((p) => p.slug === 'b');
  assert.ok(pageB.issues.some((i) => i.id === 'ORPHAN_PAGE'));
});

test('auditSite: cada issue possui os campos obrigatórios (id, category, severity, evidence, recommendation)', () => {
  const a = makePage({ title: null });
  const result = auditSite({ posts: [a] });
  const allIssues = result.pages.flatMap((p) => p.issues);
  assert.ok(allIssues.length > 0);
  for (const issue of allIssues) {
    assert.ok(issue.id);
    assert.ok(issue.category);
    assert.ok(issue.severity);
    assert.ok(issue.evidence);
    assert.ok(issue.recommendation);
  }
});

test('auditSite: categories agrega contagens por categoria consistentes com summary', () => {
  const a = makePage({ title: null, canonical: null });
  const result = auditSite({ posts: [a] });

  const catTotal = Object.values(result.categories).reduce(
    (acc, c) => ({
      critical: acc.critical + c.critical,
      error: acc.error + c.error,
      warning: acc.warning + c.warning,
      info: acc.info + c.info,
    }),
    { critical: 0, error: 0, warning: 0, info: 0 }
  );

  assert.equal(catTotal.critical, result.summary.critical);
  assert.equal(catTotal.error, result.summary.errors);
  assert.equal(catTotal.warning, result.summary.warnings);
  assert.equal(catTotal.info, result.summary.info);
});
