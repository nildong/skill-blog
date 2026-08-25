'use strict';

const { weightedOverlapCoefficient, sharedTermsWeighted } = require('../../shared/semantic-terms');
const { detectFormat, relationshipType, FORMATS } = require('../../shared/format-classifier');

// Mesmo padrão usado internamente por format-classifier.js para detectar
// COMPARISON — reexposto aqui só como sinal textual direto (independe do
// relationshipType, que já cobre o caso em que um dos lados É do formato
// comparison; isto cobre o caso mais raro de um título comparativo cujo
// formato dominante acabou classificado de outra forma).
const COMPARISON_TITLE_RE = /\b(vs\.?|ou)\b/i;

/**
 * Pesos do score de possível canibalização (0-100), documentados.
 * TITLE e SLUG pesam mais (sinal mais direto de "para qual busca esta
 * página foi otimizada"); CONTENT pesa menos (dois posts do mesmo nicho
 * compartilham muito vocabulário sem necessariamente disputar a mesma
 * query). Todos os componentes usam overlap PONDERADO
 * (tools/shared/semantic-terms.js) — termos genéricos/editoriais ("guia",
 * "completo", "melhor"...) e anos contam pouco ou nada, resolvendo o
 * falso positivo de páginas não relacionadas inflando score só por
 * compartilhar frases padrão (ver histórico da Fase 3.1).
 */
const WEIGHTS = Object.freeze({
  TITLE: 35,
  SLUG: 20,
  HEADING: 20,
  CONTENT: 25,
});

/**
 * Thresholds de classificação (0-100), heurísticos — nunca certeza
 * absoluta, por isso o vocabulário do módulo inteiro usa "possível
 * canibalização", nunca "é canibalização".
 */
const LEVELS = Object.freeze({
  LOW: { min: 0, max: 39, label: 'low' },
  POSSIBLE: { min: 40, max: 69, label: 'possible' },
  HIGH: { min: 70, max: 100, label: 'high' },
  // Não é uma faixa numérica — é uma reclassificação aplicada quando a
  // relação de formato indica pilar↔satélite (ver relationshipType).
  COMPLEMENTARY: { label: 'complementary' },
});

function classify(score) {
  if (score >= LEVELS.HIGH.min) return LEVELS.HIGH.label;
  if (score >= LEVELS.POSSIBLE.min) return LEVELS.POSSIBLE.label;
  return LEVELS.LOW.label;
}

/**
 * Calcula o score de possível canibalização entre dois perfis de página,
 * classifica o nível de risco e — a mudança central da Fase 3.1 — usa o
 * classificador de formato compartilhado para detectar quando o par é uma
 * relação pilar↔satélite. Nesse caso, `level` vira `'complementary'`
 * mesmo que o score numérico esteja na faixa HIGH/POSSIBLE — o score
 * continua exposto e visível (não escondido/descontado silenciosamente),
 * só a interpretação de risco muda, com a razão explícita no resultado.
 *
 * `postA`/`postB` são os registros do site-index.json (não os "profiles"
 * de termos) — necessários aqui para o detectFormat. `contextA`/`contextB`
 * carregam `{ inboundCount }` de cada página, calculado uma vez pelo
 * chamador (ver src/analyzer.js).
 */
function scoreCannibalization(profileA, profileB, postA, postB, contextA = {}, contextB = {}) {
  const titleOverlap = weightedOverlapCoefficient(profileA.titleTerms, profileB.titleTerms);
  const slugOverlap = weightedOverlapCoefficient(profileA.slugTerms, profileB.slugTerms);
  const headingOverlap = weightedOverlapCoefficient(profileA.headingTerms, profileB.headingTerms);
  const contentOverlap = weightedOverlapCoefficient(profileA.contentTerms, profileB.contentTerms);

  const components = {
    title: { overlap: titleOverlap, weight: WEIGHTS.TITLE, contribution: titleOverlap * WEIGHTS.TITLE },
    slug: { overlap: slugOverlap, weight: WEIGHTS.SLUG, contribution: slugOverlap * WEIGHTS.SLUG },
    heading: { overlap: headingOverlap, weight: WEIGHTS.HEADING, contribution: headingOverlap * WEIGHTS.HEADING },
    content: { overlap: contentOverlap, weight: WEIGHTS.CONTENT, contribution: contentOverlap * WEIGHTS.CONTENT },
  };

  const rawScore = Object.values(components).reduce((sum, c) => sum + c.contribution, 0);
  const score = Math.round(Math.min(100, Math.max(0, rawScore)));

  const formatA = detectFormat(postA, contextA);
  const formatB = detectFormat(postB, contextB);
  const relationship = relationshipType(formatA, formatB);

  const differentiationSignals = [];
  if (relationship === 'pillar_satellite') {
    const pillarSide = formatA === FORMATS.PILLAR ? 'A' : 'B';
    const satelliteFormat = formatA === FORMATS.PILLAR ? formatB : formatA;
    differentiationSignals.push(`relação pilar↔satélite (página ${pillarSide} é o pilar; a outra é do formato "${satelliteFormat}") — complementar, não concorrente`);
  } else if (relationship === 'differentiated_satellites') {
    differentiationSignals.push(`formatos editoriais diferentes e específicos ("${formatA}" vs. "${formatB}"), nenhum dos dois é a página pilar — provável conteúdo complementar, não concorrente`);
  }

  if (COMPARISON_TITLE_RE.test(profileA.title || '') || COMPARISON_TITLE_RE.test(profileB.title || '')) {
    differentiationSignals.push('um dos títulos usa formato comparativo explícito ("X vs Y" / "X ou Y")');
  }

  const isComplementary = relationship === 'pillar_satellite' || relationship === 'differentiated_satellites';
  const level = isComplementary ? LEVELS.COMPLEMENTARY.label : classify(score);

  return { score, level, components, differentiationSignals, formatA, formatB, relationship };
}

function buildSignals(profileA, profileB, components) {
  const signals = [];
  if (components.title.overlap > 0) {
    const shared = sharedTermsWeighted(profileA.titleTerms, profileB.titleTerms, 4);
    if (shared.length > 0) signals.push(`títulos semelhantes: ${shared.join(', ')}`);
  }
  if (components.slug.overlap > 0) {
    const shared = sharedTermsWeighted(profileA.slugTerms, profileB.slugTerms, 4);
    if (shared.length > 0) signals.push(`slugs semelhantes: ${shared.join(', ')}`);
  }
  if (components.heading.overlap > 0) {
    const shared = sharedTermsWeighted(profileA.headingTerms, profileB.headingTerms, 4);
    if (shared.length > 0) signals.push(`headings semelhantes: ${shared.join(', ')}`);
  }
  if (components.content.overlap > 0) {
    const shared = sharedTermsWeighted(profileA.contentTerms, profileB.contentTerms, 4);
    if (shared.length > 0) signals.push(`conteúdo semelhante: ${shared.join(', ')}`);
  }
  return signals;
}

module.exports = { WEIGHTS, LEVELS, classify, scoreCannibalization, buildSignals };
