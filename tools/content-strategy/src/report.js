'use strict';

const { writeJson, writeMarkdown } = require('./writer');

function section(title) {
  return `## ${title}\n\n`;
}

function opportunityLine(o, i) {
  return `${i + 1}. **[${o.priority}] ${o.type}** (score ${o.score}, confidence ${o.confidence}) — \`${o.page || '(nível cluster)'}\`\n   - ${o.reason}\n   - Ação: ${o.recommended_action}`;
}

function buildMarkdownReport(result) {
  const { summary, priorities, opportunities, clusters, methodology, limitations } = result;
  const byType = (type) => opportunities.filter((o) => o.type === type);
  const top10 = [...opportunities].sort((a, b) => b.score - a.score).slice(0, 10);

  const lines = [];
  lines.push('# Content Strategy Report');
  lines.push('');
  lines.push(`**Gerado em:** ${result.generated_at}`);
  lines.push('');

  lines.push(section('Executive Summary'));
  lines.push(`Páginas analisadas: ${summary.pages_analyzed}`);
  lines.push(`Clusters identificados: ${summary.clusters_identified}`);
  lines.push(`Oportunidades totais: ${summary.total_opportunities}`);
  lines.push(`NO_ACTION: ${summary.no_action_count}`);
  lines.push('');
  lines.push(`P0: ${priorities.P0} | P1: ${priorities.P1} | P2: ${priorities.P2} | P3: ${priorities.P3}`);
  lines.push('');

  lines.push(section('Site Overview'));
  lines.push(`- Total de páginas: ${summary.pages_analyzed}`);
  lines.push(`- Pilares identificados: ${summary.pillar_count}`);
  lines.push(`- Clusters com pilar: ${summary.clusters_with_pillar}`);
  lines.push(`- Clusters sem pilar (THIN): ${summary.thin_clusters}`);
  lines.push('');

  lines.push(section('Strategic Priorities'));
  lines.push('Distribuição de oportunidades por tipo e prioridade:');
  lines.push('');
  const types = [...new Set(opportunities.map((o) => o.type))];
  lines.push('| Tipo | P0 | P1 | P2 | P3 | Total |');
  lines.push('|---|---:|---:|---:|---:|---:|');
  for (const t of types) {
    const rows = byType(t);
    const c = { P0: 0, P1: 0, P2: 0, P3: 0 };
    for (const o of rows) c[o.priority] += 1;
    lines.push(`| ${t} | ${c.P0} | ${c.P1} | ${c.P2} | ${c.P3} | ${rows.length} |`);
  }
  lines.push('');

  lines.push(section('Top 10 Opportunities'));
  if (top10.length === 0) lines.push('Nenhuma oportunidade identificada.');
  else top10.forEach((o, i) => lines.push(opportunityLine(o, i)));
  lines.push('');

  lines.push(section('New Content Opportunities'));
  const newContent = byType('NEW_CONTENT');
  if (newContent.length === 0) lines.push('Nenhuma lacuna estrutural de formato identificada nos clusters estabelecidos.');
  else newContent.forEach((o, i) => lines.push(opportunityLine(o, i)));
  lines.push('');

  lines.push(section('Existing Content Improvements'));
  const improvements = [...byType('UPDATE_EXISTING'), ...byType('EXPAND_EXISTING')];
  if (improvements.length === 0) lines.push('Nenhuma oportunidade de atualização/expansão identificada.');
  else improvements.forEach((o, i) => lines.push(opportunityLine(o, i)));
  lines.push('');

  lines.push(section('Internal Linking Opportunities'));
  const ilOpps = byType('IMPROVE_INTERNAL_LINKING');
  if (ilOpps.length === 0) lines.push('Nenhuma oportunidade de link interno acima do limiar.');
  else ilOpps.forEach((o, i) => lines.push(opportunityLine(o, i)));
  lines.push('');

  lines.push(section('FAQ Opportunities'));
  const faqOpps = byType('IMPROVE_FAQ');
  if (faqOpps.length === 0) lines.push('Nenhuma oportunidade de FAQ identificada.');
  else faqOpps.forEach((o, i) => lines.push(opportunityLine(o, i)));
  lines.push('');

  lines.push(section('Cannibalization / Differentiation'));
  const diffOpps = byType('DIFFERENTIATE_CONTENT');
  if (diffOpps.length === 0) lines.push('Nenhum par com risco real de canibalização (fora de relações complementares).');
  else diffOpps.forEach((o, i) => lines.push(opportunityLine(o, i)));
  lines.push('');

  lines.push(section('Cluster Coverage'));
  if (clusters.length === 0) lines.push('Nenhum cluster identificado com confiança suficiente.');
  else {
    for (const c of clusters) {
      lines.push(`### ${c.cluster_id}`);
      lines.push('');
      lines.push(`- Páginas: ${c.page_count}`);
      lines.push(`- Pilar: ${c.pillar || '(nenhum)'}`);
      lines.push(`- Satélites: ${c.satellite_count}`);
      lines.push(`- Formatos presentes: ${c.formats_present.join(', ') || '(nenhum)'}`);
      lines.push(`- Formatos ausentes: ${c.formats_missing.join(', ') || '(nenhum)'}`);
      lines.push(`- Cobertura: ${c.coverage}`);
      lines.push(`- Issues de SEO no cluster: ${c.seo_issue_count}`);
      lines.push('');
    }
  }

  lines.push(section('Pages Requiring Attention'));
  const attentionPages = [...new Set(opportunities.filter((o) => o.priority === 'P0' || o.priority === 'P1').map((o) => o.page).filter(Boolean))];
  if (attentionPages.length === 0) lines.push('Nenhuma página com oportunidade P0/P1.');
  else attentionPages.forEach((p) => lines.push(`- \`${p}\``));
  lines.push('');

  lines.push(section('No Action'));
  const noAction = result.no_action || [];
  lines.push(`${noAction.length} página(s) revisada(s) sem necessidade de ação no momento.`);
  if (noAction.length > 0) {
    lines.push('');
    noAction.slice(0, 15).forEach((n) => lines.push(`- \`${n.page}\` — ${n.reason}`));
    if (noAction.length > 15) lines.push(`- ... e mais ${noAction.length - 15}.`);
  }
  lines.push('');

  lines.push(section('Methodology'));
  lines.push(methodology.summary);
  lines.push('');
  lines.push('Pesos do score: ' + JSON.stringify(methodology.score_weights));
  lines.push('');
  lines.push('Regras de prioridade: ' + methodology.priority_rules);
  lines.push('');

  lines.push(section('Limitations'));
  for (const l of limitations) lines.push(`- ${l}`);
  lines.push('');

  return lines.join('\n');
}

function writeReports({ jsonPath, mdPath, result }) {
  const { bytes: jsonBytes } = writeJson(jsonPath, result);
  const md = buildMarkdownReport(result);
  const { bytes: mdBytes } = writeMarkdown(mdPath, md);
  return { jsonBytes, mdBytes };
}

module.exports = { buildMarkdownReport, writeReports };
