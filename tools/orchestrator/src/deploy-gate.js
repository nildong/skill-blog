'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

/**
 * Deploy Gate — Etapa 8, o último mecanismo de segurança antes da
 * Hostinger. Regra fundamental (definida pelo usuário, não-negociável):
 * NUNCA confiar apenas no fato de que `validate` já rodou antes. Toda vez
 * que `publish` é chamado, ele relê `quality-gate.json` do disco e
 * confere, na hora, que:
 *
 *   1. o arquivo existe;
 *   2. é JSON válido;
 *   3. pertence ao MESMO slug que está sendo publicado agora (evita
 *      publicar o artigo B usando a aprovação do artigo A);
 *   4. `status === "APPROVED"`.
 *
 * Só nesse caso `deploy.sh` é invocado — e sempre exatamente como já
 * funciona hoje (`deploy.sh <slug>`), sem nenhum argumento novo, sem
 * alterar o script.
 */

/**
 * Decisão pura (sem side effects) — lê o quality-gate.json e decide se a
 * publicação pode prosseguir. Separada de `runDeployGate` para ser
 * testável sem nunca invocar deploy.sh de verdade.
 */
function checkDeployGate(root, slug) {
  const filePath = path.join(root, '.data', 'pipeline', slug, 'quality-gate.json');

  if (!fs.existsSync(filePath)) {
    return {
      allowed: false,
      reason: `quality-gate.json não encontrado em ${filePath}. Rode "validate ${slug}" antes de publicar.`,
      filePath,
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return {
      allowed: false,
      reason: `quality-gate.json inválido (JSON malformado): ${err.message}`,
      filePath,
    };
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { allowed: false, reason: 'quality-gate.json não é um objeto JSON válido.', filePath };
  }

  if (parsed.slug !== slug) {
    return {
      allowed: false,
      reason: `quality-gate.json pertence ao slug "${parsed.slug}", mas foi pedido publicar "${slug}" — publicação recusada por segurança (evita publicar um artigo usando a aprovação de outro).`,
      filePath,
      qualityGate: parsed,
    };
  }

  if (parsed.status !== 'APPROVED') {
    return {
      allowed: false,
      reason: `quality-gate.json tem status "${parsed.status}" (esperado "APPROVED"). Resolva os itens BLOCKER e rode "validate ${slug}" novamente.`,
      filePath,
      qualityGate: parsed,
    };
  }

  return {
    allowed: true,
    reason: 'quality-gate.json aprovado para este slug — publicação liberada.',
    filePath,
    qualityGate: parsed,
  };
}

/**
 * Invoca deploy.sh exatamente como já funciona hoje (`deploy.sh <slug>
 * [subpasta-remota]`), sem alterar o script nem seu contrato de CLI.
 * Isolado em função própria para poder ser substituído por um mock nos
 * testes — nenhum teste desta etapa deve chamar o deploy.sh real.
 */
function defaultDeployAction({ root, slug, deployScriptPath, remoteSubdir }) {
  const scriptPath = deployScriptPath || path.join(root, '.claude', 'skills', 'blog', 'scripts', 'deploy.sh');
  const args = remoteSubdir ? [slug, remoteSubdir] : [slug];
  const result = spawnSync(scriptPath, args, { stdio: 'inherit' });
  return { exitCode: result.status, signal: result.signal, error: result.error ? result.error.message : null };
}

/**
 * Ponto de entrada do Deploy Gate. Sempre reavalia `checkDeployGate` antes
 * de decidir chamar `deployAction` (default: `defaultDeployAction`, que
 * invoca o `deploy.sh` real) — nunca pula essa checagem, mesmo que o
 * chamador "já saiba" que estava aprovado antes.
 */
function runDeployGate(root, slug, options = {}) {
  const { deployAction = defaultDeployAction, deployScriptPath, remoteSubdir } = options;

  const decision = checkDeployGate(root, slug);
  if (!decision.allowed) {
    return { ...decision, published: false };
  }

  const deployResult = deployAction({ root, slug, deployScriptPath, remoteSubdir });
  return { ...decision, published: true, deployResult };
}

module.exports = { checkDeployGate, runDeployGate, defaultDeployAction };
