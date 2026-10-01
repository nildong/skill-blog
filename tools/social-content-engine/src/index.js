#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const { loadDataSources } = require('./loader');
const { selectDiversifiedPilot, PILOT_SIZE } = require('./select-pilot');
const { analyzeArticle } = require('./analyze-article');
const { generateContentForArticle } = require('./generate');
const { detectSimilarityWarnings } = require('./similarity');
const { writeArticlePackage, writeIndex, writeTextAtomic } = require('./writer');
const { buildDryRunMarkdown, buildGenerationMarkdown } = require('./report');
const { validateRun, hashAllPostHtml } = require('./validate');

const HELP = `
Social Content Engine V1 — dry-run/pilot + geração piloto autorizada (não publica, não modifica artigos)

Uso:
  npm run pilot                          Roda o dry-run com os 10 artigos-piloto (equivalente a: node src/index.js dry-run --pilot)
  node src/index.js dry-run --pilot      Mesma coisa, explícito
  node src/index.js generate --pilot     Gera as 8 peças por artigo para o mesmo piloto de 10 (só depois de autorização explícita do usuário)
  node src/index.js validate             Apenas roda as validações sobre a última execução salva em disco

Garantias desta V1:
  - dry-run: só estrutura a oportunidade por formato, não gera texto de peça.
  - generate: gera as 8 peças por artigo (título/legenda/roteiro/etc.), mas NUNCA publica — sem integração com Facebook/Instagram nesta versão.
  - Não modifica nenhum index.html, imagem, affiliate-products.json ou sitemap.xml.
  - Não faz git add/commit/push, não faz deploy, não publica em Facebook/Instagram.
`.trim();

function defaultRoot() {
  return path.resolve(__dirname, '..', '..', '..');
}

function readAffiliateSnapshot(root) {
  const affiliateProductsPath = path.join(root, '.data', 'affiliate-products.json');
  return fs.existsSync(affiliateProductsPath) ? fs.readFileSync(affiliateProductsPath, 'utf8') : null;
}

function readPreviousIndex(root) {
  const indexPathForPrevious = path.join(root, '.data', 'social-content-index.json');
  if (!fs.existsSync(indexPathForPrevious)) return null;
  try {
    const prev = JSON.parse(fs.readFileSync(indexPathForPrevious, 'utf8'));
    return { generated_at: prev.generated_at, mode: prev.mode, entries: (prev.entries || []).map((e) => ({ slug: e.slug, cluster: e.cluster })) };
  } catch {
    return null;
  }
}

/** Mesma seleção diversificada usada no dry-run — reexecutada de forma determinística para "generate", garantindo que a geração cubra exatamente o piloto de 10 já revisado e autorizado. */
function selectAndAnalyze(root, { siteIndex, contentStrategy, affiliateProducts }, size) {
  const selection = selectDiversifiedPilot({ siteIndex, contentStrategy, affiliateProducts }, size);
  const analyses = selection.selected.map((c) => {
    const post = siteIndex.posts.find((p) => p.path === c.path);
    return analyzeArticle(post, { root, contentStrategy, affiliateProducts });
  });
  return { selection, analyses };
}

function runDryRunPilot(root, { size = PILOT_SIZE } = {}) {
  const { siteIndex, contentStrategy, affiliateProducts, missing } = loadDataSources(root);

  const affiliateProductsBefore = readAffiliateSnapshot(root);
  const htmlHashesBefore = hashAllPostHtml(root, siteIndex);
  const previousPilot = readPreviousIndex(root);

  const { selection, analyses } = selectAndAnalyze(root, { siteIndex, contentStrategy, affiliateProducts }, size);

  const similarityWarnings = detectSimilarityWarnings(analyses);

  const packages = analyses.map((a) => writeArticlePackage({ root, articleAnalysis: a, similarityWarnings }));

  const pilotMeta = {
    requested_size: size,
    selected_count: selection.selected.length,
    total_candidates_considered: selection.candidates.length,
    selection_criteria: [
      'REVISADO (2ª execução): prioridade agora é interesse/engajamento/compartilhamento/tráfego; monetização é fator secundário de peso baixo — ver DIVERSITY_GROUPS e scoreSocialPotential em select-pilot.js.',
      'engajamento: FAQ existente na fonte (+20) ou role=FAQ (+15)',
      'interesse: role REVIEW/COMPARISON/HOW_TO/GUIDE (+20), slug erros-comuns/duvidas (+10), satélite com >=400 palavras (+8)',
      'compartilhamento: role COMPARISON (+15), imagens próprias (+5 a +10)',
      'tráfego: inbound_links já calculado pelo content-strategy.json (+5 a +15)',
      'monetização (secundário): produto afiliado ativo no cluster (+8, teto baixo de propósito)',
      'diversidade: cotas por cluster (comedouros 3, coleira-gps 2, câmera 2, cluster-unknown 2, outros 1) — ver diversity_report',
    ],
    diversity_report: selection.diversity_report,
    fillers_used: selection.fillers_used,
  };

  const { outPath: indexPath, bytes: indexBytes } = writeIndex({ root, entries: packages, pilotMeta });

  const reportMd = buildDryRunMarkdown({
    selection,
    packages,
    missingSources: missing,
    generatedAt: new Date().toISOString(),
    previousPilot,
  });
  const reportPath = path.join(root, 'reports', 'social-content', 'dry-run.md');
  const reportBytes = writeTextAtomic(reportPath, reportMd);

  const htmlHashesAfter = hashAllPostHtml(root, siteIndex);
  const affiliateProductsAfterRaw = readAffiliateSnapshot(root);

  const checks = validateRun({
    root,
    siteIndex,
    selection,
    packages,
    affiliateProductsBefore,
    affiliateProductsAfterRaw,
    htmlHashesBefore,
    htmlHashesAfter,
  });

  return { selection, packages, indexPath, indexBytes, reportPath, reportBytes, checks, missing };
}

function runGeneratePilot(root, { size = PILOT_SIZE } = {}) {
  const { siteIndex, contentStrategy, affiliateProducts, missing } = loadDataSources(root);

  const affiliateProductsBefore = readAffiliateSnapshot(root);
  const htmlHashesBefore = hashAllPostHtml(root, siteIndex);
  const previousPilot = readPreviousIndex(root);

  const { selection, analyses } = selectAndAnalyze(root, { siteIndex, contentStrategy, affiliateProducts }, size);

  const similarityWarnings = detectSimilarityWarnings(analyses);
  const generated = analyses.map((a) => generateContentForArticle(a));

  const packages = generated.map((a) => writeArticlePackage({ root, articleAnalysis: a, similarityWarnings }));

  const pilotMeta = {
    requested_size: size,
    selected_count: selection.selected.length,
    mode: 'generated_pilot',
    diversity_report: selection.diversity_report,
    fillers_used: selection.fillers_used,
  };
  const { outPath: indexPath, bytes: indexBytes } = writeIndex({ root, entries: packages, pilotMeta });

  const reportMd = buildGenerationMarkdown({ selection, packages, missingSources: missing, generatedAt: new Date().toISOString(), previousPilot });
  const reportPath = path.join(root, 'reports', 'social-content', 'generation-piloto.md');
  const reportBytes = writeTextAtomic(reportPath, reportMd);

  const htmlHashesAfter = hashAllPostHtml(root, siteIndex);
  const affiliateProductsAfterRaw = readAffiliateSnapshot(root);

  const checks = validateRun({
    root,
    siteIndex,
    selection,
    packages,
    affiliateProductsBefore,
    affiliateProductsAfterRaw,
    htmlHashesBefore,
    htmlHashesAfter,
  });

  return { selection, packages, indexPath, indexBytes, reportPath, reportBytes, checks, missing, generated: true };
}

function printSummary({ selection, packages, indexPath, indexBytes, reportPath, reportBytes, checks, missing, generated }) {
  const lines = [];
  lines.push(generated ? 'SOCIAL CONTENT ENGINE V1 — GERAÇÃO PILOTO (autorizada)' : 'SOCIAL CONTENT ENGINE V1 — DRY-RUN / PILOT');
  lines.push('='.repeat(lines[0].length));
  lines.push('');
  lines.push(`Artigos candidatos avaliados: ${selection.candidates.length}`);
  lines.push(`Artigos selecionados para o piloto: ${selection.selected.length}`);
  lines.push('');
  lines.push('Artigos selecionados:');
  selection.selected.forEach((c, i) => lines.push(`  ${i + 1}. ${c.slug} (score ${c.score}, cluster=${c.cluster || '—'}/${c.cluster_confidence}, grupo=${c.diversity_group})`));
  lines.push('');
  lines.push('Distribuição por grupo de diversidade:');
  selection.diversity_report.forEach((g) => lines.push(`  ${g.met ? 'OK' : 'DÉFICIT'} ${g.label}: ${g.filled}/${g.quota}${g.shortfall_reason ? ' — ' + g.shortfall_reason : ''}`));
  if (selection.fillers_used > 0) lines.push(`  ${selection.fillers_used} vaga(s) preenchida(s) fora de cota (melhor score geral) por falta de candidatos em algum grupo.`);
  lines.push('');
  lines.push('Arquivos criados/atualizados:');
  packages.forEach((p) => lines.push(`  ${path.relative(process.cwd(), p.outPath)} (${p.bytes} bytes)`));
  lines.push(`  ${path.relative(process.cwd(), indexPath)} (${indexBytes} bytes)`);
  lines.push(`  ${path.relative(process.cwd(), reportPath)} (${reportBytes} bytes)`);
  lines.push('');

  if (generated) {
    let totalPieces = 0, totalGenerated = 0, totalNeedsReview = 0, totalInsufficient = 0;
    packages.forEach((p) => {
      const s = p.pkg.generation_summary;
      totalPieces += s.total_pieces; totalGenerated += s.generated; totalNeedsReview += s.needs_review; totalInsufficient += s.insufficient_source;
    });
    lines.push('Resumo da geração (10 artigos x até 8 peças = até 80 peças):');
    lines.push(`  Peças totais: ${totalPieces}`);
    lines.push(`  Geradas e aprovadas no quality gate: ${totalGenerated}`);
    lines.push(`  Precisam de revisão (falharam algum check): ${totalNeedsReview}`);
    lines.push(`  Não geradas por falta de gancho real na fonte (insufficient_source, não inventadas): ${totalInsufficient}`);
    lines.push('');
  }

  lines.push('Validações:');
  checks.forEach((c) => lines.push(`  [${c.ok ? 'OK' : 'FALHOU'}] ${c.name}${c.note ? ' — ' + c.note : ''}`));
  lines.push('');
  if (missing.length) {
    lines.push('Avisos (fontes de dados ausentes):');
    missing.forEach((m) => lines.push(`  - ${m}`));
    lines.push('');
  }
  lines.push(generated
    ? 'Conteúdo social gerado nesta etapa: SIM (peças estruturadas, texto/roteiro pronto para revisão humana — NÃO publicado)'
    : 'Conteúdo social gerado nesta etapa: NENHUM (apenas estrutura de oportunidade — conforme escopo autorizado)');
  lines.push('Arquivos HTML alterados: 0');
  lines.push('Links de afiliados alterados: 0');
  lines.push('Sitemap alterado: 0');
  lines.push('Deploy realizado: NÃO');
  lines.push('Commit realizado: NÃO');
  lines.push('Push realizado: NÃO');
  lines.push('Publicação em Facebook/Instagram: NÃO');
  lines.push('');
  lines.push(generated
    ? 'Peças geradas — aguardando revisão humana de qualidade antes de qualquer fila editorial ou publicação.'
    : 'Aguardando autorização para a próxima fase (GERAÇÃO PILOTO).');
  console.log(lines.join('\n'));
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log(HELP);
    return;
  }

  const root = defaultRoot();
  const known = ['dry-run', 'generate', 'audit', 'validate'];
  const command = known.includes(argv[0]) ? argv[0] : 'dry-run';

  if (command === 'dry-run') {
    const sizeArgIdx = argv.indexOf('--size');
    const size = sizeArgIdx >= 0 ? parseInt(argv[sizeArgIdx + 1], 10) : PILOT_SIZE;
    const result = runDryRunPilot(root, { size });
    printSummary(result);
    return;
  }

  if (command === 'generate') {
    const sizeArgIdx = argv.indexOf('--size');
    const size = sizeArgIdx >= 0 ? parseInt(argv[sizeArgIdx + 1], 10) : PILOT_SIZE;
    const result = runGeneratePilot(root, { size });
    printSummary(result);
    return;
  }

  if (command === 'audit' || command === 'validate') {
    console.log('Comando ainda não implementado nesta V1 — use "dry-run --pilot" ou "generate --pilot". Ver SKILL.md.');
    return;
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, defaultRoot, runDryRunPilot, runGeneratePilot };
