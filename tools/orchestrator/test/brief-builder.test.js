'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { buildProposal, writeProposal } = require('../src/propose');
const { runPreflight, writePreflightReport } = require('../src/preflight');
const { buildBrief, loadPreflightReport, writeBrief, NAO_DISPONIVEL } = require('../src/brief-builder');
const { makeRoot, fakePost } = require('./support/helpers');

test('buildBrief: exige slug em proposal e preflight, e que os dois batam', () => {
  assert.throws(() => buildBrief({}, {}), /falta slug/);
  assert.throws(() => buildBrief({ slug: 'a' }, {}), /falta proposal_slug/);
  assert.throws(
    () => buildBrief({ slug: 'a' }, { proposal_slug: 'b' }),
    /não bate com preflight\.proposal_slug/
  );
});

function runFullPipeline(theme, posts, opts = {}) {
  const proposal = buildProposal({ theme, ...opts });
  const preflight = runPreflight(proposal, { posts });
  return { proposal, preflight };
}

test('buildBrief: nunca inventa dado de keyword research (propaga "não disponível")', () => {
  const { proposal, preflight } = runFullPipeline('Comedouro Automático para Dois Gatos', []);
  const md = buildBrief(proposal, preflight);
  assert.match(md, /Search volume: não disponível/);
  assert.match(md, /Keyword difficulty: não disponível/);
  assert.match(md, /CPC: não disponível/);
});

test('buildBrief: nunca inventa title/H1/meta description/outline (etapa fora do escopo do preflight)', () => {
  const { proposal, preflight } = runFullPipeline('Comedouro Automático para Dois Gatos', []);
  const md = buildBrief(proposal, preflight);
  assert.match(md, new RegExp(`Title: ${NAO_DISPONIVEL}`));
  assert.match(md, new RegExp(`H1: ${NAO_DISPONIVEL}`));
  assert.match(md, new RegExp(`Meta description: ${NAO_DISPONIVEL}`));
});

test('buildBrief: carrega risco de canibalização e páginas relacionadas (não some com a decisão do preflight)', () => {
  const posts = [
    fakePost({
      slug: 'comedouro-newpet-4l-review',
      title: 'Comedouro Newpet 4L: Review Completo (Vale a Pena?)',
    }),
  ];
  const { proposal, preflight } = runFullPipeline('Comedouro Newpet 4L: Review Completo e Vale a Pena', posts);
  const md = buildBrief(proposal, preflight);
  assert.match(md, /Risco: \*\*(MEDIUM|HIGH)\*\*/);
  assert.match(md, /comedouro-newpet-4l-review|Comedouro Newpet 4L/);
});

test('buildBrief: risco HIGH aparece com aviso de bloqueio explícito, não escondido', () => {
  // Constrói um preflight sintético com worst_level HIGH para testar a
  // renderização do aviso, sem depender de conseguir provocar HIGH real
  // via heurística de texto (mais estável para o teste).
  const proposal = buildProposal({ theme: 'Tema X' });
  const preflight = {
    proposal_slug: proposal.slug,
    intent: { primary_intent: 'informational', funnel_stage: 'tofu', recommended_type: 'informational', confidence: 'LOW', matched_rules: [], rationale: 'x', keyword_research: {} },
    cluster_check: { cluster_candidate: null, known: false, is_pillar: false, note: 'x' },
    cannibalization_preview: { worst_level: 'HIGH', gate_recommendation: 'BLOCK_UNTIL_RESOLVED', top_matches: [], method: 'x' },
    internal_linking_plan: { should_link_to: [], should_receive_links_from: [], method: 'x' },
    limitations: [],
  };
  const md = buildBrief(proposal, preflight);
  assert.match(md, /BLOQUEIO/);
  assert.match(md, /BLOCK_UNTIL_RESOLVED/);
});

test('buildBrief: NUNCA rebaixa silenciosamente um nível de canibalização (transformador, não novo mecanismo de SEO)', () => {
  const proposal = buildProposal({ theme: 'Tema X' });
  const preflightHigh = {
    proposal_slug: proposal.slug,
    intent: { primary_intent: 'informational', funnel_stage: 'tofu', recommended_type: 'informational', confidence: 'LOW', matched_rules: [], rationale: 'x', keyword_research: {} },
    cluster_check: { cluster_candidate: null, known: false, is_pillar: false, note: 'x' },
    cannibalization_preview: { worst_level: 'HIGH', gate_recommendation: 'BLOCK_UNTIL_RESOLVED', top_matches: [{ slug: 'y', url: '/y/', title: 'Y', score: 90, level: 'HIGH', relationship: 'same_format', differentiation_signals: [] }], method: 'x' },
    internal_linking_plan: { should_link_to: [], should_receive_links_from: [], method: 'x' },
    limitations: [],
  };
  const md = buildBrief(proposal, preflightHigh);
  assert.match(md, /\*\*HIGH\*\*/);
  assert.doesNotMatch(md, /\*\*LOW\*\*/);
});

test('buildBrief: carrega plano de internal linking com direção, anchor e motivo', () => {
  const preflight = {
    proposal_slug: 'x',
    intent: { primary_intent: 'informational', funnel_stage: 'tofu', recommended_type: 'informational', confidence: 'LOW', matched_rules: [], rationale: 'x', keyword_research: {} },
    cluster_check: { cluster_candidate: null, known: false, is_pillar: false, note: 'x' },
    cannibalization_preview: { worst_level: 'LOW', gate_recommendation: 'PROCEED', top_matches: [], method: 'x' },
    internal_linking_plan: {
      method: 'simulate: x',
      should_link_to: [{ target: '/destino/', anchor: 'anchor destino', reason: 'motivo destino', score: 50, relationship: 'different_format' }],
      should_receive_links_from: [{ source: '/origem/', anchor: 'anchor origem', reason: 'motivo origem', score: 45, relationship: 'different_format' }],
    },
    limitations: [],
  };
  const md = buildBrief({ slug: 'x', theme: 'X' }, preflight);
  assert.match(md, /Destino.*\/destino\//s);
  assert.match(md, /anchor destino/);
  assert.match(md, /motivo destino/);
  assert.match(md, /Origem.*\/origem\//s);
  assert.match(md, /anchor origem/);
  assert.match(md, /motivo origem/);
});

test('buildBrief: sem sugestões de linking, mostra "não disponível" em vez de lista vazia silenciosa', () => {
  const preflight = {
    proposal_slug: 'x',
    intent: { primary_intent: 'informational', funnel_stage: 'tofu', recommended_type: 'informational', confidence: 'LOW', matched_rules: [], rationale: 'x', keyword_research: {} },
    cluster_check: { cluster_candidate: null, known: false, is_pillar: false, note: 'x' },
    cannibalization_preview: { worst_level: 'LOW', gate_recommendation: 'PROCEED', top_matches: [], method: 'x' },
    internal_linking_plan: { should_link_to: [], should_receive_links_from: [], method: 'x' },
    limitations: [],
  };
  const md = buildBrief({ slug: 'x', theme: 'X' }, preflight);
  assert.match(md, /não disponível — nenhuma sugestão encontrada/);
});

test('buildBrief: schema recomendado deriva do recommended_type já calculado, não de uma nova decisão', () => {
  const preflight = {
    proposal_slug: 'x',
    intent: { primary_intent: 'informational', funnel_stage: 'tofu', recommended_type: 'faq', confidence: 'HIGH', matched_rules: ['FAQ'], rationale: 'x', keyword_research: {} },
    cluster_check: { cluster_candidate: null, known: false, is_pillar: false, note: 'x' },
    cannibalization_preview: { worst_level: 'LOW', gate_recommendation: 'PROCEED', top_matches: [], method: 'x' },
    internal_linking_plan: { should_link_to: [], should_receive_links_from: [], method: 'x' },
    limitations: [],
  };
  const md = buildBrief({ slug: 'x', theme: 'X' }, preflight);
  assert.match(md, /FAQPage/);
});

test('buildBrief: inclui regras editoriais fixas contra invenção de dado/experiência', () => {
  const { proposal, preflight } = runFullPipeline('Tema qualquer', []);
  const md = buildBrief(proposal, preflight);
  assert.match(md, /Não inventar experiência pessoal/);
  assert.match(md, /Não inventar testes, avaliações, notas/);
  assert.match(md, /Não inventar preços/);
  assert.match(md, /keyword stuffing/);
});

test('fluxo de disco completo: propose -> preflight -> brief', () => {
  const root = makeRoot([fakePost({ slug: 'existente' })]);
  const proposal = buildProposal({ theme: 'Tema Novo de Teste' });
  writeProposal(root, proposal);

  const siteIndex = JSON.parse(fs.readFileSync(path.join(root, '.data', 'site-index.json'), 'utf8'));
  const preflight = runPreflight(proposal, siteIndex);
  writePreflightReport(root, proposal.slug, preflight);

  const loadedPreflight = loadPreflightReport(root, proposal.slug);
  const md = buildBrief(proposal, loadedPreflight);
  const { filePath } = writeBrief(root, proposal.slug, md);

  assert.equal(filePath, path.join(root, '.data', 'pipeline', proposal.slug, 'article-brief.md'));
  assert.ok(fs.existsSync(filePath));
  assert.match(fs.readFileSync(filePath, 'utf8'), /# Article Brief/);
});

test('loadPreflightReport: erro claro quando preflight-report não existe', () => {
  const root = makeRoot([]);
  assert.throws(() => loadPreflightReport(root, 'nao-existe'), /Rode "preflight" primeiro/);
});
