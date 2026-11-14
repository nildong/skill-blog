'use strict';

// Uso: node tools/price-monitor/src/index.js [--limit N] [--threshold 5]
const fs = require('fs');
const path = require('path');
const { scanSite } = require('./scan');
const { fetchLanding } = require('./meli');
const { classify, renderMarkdown } = require('./report');

const ROOT = path.resolve(__dirname, '../../..');
const STATE_DIR = path.join(ROOT, '.data', 'price-monitor');
const REPORT_DIR = path.join(ROOT, 'reports', 'price-monitor');
const DELAY_MS = 3000;

const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i === -1 ? fallback : Number(process.argv[i + 1]);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function check(url) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const r = await fetchLanding(url);
      if (r.status === 'ok' || attempt === 2) return r;
    } catch (err) {
      if (attempt === 2) return { status: 'erro', error: String(err.message || err) };
    }
    await sleep(DELAY_MS * 3);
  }
}

async function main() {
  const threshold = arg('--threshold', 5);
  const limit = arg('--limit', Infinity);
  const date = new Date().toISOString().slice(0, 10);
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.mkdirSync(REPORT_DIR, { recursive: true });

  const statePath = path.join(STATE_DIR, 'state.json');
  const previous = fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, 'utf8')) : {};

  const links = scanSite(ROOT).slice(0, limit);
  console.log(`${links.length} links de afiliado em ${new Set(links.flatMap((l) => l.pages.map((p) => p.slug))).size} artigos`);

  const results = [];
  for (const [i, link] of links.entries()) {
    const r = await check(link.url);
    results.push({ ...link, ...r });
    console.log(`[${i + 1}/${links.length}] ${link.url} ${r.status} ${r.price ?? ''} ${r.title ? r.title.slice(0, 60) : ''}`);
    await sleep(DELAY_MS + Math.random() * 1000);
  }

  const summary = classify(results, previous, threshold);
  const md = renderMarkdown({ date, results, threshold, ...summary });
  fs.writeFileSync(path.join(REPORT_DIR, `${date}.md`), md);
  fs.writeFileSync(path.join(REPORT_DIR, 'latest.md'), md);
  fs.writeFileSync(path.join(STATE_DIR, `${date}.json`), JSON.stringify(results, null, 2));

  const state = { ...previous };
  for (const r of results) if (r.status === 'ok') state[r.url] = { itemId: r.itemId, title: r.title, price: r.price, checkedAt: date };
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

  console.log(`Relatório: reports/price-monitor/${date}.md · mudanças: ${summary.changes.length} · alertas: ${summary.alerts.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
