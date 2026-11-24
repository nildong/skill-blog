# Clusters semânticos, canibalização e links internos — smartpetgadgets.com.br

Data: 2026-11-04. Escopo: 72 posts (78 URLs no sitemap). Fonte: grafo de links extraído dos
`index.html` locais (corpo da página, excluindo nav/header/footer), títulos/H1/H2/meta, e
checagem de SERP (WebSearch, proxy aproximado do top 10 do Google BR).
Comparação com a auditoria anterior (mesmo arquivo, versão prévia) ao final.

## Mapa de clusters (estado atual)

| Cluster | Posts | Hub (pilar) | Hub→spoke / spoke→hub | Arestas internas | Palavras do hub | Veredito |
|---|---|---|---|---|---|---|
| Comedouro | 20 | comedouro-automatico-para-pet | 19/19 / 19/19 | 110 | 1663 | Completo; saturado |
| Coleira GPS | 12 (incl. cerca-virtual) | coleira-gps-para-pet | 11/11 / 11/11 | 76 | 1673 | Modelo de referência |
| Porta eletrônica | 11 | porta-eletronica-automatica-para-pet | 10/10 / 10/10 | 45 | 908 | Sem página comercial; spokes rasos |
| Câmera | 10 | camera-para-monitorar-pet | 9/9 / 9/9 | 35 | 991 | **Canibalização hub × money page** |
| Brinquedo | 10 | brinquedo-interativo-automatico-para-gato | 9/9 / 9/9 | 41 | 843 | Sem roundup "melhor"; spokes rasos |
| Bebedouro | 3 | melhor-bebedouro-automatico-pet | 2/2 / 2/2 | 5 | 1770 | Fino, ok |
| Antipulgas | 3 | melhor-antipulgas-para-cachorro | 2/2 / 2/2 | 6 | 2413 | Estrutura ok, pilar com in=2 |
| Tapete higiênico | 2 | melhor-tapete-higienico-para-cachorro | 1/1 / 1/1 | 2 | 3304 | Par isolado |
| Avulsos | soprador-pet, cercado-para-cachorros, comedouro-cachorro | — | — | — | — | soprador quase órfão |

Cobertura hub↔spoke bidirecional está **100% em todos os clusters** (resolvido desde a auditoria anterior).
O problema agora não é estrutura, é **intenção (canibalização), profundidade e incoming links de spokes**.

## Matriz de sobreposição de SERP (pares de canibalização pedidos)

| Par de keywords | URLs compartilhadas (proxy) | Leitura |
|---|---|---|
| "melhor câmera para monitorar pet" × "câmera para monitorar pet" | 2 (proxy ruidoso; SERP da head mistura resultados internacionais) | A SERP BR de ambas é dominada por listas "melhor câmera..." (guiaomelhor, mundodosreviews). Ou seja, **a intenção dominante das duas é comercial/lista** e o site tem 2 páginas mirando o mesmo termo literal no title/H1. |
| "comedouro automático para pet" × "melhor comedouro automático para cachorro" | 1 | Separadas. A head é SERP transacional (Petlove, Cobasi, Petz, Casas Bahia); a "melhor ... cachorro" é SERP de listas de afiliado. Sem canibalização. |
| "melhor comedouro automático para cachorro" × "comedouro cachorro" | 5 (ML blog, Buscapé, Zoom, my-best ×2) | Mesmo cluster, posts distintos. Mas `/comedouro-cachorro/` é review de comedouro **não automático** (suporte baia): o slug ocupa a head "comedouro cachorro" com conteúdo de produto específico. Isso é desalinhamento de intenção, não canibalização com as páginas de automático. |

---

## CRÍTICO

Nenhum.

## ALTO

### A1. Câmera: hub e roundup brigam por "melhor câmera para monitorar pet"
Evidência:
- `/camera-para-monitorar-pet/` (hub, ao vivo): title "**Melhor Câmera para Monitorar Pet**: Como Escolher", H1 "Melhor Câmera para Monitorar Pet: Como Escolher o Modelo Ideal", meta "Veja a melhor câmera...", H2 "Modelos Populares no Mercado Brasileiro".
- `/melhor-camera-para-monitorar-pet/` (money page): slug exato da keyword, mas title "Melhores Câmeras Pet 2026: TP-Link, Newpet, Intelbras". Tem **556 palavras** (menor página do site) e só 2 links de saída.
- O Google tende a escolher o hub (991 palavras, in=10) para a query comercial, e a página de afiliado fica sem rankear.
Correção:
1. Retitular o hub para a intenção informacional e tirar "Melhor" do title/H1/meta. Exemplo: "Câmera para Monitorar Pet: Guia Completo (Recursos, Preço, Como Escolher)".
2. Reduzir o H2 "Modelos Populares" do hub para 2-3 linhas e um link com âncora "melhores câmeras para monitorar pet".
3. Na money page, colocar "Melhor Câmera para Monitorar Pet 2026" no title/H1 e aprofundar o conteúdo para 1200+ palavras (critérios, tabela, para quem é cada modelo).
4. Adicionar links de `camera-pet-visao-noturna-funciona`, `camera-pet-resolucao-1080p-x-2k`, `camera-pet-grava-sem-internet` e `camera-pet-cachorro-ansiedade-separacao` para a money page (hoje in=5, nenhum vem dos spokes de specs).
5. Não fazer merge nem 301: as duas páginas têm intenções distintas quando os títulos são corrigidos.

### A2. 17 spokes com menos de 3 links de entrada (checklist: mínimo 3)
in=1: `duvidas-camera-para-monitorar-pet`, `duvidas-coleira-gps-pet`, `soprador-pet`.
in=2: `comedouro-automatico-anti-formiga`, `comedouro-automatico-para-dois-gatos`, `comedouro-automatico-para-viagem`,
`camera-pet-com-dispensador-de-petisco`, `erros-comuns-camera-monitorar-pet`, `duvidas-porta-eletronica-pet`,
`erros-comuns-porta-eletronica-pet`, `porta-eletronica-reconhecimento-facial-vale-a-pena`,
`brinquedo-automatico-cachorro-sozinho`, `melhor-bolinha-inteligente-para-gato`, `bebedouro-inox-x-ceramica`,
`cachorro-de-casa-pega-pulga`, `melhor-antipulgas-para-cachorro` (pilar!), `melhor-tapete-higienico-para-cachorro` (pilar!).
Correção: para cada uma, adicionar 1-2 links contextuais vindos de spokes irmãos. Sugestões concretas:
- Comedouro: `comedouro-automatico-faz-mal` → anti-formiga; `comedouro-gato-x-cachorro-diferenca` e `melhor-alimentador-automatico-gatos` → para-dois-gatos; `comedouro-com-ou-sem-wifi` e `comedouro-vdrbg-4l-wifi-review` → para-viagem.
- FAQs (`duvidas-*`): linkar a partir dos posts `erros-comuns-*` e de 1-2 spokes do mesmo cluster.
- Antipulgas: `coleira-gps-para-pet` e `coleira-gps-cachorro-que-foge` → `melhor-antipulgas-para-cachorro` (ponte "coleira").
- Tapete: `cercado-para-cachorros`, `comedouro-cachorro` → `melhor-tapete-higienico-para-cachorro` (hoje eles só apontam para o review).
- Brinquedo: `como-escolher-brinquedo-interativo-gato-entediado`, `brinquedo-interativo-gato-idoso-vale-a-pena` → bolinha; `camera-pet-cachorro-ansiedade-separacao` → `brinquedo-automatico-cachorro-sozinho` (mesmo tema: cão sozinho).

## MÉDIO

### M1. Pilares de porta, brinquedo e câmera abaixo do porte de pilar; spokes rasos
Evidência: hubs com 843 (brinquedo), 908 (porta) e 991 (câmera) palavras, contra a meta de 2500-4000 para pilar. 30 páginas têm menos de 800 palavras, quase todas nos clusters porta/câmera/brinquedo (~585-730), contra a meta de 1200-1800 para spoke.
Correção: aprofundar os 3 hubs, começando pelo da câmera junto com A1. Nos spokes, priorizar os que o GSC mostrar com impressões. Não reescrever em massa.

### M2. Hub do comedouro repete o tema do spoke "vale a pena"
Evidência: o hub tem o H2 "Vale a Pena Comprar um Comedouro Automático?", que é o mesmo tema do title de `/comedouro-automatico-vale-a-pena/`. As duas páginas usam "Guia 2026" no title e são as mais linkadas do cluster (in=20 e in=16).
Correção: deixar a seção do hub com 2-3 parágrafos e um link explícito com âncora "vale a pena comprar comedouro automático". Tirar "Guia 2026" do title do vale-a-pena (sugestão: "...? Prós, Contras e Para Quem Não Serve"). Fazer o mesmo no H2 "Comedouro Automático Substitui o Bebedouro?" do hub, que deve linkar para `comedouro-x-bebedouro-automatico`.

### M3. `/comedouro-cachorro/`: slug de head term com review de produto não automático
Evidência: o slug pega a head "comedouro cachorro" (SERP de categoria de loja e guias "como escolher"), mas o conteúdo é um review de kit baia. O post fica fora do cluster de automáticos e tem só 2 links de saída (hub e tapete), sem link para `melhor-comedouro-automatico-cachorro`.
Correção: **não mudar o slug** (exigiria redirect, o ganho é incerto e o risco existe). Deixar o title/H1 específico como está e adicionar links de saída para `melhor-comedouro-automatico-cachorro` e `comedouro-gato-x-cachorro-diferenca`. Isso não é canibalização com `comedouro-automatico-para-pet` nem com `melhor-comedouro-automatico-cachorro` (SERP mostra intenções diferentes).

### M4. Porta eletrônica: 11 posts, nenhuma página comercial
Evidência: os 11 posts são informacionais e nenhum é roundup ou review. É o maior cluster sem money page, e o tráfego que ele gerar não tem para onde converter.
Correção (lacuna, sem criar agora): planejar "melhor porta eletrônica para gato/pet". Até lá, linkar produtos do hub com CTA claro.

### M5. Brief/rascunho interno publicado em produção
Evidência: `https://smartpetgadgets.com.br/cluster-comedouro-automatico-pet/about.md` retorna 200 (text/plain, sem X-Robots-Tag e sem Disallow no robots.txt). A pasta tem os briefs a1-c3 do cluster comedouro.
Correção: tirar a pasta do deploy ou bloquear `*.md` via .htaccess (410 ou deny). Se o Google já tiver rastreado, pedir remoção no GSC.

## BAIXO

### B1. Mesmo formato no cluster coleira (sobreposição moderada, sem merge)
Os pares `coleira-gps-cachorro-pequeno-porte` × `-que-foge` × `melhor-coleira-gps-sem-mensalidade` × `coleira-gps-para-gato` são todos listas "melhor coleira GPS + modificador". Os modificadores (porte, fuga, sem mensalidade, gato) estão distintos nos titles. `cerca-virtual-para-cachorro` (novo, 2075 palavras) se sobrepõe parcialmente a `-que-foge`, que tem o H2 "Cerca Virtual Não É Opcional".
Correção: em `-que-foge`, reduzir a seção de cerca virtual e linkar para o post dedicado com âncora "como configurar cerca virtual". Manter os modificadores no H1.

### B2. `soprador-pet` quase órfão (in=1, out=1)
Persiste desde a auditoria anterior. Correção: 2-3 links vindos de `tapete-higienico-para-cachorro`, `cercado-para-cachorros` e `melhor-antipulgas-para-cachorro` (banho/pós-banho).

### B3. Tapete higiênico e bebedouro são clusters de 2-3 posts
O hub-spoke está correto, mas abaixo do mínimo de 2 spokes por cluster no caso do tapete. Correção: tratar os dois como "mini-clusters ponte". Tapete ↔ cercado/comedouro-cachorro (rotina do cão em casa). Bebedouro ↔ comedouro (a ponte `comedouro-x-bebedouro-automatico` já existe).

---

## Lacunas de conteúdo (apenas registro, nenhum artigo criado)

| Cluster | Lacuna | Intenção | Prioridade |
|---|---|---|---|
| Porta eletrônica | melhor porta eletrônica para gato/pet (roundup) | Comercial | Alta |
| Brinquedo | melhor brinquedo interativo para gato (roundup genérico; hoje só existem "entediado" e "bolinha") | Comercial | Alta |
| Brinquedo | brinquedo interativo para cachorro (só há 1 post canino) | Comercial | Média |
| Antipulgas | antipulgas para gato; carrapato em cachorro | Comercial / Info | Média |
| Bebedouro | como limpar fonte/bebedouro, troca de filtro | Info | Baixa |
| Câmera | review individual (ex.: Tapo C200) para a money page linkar | Comercial | Baixa |
| Comedouro | nenhuma: com 20 posts o cluster está saturado, novos posts aumentam o risco de canibalização | — | — |

---

## Comparação com a auditoria anterior

| Item anterior | Status hoje |
|---|---|
| H1 `cercado-para-cachorros` órfão (in=0) | **Resolvido**: in=4 (cerca-virtual, que-foge, tapete, brinquedo-cachorro-sozinho) |
| H2 câmera com mesh fraco; hub sem link para visão-noturna; money page in=2 | **Parcial**: hub 9/9, arestas 26→35, money page in=5. **Problema novo identificado:** canibalização de title/H1 (A1) e money page rasa |
| M1 comedouro com 4 lacunas no hub; comedouro-cachorro sem link de volta | **Resolvido**: 19/19 bidirecional (+3 posts novos: alimentador-gatos, comedouro-interativo-gato, e o hub linka para o bebedouro) |
| M2 antipulgas sem hub | **Resolvido estruturalmente** (pilar ↔ 2 spokes), mas o pilar tem in=2 (A2) |
| M3 tapete "melhor" com out=0 | **Resolvido**: out=2, bidirecional com o review; in continua 2 |
| M4 formatos parecidos no cluster coleira | **Persiste (Baixo)**, agravado levemente pelo novo cerca-virtual (B1) |
| L1 soprador isolado | **Persiste** (B2) |
| L2 bebedouro fino | **Melhorou**: 3 posts (bebedouro-inox-x-ceramica) |
| — | **Novo:** M5 briefs .md publicados; M4 porta sem página comercial; M1 pilares rasos |

## Ordem de execução recomendada
1. A1: retitular o hub da câmera e fortalecer a money page (maior ganho, baixo esforço).
2. M5: tirar `cluster-comedouro-automatico-pet/` do ar.
3. A2: adicionar cerca de 25 links contextuais para os 17 spokes com in<3 (prioridade para os pilares de antipulgas e tapete).
4. M2 e M3: ajustes de title e links no cluster comedouro.
5. M1 e M4: aprofundar hubs e planejar as páginas comerciais de porta e brinquedo (fase de conteúdo).

## JSON (audit-data.json → Content Architecture)
```json
{"category":"Content Architecture","findings":[
{"id":"A1","severity":"high","title":"Canibalização câmera: hub e roundup ambos com 'Melhor Câmera para Monitorar Pet'","urls":["/camera-para-monitorar-pet/","/melhor-camera-para-monitorar-pet/"],"fix":"Retitular hub como guia informacional; title/H1 'Melhor...' só na money page; expandir money page (556→1200+ palavras); +4 links de spokes"},
{"id":"A2","severity":"high","title":"17 spokes/pilares com <3 links de entrada","fix":"Adicionar ~25 links contextuais entre spokes irmãos"},
{"id":"M1","severity":"medium","title":"Hubs porta/brinquedo/câmera com <1000 palavras; 30 páginas <800 palavras","fix":"Aprofundar hubs; priorizar spokes por impressões no GSC"},
{"id":"M2","severity":"medium","title":"Hub comedouro duplica tema de comedouro-automatico-vale-a-pena","fix":"Encurtar seção do hub + link; diferenciar title"},
{"id":"M3","severity":"medium","title":"/comedouro-cachorro/ ocupa head term com review não automático; sem link para money page","fix":"Manter slug; adicionar links para melhor-comedouro-automatico-cachorro"},
{"id":"M4","severity":"medium","title":"Cluster porta eletrônica (11 posts) sem página comercial","fix":"Planejar roundup 'melhor porta eletrônica para gato'"},
{"id":"M5","severity":"medium","title":"Briefs .md publicados (cluster-comedouro-automatico-pet/*.md retorna 200)","fix":"Excluir do deploy ou bloquear *.md via .htaccess"},
{"id":"B1","severity":"low","title":"Sobreposição moderada entre listas de coleira GPS + cerca-virtual × que-foge","fix":"Diferenciar H1; reduzir seção cerca virtual em que-foge e linkar"},
{"id":"B2","severity":"low","title":"soprador-pet quase órfão (in=1)","fix":"+3 links contextuais"},
{"id":"B3","severity":"low","title":"Tapete e bebedouro mini-clusters","fix":"Tratar como clusters ponte"}]}
```
