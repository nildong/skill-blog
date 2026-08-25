'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { classifyRole, inferClusters, ROLE } = require('../src/classifier');
const { makePost } = require('./support/helpers');

test('classifyRole: PILLAR via inbound alto', () => {
  const p = makePost({ slug: 'coleira-gps-para-pet', title: 'Coleira GPS: Guia Completo' });
  const { role } = classifyRole(p, { inboundCount: 24 });
  assert.equal(role, ROLE.PILLAR);
});

test('classifyRole: FAQ mapeia para ROLE.FAQ', () => {
  const p = makePost({ slug: 'duvidas-coleira-gps-pet', title: 'Coleira GPS: Perguntas Frequentes' });
  const { role } = classifyRole(p, { inboundCount: 4 });
  assert.equal(role, ROLE.FAQ);
});

test('classifyRole: página institucional mapeia para ROLE.INSTITUTIONAL', () => {
  const p = makePost({ slug: 'sobre', title: 'Sobre', page_type: 'institutional' });
  const { role } = classifyRole(p, { inboundCount: 0 });
  assert.equal(role, ROLE.INSTITUTIONAL);
});

test('inferClusters: página com relação pillar_satellite conhecida (via Internal Linking) recebe confidence "known"', () => {
  const pillar = makePost({ slug: 'coleira-gps-para-pet', title: 'Coleira GPS: Guia Completo' });
  const faq = makePost({ slug: 'duvidas-coleira-gps-pet', title: 'Coleira GPS: Perguntas Frequentes' });
  const posts = [pillar, faq];

  const rolesByPath = new Map([
    [pillar.path, classifyRole(pillar, { inboundCount: 24 })],
    [faq.path, classifyRole(faq, { inboundCount: 4 })],
  ]);

  const internalLinking = { suggestions: [{ source: faq.url_path, target: pillar.url_path, relationship: 'pillar_satellite' }] };
  const clusters = inferClusters(posts, rolesByPath, { internalLinking, cannibalization: null });

  assert.equal(clusters.get(faq.path).clusterId, 'coleira-gps-para-pet');
  assert.equal(clusters.get(faq.path).confidence, 'known');
  assert.equal(clusters.get(pillar.path).clusterId, 'coleira-gps-para-pet');
});

test('inferClusters: página sem nenhuma relação conhecida e sem overlap de slug/título fica cluster null (unknown)', () => {
  const pillar = makePost({ slug: 'coleira-gps-para-pet', title: 'Coleira GPS: Guia Completo' });
  const unrelated = makePost({ slug: 'politica-editorial', title: 'Política Editorial', page_type: 'institutional' });
  const posts = [pillar, unrelated];

  const rolesByPath = new Map([
    [pillar.path, classifyRole(pillar, { inboundCount: 24 })],
    [unrelated.path, classifyRole(unrelated, { inboundCount: 0 })],
  ]);

  const clusters = inferClusters(posts, rolesByPath, { internalLinking: null, cannibalization: null });
  assert.equal(clusters.get(unrelated.path).clusterId, null);
  assert.equal(clusters.get(unrelated.path).confidence, 'unknown');
});

test('inferClusters: overlap de slug/título com um pilar, sem relação real, gera confidence "probable"', () => {
  const pillar = makePost({ slug: 'coleira-gps-para-pet', title: 'Coleira GPS para Cachorro e Gato' });
  const weaklyRelated = makePost({ slug: 'coleira-gps-x-microchip', title: 'Coleira GPS x Microchip: Qual Escolher?' });
  const posts = [pillar, weaklyRelated];

  const rolesByPath = new Map([
    [pillar.path, classifyRole(pillar, { inboundCount: 24 })],
    [weaklyRelated.path, classifyRole(weaklyRelated, { inboundCount: 3 })],
  ]);

  const clusters = inferClusters(posts, rolesByPath, { internalLinking: null, cannibalization: null });
  assert.equal(clusters.get(weaklyRelated.path).clusterId, 'coleira-gps-para-pet');
  assert.equal(clusters.get(weaklyRelated.path).confidence, 'probable');
});
