'use strict';

const SITE = 'https://smartpetgadgets.com.br';

const brl = (n) => (n == null ? '—' : 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }));
const quality = (r) => [r.rating != null && `nota ${String(r.rating).replace('.', ',')}`, r.sold, r.lastUnits && r.lastUnits.toLowerCase()].filter(Boolean).join(' · ');
const MIN_RATING = 4.3;

// Mesmo produto com outro anúncio (outro vendedor/variação do catálogo) não é alerta: compara os títulos.
const words = (t) => new Set((t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/[^a-z0-9]+/).filter((w) => w.length > 2));
function sameProduct(a, b) {
  const x = words(a);
  const y = words(b);
  if (!x.size || !y.size) return false;
  const common = [...x].filter((w) => y.has(w)).length;
  return common / new Set([...x, ...y]).size >= 0.6;
}

const pct = (n) => (n > 0 ? '+' : '') + n.toFixed(0) + '%';

function classify(results, previous, threshold) {
  const changes = [];
  const alerts = [];
  let unchanged = 0;
  let withoutShownPrice = 0;
  const weak = [];
  for (const r of results) {
    const prev = previous[r.url];
    // expected = produto que o artigo indica (fixado na 1ª leitura; só muda via substituir.js).
    const original = prev && (prev.expected || prev);
    if (r.status !== 'ok') {
      alerts.push({ ...r, original, reason: r.status === 'sem_produto' ? 'Link não abre um produto (anúncio pausado/finalizado ou link de lista)' : r.status === 'bloqueado' ? 'Mercado Livre bloqueou a consulta; tentar de novo na próxima rodada' : `Erro ao abrir o link (HTTP ${r.httpStatus || '?'})` });
      continue;
    }
    if (original && original.itemId && r.itemId && original.itemId !== r.itemId && !sameProduct(original.title, r.title)) {
      alerts.push({ ...r, original, reason: `O link passou a apontar para outro anúncio (${original.itemId} → ${r.itemId})` });
    }
    if ((r.rating != null && r.rating < MIN_RATING) || r.lastUnits) weak.push(r);
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
  return { changes, alerts, weak, unchanged, withoutShownPrice };
}

function renderMarkdown({ date, results, changes, alerts, weak = [], unchanged, withoutShownPrice, threshold }) {
  const lines = [];
  lines.push(`# Monitor de preços dos links de afiliado — ${date}`, '');
  lines.push(`Links verificados: ${results.length} · Preço mudou ${threshold}% ou mais: ${changes.length} · Alertas: ${alerts.length} · Sem mudança: ${unchanged}`, '');
  lines.push('Este relatório só aponta diferenças; nenhum artigo foi alterado. "Preço no artigo" é o primeiro preço encontrado perto do link (tabela, ficha do produto ou schema).', '');

  lines.push('## Alertas (precisam de decisão)', '');
  if (!alerts.length) lines.push('Nenhum.', '');
  for (const a of alerts) {
    lines.push(`- **${a.url}** — ${a.reason}`);
    lines.push(`  - Artigos: ${a.pages.map((p) => `[${p.slug}](${SITE}/${p.slug}/)`).join(', ')}`);
    if (a.original && a.original.title) lines.push(`  - Produto que o artigo indica: ${a.original.title} (${a.original.itemId}, ${brl(a.original.price)} em ${a.original.checkedAt || '?'})`);
    if (a.title) lines.push(`  - Produto atual do link: ${a.title} (${brl(a.price)}${quality(a) ? ' · ' + quality(a) : ''})`);
  }
  if (alerts.length) {
    lines.push('', 'Para trocar: gere o meli.la do substituto e adicione a linha `link-antigo link-novo` em `reports/price-monitor/substituicoes.txt`; depois rode `node tools/price-monitor/src/substituir.js` (prévia) e `--aplicar`.');
  }
  lines.push('');

  lines.push(`## Sinais de qualidade (nota abaixo de ${String(MIN_RATING).replace('.', ',')} ou últimas unidades)`, '');
  if (!weak.length) lines.push('Nenhum.', '');
  for (const w of weak) lines.push(`- ${w.url} — ${w.title} (${brl(w.price)}) · ${quality(w)} · ${w.pages.map((p) => p.slug).join(', ')}`);
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

module.exports = { classify, renderMarkdown, sameProduct };
