'use strict';

const fs = require('fs');
const cheerio = require('cheerio');

// Domínio de produção conhecido (confirmado em robots.txt, sitemap.xml e
// canonical tags — ver V2-ARCHITECTURE-AUDIT.md). Usado apenas para
// classificar links como internos/externos; nunca usado para inventar URLs.
const SITE_DOMAIN = 'smartpetgadgets.com.br';

const CONTENT_EXCLUDE_TAGS = new Set(['script', 'style', 'noscript', 'nav', 'header', 'footer', 'svg']);

/**
 * Lê um arquivo HTML do disco e delega o parsing a parseHtmlContent.
 * Lança erro se o arquivo não existir ou não puder ser lido — quem chama
 * (index.js) decide como tratar isso por post (registrar erro e continuar).
 */
function parseFile(absPath) {
  const raw = fs.readFileSync(absPath, 'utf8');
  return parseHtmlContent(raw);
}

/**
 * Parsing puro (sem tocar no filesystem) — testável isoladamente com string.
 * Retorna um objeto de dados brutos extraídos do HTML; a interpretação
 * (warnings, slug, url, page_type) fica no analyzer.js.
 */
function parseHtmlContent(html) {
  const $ = cheerio.load(html, { xmlMode: false });

  return {
    metadata: extractMetadata($),
    headings: extractHeadings($),
    content: extractContentStats($),
    links: extractLinks($),
    images: extractImages($),
    videos: extractVideos($),
    schemas: extractSchemas($),
    faq: extractFaq($),
  };
}

function textOrNull($el) {
  if (!$el || $el.length === 0) return null;
  const t = $el.first().text().trim();
  return t.length > 0 ? t : null;
}

function attrOrNull($el, attr) {
  if (!$el || $el.length === 0) return null;
  const v = $el.first().attr(attr);
  return v === undefined ? null : v;
}

function extractMetadata($) {
  const charset =
    attrOrNull($('meta[charset]'), 'charset') ||
    (() => {
      const httpEquiv = $('meta[http-equiv="Content-Type"]').attr('content');
      if (!httpEquiv) return null;
      const m = /charset=([^;]+)/i.exec(httpEquiv);
      return m ? m[1].trim() : null;
    })();

  return {
    title: textOrNull($('title')),
    meta_description: attrOrNull($('meta[name="description"]'), 'content'),
    canonical: attrOrNull($('link[rel="canonical"]'), 'href'),
    robots: attrOrNull($('meta[name="robots"]'), 'content'),
    language: attrOrNull($('html'), 'lang'),
    charset,
  };
}

function extractHeadings($) {
  const headings = [];
  $('h1, h2, h3, h4').each((_, el) => {
    const tag = el.tagName ? el.tagName.toLowerCase() : el.name;
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    headings.push({ tag, text, empty: text.length === 0 });
  });
  return headings;
}

function extractContentStats($) {
  const $body = $('body').length ? $('body').clone() : $.root().clone();
  $body.find([...CONTENT_EXCLUDE_TAGS].join(',')).remove();

  const text = $body.text().replace(/\s+/g, ' ').trim();
  const words = text.length > 0 ? text.split(' ').filter(Boolean) : [];

  // Parágrafos/listas/tabelas/citações contados no documento inteiro menos
  // as tags excluídas acima (mesmo clone), para não contar nav/header/footer.
  const paragraph_count = $body.find('p').filter((_, el) => $(el).text().trim().length > 0).length;
  const list_count = $body.find('ul, ol').length;
  const table_count = $body.find('table').length;
  const blockquote_count = $body.find('blockquote').length;

  return {
    word_count: words.length,
    char_count: text.length,
    paragraph_count,
    list_count,
    table_count,
    blockquote_count,
    // Documenta o método usado, para quem consumir o índice entender o que
    // está (e o que não está) sendo contado.
    method: 'texto de <body> após remover script/style/noscript/nav/header/svg; palavras = split por espaço em branco',
  };
}

function classifyLink(href) {
  if (!href) return 'other';
  const trimmed = href.trim();
  if (trimmed.startsWith('#')) return 'anchor';
  if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:') || trimmed.startsWith('javascript:')) return 'other';
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      const host = url.hostname.replace(/^www\./, '');
      return host === SITE_DOMAIN ? 'internal-absolute' : 'external';
    } catch {
      return 'other';
    }
  }
  // Sem esquema: relativo ("./x", "x/", "/x") — sempre interno.
  return 'internal-relative';
}

function extractLinks($) {
  const internal = [];
  const external = [];

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    const anchorText = $(el).text().replace(/\s+/g, ' ').trim();
    const kind = classifyLink(href);

    if (kind === 'internal-absolute' || kind === 'internal-relative') {
      internal.push({
        href,
        anchor_text: anchorText,
        type: kind === 'internal-absolute' ? 'absolute' : 'relative',
      });
    } else if (kind === 'external') {
      let domain = null;
      try {
        domain = new URL(href).hostname.replace(/^www\./, '');
      } catch {
        /* já classificado como external só se new URL funcionou antes */
      }
      external.push({ href, anchor_text: anchorText, domain });
    }
    // 'anchor' e 'other' (mailto/tel/javascript) não entram nas contagens
    // de link interno/externo, mas não geram erro — são links válidos de
    // outra natureza.
  });

  return {
    internal,
    external,
    internal_count: internal.length,
    external_count: external.length,
  };
}

const IMAGE_EXT_RE = /\.([a-z0-9]+)(?:[?#].*)?$/i;

function extractImages($) {
  const images = [];
  $('img').each((_, el) => {
    const $el = $(el);
    const src = $el.attr('src') || null;
    const alt = $el.attr('alt');
    const hasAlt = alt !== undefined;
    const altEmpty = hasAlt && alt.trim().length === 0;
    const extMatch = src ? IMAGE_EXT_RE.exec(src) : null;

    images.push({
      src,
      alt: hasAlt ? alt : null,
      alt_missing: !hasAlt,
      alt_empty: altEmpty,
      title: $el.attr('title') || null,
      width: $el.attr('width') || null,
      height: $el.attr('height') || null,
      loading: $el.attr('loading') || null,
      format: extMatch ? extMatch[1].toLowerCase() : null,
    });
  });

  return {
    items: images,
    count: images.length,
    missing_alt_count: images.filter((i) => i.alt_missing).length,
    empty_alt_count: images.filter((i) => i.alt_empty).length,
  };
}

function extractYoutubeId(src) {
  if (!src) return null;
  const patterns = [/(?:embed\/|v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/];
  for (const re of patterns) {
    const m = re.exec(src);
    if (m) return m[1];
  }
  return null;
}

function extractVimeoId(src) {
  if (!src) return null;
  const m = /vimeo\.com\/(?:video\/)?(\d+)/.exec(src);
  return m ? m[1] : null;
}

function extractVideos($) {
  const videos = [];

  $('iframe[src]').each((_, el) => {
    const src = $(el).attr('src');
    if (/youtube\.com|youtu\.be/i.test(src)) {
      videos.push({ type: 'youtube', url: src, id: extractYoutubeId(src) });
    } else if (/vimeo\.com/i.test(src)) {
      videos.push({ type: 'vimeo', url: src, id: extractVimeoId(src) });
    } else {
      videos.push({ type: 'iframe-other', url: src, id: null });
    }
  });

  $('video').each((_, el) => {
    const $el = $(el);
    let src = $el.attr('src') || null;
    if (!src) {
      const $source = $el.find('source[src]').first();
      if ($source.length) src = $source.attr('src');
    }
    videos.push({ type: 'html5', url: src, id: null });
  });

  return { items: videos, count: videos.length, has_video: videos.length > 0 };
}

function extractSchemas($) {
  const schemas = [];

  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).contents().text();
    let parsed;
    let valid = true;
    let error = null;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      valid = false;
      error = err.message;
      parsed = null;
    }

    let types = [];
    if (valid) {
      const nodes = Array.isArray(parsed) ? parsed : parsed && parsed['@graph'] ? parsed['@graph'] : [parsed];
      for (const node of nodes) {
        if (node && node['@type']) {
          if (Array.isArray(node['@type'])) types.push(...node['@type']);
          else types.push(node['@type']);
        }
      }
    }

    schemas.push({ valid, error, types, raw_length: raw.length });
  });

  return {
    items: schemas,
    count: schemas.length,
    has_jsonld: schemas.length > 0,
    all_types: [...new Set(schemas.flatMap((s) => s.types))],
    invalid_count: schemas.filter((s) => !s.valid).length,
  };
}

function extractFaq($) {
  // Evidência 1: JSON-LD com @type FAQPage (fonte de verdade estruturada).
  let schemaDetected = false;
  let questionCount = 0;

  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).contents().text();
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return;
    }
    const nodes = Array.isArray(parsed) ? parsed : parsed && parsed['@graph'] ? parsed['@graph'] : [parsed];
    for (const node of nodes) {
      if (!node) continue;
      const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
      if (types.includes('FAQPage')) {
        schemaDetected = true;
        const mainEntity = Array.isArray(node.mainEntity) ? node.mainEntity : node.mainEntity ? [node.mainEntity] : [];
        questionCount += mainEntity.filter((q) => q && q['@type'] === 'Question').length;
      }
    }
  });

  // Evidência 2 (fraca, sem schema): heading textual mencionando
  // FAQ/perguntas frequentes — registrado, mas não confundido com FAQ
  // estruturado. Não assume que todo H2 "FAQ" é um FAQPage real.
  let headingDetected = false;
  $('h2, h3').each((_, el) => {
    const t = $(el).text().toLowerCase();
    if (/faq|perguntas frequentes|dúvidas frequentes/.test(t)) headingDetected = true;
  });

  return {
    detected: schemaDetected || headingDetected,
    schema_detected: schemaDetected,
    heading_detected: headingDetected,
    question_count: questionCount,
  };
}

module.exports = { parseFile, parseHtmlContent, SITE_DOMAIN };
