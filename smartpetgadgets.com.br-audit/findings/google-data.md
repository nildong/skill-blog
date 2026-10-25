# Google API Field Data — smartpetgadgets.com.br
Pulled: 2026-10-23 | Tier 1 (API key + service account) | GA4 not configured (skipped)
Property: `https://smartpetgadgets.com.br/` (URL-prefix). Baseline for delta: google-api.md (window 2026-09-24..10-19, pulled ~2026-10-22).
Note: the claude-seo runtime had to be rebuilt (`claude-seo setup`, isolated venv) before the tools would run.

## GSC Search Analytics (source: Google API, totals_complete: true)
Current = 2026-09-23..2026-10-20 (28d). Previous = 2026-08-26..2026-09-22 (28d). GSC lag 2-3 days.

| Metric | Current 28d | Previous 28d | Change | Baseline (10-22) | Delta vs baseline |
|---|---|---|---|---|---|
| Clicks | 34 | 4 | +750% | 31 | +3 |
| Impressions | 2,690 | 162 | +1,561% | 2,549 | +141 |
| CTR | 1.26% | 2.47% | -1.21 pt | 1.22% | +0.04 pt |
| Avg position | 10.0 | 11.6 | 1.6 better | 10.1 | 0.1 better |

Impressions grew ~16x period over period (pages with impressions: 52 -> 77, i.e. every indexed post now surfaces). CTR fell only because impressions grew mostly at positions 10-20 with 0 clicks. Versus the 10-22 baseline the change is marginal (+3 clicks, window shifted 1 day).

### Query distribution (109 query rows; rows sum to 403 impressions of 2,690 total, rest anonymized — do not use sum as total)
- Page 1 (pos <=10): 29 queries (27%); 67 of 403 row-impressions (17%)
- Page 2 (11-20): 22 queries; Beyond 20: 58 queries
- Baseline (100 queries): 26 / 21 / 53 -> slight improvement in count, same structure: page-1 queries are long-tail, ~1-3 impressions.
- Only 3 queries produced clicks: "vdrbg" (1, 28 imp, pos 6.4), "como conectar wi-fi" (1), "divipets" (1). Nearly all clicks are branded/ultra-long-tail.

### Top queries by impressions
| Query | Impr | Pos | Clicks |
|---|---|---|---|
| qual a melhor coleira com gps para gatos | 58 | 17.4 | 0 |
| camera pet | 36 | 28.7 | 0 |
| bebedouro inox ou plástico | 30 | 13.7 | 0 |
| vdrbg | 28 | 6.4 | 1 |
| cerca virtual para cachorro | 25 | 10.3 | 0 |
| câmera para monitorar pet | 22 | 24.2 | 0 |
| melhor comedouro automático para gatos | 22 | 45.5 | 0 |
| credeli ou simparic qual o melhor | 8 | 39.4 | 0 |

### Top pages (current vs previous 28d)
| Page | Clicks | Impr | CTR | Pos | Prev impr / pos |
|---|---|---|---|---|---|
| /configurar-app-comedouro-wifi/ | 8 | 329 | 2.43% | 4.8 | 22 / 6.8 |
| /bebedouro-inox-x-ceramica/ | 4 | 264 | 1.52% | 8.3 | 22 / 8.1 |
| /camera-para-monitorar-pet/ | 0 | 118 | 0% | 17.5 | 2 / 39 |
| /coleira-gps-para-gato/ | 0 | 96 | 0% | 10.6 | 2 / 9.5 |
| /comedouro-automatico-para-dois-gatos/ | 0 | 96 | 0% | 7.0 | 6 / 8.2 |
| /comedouro-vdrbg-4l-wifi-review/ | 1 | 80 | 1.25% | 6.5 | 4 / 9 |
| /melhor-antipulgas-para-cachorro/ | 0 | 80 | 0% | 17.3 | new |
| /comedouro-automatico-faz-mal/ | 4 | 70 | 5.71% | 6.3 | 3 / 11.7 |
| /brinquedo-interativo-pilha-x-recarregavel/ | 0 | 68 | 0% | 6.5 | 5 / 8.2 |
| /cerca-virtual-para-cachorro/ | 0 | 52 | 0% | 9.5 | 13 / 10.7 |
| /melhor-comedouro-automatico-cachorro/ | 0 | 39 | 0% | 21.6 | 6 / 7.7 (regressed) |
| /melhor-tapete-higienico-para-cachorro/ | 0 | 26 | 0% | 19.7 | not present |

Page-1 pages with zero clicks despite pos 6-10 (title/snippet CTR opportunity): comedouro-automatico-para-dois-gatos (96 impr, pos 7.0), brinquedo-interativo-pilha-x-recarregavel (68, 6.5), coleira-gps-para-gato (96, 10.6), soprador-para-pet (58, 8.6), cerca-virtual-para-cachorro (52, 9.5).

## URL Inspection (10 URLs) — all PASS, "Submitted and indexed", INDEXING_ALLOWED, robots ALLOWED, canonical match true
| URL | Last crawl (UTC) | Rich results |
|---|---|---|
| / | 2026-10-23 | n/a |
| /melhor-tapete-higienico-para-cachorro/ | 2026-10-23 11:14 (recrawled after rewrite) | PASS, Product snippets (7+ items, 0 issues) |
| /melhor-comedouro-automatico-cachorro/ | 2026-10-11 | PASS |
| /cerca-virtual-para-cachorro/ | 2026-09-28 (stale, 25 days) | PASS |
| /melhor-antipulgas-para-cachorro/ | 2026-09-30 (23 days) | PASS |
| /configurar-app-comedouro-wifi/ | 2026-10-19 | PASS |
| /bebedouro-inox-x-ceramica/ | 2026-10-23 | PASS |
| /comedouro-automatico-faz-mal/ | 2026-10-18 | PASS |
| /camera-para-monitorar-pet/ | 2026-10-23 | PASS |
| /coleira-gps-para-pet/ | 2026-10-17 | PASS |
Delta: indexation unchanged (100% of sampled). Notable: melhor-tapete and melhor-comedouro-automatico-cachorro were edited recently; tapete recrawled today, comedouro-cachorro last crawled 10-11 (predates/near the 10-2x product update — consider requesting reindex). cerca-virtual and antipulgas crawls are >3 weeks old.

## Sitemaps
/sitemap.xml: 78 web URLs submitted, 0 errors, 0 warnings, not pending. Last submitted 2026-08-26 (unchanged vs baseline; sitemap content has since changed locally — resubmit to prompt a re-read).

## CrUX / PSI
- CrUX History (origin and /melhor-tapete-higienico-para-cachorro/): still **403 Forbidden** (unchanged). Not a low-traffic 404: enable "Chrome UX Report API" on GCP project smartpetgadgets-seo / check key restrictions. No field CWV available; PSI field block empty.
- PSI lab, homepage mobile (Lighthouse 13.5): Performance 100, Accessibility 93, Best Practices 100, SEO 100; LCP 1.7 s, CLS 0, TBT 0 ms (all Good). Baseline was 100 / LCP 1.4 s: no meaningful change.

## Priorities
1. High: CTR/snippet work on page-1 zero-click pages (list above); recent confirmed gain is impressions, not clicks.
2. High: melhor-comedouro-automatico-cachorro fell from pos 7.7 (6 impr) to 21.6 (39 impr) — monitor post-update; request reindex.
3. Medium: resubmit sitemap; request indexing for cerca-virtual and antipulgas (stale crawls).
4. Low: fix CrUX 403 (config).
