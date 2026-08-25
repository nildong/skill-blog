'use strict';

const path = require('path');

/**
 * Deriva slug e URL relativa a partir do caminho relativo do arquivo
 * (ex: "comedouro-cachorro/index.html" -> slug "comedouro-cachorro",
 * url "/comedouro-cachorro/"). Não inventa domínio — a URL absoluta real
 * (quando existir) já vem do <link rel="canonical"> extraído pelo parser.
 */
function deriveIdentity(relPath) {
  const dir = path.posix.dirname(relPath.split(path.sep).join('/'));
  if (dir === '.') {
    return { slug: null, url_path: '/', page_type: 'home' };
  }

  const segments = dir.split('/');
  const slug = segments[segments.length - 1];
  const url_path = `/${dir}/`;

  let page_type = 'post';
  if (segments[0] === 'autores') page_type = 'author';
  else if (['sobre', 'contato', 'politica-editorial'].includes(segments[0])) page_type = 'institutional';

  return { slug, url_path, page_type, path_segments: segments };
}

/**
 * Registra problemas estruturais óbvios a partir dos headings extraídos.
 * Apenas registra — nunca corrige.
 */
function findStructuralWarnings(headings) {
  const warnings = [];
  const h1Count = headings.filter((h) => h.tag === 'h1').length;

  if (h1Count === 0) warnings.push('no_h1');
  if (h1Count > 1) warnings.push('multiple_h1');

  const firstH1Index = headings.findIndex((h) => h.tag === 'h1');
  const firstH2Index = headings.findIndex((h) => h.tag === 'h2');
  if (firstH2Index !== -1 && (firstH1Index === -1 || firstH2Index < firstH1Index)) {
    warnings.push('h2_before_h1');
  }

  if (headings.some((h) => h.empty)) warnings.push('empty_heading');

  return warnings;
}

/**
 * Combina os dados brutos do parser com a identidade do arquivo (caminho)
 * para produzir o registro final de um post no índice.
 */
function analyzePost(relPath, parsed) {
  const identity = deriveIdentity(relPath);
  const structural_warnings = findStructuralWarnings(parsed.headings);

  const h1_count = parsed.headings.filter((h) => h.tag === 'h1').length;

  return {
    path: relPath,
    slug: identity.slug,
    url_path: identity.url_path,
    page_type: identity.page_type,
    title: parsed.metadata.title,
    meta_description: parsed.metadata.meta_description,
    canonical: parsed.metadata.canonical,
    robots: parsed.metadata.robots,
    language: parsed.metadata.language,
    charset: parsed.metadata.charset,
    headings: parsed.headings,
    heading_summary: {
      total: parsed.headings.length,
      h1_count,
      h2_count: parsed.headings.filter((h) => h.tag === 'h2').length,
      h3_count: parsed.headings.filter((h) => h.tag === 'h3').length,
      h4_count: parsed.headings.filter((h) => h.tag === 'h4').length,
    },
    structural_warnings,
    content: parsed.content,
    internal_links: parsed.links.internal,
    external_links: parsed.links.external,
    internal_link_count: parsed.links.internal_count,
    external_link_count: parsed.links.external_count,
    images: parsed.images.items,
    image_count: parsed.images.count,
    images_missing_alt: parsed.images.missing_alt_count,
    images_empty_alt: parsed.images.empty_alt_count,
    videos: parsed.videos.items,
    video_count: parsed.videos.count,
    has_video: parsed.videos.has_video,
    schemas: parsed.schemas.items,
    schema_types: parsed.schemas.all_types,
    schema_count: parsed.schemas.count,
    schema_invalid_count: parsed.schemas.invalid_count,
    faq: parsed.faq,
    // Campos que exigiriam inferência não confiável a partir do HTML atual
    // (cluster, categoria, data de publicação/atualização) — não há
    // convenção uniforme no site hoje (ver auditoria, seção 6). Mantidos
    // como null explícito em vez de inventados.
    cluster: null,
    category: null,
    // O parser hoje só expõe os @type agregados do JSON-LD, não os campos
    // internos (author, datePublished etc.) de cada schema — extrair isso
    // exigiria um parser de schema mais rico, fora do escopo desta fase.
    // Mantido null explícito em vez de inventado; pode ser adicionado em
    // iteração futura sem quebrar o schema do índice.
    author: null,
    date_published: null,
    date_modified: null,
  };
}

/**
 * Agrega estatísticas de todos os posts + erros/warnings de varredura para
 * o relatório impresso no terminal e para o bloco "site" do JSON final.
 */
function aggregateSite(posts, scanWarnings, scanErrors) {
  const total = posts.length;
  const countWith = (pred) => posts.filter(pred).length;

  return {
    total_posts: total,
    metadata: {
      titles: countWith((p) => !!p.title),
      descriptions: countWith((p) => !!p.meta_description),
      canonical: countWith((p) => !!p.canonical),
    },
    structure: {
      h1_detected: countWith((p) => p.heading_summary.h1_count >= 1),
      multiple_h1: countWith((p) => p.structural_warnings.includes('multiple_h1')),
      no_h1: countWith((p) => p.structural_warnings.includes('no_h1')),
    },
    links: {
      internal_links: posts.reduce((sum, p) => sum + p.internal_link_count, 0),
      external_links: posts.reduce((sum, p) => sum + p.external_link_count, 0),
    },
    media: {
      images: posts.reduce((sum, p) => sum + p.image_count, 0),
      images_missing_alt: posts.reduce((sum, p) => sum + p.images_missing_alt, 0),
      videos: posts.reduce((sum, p) => sum + p.video_count, 0),
    },
    schema: {
      jsonld_posts: countWith((p) => p.schema_count > 0),
      faqpage_posts: countWith((p) => p.faq.schema_detected),
      posts_with_invalid_jsonld: countWith((p) => p.schema_invalid_count > 0),
    },
    warnings: scanWarnings.length,
    errors: scanErrors.length,
  };
}

module.exports = { deriveIdentity, findStructuralWarnings, analyzePost, aggregateSite };
