'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { buildPageProfile } = require('../../shared/profile');
const { scoreCannibalization, classify, buildSignals } = require('../src/scorer');

function post({ slug = 'exemplo', title, headings = [], page_type = 'post', faqSchema = false }) {
  return {
    path: `${slug}/index.html`,
    slug,
    title,
    page_type,
    cluster: null,
    headings: headings.map((t) => ({ tag: 'h2', text: t, empty: false })),
    faq: { detected: faqSchema, schema_detected: faqSchema, heading_detected: false, question_count: faqSchema ? 3 : 0 },
    content: { word_count: 500 },
    heading_summary: { h2_count: headings.length },
  };
}

function profileFor(p, content = '') {
  return buildPageProfile(p, content);
}

test('classify: faixas 0-39 low, 40-69 possible, 70-100 high', () => {
  assert.equal(classify(0), 'low');
  assert.equal(classify(39), 'low');
  assert.equal(classify(40), 'possible');
  assert.equal(classify(69), 'possible');
  assert.equal(classify(70), 'high');
  assert.equal(classify(100), 'high');
});

test('scorer: títulos quase idênticos + slugs semelhantes -> score alto (possível canibalização)', () => {
  const postA = post({ slug: 'melhor-comedouro-automatico-cachorro', title: 'Comedouro Automático para Cachorro: Análise Detalhada', headings: ['Como funciona', 'Top modelos'] });
  const postB = post({ slug: 'melhor-comedouro-automatico-cao', title: 'Comedouro Automático para Cão: Análise Detalhada', headings: ['Como funciona', 'Modelos recomendados'] });
  const a = profileFor(postA, 'comedouro automatico cachorro racao porcao horario app wifi');
  const b = profileFor(postB, 'comedouro automatico cao racao porcao horario app wifi');

  const { score, level } = scoreCannibalization(a, b, postA, postB);
  assert.ok(score >= 60, `esperado score alto, obtido ${score}`);
  assert.ok(['possible', 'high'].includes(level));
});

test('scorer: conteúdo complementar (comparativo técnico vs. how-to) tem score mais baixo', () => {
  const postA = post({ slug: 'camera-pet-resolucao-1080p-x-2k', title: 'Câmera Pet: 1080p ou 2K — Qual Resolução Escolher?' });
  const postB = post({ slug: 'como-configurar-camera-pet-wifi', title: 'Como Configurar Câmera Pet Wi-Fi Passo a Passo' });
  const a = profileFor(postA, 'camera pet resolucao 1080p 2k qualidade imagem nitidez comparacao');
  const b = profileFor(postB, 'camera pet configurar wifi aplicativo conexao rede senha passo');

  const { score } = scoreCannibalization(a, b, postA, postB);
  assert.ok(score < 60, `esperado score moderado/baixo, obtido ${score}`);
});

test('scorer: título com padrão comparativo ("X vs Y") gera sinal de diferenciação', () => {
  const postA = post({ slug: 'a', title: 'Câmera Pet 1080p vs 2K: Qual Escolher?' });
  const postB = post({ slug: 'b', title: 'Como Escolher a Resolução da Câmera Pet' });
  const a = profileFor(postA, 'camera resolucao qualidade');
  const b = profileFor(postB, 'camera resolucao qualidade escolher');

  const { differentiationSignals } = scoreCannibalization(a, b, postA, postB);
  assert.ok(differentiationSignals.some((s) => /comparativo/i.test(s)));
});

test('buildSignals: só inclui sinais com overlap real', () => {
  const postA = post({ slug: 'a', title: 'Coleira GPS Cachorro' });
  const postB = post({ slug: 'b', title: 'Comedouro Automático' });
  const a = profileFor(postA, 'coleira gps cachorro rastreamento');
  const b = profileFor(postB, 'comedouro racao automatico');
  const { components } = scoreCannibalization(a, b, postA, postB);
  const signals = buildSignals(a, b, components);
  assert.equal(signals.length, 0);
});

// ------------------------------------------------------------- Fase 3.1

test('scorer: pilar (alto inbound) + FAQ relacionado -> level complementary, não high/possible', () => {
  const pillarPost = post({ slug: 'coleira-gps-para-pet', title: 'Coleira GPS para Cachorro e Gato: Guia Completo 2026', headings: ['Como funciona', 'Modelos', 'Preço'] });
  const faqPost = post({ slug: 'duvidas-coleira-gps-pet', title: 'Coleira GPS para Pet: Perguntas Frequentes', headings: ['Funciona sem chip?'], faqSchema: true });

  const a = profileFor(pillarPost, 'coleira gps cachorro gato rastreamento bateria autonomia bluetooth sinal preco modelos');
  const b = profileFor(faqPost, 'coleira gps cachorro gato rastreamento bateria autonomia bluetooth sinal duvidas perguntas');

  const { level, relationship } = scoreCannibalization(a, b, pillarPost, faqPost, { inboundCount: 25 }, { inboundCount: 4 });
  assert.equal(relationship, 'pillar_satellite');
  assert.equal(level, 'complementary');
});

test('scorer: pilar + troubleshooting (erros-comuns) relacionado -> complementary', () => {
  const pillarPost = post({ slug: 'porta-eletronica-automatica-para-pet', title: 'Porta Eletrônica Automática para Pet: Guia Completo' });
  const troubleshootingPost = post({ slug: 'erros-comuns-porta-eletronica-pet', title: 'Erros Comuns ao Usar Porta Eletrônica para Pet' });

  const a = profileFor(pillarPost, 'porta eletronica pet automatica microchip rfid sensor instalacao');
  const b = profileFor(troubleshootingPost, 'porta eletronica pet erros comuns microchip rfid sensor instalacao');

  const { level, relationship } = scoreCannibalization(a, b, pillarPost, troubleshootingPost, { inboundCount: 23 }, { inboundCount: 7 });
  assert.equal(relationship, 'pillar_satellite');
  assert.equal(level, 'complementary');
});

test('scorer: pilar + how_to relacionado -> complementary', () => {
  const pillarPost = post({ slug: 'camera-para-monitorar-pet', title: 'Câmera para Monitorar Pet: Guia Completo' });
  const howToPost = post({ slug: 'como-configurar-camera-pet-wifi', title: 'Como Configurar Câmera Pet Wi-Fi' });

  const a = profileFor(pillarPost, 'camera pet monitorar wifi app conexao rede resolucao visao noturna');
  const b = profileFor(howToPost, 'camera pet configurar wifi app conexao rede senha passo');

  const { level, relationship } = scoreCannibalization(a, b, pillarPost, howToPost, { inboundCount: 23 }, { inboundCount: 6 });
  assert.equal(relationship, 'pillar_satellite');
  assert.equal(level, 'complementary');
});

test('scorer: dois conteúdos realmente concorrentes (mesmo formato, nenhum é pilar) -> não complementary', () => {
  const reviewA = post({ slug: 'comedouro-newpet-2l-review', title: 'Comedouro Newpet 2L: Vale a Pena? Review' });
  const reviewB = post({ slug: 'comedouro-newpet-4l-review', title: 'Comedouro Newpet 4L: Vale a Pena? Review' });

  const a = profileFor(reviewA, 'comedouro newpet 2l racao porcao app wifi vale pena review');
  const b = profileFor(reviewB, 'comedouro newpet 4l racao porcao app wifi vale pena review');

  const { level, relationship, score } = scoreCannibalization(a, b, reviewA, reviewB, { inboundCount: 5 }, { inboundCount: 5 });
  assert.equal(relationship, 'same_format');
  assert.notEqual(level, 'complementary');
  assert.ok(score >= 40, `esperado score real de possível canibalização, obtido ${score}`);
});

// ------------------------------------------------------------- Fase 4.2

test('scorer: pilar + satélite INFORMATIONAL do mesmo cluster (sem prefixo de slug) -> complementary (achado real da Fase 4.1)', () => {
  const pillarPost = post({ slug: 'porta-eletronica-automatica-para-pet', title: 'Porta Eletrônica Automática para Pet: Guia Completo' });
  const informationalSatellite = post({ slug: 'porta-eletronica-impede-entrada-outros-animais', title: 'Porta Eletrônica Impede a Entrada de Outros Animais?' });

  const a = profileFor(pillarPost, 'porta eletronica pet automatica microchip rfid sensor instalacao outros animais entrada');
  const b = profileFor(informationalSatellite, 'porta eletronica pet impede entrada outros animais microchip rfid sensor');

  const { level, relationship, score } = scoreCannibalization(a, b, pillarPost, informationalSatellite, { inboundCount: 23 }, { inboundCount: 4 });
  assert.equal(relationship, 'pillar_satellite');
  assert.equal(level, 'complementary');
  assert.ok(score >= 60, `esperado score alto para confirmar que a evidência de overlap era real, obtido ${score}`);
});

test('scorer: pilar + página INFORMATIONAL de outro cluster (baixo overlap) NÃO vira pillar_satellite', () => {
  const pillarPost = post({ slug: 'coleira-gps-para-pet', title: 'Coleira GPS para Cachorro e Gato: Guia Completo' });
  const unrelatedInformational = post({ slug: 'algum-post-sem-prefixo', title: 'Assunto Totalmente Diferente Sobre Outro Tema' });

  const a = profileFor(pillarPost, 'coleira gps rastreamento bateria bluetooth sinal chip localizacao');
  const b = profileFor(unrelatedInformational, 'assunto totalmente diferente outro tema nada a ver');

  const { relationship } = scoreCannibalization(a, b, pillarPost, unrelatedInformational, { inboundCount: 24 }, { inboundCount: 2 });
  assert.notEqual(relationship, 'pillar_satellite');
});

test('scorer: how_to + troubleshooting sobre o mesmo tema (nenhum é pilar) -> complementary (não high automático)', () => {
  const howToPost = post({ slug: 'como-instalar-porta-eletronica-pet', title: 'Como Instalar Porta Eletrônica para Pet: Passo a Passo' });
  const troubleshootingPost = post({ slug: 'erros-comuns-porta-eletronica-pet', title: 'Erros Comuns ao Instalar Porta Eletrônica para Pet' });

  const a = profileFor(howToPost, 'porta eletronica pet instalar vidro microchip rfid sensor');
  const b = profileFor(troubleshootingPost, 'porta eletronica pet erros comuns instalar vidro microchip rfid sensor');

  const { level, relationship } = scoreCannibalization(a, b, howToPost, troubleshootingPost, { inboundCount: 5 }, { inboundCount: 4 });
  assert.equal(relationship, 'differentiated_satellites');
  assert.equal(level, 'complementary');
});

test('scorer: páginas diferentes compartilhando "Guia Completo 2026" não têm score elevado artificialmente', () => {
  const pillarA = post({ slug: 'coleira-gps-para-pet', title: 'Coleira GPS para Cachorro e Gato: Guia Completo 2026' });
  const pillarB = post({ slug: 'comedouro-automatico-para-pet', title: 'Comedouro Automático para Pet: Guia Completo de 2026' });

  const a = profileFor(pillarA, 'coleira gps rastreamento bateria bluetooth sinal chip localizacao');
  const b = profileFor(pillarB, 'comedouro racao porcao horario dispensador automatico wifi app');

  const { score } = scoreCannibalization(a, b, pillarA, pillarB, { inboundCount: 25 }, { inboundCount: 25 });
  assert.ok(score < 40, `esperado score baixo apesar da frase padrão compartilhada, obtido ${score}`);
});
