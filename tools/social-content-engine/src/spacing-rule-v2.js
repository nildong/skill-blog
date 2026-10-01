'use strict';

/**
 * Regra editorial de espaçamento (V2) — construída EM CIMA do
 * `similarity.js` já existente (intocado, não recalcula nada). Não
 * bloqueia geração nem publicação automaticamente: só produz uma
 * recomendação de intervalo mínimo entre publicar peças sociais de
 * dois artigos muito parecidos, para revisão humana no agendamento.
 *
 * Faixas (conservadoras, ajustáveis por revisão humana):
 *   overlap >= 0.70  -> espaçar pelo menos 21 dias
 *   overlap >= 0.50  -> espaçar pelo menos 14 dias
 *   overlap <  0.50  -> sem recomendação (não chega a gerar similarity_warning)
 */

const GAP_RULES = [
  { min: 0.70, gapDays: 21 },
  { min: 0.50, gapDays: 14 },
];

function recommendedGapDays(overlap) {
  for (const rule of GAP_RULES) {
    if (overlap >= rule.min) return rule.gapDays;
  }
  return 0;
}

/**
 * @param {Map<string, Array<{with, overlap, same_cluster}>>} similarityWarnings - saída de detectSimilarityWarnings (similarity.js), intocada.
 * @returns {Array<{slug_a, slug_b, overlap, same_cluster, recommended_gap_days, note}>} lista deduplicada de pares com recomendação.
 */
function buildSpacingRecommendations(similarityWarnings) {
  const seen = new Set();
  const recommendations = [];

  for (const [slug, warnings] of similarityWarnings.entries()) {
    for (const w of warnings) {
      const pairKey = [slug, w.with].sort().join('|');
      if (seen.has(pairKey)) continue;
      seen.add(pairKey);

      const gapDays = recommendedGapDays(w.overlap);
      recommendations.push({
        slug_a: slug,
        slug_b: w.with,
        overlap: w.overlap,
        same_cluster: w.same_cluster,
        recommended_gap_days: gapDays,
        note: gapDays > 0
          ? `Evitar publicar peças equivalentes (mesmo formato, gancho semelhante) de ${slug} e ${w.with} com menos de ${gapDays} dias de intervalo. Não bloqueia geração — só orienta o calendário editorial.`
          : `Overlap abaixo do limiar de recomendação de espaçamento — publicar normalmente.`,
      });
    }
  }

  return recommendations.sort((a, b) => b.overlap - a.overlap);
}

module.exports = { buildSpacingRecommendations, recommendedGapDays, GAP_RULES };
