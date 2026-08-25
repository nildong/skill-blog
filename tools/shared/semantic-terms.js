'use strict';

/**
 * Camada de PESO editorial sobre os termos já extraídos por terms.js.
 * Resolve o falso positivo "frases padrão inflam similaridade entre
 * páginas não relacionadas" (ex: "Guia Completo 2026" aparecendo em
 * quase todo título de pilar do site) — ver V2-ARCHITECTURE-AUDIT.md e o
 * histórico da Fase 3.1.
 *
 * Termos genéricos/editoriais continuam CONTANDO (não são removidos como
 * stopwords — podem ter algum valor de busca), mas contribuem pouco para
 * o score de similaridade. Anos (2024, 2025, 2026...) contribuem zero —
 * são sinal temporal/editorial, não sinal de tópico.
 */

const GENERIC_EDITORIAL_TERMS = new Set([
  'guia', 'completo', 'completa', 'melhor', 'melhores', 'vale', 'pena',
  'confira', 'dicas', 'dica', 'tudo', 'sobre', 'escolher', 'review',
  'definitivo', 'definitiva', 'passo', 'passos', 'ideal', 'saiba',
  'conheca', 'descubra', 'top', 'atualizado', 'atualizada', 'novo', 'nova',
  'completo2026', // defensivo — não deve ocorrer após tokenize, mantido caso mude a regra de split
  // Adicionados na Fase 4.1: termos que aparecem em quase todo título do
  // site (é um blog de produtos PET, a maioria "AUTOMÁTICO"), com baixo
  // poder discriminativo NESTE corpus específico — não são stopwords
  // universais do português, mas são "boilerplate" para este nicho.
  // Achado real: "Melhor Alimentador Automático para Gatos: Guia 2026"
  // vs "Melhor Comedouro Automático para Cachorro: Guia 2026" pontuava
  // por "automático" sozinho contribuir ~30% do overlap de título, apesar
  // de "gatos" vs "cachorro" (os termos que realmente diferenciam os dois
  // produtos) serem completamente distintos. Ver histórico da Fase 4.1.
  'pet', 'automatico', 'automatica',
]);

const YEAR_TERM_RE = /^(19|20)\d{2}$/;

/** Pesos documentados (0 = ignora completamente, 1 = peso normal). */
const GENERIC_TERM_WEIGHT = 0.15;
const YEAR_TERM_WEIGHT = 0;
const DEFAULT_TERM_WEIGHT = 1;

function isGenericTerm(term) {
  return GENERIC_EDITORIAL_TERMS.has(term);
}

function isYearTerm(term) {
  return YEAR_TERM_RE.test(term);
}

function termWeight(term) {
  if (isYearTerm(term)) return YEAR_TERM_WEIGHT;
  if (isGenericTerm(term)) return GENERIC_TERM_WEIGHT;
  return DEFAULT_TERM_WEIGHT;
}

function toMap(termsOrMap) {
  return termsOrMap instanceof Map ? termsOrMap : new Map([...termsOrMap].map((t) => [t, 1]));
}

function weightedSize(map) {
  let sum = 0;
  for (const term of map.keys()) sum += termWeight(term);
  return sum;
}

/**
 * Mesma fórmula base de terms.js#overlapCoefficient (|A∩B| / min(|A|,|B|)),
 * mas cada termo contribui de acordo com seu peso editorial (`termWeight`)
 * em vez de contar sempre 1, tanto no numerador (interseção) quanto no
 * denominador (tamanho do conjunto). Um par de páginas que só compartilha
 * termos genéricos/ano tende a 0, mesmo que a interseção "bruta" (sem
 * peso) parecesse grande.
 */
function weightedOverlapCoefficient(termsA, termsB) {
  const mapA = toMap(termsA);
  const mapB = toMap(termsB);
  if (mapA.size === 0 || mapB.size === 0) return 0;

  let intersectionWeight = 0;
  for (const term of mapA.keys()) {
    if (mapB.has(term)) intersectionWeight += termWeight(term);
  }

  const denom = Math.min(weightedSize(mapA), weightedSize(mapB));
  if (denom === 0) return 0; // só havia termos de peso zero (anos) no menor conjunto
  return Math.min(1, intersectionWeight / denom);
}

/**
 * Como sharedTerms() de terms.js, mas prioriza termos com peso > 0
 * (nicho) na ordenação, e só cai para termos genéricos/ano na evidência
 * se não houver nenhum termo de nicho em comum — evita evidências do
 * tipo "termos em comum: guia, completo, 2026" quando não há de fato
 * relação temática.
 */
function sharedTermsWeighted(termsA, termsB, limit = 5) {
  const mapA = toMap(termsA);
  const mapB = toMap(termsB);
  const shared = [];
  for (const [term, freqA] of mapA) {
    if (mapB.has(term)) shared.push({ term, weight: termWeight(term), score: (freqA + mapB.get(term)) * (termWeight(term) || 0.01) });
  }

  const meaningful = shared.filter((s) => s.weight > 0);
  const pool = meaningful.length > 0 ? meaningful : shared;
  pool.sort((a, b) => b.score - a.score);
  return pool.slice(0, limit).map((s) => s.term);
}

module.exports = {
  GENERIC_EDITORIAL_TERMS,
  YEAR_TERM_RE,
  GENERIC_TERM_WEIGHT,
  YEAR_TERM_WEIGHT,
  DEFAULT_TERM_WEIGHT,
  isGenericTerm,
  isYearTerm,
  termWeight,
  weightedOverlapCoefficient,
  sharedTermsWeighted,
};
