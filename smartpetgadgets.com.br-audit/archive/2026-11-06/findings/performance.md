# Performance - smartpetgadgets.com.br
Coleta 2026-11-06 via PageSpeed Insights API (Lighthouse 13.6.0, lab, mobile). Campo (CrUX): sem dados (404, origem sem tráfego Chrome suficiente). Validar CWV em campo ainda não é possível.

**Nota Performance: 99/100** (lab, média mobile de 6 páginas = 98,7). Anterior (04/11): 96. Obs.: amostra difere um pouco (comedouro-cachorro não remedido; 2 posts com affiliate-cta.js incluídos). Mesmas 4 páginas de 04/11: 98,3 vs 94,8.

| Página | Mobile | LCP | TBT | CLS | Delta vs 04/11 |
|---|---|---|---|---|---|
| / (home) | 99 | 1,7 s | 30 ms | 0,001 | = (99; TBT 40 -> 30) |
| /melhor-bebedouro-automatico-pet/ | 99 | 0,9 s | 130 ms | 0 | +9 pts (90 -> 99), LCP 3,5 -> 0,9 s |
| /melhor-antipulgas-para-cachorro/ | 95 | 2,8 s | 110 ms | 0 | +5 pts (90 -> 95), LCP 3,5 -> 2,8 s |
| /coleira-gps-para-pet/ (pilar GPS) | 100 | 0,8 s | 40 ms | 0 | = (100) |
| /bebedouro-inox-x-ceramica/ (CTA sticky) | 100 | 1,2 s | 50 ms | 0 | novo |
| /camera-para-monitorar-pet/ (CTA sticky) | 99 | 0,8 s | 100 ms | 0 | novo |

## Delta vs 2026-11-04
| Item | 04/11 | 06/11 |
|---|---|---|
| Nota média mobile | 96 | 99 |
| Bebedouro LCP | 3,5 s (preload JPG errado) | 0,9 s (preload WebP com imagesrcset + fetchpriority=high) - F1 resolvido |
| Antipulgas LCP | 3,5 s | 2,8 s - melhorou, ainda acima de 2,5 s - F2 parcial |
| Home TBT | 40 ms | 30 ms (gtag após load, commit 0206b8a) |
| CLS | Good | Good (0 a 0,001) |

INP: não medível em lab; TBT 30-130 ms, baixo risco. Acessibilidade 93-96, Best Practices 100, SEO 100.

## Verificação affiliate-cta.js (deploy 05/11)
Sem regressão. Nos 2 posts com barra fixa mobile e CTA no topo: CLS 0, TBT 50 e 100 ms (dentro da faixa das demais páginas, 30-130 ms), LCP 0,8-1,2 s, score 99-100. O script usa `defer` (`/affiliate-cta.js?v=1`) e não bloqueia render. Risco residual: INP do clique no evento GA4 `affiliate_click` só é verificável em campo.

## Findings
1. **MÉDIA - antipulgas: LCP 2,8 s (Needs Improvement no lab).** Único gargalo; unused-javascript (-300 ms) sinalizado. Revisar hero (srcset 480w/800w WebP, fetchpriority="high", preload com imagesrcset) conforme o padrão do bebedouro. Esperado: LCP < 2,0 s, score ~99.
2. **BAIXA - TBT 100-130 ms em posts (bebedouro 130, antipulgas 110, câmera 100)** pelo gtag (GA4), já diferido após load; ganho adicional pequeno. Aceitável.
3. **BAIXA - home: imagens eager sem fetchpriority** (ver 04/11 F4); LCP 1,7 s já bom.
4. **BAIXA - cache 7 dias em imagens/JS;** usar immutable em assets versionados.
5. **INFO - sem dados de campo (CrUX 404).** Revalidar quando houver tráfego.

## Prioridades
1. Replicar o padrão de hero/preload do bebedouro na antipulgas.
2. Auditar outros posts com preload divergente do `<picture>`.
3. Remedir comedouro-cachorro e re-rodar após ajustes.
