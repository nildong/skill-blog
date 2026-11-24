# Auditoria Schema.org / JSON-LD - smartpetgadgets.com.br

Data: 2026-11-04 | Delta vs 2026-10-29 | Método: json.loads de todos os blocos ld+json das 78 páginas locais (index.html), comparação com texto visível; 4 amostras ao vivo (home, bebedouro-inox-x-ceramica, melhor-tapete, newpet-2l) com blocos idênticos ao local. Nenhum arquivo do site foi alterado.
**Nota Schema: 84/100** (anterior 85)

## Resumo
- 78/78 páginas: 0 erros de parse, 0 microdata/RDFa, @context sempre https://schema.org, 0 imagens de BlogPosting quebradas ou relativas, 0 mod<pub, mainEntityOfPage = canonical em todos.
- Tipos: BlogPosting 72, BreadcrumbList 72, FAQPage 72 (292 Q/A), Person 73, Organization 107 (aninhadas), Product 29, Review 29, ItemList 4, VideoObject 2, WebSite 5, ProfilePage 1, WebPage 4 (sobre, contato, políticas). HowTo/AggregateRating/SpecialAnnouncement = 0.
- Os 6 sem BreadcrumbList são home, sobre, contato, políticas e autor: aceitável.
- FAQ: 291/292 perguntas batem com o H3 visível; a 1 divergência (melhor-coleira-gps-sem-mensalidade) é só aspas simples vs duplas, falso positivo (ajustar por consistência).

## Status da auditoria anterior
| Item | Status |
|---|---|
| Product/ItemList nas seções novas (bebedouro 5, pilha 4, coleira-gato, cerca-virtual) | PERSISTENTE (bebedouro só tem BlogPosting+Breadcrumb+FAQ) |
| Person sem image / sem @id / grafo não ligado | PERSISTENTE (73/73 Person sem image; 0 @id de entidade) |
| dateModified JSON-LD vs data visível (2 posts) | PERSISTENTE |
| tapete: 7 Products sem image; reviewBody Sanol | PERSISTENTE (image: 7 tapete + 3 comedouro-cachorro = 10 sem image) |
| worstRating "1" no newpet-2l | PERSISTENTE |
| Alegação de teste em Review | CORRIGIDO/OK: reviewBody do newpet-2l diz "baseada em ficha técnica... não em teste prático"; nenhuma Review com "testamos/testei" |
| Home sem Blog/ItemList | PERSISTENTE (baixo) |

## Findings

### MÉDIO - Grafo sem @id; autor e publisher fracos (persistente)
Evidência: os 72 "@id" existentes são só mainEntityOfPage. Zero @id em Organization/WebSite/Person. Home: Organization e WebSite são blocos soltos (WebSite sem publisher/inLanguage). Posts: publisher = Organization só com name+logo (sem url/sameAs); author = Person {name,url} sem image/sameAs; Review.author = Organization só com name. Página do autor: ProfilePage com sameAs Facebook, sem image.
Correção (template único):
```json
{"@context":"https://schema.org","@graph":[
 {"@type":"Organization","@id":"https://smartpetgadgets.com.br/#org","name":"Smart Pet Gadgets","url":"https://smartpetgadgets.com.br/","logo":{"@type":"ImageObject","url":"https://smartpetgadgets.com.br/img/logo.png"},"sameAs":["https://www.facebook.com/smartpetgadgetsbr"]},
 {"@type":"WebSite","@id":"https://smartpetgadgets.com.br/#website","url":"https://smartpetgadgets.com.br/","name":"Smart Pet Gadgets","inLanguage":"pt-BR","publisher":{"@id":"https://smartpetgadgets.com.br/#org"}},
 {"@type":"Person","@id":"https://smartpetgadgets.com.br/autores/nildo-alves/#person","name":"Nildo Alves","url":"https://smartpetgadgets.com.br/autores/nildo-alves/","image":"https://smartpetgadgets.com.br/img/autores/nildo-alves.jpg","sameAs":["https://www.facebook.com/smartpetgadgetsbr"]}]}
```
Nos BlogPosting: `"author":{"@id":".../#person"}`, `"publisher":{"@id":".../#org"}`. Foto do autor precisa existir (usuário fornece); não inventar.

### MÉDIO - Seções de produto novas sem markup (persistente, bloqueado pelo retrabalho de afiliados)
bebedouro-inox-x-ceramica (5 produtos), brinquedo-interativo-pilha-x-recarregavel (4), coleira-gps-para-gato (ANXK G68) e cerca-virtual-para-cachorro (JT-08-AL): 0 Product. Product sem offers/review/aggregateRating não gera rich result, então valor baixo; só adicionar Product+Review editorial (escala 0-10, worstRating "0", author Organization) quando a seção estabilizar e houver nota própria. Não importar notas do Mercado Livre como aggregateRating. 0 Products do site têm offers (29/29): correto se o preço oscila.

### BAIXO - dateModified JSON-LD diverge do visível (persistente, 2 posts)
- cachorro-de-casa-pega-pulga: JSON-LD 2026-10-09; visível só 22/09/2026.
- comedouro-vdrbg-4l-wifi-review: JSON-LD 2026-10-09; visível modificado 30/09/2026.
Alinhar (atualizar o texto visível se a edição foi real, senão reverter o JSON-LD). Os outros 70 batem.

### BAIXO - Products sem image (persistente, 10)
melhor-tapete-higienico-para-cachorro (7/7) e melhor-comedouro-automatico-cachorro (3). Adicionar image absoluta de cada produto (fotos já estão nas páginas). Também: reviewBody do item Sanol cita "maior nota (4.9)" vs ratingValue 7.7; reescrever como "nota 4.9 dos compradores no Mercado Livre".

### BAIXO - worstRating "1" em comedouro-newpet-2l-review (persistente; demais usam "0"). Padronizar "0".

### BAIXO - Home sem Blog/CollectionPage/ItemList dos cards. Sem rich result; valor de entidade apenas.

### INFO - FAQPage em 72 posts
Válido, mas sem rich result desde 2026-05-07; benefício GEO não confirmado. Manter, não adicionar a novos posts por ganho de SERP. Dúvidas reais de leitores = QAPage.

### INFO - Ausências corretas
Sem aggregateRating, sem HowTo, sem SpecialAnnouncement, sem alegações de teste nas Reviews.

## O que funciona
BlogPosting completo nos 72 posts (headline, description, image[] absoluta existente, datas ISO, author, publisher com ImageObject, mainEntityOfPage = canonical); BreadcrumbList em todos os posts; Organization da home com url/logo/sameAs; ProfilePage do autor com disclosure honesto (sem formação veterinária); 29 Reviews com rating editorial e sem fake rating; ItemList x4 válidos; VideoObject x2; JSON-LD é server-rendered (idêntico ao vivo).

## Prioridades
1. Médio: grafo @id + foto/sameAs do autor (uma edição de template).
2. Médio (após retrabalho): Product/Review nas seções novas.
3. Baixo: alinhar 2 dateModified; image em 10 Products; Sanol reviewBody; worstRating newpet-2l.
