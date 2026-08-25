'use strict';

const fs = require('fs');
const path = require('path');
const { writeIndexAtomic } = require('../../site-indexer/src/writer');

function levelIcon(level) {
  return { high: '🔴', possible: '🟡', low: '🟢', complementary: '🔗' }[level] || '';
}

function buildMarkdownReport(result) {
  const { pairs, summary } = result;
  const high = pairs.filter((p) => p.level === 'high');
  const possible = pairs.filter((p) => p.level === 'possible');
  const complementary = pairs.filter((p) => p.level === 'complementary');
  const conflicts = pairs.filter((p) => p.level !== 'complementary'); // high + possible, exclui pares já explicados como arquitetura intencional

  const lines = [];
  lines.push('# Cannibalization Report');
  lines.push('');
  lines.push(`**Gerado em:** ${result.generated_at}`);
  lines.push('');
  lines.push('**Nota importante:** este relatório identifica APENAS possíveis conflitos de conteúdo, com base em sobreposição textual local. Nenhum score aqui é uma certeza de canibalização real — sempre trate como sinal a ser revisado manualmente, não como veredito. Pares marcados 🔗 COMPLEMENTARY foram identificados como relação pilar↔satélite (arquitetura intencional do site) e não são conflito, mesmo com score numérico alto — ver seção própria abaixo.');
  lines.push('');
  lines.push('## Resumo');
  lines.push('');
  lines.push(`Páginas analisadas: ${summary.pages_analyzed}`);
  lines.push(`Pares analisados: ${summary.pairs_analyzed}`);
  lines.push(`Possíveis conflitos reportados (score >= 40): ${summary.potential_conflicts}`);
  lines.push(`  - 🔴 HIGH (70-100): ${high.length}`);
  lines.push(`  - 🟡 POSSIBLE (40-69): ${possible.length}`);
  lines.push(`  - 🔗 COMPLEMENTARY (pilar↔satélite, não é conflito): ${complementary.length}`);
  lines.push('');

  lines.push('## Pares com Maior Score (excluindo relações complementares pilar↔satélite)');
  lines.push('');
  if (conflicts.length === 0) {
    lines.push('Nenhum par com score >= 40 encontrado (fora das relações pilar↔satélite).');
  } else {
    conflicts.slice(0, 15).forEach((p, i) => {
      lines.push(`${i + 1}. ${levelIcon(p.level)} **${p.level.toUpperCase()}** (${p.score}/100) — \`${p.page_a}\` ↔ \`${p.page_b}\``);
    });
  }
  lines.push('');

  lines.push('## Relações Pilar ↔ Satélite (Complementares — Não é Canibalização)');
  lines.push('');
  if (complementary.length === 0) {
    lines.push('Nenhuma relação pilar↔satélite identificada acima do threshold de score.');
  } else {
    complementary.forEach((p, i) => {
      lines.push(`${i + 1}. 🔗 (${p.score}/100) — \`${p.page_a}\` (${p.format_a}) ↔ \`${p.page_b}\` (${p.format_b})`);
    });
  }
  lines.push('');

  lines.push('## Detalhamento dos Pares');
  lines.push('');
  if (pairs.length === 0) {
    lines.push('Nenhum par a detalhar.');
  } else {
    for (const p of pairs) {
      lines.push(`### ${levelIcon(p.level)} ${p.page_a} ↔ ${p.page_b} — ${p.score}/100 (${p.level})`);
      lines.push('');
      lines.push(`**Título A:** ${p.page_a_title}`);
      lines.push(`**Título B:** ${p.page_b_title}`);
      lines.push('');
      lines.push(`**Sinais encontrados:** ${p.signals.length > 0 ? p.signals.join('; ') : '(nenhum sinal textual específico além do score agregado)'}`);
      if (p.differentiation_signals.length > 0) {
        lines.push(`**Sinais de diferenciação:** ${p.differentiation_signals.join('; ')}`);
      }
      lines.push('');
      lines.push(`**Explicação:** ${p.explanation}`);
      lines.push('');
      lines.push(`**Recomendação:** ${p.recommendation}`);
      lines.push('');
    }
  }

  return lines.join('\n');
}

function writeReports({ jsonPath, mdPath, result }) {
  const { bytes } = writeIndexAtomic(jsonPath, result);
  const md = buildMarkdownReport(result);
  fs.mkdirSync(path.dirname(mdPath), { recursive: true });
  fs.writeFileSync(mdPath, md, 'utf8');
  return { jsonBytes: bytes, mdBytes: Buffer.byteLength(md, 'utf8') };
}

module.exports = { buildMarkdownReport, writeReports };
