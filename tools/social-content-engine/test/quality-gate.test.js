'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { checkPiece, runQualityGate } = require('../src/quality-gate');

const article = {
  title: 'Comedouro para Gato x Cachorro: Qual a Diferença?',
  meta_description: 'Entenda as diferenças entre comedouro para gato e cachorro.',
  headings: [{ tag: 'h2', text: 'Por que a diferença importa?' }],
};

test('checkPiece aprova peça bem formada rastreável à fonte', () => {
  const piece = {
    content_id: 'x-reel-01',
    hook: 'Por que a diferença importa?',
    cta: 'Veja o guia completo: https://smartpetgadgets.com.br/x/',
    source_article: 'x',
    source_url: 'https://smartpetgadgets.com.br/x/',
    status: 'generated',
  };
  const { passed, status } = checkPiece(piece, { article });
  assert.equal(passed, true);
  assert.equal(status, 'generated');
});

test('checkPiece reprova placeholder', () => {
  const piece = {
    content_id: 'x-reel-01',
    hook: 'TODO: escrever hook aqui',
    cta: 'Veja: https://smartpetgadgets.com.br/x/',
    source_article: 'x',
    source_url: 'https://smartpetgadgets.com.br/x/',
    status: 'generated',
  };
  const { passed, status } = checkPiece(piece, { article });
  assert.equal(passed, false);
  assert.equal(status, 'needs_review');
});

test('checkPiece NÃO reprova a palavra portuguesa comum "todo" (achado real da calibração 2 — regex de placeholder era case-insensitive e batia falso positivo)', () => {
  const piece = {
    content_id: 'x-post-01',
    legenda: 'Compensa mais pra quem usa o brinquedo todo dia; a programação fica salva o dia todo.',
    cta: 'Veja: https://smartpetgadgets.com.br/x/',
    source_article: 'x',
    source_url: 'https://smartpetgadgets.com.br/x/',
    status: 'generated',
  };
  const { passed, status } = checkPiece(piece, { article });
  assert.equal(passed, true);
  assert.equal(status, 'generated');
});

test('checkPiece reprova preço citado na peça (nunca deveria aparecer)', () => {
  const piece = {
    content_id: 'x-post-01',
    titulo_gatilho: 'Por que a diferença importa?',
    legenda: 'Esse produto custa R$ 199,90.',
    cta: 'https://smartpetgadgets.com.br/x/',
    source_article: 'x',
    source_url: 'https://smartpetgadgets.com.br/x/',
    status: 'generated',
  };
  const { passed } = checkPiece(piece, { article });
  assert.equal(passed, false);
});

test('checkPiece reprova URL fora do domínio do site', () => {
  const piece = {
    content_id: 'x-reel-01',
    hook: 'Por que a diferença importa?',
    cta: 'Veja: https://outrosite.com/x/',
    source_article: 'x',
    source_url: 'https://outrosite.com/x/',
    status: 'generated',
  };
  const { passed } = checkPiece(piece, { article });
  assert.equal(passed, false);
});

test('checkPiece reprova hook não rastreável ao vocabulário da fonte', () => {
  const piece = {
    content_id: 'x-reel-01',
    hook: 'Frase totalmente inventada sem relação nenhuma com o artigo original de forma alguma',
    cta: 'https://smartpetgadgets.com.br/x/',
    source_article: 'x',
    source_url: 'https://smartpetgadgets.com.br/x/',
    status: 'generated',
  };
  const { passed } = checkPiece(piece, { article });
  assert.equal(passed, false);
});

test('checkPiece aceita peças insufficient_source sem exigir conteúdo criativo, e preserva o status (não confunde com needs_review)', () => {
  const piece = { content_id: 'x-reel-02', status: 'insufficient_source', reason: 'sem headings', source_article: 'x', source_url: 'https://smartpetgadgets.com.br/x/' };
  const { passed, status } = checkPiece(piece, { article });
  assert.equal(passed, true);
  assert.equal(status, 'insufficient_source');
});

test('runQualityGate aplica checks em todas as peças de todos os formatos', () => {
  const content = {
    reels: [{ content_id: 'x-reel-01', hook: 'Por que a diferença importa?', cta: 'https://smartpetgadgets.com.br/x/', source_article: 'x', source_url: 'https://smartpetgadgets.com.br/x/', status: 'generated' }],
    posts: [],
    carousel: [],
    stories: [],
    engagement: [],
  };
  const result = runQualityGate(article, content);
  assert.equal(result.reels.length, 1);
  assert.ok('quality_passed' in result.reels[0]);
});
