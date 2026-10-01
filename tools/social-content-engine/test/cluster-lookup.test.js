'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { lookupCluster, weakSlugHeuristic } = require('../src/cluster-lookup');

test('lookupCluster reaproveita cluster "known" do content-strategy.json sem recalcular', () => {
  const contentStrategy = {
    pages: [
      { url: '/comedouro-cachorro/', cluster: 'comedouro-automatico-para-pet', cluster_confidence: 'known' },
    ],
  };
  const result = lookupCluster('/comedouro-cachorro/', 'comedouro-cachorro', contentStrategy);
  assert.equal(result.cluster, 'comedouro-automatico-para-pet');
  assert.equal(result.cluster_source, 'content-strategy');
  assert.equal(result.cluster_confidence, 'known');
});

test('lookupCluster reaproveita cluster "probable" do content-strategy.json', () => {
  const contentStrategy = {
    pages: [
      { url: '/algum-satelite/', cluster: 'coleira-gps-para-pet', cluster_confidence: 'probable' },
    ],
  };
  const result = lookupCluster('/algum-satelite/', 'algum-satelite', contentStrategy);
  assert.equal(result.cluster_source, 'content-strategy');
  assert.equal(result.cluster_confidence, 'probable');
});

test('lookupCluster cai no fallback heurístico de slug quando content-strategy marca "unknown"', () => {
  const contentStrategy = {
    pages: [
      { url: '/comedouro-x/', cluster: null, cluster_confidence: 'unknown' },
    ],
  };
  const result = lookupCluster('/comedouro-x/', 'comedouro-x', contentStrategy);
  assert.equal(result.cluster, 'comedouro-automatico-para-pet');
  assert.equal(result.cluster_source, 'heuristic');
  assert.equal(result.cluster_confidence, 'low');
});

test('lookupCluster nunca trata heurística de slug como verdade absoluta (sempre marca low/heuristic)', () => {
  const result = weakSlugHeuristic('coleira-gps-para-gato');
  assert.equal(result.cluster_source, 'heuristic');
  assert.equal(result.cluster_confidence, 'low');
});

test('lookupCluster retorna cluster null quando nenhum sinal existe (nunca inventa)', () => {
  const result = weakSlugHeuristic('sobre');
  assert.equal(result.cluster, null);
  assert.equal(result.cluster_source, 'none');
  assert.equal(result.cluster_confidence, 'unknown');
});

test('lookupCluster funciona sem content-strategy.json (null) — cai direto no fallback', () => {
  const result = lookupCluster('/comedouro-cachorro/', 'comedouro-cachorro', null);
  assert.equal(result.cluster_source, 'heuristic');
});
