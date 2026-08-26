#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const { extractBodyTextFromFile, extractBodyText } = require('../../shared/html-text');
const { parseHtmlContent } = require('../../site-indexer/src/parser');
const { analyzePost } = require('../../site-indexer/src/analyzer');
const { buildProposal, writeProposal, VALID_TYPES } = require('./propose');
const { runPreflight, loadSiteIndex, loadProposal, writePreflightReport } = require('./preflight');
const { buildBrief, loadPreflightReport, writeBrief } = require('./brief-builder');
const { runQualityGate, writeQualityGateReport } = require('./quality-gate');
const { runDeployGate } = require('./deploy-gate');

const HELP = `
Orchestrator — camada de orquestração pré-escrita da V2 (skill-blog)

Uso:
  node src/index.js propose "<tema>" [opções]
  node src/index.js preflight <slug-ou-caminho-da-proposta> [opções]
  node src/index.js brief <slug>
  node src/index.js validate <slug> [opções]
  node src/index.js publish <slug> [--remote-subdir <caminho>]

propose:
  --keyword <texto>     keyword candidata (padrão: usa o próprio tema)
  --type <tipo>         um de: ${[...VALID_TYPES].join(', ')}
  --cluster <slug>      slug de um cluster/pilar já existente, se conhecido
  --slug <slug>         override manual do slug (padrão: derivado do tema)
  --force               sobrescreve uma proposta existente com o mesmo slug
  --personal-experience marca que o autor realmente testou/usou o produto
                         (usado pelo Quality Gate — nunca assumido por padrão)

preflight:
  --site-index <caminho>  (padrão: <raiz>/.data/site-index.json)

brief:
  Lê article-proposal.json + preflight-report.json (já gerados pelas
  etapas anteriores) e produz article-brief.md. NÃO roda nenhuma análise
  nova — é um transformador puro. Campos sem dado real aparecem como
  "não disponível" no markdown, nunca inventados.

validate:
  Roda o Quality Gate (Etapa 7) sobre <root>/<slug>/index.html — um
  artigo JÁ ESCRITO localmente (pela skill global, fora deste repo),
  ainda NÃO publicado na Hostinger. Reaproveita seo-auditor (SEO
  técnico), cannibalization (canibalização real pós-escrita) e checagens
  próprias de schema × conteúdo visível, E-E-A-T e keyword stuffing.
  Gera .data/pipeline/<slug>/quality-gate.json e quality-report.md.
  Usa article-proposal.json/preflight-report.json se existirem (keyword,
  personal_experience_confirmed, plano de linking) — nunca falha se
  estiverem ausentes, só roda com menos contexto.
  --site-index <caminho>  (padrão: <raiz>/.data/site-index.json)

publish:
  Deploy Gate (Etapa 8) — RELÊ .data/pipeline/<slug>/quality-gate.json na
  hora (nunca confia em uma execução anterior de "validate") e só chama
  deploy.sh <slug> se: o arquivo existir, for JSON válido, pertencer ao
  MESMO slug, e status === "APPROVED". Qualquer outra condição bloqueia
  sem chamar deploy.sh.
  --remote-subdir <caminho>  repassado a deploy.sh, se informado

Este orquestrador NÃO escreve artigos, NÃO modifica HTML. Só "publish"
chama deploy.sh — e só depois de reconferir o Quality Gate na hora.
Ver arquitetura V2 completa para o fluxo alvo (propose → preflight →
brief → write [skill global] → validate → publish).
`.trim();

function defaultRoot() {
  return path.resolve(__dirname, '..', '..', '..');
}

function parseFlags(argv) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith('--')) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(a);
    }
  }
  return { flags, positional };
}

function runPropose(argv, root) {
  const { flags, positional } = parseFlags(argv);
  if (flags.help || flags.h || positional.length === 0) {
    console.log(HELP);
    return;
  }
  const theme = positional.join(' ');
  const proposal = buildProposal({
    theme,
    keyword: flags.keyword,
    type: flags.type,
    cluster: flags.cluster,
    slug: flags.slug,
    personalExperienceConfirmed: Boolean(flags['personal-experience']),
  });
  const { filePath, bytes } = writeProposal(root, proposal, { force: Boolean(flags.force) });

  console.log('ARTICLE PROPOSAL');
  console.log('================');
  console.log('');
  console.log(`Slug: ${proposal.slug}`);
  console.log(`Tema: ${proposal.theme}`);
  console.log(`Keyword candidata: ${proposal.keyword_candidate}`);
  console.log(`Tipo candidato: ${proposal.type_candidate || '(não informado)'}`);
  console.log(`Cluster candidato: ${proposal.cluster_candidate || '(não informado)'}`);
  console.log('');
  console.log(`Output: ${filePath} (${bytes} bytes)`);
  console.log('');
  console.log(`Próximo passo: node src/index.js preflight ${proposal.slug}`);
}

function runPreflightCommand(argv, root) {
  const { flags, positional } = parseFlags(argv);
  if (flags.help || flags.h || positional.length === 0) {
    console.log(HELP);
    return;
  }
  const slugOrPath = positional[0];
  const proposal = loadProposal(root, slugOrPath);
  const siteIndex = loadSiteIndex(root, flags['site-index']);

  // Lê o corpo real dos posts existentes (mesmo padrão já usado por
  // tools/internal-linking/src/index.js) para dar mais sinal ao plano de
  // internal linking. Tolerante a erro de leitura individual — nunca
  // interrompe o preflight por um arquivo faltando.
  const bodyTextByPath = new Map();
  for (const post of siteIndex.posts || []) {
    try {
      bodyTextByPath.set(post.path, extractBodyTextFromFile(path.join(root, post.path)));
    } catch {
      // sem conteúdo real para este post — o score correspondente fica
      // mais fraco, nunca inventado.
    }
  }

  const report = runPreflight(proposal, siteIndex, { bodyTextByPath });
  const { filePath, bytes } = writePreflightReport(root, proposal.slug, report);

  console.log('PREFLIGHT REPORT');
  console.log('================');
  console.log('');
  console.log(`Slug: ${report.proposal_slug}`);
  console.log(
    `Colisão de slug: ${report.slug_collision.exists ? `SIM — já existe (${report.slug_collision.url})` : 'não'}`
  );
  console.log(
    `Intenção: ${report.intent.primary_intent} / funil ${report.intent.funnel_stage} / tipo recomendado ${report.intent.recommended_type} (confiança ${report.intent.confidence})`
  );
  console.log(
    `Cluster: ${report.cluster_check.cluster_candidate || '(nenhum)'} — conhecido: ${report.cluster_check.known}, é pilar: ${report.cluster_check.is_pillar}`
  );
  console.log('');
  console.log(
    `Canibalização (aproximada, pré-escrita): pior nível = ${report.cannibalization_preview.worst_level} → ${report.cannibalization_preview.gate_recommendation}`
  );
  for (const c of report.cannibalization_preview.top_matches.slice(0, 3)) {
    console.log(`  - [${c.level}] score ${c.score} — ${c.title} (${c.url})`);
  }
  console.log('');
  console.log(
    `Internal linking: deveria linkar para ${report.internal_linking_plan.should_link_to.length} página(s), receber link de ${report.internal_linking_plan.should_receive_links_from.length} página(s)`
  );
  console.log('');
  console.log(`Output: ${filePath} (${bytes} bytes)`);
}

function runBriefCommand(argv, root) {
  const { flags, positional } = parseFlags(argv);
  if (flags.help || flags.h || positional.length === 0) {
    console.log(HELP);
    return;
  }
  const slugOrPath = positional[0];
  const proposal = loadProposal(root, slugOrPath);
  const preflight = loadPreflightReport(root, slugOrPath);
  const markdown = buildBrief(proposal, preflight);
  const { filePath, bytes } = writeBrief(root, proposal.slug, markdown);

  console.log('ARTICLE BRIEF');
  console.log('=============');
  console.log('');
  console.log(`Slug: ${proposal.slug}`);
  console.log(`Output: ${filePath} (${bytes} bytes)`);
  console.log('');
  console.log('Próximo passo: entregar este brief à skill global de escrita (fora deste repo).');
}

function runValidateCommand(argv, root) {
  const { flags, positional } = parseFlags(argv);
  if (flags.help || flags.h || positional.length === 0) {
    console.log(HELP);
    return;
  }
  const slug = positional[0];
  const articleDir = path.resolve(root, slug);
  const htmlPath = path.join(articleDir, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    throw new Error(`validate: ${htmlPath} não existe. Escreva o artigo antes de rodar validate.`);
  }

  const html = fs.readFileSync(htmlPath, 'utf8');
  const parsed = parseHtmlContent(html);
  const post = analyzePost(`${slug}/index.html`, parsed);
  const bodyText = extractBodyText(html);

  const siteIndex = loadSiteIndex(root, flags['site-index']);
  const allPosts = (siteIndex.posts || []).filter((p) => p.slug !== slug);

  // Texto real dos demais posts, para a canibalização real ter o
  // componente de conteúdo (mesmo padrão de internal-linking/index.js).
  const bodyTextByPath = new Map();
  for (const p of allPosts) {
    try {
      bodyTextByPath.set(p.path, extractBodyTextFromFile(path.join(root, p.path)));
    } catch {
      // sem conteúdo real para este post — componente de conteúdo fica
      // mais fraco para ESSE par, nunca inventado.
    }
  }

  // Contexto opcional da pipeline (proposal/preflight) — o Quality Gate
  // roda com menos sinal se não existir, nunca falha por isso.
  let keyword;
  let personalExperienceConfirmed = false;
  let internalLinkingPlan;
  try {
    const proposal = loadProposal(root, slug);
    keyword = proposal.keyword_candidate;
    personalExperienceConfirmed = Boolean(proposal.personal_experience_confirmed);
  } catch {
    // sem article-proposal.json — segue sem keyword/confirmação (default seguro: false)
  }
  try {
    const preflight = loadPreflightReport(root, slug);
    internalLinkingPlan = preflight.internal_linking_plan;
  } catch {
    // sem preflight-report.json — segue sem plano de linking
  }

  const result = runQualityGate({
    post,
    html,
    bodyText,
    articleDir,
    allPosts,
    bodyTextByPath,
    keyword,
    personalExperienceConfirmed,
    internalLinkingPlan,
  });
  const { jsonPath, mdPath } = writeQualityGateReport(root, slug, result);

  console.log('QUALITY GATE');
  console.log('============');
  console.log('');
  console.log(`Slug: ${result.slug}`);
  console.log(`Status: ${result.status}`);
  console.log(`BLOCKER: ${result.summary.blockers}  WARNING: ${result.summary.warnings}  INFO: ${result.summary.info}`);
  console.log('');
  console.log(result.note);
  if (result.summary.blockers > 0) {
    console.log('');
    console.log('Itens BLOCKER:');
    for (const f of result.findings.filter((x) => x.severity === 'BLOCKER')) {
      console.log(`  - [${f.id}] ${f.evidence}`);
    }
  }
  console.log('');
  console.log(`Output: ${jsonPath}`);
  console.log(`Output: ${mdPath}`);

  if (result.status === 'BLOCKED') process.exitCode = 1;
}

function runPublishCommand(argv, root) {
  const { flags, positional } = parseFlags(argv);
  if (flags.help || flags.h || positional.length === 0) {
    console.log(HELP);
    return;
  }
  const slug = positional[0];

  console.log('DEPLOY GATE');
  console.log('===========');
  console.log('');

  const result = runDeployGate(root, slug, { remoteSubdir: flags['remote-subdir'] });

  console.log(`Slug: ${slug}`);
  console.log(`Permitido: ${result.allowed ? 'SIM' : 'NÃO'}`);
  console.log(`Motivo: ${result.reason}`);

  if (!result.allowed) {
    console.log('');
    console.log('deploy.sh NÃO foi chamado.');
    process.exitCode = 1;
    return;
  }

  console.log('');
  console.log(`deploy.sh chamado. Código de saída: ${result.deployResult.exitCode}`);
  if (result.deployResult.exitCode !== 0) process.exitCode = result.deployResult.exitCode || 1;
}

function main() {
  const [, , command, ...rest] = process.argv;
  const root = defaultRoot();

  if (!command || command === '--help' || command === '-h') {
    console.log(HELP);
    return;
  }

  if (command === 'propose') return runPropose(rest, root);
  if (command === 'preflight') return runPreflightCommand(rest, root);
  if (command === 'brief') return runBriefCommand(rest, root);
  if (command === 'validate') return runValidateCommand(rest, root);
  if (command === 'publish') return runPublishCommand(rest, root);

  console.error(`Comando desconhecido: "${command}"\n`);
  console.log(HELP);
  process.exitCode = 1;
}

if (require.main === module) {
  main();
}

module.exports = { main, parseFlags, defaultRoot };
