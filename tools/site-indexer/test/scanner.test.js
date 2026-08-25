'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const { findHtmlFiles } = require('../src/scanner');

const MINI_SITE = path.join(__dirname, 'fixtures', 'mini-site');

test('scanner: encontra index.html na raiz e em subpastas de post', () => {
  const files = findHtmlFiles(MINI_SITE);
  const relPaths = files.map((f) => f.relPath).sort();
  assert.ok(relPaths.includes('index.html'));
  assert.ok(relPaths.includes('post-a/index.html'));
  assert.ok(relPaths.includes('post-b/index.html'));
});

test('scanner: exclui diretórios de infraestrutura (img/) e cluster-*', () => {
  const files = findHtmlFiles(MINI_SITE);
  const relPaths = files.map((f) => f.relPath);
  assert.ok(!relPaths.some((p) => p.startsWith('img/')));
  assert.ok(!relPaths.some((p) => p.startsWith('cluster-x/')));
});

test('scanner: exclui diretórios ocultos', () => {
  const files = findHtmlFiles(MINI_SITE);
  const relPaths = files.map((f) => f.relPath);
  assert.ok(!relPaths.some((p) => p.startsWith('.hidden/')));
});

test('scanner: resultado é determinístico (mesma lista em execuções repetidas)', () => {
  const a = findHtmlFiles(MINI_SITE).map((f) => f.relPath);
  const b = findHtmlFiles(MINI_SITE).map((f) => f.relPath);
  assert.deepEqual(a, b);
});

test('scanner: total de arquivos encontrados no mini-site é exatamente 3', () => {
  const files = findHtmlFiles(MINI_SITE);
  assert.equal(files.length, 3);
});
