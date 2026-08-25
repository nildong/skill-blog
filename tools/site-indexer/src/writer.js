'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Escreve `data` (serializado como JSON) em `outputPath` de forma atômica:
 * grava num arquivo temporário no mesmo diretório e depois usa fs.renameSync
 * (rename dentro do mesmo filesystem é atômico em Linux/Mac). Evita deixar
 * o site-index.json truncado/corrompido se o processo for interrompido no
 * meio da escrita.
 */
function writeIndexAtomic(outputPath, data) {
  const dir = path.dirname(outputPath);
  fs.mkdirSync(dir, { recursive: true });

  const tmpPath = path.join(dir, `.${path.basename(outputPath)}.tmp-${process.pid}`);
  const json = JSON.stringify(data, null, 2);

  fs.writeFileSync(tmpPath, json, 'utf8');
  fs.renameSync(tmpPath, outputPath);

  return { bytes: Buffer.byteLength(json, 'utf8') };
}

module.exports = { writeIndexAtomic };
