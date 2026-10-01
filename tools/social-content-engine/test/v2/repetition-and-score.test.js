'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { detectRepetitions } = require('../../src/v2/repetition-detector');
const { scorePiece } = require('../../src/v2/score');
const { classifyPiece } = require('../../src/v2/enrichment');

test('repetition-detector sinaliza par de hooks quase idênticos acima do limiar', () => {
  const pieces = [
    { content_id: 'a', hook: 'Comedouro automático economiza tempo do tutor no dia a dia' },
    { content_id: 'b', hook: 'Comedouro automático economiza tempo do tutor todos os dias' },
    { content_id: 'c', hook: 'Coleira GPS ajuda a encontrar o cachorro perdido em minutos' },
  ];
  const { flagged } = detectRepetitions(pieces, { threshold: 0.6 });
  assert.ok(flagged.has('a') && flagged.has('b'), 'par a/b deveria ser sinalizado');
  assert.ok(!flagged.has('c') || !flagged.get('c').some((r) => r.a === 'c' || r.b === 'c'));
});

test('score.js: peça flagada por repetição perde pontos em DIVERSIDADE', () => {
  const piece = { content_id: 'x', formato: 'post', hook: 'Teste', legenda: 'Legenda de teste com conteúdo suficiente.', cta: 'Veja mais', tipo: 'DICA_PRATICA' };
  const flaggedIds = new Set(['x']);
  const withFlag = scorePiece(piece, { flaggedIds });
  const withoutFlag = scorePiece(piece, { flaggedIds: new Set() });
  assert.equal(withFlag.criteria.DIVERSIDADE, 0);
  assert.ok(withoutFlag.criteria.DIVERSIDADE > 0);
  assert.ok(withFlag.score < withoutFlag.score);
});

test('score.js: status PRONTO_PUBLICAR só quando score >= 70', () => {
  const low = scorePiece({ content_id: 'y', formato: 'post', tipo: 'DICA_PRATICA' });
  assert.equal(low.status, low.score >= 70 ? 'PRONTO_PUBLICAR' : 'REVISAR');
  if (low.score < 70) assert.equal(low.status, 'REVISAR');
});

test('enrichment: hook terminado em "?" sem outros marcadores classifica como PERGUNTA', () => {
  const { tipo } = classifyPiece({ formato: 'reel', hook: 'Seu gato já fez isso hoje?' });
  assert.equal(tipo, 'PERGUNTA');
});

test('enrichment: menção a mito/verdade tem prioridade sobre pergunta', () => {
  const { tipo } = classifyPiece({ formato: 'reel', hook: 'Mito ou verdade: ração úmida engorda o gato?' });
  assert.equal(tipo, 'MITO_OU_VERDADE');
});

test('enrichment: stories tipo=enquete classifica como ENQUETE', () => {
  const { tipo } = classifyPiece({ formato: 'stories', tipo: 'enquete', opcoes: ['Sim', 'Não'] });
  assert.equal(tipo, 'ENQUETE');
});
