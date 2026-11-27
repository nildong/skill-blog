# Dados Google (API) - smartpetgadgets.com.br
Coleta: 2026-11-17 | Tier 2 (API key + service account + GA4 560945876) | Fonte: Google API (field data) | Comparacao com 2026-11-06
Defasagem: GSC 2-3 dias (ultimo dia 11-14), GA4 1 dia (ultimo dia 11-16), CrUX janela de 28 dias. Numeros brutos: `google-data.json`.

## 1. GSC 28d vs 28d anterior (totals_complete: true)
Janelas: atual 2026-10-18..11-14 | anterior 2026-09-20..10-17. (Totais da API hoje: 5.090 impr e anterior 2.450; o diagnostico de CTR registrou 5.175 / 2.543. Diferenca de ~1,7-3,6% por reprocessamento/janela; a tendencia e a mesma.)

| Metrica | Atual | Anterior | Delta |
|---|---|---|---|
| Cliques | 63 | 29 | +117% |
| Impressoes | 5.090 | 2.450 | +108% |
| CTR | 1,24% | 1,18% | +0,06 pt |
| Posicao media | 9,3 | 10,1 | 0,8 melhor |
| Paginas com impressao | 79 | 77 | +2 (sao as 2 de racao, nenhuma pagina perdida) |

Vs auditoria 11-06 (10-07..11-03): 42 cliques / 3.740 impr / CTR 1,12% / pos 9,8 -> 63 / 5.090 / 1,24% / 9,3. Impressoes +36%, cliques +50%, CTR sobe ligeiramente (a queda de CTR 7d de 0,85% nao persistiu).

### Dispositivo
| Device | Cliques | Impr | Pos | Anterior (cliq/impr/pos) |
|---|---|---|---|---|
| Mobile | 47 | 3.867 | 7,0 | 20 / 1.849 / 7,9 |
| Desktop | 16 | 1.200 | 16,6 | 9 / 593 / 16,8 |
| Tablet | 0 | 23 | 6,3 | 0 / 8 / 7,2 |
Mobile = 76% das impressoes e 75% dos cliques. Desktop ranqueia em pos ~16,6 (vs 7,0 mobile): diferenca grande e estavel, sem acao imediata mas explica o CTR baixo no desktop (1,33% vs 1,22% mobile: equivalentes).

### searchAppearance
| Apariencia | Impr | Cliques | Pos | Anterior |
|---|---|---|---|---|
| Product snippets | 79 | 0 | 18,0 | 11 impr / pos 15,5 |
| Review snippet | 9 | 0 | 7,0 | 12 impr / pos 7,9 |
Rich results ainda marginais (2% das impressoes) e 0 cliques. Product snippets sobem 7x em impressoes (efeito das paginas ranking/Seresto), mas em pos 18.

### Paginas (cliq / impr / pos; anterior entre parenteses)
| Pagina | Atual | Anterior |
|---|---|---|
| /configurar-app-comedouro-wifi/ | 22/538/4,3 | 4/306/4,9 |
| /bebedouro-inox-x-ceramica/ | 6/512/6,3 | 3/230/8,7 |
| **/melhor-racao-para-cachorro/** (nova) | 0/242/10,3 | - |
| /coleira-gps-para-gato/ | 3/199/9,2 | 1/82/10,9 |
| /melhor-camera-para-monitorar-pet/ | 2/196/14,5 | 0/42/14,6 |
| /comedouro-automatico-para-dois-gatos/ | 2/194/6,2 | 0/89/7,1 |
| /melhor-antipulgas-para-cachorro/ | 0/185/15,6 | 0/69/16,9 |
| /melhor-bebedouro-automatico-pet/ | 1/141/9,3 | 0/59/13,2 |
| /comedouro-newpet-2l-review/ | 3/139/7,0 | 2/31/8,3 |
| /camera-para-monitorar-pet/ | 0/117/22,3 | 0/104/18,4 |
| /melhor-tapete-higienico-para-cachorro/ | 0/95/17,7 | 0/14/17,2 |
| /melhor-alimentador-automatico-gatos/ | 0/93/12,0 | 0/44/29,6 |
| / (home) | 1/74/44,6 | 0/35/35,0 |

- /configurar-app-comedouro-wifi/ gera 35% dos cliques (22/63) com CTR 4,1%: unica pagina com CTR saudavel. Os 63 cliques se espalham por 27 paginas, a maioria com 1.
- Queries (201 linhas somam 706 de 5.090 impr; resto anonimizado, nao e total): so 2 cliques visiveis ("manual de instrucoes" pos 5; "melhor rastreador para gatos" pos 11). Sem clique nao-marca relevante identificavel; ruido de titulos de marketplace ("2l alimentador inteligente comedouro automatico pet newpet" 9 impr).
- Oportunidades (pos 4-20, >=30 impr, 0 cliques): 25 paginas (era 27 com limiar 20 impr em 11-06).
- Pioras: home 35,0 -> 44,6; camera-para-monitorar-pet 18,4 -> 22,3. Melhoras: alimentador-automatico-gatos 29,6 -> 12,0; melhor-bebedouro 13,2 -> 9,3; comedouro-interativo 15 -> 9,8; melhor-comedouro-cachorro 21 -> 14,5 (ainda abaixo do 9,8 de setembro).

### Paginas novas/reescritas (posicao e impr, atual vs anterior)
| Pagina | Atual | Anterior |
|---|---|---|
| melhor-racao-para-gato | 0/33/16,7 | nova |
| melhor-racao-para-cachorro | 0/242/10,3 | nova |
| camera-pet-com-dispensador-de-petisco | 0/45/7,2 | 1/19/8,9 |
| comedouro-automatico-para-pet (hub) | 1/26/8,3 | 0/4/9,0 |
| melhor-bebedouro-automatico-pet | 1/141/9,3 | 0/59/13,2 |
| coleira-gps-para-gato | 3/199/9,2 | 1/82/10,9 |
| brinquedo-interativo-automatico-para-gato | 0/49/9,9 | 0/16/11,2 |
| coleira-seresto-antipulgas | 0/35/9,5 | 0/16/17,4 |
Todas melhoraram posicao. Janela atual so cobre parcialmente os rewrites de 11-14/11-15 (dados GSC terminam 11-14), entao o efeito pleno ainda nao aparece. racao-cachorro: 242 impr em ~1 semana de vida, pos 10,3, 0 cliques.

## 2. Sitemap
/sitemap.xml: 80 URLs web submetidas (= 80 `<loc>` no sitemap local), 0 erros, 0 avisos, nao pendente. Ultimo envio registrado: 2026-11-04 12:10 UTC (inalterado desde 11-06). O Google leu 80 URLs, entao ja enxerga as paginas de racao; reenvio manual nao e necessario.

## 3. Inspecao de URL (9 URLs solicitadas)
| URL | Veredito | Ultimo crawl (UTC) | Rich results |
|---|---|---|---|
| /melhor-racao-para-gato/ | PASS, indexada | 11-08 20:10 | Breadcrumbs |
| /melhor-racao-para-cachorro/ | PASS, indexada | 11-08 17:53 | Breadcrumbs |
| /camera-pet-com-dispensador-de-petisco/ | PASS, indexada | 11-15 06:27 | Product snippets (avisos: review/aggregateRating ausentes) |
| /comedouro-automatico-para-pet/ | PASS, indexada | 11-15 04:34 | Product snippets (avisos review) |
| /melhor-bebedouro-automatico-pet/ | PASS, indexada | 11-14 03:07 | Product snippets (avisos aggregateRating) |
| /coleira-gps-para-gato/ | PASS, indexada | 11-16 16:51 | Product snippets (avisos review/aggregateRating) |
| /coleira-gps-para-cachorro/ | **NEUTRAL, "URL is unknown to Google"** | - | - |
| /brinquedo-interativo-automatico-para-gato/ | PASS, indexada | **10-23** (25 dias) | Breadcrumbs |
| /coleira-seresto-antipulgas/ | PASS, indexada | 11-16 17:25 | Product snippets validos, sem problemas; Breadcrumbs |

- Todas as existentes: "Submitted and indexed", INDEXING_ALLOWED, robots ALLOWED, canonical Google = declarado. Indexacao 8/8 das paginas existentes.
- **/coleira-gps-para-cachorro/ nao existe**: nao ha pasta no repo nem entrada no sitemap. O 404/unknown e esperado; as paginas de cachorro sao coleira-gps-cachorro-que-foge, coleira-gps-cachorro-pequeno-porte, como-funciona-coleira-gps-cachorro. Se a intencao e um hub de cachorro (comparativo de GPS para cachorros), ele ainda nao foi publicado.
- Os rewrites de 11-14/11-15 (bebedouro, comedouro hub, camera-petisco, seresto, coleira-gato) ja foram recrawlados em 11-14..11-16: Google tem o conteudo novo. Racao (crawl 11-08) e **brinquedo-gato (crawl 10-23, anterior ao rewrite comparativo de 11-14)** ainda NAO foram recrawlados apos as mudancas: candidato a "Solicitar indexacao" manual no GSC.
- Os avisos de Product snippets (review/aggregateRating ausentes) sao opcionais; decisao anterior de manter como esta (afiliado, nao merchant).

## 4. GA4 (property 560945876), 2026-10-27..11-16 (dados comecam em 10-27; sem janela anterior comparavel)
Total ~177 sessoes, 166 usuarios, 189 page_views.

| Canal | Sessoes | Engajadas | Obs |
|---|---|---|---|
| Direct | 61 | 12 (20%) | provavel mistura de teste proprio/apps |
| Organic Search | 61 | 30 (49%) | google 56, bing 4, ecosia 1 |
| AI Assistant | 30 | 17 (57%) | chatgpt.com 29, gemini.google.com 1 |
| Organic Social | 25 | 12 | Facebook (facebook.com 13, m.facebook.com 10, lm 2); sem sessoes novas desde ~11-06 |

Vs 11-06 (91 sessoes): organico Google/Bing 17 -> 61 (x3,6), ChatGPT 17 -> 29, Direct 32 -> 61, Social 25 -> 25 (parou).
- **Organic Search (61)** esta bem acima de ChatGPT (29) agora; o GSC (63 cliques) bate com o GA4 (60 google+bing): dados consistentes. 24 das 61 sessoes organicas vao para /configurar-app-comedouro-wifi (39%); o restante pulveriza em ~24 paginas.
- **ChatGPT (29 sessoes)**: landing /melhor-tapete-higienico-para-cachorro (16), /coleira-gps-para-gato (12), /melhor-comedouro-automatico-cachorro (1). Engajamento 55%. Gemini: 1 sessao (camera-para-monitorar-pet). So 2 paginas recebem ChatGPT; nenhuma das paginas de racao, bebedouro, camera ou brinquedo recebe.
- Por ser ~2 paginas, ChatGPT e Google nao se sobrepoem (tapete tem 0 cliques no Google, pos 17,7).

### Eventos de afiliado
- **affiliate_click: 18 eventos, 11 usuarios** (primeiro em 11-06; em 11-06 eram 0 ate o dia 5, script no ar desde 11-05 - resolvido: o evento funciona). Por dia: 11-06 1, 11-08 4, 11-10 2, 11-11 1, 11-12 1, 11-13 1, 11-14 5, 11-15 1, 11-16 2.
- Por pagina: /coleira-gps-para-gato/ 6, /melhor-tapete-higienico-para-cachorro/ 5, /melhor-bebedouro-automatico-pet/ 2, /melhor-racao-para-cachorro/ 2, camera-para-monitorar-pet 1, cerca-virtual-para-cachorro 1, comedouro-newpet-2l-review 1.
- Por origem: **chatgpt.com 10 (56%)** (5 coleira-gato + 5 tapete), direct 5, google 2 (newpet-2l, bebedouro), gemini 1.
- Taxa: 18 cliques / ~177 sessoes = ~10% das sessoes; ChatGPT: 10/29 = 34% das sessoes (muito mais alto); Google organico: 2/61 = 3%. Visitantes de IA clicam muito mais em afiliado que os do Google.
- Evento `click` (saida enhanced measurement): 23 (tapete 7 e coleira-gato 4 via chatgpt.com; outros 12 diversos). Sao cliques de saida adicionais, nao duplicam necessariamente affiliate_click.
- Racao-cachorro: 2 affiliate_click ambos de sessoes diretas (provavel teste/proprio), 1 sessao organica Google.
- Vendas nao medidas aqui (GA4 nao tem conversao); verificar no painel do ML Afiliados.

## 5. CrUX / PSI
CrUX History (origin): "Insufficient Chrome traffic volume for eligibility" (esperado). Sem CWV de campo. PSI nao reexecutado (home mobile 99/96/100/100, LCP 1,7 s em 11-04).

## 6. Delta vs 2026-11-06 e prioridades
| Item | 11-06 | 11-17 |
|---|---|---|
| Cliques 28d | 42 | 63 |
| Impressoes 28d | 3.740 | 5.090 |
| CTR | 1,12% | 1,24% |
| Posicao | 9,8 | 9,3 |
| Sitemap | 78 URLs, ok | 80 URLs, ok |
| affiliate_click | 0 (amostra minima) | 18 (10 do ChatGPT) |
| Sessoes organicas GA4 | 17 | 61 |
| Indexacao (amostra inspecionada) | 12/12 | 8/8 existentes; 1 URL inexistente |

Prioridades:
1. (Alta) Solicitar indexacao manual de /brinquedo-interativo-automatico-para-gato/ (crawl 10-23, pre-rewrite) e das 2 paginas de racao (crawl 11-08).
2. (Alta) CTR: gargalo continua sendo clique, nao indexacao: 25 paginas pos 4-20 com >=30 impr e 0 cliques; medir P1 (retitulos 11-05) agora que ha >=3 semanas, conforme reports/ctr-diagnostico-2026-11-17.md.
3. (Media) Capitalizar ChatGPT: 34% das sessoes de IA geram clique de afiliado; replicar o formato de /melhor-tapete e /coleira-gps-para-gato (pick boxes) em outras paginas de ticket alto.
4. (Media) Se a intencao e ter /coleira-gps-para-cachorro/, ela nao existe (nao e erro de indexacao).
5. (Baixa) Home pos 44,6 e camera-para-monitorar-pet 22,3 em queda.
