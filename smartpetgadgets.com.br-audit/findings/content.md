# Achados de Qualidade de Conteúdo e On-Page — smartpetgadgets.com.br

**Nota Content Quality: 79/100** (era 76 em 2026-11-06)
**Nota On-Page SEO: 81/100** (sem nota comparável em 11-06; o onpage.md de 11-06 olhou só 3 páginas e deu 85)

Data: 2026-11-17 · Revisor: Content Quality (QRG de 11/09/2025) · Base de comparação: archive/2026-11-06/findings/content.md

## Escopo e método
- **Escopo:** as 80 URLs do sitemap (74 posts e 6 institucionais), lidas da fonte local em /home/projetos/blog, só leitura.
- **Conferência ao vivo:** /camera-pet-com-dispensador-de-petisco/ com render_page `--mode never`. O HTML ao vivo é **byte a byte idêntico ao local** (200, LiteSpeed, sem SPA).
- **Comparação justa:** o script de métricas foi reescrito nesta auditoria. Para o delta não ser artefato de método, ele rodou também sobre o snapshot `1efc1aa`, base da auditoria de 11-06. Os números "11-06" da tabela abaixo vêm dessa nova rodada. Por isso diferem um pouco dos publicados em 11-06: o método novo conta tabelas, listas e o bloco "Escolha rápida".
- **Corpo:** do H1 até `</main>`, sem figure, `.cta-box`, `.cta-top`, `.disclosure`, byline e FAQ.
- **Sobreposição da FAQ:** fração dos tokens da FAQ (sem stopwords) que também aparecem no corpo.
- **Legibilidade:** PT-Flesch, uma medida relativa. Nas páginas com tabelas grandes, o número de palavras por frase sai inflado.
- **Metadados:** metadata_template.py sobre os 80 pares.

Commits desde 11-06, que são o que muda o quadro:
- 2 posts novos: ração para cachorro e ração para gato (80bd3bd, 0fb0a52).
- 8 hubs reescritos como ranking ou comparativo:
  - coleira gato e cão (146cbc8, ac7c7ce);
  - Seresto (2b5d169);
  - brinquedo para gato (fde9421);
  - bebedouro (27cb440);
  - hub de comedouro (3e4931a);
  - câmera com petisco (a84c3c5);
  - tutorial do app Tuya (fa44a68, 4cb6a81).
- Fora desses, nenhum corpo mudou.

## Notas

| Métrica | 11-17 | 11-06 |
|---|---|---|
| Qualidade de conteúdo | **79** | 76 |
| E-E-A-T ponderado (modelo interno) | **63** | 61 |
| Prontidão para citação por IA | **83** | 80 |
| On-Page SEO | **81** | n/d |

| Fator E-E-A-T (pesos internos da skill; o Google não publica pesos) | Nota | Base |
|---|---|---|
| Experiência (20%) | 47 (era 45) | Os rankings novos citam opiniões de compradores do ML (`.review-quote`, "resumo de opiniões") e marcam o que o anúncio não informa, como "não diz se o fecho é breakaway". Continua sem foto, medição ou print próprios: 0 das 74 páginas. |
| Expertise (25%) | 63 (era 60) | Fichas técnicas por produto, diferenças de tecnologia bem explicadas (GPS 4G x tag Bluetooth, gravidade x elétrico) e recomendações por perfil. Nas rações, há cuidado com dietas veterinárias. |
| Autoridade (25%) | 55 (=) | Person sem `image` e sem `knowsAbout`, com 1 `sameAs`. Os rankings reescritos **perderam fontes externas** (ver A3). |
| Confiabilidade (30%) | 81 (era 79) | Preço com data em todos os rankings novos, "Não testamos…" explícito, seção "Como Escolhemos" honesta e CTAs com nome do produto. Puxam para baixo: a política editorial fina, 7 links de afiliado mortos em stubs e preços defasados nos rankings antigos. |

## Delta vs 2026-11-06

| Item (ID 11-06) | Status | Evidência |
|---|---|---|
| M5: ANXK G68 como "melhor" para gato | **CORRIGIDO** | coleira-gps-para-gato indica a The Pet GPS 4G (R$ 718 em 12/11) e deixa o ANXK G68 como opção barata, marcando "presilha comum (não é breakaway)". Em coleira-gps-para-pet, o ANXK G58 aparece como "4G mais barato". |
| M11: meta de câmera com petisco prometia "ansiedade" | **CORRIGIDO** | O corpo agora tem a seção "Ansiedade de separação" e linka camera-pet-cachorro-ansiedade-separacao. |
| M11: "Parede" no title de como-instalar-porta | **CONTINUA** | "Parede" e "alvenaria" só aparecem no title, no H1 e numa frase de abertura. Não há passo a passo; o corpo tem 382 palavras. |
| H1: melhor-camera fina com veredito forte | **CONTINUA** (agora ALTO A2) | 386 palavras, 0 preço, toda baseada em 1 fonte (mybest, "retrieved 2026-08-22"). |
| H1: clusters finos | **MELHOROU POUCO** | <400 palavras: 25 de 74 (eram 26 de 72). <600: 32 (eram 34). Mediana de 716 (era 650). O ganho vem só dos hubs. **Os 29 stubs de menos de 450 palavras estão intocados desde 22/08.** |
| H1: FAQ que repete o corpo | **CONTINUA** | Mediana de 0,847 (era 0,833). ≥0,9: 25 posts (eram 26); ≥0,8: 47 (eram 39). Nos hubs reescritos a sobreposição subiu, porque a FAQ repete o veredito da abertura. Exemplo: comedouro passou de 0,52 para 0,87. |
| M9: CTA de topo genérico | **MELHOROU** | Caiu de 61 para 54 páginas com "Quer ver o preço agora?". Os 8 hubs novos nomeiam o produto ("Câmera Pet 2K com petiscos, vendida pela loja oficial New Pet…"). Os 29 stubs finos seguem com 2 CTAs genéricos e a barra fixa. |
| M6: YMYL | **PARCIAL** | **Seresto: corrigido**, com 5 fontes de autoridade (Elanco, Bayer, ANSES, AFMPS, FAO) e seção de segurança. **Antipulgas:** continua sem o alerta FDA/CVM sobre isoxazolinas ("FDA", "convuls…" e "epilep…" aparecem 0 vezes; o único alerta neurológico é o da ivermectina). **cachorro-de-casa-pega-pulga:** continua com 0 links externos. **Varinha:** o hub de brinquedo agora orienta supervisionar e guardar a borboleta presa em fio, mas pilha-x-recarregavel continua sem o aviso. |
| M1: "Key Takeaways" com "- " literal | **MELHOROU** | Caiu de 24 para 18 páginas e de 113 para 92 parágrafos. Continua em camera-para-monitorar-pet, comedouro-com-ou-sem-wifi, newpet-4l, vdrbg e porta-eletronica-automatica. **Também em bebedouro-inox-x-ceramica, logo abaixo da abertura.** É a página de maior gap de CTR do site (512 impressões, posição 6,3). |
| M8: citações | **PIOROU nos hubs** | 11 posts sem nenhum link externo (eram 8). Entraram: comedouro-automatico-para-pet (tinha 2 fontes, ficou com 0), camera-pet-com-dispensador (1→0), melhor-racao-cachorro e melhor-racao-gato (0, novas). "retrieved" aparece 102 vezes em 51 páginas (eram 115 em 57). |
| M2: autor e políticas | **CONTINUA** | Person sem `image` e sem `knowsAbout`, com 1 `sameAs`. politica-editorial tem 232 palavras, sem declaração de uso de IA, sem fórmula das notas (8,7/10 etc.) e sem log de correções. |
| M10: data mudada por acréscimo pequeno | **OK nesta janela** | As 8 mudanças de data desde 11-06 vêm de reescritas substanciais (+1.300 a +2.400 palavras). São legítimas. |
| L1: Review com author Organization | **CONTINUA** | 28 nós em 10 páginas. |
| L3: templating de metadados | **LIMPO** | 80 pares: `site_risk: low`, `templated_ratio: 0.0`, `shared_cta_phrases: {}`. Só `brand-suffix-in-description` em contato e nas 2 políticas. |
| L4: contagem de artigos na home | **CONTINUA** | A home diz "73 artigos", mas o sitemap tem 74 posts. |
| L5: VDRBG x Velds | **CONTINUA** | "Velds" aparece 32 vezes. "Escolha do editor: Velds 4L Wi-Fi" está logo abaixo do title "VDRBG 4L Wi-Fi", sem dizer que é o mesmo aparelho. |
| L6: Biosec | **CONTINUA** | Preço da Biosec de 04/10 e dos demais de 23/10, sem atualização. |
| L8: "exclusivamente 2,4 GHz" | **CONTINUA** | Aparece 2 vezes no corpo de como-configurar-camera-pet-wifi e na meta. O tutorial Tuya (fa44a68) explica 2,4 x 5 GHz corretamente, então agora a contradição é entre 2 páginas do próprio site. |
| L9: "comedouro 6L avaliado aqui" | **CONTINUA** | Em comedouro-com-ou-sem-wifi. |

---

## CRÍTICO
Nenhum.

## ALTO

### A1: NOVO. Canibalização interna criada pelos próprios hubs
Os hubs reescritos absorveram, como H2, o tema de stubs que continuam no ar, indexáveis e linkados. Nas três famílias abaixo, a página fina e a seção do hub disputam a mesma consulta.

**Brinquedo**
- O hub tem as seções "Brinquedo Automático para Gato Idoso: Vale a Pena?" e "Pilha ou Recarregável…".
- As duas competem com:
  - brinquedo-interativo-gato-idoso-vale-a-pena (316 palavras);
  - brinquedo-interativo-pilha-x-recarregavel (985).
- O title de como-escolher-brinquedo-interativo-gato-entediado, "**Melhor** Brinquedo Interativo para Gato Entediado", e o de melhor-bolinha-inteligente-para-gato (384 palavras, 0 links externos) disputam "melhor brinquedo para gato" com o hub.

**Câmera** (3 páginas para "melhor câmera pet")
- melhor-camera-para-monitorar-pet, com title "Melhores Câmeras Pet 2026";
- camera-para-monitorar-pet, com title "**Melhor** Câmera para Monitorar Pet: Como Escolher". Recebe 21 links internos, contra 5 da anterior.
- camera-pet-com-dispensador-de-petisco, o ranking novo, que recebe só 4 links.
- As duas primeiras indicam a Tapo C200. A terceira indica a Newpet 2K, que também aparece na primeira.

**Comedouro** (3 rankings com vencedores diferentes)
- O hub comedouro-automatico-para-pet coloca o **Newpet 4L** como melhor (R$ 238,80 em 15/11).
- melhor-comedouro-automatico-cachorro dá "Escolha do editor" ao **VDRBG**, com preços de 22/10. O Madog subiu 22% e o Dogis 17%, segundo o monitor de preços.
- melhor-alimentador-automatico-gatos traz o Cat Mate C500 e o Velds, com preços de 11/10.
- Leitor e IA recebem respostas diferentes para a mesma pergunta.

**Bebedouro** (canibalização já conhecida)
- bebedouro-inox-x-ceramica: H1 "Bebedouro para Gato: Inox, Cerâmica ou Plástico". Tem seções "Modelos à Venda no Mercado Livre" e "Quanto Custa…" com preços de 13/11.
- melhor-bebedouro-automatico-pet tem o H2 "Inox, Cerâmica ou Plástico: o Material Faz Diferença?".
- Hoje as duas são páginas de compra.

Correção:
- Nada de script em massa. Respeite a janela de medição do diagnóstico de CTR de 17/11 e não reescreva o que mudou depois de 05/11 antes de cerca de 01/12.
- Mudanças que não mexem nos hubs e podem sair já:
  - fundir gato-idoso no hub de brinquedo, com 301;
  - tirar "Melhor" do title de camera-para-monitorar-pet e de como-escolher-brinquedo-entediado;
  - em bebedouro-inox-x-ceramica, deixar só a pergunta de material e linkar o ranking para a intenção "fonte de água".
- Para os rankings antigos de comedouro, decida com o dono, porque o cluster tinha sido pausado. As saídas são:
  - funda melhor-comedouro-automatico-cachorro e melhor-alimentador-automatico-gatos no hub com 301; ou
  - reposicione cada um para uma intenção própria (cão grande, ração úmida/RFID), alinhe o vencedor com o hub e atualize os preços.

### A2: CONTINUA (subiu de severidade). melhor-camera-para-monitorar-pet é um resumo de 1 listicle
- 386 palavras de corpo e 0 preço.
- Os 4 modelos e todos os adjetivos vêm de uma única fonte ("mybest, retrieved 2026-08-22", 3 vezes). O próprio texto diz: "Os detalhes de cada modelo vêm dos comparativos de mercado mais citados no Brasil".
- Não há "Não testamos" nem "Como Escolhemos".
- Pelo QRG, conteúdo que parafraseia outra fonte sem valor agregado próprio fica em Low.
- É a página do site com o slug "melhor câmera", e o site já tem o padrão certo pronto: o ranking de câmera com petisco.
- Correção: reconstrua no padrão dos rankings de 11-12/15, com 5 a 6 câmeras, preço datado, prós e contras, "Como Escolhemos" e fontes. Depois funda nela duvidas-camera-para-monitorar-pet (295 palavras, sobreposição 0,80) e erros-comuns-camera-monitorar-pet (332, 0,89).

### A3: NOVO / REGRESSÃO. Os rankings reescritos perderam as fontes externas, e as rações nasceram sem nenhuma

| Página | Links externos antes → agora | Observação |
|---|---|---|
| comedouro-automatico-para-pet | 2 → **0** | Afirma porções seguras e uso em viagem sem fonte veterinária. |
| camera-pet-com-dispensador-de-petisco | 1 → **0** | Fala de ansiedade de separação sem fonte comportamental. |
| melhor-bebedouro-automatico-pet | 3 → 1 | Fala de hidratação felina e trato urinário. |
| coleira-gps-para-pet | 0 → 0 | Era a prioridade de 11-06. |
| melhor-racao-para-cachorro / -gato | **0 (novas)** | Nutrição é tema YMYL leve. A única referência é "descrições oficiais dos anúncios e embalagens". Fazem afirmações de saúde ("favorece cristais e cálculos, principalmente em machos castrados"; "grãos ancestrais de baixo índice glicêmico… ajudam na saciedade") sem fonte. |

- As fontes externas são o principal sinal de Autoridade de um site sem testes próprios. A página sobre promete: "fontes veterinárias… sempre citadas e linkadas no corpo do artigo". Hoje 11 posts quebram essa promessa.
- Correção, com 2 a 3 fontes por página nos pontos de saúde, em pt-BR quando der:
  - rações: WSAVA (Global Nutrition Guidelines), FEDIAF ou AAFCO, e uma fonte felina para a questão urinária, como a Cornell Feline Health Center;
  - comedouro: AAHA ou WSAVA sobre controle de porção;
  - bebedouro: hidratação felina;
  - câmera com petisco: ASPCA ou AVSAB sobre ansiedade de separação.
- Troque "retrieved" por "consultado em".

## MÉDIO

### M1: CONTINUA. 29 stubs finos e repetitivos, intocados desde 22/08
- 25 posts têm menos de 400 palavras e 32 têm menos de 600. 45 de 74 nunca foram modificados, e 44 foram publicados todos em 22/08.
- Os clusters porta (12 páginas), câmera, brinquedo e coleira concentram os stubs.
- A sobreposição da FAQ fica entre 0,90 e 0,97 em 25 páginas. Piores:
  - melhor-comedouro-interativo-gato e porta-sensor-de-luz: 0,969;
  - como-funciona-coleira-gps: 0,966;
  - brinquedo-substitui-tutor: 0,960.
- Cada stub carrega 2 CTAs genéricos e a barra fixa, um perfil "Low" do QRG: conteúdo principal raso com monetização proeminente.
- Correção: o plano de 11-06 continua válido. Funda os 5 stubs de porta em porta-eletronica-automatica-para-pet. Agora isso é mais urgente, porque os hubs já têm a estrutura para receber o conteúdo (ver A1).

### M2: CONTINUA. Política editorial fina e entidade de autor fraca
- politica-editorial tem 232 palavras e /sobre/ 382.
- Faltam três coisas:
  - **a declaração de uso de IA**: 5 páginas já informam "imagem ilustrativa gerada por IA", mas a política não fala de IA no texto;
  - **a fórmula das notas** (8,7/10, 8,3…) e a ordem do ranking;
  - **um log de correções** datado.
- O Person segue sem `image` e sem `knowsAbout`, com 1 `sameAs`.
- A seção "Como Escolhemos" dos rankings novos já é boa e honesta. Ela pode ser generalizada para a política editorial quase como está.

### M3: CONTINUA. Nenhum artefato de experiência própria
- Há 0 fotos próprias, medições ou prints de app em 74 páginas. As ilustrações do tutorial Tuya são próprias, mas são diagramas, não experiência.
- O teto de Experiência é estrutural.
- Para subir, faça 1 foto ou print real em 2 ou 3 páginas que já convertem:
  - configurar-app-comedouro-wifi: 22 cliques, CTR de 4,1%, a melhor página do site;
  - tapete-higienico-para-cachorro;
  - coleira-gps-para-gato.

### M4: NOVO. Frescor de preço e links mortos fora dos hubs
O monitor de 16/11 encontrou:
- **7 links de afiliado que não abrem produto**: brinquedo-automatico-cachorro-sozinho, camera-para-monitorar-pet, camera-pet-x-coleira-gps, coleira-gps-cachorro-pequeno-porte, comedouro-automatico-para-viagem, comedouro-x-bebedouro e como-funciona-coleira-gps;
- **10 preços com variação de 5% ou mais**: Madog +22% e Dogis +17% em melhor-comedouro-automatico-cachorro; fonte 2,5 L −17% em melhor-bebedouro.

Também:
- 91 links de afiliado aparecem em páginas sem nenhum preço por perto.
- melhor-tapete mistura preços de 04/10 e 23/10.
- Rankings com preço de outubro: melhor-comedouro-automatico-cachorro (22/10) e melhor-alimentador-automatico-gatos (11/10).
- melhor-coleira-gps-sem-mensalidade e camera-para-monitorar-pet não mostram preço nenhum.

Correção:
- Primeiro, troque ou remova os 7 links mortos. É um CTA que leva a "anúncio finalizado".
- Depois, atualize os preços que variaram mais de 10% e a data do bloco de preço. Não mude o dateModified se só o preço mudou: registre a mudança no log da M2.

### M5: CONTINUA (parcial). YMYL: antipulgas sem o alerta das isoxazolinas
- melhor-antipulgas-para-cachorro recomenda 4 isoxazolinas (Simparic, Bravecto, NexGard, Credeli) sem o alerta da FDA (2018) e do CVM sobre tremores, ataxia e convulsões.
- É a correção mais importante do site: trata de medicamento, e a página tem 185 impressões na posição 15,6.
- A seção "Credeli x Simparic x NexGard", pendente no diagnóstico de CTR, é o lugar natural para o alerta.
- Também faltam:
  - em cachorro-de-casa-pega-pulga: fontes externas (0);
  - em pilha-x-recarregavel: o aviso de supervisão da varinha.

### M6: NOVO. FAQ dos hubs repete o veredito da abertura
- A sobreposição da FAQ subiu em todos os hubs reescritos:
  - coleira-gato: 0,80 → 0,90;
  - comedouro: 0,52 → 0,87;
  - coleira-pet: 0,72 → 0,87;
  - bebedouro: 0,66 → 0,81.
- Exemplo: em coleira-gps-para-gato, a resposta de "Qual a melhor coleira com GPS para gatos?" repete quase palavra por palavra o 1º parágrafo (The Pet GPS 4G, 12 meses, 7 dias, R$ 718, ANXK 27 g, tag de R$ 130 a R$ 160).
- Para citação por IA ajuda pouco, porque a abertura já responde. Para o leitor é repetição.
- Correção: troque 1 ou 2 perguntas por dúvidas que o corpo não responde: garantia e assistência no Brasil, compatibilidade de app, custo do chip por mês, o que fazer se o anúncio sair do ar.

### M7: CONTINUA. Legibilidade
- Mediana de 27,2 palavras por frase (=) e PT-Flesch de 46,7 (era 44,9).
- 588 de 2.762 frases (21%) passam de 35 palavras.
- Os hubs novos usam frases curtas na prosa (coleira-pet 67, coleira-gato 65,5, configurar-app 66,7). As médias altas que aparecem neles vêm das tabelas.
- Os piores são stubs que devem ser fundidos: como-escolher-brinquedo-entediado (23,8), melhor-comedouro-interativo-gato (26,6) e porta-reconhecimento-facial (29,4).

## BAIXO / INFO
- **L1: CONTINUA.** 28 nós Review em 10 páginas usam `author: Organization`.
- **L4: CONTINUA.** A home diz "73 artigos", mas o sitemap tem 74 posts.
- **L5: CONTINUA.** VDRBG x Velds em comedouro-vdrbg-4l-wifi-review.
- **L8: CONTINUA.** "Exclusivamente 2,4 GHz" em como-configurar-camera-pet-wifi (corpo, FAQ e meta) contradiz o tutorial Tuya do próprio site.
- **L9: CONTINUA.** "Comedouro 6L avaliado aqui" sem nome em comedouro-com-ou-sem-wifi.
- **L10: NOVO.** Em coleira-gps-para-pet, "mas **deve** exigir chip à parte" (ANXK G58) é incerteza no lugar de um fato verificável. Confirme no anúncio e afirme.
- **L11: NOVO.** As rações não têm o "Atualizado em" visível (só "Publicado em 8 de novembro"). Os preços foram consultados "em plena Black Friday", e a própria página avisa isso. Atualize os preços e mostre a data da atualização depois de 30/11.
- **INFO:** o link da Royal Canin GI em melhor-racao-para-cachorro passou para outro anúncio do mesmo produto, que bate com o card. Não precisa de ação.

## On-Page SEO (81/100)

**Funciona:**
- 80 titles únicos, de 47 a 63 caracteres, sem template (`site_risk: low`).
- 80 metas únicas. Só 3 passam de 160 caracteres: autor (191), seresto (161) e configurar-app (163). Antipulgas, que tinha 221 em 11-06, caiu para 146.
- 1 H1 por página, canonical autorreferente em 80 de 80 e nenhum salto de nível de heading.
- Os titles dos hubs respondem à busca com número ("6 Melhores… de 2026").

**Problemas:**
- **ALTO (= A1).** "Melhor" ou "Melhores" aparece em titles de guias e stubs que disputam com o ranking do mesmo cluster: camera-para-monitorar-pet, como-escolher-brinquedo-entediado, coleira-gps-cachorro-pequeno-porte ("Melhor Coleira GPS para Cachorro de Pequeno Porte", 536 palavras, com link de afiliado morto) e melhor-bolinha-inteligente.
- **MÉDIO. Links internos invertidos.** As páginas de dinheiro recebem poucos links contextuais:

  | Página | Links internos recebidos |
  |---|---|
  | melhor-racao-cachorro / -gato | **2** (a home e a outra ração) |
  | camera-pet-com-dispensador | 4 |
  | melhor-antipulgas | 4 |
  | seresto | 5 |
  | melhor-bebedouro | 7 |

  Enquanto isso, guias antigos recebem 10 a 21 links ("volte ao guia completo…", 9 vezes cada).
  - Linke as rações a partir de comedouro, alimentador, bebedouro e gato-obeso.
  - Linke o ranking de câmera com petisco a partir dos 8 stubs de câmera. Use âncoras de intenção, como "melhores câmeras pet com petisco", em vez de "veja como funciona o recurso".
- **MÉDIO. Title ou H1 desalinhado com o que o corpo entrega.**
  - como-instalar-porta ("Parede" sem seção própria);
  - bebedouro-inox-x-ceramica (o title fala de material, mas recebe consultas de "fonte de água para gato");
  - comedouro-automatico-para-dois-gatos (194 impressões, CTR de 1%; o title "Como Evitar Briga" não casa com a busca pelo produto). Ver reports/ctr-diagnostico-2026-11-17.md.
- **BAIXO.** O slug coleira-gps-para-pet agora é um ranking só de cachorro, com title "Coleira GPS para Cachorro…". Não mude a URL. Garanta que os links "coleira GPS para gato" apontem para coleira-gps-para-gato.
- **BAIXO.** Há "Key Takeaways" em inglês, com "- " literal, em 18 páginas (ver M1 do delta).

## O que funciona
- **Os 8 rankings novos estão no nível certo para um afiliado sem testes próprios.** Têm veredito nomeado com número e preço datado no 1º parágrafo, a "Escolha rápida" por perfil, ficha técnica por produto, prós e contras reais, como "O anúncio não diz se o fecho é breakaway" e "vendido sem garantia", e opiniões de compradores atribuídas. "Não testamos os aparelhos fisicamente" aparece 2 vezes por página, e a seção "Como Escolhemos" explica descartes e exceções (Furbo).
- Os CTAs dos hubs dizem qual produto é e por quê, e a disclosure fica junto de cada botão.
- Nenhuma alegação de teste falso: todas as 19 ocorrências de "test…" são negativas ("não testamos").
- A Seresto virou referência em fontes, e as rações tratam a dieta veterinária com cautela correta.
- Não há duplicação entre páginas. A duplicação fica dentro de cada página (FAQ) e na intenção (A1).

## Prontidão para citação por IA (83/100, era 80)
- **Ganhos:**
  - 8 hubs com resposta direta nomeada, tabela comparativa e "Escolha rápida" em `<ul>`, todos com preço e data;
  - a Seresto agora tem fontes primárias;
  - o tutorial Tuya tem passos numerados.
- **Freios:**
  - 3 rankings de comedouro com vencedores diferentes (A1);
  - melhor-camera derivada de uma única fonte (A2);
  - hubs sem fonte externa (A3);
  - "Key Takeaways" com "- " em bebedouro-inox, a página de maior gap de CTR;
  - "retrieved" em inglês;
  - "exclusivamente 2,4 GHz", que se contradiz com outra página do site.

## Achados estruturados (audit-data.json, Content Quality)

```json
{"category":"Content Quality","date":"2026-11-17","score":79,"prior_score":76,"onpage_score":81,
"eeat":{"experience":47,"expertise":63,"authoritativeness":55,"trustworthiness":81,"weighted":63},
"ai_citation_readiness":83,
"findings":[
{"id":"CQ-FIXED5","severity":"info","status":"fixed","title":"8 hubs rebuilt as dated rankings (2.6-3.6k words) with named verdict, per-product specs, 'Não testamos', 'Como Escolhemos', product-named CTAs","urls":["/coleira-gps-para-gato/","/coleira-gps-para-pet/","/melhor-bebedouro-automatico-pet/","/comedouro-automatico-para-pet/","/camera-pet-com-dispensador-de-petisco/","/brinquedo-interativo-automatico-para-gato/","/coleira-seresto-antipulgas/","/configurar-app-comedouro-wifi/"]},
{"id":"CQ-FIXED6","severity":"info","status":"fixed","title":"ANXK G68 no longer 'best' for cats (The Pet GPS 4G); camera-petisco meta 'ansiedade' now delivered; Seresto gained 5 authoritative sources"},
{"id":"CQ-A1","severity":"high","status":"new","title":"Intra-cluster cannibalization: hubs absorbed stub topics (brinquedo idoso/pilha), 3 'melhor câmera' pages, 3 comedouro rankings with different winners (Newpet 4L vs VDRBG; Oct prices), bebedouro-inox vs melhor-bebedouro","urls":["/melhor-camera-para-monitorar-pet/","/camera-para-monitorar-pet/","/melhor-comedouro-automatico-cachorro/","/melhor-alimentador-automatico-gatos/","/bebedouro-inox-x-ceramica/","/brinquedo-interativo-gato-idoso-vale-a-pena/"]},
{"id":"CQ-A2","severity":"high","status":"open","title":"melhor-camera-para-monitorar-pet: 386 words, 0 prices, all claims paraphrased from a single listicle (mybest)","urls":["/melhor-camera-para-monitorar-pet/"]},
{"id":"CQ-A3","severity":"high","status":"regressed","title":"Rewritten hubs lost external sources (comedouro 2->0, camera-petisco 1->0, bebedouro 3->1); new ração posts have 0 external sources despite health claims; 11 posts with no external link","urls":["/comedouro-automatico-para-pet/","/camera-pet-com-dispensador-de-petisco/","/melhor-racao-para-cachorro/","/melhor-racao-para-gato/","/coleira-gps-para-pet/"]},
{"id":"CQ-M1","severity":"medium","status":"open","title":"29 stubs <450 words untouched since 08-22 with 2 generic CTAs + sticky bar; FAQ overlap >=0.9 on 25 posts; 45/74 never modified"},
{"id":"CQ-M2","severity":"medium","status":"open","title":"politica-editorial 232 words: no AI-use statement, no rating formula, no corrections log; Person lacks image/knowsAbout, 1 sameAs"},
{"id":"CQ-M3","severity":"medium","status":"open","title":"No first-hand photos/measurements/app screenshots on any page"},
{"id":"CQ-M4","severity":"medium","status":"new","title":"7 dead affiliate links on stubs; 10 prices moved >=5% (Madog +22%, Dogis +17%); older rankings priced 11/10 and 22/10"},
{"id":"CQ-M5","severity":"medium","status":"partial","title":"melhor-antipulgas recommends 4 isoxazolines without FDA/CVM neurological warning; pega-pulga 0 sources; pilha-x-recarregavel wand caveat missing","urls":["/melhor-antipulgas-para-cachorro/"]},
{"id":"CQ-M6","severity":"medium","status":"new","title":"Hub FAQs restate opening verdict (overlap 0.52->0.87 comedouro, 0.80->0.90 coleira gato)"},
{"id":"CQ-M7","severity":"medium","status":"open","title":"Median 27.2 words/sentence, PT-Flesch 46.7; 21% sentences >35 words"},
{"id":"CQ-M8","severity":"medium","status":"improved","title":"'Key Takeaways' literal '- ' on 18 pages (was 24), incl. bebedouro-inox-x-ceramica (biggest CTR gap)"},
{"id":"OP-1","severity":"high","status":"new","title":"'Melhor' in titles of guides/stubs competing with cluster rankings (camera-para-monitorar-pet, como-escolher-brinquedo-entediado, coleira-gps-cachorro-pequeno-porte, melhor-bolinha)"},
{"id":"OP-2","severity":"medium","status":"new","title":"Money pages under-linked: ração 2 inbound each, camera-petisco 4, antipulgas 4, seresto 5 vs legacy guides 10-21"},
{"id":"OP-3","severity":"medium","status":"open","title":"Title/intent mismatch: como-instalar-porta ('Parede'), bebedouro-inox (material vs 'fonte de água'), comedouro-dois-gatos"},
{"id":"OP-4","severity":"low","status":"ok","title":"80 unique titles 47-63 chars, metas unique (3 >160), 1 H1/page, self canonicals 80/80, metadata templating low risk"},
{"id":"CQ-L1","severity":"low","status":"open","title":"28 Review nodes on 10 pages use author Organization"},
{"id":"CQ-L4","severity":"low","status":"open","title":"Home says '73 artigos' vs 74 posts"},
{"id":"CQ-L5","severity":"low","status":"open","title":"VDRBG vs Velds (32x) unexplained"},
{"id":"CQ-L8","severity":"low","status":"open","title":"'exclusivamente 2,4 GHz' contradicts site's own Tuya tutorial"},
{"id":"CQ-L9","severity":"low","status":"open","title":"Unnamed 'comedouro 6L avaliado aqui'"},
{"id":"CQ-L10","severity":"low","status":"new","title":"coleira-gps-para-pet: 'deve exigir chip' hedge on ANXK G58"},
{"id":"CQ-L11","severity":"low","status":"new","title":"Ração posts priced during Black Friday; no visible update date — refresh after 30/11"}]}
```
