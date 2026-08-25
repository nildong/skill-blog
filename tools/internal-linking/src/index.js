#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const { extractBodyTextFromFile } = require('../../shared/html-text');
const { analyzeInternalLinking } = require('./analyzer');
const { writeReports } = require('./report');

const HELP = `
Internal Linking Engine — sugestões analíticas de link interno (não modifica artigos)

Uso:
  npm run suggest [-- opções]
  node src/index.js [opções]

Opções:
  --site-index <caminho>   Caminho do site-index.json (padrão: <raiz>/.data/site-index.json)
  --seo-audit <caminho>    Caminho do seo-audit.json (padrão: <raiz>/.data/seo-audit.json)
  --output <caminho>       Caminho do JSON de saída (padrão: <raiz>/.data/internal-linking.json)
  --report <caminho>       Caminho do relatório Markdown (padrão: <raiz>/reports/internal-linking.md)
  --quiet                  Suprime o resumo no stdout
  --help                    Mostra esta ajuda e sai

Apenas SUGERE. Nunca insere, remove ou altera links em nenhum artigo.
Não acessa a internet. Requer .data/site-index.json (rode o Site Indexer
antes) e, opcionalmente, .data/seo-audit.json (para priorizar órfãs).
`.trim();

function parseArgs(argv) {
  const args = { siteIndex: null, seoAudit: null, output: null, report: null, quiet: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') args.help = true;
    else if (a === '--quiet') args.quiet = true;
    else if (a === '--site-index') args.siteIndex = argv[++i];
    else if (a === '--seo-audit') args.seoAudit = argv[++i];
    else if (a === '--output') args.output = argv[++i];
    else if (a === '--report') args.report = argv[++i];
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

module.exports = { main, parseArgs, defaultRoot };
