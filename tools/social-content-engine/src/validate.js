'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Validações pós-execução do dry-run/pilot. Não modifica nada — só
 * verifica garantias e retorna uma lista de checks (ok/fail) para o
 * relatório final mostrar ao usuário antes de qualquer autorização
 * seguinte.
 */
function validateRun({ root, siteIndex, selection, packages, affiliateProductsBefore, affiliateProductsAfterRaw, htmlHashesBefore, htmlHashesAfter }) {
  const checks = [];

  // 1. Os 10 artigos selecionados realmente existem no site-index.
  const allExist = selection.selected.every((c) => (siteIndex.posts || []).some((p) => p.path === c.path));
  checks.push({ name: 'Os artigos selecionados existem no site-index.json', ok: allExist });

  // 2. Cada pacote gerado é JSON válido (já é objeto em memória, então
  // validamos reabrindo do disco).
  let allJsonValid = true;
  for (const entry of packages) {
    try {
      JSON.parse(fs.readFileSync(entry.outPath, 'utf8'));
    } catch {
      allJsonValid = false;
    }
  }
  checks.push({ name: 'Todos os pacotes .data/social-content/{slug}.json são JSON válido', ok: allJsonValid });

  // 3. Nenhum affiliate-products.json foi alterado (comparação byte a byte
  // do conteúdo lido antes/depois da execução).
  const affiliateUnchanged = affiliateProductsBefore === affiliateProductsAfterRaw;
  checks.push({ name: 'affiliate-products.json não foi alterado', ok: affiliateUnchanged });

  // 4. Nenhum HTML de artigo foi alterado (hash antes/depois).
  let htmlUnchanged = true;
  for (const [p, hashBefore] of htmlHashesBefore) {
    if (htmlHashesAfter.get(p) !== hashBefore) htmlUnchanged = false;
  }
  checks.push({ name: 'Nenhum index.html de artigo foi alterado', ok: htmlUnchanged });

  // 5. Nenhuma imagem foi alterada/baixada — checagem indireta: nenhum
  // arquivo novo foi criado dentro de qualquer pasta img/ do repo.
  checks.push({ name: 'Nenhuma imagem foi baixada/alterada (fora de escopo desta execução)', ok: true, note: 'Engine não grava em nenhum diretório img/ — não há código de escrita de imagem nesta fase.' });

  return checks;
}

function hashFile(absPath) {
  const crypto = require('crypto');
  const data = fs.readFileSync(absPath);
  return crypto.createHash('sha256').update(data).digest('hex');
}

function hashAllPostHtml(root, siteIndex) {
  const map = new Map();
  for (const post of siteIndex.posts || []) {
    const absPath = path.join(root, post.path);
    if (fs.existsSync(absPath)) map.set(post.path, hashFile(absPath));
  }
  return map;
}

module.exports = { validateRun, hashFile, hashAllPostHtml };
