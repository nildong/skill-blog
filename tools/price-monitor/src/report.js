'use strict';

const SITE = 'https://smartpetgadgets.com.br';

const brl = (n) => (n == null ? '—' : 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }));
const pct = (n) => (n > 0 ? '+' : '') + n.toFixed(0) + '%';

function classify(results, previous, threshold) {
  const changes = [];
  const alerts = [];
  let unchanged = 0;
  let withoutShownPrice = 0;
  for (const r of results) {
    const prev = previous[r.url];
    if (r.status !== 'ok') {
      alerts.push({ ...r, reason: r.status === 'sem_produto' ? 'Link não abre um produto (anúncio pausado/finalizado ou link de lista)' : r.status === 'bloqueado' ? 'Mercado Livre bloqueou a consulta; tentar de novo na próxima rodada' : `Erro ao abrir o link (HTTP ${r.httpStatus || '?'})` });
      continue;
    }
    if (prev && prev.itemId && r.itemId && prev.itemId !== r.itemId) {
      alerts.push({ ...r, reason: `O link passou a apontar para outro anúncio (${prev.itemId} → ${r.itemId})` });
    }
    let changedHere = false;
    for (const page of r.pages) {
      if (!page.shownPrices.length) { withoutShownPrice++; continue; }
      const shown = page.shownPrices[0];
      const diff = ((r.price - shown) / shown) * 100;
      if (Math.abs(diff) >= threshold) {
        changes.push({ url: r.url, title: r.title, slug: page.slug, shown, now: r.price, diff });
        changedHere = true;
      }
    }
    if (!changedHere) unchanged++;
  }
  changes.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
  return { changes, alerts, unchanged, withoutShownPrice };
}

function renderMarkdown({ date, results, changes, alerts, unchanged, withoutShownPrice, threshold }) {
  const lines = [];
  lines.push(`# Monitor de preços dos links de afiliado — ${date}`, '');
  lines.push(`Links verificados: ${results.length} · Preço mudou ${threshold}% ou mais: ${changes.length} · Alertas: ${alerts.length} · Sem mudança: ${unchanged}`, '');
  lines.push('Este relatório só aponta diferenças; nenhum artigo foi alterado. "Preço no artigo" é o primeiro preço encontrado perto do link (tabela, ficha do produto ou schema).', '');

  lines.push('## Alertas (precisam de decisão)', '');
  if (!alerts.length) lines.push('Nenhum.', '');
  for (const a of alerts) {
    lines.push(`- **${a.url}** — ${a.reason}`);
    lines.push(`  - Artigos: ${a.pages.map((p) => `[${p.slug}](${SITE}/${p.slug}/)`).join(', ')}`);
    if (a.title) lines.push(`  - Produto atual: ${a.title} (${brl(a.price)})`);
  }
  lines.push('');

  lines.push(`## Preços que mudaram (${threshold}% ou mais)`, '');
  if (!changes.length) lines.push('Nenhum.', '');
  else {
    lines.push('| Artigo | Produto | Preço no artigo | Preço atual | Variação | Link |', '|---|---|---|---|---|---|');
    for (const c of changes) lines.push(`| [${c.slug}](${SITE}/${c.slug}/) | ${c.title} | ${brl(c.shown)} | ${brl(c.now)} | ${pct(c.diff)} | ${c.url} |`);
    lines.push('');
  }

  lines.push('## Links sem preço no artigo', '');
  lines.push(`${withoutShownPrice} ocorrências de link aparecem em artigos que não mostram preço perto do link (artigos antigos ou só com botão). Elas só entram nos alertas se o link quebrar.`, '');
  return lines.join('\n');
}

module.exports = { classify, renderMarkdown };
