'use strict';

const path = require('path');

// Reutiliza a escrita atômica já implementada pelo Site Indexer, em vez de
// duplicar a mesma lógica de tmp-file + rename aqui (ver decisão
// documentada em README.md, seção "Dependências e Reuso").
const { writeIndexAtomic } = require('../../site-indexer/src/writer');

function severityIcon(sev) {
  return { CRITICAL: '🔴', ERROR: '🟠', WARNING: '🟡', INFO: '🔵' }[sev] || '';
}

function topPriorities(auditResult, limit = 10) {
  const rank = { CRITICAL: 0, ERROR: 1, WARNING: 2, INFO: 3 };
  const flat = [];
  for (const page of auditResult.pages) {
    for (const issue of page.issues) {
      flat.push({ ...issue, page: page.url, slug: page.slug });
    }
  }
  flat.sort((a, b) => rank[a.severity] - rank[b.severity]);
  return flat.slice(0, limit);
}

function section(title, issuesBySeverity, severity) {
  const rows = issuesBySeverity.filter((x) => x.severity === severity);
  if (rows.length === 0) return `## ${title}\n\nNenhum item nesta severidade.\n`;

  const lines = [`## ${title}`, ''];
  for (const r of rows) {
    lines.push(`- **${r.id}** (${r.category}) — \`${r.page}\``);
    lines.push(`  - Evidência: ${r.evidence}`);
    lines.push(`  - Recomendação: ${r.recommendation}`);
  }
  return lines.join('\n') + '\n';
}

function categoryTable(categories) {
  const header = '| Categoria | Critical | Error | Warning | Info |\n|---|---:|---:|---:|---:|';
  const rows = Object.entries(categories).map(
    ([cat, c]) => `| ${cat} | ${c.critical} | ${c.error} | ${c.warning} | ${c.info} |`
  );
  return [header, ...rows].join('\n');
}

function buildMarkdownReport(auditResult) {
  const allIssues = auditResult.pages.flatMap((p) => p.issues.map((i) => ({ ...i, page: p.url, slug: p.slug })));
  const top = topPriorities(auditResult);

  const lines = [];
  lines.push('# SEO Audit');
  lines.push('');
  lines.push(`**Gerado em:** ${auditResult.generated_at}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`Total de páginas: ${auditResult.site.total_pages}`);
  lines.push('');
  lines.push(`${severityIcon('CRITICAL')} Critical: ${auditResult.summary.critical}`);
  lines.push(`${severityIcon('ERROR')} Errors: ${auditResult.summary.errors}`);
  lines.push(`${severityIcon('WARNING')} Warnings: ${auditResult.summary.warnings}`);
  lines.push(`${severityIcon('INFO')} Info: ${auditResult.summary.info}`);
  lines.push('');
  lines.push('### Top Priorities');
  lines.push('');
  if (top.length === 0) {
    lines.push('Nenhum issue encontrado.');
  } else {
    top.forEach((issue, i) => {
      lines.push(`${i + 1}. **${issue.id}** (${issue.severity}, ${issue.category}) — \`${issue.page}\` — ${issue.evidence}`);
    });
  }
  lines.push('');

  lines.push(section('Critical Issues', allIssues, 'CRITICAL'));
  lines.push(section('Errors', allIssues, 'ERROR'));
  lines.push(section('Warnings', allIssues, 'WARNING'));
  lines.push(section('Opportunities (Info)', allIssues, 'INFO'));

  lines.push('## Breakdown por Categoria');
  lines.push('');
  lines.push(categoryTable(auditResult.categories));
  lines.push('');

  const byCategory = (cat) => allIssues.filter((i) => i.category === cat);
  const categorySectionNames = {
    site_structure: 'Site Structure',
    internal_links: 'Internal Linking',
    metadata: 'Metadata',
    headings: 'Headings',
    content: 'Content',
    images: 'Images',
    schema: 'Schema',
    faq: 'FAQ',
    media: 'Media',
    technical: 'Technical',
  };
  for (const [cat, title] of Object.entries(categorySectionNames)) {
    const rows = byCategory(cat);
    lines.push(`## ${title}`);
    lines.push('');
    if (rows.length === 0) {
      lines.push('Nenhum item encontrado nesta categoria.');
    } else {
      for (const r of rows) {
        lines.push(`- ${severityIcon(r.severity)} **${r.id}** — \`${r.page}\` — ${r.evidence}`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

function writeReports({ jsonPath, mdPath, auditResult }) {
  const fs = require('fs');
  const { bytes } = writeIndexAtomic(jsonPath, auditResult);

  const md = buildMarkdownReport(auditResult);
  const mdDir = path.dirname(mdPath);
  fs.mkdirSync(mdDir, { recursive: true });
  fs.writeFileSync(mdPath, md, 'utf8');

  return { jsonBytes: bytes, mdBytes: Buffer.byteLength(md, 'utf8') };
}

module.exports = { buildMarkdownReport, writeReports, topPriorities };
