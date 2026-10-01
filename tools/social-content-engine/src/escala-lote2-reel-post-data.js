'use strict';

/**
 * Reel + Post V2 — ESCALA, Lote 2 (9 artigos: cluster coleira-gps completo
 * + 2 artigos que iniciam o cluster comedouro-automatico). Mesmo princípio:
 * fato específico do corpo, nunca preço, `source.source_excerpt` literal.
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

const ESCALA_LOTE2_REEL_POST = {
  'coleira-gps-para-pet': {
    reel: reel({
      slug: 'coleira-gps-para-pet',
      hook: 'Coleira GPS usa 3 tecnologias diferentes ao mesmo tempo — sem você perceber',
      problema: 'Tutor acha que "coleira GPS" é uma tecnologia só e se surpreende com a diferença de preço e alcance entre modelos.',
      informacao: 'O dispositivo combina até três formas de localização: GPS via satélite (áreas abertas), Wi-Fi (ambientes internos) e rede móvel/LBS (triangulação por antena) — a maioria dos modelos alterna entre elas automaticamente conforme o ambiente.',
      solucaoLabel: 'Guia completo de coleira GPS para pet',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'GPS via satélite (áreas abertas), Wi-Fi (ambientes internos) e rede móvel/LBS (triangulação por antena) — para estimar a posição do pet',
      section: 'Como Funciona uma Coleira GPS para Pet',
    }),
    post: post({
      slug: 'coleira-gps-para-pet',
      titulo_gatilho: 'Coleira GPS substitui o microchip do seu pet?',
      legenda: 'Não. São tecnologias complementares: o microchip serve para identificar o animal caso ele seja encontrado por terceiros, e a coleira GPS serve para localizá-lo em tempo real. Muitos tutores usam os dois. 🐾\n\nNo artigo: os tipos de coleira GPS disponíveis e como escolher conforme seu problema real.',
      hashtags: ['#smartpetgadgets', '#coleiragpsparapet'],
      sourceExcerpt: 'São tecnologias complementares: o microchip serve para identificar o animal caso ele seja encontrado por terceiros, e a coleira GPS serve para localizá-lo em tempo real.',
      section: 'Coleira GPS Substitui o Microchip?',
    }),
  },

  'coleira-gps-cachorro-pequeno-porte': {
    reel: reel({
      slug: 'coleira-gps-cachorro-pequeno-porte',
      hook: 'Existem coleiras GPS de menos de 10 gramas — e isso importa mais do que parece',
      problema: 'Tutor de cão pequeno compra a coleira GPS mais popular sem checar o peso do dispositivo.',
      informacao: 'Existem modelos bem leves no mercado — alguns pesam entre 8 e 9,3 gramas, o que é considerado adequado para animais de pequeno porte, enquanto cães maiores toleram dispositivos mais robustos, com bateria maior.',
      solucaoLabel: 'Guia de coleira GPS para cachorro de pequeno porte',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'alguns pesam entre 8 e 9,3 gramas, o que é considerado adequado para animais de pequeno porte',
      section: 'Quanto Pesa um Dispositivo GPS para Pet',
    }),
    post: post({
      slug: 'coleira-gps-cachorro-pequeno-porte',
      titulo_gatilho: 'Dispositivo pesado demais? O próprio tutor acaba tirando a coleira',
      legenda: 'Um dispositivo pesado demais tende a ser removido pelo próprio tutor por desconforto do animal, o que anula qualquer benefício da tecnologia. Priorize peso e fixação segura antes de qualquer recurso avançado. 🐕\n\nNo artigo: o que mais considerar além do peso na escolha para cães pequenos.',
      hashtags: ['#smartpetgadgets', '#cachorros'],
      sourceExcerpt: 'um dispositivo pesado demais tende a ser removido pelo próprio tutor por desconforto do animal, o que anula qualquer benefício da tecnologia',
      section: 'Conclusão',
    }),
  },

  'coleira-gps-cachorro-que-foge': {
    reel: reel({
      slug: 'coleira-gps-cachorro-que-foge',
      hook: 'Cão que foge muito? Coleira Bluetooth pode ser a escolha errada',
      problema: 'Tutor de cão fujão compra a coleira mais barata (Bluetooth) achando que qualquer GPS resolve.',
      informacao: 'Modelos Bluetooth têm alcance curto — inúteis se o cão já está longe de casa quando você percebe a fuga. Para esse perfil, um modelo com chip de operadora, mesmo com mensalidade, tende a valer o investimento.',
      solucaoLabel: 'Guia de coleira GPS para cachorro que foge muito',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'Modelos Bluetooth têm alcance curto — inúteis se o cão já está longe de casa quando você percebe a fuga.',
      section: 'Priorize Alcance Real, Não Apenas Preço',
    }),
    post: post({
      slug: 'coleira-gps-cachorro-que-foge',
      titulo_gatilho: 'Cão foge direto? Pode não ser só comportamento aleatório',
      legenda: 'Fuga recorrente também pode ter causas comportamentais — ansiedade de separação, falta de estímulo físico e mental, ou período de cio — que a coleira GPS não resolve sozinha, apenas ajuda a localizar o cão depois que ele já fugiu. 🐕\n\nNo artigo: o que priorizar na escolha quando a fuga é frequente.',
      hashtags: ['#smartpetgadgets', '#cachorros'],
      sourceExcerpt: 'Fuga recorrente também pode ter causas comportamentais — ansiedade de separação, falta de estímulo físico e mental, ou período de cio — que a coleira GPS não resolve sozinha',
      section: 'Quando o Problema Pode Ser Comportamental',
    }),
  },

  'coleira-gps-para-gato': {
    reel: reel({
      slug: 'coleira-gps-para-gato',
      hook: 'Seu gato pode andar até 3 km de casa numa única noite',
      problema: 'Tutor de gato acha que o animal só circula pelo quintal e se surpreende com o raio real de deslocamento.',
      informacao: 'Gatos são naturalmente exploradores e entendem a vizinhança, não só a casa, como seu território — em uma noite, um gato pode circular em um raio de até 3 km de casa.',
      solucaoLabel: 'Guia de coleira GPS para gato',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'em uma noite, um gato pode circular em um raio de até 3 km de casa',
      section: 'Por Que Gatos Fogem — e Como Isso Afeta o GPS',
    }),
    post: post({
      slug: 'coleira-gps-para-gato',
      titulo_gatilho: 'Bateria de coleira GPS para gato dura de 2 a 14 dias — a diferença é a frequência de atualização',
      legenda: 'Configurar uma frequência de atualização mais espaçada aumenta a autonomia, mas reduz a precisão em tempo real — uma troca que vale ajustar conforme a rotina do seu gato. 🐱\n\nNo artigo: o que muda na coleira GPS para gato em relação ao cão.',
      hashtags: ['#smartpetgadgets', '#gatos'],
      sourceExcerpt: 'A duração da bateria em coleiras GPS para gato varia de 2 a 14 dias, dependendo do padrão de uso e da frequência de atualização configurada no app',
      section: 'Autonomia de Bateria em Coleiras para Gato',
    }),
  },

  'erros-comuns-coleira-gps-pet': {
    reel: reel({
      slug: 'erros-comuns-coleira-gps-pet',
      hook: 'Achou que sua coleira GPS quebrou porque a bateria não durou 1 dia?',
      problema: 'Tutor liga o rastreamento rápido, a bateria acaba cedo e ele acha que o produto tem defeito.',
      informacao: 'Um dos problemas mais relatados é a bateria durar apenas um dia quando o modo de rastreamento rápido está ativo — o erro é não ajustar a frequência de atualização conforme a necessidade real.',
      solucaoLabel: 'Guia de erros comuns com coleira GPS no pet',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'Um dos problemas mais relatados é a bateria durar apenas um dia quando o modo de rastreamento rápido está ativo',
      section: 'Achar Que a Bateria Dura Dias em Modo de Rastreamento Rápido',
    }),
    post: post({
      slug: 'erros-comuns-coleira-gps-pet',
      titulo_gatilho: 'Modo econômico da coleira GPS pode levar até 10 minutos pra atualizar',
      legenda: 'Em modo econômico, a atualização de posição pode levar até 10 minutos — isso não é falha, é a configuração de bateria escolhida. Se seu cenário exige resposta rápida, vale mudar para o modo de rastreamento rápido mesmo sacrificando autonomia. ⏱️\n\nNo artigo: os erros mais comuns relatados por quem já usa coleira GPS.',
      hashtags: ['#smartpetgadgets', '#coleiragpsparapet'],
      sourceExcerpt: 'Em modo econômico, a atualização de posição pode levar até 10 minutos — isso não é falha, é a configuração de bateria escolhida',
      section: 'Esperar Atualização Instantânea o Tempo Todo',
    }),
  },

  'melhor-coleira-gps-sem-mensalidade': {
    reel: reel({
      slug: 'melhor-coleira-gps-sem-mensalidade',
      hook: '"Sem mensalidade" no anúncio nem sempre significa "sem nenhuma cobrança"',
      problema: 'Tutor compra coleira anunciada como "sem mensalidade" e descobre depois uma taxa de ativação escondida.',
      informacao: 'O problema é que "sem mensalidade" nem sempre significa "sem nenhuma cobrança": alguns anúncios omitem taxas de ativação ou de acesso a recursos avançados do app.',
      solucaoLabel: 'Guia da melhor coleira GPS sem mensalidade',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: '"sem mensalidade" nem sempre significa "sem nenhuma cobrança": alguns anúncios omitem taxas de ativação ou de acesso a recursos avançados do app',
      section: 'introdução',
    }),
    post: post({
      slug: 'melhor-coleira-gps-sem-mensalidade',
      titulo_gatilho: 'Por que algumas coleiras GPS cobram mensalidade e outras não?',
      legenda: 'Modelos com chip de operadora dependem de um plano de dados para funcionar — é esse custo de conectividade que gera a mensalidade. Já modelos Bluetooth ou NB-IoT podem operar sem taxa recorrente, porque a transmissão de dados é mínima. 📡\n\nNo artigo: o que checar no anúncio antes de comprar.',
      hashtags: ['#smartpetgadgets', '#coleiragpsparapet'],
      sourceExcerpt: 'É esse custo de conectividade que gera a mensalidade. Já modelos Bluetooth ou baseados em redes de baixo consumo (NB-IoT), usadas por alguns modelos mais recentes, podem operar sem taxa recorrente',
      section: 'Por Que Algumas Coleiras Têm Mensalidade e Outras Não',
    }),
  },

  'porta-eletronica-microchip-x-rfid-coleira': {
    reel: reel({
      slug: 'porta-eletronica-microchip-x-rfid-coleira',
      hook: 'Seu pet não tem microchip? A porta eletrônica ainda funciona pra ele',
      problema: 'Tutor acha que precisa implantar microchip pra usar porta eletrônica automática.',
      informacao: 'Se o pet não tem microchip, é possível usar um medalhão de identificação por radiofrequência preso à coleira ou pingente, funcionando como alternativa equivalente.',
      solucaoLabel: 'Guia porta eletrônica microchip x RFID na coleira',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'é possível usar um medalhão de identificação por radiofrequência Sure Petcare preso à coleira ou pingente, funcionando como alternativa equivalente',
      section: 'Como Funciona o Medalhão RFID',
    }),
    post: post({
      slug: 'porta-eletronica-microchip-x-rfid-coleira',
      titulo_gatilho: 'Quantos pets uma porta eletrônica reconhece ao mesmo tempo?',
      legenda: 'Modelos completos podem registrar até 32 microchips eletrônicos diferentes, permitindo autorizar vários pets da mesma casa. 🐾\n\nNo artigo: quando usar leitura de microchip e quando usar medalhão RFID.',
      hashtags: ['#smartpetgadgets', '#portaeletronicaautomaticaparapet'],
      sourceExcerpt: 'Modelos completos podem registrar até 32 microchips eletrônicos diferentes, permitindo autorizar vários pets da mesma casa',
      section: 'Quantos Animais a Porta Reconhece',
    }),
  },

  'comedouro-automatico-para-pet': {
    reel: reel({
      slug: 'comedouro-automatico-para-pet',
      hook: 'O maior ponto de reclamação de comedouro Wi-Fi não é o motor — é a conexão',
      problema: 'Tutor escolhe comedouro Wi-Fi achando que a única preocupação é o mecanismo dispensador.',
      informacao: 'Modelos com app Wi-Fi permitem programar porções remotamente, mas dependem de conexão estável — o principal ponto de reclamação nesse segmento.',
      solucaoLabel: 'Guia completo de comedouro automático para pet',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'Modelos com app Wi-Fi permitem programar porções remotamente, mas dependem de conexão estável — o principal ponto de reclamação nesse segmento.',
      section: 'Key Takeaways',
    }),
    post: post({
      slug: 'comedouro-automatico-para-pet',
      titulo_gatilho: 'Comedouro pra gato precisa de mais refeições — não mais ração',
      legenda: 'Gatos, por comerem porções menores e com mais frequência ao longo do dia, se beneficiam de programações com mais refeições (4-6x) em quantidades reduzidas — diferente de cães de porte maior, que precisam de compartimentos maiores. 🐱\n\nNo artigo: os tipos de comedouro automático disponíveis no Brasil.',
      hashtags: ['#smartpetgadgets', '#comedouroautomaticoparapet'],
      sourceExcerpt: 'Gatos, por comerem porções menores e com mais frequência ao longo do dia, se beneficiam de programações com mais refeições (4-6x) em quantidades reduzidas.',
      section: 'Comedouro para Cães x Comedouro para Gatos: as Diferenças Importam?',
    }),
  },

  'comedouro-automatico-vale-a-pena': {
    reel: reel({
      slug: 'comedouro-automatico-vale-a-pena',
      hook: 'Cão em jejum por 12h já corre risco de hipoglicemia',
      problema: 'Tutor com rotina irregular atrasa a alimentação sem perceber o risco real do jejum prolongado.',
      informacao: 'A partir de cerca de 12 horas de jejum, cães podem apresentar risco de hipoglicemia — reforçando por que uma rotina alimentar estável (automática ou não) importa mais do que o gadget em si.',
      solucaoLabel: 'Guia se vale a pena comprar um comedouro automático',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'a partir de cerca de 12 horas de jejum, cães podem apresentar risco de hipoglicemia',
      section: 'Quando Não Vale a Pena (ou Vale Investir Menos)',
    }),
    post: post({
      slug: 'comedouro-automatico-vale-a-pena',
      titulo_gatilho: 'Comedouro automático não resolve ansiedade alimentar do pet',
      legenda: 'O pet tem histórico de comportamento alimentar compulsivo ou ansiedade? Nesse caso, o problema é comportamental, não de equipamento, e um comedouro automático não resolve. 🐾\n\nNo artigo: quando vale a pena investir e quando não vale.',
      hashtags: ['#smartpetgadgets', '#comedouroautomaticoparapet'],
      sourceExcerpt: 'O pet tem histórico de comportamento alimentar compulsivo ou ansiedade — nesse caso, o problema é comportamental, não de equipamento, e um comedouro automático não resolve',
      section: 'Quando Não Vale a Pena (ou Vale Investir Menos)',
    }),
  },
};

module.exports = { ESCALA_LOTE2_REEL_POST };
