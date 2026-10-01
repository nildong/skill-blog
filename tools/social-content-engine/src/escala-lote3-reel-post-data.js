'use strict';

/**
 * Reel + Post V2 — ESCALA, Lote 3 (9 artigos: fecha por completo o cluster
 * comedouro-automatico-para-pet). Mesmo princípio: fato específico do
 * corpo, nunca preço, `source.source_excerpt` literal.
 */

const DOMAIN = 'https://smartpetgadgets.com.br';

function reel({ slug, hook, problema, informacao, solucaoLabel, objetivo, sourceExcerpt, section }) {
  return {
    content_id: `${slug}-reel-v2-01`,
    hook,
    roteiro: { problema, informacao, solucao: `${solucaoLabel}: ${DOMAIN}/${slug}/` },
    cta: `Confira o guia completo: ${DOMAIN}/${slug}/`,
    source_article: slug,
    source_url: `${DOMAIN}/${slug}/`,
    objetivo,
    source: { article_slug: slug, source_type: 'body_fact', source_excerpt: sourceExcerpt, section },
  };
}

function post({ slug, titulo_gatilho, legenda, hashtags, sourceExcerpt, section }) {
  return {
    content_id: `${slug}-post-v2-01`,
    type: 'educativo',
    titulo_gatilho,
    legenda,
    cta: `Veja o guia completo no Smart Pet Gadgets: ${DOMAIN}/${slug}/`,
    source_article: slug,
    source_url: `${DOMAIN}/${slug}/`,
    hashtags,
    objetivo: 'educar + salvar/compartilhar',
    source: { article_slug: slug, source_type: 'body_fact', source_excerpt: sourceExcerpt, section },
  };
}

const ESCALA_LOTE3_REEL_POST = {
  'comedouro-automatico-anti-formiga': {
    reel: reel({
      slug: 'comedouro-automatico-anti-formiga',
      hook: 'A barreira anti-formiga do comedouro não afasta formigas — ela só bloqueia a passagem',
      problema: 'Tutor acha que o comedouro "anti-formiga" resolve infestação, mas as formigas continuam na casa.',
      informacao: 'A barreira não afasta formigas do ambiente, não mata a colônia e não impede que outros insetos voadores cheguem até a ração — o princípio é bloquear a passagem, não eliminar o problema de origem.',
      solucaoLabel: 'Guia sobre comedouro automático anti-formiga',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'Ela não afasta formigas do ambiente, não mata a colônia e não impede que outros insetos voadores cheguem até a ração.',
      section: 'O Que a Barreira NÃO Faz',
    }),
    post: post({
      slug: 'comedouro-automatico-anti-formiga',
      titulo_gatilho: 'Canal anti-formiga seco = barreira que não funciona mais',
      legenda: 'A eficácia da barreira anti-formiga depende diretamente da manutenção: canal seco, sujo ou com "pontes" de detritos deixa de funcionar. Vale checar o nível a cada 2-3 dias e trocar a água semanalmente. 🐜\n\nNo artigo: como funciona o princípio físico por trás da barreira anti-formiga.',
      hashtags: ['#smartpetgadgets', '#comedouroautomaticoparapet'],
      sourceExcerpt: 'A eficácia depende diretamente da manutenção: canal seco, sujo ou com "pontes" de detritos deixa de funcionar como barreira.',
      section: 'Manutenção: o Fator que Decide se a Barreira Funciona',
    }),
  },

  'comedouro-automatico-faz-mal': {
    reel: reel({
      slug: 'comedouro-automatico-faz-mal',
      hook: 'O maior risco do comedouro automático não é o equipamento — é a porção mal configurada',
      problema: 'Tutor busca "comedouro automático faz mal" com medo do equipamento, mas o risco real está em outro lugar.',
      informacao: 'O maior risco real não é o equipamento, é a configuração: porções erradas levam à sobrealimentação ou subalimentação — os riscos vêm de configuração incorreta, falta de manutenção e ausência de supervisão, não do princípio de funcionamento do produto.',
      solucaoLabel: 'Guia se comedouro automático faz mal',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'O maior risco real não é o equipamento, é a configuração: porções erradas levam à sobrealimentação ou subalimentação.',
      section: 'Key Takeaways',
    }),
    post: post({
      slug: 'comedouro-automatico-faz-mal',
      titulo_gatilho: 'Comedouro automático pode gerar ansiedade alimentar? Veja quando isso acontece',
      legenda: 'Alguns pets, principalmente cães mais ansiosos, desenvolvem comportamento de expectativa nos minutos que antecedem o horário programado — ficam rondando o equipamento, latindo ou arranhando o pote. O comportamento tende a diminuir conforme o pet se acostuma com a rotina. 🐕\n\nNo artigo: os 5 riscos reais do comedouro automático e como evitar cada um.',
      hashtags: ['#smartpetgadgets', '#comedouroautomaticoparapet'],
      sourceExcerpt: 'Alguns pets, principalmente cães mais ansiosos, desenvolvem comportamento de expectativa nos minutos que antecedem o horário programado de liberação — ficam rondando o equipamento, latindo ou arranhando o pote.',
      section: 'Risco 3: Ansiedade Alimentar em Torno do Horário Programado',
    }),
  },

  'comedouro-automatico-gato-obeso': {
    reel: reel({
      slug: 'comedouro-automatico-gato-obeso',
      hook: 'Mais de 50% dos gatos estão acima do peso — o comedouro automático ajuda, mas não sozinho',
      problema: 'Tutor de gato obeso acha que só trocar para comedouro automático resolve o sobrepeso.',
      informacao: 'Segundo especialista em nutrição de cães e gatos, mais de 50% dos gatos estão acima do peso ou obesos — o comedouro controla porção e horário, mas não define sozinho quantas calorias o gato deve comer por dia.',
      solucaoLabel: 'Guia de comedouro automático para gato obeso',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'mais de 50% dos gatos estão acima do peso ou obesos',
      section: 'Obesidade em Gatos: Um Problema Mais Comum do que Parece',
    }),
    post: post({
      slug: 'comedouro-automatico-gato-obeso',
      titulo_gatilho: 'Gato come rápido demais? A liberação fracionada pode ajudar',
      legenda: 'Alguns modelos oferecem a opção de dividir uma única porção em pequenas frações liberadas em intervalos curtos, em vez de derramar tudo de uma vez — útil pra gatos que comem rápido, já que o cérebro leva alguns minutos pra registrar saciedade. 🐱\n\nNo artigo: o que o comedouro automático realmente controla (e o que não controla) no peso do gato.',
      hashtags: ['#smartpetgadgets', '#gatos'],
      sourceExcerpt: 'já que o cérebro leva alguns minutos para registrar saciedade. Não é uma solução mágica, mas reduz a velocidade com que a porção desaparece',
      section: 'Comedouros com Liberação Fracionada: Ajudam Gatos Que Comem Rápido',
    }),
  },

  'comedouro-automatico-para-dois-gatos': {
    reel: reel({
      slug: 'comedouro-automatico-para-dois-gatos',
      hook: 'Dois potes lado a lado "pra facilitar" é o erro que mais causa briga entre gatos',
      problema: 'Tutor de dois gatos coloca os comedouros próximos achando que isso simplifica a rotina.',
      informacao: 'O erro mais comum é colocar os dois potes lado a lado "para facilitar", o que na prática mantém os gatos no mesmo campo de visão durante a refeição e não resolve a disputa territorial.',
      solucaoLabel: 'Guia de comedouro automático para dois gatos',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'O erro mais comum é colocar os dois potes lado a lado "para facilitar", o que na prática mantém os gatos no mesmo campo de visão durante a refeição e não resolve a disputa territorial.',
      section: 'Erros comuns ao alimentar dois gatos',
    }),
    post: post({
      slug: 'comedouro-automatico-para-dois-gatos',
      titulo_gatilho: 'Regra "número de gatos + 1": por que 2 gatos precisam de 3 pontos de comida',
      legenda: 'A recomendação de especialistas em comportamento felino é a regra "número de gatos + 1": em uma casa com 2 gatos, o ideal são 3 pontos de comedouro disponíveis, não só 2. 🐱🐱\n\nNo artigo: como configurar horários, porções e locais pra evitar brigas na hora da comida.',
      hashtags: ['#smartpetgadgets', '#gatos'],
      sourceExcerpt: 'a regra "número de gatos + 1": em uma casa com 2 gatos, o ideal são 3 pontos de comedouro/bebedouro disponíveis, não só 2',
      section: 'Separe os locais de alimentação',
    }),
  },

  'comedouro-automatico-para-viagem': {
    reel: reel({
      slug: 'comedouro-automatico-para-viagem',
      hook: 'Comprar o comedouro na véspera da viagem é o erro mais comum de quem usa pela primeira vez',
      problema: 'Tutor compra o comedouro de última hora achando que o pet vai se adaptar sozinho durante a viagem.',
      informacao: 'Comprar o comedouro automático na véspera da viagem e esperar que o pet se adapte sozinho é um dos erros mais comuns de quem usa o equipamento pela primeira vez — o ideal é apresentar com antecedência e testar antes de confiar nele.',
      solucaoLabel: 'Guia de como preparar o pet para o comedouro em viagens',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'Comprar o comedouro automático na véspera da viagem e esperar que o pet se adapte sozinho é um dos erros mais comuns de quem usa o equipamento pela primeira vez',
      section: 'introdução',
    }),
    post: post({
      slug: 'comedouro-automatico-para-viagem',
      titulo_gatilho: 'Quantos dias de antecedência preparar o pet pro comedouro automático?',
      legenda: 'O ideal é começar entre 7 e 10 dias antes da viagem, usando o comedouro em paralelo com a alimentação normal para o pet se acostumar ao som do mecanismo e ao novo formato do pote. 🧳\n\nNo artigo: o cronograma completo de preparação e o checklist antes de sair de casa.',
      hashtags: ['#smartpetgadgets', '#comedouroautomaticoparapet'],
      sourceExcerpt: 'O ideal é começar entre 7 e 10 dias antes da viagem, usando o comedouro em paralelo com a alimentação normal',
      section: 'Cronograma de Preparação: Quando Começar',
    }),
  },

  'como-limpar-comedouro-automatico': {
    reel: reel({
      slug: 'como-limpar-comedouro-automatico',
      hook: 'Lavar a base do comedouro na pia é a causa mais comum de queima da placa eletrônica',
      problema: 'Tutor lava o comedouro inteiro embaixo da torneira achando que é só mais um pote.',
      informacao: 'Lavar a base na pia ou no chuveiro é a causa mais comum de queima de placa eletrônica em comedouros automáticos — mesmo modelos com alguma resistência a respingos não são projetados para submersão.',
      solucaoLabel: 'Guia de como limpar o comedouro automático',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'É a causa mais comum de queima de placa eletrônica em comedouros automáticos — mesmo modelos com alguma resistência a respingos não são projetados para submersão.',
      section: 'Erros Comuns na Limpeza do Comedouro Automático',
    }),
    post: post({
      slug: 'como-limpar-comedouro-automatico',
      titulo_gatilho: 'Sujeira no comedouro pode ser confundida com defeito de fábrica',
      legenda: 'Sujeira acumulada pode interferir no funcionamento do sensor de porção e no mecanismo dosador, causando liberação incorreta de ração — problema que muitas vezes é confundido com defeito de fabricação quando na verdade é falta de limpeza. 🧽\n\nNo artigo: o passo a passo completo de limpeza sem danificar o motor.',
      hashtags: ['#smartpetgadgets', '#comedouroautomaticoparapet'],
      sourceExcerpt: 'sujeira acumulada pode interferir no funcionamento do sensor de porção e no mecanismo dosador, causando liberação incorreta de ração — problema que muitas vezes é confundido com defeito de fabricação quando na verdade é falta de limpeza',
      section: 'Por Que a Limpeza Regular Importa Tanto Quanto a Programação de Horários',
    }),
  },

  'configurar-app-comedouro-wifi': {
    reel: reel({
      slug: 'configurar-app-comedouro-wifi',
      hook: 'App não encontra seu comedouro Wi-Fi? A causa é quase sempre a mesma',
      problema: 'Tutor tenta parear o comedouro no app repetidas vezes sem entender por que falha.',
      informacao: 'A maioria dos comedouros automáticos com Tuya só reconhece redes de 2,4 GHz, e roteadores com band steering (que combinam 2,4 e 5 GHz sob o mesmo SSID) são a causa mais frequente de falha na descoberta do dispositivo.',
      solucaoLabel: 'Guia de como configurar o app do comedouro Wi-Fi',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'roteadores com band steering (que combinam 2,4 e 5 GHz sob o mesmo SSID) são a causa mais frequente de falha na descoberta do dispositivo',
      section: 'Confirme que a Rede é de 2,4 GHz',
    }),
    post: post({
      slug: 'configurar-app-comedouro-wifi',
      titulo_gatilho: 'App do comedouro pede acesso à localização — pra quê exatamente?',
      legenda: 'O app Tuya Smart pede acesso à localização durante a configuração inicial porque usa essa informação para identificar redes Wi-Fi próximas, não para rastrear a localização do usuário de forma contínua. Nenhuma permissão dá acesso a contatos, câmera ou mensagens. 📱\n\nNo artigo: o passo a passo completo de configuração e os erros mais comuns.',
      hashtags: ['#smartpetgadgets', '#comedouroautomaticoparapet'],
      sourceExcerpt: 'O app Tuya Smart pede acesso à localização durante a configuração inicial porque usa essa informação para identificar redes Wi-Fi próximas, não para rastrear a localização do usuário de forma contínua.',
      section: 'Privacidade e Permissões do App',
    }),
  },

  'melhor-comedouro-automatico-cachorro': {
    reel: reel({
      slug: 'melhor-comedouro-automatico-cachorro',
      hook: 'Cão grande revela defeito de calibração que passa despercebido em pet pequeno',
      problema: 'Tutor de cão grande compra o mesmo comedouro popular sem saber que o porte muda o risco.',
      informacao: 'Reclamações de "porção errada" aparecem quase sempre em relatos de tutores de cães grandes, não de gatos — provavelmente porque o erro percentual da calibração se torna mais perceptível em porções maiores.',
      solucaoLabel: 'Guia do melhor comedouro automático para cachorro',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'reclamações de "porção errada" aparecem quase sempre em relatos de tutores de cães grandes, não de gatos — provavelmente porque o erro percentual da calibração se torna mais perceptível em porções maiores',
      section: 'Cuidados Específicos para Cães de Porte Grande',
    }),
    post: post({
      slug: 'melhor-comedouro-automatico-cachorro',
      titulo_gatilho: '3 categorias de comedouro automático pra cachorro — qual combina com sua rotina?',
      legenda: 'Timer simples resolve horário sem depender de Wi-Fi. Modelo intermediário combina capacidade grande e gravação de voz. Modelo com Wi-Fi dá controle remoto total pra quem viaja ou trabalha fora. 🐕\n\nNo artigo: comparativo completo dos 3 tipos e como escolher entre eles.',
      hashtags: ['#smartpetgadgets', '#comedouroautomaticoparapet'],
      sourceExcerpt: 'A escolha certa depende do porte do cão, da rotina do tutor e de quanto controle remoto você realmente precisa.',
      section: 'introdução',
    }),
  },

  'melhor-comedouro-interativo-gato': {
    reel: reel({
      slug: 'melhor-comedouro-interativo-gato',
      hook: 'Comedouro interativo não estimula o corpo do gato — estimula a mente',
      problema: 'Tutor confunde comedouro interativo com brinquedo de perseguição e não entende a diferença de propósito.',
      informacao: 'Enquanto a bolinha inteligente estimula perseguição física, o comedouro interativo estimula raciocínio e paciência — os dois se complementam dentro de uma rotina de enriquecimento ambiental completa.',
      solucaoLabel: 'Guia do melhor comedouro interativo para gato',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'Enquanto a bolinha inteligente estimula perseguição física, o comedouro interativo estimula raciocínio e paciência — os dois se complementam dentro de uma rotina de enriquecimento ambiental completa.',
      section: 'Diferença para o Brinquedo Interativo Comum',
    }),
    post: post({
      slug: 'melhor-comedouro-interativo-gato',
      titulo_gatilho: 'Por que seu gato precisa "trabalhar" pela comida às vezes?',
      legenda: 'Em vez de receber a comida de graça, o gato precisa pensar e agir para liberar as guloseimas — a ração fica em um labirinto ou compartimento que exige manipulação do animal, incentivando o forrageamento natural. 🐱\n\nNo artigo: os benefícios do enriquecimento alimentar e os tipos de comedouro interativo disponíveis.',
      hashtags: ['#smartpetgadgets', '#gatos'],
      sourceExcerpt: 'o gato precisa pensar e agir para liberar as guloseimas — a ração fica em uma espécie de labirinto ou compartimento que exige manipulação do animal',
      section: 'Como Funciona',
    }),
  },
};

module.exports = { ESCALA_LOTE3_REEL_POST };
