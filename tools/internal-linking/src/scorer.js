'use strict';

const { weightedOverlapCoefficient, sharedTermsWeighted } = require('../../shared/semantic-terms');
const { detectFormat, relationshipType, FORMATS } = require('../../shared/format-classifier');

/**
 * Pesos do score de relação (0-100), documentados aqui em vez de
 * espalhados no código. Cada componente é um overlap PONDERADO (0-1,
 * ver tools/shared/semantic-terms.js) multiplicado pelo peso; a soma
 * final é arredondada para 0-100.
 *
 * Critério de escolha dos pesos (heurístico, não calibrado
 * estatisticamente — documentado como tal):
 *  - TITLE (30) e HEADING (25) pesam mais porque refletem do que a página
 *    trata DE FATO (sinal editorial explícito), não só menções incidentais.
 *  - CONTENT (20) pesa menos que title/heading porque o corpo do texto é
 *    muito mais longo e ruidoso.
 *  - SLUG (10) é um sinal fraco mas barato e confiável quando presente.
 *  - CLUSTER (15) é um bônus binário: só soma se os dois posts tiverem o
 *    mesmo `cluster` não-nulo. Hoje `cluster` é sempre null no
 *    site-index.json real (ver limitação documentada em
 *    tools/site-indexer/README.md), então este componente não contribui
 *    nada na validação com os 72 posts reais — mantido no código para
 *    quando o campo for populado futuramente.
 *  - PILLAR_SATELLITE (10, Fase 3.1): bônus binário adicional quando o
 *    classificador de formato compartilhado (tools/shared/format-
 *    classifier.js) identifica uma relação pilar↔satélite entre origem e
 *    destino — esse é justamente o tipo de link que mais vale a pena
 *    sugerir (conteúdo complementar dentro do mesmo cluster editorial),
 *    então reforça o score em vez de deixar depender só de overlap textual.
 * Overlap ponderado (não bruto) resolve o falso positivo em que duas
 * páginas-pilar sem relação real (ex: coleira GPS vs. comedouro
 * automático) recebiam score inflado só por compartilharem frases padrão
 * como "Guia Completo 2026" — ver histórico da Fase 3.1.
 */
const WEIGHTS = Object.freeze({
  TITLE: 30,
  HEADING: 25,
  CONTENT: 20,
  SLUG: 10,
  CLUSTER: 15,
  PILLAR_SATELLITE: 10,
});

/**
 * Guarda de segurança para o bônus PILLAR_SATELLITE (achado real na
 * validação da Fase 3.1): sem essa guarda, o bônus sozinho "resgatava"
 * pares SEM relação temática real — ex: `coleira-gps-para-pet` (pilar do
 * cluster de coleira) → `melhor-comedouro-interativo-gato` (satélite do
 * cluster de comedouro, tema totalmente diferente) cruzava o MIN_SCORE só
 * por causa do bônus de +10, mesmo com overlap textual de base fraco
 * (32.5/100, abaixo do próprio MIN_SCORE do módulo). O bônus deve
 * REFORÇAR pares que já têm relação textual real, nunca criar uma
 * sugestão que não existiria sem ele. `PILLAR_SATELLITE_MIN_BASE` usa o
 * mesmo valor do `MIN_SCORE` do analyzer (35) — documentado aqui de forma
 * independente para não acoplar scorer.js a analyzer.js.
 */
const PILLAR_SATELLITE_MIN_BASE = 35;

/**
 * Calcula o score de relação (0-100) entre dois perfis de página (ver
 * shared/profile.js) e retorna também o detalhamento por componente.
 * `postA`/`postB` (registros do site-index.json) e `contextA`/`contextB`
 * (`{ inboundCount }`) são usados só para o classificador de formato —
 * ver tools/shared/format-classifier.js.
 */
function scoreRelation(profileA, profileB, postA, postB, contextA = {}, contextB = {}) {
  const titleOverlap = weightedOverlapCoefficient(profileA.titleTerms, profileB.titleTerms);
  const headingOverlap = weightedOverlapCoefficient(profileA.headingTerms, profileB.headingTerms);
  const contentOverlap = weightedOverlapCoefficient(profileA.contentTerms, profileB.contentTerms);
  const slugOverlap = weightedOverlapCoefficient(profileA.slugTerms, profileB.slugTerms);
  const sameCluster = Boolean(profileA.cluster) && profileA.cluster === profileB.cluster;

  const formatA = detectFormat(postA, contextA);
  const formatB = detectFormat(postB, contextB);
  const relationship = relationshipType(formatA, formatB);

  const baseScore = titleOverlap * WEIGHTS.TITLE + headingOverlap * WEIGHTS.HEADING + contentOverlap * WEIGHTS.CONTENT + slugOverlap * WEIGHTS.SLUG + (sameCluster ? WEIGHTS.CLUSTER : 0);
  const isPillarSatellite = relationship === 'pillar_satellite' && baseScore >= PILLAR_SATELLITE_MIN_BASE;

  const components = {
    title: { overlap: titleOverlap, weight: WEIGHTS.TITLE, contribution: titleOverlap * WEIGHTS.TITLE },
    heading: { overlap: headingOverlap, weight: WEIGHTS.HEADING, contribution: headingOverlap * WEIGHTS.HEADING },
    content: { overlap: contentOverlap, weight: WEIGHTS.CONTENT, contribution: contentOverlap * WEIGHTS.CONTENT },
    slug: { overlap: slugOverlap, weight: WEIGHTS.SLUG, contribution: slugOverlap * WEIGHTS.SLUG },
    cluster: { overlap: sameCluster ? 1 : 0, weight: WEIGHTS.CLUSTER, contribution: sameCluster ? WEIGHTS.CLUSTER : 0 },
    pillar_satellite: { overlap: isPillarSatellite ? 1 : 0, weight: WEIGHTS.PILLAR_SATELLITE, contribution: isPillarSatellite ? WEIGHTS.PILLAR_SATELLITE : 0 },
  };

  const rawScore = Object.values(components).reduce((sum, c) => sum + c.contribution, 0);
  const score = Math.round(Math.min(100, Math.max(0, rawScore)));

  return { score, components, formatA, formatB, relationship };
}

/**
 * Monta a lista de "evidências" legíveis para uma sugestão, a partir dos
 * componentes do score — só inclui um sinal na lista se ele realmente
 * contribuiu (overlap > 0), evitando evidências vazias/enganosas.
 */
function buildEvidence(profileA, profileB, components) {
  const evidence = [];

  if (components.title.overlap > 0) {
    const shared = sharedTermsWeighted(profileA.titleTerms, profileB.titleTerms, 3);
    if (shared.length > 0) evidence.push(`título compartilha termo(s): ${shared.join(', ')}`);
  }
  if (components.heading.overlap > 0) {
    const shared = sharedTermsWeighted(profileA.headingTerms, profileB.headingTerms, 3);
    if (shared.length > 0) evidence.push(`headings compartilham termo(s): ${shared.join(', ')}`);
  }
  if (components.content.overlap > 0) {
    const shared = sharedTermsWeighted(profileA.contentTerms, profileB.contentTerms, 3);
    if (shared.length > 0) evidence.push(`conteúdo compartilha termo(s): ${shared.join(', ')}`);
  }
  if (components.slug.overlap > 0) {
    const shared = sharedTermsWeighted(profileA.slugTerms, profileB.slugTerms, 3);
    if (shared.length > 0) evidence.push(`slug compartilha termo(s): ${shared.join(', ')}`);
  }
  if (components.cluster.overlap > 0) {
    evidence.push(`mesmo cluster: "${profileA.cluster}"`);
  }
  if (components.pillar_satellite.overlap > 0) {
    evidence.push('relação pilar↔satélite identificada — conteúdo complementar dentro do mesmo cluster editorial');
  }

  return evidence;
}

module.exports = { WEIGHTS, scoreRelation, buildEvidence };
