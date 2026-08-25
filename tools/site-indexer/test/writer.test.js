'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { writeIndexAtomic } = require('../src/writer');

test('writer: grava JSON válido e legível no caminho de saída', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'site-indexer-test-'));
  const outPath = path.join(dir, 'sub', 'site-index.json');

  writeIndexAtomic(outPath, { version: 1, posts: [] });

  const content = fs.readFileSync(outPath, 'utf8');
  const parsed = JSON.parse(content);
  assert.equal(parsed.version, 1);
  assert.deepEqual(parsed.posts, []);

  fs.rmSync(dir, { recursive: true, force: true });
});

test('writer: não deixa arquivo temporário para trás após escrita bem-sucedida', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'site-indexer-test-'));
  const outPath = path.join(dir, 'site-index.json');

  writeIndexAtomic(outPath, { a: 1 });

  const entries = fs.readdirSync(dir);
  assert.deepEqual(entries, ['site-index.json']);

  fs.rmSync(dir, { recursive: true, force: true });
});
