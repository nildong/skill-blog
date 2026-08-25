'use strict';

/**
 * Classificador de formato editorial de uma página — usado para
 * distinguir "pilar↔satélite" (relação complementar, arquitetura
 * intencional) de "duas páginas competindo pela mesma busca" (possível
 * canibalização real). Ver V2-ARCHITECTURE-AUDIT.md e o histórico da
 * Fase 3.1 para o problema que este módulo resolve.
 *
 * NÃO depende só do prefixo do slug — usa múltiplos sinais locais (title,
 * headings, page_type, faq estruturado do Site Indexer, e a quantidade de
 * links de entrada da página, quando disponível).
 */

const FORMATS = Object.freeze({
  PILLAR: 'pillar',
  FAQ: 'faq',
  COMPARISON: 'comparison',
  REVIEW: 'review',
  LIST: 'list',
  HOW_TO: 'how_to',
  TROUBLESHOOTING: 'troubleshooting',
  GUIDE: 'guide',
  INFORMATIONAL: 'informational',
  INSTITUTIONAL: 'institutional',
  UNKNOWN: 'unknown',
});

/**
 * Threshold de "página pilar" por links de ENTRADA (inbound), não por
 * word_count/h2_count — calibrado contra os dados reais do site (ver
 * discussão da Fase 3.1): os 5 pilares conhecidos (comedouro-automatico-
 * para-pet, coleira-gps-para-pet, camera-para-monitorar-pet,
 * porta-eletronica-automatica-para-pet, brinquedo-interativo-automatico-
 * para-gato) têm inbound entre 23 e 47; o próximo nível abaixo disso (bons
 * satélites/hubs de sub-cluster, ex: comedouro-automatico-vale-a-pena,
 * melhor-comedouro-automatico-cachorro) tem no máximo 14. word_count e
 * h2_count NÃO são sinais confiáveis de pilar neste site — vários
 * satélites (reviews, listicles) são mais longos que os pilares reais.
 */
const PILLAR_MIN_INBOUND = 20;

const FAQ_TITLE_RE = /perguntas frequentes|d[uú]vidas frequentes|\bfaq\b/i;
const TROUBLESHOOTING_TITLE_RE = /erros comuns|problemas comuns/i;
const COMPARISON_TITLE_RE = /\b(vs\.?|ou)\b/i;
const REVIEW_TITLE_RE = /\breview\b/i;
const GUIDE_TITLE_RE = /\bguia\b/i;

/**
 * `post` é um registro no formato do site-index.json (slug, title,
 * page_type, faq, content.word_count, heading_summary — todos opcionais
 * exceto os usados). `context.inboundCount`, se fornecido, é o número de
 * links internos de entrada já calculado pelo chamador (ex: via
 * tools/seo-auditor/src/link-graph.js#buildLinkGraph) — não é
 * responsabilidade desta função construir o grafo do site inteiro.
 */
function detectFormat(post, context = {}) {
  if (!post) return FORMATS.UNKNOWN;
  if (post.page_type && post.page_type !== 'post') return FORMATS.INSTITUTIONAL;

  const slug = post.slug || '';
  const title = post.title || '';

  // PILLAR (por links de entrada) é checado ANTES do FAQ de propósito:
  // muitas páginas pilar deste site têm seu PRÓPRIO bloco de FAQ com
  // schema (além de terem um satélite "duvidas-*" dedicado) — se o FAQ
  // fosse checado primeiro, todo pilar com FAQ na própria página seria
  // erroneamente classificado como FAQ, quebrando a detecção de pilar
  // (achado real durante a validação da Fase 3.1). Links de entrada é um
  // sinal estrutural sobre a arquitetura do site, ortogonal a "esta
  // página também responde perguntas frequentes".
  const inboundCount = context.inboundCount;
  if (typeof inboundCount === 'number' && inboundCount >= PILLAR_MIN_INBOUND) {
    return FORMATS.PILLAR;
  }

  // FAQ explícito (slug/título) tem prioridade sobre os demais formatos
  // específicos — mas "tem schema FAQPage" sozinho NÃO, porque é comum
  // (~42% dos posts do site) qualquer artigo incluir um bloco de FAQ além
  // do seu formato principal (comparativo, review, how-to...). Achado
  // real na validação da Fase 3.1: `comedouro-com-ou-sem-wifi` (um
  // COMPARISON — título contém "ou") também tem FAQPage schema e era
  // erroneamente classificado como FAQ quando o schema tinha prioridade
  // alta, mascarando o formato real da página.
  if (/^duvidas-/.test(slug) || FAQ_TITLE_RE.test(title)) return FORMATS.FAQ;

  if (/^erros-comuns-/.test(slug) || TROUBLESHOOTING_TITLE_RE.test(title)) return FORMATS.TROUBLESHOOTING;

  if (/-x-/.test(slug) || COMPARISON_TITLE_RE.test(title)) return FORMATS.COMPARISON;

  if (/-review$/.test(slug) || REVIEW_TITLE_RE.test(title)) return FORMATS.REVIEW;

  if (/^melhor-/.test(slug) || /^melhor\b/i.test(title)) return FORMATS.LIST;

  if (/^como-/.test(slug) || /^como\b/i.test(title)) return FORMATS.HOW_TO;

  // Fallback: schema FAQPage presente, mas sem nenhum sinal estrutural
  // explícito de outro formato mais específico — só então tratamos como FAQ.
  if (post.faq && post.faq.schema_detected) return FORMATS.FAQ;

  if (GUIDE_TITLE_RE.test(title)) return FORMATS.GUIDE;

  const hasTitle = Boolean(title.trim());
  const hasHeadings = Array.isArray(post.headings) && post.headings.length > 0;
  if (!hasTitle && !hasHeadings) return FORMATS.UNKNOWN;

  return FORMATS.INFORMATIONAL;
}

/**
 * Formatos considerados "satélite" de um pilar — conteúdo específico e
 * complementar, não um segundo hub. Pilar + qualquer um destes é tratado
 * como relação COMPLEMENTAR (ver relationshipType), não como candidato a
 * canibalização.
 */
const SATELLITE_FORMATS = new Set([
  FORMATS.FAQ,
  FORMATS.TROUBLESHOOTING,
  FORMATS.HOW_TO,
  FORMATS.REVIEW,
  FORMATS.LIST,
  FORMATS.COMPARISON,
  FORMATS.GUIDE,
]);

/**
 * Classifica a relação entre dois formatos:
 *  - 'pillar_satellite': um dos dois é PILLAR e o outro é um formato
 *    satélite reconhecido — relação complementar esperada, não conflito.
 *  - 'same_format': ambos têm exatamente o mesmo formato (ex: dois
 *    REVIEW, dois FAQ) — é justamente o cenário de MAIOR risco real de
 *    canibalização (dois conteúdos otimizados para o mesmo tipo de busca).
 *  - 'different_format': formatos diferentes, nenhum é PILLAR (ex:
 *    HOW_TO vs. TROUBLESHOOTING) — sinal de diferenciação, mas mais fraco
 *    que pillar_satellite.
 *  - 'unknown': não há informação suficiente para opinar (um dos lados é
 *    UNKNOWN).
 */
function isSpecificFormat(format) {
  return SATELLITE_FORMATS.has(format) || format === FORMATS.PILLAR;
}

/**
 * `formatA !== formatB`, ambos são formatos específicos e reconhecidos
 * (não INFORMATIONAL/INSTITUTIONAL/UNKNOWN), e nenhum é PILLAR. Cobre o
 * caso citado no próprio exemplo do prompt da Fase 3.1: "câmera pet
 * 1080p vs 2K" (COMPARISON) e "como escolher resolução da câmera pet"
 * (HOW_TO) tratam do mesmo tema com intenções claramente diferentes,
 * mesmo sem nenhum dos dois ser a página pilar do cluster. Achado real
 * na validação: `como-instalar-porta-eletronica-pet` (HOW_TO) ↔
 * `erros-comuns-porta-eletronica-pet` (TROUBLESHOOTING) — mesmo
 * problema, mesmo padrão.
 */
function isDifferentiatedSatellitePair(formatA, formatB) {
  if (formatA === formatB) return false;
  if (formatA === FORMATS.PILLAR || formatB === FORMATS.PILLAR) return false;
  return isSpecificFormat(formatA) && isSpecificFormat(formatB);
}

function relationshipType(formatA, formatB) {
  if (formatA === FORMATS.UNKNOWN || formatB === FORMATS.UNKNOWN) return 'unknown';

  const isPillarA = formatA === FORMATS.PILLAR;
  const isPillarB = formatB === FORMATS.PILLAR;

  if (isPillarA !== isPillarB) {
    const satelliteFormat = isPillarA ? formatB : formatA;
    if (SATELLITE_FORMATS.has(satelliteFormat)) return 'pillar_satellite';
  }

  if (formatA === formatB) return 'same_format';

  if (isDifferentiatedSatellitePair(formatA, formatB)) return 'differentiated_satellites';

  return 'different_format';
}

module.exports = {
  FORMATS,
  SATELLITE_FORMATS,
  PILLAR_MIN_INBOUND,
  detectFormat,
  relationshipType,
  isSpecificFormat,
  isDifferentiatedSatellitePair,
};
