'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { buildReels, buildPosts, buildCarousel, buildStories, buildEngagement, extractComparisonPair } = require('../src/content-templates');

function makeArticle(overrides) {
  return {
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
    ...overrides,
  };
}

function makeSignals(overrides) {
  return {
    own_images: [{ src: '/img/a.jpg', alt: 'foto' }],
    faq_question_count: 1,
    affiliate_products: [],
    ...overrides,
  };
}

test('extractComparisonPair extrai os dois lados de um título "A x B" real, sem inventar', () => {
  const pair = extractComparisonPair('Comedouro para Gato x Cachorro: Qual a Diferença?');
  assert.equal(pair.a, 'Comedouro para Gato');
  assert.equal(pair.b, 'Cachorro');
});

test('extractComparisonPair retorna null quando o título não é comparativo (nunca inventa par)', () => {
  assert.equal(extractComparisonPair('Guia Completo de Comedouro Automático'), null);
});

test('buildReels gera até 2 reels rastreáveis a headings reais', () => {
  const article = makeArticle({});
  const signals = makeSignals({});
  const reels = buildReels(article, signals);
  assert.ok(reels.length >= 1);
  assert.equal(reels[0].status, 'generated');
  assert.equal(reels[0].hook, 'Por que a diferença importa?');
  assert.equal(reels[0].source_url, article.url);
  assert.ok(reels[0].content_id.startsWith('artigo-teste-reel-'));
});

test('buildReels NUNCA repete o mesmo heading de "problema" entre reel 1 e reel 2 (regressão: roteiro inteiro duplicado, só hook mudava)', () => {
  const article = makeArticle({
    title: 'Comedouro Automático Com ou Sem Wi-Fi: Qual Escolher?',
    headings: [
      { tag: 'h2', text: 'O Que Muda na Prática Entre os Dois Tipos' },
      { tag: 'h2', text: 'Vantagens do Comedouro com Wi-Fi' },
      { tag: 'h2', text: 'Desvantagens do Comedouro com Wi-Fi' },
      { tag: 'h2', text: 'Conclusão' },
    ],
    question_headings: [
      { tag: 'h2', text: 'Comedouro sem Wi-Fi é mais confiável que com Wi-Fi?' },
      { tag: 'h2', text: 'Vale a pena pagar mais por um comedouro com Wi-Fi?' },
    ],
  });
  const signals = makeSignals({});
  const reels = buildReels(article, signals);
  assert.equal(reels.length, 2);
  assert.notEqual(reels[0].hook, reels[1].hook);
  assert.notEqual(reels[0].roteiro.problema, reels[1].roteiro.problema);
  assert.notEqual(reels[0].roteiro.informacao, reels[1].roteiro.informacao);
});

test('buildReels marca insufficient_source quando não há headings/perguntas na fonte', () => {
  const article = makeArticle({ headings: [], question_headings: [] });
  const signals = makeSignals({});
  const reels = buildReels(article, signals);
  assert.equal(reels[0].status, 'insufficient_source');
  assert.ok(reels[0].reason);
});

test('buildPosts nunca duplica o mesmo gancho entre post 1 e post 2', () => {
  const article = makeArticle({});
  const signals = makeSignals({});
  const posts = buildPosts(article, signals);
  assert.equal(posts.length, 2);
  assert.notEqual(posts[0].titulo_gatilho, posts[1].titulo_gatilho);
});

test('buildCarousel gera no mínimo 6 slides quando há headings suficientes', () => {
  const article = makeArticle({
    headings: [
      { tag: 'h2', text: 'Por que a diferença importa?' },
      { tag: 'h2', text: 'Tamanho da porção' },
      { tag: 'h2', text: 'Frequência de alimentação' },
      { tag: 'h2', text: 'Formato do bocal' },
      { tag: 'h2', text: 'Erros comuns ao escolher' },
      { tag: 'h2', text: 'Conclusão' },
    ],
  });
  const signals = makeSignals({});
  const carousel = buildCarousel(article, signals);
  assert.equal(carousel.status, 'generated');
  assert.ok(carousel.slides.length >= 6);
  assert.ok(carousel.slides.length <= 8);
});

test('buildCarousel expõe cta no nível raiz da peça (regressão: quality gate só olha piece.cta, não slides[].texto)', () => {
  const article = makeArticle({
    headings: [
      { tag: 'h2', text: 'Por que a diferença importa?' },
      { tag: 'h2', text: 'Tamanho da porção' },
      { tag: 'h2', text: 'Frequência de alimentação' },
      { tag: 'h2', text: 'Formato do bocal' },
      { tag: 'h2', text: 'Erros comuns ao escolher' },
      { tag: 'h2', text: 'Conclusão' },
    ],
  });
  const carousel = buildCarousel(article, makeSignals({}));
  assert.ok('cta' in carousel);
  assert.ok(carousel.cta.includes(article.url));
});

test('buildCarousel marca insufficient_source em vez de inventar slides quando há poucos headings', () => {
  const article = makeArticle({ headings: [{ tag: 'h2', text: 'Único tópico' }], question_headings: [] });
  const signals = makeSignals({});
  const carousel = buildCarousel(article, signals);
  assert.equal(carousel.status, 'insufficient_source');
});

test('buildStories usa pergunta real como enquete quando existe question_heading', () => {
  const article = makeArticle({});
  const signals = makeSignals({});
  const stories = buildStories(article, signals);
  assert.equal(stories[0].tipo, 'enquete');
  assert.equal(stories[0].conteudo, 'Por que a diferença importa?');
  assert.equal(stories[1].tipo, 'cta');
});

test('buildEngagement usa título comparativo real quando não há FAQ (nunca pergunta genérica solta)', () => {
  const article = makeArticle({ question_headings: [] });
  const engagement = buildEngagement(article);
  assert.equal(engagement[0].status, 'generated');
  assert.match(engagement[0].pergunta, /Comedouro para Gato ou Cachorro/);
});

test('buildEngagement marca insufficient_source quando não há FAQ nem título comparativo', () => {
  const article = makeArticle({ title: 'Guia Completo de Comedouro Automático', question_headings: [] });
  const engagement = buildEngagement(article);
  assert.equal(engagement[0].status, 'insufficient_source');
});
