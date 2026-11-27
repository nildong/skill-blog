# Auditoria Schema.org / JSON-LD - smartpetgadgets.com.br

Data: 2026-11-17 | Comparação com 2026-11-06 | Método: json.loads de todos os blocos ld+json dos 79 index.html locais (78 posts/páginas + home), checagem de propriedades, datas vs texto visível, canonical vs mainEntityOfPage, FAQ vs texto visível. Nenhum arquivo do site foi alterado. Não foi feita amostra ao vivo nesta rodada (o JSON-LD é estático no HTML; na rodada anterior local = ao vivo).

**Nota Schema: 86/100** (anterior 85)

## Resumo
- 79/79 arquivos: 0 erros de parse, 0 microdata/RDFa, @context sempre https://schema.org, 0 URLs relativas, 0 placeholders, 0 mod<pub, 0 posts sem BreadcrumbList, mainEntityOfPage = canonical em todos.
- Contagem de tipos (aninhados incluídos): BlogPosting 74, BreadcrumbList 74, FAQPage 74 (347 Q/A, 0 divergências com o texto visível), Person 75, Organization 108, WebPage 78, Product 63, Offer 34, Brand 44, Review 29, ItemList 14 (arquivos com ItemList: 13), VideoObject 2, WebSite 5. HowTo, SpecialAnnouncement, AggregateRating = 0 (correto).
- Mudança vs 11-06: Product subiu de 29 para 63 e Offer de 0 para 34. Os rankings novos (coleira-gps-para-pet 4, coleira-gps-para-gato 6, comedouro-automatico-para-pet 6, melhor-bebedouro-automatico-pet 6, camera-pet-com-dispensador-de-petisco 6, brinquedo-interativo-automatico-para-gato 6) passaram a ter ItemList com Product + brand + image + Offer. Isso explica os 79 impressões de PRODUCT_SNIPPETS no GSC.

## Delta vs 2026-11-06
| Item | 11-06 | 11-17 | Status |
|---|---|---|---|
| Parse / microdata / @context | 0 / 0 / ok | 0 / 0 / ok | Estável |
| Product nas seções novas (bebedouro 5, GPS gato, cerca) | 0 | bebedouro 6, GPS gato 6 com Offer; cerca-virtual e bebedouro-inox-x-ceramica e brinquedo-pilha ainda 0 | PARCIAL (melhorou) |
| Products com offers | 0/29 | 34 Offers em 6 posts de ranking; 29 Products de review continuam sem offers | MUDOU (intencional) |
| Seresto: Products sem offers/review nos mentions | n/a | corrigido (362c384); Product restante tem Review | CORRIGIDO |
| brand nos rankings | não | 44 Brand; 33 Products ainda sem brand (ver abaixo) | PARCIAL |
| dateModified vdrbg | ok | ok (11-05 = visível) | OK |
| dateModified cachorro-de-casa-pega-pulga | 10-09 vs visível só publicação | idem; visível só "Publicado em 22/09" | PERSISTENTE |
| dateModified comedouro-automatico-vale-a-pena | 08-20 vs visível 21/08 | idem | PERSISTENTE |
| Person sem image / sameAs | 73 / 72 | 75 / 75 (nos posts; ProfilePage tem sameAs) | PERSISTENTE |
| @id em Organization/WebSite/Person | 0 | 0 | PERSISTENTE |
| Products sem image | 10 | 10 (tapete 7, melhor-comedouro-automatico-cachorro 3) | PERSISTENTE |
| worstRating "1" newpet-2l | sim | 28 Ratings com "0", 1 com "1" | PERSISTENTE |
| FAQPage | 72 | 74 posts | Info |

## Findings

### MÉDIO - Grafo sem @id; Person e Organization fracos (persistente, conhecido)
Evidência: 75 blocos Person (nome+url) sem image e sem sameAs em todos os posts; zero @id em Organization/WebSite/Person; publisher só com name+logo; Review.author = Organization só com name. Sem sinal E-E-A-T de entidade para Google/LLMs. Já é decisão conhecida (enriquecimento pendente, depende de foto do autor fornecida pelo usuário). Correção por template: ver bloco @graph da auditoria 11-06 (Organization #org, WebSite #website, Person #person com image e sameAs Facebook), e nos BlogPosting `author`/`publisher` por `@id`. Não inventar foto.

### MÉDIO - Preço estático nos Offers dos rankings vs preço do Mercado Livre
Evidência: Offer com `price` fixo (ex.: coleira-gps-para-pet, The Pet GPS "718.00" BRL, InStock) e `url` = link de afiliado meli.la (domínio diferente do da página). Os 34 Offers não têm priceValidUntil. O Google compara preço do markup com o da página (o texto visível deve mostrar o mesmo preço) e preço desatualizado pode gerar ação manual de "dados estruturados enganosos" ou perda do snippet. Ações: (1) garantir que o preço do JSON-LD seja igual ao visível na página em cada ranking; (2) o price-monitor semanal (tools/price-monitor) pode ser estendido para sinalizar divergência JSON-LD x preço atual (só relatório, sem editar artigos, conforme decisão); (3) avaliar se usar `AggregateOffer` (lowPrice/highPrice) ou remover price em itens cujo preço oscila muito; (4) `availability` InStock fixo pode mentir se o anúncio sair do ar. Prioridade média porque PRODUCT_SNIPPETS já aparece no GSC (79 impr.), então o markup está sendo lido.

### BAIXO - Products de ranking sem review/aggregateRating (esperado)
Evidência: nos 6 posts de ranking, os Products têm Offer mas não review/aggregateRating (ex.: camera-pet-com-dispensador-de-petisco 6 Products, comedouro-automatico-para-pet 6, melhor-bebedouro-automatico-pet 6, coleira-gps-para-gato 6). É válido para Product snippets (offers basta); o aviso do GSC "review ou aggregateRating" é opcional. Não importar notas do ML como aggregateRating. Se quiser REVIEW_SNIPPET nos rankings, adicionar Review editorial com nota própria e disclosure, mas só com avaliação real do site (afiliado sem teste: manter sem).

### BAIXO - 33 Products sem brand
Evidência: sem brand em brinquedo-interativo-automatico-para-gato (4: Bolinha, Borboleta, Laser; ver ainda Alimentador/Ratinho), coleira-gps-para-pet (Kit Coleira, Coleira de Caça), cat-mate-c500-review, cercado-para-cachorros, comedouro-cachorro, newpet-2l/4l, vdrbg, melhor-alimentador-automatico-gatos (5), melhor-comedouro-automatico-cachorro (7), tapete (parcial). O 55dda7a cobriu GPS e brinquedo parcialmente; sobram anúncios genéricos sem marca real. Adicionar brand só quando houver marca verificável no anúncio; senão deixar sem (não inventar marca). Os Products de review (29) sem offers e sem aggregateRating são aceitos por terem Review editorial.

### BAIXO - Warnings de merchant listing (Info, decisão mantida)
hasMerchantReturnPolicy e shippingDetails ausentes em todos os 34 Offers: o blog é afiliado, não vendedor. Mantido por decisão (2026-11-16). Apenas Info, sem ação.

### BAIXO - dateModified diverge do visível (2 posts, persistente)
- cachorro-de-casa-pega-pulga: JSON-LD dateModified 2026-10-09, visível só "Publicado em 22 de setembro de 2026".
- comedouro-automatico-vale-a-pena: JSON-LD 2026-08-20, visível "Atualizado em 21/08/2026".
Alinhar. Os demais posts conferem pelo trecho "Atualizado em" (verificação por dia exato foi feita para o recorte exibido; sem outras discrepâncias evidentes).

### BAIXO - Products sem image (10, persistente)
melhor-tapete-higienico-para-cachorro (7 de 7) e melhor-comedouro-automatico-cachorro (3: Jwcom JW4L-W, Hi by Geonav, Luatek). Adicionar image absoluta (fotos já existem nas páginas). Sem image o Product perde elegibilidade de rich result.

### BAIXO - worstRating "1" em comedouro-newpet-2l-review (persistente)
Padronizar "0" como nos outros 28.

### BAIXO - Cobertura: bebedouro-inox-x-ceramica, brinquedo-interativo-pilha-x-recarregavel e cerca-virtual-para-cachorro sem Product
Sem rich result garantido; adicionar só após estabilizar as seções (mesmo padrão ItemList + Offer dos rankings novos, com preço verificado).

### INFO - FAQPage em 74 posts
Válido sintaticamente (347 Q/A batendo com o conteúdo visível), mas sem rich result no Google desde 2026-05-07. Benefício GEO não confirmado. Manter sem custo; não adicionar em novos posts por ganho de SERP. Dúvidas reais de leitores = QAPage.

### INFO - Ausências corretas
Sem HowTo, SpecialAnnouncement, aggregateRating inventado, Review com alegação de teste, nem Product nu nos mentions.

## O que funciona
BlogPosting completo nos 74 posts (headline, description, image absoluta, datas ISO, author, publisher, mainEntityOfPage = canonical); BreadcrumbList em todos os posts; Offer com price numérico, priceCurrency BRL, availability e url em todos os 34; ItemList com position/url/item válidos; brand nos rankings principais; FAQ coerente com o texto visível; Reviews editoriais com escala 0-10 e worstRating "0".

## Prioridades
1. Médio: verificar/automatizar coerência preço do Offer x preço visível x anúncio atual (risco de dados enganosos e perda do snippet).
2. Médio: grafo @id + foto/sameAs do Person e Organization (um template; precisa da foto do autor).
3. Baixo: image nos 10 Products; alinhar 2 dateModified; worstRating newpet-2l; brand onde for verificável.
4. Info: hasMerchantReturnPolicy/shippingDetails (decisão mantida); FAQPage (sem benefício SERP).
