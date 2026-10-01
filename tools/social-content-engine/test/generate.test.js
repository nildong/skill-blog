'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { generateContentForArticle } = require('../src/generate');

function makeArticleAnalysis(overrides) {
  return {
    article: {
      slug: 'artigo-teste',
      title: 'Comedouro para Gato x Cachorro: Qual a Diferença?',
      url: 'https://smartpetgadgets.com.br/artigo-teste/',
      meta_description: 'Entenda as diferenças entre comedouro para gato e cachorro.',
      audience: 'tutores de gatos e cães',
      cluster: 'comedouro-automatico-para-pet',
      headings: [
        { tag: 'h2', text: 'Por que a diferença importa?' },
        { tag: 'h2', text: 'Tamanho da porção' },
        { tag: 'h2', text: 'Erros comuns ao escolher' },
        { tag: 'h2', text: 'Conclusão' },
      ],
      question_headings: [{ tag: 'h2', text: 'Por que a diferença importa?' }],
    },
    signals: {
      own_images: [{ src: '/img/a.jpg', alt: 'foto' }],
      faq_question_count: 1,
      affiliate_products: [],
    },
    ...overrides,
  };
}

test('generateContentForArticle produz as 5 categorias de conteúdo (reels/posts/carousel/stories/engagement)', () => {
  const result = generateContentForArticle(makeArticleAnalysis({}));
  assert.ok(Array.isArray(result.content.reels));
  assert.ok(Array.isArray(result.content.posts));
  assert.ok(Array.isArray(result.content.carousel));
  assert.ok(Array.isArray(result.content.stories));
  assert.ok(Array.isArray(result.content.engagement));
});

test('generateContentForArticle calcula generation_summary consistente com as peças reais', () => {
  const result = generateContentForArticle(makeArticleAnalysis({}));
  const allPieces = [...result.content.reels, ...result.content.posts, ...result.content.carousel, ...result.content.stories, ...result.content.engagement];
  assert.equal(result.generation_summary.total_pieces, allPieces.length);
  assert.equal(result.generation_summary.generated, allPieces.filter((p) => p.status === 'generated').length);
});

test('generateContentForArticle marca status "generated_partial" quando alguma peça não tem gancho suficiente', () => {
  const analysis = makeArticleAnalysis({
    article: {
      slug: 'pobre-em-headings',
      title: 'Guia Genérico',
      url: 'https://smartpetgadgets.com.br/pobre-em-headings/',
      meta_description: 'Descrição.',
      audience: 'não determinado',
      cluster: null,
      headings: [{ tag: 'h2', text: 'Único tópico' }],
      question_headings: [],
    },
  });
  const result = generateContentForArticle(analysis);
  assert.notEqual(result.generation_summary.insufficient_source, 0);
  assert.notEqual(result.status, 'needs_review'); // insufficient != needs_review (falha de check)
});

test('generateContentForArticle nunca produz peça com status needs_review por reprovação silenciosa não reportada', () => {
  const result = generateContentForArticle(makeArticleAnalysis({}));
  const allPieces = [...result.content.reels, ...result.content.posts, ...result.content.carousel, ...result.content.stories, ...result.content.engagement];
  allPieces.forEach((p) => {
    if (p.status === 'needs_review') assert.ok(p.quality_checks && p.quality_checks.some((c) => !c.ok));
  });
});
