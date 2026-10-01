'use strict';

/**
 * repetition-detector.js — FASE 2, arquivo NOVO.
 *
 * Estende (não modifica) tools/social-content-engine/src/similarity.js,
 * que hoje só compara TÍTULOS de artigos entre si. Aqui comparamos,
 * dentro de um lote de PEÇAS SOCIAIS já exportadas (não artigos),
 * quatro campos textuais distintos, par a par, usando a mesma base já
 * usada pelo Cannibalization/similarity.js:
 *   - tools/shared/terms.js#extractTerms (tokeniza, remove stopwords PT-BR)
 *   - tools/shared/semantic-terms.js#weightedOverlapCoefficient
 *
 * Campos comparados, cada um isoladamente (uma peça pode repetir o
 * hook de outra sem repetir o CTA, por exemplo — sinalizamos por campo):
 *   hook            -> piece.hook || piece.titulo_gatilho || piece.pergunta
 *   pergunta_gancho -> piece.pergunta || (hook se terminar em "?")
 *   cta             -> piece.cta_sugerido || piece.cta
 *   ideia_central    -> concatenação de hook + legenda/roteiro.informacao
 *                       (proxy determinístico de "do que a peça fala")
 *
 * Threshold configurável (default 0.6, mesma ordem de grandeza do
 * threshold de 0.5 usado em similarity.js para títulos de artigo — um
 * pouco mais alto aqui porque comparamos textos curtos e criativos,
 * onde overlap parcial é mais tolerável antes de virar repetição real).
 *
 * Para cada par acima do limiar, sugere qual peça reformular: a de
 * SCORE mais baixo (se `score` já tiver sido calculado por score.js e
 * anexado à peça); on tie, a mais recente por posição no array de
 * entrada (assume-se ordem cronológica/de geração — a peça mais nova
 * é a que ainda não foi publicada/comprometida, então é mais barato
 * reformular ela).
 */

const { extractTerms } = require('../../../shared/terms');
const { weightedOverlapCoefficient } = require('../../../shared/semantic-terms');

const DEFAULT_THRESHOLD = 0.6;

function fieldHook(piece) {
  return piece.hook || piece.titulo_gatilho || piece.pergunta || '';
}
function fieldPergunta(piece) {
  const h = fieldHook(piece);
  return piece.pergunta || (/\?\s*$/.test(h.trim()) ? h : '');
}
function fieldCta(piece) {
  return piece.cta_sugerido || piece.cta || '';
}
function fieldIdeiaCentral(piece) {
  const parts = [fieldHook(piece), piece.legenda, piece.roteiro && piece.roteiro.informacao].filter(Boolean);
  return parts.join(' ');
}

const FIELD_EXTRACTORS = {
  hook: fieldHook,
  pergunta_gancho: fieldPergunta,
  cta: fieldCta,
  ideia_central: fieldIdeiaCentral,
};

function detectRepetitions(pieces, { threshold = DEFAULT_THRESHOLD } = {}) {
  const withTerms = pieces.map((piece, idx) => {
    const terms = {};
    for (const [field, fn] of Object.entries(FIELD_EXTRACTORS)) {
      const text = fn(piece);
      terms[field] = text ? extractTerms(text) : new Map();
    }
    return { idx, content_id: piece.content_id, piece, terms };
  });

  const flagged = new Map(); // content_id -> [{ field, with, overlap }]
  const pairs = [];

  for (let i = 0; i < withTerms.length; i++) {
    for (let j = i + 1; j < withTerms.length; j++) {
      const a = withTerms[i];
      const b = withTerms[j];
      for (const field of Object.keys(FIELD_EXTRACTORS)) {
        if (a.terms[field].size === 0 || b.terms[field].size === 0) continue;
        const overlap = weightedOverlapCoefficient(a.terms[field], b.terms[field]);
        if (overlap >= threshold) {
          const scoreA = typeof a.piece.score === 'number' ? a.piece.score : null;
          const scoreB = typeof b.piece.score === 'number' ? b.piece.score : null;
          let reformular;
          if (scoreA !== null && scoreB !== null && scoreA !== scoreB) {
            reformular = scoreA < scoreB ? a.content_id : b.content_id;
          } else {
            reformular = b.content_id; // mais recente por posição no array
          }
          const record = { field, a: a.content_id, b: b.content_id, overlap: Number(overlap.toFixed(2)), sugestao_reformular: reformular };
          pairs.push(record);
          for (const id of [a.content_id, b.content_id]) {
            if (!flagged.has(id)) flagged.set(id, []);
            flagged.get(id).push(record);
          }
        }
      }
    }
  }

  return { flagged, pairs, threshold };
}

module.exports = { detectRepetitions, DEFAULT_THRESHOLD, FIELD_EXTRACTORS };
