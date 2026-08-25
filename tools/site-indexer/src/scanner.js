'use strict';

const fs = require('fs');
const path = require('path');

// Diretórios que nunca contêm páginas publicadas do site — não são varridos.
// Baseado na estrutura real do repo (ver V2-ARCHITECTURE-AUDIT.md, seção 4).
const EXCLUDED_DIR_NAMES = new Set([
  '.git',
  '.claude',
  'node_modules',
  'img',
  'briefs',
  'calendars',
  'reports',
  'tools',
  '.data',
  '.github',
]);

/**
 * Um diretório é excluído se:
 *  - o nome está na lista fixa acima, OU
 *  - começa com "." (diretórios ocultos, ex: .vscode), OU
 *  - começa com "cluster-" (pastas de planejamento de cluster contêm .md de
 *    rascunho e cluster-map.html, não index.html publicado — ver auditoria).
 */
function isExcludedDir(name) {
  if (EXCLUDED_DIR_NAMES.has(name)) return true;
  if (name.startsWith('.')) return true;
  if (name.startsWith('cluster-')) return true;
  return false;
}

/**
 * Varre recursivamente `rootDir` procurando arquivos chamados exatamente
 * "index.html". Retorna caminhos relativos a `rootDir`, em ordem alfabética,
 * usando separador "/" (posix) independente do SO.
 *
 * Não segue links simbólicos (evita loops); não acessa rede; não lê
 * conteúdo de arquivo nenhum (isso é responsabilidade do parser).
 */
function findHtmlFiles(rootDir) {
  const results = [];

  function walk(dirAbs, dirRel) {
    let entries;
    try {
      entries = fs.readdirSync(dirAbs, { withFileTypes: true });
    } catch (err) {
      // Diretório ilegível — registra como resultado especial e segue.
      results.push({ error: `Não foi possível ler o diretório: ${dirRel || '.'} (${err.message})` });
      return;
    }

    // Ordena para saída determinística (idempotência de listagem).
    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      const entryAbs = path.join(dirAbs, entry.name);
      const entryRel = dirRel ? `${dirRel}/${entry.name}` : entry.name;

      if (entry.isSymbolicLink()) continue; // evita loops / arquivos fora da árvore

      if (entry.isDirectory()) {
        if (isExcludedDir(entry.name)) continue;
        walk(entryAbs, entryRel);
      } else if (entry.isFile() && entry.name === 'index.html') {
        results.push({ relPath: entryRel, absPath: entryAbs });
      }
    }
  }

  walk(rootDir, '');

  return results;
}

module.exports = { findHtmlFiles, isExcludedDir, EXCLUDED_DIR_NAMES };
