# Performance / Core Web Vitals - smartpetgadgets.com.br

**Run:** 2026-10-23 (delta vs 2026-10-22). Live PSI v5 API (Lighthouse 13.5.0), mobile + desktop, 5 URLs, via `pagespeed_check.py`. Auth check: PSI, CrUX, CrUX History all reported "OK" by `google_auth.py --check`.
**Field data (CrUX): STILL UNAVAILABLE.** Every `queryRecord` call returned `403 Forbidden` (same as 2026-10-22). This is a permission/API-enablement error, not a 404 for low traffic. All numbers below are LAB data. CWV pass/fail is lab-inferred, not field-confirmed.

## Lab results (Lighthouse 13.5.0)

| Page | Strat | Perf | LCP | FCP | TBT | CLS | Weight |
|---|---|---|---|---|---|---|---|
| / | mobile | 100 | 1.6s | 1.0s | 0ms | 0 | 761 KiB |
| / | desktop | 100 | 0.4s | 0.3s | 0ms | 0 | 2,097 KiB |
| /melhor-tapete-higienico-para-cachorro/ | mobile | 100 | 1.1s | 0.9s | 0ms | 0 | 112 KiB |
| same | desktop | 100 | 0.3s | 0.3s | 0ms | 0 | 153 KiB |
| /melhor-comedouro-automatico-cachorro/ | mobile | 100 | 0.8s | 0.8s | 0ms | 0 | 115 KiB |
| same | desktop | 100 | 0.3s | 0.3s | 0ms | 0 | 157 KiB |
| /coleira-gps-cachorro-que-foge/ | mobile | 100 | 0.8s | 0.8s | 0ms | 0 | 48 KiB |
| same | desktop | 100 | 0.3s | 0.2s | 0ms | 0 | 48 KiB |
| /melhor-antipulgas-para-cachorro/ | mobile | 100 | 1.1s | 0.8s | 0ms | 0 | 86 KiB |
| same | desktop | 100 | 0.5s | 0.4s | 0ms | 0 | 110 KiB |

INP cannot be measured in the lab. TBT of 0ms on all pages (no third-party JS, one 4 KB deferred script) is a strong proxy, so INP risk is negligible. Server response: 10-20ms. Accessibility 93-94, Best Practices 100, SEO 100 on all pages.

## Delta vs 2026-10-22

- Home mobile LCP 1.38s -> 1.6s (+0.2s, run-to-run variance; still Good, score 99 for the metric). Home mobile weight is unchanged at 761 KiB. FCP 0.83s -> 1.0s.
- Coverage expanded: the 4 target posts were not tested last time (anti-formiga and coleira-gps-para-pet were). The tapete rewrite (7 products, 9 imgs, 22,835px tall mobile page) did NOT regress: 100, LCP 1.1s, CLS 0, 112 KiB.
- Overall score 100 on every page, unchanged. No new regressions.
- CrUX 403 persists (open for at least 2 runs).
- New: Lighthouse insight audits flagged on inner pages (see findings). The earlier run reported none.

## Findings

### Medium - CrUX field data blocked (403), second consecutive audit
CWV status for the ranking signal (75th percentile real users) is unverified. Fix: enable `chromeuxreport.googleapis.com` in the GCP project for the API key used by the scripts (check API-key restrictions; the service account is not what CrUX uses, it needs an API key with the API allowed). Re-run `pagespeed_check.py --crux-only` and `crux_history.py`. If it then returns 404, the origin lacks CrUX traffic and lab is the only signal.

### Low - LCP request discovery flagged on 3 pages (`lcp-discovery-insight`, score 0)
Seen on /melhor-comedouro-automatico-cachorro/ (desktop), /coleira-gps-cachorro-que-foge/ (desktop), /melhor-antipulgas-para-cachorro/ (mobile + desktop). Source check: comedouro and coleira heroes have `loading="eager"` but NO `<link rel=preload>` and NO `fetchpriority="high"`; the antipulgas hero is eager but also has no fetchpriority/preload. The tapete page has both (preload + fetchpriority + srcset 480/800/1200w, with webp variants on disk), and is not flagged. Fix: add `fetchpriority="high"` to the hero `<img>` on these three pages (and ideally preload). Impact: 50-150ms LCP on slow mobile; LCP is already under 1.2s.

### Low - Image delivery flagged (`image-delivery-insight`)
- Home mobile: est. 400 KiB savings; desktop weight 2,097 KiB. 72 `<img>` on the home (71 lazy), so the desktop viewport pulls many card thumbnails. Add `srcset`/smaller card thumbnails (cards render about 300px wide) and cap the cards loaded eagerly.
- /melhor-antipulgas-para-cachorro/: hero `simparic-caixa.webp` is declared 1200x1200 and also used as a 140x140 thumbnail; the 140px `bravecto-caixa.webp` wastes about 19 KiB and the hero about 35 KiB. Serve a properly sized hero (e.g. 800w) and 280w thumbnails. Est. 52 KiB.
- /coleira-gps-cachorro-que-foge/ 27 KiB, /melhor-comedouro-automatico-cachorro/ 29 KiB (desktop): hero sizing/compression.
- Note: HTML references `.jpg` on tapete and comedouro posts (hero, product shots; 40-113 KiB each as JPG); the live server delivers `.webp` (Lighthouse fetched `.webp`, 44-58 KiB), evidently via server-side negotiation. Make sure this negotiation sends `Vary: Accept`, or reference WebP directly via `<picture>` / `.webp` src to be cache/CDN-safe. The tapete page has 9 imgs and about 1.2 MiB of images on disk (jpg + webp), but only about 100 KiB transferred on first load because the product images are lazy. Fine.

### Low - Cache lifetime 7 days (`cache-insight`)
All static assets use `max-age=604800` (Expires +7d). Est. savings 4-75 KiB on repeat visits (75 KiB on home). Raise images and `theme-toggle.js?v=N` (already versioned) to `max-age=31536000, immutable`.

### Informational - Accessibility items seen in the same runs (not CWV)
`color-contrast` (e.g. "Ver preco" buttons) and `landmark-one-main` (no `<main>`) fail on all pages. Home also scores 93 vs 94. Not performance, but cheap to fix.

## Structural strengths (unchanged)
Inlined CSS, no render-blocking resources, no third-party scripts, system font stack, explicit width/height on imgs (CLS 0 everywhere), DOM size small (695 elements on home), affiliate links are plain anchors, server response 10-20ms.

## Prioritized recommendations
1. (Medium) Fix CrUX API access (API key + enable API) to get field LCP/INP/CLS.
2. (Low) `fetchpriority="high"` + preload on heroes of comedouro-cachorro, coleira-gps-cachorro-que-foge, antipulgas.
3. (Low) Right-size antipulgas hero/thumbnails; add srcset to home card thumbnails.
4. (Low) Long cache lifetimes for static assets; confirm `Vary: Accept` on jpg->webp negotiation.

## Score: 95/100
Lab score is 100 on all 10 runs. Deduction is for the unverified field data (CrUX 403) and minor image/LCP-discovery hygiene.
