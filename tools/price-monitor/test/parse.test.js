'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { parsePrice, shownPriceNear, offerPrices } = require('../src/scan');
const { parseLanding } = require('../src/meli');
const { classify } = require('../src/report');

test('parsePrice entende formatos brasileiros', () => {
  assert.strictEqual(parsePrice('R$ 22'), 22);
  assert.strictEqual(parsePrice('<strong>R$ 170,90</strong> (de R$ 179,90)'), 170.9);
  assert.strictEqual(parsePrice('R$ 4.999,90'), 4999.9);
  assert.strictEqual(parsePrice('sem preço'), null);
});

test('shownPriceNear lê a linha da tabela e a ficha do card', () => {
  const row = '<tr><td>AGBE</td><td><strong>R$ 42,50</strong></td><td><a href="https://meli.la/abc">Ver</a></td></tr>';
  assert.strictEqual(shownPriceNear(row, row.indexOf('href')), 42.5);
  const card = '<div class="product-card" id="x"><table class="spec"><tbody><tr><th>Preço</th><td><strong>R$ 98,80</strong> (de R$ 128)</td></tr></tbody></table><div class="cta-box"><a class="cta-btn" href="https://meli.la/abc">Ver</a></div></div>';
  assert.strictEqual(shownPriceNear(card, card.indexOf('href="https://meli')), 98.8);
  const after = card + '<p>Veja também a <a href="https://meli.la/outro">tag</a>.</p>';
  assert.strictEqual(shownPriceNear(after, after.indexOf('href="https://meli.la/outro')), null);
});

test('offerPrices lê o schema', () => {
  const html = '"offers": { "@type": "Offer", "price": "29.87", "priceCurrency": "BRL", "availability": "x", "url": "https://meli.la/2p4GhJA" }';
  assert.strictEqual(offerPrices(html).get('https://meli.la/2p4GhJA'), 29.87);
});

test('parseLanding extrai título, preço e anúncio', () => {
  const html = '<meta name="description" content="Olha o que eu encontrei! Bebedouro Gato Fonte Agua - R$ 42,50 no Mercado Livre."> MLB72111742 MLB72111742 MLB1';
  assert.deepStrictEqual(parseLanding(html), { status: 'ok', title: 'Bebedouro Gato Fonte Agua', price: 42.5, itemId: 'MLB72111742' });
  assert.strictEqual(parseLanding('<meta name="description" content="Lista de afiliados">').status, 'sem_produto');
});

test('classify separa mudanças e alertas', () => {
  const results = [
    { url: 'a', status: 'ok', title: 'A', price: 60, itemId: 'MLB1', pages: [{ slug: 'p1', shownPrices: [50] }] },
    { url: 'b', status: 'ok', title: 'B', price: 50.5, itemId: 'MLB2', pages: [{ slug: 'p2', shownPrices: [50] }] },
    { url: 'c', status: 'sem_produto', pages: [{ slug: 'p3', shownPrices: [] }] },
  ];
  const out = classify(results, { b: { itemId: 'MLB9' } }, 5);
  assert.strictEqual(out.changes.length, 1);
  assert.strictEqual(out.changes[0].slug, 'p1');
  assert.strictEqual(out.alerts.length, 2);
});
