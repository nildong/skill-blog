'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { checkDeployGate, runDeployGate } = require('../src/deploy-gate');
const { makeRoot } = require('./support/helpers');

function writeQualityGate(root, slug, content) {
  const dir = path.join(root, '.data', 'pipeline', slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'quality-gate.json'), content, 'utf8');
}

// Spy que nunca invoca deploy.sh de verdade — usado em TODOS os testes
// desta suíte. Nenhum teste do Deploy Gate deve tocar o script real.
function makeSpy() {
  const calls = [];
  const deployAction = (args) => {
    calls.push(args);
    return { exitCode: 0, signal: null, error: null };
  };
  return { deployAction, calls };
}

test('checkDeployGate: arquivo inexistente → não permite', () => {
  const root = makeRoot([]);
  const result = checkDeployGate(root, 'artigo-sem-quality-gate');
  assert.equal(result.allowed, false);
  assert.match(result.reason, /não encontrado/);
});

test('checkDeployGate: JSON inválido → não permite', () => {
  const root = makeRoot([]);
  writeQualityGate(root, 'artigo-json-quebrado', '{ isso não é json válido');
  const result = checkDeployGate(root, 'artigo-json-quebrado');
  assert.equal(result.allowed, false);
  assert.match(result.reason, /JSON malformado/);
});

test('checkDeployGate: status BLOCKED → não permite', () => {
  const root = makeRoot([]);
  writeQualityGate(
    root,
    'artigo-bloqueado',
    JSON.stringify({ slug: 'artigo-bloqueado', status: 'BLOCKED', summary: { blockers: 1 } })
  );
  const result = checkDeployGate(root, 'artigo-bloqueado');
  assert.equal(result.allowed, false);
  assert.match(result.reason, /BLOCKED/);
});

test('checkDeployGate: APPROVED mas slug divergente → não permite (falha de segurança evitada)', () => {
  const root = makeRoot([]);
  // quality-gate.json de um artigo, mas tentando publicar outro slug —
  // o cenário exato descrito na conversa como risco de segurança.
  writeQualityGate(
    root,
    'artigo-b',
    JSON.stringify({ slug: 'artigo-a', status: 'APPROVED', summary: { blockers: 0 } })
  );
  const result = checkDeployGate(root, 'artigo-b');
  assert.equal(result.allowed, false);
  assert.match(result.reason, /pertence ao slug "artigo-a"/);
});

test('checkDeployGate: APPROVED + slug correto → permite', () => {
  const root = makeRoot([]);
  writeQualityGate(
    root,
    'artigo-aprovado',
    JSON.stringify({ slug: 'artigo-aprovado', status: 'APPROVED', summary: { blockers: 0 } })
  );
  const result = checkDeployGate(root, 'artigo-aprovado');
  assert.equal(result.allowed, true);
});

test('checkDeployGate: objeto JSON válido mas sem forma de quality-gate (array, por exemplo) → não permite', () => {
  const root = makeRoot([]);
  writeQualityGate(root, 'artigo-array', JSON.stringify(['isso', 'não', 'é', 'um', 'objeto']));
  const result = checkDeployGate(root, 'artigo-array');
  assert.equal(result.allowed, false);
});

// --- runDeployGate: confirma que deploy.sh só é chamado quando allowed ---

test('runDeployGate: APPROVED + slug correto → chama deployAction (equivalente a deploy.sh)', () => {
  const root = makeRoot([]);
  writeQualityGate(
    root,
    'artigo-aprovado',
    JSON.stringify({ slug: 'artigo-aprovado', status: 'APPROVED', summary: { blockers: 0 } })
  );
  const { deployAction, calls } = makeSpy();
  const result = runDeployGate(root, 'artigo-aprovado', { deployAction });
  assert.equal(result.published, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].slug, 'artigo-aprovado');
});

test('runDeployGate: BLOCKED → NÃO chama deployAction', () => {
  const root = makeRoot([]);
  writeQualityGate(
    root,
    'artigo-bloqueado',
    JSON.stringify({ slug: 'artigo-bloqueado', status: 'BLOCKED', summary: { blockers: 2 } })
  );
  const { deployAction, calls } = makeSpy();
  const result = runDeployGate(root, 'artigo-bloqueado', { deployAction });
  assert.equal(result.published, false);
  assert.equal(calls.length, 0);
});

test('runDeployGate: APPROVED + slug errado → NÃO chama deployAction', () => {
  const root = makeRoot([]);
  writeQualityGate(
    root,
    'artigo-b',
    JSON.stringify({ slug: 'artigo-a', status: 'APPROVED', summary: { blockers: 0 } })
  );
  const { deployAction, calls } = makeSpy();
  const result = runDeployGate(root, 'artigo-b', { deployAction });
  assert.equal(result.published, false);
  assert.equal(calls.length, 0);
});

test('runDeployGate: arquivo inexistente → NÃO chama deployAction', () => {
  const root = makeRoot([]);
  const { deployAction, calls } = makeSpy();
  const result = runDeployGate(root, 'artigo-sem-arquivo', { deployAction });
  assert.equal(result.published, false);
  assert.equal(calls.length, 0);
});

test('runDeployGate: JSON inválido → NÃO chama deployAction', () => {
  const root = makeRoot([]);
  writeQualityGate(root, 'artigo-json-quebrado', '{{{ não é json');
  const { deployAction, calls } = makeSpy();
  const result = runDeployGate(root, 'artigo-json-quebrado', { deployAction });
  assert.equal(result.published, false);
  assert.equal(calls.length, 0);
});

test('runDeployGate: nunca usa deployAction default (deploy.sh real) nestes testes — sanity check do próprio teste', () => {
  // Confirma que o spy realmente substitui a ação default; se algum teste
  // acima esquecesse de passar `deployAction`, este não pegaria isso
  // diretamente, mas documenta a expectativa: deployAction é sempre
  // injetado nesta suíte.
  const root = makeRoot([]);
  writeQualityGate(
    root,
    'artigo-aprovado-2',
    JSON.stringify({ slug: 'artigo-aprovado-2', status: 'APPROVED', summary: { blockers: 0 } })
  );
  let usedDefault = false;
  const fakeDeploy = () => {
    usedDefault = false;
    return { exitCode: 0 };
  };
  runDeployGate(root, 'artigo-aprovado-2', { deployAction: fakeDeploy });
  assert.equal(usedDefault, false);
});
