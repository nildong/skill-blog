'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { analyzeArticle, inferAudience } = require('../src/analyze-article');

function makeTmpRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sce-test-'));
  const slugDir = path.join(root, 'artigo-teste');
  fs.mkdirSync(slugDir, { recursive: true });
  fs.writeFileSync(
    path.join(slugDir, 'index.html'),
    '<html><body><h1>Título</h1><p>Conteúdo real do artigo de teste para verificar extração de texto.</p></body></html>',
    'utf8'
  );
  return root;
}

test('inferAudience nunca inventa espécie não mencionada', () => {
  assert.equal(inferAudience('Guia de Comedouro', 'guia-comedouro'), 'não determinado (título não especifica espécie)');
  assert.equal(inferAudience('Comedouro para Gato', 'comedouro-gato'), 'tutores de gatos');
  assert.equal(inferAudience('Coleira para Cachorro', 'coleira-cachorro'), 'tutores de cães');
});

test('analyzeArticle não gera nenhuma peça de conteúdo social (content fica vazio nesta fase)', () => {
  const root = makeTmpRoot();
  const post = {
    path: 'artigo-teste/index.html',
    slug: 'artigo-teste',
    url_path: '/artigo-teste/',
    title: 'Comedouro para Gato: Guia',
    meta_description: 'desc',
    content: { word_count: 800 },
    images: [{ src: '/img/foto.jpg', alt: 'foto', alt_missing: false }],
    faq: { question_count: 2 },
    internal_links: [{ href: 'https://smartpetgadgets.com.br/outro-artigo/' }],
  };

  const analysis = analyzeArticle(post, { root, contentStrategy: null, affiliateProducts: null });

  assert.deepEqual(analysis.content.reels, []);
  assert.deepEqual(analysis.content.posts, []);
  assert.deepEqual(analysis.content.carousel, []);
  assert.deepEqual(analysis.content.stories, []);
  assert.deepEqual(analysis.content.engagement, []);
  assert.equal(analysis.status, 'dry_run_only');

  fs.rmSync(root, { recursive: true, force: true });
});

test('analyzeArticle registra rastreabilidade completa (source_slug, source_path, generated_at)', () => {
  const root = makeTmpRoot();
  const post = {
    path: 'artigo-teste/index.html',
    slug: 'artigo-teste',
    url_path: '/artigo-teste/',
    title: 'Título',
    content: { word_count: 500 },
    images: [],
  };
  const analysis = analyzeArticle(post, { root, contentStrategy: null, affiliateProducts: null });
  assert.equal(analysis.source.source_type, 'blog_article');
  assert.equal(analysis.source.source_slug, 'artigo-teste');
  assert.equal(analysis.source.source_path, 'artigo-teste/index.html');
  assert.ok(analysis.source.generated_at);

  fs.rmSync(root, { recursive: true, force: true });
});

test('analyzeArticle sinaliza problema quando não há imagem própria (sem inventar)', () => {
  const root = makeTmpRoot();
  const post = {
    path: 'artigo-teste/index.html',
    slug: 'artigo-teste',
    url_path: '/artigo-teste/',
    title: 'Título',
    content: { word_count: 500 },
    images: [{ src: '/img/logo.png' }],
  };
  const analysis = analyzeArticle(post, { root, contentStrategy: null, affiliateProducts: null });
  assert.equal(analysis.signals.own_images.length, 0);
  assert.ok(analysis.problems.some((p) => p.includes('Nenhuma imagem própria')));

  fs.rmSync(root, { recursive: true, force: true });
});

test('analyzeArticle não casa produto de cluster=null com artigo de cluster=null (regressão)', () => {
  const root = makeTmpRoot();
  const post = {
    path: 'artigo-teste/index.html',
    slug: 'artigo-teste',
    url_path: '/artigo-teste/',
    title: 'Título',
    content: { word_count: 500 },
    images: [],
  };
  const contentStrategy = { pages: [{ url: '/artigo-teste/', cluster: null, cluster_confidence: 'unknown', role: 'REVIEW' }] };
  const affiliateProducts = { products: [{ id: 'Z', name: 'Produto não classificado', cluster: null, active: true }] };
  const analysis = analyzeArticle(post, { root, contentStrategy, affiliateProducts });
  assert.deepEqual(analysis.signals.affiliate_products, []);

  fs.rmSync(root, { recursive: true, force: true });
});

test('analyzeArticle não trava quando affiliateProducts é null (produtos ficam vazios, não é erro)', () => {
  const root = makeTmpRoot();
  const post = {
    path: 'artigo-teste/index.html',
    slug: 'artigo-teste',
    url_path: '/artigo-teste/',
    title: 'Título',
    content: { word_count: 500 },
    images: [],
  };
  const analysis = analyzeArticle(post, { root, contentStrategy: null, affiliateProducts: null });
  assert.deepEqual(analysis.signals.affiliate_products, []);

  fs.rmSync(root, { recursive: true, force: true });
});
