'use strict';

/**
 * Geração das 8 peças por artigo (fase GERAÇÃO PILOTO, autorizada
 * explicitamente pelo usuário após o dry-run). Princípio fundamental
 * (ver SKILL.md / prompt original, seção 3): a IA pode resumir,
 * reorganizar, criar ganchos e adaptar linguagem — NUNCA pode inventar
 * especificação, preço, avaliação, estatística ou produto.
 *
 * Por isso todo texto gerado aqui é montado a partir de apenas 4 fontes
 * literais já extraídas do HTML real do artigo (nunca reescritas por
 * paráfrase livre, sempre citadas como estão):
 *
 *   - title              (h1 / <title>)
 *   - meta_description    (resumo autoral já existente da página)
 *   - headings[]          (h2/h3 reais, texto literal)
 *   - question_headings[] (subconjunto de headings que já são perguntas)
 *
 * Quando não há headings/perguntas suficientes na fonte para um formato,
 * o gerador NÃO inventa — reduz o formato ao que é sustentável e deixa
 * o quality gate marcar `needs_review` com o motivo exato.
 */

const DOMAIN = 'https://smartpetgadgets.com.br';
const BOILERPLATE_HEADINGS = new Set(['conclusão', 'conclusao', 'perguntas frequentes', 'erros comuns']);

function isBoilerplate(text) {
  return BOILERPLATE_HEADINGS.has(text.trim().toLowerCase());
}

function topicHeadings(headings) {
  return headings.filter((h) => !h.text.endsWith('?') && !isBoilerplate(h.text));
}

function findConclusionHeadingText(headings, bodyTextFull) {
  const h = headings.find((x) => x.text.trim().toLowerCase() === 'conclusão' || x.text.trim().toLowerCase() === 'conclusao');
  return h ? h.text : null;
}

function findMistakeHeading(headings) {
  return headings.find((h) => /\berro|\bcuidado|\bevit/i.test(h.text)) || null;
}

/** Extrai o par "A x B" / "A ou B" de um título comparativo real — nunca inventa os dois lados, só recorta o que já está escrito. */
function extractComparisonPair(title) {
  const m = title.match(/^(.+?)\s+(?:x|X|ou|vs\.?)\s+(.+?)(?::|$)/);
  if (!m) return null;
  return { a: m[1].trim(), b: m[2].trim().replace(/[?.]$/, '') };
}

function baseCta({ url, hasAffiliateProduct }) {
  return hasAffiliateProduct
    ? `Confira os modelos analisados e o guia completo: ${url}`
    : `Veja o guia completo no Smart Pet Gadgets: ${url}`;
}

function contentId(slug, type, n) {
  return `${slug}-${type}-${String(n).padStart(2, '0')}`;
}

/**
 * @param {object} article - `article` do pacote (analyzeArticle), já
 *   inclui headings/question_headings/meta_description/title reais.
 * @param {object} signals - `signals` do pacote (imagens, faq, afiliados).
 */
function buildReels(article, signals) {
  const topics = topicHeadings(article.headings);
  const reels = [];
  const hasAffiliateProduct = signals.affiliate_products.length > 0;

  // Pool combinado de ganchos (perguntas primeiro, depois tópicos), e um
  // conjunto de headings já usados — por hook OU por problema — em QUALQUER
  // reel anterior. Sem isso, o Reel 2 podia escolher um hook diferente do
  // Reel 1 mas cair no mesmo heading de "problema" (sempre "o primeiro
  // tópico disponível"), duplicando roteiro inteiro e mudando só o hook.
  const hookPool = [...article.question_headings, ...topics];
  const usedHeadings = new Set();

  for (let i = 0; i < 2; i++) {
    const hookSource = hookPool.find((h) => !usedHeadings.has(h.text)) || null;
    if (!hookSource && i === 0) {
      // Sem NENHUM heading aproveitável — não força um Reel sem gancho real.
      reels.push({
        content_id: contentId(article.slug, 'reel', i + 1),
        status: 'insufficient_source',
        reason: 'Nenhum heading (pergunta ou tópico) disponível na fonte para construir um gancho real — Reel não gerado para evitar hook genérico desconectado do artigo.',
        source_article: article.slug,
        source_url: article.url,
      });
      continue;
    }
    if (!hookSource) break; // reel 2 opcional se não houver 2º gancho real disponível — não duplica o reel 1
    usedHeadings.add(hookSource.text);

    const problemSource = topics.find((t) => !usedHeadings.has(t.text)) || null;
    if (problemSource) usedHeadings.add(problemSource.text);

    const scenes = signals.own_images.length > 0
      ? signals.own_images.slice(0, 3).map((img, idx) => `Cena ${idx + 1}: usar imagem existente (${img.src})`)
      : ['Cena única: nenhuma imagem própria identificada — precisa de imagem/vídeo novo antes de produzir (ver problems do pacote).'];

    const onScreenText = [hookSource.text, problemSource ? problemSource.text : article.title, 'Veja o guia completo →'];
    // "informação" varia por reel: quando há um heading de problema real e
    // distinto, ele entra combinado à meta_description (real, não
    // inventado); sem heading distinto sobrando, cai só na meta_description
    // — nesse caso o Reel já é o único gerado (reel 2 não chega a existir
    // sem hookSource distinto, ver `break` acima).
    const informacao = problemSource ? `${problemSource.text}. ${article.meta_description}` : article.meta_description;

    reels.push({
      content_id: contentId(article.slug, 'reel', i + 1),
      hook: hookSource.text,
      roteiro: {
        problema: problemSource ? problemSource.text : article.meta_description,
        informacao,
        solucao: `Guia completo: "${article.title}" — ${article.url}`,
      },
      cenas_sugeridas: scenes,
      texto_na_tela: onScreenText,
      narracao_sugerida: `${hookSource.text} ${problemSource ? problemSource.text + '. ' : ''}${article.meta_description}`,
      duracao_estimada_segundos: Math.min(60, Math.max(20, onScreenText.length * 10)),
      cta: baseCta({ url: article.url, hasAffiliateProduct }),
      source_article: article.slug,
      source_url: article.url,
      objetivo: hasAffiliateProduct ? 'tráfego + intenção de compra' : 'tráfego + reconhecimento de marca',
      status: 'generated',
    });
  }

  return reels;
}

function buildPosts(article, signals) {
  const topics = topicHeadings(article.headings);
  const hasAffiliateProduct = signals.affiliate_products.length > 0;
  const posts = [];

  // POST 01 — educativo: usa meta_description (resumo autoral real) como legenda-base.
  posts.push({
    content_id: contentId(article.slug, 'post', 1),
    type: 'educativo',
    titulo_gatilho: article.title,
    legenda: `${article.meta_description}${topics[0] ? ' Neste guia: ' + topics[0].text + '.' : ''}`,
    cta: baseCta({ url: article.url, hasAffiliateProduct }),
    source_article: article.slug,
    source_url: article.url,
    hashtags: buildHashtags(article),
    objetivo: 'educar + salvar/compartilhar',
    status: 'generated',
  });

  // POST 02 — curiosidade/engajamento: usa um heading tópico diferente do post 1, se existir.
  const curiosityTopic = topics.find((t) => t.text !== (topics[0] && topics[0].text)) || article.question_headings[0] || null;
  if (curiosityTopic) {
    posts.push({
      content_id: contentId(article.slug, 'post', 2),
      type: 'curiosidade',
      titulo_gatilho: curiosityTopic.text,
      legenda: `Você sabia? ${curiosityTopic.text} A resposta está no artigo completo.`,
      cta: baseCta({ url: article.url, hasAffiliateProduct }),
      source_article: article.slug,
      source_url: article.url,
      hashtags: buildHashtags(article),
      objetivo: 'engajamento + tráfego',
      status: 'generated',
    });
  } else {
    posts.push({
      content_id: contentId(article.slug, 'post', 2),
      status: 'insufficient_source',
      reason: 'Sem 2º heading distinto do Post 01 disponível na fonte — Post de curiosidade não gerado para evitar repetir o mesmo gancho do Post 01.',
      source_article: article.slug,
      source_url: article.url,
    });
  }

  return posts;
}

function buildHashtags(article) {
  const tags = ['#smartpetgadgets'];
  if (/gato/i.test(article.audience)) tags.push('#gatos');
  if (/cães|cachorro/i.test(article.audience)) tags.push('#cachorros');
  if (article.cluster) tags.push(`#${article.cluster.replace(/-/g, '')}`);
  return tags;
}

function buildCarousel(article, signals) {
  const topics = topicHeadings(article.headings);
  const hasAffiliateProduct = signals.affiliate_products.length > 0;
  const mistake = findMistakeHeading(article.headings);
  const conclusionText = findConclusionHeadingText(article.headings) ? article.meta_description : article.meta_description;

  const slideDefs = [];
  slideDefs.push({ role: 'Gancho', title: article.title, text: article.meta_description });
  if (topics[0]) slideDefs.push({ role: 'Problema', title: topics[0].text, text: null });
  // Info 1-3: próximos headings tópicos ainda não usados.
  const usedTexts = new Set(slideDefs.map((s) => s.title));
  const remainingTopics = topics.filter((t) => !usedTexts.has(t.text));
  remainingTopics.slice(0, 3).forEach((t, i) => {
    slideDefs.push({ role: `Informação ${i + 1}`, title: t.text, text: null });
    usedTexts.add(t.text);
  });
  if (mistake && !usedTexts.has(mistake.text)) {
    slideDefs.push({ role: 'Erro comum', title: mistake.text, text: null });
    usedTexts.add(mistake.text);
  }
  slideDefs.push({ role: 'Conclusão', title: 'Conclusão', text: conclusionText });
  slideDefs.push({ role: 'CTA', title: 'Quer saber mais?', text: baseCta({ url: article.url, hasAffiliateProduct }) });

  if (slideDefs.length < 6) {
    return {
      content_id: contentId(article.slug, 'carrossel', 1),
      status: 'insufficient_source',
      reason: `Apenas ${slideDefs.length} slides sustentáveis com headings reais da fonte (mínimo 6 exigido pelo formato) — carrossel não gerado para evitar preencher slides com conteúdo inventado.`,
      source_article: article.slug,
      source_url: article.url,
    };
  }

  return {
    content_id: contentId(article.slug, 'carrossel', 1),
    slides: slideDefs.slice(0, 8).map((s, i) => ({
      slide: i + 1,
      papel: s.role,
      titulo: s.title,
      texto: s.text,
      sugestao_visual: signals.own_images[i] ? `usar imagem existente: ${signals.own_images[i].src}` : 'precisa de imagem nova (nenhuma imagem própria suficiente identificada)',
    })),
    cta: baseCta({ url: article.url, hasAffiliateProduct }),
    source_article: article.slug,
    source_url: article.url,
    objetivo: 'retenção + salvamento',
    status: 'generated',
  };
}

function buildStories(article, signals) {
  const stories = [];
  const q = article.question_headings[0];

  if (q) {
    stories.push({
      content_id: contentId(article.slug, 'stories', 1),
      tipo: 'enquete',
      conteudo: q.text,
      opcoes: ['Sim', 'Não'],
      source_article: article.slug,
      source_url: article.url,
      objetivo: 'interação',
      status: 'generated',
    });
  } else {
    stories.push({
      content_id: contentId(article.slug, 'stories', 1),
      status: 'insufficient_source',
      reason: 'Nenhuma pergunta real (heading terminado em "?") disponível na fonte para montar enquete — não inventada.',
      source_article: article.slug,
      source_url: article.url,
    });
  }

  stories.push({
    content_id: contentId(article.slug, 'stories', 2),
    tipo: 'cta',
    conteudo: `Arraste para cima e leia: ${article.title}`,
    source_article: article.slug,
    source_url: article.url,
    objetivo: 'tráfego',
    status: 'generated',
  });

  return stories;
}

function buildEngagement(article) {
  const q = article.question_headings.find((h) => h.text !== (article.question_headings[0] && article.question_headings[0].text)) || article.question_headings[0];
  if (q) {
    return [{
      content_id: contentId(article.slug, 'engagement', 1),
      pergunta: q.text,
      source_article: article.slug,
      source_url: article.url,
      objetivo: 'comentários',
      status: 'generated',
    }];
  }

  const pair = extractComparisonPair(article.title);
  if (pair) {
    return [{
      content_id: contentId(article.slug, 'engagement', 1),
      pergunta: `${pair.a} ou ${pair.b}? Conta pra gente qual você usa.`,
      source_article: article.slug,
      source_url: article.url,
      objetivo: 'comentários',
      status: 'generated',
    }];
  }

  return [{
    content_id: contentId(article.slug, 'engagement', 1),
    status: 'insufficient_source',
    reason: 'Sem pergunta real na fonte (nem FAQ, nem título comparativo "A x B") — pergunta de engajamento não gerada para evitar pergunta genérica desconectada do artigo.',
    source_article: article.slug,
    source_url: article.url,
  }];
}

module.exports = { buildReels, buildPosts, buildCarousel, buildStories, buildEngagement, topicHeadings, extractComparisonPair };
