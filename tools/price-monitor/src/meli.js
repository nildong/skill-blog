'use strict';

const { parsePrice } = require('./scan');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

// A página de afiliado que o meli.la abre (/social/<afiliado>?ref=…) não é bloqueada
// e traz o produto na meta description: "Olha o que eu encontrei! <título> - R$ 42,50 no Mercado Livre".
function parseLanding(html) {
  const desc = (/<meta name="description" content="([^"]*)"/.exec(html) || /property="og:description" content="([^"]*)"/.exec(html) || [])[1] || '';
  const m = /encontrei!\s*(.+?)\s+-\s+(R\$\s?[\d.,]+)/.exec(desc);
  const counts = new Map();
  for (const id of html.match(/MLB\d{8,}/g) || []) counts.set(id, (counts.get(id) || 0) + 1);
  const itemId = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  if (!m) return { status: 'sem_produto', title: null, price: null, itemId, raw: desc.slice(0, 120) };
  return { status: 'ok', title: m[1].trim(), price: parsePrice(m[2]), itemId };
}

async function fetchLanding(url, { timeoutMs = 30000 } = {}) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'pt-BR,pt;q=0.9' }, redirect: 'follow', signal: AbortSignal.timeout(timeoutMs) });
  const html = await res.text();
  if (res.url.includes('account-verification')) return { status: 'bloqueado', finalUrl: res.url };
  if (!res.ok) return { status: 'erro', httpStatus: res.status, finalUrl: res.url };
  return { ...parseLanding(html), finalUrl: res.url };
}

module.exports = { parseLanding, fetchLanding };
