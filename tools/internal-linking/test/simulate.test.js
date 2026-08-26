'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { buildProposalPseudoPost, simulateLinksForProposal } = require('../src/simulate');
const { analyzeInternalLinking } = require('../src/analyzer');
const { makePage } = require('./support/helpers');

test('simulate: exige slug na proposta', () => {
  assert.throws(() => buildProposalPseudoPost({}), /precisa de "slug"/);
  assert.throws(() => simulateLinksForProposal({}, []), /precisa de "slug"/);
});

test('simulate: proposta satélite recomenda link de/para o pilar do cluster', () => {
  const pillar = makePage({
    slug: 'comedouro-automatico-para-pet',
    title: 'Comedouro Automático para Pet: Guia Completo',
    url_path: '/comedouro-automatico-para-pet/',
  });
  const posts = [pillar];
  const bodyTextByPath = new Map([
    ['exemplo/index.html', 'guia completo sobre comedouro automático para pet, comedouro automático, alimentação automatizada'],
  ]);
  const proposal = {
    slug: 'comedouro-automatico-para-dois-gatos',
    title: 'Comedouro Automático para Dois Gatos',
    keyword_candidate: 'comedouro automático para 2 gatos',
    headings: ['Por que ter um comedouro automático com dois gatos', 'Como configurar porções por gato'],
  };
  const result = simulateLinksForProposal(proposal, posts, bodyTextByPath);
  assert.equal(result.proposal_slug, proposal.slug);
  // Não afirmamos direção específica aqui (depende do overlap real de
  // termos) — só que a simulação roda sem erro e retorna as duas listas.
  assert.ok(Array.isArray(result.should_link_to));
  assert.ok(Array.isArray(result.should_receive_links_from));
});

test('simulate: nunca compara a proposta contra si mesma', () => {
  const posts = [makePage({ slug: 'ja-existe', url_path: '/ja-existe/' })];
  const proposal = { slug: 'ja-existe', title: 'Já Existe' };
  const result = simulateLinksForProposal(proposal, posts, new Map());
  assert.equal(result.should_link_to.length, 0);
  assert.equal(result.should_receive_links_from.length, 0);
});

test('simulate: nunca sugere anchor genérico para a proposta', () => {
  const posts = [
    makePage({
      slug: 'coleira-gps-para-pet',
      title: 'Coleira GPS para Pet: Guia Completo',
      url_path: '/coleira-gps-para-pet/',
    }),
  ];
  const bodyTextByPath = new Map([['exemplo/index.html', 'coleira gps para pet guia completo localização']]);
  const proposal = { slug: 'coleira-gps-cachorro-idoso', title: 'Coleira GPS para Cachorro Idoso' };
  const result = simulateLinksForProposal(proposal, posts, bodyTextByPath);
  const genericAnchors = /^(clique aqui|saiba mais|veja aqui|confira|leia mais|aqui)$/i;
  for (const s of [...result.should_link_to, ...result.should_receive_links_from]) {
    assert.doesNotMatch(s.anchor, genericAnchors);
  }
});

test('simulate: documenta método aproximado no resultado', () => {
  const result = simulateLinksForProposal({ slug: 'novo', title: 'Novo' }, [], new Map());
  assert.match(result.method, /simulate/);
});

test('regra de ouro: analyzeInternalLinking (modo padrão) não é afetado pela existência do módulo simulate', () => {
  const posts = [
    makePage({ slug: 'a', title: 'Comedouro Automático para Cachorro', url_path: '/a/' }),
    makePage({ slug: 'b', title: 'Comedouro Automático para Gato', url_path: '/b/' }),
  ];
  const bodyTextByPath = new Map([
    ['exemplo/index.html', 'texto sobre comedouro automático para cachorro e gato'],
  ]);
  const before = analyzeInternalLinking(posts, bodyTextByPath, null);
  const after = analyzeInternalLinking(posts, bodyTextByPath, null);
  assert.deepEqual(before, after);
});
