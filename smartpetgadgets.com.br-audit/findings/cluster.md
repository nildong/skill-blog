# Clusters semânticos, canibalização e links internos — smartpetgadgets.com.br

Data: 2026-11-17. Escopo: 74 posts locais (`/home/projetos/blog/<slug>/index.html`). Os links foram extraídos só do corpo da página (nav, header e footer ficam de fora). O SERP overlap foi medido por WebSearch, que serve de proxy aproximado do top 10 do Google BR, e só nos 4 pares em que ele ajuda a decidir. Os dados de GSC vêm de `findings/google-data.md` (28d até 11-03).
Comparação com a auditoria de 11-04 (`archive/2026-11-06/findings/cluster.md`) e com `reports/cannibalization.md` (10-07) no fim do arquivo.

## Mapa de clusters (hoje)

| Cluster | Hub | Posts | Hub→spoke / spoke→hub | Arestas no cluster | Palavras do hub | Veredito |
|---|---|---|---|---|---|---|
| Comedouro | comedouro-automatico-para-pet | 20 | 19/19 / 19/19 | 111 | 4726 | Completo. O hub virou ranking em 11-15 e agora disputa a intenção com "melhor ... cachorro" |
| Coleira GPS | coleira-gps-para-pet | 11 | 10/10 / 10/10 | 68 | 3933 | O hub virou "Coleira GPS para **Cachorro**: 5 melhores" e cobre a intenção de "que-foge" |
| Câmera | camera-para-monitorar-pet | 11 | 10/10 / 10/10 | 40 | 1038 | **Canibalização confirmada por SERP (9-10/10)**. Nada mudou desde 11-04 |
| Porta eletrônica | porta-eletronica-automatica-para-pet | 11 | 10/10 / 10/10 | 45 | 967 | Estrutura ok, spokes rasos (~650 palavras), sem página comercial |
| Brinquedo | brinquedo-interativo-automatico-para-gato | 10 | 9/9 / 9/9 | 41 | 3617 | O hub virou ranking em 11-14. Ok |
| Bebedouro | melhor-bebedouro-automatico-pet | 2 | 1/1 / 1/1 | 2 | 3654 | O spoke de material ainda tem seção comercial |
| Antipulgas | melhor-antipulgas-para-cachorro | 3 | 2/2 / 2/2 | 6 | 2467 | Pilar com in=2 |
| **Ração (novo)** | — (2 rankings irmãos) | 2 | — | 2 | 3044 / 3050 | **Quase órfãos no corpo: in=1 cada (só um do outro)** |
| Tapete | melhor-tapete-higienico-para-cachorro | 2 | 1/1 / 1/1 | 2 | 3324 | Par isolado |
| Avulsos | soprador-pet, cercado-para-cachorros | — | — | — | — | soprador in=1/out=1 |

O hub↔spoke bidirecional continua em 100% nos 5 clusters grandes. Os problemas reais são três: **intenção duplicada** (câmera, comedouro, coleira, bebedouro), **spokes com poucos links de entrada** (18 páginas com in<3) e **posts novos sem integração** (ração, ranking de câmera com petisco).

## Matriz de SERP overlap (top 10, proxy)

| Par | Compartilhadas | Faixa | Decisão |
|---|---|---|---|
| "melhor câmera para monitorar pet" × "câmera para monitorar pet" | **9-10** (my-best 22182, buscamelhores ×3, seuguiadetecnologia, mundodosreviews, qualmelhorcomprar ×2, melhoresparacomprar, guiaomelhor) | Mesmo post | **Consolidar numa URL** (A1) |
| "coleira gps para cachorro" × "coleira gps para cachorro que foge" | **7-8** (andrelemos, my-best 22230, Buscapé, ML blog, Zoom, cupomonline, Magalu, Petz) | Mesmo post (limite) | Diferenciar o ângulo de "que-foge". Merge é opção se o GSC confirmar troca de URL (M2) |
| "melhor comedouro automático para cachorro" × "comedouro automático para pet melhores" | **6-7** (ML blog, Buscapé ×2, Zoom ×2, my-best ×2) | Mesmo cluster | Manter separados e tirar do hub a seção "cães grandes" (M1) |
| "bebedouro inox ou cerâmica para gato" × "melhor bebedouro automático para gato fonte" | **1** (my-best 18266). O resto são categorias Cobasi diferentes (bebedouro × fonte) | Separados | As intenções são distintas. A canibalização vem da **seção comercial** do post de material, não da keyword (M3) |
| soprador-pet × soprador-para-pet | n/a | — | Não é canibalização de keyword. São 2 URLs da mesma página no GSC (45 + 34 impr em 28d), mesmo com 301 desde 08-23. O 301 continua ativo hoje (verificado). Ver B2 |

---

## ALTO

### A1. Câmera: hub e roundup ocupam a mesma SERP (persiste desde 11-04, agora confirmado)
Evidências:
- Hub `/camera-para-monitorar-pet/`: o title e o H1 ainda são "**Melhor Câmera para Monitorar Pet**: Como Escolher..." e há um H2 "Modelos Populares no Mercado Brasileiro". GSC: 136 impr, pos 19,3.
- Money page `/melhor-camera-para-monitorar-pet/`: 648 palavras, out=2, title "Melhores Câmeras Pet 2026: TP-Link, Newpet, Intelbras". GSC: 105 impr, pos 16,5.
- O SERP overlap dá 9-10/10: as duas keywords são a mesma intenção, de lista comercial.
- Os hubs de comedouro, coleira, brinquedo e bebedouro já viraram rankings, e esse padrão está funcionando. Câmera é o único cluster com hub informacional e roundup raso separados.

Correção (muda a recomendação de 11-04, que era "não fazer merge"):
1. Reescrever `/camera-para-monitorar-pet/` como ranking de 6 câmeras (mesmo padrão dos outros hubs), absorvendo Tapo C200, Newpet 2K, Intelbras e Haiz da money page.
2. Fazer **301 de `/melhor-camera-para-monitorar-pet/` → `/camera-para-monitorar-pet/`** no bloco SLUG REDIRECTS do `.htaccess`.
3. Atualizar os 5 links internos que apontam para a money page (hub, dispensador-de-petisco, como-configurar, duvidas, erros-comuns), além do card da home, do sitemap e do llms.txt.
4. Title sugerido: "Câmera para Monitorar Pet: 6 Melhores de 2026 (Tapo, Intelbras, Newpet)". Entra na lista de troca de ano 2027.
Alternativa sem merge, mais fraca: tirar "Melhor" do title/H1 do hub e levar a money page para mais de 1500 palavras. Só que a SERP é 100% de listas, então um hub informacional dificilmente rankeia nela.

### A2. Ração: 2 rankings novos sem nenhum link vindo do site
Evidência: `melhor-racao-para-cachorro` e `melhor-racao-para-gato` (cerca de 3000 palavras cada) só recebem link um do outro (in=1). A home tem os cards. Os dois enviam 5-6 links para o cluster comedouro, mas não recebem nenhum de volta.
Correção: 7 links (tabela de links, prioridade Alta). A ponte natural é comedouro → ração.

### A3. 18 páginas com menos de 3 links de entrada (eram 17 em 11-04, quase nada foi aplicado)
- in=1: `duvidas-camera-para-monitorar-pet`, `duvidas-coleira-gps-pet`, `soprador-pet`, `melhor-racao-para-cachorro`, `melhor-racao-para-gato`.
- in=2: `comedouro-automatico-para-viagem` (**81 impr, pos 6,1, a melhor posição do cluster**), `comedouro-automatico-anti-formiga`, `camera-pet-com-dispensador-de-petisco` (ranking novo com 3767 palavras), `erros-comuns-camera-monitorar-pet`, `duvidas-porta-eletronica-pet`, `erros-comuns-porta-eletronica-pet`, `porta-eletronica-reconhecimento-facial-vale-a-pena`, `brinquedo-automatico-cachorro-sozinho`, `melhor-bolinha-inteligente-para-gato` (40 impr, pos 9,5), `bebedouro-inox-x-ceramica`, `cachorro-de-casa-pega-pulga`, `melhor-antipulgas-para-cachorro` (pilar, 123 impr), `melhor-tapete-higienico-para-cachorro` (pilar).
- Resolvido desde 11-04: `comedouro-automatico-para-dois-gatos` (2→4).
- Problema extra: `camera-pet-cachorro-ansiedade-separacao` tem **out=1** (só linka para o hub) e é um beco sem saída.

Correção: os cerca de 48 links da tabela abaixo.

## MÉDIO

### M1. O hub do comedouro virou ranking e agora encosta em `melhor-comedouro-automatico-cachorro`
Evidências: H1 do hub "Os 6 Melhores para Cães e Gatos em 2026" e H2 "Qual o Melhor Comedouro Automático para Cães Grandes?". O SERP overlap com "melhor comedouro automático para cachorro" é 6-7. No GSC, a money page de cachorro já tinha caído de 9,8 para 22,8 (dado anterior à reescrita do hub em 11-15, então a causa não está provada).
Correção: deixar o H2 "cães grandes" do hub com 2-3 linhas e um link com âncora "melhor comedouro automático para cachorro". Na money page de cachorro, reforçar o que só ela tem: porte grande, 6-10 L, ração de grão grande. Medir em 4-6 semanas se as queries "... para cachorro" ficam na URL certa. Vale o mesmo para `melhor-alimentador-automatico-gatos` (pos 16,1→22,7): o hub não deve ter um H2 "melhor para gatos". Herdado de 11-04 e ainda pendente: o title de `comedouro-automatico-vale-a-pena` mantém "Guia 2026".

### M2. Coleira: o hub "para Cachorro" cobre `coleira-gps-cachorro-que-foge`
Evidências: o hub foi retitulado para "Coleira GPS para Cachorro: 5 Melhores" e tem os H2 "Para Cães que Fogem com Frequência" e "Tamanho Certo por Porte e Raça". O SERP overlap com "que foge" dá 7-8, e a de "que-foge" e "pequeno-porte" é praticamente a SERP da head. O `reports/cannibalization.md` já apontava `pequeno-porte × que-foge` (62) e `que-foge × sem-mensalidade` (57).
Correção: não fazer merge agora, porque "que-foge" tem pos 7,3 e "pequeno-porte" está bem. Reposicionar "que-foge" para o problema (fuga), não para a escolha do produto. H1 sugerido: "Cachorro que Foge: Cerca Virtual, Alertas e Como Evitar a Próxima Fuga". A escolha do modelo fica no hub, via link. No hub, a seção "Para Cães que Fogem" fica com 2 linhas e o link. Se o GSC mostrar as duas URLs se alternando em "coleira gps para cachorro", aí sim fazer 301 de que-foge → hub.

### M3. Bebedouro: a canibalização é da seção comercial, não da keyword
Evidências: o SERP overlap dá 1, então as intenções são separadas. Mesmo assim, `bebedouro-inox-x-ceramica` continua com os H2 "Quanto Custa um Bebedouro Fonte de Inox ou Cerâmica" e "Modelos à Venda no Mercado Livre". Foi por isso que ele rankeou para as queries de compra (pos 7,2 / 617 impr) acima do ranking reescrito em 11-14. A ligação entre os dois está boa (3 links com âncora comercial para o ranking).
Correção: trocar "Modelos à Venda no Mercado Livre" por um bloco curto do tipo "Os modelos que recomendamos estão no [ranking das 6 melhores fontes]". Manter só a faixa de preço por material, sem lista de produtos. Fazer depois da medição de 4-8 semanas que já está planejada, ou já agora se o GSC de dezembro mostrar que o ranking não captou as queries de compra.

### M4. Ranking de câmera com petisco isolado do cluster comedouro
`camera-pet-com-dispensador-de-petisco` (3767 palavras, com comedouros com câmera) recebe link só do hub e da money page de câmera. Nenhum post de comedouro com câmera ou Wi-Fi aponta para ele. Correção: 4 links na tabela.

## BAIXO

### B1. `/comedouro-cachorro/` sem link para a money page (persiste desde 11-04)
Tem out=2 (hub e tapete). Adicionar links para `melhor-comedouro-automatico-cachorro`, `melhor-racao-para-cachorro` e `melhor-tapete-higienico-para-cachorro`.

### B2. Soprador: quase órfão e com URL duplicada no GSC
`soprador-pet` tem in=1/out=1. O 301 de `soprador-para-pet` responde certo hoje e não sobrou nenhuma referência local à URL antiga, mas o GSC ainda soma impressões nas duas.
Correção: rodar Inspeção de URL na antiga e pedir reindexação da nova. Conferir se algum pin, post do Facebook ou link externo ainda usa a URL antiga, porque isso é externo e não aparece localmente. Adicionar 3 links contextuais (antipulgas, Seresto e cachorro-de-casa, pelo tema banho e secagem), mais 1 de saída para o antipulgas.

### B3. Tapete e antipulgas como mini-clusters
Os dois pilares estão com in=2. A rotina do cão em casa (cercado, comedouro-cachorro, tapete, pulga) já existe, mas só em parte. Links na tabela.

### B4. Porta eletrônica: spokes rasos e sem money page (persiste)
Sem mudança desde 11-04. Fica registrado, sem ação nova além dos links de FAQ, erros e facial.

---

## Sugestões de links internos (source → target, âncora) — todos checados: nenhum existe hoje

| # | Sev. | Source | Target | Âncora sugerida |
|---|---|---|---|---|
| 1 | Alta | comedouro-automatico-para-pet | melhor-racao-para-cachorro | melhor ração para cachorro |
| 2 | Alta | comedouro-automatico-para-pet | melhor-racao-para-gato | melhor ração para gato |
| 3 | Alta | melhor-alimentador-automatico-gatos | melhor-racao-para-gato | qual ração colocar no alimentador |
| 4 | Alta | comedouro-automatico-gato-obeso | melhor-racao-para-gato | ração para gato castrado |
| 5 | Alta | comedouro-automatico-para-dois-gatos | melhor-racao-para-gato | ração certa para cada gato |
| 6 | Alta | melhor-comedouro-automatico-cachorro | melhor-racao-para-cachorro | ração ideal para cada porte |
| 7 | Alta | comedouro-cachorro | melhor-racao-para-cachorro | comparativo de rações para cachorro |
| 8 | Alta | comedouro-com-ou-sem-wifi | comedouro-automatico-para-viagem | quantos dias o comedouro aguenta em viagem |
| 9 | Alta | comedouro-vdrbg-4l-wifi-review | comedouro-automatico-para-viagem | comedouro automático em viagem |
| 10 | Alta | comedouro-newpet-4l-review | comedouro-automatico-para-viagem | até quantos dias é seguro viajar |
| 11 | Alta | configurar-app-comedouro-wifi | comedouro-automatico-para-viagem | configurar antes de viajar |
| 12 | Alta | camera-pet-cachorro-ansiedade-separacao | camera-pet-com-dispensador-de-petisco | câmera que solta petisco para distrair o cão |
| 13 | Alta | camera-pet-cachorro-ansiedade-separacao | brinquedo-automatico-cachorro-sozinho | brinquedo automático para cachorro sozinho |
| 14 | Média | comedouro-vdrbg-4l-wifi-review | camera-pet-com-dispensador-de-petisco | comedouros com câmera e dispensador |
| 15 | Média | comedouro-com-ou-sem-wifi | camera-pet-com-dispensador-de-petisco | comedouro com câmera |
| 16 | Média | melhor-alimentador-automatico-gatos | camera-pet-com-dispensador-de-petisco | câmera pet que solta ração |
| 17 | Média | erros-comuns-camera-monitorar-pet | duvidas-camera-para-monitorar-pet | perguntas frequentes sobre câmera pet |
| 18 | Média | camera-pet-grava-sem-internet | duvidas-camera-para-monitorar-pet | outras dúvidas sobre câmera pet |
| 19 | Média | como-configurar-camera-pet-wifi | duvidas-camera-para-monitorar-pet | dúvidas frequentes de configuração |
| 20 | Média | camera-pet-grava-sem-internet | erros-comuns-camera-monitorar-pet | erros comuns com câmera pet |
| 21 | Média | camera-pet-resolucao-1080p-x-2k | erros-comuns-camera-monitorar-pet | erros na hora de posicionar a câmera |
| 22 | Média | erros-comuns-coleira-gps-pet | duvidas-coleira-gps-pet | perguntas frequentes sobre coleira GPS |
| 23 | Média | coleira-gps-para-gato | duvidas-coleira-gps-pet | dúvidas sobre coleira GPS |
| 24 | Média | como-funciona-coleira-gps-cachorro | duvidas-coleira-gps-pet | perguntas frequentes sobre coleira GPS |
| 25 | Média | comedouro-automatico-faz-mal | comedouro-automatico-anti-formiga | comedouro anti-formiga |
| 26 | Média | como-limpar-comedouro-automatico | comedouro-automatico-anti-formiga | como evitar formigas no comedouro |
| 27 | Média | melhor-racao-para-cachorro | melhor-antipulgas-para-cachorro | melhor antipulgas para cachorro |
| 28 | Média | cercado-para-cachorros | melhor-tapete-higienico-para-cachorro | melhor tapete higiênico para cachorro |
| 29 | Média | comedouro-cachorro | melhor-tapete-higienico-para-cachorro | comparativo de tapetes higiênicos |
| 30 | Média | comedouro-cachorro | melhor-comedouro-automatico-cachorro | melhor comedouro automático para cachorro |
| 31 | Média | como-escolher-brinquedo-interativo-gato-entediado | melhor-bolinha-inteligente-para-gato | bolinha inteligente para gato |
| 32 | Média | brinquedo-interativo-pilha-x-recarregavel | melhor-bolinha-inteligente-para-gato | bolinha inteligente recarregável |
| 33 | Baixa | brinquedo-interativo-sensor-infravermelho-como-funciona | melhor-bolinha-inteligente-para-gato | bolinha com sensor de movimento |
| 34 | Baixa | cercado-para-cachorros | brinquedo-automatico-cachorro-sozinho | brinquedo para o cão que fica sozinho |
| 35 | Baixa | comedouro-x-bebedouro-automatico | bebedouro-inox-x-ceramica | inox, cerâmica ou plástico |
| 36 | Baixa | melhor-racao-para-gato | bebedouro-inox-x-ceramica | material do bebedouro |
| 37 | Baixa | melhor-alimentador-automatico-gatos | melhor-bebedouro-automatico-pet | fonte de água para gatos |
| 38 | Baixa | erros-comuns-porta-eletronica-pet | duvidas-porta-eletronica-pet | perguntas frequentes sobre porta eletrônica |
| 39 | Baixa | como-instalar-porta-eletronica-pet | duvidas-porta-eletronica-pet | dúvidas antes de instalar |
| 40 | Baixa | porta-eletronica-funciona-porta-de-vidro | erros-comuns-porta-eletronica-pet | erros comuns na instalação |
| 41 | Baixa | porta-eletronica-x-alcapao-tradicional | erros-comuns-porta-eletronica-pet | erros comuns com porta eletrônica |
| 42 | Baixa | porta-eletronica-microchip-x-rfid-coleira | porta-eletronica-reconhecimento-facial-vale-a-pena | reconhecimento facial vale a pena? |
| 43 | Baixa | porta-eletronica-impede-entrada-outros-animais | porta-eletronica-reconhecimento-facial-vale-a-pena | porta com reconhecimento facial |
| 44 | Baixa | cercado-para-cachorros | cachorro-de-casa-pega-pulga | cachorro de casa pega pulga? |
| 45 | Baixa | tapete-higienico-para-cachorro | cachorro-de-casa-pega-pulga | cão que vive dentro de casa também pega pulga |
| 46 | Baixa | melhor-antipulgas-para-cachorro | soprador-pet | secar o pelo depois do banho |
| 47 | Baixa | coleira-seresto-antipulgas | soprador-pet | soprador pet (seção "Pode molhar?") |
| 48 | Baixa | cachorro-de-casa-pega-pulga | soprador-pet | soprador pet no pós-banho |
| 49 | Baixa | soprador-pet | melhor-antipulgas-para-cachorro | antipulgas depois do banho |

Os links 1-13 resolvem os dois posts de ração, o spoke de viagem (que tem a melhor posição do cluster) e o beco sem saída da ansiedade. Se o A1 for feito, nenhum link novo deve apontar para `melhor-camera-para-monitorar-pet`.

---

## Comparação com a auditoria anterior (11-04) e com reports/cannibalization.md (10-07)

| Item de 11-04 | Status 11-17 |
|---|---|
| A1 Câmera hub × money page | **Persiste, sem mudança** (title/H1 iguais, money page com 648 palavras). Subiu para "consolidar com 301" porque a SERP deu 9-10/10 |
| A2 17 spokes com in<3 | **Persiste**: 18 agora (saiu para-dois-gatos, entraram os 2 de ração). As sugestões de 11-04 não foram aplicadas |
| M1 Hubs rasos | **Parcial**: brinquedo (843→3617), comedouro (1663→4726), coleira (→3933) e bebedouro viraram rankings. Câmera (1038) e porta (967) continuam |
| M2 Hub comedouro × vale-a-pena | Persiste (vale-a-pena ainda com "Guia 2026"). **Risco novo:** o hub-ranking × melhor-...-cachorro/gatos (M1 atual) |
| M3 comedouro-cachorro sem link para a money page | Persiste (B1) |
| M4 Porta sem money page | Persiste (B4) |
| M5 Briefs .md publicados | **Resolvido** em 11-04 (pasta removida, 410 + deny no .htaccess) |
| B1 Coleira listas parecidas / que-foge | **Agravou**: com o hub retitulado para "Cachorro", a SERP deu 7-8. Passou a Médio (M2) |
| B2 Soprador quase órfão | Persiste, e tem URL dupla no GSC (B2) |
| B3 Tapete/bebedouro mini-clusters | Bebedouro com a canibalização identificada e o ranking no ar (M3). Tapete persiste |
| — | **Novo:** ração isolada (A2); ranking de câmera com petisco isolado (M4); ansiedade-separação com out=1 |

**Sobre `reports/cannibalization.md` (10-07, 71 páginas, similaridade textual):** está desatualizado (antes das reescritas de 11-14/15) e o método não pega os conflitos reais. Os três pares que o GSC e a SERP confirmam (câmera hub × money page com score 44, bebedouro inox × ranking com 56, hub comedouro × melhor-cachorro com 69) aparecem lá como 🔗 COMPLEMENTARY, ou seja, "não é conflito". Já os pares que ele mais destaca (newpet-2l × newpet-4l, porta-vidro × sensor-de-luz, comedouro-gato-x-cachorro × porta-gato-x-cachorro) são produtos ou temas distintos, e a SERP não mostra disputa entre eles. O único sinal útil é `pequeno-porte × que-foge × sem-mensalidade`, que bate com o M2. Recomendação: não usar esse relatório para decidir merge. Usar GSC (queries por URL) + SERP overlap.

## Ordem de execução
1. A2 e links 1-13 (cerca de 30 min, risco zero).
2. A1: consolidar a câmera (reescrever o hub como ranking + 301 da money page).
3. A3: links 14-49.
4. M1/M2: enxugar as seções "cães grandes" (hub comedouro) e "cães que fogem" (hub coleira); retitular que-foge.
5. M3: depois da medição do bebedouro, tirar a lista de produtos de inox-x-ceramica.
6. B2: GSC inspect da URL antiga do soprador.

## JSON (audit-data.json → Content Architecture)
```json
{"category":"Content Architecture","date":"2026-11-17","findings":[
{"id":"A1","severity":"high","title":"Câmera: hub e money page com a mesma intenção (SERP overlap 9-10/10)","urls":["/camera-para-monitorar-pet/","/melhor-camera-para-monitorar-pet/"],"fix":"Reescrever o hub como ranking de 6 e fazer 301 da money page para o hub; atualizar 5 links internos, home, sitemap e llms.txt","status_vs_prev":"persiste, escalado para merge"},
{"id":"A2","severity":"high","title":"Rankings de ração com in=1 cada (só um linka o outro)","urls":["/melhor-racao-para-cachorro/","/melhor-racao-para-gato/"],"fix":"7 links a partir do cluster comedouro","status_vs_prev":"novo"},
{"id":"A3","severity":"high","title":"18 páginas com <3 links de entrada; ansiedade-separacao com out=1","fix":"Cerca de 49 links contextuais (tabela)","status_vs_prev":"persiste (17→18)"},
{"id":"M1","severity":"medium","title":"Hub comedouro (ranking) com H2 'melhor para cães grandes' sobrepõe melhor-comedouro-automatico-cachorro (overlap 6-7)","fix":"Encurtar a seção do hub e linkar; diferenciar a money page pelo porte grande","status_vs_prev":"novo"},
{"id":"M2","severity":"medium","title":"Hub coleira 'para Cachorro' × coleira-gps-cachorro-que-foge (overlap 7-8)","fix":"Reposicionar que-foge para o ângulo de prevenção de fuga; enxugar a seção do hub; 301 se o GSC mostrar alternância","status_vs_prev":"agravou (baixo→médio)"},
{"id":"M3","severity":"medium","title":"bebedouro-inox-x-ceramica mantém seção 'Modelos à Venda' e capta queries de compra (overlap de keyword 1)","fix":"Trocar a lista de produtos por um bloco que leva ao ranking","status_vs_prev":"persiste parcialmente após reescrita do ranking"},
{"id":"M4","severity":"medium","title":"Ranking camera-pet-com-dispensador-de-petisco com in=2, sem links do cluster comedouro","fix":"4 links (vdrbg, com-ou-sem-wifi, alimentador-gatos, ansiedade)","status_vs_prev":"novo"},
{"id":"B1","severity":"low","title":"comedouro-cachorro sem link para melhor-comedouro-automatico-cachorro","fix":"3 links de saída","status_vs_prev":"persiste"},
{"id":"B2","severity":"low","title":"soprador-pet in=1/out=1; URL antiga ainda com impressões no GSC apesar do 301","fix":"GSC inspect + 4 links","status_vs_prev":"persiste"},
{"id":"B3","severity":"low","title":"Pilares de tapete e antipulgas com in=2","fix":"Links de cercado, comedouro-cachorro, ração","status_vs_prev":"persiste"},
{"id":"B4","severity":"low","title":"Porta eletrônica: spokes ~650 palavras, sem página comercial","fix":"Planejar roundup","status_vs_prev":"persiste"}],
"serp_overlap":[
{"pair":["melhor câmera para monitorar pet","câmera para monitorar pet"],"shared":9},
{"pair":["coleira gps para cachorro","coleira gps para cachorro que foge"],"shared":7},
{"pair":["melhor comedouro automático para cachorro","comedouro automático para pet melhores"],"shared":6},
{"pair":["bebedouro inox ou cerâmica para gato","melhor bebedouro automático para gato fonte"],"shared":1}]}
```
