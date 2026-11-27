# Performance - smartpetgadgets.com.br
Coleta 2026-11-04 via PageSpeed Insights (Lighthouse 13.6.0, lab). Campo (CrUX): sem dados (origem sem tráfego Chrome suficiente; 404). Validar CWV em campo ainda não é possível.

**Nota Performance: 96/100** (lab, média mobile 5 páginas = 95,8; desktop 99,2). Anterior (29/10): 90.

| Página | Mobile | LCP | TBT | CLS | Desktop | LCP desk |
|---|---|---|---|---|---|---|
| / (home) | 99 | 1,7 s | 40 ms | 0,001 | 100 | 0,5 s |
| /melhor-comedouro-automatico-cachorro/ | 100 | 0,8 s | 80 ms | 0 | 99 | 0,7 s |
| /melhor-bebedouro-automatico-pet/ | 90 | 3,5 s | 120 ms | 0 | 99 | 0,7 s |
| /melhor-antipulgas-para-cachorro/ | 90 | 3,5 s | 110 ms | 0 | 99 | 0,9 s |
| /coleira-gps-para-pet/ | 100 | 0,8 s | 30 ms | 0 | 99 | 1,0 s |

INP: não medível em lab (TBT 30-120 ms, baixo risco). CLS: Good em todas. Accessibility 96, Best Practices 100, SEO 100 na home.

## Impacto do commit 9ccf3a3 (miniaturas WebP na home)
Positivo e confirmado. Home mobile 92 -> 99, LCP 2,7 s -> 1,7 s, peso total 1.132 KiB -> 375 KiB (-67%), desktop 95 -> 100 (TBT 130 -> 50 ms). A previsão de 400-500 KiB foi superada. Resta a home com 7 imagens `loading="eager"` e nenhum `fetchpriority`/preload no HTML (ver F4).

## Findings
1. **ALTA - bebedouro: preload errado anula o ganho (LCP 3,5 s).** `<link rel="preload" as="image" href="...-800w.jpg">` mas o `<picture>` serve `.webp` (source image/webp). Browser baixa o JPG (44 KB) à toa e o WebP (20 KB) só depois, no caminho normal. Correção: preload do WebP com `imagesrcset`/`imagesizes` espelhando o `<source>` (`type="image/webp"`), ou remover o preload e manter só `fetchpriority="high"` na `<img>`.
2. **ALTA - antipulgas: hero é caixa de produto 1200x1200 (50 KB, ~35 KB desperdiçados por Lighthouse), sem `fetchpriority`/preload (insight "LCP request discovery" reprovado), LCP 3,5 s.** Correção: gerar 480w/800w WebP com `srcset`/`sizes` (exibido em ~760 px no máximo), adicionar `fetchpriority="high"` e preload com imagesrcset. Esperado: LCP < 2,5 s e score ~98.
3. **MÉDIA - GA4 gtag (googletagmanager) é o único JS de terceiros relevante.** 181 KB, 76 KB não usados, e responsável pelas long tasks (92-124 ms em ~2,5 s) que geram TBT 110-120 ms e "Reduce unused JavaScript" (-300 ms). Correção: carregar gtag após `load`/idle ou na primeira interação (ou aceitar o custo: impacto no score é pequeno nas páginas boas).
4. **BAIXA - home: 7 imagens eager sem `fetchpriority`.** Manter eager só no LCP (com `fetchpriority="high"`), lazy nas demais.
5. **BAIXA - cache: max-age=604800 (7 dias) em imagens e JS (theme-toggle.js?v=2).** Aceitável; para assets versionados/imutáveis usar `max-age=31536000, immutable`. Compressão e HTTP/2 OK (LiteSpeed).
6. **INFO - sem dados de campo.** Revalidar com CrUX quando houver tráfego; lab mobile simulado é conservador.
7. **INFO - posts comedouro-cachorro e coleira-gps-para-pet** já são referência (LCP 0,8 s, score 100); replicar o padrão de hero/preload deles nos demais posts.

## Comparação com 29/10
Home 92 -> 99 (regressão resolvida). Posts de amostra anteriores (86-96, LCP 2,7-3,6 s) são outros URLs; nos 4 posts desta rodada, 2 estão ótimos e 2 (bebedouro, antipulgas) repetem o padrão LCP ~3,5 s por problema de hero. TBT ligado ao gtag persiste (30-120 ms).

## Prioridades
1. Corrigir preload/hero do bebedouro e antipulgas (maior ganho: +8-10 pts e LCP Good).
2. Auditar os demais posts com hero JPG/preload divergente do `<picture>`.
3. Diferir gtag.
4. fetchpriority/lazy na home; cache immutable.
