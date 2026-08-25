'use strict';

/**
 * Fábrica de um "post" no formato produzido pelo Site Indexer
 * (tools/site-indexer), com defaults neutros (sem nenhum problema) para
 * que cada teste só precise sobrescrever o campo relevante ao caso.
 */
function makePage(overrides = {}) {
  const base = {
    path: 'exemplo/index.html',
    slug: 'exemplo',
    url_path: '/exemplo/',
    page_type: 'post',
    title: 'Título de Exemplo com Tamanho Razoável',
    meta_description: 'Uma meta description de exemplo com tamanho adequado para os thresholds definidos nas regras.',
    canonical: 'https://smartpetgadgets.com.br/exemplo/',
    robots: null,
    language: 'pt-BR',
    charset: 'UTF-8',
    headings: [{ tag: 'h1', text: 'Título', empty: false }],
    heading_summary: { total: 5, h1_count: 1, h2_count: 3, h3_count: 1, h4_count: 0 },
    structural_warnings: [],
    content: {
      word_count: 800,
      char_count: 5000,
      paragraph_count: 10,
      list_count: 1,
      table_count: 0,
      blockquote_count: 0,
      method: 'test',
    },
    internal_links: [],
    external_links: [],
    internal_link_count: 0,
    external_link_count: 0,
    images: [],
    image_count: 0,
    images_missing_alt: 0,
    images_empty_alt: 0,
    videos: [],
    video_count: 0,
    has_video: false,
    schemas: [{ valid: true, error: null, types: ['BlogPosting'], raw_length: 100 }],
    schema_types: ['BlogPosting'],
    schema_count: 1,
    schema_invalid_count: 0,
    faq: { detected: false, schema_detected: false, heading_detected: false, question_count: 0 },
    cluster: null,
    category: null,
    author: null,
    date_published: null,
    date_modified: null,
  };

  return { ...base, ...overrides };
}

module.exports = { makePage };
