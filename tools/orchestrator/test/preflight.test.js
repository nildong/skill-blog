'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { buildProposal, writeProposal } = require('../src/propose');
const {
  runPreflight,
  loadSiteIndex,
  loadProposal,
  writePreflightReport,
} = require('../src/preflight');
const { makeRoot, fakePost } = require('./support/helpers');

test('runPreflight: detecta colisão de slug com página existente', () => {
  const siteIndex = { posts: [fakePost({ slug: 'comedouro-cachorro', title: 'Comedouro Cachorro' })] };
  const proposal = buildProposal({ theme: 'Comedouro Cachorro', slug: 'comedouro-cachorro' });
  const report = runPreflight(proposal, siteIndex);
  assert.equal(report.slug_collision.exists, true);
});

test('runPreflight: sem colisão quando slug é novo', () => {
  const siteIndex = { posts: [fakePost({ slug: 'comedouro-cachorro' })] };
  const proposal = buildProposal({ theme: 'Comedouro para dois gatos' });
  const report = runPreflight(proposal, siteIndex);
  assert.equal(report.slug_collision.exists, false);
});

test('runPreflight: cluster_check reconhece pilar existente por links de entrada reais (buildLinkGraph)', () => {
  const pillar = fakePost({ slug: 'comedouro-automatico-para-pet', title: 'Comedouro Automático para Pet: Guia Completo' });
  // PILLAR_MIN_INBOUND (tools/shared/format-classifier.js) é 20 — gera 21
  // satélites reais linkando para o pilar via internal_links, sem inventar
  // nenhum campo de contagem pronta (a contagem é calculada, não informada).
  const satellites = Array.from({ length: 21 }, (_, i) =>
    fakePost({
      slug: `satelite-${i}`,
      title: `Satélite ${i}`,
      internal_links: [{ href: '/comedouro-automatico-para-pet/', anchor_text: 'guia completo' }],
    })
  );
  const siteIndex = { posts: [pillar, ...satellites] };
  const proposal = buildProposal({ theme: 'Comedouro para dois gatos', cluster: 'comedouro-automatico-para-pet' });
  const report = runPreflight(proposal, siteIndex);
  assert.equal(report.cluster_check.known, true);
  assert.equal(report.cluster_check.is_pillar, true);
});

test('runPreflight: cluster_check sinaliza cluster desconhecido sem inventar', () => {
  const siteIndex = { posts: [] };
  const proposal = buildProposal({ theme: 'Comedouro para dois gatos', cluster: 'cluster-que-nao-existe' });
  const report = runPreflight(proposal, siteIndex);
  assert.equal(report.cluster_check.known, false);
  assert.match(report.cluster_check.note, /não corresponde a nenhum slug existente/);
});

test('runPreflight: canibalização HIGH recomenda bloquear', () => {
  // Título quase idêntico ao existente -> overlap alto de title/slug.
  const siteIndex = {
    posts: [
      fakePost({
        slug: 'comedouro-automatico-para-dois-gatos-guia',
        title: 'Comedouro Automático para Dois Gatos: Guia Completo',
        inbound_links_count: 2,
      }),
    ],
  };
  const proposal = buildProposal({ theme: 'Comedouro Automático para Dois Gatos: Guia Completo' });
  const report = runPreflight(proposal, siteIndex);
  assert.equal(report.cannibalization_preview.top_matches.length, 1);
  assert.ok(['HIGH', 'MEDIUM'].includes(report.cannibalization_preview.worst_level));
  if (report.cannibalization_preview.worst_level === 'HIGH') {
    assert.equal(report.cannibalization_preview.gate_recommendation, 'BLOCK_UNTIL_RESOLVED');
  }
});

test('runPreflight: proposta satélite de um pilar real recebe desconto pilar↔satélite (COMPLEMENTARY), não HIGH/MEDIUM de conflito', () => {
  const pillar = fakePost({ slug: 'comedouro-automatico-para-pet', title: 'Comedouro Automático para Pet: Guia Completo de 2026' });
  const satellites = Array.from({ length: 21 }, (_, i) =>
    fakePost({
      slug: `satelite-${i}`,
      title: `Satélite ${i}`,
      internal_links: [{ href: '/comedouro-automatico-para-pet/', anchor_text: 'guia completo' }],
    })
  );
  const siteIndex = { posts: [pillar, ...satellites] };
  const proposal = buildProposal({ theme: 'Comedouro Automático para Dois Gatos' });
  const report = runPreflight(proposal, siteIndex);
  const vsPillar = report.cannibalization_preview.top_matches.find((m) => m.slug === 'comedouro-automatico-para-pet');
  assert.ok(vsPillar, 'deveria haver uma comparação contra o pilar');
  assert.equal(vsPillar.relationship, 'pillar_satellite');
  assert.equal(vsPillar.level, 'COMPLEMENTARY');
});

test('runPreflight: temas completamente distintos não geram falso alarme de canibalização', () => {
  const siteIndex = {
    posts: [fakePost({ slug: 'tapete-higienico-para-cachorro', title: 'Tapete Higiênico para Cachorro' })],
  };
  const proposal = buildProposal({ theme: 'Câmera com Visão Noturna para Monitorar Pet' });
  const report = runPreflight(proposal, siteIndex);
  assert.equal(report.cannibalization_preview.worst_level, 'LOW');
  assert.equal(report.cannibalization_preview.gate_recommendation, 'PROCEED');
});

test('runPreflight: nunca inventa dado de keyword research (propagado do intent-classifier)', () => {
  const siteIndex = { posts: [] };
  const proposal = buildProposal({ theme: 'Algo novo' });
  const report = runPreflight(proposal, siteIndex);
  assert.equal(report.intent.keyword_research.search_volume_estimate, 'não disponível');
});

test('runPreflight: carrega internal_linking_plan (should_link_to / should_receive_links_from), reaproveitando internal-linking --simulate', () => {
  const siteIndex = {
    posts: [
      fakePost({ slug: 'coleira-gps-para-pet', title: 'Coleira GPS para Pet: Guia Completo', url_path: '/coleira-gps-para-pet/' }),
    ],
  };
  const proposal = buildProposal({ theme: 'Coleira GPS para Cachorro Idoso', keyword: 'coleira gps cachorro idoso' });
  const report = runPreflight(proposal, siteIndex);
  assert.ok(Array.isArray(report.internal_linking_plan.should_link_to));
  assert.ok(Array.isArray(report.internal_linking_plan.should_receive_links_from));
  assert.match(report.internal_linking_plan.method, /simulate/);
});

test('runPreflight: propaga differentiation_signals da canibalização (campo estrutural, não só o score)', () => {
  const posts = [fakePost({ slug: 'a', title: 'Comedouro Automático para Cachorro' })];
  const proposal = buildProposal({ theme: 'Comedouro Automático para Gato' });
  const report = runPreflight(proposal, { posts });
  // O campo deve existir em todo match (array, mesmo que vazio) — é isso
  // que "propagar a justificativa de diferenciação" significa aqui: o
  // Brief Builder (etapa 6) precisa poder ler esse campo sempre, sem
  // checar se existe.
  for (const m of report.cannibalization_preview.top_matches) {
    assert.ok(Array.isArray(m.differentiation_signals));
  }
});

test('runPreflight: relação pilar↔satélite real gera differentiation_signals não vazio', () => {
  const pillar = fakePost({ slug: 'coleira-gps-para-pet', title: 'Coleira GPS para Pet: Guia Completo' });
  const satellites = Array.from({ length: 21 }, (_, i) =>
    fakePost({
      slug: `satelite-${i}`,
      title: `Satélite ${i}`,
      internal_links: [{ href: '/coleira-gps-para-pet/', anchor_text: 'guia completo' }],
    })
  );
  const proposal = buildProposal({ theme: 'Coleira GPS para Cachorro Idoso: Como Escolher' });
  const report = runPreflight(proposal, { posts: [pillar, ...satellites] });
  const vsPillar = report.cannibalization_preview.top_matches.find((m) => m.slug === 'coleira-gps-para-pet');
  assert.ok(vsPillar);
  assert.ok(vsPillar.differentiation_signals.length > 0);
});

test('runPreflight: documenta suas próprias limitações explicitamente', () => {
  const siteIndex = { posts: [] };
  const proposal = buildProposal({ theme: 'Algo novo' });
  const report = runPreflight(proposal, siteIndex);
  assert.ok(report.limitations.length >= 2);
});

test('loadSiteIndex/loadProposal/writePreflightReport: fluxo de disco completo', () => {
  const root = makeRoot([fakePost({ slug: 'existente' })]);
  const proposal = buildProposal({ theme: 'Tema Novo de Teste' });
  writeProposal(root, proposal);

  const loadedProposal = loadProposal(root, proposal.slug);
  assert.equal(loadedProposal.slug, proposal.slug);

  const siteIndex = loadSiteIndex(root);
  assert.equal(siteIndex.posts.length, 1);

  const report = runPreflight(loadedProposal, siteIndex);
  const { filePath } = writePreflightReport(root, proposal.slug, report);
  assert.equal(
    filePath,
    path.join(root, '.data', 'pipeline', proposal.slug, 'preflight-report.json')
  );
  assert.ok(fs.existsSync(filePath));
});

test('loadSiteIndex: erro claro quando site-index.json não existe', () => {
  const root = fs.mkdtempSync(path.join(require('os').tmpdir(), 'orchestrator-empty-'));
  assert.throws(() => loadSiteIndex(root), /site-indexer/);
});

test('loadProposal: erro claro quando proposta não existe', () => {
  const root = makeRoot([]);
  assert.throws(() => loadProposal(root, 'nao-existe'), /Rode "propose" primeiro/);
});
