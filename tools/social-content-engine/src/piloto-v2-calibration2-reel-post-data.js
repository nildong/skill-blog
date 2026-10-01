'use strict';

/**
 * Reel + Post V2 para a 2ª calibração (10 artigos DIFERENTES do piloto
 * original — sem concentração no cluster de comedouros, cobrindo
 * COMPARISON, FAQ, REVIEW, HOW_TO, artigo curto e artigo atípico).
 * Mesmo princípio dos dados anteriores: fato específico de
 * body_text_full, nunca preço, `source.source_excerpt` literal.
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

const CALIBRATION2_REEL_POST = {
  'porta-eletronica-x-alcapao-tradicional': {
    reel: reel({
      slug: 'porta-eletronica-x-alcapao-tradicional',
      hook: 'Seu alçapão tradicional deixa entrar qualquer bicho do tamanho certo',
      problema: 'Tutor instala alçapão achando que só o próprio pet vai usar.',
      informacao: 'O alçapão tradicional não identifica o animal — qualquer bicho do tamanho certo pode passar por ele, incluindo gatos de rua ou animais selvagens.',
      solucaoLabel: 'Guia completo porta eletrônica x alçapão',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'não identifica o animal — qualquer bicho do tamanho certo pode passar por ele, incluindo gatos de rua ou animais selvagens.',
      section: 'introdução',
    }),
    post: post({
      slug: 'porta-eletronica-x-alcapao-tradicional',
      titulo_gatilho: 'Quanto custa a diferença entre alçapão e porta eletrônica?',
      legenda: 'Modelo tradicional sem eletrônica custa uma fração do preço de uma porta com microchip — mas não identifica quem está passando. A porta eletrônica resolve exatamente esse ponto, ao custo de um investimento maior. 🐾\n\nNo artigo: quando o alçapão simples ainda resolve, e quando vale pagar mais pela porta eletrônica.',
      hashtags: ['#smartpetgadgets', '#portaeletronicaautomaticaparapet'],
      sourceExcerpt: 'Modelos tradicionais sem eletrônica no mercado brasileiro custam uma fração do preço de uma porta com microchip (comparativo de preços consultado via Luchini Shop, retrieved 2026-08-22).',
      section: 'introdução',
    }),
  },

  'brinquedo-interativo-pilha-x-recarregavel': {
    reel: reel({
      slug: 'brinquedo-interativo-pilha-x-recarregavel',
      hook: 'Só 2% das pilhas comuns são recicladas no Brasil',
      problema: 'Brinquedo automático a pilha parece prático, mas tem um custo escondido.',
      informacao: 'Baterias recarregáveis modernas suportam centenas de ciclos de recarga (algumas para mais de 500), reduzindo bastante o descarte de pilhas comuns — das quais apenas cerca de 2% são recicladas no Brasil.',
      solucaoLabel: 'Guia completo pilha x recarregável',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'das quais apenas cerca de 2% são recicladas no Brasil (LXbattery, retrieved 2026-08-22)',
      section: 'Bateria Recarregável via USB',
    }),
    post: post({
      slug: 'brinquedo-interativo-pilha-x-recarregavel',
      titulo_gatilho: 'Bateria recarregável aguenta quantos usos?',
      legenda: 'Baterias recarregáveis modernas suportam centenas de ciclos de recarga — algumas classificadas para mais de 500. Compensa mais pra quem usa o brinquedo todo dia; pra uso ocasional, pilha comum ainda ganha em praticidade. 🔋\n\nNo artigo: qual escolher conforme a rotina do seu gato.',
      hashtags: ['#smartpetgadgets', '#gatos'],
      sourceExcerpt: 'baterias recarregáveis modernas suportam centenas de ciclos de recarga (algumas classificadas para mais de 500), reduzindo bastante o descarte de pilhas comuns',
      section: 'Bateria Recarregável via USB',
    }),
  },

  'duvidas-coleira-gps-pet': {
    reel: reel({
      slug: 'duvidas-coleira-gps-pet',
      hook: 'Ativou o rastreamento em tempo real? Sua bateria pode não durar nem 1 dia',
      problema: 'Tutor liga o modo de rastreamento rápido e se frustra com a coleira descarregando cedo demais.',
      informacao: 'Em modo de rastreamento rápido, a autonomia da bateria cai bastante — há relatos de bateria durando cerca de um dia nesse modo, contra até 14 dias no modo padrão.',
      solucaoLabel: 'Guia completo de dúvidas sobre coleira GPS',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'há relatos de bateria durando cerca de um dia nesse modo (SecSystem, retrieved 2026-08-22)',
      section: 'Quanto tempo dura a bateria de uma coleira GPS?',
    }),
    post: post({
      slug: 'duvidas-coleira-gps-pet',
      titulo_gatilho: 'Coleira GPS incomoda o pet? Não é a tecnologia, é o peso',
      legenda: 'O incômodo de uma coleira GPS geralmente não vem da tecnologia — vem de dispositivo pesado demais para o tamanho do pet. Existem opções de 8 a 9,3 gramas pensadas pra portes pequenos. 🐕\n\nNo artigo: as dúvidas mais comuns antes de comprar — bateria, resistência à água, mensalidade e cobertura.',
      hashtags: ['#smartpetgadgets', '#coleiragpsparapet'],
      sourceExcerpt: 'O incômodo geralmente vem de dispositivo pesado demais para o tamanho do pet, não da tecnologia em si.',
      section: 'A coleira GPS incomoda o pet?',
    }),
  },

  'duvidas-brinquedo-interativo-gato': {
    reel: reel({
      slug: 'duvidas-brinquedo-interativo-gato',
      hook: 'Brinquedo automático substitui você brincando com seu gato?',
      problema: 'Tutor compra brinquedo automático achando que resolve toda a necessidade de interação do gato.',
      informacao: 'Não. O brinquedo automático complementa a estimulação física e mental do gato quando o tutor está ausente, mas não substitui a interação direta, que tem valor social e emocional próprio.',
      solucaoLabel: 'Guia completo de dúvidas sobre brinquedo interativo',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'Ele complementa a estimulação física e mental do gato quando o tutor está ausente, mas não substitui a interação direta, que tem valor social e emocional próprio.',
      section: 'Brinquedo interativo automático substitui brincar com o tutor?',
    }),
    post: post({
      slug: 'duvidas-brinquedo-interativo-gato',
      titulo_gatilho: 'Brinquedo interativo funciona pra gato idoso?',
      legenda: 'Funciona, sim — desde que o movimento seja suave e não exija saltos ou corridas intensas. 🐱\n\nNo artigo: as dúvidas mais comuns sobre brinquedo interativo automático, de preço a pilha x recarregável.',
      hashtags: ['#smartpetgadgets', '#gatos'],
      sourceExcerpt: 'Sim, desde que o movimento seja suave e não exija saltos ou corridas intensas.',
      section: 'Brinquedo interativo funciona para gato idoso?',
    }),
  },

  'cat-mate-c500-review': {
    reel: reel({
      slug: 'cat-mate-c500-review',
      hook: 'Como manter ração úmida do gato segura por até 12 horas sem geladeira',
      problema: 'Tutor que trabalha fora não confia em deixar ração úmida programada o dia todo.',
      informacao: 'Duas bolsas de gelo reutilizáveis mantêm a ração úmida em temperatura segura por cerca de 8 a 12 horas em ambientes quentes — o suficiente pra um dia de trabalho, mas não pra viagens longas sem reabastecimento.',
      solucaoLabel: 'Review completo do Cat Mate C500',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'Duas bolsas de gelo reutilizáveis mantêm a ração úmida em temperatura segura por cerca de 8 a 12 horas em ambientes quentes (Cats.com, retrieved 2026-08-20).',
      section: 'Como Funciona o Sistema de Refrigeração',
    }),
    post: post({
      slug: 'cat-mate-c500-review',
      titulo_gatilho: 'Esse comedouro não é ideal pra gatos de face larga — e o motivo é físico',
      legenda: 'Os compartimentos estreitos do Cat Mate C500 podem causar desconforto ("estresse de bigode") em gatos de face mais larga, como persas e exóticos. Pra gatos de face comum, não é problema. 🐈\n\nNo review: como funciona o sistema de refrigeração, rotina de uso e pra quem realmente vale a pena.',
      hashtags: ['#smartpetgadgets', '#gatos'],
      sourceExcerpt: 'Compartimentos estreitos podem causar desconforto ("estresse de bigode") em gatos de face mais larga.',
      section: 'Key Takeaways',
    }),
  },

  'brinquedo-interativo-gato-idoso-vale-a-pena': {
    reel: reel({
      slug: 'brinquedo-interativo-gato-idoso-vale-a-pena',
      hook: 'Seu gato idoso não brinca mais? Pode não ser só idade.',
      problema: 'Tutor acha que o gato "perdeu o interesse" em brincar por envelhecer, e não investiga mais.',
      informacao: 'A redução de interesse em brincar muitas vezes está ligada a dor articular, declínio cognitivo, menor energia ou alterações sensoriais — não é simplesmente "falta de vontade".',
      solucaoLabel: 'Guia completo brinquedo interativo para gato idoso',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'está ligada a fatores como dor articular, declínio cognitivo, menor energia ou alterações sensoriais — não é simplesmente "falta de vontade" (Hospital Veterinário Cats Londrina, retrieved 2026-08-22).',
      section: 'Por Que Gatos Idosos Brincam Menos',
    }),
    post: post({
      slug: 'brinquedo-interativo-gato-idoso-vale-a-pena',
      titulo_gatilho: 'O brinquedo automático sozinho pode não ser suficiente',
      legenda: 'Gatos idosos tendem a iniciar menos brincadeiras por conta própria, mas se engajam bastante quando o tutor oferece a atividade primeiro. Ou seja: o brinquedo automático ajuda, mas não substitui você chamando o gato pra brincar. 🐾\n\nNo artigo: os tipos de brinquedo mais indicados pra essa fase.',
      hashtags: ['#smartpetgadgets', '#gatos'],
      sourceExcerpt: 'Gatos idosos tendem a iniciar menos brincadeiras por conta própria, mas demonstram grande engajamento quando o tutor oferece atividades apropriadas — ou seja, o brinquedo automático sozinho pode não ser suficiente sem algum incentivo inicial do tutor.',
      section: 'O Papel do Tutor',
    }),
  },

  'como-instalar-porta-eletronica-pet': {
    reel: reel({
      slug: 'como-instalar-porta-eletronica-pet',
      hook: 'Instalar porta eletrônica em vidro sem cuidado pode trincar o material',
      problema: 'Tutor tenta instalar porta eletrônica em porta de vidro do mesmo jeito que faria em madeira.',
      informacao: 'Quando o corte em vidro é necessário, recomenda-se broca diamantada e acompanhamento profissional especializado, dado o risco de trincar o material — diferente de madeira ou alumínio, onde o corte não tem esse risco.',
      solucaoLabel: 'Guia completo de instalação de porta eletrônica',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'recomenda-se broca diamantada e acompanhamento profissional especializado em vidro, dado o risco de trincar o material.',
      section: 'Instalação em Porta de Vidro',
    }),
    post: post({
      slug: 'como-instalar-porta-eletronica-pet',
      titulo_gatilho: 'O erro mais comum ao instalar porta eletrônica não é técnico',
      legenda: 'Posicionar a altura errada em relação ao porte do pet e não testar o sistema de identificação antes de liberar o uso são os erros mais citados por quem já instalou. Ou seja: o problema raramente é a porta, é o processo. 🔧\n\nNo artigo: passo a passo completo pra vidro, madeira e alumínio.',
      hashtags: ['#smartpetgadgets', '#portaeletronicaautomaticaparapet'],
      sourceExcerpt: 'Posicionar a altura errada em relação ao porte do pet e não testar o sistema de identificação antes de liberar o uso são os erros mais citados por quem já instalou esse tipo de porta.',
      section: 'Erros Comuns na Instalação',
    }),
  },

  'como-funciona-coleira-gps-cachorro': {
    reel: reel({
      slug: 'como-funciona-coleira-gps-cachorro',
      hook: 'GPS da coleira erra por quantos metros? Depende de onde seu cão está',
      problema: 'Tutor espera precisão perfeita em qualquer lugar e se frustra quando a localização "falha".',
      informacao: 'O GPS por satélite é a tecnologia mais precisa em áreas abertas, com margem de erro em torno de 5 metros em condições ideais — mas funciona pior perto de prédios altos, dentro de casa ou em áreas arborizadas.',
      solucaoLabel: 'Guia completo de como funciona a coleira GPS',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'a margem de erro costuma ficar em torno de 5 metros em condições ideais.',
      section: 'GPS por Satélite',
    }),
    post: post({
      slug: 'como-funciona-coleira-gps-cachorro',
      titulo_gatilho: 'Por que a localização da coleira às vezes demora pra atualizar',
      legenda: 'A velocidade de atualização varia por modelo: alguns levam poucos segundos, outros — em modo de economia de bateria — podem demorar até 10 minutos. Não é defeito, é uma troca proposital entre autonomia e precisão em tempo real. 📍\n\nNo artigo: as três tecnologias por trás da coleira GPS (satélite, Wi-Fi e rede móvel) e o que cada uma resolve.',
      hashtags: ['#smartpetgadgets', '#coleiragpsparapet'],
      sourceExcerpt: 'alguns dispositivos levam poucos segundos, outros — em modo de economia de bateria — podem demorar até 10 minutos para atualizar (relatos de usuários compilados por SecSystem, retrieved 2026-08-22).',
      section: 'Velocidade de Atualização da Localização',
    }),
  },

  'soprador-pet': {
    reel: reel({
      slug: 'soprador-pet',
      hook: 'Soprador pet não é secador de cabelo — a diferença está na temperatura',
      problema: 'Tutor usa secador de cabelo comum no cão achando que é a mesma coisa que um soprador pet.',
      informacao: 'Diferente do secador comum, que aquece bastante o ar para acelerar a evaporação, o soprador aposta em alto volume de ar em temperatura mais amena — o que seca mais rápido sem concentrar calor num único ponto.',
      solucaoLabel: 'Guia completo do soprador pet de dois motores',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'Diferente do secador comum, que aquece bastante o ar para acelerar a evaporação, o soprador aposta em alto volume de ar em temperatura mais amena, o que seca mais rápido sem concentrar calor num único ponto por muito tempo.',
      section: 'O que é um soprador pet e como ele funciona?',
    }),
    post: post({
      slug: 'soprador-pet',
      titulo_gatilho: 'Soprador pet serve para gato também? Sim, com um cuidado a mais',
      legenda: 'Gatos costumam ser mais sensíveis a ruído e ao jato de ar do que a maioria dos cães, então a introdução ao aparelho precisa ser ainda mais gradual. 🐱💨\n\nNo guia: a diferença entre soprador e secador comum, os cuidados essenciais de uso, e pra quem realmente vale o investimento em dois motores.',
      hashtags: ['#smartpetgadgets', '#gatos', '#cachorros'],
      sourceExcerpt: 'gatos costumam ser mais sensíveis a ruído e ao jato de ar do que a maioria dos cães, então a introdução ao aparelho deve ser ainda mais gradual.',
      section: 'Soprador para pet serve para gatos também?',
    }),
  },

  'cerca-virtual-para-cachorro': {
    reel: reel({
      slug: 'cerca-virtual-para-cachorro',
      hook: 'Cerca virtual dispara mais alertas à noite com gatos? Não é bug.',
      problema: 'Tutor de gato acha que a cerca virtual está com defeito porque dispara alerta demais.',
      informacao: 'O comportamento territorial felino, com raio de exploração maior à noite, pode gerar mais alertas de saída — não é defeito, é o comportamento normal da espécie sendo capturado pelo sistema.',
      solucaoLabel: 'Guia completo de cerca virtual para cachorro',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'com a diferença de que o comportamento territorial felino (raio de exploração maior à noite) pode gerar mais alertas de saída — não é defeito, é o comportamento normal da espécie sendo capturado pelo sistema.',
      section: 'Cerca Virtual Também Funciona em Gatos',
    }),
    post: post({
      slug: 'cerca-virtual-para-cachorro',
      titulo_gatilho: 'Cerca virtual avisa que o cão fugiu — não impede a fuga',
      legenda: 'Trate o alerta da cerca virtual como uma ferramenta de reação rápida, não como uma barreira física: ele avisa que o cão saiu, mas não impede fisicamente a fuga. 🚨\n\nNo artigo: como configurar corretamente e por que testar antes de confiar no sistema.',
      hashtags: ['#smartpetgadgets', '#cachorros', '#coleiragpsparapet'],
      sourceExcerpt: 'Trate o alerta como uma ferramenta de reação rápida, não como uma barreira física — ele avisa que o cão saiu, mas não impede fisicamente a fuga.',
      section: 'Conclusão',
    }),
  },
};

module.exports = { CALIBRATION2_REEL_POST };
