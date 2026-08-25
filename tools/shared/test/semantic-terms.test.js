'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { extractTerms } = require('../terms');
const {
  weightedOverlapCoefficient,
  sharedTermsWeighted,
  termWeight,
  isGenericTerm,
  isYearTerm,
  GENERIC_TERM_WEIGHT,
  YEAR_TERM_WEIGHT,
  DEFAULT_TERM_WEIGHT,
} = require('../semantic-terms');

test('termWeight: termos editoriais genéricos têm peso reduzido', () => {
  assert.equal(termWeight('guia'), GENERIC_TERM_WEIGHT);
  assert.equal(termWeight('completo'), GENERIC_TERM_WEIGHT);
  assert.equal(termWeight('melhor'), GENERIC_TERM_WEIGHT);
  assert.equal(isGenericTerm('guia'), true);
});

test('termWeight: anos têm peso zero', () => {
  assert.equal(termWeight('2026'), YEAR_TERM_WEIGHT);
  assert.equal(termWeight('2024'), 0);
  assert.equal(isYearTerm('2026'), true);
  assert.equal(isYearTerm('coleira'), false);
});

test('termWeight: termos específicos do nicho têm peso normal (1)', () => {
  assert.equal(termWeight('coleira'), DEFAULT_TERM_WEIGHT);
  assert.equal(termWeight('comedouro'), DEFAULT_TERM_WEIGHT);
  assert.equal(termWeight('gps'), DEFAULT_TERM_WEIGHT);
});

test('weightedOverlapCoefficient: páginas que só compartilham "guia completo 2026" têm score baixo', () => {
  const a = extractTerms('coleira gps para cachorro e gato guia completo 2026');
  const b = extractTerms('comedouro automatico para pet guia completo 2026');
  const overlap = weightedOverlapCoefficient(a, b);
  assert.ok(overlap < 0.3, `esperado overlap baixo, obtido ${overlap}`);
});

test('weightedOverlapCoefficient: páginas com termos de nicho em comum têm score alto, mesmo com boilerplate junto', () => {
  const a = extractTerms('coleira gps cachorro pequeno porte bateria autonomia guia completo 2026');
  const b = extractTerms('coleira gps cachorro pequeno porte bateria autonomia guia completo 2026');
  const overlap = weightedOverlapCoefficient(a, b);
  assert.ok(overlap > 0.9, `esperado overlap alto para textos quase idênticos, obtido ${overlap}`);
});

test('weightedOverlapCoefficient: 0 quando os conjuntos não têm nada em comum', () => {
  const a = extractTerms('coleira gps cachorro');
  const b = extractTerms('comedouro automatico racao');
  assert.equal(weightedOverlapCoefficient(a, b), 0);
});

test('weightedOverlapCoefficient: 0 quando um conjunto é vazio', () => {
  assert.equal(weightedOverlapCoefficient(extractTerms(''), extractTerms('coleira gps')), 0);
});

test('sharedTermsWeighted: prioriza termos de nicho sobre termos genéricos', () => {
  const a = extractTerms('coleira gps guia completo 2026');
  const b = extractTerms('coleira gps guia completo 2026');
  const shared = sharedTermsWeighted(a, b, 2);
  assert.ok(shared.includes('coleira') || shared.includes('gps'));
});

// -------------------------------------------------------- Fase 4.1

test('termWeight: "pet" e "automatico" têm peso reduzido (Fase 4.1 — achado real de falso positivo)', () => {
  assert.equal(termWeight('pet'), GENERIC_TERM_WEIGHT);
  assert.equal(termWeight('automatico'), GENERIC_TERM_WEIGHT);
});

test('weightedOverlapCoefficient: temas diferentes de produto (gatos vs cachorro) não são inflados por "melhor/automático/pet/guia/2026"', () => {
  const a = extractTerms('Melhor Alimentador Automático para Gatos: Guia 2026');
  const b = extractTerms('Melhor Comedouro Automático para Cachorro: Guia 2026');
  const overlap = weightedOverlapCoefficient(a, b);
  assert.ok(overlap < 0.3, `esperado overlap baixo (gatos != cachorro), obtido ${overlap}`);
});

test('weightedOverlapCoefficient: conflito real entre reviews da mesma linha de produto continua alto mesmo após Fase 4.1', () => {
  const a = extractTerms('Comedouro Automático Newpet 2L: Vale a Pena? Review');
  const b = extractTerms('Comedouro Newpet 4L: Review Completo (Vale a Pena?)');
  const overlap = weightedOverlapCoefficient(a, b);
  assert.ok(overlap > 0.5, `esperado overlap alto (mesmo produto "Newpet"), obtido ${overlap}`);
});

test('sharedTermsWeighted: cai para termos genéricos só se não houver termo de nicho em comum', () => {
  const a = extractTerms('coleira gps guia completo 2026');
  const b = extractTerms('comedouro automatico guia completo 2026');
  const shared = sharedTermsWeighted(a, b, 5);
  // não há termo de nicho em comum entre coleira/gps e comedouro/automatico
  assert.ok(shared.length > 0);
  assert.ok(shared.every((t) => ['guia', 'completo', '2026'].includes(t)));
});
