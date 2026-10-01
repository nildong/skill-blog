'use strict';

/**
 * Quality gate por peça (ver prompt original, seção 19). Cada peça
 * gerada passa por checks determinísticos; se falhar qualquer check
 * obrigatório, `status` vira "needs_review" e a peça NÃO é considerada
 * pronta para fila editorial — nunca publicada automaticamente (não há
 * publicação nesta V1 de qualquer forma).
 */

// TODO/TBD/XXX são case-SENSITIVE de propósito: um único regex com /i aplica
// a flag à expressão inteira (não só a um dos grupos), então "TODO|TBD|XXX"
// case-insensitive batia falso positivo em "todo" (achado real na calibração
// 2 — "brinquedo todo dia", "programada o dia todo" são português comum, não
// placeholder). Por isso são dois regexes separados, testados com OR.
const PLACEHOLDER_ACRONYM_RE = /\b(TODO|TBD|XXX)\b/;
const PLACEHOLDER_PATTERN_RE = /lorem ipsum|\{\{.*?\}\}|\[insira|\[preencher/i;
const PLACEHOLDER_RE = { test: (s) => PLACEHOLDER_ACRONYM_RE.test(s) || PLACEHOLDER_PATTERN_RE.test(s) };
const PRICE_RE = /R\$\s?\d/; // preço nunca deve aparecer em peça gerada (nunca inventado, nunca lido de fonte confiável aqui)
const URL_RE = /^https:\/\/smartpetgadgets\.com\.br\//;

function normalizeWords(str) {
  return new Set(
    str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length >= 3)
  );
}

/** Sobreposição de palavras (interseção / menor conjunto) — mais tolerante que substring exata, ainda assim exige que o texto gerado realmente venha do vocabulário da fonte. */
function wordOverlapRatio(a, b) {
  const wa = normalizeWords(a);
  const wb = normalizeWords(b);
  if (wa.size === 0 || wb.size === 0) return 0;
  let inter = 0;
  for (const w of wa) if (wb.has(w)) inter++;
  return inter / Math.min(wa.size, wb.size);
}

function checkPiece(piece, { article }) {
  const checks = [];

  const push = (name, ok, note) => checks.push({ name, ok, note });

  // Peças já marcadas insufficient_source pelo gerador não passam por todos
  // os checks de conteúdo (não têm conteúdo) — só confirma rastreabilidade.
  if (piece.status === 'insufficient_source') {
    push('possui artigo de origem', !!piece.source_article, piece.source_article);
    push('possui URL válida', URL_RE.test(piece.source_url || ''), piece.source_url);
    push('motivo de insuficiência documentado', !!piece.reason, piece.reason);
    return { checks, passed: checks.every((c) => c.ok), status: 'insufficient_source' };
  }

  push('possui artigo de origem', !!piece.source_article, piece.source_article);
  push('possui URL válida', URL_RE.test(piece.source_url || ''), piece.source_url);

  const textFields = Object.values(piece).filter((v) => typeof v === 'string');
  const allText = textFields.join(' ') + JSON.stringify(piece);
  push('não contém placeholder', !PLACEHOLDER_RE.test(allText), null);
  push('não contém preço (nunca inventado nem citado em peça social)', !PRICE_RE.test(allText), null);

  // Pergunta de engajamento (item 8) não exige CTA explícito por natureza do
  // formato — o objetivo é comentário, não clique; os demais formatos exigem.
  const isEngagementQuestion = 'pergunta' in piece;
  const hasCta = isEngagementQuestion || 'cta' in piece || (piece.conteudo && /leia|confira|veja|arraste/i.test(piece.conteudo)) || piece.tipo === 'enquete';
  push('possui CTA (quando aplicável ao formato)', hasCta, null);

  // Traceability de conteúdo: todo texto "criativo" (hook, legenda, pergunta,
  // slide) deve ser rastreável a um dos 4 campos-fonte do artigo (title,
  // meta_description, headings, question_headings) — não uma prova
  // criptográfica, mas uma checagem de que não há strings soltas fora do
  // vocabulário-fonte nos campos mais sensíveis (hook/pergunta/titulo).
  const sourcePool = [article.title, article.meta_description, ...article.headings.map((h) => h.text)];
  const creativeFields = [piece.hook, piece.pergunta, piece.titulo_gatilho, piece.conteudo].filter(Boolean);
  const traceable = creativeFields.every((f) => sourcePool.some((s) => s && wordOverlapRatio(f, s) >= 0.4));
  push('conteúdo criativo rastreável a title/meta_description/headings da fonte', traceable, null);

  const passed = checks.every((c) => c.ok);
  return { checks, passed, status: passed ? 'generated' : 'needs_review' };
}

function runQualityGate(article, content) {
  const results = {};
  for (const [key, arr] of Object.entries(content)) {
    results[key] = arr.map((piece) => {
      const { checks, passed, status } = checkPiece(piece, { article });
      return { ...piece, quality_checks: checks, quality_passed: passed, status };
    });
  }
  return results;
}

module.exports = { checkPiece, runQualityGate, PLACEHOLDER_RE, PRICE_RE, URL_RE, wordOverlapRatio, normalizeWords };
