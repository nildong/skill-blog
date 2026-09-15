# Blog Audit — smartpetgadgets.com.br

**Audit Date:** 2026-09-15
**Total Pages Indexed:** 75 (72 → 75 since last GSC snapshot; includes new `coleira-seresto-antipulgas`)
**Engine used:** local deterministic pipeline (site-indexer → seo-auditor → cannibalization → internal-linking), not the generic canonical `analyze_blog.py` scorer — this repo has purpose-built skills for its HTML-per-folder structure. No 0-100 "quality score" is computed by this pipeline by design (seo-auditor does not emit an aggregate score); severity counts are used instead as the priority signal.

## Health Overview

| Metric | Count |
|---|---|
| Pages audited | 75 |
| Critical issues | 0 |
| Errors | 0 |
| Warnings | 2 |
| Info (opportunities) | 51 |
| Orphan pages (0 inbound links) | 0 |
| Low-connectivity pages | 0 |
| Cannibalization — HIGH | 0 |
| Cannibalization — POSSIBLE (worth a look) | 92 |
| Cannibalization — COMPLEMENTARY (pillar↔satellite, not a conflict) | 139 |
| Internal link suggestions available | 178 |
| Images missing alt text | 0 |
| Invalid JSON-LD | 0 |

Overall the site is structurally healthy: no orphan or dead-end pages, no broken JSON-LD, no missing alt text, zero critical/error-severity SEO issues.

## Warnings (only 2 site-wide)

1. **FAQ_HEADING_WITHOUT_SCHEMA** — `/` (homepage) — heading mentions FAQ but no `FAQPage` schema present. Add JSON-LD FAQPage or rename the heading.
2. **JSONLD_MISSING** — `/politica-de-privacidade/` — no structured data at all. Low priority (legal page, not a ranking target) but trivial to fix with an `Organization`/`WebPage` block.

## Top Opportunities (Info-level, 51 total)

- **37 posts have no FAQ block** (`FAQ_OPPORTUNITY`) — biggest single bucket. Candidates cluster around brinquedo-interativo, câmera-pet, and porta-eletrônica families. Adding FAQPage schema here is the single highest-leverage move for AI-citation/rich-result readiness given 33/75 posts already have FAQPage.
- **4 institutional pages missing JSON-LD entirely**: `/contato/`, `/politica-de-privacidade/`, `/politica-editorial/`, `/sobre/`.
- **6 pages missing image width/height** (CLS risk): `/autores/nildo-alves/`, `/contato/`, `/politica-de-privacidade/`, `/politica-editorial/`, `/sobre/`, plus homepage image-count flag.
- **Homepage has 70 images** — flagged as unusually high; worth reviewing for editorial value vs. bloat.
- **Metadata length**: `coleira-gps-para-gato` (description 177 chars), `coleira-seresto-antipulgas` (title 66 chars, description 175 chars), `comedouro-automatico-para-dois-gatos` (title 74 chars) — all over recommended limits, truncation risk in SERP.
- **`/contato/`** has only 3 outbound internal links (low, but expected for a contact page).

Full per-issue detail: `reports/seo-audit.md`.

## Topic Cannibalization — Top POSSIBLE Pairs (score ≥ 40, review recommended)

| Score | Post A | Post B |
|---|---|---|
| 65 | brinquedo-interativo-gato-idoso-vale-a-pena | duvidas-brinquedo-interativo-gato |
| 65 | camera-pet-x-coleira-gps-qual-escolher | coleira-gps-x-microchip |
| 65 | comedouro-newpet-2l-review | comedouro-newpet-4l-review |
| 61 | comedouro-gato-x-cachorro-diferenca | porta-eletronica-gato-x-cachorro-diferenca |
| 60 | coleira-gps-cachorro-pequeno-porte | coleira-gps-cachorro-que-foge |
| 60 | comedouro-newpet-4l-review | comedouro-vdrbg-4l-wifi-review |
| 60 | porta-eletronica-funciona-porta-de-vidro | porta-eletronica-sensor-de-luz-como-funciona |
| 59 | brinquedo-interativo-gato-idoso-vale-a-pena | como-escolher-brinquedo-interativo-gato-entediado |
| 59 | como-instalar-porta-eletronica-pet | porta-eletronica-funciona-porta-de-vidro |
| 58 | coleira-gps-cachorro-que-foge | como-funciona-coleira-gps-cachorro |

No HIGH-severity conflicts (score ≥70 non-complementary) were found — good sign for the coleira-gps cluster's [[smartpetgadgets-cluster-coleira-gps]] architecture. The 92 POSSIBLE pairs are heuristic and need manual review, not automatic action; recommendation from the module is consistently "differentiate title/intent or add explicit internal linking," never deletion. Full pairwise detail: `reports/cannibalization.md`.

## Internal Linking

- 178 suggested internal links, 0 targeting orphan pages (there are none).
- 0 low-connectivity pages — link graph is well distributed.
- Full ranked suggestions with anchor text: `reports/internal-linking.md`.

## Freshness / Stale Content

**SKIPPED**: `date_published`/`date_modified` are not reliably extractable from this site's HTML by the local indexer (intentionally left `null` rather than guessed — see site-indexer schema notes). No GSC-based decay data was pulled in this run. If freshness auditing is wanted, either add visible `dateModified` to templates or run `blog-google`/GSC decay checks separately (see [[smartpetgadgets-indexing-status]] for the last known indexing snapshot: 38/72 indexed, ~0 impressions as of 2026-08-25 — worth re-checking given traffic is still ramping).

## Prioritized Action Queue

| Priority | Item | Action |
|---|---|---|
| 1 | Homepage FAQ heading without schema | Add FAQPage JSON-LD or rename heading |
| 2 | `/politica-de-privacidade/` no JSON-LD | Add minimal WebPage/Organization schema |
| 3 | 37 posts with no FAQ | Batch-add FAQ + FAQPage schema, prioritize the brinquedo-interativo and câmera-pet families first (largest sub-clusters) |
| 4 | 3 title/description length overruns | Trim `coleira-gps-para-gato`, `coleira-seresto-antipulgas`, `comedouro-automatico-para-dois-gatos` metadata |
| 5 | 4 institutional pages missing JSON-LD | `/contato/`, `/politica-editorial/`, `/sobre/` — add basic schema |
| 6 | Top 10 cannibalization POSSIBLE pairs | Manual review — differentiate titles or add cross-links where relationship is genuinely competitive rather than complementary |
| 7 | 6 images missing width/height | Add dimensions to reduce CLS, mostly on low-traffic institutional pages |

## Notes

- No aggregate 0-100 quality score exists in this repo's pipeline (by design — see seo-auditor skill docs). If a scored per-post table is wanted, it would require either running the generic `blog-analyze` skill per post or extending seo-auditor.
- This audit did not touch Core Web Vitals, GSC data, or robots.txt/llms.txt AI-crawler policy — those need `blog-google` credentials or a dedicated `blog-geo` pass, not run here.
