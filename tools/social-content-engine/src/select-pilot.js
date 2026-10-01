'use strict';

const { lookupCluster } = require('./cluster-lookup');

const PILOT_SIZE = 10;

/**
 * Revisão do seletor (ver reports/social-content/dry-run.md, seção
 * "Comparação com o piloto anterior"): a V1 inicial pontuava afiliado
 * como critério dominante (+40 role produto, +30 afiliado ativo), o que
 * concentrou 8 dos 10 artigos no único cluster com afiliado mapeado
 * (comedouro-automatico-para-pet) — viés reconhecido no próprio relatório
 * e corrigido aqui a pedido do usuário.
 *
 * Novo princípio: o piloto serve para testar a capacidade do engine em
 * temas DIFERENTES do blog, priorizando o que importa para alcance
 * social — não para afiliado. Ordem de prioridade:
 *
 *   1. potencial de interesse do público
 *   2. potencial de engajamento (comentários)
 *   3. potencial de compartilhamento
 *   4. potencial de tráfego para o blog
 *   5. diversidade de clusters (na seleção final, não no score individual)
 *   6. potencial de monetização — FATOR SECUNDÁRIO, peso baixo de propósito
 *
 * Afiliado nunca deve dominar o score: seu peso máximo (8 pts) é
 * deliberadamente pequeno frente ao teto combinado de interesse +
 * engajamento + compartilhamento + tráfego (80 pts).
 */
function isInstitutional(post) {
  return post.page_type !== 'post';
}

/** Slugs que sinalizam conteúdo "problema/dúvida" — historicamente gera mais comentário/salvamento. */
function isProblemSolvingSlug(slug) {
  return slug.startsWith('erros-comuns') || slug.startsWith('duvidas');
}

function scoreSocialPotential(post, { contentStrategy, affiliateProducts }) {
  const clusterInfo = lookupCluster(post.url_path, post.slug, contentStrategy);

  const csPage = contentStrategy && Array.isArray(contentStrategy.pages)
    ? contentStrategy.pages.find((p) => p.url === post.url_path)
    : null;
  const role = csPage ? csPage.role : null;
  const inboundLinks = csPage ? (csPage.inbound_links || 0) : null;

  const activeProducts = affiliateProducts && Array.isArray(affiliateProducts.products)
    ? affiliateProducts.products.filter((p) => p.active !== false && clusterInfo.cluster != null && p.cluster === clusterInfo.cluster)
    : [];

  const wordCount = post.content ? post.content.word_count || 0 : 0;
  const ownImages = (post.images || []).filter((img) => !/logo|favicon|apple-touch/i.test(img.src || ''));
  const faqQuestionCount = post.faq ? post.faq.question_count || 0 : 0;
  const problemSolving = isProblemSolvingSlug(post.slug);

  const reasons = [];
  let engagementPotential = 0;
  let interestPotential = 0;
  let sharePotential = 0;
  let trafficPotential = 0;
  let monetizationPotential = 0;

  // 1-2. Engajamento (comentário) — FAQ já formulado na fonte é o sinal
  // mais forte de pergunta pronta para virar Stories/pergunta de post.
  if (faqQuestionCount > 0) {
    engagementPotential += 20;
    reasons.push(`engajamento: ${faqQuestionCount} pergunta(s) de FAQ já formulada(s) na fonte (+20)`);
  } else if (role === 'FAQ') {
    engagementPotential += 15;
    reasons.push('engajamento: role=FAQ, hub de dúvidas (+15)');
  }

  // 1. Interesse do público — formatos que resolvem um problema/decisão de
  // compra concreta (review/comparação/how-to/guia) tendem a interessar
  // mais do que conteúdo puramente institucional.
  if (['REVIEW', 'COMPARISON', 'HOW_TO', 'GUIDE'].includes(role)) {
    interestPotential += 20;
    reasons.push(`interesse: role=${role} (+20)`);
  } else if (wordCount >= 400) {
    interestPotential += 8;
    reasons.push(`interesse: conteúdo satélite com ${wordCount} palavras (+8)`);
  }
  if (problemSolving) {
    interestPotential += 10;
    reasons.push('interesse: slug indica conteúdo de problema/dúvida comum (+10)');
  }

  // 3. Compartilhamento — comparações ("X ou Y?") são naturalmente
  // compartilháveis ("marca um amigo que tem X"); imagem própria é
  // pré-requisito para Reel/Carrossel compartilhável.
  if (role === 'COMPARISON') {
    sharePotential += 15;
    reasons.push('compartilhamento: formato comparativo, natural para "marca alguém que..." (+15)');
  }
  if (ownImages.length >= 2) {
    sharePotential += 10;
    reasons.push(`compartilhamento: ${ownImages.length} imagens próprias (material visual para carrossel) (+10)`);
  } else if (ownImages.length === 1) {
    sharePotential += 5;
    reasons.push('compartilhamento: 1 imagem própria (+5)');
  }

  // 4. Tráfego para o blog — usa inbound_links já calculado pelo Content
  // Strategy Engine (Internal Linking/Cannibalization) como proxy de
  // relevância já demonstrada dentro do site; não recalculado aqui.
  if (inboundLinks == null) {
    reasons.push('tráfego: sem dado de inbound_links (content-strategy.json ausente ou página não mapeada) — não pontuado, não inventado');
  } else if (inboundLinks >= 10) {
    trafficPotential += 15;
    reasons.push(`tráfego: ${inboundLinks} links internos de entrada (+15)`);
  } else if (inboundLinks >= 5) {
    trafficPotential += 10;
    reasons.push(`tráfego: ${inboundLinks} links internos de entrada (+10)`);
  } else if (inboundLinks >= 1) {
    trafficPotential += 5;
    reasons.push(`tráfego: ${inboundLinks} link(s) interno(s) de entrada (+5)`);
  }

  // 6. Monetização — FATOR SECUNDÁRIO, de propósito com teto baixo (8 pts,
  // <8% do teto combinado dos outros 4 fatores) para não dominar o score.
  if (activeProducts.length > 0) {
    monetizationPotential += 8;
    reasons.push(`monetização (secundário): ${activeProducts.length} produto(s) afiliado(s) ativo(s) no cluster (+8)`);
  }

  const score = engagementPotential + interestPotential + sharePotential + trafficPotential + monetizationPotential;

  return {
    path: post.path,
    slug: post.slug,
    url_path: post.url_path,
    title: post.title,
    role,
    cluster: clusterInfo.cluster,
    cluster_source: clusterInfo.cluster_source,
    cluster_confidence: clusterInfo.cluster_confidence,
    word_count: wordCount,
    own_image_count: ownImages.length,
    inbound_links: inboundLinks,
    faq_question_count: faqQuestionCount,
    affiliate_products: activeProducts.map((p) => ({ id: p.id, name: p.name, role: p.role })),
    score,
    score_breakdown: { engagementPotential, interestPotential, sharePotential, trafficPotential, monetizationPotential },
    reasons,
  };
}

/**
 * Cotas de diversidade temática (pedidas pelo usuário). Mapeadas para os
 * clusters REAIS que o Content Strategy Engine já identificou no site
 * (5 pilares) — nunca clusters inventados. "cachorro-higiene-acessorios"
 * não corresponde a nenhum pilar existente hoje (ver limitations no
 * relatório); usamos o grupo de cluster `unknown` como melhor
 * aproximação disponível, sempre etiquetado como tal.
 */
const DIVERSITY_GROUPS = [
  { label: 'comedouros', quota: 3, match: (c) => c.cluster === 'comedouro-automatico-para-pet' },
  { label: 'coleira-gps', quota: 2, match: (c) => c.cluster === 'coleira-gps-para-pet' },
  { label: 'camera-monitoramento', quota: 2, match: (c) => c.cluster === 'camera-para-monitorar-pet' },
  { label: 'cachorro-higiene-acessorios (substituto: cluster unknown)', quota: 2, match: (c) => c.cluster == null },
  { label: 'outros-clusters', quota: 1, match: (c) => c.cluster === 'porta-eletronica-automatica-para-pet' || c.cluster === 'brinquedo-interativo-automatico-para-gato' },
];

/**
 * Seleção diversificada por cota. Dentro de cada grupo, ordena por score
 * desc / word_count desc / slug asc (mesmo critério de desempate de
 * sempre — determinístico). Se um grupo não tiver candidatos suficientes,
 * registra o déficit em `diversity_report` e completa o total de `size`
 * com os melhores candidatos restantes de QUALQUER grupo (fora de cota),
 * documentado explicitamente — nunca inventa conteúdo/cluster para
 * preencher a cota.
 */
function selectDiversifiedPilot({ siteIndex, contentStrategy, affiliateProducts }, size = PILOT_SIZE) {
  const posts = (siteIndex.posts || []).filter((p) => !isInstitutional(p));
  const candidates = posts
    .map((post) => scoreSocialPotential(post, { contentStrategy, affiliateProducts }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.word_count !== a.word_count) return b.word_count - a.word_count;
      return a.slug.localeCompare(b.slug);
    });

  const selectedSlugs = new Set();
  const selected = [];
  const groupReport = [];

  for (const group of DIVERSITY_GROUPS) {
    const groupCandidates = candidates.filter((c) => group.match(c) && !selectedSlugs.has(c.slug));
    const picked = groupCandidates.slice(0, group.quota);
    picked.forEach((c) => { selectedSlugs.add(c.slug); selected.push({ ...c, diversity_group: group.label }); });
    groupReport.push({
      label: group.label,
      quota: group.quota,
      filled: picked.length,
      met: picked.length >= group.quota,
      picked: picked.map((c) => c.slug),
      shortfall_reason: picked.length < group.quota
        ? `Apenas ${picked.length} candidato(s) disponível(is) neste grupo depois de excluir institucionais e já selecionados de outros grupos.`
        : null,
    });
  }

  // Completa até `size` com os melhores candidatos restantes, fora de cota,
  // se algum grupo não teve candidatos suficientes.
  const fillers = [];
  if (selected.length < size) {
    for (const c of candidates) {
      if (selected.length + fillers.length >= size) break;
      if (selectedSlugs.has(c.slug)) continue;
      fillers.push({ ...c, diversity_group: 'preenchimento fora de cota (score geral)' });
      selectedSlugs.add(c.slug);
    }
  }

  const finalSelected = [...selected, ...fillers].slice(0, size);

  return {
    selected: finalSelected,
    candidates,
    diversity_report: groupReport,
    fillers_used: fillers.length,
  };
}

module.exports = { selectDiversifiedPilot, scoreSocialPotential, DIVERSITY_GROUPS, PILOT_SIZE, isProblemSolvingSlug };
