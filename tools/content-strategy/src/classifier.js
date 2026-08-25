'use strict';

const { detectFormat, FORMATS } = require('../../shared/format-classifier');
const { buildPageProfile } = require('../../shared/profile');
const { weightedOverlapCoefficient } = require('../../shared/semantic-terms');

/**
 * Mapeia os formatos internos (tools/shared/format-classifier.js) para os
 * papéis editoriais pedidos pela Fase 4. PILLAR/FAQ/REVIEW/COMPARISON/
 * GUIDE/HOW_TO/INSTITUTIONAL mapeiam 1:1; os demais (TROUBLESHOOTING,
 * LIST, INFORMATIONAL, UNKNOWN) viram SATELLITE ou OTHER conforme a
 * semântica pedida (SATELLITE = conteúdo satélite reconhecível dentro de
 * um cluster; OTHER = não determinável com segurança — nunca forçado).
 */
const ROLE = Object.freeze({
  PILLAR: 'PILLAR',
  SATELLITE: 'SATELLITE',
  FAQ: 'FAQ',
  REVIEW: 'REVIEW',
  COMPARISON: 'COMPARISON',
  GUIDE: 'GUIDE',
  HOW_TO: 'HOW_TO',
  INSTITUTIONAL: 'INSTITUTIONAL',
  OTHER: 'OTHER',
});

const FORMAT_TO_ROLE = Object.freeze({
  [FORMATS.PILLAR]: ROLE.PILLAR,
  [FORMATS.FAQ]: ROLE.FAQ,
  [FORMATS.REVIEW]: ROLE.REVIEW,
  [FORMATS.COMPARISON]: ROLE.COMPARISON,
  [FORMATS.GUIDE]: ROLE.GUIDE,
  [FORMATS.HOW_TO]: ROLE.HOW_TO,
  [FORMATS.INSTITUTIONAL]: ROLE.INSTITUTIONAL,
  [FORMATS.TROUBLESHOOTING]: ROLE.SATELLITE,
  [FORMATS.LIST]: ROLE.SATELLITE,
  [FORMATS.INFORMATIONAL]: ROLE.SATELLITE,
  [FORMATS.UNKNOWN]: ROLE.OTHER,
});

function classifyRole(post, context) {
  const format = detectFormat(post, context);
  return { format, role: FORMAT_TO_ROLE[format] || ROLE.OTHER };
}

/**
 * Threshold da heurística fraca de cluster (slug+title overlap com um
 * pilar) — deliberadamente conservador. Documentado: só usado como
 * ÚLTIMO recurso, quando não há nenhuma relação real (via Internal
 * Linking ou Cannibalization) conectando a página a um pilar.
 */
const WEAK_CLUSTER_OVERLAP_THRESHOLD = 0.34;

/**
 * Infere o cluster de cada página, com 3 níveis de confiança:
 *
 *  - 'known': existe uma relação REAL (pillar_satellite) entre a página e
 *    um pilar, já calculada por Internal Linking ou Cannibalization
 *    (Fase 3/3.1) — não recalculada aqui, só consultada.
 *  - 'probable': nenhuma relação real encontrada, mas overlap de
 *    slug/title ponderado com algum pilar cruza o threshold — heurística
 *    fraca, documentada explicitamente como tal na saída.
 *  - 'unknown': nenhum sinal suficiente. `cluster: null`, nunca forçado.
 *
 * Páginas PILLAR são o próprio cluster (clusterId = seu slug).
 */
function inferClusters(posts, rolesByPath, { internalLinking, cannibalization }) {
  const pillars = posts.filter((p) => rolesByPath.get(p.path).role === ROLE.PILLAR);
  const pillarBySlug = new Map(pillars.map((p) => [p.slug, p]));

  // Constrói o conjunto de arestas "pillar_satellite" conhecidas, a partir
  // dos dois módulos da Fase 3 (não recalculadas — só lidas).
  const knownEdges = new Map(); // url_path (não-pilar) -> pillar slug

  for (const s of (internalLinking && internalLinking.suggestions) || []) {
    if (s.relationship !== 'pillar_satellite') continue;
    const sourcePillar = pillars.find((p) => p.url_path === s.source);
    const targetPillar = pillars.find((p) => p.url_path === s.target);
    if (sourcePillar) knownEdges.set(s.target, sourcePillar.slug);
    if (targetPillar) knownEdges.set(s.source, targetPillar.slug);
  }

  for (const pair of (cannibalization && cannibalization.pairs) || []) {
    if (pair.relationship !== 'pillar_satellite') continue;
    const pillarA = pillars.find((p) => p.url_path === pair.page_a);
    const pillarB = pillars.find((p) => p.url_path === pair.page_b);
    if (pillarA) knownEdges.set(pair.page_b, pillarA.slug);
    if (pillarB) knownEdges.set(pair.page_a, pillarB.slug);
  }

  // Perfis leves (sem ler HTML — só title/heading/slug, já presentes no
  // site-index) para a heurística fraca de fallback.
  const profileByPath = new Map(posts.map((p) => [p.path, buildPageProfile(p, '')]));

  const clusters = new Map(); // path -> { clusterId, confidence }

  for (const post of posts) {
    const role = rolesByPath.get(post.path).role;

    if (role === ROLE.PILLAR) {
      clusters.set(post.path, { clusterId: post.slug, confidence: 'known' });
      continue;
    }
    if (role === ROLE.INSTITUTIONAL || post.page_type !== 'post') {
      clusters.set(post.path, { clusterId: null, confidence: 'unknown' });
      continue;
    }

    const knownPillarSlug = knownEdges.get(post.url_path);
    if (knownPillarSlug) {
      clusters.set(post.path, { clusterId: knownPillarSlug, confidence: 'known' });
      continue;
    }

    // Heurística fraca: maior overlap de título+slug ponderado com algum pilar.
    let best = null;
    const profile = profileByPath.get(post.path);
    for (const pillar of pillars) {
      const pillarProfile = profileByPath.get(pillar.path);
      const titleOv = weightedOverlapCoefficient(profile.titleTerms, pillarProfile.titleTerms);
      const slugOv = weightedOverlapCoefficient(profile.slugTerms, pillarProfile.slugTerms);
      const combined = (titleOv + slugOv) / 2;
      if (!best || combined > best.combined) best = { pillar, combined };
    }

    if (best && best.combined >= WEAK_CLUSTER_OVERLAP_THRESHOLD) {
      clusters.set(post.path, { clusterId: best.pillar.slug, confidence: 'probable' });
    } else {
      clusters.set(post.path, { clusterId: null, confidence: 'unknown' });
    }
  }

  return clusters;
}

module.exports = { ROLE, FORMAT_TO_ROLE, classifyRole, inferClusters, WEAK_CLUSTER_OVERLAP_THRESHOLD };
