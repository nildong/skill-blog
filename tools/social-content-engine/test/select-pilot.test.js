'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { selectDiversifiedPilot, scoreSocialPotential, PILOT_SIZE, isProblemSolvingSlug } = require('../src/select-pilot');

function makePost(overrides) {
  return {
    path: `${overrides.slug}/index.html`,
    slug: overrides.slug,
    url_path: `/${overrides.slug}/`,
    page_type: 'post',
    title: overrides.title || overrides.slug,
    content: { word_count: overrides.word_count ?? 500 },
    images: overrides.images || [{ src: '/img/logo.png', alt: 'logo' }],
    faq: overrides.faq || { question_count: 0 },
    ...overrides,
  };
}

test('isProblemSolvingSlug detecta prefixos erros-comuns/duvidas', () => {
  assert.equal(isProblemSolvingSlug('erros-comuns-camera-monitorar-pet'), true);
  assert.equal(isProblemSolvingSlug('duvidas-coleira-gps-pet'), true);
  assert.equal(isProblemSolvingSlug('comedouro-cachorro'), false);
});

test('scoreSocialPotential NÃO deixa monetização dominar: afiliado sozinho nunca supera engajamento+interesse+compartilhamento de outro candidato', () => {
  const contentStrategy = {
    pages: [
      { url: '/so-afiliado/', cluster: 'comedouro-automatico-para-pet', cluster_confidence: 'known', role: 'SATELLITE', inbound_links: 0 },
      { url: '/engajamento-forte/', cluster: null, cluster_confidence: 'unknown', role: 'COMPARISON', inbound_links: 12 },
    ],
  };
  const affiliateProducts = { products: [{ id: 'X', name: 'Produto X', cluster: 'comedouro-automatico-para-pet', active: true }] };

  const soAfiliado = scoreSocialPotential(
    makePost({ slug: 'so-afiliado', word_count: 300, faq: { question_count: 0 } }),
    { contentStrategy, affiliateProducts }
  );
  const engajamentoForte = scoreSocialPotential(
    makePost({ slug: 'engajamento-forte', word_count: 900, images: [{ src: '/img/a.jpg' }, { src: '/img/b.jpg' }], faq: { question_count: 3 } }),
    { contentStrategy, affiliateProducts: null }
  );

  assert.ok(engajamentoForte.score > soAfiliado.score, `esperado engajamento (${engajamentoForte.score}) > só-afiliado (${soAfiliado.score})`);
  assert.equal(soAfiliado.score_breakdown.monetizationPotential, 8);
  assert.ok(soAfiliado.score_breakdown.monetizationPotential < engajamentoForte.score_breakdown.engagementPotential + engajamentoForte.score_breakdown.interestPotential);
});

test('scoreSocialPotential nunca casa produto de cluster=null com artigo de cluster=null (regressão mantida)', () => {
  const contentStrategy = { pages: [{ url: '/artigo/', cluster: null, cluster_confidence: 'unknown', role: 'REVIEW' }] };
  const affiliateProducts = { products: [{ id: 'Z', name: 'Produto não classificado', cluster: null, active: true }] };
  const result = scoreSocialPotential(makePost({ slug: 'artigo' }), { contentStrategy, affiliateProducts });
  assert.equal(result.affiliate_products.length, 0);
  assert.equal(result.score_breakdown.monetizationPotential, 0);
});

test('selectDiversifiedPilot nunca inclui páginas institucionais', () => {
  const siteIndex = {
    posts: [
      makePost({ slug: 'sobre', page_type: 'institutional', word_count: 200 }),
      makePost({ slug: 'produto-a', word_count: 900, images: [{ src: '/img/x.jpg' }] }),
    ],
  };
  const { selected } = selectDiversifiedPilot({ siteIndex, contentStrategy: null, affiliateProducts: null }, 1);
  assert.ok(!selected.some((s) => s.slug === 'sobre'));
});

test('selectDiversifiedPilot é determinístico: mesma entrada produz a mesma seleção e ordem', () => {
  const posts = Array.from({ length: 20 }, (_, i) => makePost({ slug: `artigo-${i}`, word_count: 300 + i * 10, images: [{ src: `/img/${i}.jpg` }] }));
  const siteIndex = { posts };
  const run1 = selectDiversifiedPilot({ siteIndex, contentStrategy: null, affiliateProducts: null }, PILOT_SIZE);
  const run2 = selectDiversifiedPilot({ siteIndex, contentStrategy: null, affiliateProducts: null }, PILOT_SIZE);
  assert.deepEqual(run1.selected.map((s) => s.slug), run2.selected.map((s) => s.slug));
});

test('selectDiversifiedPilot respeita as cotas por cluster quando há candidatos suficientes em cada grupo', () => {
  const clusters = [
    ['comedouro-automatico-para-pet', 4],
    ['coleira-gps-para-pet', 3],
    ['camera-para-monitorar-pet', 3],
    ['porta-eletronica-automatica-para-pet', 2],
  ];
  const pages = [];
  const posts = [];
  clusters.forEach(([cluster, count]) => {
    for (let i = 0; i < count; i++) {
      const slug = `${cluster}-art-${i}`;
      pages.push({ url: `/${slug}/`, cluster, cluster_confidence: 'known', role: 'REVIEW', inbound_links: 5 });
      posts.push(makePost({ slug, word_count: 800, images: [{ src: '/img/x.jpg' }] }));
    }
  });
  // 2 candidatos de cluster unknown para preencher o grupo "cachorro-higiene-acessorios"
  ['sem-cluster-1', 'sem-cluster-2'].forEach((slug) => {
    pages.push({ url: `/${slug}/`, cluster: null, cluster_confidence: 'unknown', role: 'REVIEW', inbound_links: 2 });
    posts.push(makePost({ slug, word_count: 800, images: [{ src: '/img/x.jpg' }] }));
  });

  const contentStrategy = { pages };
  const siteIndex = { posts };

  const { selected, diversity_report, fillers_used } = selectDiversifiedPilot({ siteIndex, contentStrategy, affiliateProducts: null }, 10);

  assert.equal(selected.length, 10);
  assert.equal(fillers_used, 0);
  const byGroup = diversity_report.reduce((acc, g) => ({ ...acc, [g.label]: g.filled }), {});
  assert.equal(byGroup['comedouros'], 3);
  assert.equal(byGroup['coleira-gps'], 2);
  assert.equal(byGroup['camera-monitoramento'], 2);
  assert.equal(byGroup['cachorro-higiene-acessorios (substituto: cluster unknown)'], 2);
  assert.equal(byGroup['outros-clusters'], 1);
});

test('selectDiversifiedPilot documenta déficit e preenche fora de cota quando um grupo não tem candidatos suficientes', () => {
  // Só existe cluster de comedouros — nenhum candidato para os outros 4 grupos.
  const pages = Array.from({ length: 10 }, (_, i) => ({
    url: `/comedouro-art-${i}/`,
    cluster: 'comedouro-automatico-para-pet',
    cluster_confidence: 'known',
    role: 'REVIEW',
    inbound_links: 5,
  }));
  const posts = pages.map((p, i) => makePost({ slug: `comedouro-art-${i}`, word_count: 800, images: [{ src: '/img/x.jpg' }] }));
  const contentStrategy = { pages };
  const siteIndex = { posts };

  const { selected, diversity_report, fillers_used } = selectDiversifiedPilot({ siteIndex, contentStrategy, affiliateProducts: null }, 10);

  assert.equal(selected.length, 10);
  assert.ok(fillers_used > 0);
  const coleira = diversity_report.find((g) => g.label === 'coleira-gps');
  assert.equal(coleira.met, false);
  assert.ok(coleira.shortfall_reason);
});

test('selectDiversifiedPilot nunca inventa um cluster para preencher cota — grupo fica com 0 se não houver candidato real', () => {
  const siteIndex = { posts: [makePost({ slug: 'unico', word_count: 900, images: [{ src: '/img/a.jpg' }] })] };
  const { diversity_report } = selectDiversifiedPilot({ siteIndex, contentStrategy: null, affiliateProducts: null }, 10);
  const coleira = diversity_report.find((g) => g.label === 'coleira-gps');
  assert.equal(coleira.filled, 0);
  assert.deepEqual(coleira.picked, []);
});
