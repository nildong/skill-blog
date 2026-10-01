'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { detectSimilarityWarnings } = require('../src/similarity');

function makeArticle(slug, title, cluster) {
  return { article: { slug, title, cluster } };
}

test('detectSimilarityWarnings marca titulos quase idênticos', () => {
  const articles = [
    makeArticle('comedouro-newpet-2l-review', 'Comedouro Newpet 2L: Review Completo Vale a Pena', 'comedouro-automatico-para-pet'),
    makeArticle('comedouro-newpet-4l-review', 'Comedouro Newpet 4L: Review Completo Vale a Pena', 'comedouro-automatico-para-pet'),
  ];
  const warnings = detectSimilarityWarnings(articles);
  assert.ok(warnings.get('comedouro-newpet-2l-review').length > 0);
  assert.ok(warnings.get('comedouro-newpet-4l-review').length > 0);
});

test('detectSimilarityWarnings não marca artigos de temas claramente distintos', () => {
  const articles = [
    makeArticle('coleira-gps-para-gato', 'Coleira GPS para Gato: Guia Completo', 'coleira-gps-para-pet'),
    makeArticle('comedouro-cachorro', 'Comedouro para Cachorro com Suporte Baia', 'comedouro-automatico-para-pet'),
  ];
  const warnings = detectSimilarityWarnings(articles);
  assert.equal(warnings.size, 0);
});

test('detectSimilarityWarnings retorna mapa vazio para lista de 1 artigo', () => {
  const articles = [makeArticle('unico', 'Artigo Único', null)];
  const warnings = detectSimilarityWarnings(articles);
  assert.equal(warnings.size, 0);
});
