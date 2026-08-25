'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { buildInventory } = require('../src/analyzer');
const { makePost, makeSeoPage, makeIssue, makeSuggestion, makePair } = require('./support/helpers');
const {
  resetIdCounter,
  buildUpdateExistingOpportunities,
  buildExpandExistingOpportunities,
  buildInternalLinkingOpportunities,
  buildFaqOpportunities,
  buildDifferentiateOpportunities,
  buildNoActionEntries,
} = require('../src/opportunities');

function inventoryFor(posts, { seoAudit, internalLinking, cannibalization } = {}) {
  resetIdCounter();
  return buildInventory(posts, { seoAudit, internalLinking, cannibalization }).inventory;
}

test('UPDATE_EXISTING: página com problema SEO relevante (ERROR) gera oportunidade HIGH confidence', () => {
  const post = makePost({ slug: 'a' });
  const seoAudit = { pages: [makeSeoPage(post, { status: 'error', issues: [makeIssue({ id: 'TITLE_MISSING', severity: 'ERROR' })] })] };
  const inventory = inventoryFor([post], { seoAudit });

  const opps = buildUpdateExistingOpportunities(inventory);
  assert.equal(opps.length, 1);
  assert.equal(opps[0].type, 'UPDATE_EXISTING');
  assert.equal(opps[0].confidence, 'HIGH');
});

test('EXPAND_EXISTING: página realmente curta (CONTENT_EXTREMELY_SHORT) gera oportunidade', () => {
  const post = makePost({ slug: 'curta', content: { word_count: 90 } });
  const seoAudit = { pages: [makeSeoPage(post, { status: 'error', issues: [makeIssue({ id: 'CONTENT_EXTREMELY_SHORT', severity: 'ERROR' })] })] };
  const inventory = inventoryFor([post], { seoAudit });

  const opps = buildExpandExistingOpportunities(inventory);
  assert.equal(opps.length, 1);
  assert.equal(opps[0].confidence, 'HIGH');
});

test('EXPAND_EXISTING: página curta mas adequada (só CONTENT_BRIEF, sem outro sinal) NÃO gera oportunidade', () => {
  const post = makePost({ slug: 'adequada', content: { word_count: 350 } });
  const seoAudit = { pages: [makeSeoPage(post, { status: 'pass', issues: [makeIssue({ id: 'CONTENT_BRIEF', severity: 'INFO' })] })] };
  const inventory = inventoryFor([post], { seoAudit });

  const opps = buildExpandExistingOpportunities(inventory);
  assert.equal(opps.length, 0, 'CONTENT_BRIEF sozinho não deve gerar EXPAND_EXISTING (achado da Fase 3)');
});

test('EXPAND_EXISTING: CONTENT_SHORT + HEADING_STRUCTURE_THIN juntos geram oportunidade MEDIUM confidence', () => {
  const post = makePost({ slug: 'curta-rasa', content: { word_count: 200 } });
  const seoAudit = {
    pages: [
      makeSeoPage(post, {
        status: 'warning',
        issues: [makeIssue({ id: 'CONTENT_SHORT', severity: 'WARNING' }), makeIssue({ id: 'HEADING_STRUCTURE_THIN', severity: 'INFO' })],
      }),
    ],
  };
  const inventory = inventoryFor([post], { seoAudit });
  const opps = buildExpandExistingOpportunities(inventory);
  assert.equal(opps.length, 1);
  assert.equal(opps[0].confidence, 'MEDIUM');
});

test('IMPROVE_INTERNAL_LINKING: página órfã com sugestões vira oportunidade HIGH confidence', () => {
  const post = makePost({ slug: 'orfa' });
  const seoAudit = { pages: [makeSeoPage(post, { status: 'error', issues: [makeIssue({ id: 'ORPHAN_PAGE', severity: 'ERROR' })] })] };
  const internalLinking = { suggestions: [makeSuggestion({ source: '/outra/', target: post.url_path, score: 50 })] };
  const inventory = inventoryFor([post], { seoAudit, internalLinking });

  const opps = buildInternalLinkingOpportunities(inventory);
  assert.equal(opps.length, 1);
  assert.equal(opps[0].confidence, 'HIGH');
});

test('IMPROVE_FAQ: FAQ_HEADING_WITHOUT_SCHEMA gera oportunidade HIGH confidence', () => {
  const post = makePost({ slug: 'com-faq-sem-schema' });
  const seoAudit = { pages: [makeSeoPage(post, { status: 'warning', issues: [makeIssue({ id: 'FAQ_HEADING_WITHOUT_SCHEMA', severity: 'WARNING' })] })] };
  const inventory = inventoryFor([post], { seoAudit });

  const opps = buildFaqOpportunities(inventory);
  assert.equal(opps.length, 1);
  assert.equal(opps[0].confidence, 'HIGH');
});

test('IMPROVE_FAQ: FAQ_OPPORTUNITY em página SATELLITE comum não gera oportunidade (só PILLAR/REVIEW)', () => {
  const post = makePost({ slug: 'satelite-generico' });
  const seoAudit = { pages: [makeSeoPage(post, { status: 'pass', issues: [makeIssue({ id: 'FAQ_OPPORTUNITY', severity: 'INFO' })] })] };
  const inventory = inventoryFor([post], { seoAudit });

  const opps = buildFaqOpportunities(inventory);
  assert.equal(opps.length, 0);
});

test('DIFFERENTIATE_CONTENT: par POSSIBLE gera oportunidade (risco real)', () => {
  const a = makePost({ slug: 'pagina-a' });
  const b = makePost({ slug: 'pagina-b' });
  const cannibalization = { pairs: [makePair({ page_a: a.url_path, page_b: b.url_path, level: 'possible' })] };
  const inventory = inventoryFor([a, b], { cannibalization });

  const opps = buildDifferentiateOpportunities(inventory);
  assert.equal(opps.length, 1);
});

test('DIFFERENTIATE_CONTENT: par COMPLEMENTARY não gera oportunidade', () => {
  const a = makePost({ slug: 'pilar' });
  const b = makePost({ slug: 'satelite' });
  const cannibalization = { pairs: [makePair({ page_a: a.url_path, page_b: b.url_path, level: 'complementary', relationship: 'pillar_satellite' })] };
  const inventory = inventoryFor([a, b], { cannibalization });

  const opps = buildDifferentiateOpportunities(inventory);
  assert.equal(opps.length, 0);
});

test('DIFFERENTIATE_CONTENT: mesmo par não gera duas oportunidades (dedup por par, não por página)', () => {
  const a = makePost({ slug: 'pagina-a' });
  const b = makePost({ slug: 'pagina-b' });
  const cannibalization = { pairs: [makePair({ page_a: a.url_path, page_b: b.url_path, level: 'high' })] };
  const inventory = inventoryFor([a, b], { cannibalization });

  const opps = buildDifferentiateOpportunities(inventory);
  assert.equal(opps.length, 1, 'o par deve gerar apenas 1 oportunidade, não 1 por página envolvida');
});

test('NO_ACTION: página sem problemas relevantes e sem oportunidade recebe registro explícito', () => {
  const post = makePost({ slug: 'tranquila' });
  const seoAudit = { pages: [makeSeoPage(post, { status: 'pass', issues: [makeIssue({ id: 'FAQ_OPPORTUNITY', severity: 'INFO' })] })] };
  const inventory = inventoryFor([post], { seoAudit });

  const entries = buildNoActionEntries(inventory, new Set());
  assert.equal(entries.length, 1);
  assert.equal(entries[0].type, 'NO_ACTION');
});

test('NO_ACTION: página que já tem oportunidade real não recebe NO_ACTION (evita contradição)', () => {
  const post = makePost({ slug: 'com-oportunidade' });
  const inventory = inventoryFor([post]);
  const entries = buildNoActionEntries(inventory, new Set([post.url_path]));
  assert.equal(entries.length, 0);
});

// -------------------------------------------------------- Fase 4.1

test('UPDATE_EXISTING: página institucional com SÓ issues INFO não gera oportunidade (deve virar NO_ACTION)', () => {
  const post = makePost({ slug: 'contato', page_type: 'institutional' });
  const seoAudit = {
    pages: [
      makeSeoPage(post, {
        status: 'pass',
        issues: [makeIssue({ id: 'JSONLD_MISSING', severity: 'INFO' }), makeIssue({ id: 'LOW_INTERNAL_LINKS', severity: 'INFO' })],
      }),
    ],
  };
  const inventory = inventoryFor([post], { seoAudit });

  const opps = buildUpdateExistingOpportunities(inventory);
  assert.equal(opps.length, 0, 'INFO isolado em página institucional não deve virar UPDATE_EXISTING');

  const entries = buildNoActionEntries(inventory, new Set());
  assert.equal(entries.length, 1, 'a página deve cair em NO_ACTION');
});

test('UPDATE_EXISTING: página institucional com problema WARNING/ERROR real ainda gera oportunidade', () => {
  const post = makePost({ slug: 'sobre', page_type: 'institutional' });
  const seoAudit = {
    pages: [makeSeoPage(post, { status: 'error', issues: [makeIssue({ id: 'H1_MISSING', severity: 'ERROR' })] })],
  };
  const inventory = inventoryFor([post], { seoAudit });

  const opps = buildUpdateExistingOpportunities(inventory);
  assert.equal(opps.length, 1, 'evidência forte (não-INFO) deve continuar gerando UPDATE_EXISTING mesmo em institucional');
});

test('DIFFERENTIATE_CONTENT: dois temas diferentes com boilerplate semelhante ("melhor X automático... guia 2026") não gera conflito relevante', () => {
  const a = makePost({ slug: 'melhor-alimentador-automatico-gatos', title: 'Melhor Alimentador Automático para Gatos: Guia 2026' });
  const b = makePost({ slug: 'melhor-comedouro-automatico-cachorro', title: 'Melhor Comedouro Automático para Cachorro: Guia 2026' });
  // score real (pós Fase 4.1) fica abaixo do threshold de relatório do
  // Cannibalization (40) — portanto o par nem apareceria em
  // cannibalization.json; aqui simulamos diretamente que ele NÃO é
  // repassado como oportunidade quando o nível é 'low'.
  const cannibalization = { pairs: [makePair({ page_a: a.url_path, page_b: b.url_path, level: 'low', score: 22 })] };
  const inventory = inventoryFor([a, b], { cannibalization });

  const opps = buildDifferentiateOpportunities(inventory);
  assert.equal(opps.length, 0, 'par level=low não deve gerar DIFFERENTIATE_CONTENT');
});

test('DIFFERENTIATE_CONTENT: dois reviews do mesmo produto/família continuam sendo detectados como risco real', () => {
  const a = makePost({ slug: 'comedouro-newpet-2l-review', title: 'Comedouro Newpet 2L: Vale a Pena? Review' });
  const b = makePost({ slug: 'comedouro-newpet-4l-review', title: 'Comedouro Newpet 4L: Review Completo' });
  const cannibalization = { pairs: [makePair({ page_a: a.url_path, page_b: b.url_path, level: 'possible', score: 65 })] };
  const inventory = inventoryFor([a, b], { cannibalization });

  const opps = buildDifferentiateOpportunities(inventory);
  assert.equal(opps.length, 1, 'conflito real (mesmo produto, capacidades diferentes) deve continuar sendo reportado');
  assert.equal(opps[0].confidence, 'MEDIUM');
});
