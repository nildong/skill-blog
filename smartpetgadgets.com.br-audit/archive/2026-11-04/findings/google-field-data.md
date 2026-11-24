# Google Field Data Audit — smartpetgadgets.com.br

Data pulled 2026-10-11 via claude-seo Google API skill (Tier 1: PSI, CrUX, CrUX History, GSC — service account `srv-blogs@smartpetgadgets-seo.iam.gserviceaccount.com`). GA4 unavailable (no `ga4_property_id` configured — skipped, not an error).

GSC property used: `https://smartpetgadgets.com.br/` (URL-prefix, `siteOwner` permission). Note: `sc-domain:smartpetgadgets.com.br` and the bare-domain string `smartpetgadgets.com.br` both returned permission-denied for this service account — only the exact URL-prefix property with trailing slash works. If future scripts use a different property string, use this exact one.

---

## Findings (Critical / High / Medium / Low)

### Critical
None identified from field data. No manual actions or security issues surfaced (see Known Gaps — manual actions were not directly queryable with available tooling).

### High

**H1 — Confirmed pattern: good ranking position, zero clicks, on multiple additional queries/pages beyond the 3 already fixed.**
The user already rewrote title/meta for 3 posts with good position + zero CTR. GSC data (last 90 days) shows the pattern is broader:

| Query | Impressions | Position | Clicks | CTR | Landing page |
|---|---|---|---|---|---|
| cerca virtual para cachorro | 27 | 10.6 | 0 | 0% | /cerca-virtual-para-cachorro/ |
| qual a melhor coleira com gps para gatos | 24 | 24.1 | 0 | 0% | /coleira-gps-para-gato/ (inferred) |
| camera pet | 19 | 31.3 | 0 | 0% | /camera-para-monitorar-pet/ (inferred) |
| câmera para monitorar pet | 12 | 31.1 | 0 | 0% | /camera-para-monitorar-pet/ |

Page-level cut (90 days, same zero-CTR-despite-visibility pattern), sorted by impressions:

| Page | Impressions | Clicks | Avg. position | CTR |
|---|---|---|---|---|
| /cerca-virtual-para-cachorro/ | 53 | 0 | 9.8 | 0% |
| /comedouro-automatico-para-dois-gatos/ | 46 | 0 | 7.1 | 0% |
| /soprador-para-pet/ | 44 | 0 | 8.4 | 0% |
| /brinquedo-interativo-pilha-x-recarregavel/ | 35 | 0 | 6.9 | 0% |
| /como-limpar-comedouro-automatico/ | 35 | 0 | 5.8 | 0% |
| /comedouro-newpet-4l-review/ | 32 | 0 | 7.4 | 0% |
| /comedouro-automatico-para-viagem/ | 28 | 0 | 7.1 | 0% |
| /cachorro-de-casa-pega-pulga/ | 25 | 0 | 8.7 | 0% |
| /erros-comuns-coleira-gps-pet/ | 25 | 0 | 6.9 | 0% |

**Priority candidates for title/meta rewrite (same treatment as the 3 already fixed):** `/cerca-virtual-para-cachorro/` is the standout — page-1-adjacent average position (9.8–10.6) with real impression volume (27–53) and literally 0 clicks. `/comedouro-automatico-para-dois-gatos/`, `/soprador-para-pet/`, `/como-limpar-comedouro-automatico/` are next-tier candidates (position <9, impressions 32-46, 0 clicks).

**Site-wide CTR is 1.34%** (18 clicks / 1,340 impressions, 90-day window, `totals_complete: true`), with an average position of 10.0. A ~1.3% blended CTR at position-10-average is well below typical benchmarks (~2-3% expected at position 10), reinforcing that this is a title/meta/snippet-appeal problem, not an indexation or ranking-floor problem — consistent with the user's prior diagnosis.

### Medium

**M1 — CrUX API and CrUX History API both returned 403 Forbidden**, not 404. This is a different failure mode than "insufficient Chrome UX traffic" (which normally returns 404). A 403 typically indicates an API-key/permission or API-enablement issue (e.g., CrUX API not enabled on the GCP project tied to the key, or key restrictions blocking the CrUX endpoint) rather than a traffic-volume problem. Recommend checking the API key's allowed-API list in Google Cloud Console — this should be a quick fix and is worth resolving since CrUX field data (real-user LCP/INP/CLS) could not be verified at all, only Lighthouse lab data.

**M2 — Lab data (PSI) is strong but doesn't reflect field conditions.** Mobile: Performance 98, LCP 2.24s (lab), CLS 0. Desktop: Performance 99, LCP 0.94s (lab), CLS 0. These are lab-only estimates on a single run; with CrUX blocked, there's no real-user CWV confirmation. Low risk given how strong lab scores are, but flagging since CWV is a ranking signal and real-user data (especially on slower networks/devices than the PSI test environment) is unverified.

**M3 — Image delivery inefficiency.** PSI flags "Improve image delivery" — mobile home page: 376 KiB potential savings; desktop: 1,668 KiB potential savings (23 of 24 requests on desktop are images, several hero images are 100-200KB JPEGs that could be WebP/AVIF + properly sized). Not currently hurting CWV scores, but a quick win for total payload (2,064 KiB desktop homepage) and marginal LCP/INP headroom.

### Low

**L1 — Accessibility: missing `<main>` landmark and color-contrast failures** (215 instances of insufficient contrast flagged, mostly card tags/links in `#ff5f0f`/`#d9480f` orange on white). Accessibility score 93/100 both mobile and desktop. Not an SEO ranking factor directly, but worth a batch CSS fix since it recurs across every templated "card" component site-wide.

**L2 — Security headers missing:** no CSP (`script-src`/`object-src` missing), no COOP header, no HSTS `preload` directive, no Trusted Types. Not currently SEO-impacting but flagged as hardening items, especially since `best-practices` score is still 100/100 (these are Lighthouse "insights," not scored audits in this version).

---

## Indexation Status (GSC)

- URL Inspection, homepage (`https://smartpetgadgets.com.br/`): verdict **PASS** — "Submitted and indexed", robots ALLOWED, last crawl 2026-10-08, crawled as MOBILE. Canonical matches.
- URL Inspection, `/configurar-app-comedouro-wifi/` (highest-impression page, 155 impr/90d): verdict **PASS** — "Submitted and indexed", last crawl 2026-09-14, canonical matches, rich result detected (Breadcrumbs, no issues).
- Sitemap: `https://smartpetgadgets.com.br/sitemap.xml` — 77 URLs submitted, 0 errors, 0 warnings, last submitted 2026-08-26.
- This is consistent with the user's prior confirmation that the site is ~100% indexed as of late Sept 2026 — both spot-checked URLs confirm "Submitted and indexed" with no coverage issues.
- **Manual actions / security issues:** not directly checked — the claude-seo skill toolset does not include a wrapped Manual Actions API or Security Issues API call. Recommend a manual spot-check in Search Console UI (Security & Manual Actions report) to fully close this out, though no indirect signal (crawl errors, blocked pages) suggests a problem.

## GSC Search Performance (90-day window, 2026-07-13 to 2026-10-08)

Source: dimensionless aggregate query, `totals_complete: true` (safe to treat as site-wide totals; do not re-derive from summed query/page rows, which exclude anonymized low-volume traffic).

| Metric | Value |
|---|---|
| Clicks | 18 |
| Impressions | 1,340 |
| CTR | 1.34% |
| Avg. position | 10.0 |

Page-dimension cut: 74 pages with any impressions in 90 days (of 77 submitted in sitemap — consistent with near-full indexation and near-full query coverage).
Query-dimension cut: 67 distinct queries with impressions in 90 days.

Top pages by impressions (90d):
1. /configurar-app-comedouro-wifi/ — 155 impr, 2 clicks, pos 5.3, CTR 1.3%
2. /bebedouro-inox-x-ceramica/ — 118 impr, 2 clicks, pos 8.4, CTR 1.7%
3. /comedouro-vdrbg-4l-wifi-review/ — 58 impr, 1 click, pos 6.1, CTR 1.7%
4. /cerca-virtual-para-cachorro/ — 53 impr, 0 clicks, pos 9.8, CTR 0% ← flagged (H1)
5. /comedouro-automatico-para-dois-gatos/ — 46 impr, 0 clicks, pos 7.1, CTR 0% ← flagged (H1)

Top queries by impressions (90d):
1. "cerca virtual para cachorro" — 27 impr, pos 10.6, 0 clicks, 0% CTR
2. "qual a melhor coleira com gps para gatos" — 24 impr, pos 24.1, 0 clicks, 0% CTR
3. "vdrbg" — 22 impr, pos 7.3, 1 click, 4.5% CTR
4. "camera pet" — 19 impr, pos 31.3, 0 clicks, 0% CTR
5. "câmera para monitorar pet" — 12 impr, pos 31.1, 0 clicks, 0% CTR

---

## PSI / Lab Core Web Vitals (Lighthouse, single-run, homepage)

| Metric | Mobile | Desktop |
|---|---|---|
| Performance score | 98/100 | 99/100 |
| LCP (lab) | 2.24s (Good) | 0.94s (Good) |
| CLS | 0 (Good) | 0 (Good) |
| TBT | 0ms | 0ms |
| FCP | 1.2s | 0.5s |
| Accessibility score | 93/100 | 93/100 |
| Best Practices score | 100/100 | 100/100 |
| SEO score | 100/100 | 100/100 |

Field metrics (CrUX, embedded in PSI call): empty — PSI's own field-data merge also came back empty, consistent with the standalone CrUX 403.

## CrUX (Real-User Field Data)

- Origin-level query: **403 Forbidden** (`chromeuxreport.googleapis.com/v1/records:queryRecord`)
- CrUX History (28-day rolling trend) query: **403 Forbidden** (`.../v1/records:queryHistoryRecord`)
- This is an auth/API-enablement issue (403, not the "insufficient traffic" 404), and should be fixed at the API-key level before the next audit — real-user LCP/INP/CLS could not be verified this cycle, only Lighthouse lab proxies.

---

## Raw Data Appendix (key JSON excerpts)

**google_auth.py --check:**
```json
{
  "tier": 1,
  "services": {
    "psi": {"available": true, "method": "api_key"},
    "crux": {"available": true, "method": "api_key"},
    "crux_history": {"available": true, "method": "api_key"},
    "gsc": {"available": true, "method": "service_account", "client_email": "srv-blogs@smartpetgadgets-seo.iam.gserviceaccount.com"},
    "ga4": {"available": false, "error": "Credentials found but no GA4 property ID configured."}
  }
}
```

**GSC sites list (service account access):**
```json
{
  "sites": [
    {"url": "sc-domain:smartpetgadgets.com.br", "permission": "siteUnverifiedUser"},
    {"url": "https://smartpetgadgets.com.br/", "permission": "siteOwner"}
  ]
}
```

**GSC totals (90d, dimensionless aggregate):**
```json
{"clicks": 18, "impressions": 1340, "ctr": 1.34, "position": 10.0, "totals_source": "dimensionless_aggregate", "totals_complete": true}
```

**Sitemap status:**
```json
{
  "path": "https://smartpetgadgets.com.br/sitemap.xml",
  "last_submitted": "2026-08-26T21:53:30.968Z",
  "warnings": "0", "errors": "0",
  "contents": [{"type": "web", "submitted": "77"}]
}
```

**CrUX error:**
```json
{"error": "CrUX API request failed: 403 Client Error: Forbidden for url: https://chromeuxreport.googleapis.com/v1/records:queryRecord"}
```

**CrUX History error:**
```json
{"error": "CrUX History API request failed: 403 Client Error: Forbidden for url: https://chromeuxreport.googleapis.com/v1/records:queryHistoryRecord"}
```

---

## Known Gaps / Follow-ups

1. **CrUX 403s unresolved** — fix API key restrictions/enablement before relying on real-user CWV data in future audits.
2. **GA4 not configured** — no organic traffic/landing-page/conversion data available this cycle. Add `ga4_property_id` to `/home/ng/.config/claude-seo/google-api.json` to unlock Tier 2.
3. **Manual Actions / Security Issues** not checked via API (no wrapped script); recommend manual Search Console UI check to close this out definitively.
4. **GSC property string gotcha**: use the exact string `https://smartpetgadgets.com.br/` (URL-prefix property, trailing slash) for this service account. `sc-domain:smartpetgadgets.com.br` and bare `smartpetgadgets.com.br` are not accessible to `srv-blogs@smartpetgadgets-seo.iam.gserviceaccount.com`.
