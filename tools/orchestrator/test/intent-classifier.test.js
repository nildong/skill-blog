'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { classifyIntent, INTENT, FUNNEL_STAGE } = require('../src/intent-classifier');
const { FORMATS } = require('../../shared/format-classifier');

test('classifyIntent: nunca inventa dado de keyword research', () => {
  const r = classifyIntent({ theme: 'Comedouro automático para dois gatos', keyword_candidate: 'comedouro automático 2 gatos' });
  assert.equal(r.keyword_research.search_volume_estimate, 'não disponível');
  assert.equal(r.keyword_research.keyword_difficulty, 'não disponível');
  assert.equal(r.keyword_research.cpc, 'não disponível');
  assert.equal(r.keyword_research.current_position, 'não disponível');
});

test('classifyIntent: reconhece padrão comparativo (gato x cachorro) como comercial/comparison', () => {
  const r = classifyIntent({ theme: 'Comedouro Automático para Gato x Cachorro: Qual a Diferença?' });
  assert.equal(r.primary_intent, INTENT.COMMERCIAL);
  assert.equal(r.recommended_type, FORMATS.COMPARISON);
});

test('classifyIntent: reconhece review de produto como comercial/bofu', () => {
  const r = classifyIntent({ theme: 'Comedouro Newpet 4L: Review Completo (Vale a Pena?)' });
  assert.equal(r.recommended_type, FORMATS.REVIEW);
  assert.equal(r.funnel_stage, FUNNEL_STAGE.BOFU);
});

test('classifyIntent: reconhece "como funciona" como informacional/tofu', () => {
  const r = classifyIntent({ theme: 'Como Funciona a Coleira GPS para Cachorro' });
  assert.equal(r.primary_intent, INTENT.INFORMATIONAL);
  assert.equal(r.funnel_stage, FUNNEL_STAGE.TOFU);
  assert.equal(r.recommended_type, FORMATS.INFORMATIONAL);
});

test('classifyIntent: reconhece intenção transacional (preço/cupom) sobre comercial genérico', () => {
  const r = classifyIntent({ theme: 'Onde comprar comedouro automático com cupom de desconto' });
  assert.equal(r.primary_intent, INTENT.TRANSACTIONAL);
  assert.equal(r.funnel_stage, FUNNEL_STAGE.BOFU);
});

test('classifyIntent: fallback conservador quando nenhum padrão casa', () => {
  const r = classifyIntent({ theme: 'Um tema qualquer sem padrão reconhecido aqui' });
  assert.equal(r.primary_intent, INTENT.INFORMATIONAL);
  assert.equal(r.confidence, 'LOW');
  assert.deepEqual(r.matched_rules, []);
});

test('classifyIntent: confiança HIGH quando só uma regra casa, MEDIUM quando duas casam', () => {
  const single = classifyIntent({ theme: 'Como Funciona a Coleira GPS para Cachorro' });
  assert.equal(single.confidence, 'HIGH');

  const double = classifyIntent({ theme: 'Melhor Comedouro Automático para Cachorro: Guia 2026' });
  assert.equal(double.confidence, 'MEDIUM');
});
