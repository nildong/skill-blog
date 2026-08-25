'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { analyzeInternalLinking, MAX_SUGGESTIONS_PER_PAGE } = require('../src/analyzer');
const { makePage } = require('./support/helpers');

function seoAuditWith(orphanUrlPaths) {
  return {
    pages: orphanUrlPaths.map((url) => ({
      url,
      issues: [{ id: 'ORPHAN_PAGE' }],
    })),
  };
}

test('analyzer: nunca sugere self-link', () => {
  const a = makePage({ path: 'a/index.html', slug: 'a', url_path: '/a/', title: 'Coleira GPS Cachorro', internal_links: [] });
  const bodyTextByPath = new Map([['a/index.html', 'coleira gps cachorro rastreamento bateria autonomia']]);

  const { suggestions } = analyzeInternalLinking([a], bodyTextByPath, null);
  assert.equal(suggestions.length, 0);
});

test('analyzer: não sugere link para página que já tem link existente (A já linka para B)', () => {
  const a = makePage({
    path: 'a/index.html',
    slug: 'a',
    url_path: '/a/',
    title: 'Coleira GPS para Cachorro',
    internal_links: [{ href: 'https://smartpetgadgets.com.br/b/', anchor_text: 'x', type: 'absolute' }],
    internal_link_count: 1,
  });
  const b = makePage({ path: 'b/index.html', slug: 'b', url_path: '/b/', title: 'Coleira GPS para Cachorro Pequeno' });

  const bodyTextByPath = new Map([
    ['a/index.html', 'coleira gps cachorro rastreamento bateria autonomia bluetooth'],
    ['b/index.html', 'coleira gps cachorro pequeno rastreamento bateria autonomia'],
  ]);

  const { suggestions } = analyzeInternalLinking([a, b], bodyTextByPath, null);
  assert.ok(!suggestions.some((s) => s.source === '/a/' && s.target === '/b/'));
});

test('analyzer: sugere link quando páginas são semelhantes e não há link existente', () => {
  const a = makePage({ path: 'a/index.html', slug: 'a', url_path: '/a/', title: 'Coleira GPS para Cachorro Pequeno' });
  const b = makePage({ path: 'b/index.html', slug: 'b', url_path: '/b/', title: 'Coleira GPS Cachorro Pequeno Porte' });

  const bodyTextByPath = new Map([
    ['a/index.html', 'coleira gps cachorro pequeno rastreamento bateria autonomia bluetooth sinal'],
    ['b/index.html', 'coleira gps cachorro pequeno porte rastreamento bateria autonomia bluetooth'],
  ]);

  const { suggestions } = analyzeInternalLinking([a, b], bodyTextByPath, null);
  assert.ok(suggestions.some((s) => s.source === '/a/' && s.target === '/b/'));
});

test('analyzer: página órfã como destino recebe target_is_orphan=true e prioridade máxima (primeira na lista)', () => {
  const a = makePage({ path: 'a/index.html', slug: 'a', url_path: '/a/', title: 'Coleira GPS para Cachorro' });
  const orphan = makePage({ path: 'orphan/index.html', slug: 'orphan', url_path: '/orphan/', title: 'Coleira GPS Cachorro Perdido' });
  const other = makePage({ path: 'other/index.html', slug: 'other', url_path: '/other/', title: 'Coleira GPS Cachorro Fujão' });

  const bodyTextByPath = new Map([
    ['a/index.html', 'coleira gps cachorro rastreamento bateria autonomia sinal bluetooth'],
    ['orphan/index.html', 'coleira gps cachorro perdido rastreamento bateria autonomia sinal'],
    ['other/index.html', 'coleira gps cachorro fujao rastreamento bateria autonomia sinal'],
  ]);

  const seoAudit = seoAuditWith(['/orphan/']);
  const { suggestions } = analyzeInternalLinking([a, orphan, other], bodyTextByPath, seoAudit);

  const fromA = suggestions.filter((s) => s.source === '/a/');
  assert.ok(fromA.length >= 2);
  assert.equal(fromA[0].target, '/orphan/');
  assert.equal(fromA[0].target_is_orphan, true);
});

test('analyzer: nunca sugere mais de MAX_SUGGESTIONS_PER_PAGE por página de origem', () => {
  const source = makePage({ path: 'src/index.html', slug: 'src', url_path: '/src/', title: 'Coleira GPS para Cachorro' });
  const targets = [];
  const bodyTextByPath = new Map([['src/index.html', 'coleira gps cachorro rastreamento bateria autonomia sinal bluetooth chip localizacao']]);

  for (let i = 0; i < 10; i++) {
    const slug = `alvo-${i}`;
    targets.push(makePage({ path: `${slug}/index.html`, slug, url_path: `/${slug}/`, title: `Coleira GPS Cachorro Variação ${i}` }));
    bodyTextByPath.set(`${slug}/index.html`, `coleira gps cachorro rastreamento bateria autonomia sinal bluetooth chip localizacao variacao ${i}`);
  }

  const { suggestions } = analyzeInternalLinking([source, ...targets], bodyTextByPath, null);
  const fromSource = suggestions.filter((s) => s.source === '/src/');
  assert.ok(fromSource.length <= MAX_SUGGESTIONS_PER_PAGE, `esperado <= ${MAX_SUGGESTIONS_PER_PAGE}, obtido ${fromSource.length}`);
});

test('analyzer: páginas não-post (institucional/home) não geram sugestões como origem', () => {
  const home = makePage({ path: 'index.html', slug: null, url_path: '/', page_type: 'home', title: 'Home Smart Pet Gadgets' });
  const post = makePage({ path: 'a/index.html', slug: 'a', url_path: '/a/', title: 'Coleira GPS para Cachorro' });

  const bodyTextByPath = new Map([
    ['index.html', 'smart pet gadgets cuidados produtos caes gatos'],
    ['a/index.html', 'coleira gps cachorro rastreamento bateria'],
  ]);

  const { suggestions } = analyzeInternalLinking([home, post], bodyTextByPath, null);
  assert.ok(!suggestions.some((s) => s.source === '/'));
});
