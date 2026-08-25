'use strict';

const { buildPageProfile } = require('../../shared/profile');
const { buildLinkGraph } = require('../../seo-auditor/src/link-graph');
const { scoreCannibalization, buildSignals } = require('./scorer');

/**
 * Só pares com score >= MIN_REPORT_SCORE entram na saída — pares LOW (0-39)
 * numerosos e pouco informativos são omitidos do relatório para manter o
 * foco em conflitos que merecem revisão humana. Pares reclassificados como
 * `complementary` (pilar↔satélite) TAMBÉM só entram se o score numérico
 * cru já fosse >= este threshold — ou seja, continuam visíveis (não
 * escondidos), só com a interpretação de risco corrigida. Ver
 * scorer.js#scoreCannibalization e o histórico da Fase 3.1.
 */
const MIN_REPORT_SCORE = 40;

function explain(pageA, pageB, score, level, differentiationSignals) {
  if (level === 'complementary') {
    return `"${pageA.title}" e "${pageB.title}" têm sobreposição textual (score ${score}/100) explicada pela arquitetura pilar↔satélite do site — relação complementar esperada, não concorrência pela mesma busca.`;
  }

  const base =
    level === 'high'
      ? `Alta sobreposição de título/slug/conteúdo entre "${pageA.title}" e "${pageB.title}" — possível canibalização, revisão manual recomendada.`
      : level === 'possible'
      ? `Sobreposição moderada entre "${pageA.title}" e "${pageB.title}" — pode ser conteúdo relacionado ou possível canibalização parcial.`
      : `Sobreposição baixa entre "${pageA.title}" e "${pageB.title}" — provavelmente conteúdo apenas relacionado, não canibalização.`;

  if (differentiationSignals.length > 0) {
    return `${base} Sinais de diferenciação de intenção encontrados: ${differentiationSignals.join('; ')}.`;
  }
  return base;
}

function recommend(level, differentiationSignals) {
  if (level === 'complementary') {
    return 'Nenhuma ação de correção necessária — esta é a relação pilar↔satélite esperada. Boa candidata a link interno explícito entre as duas páginas, se ainda não existir (ver módulo Internal Linking).';
  }
  if (level === 'high') {
    if (differentiationSignals.length > 0) {
      return 'Apesar do score alto, há sinais de intenção diferenciada — revisar manualmente antes de qualquer ação; considerar reforçar essa diferenciação nos títulos/H1 se a sobreposição ainda incomodar.';
    }
    return 'Revisar manualmente os dois artigos: confirmar se atendem a intenções de busca realmente distintas; se não, considerar diferenciar títulos/H1, fortalecer o conteúdo mais completo, ou criar links entre eles como conteúdo complementar. Não consolidar/apagar sem revisão manual.';
  }
  if (level === 'possible') {
    return 'Avaliar se os artigos são complementares (nesse caso, considerar linká-los entre si) ou se competem pela mesma busca (nesse caso, diferenciar títulos ou aprofundar um deles).';
  }
  return 'Nenhuma ação necessária — sobreposição dentro do esperado para artigos do mesmo nicho.';
}

/**
 * Compara todos os pares (i, j) com i < j — cada par é analisado uma única
 * vez. Constrói o grafo de links do site uma única vez (para inboundCount,
 * usado pelo classificador de formato/pilar) e reaproveita para todos os
 * C(N,2) pares.
 */
function analyzeCannibalization(posts, bodyTextByPath) {
  const eligiblePosts = posts.filter((p) => p.page_type === 'post');
  const profiles = eligiblePosts.map((p) => buildPageProfile(p, bodyTextByPath.get(p.path) || ''));

  const linkGraph = buildLinkGraph(posts);
  const inboundFor = (post) => linkGraph.inboundCount.get(post.url_path) || 0;

  const pairs = [];
  let pairsAnalyzed = 0;
  const levelCounts = { low: 0, possible: 0, high: 0, complementary: 0 };

  for (let i = 0; i < eligiblePosts.length; i++) {
    for (let j = i + 1; j < eligiblePosts.length; j++) {
      pairsAnalyzed += 1;
      const pageA = eligiblePosts[i];
      const pageB = eligiblePosts[j];
      const profileA = profiles[i];
      const profileB = profiles[j];

      const { score, level, components, differentiationSignals, formatA, formatB, relationship } = scoreCannibalization(
        profileA,
        profileB,
        pageA,
        pageB,
        { inboundCount: inboundFor(pageA) },
        { inboundCount: inboundFor(pageB) }
      );

      if (score < MIN_REPORT_SCORE) continue;

      levelCounts[level] = (levelCounts[level] || 0) + 1;

      const signals = buildSignals(profileA, profileB, components);

      pairs.push({
        page_a: pageA.url_path,
        page_a_title: pageA.title,
        page_b: pageB.url_path,
        page_b_title: pageB.title,
        score,
        level,
        format_a: formatA,
        format_b: formatB,
        relationship,
        signals,
        differentiation_signals: differentiationSignals,
        explanation: explain(pageA, pageB, score, level, differentiationSignals),
        recommendation: recommend(level, differentiationSignals),
      });
    }
  }

  pairs.sort((a, b) => b.score - a.score);

  return {
    pairs,
    pairsAnalyzed,
    pagesAnalyzed: eligiblePosts.length,
    levelCounts,
  };
}

module.exports = { analyzeCannibalization, MIN_REPORT_SCORE };
