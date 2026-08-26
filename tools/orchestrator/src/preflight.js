'use strict';

const fs = require('fs');
const path = require('path');

const { classifyIntent } = require('./intent-classifier');
const { detectFormat, FORMATS } = require('../../shared/format-classifier');
const { buildLinkGraph } = require('../../seo-auditor/src/link-graph');
const { simulateAgainstExisting } = require('../../cannibalization/src/simulate');
const { simulateLinksForProposal } = require('../../internal-linking/src/simulate');

/**
 * Preflight — agrega, sobre uma `article-proposal.json`, o que já é
 * possível saber ANTES de o artigo existir. A partir da Fase 5, reaproveita
 * diretamente os modos `--simulate` de `cannibalization` e
 * `internal-linking` (em vez de duplicar a lógica de scoring aqui) — ver
 * `V2-ORCHESTRATOR-ARCHITECTURE.md`, seção de roadmap.
 *
 * Limitação sempre presente (herdada dos dois módulos de simulação): o
 * artigo ainda não existe, então o componente de CONTEÚDO real do score
 * de canibalização é sempre 0, e o plano de internal linking usa apenas
 * headings planejados (se informados na proposta) — nunca o texto final.
 * Isso tende a SUBESTIMAR o risco real. Reavaliação obrigatória depois da
 * escrita (Quality Gate, etapa futura).
 */

const CANNIBALIZATION_PREVIEW_LIMIT = 5;

/** Mapeia o vocabulário 'low'/'possible'/'high'/'complementary' dos
 * módulos existentes para o vocabulário LOW/MEDIUM/HIGH/COMPLEMENTARY
 * pedido na arquitetura (mesma escala, só rótulo) — nunca reinterpreta os
 * thresholds numéricos dos módulos já validados. */
function toArchitectureLevel(level) {
  if (level === 'high') return 'HIGH';
  if (level === 'possible') return 'MEDIUM';
  if (level === 'complementary') return 'COMPLEMENTARY';
  return 'LOW';
}

/**
 * Roda o preflight completo sobre uma proposta já carregada (objeto, não
 * caminho) e o site-index já carregado. Função pura — não lê/escreve
 * disco; isso fica a cargo do CLI (index.js), facilitando teste.
 *
 * `bodyTextByPath` (opcional, Map path->texto) melhora a precisão do
 * plano de internal linking (componente de conteúdo do score) quando
 * fornecido pelo chamador (o CLI lê os HTMLs reais via
 * tools/shared/html-text.js, mesmo padrão do próprio internal-linking).
 * Sem ele, o plano ainda roda, só com sinal mais fraco — nunca inventado.
 */
function runPreflight(proposal, siteIndex, { bodyTextByPath = new Map() } = {}) {
  const posts = (siteIndex && siteIndex.posts) || [];

  // buildLinkGraph (reaproveitado de tools/seo-auditor) espera
  // `internal_links` em cada post; site-index.json real sempre tem esse
  // campo, mas defendemos contra fixtures/entradas incompletas sem
  // inventar link nenhum — só evita um TypeError.
  const postsWithLinks = posts.map((p) => ({ ...p, internal_links: p.internal_links || [] }));
  const { inboundCount } = buildLinkGraph(postsWithLinks);

  const intent = classifyIntent(proposal);

  // --- Checagem de colisão de slug (sinal mais forte e mais barato) ---
  const slugCollision = posts.find((p) => p.slug === proposal.slug) || null;

  // --- Checagem de cluster candidato ---
  let clusterCheck = {
    cluster_candidate: proposal.cluster_candidate,
    known: false,
    is_pillar: false,
    note: 'Nenhum cluster_candidate informado na proposta.',
  };
  if (proposal.cluster_candidate) {
    const clusterPost = posts.find((p) => p.slug === proposal.cluster_candidate);
    if (clusterPost) {
      const format = detectFormat(clusterPost, { inboundCount: inboundCount.get(clusterPost.url_path) });
      clusterCheck = {
        cluster_candidate: proposal.cluster_candidate,
        known: true,
        is_pillar: format === FORMATS.PILLAR,
        detected_format: format,
        note:
          format === FORMATS.PILLAR
            ? 'cluster_candidate corresponde a uma página existente classificada como PILLAR — consistente com um cluster real.'
            : 'cluster_candidate corresponde a uma página existente, mas ela não foi classificada como PILLAR — confirmar manualmente se é o cluster certo.',
      };
    } else {
      clusterCheck = {
        cluster_candidate: proposal.cluster_candidate,
        known: false,
        is_pillar: false,
        note: 'cluster_candidate não corresponde a nenhum slug existente no site-index — verificar digitação ou tratar como cluster novo (requer decisão humana).',
      };
    }
  }

  // --- Canibalização pré-escrita (reaproveita cannibalization --simulate) ---
  const cannibalizationResult = simulateAgainstExisting(proposal, posts, {
    limit: CANNIBALIZATION_PREVIEW_LIMIT,
  });
  const topMatches = cannibalizationResult.top_matches.map((m) => ({
    ...m,
    level: toArchitectureLevel(m.level),
  }));
  const worstLevel = topMatches.reduce((worst, c) => {
    const order = { LOW: 0, COMPLEMENTARY: 0, MEDIUM: 1, HIGH: 2 };
    return order[c.level] > order[worst] ? c.level : worst;
  }, 'LOW');
  const gateRecommendation =
    worstLevel === 'HIGH'
      ? 'BLOCK_UNTIL_RESOLVED'
      : worstLevel === 'MEDIUM'
      ? 'REQUIRE_EXPLICIT_DIFFERENTIATION'
      : 'PROCEED';

  // --- Plano de internal linking pré-escrita (reaproveita internal-linking --simulate) ---
  const internalLinkingResult = simulateLinksForProposal(proposal, posts, bodyTextByPath);

  return {
    version: 2,
    generated_at: new Date().toISOString(),
    proposal_slug: proposal.slug,
    slug_collision: slugCollision
      ? { exists: true, url: slugCollision.url_path, title: slugCollision.title }
      : { exists: false },
    intent,
    cluster_check: clusterCheck,
    cannibalization_preview: {
      method: cannibalizationResult.method,
      compared_against: cannibalizationResult.compared_against,
      top_matches: topMatches,
      worst_level: worstLevel,
      gate_recommendation: gateRecommendation,
    },
    internal_linking_plan: {
      method: internalLinkingResult.method,
      should_link_to: internalLinkingResult.should_link_to,
      should_receive_links_from: internalLinkingResult.should_receive_links_from,
    },
    limitations: [
      ...cannibalizationResult.limitations,
      'Plano de internal linking usa apenas headings planejados (se informados na proposta) e o corpo de texto real das páginas EXISTENTES — a proposta em si não tem conteúdo real ainda, então o sinal do lado dela é mais fraco que o de um artigo já escrito.',
      'content-strategy (lacunas/prioridade editorial) ainda não está integrado a este preflight.',
      'Nenhum dado de volume de busca/dificuldade/CPC/posição é usado — ver keyword_research dentro de intent.',
    ],
  };
}

function loadSiteIndex(root, overridePath) {
  const filePath = path.resolve(overridePath || path.join(root, '.data', 'site-index.json'));
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `preflight: ${filePath} não encontrado. Rode a skill site-indexer primeiro (npm run index em tools/site-indexer).`
    );
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadProposal(root, slugOrPath) {
  let filePath = slugOrPath;
  if (!fs.existsSync(filePath)) {
    filePath = path.join(root, '.data', 'pipeline', slugOrPath, 'article-proposal.json');
  }
  if (!fs.existsSync(filePath)) {
    throw new Error(`preflight: proposta não encontrada em ${filePath}. Rode "propose" primeiro.`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writePreflightReport(root, proposalSlug, report) {
  const dir = path.join(root, '.data', 'pipeline', proposalSlug);
  const filePath = path.join(dir, 'preflight-report.json');
  fs.mkdirSync(dir, { recursive: true });
  const json = JSON.stringify(report, null, 2) + '\n';
  fs.writeFileSync(filePath, json, 'utf8');
  return { filePath, bytes: Buffer.byteLength(json, 'utf8') };
}

module.exports = {
  runPreflight,
  loadSiteIndex,
  loadProposal,
  writePreflightReport,
  toArchitectureLevel,
};
