'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { buildProposal, writeProposal } = require('../src/propose');
const { makeRoot } = require('./support/helpers');

test('buildProposal: exige theme', () => {
  assert.throws(() => buildProposal({}), /theme.*obrigatório/);
  assert.throws(() => buildProposal({ theme: '   ' }), /theme.*obrigatório/);
});

test('buildProposal: deriva slug do theme quando --slug não é informado', () => {
  const p = buildProposal({ theme: 'Comedouro Automático para Dois Gatos' });
  assert.equal(p.slug, 'comedouro-automatico-para-dois-gatos');
  assert.equal(p.keyword_candidate, 'Comedouro Automático para Dois Gatos');
  assert.equal(p.type_candidate, null);
  assert.equal(p.cluster_candidate, null);
  assert.equal(p.status, 'proposed');
});

test('buildProposal: usa keyword separada do theme quando informada', () => {
  const p = buildProposal({ theme: 'Comedouro para dois gatos', keyword: 'comedouro automático 2 gatos' });
  assert.equal(p.keyword_candidate, 'comedouro automático 2 gatos');
});

test('buildProposal: aceita --slug explícito, sobrepondo o derivado do theme', () => {
  const p = buildProposal({ theme: 'Comedouro para dois gatos', slug: 'comedouro-2-gatos' });
  assert.equal(p.slug, 'comedouro-2-gatos');
});

test('buildProposal: valida type contra os FORMATS conhecidos', () => {
  assert.throws(() => buildProposal({ theme: 'X', type: 'nao-existe' }), /type.*inválido/);
  const p = buildProposal({ theme: 'Comedouro X', type: 'review' });
  assert.equal(p.type_candidate, 'review');
});

test('buildProposal: nunca inventa cluster_candidate quando não informado', () => {
  const p = buildProposal({ theme: 'Algo novo' });
  assert.equal(p.cluster_candidate, null);
});

test('writeProposal: grava em .data/pipeline/<slug>/article-proposal.json', () => {
  const root = makeRoot([]);
  const proposal = buildProposal({ theme: 'Comedouro para dois gatos' });
  const { filePath } = writeProposal(root, proposal);
  assert.equal(filePath, path.join(root, '.data', 'pipeline', proposal.slug, 'article-proposal.json'));
  const saved = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  assert.equal(saved.slug, proposal.slug);
});

test('writeProposal: recusa sobrescrever sem --force', () => {
  const root = makeRoot([]);
  const proposal = buildProposal({ theme: 'Comedouro para dois gatos' });
  writeProposal(root, proposal);
  assert.throws(() => writeProposal(root, proposal), /já existe uma proposta/);
});

test('writeProposal: sobrescreve com force: true', () => {
  const root = makeRoot([]);
  const proposal = buildProposal({ theme: 'Comedouro para dois gatos' });
  writeProposal(root, proposal);
  assert.doesNotThrow(() => writeProposal(root, proposal, { force: true }));
});
