'use strict';

const GENERIC_ANCHORS_RE = /^(clique aqui|saiba mais|veja aqui|confira|leia mais|aqui)$/i;

/**
 * Anchor sugerido para um link de `profileA` (origem) para `profileB`
 * (destino). Preferência, em ordem:
 *  1. O <title> da página destino, se não for excessivamente longo (até
 *     ~8 palavras) — natural e específico.
 *  2. O primeiro heading (h1/h2) da página destino que compartilhe termo
 *     com o título/headings da origem — mais contextual que o title inteiro.
 *  3. Fallback: o próprio title da página destino, mesmo que longo (ainda
 *     assim melhor que um anchor genérico).
 *
 * NUNCA retorna um anchor genérico ("clique aqui" etc.) — se por algum
 * motivo o texto candidato bater na lista de anchors genéricos (não deve
 * acontecer com title real, mas é uma defesa), cai para o slug legível.
 */
function suggestAnchor(targetPost) {
  const title = (targetPost.title || '').trim();
  const wordCount = title ? title.split(/\s+/).length : 0;

  let candidate = null;

  if (title && wordCount <= 8) {
    candidate = title;
  } else if (targetPost.headings && targetPost.headings.length > 0) {
    const h2 = targetPost.headings.find((h) => h.tag === 'h2' && h.text && h.text.trim());
    candidate = h2 ? h2.text.trim() : title;
  } else {
    candidate = title;
  }

  if (!candidate || GENERIC_ANCHORS_RE.test(candidate.trim())) {
    candidate = (targetPost.slug || '').split('-').join(' ');
  }

  return candidate;
}

/**
 * Verifica se a página `sourcePost` já possui um link interno apontando
 * para `targetUrlPath` (usa o mesmo normalizador de path do SEO Auditor,
 * reaproveitado via link-graph.js — ver decisão em README.md).
 */
function alreadyLinksTo(sourcePost, targetUrlPath, normalizeInternalPath) {
  return (sourcePost.internal_links || []).some((link) => {
    const normalized = normalizeInternalPath(link.href);
    return normalized && !normalized.looksLikeFile && normalized.path === targetUrlPath;
  });
}

function buildReason({ score, sameCluster, isOrphanTarget, isPillarSatellite }) {
  const parts = [];
  if (isOrphanTarget) parts.push('página de destino está órfã (sem nenhum link de entrada) — prioridade alta');
  if (isPillarSatellite) parts.push('relação pilar↔satélite identificada — conteúdo complementar dentro do mesmo cluster editorial');
  if (sameCluster) parts.push('mesmo cluster temático');
  if (score >= 70) parts.push('alta similaridade de conteúdo/título/headings');
  else if (score >= 40) parts.push('similaridade moderada de conteúdo/título/headings');
  else parts.push('similaridade baixa, mas acima do limiar mínimo de sugestão');
  return parts.join('; ');
}

module.exports = { suggestAnchor, alreadyLinksTo, buildReason, GENERIC_ANCHORS_RE };
