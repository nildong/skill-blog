'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { writeArticlePackage, writeIndex } = require('../src/writer');
const { hashAllPostHtml, hashFile } = require('../src/validate');

function makeAnalysis(slug) {
  return {
    article: { slug, title: `Título ${slug}`, url: `https://smartpetgadgets.com.br/${slug}/`, cluster: null, cluster_source: 'none', cluster_confidence: 'unknown' },
    source: { source_type: 'blog_article', source_slug: slug, source_path: `${slug}/index.html`, generated_at: new Date().toISOString() },
    signals: { own_images: [], faq_question_count: 0, related_internal_links: [], affiliate_products: [] },
    format_potential: {},
    content: { reels: [], posts: [], carousel: [], stories: [], engagement: [] },
    problems: [],
    status: 'dry_run_only',
  };
}

test('writeArticlePackage grava JSON válido em .data/social-content/{slug}.json', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sce-writer-'));
  const analysis = makeAnalysis('artigo-x');
  const { outPath, pkg } = writeArticlePackage({ root, articleAnalysis: analysis, similarityWarnings: new Map() });

  assert.ok(fs.existsSync(outPath));
  const onDisk = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  assert.equal(onDisk.article.slug, 'artigo-x');
  assert.equal(pkg.similarity_warning, false);

  fs.rmSync(root, { recursive: true, force: true });
});

test('writeArticlePackage aplica similarity_warning quando o slug está no mapa de avisos', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sce-writer-'));
  const analysis = makeAnalysis('artigo-y');
  const warnings = new Map([['artigo-y', [{ with: 'artigo-z', overlap: 0.6, same_cluster: true }]]]);
  const { pkg } = writeArticlePackage({ root, articleAnalysis: analysis, similarityWarnings: warnings });

  assert.equal(pkg.similarity_warning, true);
  assert.equal(pkg.similarity_details.length, 1);

  fs.rmSync(root, { recursive: true, force: true });
});

test('writeIndex agrega os pacotes em .data/social-content-index.json', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sce-writer-'));
  const analysis1 = makeAnalysis('a');
  const analysis2 = makeAnalysis('b');
  const e1 = writeArticlePackage({ root, articleAnalysis: analysis1, similarityWarnings: new Map() });
  const e2 = writeArticlePackage({ root, articleAnalysis: analysis2, similarityWarnings: new Map() });

  const { outPath } = writeIndex({ root, entries: [e1, e2], pilotMeta: { requested_size: 10, selected_count: 2 } });
  const index = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  assert.equal(index.entries.length, 2);
  assert.equal(index.mode, 'dry_run_pilot');
  index.entries.forEach((entry) => assert.equal(entry.piece_count, 0));

  fs.rmSync(root, { recursive: true, force: true });
});

test('hashAllPostHtml detecta quando um HTML não muda entre duas leituras (garantia de não-alteração)', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sce-hash-'));
  const dir = path.join(root, 'artigo');
  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, 'index.html'), '<html>conteúdo original</html>', 'utf8');

  const siteIndex = { posts: [{ path: 'artigo/index.html' }] };
  const before = hashAllPostHtml(root, siteIndex);
  const after = hashAllPostHtml(root, siteIndex);
  assert.equal(before.get('artigo/index.html'), after.get('artigo/index.html'));

  fs.rmSync(root, { recursive: true, force: true });
});

test('hashFile detecta alteração de conteúdo (sensibilidade da checagem de integridade)', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sce-hash2-'));
  const filePath = path.join(root, 'x.html');
  fs.writeFileSync(filePath, 'A', 'utf8');
  const h1 = hashFile(filePath);
  fs.writeFileSync(filePath, 'B', 'utf8');
  const h2 = hashFile(filePath);
  assert.notEqual(h1, h2);

  fs.rmSync(root, { recursive: true, force: true });
});
