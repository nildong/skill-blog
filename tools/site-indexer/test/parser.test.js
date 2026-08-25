'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const { parseFile } = require('../src/parser');

const FIXTURES = path.join(__dirname, 'fixtures');
const fx = (name) => path.join(FIXTURES, name);

test('parser: extrai title, meta description e canonical de um post simples', () => {
  const p = parseFile(fx('simple.html'));
  assert.equal(p.metadata.title, 'Comedouro Automático: Guia Completo');
  assert.equal(p.metadata.meta_description, 'Guia completo sobre comedouros automáticos para pets.');
  assert.equal(p.metadata.canonical, 'https://smartpetgadgets.com.br/comedouro-automatico-para-pet/');
  assert.equal(p.metadata.robots, 'index, follow');
  assert.equal(p.metadata.language, 'pt-BR');
});

test('parser: detecta H1 único e H2 no post simples', () => {
  const p = parseFile(fx('simple.html'));
  const h1 = p.headings.filter((h) => h.tag === 'h1');
  const h2 = p.headings.filter((h) => h.tag === 'h2');
  assert.equal(h1.length, 1);
  assert.equal(h2.length, 1);
  assert.equal(h1[0].text, 'Comedouro Automático para Pet');
});

test('parser: classifica links internos e externos corretamente', () => {
  // fixture simple.html tem 3 links internos (nav "/", corpo
  // "/comedouro-cachorro/", footer "/sobre/") e 1 link externo (mercadolivre).
  const p = parseFile(fx('simple.html'));
  assert.equal(p.links.internal_count, 3);
  assert.equal(p.links.external_count, 1);
  assert.ok(p.links.internal.some((l) => l.href === '/comedouro-cachorro/'));
  assert.equal(p.links.external[0].domain, 'mercadolivre.com.br');
});

test('parser: extrai imagens com alt/width/height/format', () => {
  const p = parseFile(fx('simple.html'));
  assert.equal(p.images.count, 1);
  assert.equal(p.images.items[0].alt, 'Comedouro automático em uso');
  assert.equal(p.images.items[0].format, 'jpg');
  assert.equal(p.images.missing_alt_count, 0);
});

test('parser: detecta imagens sem alt e com alt vazio separadamente', () => {
  const p = parseFile(fx('no-alt.html'));
  assert.equal(p.images.count, 3);
  assert.equal(p.images.missing_alt_count, 1);
  assert.equal(p.images.empty_alt_count, 1);
});

test('parser: detecta vídeos YouTube, Vimeo e HTML5', () => {
  const p = parseFile(fx('video.html'));
  assert.equal(p.videos.count, 3);
  const types = p.videos.items.map((v) => v.type).sort();
  assert.deepEqual(types, ['html5', 'vimeo', 'youtube']);
  const yt = p.videos.items.find((v) => v.type === 'youtube');
  assert.equal(yt.id, 'dQw4w9WgXcQ');
  const vimeo = p.videos.items.find((v) => v.type === 'vimeo');
  assert.equal(vimeo.id, '76979871');
});

test('parser: extrai múltiplos blocos JSON-LD e seus @type', () => {
  const p = parseFile(fx('schema.html'));
  assert.equal(p.schemas.count, 3);
  assert.equal(p.schemas.has_jsonld, true);
  assert.deepEqual(p.schemas.all_types.sort(), ['BlogPosting', 'BreadcrumbList', 'Organization'].sort());
  assert.equal(p.schemas.invalid_count, 0);
});

test('parser: detecta FAQPage estruturado com contagem correta de perguntas', () => {
  const p = parseFile(fx('faq.html'));
  assert.equal(p.faq.detected, true);
  assert.equal(p.faq.schema_detected, true);
  assert.equal(p.faq.question_count, 3);
});

test('parser: registra JSON-LD inválido sem lançar exceção', () => {
  const p = parseFile(fx('invalid-jsonld.html'));
  assert.equal(p.schemas.count, 1);
  assert.equal(p.schemas.invalid_count, 1);
  assert.equal(p.schemas.items[0].valid, false);
});

test('parser: contagem de palavras é maior que zero em post com conteúdo real', () => {
  const p = parseFile(fx('simple.html'));
  assert.ok(p.content.word_count > 10, `esperado word_count > 10, obtido ${p.content.word_count}`);
  assert.equal(p.content.paragraph_count, 3);
});

test('parser: lida corretamente com UTF-8 (acentos e emoji)', () => {
  const p = parseFile(fx('utf8.html'));
  assert.match(p.metadata.title, /Acentuação/);
  assert.match(p.headings[0].text, /Coração/);
  assert.ok(p.content.word_count > 0);
});

test('parser: arquivo HTML vazio não lança exceção e retorna estrutura vazia', () => {
  const p = parseFile(fx('empty.html'));
  assert.equal(p.metadata.title, null);
  assert.equal(p.headings.length, 0);
  assert.equal(p.content.word_count, 0);
});

test('parser: HTML malformado é tolerado (parser não lança exceção)', () => {
  assert.doesNotThrow(() => parseFile(fx('malformed.html')));
  const p = parseFile(fx('malformed.html'));
  assert.equal(p.headings.filter((h) => h.tag === 'h1').length, 1);
});

test('parser: arquivo inexistente lança erro (tratado pelo chamador)', () => {
  assert.throws(() => parseFile(fx('nao-existe.html')));
});
