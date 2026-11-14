'use strict';

const fs = require('fs');
const path = require('path');

// Pastas que não são artigos publicados.
const SKIP_DIRS = new Set(['node_modules', 'tools', 'reports', 'img', 'audit', 'autores', 'fotos', 'pins', 'output_midia_avancada', 'output_social_v2', 'cluster-comedouro-automatico-pet']);

const LINK_RE = /href="(https:\/\/meli\.la\/[A-Za-z0-9]+)"/g;
const PRICE_RE = /R\$\s?(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?)/;

function parsePrice(text) {
  const m = PRICE_RE.exec(text || '');
  if (!m) return null;
  return Number(m[1].replace(/\./g, '').replace(',', '.'));
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Preços declarados no schema ItemList/Product: url do offer -> price.
function offerPrices(html) {
  const out = new Map();
  const re = /"price":\s*"([\d.]+)"[^}]*?"url":\s*"(https:\/\/meli\.la\/[A-Za-z0-9]+)"/g;
  let m;
  while ((m = re.exec(html))) out.set(m[2], Number(m[1]));
  return out;
}

// Preço mostrado perto de um link: linha da tabela comparativa ou ficha do card do produto.
function shownPriceNear(html, index) {
  const rowStart = html.lastIndexOf('<tr', index);
  const rowEnd = html.indexOf('</tr>', index);
  if (rowStart !== -1 && rowEnd !== -1 && html.lastIndexOf('</tr>', index) < rowStart) {
    const price = parsePrice(stripTags(html.slice(rowStart, rowEnd)));
    if (price) return price;
  }
  const cardStart = html.lastIndexOf('<div class="product-card"', index);
  if (cardStart !== -1) {
    const card = html.slice(cardStart, index);
    // O link só pertence ao card se ainda estiver dentro dele (div do card não fechou antes do link).
    const depth = (card.match(/<div[\s>]/g) || []).length - (card.match(/<\/div>/g) || []).length;
    if (depth <= 0) return null;
    const spec = /<th>Preço<\/th><td>([\s\S]*?)<\/td>/.exec(card);
    if (spec) return parsePrice(stripTags(spec[1]));
  }
  return null;
}

function scanSite(root) {
  const links = new Map();
  for (const dir of fs.readdirSync(root, { withFileTypes: true })) {
    if (!dir.isDirectory() || dir.name.startsWith('.') || SKIP_DIRS.has(dir.name)) continue;
    const file = path.join(root, dir.name, 'index.html');
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, 'utf8');
    const offers = offerPrices(html);
    let m;
    LINK_RE.lastIndex = 0;
    while ((m = LINK_RE.exec(html))) {
      const url = m[1];
      if (!links.has(url)) links.set(url, { url, pages: new Map() });
      const pages = links.get(url).pages;
      if (!pages.has(dir.name)) pages.set(dir.name, new Set());
      const price = shownPriceNear(html, m.index);
      if (price) pages.get(dir.name).add(price);
    }
    // O preço do schema (offers) é o mais confiável: vai para a frente da lista.
    for (const [url, price] of offers) {
      if (!links.has(url) || !links.get(url).pages.has(dir.name)) continue;
      const pages = links.get(url).pages;
      pages.set(dir.name, new Set([price, ...pages.get(dir.name)]));
    }
    // Review de produto único: a ficha técnica ("Preço" / "Preço no Mercado Livre") vale para o único link da página.
    const pageLinks = [...new Set([...html.matchAll(LINK_RE)].map((x) => x[1]))];
    if (pageLinks.length === 1) {
      const prices = links.get(pageLinks[0]).pages.get(dir.name);
      const spec = /<t[hd]>Preço[^<]*<\/t[hd]>\s*<td>([\s\S]*?)<\/td>/.exec(html);
      if (!prices.size && spec) {
        const price = parsePrice(stripTags(spec[1]));
        if (price) prices.add(price);
      }
    }
  }
  return [...links.values()].map((l) => ({
    url: l.url,
    // Ordem preservada: schema primeiro, depois a primeira ocorrência no texto.
    pages: [...l.pages.entries()].map(([slug, prices]) => ({ slug, shownPrices: [...prices] })),
  }));
}

module.exports = { scanSite, parsePrice, shownPriceNear, offerPrices };
