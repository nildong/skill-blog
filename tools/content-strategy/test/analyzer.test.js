'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { buildInventory, buildClusterViews } = require('../src/analyzer');
const { makePost, makeSeoPage, makeIssue, makeSuggestion } = require('./support/helpers');

test('buildInventory: cruza site-index + seo-audit + internal-linking + cannibalization sem inventar dados', () => {
  const post = makePost({ slug: 'exemplo' });
  const seoAudit = { pages: [makeSeoPage(post, { status: 'warning', issues: [makeIssue({ id: 'TITLE_MISSING', severity: 'ERROR' })] })] };

  const { inventory } = buildInventory([post], { seoAudit, internalLinking: null, cannibalization: null });
  const page = inventory[0];

  assert.equal(page.url, '/exemplo/');
  assert.equal(page.seo_status, 'warning');
  assert.equal(page.seo_issues.length, 1);
  assert.equal(page.internal_linking_suggestions_out.length, 0);
  assert.equal(page.cannibalization_pairs.length, 0);
});

test('buildInventory: campos sem fonte disponível ficam null (seo-audit ausente)', () => {
  const post = makePost({ slug: 'exemplo' });
  const { inventory } = buildInventory([post], { seoAudit: null, internalLinking: null, cannibalization: null });
  assert.equal(inventory[0].seo_status, null);
  assert.equal(inventory[0].seo_issues, null);
});

test('buildInventory: página institucional é classificada corretamente e não recebe cluster', () => {
  const post = makePost({ slug: 'sobre', page_type: 'institutional' });
  const { inventory } = buildInventory([post], { seoAudit: null, internalLinking: null, cannibalization: null });
  assert.equal(inventory[0].role, 'INSTITUTIONAL');
  assert.equal(inventory[0].cluster, null);
});

test('buildClusterViews: cluster com pilar + múltiplos formatos -> coverage GOOD', () => {
  const pillar = makePost({ slug: 'coleira-gps-para-pet', title: 'Coleira GPS: Guia Completo', internal_link_count: 15 });
  const faq = makePost({ slug: 'duvidas-coleira-gps-pet', title: 'Coleira GPS: Perguntas Frequentes' });
  const review = makePost({ slug: 'cat-mate-c500-review', title: 'Cat Mate C500: Vale a Pena?' });

  // PILLAR (tools/shared/format-classifier.js) é detectado por inbound
  // real (>= 20), calculado pelo link-graph a partir de internal_links
  // de OUTRAS páginas — não é algo que se possa "forçar" via parâmetro.
  // Para testar a detecção de pilar de forma realista (sem depender de
  // 72 posts reais), geramos posts de preenchimento que legitimamente
  // linkam para o pilar, cruzando o threshold real do classificador.
  const fillers = Array.from({ length: 20 }, (_, i) =>
    makePost({ slug: `filler-${i}`, internal_links: [{ href: pillar.url_path, anchor_text: 'coleira gps', type: 'absolute' }], internal_link_count: 1 })
  );

  const posts = [pillar, faq, review, ...fillers];

  const internalLinking = {
    suggestions: [
      makeSuggestion({ source: faq.url_path, target: pillar.url_path, relationship: 'pillar_satellite' }),
      makeSuggestion({ source: review.url_path, target: pillar.url_path, relationship: 'pillar_satellite' }),
    ],
  };
  const seoAudit = { pages: posts.map((p) => makeSeoPage(p, { status: 'pass', issues: [] })) };

  const { inventory } = buildInventory(posts, { seoAudit, internalLinking, cannibalization: null });
  const clusters = buildClusterViews(inventory);

  const target = clusters.find((c) => c.cluster_id === 'coleira-gps-para-pet');
  assert.ok(target, 'cluster coleira-gps-para-pet deveria existir');
  assert.equal(target.coverage, 'GOOD');
  assert.equal(target.pillar, pillar.url_path);
});

test('buildClusterViews: cluster sem pilar identificado -> coverage THIN', () => {
  const a = makePost({ slug: 'porta-eletronica-x-alcapao-tradicional', title: 'Porta Eletrônica x Alçapão' });
  const b = makePost({ slug: 'porta-eletronica-microchip-x-rfid-coleira', title: 'Porta Eletrônica: Microchip x RFID' });
  const posts = [a, b];
  const seoAudit = { pages: posts.map((p) => makeSeoPage(p)) };

  const { inventory } = buildInventory(posts, { seoAudit, internalLinking: null, cannibalization: null });
  // sem pilar (inbound baixo) e sem relação conhecida -> cluster provável fraco ou null;
  // o teste garante que, mesmo se algum cluster surgir, nenhum pilar existe -> THIN.
  const clusters = buildClusterViews(inventory);
  for (const c of clusters) {
    assert.equal(c.coverage, 'THIN');
  }
});
