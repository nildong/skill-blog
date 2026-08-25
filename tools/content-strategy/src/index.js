#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const { loadDataSources } = require('./loader');
const { buildInventory, buildClusterViews } = require('./analyzer');
const { ROLE } = require('./classifier');
const {
  resetIdCounter,
  buildUpdateExistingOpportunities,
  buildExpandExistingOpportunities,
  buildInternalLinkingOpportunities,
  buildFaqOpportunities,
  buildDifferentiateOpportunities,
  buildNewContentOpportunities,
  buildNoActionEntries,
} = require('./opportunities');
const { consolidate } = require('./prioritizer');
const { writeReports } = require('./report');
const { WEIGHTS, CONFIDENCE_POINTS } = require('./scorer');

const HELP = `
Content Strategy Engine — camada de priorização editorial (não escreve artigos, não modifica HTML)

Uso:
  npm run strategy [-- opções]
  node src/index.js [opções]

Opções:
  --site-index <caminho>       (padrão: <raiz>/.data/site-index.json)
  --seo-audit <caminho>         (padrão: <raiz>/.data/seo-audit.json)
  --internal-linking <caminho>  (padrão: <raiz>/.data/internal-linking.json)
  --cannibalization <caminho>   (padrão: <raiz>/.data/cannibalization.json)
  --output <caminho>            (padrão: <raiz>/.data/content-strategy.json)
  --report <caminho>            (padrão: <raiz>/reports/content-strategy.md)
  --quiet                       Suprime o resumo no stdout
  --help                         Mostra esta ajuda e sai

Cruza dados já produzidos pelas fases anteriores da V2. Não acessa a
internet, não usa IA, não modifica nenhum artigo, não faz deploy.
`.trim();

function parseArgs(argv) {
  const args = { siteIndex: null, seoAudit: null, internalLinking: null, cannibalization: null, output: null, report: null, quiet: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') args.help = true;
    else if (a === '--quiet') args.quiet = true;
    else if (a === '--site-index') args.siteIndex = argv[++i];
    else if (a === '--seo-audit') args.seoAudit = argv[++i];
    else if (a === '--internal-linking') args.internalLinking = argv[++i];
    else if (a === '--cannibalization') args.cannibalization = argv[++i];
    else if (a === '--output') args.output = argv[++i];
    else if (a === '--report') args.report = argv[++i];
  }
  return args;
}

function defaultRoot() {
  return path.resolve(__dirname, '..', '..', '..');
}

function runStrategy({ siteIndex, seoAudit, internalLinking, cannibalization }) {
  resetIdCounter();

  const posts = siteIndex.posts || [];
  const { inventory } = buildInventory(posts, { seoAudit, internalLinking, cannibalization });
  const clusters = buildClusterViews(inventory);

  const opportunities = [
    ...buildUpdateExistingOpportunities(inventory),
    ...buildExpandExistingOpportunities(inventory),
    ...buildInternalLinkingOpportunities(inventory),
    ...buildFaqOpportunities(inventory),
    ...buildDifferentiateOpportunities(inventory),
    ...buildNewContentOpportunities(clusters),
  ];

  const consolidated = consolidate(opportunities);

  const opportunitiesByPage = new Set(consolidated.filter((o) => o.page).map((o) => o.page));
  const noAction = buildNoActionEntries(inventory, opportunitiesByPage);

  const priorities = { P0: 0, P1: 0, P2: 0, P3: 0 };
  for (const o of consolidated) priorities[o.priority] += 1;

  const pillarCount = inventory.filter((p) => p.role === ROLE.PILLAR).length;
  const clustersWithPillar = clusters.filter((c) => c.pillar).length;
  const thinClusters = clusters.filter((c) => c.coverage === 'THIN').length;

  const summary = {
    pages_analyzed: inventory.length,
    clusters_identified: clusters.length,
    total_opportunities: consolidated.length,
    no_action_count: noAction.length,
    pillar_count: pillarCount,
    clusters_with_pillar: clustersWithPillar,
    thin_clusters: thinClusters,
  };

  const limitations = [
    'NEW_CONTENT só é sugerido para lacunas estruturais de FORMATO dentro de clusters já estabelecidos (pilar + >=3 páginas) — não tenta adivinhar temas/keywords específicos não cobertos, nem detecta páginas intermediárias ausentes a partir de padrões de relação recorrentes (fora de escopo desta fase, ver seção "Fase 4 não é keyword research").',
    'Cluster é inferido, não lido de um campo confiável (site-index.json mantém `cluster` sempre null). Confiança "known" vem de relações reais já calculadas por Internal Linking/Cannibalization; "probable" vem de uma heurística fraca de overlap de slug/título; "unknown" quando nenhum sinal existe — nunca forçado.',
    'Content coverage por cluster (GOOD/PARTIAL/THIN) é uma classificação qualitativa simples baseada em formatos presentes e status de SEO — não uma métrica de completude editorial real.',
    'Sem acesso a volume de busca, CPC, tendências ou concorrência externa — todas as oportunidades refletem apenas o que os dados locais das fases 1-3 já sabem sobre o site.',
    'Datas de publicação/atualização não existem no site-index (sempre null), então "conteúdo desatualizado" não pode ser detectado por idade — só por sinais estruturais (SEO issues, canibalização, conectividade).',
  ];

  const result = {
    version: 1,
    generated_at: new Date().toISOString(),
    summary,
    priorities,
    opportunities: consolidated,
    clusters,
    pages: inventory.map((p) => ({
      url: p.url,
      slug: p.slug,
      title: p.title,
      role: p.role,
      cluster: p.cluster,
      cluster_confidence: p.cluster_confidence,
      word_count: p.word_count,
      inbound_links: p.inbound_links,
      outbound_links: p.outbound_links,
      seo_status: p.seo_status,
    })),
    no_action: noAction.map((n) => ({ page: n.page, reason: n.reason })),
    methodology: {
      summary: 'Cruza .data/site-index.json, seo-audit.json, internal-linking.json e cannibalization.json (fases 1-3) para gerar oportunidades editoriais determinísticas. Não usa APIs externas, não usa IA, não estima demanda de busca.',
      score_weights: WEIGHTS,
      confidence_points: CONFIDENCE_POINTS,
      priority_rules: 'Tipos gerais: P0 = score total >= 70; P1 = 50-69; P2 = 30-49; P3 = <30 ou NO_ACTION. DIFFERENTIATE_CONTENT (Fase 4.1, regra própria): confidence LOW -> P2/P3 (nunca P0/P1); envolve página PILLAR -> P0 se score>=60 ou confidence HIGH, senão P1; entre satélites -> P1 se score>=60, senão P2.',
    },
    limitations,
  };

  return result;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(HELP);
    return;
  }

  const root = defaultRoot();
  const sources = loadDataSources(root);

  // Permite sobrescrever caminhos individualmente via CLI, mas por padrão
  // usa o que loadDataSources já resolveu.
  const siteIndex = args.siteIndex ? JSON.parse(fs.readFileSync(path.resolve(args.siteIndex), 'utf8')) : sources.siteIndex;
  const seoAudit = args.seoAudit ? JSON.parse(fs.readFileSync(path.resolve(args.seoAudit), 'utf8')) : sources.seoAudit;
  const internalLinking = args.internalLinking ? JSON.parse(fs.readFileSync(path.resolve(args.internalLinking), 'utf8')) : sources.internalLinking;
  const cannibalization = args.cannibalization ? JSON.parse(fs.readFileSync(path.resolve(args.cannibalization), 'utf8')) : sources.cannibalization;

  const outputPath = path.resolve(args.output || path.join(root, '.data', 'content-strategy.json'));
  const reportPath = path.resolve(args.report || path.join(root, 'reports', 'content-strategy.md'));

  const result = runStrategy({ siteIndex, seoAudit, internalLinking, cannibalization });
  if (sources.missing.length > 0) {
    result.limitations.push(`Fontes de dados ausentes nesta execução: ${sources.missing.join(', ')} — oportunidades derivadas dessas fontes não puderam ser geradas.`);
  }

  const { jsonBytes, mdBytes } = writeReports({ jsonPath: outputPath, mdPath: reportPath, result });

  if (!args.quiet) {
    printReport({ result, outputPath, reportPath, jsonBytes, mdBytes });
  }
}

function printReport({ result, outputPath, reportPath, jsonBytes, mdBytes }) {
  const lines = [];
  lines.push('CONTENT STRATEGY ENGINE');
  lines.push('========================');
  lines.push('');
  lines.push(`Pages analyzed: ${result.summary.pages_analyzed}`);
  lines.push(`Clusters identified: ${result.summary.clusters_identified}`);
  lines.push(`Total opportunities: ${result.summary.total_opportunities}`);
  lines.push(`No action: ${result.summary.no_action_count}`);
  lines.push('');
  lines.push(`P0: ${result.priorities.P0}  P1: ${result.priorities.P1}  P2: ${result.priorities.P2}  P3: ${result.priorities.P3}`);
  lines.push('');
  lines.push('Output:');
  lines.push(`${outputPath} (${jsonBytes} bytes)`);
  lines.push(`${reportPath} (${mdBytes} bytes)`);
  console.log(lines.join('\n'));
}

if (require.main === module) {
  main();
}

module.exports = { main, parseArgs, defaultRoot, runStrategy };
