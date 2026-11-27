# Auditoria SEO Completa — smartpetgadgets.com.br

**Data:** 24/11/2026 · **Health Score: 87/100** (85 em 17/11 e 06/11) · **Tipo:** publisher afiliado (reviews e guias pet, Mercado Livre)

**Escopo:** 81 URLs rastreadas (79 do sitemap + 2 vídeos), PageSpeed mobile em 4 páginas, Search Console (28 dias + série desde 01/10), monitor de preços de 23/11. Rodada inline, sem os subagentes: screenshots, backlinks e SXO por SERP ficaram de fora desta vez. A auditoria de 17/11 está em `archive/2026-11-17/`.

## Notas por categoria

| Categoria | Peso | Nota | 17/11 |
|---|---|---|---|
| SEO Técnico | 22% | 95 | 93 |
| Qualidade de Conteúdo | 23% | 80 | 79 |
| SEO On-Page | 20% | 84 | 81 |
| Schema | 10% | 89 | 86 |
| Performance | 10% | 98 | 98 |
| Busca por IA | 10% | 80 | 75 |
| Imagens | 5% | 90 | 82 |

## Resumo executivo

O site está tecnicamente limpo: 79/79 URLs com status 200, canonicals corretos, nenhum título ou meta duplicado, JSON-LD válido em todas as páginas e PSI mobile de 99–100. O Google está respondendo: as impressões semanais foram de 327 (semana de 28/09) para 3.509 (semana de 16/11), e os cliques de 4 para 47.

O risco desta semana não é técnico, e sim **comercial e com prazo**: a Black Friday é em 27/11 e:

1. **10 links de afiliado com problema.** 3 não abrem produto e 7 abrem outro anúncio. O `1RWrc8a`, usado em 5 posts de coleira GPS, agora abre um kit de tag para Apple/iPhone; o `1KigM7V` da ração de cachorro abre uma ração terapêutica Royal Canin Gastrointestinal Low Fat.
2. **/black-friday-pet/ só recebe 1 link interno** (a home). As páginas que já têm impressões não passam autoridade nem visitantes para ele.
3. **29 preços divergem 5% ou mais** do valor atual, por exemplo a tag rastreadora a R$ 151–159 no texto contra R$ 90 agora.

Depois disso, os achados são de ajuste fino: as rações (cachorro na pos 10 com 444 impr. e CTR de 0,45%; gato na pos 21,8 com 2 links de entrada), o `<main>` ausente em 74/77 páginas e 7 metas longas.

### Top 5 problemas
1. [Alto] Links de afiliado mortos ou trocados (10), a 3 dias da Black Friday
2. [Alto] /black-friday-pet/ com 1 link interno de entrada
3. [Médio] 29 preços desatualizados em 5% ou mais
4. [Médio] Rações: posição fraca e poucos links internos
5. [Médio] 74/77 páginas sem `<main>` e falha de contraste (acessibilidade 94–96)

### Top 5 ganhos rápidos
1. Trocar os 10 meli.la (lista em `reports/price-monitor/latest.md`)
2. Bloco de link "Ofertas de Black Friday" nos 8–10 posts com mais impressões (temporário)
3. 3–5 links contextuais para cada ração
4. `<div>` → `<main>` no wrapper de conteúdo do template
5. `AddDefaultCharset UTF-8` no .htaccess

## Técnico (95)
- Funcionando: sitemap com 79 URLs + 262 imagens, 0 erros no GSC; robots.txt com Content-Signal; HSTS e headers de segurança; IndexNow, feed.xml e llms.txt no ar; o 301 de câmera funciona.
- [Baixo] `content-type: text/html` sem charset. O `<meta charset>` vem no byte 721, então o Google decodifica certo, mas clientes HTTP simples recebem os acentos corrompidos.
- [Info] /melhor-camera-para-monitorar-pet/ (301 desde 17/11) ainda tem 221 impr./28 dias: é a consolidação normal do Google.

## Conteúdo (80)
- Funcionando: mediana de 1.511 palavras; divulgação honesta do método ("Não testamos…", com data da consulta), o que resolve o achado de 17/11; alerta da FDA e seções Credeli no antipulgas.
- [Alto] Links de afiliado: ver Top 5.
- [Médio] 29 preços divergentes.
- [Baixo] Páginas institucionais rasas: /contato/ 192 palavras, /politica-editorial/ 236, /sobre/ 385.
- [Baixo] 27 posts com dateModified de 22/08.

## On-Page (84)
- [Alto] Black Friday quase órfão.
- [Médio] Rações: melhor-racao-para-gato com 2 links de entrada e pos 21,8; "melhor ração para cachorro" com 89 impr., pos 9,8 e 0 cliques.
- [Baixo] Metas com mais de 160 caracteres: autor (194), seresto (169), configurar-app (166), brinquedo-gato, camera-para-monitorar, camera-petisco, camera-x-coleira, como-funciona. Títulos de 66 caracteres: seresto e como-funciona.

## Schema (89)
BlogPosting + BreadcrumbList + FAQPage em 73 posts, ItemList em 20, Product/Review em 7, e Organization e Person com sameAs. Nada a corrigir. O FAQPage não gera rich result, mas serve para extração por IA. O aviso de hasMerchantReturnPolicy é mantido por decisão.

## Performance (98)
PSI mobile: home 99 (LCP 1,7 s), posts 99–100 (LCP 0,8 s), 263 KiB por post. Ainda sem dados de campo do CrUX, porque o tráfego é baixo.

## Imagens (90)
Todas as imagens dos posts têm alt e dimensões; heros em WebP com srcset; max-image-preview:large. Os cards da home com alt="" estão corretos, por serem decorativos.

## Busca por IA (80)
Crawlers de IA liberados, llms.txt completo, e o ChatGPT é a 2ª fonte de tráfego. Faltam o `<main>` (landmark-one-main) e menções de terceiros além do Facebook.

## Google Search Console (28 dias)
88 cliques, 7.348 impressões, 78 páginas com impressões.

| Página | Cliques | Impr. | Pos. |
|---|---|---|---|
| configurar-app-comedouro-wifi | 29 | 870 | 4,4 |
| bebedouro-inox-x-ceramica | 3 | 623 | 5,7 |
| melhor-racao-para-cachorro | 2 | 444 | 10,0 |
| coleira-gps-para-gato | 6 | 426 | 8,9 |
| melhor-antipulgas-para-cachorro | 0 | 264 | 12,0 |
| melhor-bebedouro-automatico-pet | 4 | 260 | 8,0 |
| coleira-gps-para-pet | 1 | 255 | 11,9 |
| camera-pet-grava-sem-internet | 0 | 105 | 7,5 |

- `bebedouro-inox-x-ceramica`: 623 impr. na pos 5,7 com só 3 cliques (CTR 0,5%). Fica congelado até ~15/12 (canibalização com o ranking de bebedouro), mas é o próximo candidato a reescrita de título.
- Credeli: "credeli ou simparic" (32 impr., pos 22) e "credeli ou nexgard" (19, pos 33) caem no antipulgas geral. As seções novas são de 23/11; reavaliar em ~15/12 antes de criar uma página própria.
- Queries em inglês sem relação ("neutrogena pet camera review" etc.) inflam as impressões das páginas de câmera. É ruído.
- Atualizações do Google desde outubro: só mudanças de documentação, nenhum core update. Não há fator externo a atribuir.
