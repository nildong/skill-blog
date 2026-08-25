'use strict';

const fs = require('fs');
const path = require('path');
const { writeIndexAtomic } = require('../../site-indexer/src/writer');

function groupByCluster(suggestions, postByUrlPath) {
  const groups = new Map();
  for (const s of suggestions) {
    const sourcePost = postByUrlPath.get(s.source);
    const cluster = (sourcePost && sourcePost.cluster) || 'sem cluster definido';
    if (!groups.has(cluster)) groups.set(cluster, []);
    groups.get(cluster).push(s);
  }
  return groups;
}

function buildMarkdownReport(result, posts) {
  const postByUrlPath = new Map(posts.map((p) => [p.url_path, p]));
  const { suggestions, low_connectivity_pages: lowConnectivityPages, summary } = result;

  const lines = [];
  lines.push('# Internal Linking — Sugestões');
  lines.push('');
  lines.push(`**Gerado em:** ${result.generated_at}`);
  lines.push('');
  lines.push('## Resumo');
  lines.push('');
  lines.push(`Páginas analisadas: ${summary.pages_analyzed}`);
  lines.push(`Total de sugestões: ${summary.suggestions}`);
  lines.push(`Sugestões priorizadas por página órfã: ${summary.orphan_target_suggestions}`);
  lines.push('');
  lines.push('**Nota importante:** este relatório contém apenas SUGESTÕES. Nenhum link foi inserido, removido ou alterado em nenhum artigo. Toda inclusão precisa de revisão e ação manual.');
  lines.push('');

  lines.push('## Top Oportunidades');
  lines.push('');
  if (suggestions.length === 0) {
    lines.push('Nenhuma sugestão acima do limiar mínimo de score.');
  } else {
    suggestions.slice(0, 20).forEach((s, i) => {
      lines.push(`${i + 1}. **${s.source}** → **${s.target}** — score ${s.score}/100${s.target_is_orphan ? ' 🔴 destino órfão' : ''}`);
      lines.push(`   - Anchor sugerido: "${s.anchor}"`);
      lines.push(`   - Motivo: ${s.reason}`);
    });
  }
  lines.push('');

  lines.push('## Páginas com Baixa Conectividade');
  lines.push('');
  lines.push('(inbound = links recebidos de outras páginas; outbound = links de saída)');
  lines.push('');
  if (lowConnectivityPages.length === 0) {
    lines.push('Nenhuma página com conectividade baixa encontrada.');
  } else {
    for (const p of lowConnectivityPages) {
      lines.push(`- \`${p.url_path}\` — inbound: ${p.inbound}, outbound: ${p.outbound}`);
    }
  }
  lines.push('');

  lines.push('## Oportunidades por Cluster');
  lines.push('');
  const byCluster = groupByCluster(suggestions, postByUrlPath);
  if (byCluster.size === 0) {
    lines.push('Nenhuma sugestão para agrupar.');
  } else {
    for (const [cluster, list] of byCluster) {
      lines.push(`### ${cluster}`);
      lines.push('');
      lines.push(`${list.length} sugestão(ões) nesta categoria.`);
      lines.push('');
    }
  }

  lines.push('## Sugestões por Página');
  lines.push('');
  const bySource = new Map();
  for (const s of suggestions) {
    if (!bySource.has(s.source)) bySource.set(s.source, []);
    bySource.get(s.source).push(s);
  }
  for (const [source, list] of bySource) {
    lines.push(`### \`${source}\``);
    lines.push('');
    for (const s of list) {
      lines.push(`- **Origem:** \`${s.source}\``);
      lines.push(`  **Destino:** \`${s.target}\``);
      lines.push(`  **Score:** ${s.score}/100`);
      lines.push(`  **Anchor sugerido:** "${s.anchor}"`);
      lines.push(`  **Motivo:** ${s.reason}`);
      lines.push(`  **Evidências:** ${s.evidence.length > 0 ? s.evidence.join('; ') : '(nenhuma evidência específica além do score agregado)'}`);
      lines.push('');
    }
  }

  return lines.join('\n');
}

function writeReports({ jsonPath, mdPath, result, posts }) {
  const { bytes } = writeIndexAtomic(jsonPath, result);
  const md = buildMarkdownReport(result, posts);
  fs.mkdirSync(path.dirname(mdPath), { recursive: true });
  fs.writeFileSync(mdPath, md, 'utf8');
  return { jsonBytes: bytes, mdBytes: Buffer.byteLength(md, 'utf8') };
}

module.exports = { buildMarkdownReport, writeReports };
