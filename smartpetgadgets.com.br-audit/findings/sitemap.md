# Sitemap Audit — smartpetgadgets.com.br

Date: 2026-09-30
Source: https://smartpetgadgets.com.br/sitemap.xml (HTTP 200)

## Summary

| Check | Result | Status |
|---|---|---|
| XML well-formed | Valid (parsed cleanly, single `<urlset>`, correct namespace) | PASS |
| URL count vs 50,000 limit | 77 URLs | PASS |
| File size vs 50MB limit | 12 KB | PASS |
| Deprecated tags (priority/changefreq) | None present | PASS |
| robots.txt references sitemap | `Sitemap: https://smartpetgadgets.com.br/sitemap.xml` present | PASS |
| URL status codes | 77/77 sampled returned HTTP 200 | PASS |
| Local repo `sitemap.xml` vs live | No diff (identical, already deployed despite showing as modified in `git status`) | PASS |
| Coverage vs site index (`.data/site-index.json`, 76 posts indexed) | 77 sitemap entries = homepage (1) + 76 indexed pages (posts + institutional) | PASS |
| Institutional pages present | `/sobre/`, `/contato/`, `/politica-editorial/`, `/politica-de-privacidade/`, `/autores/nildo-alves/` — all present | PASS |
| Orphan pages (local `index.html` dirs not in sitemap) | None found (`comm` diff empty) | PASS |
| Missing pages (sitemap URL with no local source) | None found | PASS |
| lastmod format | Valid W3C Datetime (YYYY-MM-DD) throughout | PASS |
| lastmod accuracy/distribution | 52/77 (68%) share identical `2026-09-20` value — looks like a bulk-touch/migration timestamp rather than per-page last significant edit date | WARNING (Low severity per rubric, but volume is notable) |
| Location-page quality gate | Not applicable — no programmatic location pages on this site | N/A |

## Detail: lastmod distribution

```
52  2026-09-20   <- likely a mass re-touch/deploy event, not per-page edits
10  2026-09-27
 6  2026-09-22
 3  2026-08-23
 2  2026-09-28
 1  2026-09-30
 1  2026-09-29
 1  2026-08-19
```

## Findings

1. **PASS — Structural compliance.** Sitemap uses the correct `sitemap.xml` schema (`http://www.sitemaps.org/schemas/sitemap/0.9`), contains only `<loc>` and `<lastmod>`, and correctly omits `priority`/`changefreq` (both ignored by Google — good practice already applied here, consistent with recent commit history removing/avoiding deprecated tags).

2. **PASS — Coverage.** 77 URLs = homepage + 76 pages tracked in `.data/site-index.json` (posts + institutional pages: `/sobre/`, `/contato/`, `/politica-editorial/`, `/politica-de-privacidade/`, `/autores/nildo-alves/`). All local content directories with an `index.html` map 1:1 to a sitemap entry; no orphans, no ghost/404 entries found in a full 77-URL status sweep (all 200).

3. **LOW — lastmod clustering.** 52 of 77 URLs (68%) share the exact same `lastmod` value (`2026-09-20`), suggesting a bulk operation (e.g., a site-wide template/deploy touch) rather than genuine content edits on that date. This isn't a Google penalty risk (lastmod accuracy is a soft signal Google may partially trust/ignore if it looks unreliable), but it reduces the signal's usefulness for crawl prioritization. Recommend wiring `lastmod` to actual file-modification/content-publish timestamps going forward so recently-updated cornerstone content (e.g., `melhor-antipulgas-para-cachorro`, updated 2026-09-30) is distinguishable from untouched pages.

4. **INFO — Local vs. live sync.** `git status` shows `sitemap.xml` as modified, but a byte-for-byte diff against the live file shows no difference — the local change was already deployed. No action needed, just a stale git working-tree state (likely an already-committed-then-reverted-locally, or the live site was updated out-of-band). Worth confirming the local copy is tracked/committed on this branch (`develop-v2`) to avoid future sync drift.

5. **N/A — Location page quality gates.** No programmatic location-based pages exist on this site; the 30+/50+ page thresholds for thin-content risk do not apply.

## Category Score: 92/100

Rationale: Full structural compliance, complete coverage, zero broken/orphaned URLs, and no deprecated tags — this is a clean, well-maintained sitemap. Points withheld only for the lastmod-clustering signal quality issue (low severity) and the unresolved local/live git working-tree inconsistency (informational).
