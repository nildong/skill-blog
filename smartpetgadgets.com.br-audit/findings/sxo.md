# SXO (Search Experience Optimization) — smartpetgadgets.com.br

Data: 2026-11-17 (passada anterior: 2026-11-06, em `archive/2026-11-06/findings/sxo.md`)
Escopo: 8 páginas de dinheiro escolhidas pelo diagnóstico de CTR (`reports/ctr-diagnostico-2026-11-17.md`): 1,22% de CTR na posição ~9, com 62% das impressões nas posições 5-10.
Este é o **SXO Gap Score**, separado do SEO Health Score.

**SXO Gap Score: 70 / 100 (anterior 66, DELTA +4)**

O ganho vem das reescritas de 11-12, 11-14 e 11-15 (bebedouro, coleira gato e hub do comedouro): as três passaram a Top-N com ItemList + Product. Pesam contra o par de câmeras (sem mudança), o "dois gatos", que é informativo num SERP transacional, e a query "credeli ou simparic", para a qual não existe página.

---

## Método: o que foi observado e o que foi inferido

**Observado (buscado de fato nesta sessão):**
- Render live das 8 URLs com `render_page.py --mode always`: todas retornaram 200, nenhuma é SPA, e title e `dateModified` são iguais aos fontes locais.
- Extração local de title, meta, H1-H3, schema, palavras, imagens, links meli.la, contagem de R$ e contagem de entidades.
- 14 queries no WebSearch, pt-BR: "fonte de água para gato", "bebedouro inox ou plástico para gato qual melhor", "melhor bebedouro automático para pet 2026", "melhor fonte de água para gato 2026", "comedouro automatico 2 gatos", "comedouro automático para dois gatos microchip ou duplo", "melhor ração para cachorro", "credeli ou simparic" (sem retorno útil), "Credeli x Simparic qual o melhor antipulgas cachorro", "melhor antipulgas para cachorro 2026", "qual a melhor coleira com gps para gatos", "melhor câmera para monitorar pet", "comedouro automático para pet melhor" e "comedouro automático".

**Não observado (inferido ou hipótese):**
- O WebSearch devolve só a lista de URLs orgânicas, sem layout do google.com.br e sem geolocalização BR. **AI Overview, Shopping/PLAs, anúncios, PAA e carrossel de vídeo NÃO foram vistos.**
- Quando este relatório fala em "Shopping provável" ou "AI Overview provável", é inferência pelo tipo de query (transacional ou "qual o melhor") e pelo padrão conhecido do SERP BR. Não é observação.
- A ordem dos resultados é a do WebSearch e pode diferir do ranking real. Domínios repetidos (Cobasi com paginações, buscamelhores x10) inflam as contagens, então os percentuais são aproximados.
- O único sinal de "feature" visto de fato: **resultados `mercadolivre.com.br/shorts/clips/` (vídeo curto do ML)** no topo de "comedouro automatico 2 gatos" e "comedouro automático".

---

## Página x SERP (resumo)

| Página | Query alvo | SERP dominante (observado) | Tipo atual | Veredito | Delta vs 11-06 |
|---|---|---|---|---|---|
| /bebedouro-inox-x-ceramica/ | "bebedouro inox ou plástico" | Guias de material + Top-N (buscamelhores "Inox ou Plástico?", qualmelhorcomprar "Melhor Material...", melhoresparacomprar, my-best, Buscapé) + PLP da Cobasi | Comparativo de material, 3.308 palavras, 5 modelos, FAQ | **ALIGNED** | = |
| idem | "fonte de água para gato" | **PLP da Cobasi (~10 paginações) + busca Buscapé + guias de varejo (Petlove x2, Petz x2)**. Nenhum Top-N de afiliado nos 15 primeiros | Title sem "fonte" e sem "gato" | **HIGH (snippet/intenção)** | novo |
| /melhor-bebedouro-automatico-pet/ | "melhor bebedouro automático", "melhor fonte para gato" | Top-N ~75% (buscamelhores x8, my-best x2, guiarecomenda, guiaomelhor, mundodosreviews, nsctotal "8 modelos", Olhar Digital) + guias Buscapé/Zoom + PLP do ML | Ranking de 6, ItemList + 6 Product, 48 R$ | **ALIGNED** (era HIGH) | **Melhorou** (reescrita 11-14) |
| /comedouro-automatico-para-dois-gatos/ | "comedouro automatico 2 gatos" | **Transacional ~80%**: PLP Cobasi x5, PDPs Cobasi/Petlove, busca Magalu, **ML clips (vídeo) x2**, my-best. Variante: SureFeed (microchip, kit ~R$ 1.523 Petlove), Rojeco duplo 4,5 L, Petz "Ideal duplo", CATLINK RFID F03 | Guia de comportamento, 1.634 palavras, 1 produto (NPC9004), 0 tabelas, CTA do topo genérico | **HIGH** | novo no escopo |
| /melhor-racao-para-cachorro/ | "melhor ração para cachorro" | Top-N/guias de **grandes portais ~70%** (my-best x2, Buscapé x3, Petlove, Petz, Zoom, cupomonline x3, amoprodutinhos, analisamelhor, petscare) + PLP Buscapé | Comparativo de 6, ItemList, preço/kg | **ALIGNED no tipo / MEDIUM em entidades e autoridade** | novo (publicada 11-08) |
| /melhor-antipulgas-para-cachorro/ | "melhor antipulgas" | Top-N my-best x4 + guias Petlove x3 / Petz x3 + amoprodutinhos, mundodosreviews | Comparativo de 6, tabela, sem ItemList | **ALIGNED / trust MEDIUM** | = |
| idem | **"credeli ou simparic"** | **Comparação X vs Y + PLP**: PLP Cobasi x5, buscas Buscapé/Magalu, PDP Araujo, **Petz "simparic-ou-nexgard-ou-bravecto" e "simparic-e-bom"**, Petlove "10 antipulgas" | Sem seção VS. Credeli (5,5-11 kg) e Simparic (20,1-40 kg) aparecem em **faixas de peso diferentes**, sem comparação direta | **CRITICAL para essa query** | piorou (pos 28-33) |
| /coleira-gps-para-gato/ | "qual a melhor coleira com gps para gatos" | Misto: Top-N ~35% (buscamelhores, qualmelhorcomprar, guiaomelhor) + **PDPs Tractive x5 + review petscare do Tractive Cat Mini** (~35%) + guias Buscapé/Zoom, ML blog, Petz web story | Ranking de 6, ItemList + 6 Product, 3.922 palavras | **ALIGNED** (era HIGH), com gap de entidade | **Melhorou** (reescrita 11-12) |
| /melhor-camera-para-monitorar-pet/ (+ gêmea /camera-para-monitorar-pet/) | "melhor câmera para monitorar pet" | **Top-N ~95%** (buscamelhores x3, qualmelhorcomprar x3, guiaomelhor x2, melhoresparacomprar "10 Modelos", seuguiadetecnologia, mundodosreviews, my-best) | Stub de 641 palavras, 4 modelos, 0 R$, 1 imagem, sem ItemList. Gêmea com 1.031 palavras e title "Melhor Câmera..." | **CRITICAL + canibalização** | = |
| /comedouro-automatico-para-pet/ | "comedouro automático (para pet) melhor" | "melhor": Top-N (gdm "melhores alimentadores", my-best x2, Buscapé, ML blog, buscamelhores x5). **Head term "comedouro automático": PDP/PLP ~75%** (Cobasi, Petz x2, Petlove, Extra, busca Buscapé) + ML clips | Ranking de 6, ItemList + 6 Product, 4.716 palavras | **ALIGNED ("melhor") / MEDIUM (head term)** | **Melhorou** (reescrita 11-15) |

---

## Findings por página (severidade + recomendação concreta)

### 1. CRITICAL: "credeli ou simparic" não tem página (/melhor-antipulgas-para-cachorro/)
**SERP observado:** é uma consulta de comparação direta entre duas marcas, com PLPs e buscas de varejo (Cobasi, Buscapé, Magalu, Araujo). Quem ranqueia com conteúdo é a **Petz, com artigos VS dedicados** ("Simparic ou NexGard ou Bravecto", "Simparic é bom?") e a Petlove. Não apareceu nenhum listicle Top-N de afiliado.

**Página:** é um Top-N com 6 itens, sem nenhum H2/H3 "Credeli ou Simparic" (a única FAQ próxima é "Simparic, Bravecto, NexGard e Credeli são todos o mesmo tipo?"). Os cards estão em faixas de peso diferentes (Credeli 225 mg para 5,5-11 kg; Simparic 80 mg para 20,1-40 kg), então o leitor não consegue comparar os dois. Resultado: posição 28-33, 0 cliques.

**Recomendação (P3 pendente, agora com formato definido pelo SERP):**
- **Preferível: criar a URL dedicada `/credeli-ou-simparic/`**, porque o SERP recompensa página VS dedicada (padrão Petz).
  - Title: `Credeli ou Simparic? Diferenças, Duração e Preço por Peso` (56 caracteres).
  - Meta: `Credeli (lotilaner) ou Simparic (sarolaner): qual age mais rápido, quanto tempo protege, qual trata sarna e qual sai mais barato na mesma faixa de peso.`
  - Formato:
    - resposta direta em 2 frases no topo;
    - tabela VS **na mesma faixa de peso** com as colunas princípio ativo, início de ação, duração, sarna/ácaros, idade e peso mínimos, preço por comprimido e preço por mês;
    - caixa "Quando escolher cada um";
    - inclusão do NexGard como 3º (a Petz faz o mesmo);
    - FAQ.
  - O SERP traz Credeli com início em 2 h, 100% em 6 h e "não trata sarna" (FAQ do Buscapé), e Simparic com início em 3 h, 35 dias e ação contra ácaros (Petz). **Confirmar tudo na bula antes de publicar.**
  - Linkar a partir do comparativo com a âncora "Credeli ou Simparic".
- **Mínimo, se não criar a URL:** adicionar um H2 "Credeli ou Simparic: qual escolher?" com a tabela VS na mesma faixa de peso, um link no sumário e uma FAQ "Credeli ou Simparic, qual é melhor?".
- YMYL: revisor com CRMV + Person schema (`/seo content`). Isso continua pendente desde 10-29.

### 2. CRITICAL: par de câmeras sem mudança estrutural (/melhor-camera-para-monitorar-pet/)
**SERP observado:** é o SERP mais homogêneo do escopo, ~95% Top-N com títulos do tipo "10 Modelos com Visão Noturna e Áudio". Os modelos de consenso são Tapo C200 (custo-benefício), **Tapo C500, Intelbras iM4 C (segue o pet), eufy C220 2K e Ezviz TY1** (visão noturna). O critério recorrente é "SD ou nuvem".

**Página:** 641 palavras e 4 modelos. **0 menções** a C500, iM4, eufy, Ezviz, "nuvem" e "microSD". Tem 0 R$ e 1 imagem. A gêmea `/camera-para-monitorar-pet/` tem title "Melhor Câmera para Monitorar Pet: Como Escolher", recebe 4 links da home contra 3 desta, e o CTA do topo das duas é genérico ("Quer ver o preço agora?").

**Recomendação:** é a mesma de 11-04 e 11-06, agora com lista de modelos fechada. Nas posições 17-19 a regra "esperar 12-01" não protege nenhuma medição útil, então a reconstrução pode ser feita já.
- Consolidar em 1 URL com 7 modelos (C200, C500, C100 fixa, iM4 C, eufy C220, Newpet 2K, Ezviz TY1 ou Haiz). Fazer 301 da outra URL e registrar no memo de slugs.
  - Title: `Melhor Câmera para Monitorar Pet 2026: 7 Modelos Comparados` (59).
  - Meta: `Tapo C200, C500, Intelbras iM4 C, eufy C220 e mais: visão noturna, 360°, áudio, microSD ou nuvem (R$/mês) e preço. Qual vale para cão ou gato sozinho.`
- Montar a tabela com resolução / 360° ou fixa / visão noturna / áudio / microSD x nuvem (+R$/mês) / segue o pet / preço.
- Adicionar ItemList + Product (no padrão de 11-16, com brand e sem Product sem offer).
- Trocar o CTA do topo pela âncora "Ver os 7 modelos ↓".
- Linkar o ranking de câmera com petisco (a84c3c5) como "se quer dar petisco".

### 3. HIGH: "dois gatos" é guia de comportamento num SERP transacional (/comedouro-automatico-para-dois-gatos/)
**SERP observado:** "comedouro automatico 2 gatos" retorna PLP Cobasi x5, PDPs Cobasi e Petlove, busca Magalu, **2 clips de vídeo do ML** e my-best. Nenhum guia de comportamento. A variante ("microchip ou duplo") mostra o espaço de solução: **duplo** (Rojeco Duplo 4,5 L Wi-Fi, Petz "Ideal duplo maxi/mini", CATLINK F03 com 2 pratos) x **microchip/RFID** (SureFeed, kit ~R$ 1.523 na Petlove; MiBowl). Um guia ainda observa que "duplo costuma ser para ração seca".

**Página:**
- Abre com "o problema raramente é o equipamento".
- Tem 1 produto (New Pet NPC9004 RFID, R$ 663, pick box de 11-12), 0 tabelas, 1 R$ e 0 menções a "duplo".
- O title "Como Evitar Briga" promete conteúdo comportamental.
- O CTA do topo leva a `meli.la/2hiYAmt` sem nomear o produto.

Na posição 6,2 com CTR de 1%, o snippet não casa com quem quer comprar.

**Recomendação:** o title é de 10-14 e não entrou no P1, então pode mudar já.
- Title: `Comedouro Automático para 2 Gatos: Duplo ou com Chip RFID?` (58).
- Meta: `Um gato come a ração do outro? Compare comedouro duplo (2 tigelas com horários próprios), com chip RFID que só abre para o gato certo (NPC9004, R$ 663) e 2 aparelhos.`
- H1: `Comedouro Automático para 2 Gatos: Duplo, RFID ou Dois Aparelhos?`
- Logo após a resposta direta, uma seção "3 soluções" com tabela (tipo / como resolve o roubo de ração / preço / quando usar) e 1 produto por linha:
  - **duplo 2 tigelas**: produto ML a definir pelo usuário;
  - **RFID NPC9004**: já existe;
  - **2 comedouros simples**: link para o hub `/comedouro-automatico-para-pet/` (Newpet 4L).
- Manter a parte de comportamento (gatos +1, distância) como 2ª metade.
- Trocar o CTA do topo para "Ver as 3 soluções ↓" ou nomear o produto ("Ver preço do New Pet RFID NPC9004 →").
- Produtos citados no SERP, como o SureFeed (premium), podem entrar como menção sem link se não houver anúncio ML confiável.

### 4. HIGH (snippet): /bebedouro-inox-x-ceramica/ recebe "fonte de água para gato" com title só de material
**SERP observado:**
- "bebedouro inox ou plástico" é um SERP de guias de material, então a página está **ALIGNED** nele.
- "fonte de água para gato" (provável maior volume) é **PLP da Cobasi + guias "como escolher fonte" da Petlove e da Petz**.
- "melhor fonte de água para gato" é Top-N.
- Ponto do SERP que vale citar: a Cobasi diz que "**inox pode refletir luz e incomodar gatos sensíveis**". É um contraponto que nenhum Top-N usa e que diferencia o snippet.

**Página:** title `Bebedouro Inox, Cerâmica ou Plástico: Qual o Melhor?` (52), sem "fonte" e sem "gato", embora o H1 tenha "gato" e o corpo tenha 56 menções a "fonte". Tem 5 modelos de R$ 38,70 a R$ 179,90, `dateModified` 10-25 (fora do P1, pode mudar) e já linka 3 vezes para o ranking.

**Recomendação:**
- **Manter a página sobre material** (resolve a canibalização com o ranking de 11-14) e deixar a resposta visível no snippet:
  - Title: `Fonte para Gato: Inox, Cerâmica ou Plástico? O Mais Higiênico` (60).
  - Meta: `Inox 304 é o mais higiênico, cerâmica a mais estável e fresca, plástico o mais barato (mas risca e acumula limo). Veja 5 fontes de R$ 38 a R$ 180 por material.`
- No 1º parágrafo, logo após a resposta, incluir uma caixa: "Procurando a melhor fonte de água para gato, não o material? → Ranking das 6 melhores fontes de 2026" (link para `/melhor-bebedouro-automatico-pet/`). Assim quem tem intenção de compra vai para a URL de ranking sem a página perder o clique.
- Incluir a ressalva "inox brilhante pode incomodar alguns gatos" na seção do inox. É um diferencial de confiança e pode virar PAA, mas isso é hipótese, porque PAA não foi visto.
- Não adicionar ItemList/Product aqui. O papel de ranking fica com a outra URL.

### 5. MEDIUM: ração está no formato certo, mas faltam as marcas de consenso do SERP e autoridade (/melhor-racao-para-cachorro/)
**SERP observado:** é dominado por portais (my-best, Buscapé x3, Petlove, Petz, Zoom, cupomonline x3) e fragmentado por subintenção (castrado, filhote, sachê, 7 kg). As marcas recorrentes são **Golden/Premier, Gran Plus Choice, Royal Canin, Hill's, Purina One e Biofresh** (custo-benefício). A mensagem de todo o SERP é "depende de idade e porte; o veterinário decide".

**Página:** foi publicada em 11-08 com 6 rações (Quatree, Magnus, N&D, Fórmula Natural, Royal Canin, Bionatural) e preço por kg. Tem **0 menções** a Golden, Premier, Gran Plus, Hill's, Purina e Biofresh, e 0 menções a "castrado". Posição 10,3, 242 impressões, 0 cliques. O tipo está certo. Faltam as entidades que o SERP espera e a autoridade de um portal. Como o diagnóstico já indicou, o problema é de posição, não de snippet.

**Recomendação:** a página é posterior a 11-05, então **não mexer no title antes de 12-01**. Depois disso:
- Adicionar Golden (Premier) e Biofresh, ou Gran Plus, como 7º/8º itens, já que são marcas de consenso e a ausência reduz a Relevância para quem compara.
- Adicionar a linha "castrado" na tabela.
- Title candidato: `Melhor Ração para Cachorro 2026: 8 Marcas por Preço/kg`. "Preço por kg" é o diferencial que os portais não destacam no title.
- Revisor com CRMV (`/seo content`).
- Não perseguir o head term com mais texto. Linkar a partir de posts de cauda longa com âncoras de subintenção ("ração para cachorro de porte pequeno").

### 6. MEDIUM: GPS para gato está alinhado após 11-12, mas falta o Tractive, a entidade dominante (/coleira-gps-para-gato/)
**SERP observado:** **5 PDPs do Tractive** (Cat Mini em várias cores) + o review petscare do Tractive Cat Mini + guias Buscapé/Zoom e ML blog + Top-N. Os critérios são peso do gato, bateria (5-7 dias) e "AirTag depende da rede Find My".

**Página:** ranking de 6 com ItemList + Product e 21 menções a "mensalidade", mas **0 menções a "Tractive"**. Quem pesquisa Tractive e chega aqui não encontra o termo de comparação que o SERP mostra.

**Recomendação:** a reescrita é de 11-12. Não mexer no title nem na estrutura antes de 12-01. Mudança pequena, permitida porque não altera o snippet:
- Uma caixa "E o Tractive Cat Mini? Vale no Brasil?" com peso, bateria e plano mensal, e o motivo de não estar no top 6 (por exemplo, disponibilidade ou preço no ML).
- Uma FAQ "Tractive ou The Pet GPS 4G?".

### 7. LOW/ALIGNED: bebedouro ranking (11-14) e hub do comedouro (11-15). Medir, não mexer
- **/melhor-bebedouro-automatico-pet/:** passou de HIGH a ALIGNED. O SERP Top-N cita Gondmax 3 L, Truqys 2 L e galão de 10 L para cão grande (0 menções na página). **Esperar até 12-01.** Se as queries "fonte" não migrarem de inox-x-ceramica, testar o title `Fonte de Água para Gato e Cão: 6 Melhores de 2026`, porque o atual não tem "gato" nem "água".
- **/comedouro-automatico-para-pet/:** ALIGNED no "melhor". O consenso do gdm (Xiaomi 5L melhor, Newpet 4L custo-benefício) bate com os nossos #1 e #5. O head term "comedouro automático" é PDP/PLP (Cobasi, Petz, Petlove) + ML clips e não é disputável com um post. Gap pequeno: 0 menções a "bateria", e o SERP diz que "bateria recarregável é mais seguro para quem fica sozinho". Adicionar a coluna "bateria reserva?" depois de 12-01.

---

## User stories (derivadas de sinais observados)

1. **Decisão, antipulgas VS.** Como tutor que já ouviu falar dos dois, quero saber se Credeli ou Simparic é melhor para o peso do meu cão, qual age mais rápido e qual cobre sarna. Hoje encontro um Top-6 em que os dois estão em faixas de peso diferentes. *Sinal: Petz "simparic-ou-nexgard-ou-bravecto", FAQ Buscapé "Credeli 2 h / 6 h, não trata sarna", Petz "Simparic 3 h, 35 dias, ácaros".*
2. **Decisão, dois gatos.** Como dono de 2 gatos em que um rouba a ração do outro, quero escolher entre comedouro duplo e comedouro com chip, com preço. Hoje encontro um texto sobre comportamento com 1 produto. *Sinal: SERP 80% PLP/PDP, SureFeed "reconheceu os chips de dois gatos" (Petlove), Rojeco duplo, ML clips.*
3. **Consideração, câmera.** Como tutor que trabalha fora, quero comparar C200 x C500 x iM4 C (que segue o pet) e saber se pago nuvem. Hoje encontro 4 modelos sem preço. *Sinal: SERP 95% Top-N, "C500 mais nítida que a C200", "IM4 C segue o pet", "cartões SD ou nuvem".*
4. **Awareness, fonte para gato.** Como dono de um gato que bebe pouca água, quero entender se a fonte ajuda e qual material é seguro, e ver as melhores fontes. Hoje o título fala só de inox/cerâmica. *Sinal: Petlove/Petz "fonte de água para gatos", Cobasi "inox pode refletir luz", buscamelhores "Inox ou Plástico?".*
5. **Consideração, GPS gato.** Como dono de um gato que sai de casa, quero saber se o Tractive vale a mensalidade no Brasil ou se há alternativa 4G sem plano. Hoje o Tractive não é mencionado. *Sinal: 5 PDPs do Tractive + review petscare, "AirTag depende da rede Find My".*

---

## Persona scoring (Relevância / Clareza / Confiança / Ação, 25 cada)

| Persona (sinal) | Página | Rel | Clar | Conf | Ação | Total | Delta 11-06 |
|---|---|---|---|---|---|---|---|
| Tutor comparando Credeli x Simparic (Petz VS) | antipulgas | 8 | 10 | 12 | 14 | **44** | novo |
| Comprador de câmera para rotina fora (Top-N 95%) | melhor-camera + gêmea | 11 | 12 | 8 | 7 | **38** | = |
| Dono de 2 gatos com roubo de ração (PLP + SureFeed) | dois-gatos | 10 | 13 | 14 | 9 | **46** | novo |
| Dono de gato querendo fonte (Petlove/Cobasi) | inox-x-ceramica | 14 | 15 | 17 | 16 | **62** | novo |
| Tutor buscando "melhor ração" (portais) | melhor-racao | 15 | 19 | 13 | 19 | **66** | novo |
| Dono de gato que sai de casa, comparando Tractive | coleira-gps-gato | 18 | 20 | 17 | 20 | **75** | +19 (era 56) |
| Comprador de fonte (Top-N) | melhor-bebedouro | 20 | 20 | 17 | 21 | **78** | +29 (era 49) |
| Comprador de comedouro ("melhor") | comedouro-hub | 20 | 20 | 18 | 21 | **79** | novo no escopo |

Melhorias, da persona mais fraca para a mais forte, com o finding correspondente:
1. Câmera (F2): 7 modelos + tabela nuvem/microSD + 301 da gêmea.
2. Credeli x Simparic (F1): URL VS dedicada ou H2 com tabela na mesma faixa de peso.
3. Dois gatos (F3): title "Duplo ou com Chip RFID?" + tabela de 3 soluções + CTA nomeado.
4. Fonte/material (F4): title com "Fonte para Gato" + caixa para o ranking.
5. Ração (F5): depois de 12-01, Golden/Biofresh e linha "castrado".
6. GPS gato (F6): caixa do Tractive.
7. Bebedouro e comedouro hub (F7): só medir.

---

## Delta vs 2026-11-06

| Item | 11-06 | 11-17 | Delta | Motivo |
|---|---|---|---|---|
| SXO Gap Score | 66 | **70** | +4 | 3 páginas passaram de "como escolher"/1 pick a Top-N com ItemList + Product |
| melhor-bebedouro-automatico-pet | HIGH, 2 produtos | **ALIGNED**, 6 produtos, 48 R$ | Melhorou | Reescrita 11-14 |
| coleira-gps-para-gato | HIGH, 1 pick | **ALIGNED**, 6 produtos (gap Tractive) | Melhorou | Reescrita 11-12 |
| comedouro-automatico-para-pet | fora do escopo | ALIGNED / MEDIUM head term | n/a | Reescrita 11-15 |
| camera (par) | CRITICAL + canib. | CRITICAL + canib. | = | Nenhuma mudança desde 11-05 |
| antipulgas | MEDIUM | MEDIUM (head) / **CRITICAL ("credeli ou simparic")** | Rebaixado em query | Query VS sem página; pos 28-33 |
| inox-x-ceramica | ALIGNED (âncora) | ALIGNED material / **HIGH snippet "fonte"** | novo | 512 impressões na pos 6,3 com title sem "fonte"/"gato" |
| dois-gatos | fora do escopo | **HIGH** | novo | SERP transacional x guia de comportamento |
| melhor-racao | n/a | MEDIUM | novo | Publicada 11-08; faltam marcas de consenso |

## SXO Gap Score: 70 / 100

| Dimensão | Score | Evidência |
|---|---|---|
| Page Type | 10/15 (+1) | Bebedouro, GPS gato e comedouro hub agora Top-N; câmera CRITICAL; dois-gatos HIGH; sem página para a query VS de antipulgas |
| Content Depth | 12/15 (+1) | 3,3k-4,7k palavras nos rankings novos; câmera com 641; dois-gatos sem tabela |
| UX Signals | 11/15 (=) | CTA nomeado no topo dos rankings novos ("Amicus Aqua Clay 2,5 L...", "Newpet 4L...", "The Pet GPS 4G..."), o que resolve o Finding 2 de 11-06 nessas páginas; câmera e dois-gatos seguem com "Quer ver o preço agora?" anônimo |
| Schema | 12/15 (+1) | ItemList + Product em bebedouro, GPS gato e hub (com brand desde 11-16); antipulgas e câmera sem ItemList |
| Media | 10/15 (+1) | 7-8 imagens nos rankings novos; câmera com 1 imagem; dois-gatos com 2 |
| Authority | 7/15 (=) | Antipulgas e ração (temas de saúde) sem revisor com CRMV; o SERP de ração é dominado por portais |
| Freshness | 8/10 (=) | 11-12/14/15 com mudança substancial; câmera com `dateModified` 11-05 só na abertura |

Projeção: com F1-F4 aplicados, ~76; com F5-F6 após 12-01, ~79.

---

## Ordem de execução (respeitando a janela de medição até ~12-01)

| Prioridade | Página | Ação | Pode fazer já? |
|---|---|---|---|
| 1 | dois-gatos | Title/meta/H1 + tabela de 3 soluções + CTA nomeado | Sim (title de 10-14, fora do P1) |
| 2 | inox-x-ceramica | Title/meta com "Fonte para Gato" + caixa para o ranking | Sim (`dateModified` 10-25) |
| 3 | /credeli-ou-simparic/ (nova) | Página VS + link a partir do comparativo | Sim (URL nova não interfere em medição) |
| 4 | câmera (par) | Consolidação 7 modelos + 301 | Sim (pos 17-19, sem baseline útil) |
| 5 | coleira-gps-gato | Caixa Tractive + FAQ (sem mexer no snippet) | Sim, só o corpo |
| 6 | melhor-racao | Golden/Biofresh, castrado, title "preço/kg" | Depois de 12-01 |
| 7 | bebedouro ranking, comedouro hub | Medir GSC; title "Fonte de Água para Gato" só se as queries não migrarem | Depois de 12-01 |

---

## Structured findings (audit-data.json, categoria "Search Experience")

```json
{
  "category": "Search Experience",
  "date": "2026-11-17",
  "sxo_gap_score": 70,
  "previous_score": 66,
  "delta": 4,
  "serp_source": "WebSearch organic URL lists only (14 queries); AI Overview/Shopping/PAA/ads NOT observed; ML shorts/clips video results observed on 'comedouro automatico 2 gatos' and 'comedouro automático'",
  "pages": [
    {"url": "/melhor-antipulgas-para-cachorro/", "query": "credeli ou simparic", "serp_type": "X-vs-Y retail guides (Petz) + PLP (Cobasi, Buscapé, Magalu)", "verdict": "CRITICAL", "fix": "new /credeli-ou-simparic/ VS page, same weight band table, bula-verified; title 'Credeli ou Simparic? Diferenças, Duração e Preço por Peso'; CRMV reviewer"},
    {"url": ["/melhor-camera-para-monitorar-pet/", "/camera-para-monitorar-pet/"], "query": "melhor câmera para monitorar pet", "serp_type": "Top-N ~95%", "verdict": "CRITICAL + cannibalization", "fix": "consolidate 7 models (C200, C500, C100, iM4 C, eufy C220, Newpet 2K, Ezviz TY1) + 301; nuvem/microSD column; ItemList; title 'Melhor Câmera para Monitorar Pet 2026: 7 Modelos Comparados'"},
    {"url": "/comedouro-automatico-para-dois-gatos/", "query": "comedouro automatico 2 gatos", "serp_type": "transactional PLP/PDP ~80% + ML video clips", "verdict": "HIGH", "fix": "title 'Comedouro Automático para 2 Gatos: Duplo ou com Chip RFID?'; 3-solution table (duplo/RFID/2 aparelhos); named top CTA"},
    {"url": "/bebedouro-inox-x-ceramica/", "query": "fonte de água para gato / bebedouro inox ou plástico", "serp_type": "PLP Cobasi + retail guides (fonte); material guides (inox ou plástico)", "verdict": "ALIGNED (material) / HIGH (snippet for fonte)", "fix": "title 'Fonte para Gato: Inox, Cerâmica ou Plástico? O Mais Higiênico'; box linking to ranking; keep material scope"},
    {"url": "/melhor-racao-para-cachorro/", "query": "melhor ração para cachorro", "serp_type": "Top-N/guides from big portals ~70%", "verdict": "MEDIUM", "fix": "after 12-01: add Golden/Premier + Biofresh/Gran Plus, castrado row, CRMV reviewer; title with 'preço/kg'"},
    {"url": "/coleira-gps-para-gato/", "query": "qual a melhor coleira com gps para gatos", "serp_type": "Top-N ~35% + Tractive PDPs ~35% + guides", "verdict": "ALIGNED (entity gap)", "delta": "improved from HIGH", "fix": "Tractive Cat Mini box + FAQ, body only"},
    {"url": "/melhor-bebedouro-automatico-pet/", "serp_type": "Top-N ~75%", "verdict": "ALIGNED", "delta": "improved from HIGH", "fix": "measure until 12-01; then consider 'Fonte de Água para Gato e Cão' title"},
    {"url": "/comedouro-automatico-para-pet/", "serp_type": "'melhor': Top-N; head term: PDP/PLP ~75%", "verdict": "ALIGNED / MEDIUM head term", "delta": "improved (rewrite 11-15)", "fix": "measure; add 'bateria reserva' column after 12-01"}
  ],
  "persona_scores": {"camera": 38, "credeli_simparic": 44, "dois_gatos": 46, "fonte_material": 62, "racao": 66, "gps_gato": 75, "bebedouro_ranking": 78, "comedouro_hub": 79}
}
```

---

## Limitações

- **Layout do SERP não visto:** o WebSearch não mostra AI Overview, Shopping, anúncios, PAA nem posição de vídeo. O efeito dessas features no CTR das posições 5-10 continua sendo **hipótese**, provável em "fonte de água para gato", "comedouro automatico 2 gatos" e "credeli ou simparic", que são transacionais. Para confirmar, é preciso um rank tracker BR ou uma captura manual no celular.
- A query exata "credeli ou simparic" não trouxe nenhum resultado útil no WebSearch (os resultados eram irrelevantes, e um deles tinha uma instrução embutida, que foi ignorada). O SERP VS foi inferido pela variante "Credeli x Simparic qual o melhor antipulgas cachorro".
- Os dados de saúde citados do SERP (início de ação, duração, sarna) vêm de varejistas e agregadores e **precisam ser checados na bula** antes de publicar.
- Não houve dados do GSC por query e por página nesta passada. Os números de impressões, posição e cliques vêm de `reports/ctr-diagnostico-2026-11-17.md`.
- As reescritas de 11-12/14/15 ainda não têm dados pós-mudança. O "ALIGNED" delas é de formato e não garante ganho de posição.
- Os destinos dos links meli.la não foram resolvidos (o ML bloqueia fetch automatizado). Não foi verificado qual anúncio o CTA genérico das páginas de câmera e dois-gatos abre.
- Above-the-fold mobile não foi capturado em screenshot. A posição do CTA veio do HTML.
- Fora do escopo desta passada: sem-mensalidade (CRITICAL em 11-06; não verificado agora), tapete, cerca-virtual e o restante dos 79 posts.

Gerar relatório em PDF? Use `/seo google report`.
