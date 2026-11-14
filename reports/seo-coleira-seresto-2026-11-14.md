# Auditoria SEO — /coleira-seresto-antipulgas/ (2026-11-14)

URL: https://smartpetgadgets.com.br/coleira-seresto-antipulgas/
Publicado: 2026-09-14 · dateModified: 2026-09-14 (nunca atualizado) · ~1.700 palavras · 200 OK, indexada

## Dados reais (GSC, 2026-08-16 → 2026-11-11)

| Métrica | Valor |
|---|---|
| Impressões | 44 |
| Cliques | 0 |
| Posição média | 12,8 |
| Queries visíveis | "elanco coleira seresto" (pos 36), "coleira antipulgas como funciona" (69), "seresto dura quanto tempo" (71) |

A maior parte das impressões vem de queries anonimizadas. Posição 12,8 = fundo da página 2. Isso é ruim, mas dá pra recuperar: o Google já associa a página ao tema.

## Diagnóstico: por que não está no top 3

### 1. Intenção errada para o head term (Crítico)
"coleira seresto" é transacional: a SERP é dominada por Petlove, Cobasi, Araujo, Mercado Livre e Shopping. Um blog de afiliado sem autoridade **não vai ficar no top 3 desse termo**, e não vale a pena tentar.
O que dá pra ganhar são as queries informacionais em volta da marca, onde hoje só aparecem lojas e um post da Petlove ("coleira antipulgas seresto é boa"):
- seresto vale a pena / funciona / é boa
- seresto falsificada / como saber se é original ← **lacuna clara: em PT-BR não há conteúdo bom, só fontes internacionais da Elanco**
- seresto quanto tempo dura / quanto tempo começa a fazer efeito
- seresto pode tomar banho
- seresto é perigosa / faz mal / efeitos colaterais
- seresto pode usar junto com Simparic/Bravecto
- seresto x Scalibor (leishmaniose)
- seresto gato / cão até 8kg

A página atual responde bem só a 2 ou 3 dessas.

### 2. Lacunas de conteúdo (Alto)
- **Princípios ativos ausentes**: não cita imidacloprida 10% + flumetrina 4,5%. É o dado técnico central da bula e aparece em todas as fontes de referência.
- **Original x falsificada**: o produto é vendido no Mercado Livre, onde há falsificação. Elanco, ANSES (França) e AFMPS (Bélgica) já alertaram sobre coleiras falsas sem ativo nenhum. Essa seção dá ao mesmo tempo E-E-A-T, diferencial e proteção ao leitor (e ajuda a conversão, se o link levar a um vendedor oficial/loja oficial no ML).
- **Segurança/efeitos colaterais**: falta uma seção neutra (irritação no local, não deixar outros pets mastigarem, contraindicação em lactantes, idade mínima de 7 semanas para cães e 10 para gatos). É uma das dúvidas mais buscadas sobre o produto.
- **Tempo até fazer efeito** (pulgas ~24h, carrapatos ~48h, conforme bula): ausente.
- **Uso com antipulgas oral**: ausente. Daria pra ligar com /melhor-antipulgas-para-cachorro/, que já ranqueia para Credeli/Simparic.
- **Leishmaniose / Seresto x Scalibor**: ausente. Há estudo brasileiro (Alves et al., 2022) sobre a coleira de imidacloprida/flumetrina, mas a indicação na bula brasileira precisa ser **confirmada na bula BR antes de publicar**. Não afirmar prevenção de leishmaniose sem isso.
- **Versões**: só cobre "acima de 8kg". A versão "cães e gatos até 8kg" (~R$ 163 segundo o Buscapé) é mencionada sem preço nem link.
- **Custo comparado**: o "R$ 14/mês" existe, mas falta uma tabela Seresto x Bravecto x Simparic x NexGard em custo/mês. O site já tem esses dados no post de antipulgas.

### 3. Frescor (Alto)
Preço, nota e número de avaliações são de 2026-09-14, e o dateModified nunca mudou. Em pages de produto com preço, ficar 2 meses sem atualizar já pesa. Atualizar os dados do ML e o dateModified (no schema e no texto visível).

### 4. Title / meta (Médio)
- Title atual: "Coleira Seresto Antipulgas e Carrapatos: Vale a Pena?" (53 car.). É bom, mas não sinaliza as subintenções.
- Sugestão: **"Coleira Seresto Vale a Pena? Duração, Preço e Como Saber se é Original"** (~70 car., vai truncar um pouco; alternativa curta: "Coleira Seresto: Vale a Pena? Duração, Preço e Original x Falsa").
- Meta: tirar "5.501 avaliações" (envelhece rápido) e incluir "8 meses", "original" e "efeitos colaterais".

### 5. FAQ curto demais (Médio)
São só 3 perguntas. Expandir para 8–10 com as queries acima (pode banhar? quanto tempo pra fazer efeito? pode usar com Simparic? serve pra gato? como saber se é falsa? faz mal? o que fazer se irritar o pescoço? pode filhote?). O rich result de FAQ não aparece mais para sites comuns, mas as respostas curtas ajudam em featured snippet, AI Overviews e ChatGPT, que é a fonte nº 2 de tráfego do site.

### 6. Schema (Baixo, já está ok)
BlogPosting + Product com Review (8,5/10, autor Organization) + Breadcrumb + FAQ. Não há aggregateRating importado do ML, o que está correto (seria violação). Ajustes:
- Trocar `review.author` de Organization para a Person (Nildo Alves), que já existe no site.
- Adicionar `positiveNotes`/`negativeNotes` (ItemList) a partir da tabela de prós e contras. Isso é elegível para o snippet de review em PT.
- Atualizar `dateModified`.

### 7. Links internos (Médio)
São 4 páginas linkando (home, cachorro-de-casa-pega-pulga, coleira-gps-cachorro-que-foge, melhor-antipulgas-para-cachorro).
- Em /melhor-antipulgas-para-cachorro/ (211 impressões, a página mais forte do tema), Seresto aparece só 1 vez, em link de "relacionados". Adicionar um bloco "Prefere coleira em vez de comprimido?" no corpo, com âncora "coleira Seresto vale a pena".
- /cachorro-de-casa-pega-pulga/ está na posição 7,9: é a página mais bem posicionada do cluster e já linka. Ok.

### 8. Arquitetura de cluster (Estratégico)
Não existe uma página "melhor coleira antipulgas" (Seresto x Scalibor x Leevre x genéricas). Na SERP aparece um listicle de afiliado ("10 melhores coleiras antipulgas 2026" do amoprodutinhos), sinal de que um blog consegue ranquear ali. Com esse hub, Seresto vira spoke e herda relevância.

### 9. Autoridade (Contexto honesto)
O site é novo, com quase nenhum backlink. Mesmo com o conteúdo perfeito, o top 3 de "seresto vale a pena" deve levar de 2 a 4 meses e depende de alguns links/menções (Pinterest já está rodando; um pin específico sobre "Seresto original x falsa" tende a performar bem).

## Plano de ação

| # | Ação | Prioridade | Esforço |
|---|---|---|---|
| 1 | Seção "Como saber se a Seresto é original" (fontes: Elanco, ANSES, AFMPS) | Crítico | 1h |
| 2 | Seção "Composição e segurança" (ativos, efeitos colaterais, contraindicações, idade mínima) com base na bula BR | Crítico | 1h |
| 3 | Atualizar preço/nota/vendas do ML e dateModified | Alto | 15min |
| 4 | Novo title + meta | Alto | 10min |
| 5 | FAQ de 3 → 9 perguntas (banho, tempo de efeito, combinar com oral, gato, filhote, irritação) | Alto | 45min |
| 6 | Tabela de custo/mês: Seresto x Bravecto x Simparic x NexGard | Médio | 30min |
| 7 | Mini-seção com as versões (até 8kg / gatos) e o preço de cada uma | Médio | 20min |
| 8 | Link contextual vindo de /melhor-antipulgas-para-cachorro/ | Médio | 10min |
| 9 | Schema: review.author → Person, positiveNotes/negativeNotes | Baixo | 15min |
| 10 | Seresto x Scalibor/leishmaniose: só depois de confirmar a bula BR | Médio | 30min |
| 11 | Novo hub "Melhor coleira antipulgas" | Estratégico | 1 post |
| 12 | Pin do Pinterest "Seresto original x falsa" | Baixo | 15min |

Medir: GSC da URL 3–6 semanas depois do deploy (posição média, queries novas aparecendo).

## Fontes
- https://www.petlove.com.br/dicas/coleira-antipulgas-seresto-e-boa
- https://amoprodutinhos.com.br/melhor-coleira-antipulgas/
- https://www.buscape.com.br/coleiras-guias/coleira-seresto-caes-e-gatos-ate-8-kg
- https://yourpetandyou.elanco.com/us/campaign/how-to-avoid-fake-seresto-collars
- https://mypetandi.elanco.com/en_gb/our-products/seresto/avoiding-fake-seresto-collars
- https://www.anses.fr/en/node/146851
- https://www.afmps.be/en/news/warning_against_online_sales_of_counterfeit_medicine_serestor_an_anti_flea_and_anti_tick
- https://agris.fao.org/search/fr/records/65dfefeb0f3e94b9e5ddcc1d (Alves et al. 2022, leishmaniose BR)
- https://www.bayer.com/sites/default/files/2020-11/seresto-cao-grande.pdf (bula, conferir versão BR atual)
