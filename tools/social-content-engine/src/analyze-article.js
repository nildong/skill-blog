'use strict';

const fs = require('fs');
const path = require('path');
const { extractBodyText } = require('../../shared/html-text');
const { lookupCluster } = require('./cluster-lookup');

const DOMAIN = 'https://smartpetgadgets.com.br';

/**
 * Estima público-alvo a partir de sinais textuais explícitos no
 * título/slug (espécie mencionada). Quando ambíguo ou não mencionado,
 * fica "não determinado" — nunca assume.
 */
function inferAudience(title, slug) {
  const t = `${title} ${slug}`.toLowerCase();
  const hasCat = /\bgato/.test(t);
  const hasDog = /\bcachorro|\bcao\b|\bcães/.test(t);
  if (hasCat && hasDog) return 'tutores de gatos e cães';
  if (hasCat) return 'tutores de gatos';
  if (hasDog) return 'tutores de cães';
  return 'não determinado (título não especifica espécie)';
}

/**
 * Potencial por formato social — apenas classificação (alto/médio/baixo)
 * com o motivo, NÃO o roteiro/legenda em si. Regras determinísticas
 * baseadas em sinais já disponíveis (role, word_count, imagens, FAQ,
 * produto afiliado).
 */
function assessFormatPotential({ role, wordCount, ownImageCount, faqQuestionCount, hasAffiliateProduct }) {
  const potential = {};

  // Reel: melhor quando há gancho de problema claro (COMPARISON/REVIEW/HOW_TO)
  // e pelo menos 1 imagem própria para storyboard.
  potential.reel = {
    level: (role === 'REVIEW' || role === 'COMPARISON' || role === 'HOW_TO') && ownImageCount >= 1 ? 'alto' : ownImageCount >= 1 ? 'médio' : 'baixo',
    reason: ownImageCount >= 1
      ? `role=${role || 'desconhecido'}, ${ownImageCount} imagem(ns) própria(s) para storyboard`
      : 'sem imagem própria identificada para storyboard',
  };

  // Post educativo: praticamente sempre viável se houver conteúdo mínimo.
  potential.post = {
    level: wordCount >= 400 ? 'alto' : wordCount >= 200 ? 'médio' : 'baixo',
    reason: `${wordCount} palavras de conteúdo-fonte`,
  };

  // Carrossel: precisa de estrutura (varias seções/subtópicos) — usamos
  // word_count como proxy de "tem material para 6-8 slides".
  potential.carousel = {
    level: wordCount >= 700 ? 'alto' : wordCount >= 400 ? 'médio' : 'baixo',
    reason: `${wordCount} palavras — proxy de material para 6-8 slides`,
  };

  // Stories: enquete/pergunta funciona melhor quando já existe FAQ (pergunta
  // já formulada e respondida na fonte).
  potential.stories = {
    level: faqQuestionCount > 0 ? 'alto' : 'médio',
    reason: faqQuestionCount > 0 ? `${faqQuestionCount} pergunta(s) de FAQ já formulada(s) na fonte` : 'sem FAQ detectado; precisaria formular pergunta nova a partir do corpo do artigo',
  };

  // Pergunta/engajamento: mesma lógica de stories.
  potential.engagement_question = {
    level: faqQuestionCount > 0 || role === 'COMPARISON' ? 'alto' : 'médio',
    reason: faqQuestionCount > 0 ? 'FAQ existente dá base para pergunta de comentário' : role === 'COMPARISON' ? 'artigo comparativo — pergunta "qual você prefere" é natural' : 'possível, mas sem gancho explícito na fonte',
  };

  // Vídeo curto (fora do formato Reel específico do IG): mesma base do Reel.
  potential.short_video = potential.reel;

  // CTA: mais forte quando há produto afiliado (tráfego + intenção de compra),
  // senão CTA é só "ler o guia completo".
  potential.cta = {
    level: hasAffiliateProduct ? 'alto' : 'médio',
    reason: hasAffiliateProduct ? 'produto afiliado mapeado no cluster — CTA pode direcionar ao guia que já linka o produto' : 'sem produto afiliado mapeado neste cluster ainda — CTA fica limitado a tráfego para o artigo',
  };

  // Remarketing: precisa de pelo menos produto ou comparação para fazer sentido.
  potential.remarketing = {
    level: hasAffiliateProduct && (role === 'REVIEW' || role === 'COMPARISON') ? 'alto' : 'baixo',
    reason: hasAffiliateProduct && (role === 'REVIEW' || role === 'COMPARISON') ? 'review/comparação com produto mapeado — bom para remarketing de intenção de compra' : 'sem sinal forte de intenção de compra para remarketing',
  };

  return potential;
}

/**
 * Analisa um artigo do piloto. Lê o HTML real (não confia só no
 * word_count agregado do site-index) para poder reportar um recorte de
 * conteúdo verificável, mas NÃO gera nenhuma peça de conteúdo social —
 * só estrutura a oportunidade.
 */
function analyzeArticle(post, { root, contentStrategy, affiliateProducts }) {
  const clusterInfo = lookupCluster(post.url_path, post.slug, contentStrategy);

  const csPage = contentStrategy && Array.isArray(contentStrategy.pages)
    ? contentStrategy.pages.find((p) => p.url === post.url_path)
    : null;
  const role = csPage ? csPage.role : null;

  const absPath = path.join(root, post.path);
  let bodyTextExcerpt = null;
  let bodyTextFull = null;
  let bodyTextError = null;
  try {
    const html = fs.readFileSync(absPath, 'utf8');
    const text = extractBodyText(html);
    bodyTextExcerpt = text.slice(0, 400);
    bodyTextFull = text;
  } catch (err) {
    bodyTextError = err.message;
  }

  // Headings reais do artigo (h2/h3, não vazios) — única fonte usada pela
  // fase de geração para estruturar Carrossel/Stories/Pergunta. Nunca
  // reescritos/reformulados na extração: texto literal do HTML.
  const headings = (post.headings || [])
    .filter((h) => (h.tag === 'h2' || h.tag === 'h3') && !h.empty && h.text && h.text.trim())
    .map((h) => ({ tag: h.tag, text: h.text.trim() }));
  const questionHeadings = headings.filter((h) => h.text.trim().endsWith('?'));

  const ownImages = (post.images || [])
    .filter((img) => !/logo|favicon|apple-touch/i.test(img.src || ''))
    .map((img) => ({ src: img.src, alt: img.alt, alt_missing: img.alt_missing }));

  const activeProducts = affiliateProducts && Array.isArray(affiliateProducts.products)
    ? affiliateProducts.products.filter((p) => p.active !== false && clusterInfo.cluster != null && p.cluster === clusterInfo.cluster)
    : [];

  const faqQuestionCount = post.faq ? post.faq.question_count || 0 : 0;
  const wordCount = post.content ? post.content.word_count || 0 : 0;

  const relatedInternalLinks = (post.internal_links || [])
    .filter((l) => l.href && l.href.startsWith(DOMAIN) && l.href !== `${DOMAIN}/`)
    .map((l) => l.href.replace(DOMAIN, ''))
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .slice(0, 10);

  const audience = inferAudience(post.title, post.slug);

  const formatPotential = assessFormatPotential({
    role,
    wordCount,
    ownImageCount: ownImages.length,
    faqQuestionCount,
    hasAffiliateProduct: activeProducts.length > 0,
  });

  const problems = [];
  if (bodyTextError) problems.push(`Não foi possível ler o HTML do artigo: ${bodyTextError}`);
  if (ownImages.length === 0) problems.push('Nenhuma imagem própria identificada (só logo/favicon) — precisaria de imagem nova antes de gerar Reel/Carrossel.');
  if (wordCount < 400) problems.push('Conteúdo-fonte abaixo de 400 palavras — risco de ficar raso para Carrossel/Post educativo completos.');
  if (clusterInfo.cluster_confidence === 'unknown') problems.push('Cluster não determinado (nem por content-strategy.json, nem por heurística de slug) — produtos afiliados relacionados podem não ser encontrados mesmo que existam.');
  if (clusterInfo.cluster_confidence === 'low') problems.push('Cluster determinado só por heurística fraca de slug (cluster_source=heuristic) — confirmar manualmente antes de basear CTA/remarketing nisso.');
  if (activeProducts.length === 0) problems.push('Nenhum produto afiliado ativo mapeado neste cluster em affiliate-products.json — CTA de produto não é possível ainda (não é erro, é limitação de dados atual).');

  return {
    article: {
      slug: post.slug,
      title: post.title,
      url: `${DOMAIN}${post.url_path}`,
      role,
      cluster: clusterInfo.cluster,
      cluster_source: clusterInfo.cluster_source,
      cluster_confidence: clusterInfo.cluster_confidence,
      audience,
      meta_description: post.meta_description,
      word_count: wordCount,
      body_text_excerpt: bodyTextExcerpt,
      body_text_full: bodyTextFull,
      headings,
      question_headings: questionHeadings,
    },
    source: {
      source_type: 'blog_article',
      source_slug: post.slug,
      source_path: post.path,
      generated_at: new Date().toISOString(),
    },
    signals: {
      own_images: ownImages,
      faq_question_count: faqQuestionCount,
      related_internal_links: relatedInternalLinks,
      affiliate_products: activeProducts.map((p) => ({ id: p.id, name: p.name, cluster: p.cluster, role: p.role })),
    },
    format_potential: formatPotential,
    // Nesta fase (dry-run/pilot), `content` fica vazio de propósito — as 8
    // peças completas só são geradas depois de autorização explícita para
    // a fase de GERAÇÃO PILOTO.
    content: {
      reels: [],
      posts: [],
      carousel: [],
      stories: [],
      engagement: [],
    },
    problems,
    status: 'dry_run_only',
  };
}

module.exports = { analyzeArticle, inferAudience, assessFormatPotential };
