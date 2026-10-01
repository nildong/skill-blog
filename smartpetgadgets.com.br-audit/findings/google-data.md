# Google API Field Data — smartpetgadgets.com.br
Data pulled: 2026-09-30 | Tier 1 (API key + service account); GA4 not configured, skipped.
Property used: `https://smartpetgadgets.com.br/` (URL-prefix property, confirmed per 2026-09-29 fix).

## Credential/Service Status
- PSI: available (API key)
- CrUX (single-period, origin): **403 Forbidden** — `chromeuxreport.googleapis.com/v1/records:queryRecord`
- CrUX History (origin, 25-week): **403 Forbidden** — `chromeuxreport.googleapis.com/v1/records:queryHistoryRecord`
- GSC (Search Analytics, Sitemaps, URL Inspection): available (service account `srv-blogs@smartpetgadgets-seo.iam.gserviceaccount.com`)
- GA4: not configured (no property ID) — skipped per instructions

### CrUX note
Both CrUX origin-level endpoints returned 403 rather than the expected 404. A 404 would mean "insufficient Chrome traffic" (normal for a low-traffic site); a 403 suggests the Chrome UX Report API may not be enabled/authorized for this API key/project, or the key is restricted. This is worth checking in Google Cloud Console (enable "Chrome UX Report API" for the project tied to the configured API key) — it is not a site-side indexation or CWV problem. Field CWV data was therefore unavailable; falling back to PSI lab data only.

## PSI Lab Data (homepage, mobile)
- Performance score: 99/100
- Accessibility: 93/100 | Best Practices: 100/100 | SEO: 100/100
- LCP (lab): 1,990 ms — Good
- CLS (lab): 0 — Good
- TBT (lab): 0 ms — Good
- Field metrics block in PSI response was empty (consistent with the CrUX 403s above — no field data surfaced for this origin via PSI either).

Source: Google API (lab data only; field data unavailable this run).

## GSC Search Analytics — Last 28 Days (2026-09-02 to 2026-09-27)
Source: Google API (GSC, `totals_complete: true` — site-wide total, safe to report as-is)

| Metric | Value |
|---|---|
| Clicks | 9 |
| Impressions | 442 |
| CTR | 2.04% |
| Avg. position | 11.2 |

Note: the site-wide total (clicks=9, impressions=442) is higher than the sum of the 33 returned query/page rows (impressions summed ≈ 73), because GSC's query-level rows omit anonymized low-volume queries. The totals block, not the row sum, is the correct site-wide figure — no quick-win queries (position 5-15 with meaningful impressions) were flagged by the tool's own `quick_wins` field (returned empty), though some individual rows sit in that range at very low volume (see table below).

### Top Query/Page Rows by Impressions (sample of 33 returned rows, all 0 clicks)
| Query | Page | Impr. | Avg. Position |
|---|---|---|---|
| cerca virtual para cachorro | /cerca-virtual-para-cachorro/ | 20 | 11.1 |
| câmera para monitorar pet | /duvidas-camera-para-monitorar-pet/ | 5 | 36.8 |
| qual a melhor coleira com gps para gatos | /coleira-gps-para-gato/ | 4 | 18.8 |
| qual a melhor coleira com gps para gatos | /coleira-gps-para-pet/ | 4 | 68.0 |
| vdrbg | /comedouro-vdrbg-4l-wifi-review/ | 4 | 7.8 |
| bebedouro de agua pet automatico | /melhor-bebedouro-automatico-pet/ | 2 | 22.0 |
| camera para vigiar pet | /camera-para-monitorar-pet/ | 2 | 50.5 |
| camera pet | /melhor-camera-para-monitorar-pet/ | 2 | 34.5 |
| cat feeder | / (homepage) | 2 | 52.5 |
| comedoro e bebedouro | /comedouro-x-bebedouro-automatico/ | 2 | 26.5 |
| comedouro interativo para gato | /melhor-comedouro-interativo-gato/ | 2 | 37.0 |
| vdrbg | /melhor-comedouro-automatico-cachorro/ | 2 | 10.5 |
| alimentador pet | / (homepage) | 2 | 44.5 |

Observation: the near-total absence of clicks (0/33 rows have clicks; site total is only 9 clicks across 442 impressions, CTR 2.04%) combined with most average positions sitting in the 20-65 range confirms this is a ranking/visibility problem, not an indexation problem — consistent with the user's 2026-09-28/09-30 confirmation of 100% indexation. The one clear exception, "cerca virtual para cachorro" at position 11.1 with 20 impressions and 0 clicks, is the closest thing to a near-page-1 keyword and is a candidate for on-page/title optimization to push into top 10 and start earning clicks.

## GSC Sitemap Status
- Sitemap: `https://smartpetgadgets.com.br/sitemap.xml`
- Last submitted: 2026-08-26T21:53:30.968Z
- Errors: 0 | Warnings: 0
- Submitted URLs: 77 (web type)

## URL Inspection Sample (5 URLs)
All 5 returned verdict **PASS** (indexed, no issues), corroborating the user's manual GSC confirmation:
- https://smartpetgadgets.com.br/ — PASS
- https://smartpetgadgets.com.br/cerca-virtual-para-cachorro/ — PASS
- https://smartpetgadgets.com.br/coleira-gps-para-gato/ — PASS
- https://smartpetgadgets.com.br/melhor-bebedouro-automatico-pet/ — PASS
- https://smartpetgadgets.com.br/camera-para-monitorar-pet/ — PASS

## GA4
Not configured (`ga4_property_id` missing from `~/.config/claude-seo/google-api.json`). Skipped per task scope; would unlock organic landing-page traffic and conversion data once a GA4 property ID is added.

## Data Freshness Notes
- GSC: 2-3 day lag (date range above ends 2026-09-27)
- CrUX: would be 28-day rolling if available; unavailable this run (403s, see above)
- PSI: real-time lab run at time of this pull (2026-09-30)
