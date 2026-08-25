'use strict';

/**
 * Pesos do score de oportunidade (0-100), documentados — cada componente
 * tem um teto (peso máximo) e contribui de 0 até esse teto. Nenhum peso é
 * "mágico"; a justificativa de cada um está no comentário correspondente.
 * Soma dos tetos = 100.
 */
const WEIGHTS = Object.freeze({
  IMPACT: 30, // potencial de impacto em SEO/experiência se a ação for tomada
  STRATEGIC_VALUE: 25, // importância estrutural da página no site (pilar > satélite > institucional)
  EVIDENCE: 20, // quantidade/força dos sinais locais que sustentam a recomendação
  CONFIDENCE: 15, // qualidade da evidência (ver CONFIDENCE_POINTS abaixo)
  EFFORT: 10, // facilidade relativa de execução — quanto mais fácil, maior a contribuição (favorece "quick wins")
});

const CONFIDENCE_POINTS = Object.freeze({ HIGH: 15, MEDIUM: 9, LOW: 4 });

/**
 * Custo de esforço relativo por tipo de oportunidade (documentado,
 * heurístico): quanto MENOR o esforço necessário, MAIOR a contribuição no
 * score (favorece "quick wins" antes de trabalho pesado como escrever um
 * artigo novo do zero).
 */
const EFFORT_POINTS_BY_TYPE = Object.freeze({
  IMPROVE_INTERNAL_LINKING: 10, // só adicionar link(s), menor esforço possível
  IMPROVE_FAQ: 8, // adicionar/ajustar bloco de FAQ + schema
  UPDATE_EXISTING: 6, // correções pontuais (title, meta, schema, alt)
  DIFFERENTIATE_CONTENT: 5, // revisão editorial de título/escopo, sem reescrever tudo
  EXPAND_EXISTING: 4, // exige escrita de conteúdo adicional
  NEW_CONTENT: 2, // maior esforço: artigo inteiro do zero
  NO_ACTION: 0,
});

/**
 * Score de IMPACT (0-30): baseado na severidade dos problemas envolvidos
 * e no tipo de oportunidade. `severityWeight` é o maior peso de
 * severidade entre as evidências (CRITICAL=1, ERROR=0.8, WARNING=0.5,
 * INFO=0.25, ausência de severidade=0.4 default).
 */
const SEVERITY_WEIGHT = Object.freeze({ CRITICAL: 1, ERROR: 0.8, WARNING: 0.5, INFO: 0.25 });

function scoreImpact(severities) {
  if (!severities || severities.length === 0) return WEIGHTS.IMPACT * 0.4;
  const max = Math.max(...severities.map((s) => SEVERITY_WEIGHT[s] ?? 0.4));
  return Math.round(WEIGHTS.IMPACT * max);
}

/**
 * Score de STRATEGIC_VALUE (0-25): páginas PILLAR valem o máximo (são o
 * hub do cluster); páginas com muitos links de entrada (importância
 * medida pela própria arquitetura do site) valem mais que páginas
 * isoladas; institucionais valem o mínimo (não são o foco editorial).
 */
function scoreStrategicValue(page) {
  if (!page) return Math.round(WEIGHTS.STRATEGIC_VALUE * 0.3);
  if (page.role === 'PILLAR') return WEIGHTS.STRATEGIC_VALUE;
  if (page.role === 'INSTITUTIONAL') return Math.round(WEIGHTS.STRATEGIC_VALUE * 0.1);

  const inbound = page.inbound_links || 0;
  // Normaliza pelo maior inbound observado nos pilares reais do site
  // (23-47, ver tools/shared/format-classifier.js) — um satélite com
  // inbound >= 10 já é considerado bem conectado (fração alta).
  const fraction = Math.min(1, inbound / 15);
  return Math.round(WEIGHTS.STRATEGIC_VALUE * (0.2 + 0.6 * fraction));
}

function scoreEvidence(evidenceList) {
  if (!evidenceList || evidenceList.length === 0) return 0;
  // satura em 4+ evidências independentes — mais que isso não soma mais
  // (evita inflar score só empilhando sinais redundantes).
  const fraction = Math.min(1, evidenceList.length / 4);
  return Math.round(WEIGHTS.EVIDENCE * fraction);
}

function scoreConfidence(confidence) {
  return CONFIDENCE_POINTS[confidence] ?? CONFIDENCE_POINTS.LOW;
}

function scoreEffort(type) {
  return EFFORT_POINTS_BY_TYPE[type] ?? 0;
}

/**
 * Monta o score_breakdown completo e determinístico de uma oportunidade.
 */
function computeScore({ type, severities, page, evidenceList, confidence }) {
  const impact = scoreImpact(severities);
  const strategic_value = scoreStrategicValue(page);
  const evidence = scoreEvidence(evidenceList);
  const confidenceScore = scoreConfidence(confidence);
  const effort = scoreEffort(type);
  const total = impact + strategic_value + evidence + confidenceScore + effort;

  return { impact, strategic_value, evidence, confidence: confidenceScore, effort, total };
}

module.exports = { WEIGHTS, CONFIDENCE_POINTS, SEVERITY_WEIGHT, EFFORT_POINTS_BY_TYPE, scoreImpact, scoreStrategicValue, scoreEvidence, scoreConfidence, scoreEffort, computeScore };
