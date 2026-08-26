'use strict';

const fs = require('fs');
const path = require('path');

const { auditPage, buildContext } = require('../../seo-auditor/src/auditor');
const { buildLinkGraph } = require('../../seo-auditor/src/link-graph');
const { buildPageProfile } = require('../../shared/profile');
const { stripDiacritics } = require('../../shared/terms');
const { scoreCannibalization } = require('../../cannibalization/src/scorer');

/**
 * Quality Gate — Etapa 7 da orquestração pré-publicação.
 *
 * Princípios (definidos pelo usuário, não-negociáveis):
 *  1. Conservador, não exageradamente rígido — BLOCKER só para algo que
 *     realmente prejudicaria publicação/indexação ou viola o contrato
 *     editorial de forma clara.
 *  2. Nunca afirma qualidade que não consegue medir. O status APPROVED
 *     nunca vira "este artigo é bom" — só "nenhum defeito estrutural
 *     conhecido foi encontrado" (ver `note` no resultado).
 *  3. Schema × conteúdo visível é sempre verificado (FAQPage, Review/
 *     Rating, preço, autor) — mentira estrutural é sempre BLOCKER.
 *  4. Ausência de elemento opcional (FAQ, vídeo, WebP, schema opcional)
 *     nunca é BLOCKER por si só.
 *  5. Keyword stuffing começa em WARNING; só BLOCKER em caso absurdo.
 *  6. Claim de experiência pessoal sem confirmação explícita na proposta
 *     é BLOCKER (mas ausência de metodologia declarada não é, por si só).
 *  7. Canibalização HIGH real (pós-escrita) é sempre BLOCKER; MEDIUM vira
 *     WARNING (exige justificativa humana, não pode ser verificada por
 *     texto livre de forma confiável); LOW/COMPLEMENTARY não geram issue.
 */

const LEVEL = Object.freeze({ BLOCKER: 'BLOCKER', WARNING: 'WARNING', INFO: 'INFO' });

const SEO_SEVERITY_MAP = Object.freeze({
  CRITICAL: LEVEL.BLOCKER,
  ERROR: LEVEL.BLOCKER,
  WARNING: LEVEL.WARNING,
  INFO: LEVEL.INFO,
});

function makeFinding({ id, category, severity, evidence, recommendation }) {
  return { id, category, severity, evidence, recommendation };
}

function normalizeForSearch(text) {
  return stripDiacritics(String(text || '').toLowerCase()).replace(/\s+/g, ' ').trim();
}

// --- A. SEO técnico (reaproveita tools/seo-auditor, sem duplicar regra) ---

function checkSeoTechnical(post, allPostsIncludingThis) {
  const context = buildContext(allPostsIncludingThis);
  const result = auditPage(post, context);
  return result.issues.map((issue) =>
    makeFinding({
      id: issue.id,
      category: `seo_${issue.category}`,
      severity: SEO_SEVERITY_MAP[issue.severity] || LEVEL.INFO,
      evidence: issue.evidence,
      recommendation: issue.recommendation,
    })
  );
}

// --- B. Imagens referenciadas existem de fato no disco ---

function checkImagesExistOnDisk(articleDir, html) {
  const findings = [];
  if (!articleDir || !html) return findings;
  const srcs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map((m) => m[1]);
  for (const src of srcs) {
    if (/^https?:\/\//i.test(src) || src.startsWith('data:')) continue;
    const absPath = path.join(articleDir, src);
    if (!fs.existsSync(absPath)) {
      findings.push(
        makeFinding({
          id: 'BROKEN_IMAGE_REFERENCE',
          category: 'images',
          severity: LEVEL.BLOCKER,
          evidence: `Imagem referenciada no HTML não existe no disco: "${src}"`,
          recommendation: 'Adicionar o arquivo de imagem correspondente, ou corrigir o caminho, antes de publicar.',
        })
      );
    }
  }
  return findings;
}

// --- C. Schema × conteúdo visível ---

const JSONLD_BLOCK_RE = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

/**
 * Extração leve de blocos JSON-LD por regex — deliberadamente sem
 * cheerio (evita adicionar dependência nova ao orchestrator só para
 * isto; tools/site-indexer já faz o parsing "de verdade" com cheerio e
 * grava `schema_invalid_count`, que o SEO técnico já reporta). Aqui só
 * precisamos do conteúdo estruturado para comparar contra o texto
 * visível — blocos malformados são simplesmente ignorados (o erro de
 * sintaxe já vira BLOCKER via JSONLD_INVALID no checkSeoTechnical).
 */
function extractJsonLdNodes(html) {
  const nodes = [];
  for (const match of html.matchAll(JSONLD_BLOCK_RE)) {
    let parsed;
    try {
      parsed = JSON.parse(match[1]);
    } catch {
      continue;
    }
    const arr = Array.isArray(parsed) ? parsed : parsed && parsed['@graph'] ? parsed['@graph'] : [parsed];
    for (const node of arr) if (node) nodes.push(node);
  }
  return nodes;
}

function nodeTypes(node) {
  return Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
}

function checkSchemaVsVisible(post, html, bodyText) {
  const findings = [];
  const nodes = extractJsonLdNodes(html);
  const normBody = normalizeForSearch(bodyText);

  for (const node of nodes) {
    const types = nodeTypes(node);

    // FAQPage: perguntas declaradas precisam corresponder a conteúdo
    // visível — não apenas existir um heading genérico de FAQ.
    if (types.includes('FAQPage')) {
      const mainEntity = Array.isArray(node.mainEntity) ? node.mainEntity : node.mainEntity ? [node.mainEntity] : [];
      const questions = mainEntity.filter((q) => q && q['@type'] === 'Question' && q.name);

      if (questions.length > 0 && !(post.faq && post.faq.heading_detected)) {
        findings.push(
          makeFinding({
            id: 'SCHEMA_FAQ_WITHOUT_VISIBLE_HEADING',
            category: 'schema',
            severity: LEVEL.BLOCKER,
            evidence: `Schema FAQPage declara ${questions.length} pergunta(s), mas nenhum heading de FAQ foi encontrado no conteúdo visível da página.`,
            recommendation: 'Adicionar visivelmente as perguntas/respostas no corpo do artigo, ou remover o schema FAQPage.',
          })
        );
      }

      if (questions.length > 0) {
        const missing = questions.filter((q) => {
          const words = normalizeForSearch(q.name).split(' ').filter((w) => w.length > 3).slice(0, 6);
          return words.length === 0 || !words.every((w) => normBody.includes(w));
        });
        if (missing.length === questions.length) {
          findings.push(
            makeFinding({
              id: 'SCHEMA_FAQ_QUESTIONS_NOT_FOUND_IN_TEXT',
              category: 'schema',
              severity: LEVEL.BLOCKER,
              evidence: `Nenhuma das ${questions.length} pergunta(s) do schema FAQPage foi encontrada, nem parcialmente, no texto visível.`,
              recommendation: 'Garantir que as perguntas declaradas no schema correspondam ao conteúdo real e visível da página.',
            })
          );
        }
      }
    }

    // Review/Rating: nota declarada precisa aparecer como texto visível.
    const review = types.includes('Review') ? node : node.review;
    if (review && review.reviewRating && review.reviewRating.ratingValue !== undefined) {
      const val = String(review.reviewRating.ratingValue);
      const variants = [val, val.replace('.', ',')];
      if (!variants.some((v) => bodyText.includes(v))) {
        findings.push(
          makeFinding({
            id: 'SCHEMA_RATING_NOT_VISIBLE',
            category: 'schema',
            severity: LEVEL.BLOCKER,
            evidence: `Schema declara nota "${val}", mas esse valor não aparece em nenhum lugar do conteúdo visível.`,
            recommendation: 'Exibir a nota visivelmente no artigo (ex: bloco de veredito), ou remover o schema de Review/Rating.',
          })
        );
      }
    }

    // Preço: mesmo princípio.
    if (node.offers && node.offers.price !== undefined) {
      const price = String(node.offers.price);
      if (!bodyText.includes(price)) {
        findings.push(
          makeFinding({
            id: 'SCHEMA_PRICE_NOT_VISIBLE',
            category: 'schema',
            severity: LEVEL.BLOCKER,
            evidence: `Schema declara preço "${price}", mas não aparece no conteúdo visível.`,
            recommendation: 'Exibir o preço no texto (com fonte/data de consulta) ou remover o campo de preço do schema.',
          })
        );
      }
    }

    // Autor: nome declarado em schema de Person ligado a /autores/ precisa
    // aparecer visivelmente (linha de autoria) — não pode ser um autor
    // fantasma só no JSON-LD.
    if (types.includes('Person') && node.name && node.url && /\/autores\//.test(node.url)) {
      if (!bodyText.includes(node.name)) {
        findings.push(
          makeFinding({
            id: 'SCHEMA_AUTHOR_NOT_VISIBLE',
            category: 'schema',
            severity: LEVEL.BLOCKER,
            evidence: `Schema declara autor "${node.name}", mas o nome não aparece visivelmente na página.`,
            recommendation: 'Adicionar a linha de autoria visível correspondente ao schema (ex: "Por Nome do Autor").',
          })
        );
      }
    }

    // BlogPosting/Article headline vs H1: checagem leve (WARNING, não
    // BLOCKER) — divergência grande é inconsistência editorial, não
    // necessariamente um dado inventado.
    if ((types.includes('BlogPosting') || types.includes('Article')) && node.headline) {
      const h1 = (post.headings || []).find((h) => h.tag === 'h1');
      if (h1 && h1.text) {
        const headlineWords = new Set(normalizeForSearch(node.headline).split(' ').filter((w) => w.length > 2));
        const h1Words = new Set(normalizeForSearch(h1.text).split(' ').filter((w) => w.length > 2));
        const intersection = [...headlineWords].filter((w) => h1Words.has(w)).length;
        const overlap = headlineWords.size > 0 ? intersection / headlineWords.size : 1;
        if (overlap < 0.2) {
          findings.push(
            makeFinding({
              id: 'SCHEMA_HEADLINE_INCONSISTENT_WITH_H1',
              category: 'schema',
              severity: LEVEL.WARNING,
              evidence: `Schema headline ("${node.headline}") tem pouca relação textual com o H1 ("${h1.text}").`,
              recommendation: 'Alinhar o headline do schema com o H1 real da página.',
            })
          );
        }
      }
    }
  }

  return findings;
}

// --- D. E-E-A-T: claim de experiência pessoal sem confirmação ---

// Global (com índice) para poder inspecionar o contexto ao redor de cada
// ocorrência e distinguir afirmação positiva ("testamos o produto") de
// negação/transparência editorial ("não testamos o produto fisicamente"
// — isso é uma boa prática, não um claim inventado, e NUNCA deve virar
// BLOCKER). Achado real: o artigo `tapete-higienico-para-cachorro`
// publicado contém exatamente essa frase de transparência.
const PERSONAL_EXPERIENCE_PATTERNS = [
  /testamos/gi,
  /testei/gi,
  /em nosso teste/gi,
  /na nossa experi[eê]ncia/gi,
  /usamos (pessoalmente|por \d+)/gi,
  /ap[oó]s \d+ (dias|semanas|meses) de uso/gi,
  /compramos (e testamos|este produto)/gi,
];

const NEGATION_WINDOW_CHARS = 40;
const NEGATION_RE = /\b(n[aã]o|nunca|jamais|sem)\b/i;

/**
 * Verdadeiro se houver uma palavra de negação nos ~40 caracteres antes da
 * ocorrência — heurística simples, mas suficiente para não confundir
 * "não testamos" com "testamos".
 */
function isNegatedContext(bodyText, matchIndex) {
  const start = Math.max(0, matchIndex - NEGATION_WINDOW_CHARS);
  const window = bodyText.slice(start, matchIndex);
  return NEGATION_RE.test(window);
}

function checkPersonalExperienceClaims(bodyText, personalExperienceConfirmed) {
  if (personalExperienceConfirmed) return [];
  const findings = [];
  for (const re of PERSONAL_EXPERIENCE_PATTERNS) {
    re.lastIndex = 0;
    let match;
    while ((match = re.exec(bodyText)) !== null) {
      if (!isNegatedContext(bodyText, match.index)) {
        const contextStart = Math.max(0, match.index - 20);
        const contextEnd = Math.min(bodyText.length, match.index + match[0].length + 20);
        findings.push(
          makeFinding({
            id: 'UNVERIFIED_PERSONAL_EXPERIENCE_CLAIM',
            category: 'eeat',
            severity: LEVEL.BLOCKER,
            evidence: `Trecho encontrado: "...${bodyText.slice(contextStart, contextEnd)}..." — afirma experiência pessoal/teste físico sem confirmação em \`personal_experience_confirmed\` na proposta.`,
            recommendation: 'Remover a afirmação de teste pessoal, reescrever como síntese de fontes, ou marcar personal_experience_confirmed: true na proposta se o teste realmente ocorreu.',
          })
        );
      }
      // Evita loop infinito em regex sem avanço (não é o caso aqui, mas defensivo).
      if (re.lastIndex === match.index) re.lastIndex++;
    }
  }
  return findings;
}

// --- E. Keyword stuffing (WARNING por padrão; BLOCKER só em caso absurdo) ---

const KEYWORD_STUFFING_WARNING_THRESHOLD = 0.03; // 3% de densidade
const KEYWORD_STUFFING_BLOCKER_THRESHOLD = 0.08; // 8% — caso claramente absurdo

function checkKeywordDensity(bodyText, keyword) {
  if (!keyword || !bodyText) return [];
  const normBody = normalizeForSearch(bodyText);
  const normKeyword = normalizeForSearch(keyword);
  if (!normKeyword) return [];

  const totalWords = normBody.split(' ').filter(Boolean).length || 1;
  const keywordWordCount = normKeyword.split(' ').filter(Boolean).length;
  const occurrences = normBody.split(normKeyword).length - 1;
  if (occurrences === 0) return [];

  const density = (occurrences * keywordWordCount) / totalWords;
  const evidence = `Keyword "${keyword}" repetida ${occurrences}x no texto (densidade ~${(density * 100).toFixed(1)}%).`;

  if (density >= KEYWORD_STUFFING_BLOCKER_THRESHOLD) {
    return [
      makeFinding({
        id: 'KEYWORD_STUFFING_SEVERE',
        category: 'content',
        severity: LEVEL.BLOCKER,
        evidence,
        recommendation: 'Densidade muito acima do natural — reduzir drasticamente a repetição literal, usar variações e sinônimos.',
      }),
    ];
  }
  if (density >= KEYWORD_STUFFING_WARNING_THRESHOLD) {
    return [
      makeFinding({
        id: 'KEYWORD_STUFFING_POSSIBLE',
        category: 'content',
        severity: LEVEL.WARNING,
        evidence,
        recommendation: 'Revisar se a repetição é natural; considerar variações e sinônimos para parte das ocorrências.',
      }),
    ];
  }
  return [];
}

// --- F. Canibalização real (pós-escrita) ---

function checkCannibalizationReal(post, bodyText, allPosts, bodyTextByPath) {
  const findings = [];
  const others = (allPosts || []).filter((p) => p.page_type === 'post' && p.slug !== post.slug);
  if (others.length === 0) return findings;

  const postsWithLinks = [...others, post].map((p) => ({ ...p, internal_links: p.internal_links || [] }));
  const { inboundCount } = buildLinkGraph(postsWithLinks);

  const profile = buildPageProfile(post, bodyText);

  for (const other of others) {
    const otherText = (bodyTextByPath && bodyTextByPath.get(other.path)) || '';
    const otherProfile = buildPageProfile(other, otherText);
    const result = scoreCannibalization(
      profile,
      otherProfile,
      post,
      other,
      { inboundCount: inboundCount.get(post.url_path) || 0 },
      { inboundCount: inboundCount.get(other.url_path) }
    );

    if (result.level === 'high') {
      findings.push(
        makeFinding({
          id: 'CANNIBALIZATION_HIGH',
          category: 'cannibalization',
          severity: LEVEL.BLOCKER,
          evidence: `Possível canibalização HIGH (score ${result.score}) com "${other.title}" (${other.url_path}).`,
          recommendation: 'Diferenciar claramente a intenção de busca, consolidar os dois artigos, ou reduzir a sobreposição real de conteúdo antes de publicar.',
        })
      );
    } else if (result.level === 'possible') {
      findings.push(
        makeFinding({
          id: 'CANNIBALIZATION_MEDIUM',
          category: 'cannibalization',
          severity: LEVEL.WARNING,
          evidence: `Possível canibalização MEDIUM (score ${result.score}) com "${other.title}" (${other.url_path}).`,
          recommendation: 'Documentar a justificativa de diferenciação (seção 3 do brief) antes de publicar.',
        })
      );
    }
    // 'low' e 'complementary' não geram finding — sobreposição esperada/saudável.
  }

  return findings;
}

// --- G. Plano de internal linking aplicado (nunca BLOCKER — só WARNING) ---

function checkInternalLinkingApplied(post, internalLinkingPlan) {
  if (!internalLinkingPlan || !internalLinkingPlan.should_link_to || internalLinkingPlan.should_link_to.length === 0) {
    return [];
  }
  const appliedHrefs = (post.internal_links || []).map((l) => l.href || '');
  const suggested = internalLinkingPlan.should_link_to.map((s) => s.target);
  const appliedCount = suggested.filter((target) => appliedHrefs.some((href) => href.includes(target))).length;

  if (appliedCount === 0) {
    return [
      makeFinding({
        id: 'PLANNED_INTERNAL_LINKS_NOT_APPLIED',
        category: 'internal_linking',
        severity: LEVEL.WARNING,
        evidence: `Nenhum dos ${suggested.length} link(s) de saída sugerido(s) no brief foi encontrado no artigo publicado.`,
        recommendation: 'Reavaliar se os links sugeridos ainda fazem sentido editorial e adicioná-los, se sim (nunca obrigatório — apenas recomendado).',
      }),
    ];
  }
  return [];
}

/**
 * Ponto de entrada principal do Quality Gate. Função pura — recebe todos
 * os dados já carregados, retorna o relatório. Não lê/escreve disco (isso
 * fica a cargo do CLI).
 *
 * @param {object} input
 * @param {object} input.post - registro do artigo (formato site-index, via parseFile+analyzePost)
 * @param {string} input.html - HTML bruto do artigo
 * @param {string} input.bodyText - texto visível do body (tools/shared/html-text)
 * @param {string} [input.articleDir] - diretório absoluto do artigo (para checar imagens no disco)
 * @param {object[]} [input.allPosts] - demais posts do site (site-index.json), SEM o próprio artigo
 * @param {Map<string,string>} [input.bodyTextByPath] - texto dos demais posts (para canibalização real)
 * @param {string} [input.keyword] - keyword alvo (da proposta/brief), para densidade
 * @param {boolean} [input.personalExperienceConfirmed] - da proposta
 * @param {object} [input.internalLinkingPlan] - do preflight-report.json
 */
function runQualityGate(input) {
  const { post, html, bodyText, articleDir, allPosts = [], bodyTextByPath = new Map(), keyword, personalExperienceConfirmed = false, internalLinkingPlan } = input;

  if (!post || !post.slug) {
    throw new Error('quality-gate: "post" inválido (falta slug) — rode o parsing do artigo antes.');
  }

  const findings = [
    ...checkSeoTechnical(post, [...allPosts, post]),
    ...checkImagesExistOnDisk(articleDir, html),
    ...checkSchemaVsVisible(post, html, bodyText),
    ...checkPersonalExperienceClaims(bodyText, personalExperienceConfirmed),
    ...checkKeywordDensity(bodyText, keyword),
    ...checkCannibalizationReal(post, bodyText, allPosts, bodyTextByPath),
    ...checkInternalLinkingApplied(post, internalLinkingPlan),
  ];

  const blockers = findings.filter((f) => f.severity === LEVEL.BLOCKER);
  const warnings = findings.filter((f) => f.severity === LEVEL.WARNING);
  const infos = findings.filter((f) => f.severity === LEVEL.INFO);

  const status = blockers.length > 0 ? 'BLOCKED' : 'APPROVED';

  return {
    version: 1,
    generated_at: new Date().toISOString(),
    slug: post.slug,
    status,
    summary: { blockers: blockers.length, warnings: warnings.length, info: infos.length },
    findings,
    note:
      status === 'APPROVED'
        ? 'Nenhum defeito estrutural conhecido foi encontrado. Isto NÃO é uma avaliação de qualidade editorial — apenas ausência de violações estruturais detectáveis automaticamente. Revisão humana de conteúdo continua recomendada.'
        : 'Publicação BLOQUEADA — resolva todos os itens de severidade BLOCKER listados e rode a validação novamente antes de publicar.',
  };
}

function buildMarkdownReport(result) {
  const lines = [];
  lines.push(`# Quality Report — ${result.slug}`, '');
  lines.push(`**Status: ${result.status}**`, '');
  lines.push(result.note, '');
  lines.push(`- BLOCKER: ${result.summary.blockers}`);
  lines.push(`- WARNING: ${result.summary.warnings}`);
  lines.push(`- INFO: ${result.summary.info}`, '');

  for (const sev of ['BLOCKER', 'WARNING', 'INFO']) {
    const items = result.findings.filter((f) => f.severity === sev);
    lines.push(`## ${sev} (${items.length})`, '');
    if (items.length === 0) {
      lines.push('Nenhum item nesta severidade.', '');
      continue;
    }
    for (const f of items) {
      lines.push(`- **${f.id}** (${f.category})`);
      lines.push(`  - Evidência: ${f.evidence}`);
      lines.push(`  - Recomendação: ${f.recommendation}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function writeQualityGateReport(root, slug, result) {
  const dir = path.join(root, '.data', 'pipeline', slug);
  fs.mkdirSync(dir, { recursive: true });

  const jsonPath = path.join(dir, 'quality-gate.json');
  const json = JSON.stringify(result, null, 2) + '\n';
  fs.writeFileSync(jsonPath, json, 'utf8');

  const mdPath = path.join(dir, 'quality-report.md');
  const md = buildMarkdownReport(result);
  fs.writeFileSync(mdPath, md, 'utf8');

  return {
    jsonPath,
    mdPath,
    jsonBytes: Buffer.byteLength(json, 'utf8'),
    mdBytes: Buffer.byteLength(md, 'utf8'),
  };
}

module.exports = {
  LEVEL,
  runQualityGate,
  buildMarkdownReport,
  writeQualityGateReport,
  checkSeoTechnical,
  checkImagesExistOnDisk,
  checkSchemaVsVisible,
  checkPersonalExperienceClaims,
  checkKeywordDensity,
  checkCannibalizationReal,
  checkInternalLinkingApplied,
};
