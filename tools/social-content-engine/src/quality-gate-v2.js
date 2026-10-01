'use strict';

/**
 * Quality gate V2 — camada adicional ao quality-gate.js original (V1),
 * que permanece intocado e continua sendo a barreira determinística
 * final para peças V1 (heading -> template).
 *
 * V2 muda a fonte de rastreabilidade: em vez de gancho = heading
 * disponível, o gancho passa a ser "a informação mais específica/útil
 * do corpo do artigo" (decisão editorial, feita por leitura de
 * `body_text_full`). Isso quebra a checagem de overlap de vocabulário
 * contra title/meta/headings do V1 (o fato citado pode não aparecer em
 * nenhum heading), então a V2 exige que cada peça declare
 * explicitamente sua origem, verificável de forma determinística:
 *
 *   piece.source = {
 *     article_slug,      // deve bater com o artigo sendo processado
 *     source_type,        // 'body_fact' | 'heading' | 'faq_question' | 'title' | 'meta_description'
 *     source_excerpt,      // trecho LITERAL (substring) de article.body_text_full
 *     section,             // opcional: heading/seção mais próxima do excerpt, para contexto humano
 *   }
 *
 * O overlap lexical do V1 (wordOverlapRatio) continua calculado como
 * segunda camada de segurança / sinal informativo, mas NÃO é mais a
 * única prova de rastreabilidade — deixa de ser bloqueante sozinho.
 *
 * Princípio mantido (nunca muda entre V1 e V2): nenhuma peça pode
 * inventar especificação, preço, avaliação, estatística ou produto que
 * não esteja no artigo. Aqui isso é reforçado: se o excerpt declarado
 * não existe literalmente no corpo do artigo, a peça falha o gate —
 * não é só "parece plausível", é "existe, verificado por substring".
 */

const {
  PLACEHOLDER_RE,
  PRICE_RE,
  URL_RE,
  wordOverlapRatio,
} = require('./quality-gate');

const ALLOWED_SOURCE_TYPES = new Set(['body_fact', 'heading', 'faq_question', 'title', 'meta_description']);

/** Normaliza espaços/aspas para tolerar diferenças de encoding entre o texto extraído e o excerpt digitado à mão, sem afrouxar a exigência de que o trecho exista de fato. */
function normalizeForSubstringMatch(str) {
  return str
    .normalize('NFKC')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function excerptExistsInBody(excerpt, bodyTextFull) {
  if (!excerpt || !bodyTextFull) return false;
  const normExcerpt = normalizeForSubstringMatch(excerpt);
  const normBody = normalizeForSubstringMatch(bodyTextFull);
  return normBody.includes(normExcerpt);
}

function checkPieceV2(piece, { article }) {
  const checks = [];
  const push = (name, ok, note) => checks.push({ name, ok, note });

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

  const isEngagementQuestion = 'pergunta' in piece;
  const hasCta = isEngagementQuestion || 'cta' in piece || (piece.conteudo && /leia|confira|veja|arraste/i.test(piece.conteudo)) || piece.tipo === 'enquete';
  push('possui CTA (quando aplicável ao formato)', hasCta, null);

  // --- Rastreabilidade V2: fonte explícita, verificada por substring literal ---
  const source = piece.source || null;
  push('possui objeto source declarado', !!source, source ? null : 'peça V2 sem piece.source — obrigatório');

  if (source) {
    push('source.article_slug bate com o artigo processado', source.article_slug === article.slug, `${source.article_slug} vs ${article.slug}`);
    push('source.source_type é um valor permitido', ALLOWED_SOURCE_TYPES.has(source.source_type), source.source_type || null);
    push('source.source_excerpt não vazio', typeof source.source_excerpt === 'string' && source.source_excerpt.trim().length >= 15, null);

    const excerptFound = typeof source.source_excerpt === 'string' && excerptExistsInBody(source.source_excerpt, article.body_text_full);
    push('source.source_excerpt existe literalmente em body_text_full (verificado por substring)', excerptFound,
      excerptFound ? null : 'trecho declarado não encontrado no corpo do artigo — possível invenção ou paráfrase não permitida');
  }

  // --- Overlap lexical: segunda camada, informativa, NÃO bloqueante sozinha ---
  const creativeFields = [piece.hook, piece.pergunta, piece.titulo_gatilho, piece.legenda, piece.conteudo].filter(Boolean);
  const bodyOverlap = creativeFields.length
    ? Math.max(...creativeFields.map((f) => wordOverlapRatio(f, article.body_text_full)))
    : 0;
  checks.push({
    name: 'overlap lexical com o corpo do artigo (informativo, não bloqueante)',
    ok: true,
    note: `${(bodyOverlap * 100).toFixed(0)}%`,
    informational: true,
  });

  // Checks bloqueantes são todos exceto os marcados informational.
  const blocking = checks.filter((c) => !c.informational);
  const passed = blocking.every((c) => c.ok);
  return { checks, passed, status: passed ? 'generated' : 'needs_review' };
}

function runQualityGateV2(article, content) {
  const results = {};
  for (const [key, arr] of Object.entries(content)) {
    results[key] = arr.map((piece) => {
      const { checks, passed, status } = checkPieceV2(piece, { article });
      return { ...piece, quality_checks: checks, quality_passed: passed, status };
    });
  }
  return results;
}

module.exports = { checkPieceV2, runQualityGateV2, excerptExistsInBody, ALLOWED_SOURCE_TYPES };
