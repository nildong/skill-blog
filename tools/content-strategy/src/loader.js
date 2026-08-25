'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Carrega os 4 JSONs produzidos pelas fases anteriores. Nenhum é
 * recomputado aqui — o Content Strategy Engine é puramente um
 * consumidor/cruzador de dados já existentes (ver README.md).
 *
 * `site-index.json` é obrigatório (sem ele não há inventário). Os demais
 * são opcionais — se ausentes, o motor ainda roda, mas com `limitations`
 * documentando o que ficou indisponível (ex: sem seo-audit, nenhuma
 * oportunidade UPDATE_EXISTING baseada em issues de SEO é gerada).
 */
function loadDataSources(root) {
  const dataDir = path.join(root, '.data');
  const files = {
    siteIndex: path.join(dataDir, 'site-index.json'),
    seoAudit: path.join(dataDir, 'seo-audit.json'),
    internalLinking: path.join(dataDir, 'internal-linking.json'),
    cannibalization: path.join(dataDir, 'cannibalization.json'),
  };

  const missing = [];
  const readJson = (key, filePath, required) => {
    if (!fs.existsSync(filePath)) {
      if (required) throw new Error(`Arquivo obrigatório não encontrado: ${filePath}`);
      missing.push(key);
      return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  };

  const siteIndex = readJson('siteIndex', files.siteIndex, true);
  const seoAudit = readJson('seoAudit', files.seoAudit, false);
  const internalLinking = readJson('internalLinking', files.internalLinking, false);
  const cannibalization = readJson('cannibalization', files.cannibalization, false);

  return { siteIndex, seoAudit, internalLinking, cannibalization, missing, files };
}

module.exports = { loadDataSources };
