# On-Page SEO — smartpetgadgets.com.br

Score: 85/100

Checked homepage + 2 sample articles (`coleira-gps-para-pet`, `melhor-antipulgas-para-cachorro`) via direct HTML fetch (no subagent budget spent on this category — folded into the main audit pass).

## What works
- Title tags: unique, descriptive, keyword-led on all 3 samples (53-75 chars).
- H1 present exactly once per page, distinct from `<title>` (good — avoids duplicate-signal stuffing) but broadly aligned in topic.
- Meta descriptions present and unique on all 3 samples.
- Canonical tags self-referential (confirmed by seo-technical).
- Clean URL slugs, keyword-descriptive, no query-string cruft.

## Issues
- **Medium**: `melhor-antipulgas-para-cachorro` meta description is 221 characters — well past Google's ~155-160 char practical truncation point. Will get cut off in SERP snippets. Recommend trimming to ~150-160 chars while keeping the comparative hook ("Simparic vs Bravecto vs NexGard").
- **Low**: Homepage title (61 chars) and H1 ("Cuidados e produtos para cães e gatos, sem enrolação") diverge from each other in phrasing — not a violation, but the H1 skews more brand-voice than keyword-match. Fine as-is given strong technical/schema signals elsewhere, just noting for consistency review.
- **Not independently re-checked this pass**: internal linking depth/anchor-text diversity (see seo-content and seo-sxo findings, which already flag thin-content and authority gaps that bear on internal linking priority).

## Recommendation
Run a meta-description length sweep across all 76 URLs (`grep -oP` pattern used here, or a dedicated script) — this was only spot-checked on 3 pages; likely other comparison/review posts share the same long-description pattern given similar authorial style.
