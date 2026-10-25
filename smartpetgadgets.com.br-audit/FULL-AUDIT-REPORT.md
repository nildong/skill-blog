# Full SEO Audit — smartpetgadgets.com.br
Date: 2026-10-23 | Business type: Affiliate/review publisher (pet gadgets, pt-BR), static HTML, 72 posts / 78 URLs

## Executive Summary

**SEO Health Score: 83/100** (weighted; 87 on 2026-10-22).

The drop is mostly measurement, not regression: this pass counted body-only words and audited bylines/claims more strictly (Content 79→71). The tapete and comedouro-cachorro rewrites are genuine improvements (SXO gap 60→63).

| Category | Weight | Score |
|---|---|---|
| Technical SEO | 22% | 94 |
| Content Quality | 23% | 71 |
| On-Page SEO | 20% | 82 |
| Schema / Structured Data | 10% | 88 |
| Performance (CWV) | 10% | 95 |
| AI Search Readiness | 10% | 70 |
| Images | 5% | 88 |

### Top 5 Findings
1. Ranking bottleneck still page-type mismatch: coleira GPS and câmera 'melhor' pages lack multi-product Top-N (SXO gap 63/100, up from 60)
2. False testing claim 'Testamos 3 comedouros' on comedouro-vdrbg-4l-wifi-review + contradictory bylines on 61 pages (E-E-A-T)
3. Thin clusters: camera/brinquedo/porta median ~500 body words, FAQs duplicate body
4. /melhor-comedouro-automatico-cachorro/ fell pos 7.7 -> 21.6 (before the 10-22 update; overlaps Sept 2026 Spam Update — hypothesis only)
5. Homepage mobile horizontal scroll (fixed locally, pending deploy)

### Top 5 Quick Wins
1. Deploy index.html nav fix
2. Change 'Testamos' to 'Comparamos' on VDRBG review
3. Regenerate llms.txt + site-index (cerca-virtual)
4. Trim tapete title/description; fix R$ per-unit numbers
5. Resubmit sitemap in GSC; enable CrUX API

## Google Data (GSC, 2026-09-23..2026-10-20)

- Clicks 34 (prev 4), impressions 2690 (prev 162), CTR 1.26%, avg position 10.0
- Page-1 query share 29/109; URL Inspection 10/10 indexed; sitemap 78 URLs, 0 errors (last submitted 2026-08-26)
- /melhor-comedouro-automatico-cachorro/ 7.7 → 21.6. Confirmed Google update in window: September 2026 Spam Update (from 2026-09-24). Date overlap is a hypothesis, not proof; the drop precedes the 2026-10-22 product update.
- CrUX: 403 — no field data.

## Technical SEO — 94/100

**What works:** 78/78 URLs 200, self-canonical, none noindexed; Security headers (HSTS, nosniff, XFO, referrer-policy); No _backup*/reports URLs reachable (404); .git/.env 403; IndexNow key live; robots.txt AI policy with Content-Signal

- **[High] Homepage horizontal scroll on mobile** — nav.main-nav rendered 445px wide on a 375px viewport (non-wrapping flex row: logo + 4 links, gap 22px); 'Contato' cut off. Fixed theme toggle also overlapped 'Contato' at <1180px. → *FIXED LOCALLY 2026-10-23 in index.html (nav wraps below logo <=600px; header reserves 64px for toggle <=1200px). Verified 320-1440px. Pending deploy.*
- **[Low] http://www takes 2 redirect hops** — http://www.smartpetgadgets.com.br -> https://www -> https://apex. → *Single 301 to https apex in .htaccess.*
- **[Info] Dirty working tree vs live** — Many uncommitted changes (comedouro posts, images, sitemap.xml, llms.txt, deploy.sh); live appears deployed from working tree. → *Commit current state so git reflects production.*

## Content Quality — 71/100

**What works:** melhor-tapete-higienico-para-cachorro rewrite is now the strongest page (7 products, table, ItemList); Metadata templating clean (templated_ratio 0.0)

- **[High] False first-hand testing claim** — comedouro-vdrbg-4l-wifi-review Key Takeaways: 'Testamos 3 comedouros automáticos de 4L' — contradicts the site's 'não testamos' disclosures (verified in source). → *Rewrite as 'Comparamos 3 comedouros...' based on specs and reviews.*
- **[High] Contradictory bylines** — 61 pages show 'Por Nildo Alves' and also 'Escrito pela Equipe Smart Pet Gadgets'; 52 author boxes say 'Testa e pesquisa produtos'. → *Pick one attribution model; one template change across posts.*
- **[High] Thin cluster content** — Camera, brinquedo interativo and porta eletrônica clusters: median body 473-530 words, ~320-350 excluding FAQs that repeat the body (overlap 0.88). 31/72 posts <600 words. → *Consolidate or expand; rewrite FAQs to add new info instead of repeating.*
- **[Medium] Tapete page price-per-unit inconsistency** — Luxena listed as 'menor preço por unidade R$ 0,92' while its own price R$ 42,23/50un = R$ 0,84; Biosec R$ 44/50 = R$ 0,88. Rating formula not stated; item 6 reviewBody cites 4.9 (ML buyer rating) next to 7.7 site score. → *Recalculate per-unit prices, state scoring method, label ML rating.*
- **[Medium] No first-hand experience evidence** — Flagship reviews have no own photos or measurements; /sobre/ and /politica-editorial/ don't explain AI use or rating method. → *Add methodology section; disclose process.*
- **[Info] Comedouro cluster CTA/product depth** — Owner-paused rework; not re-flagged as actionable. → *—*

## On-Page SEO — 82/100

**What works:** Unique titles, 1 H1 per page, self-canonicals

- **[Medium] Long titles/descriptions** — 6 titles >60 chars (tapete 67, coleira-gps-cachorro-que-foge 66); 3 descriptions >160 (tapete 170). → *Trim to ~60 / ~155 chars.*
- **[Medium] Weak internal linking** — 23 posts have <=3 internal links; generic anchors. → *Run internal-linking skill and add descriptive anchors.*
- **[Low] Possible cannibalization** — /tapete-higienico-para-cachorro/ vs /melhor-tapete-higienico-para-cachorro/; camera-para-monitorar-pet vs melhor-camera-para-monitorar-pet. → *Differentiate intent (guide vs Top-N) or consolidate with 301.*

## Schema / Structured Data — 88/100

**What works:** All 78 pages valid JSON-LD; no HowTo/AggregateRating; BlogPosting+BreadcrumbList+FAQPage on 72 posts; New ItemList on tapete (7) and comedouro cachorro (7) valid

- **[Medium] Author Person lacks image** — /autores/nildo-alves/ Person has no image, one sameAs. → *Add author photo and profile URLs.*
- **[Low] ItemList Products lack image/offers** — 7/7 on tapete, 3/7 on comedouro cachorro. → *Add product images.*
- **[Low] worstRating inconsistency** — comedouro-newpet-2l-review uses worstRating 1 vs 0 elsewhere. → *Normalize.*

## Performance (CWV) — 95/100

**What works:** Lighthouse 100 on 10/10 runs; LCP 0.3-1.7s, TBT 0, CLS 0

- **[Medium] No field data (CrUX 403)** — CrUX API returns 403 for origin and URLs. → *Enable Chrome UX Report API in the GCP project.*
- **[Low] Hero images lack fetchpriority** — Comedouro, coleira, antipulgas pages. → *Add fetchpriority=high to hero img.*
- **[Low] Oversized home thumbnails** — Home cards 761 KiB mobile / 2,097 KiB desktop. → *Serve smaller srcset thumbnails.*

## AI Search Readiness — 70/100

**What works:** Tapete & comedouro comparisons highly citable; robots.txt allows search/AI-input crawlers

- **[High] Coleira GPS cluster names no products** — 0 products across 8 pages; melhor-coleira-gps-sem-mensalidade has no figures. → *Add named product comparisons with specs/prices.*
- **[High] Weak entity signals** — Organization.sameAs only Facebook; no Wikidata/YouTube/Reddit presence. → *Add profiles and sameAs.*
- **[Medium] llms.txt stale** — cerca-virtual-para-cachorro missing; tapete/comedouro descriptions outdated. → *Regenerate llms.txt and .data/site-index.json.*
- **[Medium] English-style citations in pt-BR text** — 122 'retrieved 2026-08-22' citations across 60 pages, many to competitor blogs, many unlinked. → *Localize and link to primary sources.*
- **[Low] Hostinger 429 to GPTBot/Meta UA** — Spoofed-UA test only; training crawlers, not search. → *Monitor in server logs.*

## Images — 88/100

**What works:** All images have alt and dimensions; none broken

- **[Medium] Mobile comparison tables clipped** — Tapete table 527px in 343px wrapper, comedouro 645px; no scroll hint. → *Add scroll hint/shadow or card layout on mobile.*
- **[Low] Literal '- ' bullets in takeaway boxes** — Tapete/VDRBG 'Key Takeaways' render hyphens as text. → *Convert to <ul>.*

## Notes & Limitations
- Specialist findings in findings/*.md (each with delta vs 2026-10-22).
- Backlinks: Tier 0 only (no Moz/Bing keys); domain absent from Common Crawl graph.
- Agentic Lighthouse fraction not re-measured (runtime setup); prior 3/3 carried over.
- Verified by hand: 'Testamos 3' claim, tapete per-unit math, homepage nav overflow (445px @375).
