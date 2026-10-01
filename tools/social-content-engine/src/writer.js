'use strict';

const fs = require('fs');
const path = require('path');

/** Escrita atômica: grava em .tmp e renomeia — evita arquivo truncado se o processo for interrompido no meio. */
function writeJsonAtomic(absPath, data) {
  const dir = path.dirname(absPath);
  fs.mkdirSync(dir, { recursive: true });
  const tmpPath = `${absPath}.tmp-${process.pid}`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  fs.renameSync(tmpPath, absPath);
  return Buffer.byteLength(JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function writeTextAtomic(absPath, text) {
  const dir = path.dirname(absPath);
  fs.mkdirSync(dir, { recursive: true });
  const tmpPath = `${absPath}.tmp-${process.pid}`;
  fs.writeFileSync(tmpPath, text, 'utf8');
  fs.renameSync(tmpPath, absPath);
  return Buffer.byteLength(text, 'utf8');
}

/**
 * Grava um pacote por artigo em .data/social-content/{slug}.json e retorna
 * o resumo que entra no índice.
 */
function writeArticlePackage({ root, articleAnalysis, similarityWarnings }) {
  const slug = articleAnalysis.article.slug;
  const outPath = path.join(root, '.data', 'social-content', `${slug}.json`);

  const warnings = similarityWarnings.get(slug) || [];
  const pkg = {
    ...articleAnalysis,
    similarity_warning: warnings.length > 0,
    similarity_details: warnings,
  };

  const bytes = writeJsonAtomic(outPath, pkg);
  return { slug, outPath, bytes, pkg };
}

function writeIndex({ root, entries, pilotMeta }) {
  const outPath = path.join(root, '.data', 'social-content-index.json');
  const index = {
    version: 1,
    generated_at: new Date().toISOString(),
    mode: 'dry_run_pilot',
    pilot: pilotMeta,
    entries: entries.map((e) => ({
      slug: e.pkg.article.slug,
      title: e.pkg.article.title,
      url: e.pkg.article.url,
      cluster: e.pkg.article.cluster,
      cluster_source: e.pkg.article.cluster_source,
      cluster_confidence: e.pkg.article.cluster_confidence,
      generated_at: e.pkg.source.generated_at,
      piece_count: e.pkg.content.reels.length + e.pkg.content.posts.length + e.pkg.content.carousel.length + e.pkg.content.stories.length + e.pkg.content.engagement.length,
      status: e.pkg.status,
      similarity_warning: e.pkg.similarity_warning,
      package_path: path.relative(root, e.outPath),
    })),
  };
  const bytes = writeJsonAtomic(outPath, index);
  return { outPath, bytes };
}

module.exports = { writeJsonAtomic, writeTextAtomic, writeArticlePackage, writeIndex };
