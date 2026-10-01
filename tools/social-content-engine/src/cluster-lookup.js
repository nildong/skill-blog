'use strict';

/**
 * O social-content-engine NUNCA calcula cluster do zero. Ele reaproveita
 * a inferência já feita e documentada pelo Content Strategy Engine
 * (`.data/content-strategy.json`, `pages[].cluster` / `cluster_confidence`),
 * que por sua vez usa 3 níveis de confiança (ver
 * tools/content-strategy/src/classifier.js):
 *
 *  - 'known': relação real (Internal Linking / Cannibalization).
 *  - 'probable': heurística fraca de overlap de slug/título com um pilar.
 *  - 'unknown': nenhum sinal suficiente — cluster fica null.
 *
 * Aqui só traduzimos esses 3 níveis para o vocabulário pedido nesta fase
 * (`cluster_source`, `cluster_confidence`), sem reclassificar nada:
 *
 *  - known/probable  -> cluster_source: "content-strategy", cluster_confidence: "known"|"probable"
 *  - unknown ou sem content-strategy.json -> cluster_source: "heuristic" (fallback fraco por prefixo de slug) ou "none"
 *
 * O fallback por prefixo de slug SÓ roda quando content-strategy.json não
 * tem nada para a página (não substitui um resultado 'known'/'probable'
 * já calculado). Ele nunca é tratado como verdade — sempre marcado
 * cluster_source: "heuristic", cluster_confidence: "low".
 */

// Prefixos observados nos 73 slugs do site (ver auditoria). Deliberadamente
// conservador: só usado como último recurso.
const SLUG_PREFIX_CLUSTERS = [
  'comedouro-automatico-para-pet',
  'camera-para-monitorar-pet',
  'coleira-gps-para-pet',
  'porta-eletronica-automatica-para-pet',
  'brinquedo-interativo-automatico-para-gato',
];

const PREFIX_HINTS = [
  { test: (slug) => slug.startsWith('comedouro') || slug.startsWith('bebedouro'), cluster: 'comedouro-automatico-para-pet' },
  { test: (slug) => slug.startsWith('camera-pet') || slug.startsWith('duvidas-camera') || slug.startsWith('erros-comuns-camera') || slug.startsWith('melhor-camera') || slug.startsWith('como-configurar-camera'), cluster: 'camera-para-monitorar-pet' },
  { test: (slug) => slug.startsWith('coleira-gps') || slug.startsWith('duvidas-coleira') || slug.startsWith('erros-comuns-coleira') || slug.startsWith('melhor-coleira') || slug.startsWith('como-funciona-coleira'), cluster: 'coleira-gps-para-pet' },
  { test: (slug) => slug.startsWith('porta-eletronica') || slug.startsWith('duvidas-porta') || slug.startsWith('erros-comuns-porta') || slug.startsWith('como-instalar-porta'), cluster: 'porta-eletronica-automatica-para-pet' },
  { test: (slug) => slug.startsWith('brinquedo') || slug.startsWith('duvidas-brinquedo') || slug.startsWith('erros-comuns-brinquedo') || slug.startsWith('como-escolher-brinquedo') || slug.startsWith('melhor-bolinha'), cluster: 'brinquedo-interativo-automatico-para-gato' },
];

function weakSlugHeuristic(slug) {
  const hit = PREFIX_HINTS.find((h) => h.test(slug));
  if (!hit) return { cluster: null, cluster_source: 'none', cluster_confidence: 'unknown' };
  return { cluster: hit.cluster, cluster_source: 'heuristic', cluster_confidence: 'low' };
}

/**
 * @param {string} urlPath - ex: "/comedouro-automatico-para-dois-gatos/"
 * @param {string} slug
 * @param {object|null} contentStrategy - conteúdo de .data/content-strategy.json (ou null)
 */
function lookupCluster(urlPath, slug, contentStrategy) {
  const page = contentStrategy && Array.isArray(contentStrategy.pages)
    ? contentStrategy.pages.find((p) => p.url === urlPath)
    : null;

  if (page && page.cluster && (page.cluster_confidence === 'known' || page.cluster_confidence === 'probable')) {
    return {
      cluster: page.cluster,
      cluster_source: 'content-strategy',
      cluster_confidence: page.cluster_confidence,
    };
  }

  // content-strategy.json existe mas marcou 'unknown', ou não existe: cai
  // no fallback fraco por prefixo de slug, sempre marcado como tal.
  return weakSlugHeuristic(slug);
}

module.exports = { lookupCluster, weakSlugHeuristic, SLUG_PREFIX_CLUSTERS };
