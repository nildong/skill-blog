'use strict';

const { stripDiacritics } = require('../../shared/terms');
const { FORMATS } = require('../../shared/format-classifier');

/**
 * Classificador heurístico de intenção de busca — puramente lexical,
 * baseado em padrões de título/keyword já observados nos 72 posts
 * publicados (mesmo espírito de tools/shared/format-classifier.js, mas
 * para intenção em vez de formato editorial).
 *
 * NUNCA usa dado de ferramenta externa (volume, dificuldade, CPC,
 * posição). Isso é deliberado — ver "KEYWORD RESEARCH" na arquitetura
 * V2. Todo campo que dependeria de dado externo vem explicitamente como
 * "não disponível", nunca estimado/inventado.
 */

const INTENT = Object.freeze({
  INFORMATIONAL: 'informational',
  COMMERCIAL: 'commercial',
  TRANSACTIONAL: 'transactional',
  NAVIGATIONAL: 'navigational',
});

const FUNNEL_STAGE = Object.freeze({
  TOFU: 'tofu',
  MOFU: 'mofu',
  BOFU: 'bofu',
});

/**
 * Regras em ordem de precedência — a primeira que casar decide o
 * resultado. Ordem importa: transacional/preço vence sobre comercial
 * genérico, comparação explícita vence sobre "melhor" solto, etc.
 * Cada regra documenta o post real (quando existe) que motivou o padrão.
 */
const RULES = [
  {
    id: 'TRANSACTIONAL_PRICE',
    re: /\b(comprar|onde comprar|menor preco|cupom|desconto|frete gratis|promocao)\b/,
    intent: INTENT.TRANSACTIONAL,
    funnel: FUNNEL_STAGE.BOFU,
    recommended_type: FORMATS.REVIEW,
    rationale: 'Sinal de intenção de compra imediata (preço/cupom/onde comprar).',
  },
  {
    id: 'REVIEW_PRODUCT',
    re: /\breview\b/,
    intent: INTENT.COMMERCIAL,
    funnel: FUNNEL_STAGE.BOFU,
    recommended_type: FORMATS.REVIEW,
    rationale: 'Padrão "review" de produto específico (ex: comedouro-newpet-4l-review).',
  },
  {
    id: 'COMPARISON_VS',
    // "x vs y", "x x y" (padrão "gato x cachorro"), "x ou y"
    re: /\b(vs\.?|\bou\b)\b|(?:^|\s)x(?:\s)/,
    intent: INTENT.COMMERCIAL,
    funnel: FUNNEL_STAGE.MOFU,
    recommended_type: FORMATS.COMPARISON,
    rationale: 'Comparação explícita entre duas opções (ex: "gato x cachorro", "A vs B").',
  },
  {
    id: 'COMMERCIAL_INVESTIGATION',
    re: /\b(melhor|vale a pena|qual escolher|comparativo|mais vendido)\b/,
    intent: INTENT.COMMERCIAL,
    funnel: FUNNEL_STAGE.MOFU,
    recommended_type: FORMATS.LIST,
    rationale: 'Pesquisa comercial — já decidiu a categoria, ainda decidindo qual opção.',
  },
  {
    id: 'TROUBLESHOOTING',
    re: /\b(erros? comuns?|problemas? comuns?|nao funciona|resolver|como resolver)\b/,
    intent: INTENT.INFORMATIONAL,
    funnel: FUNNEL_STAGE.MOFU,
    recommended_type: FORMATS.TROUBLESHOOTING,
    rationale: 'Busca de solução para um problema já em curso com o produto.',
  },
  {
    id: 'HOW_TO',
    re: /\bcomo (configurar|instalar|limpar|usar|escolher)\b/,
    intent: INTENT.INFORMATIONAL,
    funnel: FUNNEL_STAGE.MOFU,
    recommended_type: FORMATS.HOW_TO,
    rationale: 'Instrução passo a passo para uma tarefa concreta.',
  },
  {
    id: 'FAQ',
    re: /\b(perguntas frequentes|duvidas frequentes|faq)\b/,
    intent: INTENT.INFORMATIONAL,
    funnel: FUNNEL_STAGE.MOFU,
    recommended_type: FORMATS.FAQ,
    rationale: 'Hub de perguntas curtas — deve linkar para artigos aprofundados, não competir com eles.',
  },
  {
    id: 'INFORMATIONAL_EXPLAIN',
    re: /\b(o que e|como funciona|para que serve|diferenca entre|funciona em)\b/,
    intent: INTENT.INFORMATIONAL,
    funnel: FUNNEL_STAGE.TOFU,
    recommended_type: FORMATS.INFORMATIONAL,
    rationale: 'Busca de entendimento/conceito, sem decisão de compra ainda.',
  },
  {
    id: 'GUIDE',
    re: /\bguia\b/,
    intent: INTENT.COMMERCIAL,
    funnel: FUNNEL_STAGE.MOFU,
    recommended_type: FORMATS.GUIDE,
    rationale: 'Guia amplo de categoria — candidato natural a página pilar.',
  },
];

/**
 * Classifica a intenção de busca de uma proposta de artigo.
 *
 * @param {object} proposal - com pelo menos `theme` e/ou `keyword_candidate`
 * @returns {object} classificação com intenção primária, secundária,
 *   estágio de funil, tipo de página recomendado, e os campos de
 *   keyword research explicitamente marcados como indisponíveis.
 */
function classifyIntent(proposal) {
  const text = stripDiacritics(
    `${proposal.keyword_candidate || ''} ${proposal.theme || ''}`.toLowerCase()
  );

  const matches = RULES.filter((rule) => rule.re.test(text));

  const primary = matches[0] || null;
  const secondary = matches[1] || null;

  return {
    version: 1,
    input_text: text.trim(),
    primary_intent: primary ? primary.intent : INTENT.INFORMATIONAL,
    secondary_intent: secondary ? secondary.intent : null,
    funnel_stage: primary ? primary.funnel : FUNNEL_STAGE.TOFU,
    recommended_type: primary ? primary.recommended_type : FORMATS.INFORMATIONAL,
    matched_rules: matches.map((m) => m.id),
    rationale: primary
      ? primary.rationale
      : 'Nenhum padrão lexical conhecido reconhecido — classificado como informacional/ToFu por padrão conservador, requer revisão humana.',
    confidence: primary ? (secondary ? 'MEDIUM' : 'HIGH') : 'LOW',
    keyword_research: {
      search_volume_estimate: 'não disponível',
      keyword_difficulty: 'não disponível',
      cpc: 'não disponível',
      current_position: 'não disponível',
      basis: 'Heurística lexical local (padrões de título/keyword observados nos posts existentes) — sem fonte de dados externa. Ver seção "Keyword Research" da arquitetura V2 para extensão futura opcional.',
    },
  };
}

module.exports = { classifyIntent, INTENT, FUNNEL_STAGE, RULES };
