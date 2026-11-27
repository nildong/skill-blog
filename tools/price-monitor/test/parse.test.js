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

test('parseLanding lê nota, vendidos e preço anterior do card do produto', () => {
  const html = '<meta name="description" content="Olha o que eu encontrei! Tag Android - R$ 99,19 no Mercado Livre."> '
    + '{"unique_id":"x","metadata":{"id":"MLB5218289593","signal":{}},"float_highlight":{"text":"{icon_flame_orange} ÚLTIMAS 5"},'
    + '"price":{"previous_price":{"value":159.99},"current_price":{"value":99.19}},'
    + '"review_compacted":{"alt_text":"Classificação 4.8 de 5 estrelas. Mais de 100 produtos vendidos.","values":[{"key":"label2","type":"label","label":{"text":"| +100 vendidos"}}]}},'
    + '{"unique_id":"y","metadata":{"id":"MLB1"},"review_compacted":{"alt_text":"Classificação 3.1 de 5 estrelas."}} MLB5218289593';
  const r = parseLanding(html);
  assert.strictEqual(r.itemId, 'MLB5218289593');
  assert.strictEqual(r.rating, 4.8);
  assert.strictEqual(r.sold, '+100 vendidos');
  assert.strictEqual(r.previousPrice, 159.99);
  assert.strictEqual(r.lastUnits, 'ÚLTIMAS 5');
});

test('classify ignora troca de anúncio do mesmo produto e usa o produto original', () => {
  const pages = [{ slug: 'p', shownPrices: [] }];
  const prev = {
    a: { itemId: 'MLB9', title: 'X', expected: { itemId: 'MLB1', title: 'Ração Royal Canin Small Dog Gastrointestinal Low Fat 1,5kg' } },
    b: { itemId: 'MLB2', title: 'Fonte Inox 3L' },
  };
  const results = [
    { url: 'a', status: 'ok', title: 'Ração Royal Canin Small Dog Gastrointestinal Low Fat 1,5kg', price: 100, itemId: 'MLB3', pages },
    { url: 'b', status: 'ok', title: 'Guia Longa 2,5m Para Cães', price: 30, itemId: 'MLB4', pages },
  ];
  const out = classify(results, prev, 5);
  assert.deepStrictEqual(out.alerts.map((x) => x.url), ['b']);
  assert.strictEqual(out.alerts[0].original.title, 'Fonte Inox 3L');
});

test('substituir: parseMap e replaceLink exato', () => {
  const { parseMap, replaceLink } = require('../src/substituir');
  const { pairs, errors } = parseMap('# x\nhttps://meli.la/abc https://meli.la/NEW1\n\nhttps://meli.la/abc\n# feito: https://meli.la/z https://meli.la/y\n');
  assert.deepStrictEqual(pairs.map((p) => [p.from, p.to, p.line]), [['https://meli.la/abc', 'https://meli.la/NEW1', 1]]);
  assert.strictEqual(errors.length, 1);
  const r = replaceLink('<a href="https://meli.la/abc">1</a> <a href="https://meli.la/abcd">2</a> "url": "https://meli.la/abc"', 'https://meli.la/abc', 'https://meli.la/NEW1');
  assert.strictEqual(r.count, 2);
  assert.ok(r.html.includes('https://meli.la/abcd'));
});
