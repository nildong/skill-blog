'use strict';

const { buildLinkGraph } = require('../../seo-auditor/src/link-graph');
const { classifyRole, inferClusters, ROLE } = require('./classifier');

/**
 * Formatos satélite "esperáveis" dentro de um cluster maduro — usado só
 * para relatar cobertura (quais formatos existem/faltam), NUNCA para
 * afirmar que um cluster "precisa" ter todos eles (ver seção 4 do prompt
 * da Fase 4: "não assumir automaticamente que todo cluster precisa
 * possuir todos os formatos").
 */
const EXPECTED_SATELLITE_ROLES = [ROLE.FAQ, ROLE.REVIEW, ROLE.COMPARISON, ROLE.HOW_TO, ROLE.SATELLITE];

/**
 * Constrói o inventário editorial: um registro por página, cruzando
 * site-index + seo-audit + internal-linking + cannibalization + papel
 * editorial + cluster inferido. Nenhum dado é inventado — campos sem
 * fonte ficam `null` (ver seção 1 do prompt da Fase 4).
 */
function buildInventory(posts, { seoAudit, internalLinking, cannibalization }) {
  const linkGraph = buildLinkGraph(posts);

  const seoByPath = new Map((seoAudit ? seoAudit.pages : []).map((p) => [p.path, p]));
  const ilOutByPath = new Map();
  const ilInByPath = new Map();
  for (const s of (internalLinking ? internalLinking.suggestions : [])) {
    if (!ilOutByPath.has(s.source)) ilOutByPath.set(s.source, []);
    ilOutByPath.get(s.source).push(s);
    if (!ilInByPath.has(s.target)) ilInByPath.set(s.target, []);
    ilInByPath.get(s.target).push(s);
  }
  const cbByUrlPath = new Map();
  for (const pair of (cannibalization ? cannibalization.pairs : [])) {
    if (!cbByUrlPath.has(pair.page_a)) cbByUrlPath.set(pair.page_a, []);
    cbByUrlPath.get(pair.page_a).push(pair);
    if (!cbByUrlPath.has(pair.page_b)) cbByUrlPath.set(pair.page_b, []);
    cbByUrlPath.get(pair.page_b).push(pair);
  }

  const rolesByPath = new Map();
  for (const post of posts) {
    const inboundCount = linkGraph.inboundCount.get(post.url_path) || 0;
    rolesByPath.set(post.path, classifyRole(post, { inboundCount }));
  }

  const clustersByPath = inferClusters(posts, rolesByPath, { internalLinking, cannibalization });

  const inventory = posts.map((post) => {
    const { format, role } = rolesByPath.get(post.path);
    const { clusterId, confidence } = clustersByPath.get(post.path);
    const seoPage = seoByPath.get(post.path) || null;
    const ilOut = ilOutByPath.get(post.url_path) || [];
    const ilIn = ilInByPath.get(post.url_path) || [];
    const cbPairs = cbByUrlPath.get(post.url_path) || [];

    return {
      path: post.path,
      url: post.url_path,
      slug: post.slug,
      title: post.title,
      page_type: post.page_type,
      format,
      role,
      cluster: clusterId,
      cluster_confidence: confidence,
      word_count: post.content ? post.content.word_count : null,
      h1_count: post.heading_summary ? post.heading_summary.h1_count : null,
      h2_count: post.heading_summary ? post.heading_summary.h2_count : null,
      inbound_links: linkGraph.inboundCount.get(post.url_path) || 0,
      outbound_links: post.internal_link_count,
      image_count: post.image_count,
      video_count: post.video_count,
      schema_types: post.schema_types || [],
      faq: post.faq || null,
      seo_status: seoPage ? seoPage.status : null,
      seo_issues: seoPage ? seoPage.issues : null,
      internal_linking_suggestions_out: ilOut,
      internal_linking_suggestions_in: ilIn,
      cannibalization_pairs: cbPairs,
    };
  });

  return { inventory, linkGraph };
}

/**
 * Agrupa o inventário por cluster (ignora páginas com cluster null) e
 * calcula uma visão de cobertura por formato — só relata o que existe /
 * não existe, sem prescrever que a ausência seja automaticamente um
 * problema.
 */
function buildClusterViews(inventory) {
  const byCluster = new Map();
  for (const page of inventory) {
    if (!page.cluster) continue;
    if (!byCluster.has(page.cluster)) byCluster.set(page.cluster, []);
    byCluster.get(page.cluster).push(page);
  }

  const clusters = [];
  for (const [clusterId, pages] of byCluster) {
    const pillar = pages.find((p) => p.role === ROLE.PILLAR) || null;
    const rolesPresent = new Set(pages.map((p) => p.role));
    const formatsPresent = [...rolesPresent];
    const formatsMissing = EXPECTED_SATELLITE_ROLES.filter((r) => !rolesPresent.has(r));

    const seoIssueCount = pages.reduce((sum, p) => sum + (p.seo_issues ? p.seo_issues.length : 0), 0);
    const errorPages = pages.filter((p) => p.seo_status === 'error').length;

    // Coverage é uma classificação qualitativa simples e documentada, não
    // um score arbitrário: GOOD se tem pilar + pelo menos 2 formatos
    // satélite distintos e nenhuma página em status error; PARTIAL se tem
    // pilar mas cobertura mais rasa; THIN se não tem nem pilar.
    let coverage;
    if (!pillar) coverage = 'THIN';
    else if (formatsPresent.length >= 3 && errorPages === 0) coverage = 'GOOD';
    else coverage = 'PARTIAL';

    clusters.push({
      cluster_id: clusterId,
      page_count: pages.length,
      pillar: pillar ? pillar.url : null,
      satellite_count: pages.filter((p) => p.role !== ROLE.PILLAR).length,
      formats_present: formatsPresent,
      formats_missing: formatsMissing,
      seo_issue_count: seoIssueCount,
      error_page_count: errorPages,
      coverage,
      pages: pages.map((p) => p.url),
    });
  }

  clusters.sort((a, b) => b.page_count - a.page_count);
  return clusters;
}

module.exports = { buildInventory, buildClusterViews, EXPECTED_SATELLITE_ROLES };
