# SXO (Search Experience Optimization) — smartpetgadgets.com.br

Data: 2026-11-06 (passada anterior: 2026-11-04)
Escopo: 7 páginas de dinheiro + a gêmea canibal `camera-para-monitorar-pet` + verificação de `bebedouro-inox-x-ceramica` (onde de fato estão os 4 produtos de 10-25).
Método: render live (`render_page.py --mode always`, 8 URLs, todas 200; `--mode never` para inox-x-ceramica) + `parse_html.py`; diff git dos commits de 11-05 (a7379a2 CTA no topo, 71f1c59 títulos/metas, 1efc1aa abertura GEO); SERP pt-BR via WebSearch (9 queries, incluindo o head term "comedouro automático para cachorro"); taxonomia SXO de tipo de página; personas e user stories derivadas apenas de sinais observados no SERP.

Este é o **SXO Gap Score**, separado do SEO Health Score.

**SXO Gap Score: 66 / 100 (anterior 65, DELTA +1)**

---

## O que mudou desde 2026-11-04

- **CTA no topo + barra fixa mobile (a7379a2, 11-05) em 68 posts.** Existem dois padrões, e eles têm efeitos opostos no match de intenção:
  - **Comparativos** (comedouro, tapete, antipulgas, inox-x-ceramica): o CTA é "Ver os produtos recomendados ↓" e é uma âncora para `#comparativo-rapido` / `#comparativo` / `#modelos`. Isso **reforça** a intenção Top-N do SERP: o comprador que veio comparar vai direto à tabela. A barra mobile some quando a seção de produtos aparece. Efeito: positivo.
  - **Páginas sem lista** (sem-mensalidade, melhor-camera, camera-para-monitorar, bebedouro-automatico, gps-gato): o CTA é o genérico "Quer ver o preço agora? Ver preço no Mercado Livre →" e aponta para **um único** link meli.la. Esse link é o mesmo do CTA final, e o botão não diz qual produto abre. A barra mobile repete o mesmo link até o rodapé. Efeito: **neutro a negativo**, detalhado no Finding 2.
- **Abertura GEO com resposta direta (1efc1aa, 11-05)** em sem-mensalidade, melhor-camera, camera-para-monitorar e bebedouro-automatico. O primeiro parágrafo agora traz veredito e produto nomeado, por exemplo "Tapo C200" e "Tobo Fonte Raia Pet", e isso melhora um pouco a Clareza. Porém o **corpo, os produtos, as imagens e o schema não mudaram**:
  - sem-mensalidade: 984 palavras, 0 produtos, 1 imagem;
  - melhor-camera: 674 palavras, 4 modelos, 1 imagem;
  - bebedouro: 2 produtos, 1 imagem, 0 preços em R$.

  Mesmo assim, "Atualizado em" e `dateModified` foram para 11-05. É frescor de superfície (ver Limitações).
- **Correção de premissa sobre o bebedouro:** os "4 produtos desde 10-25" estão em **`bebedouro-inox-x-ceramica`**, confirmado live: seção `#modelos` com 5 cards, 7 links meli.la e 3 imagens marcadas como "ilustrativa", com as fotos AGBE/Patas Fiéis ainda pendentes. **`melhor-bebedouro-automatico-pet` continua com 2 produtos** (Tobo, Amicus). O HIGH se mantém.
- **Comedouro 9,8 → 22,8:** a reescrita de produtos de 10-22 (987323d) é o evento que coincide com a queda. Essa reescrita trocou VeryPet com câmera, Madog sem câmera e PlayPet por Jwcom JW4L-W, Hi by Geonav e Luatek. O SERP também mudou. A análise completa está no Finding 4.
- **Mudanças no SERP:**
  - **Comedouro (head term):** "comedouro automático para cachorro" virou praticamente **categoria/PLP**: Petlove `acessorios-para-alimentacao` em ~18 paginações, Cobasi `/automaticos` e o ML blog. No termo "melhor", aparecem listicles mais amplos ("Elevado, Interativo e Mais" do cupomonline, my-best de comedouros em geral).
  - **Câmera:** o SERP de "melhor câmera" consolidou a Tapo C200 como "melhor para a maioria". Isso bate com a nossa nova abertura, mas o SERP também empurra C500, iM4 C, eufy C220, Furbo 360 e C100, que continuam ausentes da página.
  - **Bebedouro:** o SERP de "fonte para gato" agora é dominado por buscamelhores (x7) + guias do Buscapé/Zoom ("Bebedouro ou fonte para gatos: qual é o modelo ideal?") + ofertas Shopee. Os critérios recorrentes continuam GONDMAX 3L, Newpet inox com sensor (R$ 309,90), sem fio e troca de filtro.

---

## Página x SERP

| Página | SERP dominante (aprox.) | Tipo atual | CTA no topo | Veredito | Delta |
|---|---|---|---|---|---|
| melhor-comedouro-automatico-cachorro | "melhor": Top-N ~60% (my-best x4, cupomonline x2, mundodosreviews, guiaomelhor, qualmelhorcomprar, buscamelhores) + ML blog x2 + categoria Cobasi x4. **Head term: categoria/PLP ~85%** (Petlove, Cobasi) + ML blog | Comparativo 7 produtos (3 com câmera), ItemList + 7 Product, 8 imgs, 2.129 palavras | Âncora `#comparativo-rapido`: **alinhado** | **ALIGNED no "melhor" / MEDIUM no head term** | Rebaixado no head term (novo) |
| melhor-tapete-higienico-para-cachorro | Guias ~50% (Buscapé/Zoom x3, Petz blog x4) + Top-N my-best x3 + categoria Cobasi + PDP Buscapé | Comparativo 7 + seções de guia, ItemList, 9 imgs, 3.345 palavras | Âncora: alinhado | **ALIGNED** | = |
| melhor-bebedouro-automatico-pet | Top-N ~70% (buscamelhores x7, qualmelhorcomprar x2, guiaomelhor, melhoresparacomprar "10 modelos silenciosos", my-best) + guias Buscapé/Zoom + ofertas Shopee/Zoom | "Como Escolher", **2 produtos**, 1 img, 0 R$, sem ItemList. Abertura agora indica o Tobo | Link único genérico: **parcial** | **HIGH** | = (premissa dos "4 produtos" corrigida: estão em inox-x-ceramica) |
| melhor-coleira-gps-sem-mensalidade | Top-N ~75% (cupomonline x2, guiaomelhor x3, qualmelhorcomprar x2, buscamelhores x2, my-best, mundodosreviews, petscare) + PDPs (Leroy x2, Fruugo) | Ensaio, **0 produtos**, 984 palavras, 1 img. Abertura "Sim, existe..." | "Ver preço" de um produto **não nomeado** numa página sem produtos: **conflitante** | **CRITICAL** | = (CTA agrava a dissonância) |
| coleira-gps-para-gato | Top-N ~45% (buscamelhores, qualmelhorcomprar, guiaomelhor x2) + guias (Buscapé/Zoom x2, Petz, ML blog, Olhar Digital) + PDP/busca (Leroy x2, Tractive x2, Buscapé/Zoom busca) | Guia + **1 pick** (ANXK G68 4G), sem ItemList | Link do pick nomeado na abertura: **coerente**, mas o botão não diz o nome | **HIGH** | = |
| melhor-camera-para-monitorar-pet (+ camera-para-monitorar-pet) | Top-N ~90% (buscamelhores x3, guiaomelhor x3, qualmelhorcomprar x2, mundodosreviews x2, melhoresparacomprar "10 modelos", seuguiadetecnologia, my-best). No termo sem "melhor", sobra pouco resultado BR relevante (SERP mistura lojas estrangeiras) | Stub de 674 palavras com 4 modelos, 0 menção a nuvem/microSD. A gêmea (1.058 palavras, title também "Melhor Câmera...") segue com 4 links na home vs 3 | Link único sob uma abertura com **4 modelos**: ambíguo | **CRITICAL + canibalização** | = |
| melhor-antipulgas-para-cachorro | Top-N ~55% (my-best x3, mundodosreviews x2, buscamelhores x2, guiaomelhor, amoprodutinhos x2, selektz, melhoresparacomprar) + guias de varejo veterinários ~25% (Petlove x3, Petz) + cupomonline | Comparativo 6, tabela, 7 imgs, 12 links afiliados, sem ItemList/Product, sem revisor veterinário | Âncora `#comparativo`: alinhado | **MEDIUM (trust/YMYL)** | = |

---

## Findings (severidade + correção)

### 1. CRITICAL: sem-mensalidade continua com 0 produtos num SERP de listicles; o CTA novo piorou a dissonância
O SERP segue segmentado por tecnologia:
- chip pré-pago (TKStar TK909 "basta colocar crédito", Dog Tracker universal);
- pagamento único (GUPTOMES, Petfon, Findster Duo+);
- AirTag/Find My ("não funciona sem uma rede densa de iPhones").

O SERP também segue divergente sobre o Tractive. A nova abertura responde "sim, existe" e explica Bluetooth/NB-IoT, mas logo abaixo vem "**Quer ver o preço agora?**". Não fica claro preço de quê, porque a página não nomeia nenhum produto. O botão leva a um único anúncio meli.la que o leitor não consegue identificar antes do clique, e no mobile a barra fixa repete esse link até o rodapé. Para uma persona avessa a cobrança escondida, um botão de produto anônimo numa página que alerta sobre "taxa de ativação escondida" é sinal de baixa confiança.
**Correção:**
- **Imediata (5 min):** trocar o texto do CTA para o nome do produto + "sem mensalidade da marca; usa chip pré-pago" (ou o que for verdade para esse anúncio). Se o anúncio não for comprovadamente sem mensalidade, remover o CTA do topo dessa página.
- **Estrutural (sem mudança desde 10-29):**
  - refazer no template do tapete/comedouro, com 5-7 produtos em 3 segmentos (chip pré-pago / pagamento único / Find My);
  - usar as colunas "Mensalidade da marca?", "Custo do chip/mês", "Tecnologia", "Alcance", "Bateria" e "Peso";
  - incluir a caixa "Tractive cobra mensalidade? Sim";
  - adicionar ItemList + Product;
  - depois trocar o CTA do topo para a âncora "Ver os produtos recomendados ↓".

### 2. HIGH (novo): o CTA genérico no topo cria ambiguidade de intenção nas páginas que não são lista
Em 4 páginas (sem-mensalidade, melhor-camera, camera-para-monitorar, bebedouro-automatico), o CTA do topo reaproveita o único link de afiliado que existia e não nomeia o produto. Em cada página o problema aparece assim:
- **melhor-camera:** a abertura recomenda 4 modelos (Tapo C200, Newpet 2K, iM3 C, Haiz Mini Botz) e o botão abre um só, sem dizer qual. O leitor de intenção "comparar" (SERP Top-N 90%) não sabe se está indo para a C200.
- **bebedouro:** a abertura indica Tobo para a maioria e Amicus para multi-pet, e o botão abre um único anúncio não nomeado.
- **gps-gato:** a abertura nomeia o ANXK G68 com âncora interna, e o botão leva ao mesmo produto. É o caso mais coerente, mas o rótulo continua genérico.

Esse padrão não muda o **tipo** de página (o veredito do SERP continua igual), mas reduz Clareza e Confiança justamente nas páginas já desalinhadas. Nos comparativos, o mesmo commit fez a coisa certa (âncora para a tabela). Além disso, o evento GA4 `affiliate_click` com `cta_position` agora permite medir isso.
**Correção:**
- Rótulo com nome + atributo-chave: "Ver preço da Tapo C200 (Full HD, 360°) →", "Ver preço da Tobo Fonte Raia 2,5 L →", "Ver preço do ANXK G68 4G (27 g) →". Vale também para o texto da barra fixa, que hoje herda só o href e usa texto fixo em `affiliate-cta.js`. Dá para passar um `data-label` no `.cta-top`.
- Onde houver 2+ produtos nomeados na abertura (camera, bebedouro), usar dois botões curtos ou a âncora "Ver os N modelos ↓" até a página virar lista.
- Medir em 2-3 semanas a razão top/final de `affiliate_click` por página antes e depois do rótulo.

### 3. CRITICAL: par de câmeras canibalizado, stub de 4 modelos (sem mudança estrutural)
A abertura nova ("Tapo C200 para a maioria") bate com o consenso do SERP, que é o ganho desta passada. Mesmo assim:
- os modelos recorrentes do SERP continuam ausentes: Tapo C500 ("evolução natural da C200"), Intelbras iM4 C (auto-tracking), eufy C220, Furbo 360° e Tapo C100 (fixa, para tigela/cama);
- `melhor-camera` tem 0 menções a "nuvem" e "microSD";
- o title da gêmea ("Melhor Câmera para Monitorar Pet: Como Escolher") disputa a mesma query;
- a gêmea continua mais linkada na home (4 vs 3).

Pelo GSC: camera-para-monitorar-pet tem 134 impressões, posição 19,5; melhor-camera tem 94 impressões, posição 17,2.
**Correção (igual à de 11-04):**
- 1 listicle de 6-8 modelos numa URL. Pelo GSC, a candidata a ficar é `camera-para-monitorar-pet`, que tem mais impressões. Fazer 301 da outra e registrar no memo de slugs.
- Usar as colunas resolução, visão noturna, áudio bidirecional, 360°/fixa, microSD vs nuvem (+R$/mês), petisco e preço.
- Tirar a URL que vai sair do destaque da home.
- Trocar o CTA do topo pela âncora da tabela.

### 4. HIGH (reclassificado): comedouro caiu de 9,8 para 22,8, com intenção dividida no SERP + reescrita de 10-22 enviesada para câmera
O formato continua ALIGNED para "melhor comedouro automático para cachorro" (Top-N). Três sinais explicam a perda:
1. **O head term mudou de natureza.** "comedouro automático para cachorro" hoje mostra quase só PLP/categoria (Petlove ~18 paginações, Cobasi) e o ML blog. Um comparativo editorial perde espaço nessa query. Isso é mudança de SERP, não defeito da página.
2. **A reescrita de 10-22 deixou a página enviesada.** Ela tirou VeryPet, Madog sem câmera e PlayPet, e hoje 3 de 7 produtos têm câmera (60+ menções a "câmera"). Enquanto isso, os critérios que o SERP usa não aparecem: **inox** tem 0 menções, **bateria/pilha** 2, **elevado** 0, e **PetLibro** (citado como premium para cão grande/idoso) também 0. My-best recomenda inox por higiene, bateria recarregável e 2-10 L conforme o porte.
3. O title "Guia 2026" continua desalinhado com os listicles ("7 Modelos Comparados").

**Correção:**
- Retitular para "Melhor Comedouro Automático para Cachorro 2026: 7 Modelos Comparados".
- Adicionar as colunas "Inox?", "Bateria reserva?" e "Capacidade (L) x porte".
- Repor 1 modelo sem câmera/sem Wi-Fi de entrada (o perfil do Madog/PlayPet removido) e avaliar a inclusão de um PetLibro, se houver no ML.
- Puxar a lista de queries do GSC da página (antes e depois de 10-22) para separar o efeito do head term do efeito da reescrita. Não reverter às cegas.
- A página de categoria do head term não é disputável com um post. Usar link interno com âncora "melhor comedouro automático para cachorro", não "comedouro automático".

### 5. HIGH: bebedouro automático é "Como Escolher" com 2 produtos num SERP de "fonte para gato / 10 modelos" (sem mudança)
A abertura agora nomeia Tobo/Amicus, mas o resto não mudou:
- title e H1 ainda dizem "Como Escolher", sem "fonte" nem "gato";
- não há preços em R$, a página tem 1 imagem e nenhum dos modelos do SERP (GONDMAX 3L, Newpet inox com sensor, sem fio).

Os 5 cards prontos estão em `bebedouro-inox-x-ceramica` e não são reaproveitados aqui. Pelo GSC, a página subiu de 17,3 para 10,3 com 96 impressões, então está perto do top 10 e é a de melhor retorno por esforço.
**Correção:**
- Retitular para "Melhor Fonte/Bebedouro Automático para Gato e Cachorro 2026: N Modelos Comparados".
- Montar 5-7 produtos (Tobo, Amicus, Newpet NP895 inox, AGBE AG-200, Fonte Premium 1,5 L e outros) com tabela L / dB / sensor / fio-bateria / filtro / custo do refil.
- Adicionar ItemList + Product.
- Trocar o CTA pela âncora `#modelos`.
- Linkar a página nos dois sentidos com inox-x-ceramica.
- Fotos reais: as de AGBE/Patas Fiéis seguem pendentes no memo.

### 6. HIGH: GPS gato tem 1 pick que exige SIM (sem mudança)
O SERP reforçou três sinais:
- "assinatura a partir de US$ 5/mês" (Tractive, com duas PDPs no SERP);
- "sem assinatura, sem SIM" (Leroy);
- "AirTag fraco em área rural".

O CTA do topo leva ao único pick, o que é coerente, mas esse pick ainda é um só.
**Correção (igual à anterior):**
- 3-4 picks por tecnologia: 4G SIM / tag Find My + coleira breakaway / Tractive com plano.
- Uma tabela no topo com g, chip, iOS/Android e mensalidade.
- Adicionar ItemList.

### 7. MEDIUM: antipulgas tem o formato certo e trust fraco para YMYL (sem mudança)
O CTA com âncora para `#comparativo` está alinhado. O SERP mantém Petlove/Petz com a mensagem "caso a caso, consulte o veterinário" e com versões para filhote: spray, NexGard Spectra para 2-3,5 kg e guias dedicados ("melhor antipulgas para filhote" do guiaomelhor/buscamelhores).
**Correção (igual à anterior):**
- Revisor com CRMV + Person schema (`/seo content`).
- Linha "versão com vermífugo" na tabela.
- Linha "gestante/lactante/filhote (idade mínima)".
- ItemList + Product sem Review próprio (`/seo schema`).

### 8. LOW: tapete (sem mudança)
O SERP de guias reforçou os temas "com adesivo para machos", "lavável de algodão" e "100x90 cm para porte grande".
**Correção:** adicionar uma seção "Descartável x lavável" e outra "Com adesivo / machos".

---

## User stories (derivadas do SERP)

1. **Decisão, sem mensalidade.** Como comprador avesso a assinatura, quero ver rastreadores separados por chip pré-pago / pagamento único / Find My, com o custo mensal real, e saber exatamente que produto um botão "ver preço" abre. Hoje encontro uma página sem produtos com um botão anônimo. *Sinal: TK909 "basta colocar crédito", GUPTOMES "pagamento único", "AirTag não funcionará sem rede densa de iPhones", divergência sobre o Tractive.*
2. **Consideração, câmera.** Como tutor que trabalha fora, quero 6+ câmeras comparadas (C200 vs C500, fixa C100 para a tigela, iM4 C com auto-tracking) e o custo de nuvem. Hoje encontro 4 modelos e um botão que não diz qual deles abre. *Sinal: SERP 90% Top-N, "C500 evolução natural da C200", "C100 para locais específicos", "armazenamento SD ou nuvem".*
3. **Consideração, fonte para gato.** Como dono de um gato que bebe pouca água, quero uma fonte silenciosa com filtro, inox ou plástico BPA-free, e saber se a versão sem fio vale a pena. Hoje encontro 2 produtos sem preço. *Sinal: "10 modelos silenciosos", GONDMAX 3L "BPA-free, capacidade limitada para vários gatos", Newpet inox com sensor R$ 309,90, "sem fio depende de bateria".*
4. **Consideração, comedouro para cão grande/idoso.** Como tutor de cão grande, quero saber qual comedouro é de inox, tem bateria reserva e capacidade de 6-10 L. Hoje encontro uma lista dominada por modelos com câmera. *Sinal: my-best "inox por higiene, bateria recarregável, 2-10 L conforme porte", guia citando PetLibro para cão grande/idoso.*
5. **Awareness para decisão, antipulgas filhote/gestante.** Como tutor de um filhote ou de uma cadela prenhe, quero saber qual princípio ativo é seguro e se existe spray de baixa concentração. Hoje encontro uma página sem revisor veterinário. *Sinal: Petz "spray para filhote, menor concentração", "NexGard Spectra 2-3,5 kg", Petlove/Petz "caso a caso".*

---

## Persona scoring (Relevância / Clareza / Confiança / Ação, 25 cada)

| Persona (sinal) | Página | Rel | Clar | Conf | Ação | Total | Delta |
|---|---|---|---|---|---|---|---|
| Comprador de câmera para monitoramento diário (Top-N 90%) | melhor-camera + gêmea | 11 | 12 | 8 | 7 | **38** | +1 (abertura C200 = consenso; o CTA ambíguo não soma Ação) |
| GPS avesso a assinatura (Top-N segmentado) | gps-sem-mensalidade | 13 | 13 | 7 | 6 | **39** | = (+1 Clareza pela resposta direta, -1 Confiança pelo CTA anônimo) |
| Dono de gato buscando fonte silenciosa | melhor-bebedouro-automatico | 13 | 16 | 11 | 9 | **49** | +1 (abertura indica Tobo) |
| Dono de gato com acesso à rua / iPhone | coleira-gps-para-gato | 15 | 17 | 10 | 14 | **56** | +1 (CTA no topo leva ao pick nomeado) |
| Tutor YMYL com filhote/gestante | melhor-antipulgas | 19 | 19 | 13 | 20 | **71** | +1 (âncora para a tabela) |
| Tutor de cão grande/idoso buscando comedouro (inox, bateria) | melhor-comedouro-cachorro | 19 | 19 | 18 | 23 | **79** | -1 (Rel -2 viés câmera / sem inox, Ação +1 âncora) |
| Comprador de tapete para filhote, lavável/macho | melhor-tapete | 20 | 21 | 18 | 23 | **82** | +1 (âncora para a tabela) |

Melhorias, da persona mais fraca para a mais forte:
1. Câmera (Findings 3 e 2).
2. Sem mensalidade (1 e 2).
3. Fonte para gato (5).
4. GPS gato (6).
5. Antipulgas (7).
6. Comedouro (4).
7. Tapete (8).

---

## Delta vs 2026-11-04

| Item | 11-04 | 11-06 | Delta | Motivo |
|---|---|---|---|---|
| SXO Gap Score | 65 | **66** | +1 | Âncora de tabela nos comparativos (+UX), datas visíveis atualizadas (+Freshness), CTA anônimo em páginas sem lista (-UX) |
| sem-mensalidade | CRITICAL | CRITICAL | = | 0 produtos; o CTA "ver preço" anônimo agrava |
| camera (par) | CRITICAL + canib. | CRITICAL + canib. | = | Só a abertura mudou (674 palavras, 4 modelos) |
| bebedouro-automatico | HIGH, 2 produtos | HIGH, 2 produtos | = | Os 4-5 produtos estão em inox-x-ceramica, não aqui |
| comedouro-cachorro | ALIGNED | ALIGNED ("melhor") / **MEDIUM (head term)** | Rebaixado | Head term virou PLP; reescrita de 10-22 enviesada para câmera; 9,8 → 22,8 |
| gps-gato | HIGH | HIGH | = | CTA coerente, ainda 1 pick |
| antipulgas | MEDIUM | MEDIUM | = | CTA alinhado; trust YMYL igual |
| tapete | ALIGNED | ALIGNED | = | CTA alinhado |
| CTA no topo (novo) | n/a | Alinhado em 4 comparativos / ambíguo em 5 páginas sem lista | novo | Finding 2 |

---

## SXO Gap Score: 66 / 100 (era 65)

| Dimensão | Score | Evidência |
|---|---|---|
| Page Type | 9/15 (=) | Tapete, antipulgas e comedouro ("melhor") alinhados; comedouro head term com SERP de PLP; bebedouro e GPS gato HIGH; 2 CRITICAL |
| Content Depth | 11/15 (=) | 2,1k-3,3k nas alinhadas; 674 / 984 / 1.058 nas CRITICAL (só a abertura mudou) |
| UX Signals | 11/15 (=) | (+) âncora "Ver os produtos recomendados ↓" + barra que some na tabela, nos comparativos; (-) "Ver preço" genérico e sem nome em 5 páginas sem lista, repetido pela barra fixa mobile |
| Schema | 11/15 (=) | ItemList só em comedouro e tapete |
| Media | 9/15 (=) | 1 img em bebedouro, sem-mensalidade e melhor-camera; inox-x-ceramica com 3 ilustrações IA marcadas |
| Authority | 7/15 (=) | Disclosure em cada CTA (+); antipulgas sem veterinário (-); pick de GPS com 1 avaliação (-) |
| Freshness | 8/10 (+1) | 4 páginas com "Atualizado em 5 de novembro". A mudança é só no 1º parágrafo, então o ganho é de percepção do usuário, não de substância |

Projeção:
- Findings 1-3 + rótulo dos CTAs: ~74-76.
- Com 4-6: ~79.

---

## Structured findings (audit-data.json, categoria "Search Experience")

```json
{
  "category": "Search Experience",
  "date": "2026-11-06",
  "sxo_gap_score": 66,
  "previous_score": 65,
  "delta": 1,
  "content_changes_since_previous": "top CTA + mobile sticky bar in 68 posts (a7379a2); GEO direct-answer opening + dateModified 11-05 on sem-mensalidade, melhor-camera, camera-para-monitorar, bebedouro-automatico (1efc1aa); no product/schema/image changes on money pages",
  "cta_top_intent": {
    "aligned_anchor_to_table": ["/melhor-comedouro-automatico-cachorro/", "/melhor-tapete-higienico-para-cachorro/", "/melhor-antipulgas-para-cachorro/", "/bebedouro-inox-x-ceramica/"],
    "generic_single_link_unnamed": ["/melhor-coleira-gps-sem-mensalidade/", "/melhor-camera-para-monitorar-pet/", "/camera-para-monitorar-pet/", "/melhor-bebedouro-automatico-pet/", "/coleira-gps-para-gato/"],
    "fix": "label CTA + sticky bar with product name/key attribute (data-label); anchor to list once pages become listicles; remove top CTA on sem-mensalidade unless linked listing is verified no-subscription"
  },
  "pages": [
    {"url": "/melhor-comedouro-automatico-cachorro/", "serp_type": "'melhor': Top-N ~60%; head term: category/PLP ~85% (Petlove, Cobasi)", "verdict": "ALIGNED (melhor) / MEDIUM (head term)", "delta": "downgraded on head term", "gsc": "9.8 -> 22.8", "fix": "title '7 Modelos Comparados', add inox/bateria/capacidade x porte columns, restore 1 non-camera entry model, GSC query diff pre/post 10-22"},
    {"url": "/melhor-tapete-higienico-para-cachorro/", "serp_type": "Guides ~50% + Top-N", "verdict": "ALIGNED", "delta": "=", "fix": "lavavel x descartavel and adesivo/macho sections"},
    {"url": "/melhor-bebedouro-automatico-pet/", "serp_type": "Top-N ~70% ('fonte para gato', '10 modelos silenciosos') + retail guides", "verdict": "HIGH", "delta": "= (2 products; the 4-5 products are on /bebedouro-inox-x-ceramica/)", "gsc": "17.3 -> 10.3", "fix": "retitle fonte/gato, reuse inox-x-ceramica cards for 5-7 products + table, ItemList, anchor CTA"},
    {"url": "/melhor-coleira-gps-sem-mensalidade/", "serp_type": "Top-N ~75% segmented by tech", "verdict": "CRITICAL", "delta": "= (generic top CTA worsens trust)", "fix": "name or remove top CTA now; segmented 5-7 product listicle, mensalidade/chip columns, ItemList"},
    {"url": "/coleira-gps-para-gato/", "serp_type": "Top-N ~45% + guides + PDP (Tractive, Leroy)", "verdict": "HIGH", "delta": "=", "fix": "3-4 picks by tech, top table, ItemList, named CTA label"},
    {"url": ["/melhor-camera-para-monitorar-pet/", "/camera-para-monitorar-pet/"], "serp_type": "Top-N ~90%", "verdict": "CRITICAL", "delta": "= (opening now matches C200 consensus)", "fix": "one 6-8 model listicle on camera-para-monitorar-pet + 301 twin; nuvem/microSD column; anchor CTA"},
    {"url": "/melhor-antipulgas-para-cachorro/", "serp_type": "Top-N ~55% + vet retail guides ~25%", "verdict": "MEDIUM", "delta": "=", "fix": "CRMV reviewer, Spectra/Trio, filhote/gestante row, ItemList/Product"}
  ],
  "persona_scores": {"camera": 38, "gps_sem_mensalidade": 39, "bebedouro_automatico": 49, "gps_gato": 56, "antipulgas": 71, "comedouro_cachorro": 79, "tapete": 82}
}
```

---

## Limitações

- O SERP veio do WebSearch (9 queries, com muitos resultados repetidos do mesmo domínio; o termo "câmera para monitorar pet" trouxe lojas estrangeiras), não de um rank tracker do google.com.br com geolocalização BR. PAA, AI Overview, anúncios e Shopping não foram capturados. Os percentuais são aproximados.
- Os destinos dos links meli.la não puderam ser resolvidos (o CloudFront do ML retorna 403 para fetch automatizado). Por isso **não foi verificado qual produto cada CTA do topo abre**, nem se o anúncio de sem-mensalidade é de fato sem mensalidade.
- Os dados do GSC (posições 9,8 → 22,8, 17,3 → 10,3 etc.) vieram de `google-data.md`, sem lista de queries por página. A divisão head term x reescrita no comedouro é hipótese.
- O efeito real do CTA no topo ainda não é mensurável: o deploy foi em 11-05 e o `affiliate_click` só começou a gerar dados agora. Reavaliar com GA4 em 2-3 semanas.
- A atualização de "Atualizado em"/`dateModified` para 11-05 com mudança só no 1º parágrafo pode não ser lida pelo Google como atualização substancial. O ponto extra em Freshness reflete só a percepção do usuário.
- Above-the-fold mobile não foi capturado visualmente. Os renders foram feitos em desktop, e a posição exata do CTA abaixo do hero no mobile vem do HTML (logo após o 1º parágrafo), não de screenshot (ver `visual.md`).
- Fora do escopo desta passada (veredito de 10-29 mantido): brinquedo, cerca-virtual, home, comedouro-interativo, bolinha, alimentador-gatos.

Gerar relatório em PDF? Use `/seo google report`.
