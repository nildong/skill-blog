# Performance - smartpetgadgets.com.br
Coleta 2026-11-17 via PageSpeed Insights API (Lighthouse 13.6.0, lab, mobile + desktop, 9 páginas). Campo (CrUX): 404, origem sem tráfego Chrome suficiente (esperado); lcp_subparts também 404. CWV de campo ainda não verificável.

**Nota Performance: 98/100** (média mobile das 9 páginas = 98,8; desktop = 98,9). Anterior (06/11): 99 (amostra diferente, 6 páginas). Severidade geral: BAIXA (1 achado médio).

| Página | Mobile | LCP | TBT | CLS | Desktop | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| / (home) | 99 | 1,7 s | 30 ms | 0,001 | 100 | 0,5 s | 10 ms | 0 |
| /melhor-racao-para-gato/ | 100 | 0,8 s | 20 ms | 0 | 100 | 0,7 s | 30 ms | 0 |
| /melhor-racao-para-cachorro/ | 100 | 0,8 s | 10 ms | 0 | 100 | 0,3 s | 20 ms | 0 |
| /melhor-bebedouro-automatico-pet/ | 100 | 0,9 s | 20 ms | 0 | 100 | 0,3 s | 60 ms | 0 |
| /comedouro-automatico-para-pet/ | 100 | 1,0 s | 20 ms | 0 | 100 | 0,3 s | 30 ms | 0 |
| /camera-pet-com-dispensador-de-petisco/ | 100 | 1,3 s | 0 ms | 0 | 100 | 0,3 s | 10 ms | 0 |
| /coleira-gps-para-gato/ | 100 | 0,8 s | 70 ms | 0 | 98 | 0,3 s | 120 ms | 0 |
| /configurar-app-comedouro-wifi/ | 100 | 0,8 s | 30 ms | 0 | 100 | 0,6 s | 0 ms | 0 |
| /bebedouro-inox-x-ceramica/ | **95** | **2,7 s** | 120 ms | 0 | 96 | 0,3 s | 160 ms | 0 |

Status CWV (lab): LCP, TBT (proxy de INP) e CLS no verde em 8/9 páginas. Inox x cerâmica: LCP 2,7 s no mobile = Needs Improvement (limite 2,5 s). INP não é medível em lab; TBT 0-160 ms = risco baixo. Acessibilidade 94-96, Best Practices 100, SEO 100.

## Comparação com 06/11
| Item | 06/11 | 17/11 |
|---|---|---|
| Nota média mobile | 99 | 98,8 (9 págs.) |
| bebedouro-automatico-pet | 99, LCP 0,9 s, TBT 130 | 100, LCP 0,9 s, TBT 20 |
| bebedouro-inox-x-ceramica | 100, LCP 1,2 s, TBT 50 | 95, LCP 2,7 s, TBT 120 (REGRESSÃO) |
| home | 99, LCP 1,7 s | 99, LCP 1,7 s (igual) |
| CLS | 0-0,001 | 0-0,001 |

## Impacto de affiliate-cta.js e gtag diferido
- affiliate-cta.js (`/affiliate-cta.js?v=1`, `defer`): sem regressão. Posts com ele (coleira-gps-para-gato, câmera, bebedouro etc.) têm CLS 0 e TBT 0-70 ms mobile. Barra fixa não gera shift.
- gtag diferido: continua a única fonte relevante de main-thread. No inox x cerâmica, gtag/js = 274 ms de execução (scripting 195 ms + parse 77 ms), 182 KB transferidos; é a origem do TBT 120 ms e do unused-javascript (450 ms). Na home TBT é 30 ms, ok. Aceitável, mas é o próximo teto de TBT (desktop: coleira-gps 120 ms, inox 160 ms).

## Findings
1. **MÉDIA - /bebedouro-inox-x-ceramica/: LCP 2,7 s mobile (era 1,2 s).** Hero `<picture>` com um único `srcset` (`img/...-hero.webp`, 66 KB, 1200w) mesmo existindo `-400w.webp` (11 KB) e `-800w.webp` (31 KB) na pasta; sem `fetchpriority="high"` e sem `<link rel="preload">` (audit lcp-discovery-insight reprovado; image-delivery estima -45 KiB). Correção: `srcset` 400w/800w/1200w + `sizes`, `fetchpriority="high"` no hero e preload com imagesrcset (padrão do bebedouro-automatico-pet). Esperado: LCP < 1,5 s, score ~99-100.
2. **BAIXA - TBT 100-160 ms em inox x cerâmica e coleira-gps-para-gato (desktop)** por gtag/js. Já após load; ganho adicional pequeno.
3. **BAIXA - home: LCP 1,7 s (mobile)**, imagens eager sem fetchpriority; tolerável.
4. **BAIXA - cache:** 7 KiB de economia; usar `immutable` em assets versionados.
5. **BAIXA (A11y) - inox x cerâmica sem landmark `main`** e contraste de cor insuficiente em algum elemento.
6. **INFO - sem dados de campo (CrUX 404).** Revalidar com tráfego.

## Prioridades
1. Corrigir hero do inox x cerâmica (item 1).
2. Auditar posts sem `fetchpriority` no hero (configurar-app-comedouro-wifi e inox x cerâmica não têm).
3. Revalidar em campo quando CrUX tiver dados.
