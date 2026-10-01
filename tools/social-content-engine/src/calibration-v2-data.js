'use strict';

/**
 * Peças V2 escritas à mão para a amostra de calibração (3 artigos, 1
 * Reel + 1 Post cada) — ver reports/social-content/antes-depois-reescrita-piloto.md
 * para a versão V1 correspondente.
 *
 * Cada peça segue a hierarquia exigida pelo usuário:
 *   fato encontrado no artigo > interpretação editorial do fato > copy social
 * Nunca o inverso. O `source.source_excerpt` de cada peça é um trecho
 * LITERAL de `body_text_full` do artigo correspondente — verificado
 * automaticamente por `quality-gate-v2.js` (substring match), não é
 * uma alegação de confiança.
 *
 * Isto NÃO é o gerador V2 final (esse ainda vai ler qualquer artigo e
 * decidir o gancho automaticamente, por leitura de body_text_full).
 * Isto é a prova de calibração: confirma que o padrão de peça +
 * o quality gate V2 funcionam juntos antes de generalizar.
 */

const DOMAIN = 'https://smartpetgadgets.com.br';

const CALIBRATION_PIECES = {
  'comedouro-gato-x-cachorro-diferenca': {
    reel: {
      content_id: 'comedouro-gato-x-cachorro-diferenca-reel-v2-01',
      hook: 'Seu gato recusa comida em pote fundo? Pode não ser frescura.',
      roteiro: {
        problema: 'Muita gente troca de ração achando que o gato "enjoou", quando o problema é o formato do pote.',
        informacao: 'Gatos têm bigodes sensíveis que, em contato repetido com as bordas de um pote fundo e estreito, causam desconforto conhecido como "fadiga de bigode" — por isso pratos rasos e largos são mais bem aceitos. Cães não sofrem com esse problema.',
        solucao: `Guia completo com o resumo comparativo gato x cachorro: ${DOMAIN}/comedouro-gato-x-cachorro-diferenca/`,
      },
      cta: `Confira os modelos analisados e o guia completo: ${DOMAIN}/comedouro-gato-x-cachorro-diferenca/`,
      source_article: 'comedouro-gato-x-cachorro-diferenca',
      source_url: `${DOMAIN}/comedouro-gato-x-cachorro-diferenca/`,
      objetivo: 'tráfego + intenção de compra',
      source: {
        article_slug: 'comedouro-gato-x-cachorro-diferenca',
        source_type: 'body_fact',
        source_excerpt: 'Gatos têm bigodes sensíveis que, em contato repetido com as bordas de um pote fundo e estreito, podem causar desconforto conhecido informalmente como "fadiga de bigode" — por isso pratos rasos e largos costumam ser mais bem aceitos pela espécie.',
        section: 'Formato do Pote e Altura do Comedouro',
      },
    },
    post: {
      content_id: 'comedouro-gato-x-cachorro-diferenca-post-v2-01',
      type: 'educativo',
      titulo_gatilho: 'O maior risco em casa com gato e cachorro não é o comedouro errado',
      legenda: 'Em casa com gato e cachorro, o maior risco não costuma ser comprar o comedouro errado para a espécie — é o cachorro conseguir acessar e comer a porção programada do gato. A solução mais comum do mercado: elevar o comedouro do gato, não pela postura dele, mas como barreira física contra o cachorro. 🐱🐶\n\nNo artigo completo: quanto de reservatório cada espécie realmente precisa, por que ração úmida programada é quase exclusiva de gato, e o erro mais comum na hora de escolher entre os dois tipos.',
      cta: `Confira os modelos analisados e o guia completo: ${DOMAIN}/comedouro-gato-x-cachorro-diferenca/`,
      source_article: 'comedouro-gato-x-cachorro-diferenca',
      source_url: `${DOMAIN}/comedouro-gato-x-cachorro-diferenca/`,
      hashtags: ['#smartpetgadgets', '#gatos', '#cachorros', '#comedouroautomaticoparapet'],
      objetivo: 'educar + salvar/compartilhar',
      source: {
        article_slug: 'comedouro-gato-x-cachorro-diferenca',
        source_type: 'body_fact',
        source_excerpt: 'o maior risco em residências multi-pet não é comprar o comedouro "errado" para a espécie, e sim o cachorro conseguir acessar e comer a porção programada do gato',
        section: 'Casas com Gato e Cachorro Juntos',
      },
    },
  },

  'duvidas-camera-para-monitorar-pet': {
    reel: {
      content_id: 'duvidas-camera-para-monitorar-pet-reel-v2-01',
      hook: 'O erro de configuração mais comum em câmera pet: gente conecta na rede errada.',
      roteiro: {
        problema: 'Câmera não conecta, app trava, tutor acha que o produto é ruim.',
        informacao: 'A maioria das câmeras pet funciona exclusivamente na banda 2,4 GHz — tentar conectar na rede Wi-Fi 5 GHz é o erro de configuração mais comum, segundo guias de suporte técnico do setor.',
        solucao: `Passo a passo de configuração sem erro: ${DOMAIN}/duvidas-camera-para-monitorar-pet/`,
      },
      cta: `Veja o passo a passo completo de configuração: ${DOMAIN}/duvidas-camera-para-monitorar-pet/`,
      source_article: 'duvidas-camera-para-monitorar-pet',
      source_url: `${DOMAIN}/duvidas-camera-para-monitorar-pet/`,
      objetivo: 'tráfego + reconhecimento de marca',
      source: {
        article_slug: 'duvidas-camera-para-monitorar-pet',
        source_type: 'body_fact',
        source_excerpt: 'A maioria funciona exclusivamente na banda 2,4 GHz — tentar conectar na rede 5 GHz é o erro de configuração mais comum, segundo guias de suporte técnico do setor',
        section: 'A câmera pet funciona em qualquer rede Wi-Fi?',
      },
    },
    post: {
      content_id: 'duvidas-camera-para-monitorar-pet-post-v2-01',
      type: 'educativo',
      titulo_gatilho: 'Sua câmera pet grava mesmo sem internet — mas nem tudo continua funcionando',
      legenda: 'Sua câmera pet continua gravando mesmo se a internet cair — desde que tenha energia e cartão SD. O que para de funcionar sem internet é a visualização ao vivo, as notificações e o acesso pela nuvem. Ou seja: você não perde o registro, só o acesso em tempo real. 📹\n\nNo artigo: resolução mínima recomendada, se a câmera realmente ajuda com ansiedade de separação, e o tipo de cartão SD certo pra gravação local.',
      cta: `Veja o guia completo no Smart Pet Gadgets: ${DOMAIN}/duvidas-camera-para-monitorar-pet/`,
      source_article: 'duvidas-camera-para-monitorar-pet',
      source_url: `${DOMAIN}/duvidas-camera-para-monitorar-pet/`,
      hashtags: ['#smartpetgadgets', '#cameraparamonitorarpet'],
      objetivo: 'engajamento + tráfego',
      source: {
        article_slug: 'duvidas-camera-para-monitorar-pet',
        source_type: 'body_fact',
        source_excerpt: 'A câmera continua gravando no cartão SD mesmo sem internet, desde que tenha energia. Mas visualização ao vivo pelo app, notificações e acesso à nuvem exigem conexão.',
        section: 'Câmera para pet precisa de internet para funcionar?',
      },
    },
  },

  'tapete-higienico-para-cachorro': {
    reel: {
      content_id: 'tapete-higienico-para-cachorro-reel-v2-01',
      hook: 'Carvão de bambu no tapete higiênico funciona mesmo, ou é só marketing?',
      roteiro: {
        problema: 'Tapete que promete "controle de odor" e não entrega é queixa recorrente de tutor de apartamento.',
        informacao: 'Carvão ativado é usado de verdade em produtos de higiene por sua capacidade de adsorver moléculas de odor, incluindo amônia da urina — pesquisa em engenharia química da UFRGS descreve o carvão ativado como sólido eficiente na remoção de nitrogênio amoniacal. O efeito depende da troca regular do tapete.',
        solucao: `Review completo do Bamboo.dry Nekko: ${DOMAIN}/tapete-higienico-para-cachorro/`,
      },
      cta: `Veja o review completo: ${DOMAIN}/tapete-higienico-para-cachorro/`,
      source_article: 'tapete-higienico-para-cachorro',
      source_url: `${DOMAIN}/tapete-higienico-para-cachorro/`,
      objetivo: 'tráfego + intenção de compra',
      source: {
        article_slug: 'tapete-higienico-para-cachorro',
        source_type: 'body_fact',
        source_excerpt: 'carvão ativado (aqui, de bambu) é um material amplamente usado em produtos de higiene por sua capacidade de adsorver moléculas causadoras de odor, incluindo amônia presente na urina — pesquisa em engenharia química da UFRGS descreve o carvão ativado como sólido adsorvente eficiente na remoção de nitrogênio amoniacal de soluções (UFRGS, Lume).',
        section: 'Antivazamento e controle de odor: até que ponto funciona?',
      },
    },
    post: {
      content_id: 'tapete-higienico-para-cachorro-post-v2-01',
      type: 'educativo',
      titulo_gatilho: 'Tapete higiênico não é luxo, é rotina pra 12,5% dos brasileiros',
      legenda: '12,5% da população brasileira mora em apartamento — no Sudeste, sobe pra 16,7% (Censo IBGE 2022). Pra quem cai nessa conta com cachorro em casa, tapete higiênico não é luxo, é rotina. 🏢🐶\n\nTestamos o review do Bamboo.dry Nekko (kit 30un, 60x60cm) olhando 3 coisas que mais pesam na decisão: se ele realmente não escorrega, se o carvão de bambu segura o cheiro, e pra qual porte de cão ele NÃO é a melhor escolha.',
      cta: `Veja o guia completo no Smart Pet Gadgets: ${DOMAIN}/tapete-higienico-para-cachorro/`,
      source_article: 'tapete-higienico-para-cachorro',
      source_url: `${DOMAIN}/tapete-higienico-para-cachorro/`,
      hashtags: ['#smartpetgadgets', '#cachorros'],
      objetivo: 'educar + salvar/compartilhar',
      source: {
        article_slug: 'tapete-higienico-para-cachorro',
        source_type: 'body_fact',
        source_excerpt: 'Segundo o Censo 2022 do IBGE, 12,5% da população brasileira mora em apartamento — no Sudeste essa proporção sobe para 16,7% (IBGE, Censo 2022)',
        section: 'Resumo rápido',
      },
    },
  },
};

module.exports = { CALIBRATION_PIECES };
