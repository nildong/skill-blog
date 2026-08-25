#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const { auditSite } = require('./auditor');
const { writeReports } = require('./report');

const HELP = `
SEO Auditor — auditoria SEO local e determinística a partir de .data/site-index.json

Uso:
  npm run audit [-- opções]
  node src/index.js [opções]

Opções:
  --input <caminho>    Caminho do site-index.json de entrada
                        (padrão: <raiz>/.data/site-index.json)
  --output <caminho>   Caminho do JSON de saída (padrão: <raiz>/.data/seo-audit.json)
  --report <caminho>   Caminho do relatório Markdown (padrão: <raiz>/reports/seo-audit.md)
  --quiet              Suprime o resumo no stdout (só grava os arquivos)
  --help                Mostra esta ajuda e sai

Não acessa a internet, não modifica artigos, não executa deploy.
Requer que .data/site-index.json já exista (rode o Site Indexer antes).
`.trim();

function parseArgs(argv) {
  const args = { input: null, output: null, report: null, quiet: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') args.help = true;
    else if (a === '--quiet') args.quiet = true;
    else if (a === '--input') args.input = argv[++i];
    else if (a === '--output') args.output = argv[++i];
    else if (a === '--report') args.report = argv[++i];
  }
  return args;
}

function defaultRoot() {
  // tools/seo-auditor/src/index.js -> ../../.. é a raiz do repo do blog.
  return path.resolve(__dirname, '..', '..', '..');
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(HELP);
    return;
  }

  const root = defaultRoot();
  const inputPath = path.resolve(args.input || path.join(root, '.data', 'site-index.json'));
  const outputPath = path.resolve(args.output || path.join(root, '.data', 'seo-audit.json'));
  const reportPath = path.resolve(args.report || path.join(root, 'reports', 'seo-audit.md'));

  if (!fs.existsSync(inputPath)) {
    console.error(`Erro: ${inputPath} não existe.`);
    console.error('Rode o Site Indexer primeiro: cd tools/site-indexer && npm run index');
    process.exitCode = 1;
    return;
  }

  let siteIndex;
  try {
    siteIndex = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  } catch (err) {
    console.error(`Erro: não foi possível ler/parsear ${inputPath}: ${err.message}`);
    process.exitCode = 1;
    return;
  }

  const auditResult = auditSite(siteIndex);
  const { jsonBytes, mdBytes } = writeReports({ jsonPath: outputPath, mdPath: reportPath, auditResult });

  if (!args.quiet) {
    printReport({ auditResult, inputPath, outputPath, reportPath, jsonBytes, mdBytes });
  }
}

function printReport({ auditResult, inputPath, outputPath, reportPath, jsonBytes, mdBytes }) {
  const { summary, site } = auditResult;
  const lines = [];
  lines.push('SEO AUDITOR');
  lines.push('===========');
  lines.push('');
  lines.push('Input:');
  lines.push(inputPath);
  lines.push('');
  lines.push(`Pages audited: ${site.total_pages}`);
  lines.push('');
  lines.push(`Critical: ${summary.critical}`);
  lines.push(`Errors: ${summary.errors}`);
  lines.push(`Warnings: ${summary.warnings}`);
  lines.push(`Info: ${summary.info}`);
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
