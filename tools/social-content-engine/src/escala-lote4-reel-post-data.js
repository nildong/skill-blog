'use strict';

/**
 * Reel + Post V2 — ESCALA, Lote 4/final (16 artigos: fecha o cluster
 * camera-para-monitorar-pet, fecha o cluster porta-eletronica-automatica-
 * para-pet, e cobre os 2 artigos de cluster desconhecido/heurístico
 * melhor-alimentador-automatico-gatos e melhor-bebedouro-automatico-pet).
 * Mesmo princípio dos lotes anteriores: fato específico do corpo, nunca
 * preço, `source.source_excerpt` sempre um trecho literal do HTML.
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

const ESCALA_LOTE4_REEL_POST = {
  'camera-pet-cachorro-ansiedade-separacao': {
    reel: reel({
      slug: 'camera-pet-cachorro-ansiedade-separacao',
      hook: 'A câmera pet não trata a ansiedade do seu cão — ela só acende a luz do que estava no escuro',
      problema: 'Tutor compra câmera achando que o produto resolve a ansiedade de separação do cão sozinho.',
      informacao: 'Câmeras domésticas não inventam nem resolvem a ansiedade de separação — elas apenas revelam o que estava acontecendo sem supervisão, como latidos constantes ou destruição de objetos.',
      solucaoLabel: 'Guia sobre câmera pet e ansiedade de separação',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'Câmeras domésticas não inventam nem resolvem a ansiedade de separação — elas apenas "acendem a luz de um cômodo que ficava no escuro"',
      section: 'O Que a Câmera Não Faz',
    }),
    post: post({
      slug: 'camera-pet-cachorro-ansiedade-separacao',
      titulo_gatilho: '4 sinais de ansiedade de separação pra observar nas gravações da câmera',
      legenda: 'Latido persistente logo após você sair, destruição concentrada nos primeiros minutos sozinho, andar em círculos e recusa de comida durante toda a ausência — se aparecem de forma consistente, vale considerar apoio profissional. 🐕\n\nNo artigo: o que a câmera realmente ajuda a fazer (e o que ela não substitui).',
      hashtags: ['#smartpetgadgets', '#cameraparamonitorarpet'],
      sourceExcerpt: 'Latido ou uivo persistente logo após a saída do tutor Destruição de objetos concentrada nos primeiros minutos sozinho',
      section: 'Sinais Que Vale Observar nas Gravações',
    }),
  },

  'camera-pet-com-dispensador-de-petisco': {
    reel: reel({
      slug: 'camera-pet-com-dispensador-de-petisco',
      hook: 'Dispensador de petisco na câmera não é refeição — é reforço pontual',
      problema: 'Tutor confunde o dispensador de petisco da câmera com um comedouro automático de refeições.',
      informacao: 'O dispensador de petisco da câmera libera pequenas quantidades pontuais, sob comando manual do tutor — não substitui um comedouro automático com timer para refeições completas e programadas.',
      solucaoLabel: 'Guia sobre câmera pet com dispensador de petisco',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'o dispensador de petisco da câmera libera pequenas quantidades pontuais, sob comando manual do tutor — não substitui um comedouro automático com timer para refeições completas e programadas',
      section: 'Diferença para um Comedouro Automático',
    }),
    post: post({
      slug: 'camera-pet-com-dispensador-de-petisco',
      titulo_gatilho: 'Dispensador de petisco vale a pena? Depende de quanto você vai interagir',
      legenda: 'Se seu objetivo é só ver o pet e falar com ele, o dispensador de petisco pode ser um custo adicional que talvez não vá usar com frequência. Vale considerar o quanto você pretende interagir ativamente pelo app, além de só monitorar. 🎯\n\nNo artigo: quando esse recurso realmente ajuda.',
      hashtags: ['#smartpetgadgets', '#cameraparamonitorarpet'],
      sourceExcerpt: 'Se seu objetivo é só ver o pet e falar com ele, o dispensador de petisco é um custo adicional que talvez não vá usar com frequência.',
      section: 'Quando Pode Ser Só Custo Extra',
    }),
  },

  'camera-pet-grava-sem-internet': {
    reel: reel({
      slug: 'camera-pet-grava-sem-internet',
      hook: 'Sua câmera continua gravando na queda de internet — mas 3 recursos param na hora',
      problema: 'Tutor entra em pânico achando que perdeu toda a gravação quando a internet cai.',
      informacao: 'A gravação local no cartão microSD continua normalmente mesmo sem internet, mas visualização ao vivo, notificações push e backup em nuvem param de funcionar até a conexão voltar.',
      solucaoLabel: 'Guia sobre câmera pet gravando sem internet',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'A gravação local no cartão microSD continua normalmente, já que ocorre diretamente no dispositivo, sem depender de conexão com a internet',
      section: 'O Que Continua Funcionando Offline',
    }),
    post: post({
      slug: 'camera-pet-grava-sem-internet',
      titulo_gatilho: 'Cartão SD errado pode comprometer a gravação da sua câmera pet',
      legenda: 'Para gravação confiável, o cartão deve ser de classe 10 ou UHS-1, formatado em FAT32 (capacidades abaixo de 64 GB) ou exFAT (64 GB ou mais). 💾\n\nNo artigo: o que continua funcionando sem internet e o que para completamente.',
      hashtags: ['#smartpetgadgets', '#cameraparamonitorarpet'],
      sourceExcerpt: 'o cartão deve ser de classe 10 ou UHS-1, formatado em FAT32 (capacidades abaixo de 64 GB) ou exFAT (64 GB ou mais)',
      section: 'Requisitos do Cartão SD',
    }),
  },

  'camera-pet-visao-noturna-funciona': {
    reel: reel({
      slug: 'camera-pet-visao-noturna-funciona',
      hook: 'Por que a imagem da câmera fica em preto e branco à noite?',
      problema: 'Tutor acha que a câmera "quebrou a cor" quando o modo noturno ativa.',
      informacao: 'Os sensores de câmera não conseguem captar cor sem luz visível suficiente — por isso, no modo infravermelho, a imagem aparece em tons de cinza, mesmo que durante o dia a mesma câmera grave em cores normalmente.',
      solucaoLabel: 'Guia sobre como funciona a visão noturna em câmera pet',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'Os sensores de câmera não conseguem captar cor sem luz visível suficiente — por isso, no modo infravermelho, a imagem aparece em tons de cinza',
      section: 'Por Que a Imagem Fica em Preto e Branco à Noite',
    }),
    post: post({
      slug: 'camera-pet-visao-noturna-funciona',
      titulo_gatilho: 'Visão noturna tem alcance limitado — e isso muda onde posicionar a câmera',
      legenda: 'Modelos populares no mercado brasileiro oferecem alcance de visão noturna de até 9 metros — suficiente para a maioria dos cômodos residenciais, mas insuficiente para áreas externas grandes. 🌙\n\nNo artigo: como a visão noturna funciona de verdade e suas limitações.',
      hashtags: ['#smartpetgadgets', '#cameraparamonitorarpet'],
      sourceExcerpt: 'suficiente para a maioria dos cômodos residenciais, mas insuficiente para áreas externas grandes',
      section: 'Alcance Real',
    }),
  },

  'como-configurar-camera-pet-wifi': {
    reel: reel({
      slug: 'como-configurar-camera-pet-wifi',
      hook: 'Câmera pet não conecta? 9 em 10 vezes o problema é a rede errada',
      problema: 'Tutor tenta configurar a câmera repetidas vezes sem saber que está na rede Wi-Fi errada.',
      informacao: 'Câmeras de segurança residenciais funcionam exclusivamente na banda 2,4 GHz, não em 5 GHz — essa é a causa mais citada de falha de conexão em câmeras pet.',
      solucaoLabel: 'Guia de como configurar a câmera pet no Wi-Fi',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'câmeras de segurança residenciais funcionam exclusivamente nessa banda, não em 5 GHz',
      section: 'Passo a Passo Básico',
    }),
    post: post({
      slug: 'como-configurar-camera-pet-wifi',
      titulo_gatilho: 'Trocou a senha do Wi-Fi? Sua câmera pet vai desconectar de vez',
      legenda: 'Trocar a senha do Wi-Fi depois da instalação faz a câmera perder a conexão permanentemente até ser reconfigurada manualmente. Vale lembrar disso antes de mudar a rede de casa. 📶\n\nNo artigo: o passo a passo completo e os erros mais comuns de conexão.',
      hashtags: ['#smartpetgadgets', '#cameraparamonitorarpet'],
      sourceExcerpt: 'a câmera perde a conexão permanentemente até ser reconfigurada manualmente',
      section: 'Erros Mais Comuns',
    }),
  },

  'erros-comuns-camera-monitorar-pet': {
    reel: reel({
      slug: 'erros-comuns-camera-monitorar-pet',
      hook: 'Micro-ondas pode ser o motivo da sua câmera pet cair de conexão',
      problema: 'Tutor acha que a câmera tem defeito quando a conexão cai de forma intermitente.',
      informacao: 'Micro-ondas, babás eletrônicas e até telefones sem fio podem interferir no sinal Wi-Fi da câmera, causando quedas intermitentes de conexão — problema de ambiente, não de produto.',
      solucaoLabel: 'Guia de erros comuns ao usar câmera para monitorar pet',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'Micro-ondas, babás eletrônicas e até telefones sem fio podem interferir no sinal Wi-Fi da câmera, causando quedas intermitentes de conexão.',
      section: 'Ignorar Interferência de Outros Aparelhos',
    }),
    post: post({
      slug: 'erros-comuns-camera-monitorar-pet',
      titulo_gatilho: '4 pontos pra checar antes de achar que sua câmera pet tem defeito',
      legenda: 'Antes de considerar a câmera com defeito, cheque: banda de rede (2,4 GHz), se a senha do Wi-Fi mudou recentemente, interferência de outros aparelhos e a especificação do cartão SD. 🔍\n\nNo artigo: os 5 erros mais comuns na configuração e uso de câmera pet.',
      hashtags: ['#smartpetgadgets', '#cameraparamonitorarpet'],
      sourceExcerpt: 'Antes de considerar a câmera com defeito, cheque: banda de rede (2,4 GHz), se a senha do Wi-Fi mudou recentemente, interferência de outros aparelhos e a especificação do cartão SD.',
      section: 'Conclusão',
    }),
  },

  'melhor-camera-para-monitorar-pet': {
    reel: reel({
      slug: 'melhor-camera-para-monitorar-pet',
      hook: 'Não existe uma "melhor câmera pet" — existe a certa pro seu problema',
      problema: 'Tutor pesquisa "melhor câmera pet" esperando uma resposta única, sem considerar o próprio uso.',
      informacao: 'Não existe uma única "melhor câmera para pet" — existe o modelo certo para o que você mais precisa: custo-benefício básico, recursos interativos completos, ou imagem noturna superior.',
      solucaoLabel: 'Guia da melhor câmera para monitorar pet',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'Não existe uma única "melhor câmera para pet" — existe o modelo certo para o que você mais precisa: custo-benefício básico, recursos interativos completos, ou imagem noturna superior.',
      section: 'introdução',
    }),
    post: post({
      slug: 'melhor-camera-para-monitorar-pet',
      titulo_gatilho: '4 modelos de câmera pet, 4 pontos fortes diferentes',
      legenda: 'Custo-benefício com rotação 360°, modelo mais completo com dispensador de petisco e laser, imagem noturna mais eficiente, e opção com melhor equilíbrio entre preço e avaliação. 📷\n\nNo artigo: comparativo completo dos modelos mais citados no mercado brasileiro.',
      hashtags: ['#smartpetgadgets', '#cameraparamonitorarpet'],
      sourceExcerpt: 'rotação horizontal de 360° e vertical de 114° pelo app, resolução Full HD 1080p, visão noturna de até 9 metros e áudio bidirecional',
      section: 'TP-Link Tapo C200 — Custo-Benefício',
    }),
  },

  'duvidas-porta-eletronica-pet': {
    reel: reel({
      slug: 'duvidas-porta-eletronica-pet',
      hook: 'Porta eletrônica funciona sem energia elétrica? A resposta pode te surpreender',
      problema: 'Tutor acha que a porta eletrônica é 100% mecânica e não depende de energia.',
      informacao: 'A maioria dos modelos depende de bateria ou energia para o mecanismo de identificação e travamento — vale verificar a autonomia de bateria do modelo escolhido antes de comprar.',
      solucaoLabel: 'Guia de dúvidas sobre porta eletrônica para pet',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'a maioria dos modelos depende de bateria ou energia para o mecanismo de identificação e travamento',
      section: 'Porta eletrônica funciona sem energia elétrica ou bateria?',
    }),
    post: post({
      slug: 'duvidas-porta-eletronica-pet',
      titulo_gatilho: 'Pet sem microchip pode usar porta eletrônica? Sim — com esse acessório',
      legenda: 'Não necessariamente. Se o pet não tiver microchip, é possível usar um medalhão de identificação por radiofrequência preso à coleira como alternativa. 🐾\n\nNo artigo: as dúvidas mais comuns sobre porta eletrônica antes de comprar.',
      hashtags: ['#smartpetgadgets', '#portaeletronicaautomaticaparapet'],
      sourceExcerpt: 'Se o pet não tiver microchip, é possível usar um medalhão de identificação por radiofrequência preso à coleira como alternativa.',
      section: 'Preciso que meu pet tenha microchip para usar a porta eletrônica?',
    }),
  },

  'erros-comuns-porta-eletronica-pet': {
    reel: reel({
      slug: 'erros-comuns-porta-eletronica-pet',
      hook: 'Instalar porta pet só pensando no gato pode virar problema com o cão de casa',
      problema: 'Tutor com cão e gato compra o modelo pensado só pro menor dos dois pets.',
      informacao: 'Instalar um modelo dimensionado só para gatos em uma casa que também tem um cão de porte médio gera frustração e possível dano à estrutura — os tamanhos padrão do mercado já indicam o limite de peso e abertura para cada porte.',
      solucaoLabel: 'Guia de erros comuns com porta eletrônica para pet',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'Instalar um modelo dimensionado só para gatos em uma casa que também tem um cão de porte médio gera frustração e possível dano à estrutura',
      section: 'Não Considerar o Porte do Maior Animal da Casa',
    }),
    post: post({
      slug: 'erros-comuns-porta-eletronica-pet',
      titulo_gatilho: 'Testou o sistema de identificação antes de liberar a porta pro pet?',
      legenda: 'Liberar o uso da porta sem testar previamente se o microchip, RFID ou reconhecimento facial está reconhecendo corretamente pode resultar em falhas de acesso logo nos primeiros dias. 🔑\n\nNo artigo: os erros mais comuns na instalação e uso da porta eletrônica.',
      hashtags: ['#smartpetgadgets', '#portaeletronicaautomaticaparapet'],
      sourceExcerpt: 'Liberar o uso da porta sem testar previamente se o microchip, RFID ou reconhecimento facial está reconhecendo corretamente o pet pode resultar em falhas de acesso logo nos primeiros dias.',
      section: 'Pular o Teste do Sistema de Identificação',
    }),
  },

  'porta-eletronica-automatica-para-pet': {
    reel: reel({
      slug: 'porta-eletronica-automatica-para-pet',
      hook: 'Porta eletrônica com RFID reconhece até 32 pets diferentes',
      problema: 'Tutor de casa com vários pets acha que a porta eletrônica só serve pra um animal.',
      informacao: 'Os modelos com leitura de microchip ou RFID podem registrar até 32 microchips eletrônicos diferentes e são bastante eficazes para evitar a entrada de gatos de rua, animais selvagens ou outros intrusos.',
      solucaoLabel: 'Guia completo de porta eletrônica automática para pet',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'os modelos com leitura de microchip ou RFID podem registrar até 32 microchips eletrônicos diferentes',
      section: 'Impede a Entrada de Outros Animais?',
    }),
    post: post({
      slug: 'porta-eletronica-automatica-para-pet',
      titulo_gatilho: '4 tecnologias de porta eletrônica — qual identifica seu pet?',
      legenda: 'Microchip já implantado, medalhão RFID na coleira, chave eletrônica presa à coleira, ou reconhecimento facial por câmeras infravermelhas — cada tecnologia resolve a identificação de um jeito diferente. 🚪\n\nNo artigo: como escolher a certa pro seu caso.',
      hashtags: ['#smartpetgadgets', '#portaeletronicaautomaticaparapet'],
      sourceExcerpt: 'Modelos com reconhecimento facial usam duas câmeras infravermelhas para identificar o pet e só abrem para ele, não para outros animais.',
      section: 'Key Takeaways',
    }),
  },

  'porta-eletronica-funciona-porta-de-vidro': {
    reel: reel({
      slug: 'porta-eletronica-funciona-porta-de-vidro',
      hook: 'Vidro temperado não pode ser furado depois de pronto — isso muda tudo na instalação',
      problema: 'Tutor tenta furar o vidro já instalado sem saber que vidro temperado pode estilhaçar por completo.',
      informacao: 'Vidro temperado geralmente não pode ser cortado ou furado depois de fabricado, sob risco de estilhaçar por completo — o corte precisa ser encomendado já com o furo, direto da vidraçaria.',
      solucaoLabel: 'Guia de porta eletrônica em porta de vidro',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'Vidro temperado geralmente não pode ser cortado ou furado depois de fabricado, sob risco de estilhaçar por completo',
      section: 'Vidro Temperado x Vidro Comum',
    }),
    post: post({
      slug: 'porta-eletronica-funciona-porta-de-vidro',
      titulo_gatilho: 'Existe porta eletrônica sem precisar furar o vidro',
      legenda: 'Modelos pensados especificamente para porta de vidro de correr são projetados para não exigir cortes permanentes — substituem um painel inteiro por uma estrutura de encaixe com a porta pet integrada. 🪟\n\nNo artigo: quando o corte é necessário e como decidir com segurança.',
      hashtags: ['#smartpetgadgets', '#portaeletronicaautomaticaparapet'],
      sourceExcerpt: 'Esses kits substituem um painel inteiro da porta de correr por uma estrutura de encaixe que já contém a porta pet integrada — evitando o risco de trincar o vidro original.',
      section: 'Modelos Sem Corte no Vidro',
    }),
  },

  'porta-eletronica-impede-entrada-outros-animais': {
    reel: reel({
      slug: 'porta-eletronica-impede-entrada-outros-animais',
      hook: 'Porta com sensor de luz não impede a entrada de outros animais — só regula horário',
      problema: 'Tutor compra porta com sensor de luz achando que ela também barra intrusos.',
      informacao: 'Portas com apenas sensor de luz não identificam o animal individualmente — elas abrem e fecham por horário, permitindo a passagem de qualquer animal do tamanho compatível durante o período aberto.',
      solucaoLabel: 'Guia sobre porta eletrônica que impede entrada de outros animais',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'Portas com apenas sensor de luz não identificam o animal individualmente — elas abrem e fecham por horário, permitindo a passagem de qualquer animal do tamanho compatível durante o período aberto.',
      section: 'O Que Não Oferece Essa Proteção',
    }),
    post: post({
      slug: 'porta-eletronica-impede-entrada-outros-animais',
      titulo_gatilho: 'Como a porta eletrônica reconhece seu pet e barra os outros',
      legenda: 'Quando o pet cadastrado se aproxima, a porta reconhece o chip ou medalhão e abre automaticamente; depois que ele passa pelo túnel, a porta se fecha sozinha. Animais não cadastrados simplesmente não conseguem acionar a abertura. 🔒\n\nNo artigo: quais tecnologias oferecem essa proteção de verdade.',
      hashtags: ['#smartpetgadgets', '#portaeletronicaautomaticaparapet'],
      sourceExcerpt: 'Quando o pet cadastrado se aproxima, a porta reconhece o chip ou medalhão e abre automaticamente; depois que ele passa pelo túnel, a porta se fecha sozinha.',
      section: 'Como Funciona na Prática',
    }),
  },

  'porta-eletronica-reconhecimento-facial-vale-a-pena': {
    reel: reel({
      slug: 'porta-eletronica-reconhecimento-facial-vale-a-pena',
      hook: 'Tosa muito diferente pode confundir o reconhecimento facial da porta pet',
      problema: 'Tutor não sabe que mudanças visuais no pet podem afetar a leitura da porta com câmera.',
      informacao: 'Mudanças visuais relevantes no animal, como tosa muito diferente, podem, em teoria, afetar o reconhecimento em alguns modelos — vale checar a especificação do fabricante antes de comprar.',
      solucaoLabel: 'Guia de porta eletrônica com reconhecimento facial',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'Mudanças visuais relevantes no animal (tosa muito diferente, por exemplo) podem, em teoria, afetar o reconhecimento em alguns modelos — vale checar a especificação do fabricante.',
      section: 'Limitações a Considerar',
    }),
    post: post({
      slug: 'porta-eletronica-reconhecimento-facial-vale-a-pena',
      titulo_gatilho: 'Porta com reconhecimento facial dispensa microchip e coleira',
      legenda: 'Não exige que o pet tenha microchip implantado nem que use um medalhão na coleira — a identificação é puramente visual, conveniente para quem prefere não depender de acessório físico no animal. 📸\n\nNo artigo: quando vale o investimento nessa tecnologia.',
      hashtags: ['#smartpetgadgets', '#portaeletronicaautomaticaparapet'],
      sourceExcerpt: 'Não exige que o pet tenha microchip implantado nem que use um medalhão na coleira — a identificação é puramente visual',
      section: 'Vantagem sobre Microchip e RFID',
    }),
  },

  'porta-eletronica-sensor-de-luz-como-funciona': {
    reel: reel({
      slug: 'porta-eletronica-sensor-de-luz-como-funciona',
      hook: 'Essa porta pet abre sozinha ao amanhecer — sem reconhecer nem seu próprio pet',
      problema: 'Tutor acha que toda porta eletrônica identifica o animal individualmente.',
      informacao: 'A porta com sensor de luz se abre automaticamente ao amanhecer e se fecha ao anoitecer, dando liberdade ao pet durante o dia e segurança à noite — sem depender de identificação individual do animal.',
      solucaoLabel: 'Guia de porta eletrônica com sensor de luz',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'A porta com sensor de luz se abre automaticamente ao amanhecer e se fecha ao anoitecer, dando liberdade ao pet durante o dia e segurança à noite — sem depender de identificação individual do animal',
      section: 'introdução',
    }),
    post: post({
      slug: 'porta-eletronica-sensor-de-luz-como-funciona',
      titulo_gatilho: 'Sensor de luz resolve horário — não resolve intrusos',
      legenda: 'Como não identifica o animal individualmente, esse tipo de porta não impede a entrada de outros gatos ou animais durante o período em que está aberta. 🕐\n\nNo artigo: quando esse tipo de porta faz sentido pro seu caso.',
      hashtags: ['#smartpetgadgets', '#portaeletronicaautomaticaparapet'],
      sourceExcerpt: 'Como não identifica o animal individualmente, esse tipo de porta não impede a entrada de outros gatos ou animais durante o período em que está aberta',
      section: 'Limitação Importante',
    }),
  },

  'melhor-alimentador-automatico-gatos': {
    reel: reel({
      slug: 'melhor-alimentador-automatico-gatos',
      hook: 'Ração úmida precisa de gelo dentro do alimentador — sem isso ela estraga',
      problema: 'Tutor de gato com restrição alimentar não sabe que alimentador comum não conserva ração úmida.',
      informacao: 'Para gatos que comem ração úmida, um alimentador especializado usa bolsas de gelo reutilizáveis sob os pratos para manter a comida em temperatura segura por mais tempo — uma estimativa realista é de 8 a 12 horas em ambientes quentes.',
      solucaoLabel: 'Guia do melhor alimentador automático para gatos',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'usa um par de bolsas de gelo reutilizáveis sob os pratos para manter a comida em temperatura segura por mais tempo — uma estimativa realista é de 8 a 12 horas em ambientes quentes',
      section: 'Categoria 3: Especializado em Ração Úmida — Cat Mate C500',
    }),
    post: post({
      slug: 'melhor-alimentador-automatico-gatos',
      titulo_gatilho: 'Gato ignorando o alimentador novo? A transição errada é a causa mais comum',
      legenda: 'Introduza o aparelho ainda desligado perto do local onde o gato já come, deixando-o associar o objeto ao ambiente antes de qualquer barulho de dispensa. Só depois programe a primeira refeição. 🐱\n\nNo artigo: comparativo completo dos alimentadores mais vendidos e como fazer a transição sem estresse.',
      hashtags: ['#smartpetgadgets', '#gatos'],
      sourceExcerpt: 'Introduza o aparelho ainda desligado perto do local onde o gato já come, deixando-o associar o objeto ao ambiente antes de qualquer barulho de dispensa.',
      section: 'Como Fazer a Transição do Pote Comum para o Alimentador Automático',
    }),
  },

  'melhor-bebedouro-automatico-pet': {
    reel: reel({
      slug: 'melhor-bebedouro-automatico-pet',
      hook: 'Água parada pode ser o motivo do seu gato beber pouco',
      problema: 'Tutor não entende por que o gato evita o pote de água comum.',
      informacao: 'A água em movimento estimula a ingestão, o que ajuda a prevenir problemas urinários comuns em felinos que bebem pouca água quando o líquido fica parado no pote.',
      solucaoLabel: 'Guia do melhor bebedouro automático para pet',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'A água em movimento estimula a ingestão, o que ajuda a prevenir problemas urinários comuns em felinos que bebem pouca água quando o líquido fica parado no pote.',
      section: 'Bebedouro automático de água é melhor que pote comum?',
    }),
    post: post({
      slug: 'melhor-bebedouro-automatico-pet',
      titulo_gatilho: 'Filtro do bebedouro sujo pode estar deixando o motor barulhento',
      legenda: 'A maioria dos modelos com filtro de carvão ativado usa uma bomba silenciosa, mas o nível de ruído pode aumentar quando o filtro está sujo ou quando o nível de água está baixo. Limpar o motor e trocar o filtro resolve. 🔧\n\nNo artigo: comparativo completo e como escolher pelo número de pets em casa.',
      hashtags: ['#smartpetgadgets', '#gatos'],
      sourceExcerpt: 'o nível de ruído pode aumentar quando o filtro está sujo ou quando o nível de água está baixo. Limpar o motor e trocar o filtro nos intervalos recomendados costuma resolver esse problema.',
      section: 'O motor do bebedouro automático faz barulho?',
    }),
  },
};

module.exports = { ESCALA_LOTE4_REEL_POST };
