'use strict';

const fs = require('fs');
const cheerio = require('cheerio');

const EXCLUDE_TAGS = ['script', 'style', 'noscript', 'nav', 'header', 'footer', 'svg'];

/**
 * Extrai o texto plano do <body> de um HTML, com o mesmo critério de
 * exclusão de tags usado por tools/site-indexer/src/parser.js
 * (script/style/noscript/nav/header/footer/svg removidos antes de extrair
 * o texto). Isso é uma reimplementação DELIBERADAMENTE mínima — não o
 * parser inteiro do Site Indexer — porque `site-index.json` guarda apenas
 * `word_count` (contagem), não o texto bruto, e Internal Linking /
 * Cannibalization precisam do texto real para calcular overlap de termos.
 * Ver README.md ("Por que este módulo existe") para a decisão completa.
 *
 * Não modifica nada — leitura pura.
 */
function extractBodyText(html) {
  const $ = cheerio.load(html, { xmlMode: false });
  const $body = $('body').length ? $('body').clone() : $.root().clone();
  $body.find(EXCLUDE_TAGS.join(',')).remove();
  return $body.text().replace(/\s+/g, ' ').trim();
}

/**
 * Lê um index.html do disco (caminho absoluto) e retorna o texto plano do
 * body. Lança se o arquivo não existir/não puder ser lido — quem chama
 * decide como tratar (ver src/index.js de cada módulo).
 */
function extractBodyTextFromFile(absPath) {
  const html = fs.readFileSync(absPath, 'utf8');
  return extractBodyText(html);
}

module.exports = { extractBodyText, extractBodyTextFromFile };
