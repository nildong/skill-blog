#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const { findHtmlFiles } = require('./scanner');
const { parseFile } = require('./parser');
const { analyzePost, aggregateSite } = require('./analyzer');
const { writeIndexAtomic } = require('./writer');

const HELP = `
Site Indexer — varredura local (read-only) do site smartpetgadgets.com.br

Uso:
  npm run index [-- opções]
  node src/index.js [opções]

Opções:
  --root <caminho>     Raiz do site a varrer (padrão: raiz do repositório,
                        detectada automaticamente a partir deste script)
  --output <caminho>   Caminho do JSON de saída (padrão: <raiz>/.data/site-index.json)
  --verbose            Imprime detalhes extras (arquivo por arquivo) durante a execução
  --quiet              Suprime o relatório no stdout (só grava o JSON)
  --help                Mostra esta ajuda e sai

Nada nesta ferramenta acessa a internet, modifica artigos ou executa deploy.
`.trim();

function parseArgs(argv) {
  const args = { root: null, output: null, verbose: false, quiet: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') args.help = true;
    else if (a === '--verbose') args.verbose = true;
    else if (a === '--quiet') args.quiet = true;
    else if (a === '--root') args.root = argv[++i];
    else if (a === '--output') args.output = argv[++i];
  }
  return args;
}

function defaultRoot() {
  // tools/site-indexer/src/index.js -> ../../.. é a raiz do repo do blog.
  return path.resolve(__dirname, '..', '..', '..');
}

function isSensitivePath(relPath) {
  const base = path.basename(relPath);
  return /^\.env(\..*)?$/.test(base) || /id_[a-z0-9]+$/.test(base) || base.endsWith('.pem') || base.endsWith('.key');
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(HELP);
    return;
  }

  const root = path.resolve(args.root || defaultRoot());
  const output = path.resolve(args.output || path.join(root, '.data', 'site-index.json'));

  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    console.error(`Erro: raiz inválida: ${root}`);
    process.exitCode = 1;
    return;
  }

  const found = findHtmlFiles(root);
  const scanErrors = found.filter((f) => f.error).map((f) => f.error);
  const files = found.filter((f) => !f.error);

  const posts = [];
  const warnings = [];
  const errors = [...scanErrors];

  for (const file of files) {
    // Nunca ler/indexar arquivos sensíveis, mesmo que por engano algum dia
    // acabem nomeados index.html dentro de uma pasta de credenciais.
    if (isSensitivePath(file.relPath)) {
      warnings.push(`Ignorado por segurança (parece sensível): ${file.relPath}`);
      continue;
    }

    try {
      const parsed = parseFile(file.absPath);
      const post = analyzePost(file.relPath, parsed);
      posts.push(post);

      if (post.structural_warnings.length > 0) {
        warnings.push(`${file.relPath}: ${post.structural_warnings.join(', ')}`);
      }
      if (post.schema_invalid_count > 0) {
        warnings.push(`${file.relPath}: JSON-LD inválido (${post.schema_invalid_count} bloco(s))`);
      }
      if (!post.title) {
        warnings.push(`${file.relPath}: sem <title>`);
      }

      if (args.verbose && !args.quiet) {
        console.log(`OK  ${file.relPath}`);
      }
    } catch (err) {
      errors.push(`${file.relPath}: ${err.message}`);
      if (args.verbose && !args.quiet) {
        console.log(`ERR ${file.relPath}: ${err.message}`);
      }
    }
  }

  const siteStats = aggregateSite(posts, warnings, errors);

  const indexData = {
    version: 1,
    generated_at: new Date().toISOString(),
    site: {
      root,
      total_html_files_found: files.length,
      total_posts_indexed: posts.length,
      domain: 'smartpetgadgets.com.br',
    },
    stats: siteStats,
    warnings,
    errors,
    posts,
  };

  const { bytes } = writeIndexAtomic(output, indexData);

  if (!args.quiet) {
    printReport({ root, output, files, posts, warnings, errors, siteStats, bytes });
  }

  process.exitCode = errors.length > 0 ? 0 : 0; // erros por-arquivo não abortam o processo (item 14 dos requisitos)
}

function printReport({ root, output, files, posts, warnings, errors, siteStats, bytes }) {
  const lines = [];
  lines.push('SITE INDEXER');
  lines.push('============');
  lines.push('');
  lines.push('Root:');
  lines.push(root);
  lines.push('');
  lines.push(`HTML files found: ${files.length}`);
  lines.push('');
  lines.push(`Posts indexed: ${posts.length}`);
  lines.push('');
  lines.push(`Warnings: ${warnings.length}`);
  lines.push(`Errors: ${errors.length}`);
  lines.push('');
  lines.push('Metadata:');
  lines.push(`Titles: ${siteStats.metadata.titles}/${posts.length}`);
  lines.push(`Descriptions: ${siteStats.metadata.descriptions}/${posts.length}`);
  lines.push(`Canonical: ${siteStats.metadata.canonical}/${posts.length}`);
  lines.push('');
  lines.push('Structure:');
  lines.push(`H1 detected: ${siteStats.structure.h1_detected}`);
  lines.push(`Multiple H1: ${siteStats.structure.multiple_h1}`);
  lines.push(`No H1: ${siteStats.structure.no_h1}`);
  lines.push('');
  lines.push('Links:');
  lines.push(`Internal links: ${siteStats.links.internal_links}`);
  lines.push(`External links: ${siteStats.links.external_links}`);
  lines.push('');
  lines.push('Media:');
  lines.push(`Images: ${siteStats.media.images}`);
  lines.push(`Images missing alt: ${siteStats.media.images_missing_alt}`);
  lines.push(`Videos: ${siteStats.media.videos}`);
  lines.push('');
  lines.push('Schema:');
  lines.push(`JSON-LD: ${siteStats.schema.jsonld_posts}`);
  lines.push(`FAQPage: ${siteStats.schema.faqpage_posts}`);
  lines.push(`Invalid JSON-LD: ${siteStats.schema.posts_with_invalid_jsonld}`);
  lines.push('');
  lines.push('Output:');
  lines.push(`${output} (${bytes} bytes)`);

  console.log(lines.join('\n'));
}

if (require.main === module) {
  main();
}

module.exports = { main, parseArgs, defaultRoot, isSensitivePath };
