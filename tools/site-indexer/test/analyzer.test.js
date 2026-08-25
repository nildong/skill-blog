'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const { parseFile } = require('../src/parser');
const { analyzePost, deriveIdentity, findStructuralWarnings } = require('../src/analyzer');

const fx = (name) => path.join(__dirname, 'fixtures', name);

test('analyzer: deriveIdentity calcula slug/url para post normal', () => {
  const id = deriveIdentity('comedouro-cachorro/index.html');
  assert.equal(id.slug, 'comedouro-cachorro');
  assert.equal(id.url_path, '/comedouro-cachorro/');
  assert.equal(id.page_type, 'post');
});

test('analyzer: deriveIdentity trata a raiz (home) corretamente', () => {
  const id = deriveIdentity('index.html');
  assert.equal(id.slug, null);
  assert.equal(id.url_path, '/');
  assert.equal(id.page_type, 'home');
});

test('analyzer: deriveIdentity classifica páginas institucionais e de autor', () => {
  assert.equal(deriveIdentity('sobre/index.html').page_type, 'institutional');
  assert.equal(deriveIdentity('autores/nildo-alves/index.html').page_type, 'author');
});

test('analyzer: detecta múltiplos H1 como warning estrutural', () => {
  const p = parseFile(fx('multiple-h1.html'));
  const warnings = findStructuralWarnings(p.headings);
  assert.ok(warnings.includes('multiple_h1'));
  assert.ok(warnings.includes('empty_heading'));
});

test('analyzer: detecta ausência de H1 como warning estrutural', () => {
  const p = parseFile(fx('no-h1.html'));
  const warnings = findStructuralWarnings(p.headings);
  assert.ok(warnings.includes('no_h1'));
});

test('analyzer: post sem problemas estruturais não gera warnings', () => {
  const p = parseFile(fx('simple.html'));
  const warnings = findStructuralWarnings(p.headings);
  assert.deepEqual(warnings, []);
});

test('analyzer: analyzePost monta registro completo consistente com o parser', () => {
  const p = parseFile(fx('simple.html'));
  const post = analyzePost('comedouro-automatico-para-pet/index.html', p);
  assert.equal(post.slug, 'comedouro-automatico-para-pet');
  assert.equal(post.title, p.metadata.title);
  assert.equal(post.internal_link_count, p.links.internal_count);
  assert.equal(post.image_count, p.images.count);
  assert.equal(post.faq.detected, false);
});
