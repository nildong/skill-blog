'use strict';

/**
 * Normaliza um href interno (absoluto "https://dominio/slug/" ou relativo
 * "/slug/") para o mesmo formato usado em page.url_path no site-index
 * ("/slug/" com barra final, "/" para a home). Não inventa domínio — só
 * reformata o que já está lá.
 *
 * Retorna null se não for possível normalizar com segurança (ex: href
 * vazio).
 */
function normalizeInternalPath(href) {
  if (!href) return null;
  let raw = href;

  if (/^https?:\/\//i.test(raw)) {
    try {
      raw = new URL(raw).pathname;
    } catch {
      return null;
    }
  }

  // remove querystring/fragment residual, se houver
  raw = raw.split('#')[0].split('?')[0];

  if (raw === '') raw = '/';
  if (!raw.startsWith('/')) raw = `/${raw}`;

  const lastSegment = raw.split('/').filter(Boolean).pop();
  const looksLikeFile = lastSegment && /\.[a-z0-9]{2,5}$/i.test(lastSegment);

  if (!looksLikeFile && !raw.endsWith('/')) raw += '/';

  return { path: raw, looksLikeFile: Boolean(looksLikeFile) };
}

/**
 * Constrói o grafo de links internos do site inteiro a partir dos posts do
 * site-index. Usado para: contagem de links recebidos (inbound), detecção
 * de páginas órfãs/isoladas e detecção de links internos quebrados.
 */
function buildLinkGraph(posts) {
  const urlSet = new Set(posts.map((p) => p.url_path));
  const inboundCount = new Map(posts.map((p) => [p.url_path, 0]));
  const inboundSources = new Map(posts.map((p) => [p.url_path, []]));
  const brokenLinksBySource = new Map(); // url_path de origem -> [{href, anchor_text, resolved_path}]

  for (const page of posts) {
    for (const link of page.internal_links) {
      const normalized = normalizeInternalPath(link.href);
      if (!normalized) continue;

      // Links para arquivos (ex: PDF) não são páginas do site-index — não
      // determináveis com segurança como "quebrados" por este módulo, então
      // são ignorados (nem contam inbound, nem viram broken-link).
      if (normalized.looksLikeFile) continue;

      const targetPath = normalized.path;

      if (targetPath === page.url_path) continue; // self-link não conta como inbound externo

      if (urlSet.has(targetPath)) {
        inboundCount.set(targetPath, (inboundCount.get(targetPath) || 0) + 1);
        inboundSources.get(targetPath).push(page.slug || page.url_path);
      } else {
        if (!brokenLinksBySource.has(page.url_path)) brokenLinksBySource.set(page.url_path, []);
        brokenLinksBySource.get(page.url_path).push({ ...link, resolved_path: targetPath });
      }
    }
  }

  return { urlSet, inboundCount, inboundSources, brokenLinksBySource };
}

module.exports = { normalizeInternalPath, buildLinkGraph };
