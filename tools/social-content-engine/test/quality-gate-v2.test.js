'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { checkPieceV2, excerptExistsInBody } = require('../src/quality-gate-v2');

const article = {
  slug: 'artigo-exemplo',
  body_text_full: 'Gatos têm bigodes sensíveis que, em contato repetido com as bordas de um pote fundo e estreito, podem causar desconforto conhecido informalmente como "fadiga de bigode".',
};

function baseValidPiece(overrides = {}) {
  return {
    hook: 'Seu gato recusa comida em pote fundo? Pode não ser frescura.',
    cta: 'Confira o guia: https://smartpetgadgets.com.br/artigo-exemplo/',
    source_article: 'artigo-exemplo',
    source_url: 'https://smartpetgadgets.com.br/artigo-exemplo/',
    source: {
      article_slug: 'artigo-exemplo',
      source_type: 'body_fact',
      source_excerpt: 'Gatos têm bigodes sensíveis que, em contato repetido com as bordas de um pote fundo e estreito, podem causar desconforto conhecido informalmente como "fadiga de bigode".',
      section: 'Formato do Pote e Altura do Comedouro',
    },
    ...overrides,
  };
}

test('excerptExistsInBody: encontra trecho literal', () => {
  assert.equal(excerptExistsInBody('bigodes sensíveis', article.body_text_full), true);
});

test('excerptExistsInBody: rejeita trecho que não existe (paráfrase livre)', () => {
  assert.equal(excerptExistsInBody('gatos odeiam potes fundos porque são teimosos', article.body_text_full), false);
});

test('checkPieceV2: peça válida com source completo passa no gate', () => {
  const { passed, status } = checkPieceV2(baseValidPiece(), { article });
  assert.equal(passed, true);
  assert.equal(status, 'generated');
});

test('checkPieceV2: falha sem objeto source', () => {
  const piece = baseValidPiece();
  delete piece.source;
  const { passed, checks } = checkPieceV2(piece, { article });
  assert.equal(passed, false);
  assert.ok(checks.some((c) => c.name === 'possui objeto source declarado' && !c.ok));
});

test('checkPieceV2: falha quando source_excerpt não existe literalmente no artigo (invenção)', () => {
  const piece = baseValidPiece({
    source: {
      article_slug: 'artigo-exemplo',
      source_type: 'body_fact',
      source_excerpt: 'fato que não está em lugar nenhum do artigo',
      section: null,
    },
  });
  const { passed, checks } = checkPieceV2(piece, { article });
  assert.equal(passed, false);
  assert.ok(checks.some((c) => c.name.includes('existe literalmente') && !c.ok));
});

test('checkPieceV2: falha quando article_slug do source não bate com o artigo processado', () => {
  const piece = baseValidPiece({
    source: { ...baseValidPiece().source, article_slug: 'outro-artigo' },
  });
  const { passed } = checkPieceV2(piece, { article });
  assert.equal(passed, false);
});

test('checkPieceV2: falha quando source_type não é permitido', () => {
  const piece = baseValidPiece({
    source: { ...baseValidPiece().source, source_type: 'chute_criativo' },
  });
  const { passed } = checkPieceV2(piece, { article });
  assert.equal(passed, false);
});

test('checkPieceV2: overlap lexical é informativo, nunca bloqueia sozinho', () => {
  // Hook quase sem overlap de palavras com o corpo, mas source_excerpt válido — deve passar.
  const piece = baseValidPiece({ hook: 'Curiosidade rápida sobre pets domésticos hoje' });
  const { passed, checks } = checkPieceV2(piece, { article });
  assert.equal(passed, true);
  const overlapCheck = checks.find((c) => c.name.includes('overlap lexical'));
  assert.equal(overlapCheck.informational, true);
});

test('checkPieceV2: preço continua bloqueado mesmo com source válido', () => {
  const piece = baseValidPiece({ hook: 'Promoção: R$ 99 hoje!' });
  const { passed } = checkPieceV2(piece, { article });
  assert.equal(passed, false);
});

test('checkPieceV2: peça insufficient_source ainda funciona como no V1', () => {
  const piece = {
    status: 'insufficient_source',
    reason: 'sem gancho real',
    source_article: 'artigo-exemplo',
    source_url: 'https://smartpetgadgets.com.br/artigo-exemplo/',
  };
  const { passed, status } = checkPieceV2(piece, { article });
  assert.equal(passed, true);
  assert.equal(status, 'insufficient_source');
});
