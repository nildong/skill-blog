'use strict';

/**
 * Reel + Post V2 para os 10 artigos do piloto — escritos a partir da
 * leitura de `body_text_full` de cada artigo, buscando o fato mais
 * específico/útil/interessante (não o próximo heading disponível).
 * Cada `source.source_excerpt` é um trecho LITERAL do corpo do artigo
 * correspondente, verificado por substring em `quality-gate-v2.js`.
 *
 * Os 3 primeiros (comedouro-gato-x-cachorro-diferenca,
 * duvidas-camera-para-monitorar-pet, tapete-higienico-para-cachorro)
 * são os mesmos da calibração já validada — reaproveitados aqui sem
 * alteração para manter consistência entre as duas etapas.
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

const PILOTO_V2_REEL_POST = {
  'comedouro-gato-x-cachorro-diferenca': {
    reel: reel({
      slug: 'comedouro-gato-x-cachorro-diferenca',
      hook: 'Seu gato recusa comida em pote fundo? Pode não ser frescura.',
      problema: 'Muita gente troca de ração achando que o gato "enjoou", quando o problema é o formato do pote.',
      informacao: 'Gatos têm bigodes sensíveis que, em contato repetido com as bordas de um pote fundo e estreito, causam desconforto conhecido como "fadiga de bigode" — por isso pratos rasos e largos são mais bem aceitos. Cães não sofrem com esse problema.',
      solucaoLabel: 'Guia completo com o resumo comparativo gato x cachorro',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'Gatos têm bigodes sensíveis que, em contato repetido com as bordas de um pote fundo e estreito, podem causar desconforto conhecido informalmente como "fadiga de bigode" — por isso pratos rasos e largos costumam ser mais bem aceitos pela espécie.',
      section: 'Formato do Pote e Altura do Comedouro',
    }),
    post: post({
      slug: 'comedouro-gato-x-cachorro-diferenca',
      titulo_gatilho: 'O maior risco em casa com gato e cachorro não é o comedouro errado',
      legenda: 'Em casa com gato e cachorro, o maior risco não costuma ser comprar o comedouro errado para a espécie — é o cachorro conseguir acessar e comer a porção programada do gato. A solução mais comum do mercado: elevar o comedouro do gato, não pela postura dele, mas como barreira física contra o cachorro. 🐱🐶\n\nNo artigo completo: quanto de reservatório cada espécie realmente precisa, por que ração úmida programada é quase exclusiva de gato, e o erro mais comum na hora de escolher entre os dois tipos.',
      hashtags: ['#smartpetgadgets', '#gatos', '#cachorros', '#comedouroautomaticoparapet'],
      sourceExcerpt: 'o maior risco em residências multi-pet não é comprar o comedouro "errado" para a espécie, e sim o cachorro conseguir acessar e comer a porção programada do gato',
      section: 'Casas com Gato e Cachorro Juntos',
    }),
  },

  'bebedouro-inox-x-ceramica': {
    reel: reel({
      slug: 'bebedouro-inox-x-ceramica',
      hook: 'Por que a água do bebedouro de inox esquenta tão rápido no verão?',
      problema: 'Tutor troca de bebedouro achando que o gato não gostou da água, quando o problema é o material.',
      informacao: 'O inox é bom condutor térmico e acompanha a temperatura ambiente rapidamente — a água esquenta mais rápido em dias quentes e esfria mais rápido em dias frios, em comparação direta com a cerâmica.',
      solucaoLabel: 'Guia completo inox x cerâmica',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'Por ser um bom condutor térmico, o inox tende a acompanhar a temperatura ambiente rapidamente, então a água esquenta mais rápido em dias quentes e esfria mais rápido em dias frios, na comparação direta com a cerâmica.',
      section: 'Inox conserva a temperatura da água?',
    }),
    post: post({
      slug: 'bebedouro-inox-x-ceramica',
      titulo_gatilho: 'Bebedouro de cerâmica quebra fácil? Depende de quando',
      legenda: 'Bebedouro de cerâmica não costuma quebrar durante o uso normal — o peso extra reduz o risco de o próprio gato derrubar a peça. O maior risco de dano acontece durante o transporte até a pia na hora de lavar. 🐈\n\nNo artigo: por que gatos preferem água em movimento (tem explicação evolutiva), e o comparativo direto de higiene, durabilidade e estabilidade entre os dois materiais.',
      hashtags: ['#smartpetgadgets', '#gatos', '#comedouroautomaticoparapet'],
      sourceExcerpt: 'Para quedas no chão, sim, a cerâmica quebra com mais facilidade do que o inox. Mas no uso normal, apoiada em uma superfície estável, o peso da cerâmica na verdade reduz o risco de acidentes, porque o bebedouro não desliza nem vira com facilidade',
      section: 'Cerâmica é frágil demais para o dia a dia?',
    }),
  },

  'comedouro-com-ou-sem-wifi': {
    reel: reel({
      slug: 'comedouro-com-ou-sem-wifi',
      hook: 'O erro mais comum ao configurar comedouro com Wi-Fi',
      problema: 'App não conecta, comedouro não sincroniza, tutor acha que o produto veio com defeito.',
      informacao: 'A causa mais comum de falha na configuração é tentar conectar o comedouro a uma rede Wi-Fi de 5 GHz — a maioria desses aparelhos funciona só em 2,4 GHz.',
      solucaoLabel: 'Guia completo com ou sem Wi-Fi',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'sendo a incompatibilidade com redes de 5 GHz a causa mais comum de falha na configuração (Cabine Celular, retrieved 2026-08-21)',
      section: 'Como Configurar Cada Tipo',
    }),
    post: post({
      slug: 'comedouro-com-ou-sem-wifi',
      titulo_gatilho: 'Se o Wi-Fi cair, seu pet fica sem comer? Não.',
      legenda: 'Se a internet do comedouro Wi-Fi cair, a alimentação do seu pet não para: a maioria dos modelos mantém a última programação salva localmente e continua liberando as porções normalmente. O que você perde é só o controle remoto e as notificações pelo app. 📶\n\nNo artigo: quando vale pagar a mais pelo Wi-Fi e quando o modelo sem conexão resolve igual, por menos.',
      hashtags: ['#smartpetgadgets', '#comedouroautomaticoparapet'],
      sourceExcerpt: 'A maioria dos modelos mantém a última programação salva localmente mesmo sem internet, liberando as porções programadas normalmente. O que se perde durante a queda de conexão é o controle remoto e as notificações pelo app, não necessariamente a alimentação do pet.',
      section: 'O que fazer se o comedouro com Wi-Fi perder a conexão?',
    }),
  },

  'coleira-gps-x-microchip': {
    reel: reel({
      slug: 'coleira-gps-x-microchip',
      hook: 'O microchip do seu pet tem o tamanho de um grão de arroz',
      problema: 'Muita gente confunde microchip com GPS e acha que ele "localiza" o pet.',
      informacao: 'O microchip é implantado sob a pele do animal pelo veterinário, sem cirurgia, e funciona como um "RG": só identifica o pet depois que alguém o encontra e leva a um leitor — não localiza em tempo real.',
      solucaoLabel: 'Guia completo coleira GPS x microchip',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'O microchip é um dispositivo eletrônico do tamanho de um grão de arroz, implantado sob a pele do animal (geralmente na região do dorso) pelo médico-veterinário, sem necessidade de cirurgia.',
      section: 'O Que é o Microchip e Como Funciona',
    }),
    post: post({
      slug: 'coleira-gps-x-microchip',
      titulo_gatilho: 'Microchip já é obrigatório em algumas cidades do Brasil',
      legenda: 'Rio de Janeiro (RJ) e Jundiaí (SP) já tornaram o microchip obrigatório para cães e gatos — e o cadastro voluntário no SinPatinhas é gratuito na maior parte do país. 🐾\n\nMas atenção: microchip não substitui coleira GPS. Um identifica depois de encontrado, o outro localiza em tempo real. No artigo: por que muitos tutores usam os dois juntos.',
      hashtags: ['#smartpetgadgets', '#coleiragpsparapet'],
      sourceExcerpt: 'Algumas cidades brasileiras, como Rio de Janeiro (RJ) e Jundiaí (SP), já tornaram o microchip obrigatório para cães e gatos, e o cadastro voluntário no SinPatinhas segue gratuito na maior parte do país (Click Petróleo e Gás, retrieved 2026-08-22)',
      section: 'O Que é o Microchip e Como Funciona',
    }),
  },

  'coleira-gps-bluetooth-x-chip-operadora': {
    reel: reel({
      slug: 'coleira-gps-bluetooth-x-chip-operadora',
      hook: 'Coleira GPS Bluetooth só funciona a poucos metros de distância',
      problema: 'Tutor compra coleira Bluetooth achando que localiza o pet a qualquer distância, e se frustra.',
      informacao: 'A localização por Bluetooth só é útil enquanto o pet está dentro do alcance do sinal — geralmente alguns metros a poucas dezenas de metros. Fora disso, o app perde a conexão.',
      solucaoLabel: 'Guia completo Bluetooth x chip de operadora',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'a localização só é útil enquanto o pet está dentro do alcance do sinal — geralmente alguns metros a poucas dezenas de metros. Fora dessa distância, o app perde a conexão e não consegue mais informar a posição atualizada.',
      section: 'Como Funciona a Coleira Bluetooth',
    }),
    post: post({
      slug: 'coleira-gps-bluetooth-x-chip-operadora',
      titulo_gatilho: 'Coleira com chip de operadora também pode falhar — nesse caso',
      legenda: 'A coleira com chip de operadora funciona a qualquer distância dentro da cobertura de rede, mas tem duas pegadinhas: costuma exigir mensalidade de dados, e depende de sinal de celular no local — em áreas rurais isoladas, pode falhar. 📡\n\nNo artigo: qual tecnologia realmente resolve o cenário de fuga para longe.',
      hashtags: ['#smartpetgadgets', '#coleiragpsparapet'],
      sourceExcerpt: 'costuma exigir mensalidade de dados e depende de haver sinal de celular no local — em áreas rurais isoladas, pode falhar.',
      section: 'Como Funciona a Coleira com Chip de Operadora',
    }),
  },

  'camera-para-monitorar-pet': {
    reel: reel({
      slug: 'camera-para-monitorar-pet',
      hook: 'A câmera pet mais popular do Brasil gira 360° sozinha',
      problema: 'Tutor não sabe qual recurso realmente importa na hora de escolher câmera pet.',
      informacao: 'A TP-Link Tapo C200 é a mais citada em comparativos de mercado por equilibrar preço e recursos: rotação horizontal de 360° e vertical de 114° pelo app, Full HD e visão noturna de até 9 metros.',
      solucaoLabel: 'Guia completo de câmera para monitorar pet',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'com rotação horizontal de 360° e vertical de 114° controlada pelo app, resolução Full HD e visão noturna de até 9 metros (comparativos de mercado consultados por mybest, retrieved 2026-08-22)',
      section: 'Modelos Populares no Mercado Brasileiro',
    }),
    post: post({
      slug: 'camera-para-monitorar-pet',
      titulo_gatilho: 'O motivo real pelo qual tutores instalam câmera pet',
      legenda: 'Não é só "ver o pet": o recurso mais citado por quem já usa câmera pet é entender o comportamento do animal sozinho em casa — muitos tutores só descobrem sinais de ansiedade, tédio ou desconforto ao rever as imagens. 📹\n\nNo artigo: quais recursos realmente fazem diferença (e quais você provavelmente não vai usar).',
      hashtags: ['#smartpetgadgets', '#cameraparamonitorarpet'],
      sourceExcerpt: 'o recurso mais citado por quem já usa é entender o comportamento do animal quando está sozinho — muitos tutores só descobrem sinais de ansiedade, tédio ou desconforto ao rever as imagens (achados compilados por Cães e Gatos, retrieved 2026-08-22)',
      section: 'Para Que Serve uma Câmera para Monitorar Pet',
    }),
  },

  'duvidas-camera-para-monitorar-pet': {
    reel: reel({
      slug: 'duvidas-camera-para-monitorar-pet',
      hook: 'Câmera para pet precisa de internet para funcionar?',
      problema: 'Câmera não conecta, app trava, tutor acha que o produto é ruim.',
      informacao: 'A maioria das câmeras pet funciona exclusivamente na banda 2,4 GHz — tentar conectar na rede Wi-Fi 5 GHz é o erro de configuração mais comum, segundo guias de suporte técnico do setor.',
      solucaoLabel: 'Passo a passo de configuração sem erro',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'A maioria funciona exclusivamente na banda 2,4 GHz — tentar conectar na rede 5 GHz é o erro de configuração mais comum, segundo guias de suporte técnico do setor',
      section: 'A câmera pet funciona em qualquer rede Wi-Fi?',
    }),
    post: post({
      slug: 'duvidas-camera-para-monitorar-pet',
      titulo_gatilho: 'Sua câmera pet grava mesmo sem internet — mas nem tudo continua funcionando',
      legenda: 'Sua câmera pet continua gravando mesmo se a internet cair — desde que tenha energia e cartão SD. O que para de funcionar sem internet é a visualização ao vivo, as notificações e o acesso pela nuvem. Ou seja: você não perde o registro, só o acesso em tempo real. 📹\n\nNo artigo: resolução mínima recomendada, se a câmera realmente ajuda com ansiedade de separação, e o tipo de cartão SD certo pra gravação local.',
      hashtags: ['#smartpetgadgets', '#cameraparamonitorarpet'],
      sourceExcerpt: 'A câmera continua gravando no cartão SD mesmo sem internet, desde que tenha energia. Mas visualização ao vivo pelo app, notificações e acesso à nuvem exigem conexão.',
      section: 'Câmera para pet precisa de internet para funcionar?',
    }),
  },

  'cercado-para-cachorros': {
    reel: reel({
      slug: 'cercado-para-cachorros',
      hook: '52,2 milhões de cães moram no Brasil. A maioria passou pela fase de filhote sem contenção segura.',
      problema: 'Filhote solto em casa mastiga fio, derruba planta ou vai parar num cômodo perigoso.',
      informacao: 'O Brasil tem cerca de 52,2 milhões de cães domiciliados (estimativa IBGE via CRMV-SP) — boa parte passa pela fase de filhote, período de maior risco de acidente doméstico segundo profissionais de comportamento animal.',
      solucaoLabel: 'Review completo do cercado Divipets',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'O Brasil tem cerca de 52,2 milhões de cães domiciliados, segundo estimativa do IBGE reportada pelo CRMV-SP',
      section: 'Resumo rápido',
    }),
    post: post({
      slug: 'cercado-para-cachorros',
      titulo_gatilho: 'Cercado não isola o filhote — e isso é proposital',
      legenda: 'Um bom cercado não tranca o filhote longe de tudo: os painéis vazados deixam ele ver e ouvir o que acontece ao redor, criando uma "zona segura" sem isolar do convívio da casa enquanto você não pode supervisionar em tempo integral. 🐶\n\nNo review: o formato octogonal x retangular, pra quem vale a pena, e pra quem não é a melhor escolha.',
      hashtags: ['#smartpetgadgets', '#cachorros'],
      sourceExcerpt: 'Um cercado bem posicionado ajuda a criar uma "zona segura" enquanto o tutor não pode supervisionar o cão em tempo integral, sem isolar completamente o filhote do convívio da casa, já que os painéis vazados permitem ver e ouvir o que acontece ao redor.',
      section: 'Por que usar um cercado na fase de filhote?',
    }),
  },

  'tapete-higienico-para-cachorro': {
    reel: reel({
      slug: 'tapete-higienico-para-cachorro',
      hook: 'Carvão de bambu no tapete higiênico funciona mesmo, ou é só marketing?',
      problema: 'Tapete que promete "controle de odor" e não entrega é queixa recorrente de tutor de apartamento.',
      informacao: 'Carvão ativado é usado de verdade em produtos de higiene por sua capacidade de adsorver moléculas de odor, incluindo amônia da urina — pesquisa em engenharia química da UFRGS descreve o carvão ativado como sólido eficiente na remoção de nitrogênio amoniacal. O efeito depende da troca regular do tapete.',
      solucaoLabel: 'Review completo do Bamboo.dry Nekko',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'carvão ativado (aqui, de bambu) é um material amplamente usado em produtos de higiene por sua capacidade de adsorver moléculas causadoras de odor, incluindo amônia presente na urina — pesquisa em engenharia química da UFRGS descreve o carvão ativado como sólido adsorvente eficiente na remoção de nitrogênio amoniacal de soluções (UFRGS, Lume).',
      section: 'Antivazamento e controle de odor: até que ponto funciona?',
    }),
    post: post({
      slug: 'tapete-higienico-para-cachorro',
      titulo_gatilho: 'Tapete higiênico não é luxo, é rotina pra 12,5% dos brasileiros',
      legenda: '12,5% da população brasileira mora em apartamento — no Sudeste, sobe pra 16,7% (Censo IBGE 2022). Pra quem cai nessa conta com cachorro em casa, tapete higiênico não é luxo, é rotina. 🏢🐶\n\nTestamos o review do Bamboo.dry Nekko (kit 30un, 60x60cm) olhando 3 coisas que mais pesam na decisão: se ele realmente não escorrega, se o carvão de bambu segura o cheiro, e pra qual porte de cão ele NÃO é a melhor escolha.',
      hashtags: ['#smartpetgadgets', '#cachorros'],
      sourceExcerpt: 'Segundo o Censo 2022 do IBGE, 12,5% da população brasileira mora em apartamento — no Sudeste essa proporção sobe para 16,7% (IBGE, Censo 2022)',
      section: 'Resumo rápido',
    }),
  },

  'porta-eletronica-gato-x-cachorro-diferenca': {
    reel: reel({
      slug: 'porta-eletronica-gato-x-cachorro-diferenca',
      hook: 'Sua porta eletrônica é pequena demais para o cão da casa?',
      problema: 'Casa com gato e cachorro compra porta eletrônica pensando só no gato, e o cão não passa.',
      informacao: 'Modelos M atendem gatos e cães pequenos até cerca de 8 kg, com abertura de 20x22 cm. Modelos Super GG chegam a 43x35,5 cm para cães de médio porte — a diferença real está no tamanho do vão, não na tecnologia de identificação.',
      solucaoLabel: 'Guia completo porta eletrônica gato x cachorro',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'modelos de tamanho M costumam atender gatos e cães pequenos até cerca de 8 kg, com abertura em torno de 20x22 cm, enquanto modelos Super GG chegam a 43x35,5 cm para cães de médio porte (especificações de mercado consultadas via Atena Mix, retrieved 2026-08-22)',
      section: 'Tamanho do Vão de Passagem',
    }),
    post: post({
      slug: 'porta-eletronica-gato-x-cachorro-diferenca',
      titulo_gatilho: 'Escolha pelo tamanho do pet, não pela espécie',
      legenda: 'Na hora de escolher porta eletrônica em casa com gato e cachorro, o critério certo não é a espécie — é o porte físico e a força que o maior animal exerce sobre a estrutura. 🐱🐶\n\nDimensione pelo maior pet da casa, não pela espécie predominante. No artigo: diferença de vão de passagem e resistência estrutural entre os modelos.',
      hashtags: ['#smartpetgadgets', '#gatos', '#cachorros', '#portaeletronicaautomaticaparapet'],
      sourceExcerpt: 'o critério principal não é a espécie em si, mas o porte físico do animal e a força que ele exerce sobre a estrutura — dimensione pelo maior pet da casa, não pela espécie predominante.',
      section: 'Conclusão',
    }),
  },
};

module.exports = { PILOTO_V2_REEL_POST };
