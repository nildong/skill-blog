#!/usr/bin/env node
'use strict';
/**
 * Export de todas as peças aprovadas (status 'generated' + quality_passed)
 * para todos os artigos elegíveis do site-index, para um JSON flat que o
 * script Python de geração de imagens/planilha consome.
 *
 * Leitura apenas. Não publica, não altera HTML/imagens/afiliados/sitemap.
 */
const fs = require('fs');
const path = require('path');
const { loadDataSources } = require('./loader');
const { analyzeArticle } = require('./analyze-article');
const { generateContentForArticle } = require('./generate');

const root = path.resolve(__dirname, '..', '..', '..');
const { siteIndex, contentStrategy, affiliateProducts } = loadDataSources(root);

// Exclui páginas institucionais/autor/index (mesma regra usada nos relatórios da escala)
const EXCLUDE_SLUGS = new Set(['autores/nildo-alves', 'politica-editorial', 'sobre', 'contato', 'index']);

const posts = siteIndex.posts.filter((p) => !EXCLUDE_SLUGS.has(p.slug) && !/^(autores|reports)\//.test(p.path || ''));

const rows = [];
let counter = 0;

function pushRow(formato, slug, id_suffix, gancho, copy, cta, url) {
  counter += 1;
  rows.push({
    id: `PECA-${String(counter).padStart(3, '0')}`,
    formato,
    artigo_slug: slug,
    gancho,
    copy: copy || '',
    cta: cta || '',
    url,
  });
}

for (const post of posts) {
  let analysis;
  try {
    analysis = analyzeArticle(post, { root, contentStrategy, affiliateProducts });
  } catch (e) {
    continue;
  }
  const gen = generateContentForArticle(analysis);
  const c = gen.content || {};
  const url = `https://smartpetgadgets.com.br/${post.slug}/`;

  (c.reels || []).forEach((r) => {
    if (r.status === 'generated' && r.quality_passed) {
      pushRow('Reel', post.slug, 'reel', r.hook, r.narracao_sugerida, r.cta, url);
    }
  });
  (c.posts || []).forEach((p) => {
    if (p.status === 'generated' && p.quality_passed) {
      pushRow('Post', post.slug, 'post', p.titulo_gatilho, p.legenda, p.cta, url);
    }
  });
  (c.carousel || []).forEach((car) => {
    if (car.status === 'generated' && car.quality_passed) {
      const titulo = car.slides && car.slides[0] ? car.slides[0].titulo : post.slug;
      pushRow('Carrossel', post.slug, 'carrossel', titulo, car.slides.map((s) => s.titulo).join(' | '), car.cta, url);
    }
  });
  (c.stories || []).forEach((s) => {
    if (s.status === 'generated' && s.quality_passed) {
      pushRow('Stories', post.slug, 'stories', s.conteudo, s.tipo, url, url);
    }
  });
  (c.engagement || []).forEach((e) => {
    if (e.status === 'generated' && e.quality_passed) {
      pushRow('Engagement', post.slug, 'engagement', e.pergunta, '', url, url);
    }
  });
}

const outPath = path.join(root, '.data', 'social-content-export.json');
fs.writeFileSync(outPath, JSON.stringify({ generated_at: new Date().toISOString(), total: rows.length, rows }, null, 2));
console.log(`Artigos processados: ${posts.length}`);
console.log(`Peças exportadas: ${rows.length}`);
console.log(`Arquivo: ${outPath}`);
