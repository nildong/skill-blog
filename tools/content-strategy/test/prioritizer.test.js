'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { assignPriority, consolidate } = require('../src/prioritizer');

function opp(overrides = {}) {
  return {
    id: 'X-0001',
    type: 'UPDATE_EXISTING',
    score: 50,
    score_breakdown: { total: 50 },
    confidence: 'MEDIUM',
    page: '/exemplo/',
    related_pages: [],
    reason: 'r',
    evidence: [],
    recommended_action: 'a',
    ...overrides,
  };
}

// -------------------------------------------------------- tipos gerais (não DIFFERENTIATE_CONTENT)

test('assignPriority: score >= 70 -> P0 (tipo geral)', () => {
  assert.equal(assignPriority(opp({ score_breakdown: { total: 70 } })), 'P0');
});

test('assignPriority: score 50-69 -> P1 (tipo geral)', () => {
  assert.equal(assignPriority(opp({ score_breakdown: { total: 55 } })), 'P1');
});

test('assignPriority: score 30-49 -> P2 (tipo geral)', () => {
  assert.equal(assignPriority(opp({ score_breakdown: { total: 35 } })), 'P2');
});

test('assignPriority: score < 30 -> P3 (tipo geral)', () => {
  assert.equal(assignPriority(opp({ score_breakdown: { total: 10 } })), 'P3');
});

test('assignPriority: NO_ACTION sempre P3, independente do score', () => {
  assert.equal(assignPriority(opp({ type: 'NO_ACTION', score_breakdown: { total: 90 } })), 'P3');
});

// -------------------------------------------------------- DIFFERENTIATE_CONTENT (Fase 4.1)

function diffOpp(overrides = {}) {
  return opp({ type: 'DIFFERENTIATE_CONTENT', involves_pillar: false, confidence: 'MEDIUM', score_breakdown: { total: 50 }, ...overrides });
}

test('DIFFERENTIATE_CONTENT: envolve PILLAR + score alto -> P0', () => {
  assert.equal(assignPriority(diffOpp({ involves_pillar: true, score_breakdown: { total: 74 } })), 'P0');
});

test('DIFFERENTIATE_CONTENT: envolve PILLAR + confidence HIGH (mesmo com score moderado) -> P0', () => {
  assert.equal(assignPriority(diffOpp({ involves_pillar: true, confidence: 'HIGH', score_breakdown: { total: 45 } })), 'P0');
});

test('DIFFERENTIATE_CONTENT: envolve PILLAR + score/confidence moderados -> P1 (não P0)', () => {
  assert.equal(assignPriority(diffOpp({ involves_pillar: true, confidence: 'MEDIUM', score_breakdown: { total: 50 } })), 'P1');
});

test('DIFFERENTIATE_CONTENT: entre SATELLITES (nenhum pilar) + score alto -> P1, nunca P0', () => {
  const priority = assignPriority(diffOpp({ involves_pillar: false, confidence: 'MEDIUM', score_breakdown: { total: 74 } }));
  assert.equal(priority, 'P1');
  assert.notEqual(priority, 'P0');
});

test('DIFFERENTIATE_CONTENT: entre SATELLITES + score moderado -> P2', () => {
  assert.equal(assignPriority(diffOpp({ involves_pillar: false, score_breakdown: { total: 50 } })), 'P2');
});

test('DIFFERENTIATE_CONTENT: confidence LOW nunca vira P0/P1, mesmo envolvendo pilar', () => {
  const priority = assignPriority(diffOpp({ involves_pillar: true, confidence: 'LOW', score_breakdown: { total: 74 } }));
  assert.ok(['P2', 'P3'].includes(priority));
});

test('DIFFERENTIATE_CONTENT: confidence MEDIUM entre satélites gera prioridade diferente de confidence LOW (mesmo score)', () => {
  const medium = assignPriority(diffOpp({ involves_pillar: false, confidence: 'MEDIUM', score_breakdown: { total: 65 } }));
  const low = assignPriority(diffOpp({ involves_pillar: false, confidence: 'LOW', score_breakdown: { total: 65 } }));
  assert.notEqual(medium, low, `esperado prioridades diferentes; MEDIUM=${medium}, LOW=${low}`);
});

test('assignPriority: é determinístico (mesma entrada produz mesma prioridade)', () => {
  const input = diffOpp({ involves_pillar: true, confidence: 'MEDIUM', score_breakdown: { total: 58 } });
  assert.equal(assignPriority(input), assignPriority(input));
});

// -------------------------------------------------------- consolidate

test('consolidate: remove duplicata exata (mesmo type+page+recommended_action)', () => {
  const a = opp({ id: 'A', page: '/x/', recommended_action: 'fazer X' });
  const b = opp({ id: 'B', page: '/x/', recommended_action: 'fazer X' });
  const result = consolidate([a, b]);
  assert.equal(result.length, 1);
});

test('consolidate: ordena por prioridade e depois por score desc', () => {
  const low = opp({ id: 'LOW', score_breakdown: { total: 20 } });
  const high = opp({ id: 'HIGH', page: '/outra/', score_breakdown: { total: 80 } });
  const result = consolidate([low, high]);
  assert.equal(result[0].id, 'HIGH');
  assert.equal(result[0].priority, 'P0');
  assert.equal(result[1].priority, 'P3');
});
