'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { suggestAnchor, alreadyLinksTo, buildReason } = require('../src/suggestions');
const { normalizeInternalPath } = require('../../seo-auditor/src/link-graph');
const { makePage } = require('./support/helpers');

test('suggestAnchor: usa o title quando é curto (<=8 palavras)', () => {
  const target = makePage({ title: 'Coleira GPS para Cachorro Pequeno Porte' });
  assert.equal(suggestAnchor(target), 'Coleira GPS para Cachorro Pequeno Porte');
});

test('suggestAnchor: usa um H2 quando o title é longo demais', () => {
  const target = makePage({
    title: 'Um Título Extremamente Longo Que Ultrapassa o Limite de Palavras Razoável para Anchor Text',
    headings: [
      { tag: 'h1', text: 'Título', empty: false },
      { tag: 'h2', text: 'Como funciona a coleira GPS', empty: false },
    ],
  });
  assert.equal(suggestAnchor(target), 'Como funciona a coleira GPS');
});

test('suggestAnchor: nunca retorna anchor genérico', () => {
  const target = makePage({ title: 'Clique Aqui', slug: 'pagina-x' });
  const anchor = suggestAnchor(target);
  assert.doesNotMatch(anchor, /^(clique aqui|saiba mais|veja aqui|confira)$/i);
});

test('alreadyLinksTo: detecta link existente (absoluto) para o path de destino', () => {
  const source = makePage({
    internal_links: [{ href: 'https://smartpetgadgets.com.br/comedouro-cachorro/', anchor_text: 'x', type: 'absolute' }],
  });
  assert.equal(alreadyLinksTo(source, '/comedouro-cachorro/', normalizeInternalPath), true);
});

test('alreadyLinksTo: retorna false quando não há link existente', () => {
  const source = makePage({ internal_links: [] });
  assert.equal(alreadyLinksTo(source, '/comedouro-cachorro/', normalizeInternalPath), false);
});

test('buildReason: menciona órfã como prioridade quando target é órfão', () => {
  const reason = buildReason({ score: 80, sameCluster: false, isOrphanTarget: true });
  assert.match(reason, /órfã/i);
});
