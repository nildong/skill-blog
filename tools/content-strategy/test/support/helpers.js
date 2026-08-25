'use strict';

function makePost(overrides = {}) {
  const slug = overrides.slug || 'exemplo';
  return {
    path: `${slug}/index.html`,
    slug,
    url_path: `/${slug}/`,
    page_type: 'post',
    title: 'Título de Exemplo',
    meta_description: 'Uma descrição de exemplo.',
    canonical: `https://smartpetgadgets.com.br/${slug}/`,
    robots: null,
    headings: [{ tag: 'h1', text: 'Título', empty: false }],
    heading_summary: { total: 3, h1_count: 1, h2_count: 3, h3_count: 0, h4_count: 0 },
    structural_warnings: [],
    content: { word_count: 800 },
    internal_links: [],
    internal_link_count: 3,
    external_links: [],
    external_link_count: 0,
    images: [],
    image_count: 2,
    images_missing_alt: 0,
    video_count: 0,
    has_video: false,
    schema_types: ['BlogPosting'],
    schema_count: 1,
    faq: { detected: false, schema_detected: false, heading_detected: false, question_count: 0 },
    cluster: null,
    ...overrides,
  };
}

function makeSeoPage(post, { status = 'pass', issues = [] } = {}) {
  return { path: post.path, url: post.url_path, slug: post.slug, page_type: post.page_type, title: post.title, status, issues };
}

function makeIssue({ id, category = 'content', severity = 'INFO', evidence = 'evidência de teste', recommendation = 'recomendação de teste' }) {
  return { id, category, severity, evidence, recommendation };
}

function makeSuggestion(overrides = {}) {
  return {
    source: '/origem/',
    source_slug: 'origem',
    target: '/destino/',
    target_slug: 'destino',
    score: 50,
    score_breakdown: {},
    anchor: 'Anchor de teste',
    reason: 'motivo de teste',
    evidence: [],
    target_is_orphan: false,
    relationship: 'different_format',
    ...overrides,
  };
}

function makePair(overrides = {}) {
  return {
    page_a: '/pagina-a/',
    page_a_title: 'Página A',
    page_b: '/pagina-b/',
    page_b_title: 'Página B',
    score: 50,
    level: 'possible',
    format_a: 'review',
    format_b: 'review',
    relationship: 'same_format',
    signals: ['sinal de teste'],
    differentiation_signals: [],
    explanation: 'explicação de teste',
    recommendation: 'Avaliar manualmente.',
    ...overrides,
  };
}

module.exports = { makePost, makeSeoPage, makeIssue, makeSuggestion, makePair };
