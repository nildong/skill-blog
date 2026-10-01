#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const { loadDataSources } = require('./loader');
const { analyzeArticle } = require('./analyze-article');
const { checkPieceV2 } = require('./quality-gate-v2');
const { CALIBRATION_PIECES } = require('./calibration-v2-data');
const { writeTextAtomic } = require('./writer');
const { hashAllPostHtml } = require('./validate');

const CALIBRATION_SLUGS = ['comedouro-gato-x-cachorro-diferenca', 'duvidas-camera-para-monitorar-pet', 'tapete-higienico-para-cachorro'];

function defaultRoot() {
  return path.resolve(__dirname, '..', '..', '..');
}

function loadV1Piece(root, slug, type) {
  // Reaproveita os pacotes V1 já gravados em .data/social-content/{slug}.json
  // (gerados pela fase "generate --pilot" já autorizada) só para efeito de
  // comparação no relatório — não regrava, não modifica esse arquivo.
  const pkgPath = path.join(root, '.data', 'social-content', `${slug}.json`);
  if (!fs.existsSync(pkgPath)) return null;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  if (type === 'reel') return pkg.content.reels[0] || null;
  if (type === 'post') return pkg.content.posts[0] || null;
  return null;
}

function readAffiliateSnapshot(root) {
  const p = path.join(root, '.data', 'affiliate-products.json');
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
}

function run() {
  const root = defaultRoot();
  const { siteIndex, contentStrategy, affiliateProducts } = loadDataSources(root);

  // Guardas de não-alteração: mesmo princípio do dry-run/generate --pilot.
  const affiliateBefore = readAffiliateSnapshot(root);
  const htmlHashesBefore = hashAllPostHtml(root, siteIndex);

  const results = [];

  for (const slug of CALIBRATION_SLUGS) {
    const post = siteIndex.posts.find((p) => p.path === `${slug}/index.html`);
    if (!post) {
      results.push({ slug, error: `Artigo não encontrado em site-index.json para path esperado ${slug}/index.html` });
      continue;
    }
    const analysis = analyzeArticle(post, { root, contentStrategy, affiliateProducts });
    const { article } = analysis;

    const pieceDefs = CALIBRATION_PIECES[slug];
    if (!pieceDefs) {
      results.push({ slug, error: 'Sem peças de calibração V2 definidas para este slug' });
      continue;
    }

    const pieceResults = {};
    for (const [type, piece] of Object.entries(pieceDefs)) {
      const gate = checkPieceV2(piece, { article });
      const v1Piece = loadV1Piece(root, slug, type);
      pieceResults[type] = {
        v2_piece: { ...piece, quality_checks: gate.checks, quality_passed: gate.passed, status: gate.status },
        v1_piece: v1Piece,
      };
    }

    results.push({
      slug,
      role: article.role,
      title: article.title,
      url: article.url,
      pieces: pieceResults,
    });
  }

  // Confirma que nada foi alterado (mesma garantia de dry-run/generate --pilot).
  const htmlHashesAfter = hashAllPostHtml(root, siteIndex);
  const affiliateAfter = readAffiliateSnapshot(root);
  const htmlUnchanged = JSON.stringify(htmlHashesBefore) === JSON.stringify(htmlHashesAfter);
  const affiliateUnchanged = affiliateBefore === affiliateAfter;

  return { results, htmlUnchanged, affiliateUnchanged };
}

module.exports = { run, CALIBRATION_SLUGS };

if (require.main === module) {
  const { results, htmlUnchanged, affiliateUnchanged } = run();
  console.log(JSON.stringify({ results, htmlUnchanged, affiliateUnchanged }, null, 2));
}
