'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { tokenize, extractTerms, overlapCoefficient, sharedTerms } = require('../../shared/terms');

test('tokenize: remove stopwords em português', () => {
  const tokens = tokenize('O comedouro automático para o seu cão e o seu gato');
  assert.ok(!tokens.includes('o'));
  assert.ok(!tokens.includes('para'));
  assert.ok(!tokens.includes('e'));
  assert.ok(!tokens.includes('seu'));
  assert.ok(tokens.includes('comedouro'));
  assert.ok(tokens.includes('automatico'));
  assert.ok(tokens.includes('cao'));
  assert.ok(tokens.includes('gato'));
});

test('tokenize: não remove termos do nicho pet', () => {
  const tokens = tokenize('coleira gps comedouro cachorro gato pet');
  for (const t of ['coleira', 'gps', 'comedouro', 'cachorro', 'gato', 'pet']) {
    assert.ok(tokens.includes(t), `esperado manter termo do nicho: ${t}`);
  }
});

test('tokenize: normaliza acentos (câmera === camera)', () => {
  const a = tokenize('câmera pet');
  const b = tokenize('camera pet');
  assert.deepEqual(a, b);
});

test('overlapCoefficient: 1.0 quando um conjunto está inteiramente contido no outro', () => {
  const small = extractTerms('coleira gps cachorro');
  const big = extractTerms('coleira gps cachorro rastreamento bateria autonomia sinal bluetooth');
  assert.equal(overlapCoefficient(small, big), 1);
});

test('overlapCoefficient: 0 quando não há termos em comum', () => {
  const a = extractTerms('coleira gps cachorro');
  const b = extractTerms('comedouro automatico racao');
  assert.equal(overlapCoefficient(a, b), 0);
});

test('overlapCoefficient: 0 quando um dos conjuntos é vazio', () => {
  const a = extractTerms('');
  const b = extractTerms('coleira gps');
  assert.equal(overlapCoefficient(a, b), 0);
});

test('sharedTerms: retorna apenas termos presentes em ambos, ordenados por relevância', () => {
  const a = extractTerms('coleira gps cachorro bateria bateria');
  const b = extractTerms('coleira gps gato bateria');
  const shared = sharedTerms(a, b);
  assert.ok(shared.includes('coleira'));
  assert.ok(shared.includes('gps'));
  assert.ok(shared.includes('bateria'));
  assert.ok(!shared.includes('cachorro'));
  assert.ok(!shared.includes('gato'));
});
