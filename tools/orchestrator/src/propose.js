'use strict';

const fs = require('fs');
const path = require('path');
const { slugify } = require('./slugify');
const { FORMATS } = require('../../shared/format-classifier');

const VALID_TYPES = new Set(Object.values(FORMATS));

/**
 * Constrói o objeto `article-proposal.json` a partir do input humano.
 * Função pura — não toca em disco. `buildProposal` nunca inventa dado:
 * qualquer campo não informado fica `null`, nunca é adivinhado aqui.
 *
 * @param {object} input
 * @param {string} input.theme - tema/ideia em linguagem natural (obrigatório)
 * @param {string} [input.keyword] - keyword candidata (se ausente, usa `theme`)
 * @param {string} [input.type] - um dos FORMATS de tools/shared/format-classifier.js
 * @param {string} [input.cluster] - slug do cluster/pilar, se já conhecido
 * @param {string} [input.slug] - override manual do slug (senão, derivado do theme)
 * @param {boolean} [input.personalExperienceConfirmed] - true SOMENTE se o
 *   autor realmente testou/usou o produto pessoalmente. Usado pelo Quality
 *   Gate (etapa 7) para decidir se uma afirmação de experiência pessoal no
 *   texto é legítima ou um claim inventado. Padrão: false — nunca assumido
 *   como true por omissão.
 */
function buildProposal(input) {
  if (!input || !input.theme || !String(input.theme).trim()) {
    throw new Error('propose: "theme" é obrigatório (tema/ideia em linguagem natural).');
  }

  const theme = String(input.theme).trim();
  const keyword = input.keyword ? String(input.keyword).trim() : theme;
  const slug = input.slug ? slugify(input.slug) : slugify(theme);

  if (!slug) {
    throw new Error('propose: não foi possível derivar um slug válido de "theme". Informe --slug explicitamente.');
  }

  let type = null;
  if (input.type) {
    const normalizedType = String(input.type).trim().toLowerCase();
    if (!VALID_TYPES.has(normalizedType)) {
      throw new Error(
        `propose: "type" inválido: "${input.type}". Valores aceitos: ${[...VALID_TYPES].join(', ')}.`
      );
    }
    type = normalizedType;
  }

  return {
    version: 1,
    generated_at: new Date().toISOString(),
    slug,
    theme,
    keyword_candidate: keyword,
    type_candidate: type,
    cluster_candidate: input.cluster ? String(input.cluster).trim() : null,
    personal_experience_confirmed: Boolean(input.personalExperienceConfirmed),
    status: 'proposed',
    notes:
      'Proposta inicial, ainda não validada. type_candidate e cluster_candidate são hipóteses do usuário/agente, sujeitas a revisão nas etapas de intent/cluster/cannibalization do preflight — não são decisões finais.',
  };
}

/**
 * Persiste a proposta em `.data/pipeline/<slug>/article-proposal.json`.
 * Não sobrescreve silenciosamente uma proposta existente, a menos que
 * `force: true` seja passado — evita perder análise anterior por engano.
 */
function writeProposal(root, proposal, { force = false } = {}) {
  const dir = path.join(root, '.data', 'pipeline', proposal.slug);
  const filePath = path.join(dir, 'article-proposal.json');

  if (fs.existsSync(filePath) && !force) {
    throw new Error(
      `propose: já existe uma proposta em ${filePath}. Use --force para sobrescrever, ou escolha outro --slug.`
    );
  }

  fs.mkdirSync(dir, { recursive: true });
  const json = JSON.stringify(proposal, null, 2) + '\n';
  fs.writeFileSync(filePath, json, 'utf8');
  return { filePath, bytes: Buffer.byteLength(json, 'utf8') };
}

module.exports = { buildProposal, writeProposal, VALID_TYPES };
