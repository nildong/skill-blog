# Google API Field Data — smartpetgadgets.com.br

Data source: Google Search Console API, PageSpeed Insights v5, Chrome UX Report (CrUX) API, CrUX History API. Credentials tier: **Tier 1** (API key + service account `srv-blogs@smartpetgadgets-seo.iam.gserviceaccount.com`). GA4 is **not configured** (no property ID) — organic-traffic-by-landing-page and conversion data could not be pulled; this report relies on GSC (search-side) data only.

Property verified in GSC: `https://smartpetgadgets.com.br/` (siteOwner permission). Date range for Search Analytics: **2026-09-24 to 2026-10-19** (28 days, GSC's standard 2–3 day reporting lag applies — data is current as of ~2026-10-19/20).

---

## Finding 1: Indexation is confirmed healthy — 100% of sampled URLs "Submitted and indexed"

**Severity:** Informational (no action needed)

**Description:**
URL Inspection API was run against the homepage plus a 10-post sample spanning distinct content clusters (comedouro, coleira GPS, câmera, porta eletrônica, brinquedo interativo, tapete higiênico, and a product-review page):

| URL | Verdict | Coverage state | Last crawl |
|---|---|---|---|
| `/` (homepage) | PASS | Submitted and indexed | 2026-10-11 |
| `/comedouro-automatico-vale-a-pena/` | PASS | Submitted and indexed | 2026-10-20 |
| `/coleira-gps-para-pet/` | PASS | Submitted and indexed | 2026-10-17 |
| `/camera-para-monitorar-pet/` | PASS | Submitted and indexed | 2026-09-27 |
| `/porta-eletronica-automatica-para-pet/` | PASS | Submitted and indexed | 2026-10-20 |
| `/brinquedo-interativo-automatico-para-gato/` | PASS | Submitted and indexed | 2026-09-28 |
| `/comedouro-newpet-4l-review/` | PASS | Submitted and indexed | 2026-10-19 |
| `/melhor-coleira-gps-sem-mensalidade/` | PASS | Submitted and indexed | 2026-10-08 |
| `/duvidas-coleira-gps-pet/` | PASS | Submitted and indexed | 2026-10-09 |
| `/tapete-higienico-para-cachorro/` | PASS | Submitted and indexed | 2026-10-20 |
| `/bebedouro-inox-x-ceramica/` | PASS | Submitted and indexed | 2026-10-04 |

All 11/11 sampled pages pass `robots_txt_state: ALLOWED`, `indexing_state: INDEXING_ALLOWED`, `page_fetch_state: SUCCESSFUL`, and canonical tags match Google's selected canonical exactly. Crawl recency is good — most pages recrawled within the last 2 weeks, several within the last 2 days.

The GSC Sitemaps endpoint confirms 78 URLs submitted via `sitemap.xml`, last read by Google on 2026-08-26, with 0 warnings/errors.

**This confirms and updates the prior finding** (memory: "100% indexed as of 2026-09-28/09-30"): indexation health is still intact one month later. **The bottleneck remains ranking position, not indexation** — see Finding 2.

**Recommendation:** No indexation remediation needed. Stop spending further effort chasing indexation; redirect all effort to ranking/relevance/authority work (internal linking, E-E-A-T signals, backlinks, content depth) as flagged below.

**Relevance score: 95/100** (indexation is effectively solved; the few points withheld reflect that only 11/77 posts were directly sampled rather than all 77).

---

## Finding 2: Site-wide ranking performance is critically weak — confirms "ranking problem, not indexing problem"

**Severity:** High

**Description:**
28-day Search Analytics totals (2026-09-24 to 2026-10-19, `totals_complete: true`, safe to use as site-wide):

| Metric | Value |
|---|---|
| Clicks | 31 |
| Impressions | 2,549 |
| CTR | 1.22% |
| Average position | 10.1 |

For a site with 77 published posts, 31 clicks in 28 days (~1.1 clicks/day) is extremely low. The average position of 10.1 looks deceptively okay, but it is dragged down by a long tail of ultra-low-volume queries ranking position 1–5; the queries that actually carry impression volume (head terms) rank far outside page 1:

| Query (by impressions) | Impressions | Position | Clicks |
|---|---|---|---|
| qual a melhor coleira com gps para gatos | 54 | 18.0 | 0 |
| camera pet | 36 | 28.7 | 0 |
| bebedouro inox ou plástico | 29 | 13.9 | 0 |
| vdrbg | 28 | 6.4 | 1 |
| cerca virtual para cachorro | 23 | 10.3 | 0 |
| melhor comedouro automático para gatos | 22 | 45.5 | 0 |
| câmera para monitorar pet | 20 | 23.5 | 0 |
| credeli ou simparic qual o melhor | 8 | 39.4 | 0 |
| camera para vigiar pet | 6 | 36.5 | 0 |
| melhor comedouro para cachorro | 6 | 52.7 | 0 |

Of 100 distinct queries sampled, only **26 rank on page 1 (position ≤10)**, and of those 26, almost all are ultra-long-tail, near-zero-volume queries (1–3 impressions each) — the single highest-impression page-1 query is "vdrbg" (a branded term, 28 impressions). **21 queries rank positions 11–20 (page 2)**, and **53 queries rank beyond position 20** — including nearly every commercially valuable head term in the site's core clusters (coleira GPS, câmera pet, comedouro automático).

Top landing pages by clicks (28 days):

| Page | Clicks | Impressions | CTR | Avg. position |
|---|---|---|---|---|
| /configurar-app-comedouro-wifi/ | 7 | 319 | 2.19% | 4.8 |
| /bebedouro-inox-x-ceramica/ | 3 | 247 | 1.21% | 8.4 |
| /comedouro-automatico-anti-formiga/ | 3 | 30 | 10.0% | 6.6 |
| /comedouro-automatico-faz-mal/ | 3 | 64 | 4.69% | 6.4 |
| /comedouro-newpet-2l-review/ | 3 | 33 | 9.09% | 8.0 |
| **Homepage (/)** | **0** | **38** | **0%** | **40.6** |

The homepage itself averages position 40.6 across 38 impressions with zero clicks — it is not ranking competitively for anything it's being shown for. Pillar/cluster-hub pages like `/camera-para-monitorar-pet/` (116 impressions, position 17.5, 0 clicks) and `/brinquedo-interativo-automatico-para-gato/` (18 impressions, position 10.7, 0 clicks) are similarly underperforming relative to their role as cluster anchors.

**This directly confirms the prior assessment**: indexation is not the problem (Finding 1); the problem is that even indexed, crawlable, well-structured pages are not ranking competitively for the commercial head terms the site targets. Overall CTR of 1.22% at an average position of 10.1 is roughly 2–3x below the typical CTR benchmark for position ~10 (~2–3% is more typical, but given the position-10 average is skewed by long-tail outliers, real competitive positions for head terms are 15–50+, where expected CTR is near 0%, consistent with the 0-click pages above).

**Recommendation:**
1. Prioritize ranking-focused work (not more indexation/technical fixes) on the handful of pages already getting impressions at position 11–20 (page 2) — e.g. `/bebedouro-inox-x-ceramica/` (pos 8.4, 247 impressions), `/comedouro-automatico-faz-mal/` (pos 6.4), `/qual a melhor coleira com gps para gatos` target page — these are the closest to page-1 breakthroughs and need internal linking, content depth/E-E-A-T, and backlink pushes to tip over.
2. Audit homepage relevance/targeting — position 40.6 suggests the homepage either lacks a clear primary keyword focus or is being outranked badly; consider whether homepage copy and internal links are diluting authority that should flow to cluster pages instead.
3. Treat `/camera-para-monitorar-pet/` and similar pillar pages as priority rank-recovery targets given their cluster-hub role and existing impression volume (116 impressions at position 17.5 is "almost there").
4. Re-run this GSC query pull monthly to track whether average position trends down (improving) now that indexation is a non-issue.

**Relevance score: 85/100** — this is the most actionable and highest-severity finding in the Google-data layer; it reframes the entire audit priority away from indexation/technical and toward content authority/relevance/backlinks.

---

## Finding 3: CrUX field data unavailable (403 Forbidden) — fell back to Lighthouse lab data, which is excellent

**Severity:** Low (data-gap caveat, not a site defect)

**Description:**
Both the standalone CrUX API and CrUX History API returned `403 Client Error: Forbidden` for the configured API key/service account when queried for the origin `smartpetgadgets.com.br` and for the post page `/coleira-gps-para-pet/`:

```
CrUX API request failed: 403 Client Error: Forbidden for url: https://chromeuxreport.googleapis.com/v1/records:queryRecord
CrUX History API request failed: 403 Client Error: Forbidden for url: https://chromeuxreport.googleapis.com/v1/records:queryHistoryRecord
```

This is a **403 (access/permission)**, not a 404 (insufficient Chrome real-user traffic) — the credential-tier check reports CrUX as `available: true`, but the live calls are being rejected. This most likely means the CrUX API needs to be explicitly enabled on the GCP project tied to this API key, or the API key has an HTTP referrer/IP restriction that excludes server-side calls. Given the site's low traffic volume, it's also plausible CrUX simply has no origin-level dataset yet (which would normally 404, not 403) — the 403 should be resolved first before concluding data volume is the cause.

PageSpeed Insights' embedded field-data slot (`field_metrics`) was also empty for both URLs, consistent with CrUX having no servable dataset for this origin at this traffic level.

Falling back to Lighthouse **lab data** (PSI v5, run live):

| Page | Device | Performance score | LCP (lab) | CLS (lab) | TBT (lab, proxy for INP) |
|---|---|---|---|---|---|
| Homepage | Mobile | 100/100 | 1.4 s (Good) | 0 (Good) | 0 ms (Good) |
| Homepage | Desktop | 100/100 | 0.6 s (Good) | 0 (Good) | 0 ms (Good) |
| /coleira-gps-para-pet/ | Mobile | 100/100 | 0.8 s (Good) | 0 (Good) | 0 ms (Good) |
| /coleira-gps-para-pet/ | Desktop | 100/100 | 0.3 s (Good) | 0 (Good) | 0 ms (Good) |

Lab performance is excellent on both pages/devices — all Core Web Vitals proxies are comfortably in the "Good" band, and this is consistent with prior non-API technical audit findings that performance/CWV is not a limiting factor for this site. Accessibility scores are 93–94/100 (not perfect, minor gap), Best Practices and SEO lighthouse categories are 100/100.

**Recommendation:**
1. Investigate the CrUX 403: check that the "Chrome UX Report API" is enabled in the Google Cloud project for `smartpetgadgets-seo`, and check API key restrictions (HTTP referrers / IP allowlist) that might be blocking server-to-server calls. This is a quick fix, not a traffic/volume issue, and should be resolved to get real-user field data going forward.
2. Given consistently perfect lab scores, performance/CWV should be deprioritized as a ranking-blocker hypothesis — it reinforces that the ranking problem (Finding 2) is about content authority/relevance/links, not technical page speed.
3. Fix the two Lighthouse accessibility deductions (93–94/100) as routine hygiene, but these are not blocking rankings.

**Relevance score: 40/100** — useful diagnostic (rules out CWV as the ranking cause) but the core 403 issue is an auth/config gap, not a content or SEO defect, and lab data already strongly suggests CWV is fine.

---

## Summary

| Area | Status | Severity if issue |
|---|---|---|
| Indexation (GSC URL Inspection, 11/77 sampled) | 100% "Submitted and indexed" — healthy, unchanged from prior audit | Informational |
| Sitemap | 78 URLs submitted, 0 errors/warnings, last read 2026-08-26 | Informational |
| Search performance (28 days) | 31 clicks / 2,549 impressions / 1.22% CTR / avg. position 10.1, but head terms rank 18–52 | **High** |
| CrUX field CWV | 403 Forbidden — API/config gap; Lighthouse lab data (fallback) shows 100/100 performance, all CWV "Good" | Low (config gap) / Informational (performance itself) |
| GA4 organic traffic | Not configured — unavailable | N/A (noted gap) |

**Overall conclusion:** This Google-API data pull **reconfirms and sharpens** the prior "ranking not indexation" diagnosis. Every sampled page is cleanly indexed and technically fast; the site's problem is that its pages — including the homepage and cluster-hub pages — are not competitive in the SERP for the commercial head terms they target (positions 17–52 for terms with real volume). Future audit/optimization effort should concentrate on content depth, internal linking equity, topical authority, and backlink acquisition rather than further indexation or technical-performance work.

**Caveats:** GSC data based on 11/77 URLs for indexation (not full-site), 28-day window only (no longer-term trend), GA4 unavailable so no visibility into actual organic sessions/conversions beyond GSC clicks, and CrUX is currently blocked (403) pending a credential/API-enablement fix.
