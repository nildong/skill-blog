# SEO de Afiliados / E-commerce — smartpetgadgets.com.br

Data: 2026-11-04 (reauditoria; anterior: 2026-10-11)
Fonte: "On-page analysis (static)" — grep/parse do HTML local em /home/projetos/blog (76 posts com index.html) e `.data/affiliate-products.json`. Sem chamadas DataForSEO Merchant (site de review/afiliado, sem preço ou estoque próprios).
Escopo: o cluster de afiliados está em pausa por decisão do usuário. Este arquivo só relata; nenhum item abaixo recomenda correção mecânica em massa.

## Scores
- Disclosure e compliance: 92/100 (era 85)
- Cobertura de schema Product/Review/ItemList: 55/100 (era 35)
- Governança/catalogação de links: 20/100 (era 25)
- Frescor de preços: 45/100 (novo)
- Consistência dos cards: 70/100 (novo)
- Geral afiliados: 56/100 (era 45)

## Comparação com a auditoria anterior
| Item | 2026-10-11 | 2026-11-04 |
|---|---|---|
| Posts com Product | 7–8 | 11 |
| ItemList nas páginas "melhor X" | não reportado | 4 (3 "melhor-*" + vdrbg review) |
| AggregateRating (risco da Seresto) | Crítico | 0 ocorrências: **resolvido** |
| Links meli.la na catálogo | 63 de ~76 sem catálogo | 90 de 96 IDs únicos fora do catálogo: **piorou/ampliou** |
| Disclosure | amostra | **72/72 posts com meli.la** têm disclosure ou menção a comissão: verificado no site todo |
| `offers`/price no schema | ausente | ausente (continua correto) |

## Findings

### Crítico — 90 de 96 IDs meli.la únicos não estão no catálogo (pausado pelo usuário)
Evidência: `.data/affiliate-products.json` tem 15 produtos e só 6 `affiliate_url` com ID. O site tem 152 links `<a>` meli.la em 72 posts, com 96 IDs únicos. Nenhum controle central permite verificar link quebrado, produto errado ou comissão.
Correção: só relatar. Retomar na reformulação do cluster, reverificando cada produto e catalogando com `affiliate_url` manual, conforme a regra do catálogo. Sem passada em massa.

### Alto — Posts com schema Product/ItemList usam Product sem `offers`, mas 3 dos 4 ItemList têm cards sem `image`
Evidência: no ItemList de `melhor-tapete-higienico-para-cachorro` o primeiro Product não tem `image` (os de `melhor-alimentador`, `melhor-comedouro-automatico-cachorro` e `comedouro-vdrbg-4l-wifi-review` têm). Verificado só o item 1 de cada lista; os demais itens não foram checados.
Correção: ao revisar cada lista, garantir `image` em todos os itens (Google exige `image` ou `offers`/`review`/`aggregateRating` para o Product ser elegível, e imagem melhora o carrossel). Fazer junto da reformulação, não isolado.

### Alto — `melhor-antipulgas-para-cachorro` é um "melhor X" sem Product nem ItemList
Evidência: 6 links meli.la, 14 preços, 6 datas "consultado em", mas o JSON-LD só tem BlogPosting, FAQPage, BreadcrumbList. Os outros 3 "melhor-*" de comparação têm ItemList.
Também sem ItemList/Product: `melhor-bebedouro-automatico-pet`, `melhor-bolinha-inteligente-para-gato`, `melhor-camera-para-monitorar-pet`, `melhor-coleira-gps-sem-mensalidade`, `melhor-comedouro-interativo-gato` (cada um com só 1 link meli.la, parecem hubs/guias, não comparativos; confirmar o tipo de página).
Correção: tratar antipulgas como candidato prioritário a ItemList+Product(+Review) quando a reformulação chegar a ele. Os demais só se forem de fato comparativos.

### Alto — Links meli.la sem `nofollow` e links diretos mercadolivre.com.br sem `sponsored`
Evidência:
- `cachorro-de-casa-pega-pulga`: 3 links `meli.la/2dk6x44` com `rel="sponsored noopener"`, sem `nofollow`. Isso é aceitável para o Google (sponsored basta), mas foge do padrão do site (`nofollow sponsored noopener`).
- `coleira-seresto-antipulgas`: 5 links diretos `mercadolivre.com.br/.../p/MLB15982842` (incluindo `#reviews`) com só `rel="noopener"`. Se forem links não afiliados, é aceitável como citação de fonte, mas ao lado de CTA comercial convém marcar `sponsored` ou usar o meli.la.
Correção: padronizar o `rel` nesses 2 posts (baixo esforço, 2 arquivos). Não precisa de varredura geral: os outros 149 links meli.la já usam `sponsored`.

### Médio — Preços datados de forma desigual: 21 posts mostram preços, só 9 têm data "consultado em"
Evidência: datas encontradas só em posts "melhor-*", `bebedouro-inox-x-ceramica`, `brinquedo-interativo-pilha-x-recarregavel`, `cerca-virtual-para-cachorro`, `coleira-gps-para-gato`. Sem data apesar de preços: `brinquedo-interativo-automatico-para-gato` (16 preços, 0 datas), `duvidas-brinquedo-interativo-gato` (12), `melhor-bolinha-inteligente-para-gato` (9), `coleira-seresto-antipulgas` (5), `coleira-gps-para-pet` (4), `comedouro-automatico-para-pet` (6), `comedouro-automatico-vale-a-pena` (4), além de posts com 1–2 preços.
Datas ficam entre 22/08 e 22/10/2026, ou seja, os preços mais antigos têm ~74 dias. Há também um "consultado em 2026" sem dia/mês (formato incompleto).
Correção: ao revisar cada post, datar todo preço ou removê-lo (preço de marketplace muda rápido). Não adicionar `offers` ao schema sem feed de preço.

### Médio — Cards e metadados inconsistentes entre tipos de página
Evidência: nos comparativos há 5–7 CTAs/IDs únicos por página e estrutura de card própria (`melhor-tapete`: 7 IDs, 23 elementos CTA/card). Os "melhor-*" menores têm 1 CTA. Os campos de review variam: Review no ItemList usa nota de 0 a 10 (`bestRating: 10`), o que é válido, mas o site não usa um padrão único entre as notas 8.3/8.5/8.6/8.8.
Correção: ao reformular, definir um padrão único de card (nome, nota, preço datado, CTA, disclosure) para reaproveitar entre posts.

### Baixo — Schema Review com autor Organization e sem `offers`: manter
Review atribuído a Organization com nota própria não tem risco de AggregateRating inventado (0 ocorrências). `offers` ausente continua a escolha segura; não adicionar `offers` parcial sem `price`/`priceCurrency`.

### Positivo — Disclosure
Todos os 72 posts com meli.la têm o texto de disclosure/comissão. Existem ressalvas honestas de "não testamos fisicamente" em posts como `soprador-pet` e `tapete-higienico-para-cachorro`, o que reduz risco de E-E-A-T e de alegações falsas de teste (consistente com o commit 258253b).

## Prioridades (todas condicionadas à retomada da reformulação)
1. Alto: padronizar `rel` em `cachorro-de-casa-pega-pulga` e `coleira-seresto-antipulgas` (isolado, 2 arquivos, sem relação com o cluster pausado).
2. Alto: ItemList+Product em `melhor-antipulgas-para-cachorro`; `image` em todos os itens dos ItemList (na reformulação).
3. Médio: datar ou remover preços nos 12 posts sem data.
4. Crítico/pausado: catalogar 90 IDs meli.la só quando o usuário retomar.

## Arquivos
- /home/projetos/blog/.data/affiliate-products.json
- /home/projetos/blog/melhor-antipulgas-para-cachorro/index.html
- /home/projetos/blog/melhor-tapete-higienico-para-cachorro/index.html
- /home/projetos/blog/cachorro-de-casa-pega-pulga/index.html
- /home/projetos/blog/coleira-seresto-antipulgas/index.html
