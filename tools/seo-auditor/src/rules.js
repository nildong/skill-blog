'use strict';

/**
 * Severidades — significado (documentado conforme exigido pelo prompt da Fase 2):
 *
 *  CRITICAL  Página essencialmente quebrada/inutilizável para SEO (ex: sem
 *            conteúdo nenhum). Deve ser corrigida antes de qualquer outra coisa.
 *  ERROR     Problema técnico objetivo, com evidência clara, que
 *            provavelmente prejudica indexação, ranqueamento ou UX.
 *            Não é "opinião" — é um fato verificável no HTML/índice.
 *  WARNING   Desvio de uma boa prática recomendada, mas não uma quebra
 *            objetiva. Vale corrigir, não é urgente.
 *  INFO      Oportunidade de melhoria ou observação neutra. Nunca implica
 *            que a página está "errada" — apenas que há espaço para evoluir.
 *
 * Regra geral desta fase: quando uma regra não pode determinar com certeza
 * que algo é um problema, ela classifica como WARNING ou INFO, nunca ERROR/
 * CRITICAL (ver seção "Qualidade dos Resultados" do prompt da Fase 2).
 */
const SEVERITY = Object.freeze({
  CRITICAL: 'CRITICAL',
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  INFO: 'INFO',
});

const CATEGORIES = Object.freeze([
  'technical',
  'metadata',
  'headings',
  'content',
  'internal_links',
  'images',
  'media',
  'schema',
  'faq',
  'site_structure',
]);

/**
 * Thresholds usados pelas regras — todos documentados aqui em um único
 * lugar para facilitar auditoria/ajuste futuro. Nenhum threshold é tratado
 * como "penalização garantida pelo Google"; são heurísticas conservadoras
 * usadas apenas para classificar severidade.
 */
const THRESHOLDS = Object.freeze({
  TITLE_MIN_LEN: 15,
  TITLE_MAX_LEN: 60,
  DESCRIPTION_MIN_LEN: 50,
  DESCRIPTION_MAX_LEN: 160,
  // Contagem de palavras — tratada como SINAL quantitativo, não como
  // julgamento de qualidade (ver checks/content.js). Faixas ajustadas após
  // revisão manual dos 12 casos originalmente marcados WARNING com o
  // threshold antigo (400 único) — a maioria estava a poucas dezenas de
  // palavras do limite, com estrutura de 4-5 H2, e não representava
  // "conteúdo raso" de fato. Três faixas, severidade decrescente com o
  // tamanho:
  CONTENT_CRITICAL_WORDS: 0, // página literalmente vazia
  CONTENT_ERROR_WORDS: 150, // abaixo disso: CONTENT_EXTREMELY_SHORT (ERROR)
  CONTENT_WARNING_WORDS: 300, // [150, 300): CONTENT_SHORT (WARNING)
  CONTENT_INFO_WORDS: 400, // [300, 400): CONTENT_BRIEF (INFO, oportunidade — não erro)
  // >= 400: nenhum issue de comprimento.
  // Estrutura de heading — só INFO, nunca erro, por si só.
  THIN_H2_COUNT: 2, // posts com <= esse número de H2 viram INFO de oportunidade
  // Links internos
  LOW_INTERNAL_LINKS: 3, // <= esse número vira INFO "poucos links de saída"
  // Imagens
  HIGH_IMAGE_COUNT_INFO: 15, // acima disso, INFO de "revisar contexto"
});

/**
 * Tipos de página que este auditor reconhece (vêm de site-index.json,
 * campo page_type — ver tools/site-indexer). Usado para não penalizar
 * páginas institucionais com regras pensadas para posts.
 */
const PAGE_TYPES = Object.freeze({
  HOME: 'home',
  POST: 'post',
  INSTITUTIONAL: 'institutional',
  AUTHOR: 'author',
});

function makeIssue({ id, category, severity, evidence, recommendation }) {
  if (!CATEGORIES.includes(category)) {
    throw new Error(`Categoria desconhecida: ${category}`);
  }
  if (!Object.values(SEVERITY).includes(severity)) {
    throw new Error(`Severidade desconhecida: ${severity}`);
  }
  return { id, category, severity, evidence, recommendation };
}

module.exports = { SEVERITY, CATEGORIES, THRESHOLDS, PAGE_TYPES, makeIssue };
