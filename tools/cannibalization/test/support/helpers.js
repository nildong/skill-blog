'use strict';

function makePage(overrides = {}) {
  const base = {
    path: 'exemplo/index.html',
    slug: 'exemplo',
    url_path: '/exemplo/',
    page_type: 'post',
    title: 'Título de Exemplo',
    cluster: null,
    headings: [{ tag: 'h1', text: 'Título de Exemplo', empty: false }],
    internal_links: [],
    internal_link_count: 0,
    faq: { detected: false, schema_detected: false, heading_detected: false, question_count: 0 },
    content: { word_count: 500 },
    heading_summary: { h2_count: 1 },
  };
  return { ...base, ...overrides };
}

module.exports = { makePage };
