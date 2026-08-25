'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { buildPageProfile } = require('../../shared/profile');
const { scoreRelation, buildEvidence } = require('../src/scorer');

function post({ title, headings = [], cluster = null, slug = 'exemplo', page_type = 'post', faqSchema = false }) {
  return {
    path: `${slug}/index.html`,
    slug,
    title,
    cluster,
    page_type,
    headings: headings.map((t) => ({ tag: 'h2', text: t, empty: false })),
    faq: { detected: faqSchema, schema_detected: faqSchema, heading_detected: false, question_count: faqSchema ? 3 : 0 },
    content: { word_count: 500 },
    heading_summary: { h2_count: headings.length },
  };
}

function profile(opts) {
  const p = post(opts);
  return buildPageProfile(p, opts.content || '');
}

test('scorer: páginas com title/heading/conteúdo muito semelhantes recebem score alto', () => {
  const a = profile({
    slug: 'coleira-gps-para-cachorro-pequeno',
    title: 'Coleira GPS para Cachorro Pequeno: Guia Completo',
    headings: ['Como escolher coleira GPS', 'Autonomia da bateria'],
    content: 'coleira gps cachorro pequeno bateria autonomia rastreamento tempo real',
  });
  const b = profile({
    slug: 'coleira-gps-cachorro-pequeno-porte',
    title: 'Coleira GPS Cachorro Pequeno Porte: Vale a Pena?',
    headings: ['Autonomia da bateria da coleira GPS'],
    content: 'coleira gps cachorro pequeno porte bateria autonomia rastreamento',
  });

  const { score } = scoreRelation(a, b);
  assert.ok(score >= 50, `esperado score alto, obtido ${score}`);
});

test('scorer: páginas sobre temas completamente diferentes recebem score baixo', () => {
  const a = profile({
    slug: 'coleira-gps-para-cachorro',
    title: 'Coleira GPS para Cachorro: Guia Completo',
    content: 'coleira gps rastreamento bateria autonomia sinal bluetooth chip',
  });
  const b = profile({
    slug: 'politica-editorial',
    title: 'Política Editorial e de Afiliados',
    content: 'fontes verificacao links afiliados correcoes atualizacao conteudo transparencia',
  });

  const { score } = scoreRelation(a, b);
  assert.ok(score < 20, `esperado score baixo, obtido ${score}`);
});

test('scorer: score é determinístico (mesma entrada produz mesmo resultado)', () => {
  const a = profile({ slug: 'a', title: 'Comedouro Automático para Pet', content: 'comedouro automatico racao pet wifi app' });
  const b = profile({ slug: 'b', title: 'Comedouro Automático Vale a Pena?', content: 'comedouro automatico racao vale pena' });

  const r1 = scoreRelation(a, b);
  const r2 = scoreRelation(a, b);
  assert.equal(r1.score, r2.score);
  assert.deepEqual(r1.components, r2.components);
});

test('scorer: mesmo cluster contribui com o peso CLUSTER quando ambos têm cluster igual e não-nulo', () => {
  const a = profile({ slug: 'a', title: 'Post A', content: 'texto qualquer', cluster: 'comedouro' });
  const b = profile({ slug: 'b', title: 'Post B completamente diferente', content: 'outro texto', cluster: 'comedouro' });

  const { components } = scoreRelation(a, b);
  assert.equal(components.cluster.overlap, 1);
  assert.ok(components.cluster.contribution > 0);
});

test('scorer: cluster nulo em ambos os lados não contribui (evita falso positivo null===null)', () => {
  const a = profile({ slug: 'a', title: 'Post A', content: 'texto', cluster: null });
  const b = profile({ slug: 'b', title: 'Post B', content: 'outro', cluster: null });

  const { components } = scoreRelation(a, b);
  assert.equal(components.cluster.overlap, 0);
});

test('buildEvidence: só inclui sinais que realmente contribuíram (sem evidência vazia/enganosa)', () => {
  const a = profile({ slug: 'a', title: 'Coleira GPS para Cachorro', content: 'coleira gps cachorro rastreamento' });
  const b = profile({ slug: 'b', title: 'Comedouro Automático', content: 'comedouro racao automatico' });

  const { components } = scoreRelation(a, b);
  const evidence = buildEvidence(a, b, components);
  // termos completamente diferentes -> nenhuma evidência de overlap textual
  assert.equal(evidence.length, 0);
});

// ------------------------------------------------------------- Fase 3.1

test('scorer: relação pilar↔satélite soma o bônus PILLAR_SATELLITE', () => {
  const pillarPost = post({ slug: 'coleira-gps-para-pet', title: 'Coleira GPS para Cachorro e Gato: Guia Completo' });
  const faqPost = post({ slug: 'duvidas-coleira-gps-pet', title: 'Coleira GPS: Perguntas Frequentes', faqSchema: true });

  const a = buildPageProfile(pillarPost, 'coleira gps cachorro rastreamento bateria autonomia bluetooth');
  const b = buildPageProfile(faqPost, 'coleira gps cachorro rastreamento bateria autonomia duvidas');

  const { components, relationship } = scoreRelation(a, b, pillarPost, faqPost, { inboundCount: 24 }, { inboundCount: 4 });
  assert.equal(relationship, 'pillar_satellite');
  assert.ok(components.pillar_satellite.contribution > 0);
});

test('scorer: páginas-pilar sem relação real, compartilhando só "Guia Completo 2026", recebem score baixo', () => {
  const pillarA = post({ slug: 'coleira-gps-para-pet', title: 'Coleira GPS para Cachorro e Gato: Guia Completo 2026' });
  const pillarB = post({ slug: 'comedouro-automatico-para-pet', title: 'Comedouro Automático para Pet: Guia Completo de 2026' });

  const a = buildPageProfile(pillarA, 'coleira gps rastreamento bateria bluetooth sinal chip localizacao');
  const b = buildPageProfile(pillarB, 'comedouro racao porcao horario dispensador automatico wifi app');

  const { score } = scoreRelation(a, b, pillarA, pillarB, { inboundCount: 25 }, { inboundCount: 25 });
  assert.ok(score < 35, `esperado score abaixo do MIN_SCORE apesar da frase padrão compartilhada, obtido ${score}`);
});
