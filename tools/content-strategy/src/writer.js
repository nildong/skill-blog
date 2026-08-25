'use strict';

const fs = require('fs');
const path = require('path');

// Reutiliza a escrita atômica já implementada pelo Site Indexer (mesmo
// padrão usado por SEO Auditor, Internal Linking e Cannibalization) —
// evita duplicar a mesma lógica de tmp-file + rename pela quinta vez.
const { writeIndexAtomic } = require('../../site-indexer/src/writer');

function writeJson(jsonPath, data) {
  return writeIndexAtomic(jsonPath, data);
}

function writeMarkdown(mdPath, content) {
  fs.mkdirSync(path.dirname(mdPath), { recursive: true });
  fs.writeFileSync(mdPath, content, 'utf8');
  return { bytes: Buffer.byteLength(content, 'utf8') };
}

module.exports = { writeJson, writeMarkdown };
