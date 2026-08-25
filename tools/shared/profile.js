'use strict';

const { extractTerms } = require('./terms');

/**
 * Constrói o "perfil de termos" de uma página, combinando dados já
 * presentes no site-index.json (title, headings, slug) com o texto bruto
 * do body (obtido separadamente via html-text.js, já que o índice não
 * guarda o texto completo — só a contagem de palavras).
 *
 * Usado tanto por Internal Linking quanto por Cannibalization — construir
 * isso uma vez, num lugar só, evita duplicar a lógica de tokenização por
 * sinal (title/heading/slug/content) nos dois módulos.
 */
function buildPageProfile(post, bodyText) {
  const headingTexts = (post.headings || []).map((h) => h.text).filter(Boolean);
  const slugWords = (post.slug || '').split('-').filter(Boolean);

  return {
    path: post.path,
    slug: post.slug,
    url_path: post.url_path,
    page_type: post.page_type,
    title: post.title,
    cluster: post.cluster || null,
    titleTerms: extractTerms(post.title || ''),
    headingTerms: extractTerms(headingTexts),
    slugTerms: extractTerms(slugWords.join(' ')),
    contentTerms: extractTerms(bodyText || ''),
  };
}

module.exports = { buildPageProfile };
