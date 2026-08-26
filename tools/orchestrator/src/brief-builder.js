'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Brief Builder — Etapa 6 da orquestração pré-escrita.
 *
 * Regra fundamental (definida pelo usuário e não-negociável): este módulo
 * é um TRANSFORMADOR, não um novo mecanismo de SEO. Ele só reformata o
 * que já está em `preflight-report.json` (+ `article-proposal.json`) em
 * `article-brief.md`. Nunca:
 *   - roda nenhuma análise nova (não chama site-indexer, cannibalization,
 *     internal-linking, intent-classifier — tudo isso já rodou no
 *     preflight);
 *   - "melhora" silenciosamente uma decisão do preflight (ex: nunca
 *     rebaixa um nível de canibalização HIGH para parecer mais seguro);
 *   - inventa qualquer dado ausente — todo campo sem fonte real vira
 *     literalmente a string "não disponível" no markdown.
 */

const NAO_DISPONIVEL = 'não disponível';

function fmt(value, fallback = NAO_DISPONIVEL) {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
}

function fmtList(items, emptyLabel = '(nenhum)') {
  if (!items || items.length === 0) return emptyLabel;
  return items.map((i) => `- ${i}`).join('\n');
}

/**
 * Seção 1 — Target. Lê só de `proposal` + `preflight.intent` +
 * `preflight.cluster_check`. Nenhum dado novo.
 */
function buildTargetSection(proposal, preflight) {
  const lines = [];
  lines.push('## 1. Target', '');
  lines.push(`- Tema: ${fmt(proposal.theme)}`);
  lines.push(`- Keyword principal: ${fmt(proposal.keyword_candidate)}`);
  lines.push(`- Intenção: ${fmt(preflight.intent.primary_intent)} (confiança: ${fmt(preflight.intent.confidence)})`);
  lines.push(`- Estágio do funil: ${fmt(preflight.intent.funnel_stage)}`);
  lines.push(
    `- Tipo de página: ${fmt(proposal.type_candidate)} ${
      proposal.type_candidate ? '(informado na proposta)' : `(recomendado pelo preflight: ${fmt(preflight.intent.recommended_type)})`
    }`
  );
  lines.push(`- Cluster: ${fmt(preflight.cluster_check.cluster_candidate)}`);
  lines.push(
    `- Papel no cluster: ${
      preflight.cluster_check.known
        ? preflight.cluster_check.is_pillar
          ? 'satélite de um PILAR confirmado'
          : `satélite de página existente classificada como "${fmt(preflight.cluster_check.detected_format)}" — confirmar manualmente se é o cluster certo`
        : 'cluster não confirmado no site-index — ' + fmt(preflight.cluster_check.note)
    }`
  );
  return lines.join('\n');
}

/**
 * Seção 2 — Search Intent. Só reformata `preflight.intent`.
 */
function buildSearchIntentSection(preflight) {
  const lines = [];
  lines.push('## 2. Search Intent', '');
  lines.push(`- Intenção principal: ${fmt(preflight.intent.primary_intent)}`);
  lines.push(`- Intenções secundárias: ${fmt(preflight.intent.secondary_intent)}`);
  lines.push(
    `- O usuário espera encontrar: ${fmt(preflight.intent.rationale)}`
  );
  lines.push('');
  lines.push(`  _Regras casadas (heurística lexical, sem dado externo): ${fmt(preflight.intent.matched_rules && preflight.intent.matched_rules.join(', '))}_`);
  return lines.join('\n');
}

/**
 * Seção 3 — Diferenciação / Canibalização. A mais sensível: carrega a
 * DECISÃO do preflight (nível, páginas concorrentes, justificativa,
 * tópicos a evitar), sem suavizar nada. `gate_recommendation` vira texto
 * imperativo — se for BLOCK_UNTIL_RESOLVED, o brief precisa deixar isso
 * visualmente óbvio, não escondido em prosa.
 */
function buildDifferentiationSection(preflight) {
  const cp = preflight.cannibalization_preview;
  const lines = [];
  lines.push('## 3. Diferenciação / Canibalização', '');
  lines.push(`- Risco: **${fmt(cp.worst_level)}**`);
  lines.push(`- Recomendação do preflight: **${fmt(cp.gate_recommendation)}**`);

  if (cp.gate_recommendation === 'BLOCK_UNTIL_RESOLVED') {
    lines.push('');
    lines.push('  ⚠️ **BLOQUEIO** — o preflight identificou risco HIGH de canibalização. Este brief não deveria seguir para escrita sem uma decisão humana explícita sobre os pares abaixo (diferenciar, consolidar ou abandonar a proposta).');
  } else if (cp.gate_recommendation === 'REQUIRE_EXPLICIT_DIFFERENTIATION') {
    lines.push('');
    lines.push('  ⚠️ Risco MEDIUM — antes de escrever, preencha "Justificativa" abaixo explicando como este artigo vai diferenciar sua intenção das páginas relacionadas.');
  }

  lines.push('');
  lines.push('- Páginas relacionadas:');
  if (!cp.top_matches || cp.top_matches.length === 0) {
    lines.push('  (nenhuma página comparável encontrada)');
  } else {
    for (const m of cp.top_matches) {
      lines.push(`  - [${m.level}] score ${fmt(m.score)} — "${fmt(m.title)}" (${fmt(m.url)}) — relação: ${fmt(m.relationship)}`);
      if (m.differentiation_signals && m.differentiation_signals.length > 0) {
        for (const sig of m.differentiation_signals) {
          lines.push(`      · sinal de diferenciação: ${sig}`);
        }
      }
    }
  }

  lines.push('');
  lines.push('- Decisão: ' + NAO_DISPONIVEL + ' — preencher manualmente antes da escrita (o preflight só classifica o risco, não decide por você).');
  lines.push('- Justificativa: ' + NAO_DISPONIVEL + ' — preencher manualmente, especialmente se o risco for MEDIUM ou HIGH.');
  lines.push('- Tópicos a evitar (para não competir com as páginas acima): ' + NAO_DISPONIVEL + ' — preencher manualmente com base nos pontos de sobreposição identificados.');
  lines.push('');
  lines.push(`  _Método usado pelo preflight: ${fmt(cp.method)}_`);

  return lines.join('\n');
}

/**
 * Seção 4 — Estrutura recomendada. O preflight (etapas 1-5) não gera
 * title/H1/meta description/outline — isso é uma lacuna real, não
 * escondida. Marcado como "não disponível" em vez de o Brief Builder
 * inventar uma estrutura por conta própria (isso seria "melhorar
 * silenciosamente", proibido).
 */
function buildStructureSection(proposal) {
  const lines = [];
  lines.push('## 4. Estrutura recomendada', '');
  lines.push(`- Title: ${NAO_DISPONIVEL} — o preflight não gera title; sugerir manualmente a partir do tema "${fmt(proposal.theme)}" e da keyword principal.`);
  lines.push(`- H1: ${NAO_DISPONIVEL}`);
  lines.push(`- Meta description: ${NAO_DISPONIVEL}`);
  lines.push(`- Word count target: ${NAO_DISPONIVEL}`);
  lines.push('- Outline:');
  lines.push(`  - ${NAO_DISPONIVEL} — nenhum outline foi gerado nesta etapa da pipeline (fora do escopo do preflight/Brief Builder).`);
  return lines.join('\n');
}

/**
 * Seção 5 — Internal Linking. Carrega o `internal_linking_plan` do
 * preflight tal como está — página destino/origem, direção, anchor
 * sugerido e motivo. Nunca insere um link que o preflight não sugeriu.
 */
function buildInternalLinkingSection(preflight) {
  const plan = preflight.internal_linking_plan;
  const lines = [];
  lines.push('## 5. Internal Linking', '');
  lines.push('### Links de saída (este artigo deveria linkar para)', '');
  if (!plan.should_link_to || plan.should_link_to.length === 0) {
    lines.push(NAO_DISPONIVEL + ' — nenhuma sugestão encontrada (ou conteúdo ainda insuficiente para o motor de sugestão).');
  } else {
    for (const s of plan.should_link_to) {
      lines.push(`- **Destino**: ${fmt(s.target)}`);
      lines.push(`  - Direção: este artigo → destino`);
      lines.push(`  - Anchor sugerido: "${fmt(s.anchor)}"`);
      lines.push(`  - Motivo: ${fmt(s.reason)}`);
      lines.push(`  - Score: ${fmt(s.score)} · Relação: ${fmt(s.relationship)}`);
    }
  }
  lines.push('');
  lines.push('### Links que devem apontar para este artigo', '');
  if (!plan.should_receive_links_from || plan.should_receive_links_from.length === 0) {
    lines.push(NAO_DISPONIVEL + ' — nenhuma sugestão encontrada.');
  } else {
    for (const s of plan.should_receive_links_from) {
      lines.push(`- **Origem**: ${fmt(s.source)}`);
      lines.push(`  - Direção: origem → este artigo`);
      lines.push(`  - Anchor sugerido: "${fmt(s.anchor)}"`);
      lines.push(`  - Motivo: ${fmt(s.reason)}`);
      lines.push(`  - Score: ${fmt(s.score)} · Relação: ${fmt(s.relationship)}`);
    }
  }
  lines.push('');
  lines.push(`  _Método usado pelo preflight: ${fmt(plan.method)}_`);
  return lines.join('\n');
}

/**
 * Seção 6 — FAQ. O preflight não gera perguntas — não inventamos
 * nenhuma. Só sinaliza se o tipo recomendado é FAQ (nesse caso, o
 * artigo provavelmente deveria ter uma seção, mas as perguntas em si
 * ficam para quem escreve).
 */
function buildFaqSection(preflight) {
  const lines = [];
  lines.push('## 6. FAQ', '');
  if (preflight.intent.recommended_type === 'faq') {
    lines.push('O preflight recomendou tipo de página FAQ — este artigo provavelmente deveria ser um hub de perguntas curtas com links para artigos aprofundados, não um artigo único e longo.');
  }
  lines.push(`Perguntas sugeridas: ${NAO_DISPONIVEL} — o preflight não gera perguntas de FAQ; definir manualmente com base na intenção de busca (seção 2).`);
  return lines.join('\n');
}

/**
 * Seção 7 — Schema recomendado. Deriva SOMENTE do `recommended_type` já
 * calculado pelo preflight (mapeamento fixo, documentado) — não é uma
 * nova decisão de SEO, é a mesma decisão já tomada, só traduzida para
 * o nome do schema correspondente.
 */
const SCHEMA_BY_TYPE = {
  faq: 'FAQPage (além do Article/BlogPosting padrão)',
  review: 'Product + Review (somente se houver dado real de preço/nota verificável — nunca inventar avaliação)',
  comparison: 'Article/BlogPosting padrão (schema de comparação explícita não é um tipo Schema.org à parte)',
  how_to: 'HowTo (avaliar se os passos são claros o suficiente para marcação; senão, Article padrão)',
  troubleshooting: 'Article/BlogPosting padrão',
  list: 'ItemList (opcional) + Article/BlogPosting padrão',
  guide: 'Article/BlogPosting padrão',
  informational: 'Article/BlogPosting padrão',
  pillar: 'Article/BlogPosting padrão, com BreadcrumbList reforçado (página hub)',
};

function buildSchemaSection(preflight) {
  const lines = [];
  lines.push('## 7. Schema recomendado', '');
  const type = preflight.intent.recommended_type;
  lines.push(`- Baseado no tipo de página recomendado (${fmt(type)}): ${fmt(SCHEMA_BY_TYPE[type], 'Article/BlogPosting padrão')}`);
  lines.push('- Sempre presentes no padrão do site: Article/BlogPosting, Person (autor), Organization (publisher), BreadcrumbList.');
  lines.push('- Nunca criar schema para conteúdo que não existe visivelmente na página (FAQPage sem perguntas reais, Review com nota/preço inventados).');
  return lines.join('\n');
}

function buildEditorialRulesSection() {
  const lines = [];
  lines.push('## 8. Regras editoriais', '');
  lines.push('- Não inventar experiência pessoal (não escrever "testamos" se não houve teste real).');
  lines.push('- Não inventar testes, avaliações, notas ou número de avaliações.');
  lines.push('- Não inventar preços — se necessário, usar valor real de fonte citada com data de consulta.');
  lines.push('- Não fazer keyword stuffing — repetição natural da keyword, nunca forçada.');
  lines.push('- Não competir com as páginas listadas na seção 3 — respeitar os "tópicos a evitar" definidos manualmente ali.');
  lines.push('- Usar os anchors sugeridos na seção 5 (ou equivalentes igualmente descritivos) — nunca "clique aqui"/"saiba mais".');
  lines.push('- Declarar afiliação/disclosure quando houver link de afiliado, seguindo o padrão já usado nos artigos publicados.');
  lines.push('- Citar fonte + data de consulta (`retrieved AAAA-MM-DD`) para qualquer estatística ou claim de terceiros.');
  return lines.join('\n');
}

function buildUnavailableDataSection(preflight) {
  const kr = preflight.intent.keyword_research || {};
  const lines = [];
  lines.push('## 9. Dados indisponíveis', '');
  lines.push(`- Search volume: ${fmt(kr.search_volume_estimate)}`);
  lines.push(`- Keyword difficulty: ${fmt(kr.keyword_difficulty)}`);
  lines.push(`- CPC: ${fmt(kr.cpc)}`);
  lines.push(`- Posição atual: ${fmt(kr.current_position)}`);
  lines.push('');
  lines.push(`  _Base: ${fmt(kr.basis)}_`);
  if (preflight.limitations && preflight.limitations.length > 0) {
    lines.push('');
    lines.push('  Limitações adicionais do preflight, herdadas neste brief:');
    for (const l of preflight.limitations) lines.push(`  - ${l}`);
  }
  return lines.join('\n');
}

/**
 * Constrói o markdown completo do brief. Função pura — recebe os dois
 * objetos já carregados (proposal, preflight), retorna string. Não lê
 * nem escreve disco (isso fica a cargo de `writeBrief`/CLI).
 */
function buildBrief(proposal, preflight) {
  if (!proposal || !proposal.slug) {
    throw new Error('brief-builder: proposal inválida (falta slug).');
  }
  if (!preflight || !preflight.proposal_slug) {
    throw new Error('brief-builder: preflight-report inválido (falta proposal_slug).');
  }
  if (preflight.proposal_slug !== proposal.slug) {
    throw new Error(
      `brief-builder: proposal.slug ("${proposal.slug}") não bate com preflight.proposal_slug ("${preflight.proposal_slug}") — parecem ser de propostas diferentes.`
    );
  }

  const sections = [
    `# Article Brief — ${fmt(proposal.theme)}`,
    '',
    `_Gerado a partir de \`article-proposal.json\` + \`preflight-report.json\`. Este documento é um TRANSFORMADOR — nenhuma decisão de SEO nova foi tomada aqui; tudo vem do preflight. Campos "${NAO_DISPONIVEL}" precisam de preenchimento humano antes da escrita._`,
    '',
    buildTargetSection(proposal, preflight),
    '',
    buildSearchIntentSection(preflight),
    '',
    buildDifferentiationSection(preflight),
    '',
    buildStructureSection(proposal),
    '',
    buildInternalLinkingSection(preflight),
    '',
    buildFaqSection(preflight),
    '',
    buildSchemaSection(preflight),
    '',
    buildEditorialRulesSection(),
    '',
    buildUnavailableDataSection(preflight),
    '',
  ];

  return sections.join('\n');
}

function loadPreflightReport(root, slugOrPath) {
  let filePath = slugOrPath;
  if (!fs.existsSync(filePath)) {
    filePath = path.join(root, '.data', 'pipeline', slugOrPath, 'preflight-report.json');
  }
  if (!fs.existsSync(filePath)) {
    throw new Error(`brief-builder: preflight-report não encontrado em ${filePath}. Rode "preflight" primeiro.`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeBrief(root, proposalSlug, markdown) {
  const dir = path.join(root, '.data', 'pipeline', proposalSlug);
  const filePath = path.join(dir, 'article-brief.md');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, markdown, 'utf8');
  return { filePath, bytes: Buffer.byteLength(markdown, 'utf8') };
}

module.exports = {
  buildBrief,
  loadPreflightReport,
  writeBrief,
  NAO_DISPONIVEL,
};
