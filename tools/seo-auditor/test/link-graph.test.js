'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { normalizeInternalPath, buildLinkGraph } = require('../src/link-graph');
const { makePage } = require('./support/helpers');

test('normalizeInternalPath: converte URL absoluta para path com barra final', () => {
  const r = normalizeInternalPath('https://smartpetgadgets.com.br/comedouro-cachorro/');
  assert.equal(r.path, '/comedouro-cachorro/');
  assert.equal(r.looksLikeFile, false);
});

test('normalizeInternalPath: href relativo root já com barra é preservado', () => {
  const r = normalizeInternalPath('/sobre/');
  assert.equal(r.path, '/sobre/');
});

test('normalizeInternalPath: href sem barra final ganha barra final quando não parece arquivo', () => {
  const r = normalizeInternalPath('/sobre');
  assert.equal(r.path, '/sobre/');
});

test('normalizeInternalPath: href apontando para arquivo (extensão) não ganha barra e é marcado looksLikeFile', () => {
  const r = normalizeInternalPath('/relatorio.pdf');
  assert.equal(r.path, '/relatorio.pdf');
  assert.equal(r.looksLikeFile, true);
});

test('normalizeInternalPath: href vazio retorna null', () => {
  assert.equal(normalizeInternalPath(''), null);
  assert.equal(normalizeInternalPath(null), null);
});

test('buildLinkGraph: calcula inboundCount corretamente a partir dos links de outras páginas', () => {
  const home = makePage({ slug: null, url_path: '/', internal_links: [{ href: '/a/', anchor_text: 'a', type: 'relative' }] });
  const a = makePage({ slug: 'a', url_path: '/a/', internal_links: [] });
  const b = makePage({ slug: 'b', url_path: '/b/', internal_links: [] }); // sem inbound nenhum

  const graph = buildLinkGraph([home, a, b]);
  assert.equal(graph.inboundCount.get('/a/'), 1);
  assert.equal(graph.inboundCount.get('/b/'), 0);
});

test('buildLinkGraph: link para página inexistente vira brokenLinksBySource', () => {
  const a = makePage({ slug: 'a', url_path: '/a/', internal_links: [{ href: 'https://smartpetgadgets.com.br/nao-existe/', anchor_text: 'x', type: 'absolute' }] });
  const graph = buildLinkGraph([a]);
  const broken = graph.brokenLinksBySource.get('/a/');
  assert.equal(broken.length, 1);
  assert.equal(broken[0].resolved_path, '/nao-existe/');
});

test('buildLinkGraph: self-link não conta como inbound', () => {
  const a = makePage({ slug: 'a', url_path: '/a/', internal_links: [{ href: '/a/', anchor_text: 'self', type: 'relative' }] });
  const graph = buildLinkGraph([a]);
  assert.equal(graph.inboundCount.get('/a/'), 0);
});
