'use strict';

const { extractTerms } = require('../../shared/terms');
const { weightedOverlapCoefficient } = require('../../shared/semantic-terms');

/**
 * Threshold conservador para avisar sobre possível sobreposição de tema
 * entre dois artigos do MESMO piloto — reaproveita a mesma fórmula
 * ponderada de tools/shared/semantic-terms.js usada por Cannibalization,
 * só que aplicada a título (sinal mais estável e barato de calcular aqui).
 * Não decide nada sozinho: só registra `similarity_warning` para revisão
 * humana antes de gerar conteúdo social quase idêntico para os dois.
 */
const SIMILARITY_WARNING_THRESHOLD = 0.5;

function detectSimilarityWarnings(articles) {
  const withTerms = articles.map((a) => ({
    slug: a.article.slug,
    title: a.article.title,
    cluster: a.article.cluster,
    terms: extractTerms(a.article.title),
  }));

  const warnings = new Map(); // slug -> [{ with, overlap }]

  for (let i = 0; i < withTerms.length; i++) {
    for (let j = i + 1; j < withTerms.length; j++) {
      const a = withTerms[i];
      const b = withTerms[j];
      const overlap = weightedOverlapCoefficient(a.terms, b.terms);
      if (overlap >= SIMILARITY_WARNING_THRESHOLD) {
        const note = {
          with: b.slug,
          overlap: Number(overlap.toFixed(2)),
          same_cluster: a.cluster != null && a.cluster === b.cluster,
        };
        if (!warnings.has(a.slug)) warnings.set(a.slug, []);
        warnings.get(a.slug).push(note);

        const noteBack = { with: a.slug, overlap: Number(overlap.toFixed(2)), same_cluster: note.same_cluster };
        if (!warnings.has(b.slug)) warnings.set(b.slug, []);
        warnings.get(b.slug).push(noteBack);
      }
    }
  }

  return warnings;
}

module.exports = { detectSimilarityWarnings, SIMILARITY_WARNING_THRESHOLD };
