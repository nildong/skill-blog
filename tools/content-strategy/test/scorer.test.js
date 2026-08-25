'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { computeScore, scoreConfidence } = require('../src/scorer');

test('computeScore: é determinístico (mesma entrada produz mesmo resultado)', () => {
  const input = { type: 'UPDATE_EXISTING', severities: ['ERROR'], page: { role: 'PILLAR', inbound_links: 24 }, evidenceList: [{ text: 'a' }, { text: 'b' }], confidence: 'HIGH' };
  const r1 = computeScore(input);
  const r2 = computeScore(input);
  assert.deepEqual(r1, r2);
});

test('computeScore: score_breakdown soma exatamente ao total', () => {
  const r = computeScore({ type: 'IMPROVE_INTERNAL_LINKING', severities: ['ERROR'], page: { role: 'SATELLITE', inbound_links: 5 }, evidenceList: [{ text: 'a' }], confidence: 'MEDIUM' });
  const sum = r.impact + r.strategic_value + r.evidence + r.confidence + r.effort;
  assert.equal(sum, r.total);
});

test('computeScore: confidence HIGH gera mais pontos que LOW para o mesmo restante', () => {
  const base = { type: 'UPDATE_EXISTING', severities: ['WARNING'], page: { role: 'SATELLITE', inbound_links: 5 }, evidenceList: [{ text: 'a' }] };
  const high = computeScore({ ...base, confidence: 'HIGH' });
  const low = computeScore({ ...base, confidence: 'LOW' });
  assert.ok(high.total > low.total, 'score com confidence HIGH deve ser maior que LOW');
});

test('computeScore: score alto NÃO implica confidence alta (são dimensões independentes)', () => {
  // impacto/valor estratégico altos, mas confidence LOW (pouca evidência)
  const r = computeScore({ type: 'NEW_CONTENT', severities: ['CRITICAL'], page: { role: 'PILLAR', inbound_links: 40 }, evidenceList: [{ text: 'a' }], confidence: 'LOW' });
  assert.ok(r.impact + r.strategic_value > 40, 'impact+strategic_value deve ser alto');
  assert.equal(r.confidence, scoreConfidence('LOW'));
  assert.ok(r.confidence < 10, 'confidence numérica deve refletir LOW, independente do impacto');
});

test('scoreConfidence: mapeamento HIGH > MEDIUM > LOW', () => {
  assert.ok(scoreConfidence('HIGH') > scoreConfidence('MEDIUM'));
  assert.ok(scoreConfidence('MEDIUM') > scoreConfidence('LOW'));
});

test('computeScore: página ausente (null) não lança exceção, usa fallback conservador', () => {
  assert.doesNotThrow(() => computeScore({ type: 'NO_ACTION', severities: [], page: null, evidenceList: [], confidence: 'HIGH' }));
});
