#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const { extractBodyTextFromFile } = require('../../shared/html-text');
const { analyzeInternalLinking } = require('./analyzer');
const { writeReports } = require('./report');
const { simulateLinksForProposal } = require('./simulate');

const HELP = `
Internal Linking Engine — sugestões analíticas de link interno (não modifica artigos)

Uso:
  npm run suggest [-- opções]
  node src/index.js [opções]
  node src/index.js --simulate <article-proposal.json> [opções]

Opções:
  --site-index <caminho>   Caminho do site-index.json (padrão: <raiz>/.data/site-index.json)
  --seo-audit <caminho>    Caminho do seo-audit.json (padrão: <raiz>/.data/seo-audit.json)
  --output <caminho>       Caminho do JSON de saída (padrão: <raiz>/.data/internal-linking.json)
  --report <caminho>       Caminho do relatório Markdown (padrão: <raiz>/reports/internal-linking.md)
  --quiet                  Suprime o resumo no stdout
  --help                    Mostra esta ajuda e sai

Modo --simulate (opt-in, Fase 5 — orquestração pré-escrita):
  --simulate <caminho>     Caminho de um article-proposal.json (formato:
                           { slug, theme|title, keyword_candidate?, headings? })
                           Responde: de quais páginas a proposta deveria
                           RECEBER link, e para quais deveria ENVIAR link.
                           NÃO sobrescreve .data/internal-linking.json nem
                           reports/internal-linking.md — grava em caminho
                           separado (--output, se informado) ou só imprime.

Apenas SUGERE. Nunca insere, remove ou altera links em nenhum artigo.
Não acessa a internet. Requer .data/site-index.json (rode o Site Indexer
antes) e, opcionalmente, .data/seo-audit.json (para priorizar órfãs).
`.trim();

function parseArgs(argv) {
  const args = { siteIndex: null, seoAudit: null, output: null, report: null, quiet: false, help: false, simulate: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') args.help = true;
    else if (a === '--quiet') args.quiet = true;
    else if (a === '--site-index') args.siteIndex = argv[++i];
    else if (a === '--seo-audit') args.seoAudit = argv[++i];
    else if (a === '--output') args.output = argv[++i];
    else if (a === '--report') args.report = argv[++i];
    else if (a === '--simulate') args.simulate = argv[++i];
  }
  return args;
}

function defaultRoot() {
  return path.resolve(__dirname, '..', '..', '..');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(HELP);
    return;
  }

  const root = defaultRoot();

  // Modo --simulate: caminho totalmente separado do fluxo padrão abaixo.
  // Retorna cedo — nenhuma linha do modo padrão é executada nem afetada.
  if (args.simulate) {
    return runSimulate(args, root);
  }

  const siteIndexPath = path.resolve(args.siteIndex || path.join(root, '.data', 'site-index.json'));
  const seoAuditPath = path.resolve(args.seoAudit || path.join(root, '.data', 'seo-audit.json'));
  const outputPath = path.resolve(args.output || path.join(root, '.data', 'internal-linking.json'));
  const reportPath = path.resolve(args.report || path.join(root, 'reports', 'internal-linking.md'));

  if (!fs.existsSync(siteIndexPath)) {
    console.error(`Erro: ${siteIndexPath} não existe. Rode o Site Indexer primeiro.`);
    process.exitCode = 1;
    return;
  }

  const siteIndex = JSON.parse(fs.readFileSync(siteIndexPath, 'utf8'));
  const seoAudit = fs.existsSync(seoAuditPath) ? JSON.parse(fs.readFileSync(seoAuditPath, 'utf8')) : null;
  if (!seoAudit && !args.quiet) {
    console.log(`Aviso: ${seoAuditPath} não encontrado — sugestões não vão priorizar páginas órfãs. Rode o SEO Auditor para habilitar isso.`);
  }

  const posts = siteIndex.posts || [];
  const bodyTextByPath = new Map();
  const readErrors = [];
  for (const post of posts) {
    try {
      const absPath = path.join(root, post.path);
      bodyTextByPath.set(post.path, extractBodyTextFromFile(absPath));
    } catch (err) {
      readErrors.push(`${post.path}: ${err.message}`);
    }
  }

  const { suggestions, lowConnectivityPages } = analyzeInternalLinking(posts, bodyTextByPath, seoAudit);

  const result = {
    version: 1,
    generated_at: new Date().toISOString(),
    summary: {
      pages_analyzed: posts.length,
      suggestions: suggestions.length,
      orphan_target_suggestions: suggestions.filter((s) => s.target_is_orphan).length,
      read_errors: readErrors.length,
    },
    suggestions,
    low_connectivity_pages: lowConnectivityPages,
    errors: readErrors,
  };

  const { jsonBytes, mdBytes } = writeReports({ jsonPath: outputPath, mdPath: reportPath, result, posts });

  if (!args.quiet) {
    printReport({ result, outputPath, reportPath, jsonBytes, mdBytes });
  }
}

function runSimulate(args, root) {
  const siteIndexPath = path.resolve(args.siteIndex || path.join(root, '.data', 'site-index.json'));
  const proposalPath = path.resolve(args.simulate);

  if (!fs.existsSync(siteIndexPath)) {
    console.error(`Erro: ${siteIndexPath} não existe. Rode o Site Indexer primeiro.`);
    process.exitCode = 1;
    return;
  }
  if (!fs.existsSync(proposalPath)) {
    console.error(`Erro: ${proposalPath} (proposta) não existe.`);
    process.exitCode = 1;
    return;
  }

  const siteIndex = JSON.parse(fs.readFileSync(siteIndexPath, 'utf8'));
  const proposal = JSON.parse(fs.readFileSync(proposalPath, 'utf8'));
  const posts = siteIndex.posts || [];

  const bodyTextByPath = new Map();
  for (const post of posts) {
    try {
      const absPath = path.join(root, post.path);
      bodyTextByPath.set(post.path, extractBodyTextFromFile(absPath));
    } catch {
      // Mesma tolerância do modo padrão: um erro de leitura individual
      // não interrompe a simulação, só deixa o conteúdo daquele post fora
      // do componente de content overlap (fica com string vazia).
    }
  }

  const result = simulateLinksForProposal(proposal, posts, bodyTextByPath);

  if (args.output) {
    const outputPath = path.resolve(args.output);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2) + '\n', 'utf8');
    if (!args.quiet) console.log(`Output: ${outputPath}`);
  }

  if (!args.quiet) {
    console.log('INTERNAL LINKING ENGINE — SIMULATE');
    console.log('===================================');
    console.log('');
    console.log(`Proposta: ${result.proposal_slug}`);
    console.log('');
    console.log(`A proposta DEVERIA LINKAR PARA (${result.should_link_to.length}):`);
    for (const s of result.should_link_to) {
      console.log(`  [score ${s.score}] ${s.target} — anchor sugerido: "${s.anchor}"`);
    }
    console.log('');
    console.log(`A proposta DEVERIA RECEBER LINK DE (${result.should_receive_links_from.length}):`);
    for (const s of result.should_receive_links_from) {
      console.log(`  [score ${s.score}] ${s.source} — anchor sugerido: "${s.anchor}"`);
    }
  }

  return result;
}

function printReport({ result, outputPath, reportPath, jsonBytes, mdBytes }) {
  const lines = [];
  lines.push('INTERNAL LINKING ENGINE');
  lines.push('========================');
  lines.push('');
  lines.push(`Pages analyzed: ${result.summary.pages_analyzed}`);
  lines.push(`Suggestions: ${result.summary.suggestions}`);
  lines.push(`Suggestions for orphan targets: ${result.summary.orphan_target_suggestions}`);
  if (result.summary.read_errors > 0) lines.push(`Read errors: ${result.summary.read_errors}`);
  lines.push('');
  lines.push('Output:');
  lines.push(`${outputPath} (${jsonBytes} bytes)`);
  lines.push(`${reportPath} (${mdBytes} bytes)`);
  console.log(lines.join('\n'));
}

if (require.main === module) {
  main();
}

module.exports = { main, parseArgs, defaultRoot, runSimulate };
