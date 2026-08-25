#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const { extractBodyTextFromFile } = require('../../shared/html-text');
const { analyzeCannibalization } = require('./analyzer');
const { writeReports } = require('./report');

const HELP = `
Cannibalization Detector — identifica possíveis conflitos de conteúdo (não modifica artigos)

Uso:
  npm run detect [-- opções]
  node src/index.js [opções]

Opções:
  --site-index <caminho>   Caminho do site-index.json (padrão: <raiz>/.data/site-index.json)
  --output <caminho>       Caminho do JSON de saída (padrão: <raiz>/.data/cannibalization.json)
  --report <caminho>       Caminho do relatório Markdown (padrão: <raiz>/reports/cannibalization.md)
  --quiet                  Suprime o resumo no stdout
  --help                    Mostra esta ajuda e sai

Identifica apenas POSSÍVEL canibalização (heurístico, nunca certeza).
Nunca recomenda apagar página automaticamente. Não acessa a internet.
Requer .data/site-index.json (rode o Site Indexer antes).
`.trim();

function parseArgs(argv) {
  const args = { siteIndex: null, output: null, report: null, quiet: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') args.help = true;
    else if (a === '--quiet') args.quiet = true;
    else if (a === '--site-index') args.siteIndex = argv[++i];
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
  const outputPath = path.resolve(args.output || path.join(root, '.data', 'cannibalization.json'));
  const reportPath = path.resolve(args.report || path.join(root, 'reports', 'cannibalization.md'));

  if (!fs.existsSync(siteIndexPath)) {
    console.error(`Erro: ${siteIndexPath} não existe. Rode o Site Indexer primeiro.`);
    process.exitCode = 1;
    return;
  }

  const siteIndex = JSON.parse(fs.readFileSync(siteIndexPath, 'utf8'));
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

  const { pairs, pairsAnalyzed, pagesAnalyzed, levelCounts } = analyzeCannibalization(posts, bodyTextByPath);

  const result = {
    version: 1,
    generated_at: new Date().toISOString(),
    summary: {
      pages_analyzed: pagesAnalyzed,
      pairs_analyzed: pairsAnalyzed,
      potential_conflicts: pairs.length,
      high: levelCounts.high || 0,
      possible: levelCounts.possible || 0,
      complementary: levelCounts.complementary || 0,
      read_errors: readErrors.length,
    },
    pairs,
    errors: readErrors,
  };

  const { jsonBytes, mdBytes } = writeReports({ jsonPath: outputPath, mdPath: reportPath, result });

  if (!args.quiet) {
    printReport({ result, outputPath, reportPath, jsonBytes, mdBytes });
  }
}

function printReport({ result, outputPath, reportPath, jsonBytes, mdBytes }) {
  const lines = [];
  lines.push('CANNIBALIZATION DETECTOR');
  lines.push('=========================');
  lines.push('');
  lines.push(`Pages analyzed: ${result.summary.pages_analyzed}`);
  lines.push(`Pairs analyzed: ${result.summary.pairs_analyzed}`);
  lines.push(`Potential conflicts (score >= 40): ${result.summary.potential_conflicts}`);
  lines.push(`  HIGH: ${result.summary.high}`);
  lines.push(`  POSSIBLE: ${result.summary.possible}`);
  lines.push(`  COMPLEMENTARY (pilar↔satélite, não é conflito): ${result.summary.complementary}`);
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
