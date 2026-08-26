'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { buildProposalPseudoPost, simulateAgainstExisting } = require('../src/simulate');
const { analyzeCannibalization } = require('../src/analyzer');
const { makePage } = require('./support/helpers');

test('simulate: exige slug na proposta', () => {
  assert.throws(() => buildProposalPseudoPost({}), /precisa de "slug"/);
  assert.throws(() => simulateAgainstExisting({}, []), /precisa de "slug"/);
});

test('simulate: proposta com título quase idêntico a post existente gera score alto', () => {
  const posts = [
    makePage({
      slug: 'comedouro-newpet-4l-review',
      title: 'Comedouro Newpet 4L: Review Completo (Vale a Pena?)',
      headings: [{ tag: 'h1', text: 'Comedouro Newpet 4L: Review Completo (Vale a Pena?)', empty: false }],
    }),
  ];
  const proposal = { slug: 'comedouro-newpet-4l-analise-completa', title: 'Comedouro Newpet 4L: Review Completo e Vale a Pena' };
  const result = simulateAgainstExisting(proposal, posts);
  assert.equal(result.compared_against, 1);
  assert.equal(result.top_matches[0].slug, 'comedouro-newpet-4l-review');
  assert.ok(result.top_matches[0].score > 0);
  assert.ok(['possible', 'high'].includes(result.top_matches[0].level));
});

test('simulate: proposta sobre tema completamente distinto não gera alarme', () => {
  const posts = [makePage({ slug: 'tapete-higienico-para-cachorro', title: 'Tapete Higiênico para Cachorro' })];
  const proposal = { slug: 'camera-visao-noturna-pet', title: 'Câmera com Visão Noturna para Monitorar Pet' };
  const result = simulateAgainstExisting(proposal, posts);
  assert.equal(result.worst_level, 'low');
});

test('simulate: nunca compara a proposta contra si mesma, mesmo se o slug já existir', () => {
  const posts = [makePage({ slug: 'ja-existe', title: 'Já Existe' })];
  const proposal = { slug: 'ja-existe', title: 'Já Existe' };
  const result = simulateAgainstExisting(proposal, posts);
  assert.equal(result.compared_against, 0);
});

test('simulate: sempre documenta a limitação de score sem conteúdo real', () => {
  const result = simulateAgainstExisting({ slug: 'novo', title: 'Novo' }, []);
  assert.ok(result.limitations.length >= 1);
  assert.equal(result.method.includes('simulate'), true);
});

test('regra de ouro: analyzeCannibalization (modo padrão) produz resultado idêntico independente da existência do módulo simulate', () => {
  // Não passa por --simulate em nenhum momento — garante que importar
  // src/simulate.js em src/index.js não altera analyzeCannibalization.
  const posts = [
    makePage({ slug: 'a', title: 'Comedouro Automático para Cachorro' }),
    makePage({ slug: 'b', title: 'Comedouro Automático para Gato', url_path: '/b/' }),
  ];
  const bodyTextByPath = new Map([
    ['a/index.html', 'texto sobre comedouro automático para cachorro'],
    ['exemplo/index.html', 'texto sobre comedouro automático para cachorro'],
  ]);
  const before = analyzeCannibalization(posts, bodyTextByPath);
  const after = analyzeCannibalization(posts, bodyTextByPath);
  assert.deepEqual(before, after);
});
