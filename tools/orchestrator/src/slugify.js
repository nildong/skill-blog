'use strict';

/**
 * Slugify determinístico, consistente com a convenção já usada nos 72
 * posts existentes (minúsculo, sem acento, hífens, sem caracteres
 * especiais). Não depende de nenhuma biblioteca externa.
 */
function slugify(text) {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove diacríticos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

module.exports = { slugify };
