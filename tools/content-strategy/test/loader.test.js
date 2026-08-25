'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { loadDataSources } = require('../src/loader');

function makeRoot(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'content-strategy-test-'));
  fs.mkdirSync(path.join(root, '.data'), { recursive: true });
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(root, '.data', name), JSON.stringify(content));
  }
  return root;
}

test('loader: lança erro se site-index.json (obrigatório) estiver ausente', () => {
  const root = makeRoot({});
  assert.throws(() => loadDataSources(root));
});

test('loader: carrega todas as 4 fontes quando presentes', () => {
  const root = makeRoot({
    'site-index.json': { posts: [] },
    'seo-audit.json': { pages: [] },
    'internal-linking.json': { suggestions: [] },
    'cannibalization.json': { pairs: [] },
  });
  const result = loadDataSources(root);
  assert.ok(result.siteIndex);
  assert.ok(result.seoAudit);
  assert.ok(result.internalLinking);
  assert.ok(result.cannibalization);
  assert.deepEqual(result.missing, []);
});

test('loader: roda mesmo sem as fontes opcionais, registrando em missing', () => {
  const root = makeRoot({ 'site-index.json': { posts: [] } });
  const result = loadDataSources(root);
  assert.equal(result.seoAudit, null);
  assert.equal(result.internalLinking, null);
  assert.equal(result.cannibalization, null);
  assert.deepEqual(result.missing.sort(), ['cannibalization', 'internalLinking', 'seoAudit'].sort());
});
