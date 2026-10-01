'use strict';

/**
 * Seleção de formato por artigo (V2) — decisão EDITORIAL, não algorítmica.
 *
 * Esta tabela é o resultado de ler `body_text_full` dos 10 artigos do
 * piloto e julgar, artigo por artigo, se existe material real e
 * específico o suficiente para sustentar cada formato — não uma
 * contagem de headings/palavras/imagens (isso já existia em
 * `format_potential` do analyze-article.js e é só um proxy fraco).
 *
 * Por isso isto é dado estático, não uma função de heurística: o
 * princípio acordado com o usuário é "artigo completo -> leitura ->
 * decisão editorial -> peça específica", e essa leitura foi feita por
 * Claude para este piloto de 10 artigos. Ao escalar para os ~62
 * artigos restantes, o mesmo processo de leitura + julgamento se
 * repete artigo por artigo — não vira uma fórmula automática nova.
 *
 * `included` lista os formatos com material suficiente. `excluded`
 * documenta os formatos deliberadamente não gerados e por quê — nunca
 * "faltou heading", sempre a razão editorial real.
 */

const FORMAT_SELECTION = {
  'comedouro-gato-x-cachorro-diferenca': {
    included: ['reel', 'post', 'carousel', 'stories', 'engagement'],
    excluded: [],
    rationale: 'Artigo rico: 8 headings distintos com conteúdo real (porção, ração úmida, casas multi-pet, formato do pote, erros comuns), 4 perguntas de FAQ genuínas. Material sustenta os 5 formatos sem preencher.',
  },
  'bebedouro-inox-x-ceramica': {
    included: ['reel', 'post', 'carousel', 'stories', 'engagement'],
    excluded: [],
    rationale: 'Comparação tecnicamente densa (condutividade térmica, risco de quebra, comportamento felino) com tabela comparativa própria e 4 perguntas de FAQ reais. Sustenta os 5 formatos.',
  },
  'comedouro-com-ou-sem-wifi': {
    included: ['reel', 'post', 'carousel', 'stories', 'engagement'],
    excluded: [],
    rationale: 'Vantagens/desvantagens dos dois lados bem desenvolvidas, causa de falha de configuração específica (5GHz), tabela comparativa, 4 perguntas de FAQ reais. Sustenta os 5 formatos.',
  },
  'coleira-gps-x-microchip': {
    included: ['reel', 'post', 'carousel', 'engagement'],
    excluded: [
      { format: 'stories', reason: 'Nenhuma pergunta real (heading terminado em "?") no artigo — enquete exigiria formular pergunta não presente na fonte. Não gerada.' },
    ],
    rationale: 'Artigo mais curto (593 palavras) mas com 4 blocos de conteúdo distintos e reais (o que é microchip, o que é coleira GPS, tabela comparativa, por que usar os dois) — suficiente para Reel/Post/Carousel/Engagement. Sem heading-pergunta na fonte, então Stories fica de fora.',
  },
  'coleira-gps-bluetooth-x-chip-operadora': {
    included: ['reel', 'post', 'carousel', 'engagement'],
    excluded: [
      { format: 'stories', reason: 'Nenhuma pergunta real (heading terminado em "?") no artigo. Não gerada.' },
    ],
    rationale: 'Mesma estrutura do par coleira-gps-x-microchip: 4 blocos reais (como funciona bluetooth, como funciona chip operadora, tabela, qual escolher). Sem heading-pergunta, Stories fica de fora.',
  },
  'camera-para-monitorar-pet': {
    included: ['reel', 'post', 'carousel', 'stories', 'engagement'],
    excluded: [],
    rationale: 'Artigo pilar do cluster câmera: specs reais de modelo (TP-Link Tapo C200), tabela de recursos, comparação com coleira GPS, 3 perguntas de FAQ reais. Sustenta os 5 formatos.',
  },
  'duvidas-camera-para-monitorar-pet': {
    included: ['reel', 'post', 'stories', 'engagement'],
    excluded: [
      { format: 'carousel', reason: 'Apenas 3 blocos de conteúdo distintos e sustentáveis (mínimo do formato é 6) — gerar forçaria preenchimento com headings de FAQ repetidos. Não gerado (mesma conclusão do V1 para este artigo).' },
    ],
    rationale: 'Artigo curto e satélite de FAQ (611 palavras) — sustenta Reel/Post/Stories/Engagement com boas respostas específicas (SD card, banda 2,4GHz), mas não tem material distinto o bastante para 6+ slides de carrossel sem repetir o artigo-pilar.',
  },
  'cercado-para-cachorros': {
    included: ['reel', 'post', 'carousel', 'stories', 'engagement'],
    excluded: [],
    rationale: 'Review extenso (2050 palavras, 5 imagens próprias, 4 perguntas de FAQ reais) com dado estatístico próprio (IBGE) e racional específico de uso (formato octogonal x painéis vazados). Sustenta os 5 formatos com folga.',
  },
  'tapete-higienico-para-cachorro': {
    included: ['reel', 'post', 'carousel', 'stories', 'engagement'],
    excluded: [],
    rationale: 'Review extenso (2040 palavras, 4 imagens próprias, 4 perguntas de FAQ reais) com fonte técnica citada (UFRGS) e dado do Censo IBGE. Sustenta os 5 formatos com folga.',
  },
  'porta-eletronica-gato-x-cachorro-diferenca': {
    included: ['reel', 'post', 'engagement'],
    excluded: [
      { format: 'carousel', reason: 'Artigo mais curto do piloto (432 palavras) — só 3 blocos de conteúdo real (vão de passagem, resistência estrutural, múltiplas espécies) abaixo do mínimo de 6 slides sustentáveis. Gerar inflaria o carrossel com slide de conclusão/CTA vazios. Não gerado.' },
      { format: 'stories', reason: 'Nenhuma pergunta real (heading terminado em "?") no artigo. Não gerada.' },
    ],
    rationale: 'Artigo curto e específico (dimensões técnicas de vão de passagem). Material real sustenta Reel/Post/Engagement; Carousel e Stories ficam de fora por falta de material genuíno, não por regra fixa.',
  },
};

function getFormatSelection(slug) {
  return FORMAT_SELECTION[slug] || null;
}

module.exports = { FORMAT_SELECTION, getFormatSelection };
