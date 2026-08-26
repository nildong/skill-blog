'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

/**
 * Cria uma raiz temporária com .data/site-index.json populado com posts
 * fake mínimos (suficientes para os campos que preflight/format-classifier
 * usam). Espelha o formato real de tools/site-indexer, sem depender dele.
 */
function makeRoot(posts = []) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'orchestrator-test-'));
  fs.mkdirSync(path.join(root, '.data'), { recursive: true });
  fs.writeFileSync(
    path.join(root, '.data', 'site-index.json'),
    JSON.stringify({ version: 1, posts })
  );
  return root;
}

function fakePost(overrides = {}) {
  return {
    path: `${overrides.slug || 'fake-post'}/index.html`,
    slug: overrides.slug || 'fake-post',
    url_path: `/${overrides.slug || 'fake-post'}/`,
    page_type: 'post',
    title: overrides.title || 'Fake Post',
    headings: overrides.headings || [{ tag: 'h1', text: overrides.title || 'Fake Post', empty: false }],
    faq: overrides.faq || null,
    internal_links: overrides.internal_links || [],
    ...overrides,
  };
}

module.exports = { makeRoot, fakePost };
