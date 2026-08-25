'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { makePage } = require('./support/helpers');
const { buildContext } = require('../src/auditor');

const { checkMetadata } = require('../src/checks/metadata');
const { checkHeadings } = require('../src/checks/headings');
const { checkContent } = require('../src/checks/content');
const { checkLinks } = require('../src/checks/links');
const { checkImages } = require('../src/checks/images');
const { checkSchema } = require('../src/checks/schema');
const { checkFaq } = require('../src/checks/faq');
const { checkMedia } = require('../src/checks/media');

function ctxFor(pages) {
  return buildContext(pages);
}
function ids(issues) {
  return issues.map((i) => i.id);
}

// --------------------------------------------------------------------- metadata

test('metadata: title ausente gera TITLE_MISSING', () => {
  const p = makePage({ title: null });
  const issues = checkMetadata(p, ctxFor([p]));
  assert.ok(ids(issues).includes('TITLE_MISSING'));
});

test('metadata: title duplicado entre duas páginas gera TITLE_DUPLICATE em ambas', () => {
  const a = makePage({ slug: 'a', url_path: '/a/', title: 'Mesmo Título Aqui' });
  const b = makePage({ slug: 'b', url_path: '/b/', title: 'Mesmo Título Aqui' });
  const context = ctxFor([a, b]);
  assert.ok(ids(checkMetadata(a, context)).includes('TITLE_DUPLICATE'));
  assert.ok(ids(checkMetadata(b, context)).includes('TITLE_DUPLICATE'));
});

test('metadata: meta description ausente gera DESCRIPTION_MISSING', () => {
  const p = makePage({ meta_description: null });
  const issues = checkMetadata(p, ctxFor([p]));
  assert.ok(ids(issues).includes('DESCRIPTION_MISSING'));
});

test('metadata: meta description duplicada entre páginas gera DESCRIPTION_DUPLICATE', () => {
  const a = makePage({ slug: 'a', url_path: '/a/', meta_description: 'Descrição idêntica repetida em duas páginas do site.' });
  const b = makePage({ slug: 'b', url_path: '/b/', meta_description: 'Descrição idêntica repetida em duas páginas do site.' });
  const context = ctxFor([a, b]);
  assert.ok(ids(checkMetadata(a, context)).includes('DESCRIPTION_DUPLICATE'));
});

test('metadata: canonical ausente gera CANONICAL_MISSING', () => {
  const p = makePage({ canonical: null });
  const issues = checkMetadata(p, ctxFor([p]));
  assert.ok(ids(issues).includes('CANONICAL_MISSING'));
});

test('metadata: canonical divergente da própria URL gera CANONICAL_MISMATCH', () => {
  const p = makePage({ url_path: '/exemplo/', canonical: 'https://smartpetgadgets.com.br/outra-pagina/' });
  const issues = checkMetadata(p, ctxFor([p]));
  assert.ok(ids(issues).includes('CANONICAL_MISMATCH'));
});

test('metadata: página sem problemas não gera issues de metadata', () => {
  const p = makePage();
  const issues = checkMetadata(p, ctxFor([p]));
  assert.deepEqual(issues, []);
});

// --------------------------------------------------------------------- headings

test('headings: H1 ausente gera H1_MISSING (ERROR)', () => {
  const p = makePage({ structural_warnings: ['no_h1'] });
  const issues = checkHeadings(p);
  const issue = issues.find((i) => i.id === 'H1_MISSING');
  assert.ok(issue);
  assert.equal(issue.severity, 'ERROR');
});

test('headings: múltiplos H1 gera H1_MULTIPLE (WARNING)', () => {
  const p = makePage({ structural_warnings: ['multiple_h1'], heading_summary: { total: 6, h1_count: 2, h2_count: 3, h3_count: 1, h4_count: 0 } });
  const issues = checkHeadings(p);
  const issue = issues.find((i) => i.id === 'H1_MULTIPLE');
  assert.ok(issue);
  assert.equal(issue.severity, 'WARNING');
});

test('headings: estrutura rasa (<=2 H2) em post gera INFO de oportunidade', () => {
  const p = makePage({ heading_summary: { total: 3, h1_count: 1, h2_count: 2, h3_count: 0, h4_count: 0 } });
  const issues = checkHeadings(p);
  const issue = issues.find((i) => i.id === 'HEADING_STRUCTURE_THIN');
  assert.ok(issue);
  assert.equal(issue.severity, 'INFO');
});

test('headings: página institucional com poucos H2 não gera HEADING_STRUCTURE_THIN', () => {
  const p = makePage({ page_type: 'institutional', heading_summary: { total: 2, h1_count: 1, h2_count: 1, h3_count: 0, h4_count: 0 } });
  const issues = checkHeadings(p);
  assert.ok(!ids(issues).includes('HEADING_STRUCTURE_THIN'));
});

// --------------------------------------------------------------------- content

test('content: página vazia (0 palavras) gera CONTENT_MISSING (CRITICAL)', () => {
  const p = makePage({ content: { word_count: 0, char_count: 0, paragraph_count: 0, list_count: 0, table_count: 0, blockquote_count: 0, method: 't' } });
  const issues = checkContent(p);
  const issue = issues.find((i) => i.id === 'CONTENT_MISSING');
  assert.ok(issue);
  assert.equal(issue.severity, 'CRITICAL');
});

function contentWith(words, overrides = {}) {
  return makePage({
    content: { word_count: words, char_count: words * 6, paragraph_count: 5, list_count: 0, table_count: 0, blockquote_count: 0, method: 't' },
    ...overrides,
  });
}

test('content: post com poucas palavras gera CONTENT_EXTREMELY_SHORT (ERROR)', () => {
  const p = contentWith(50);
  const issues = checkContent(p);
  const issue = issues.find((i) => i.id === 'CONTENT_EXTREMELY_SHORT');
  assert.ok(issue);
  assert.equal(issue.severity, 'ERROR');
});

test('content: página institucional curta não é penalizada', () => {
  const p = contentWith(80, { page_type: 'institutional' });
  const issues = checkContent(p);
  assert.deepEqual(issues, []);
});

// Faixas exatas da regra de 3 níveis (ver rules.js THRESHOLDS e checks/content.js)
test('content: 149 palavras -> CONTENT_EXTREMELY_SHORT (ERROR)', () => {
  const issues = checkContent(contentWith(149));
  assert.equal(issues.length, 1);
  assert.equal(issues[0].id, 'CONTENT_EXTREMELY_SHORT');
  assert.equal(issues[0].severity, 'ERROR');
});

test('content: 150 palavras -> CONTENT_SHORT (WARNING)', () => {
  const issues = checkContent(contentWith(150));
  assert.equal(issues.length, 1);
  assert.equal(issues[0].id, 'CONTENT_SHORT');
  assert.equal(issues[0].severity, 'WARNING');
});

test('content: 299 palavras -> CONTENT_SHORT (WARNING)', () => {
  const issues = checkContent(contentWith(299));
  assert.equal(issues.length, 1);
  assert.equal(issues[0].id, 'CONTENT_SHORT');
  assert.equal(issues[0].severity, 'WARNING');
});

test('content: 300 palavras -> CONTENT_BRIEF (INFO)', () => {
  const issues = checkContent(contentWith(300));
  assert.equal(issues.length, 1);
  assert.equal(issues[0].id, 'CONTENT_BRIEF');
  assert.equal(issues[0].severity, 'INFO');
});

test('content: 399 palavras -> CONTENT_BRIEF (INFO)', () => {
  const issues = checkContent(contentWith(399));
  assert.equal(issues.length, 1);
  assert.equal(issues[0].id, 'CONTENT_BRIEF');
  assert.equal(issues[0].severity, 'INFO');
});

test('content: 400 palavras -> nenhum issue de comprimento', () => {
  const issues = checkContent(contentWith(400));
  assert.deepEqual(issues, []);
});

test('content: post com 380 palavras e 4 H2 -> CONTENT_BRIEF (INFO), h2_count não é considerado pela regra', () => {
  const p = contentWith(380, { heading_summary: { total: 5, h1_count: 1, h2_count: 4, h3_count: 0, h4_count: 0 } });
  const issues = checkContent(p);
  assert.equal(issues.length, 1);
  assert.equal(issues[0].id, 'CONTENT_BRIEF');
  assert.equal(issues[0].severity, 'INFO');
});

test('content: página institucional com 200 palavras -> nenhum issue de comprimento', () => {
  const p = contentWith(200, { page_type: 'institutional' });
  assert.deepEqual(checkContent(p), []);
});

test('content: recomendação de CONTENT_SHORT/CONTENT_BRIEF não usa a frase "adicionar mais palavras"', () => {
  const short = checkContent(contentWith(200))[0];
  const brief = checkContent(contentWith(350))[0];
  assert.doesNotMatch(short.recommendation, /adicionar mais palavras/i);
  assert.doesNotMatch(brief.recommendation, /adicionar mais palavras/i);
});

// --------------------------------------------------------------------- links / orphan / broken

test('links: página sem links internos de saída gera NO_INTERNAL_LINKS', () => {
  const p = makePage({ internal_link_count: 0 });
  const context = ctxFor([p]);
  const issues = checkLinks(p, context);
  assert.ok(ids(issues).includes('NO_INTERNAL_LINKS'));
});

test('links: página órfã (0 inbound) gera ORPHAN_PAGE', () => {
  const home = makePage({ slug: null, url_path: '/', page_type: 'home', internal_links: [] });
  const a = makePage({ slug: 'a', url_path: '/a/', internal_links: [] }); // ninguém linka para /a/
  const context = ctxFor([home, a]);
  const issues = checkLinks(a, context);
  const issue = issues.find((i) => i.id === 'ORPHAN_PAGE');
  assert.ok(issue);
  assert.equal(issue.severity, 'ERROR');
});

test('links: página com link de entrada NÃO é órfã mesmo sem links de saída', () => {
  const a = makePage({ slug: 'a', url_path: '/a/', internal_links: [{ href: '/b/', anchor_text: 'b', type: 'relative' }], internal_link_count: 1 });
  const b = makePage({ slug: 'b', url_path: '/b/', internal_links: [], internal_link_count: 0 });
  const context = ctxFor([a, b]);
  const issuesB = checkLinks(b, context);
  assert.ok(!ids(issuesB).includes('ORPHAN_PAGE'));
});

test('links: href interno que não corresponde a nenhuma página gera BROKEN_INTERNAL_LINK', () => {
  const a = makePage({
    slug: 'a',
    url_path: '/a/',
    internal_links: [{ href: 'https://smartpetgadgets.com.br/pagina-que-nao-existe/', anchor_text: 'x', type: 'absolute' }],
    internal_link_count: 1,
  });
  const context = ctxFor([a]);
  const issues = checkLinks(a, context);
  const issue = issues.find((i) => i.id === 'BROKEN_INTERNAL_LINK');
  assert.ok(issue);
  assert.equal(issue.severity, 'ERROR');
});

test('links: home nunca é considerada órfã', () => {
  const home = makePage({ slug: null, url_path: '/', page_type: 'home' });
  const context = ctxFor([home]);
  const issues = checkLinks(home, context);
  assert.ok(!ids(issues).includes('ORPHAN_PAGE'));
});

// --------------------------------------------------------------------- images

test('images: imagem sem alt gera IMAGE_ALT_MISSING agregado', () => {
  const p = makePage({ image_count: 2, images_missing_alt: 1, images: [{ width: '10', height: '10' }, { width: '10', height: '10' }] });
  const issues = checkImages(p);
  const issue = issues.find((i) => i.id === 'IMAGE_ALT_MISSING');
  assert.ok(issue);
  assert.match(issue.evidence, /1 de 2/);
});

// --------------------------------------------------------------------- schema

test('schema: ausência de JSON-LD em post gera JSONLD_MISSING (WARNING)', () => {
  const p = makePage({ schema_count: 0, schema_types: [] });
  const issues = checkSchema(p);
  const issue = issues.find((i) => i.id === 'JSONLD_MISSING');
  assert.ok(issue);
  assert.equal(issue.severity, 'WARNING');
});

test('schema: JSON-LD inválido gera JSONLD_INVALID (ERROR)', () => {
  const p = makePage({ schema_invalid_count: 1 });
  const issues = checkSchema(p);
  const issue = issues.find((i) => i.id === 'JSONLD_INVALID');
  assert.ok(issue);
  assert.equal(issue.severity, 'ERROR');
});

// --------------------------------------------------------------------- faq

test('faq: FAQPage schema presente conta como ok, sem issues extras', () => {
  const p = makePage({ faq: { detected: true, schema_detected: true, heading_detected: true, question_count: 4 } });
  const issues = checkFaq(p);
  assert.deepEqual(issues, []);
});

test('faq: heading de FAQ sem schema gera FAQ_HEADING_WITHOUT_SCHEMA', () => {
  const p = makePage({ faq: { detected: true, schema_detected: false, heading_detected: true, question_count: 0 } });
  const issues = checkFaq(p);
  assert.ok(ids(issues).includes('FAQ_HEADING_WITHOUT_SCHEMA'));
});

test('faq: schema FAQPage sem perguntas gera FAQ_SCHEMA_EMPTY (ERROR)', () => {
  const p = makePage({ faq: { detected: true, schema_detected: true, heading_detected: false, question_count: 0 } });
  const issues = checkFaq(p);
  const issue = issues.find((i) => i.id === 'FAQ_SCHEMA_EMPTY');
  assert.ok(issue);
  assert.equal(issue.severity, 'ERROR');
});

test('faq: ausência total de FAQ em post gera apenas FAQ_OPPORTUNITY (INFO)', () => {
  const p = makePage({ faq: { detected: false, schema_detected: false, heading_detected: false, question_count: 0 } });
  const issues = checkFaq(p);
  assert.equal(issues.length, 1);
  assert.equal(issues[0].id, 'FAQ_OPPORTUNITY');
  assert.equal(issues[0].severity, 'INFO');
});

// --------------------------------------------------------------------- media (vídeo)

test('media: página sem vídeo não gera nenhum issue', () => {
  const p = makePage({ has_video: false });
  assert.deepEqual(checkMedia(p), []);
});

test('media: vídeo presente sem VideoObject gera VIDEO_WITHOUT_SCHEMA (INFO)', () => {
  const p = makePage({ has_video: true, video_count: 1, videos: [{ type: 'html5', url: 'x.mp4', id: null }], schema_types: ['BlogPosting'] });
  const issues = checkMedia(p);
  const issue = issues.find((i) => i.id === 'VIDEO_WITHOUT_SCHEMA');
  assert.ok(issue);
  assert.equal(issue.severity, 'INFO');
});
