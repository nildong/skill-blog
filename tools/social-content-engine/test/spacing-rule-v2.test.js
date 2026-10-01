'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { buildSpacingRecommendations, recommendedGapDays } = require('../src/spacing-rule-v2');

test('recommendedGapDays: overlap alto (>=0.70) recomenda 21 dias', () => {
  assert.equal(recommendedGapDays(0.72), 21);
});

test('recommendedGapDays: overlap médio (>=0.50) recomenda 14 dias', () => {
  assert.equal(recommendedGapDays(0.62), 14);
});

test('recommendedGapDays: overlap baixo não recomenda espaçamento', () => {
  assert.equal(recommendedGapDays(0.3), 0);
});

test('buildSpacingRecommendations: deduplica pares (A->B e B->A viram uma recomendação só)', () => {
  const warnings = new Map([
    ['a', [{ with: 'b', overlap: 0.72, same_cluster: false }]],
    ['b', [{ with: 'a', overlap: 0.72, same_cluster: false }]],
  ]);
  const recs = buildSpacingRecommendations(warnings);
  assert.equal(recs.length, 1);
  assert.equal(recs[0].overlap, 0.72);
});

test('buildSpacingRecommendations: nunca bloqueia, só recomenda (note explica isso)', () => {
  const warnings = new Map([['a', [{ with: 'b', overlap: 0.72, same_cluster: true }]]]);
  const recs = buildSpacingRecommendations(warnings);
  assert.match(recs[0].note, /Não bloqueia geração/);
});

test('buildSpacingRecommendations: ordena por overlap decrescente', () => {
  const warnings = new Map([
    ['a', [{ with: 'b', overlap: 0.55, same_cluster: false }]],
    ['c', [{ with: 'd', overlap: 0.85, same_cluster: true }]],
  ]);
  const recs = buildSpacingRecommendations(warnings);
  assert.equal(recs[0].overlap, 0.85);
  assert.equal(recs[1].overlap, 0.55);
});
