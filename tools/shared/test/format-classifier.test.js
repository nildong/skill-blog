'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { detectFormat, relationshipType, FORMATS } = require('../format-classifier');

function post(overrides = {}) {
  return {
    slug: 'exemplo',
    title: 'Título de Exemplo',
    page_type: 'post',
    headings: [{ tag: 'h1', text: 'Título', empty: false }],
    faq: { detected: false, schema_detected: false, heading_detected: false, question_count: 0 },
    content: { word_count: 500 },
    heading_summary: { h2_count: 3 },
    ...overrides,
  };
}

test('detectFormat: FAQ via schema estruturado, mesmo sem prefixo no slug', () => {
  const p = post({ slug: 'perguntas-comuns-sobre-coleira', title: 'Coleira GPS: O Que Você Precisa Saber', faq: { schema_detected: true } });
  assert.equal(detectFormat(p), FORMATS.FAQ);
});

test('detectFormat: FAQ via prefixo de slug', () => {
  const p = post({ slug: 'duvidas-coleira-gps-pet', title: 'Coleira GPS: Perguntas Frequentes' });
  assert.equal(detectFormat(p), FORMATS.FAQ);
});

test('detectFormat: troubleshooting via prefixo erros-comuns-', () => {
  const p = post({ slug: 'erros-comuns-camera-monitorar-pet', title: 'Erros Comuns na Câmera Pet' });
  assert.equal(detectFormat(p), FORMATS.TROUBLESHOOTING);
});

test('detectFormat: comparison via padrão "-x-" no slug', () => {
  const p = post({ slug: 'coleira-gps-x-microchip', title: 'Coleira GPS x Microchip: Qual Escolher?' });
  assert.equal(detectFormat(p), FORMATS.COMPARISON);
});

test('detectFormat: review via sufixo -review', () => {
  const p = post({ slug: 'cat-mate-c500-review', title: 'Cat Mate C500: Vale a Pena?' });
  assert.equal(detectFormat(p), FORMATS.REVIEW);
});

test('detectFormat: list via prefixo melhor-', () => {
  const p = post({ slug: 'melhor-comedouro-automatico-cachorro', title: 'Melhor Comedouro Automático para Cachorro' });
  assert.equal(detectFormat(p), FORMATS.LIST);
});

test('detectFormat: how_to via prefixo como-', () => {
  const p = post({ slug: 'como-configurar-camera-pet-wifi', title: 'Como Configurar Câmera Pet Wi-Fi' });
  assert.equal(detectFormat(p), FORMATS.HOW_TO);
});

test('detectFormat: pillar via inboundCount alto (não por word_count/h2_count)', () => {
  const p = post({ slug: 'coleira-gps-para-pet', title: 'Coleira GPS para Cachorro e Gato: Guia Completo 2026', content: { word_count: 1507 }, heading_summary: { h2_count: 11 } });
  assert.equal(detectFormat(p, { inboundCount: 24 }), FORMATS.PILLAR);
});

test('detectFormat: word_count/h2_count altos SOZINHOS não classificam como pillar (calibração real do site)', () => {
  // ex: cercado-para-cachorros tem 2050 palavras / 10 H2 (mais que qualquer
  // pilar real do site) mas inbound baixo — não é hub, é conteúdo satélite comum.
  const p = post({ slug: 'cercado-para-cachorros', title: 'Cercado para Cachorros: Vale a Pena?', content: { word_count: 2050 }, heading_summary: { h2_count: 10 } });
  assert.equal(detectFormat(p, { inboundCount: 3 }), FORMATS.INFORMATIONAL);
});

test('detectFormat: institutional para page_type diferente de post', () => {
  const p = post({ slug: 'sobre', title: 'Sobre Nós', page_type: 'institutional' });
  assert.equal(detectFormat(p), FORMATS.INSTITUTIONAL);
});

test('detectFormat: classificação por conteúdo mesmo quando slug não tem prefixo reconhecido (guide via título)', () => {
  const p = post({ slug: 'cuidados-gerais-pet', title: 'Guia de Cuidados Gerais com Pets', content: { word_count: 400 }, heading_summary: { h2_count: 4 } });
  assert.equal(detectFormat(p, { inboundCount: 2 }), FORMATS.GUIDE);
});

test('detectFormat: unknown quando não há title nem headings suficientes', () => {
  const p = post({ slug: '', title: '', headings: [], content: { word_count: 0 }, heading_summary: { h2_count: 0 } });
  assert.equal(detectFormat(p), FORMATS.UNKNOWN);
});

test('detectFormat: unknown quando post é null/undefined', () => {
  assert.equal(detectFormat(null), FORMATS.UNKNOWN);
});

test('relationshipType: pilar + FAQ -> pillar_satellite', () => {
  assert.equal(relationshipType(FORMATS.PILLAR, FORMATS.FAQ), 'pillar_satellite');
  assert.equal(relationshipType(FORMATS.FAQ, FORMATS.PILLAR), 'pillar_satellite');
});

test('relationshipType: pilar + troubleshooting -> pillar_satellite', () => {
  assert.equal(relationshipType(FORMATS.PILLAR, FORMATS.TROUBLESHOOTING), 'pillar_satellite');
});

test('relationshipType: pilar + how_to -> pillar_satellite', () => {
  assert.equal(relationshipType(FORMATS.PILLAR, FORMATS.HOW_TO), 'pillar_satellite');
});

test('relationshipType: dois REVIEW -> same_format', () => {
  assert.equal(relationshipType(FORMATS.REVIEW, FORMATS.REVIEW), 'same_format');
});

test('relationshipType: HOW_TO + TROUBLESHOOTING (nenhum é pilar, ambos formatos específicos) -> differentiated_satellites', () => {
  assert.equal(relationshipType(FORMATS.HOW_TO, FORMATS.TROUBLESHOOTING), 'differentiated_satellites');
});

test('relationshipType: COMPARISON + HOW_TO -> differentiated_satellites (exemplo do próprio prompt: "1080p vs 2K" e "como escolher resolução")', () => {
  assert.equal(relationshipType(FORMATS.COMPARISON, FORMATS.HOW_TO), 'differentiated_satellites');
});

test('relationshipType: INFORMATIONAL + INFORMATIONAL -> same_format (não é "diferenciado", formato genérico)', () => {
  assert.equal(relationshipType(FORMATS.INFORMATIONAL, FORMATS.INFORMATIONAL), 'same_format');
});

test('relationshipType: dois PILLAR -> different_format (não pillar_satellite, ambos são hub)', () => {
  assert.equal(relationshipType(FORMATS.PILLAR, FORMATS.PILLAR), 'same_format');
});

test('relationshipType: UNKNOWN de qualquer lado -> unknown', () => {
  assert.equal(relationshipType(FORMATS.UNKNOWN, FORMATS.FAQ), 'unknown');
});
