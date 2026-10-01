'use strict';

/**
 * enrichment.js — FASE 2, arquivo NOVO.
 *
 * Classifica cada peça-fonte (já aprovada pelo quality-gate-v2, nunca
 * inventa fato novo) em um dos 16 TIPOS abaixo, a partir de padrões
 * determinísticos no texto/estrutura já existente na peça. A ordem das
 * regras importa: a primeira regra que casar decide o TIPO (mais
 * específica -> mais genérica). Nenhuma regra lê nada fora do que já
 * está na peça (hook, cta, pergunta, roteiro, legenda, slides, tipo
 * de story, hashtags).
 *
 * TIPOS e regra de disparo (nesta ordem de prioridade):
 *  1. ENQUETE          — formato 'stories' com tipo/campo 'opcoes' (enquete real) presente
 *  2. CTA_ARTIGO        — formato 'stories' cujo conteúdo é o template fixo
 *                         "Arraste para cima e leia" / cta de link para o artigo
 *  3. PERGUNTA          — formato 'engagement' (pergunta de engajamento) OU hook/pergunta
 *                         termina em "?" e não casa com MITO_OU_VERDADE/COMPARACAO/ALERTA
 *  4. MITO_OU_VERDADE   — texto contém "mito" ou "verdade" (case-insensitive)
 *  5. ERRO_COMUM        — texto contém "erro comum", "erro mais comum", "não cometa esse erro"
 *  6. ALERTA            — texto contém "atenção", "cuidado", "risco", "nunca faça"
 *  7. COMPARACAO        — formato 'carousel' com >=2 slides comparando A x B, OU texto contém
 *                         " x " entre dois termos, "comparado a", "diferença entre"
 *  8. LISTA             — formato 'carousel' (slides numerados) ou texto com "passos",
 *                         "dicas:", enumeração numérica (1., 2., 3.)
 *  9. IDENTIFICACAO_PET — hook/legenda menciona sinais/comportamento do pet ("seu gato",
 *                         "seu cão" + "recusa"/"sinal"/"comportamento")
 * 10. VOCE_SABIA        — texto contém "você sabia" ou dado numérico/estatística citada
 *                         (regex de %, "segundo", "censo", "pesquisa")
 * 11. CURIOSIDADE       — texto contém "curiosidade", "sabia que", ou objetivo == 'curiosidade'
 * 12. DICA_PRATICA      — objetivo contém 'educar' e formato 'post', ou texto contém "dica"
 * 13. PROBLEMA_SOLUCAO  — peça tem campo roteiro.problema (formato 'reel' com estrutura
 *                         problema->informação->solução)
 * 14. AUTORIDADE        — texto cita "review", "testamos", "avaliação", "especificação"
 * 15. OPINIAO           — texto começa com afirmação de opinião ("na nossa avaliação",
 *                         "recomendamos", "vale a pena")
 * 16. HUMOR_LEVE        — presença de emoji de humor (😂🤣) — fallback raro
 *
 * Se nenhuma regra específica casar, cai no fallback por formato:
 *  reel -> PROBLEMA_SOLUCAO, post -> DICA_PRATICA, carousel -> LISTA,
 *  stories -> CTA_ARTIGO, engagement -> PERGUNTA.
 *
 * Nunca reformula o texto da peça — apenas anota `tipo` e `tipo_regra`
 * (qual regra decidiu, para auditoria humana).
 */

const TIPOS = [
  'CURIOSIDADE', 'ERRO_COMUM', 'DICA_PRATICA', 'MITO_OU_VERDADE', 'COMPARACAO',
  'PERGUNTA', 'ENQUETE', 'OPINIAO', 'PROBLEMA_SOLUCAO', 'LISTA', 'ALERTA',
  'VOCE_SABIA', 'IDENTIFICACAO_PET', 'HUMOR_LEVE', 'AUTORIDADE', 'CTA_ARTIGO',
];

function textOf(piece) {
  const parts = [
    piece.hook, piece.pergunta, piece.titulo_gatilho, piece.legenda, piece.cta,
    piece.conteudo, piece.objetivo,
  ];
  if (piece.roteiro) parts.push(piece.roteiro.problema, piece.roteiro.informacao, piece.roteiro.solucao);
  if (Array.isArray(piece.slides)) parts.push(...piece.slides.map((s) => (typeof s === 'string' ? s : s.texto || s.titulo || '')));
  return parts.filter(Boolean).join(' \n ');
}

function classifyPiece(piece) {
  const text = textOf(piece);
  const lower = text.toLowerCase();
  const formato = piece.formato;

  // 1. ENQUETE
  if (formato === 'stories' && piece.tipo === 'enquete' && piece.opcoes) {
    return { tipo: 'ENQUETE', tipo_regra: 'stories tipo=enquete com opcoes' };
  }

  // 2. CTA_ARTIGO
  if (formato === 'stories' && (piece.tipo === 'cta' || /arraste para cima|leia o artigo completo/i.test(lower))) {
    return { tipo: 'CTA_ARTIGO', tipo_regra: 'stories tipo=cta / template arraste-para-cima' };
  }

  // 3. PERGUNTA
  if (formato === 'engagement') {
    return { tipo: 'PERGUNTA', tipo_regra: 'formato engagement' };
  }
  const endsWithQuestion = /\?\s*$/.test((piece.hook || piece.pergunta || '').trim());

  // 4. MITO_OU_VERDADE
  if (/\bmito\b|\bverdade\b/i.test(lower)) {
    return { tipo: 'MITO_OU_VERDADE', tipo_regra: 'menção a mito/verdade' };
  }

  // 5. ERRO_COMUM
  if (/erro comum|erro mais comum|não cometa esse erro|erros comuns/i.test(lower)) {
    return { tipo: 'ERRO_COMUM', tipo_regra: 'menção a erro comum' };
  }

  // 6. ALERTA
  if (/\batenção\b|\bcuidado\b|\brisco\b|nunca faça/i.test(lower)) {
    return { tipo: 'ALERTA', tipo_regra: 'menção a atenção/cuidado/risco' };
  }

  // 7. COMPARACAO
  const hasXComparison = / x |comparad[oa] a|diferença entre/i.test(lower);
  if ((formato === 'carousel' && Array.isArray(piece.slides) && piece.slides.length >= 2 && hasXComparison) || hasXComparison) {
    return { tipo: 'COMPARACAO', tipo_regra: 'padrão comparativo (" x ", "diferença entre")' };
  }

  // 8. LISTA
  if (formato === 'carousel' || /\bpassos\b|\bdicas:|\b1\.[^\d]|\b2\.[^\d]/i.test(text)) {
    return { tipo: 'LISTA', tipo_regra: 'formato carousel / enumeração' };
  }

  // 9. IDENTIFICACAO_PET
  if (/(seu gato|seu cão|seu cachorro).*(recusa|sinal|comportamento)/i.test(lower)) {
    return { tipo: 'IDENTIFICACAO_PET', tipo_regra: 'menção a sinal/comportamento do pet' };
  }

  // 10. VOCE_SABIA
  if (/você sabia/i.test(lower) || /%|\bsegundo\b|\bcenso\b|\bpesquisa\b|\bibge\b/i.test(lower)) {
    return { tipo: 'VOCE_SABIA', tipo_regra: 'estatística/dado citado ou "você sabia"' };
  }

  // 11. CURIOSIDADE
  if (/curiosidade|sabia que/i.test(lower) || piece.objetivo === 'curiosidade') {
    return { tipo: 'CURIOSIDADE', tipo_regra: 'menção a curiosidade / objetivo curiosidade' };
  }

  // 12. DICA_PRATICA
  if ((piece.objetivo || '').includes('educar') || /\bdica\b/i.test(lower)) {
    return { tipo: 'DICA_PRATICA', tipo_regra: 'objetivo educar ou menção a dica' };
  }

  // 13. PROBLEMA_SOLUCAO
  if (piece.roteiro && piece.roteiro.problema) {
    return { tipo: 'PROBLEMA_SOLUCAO', tipo_regra: 'peça reel com roteiro problema->informação->solução' };
  }

  // 14. AUTORIDADE
  if (/\breview\b|testamos|avaliação|especificaç/i.test(lower)) {
    return { tipo: 'AUTORIDADE', tipo_regra: 'menção a review/teste/especificação' };
  }

  // 15. OPINIAO
  if (/na nossa avaliação|recomendamos|vale a pena/i.test(lower)) {
    return { tipo: 'OPINIAO', tipo_regra: 'afirmação de opinião/recomendação' };
  }

  // 16. HUMOR_LEVE
  if (/[\u{1F602}\u{1F923}]/u.test(text)) {
    return { tipo: 'HUMOR_LEVE', tipo_regra: 'emoji de humor' };
  }

  if (endsWithQuestion) {
    return { tipo: 'PERGUNTA', tipo_regra: 'hook termina em "?" sem outro marcador' };
  }

  const fallback = { reel: 'PROBLEMA_SOLUCAO', post: 'DICA_PRATICA', carousel: 'LISTA', stories: 'CTA_ARTIGO', engagement: 'PERGUNTA' };
  return { tipo: fallback[formato] || 'DICA_PRATICA', tipo_regra: `fallback por formato (${formato})` };
}

function enrichPieces(pieces) {
  return pieces.map((piece) => ({ ...piece, ...classifyPiece(piece) }));
}

module.exports = { TIPOS, classifyPiece, enrichPieces, textOf };
