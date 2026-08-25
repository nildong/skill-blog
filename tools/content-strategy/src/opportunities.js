'use strict';

const { computeScore } = require('./scorer');
const { ROLE } = require('./classifier');

let idCounter = 0;
function nextId(prefix) {
  idCounter += 1;
  return `${prefix}-${String(idCounter).padStart(4, '0')}`;
}
function resetIdCounter() {
  idCounter = 0;
}

function makeOpportunity({ type, page, related, reason, evidence, confidence, action }) {
  const severities = (evidence || []).map((e) => e.severity).filter(Boolean);
  const score_breakdown = computeScore({ type, severities, page, evidenceList: evidence, confidence });

  return {
    id: nextId(type),
    type,
    score: score_breakdown.total,
    score_breakdown,
    confidence,
    page: page ? page.url : null,
    related_pages: (related || []).map((p) => (typeof p === 'string' ? p : p.url)),
    reason,
    evidence: (evidence || []).map((e) => e.text),
    recommended_action: action,
  };
}

// --------------------------------------------------------------- UPDATE_EXISTING

// Issues do SEO Auditor que representam correção técnica pontual, não
// expansão de conteúdo nem canibalização — agregadas em UMA oportunidade
// UPDATE_EXISTING por página (nunca uma por issue, evita duplicidade).
const UPDATE_EXISTING_ISSUE_IDS = new Set([
  'TITLE_MISSING', 'TITLE_DUPLICATE', 'DESCRIPTION_MISSING', 'DESCRIPTION_DUPLICATE',
  'CANONICAL_MISSING', 'CANONICAL_MISMATCH', 'H1_MISSING', 'H1_MULTIPLE', 'H2_BEFORE_H1',
  'HEADING_EMPTY', 'JSONLD_INVALID', 'JSONLD_MISSING', 'BROKEN_INTERNAL_LINK',
  'IMAGE_ALT_MISSING', 'IMAGE_ALT_EMPTY', 'LANGUAGE_MISSING', 'CHARSET_MISSING',
  'CHARSET_NOT_UTF8', 'ROBOTS_NOINDEX',
]);

/**
 * Fase 4.1 — Problema 2: páginas INSTITUTIONAL (contato, sobre, política
 * editorial, autor...) não devem virar UPDATE_EXISTING só por issues
 * INFO (ex: JSONLD_MISSING/LOW_INTERNAL_LINKS são intencionalmente INFO
 * para institucionais no SEO Auditor — não é um problema real). Essas
 * páginas só geram UPDATE_EXISTING se houver pelo menos uma issue com
 * severidade WARNING ou maior ("evidência adicional forte" — ver prompt
 * da Fase 4.1). Sem isso, a página cai naturalmente em NO_ACTION.
 */
function buildUpdateExistingOpportunities(inventory) {
  const opportunities = [];
  for (const page of inventory) {
    const issues = (page.seo_issues || []).filter((i) => UPDATE_EXISTING_ISSUE_IDS.has(i.id));
    if (issues.length === 0) continue;

    if (page.role === ROLE.INSTITUTIONAL) {
      const hasRealSignal = issues.some((i) => i.severity !== 'INFO');
      if (!hasRealSignal) continue;
    }

    const evidence = issues.map((i) => ({ text: `${i.id}: ${i.evidence}`, severity: i.severity }));
    opportunities.push(
      makeOpportunity({
        type: 'UPDATE_EXISTING',
        page,
        related: [],
        reason: `${issues.length} problema(s) técnico(s) de SEO detectado(s) pelo SEO Auditor.`,
        evidence,
        confidence: issues.some((i) => i.severity === 'ERROR' || i.severity === 'CRITICAL') ? 'HIGH' : 'MEDIUM',
        action: `Corrigir: ${issues.map((i) => i.id).join(', ')}.`,
      })
    );
  }
  return opportunities;
}

// --------------------------------------------------------------- EXPAND_EXISTING

/**
 * EXPAND_EXISTING exige sinal COMBINADO, não só CONTENT_BRIEF/word_count
 * (ver Fase 3, achado de falso positivo). Gatilhos aceitos:
 *  a) CONTENT_EXTREMELY_SHORT (ERROR, <150 palavras) sozinho já é
 *     evidência forte o suficiente.
 *  b) CONTENT_SHORT (WARNING, 150-299) + HEADING_STRUCTURE_THIN juntos —
 *     dois sinais independentes de estrutura rasa, não um só.
 * CONTENT_BRIEF (INFO, 300-399) NUNCA gera EXPAND_EXISTING sozinho.
 */
function buildExpandExistingOpportunities(inventory) {
  const opportunities = [];
  for (const page of inventory) {
    const issues = page.seo_issues || [];
    const extremelyShort = issues.find((i) => i.id === 'CONTENT_EXTREMELY_SHORT');
    const short = issues.find((i) => i.id === 'CONTENT_SHORT');
    const thin = issues.find((i) => i.id === 'HEADING_STRUCTURE_THIN');

    let evidence = null;
    let confidence = null;
    if (extremelyShort) {
      evidence = [{ text: `CONTENT_EXTREMELY_SHORT: ${extremelyShort.evidence}`, severity: 'ERROR' }];
      confidence = 'HIGH';
    } else if (short && thin) {
      evidence = [
        { text: `CONTENT_SHORT: ${short.evidence}`, severity: 'WARNING' },
        { text: `HEADING_STRUCTURE_THIN: ${thin.evidence}`, severity: 'INFO' },
      ];
      confidence = 'MEDIUM';
    }
    if (!evidence) continue;

    opportunities.push(
      makeOpportunity({
        type: 'EXPAND_EXISTING',
        page,
        related: [],
        reason: 'Conteúdo com sinais combinados de estrutura rasa (não apenas contagem de palavras isolada).',
        evidence,
        confidence,
        action: 'Avaliar se o conteúdo cobre completamente a intenção de busca e expandir seções que faltam.',
      })
    );
  }
  return opportunities;
}

// --------------------------------------------------------------- IMPROVE_INTERNAL_LINKING

function buildInternalLinkingOpportunities(inventory) {
  const opportunities = [];
  for (const page of inventory) {
    const isOrphan = (page.seo_issues || []).some((i) => i.id === 'ORPHAN_PAGE');
    const strongSuggestionsIn = (page.internal_linking_suggestions_in || []).filter((s) => s.score >= 45);

    if (!isOrphan && strongSuggestionsIn.length < 3) continue;

    const evidence = [];
    if (isOrphan) evidence.push({ text: 'Página órfã — nenhum link interno de entrada (SEO Auditor: ORPHAN_PAGE)', severity: 'ERROR' });
    if (strongSuggestionsIn.length > 0) {
      evidence.push({ text: `${strongSuggestionsIn.length} sugestão(ões) de link de entrada com score >= 45 ainda não aplicada(s)`, severity: isOrphan ? 'ERROR' : 'WARNING' });
    }

    opportunities.push(
      makeOpportunity({
        type: 'IMPROVE_INTERNAL_LINKING',
        page,
        related: strongSuggestionsIn.slice(0, 5).map((s) => s.source),
        reason: isOrphan ? 'Página órfã com boas oportunidades de link já identificadas pelo Internal Linking Engine.' : 'Página bem-relacionada, mas sem receber os links internos que a análise já identificou como relevantes.',
        evidence,
        confidence: isOrphan ? 'HIGH' : 'MEDIUM',
        action: `Adicionar link(s) a partir de: ${strongSuggestionsIn.slice(0, 5).map((s) => s.source_slug).join(', ') || '(ver Internal Linking Engine)'}.`,
      })
    );
  }
  return opportunities;
}

// --------------------------------------------------------------- IMPROVE_FAQ

function buildFaqOpportunities(inventory) {
  const opportunities = [];
  const rolesEligibleForNewFaq = new Set([ROLE.PILLAR, ROLE.REVIEW]);

  for (const page of inventory) {
    const issues = page.seo_issues || [];
    const headingWithoutSchema = issues.find((i) => i.id === 'FAQ_HEADING_WITHOUT_SCHEMA');
    const schemaEmpty = issues.find((i) => i.id === 'FAQ_SCHEMA_EMPTY');
    const opportunity = issues.find((i) => i.id === 'FAQ_OPPORTUNITY');

    if (headingWithoutSchema || schemaEmpty) {
      const issue = headingWithoutSchema || schemaEmpty;
      opportunities.push(
        makeOpportunity({
          type: 'IMPROVE_FAQ',
          page,
          related: [],
          reason: headingWithoutSchema ? 'A página já tem conteúdo de FAQ visível, mas sem schema estruturado — correção rápida com ganho de rich result.' : 'Schema FAQPage presente mas vazio (sem perguntas) — precisa ser preenchido ou removido.',
          evidence: [{ text: `${issue.id}: ${issue.evidence}`, severity: issue.severity }],
          confidence: 'HIGH',
          action: headingWithoutSchema ? 'Adicionar JSON-LD FAQPage correspondente ao conteúdo já existente.' : 'Preencher mainEntity do schema FAQPage ou removê-lo.',
        })
      );
      continue; // já tem oportunidade de FAQ mais forte, não empilhar com FAQ_OPPORTUNITY também
    }

    if (opportunity && rolesEligibleForNewFaq.has(page.role)) {
      opportunities.push(
        makeOpportunity({
          type: 'IMPROVE_FAQ',
          page,
          related: [],
          reason: `Página do tipo ${page.role} sem nenhum FAQ — formato onde perguntas frequentes tendem a agregar valor real.`,
          evidence: [{ text: opportunity.evidence, severity: 'INFO' }],
          confidence: 'LOW',
          action: 'Avaliar se um bloco de FAQ com schema FAQPage agregaria valor a este conteúdo.',
        })
      );
    }
  }
  return opportunities;
}

// --------------------------------------------------------------- DIFFERENTIATE_CONTENT

function buildDifferentiateOpportunities(inventory) {
  const byUrl = new Map(inventory.map((p) => [p.url, p]));
  const seenPairs = new Set();
  const opportunities = [];

  for (const page of inventory) {
    for (const pair of page.cannibalization_pairs || []) {
      if (pair.level === 'complementary' || pair.level === 'low') continue; // só risco real
      const pairKey = [pair.page_a, pair.page_b].sort().join('|');
      if (seenPairs.has(pairKey)) continue;
      seenPairs.add(pairKey);

      const pageA = byUrl.get(pair.page_a) || null;
      const pageB = byUrl.get(pair.page_b) || null;
      const primary = pageA || pageB;
      const involvesPillar = (pageA && pageA.role === ROLE.PILLAR) || (pageB && pageB.role === ROLE.PILLAR);

      // Confidence graduada pelo score do par (Fase 4.1 — antes só
      // distinguia high/não-high do nível de cannibalização, que hoje
      // quase nunca é 'high' de verdade; usar o score real dá mais
      // granularidade para a regra de prioridade abaixo).
      let confidence;
      if (pair.score >= 70) confidence = 'HIGH';
      else if (pair.score >= 50) confidence = 'MEDIUM';
      else confidence = 'LOW';

      const opp = makeOpportunity({
        type: 'DIFFERENTIATE_CONTENT',
        page: primary,
        related: [pair.page_a, pair.page_b].filter((u) => u !== (primary && primary.url)),
        reason: pair.explanation,
        evidence: (pair.signals || []).map((s) => ({ text: s, severity: pair.level === 'high' ? 'ERROR' : 'WARNING' })),
        confidence,
        action: pair.recommendation,
      });
      opp.involves_pillar = involvesPillar;
      opp.pair_score = pair.score;
      opportunities.push(opp);
    }
  }
  return opportunities;
}

// --------------------------------------------------------------- NEW_CONTENT

/**
 * NEW_CONTENT é a oportunidade mais arriscada de inventar — por isso o
 * único gatilho aceito nesta fase é conservador e 100% estrutural: um
 * cluster já estabelecido (pilar + >= 3 páginas) com um formato satélite
 * claramente ausente (ex: sem nenhum REVIEW, sem nenhum FAQ dedicado).
 * Não tenta adivinhar QUAL produto/pergunta específica — isso ficaria
 * para uma fase futura com mais contexto (ver README, limitações).
 */
function buildNewContentOpportunities(clusters) {
  const opportunities = [];
  for (const cluster of clusters) {
    if (!cluster.pillar) continue; // sem pilar não há cluster "estabelecido" o suficiente
    if (cluster.page_count < 3) continue;
    if (cluster.formats_missing.length === 0) continue;

    for (const missingRole of cluster.formats_missing) {
      // "SATELLITE" genérico não é um formato específico o suficiente
      // para virar sugestão de novo conteúdo — só formatos nomeados.
      if (missingRole === 'SATELLITE') continue;

      opportunities.push(
        makeOpportunity({
          type: 'NEW_CONTENT',
          page: { url: cluster.pillar, role: 'PILLAR', inbound_links: 0 },
          related: cluster.pages,
          reason: `Cluster "${cluster.cluster_id}" (${cluster.page_count} páginas, pilar identificado) não tem nenhuma página do formato ${missingRole}.`,
          evidence: [{ text: `Formatos presentes: ${cluster.formats_present.join(', ')}`, severity: 'INFO' }],
          confidence: 'LOW',
          action: `Avaliar se um novo artigo no formato ${missingRole} para este cluster faz sentido editorialmente (esta é uma lacuna estrutural, não uma keyword pesquisada).`,
        })
      );
    }
  }
  return opportunities;
}

// --------------------------------------------------------------- NO_ACTION

/**
 * Gera registros NO_ACTION explícitos (não apenas ausência de
 * oportunidade) para páginas que passam por todos os filtros acima sem
 * gatilho — importante para o sistema poder dizer "não fazer nada agora"
 * de forma auditável (ver seção 12 do prompt).
 */
function buildNoActionEntries(inventory, opportunitiesByPage) {
  const entries = [];
  for (const page of inventory) {
    if (opportunitiesByPage.has(page.url)) continue;
    if (page.page_type !== 'post' && page.role !== ROLE.INSTITUTIONAL) continue;

    const onlyInfo = (page.seo_issues || []).every((i) => i.severity === 'INFO');
    const noRealCannibalization = (page.cannibalization_pairs || []).every((p) => p.level === 'complementary' || p.level === 'low');

    if (page.seo_status !== 'error' && onlyInfo && noRealCannibalization) {
      entries.push({
        id: nextId('NO_ACTION'),
        type: 'NO_ACTION',
        score: 0,
        score_breakdown: computeScore({ type: 'NO_ACTION', severities: [], page, evidenceList: [], confidence: 'HIGH' }),
        confidence: 'HIGH',
        page: page.url,
        related_pages: [],
        reason: 'Nenhum problema com severidade suficiente para justificar ação agora; eventuais observações são apenas oportunidades de baixo valor (INFO) ou relações complementares corretas.',
        evidence: (page.seo_issues || []).map((i) => `${i.id} (INFO)`),
        recommended_action: 'Nenhuma ação necessária no momento.',
      });
    }
  }
  return entries;
}

module.exports = {
  resetIdCounter,
  buildUpdateExistingOpportunities,
  buildExpandExistingOpportunities,
  buildInternalLinkingOpportunities,
  buildFaqOpportunities,
  buildDifferentiateOpportunities,
  buildNewContentOpportunities,
  buildNoActionEntries,
  UPDATE_EXISTING_ISSUE_IDS,
};
