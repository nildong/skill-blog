'use strict';

/**
 * score.js — FASE 2, arquivo NOVO.
 *
 * Score 0-100 por peça, soma de 11 critérios (cada um 0-9.09, ~1/11 do
 * total, arredondado no fim). Heurísticas 100% determinísticas sobre o
 * texto já existente na peça (nunca reescreve, só avalia).
 *
 *  1. HOOK (0-9)              — hook não vazio; +bonus se <=100 chars (direto);
 *                                +bonus se termina em "?" ou é frase de impacto curta.
 *  2. CLAREZA (0-9)           — penaliza frases muito longas (>220 chars sem quebra)
 *                                e jargão técnico não explicado (regex simples).
 *  3. CURIOSIDADE (0-9)       — hook termina em "?", ou contém "você sabia",
 *                                "curiosidade", número/estatística.
 *  4. VALOR (0-9)             — possui fato/dado concreto (roteiro.informacao,
 *                                legenda com >=1 número, ou source_type=body_fact).
 *  5. EMOÇÃO (0-9)            — presença de linguagem de identificação/emoção
 *                                ("seu gato", "seu cão", emojis de pet 🐱🐶🐾) sem exagero.
 *  6. POTENCIAL_COMENTARIO (0-9) — TIPO em {PERGUNTA, ENQUETE, OPINIAO} pontua alto;
 *                                CTA convida comentário explicitamente.
 *  7. POTENCIAL_COMPARTILHAMENTO (0-9) — TIPO em {CURIOSIDADE, VOCE_SABIA, LISTA,
 *                                COMPARACAO} pontua alto (conteúdo "salvável").
 *  8. NATURALIDADE (0-9)      — penaliza excesso de emoji (>4) ou hashtags (>6) no
 *                                mesmo campo, penaliza CAIXA-ALTA excessiva.
 *  9. ADEQUACAO_FORMATO (0-9) — reel tem roteiro completo; post tem legenda >=1
 *                                frase; carousel tem >=3 slides; stories tem tipo
 *                                definido; engagement tem pergunta.
 * 10. QUALIDADE_CTA (0-9)     — CTA presente e não genérico demais; penaliza CTA
 *                                com link fora da cota de 5% (objetivo_cta calculado
 *                                por cta-rules deve bater com cta_com_link).
 * 11. DIVERSIDADE (0-9)       — penaliza fortemente (score 0 no critério) se a peça
 *                                está em `flaggedIds` (vinda de repetition-detector).
 *
 * status: PRONTO_PUBLICAR se score_total >= 70, senão REVISAR.
 *
 * CALIBRAÇÃO FASE 3 (aprovada pelo usuário em 2026-09-05): o corte de
 * PRONTO_PUBLICAR foi baixado de 85 para 70. Peças entre 70-84 recebem o
 * status PRONTO_PUBLICAR mas ficam adicionalmente marcadas com
 * `revisao_leve: true` (recomenda-se uma revisão humana rápida antes de
 * publicar, mas o motor já as considera aptas). Peças <70 continuam REVISAR
 * forçado. Ver reports/social-content/fase3-teste-piloto.md.
 */

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

const CRIT_MAX = 100 / 11;
const PRONTO_PUBLICAR_CUTOFF = 70;
const REVISAO_LEVE_CUTOFF = 70; // 70-84 = pronto mas com revisão leve recomendada
const REVISAO_LEVE_TETO = 85;

function scoreHook(piece) {
  const hook = piece.hook || piece.titulo_gatilho || piece.pergunta || '';
  if (!hook) return 0;
  let s = CRIT_MAX * 0.5;
  if (hook.length <= 100) s += CRIT_MAX * 0.25;
  if (/\?\s*$/.test(hook.trim()) || hook.length <= 60) s += CRIT_MAX * 0.25;
  return clamp(s, 0, CRIT_MAX);
}

function scoreClareza(piece) {
  const text = piece.legenda || piece.hook || (piece.roteiro && piece.roteiro.informacao) || '';
  if (!text) return CRIT_MAX * 0.5;
  const longestSentence = Math.max(...text.split(/[.!?]/).map((s) => s.trim().length));
  let s = CRIT_MAX;
  if (longestSentence > 220) s -= CRIT_MAX * 0.4;
  if (/\b[a-zçãõáéíóú]{15,}\b/i.test(text)) s -= CRIT_MAX * 0.1; // termo muito longo isolado
  return clamp(s, 0, CRIT_MAX);
}

function scoreCuriosidade(piece) {
  const hook = piece.hook || piece.titulo_gatilho || '';
  const all = `${hook} ${piece.legenda || ''}`.toLowerCase();
  let s = 0;
  if (/\?\s*$/.test(hook.trim())) s += CRIT_MAX * 0.5;
  if (/você sabia|curiosidade|%|\bsegundo\b/.test(all)) s += CRIT_MAX * 0.5;
  return clamp(s, 0, CRIT_MAX);
}

function scoreValor(piece) {
  const hasFact = !!(piece.roteiro && piece.roteiro.informacao) || /\d/.test(piece.legenda || '') || (piece.source && piece.source.source_type === 'body_fact');
  return hasFact ? CRIT_MAX : CRIT_MAX * 0.3;
}

function scoreEmocao(piece) {
  const all = `${piece.hook || ''} ${piece.legenda || ''}`;
  const petMentions = (all.match(/seu gato|seu cão|seu cachorro|🐱|🐶|🐾/gi) || []).length;
  if (petMentions === 0) return CRIT_MAX * 0.4;
  if (petMentions <= 3) return CRIT_MAX;
  return CRIT_MAX * 0.6; // exagero
}

function scorePotencialComentario(piece) {
  if (['PERGUNTA', 'ENQUETE', 'OPINIAO'].includes(piece.tipo)) return CRIT_MAX;
  if (/comentários|reage aí|conta pra gente/i.test(piece.cta_sugerido || piece.cta || '')) return CRIT_MAX * 0.8;
  return CRIT_MAX * 0.4;
}

function scorePotencialCompartilhamento(piece) {
  if (['CURIOSIDADE', 'VOCE_SABIA', 'LISTA', 'COMPARACAO'].includes(piece.tipo)) return CRIT_MAX;
  return CRIT_MAX * 0.5;
}

function scoreNaturalidade(piece) {
  const all = `${piece.hook || ''} ${piece.legenda || ''}`;
  const emojiCount = (all.match(/\p{Emoji_Presentation}/gu) || []).length;
  const hashCount = (piece.hashtags || []).length;
  let s = CRIT_MAX;
  if (emojiCount > 4) s -= CRIT_MAX * 0.3;
  if (hashCount > 6) s -= CRIT_MAX * 0.2;
  if (/[A-ZÀ-Ú]{6,}/.test(all)) s -= CRIT_MAX * 0.2; // caixa-alta excessiva
  return clamp(s, 0, CRIT_MAX);
}

function scoreAdequacaoFormato(piece) {
  switch (piece.formato) {
    case 'reel': return piece.roteiro && piece.roteiro.problema && piece.roteiro.solucao ? CRIT_MAX : CRIT_MAX * 0.4;
    case 'post': return piece.legenda && piece.legenda.length > 20 ? CRIT_MAX : CRIT_MAX * 0.4;
    case 'carousel': return Array.isArray(piece.slides) && piece.slides.length >= 3 ? CRIT_MAX : CRIT_MAX * 0.5;
    case 'stories': return piece.tipo ? CRIT_MAX : CRIT_MAX * 0.5;
    case 'engagement': return piece.pergunta ? CRIT_MAX : CRIT_MAX * 0.4;
    default: return CRIT_MAX * 0.5;
  }
}

function scoreQualidadeCta(piece) {
  const cta = piece.cta_sugerido || piece.cta || '';
  if (!cta) return 0;
  const hasUrl = /https?:\/\//.test(cta);
  if (hasUrl && !piece.cta_com_link) return CRIT_MAX * 0.2; // link fora de cota — penaliza forte
  return CRIT_MAX;
}

function scoreDiversidade(piece, flaggedIds) {
  return flaggedIds && flaggedIds.has(piece.content_id) ? 0 : CRIT_MAX;
}

function scorePiece(piece, { flaggedIds = new Set() } = {}) {
  const criteria = {
    HOOK: scoreHook(piece),
    CLAREZA: scoreClareza(piece),
    CURIOSIDADE: scoreCuriosidade(piece),
    VALOR: scoreValor(piece),
    EMOCAO: scoreEmocao(piece),
    POTENCIAL_COMENTARIO: scorePotencialComentario(piece),
    POTENCIAL_COMPARTILHAMENTO: scorePotencialCompartilhamento(piece),
    NATURALIDADE: scoreNaturalidade(piece),
    ADEQUACAO_FORMATO: scoreAdequacaoFormato(piece),
    QUALIDADE_CTA: scoreQualidadeCta(piece),
    DIVERSIDADE: scoreDiversidade(piece, flaggedIds),
  };
  const total = Object.values(criteria).reduce((a, b) => a + b, 0);
  const score = Math.round(clamp(total, 0, 100));
  const status = score >= PRONTO_PUBLICAR_CUTOFF ? 'PRONTO_PUBLICAR' : 'REVISAR';
  const revisaoLeve = score >= REVISAO_LEVE_CUTOFF && score < REVISAO_LEVE_TETO;
  return { criteria, score, status, revisaoLeve };
}

function scoreBatch(pieces, { flaggedIds = new Set() } = {}) {
  return pieces.map((piece) => {
    const { criteria, score, status, revisaoLeve } = scorePiece(piece, { flaggedIds });
    return { ...piece, score, score_criteria: criteria, status_score: status, revisao_leve: revisaoLeve };
  });
}

module.exports = { scorePiece, scoreBatch, CRIT_MAX, PRONTO_PUBLICAR_CUTOFF };
