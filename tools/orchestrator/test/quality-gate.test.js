'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { parseHtmlContent } = require('../../site-indexer/src/parser');
const { analyzePost } = require('../../site-indexer/src/analyzer');
const { extractBodyText } = require('../../shared/html-text');
const {
  runQualityGate,
  checkSchemaVsVisible,
  checkPersonalExperienceClaims,
  checkKeywordDensity,
  checkImagesExistOnDisk,
  LEVEL,
} = require('../src/quality-gate');

function indexHtml(html, relPath = 'fixture/index.html') {
  const parsed = parseHtmlContent(html);
  return analyzePost(relPath, parsed);
}

function baseHtml({ h1 = '<h1>Título Válido de Teste</h1>', description = '<meta name="description" content="Uma descrição de teste com tamanho razoável para passar despercebida." />', extraHead = '', body = '', img = '<img src="hero.jpg" alt="Imagem de teste" width="800" height="600" />' } = {}) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<title>Título Válido de Teste</title>
${description}
<link rel="canonical" href="https://smartpetgadgets.com.br/fixture/" />
${extraHead}
</head>
<body>
${h1}
${img}
<p>${body || 'Parágrafo de conteúdo real com bastante texto para não disparar CONTENT_MISSING nem CONTENT_TOO_SHORT durante os testes automatizados deste artigo de exemplo, repetindo um pouco mais para garantir contagem de palavras suficiente e evitar falso positivo nos testes.'}</p>
</body>
</html>`;
}

test('checkImagesExistOnDisk: BLOCKER quando imagem referenciada não existe no disco', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qg-img-'));
  const html = '<img src="nao-existe.jpg" alt="x" />';
  const findings = checkImagesExistOnDisk(dir, html);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].id, 'BROKEN_IMAGE_REFERENCE');
  assert.equal(findings[0].severity, LEVEL.BLOCKER);
});

test('checkImagesExistOnDisk: sem finding quando a imagem existe', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qg-img-'));
  fs.writeFileSync(path.join(dir, 'existe.jpg'), 'fake-bytes');
  const html = '<img src="existe.jpg" alt="x" />';
  assert.deepEqual(checkImagesExistOnDisk(dir, html), []);
});

test('checkImagesExistOnDisk: ignora URLs absolutas e data URIs', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qg-img-'));
  const html = '<img src="https://exemplo.com/x.jpg" /><img src="data:image/png;base64,AAAA" />';
  assert.deepEqual(checkImagesExistOnDisk(dir, html), []);
});

test('checkSchemaVsVisible: BLOCKER quando FAQPage declara perguntas sem heading de FAQ visível', () => {
  const html = baseHtml({
    extraHead: `<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"O produto funciona sem energia elétrica?","acceptedAnswer":{"@type":"Answer","text":"Sim."}}]}</script>`,
  });
  const post = indexHtml(html);
  const bodyText = extractBodyText(html);
  const findings = checkSchemaVsVisible(post, html, bodyText);
  assert.ok(findings.some((f) => f.id === 'SCHEMA_FAQ_WITHOUT_VISIBLE_HEADING' && f.severity === LEVEL.BLOCKER));
});

test('checkSchemaVsVisible: sem finding de FAQ quando pergunta e heading batem', () => {
  const html = baseHtml({
    extraHead: `<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"O produto funciona sem energia eletrica","acceptedAnswer":{"@type":"Answer","text":"Sim."}}]}</script>`,
    body: 'Perguntas Frequentes sobre funciona sem energia eletrica aqui explicado em detalhes para o leitor.',
    h1: '<h1>Título Válido de Teste</h1><h2>Perguntas Frequentes</h2><h3>O produto funciona sem energia eletrica</h3>',
  });
  const post = indexHtml(html);
  const bodyText = extractBodyText(html);
  const findings = checkSchemaVsVisible(post, html, bodyText);
  assert.equal(findings.filter((f) => f.category === 'schema' && f.id.startsWith('SCHEMA_FAQ')).length, 0);
});

test('checkSchemaVsVisible: BLOCKER quando Review declara nota que não aparece no texto', () => {
  const html = baseHtml({
    extraHead: `<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"X","review":{"@type":"Review","reviewRating":{"@type":"Rating","ratingValue":"9.7","bestRating":"10"}}}</script>`,
  });
  const post = indexHtml(html);
  const bodyText = extractBodyText(html);
  const findings = checkSchemaVsVisible(post, html, bodyText);
  assert.ok(findings.some((f) => f.id === 'SCHEMA_RATING_NOT_VISIBLE' && f.severity === LEVEL.BLOCKER));
});

test('checkSchemaVsVisible: sem finding quando a nota aparece visivelmente (com vírgula ou ponto)', () => {
  const html = baseHtml({
    extraHead: `<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"X","review":{"@type":"Review","reviewRating":{"@type":"Rating","ratingValue":"8.3","bestRating":"10"}}}</script>`,
    body: 'Nota final: 8,3/10 neste review completo do produto testado com metodologia clara.',
  });
  const post = indexHtml(html);
  const bodyText = extractBodyText(html);
  const findings = checkSchemaVsVisible(post, html, bodyText);
  assert.equal(findings.filter((f) => f.id === 'SCHEMA_RATING_NOT_VISIBLE').length, 0);
});

test('checkPersonalExperienceClaims: BLOCKER quando afirma teste pessoal sem confirmação', () => {
  const findings = checkPersonalExperienceClaims('Neste artigo, testamos o produto por duas semanas.', false);
  assert.ok(findings.some((f) => f.id === 'UNVERIFIED_PERSONAL_EXPERIENCE_CLAIM' && f.severity === LEVEL.BLOCKER));
});

test('checkPersonalExperienceClaims: sem finding quando personalExperienceConfirmed é true', () => {
  const findings = checkPersonalExperienceClaims('Neste artigo, testamos o produto por duas semanas.', true);
  assert.deepEqual(findings, []);
});

test('checkPersonalExperienceClaims: sem finding para texto sem claim de experiência', () => {
  const findings = checkPersonalExperienceClaims('Segundo o fabricante, o produto suporta até 20kg.', false);
  assert.deepEqual(findings, []);
});

test('checkKeywordDensity: sem finding em densidade normal', () => {
  const body = 'comedouro automático é um produto útil. ' + 'texto neutro sobre pets em geral. '.repeat(20);
  assert.deepEqual(checkKeywordDensity(body, 'comedouro automático'), []);
});

test('checkKeywordDensity: WARNING (não BLOCKER) em densidade moderadamente alta', () => {
  // 3 ocorrências (2 palavras cada) em 120 palavras totais ~= 5% de
  // densidade — dentro da faixa WARNING (3%-8%), abaixo do limiar BLOCKER.
  const body = Array(3).fill('comedouro automático').join(' ') + ' ' + 'palavra '.repeat(114);
  const findings = checkKeywordDensity(body, 'comedouro automático');
  assert.ok(findings.length > 0);
  assert.equal(findings[0].severity, LEVEL.WARNING);
});

test('checkKeywordDensity: BLOCKER só em caso absurdo de densidade', () => {
  const body = Array(40).fill('comedouro automático').join(' ');
  const findings = checkKeywordDensity(body, 'comedouro automático');
  assert.ok(findings.some((f) => f.severity === LEVEL.BLOCKER));
});

// ---------------------------------------------------------------------
// Cenários end-to-end exigidos pela Etapa 7
// ---------------------------------------------------------------------

function loadRealSiteIndex() {
  const root = path.resolve(__dirname, '..', '..', '..');
  const siteIndexPath = path.join(root, '.data', 'site-index.json');
  if (!fs.existsSync(siteIndexPath)) return null;
  return { root, siteIndex: JSON.parse(fs.readFileSync(siteIndexPath, 'utf8')) };
}

test('Cenário A — artigo saudável real: APPROVED, 0 BLOCKER', { skip: !loadRealSiteIndex() }, () => {
  const { root, siteIndex } = loadRealSiteIndex();
  const slug = 'tapete-higienico-para-cachorro';
  const articleDir = path.join(root, slug);
  const html = fs.readFileSync(path.join(articleDir, 'index.html'), 'utf8');
  const post = indexHtml(html, `${slug}/index.html`);
  const bodyText = extractBodyText(html);
  const allPosts = siteIndex.posts.filter((p) => p.slug !== slug);

  const result = runQualityGate({ post, html, bodyText, articleDir, allPosts, keyword: null });

  assert.equal(result.status, 'APPROVED');
  assert.equal(result.summary.blockers, 0);
});

test('Cenário B — artigo propositalmente quebrado: BLOCKED, com os BLOCKERs esperados apontados', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qg-quebrado-'));
  const slugDir = path.join(dir, 'artigo-quebrado');
  fs.mkdirSync(slugDir, { recursive: true });

  // Propositalmente: sem H1, sem meta description, imagem inexistente,
  // FAQPage schema sem heading de FAQ visível.
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<title>Artigo Quebrado</title>
<link rel="canonical" href="https://smartpetgadgets.com.br/artigo-quebrado/" />
<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Isso realmente funciona sozinho sem nenhuma ajuda","acceptedAnswer":{"@type":"Answer","text":"Sim."}}]}</script>
</head>
<body>
<img src="nao-existe.jpg" alt="imagem" />
<p>Texto de corpo comum, sem H1 nenhum nesta página, só para ocupar espaço e simular um artigo real com palavras suficientes no corpo para não disparar erro de conteúdo vazio, propositalmente quebrado para o teste da Etapa 7.</p>
</body>
</html>`;
  fs.writeFileSync(path.join(slugDir, 'index.html'), html, 'utf8');

  const post = indexHtml(html, 'artigo-quebrado/index.html');
  const bodyText = extractBodyText(html);

  const result = runQualityGate({ post, html, bodyText, articleDir: slugDir, allPosts: [] });

  assert.equal(result.status, 'BLOCKED');
  assert.ok(result.summary.blockers > 0);

  const ids = result.findings.filter((f) => f.severity === 'BLOCKER').map((f) => f.id);
  assert.ok(ids.includes('H1_MISSING'), `esperava H1_MISSING entre os BLOCKERs, veio: ${ids.join(', ')}`);
  assert.ok(ids.includes('BROKEN_IMAGE_REFERENCE'), `esperava BROKEN_IMAGE_REFERENCE, veio: ${ids.join(', ')}`);
  assert.ok(
    ids.includes('SCHEMA_FAQ_WITHOUT_VISIBLE_HEADING') || ids.includes('SCHEMA_FAQ_QUESTIONS_NOT_FOUND_IN_TEXT'),
    `esperava algum BLOCKER de FAQ sem conteúdo visível, veio: ${ids.join(', ')}`
  );
});

test('Cenário C — artigo com apenas problema não crítico: APPROVED com WARNING > 0 e BLOCKER = 0', () => {
  // Sem meta description (WARNING no seo-auditor) é o único problema
  // intencional. Para não disparar BLOCKERs *não relacionados* ao que o
  // cenário quer testar (conteúdo curto demais, página órfã — ambos
  // ERROR/BLOCKER por bom motivo no seo-auditor real), o fixture precisa
  // de: corpo com >=150 palavras, e pelo menos um link de entrada real
  // (simulado por um post "existente" que já linka para este artigo).
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qg-warning-'));
  const slugDir = path.join(dir, 'artigo-com-warning');
  fs.mkdirSync(slugDir, { recursive: true });
  fs.writeFileSync(path.join(slugDir, 'hero.jpg'), 'fake-bytes');

  const paragraph = Array(30).fill('palavra').join(' ');
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<title>Artigo Com Apenas Warning</title>
<link rel="canonical" href="https://smartpetgadgets.com.br/artigo-com-warning/" />
</head>
<body>
<h1>Artigo Com Apenas Warning</h1>
<img src="hero.jpg" alt="Imagem de exemplo" width="800" height="600" />
<p>Texto de corpo com bastante conteúdo real, H1 presente e imagem existente no disco, mas propositalmente sem meta description para gerar apenas um warning nesta validação da Etapa 7, sem nenhum outro problema estrutural mais grave presente aqui. ${paragraph} ${paragraph} ${paragraph} ${paragraph} ${paragraph}</p>
<p><a href="https://smartpetgadgets.com.br/outro-artigo/">outro artigo relacionado</a></p>
</body>
</html>`;
  fs.writeFileSync(path.join(slugDir, 'index.html'), html, 'utf8');

  const post = indexHtml(html, 'artigo-com-warning/index.html');
  const bodyText = extractBodyText(html);

  const existingPostLinkingToThis = {
    path: 'outro-artigo/index.html',
    slug: 'outro-artigo',
    url_path: '/outro-artigo/',
    page_type: 'post',
    title: 'Coleira GPS para Cachorro de Grande Porte',
    headings: [{ tag: 'h1', text: 'Coleira GPS para Cachorro de Grande Porte', empty: false }],
    internal_links: [{ href: 'https://smartpetgadgets.com.br/artigo-com-warning/', anchor_text: 'saiba mais sobre este outro tema' }],
    faq: { detected: false, schema_detected: false, heading_detected: false, question_count: 0 },
  };

  const result = runQualityGate({ post, html, bodyText, articleDir: slugDir, allPosts: [existingPostLinkingToThis] });

  assert.equal(result.status, 'APPROVED', `esperava APPROVED, BLOCKERs: ${JSON.stringify(result.findings.filter((f) => f.severity === 'BLOCKER'))}`);
  assert.equal(result.summary.blockers, 0);
  assert.ok(result.summary.warnings > 0, 'esperava pelo menos 1 warning (DESCRIPTION_MISSING)');
  const warningIds = result.findings.filter((f) => f.severity === 'WARNING').map((f) => f.id);
  assert.ok(warningIds.includes('DESCRIPTION_MISSING'), `esperava DESCRIPTION_MISSING, veio: ${warningIds.join(', ')}`);
});
