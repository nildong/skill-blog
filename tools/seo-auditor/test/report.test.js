'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { makePage } = require('./support/helpers');
const { auditSite } = require('../src/auditor');
const { buildMarkdownReport, writeReports } = require('../src/report');

test('report: markdown gerado contém as seções obrigatórias e os números reais', () => {
  const a = makePage({ title: null });
  const result = auditSite({ posts: [a] });
  const md = buildMarkdownReport(result);

  assert.match(md, /# SEO Audit/);
  assert.match(md, /## Summary/);
  assert.match(md, /## Critical Issues/);
  assert.match(md, /## Errors/);
  assert.match(md, /## Warnings/);
  assert.match(md, /## Opportunities \(Info\)/);
  assert.match(md, /## Site Structure/);
  assert.match(md, /## Internal Linking/);
  assert.match(md, /## Metadata/);
  assert.match(md, /## Headings/);
  assert.match(md, /## Content/);
  assert.match(md, /## Images/);
  assert.match(md, /## Schema/);
  assert.match(md, /## FAQ/);
  assert.match(md, /## Media/);

  assert.match(md, new RegExp(`Errors: ${result.summary.errors}`));
  assert.match(md, /TITLE_MISSING/);
});

test('report: writeReports grava JSON e Markdown em disco corretamente', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'seo-auditor-test-'));
  const a = makePage();
  const result = auditSite({ posts: [a] });

  const jsonPath = path.join(dir, 'seo-audit.json');
  const mdPath = path.join(dir, 'seo-audit.md');

  const { jsonBytes, mdBytes } = writeReports({ jsonPath, mdPath, auditResult: result });

  assert.ok(jsonBytes > 0);
  assert.ok(mdBytes > 0);

  const savedJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  assert.equal(savedJson.site.total_pages, 1);

  const savedMd = fs.readFileSync(mdPath, 'utf8');
  assert.match(savedMd, /# SEO Audit/);

  fs.rmSync(dir, { recursive: true, force: true });
});
