'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Carrega as fontes de dados já produzidas pelas fases anteriores da V2.
 * Somente leitura. `content-strategy.json` e `affiliate-products.json`
 * são opcionais — se ausentes, o engine degrada graciosamente (cluster
 * fica 'unknown'/produtos ficam vazios), nunca inventa.
 */
function readJsonIfExists(absPath) {
  if (!fs.existsSync(absPath)) return null;
  return JSON.parse(fs.readFileSync(absPath, 'utf8'));
}

function loadDataSources(root) {
  const siteIndexPath = path.join(root, '.data', 'site-index.json');
  const contentStrategyPath = path.join(root, '.data', 'content-strategy.json');
  const affiliateProductsPath = path.join(root, '.data', 'affiliate-products.json');

  const siteIndex = readJsonIfExists(siteIndexPath);
  if (!siteIndex) {
    throw new Error(`site-index.json não encontrado em ${siteIndexPath}. Rode a skill site-indexer primeiro.`);
  }

  const contentStrategy = readJsonIfExists(contentStrategyPath);
  const affiliateProducts = readJsonIfExists(affiliateProductsPath);

  const missing = [];
  if (!contentStrategy) missing.push('content-strategy.json (cluster ficará "unknown" para todas as páginas)');
  if (!affiliateProducts) missing.push('affiliate-products.json (produtos afiliados ficarão vazios)');

  return { siteIndex, contentStrategy, affiliateProducts, missing };
}

module.exports = { loadDataSources, readJsonIfExists };
