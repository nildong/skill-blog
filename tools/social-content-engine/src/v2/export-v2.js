'use strict';

/**
 * export-v2.js — FASE 2, arquivo NOVO. Orquestra o pipeline completo:
 *   collect-source -> enrichment -> cta-rules -> repetition-detector ->
 *   score -> media-planner -> calendar -> escreve .data/social-content-v2-export.json
 *   -> chama export_xlsx_v2.py -> escreve output_social_v2/**
 *
 * Uso:
 *   node export-v2.js --dry-run   (não escreve output_social_v2/, só imprime resumo)
 *   node export-v2.js             (modo real: escreve tudo)
 *
 * Nunca inventa fato novo: todo texto exibido já vinha das peças
 * V2 fato-do-corpo coletadas por collect-source.js (aprovadas por
 * quality-gate-v2.js). Este arquivo só reclassifica/pontua/agenda.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const { collectSource, STUB_SLUGS } = require('./collect-source');
const { enrichPieces } = require('./enrichment');
const { applyCtaRules, reportDistribution } = require('./cta-rules');
const { detectRepetitions } = require('./repetition-detector');
const { scoreBatch } = require('./score');
const { planMediaForBatch } = require('./media-planner');
const { buildCalendar } = require('./calendar');

const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const OUTPUT_JSON = path.join(ROOT, '.data', 'social-content-v2-export.json');
const OUTPUT_DIR = path.join(ROOT, 'output_social_v2');
const XLSX_SCRIPT = path.join(ROOT, 'tools', 'social-content-engine', 'export_xlsx_v2.py');

const FORMAT_TO_DIR = {
  reel: 'reels',
  post: 'posts',
  carousel: 'carrosseis',
  stories: 'stories',
  engagement: 'engagement',
};

function loadSiteIndexUrls() {
  const idx = require(path.join(ROOT, '.data', 'site-index.json'));
  return new Set(idx.posts.map((p) => p.canonical || `https://smartpetgadgets.com.br/${p.slug}/`));
}

function pad3(n) { return String(n).padStart(3, '0'); }

function buildExportRows(scheduledPieces, articleBySlug) {
  return scheduledPieces.map((p, i) => {
    const article = articleBySlug.get(p.source_article) || {};
    const id = `SPG-${pad3(i + 1)}`;
    const slideTexts = Array.isArray(p.slides)
      ? p.slides.map((s) => (typeof s === 'string' ? s : (s.titulo || s.texto || ''))).filter(Boolean)
      : [];
    const hook = p.hook || p.titulo_gatilho || p.pergunta || slideTexts[0] || '';
    const legenda = p.legenda
      || (p.roteiro ? `${p.roteiro.problema || ''} ${p.roteiro.informacao || ''}`.trim() : '')
      || p.conteudo
      || (slideTexts.length ? slideTexts.join(' | ') : '')
      || '';
    return {
      ID: id,
      DATA_SUGERIDA: p.data_sugerida,
      DIA: p.dia_semana,
      HORARIO_SUGERIDO: p.horario_sugerido,
      CLUSTER: article.cluster || null,
      ARTIGO: article.title || p.source_article,
      ARTICLE_URL: p.source_url || article.url,
      TIPO: p.tipo,
      OBJETIVO: p.objetivo_cta,
      ANGULO: p.tipo_regra,
      HOOK: hook,
      LEGENDA: legenda,
      CTA: p.cta_sugerido || (p.cta_com_link ? legenda : null) || 'Confira mais no perfil',
      HASHTAGS: p.hashtags || [],
      FORMATO: p.formato,
      ARQUIVO_MIDIA: p.media_plan.media_path_planejado.imagem,
      ARQUIVO_MIDIA_VIDEO: p.media_plan.media_path_planejado.video,
      CAPA: p.media_plan.media_path_planejado.imagem,
      STATUS: p.status_score === 'PRONTO_PUBLICAR' ? 'PRONTO_PUBLICAR' : 'REVISAR',
      SCORE: p.score,
      REVISAO_LEVE: !!p.revisao_leve,
      OBSERVACAO: p.flagged_repetition
        ? (() => {
          const others = [...new Set(p.flagged_repetition.map((r) => (r.b === p.content_id ? r.a : r.b)))];
          const shown = others.slice(0, 5).join(', ');
          const rest = others.length > 5 ? ` e mais ${others.length - 5}` : '';
          return `Possível repetição (${p.flagged_repetition.length} campo(s) sinalizado(s)) com: ${shown}${rest} — revisar antes de publicar.`;
        })()
        : (p.media_plan.motivo || ''),
      content_id_origem: p.content_id,
    };
  });
}

function writeOutputTree(rows, { dryRun }) {
  if (dryRun) return { written: 0 };
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const subdirs = ['posts', 'reels', 'carrosseis', 'stories', 'engagement', 'calendario', 'legendas', 'publicacao'];
  for (const d of subdirs) fs.mkdirSync(path.join(OUTPUT_DIR, d), { recursive: true });

  let written = 0;
  for (const row of rows) {
    const formatDir = FORMAT_TO_DIR[row.FORMATO] || 'posts';
    const pieceDir = path.join(OUTPUT_DIR, formatDir, row.ID);
    fs.mkdirSync(pieceDir, { recursive: true });

    const legendaTxt = [
      row.HOOK,
      '',
      row.LEGENDA,
      '',
      row.CTA || '',
      '',
      (row.HASHTAGS || []).join(' '),
    ].join('\n');
    fs.writeFileSync(path.join(pieceDir, 'legenda.txt'), legendaTxt, 'utf8');

    const publicarTxt = [
      `ID: ${row.ID}`,
      `Artigo: ${row.ARTIGO} (${row.ARTICLE_URL})`,
      `Formato: ${row.FORMATO} | Tipo: ${row.TIPO} | Objetivo: ${row.OBJETIVO}`,
      `Data sugerida: ${row.DATA_SUGERIDA} (${row.DIA}) às ${row.HORARIO_SUGERIDO}`,
      `Status: ${row.STATUS} (score ${row.SCORE}/100)`,
      '',
      `Mídia planejada (imagem): ${row.ARQUIVO_MIDIA}`,
      row.ARQUIVO_MIDIA_VIDEO ? `Mídia planejada (vídeo): ${row.ARQUIVO_MIDIA_VIDEO}` : null,
      '',
      'AVISO: este caminho de mídia é um PLANO (FASE 2). O arquivo físico',
      'ainda NÃO foi gerado nesta fase — a geração real de imagem/vídeo é',
      'FASE 3 (piloto) / FASE 4 (escala completa), fora do escopo deste',
      'export. Não publique usando um arquivo que não existe; confira antes',
      '`arquivo_existe` em .data/social-content-v2-export.json.',
      '',
      `Observação: ${row.OBSERVACAO || '(nenhuma)'}`,
    ].filter(Boolean).join('\n');
    fs.writeFileSync(path.join(pieceDir, 'publicar.txt'), publicarTxt, 'utf8');
    written++;
  }

  const readme = [
    '# output_social_v2/ — Fila de conteúdo social V2 (FASE 2)',
    '',
    'Estrutura: um diretório por peça (`<FORMATO>/SPG-NNN/`) com `legenda.txt`',
    '(texto pronto para colar no Facebook/Instagram) e `publicar.txt` (metadados',
    'de agendamento + caminho de mídia PLANEJADO).',
    '',
    '## IMPORTANTE sobre mídia',
    '',
    'O campo de mídia em cada `publicar.txt` e em `.data/social-content-v2-export.json`',
    'aponta para um caminho PLANEJADO (`output_midia_avancada/imagens_v2/...`).',
    'Nenhuma imagem/vídeo novo foi gerado nesta FASE 2 — a decisão',
    'REAPROVEITAR/REGENERAR e o caminho de destino já estão calculados',
    '(ver `tools/social-content-engine/src/v2/media-planner.js`), mas a',
    'geração de fato (Pillow/moviepy, como em `generate_assets.py`) é',
    'trabalho de FASE 3/4, fora do escopo desta implementação.',
    '',
    'Antes de publicar qualquer peça, confira `arquivo_existe` no export JSON.',
  ].join('\n');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'README.md'), readme, 'utf8');

  return { written };
}

function pickPython() {
  const venvPython = path.join(ROOT, 'tools', 'social-content-engine', '.venv_xlsx', 'bin', 'python');
  if (fs.existsSync(venvPython)) return venvPython;
  return 'python3';
}

function runXlsxExport({ dryRun }) {
  if (dryRun) return { ok: null, skipped: true, reason: 'dry-run' };
  const python = pickPython();
  try {
    execFileSync(python, [XLSX_SCRIPT], { stdio: 'pipe', cwd: ROOT });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message, stderr: e.stderr ? e.stderr.toString() : null };
  }
}

function run({ dryRun = false } = {}) {
  const source = collectSource();
  const siteUrls = loadSiteIndexUrls();
  const articleBySlug = new Map(source.articles.map((a) => [a.slug, a]));

  const realArticles = source.articles.filter((a) => a.status === 'V2_REAL');
  const allPieces = realArticles.flatMap((a) => a.pieces.map((p) => ({ ...p, source_article: p.source_article || a.slug })));

  const enriched = enrichPieces(allPieces);

  // Repetição é detectada ANTES de cta-rules aplicar os templates canônicos de
  // CTA por família de objetivo (interacao/curiosidade/educacao/...) — esses
  // templates são DELIBERADAMENTE repetidos entre peças da mesma família (é
  // a cota de distribuição, não uma falha de originalidade). Detectar sobre o
  // CTA fato-do-corpo original evita falso-positivo em massa.
  const { flagged, pairs } = detectRepetitions(enriched);

  // O campo `cta` do fato-do-corpo é estruturalmente repetitivo por design
  // (template fixo "Confira o guia completo..." + URL) — isso já é mitigado
  // pela cota de cta-rules.js, não pela DIVERSIDADE. Para o critério
  // DIVERSIDADE do score, só conta repetição em campos realmente criativos
  // (hook, pergunta-gancho, ideia central); todos os campos continuam
  // reportados em `pairs` para auditoria humana.
  const creativeFlagged = new Map();
  for (const [id, records] of flagged.entries()) {
    const creative = records.filter((r) => r.field !== 'cta');
    if (creative.length) creativeFlagged.set(id, creative);
  }

  const withCta = applyCtaRules(enriched);
  const ctaDistribution = reportDistribution(withCta);

  const scored = scoreBatch(withCta, { flaggedIds: creativeFlagged });
  const withFlags = scored.map((p) => ({ ...p, flagged_repetition: flagged.get(p.content_id) || null }));

  const articleClusterBySlug = new Map(realArticles.map((a) => [a.slug, a.cluster]));
  const withMedia = planMediaForBatch(withFlags, articleClusterBySlug);

  const scheduled = buildCalendar(withMedia);
  const rows = buildExportRows(scheduled, articleBySlug);

  // valida URLs contra site-index (checagem de consistência, não bloqueia export
  // mas registra warning agregada)
  const badUrls = rows.filter((r) => r.ARTICLE_URL && !siteUrls.has(r.ARTICLE_URL));

  const statusCounts = rows.reduce((acc, r) => { acc[r.STATUS] = (acc[r.STATUS] || 0) + 1; return acc; }, {});

  const exportPayload = {
    generated_at: new Date().toISOString(),
    mode: dryRun ? 'dry_run' : 'real',
    total_pieces: rows.length,
    total_articles_real: realArticles.length,
    stub_articles: STUB_SLUGS,
    cta_distribution: ctaDistribution,
    status_counts: statusCounts,
    bad_urls: badUrls.map((r) => ({ ID: r.ID, ARTICLE_URL: r.ARTICLE_URL })),
    repetition_pairs_count: [...flagged.values()].length,
    rows,
  };

  if (!dryRun) {
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(exportPayload, null, 2));
  }

  const treeResult = writeOutputTree(rows, { dryRun });
  const xlsxResult = runXlsxExport({ dryRun });

  return { exportPayload, treeResult, xlsxResult };
}

if (require.main === module) {
  const dryRun = process.argv.includes('--dry-run');
  const { exportPayload, treeResult, xlsxResult } = run({ dryRun });
  console.log(`Modo: ${exportPayload.mode}`);
  console.log(`Total de peças: ${exportPayload.total_pieces} (${exportPayload.total_articles_real} artigos reais + ${exportPayload.stub_articles.length} stub excluídos)`);
  console.log('Status:', JSON.stringify(exportPayload.status_counts));
  console.log('Distribuição CTA:', JSON.stringify(exportPayload.cta_distribution.pct));
  console.log(`Pares de repetição sinalizados: ${exportPayload.repetition_pairs_count}`);
  console.log(`URLs fora do site-index: ${exportPayload.bad_urls.length}`);
  if (!dryRun) {
    console.log(`Árvore output_social_v2/: ${treeResult.written} peças escritas`);
    console.log('XLSX:', xlsxResult.ok ? 'gerado com sucesso' : `FALHOU (${xlsxResult.reason || xlsxResult.error})`);
  } else {
    console.log('[dry-run] output_social_v2/ e xlsx NÃO foram escritos.');
  }
}

module.exports = { run };
