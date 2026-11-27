'use strict';

// Troca links de afiliado quebrados pelos substitutos listados em reports/price-monitor/substituicoes.txt.
// Uso: node tools/price-monitor/src/substituir.js            (prévia: não altera nada)
//      node tools/price-monitor/src/substituir.js --aplicar  (troca nos artigos, atualiza o state e registra)
// Não faz deploy e não mexe em texto ou preço: o relatório lista o que revisar à mão.
const fs = require('fs');
const path = require('path');
const { articleFiles, scanSite } = require('./scan');
const { fetchLanding } = require('./meli');
const { sameProduct } = require('./report');

const ROOT = path.resolve(__dirname, '../../..');
const MAP_PATH = path.join(ROOT, 'reports', 'price-monitor', 'substituicoes.txt');
const STATE_PATH = path.join(ROOT, '.data', 'price-monitor', 'state.json');
const REPORT_DIR = path.join(ROOT, 'reports', 'price-monitor');
const DELAY_MS = 3000;
const LINK = /^https:\/\/meli\.la\/[A-Za-z0-9]+$/;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const brl = (n) => (n == null ? '—' : 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }));
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Linhas "link-antigo link-novo"; # é comentário. Retorna { pairs, errors }.
function parseMap(text) {
  const pairs = [];
  const errors = [];
  text.split('\n').forEach((raw, i) => {
    const line = raw.replace(/#.*/, '').trim();
    if (!line) return;
    const [from, to, ...rest] = line.split(/\s+/);
    if (!LINK.test(from || '') || !LINK.test(to || '') || rest.length) errors.push(`linha ${i + 1}: esperado "https://meli.la/ANTIGO https://meli.la/NOVO"`);
    else if (from === to) errors.push(`linha ${i + 1}: link antigo e novo são iguais`);
    else pairs.push({ from, to, line: i });
  });
  return { pairs, errors };
}

// Troca só o link exato (meli.la/abc não pode casar com meli.la/abcd).
function replaceLink(html, from, to) {
  const re = new RegExp(escape(from) + '(?![A-Za-z0-9])', 'g');
  const count = (html.match(re) || []).length;
  return { html: count ? html.replace(re, to) : html, count };
}

async function main() {
  const apply = process.argv.includes('--aplicar');
  const date = new Date().toISOString().slice(0, 10);
  if (!fs.existsSync(MAP_PATH)) {
    console.log(`Nada a fazer: crie ${path.relative(ROOT, MAP_PATH)} com linhas "link-antigo link-novo".`);
    return;
  }
  const { pairs, errors } = parseMap(fs.readFileSync(MAP_PATH, 'utf8'));
  errors.forEach((e) => console.log(`ERRO ${e}`));
  if (!pairs.length) { console.log('Nenhuma substituição pendente.'); return; }

  const state = fs.existsSync(STATE_PATH) ? JSON.parse(fs.readFileSync(STATE_PATH, 'utf8')) : {};
  const articles = articleFiles(ROOT).map((a) => ({ ...a, html: fs.readFileSync(a.file, 'utf8') }));
  const done = [];
  const lines = [`# Substituição de links de afiliado — ${date}${apply ? '' : ' (prévia)'}`, ''];

  for (const p of pairs) {
    const hits = articles.map((a) => ({ a, ...replaceLink(a.html, p.from, p.to) })).filter((h) => h.count);
    const fresh = await fetchLanding(p.to).catch((err) => ({ status: 'erro', error: String(err.message || err) }));
    await sleep(DELAY_MS);
    const old = state[p.from] ? state[p.from].expected || state[p.from] : null;
    lines.push(`## ${p.from} → ${p.to}`, '');
    lines.push(`- Antes: ${old && old.title ? `${old.title} (${brl(old.price)})` : 'sem leitura anterior'}`);
    if (fresh.status !== 'ok') {
      lines.push(`- **Pulado:** o link novo não abre um produto (${fresh.status}). Gere o meli.la de novo.`, '');
      console.log(`PULADO ${p.from} → ${p.to}: link novo com status ${fresh.status}`);
      continue;
    }
    const q = [fresh.rating != null && `nota ${fresh.rating}`, fresh.sold, fresh.lastUnits].filter(Boolean).join(' · ');
    lines.push(`- Depois: ${fresh.title} (${brl(fresh.price)}${fresh.previousPrice ? `, de ${brl(fresh.previousPrice)}` : ''}${q ? ' · ' + q : ''})`);
    if (!hits.length) {
      lines.push('- **Pulado:** o link antigo não aparece em nenhum artigo (já trocado?).', '');
      console.log(`PULADO ${p.from}: não aparece em nenhum artigo`);
      continue;
    }
    lines.push(`- Artigos (${hits.reduce((n, h) => n + h.count, 0)} ocorrências): ${hits.map((h) => `${h.a.slug} (${h.count})`).join(', ')}`);
    if (old && old.title && !sameProduct(old.title, fresh.title)) lines.push('- Produto diferente do anterior: revisar nome, descrição, prós/contras e schema (name/brand) no texto.');
    console.log(`${apply ? 'TROCADO' : 'PRÉVIA '} ${p.from} → ${p.to} · ${fresh.title.slice(0, 60)} ${brl(fresh.price)} · ${hits.map((h) => `${h.a.slug}(${h.count})`).join(', ')}`);
    if (apply) {
      for (const h of hits) { h.a.html = h.html; fs.writeFileSync(h.a.file, h.html); }
      delete state[p.from];
      const entry = { itemId: fresh.itemId, title: fresh.title, price: fresh.price, rating: fresh.rating ?? null, sold: fresh.sold ?? null, checkedAt: date };
      state[p.to] = { ...entry, expected: { itemId: fresh.itemId, title: fresh.title, price: fresh.price } };
      done.push({ ...p, fresh, slugs: hits.map((h) => h.a.slug) });
    }
    lines.push('');
  }

  // Preço que o artigo mostra perto do link novo x preço atual: o texto não é alterado automaticamente.
  if (done.length) {
    const scanned = new Map(scanSite(ROOT).map((l) => [l.url, l]));
    lines.push('## Revisar à mão', '');
    for (const d of done) {
      for (const page of (scanned.get(d.to) || { pages: [] }).pages) {
        const shown = page.shownPrices[0];
        if (shown != null && Math.abs(shown - d.fresh.price) / shown >= 0.05) lines.push(`- ${page.slug}: o artigo mostra ${brl(shown)} para ${d.to}; o preço atual é ${brl(d.fresh.price)}.`);
      }
    }
    lines.push('- Depois de revisar: publicar os artigos alterados e enviar IndexNow.', '');

    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
    // Marca as linhas aplicadas para não serem processadas de novo.
    const map = fs.readFileSync(MAP_PATH, 'utf8').split('\n');
    for (const d of done) map[d.line] = `# feito ${date}: ${map[d.line].trim()}`;
    fs.writeFileSync(MAP_PATH, map.join('\n'));
    // Mais de uma rodada no mesmo dia: acrescenta ao registro em vez de sobrescrever.
    const logPath = path.join(REPORT_DIR, `substituicoes-${date}.md`);
    if (fs.existsSync(logPath)) fs.appendFileSync(logPath, '\n' + lines.slice(2).join('\n'));
    else fs.writeFileSync(logPath, lines.join('\n'));
    console.log(`Registro: reports/price-monitor/substituicoes-${date}.md`);
  } else {
    console.log('\n' + lines.join('\n'));
    if (!apply) console.log('Prévia: nada foi alterado. Rode com --aplicar para trocar.');
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { parseMap, replaceLink };
