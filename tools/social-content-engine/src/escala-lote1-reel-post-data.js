'use strict';

/**
 * Reel + Post V2 — ESCALA, Lote 1 (9 artigos, clusters brinquedo-interativo
 * e câmera pet). Mesmo princípio dos lotes anteriores: fato específico do
 * corpo do artigo (nunca headings genéricos, nunca preço como gancho de
 * Reel), `source.source_excerpt` sempre um trecho literal do HTML.
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

const ESCALA_LOTE1_REEL_POST = {
  'brinquedo-interativo-automatico-para-gato': {
    reel: reel({
      slug: 'brinquedo-interativo-automatico-para-gato',
      hook: 'A fonte de energia do brinquedo automático muda tudo na hora de escolher',
      problema: 'Tutor escolhe o brinquedo só pelo visual e depois se frustra com a energia (pilha, recarregável ou USB).',
      informacao: 'A fonte de energia varia entre pilha, bateria recarregável ou USB — cada uma tem implicações diferentes de custo recorrente e praticidade, e vale considerar isso antes de decidir pelo modelo.',
      solucaoLabel: 'Guia completo de brinquedo interativo para gato',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'A fonte de energia também varia: pilha, bateria recarregável ou USB.',
      section: 'Quanto Custa no Mercado Livre',
    }),
    post: post({
      slug: 'brinquedo-interativo-automatico-para-gato',
      titulo_gatilho: 'Existe brinquedo automático certo pro seu gato — depende do que ele gosta de fazer',
      legenda: 'Não existe um único "melhor" brinquedo interativo automático — existe o tipo certo pro comportamento do seu gato: perseguição (bolinha inteligente), forrageamento (comedouro interativo) ou estímulo por sensor (infravermelho). 🐱\n\nNo artigo: os 3 tipos, preços reais no Mercado Livre e quando vale o investimento.',
      hashtags: ['#smartpetgadgets', '#brinquedointerativoautomaticoparagato'],
      sourceExcerpt: 'Não existe um único "melhor" brinquedo interativo automático — existe o tipo certo para o comportamento do seu gato: perseguição (bolinha inteligente), forrageamento (comedouro interativo), ou estímulo por sensor (infravermelho).',
      section: 'Conclusão',
    }),
  },

  'brinquedo-automatico-cachorro-sozinho': {
    reel: reel({
      slug: 'brinquedo-automatico-cachorro-sozinho',
      hook: 'Comprou brinquedo automático de gato pro seu cachorro? Ele pode destruir em minutos',
      problema: 'Tutor de cachorro compra o mesmo tipo de brinquedo popular entre gatos, achando que serve igual.',
      informacao: 'Cães de porte grande ou muito enérgicos costumam destruir rapidamente brinquedos automáticos leves, pensados originalmente para gatos — por isso os modelos populares pra cães combinam liberação de petisco com resistência a mordida, não só movimento.',
      solucaoLabel: 'Guia completo de brinquedo automático para cachorro sozinho',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'Cães de porte grande ou muito enérgicos costumam destruir rapidamente brinquedos automáticos leves, pensados originalmente para gatos — vale checar a resistência do material antes de comprar para cães desse perfil.',
      section: 'Limitações Reais',
    }),
    post: post({
      slug: 'brinquedo-automatico-cachorro-sozinho',
      titulo_gatilho: 'Brinquedo automático de cachorro não é igual ao de gato — a diferença é a mordida',
      legenda: 'Cães costumam precisar de mais força física no brinquedo (resistência à mordida) e menos de estímulo puramente visual de perseguição. Por isso os modelos mais populares pra cães combinam petisco com movimento ou som, em vez de só rolar sozinhos. 🐕\n\nNo artigo: quando vale a pena e quando não vale.',
      hashtags: ['#smartpetgadgets', '#cachorros'],
      sourceExcerpt: 'Cães costumam precisar de mais força física no brinquedo (resistência a mordida) e menos de estímulo puramente visual de perseguição — por isso, os modelos mais populares combinam liberação de petisco com algum movimento ou som, em vez de só rolar sozinhos.',
      section: 'Diferença em Relação aos Brinquedos para Gato',
    }),
  },

  'brinquedo-interativo-sensor-infravermelho-como-funciona': {
    reel: reel({
      slug: 'brinquedo-interativo-sensor-infravermelho-como-funciona',
      hook: 'O brinquedo do seu gato desliga sozinho — e isso não é defeito',
      problema: 'Tutor acha que o brinquedo quebrou porque ele para de se mover sozinho depois de um tempo.',
      informacao: 'O sensor infravermelho ativa o movimento quando o gato está a cerca de 10 cm de distância, e o brinquedo para de funcionar automaticamente após alguns minutos sem detectar o animal na área — isso economiza bateria, não é defeito.',
      solucaoLabel: 'Guia completo sobre sensor infravermelho em brinquedo interativo',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'o brinquedo para de funcionar automaticamente após alguns minutos sem detectar o animal na área, economizando bateria',
      section: 'Como o Sensor Detecta o Gato',
    }),
    post: post({
      slug: 'brinquedo-interativo-sensor-infravermelho-como-funciona',
      titulo_gatilho: 'Sensor infravermelho vs. movimento contínuo: qual gasta menos bateria?',
      legenda: 'Brinquedos que se movem o tempo todo gastam bateria mesmo quando o gato não está por perto. O sensor infravermelho resolve isso, ativando o brinquedo só quando há interesse real do animal. 🔋\n\nNo artigo: como o sensor detecta o gato e as limitações que vale conhecer antes de comprar.',
      hashtags: ['#smartpetgadgets', '#gatos'],
      sourceExcerpt: 'Brinquedos que se movem o tempo todo gastam bateria mesmo quando o gato não está por perto. O sensor infravermelho resolve isso, ativando o brinquedo só quando há real interesse do animal',
      section: 'Vantagem sobre Movimento Contínuo',
    }),
  },

  'brinquedo-interativo-substitui-brincadeira-tutor': {
    reel: reel({
      slug: 'brinquedo-interativo-substitui-brincadeira-tutor',
      hook: 'Comprou brinquedo automático achando que ia parar de brincar com seu gato?',
      problema: 'Tutor investe no brinquedo automático e reduz o tempo de brincadeira direta, achando que o dispositivo resolve tudo.',
      informacao: 'A presença física e a atenção do tutor têm um componente afetivo que nenhum dispositivo reproduz — e o tutor ajusta a intensidade da brincadeira conforme reage o gato, algo que o brinquedo automático não faz.',
      solucaoLabel: 'Guia completo sobre brinquedo interativo e brincadeira com o tutor',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'a presença física e a atenção do tutor têm um componente afetivo que nenhum dispositivo reproduz',
      section: 'O Que a Brincadeira Direta Oferece que o Brinquedo Não Oferece',
    }),
    post: post({
      slug: 'brinquedo-interativo-substitui-brincadeira-tutor',
      titulo_gatilho: 'Qual a rotina ideal: brinquedo automático + brincadeira direta?',
      legenda: 'Combine os dois: brinquedo automático disponível durante a ausência do tutor, e um período dedicado de brincadeira direta (mesmo que curto, 10-15 minutos) quando o tutor está em casa. 🐾\n\nNo artigo: por que tratar o brinquedo como substituto integral é o erro mais comum nessa categoria.',
      hashtags: ['#smartpetgadgets', '#gatos'],
      sourceExcerpt: 'Combine os dois: brinquedo automático disponível durante a ausência do tutor, e um período dedicado de brincadeira direta (mesmo que curto, 10-15 minutos) quando o tutor está em casa.',
      section: 'Rotina Ideal',
    }),
  },

  'como-escolher-brinquedo-interativo-gato-entediado': {
    reel: reel({
      slug: 'como-escolher-brinquedo-interativo-gato-entediado',
      hook: 'Seu gato dorme demais e derruba objetos? Pode ser tédio, não manha',
      problema: 'Tutor não associa comportamento destrutivo e sono excessivo a falta de estímulo — acha que é "manha" do gato.',
      informacao: 'Gatos entediados ou sedentários costumam mostrar sinais específicos: dormir mais que o normal, ganho de peso, comportamento destrutivo (arranhar móveis, derrubar objetos) ou apatia diante de brinquedos comuns.',
      solucaoLabel: 'Guia de como escolher brinquedo interativo para gato entediado',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'Gatos entediados ou sedentários costumam mostrar sinais específicos: dormir mais que o normal, ganho de peso, comportamento destrutivo (arranhar móveis, derrubar objetos) ou apatia diante de brinquedos comuns.',
      section: 'introdução',
    }),
    post: post({
      slug: 'como-escolher-brinquedo-interativo-gato-entediado',
      titulo_gatilho: 'Brinquedo caro 1x por semana perde pra brinquedo simples todo dia',
      legenda: 'Um brinquedo caro usado uma vez por semana tem menos impacto do que um brinquedo simples usado diariamente. Vale integrar o brinquedo interativo à rotina do gato, não tratá-lo como solução pontual. 🐱\n\nNo artigo: tabela de qual tipo de brinquedo combina com cada sinal de tédio.',
      hashtags: ['#smartpetgadgets', '#gatos'],
      sourceExcerpt: 'Um brinquedo caro usado uma vez por semana tem menos impacto do que um brinquedo simples usado diariamente.',
      section: 'Frequência de Uso Importa Mais que o Produto',
    }),
  },

  'erros-comuns-brinquedo-interativo-gato': {
    reel: reel({
      slug: 'erros-comuns-brinquedo-interativo-gato',
      hook: 'Seu gato ignora o brinquedo automático? O erro pode ser o lugar onde ele fica',
      problema: 'Tutor deixa o brinquedo sempre no mesmo canto da casa e se frustra quando o gato perde o interesse.',
      informacao: 'Gatos tendem a perder o interesse em brinquedos parados sempre no mesmo local — alternar a posição ou o tipo de brinquedo ao longo da semana mantém o estímulo mais interessante.',
      solucaoLabel: 'Guia de erros comuns com brinquedo interativo para gato',
      objetivo: 'tráfego + reconhecimento de marca',
      sourceExcerpt: 'Gatos tendem a perder o interesse em brinquedos parados sempre no mesmo local — alternar a posição ou o tipo de brinquedo ao longo da semana mantém o estímulo mais interessante.',
      section: 'Deixar o Brinquedo Sempre no Mesmo Lugar',
    }),
    post: post({
      slug: 'erros-comuns-brinquedo-interativo-gato',
      titulo_gatilho: 'Piso liso ou tapete de pelo alto? Isso muda como o brinquedo se comporta',
      legenda: 'Brinquedos de movimento rápido podem deslizar demais em pisos lisos ou ficar travados em tapetes de pelo alto — vale ajustar o modo de movimento (quando disponível) conforme a superfície da casa. 🏠\n\nNo artigo: os 5 erros mais comuns na escolha e uso de brinquedo interativo.',
      hashtags: ['#smartpetgadgets', '#gatos'],
      sourceExcerpt: 'Brinquedos de movimento rápido podem deslizar demais em pisos lisos ou ficar travados em tapetes de pelo alto — vale ajustar o modo de movimento (quando disponível) conforme a superfície da casa.',
      section: 'Ignorar o Tipo de Piso',
    }),
  },

  'melhor-bolinha-inteligente-para-gato': {
    reel: reel({
      slug: 'melhor-bolinha-inteligente-para-gato',
      hook: 'O tipo de piso da sua casa decide qual modo de bolinha inteligente comprar',
      problema: 'Tutor compra bolinha inteligente sem considerar o piso e ela não funciona bem em casa.',
      informacao: 'Em tapetes, um modo mais rápido compensa o atrito extra; em pisos duros e lisos, um modo mais lento evita que a bola deslize longe demais e perca a graça da perseguição.',
      solucaoLabel: 'Guia de como escolher a melhor bolinha inteligente para gato',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'em tapetes, um modo mais rápido compensa o atrito extra; em pisos duros e lisos, um modo mais lento evita que a bola deslize longe demais e perca a graça da perseguição',
      section: 'Superfície Importa',
    }),
    post: post({
      slug: 'melhor-bolinha-inteligente-para-gato',
      titulo_gatilho: 'Bolinha inteligente simples ou com app? Depende do que você quer controlar',
      legenda: 'Modelos mais simples de bolinha inteligente cobrem bem o básico; versões com mais recursos trazem app, luzes e múltiplos modos de movimento — a diferença está nos recursos extras, não necessariamente no resultado com o gato. 💡\n\nNo artigo: quando a bolinha rápida não é a melhor escolha.',
      hashtags: ['#smartpetgadgets', '#gatos'],
      sourceExcerpt: 'em versões com mais recursos (app, luzes, múltiplos modos)',
      section: 'Faixa de Preço',
    }),
  },

  'camera-pet-resolucao-1080p-x-2k': {
    reel: reel({
      slug: 'camera-pet-resolucao-1080p-x-2k',
      hook: 'Câmera 2K com visão noturna ruim perde pra 1080p bem calibrada',
      problema: 'Tutor paga mais caro pela resolução maior achando que resolve tudo à noite.',
      informacao: 'Visão noturna e taxa de quadros por segundo (fps) costumam impactar mais a experiência prática do que a resolução isolada — uma câmera 2K com visão noturna ruim entrega pior experiência à noite do que uma 1080p bem calibrada.',
      solucaoLabel: 'Guia de câmera pet 1080p x 2K',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'uma câmera 2K com visão noturna ruim entrega pior experiência à noite do que uma 1080p bem calibrada',
      section: 'O Que Mais Importa Além da Resolução',
    }),
    post: post({
      slug: 'camera-pet-resolucao-1080p-x-2k',
      titulo_gatilho: '2K só compensa em 2 situações específicas — quais são?',
      legenda: '2K vale o upgrade principalmente em ambientes grandes, onde o pet fica longe da câmera boa parte do tempo, e para quem usa zoom digital com frequência pelo app. Fora isso, 1080p já entrega detalhe suficiente. 📷\n\nNo artigo: comparação completa e o que avaliar antes de pagar mais caro.',
      hashtags: ['#smartpetgadgets', '#cameraparamonitorarpet'],
      sourceExcerpt: 'Ambientes grandes, onde o pet fica longe da câmera boa parte do tempo. Uso frequente de zoom digital pelo app — resolução maior perde menos detalhe ao ampliar.',
      section: 'Quando Vale o Upgrade para 2K',
    }),
  },

  'camera-pet-x-coleira-gps-qual-escolher': {
    reel: reel({
      slug: 'camera-pet-x-coleira-gps-qual-escolher',
      hook: 'Câmera pet não ajuda em nada se o seu problema é cachorro que foge',
      problema: 'Tutor de cachorro fujão compra câmera achando que ela resolve o problema de segurança.',
      informacao: 'Se sua preocupação é o pet fugir de casa ou se perder em passeios, a câmera não ajuda em nada nesse cenário — é a coleira GPS que localiza o animal em tempo real fora do ambiente doméstico.',
      solucaoLabel: 'Guia câmera pet x coleira GPS',
      objetivo: 'tráfego + intenção de compra',
      sourceExcerpt: 'Se sua preocupação é o pet fugir de casa ou se perder em passeios, a câmera não ajuda em nada nesse cenário — é a coleira GPS que localiza o animal em tempo real fora do ambiente doméstico.',
      section: 'Quando a Coleira GPS Resolve',
    }),
    post: post({
      slug: 'camera-pet-x-coleira-gps-qual-escolher',
      titulo_gatilho: 'Câmera pet e coleira GPS não competem — resolvem problemas diferentes',
      legenda: 'Câmera monitora o que acontece dentro de casa; coleira GPS localiza o pet quando ele está fora do alcance da câmera. Não é incomum famílias com cães que fogem investirem nos dois gadgets ao mesmo tempo. 🐾\n\nNo artigo: tabela comparativa completa pra decidir por qual começar.',
      hashtags: ['#smartpetgadgets', '#cameraparamonitorarpet'],
      sourceExcerpt: 'Não é incomum famílias com cães que fogem investirem nos dois gadgets ao mesmo tempo.',
      section: 'Por Que Muitos Tutores Usam os Dois',
    }),
  },
};

module.exports = { ESCALA_LOTE1_REEL_POST };
