'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { analyzeCannibalization, MIN_REPORT_SCORE } = require('../src/analyzer');
const { makePage } = require('./support/helpers');

test('analyzer: cada par é analisado apenas uma vez (A<->B, não A->B e B->A)', () => {
  const a = makePage({ path: 'a/index.html', slug: 'a', url_path: '/a/', title: 'Melhor Comedouro Automático Cachorro' });
  const b = makePage({ path: 'b/index.html', slug: 'b', url_path: '/b/', title: 'Melhor Comedouro Automático Cão' });

  const bodyTextByPath = new Map([
    ['a/index.html', 'comedouro automatico cachorro racao porcao'],
    ['b/index.html', 'comedouro automatico cao racao porcao'],
  ]);

  const { pairs, pairsAnalyzed } = analyzeCannibalization([a, b], bodyTextByPath);
  assert.equal(pairsAnalyzed, 1);
  assert.ok(pairs.length <= 1);
  if (pairs.length === 1) {
    const p = pairs[0];
    const isAB = p.page_a === '/a/' && p.page_b === '/b/';
    const isBA = p.page_a === '/b/' && p.page_b === '/a/';
    assert.ok(isAB || isBA);
  }
});

test('analyzer: páginas claramente diferentes não aparecem nos pares reportados (score < threshold)', () => {
  const a = makePage({ path: 'a/index.html', slug: 'a', url_path: '/a/', title: 'Coleira GPS para Cachorro' });
  const b = makePage({ path: 'b/index.html', slug: 'b', url_path: '/b/', title: 'Política Editorial e de Afiliados' });

  const bodyTextByPath = new Map([
    ['a/index.html', 'coleira gps cachorro rastreamento bateria bluetooth'],
    ['b/index.html', 'politica editorial fontes verificacao afiliados correcoes'],
  ]);

  const { pairs } = analyzeCannibalization([a, b], bodyTextByPath);
  assert.equal(pairs.length, 0);
});

test('analyzer: páginas com título/slug/conteúdo quase idênticos entram como HIGH', () => {
  const a = makePage({ path: 'a/index.html', slug: 'melhor-coleira-gps-sem-mensalidade', url_path: '/a/', title: 'Melhor Coleira GPS Sem Mensalidade 2026' });
  const b = makePage({ path: 'b/index.html', slug: 'melhor-coleira-gps-sem-chip', url_path: '/b/', title: 'Melhor Coleira GPS Sem Chip 2026' });

  const bodyTextByPath = new Map([
    ['a/index.html', 'coleira gps sem mensalidade bluetooth rastreamento bateria melhor modelo'],
    ['b/index.html', 'coleira gps sem chip bluetooth rastreamento bateria melhor modelo'],
  ]);

  const { pairs } = analyzeCannibalization([a, b], bodyTextByPath);
  assert.equal(pairs.length, 1);
  assert.equal(pairs[0].level, 'high');
});

test('analyzer: nenhum resultado abaixo de MIN_REPORT_SCORE é incluído nos pares', () => {
  const a = makePage({ path: 'a/index.html', slug: 'a', url_path: '/a/', title: 'Coleira GPS' });
  const b = makePage({ path: 'b/index.html', slug: 'b', url_path: '/b/', title: 'Comedouro Automático' });
  const bodyTextByPath = new Map([
    ['a/index.html', 'coleira gps rastreamento'],
    ['b/index.html', 'comedouro automatico racao'],
  ]);
  const { pairs } = analyzeCannibalization([a, b], bodyTextByPath);
  for (const p of pairs) assert.ok(p.score >= MIN_REPORT_SCORE);
});

test('analyzer: recomendação nunca sugere apagar a página automaticamente', () => {
  const a = makePage({ path: 'a/index.html', slug: 'melhor-coleira-gps-sem-mensalidade', url_path: '/a/', title: 'Melhor Coleira GPS Sem Mensalidade' });
  const b = makePage({ path: 'b/index.html', slug: 'melhor-coleira-gps-sem-chip', url_path: '/b/', title: 'Melhor Coleira GPS Sem Chip' });
  const bodyTextByPath = new Map([
    ['a/index.html', 'coleira gps sem mensalidade bluetooth rastreamento bateria melhor modelo'],
    ['b/index.html', 'coleira gps sem chip bluetooth rastreamento bateria melhor modelo'],
  ]);
  const { pairs } = analyzeCannibalization([a, b], bodyTextByPath);
  for (const p of pairs) {
    // Se a recomendação mencionar apagar/deletar/consolidar, deve sempre
    // vir condicionada a revisão manual — nunca como ação automática pura.
    const mentionsDestructive = /\bapagar\b|\bdeletar\b|\bconsolidar\b/i.test(p.recommendation);
    if (mentionsDestructive) {
      assert.match(p.recommendation, /revis[aã]o manual/i);
    }
    // Nunca uma recomendação imperativa isolada tipo "Apagar a página X".
    assert.doesNotMatch(p.recommendation, /^apagar\b/i);
  }
});

test('analyzer: páginas não-post são ignoradas na análise', () => {
  const home = makePage({ path: 'index.html', slug: null, url_path: '/', page_type: 'home', title: 'Home' });
  const a = makePage({ path: 'a/index.html', slug: 'a', url_path: '/a/', title: 'Coleira GPS para Cachorro' });
  const bodyTextByPath = new Map([
    ['index.html', 'home smart pet gadgets'],
    ['a/index.html', 'coleira gps cachorro rastreamento'],
  ]);
  const { pagesAnalyzed } = analyzeCannibalization([home, a], bodyTextByPath);
  assert.equal(pagesAnalyzed, 1);
});
