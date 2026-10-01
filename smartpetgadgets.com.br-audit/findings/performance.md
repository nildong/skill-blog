# Performance / Core Web Vitals Audit — smartpetgadgets.com.br

Date: 2026-09-30
Tool: PageSpeed Insights API v5, Lighthouse 13.5.0 (lab data, mobile + desktop)
CrUX field data: unavailable (403 Forbidden / insufficient traffic — consistent with known low-indexing/near-zero-impressions status, see `smartpetgadgets-indexing-status.md`). Assessment based on Lighthouse lab data only; revisit once CrUX has enough traffic.

## Category Score: 98/100 (avg Lighthouse Performance, mobile)

## Pages tested (mobile strategy, primary)

| Page | Perf Score | LCP (lab) | TBT/INP proxy | CLS | FCP | Speed Index |
|---|---|---|---|---|---|---|
| Homepage `/` | 99 | 2.0s | 0ms | 0 | 0.8s | 0.9s |
| `/coleira-gps-para-pet/` | 100 | 0.9s | 0ms | 0 | 0.9s | 1.9s |
| `/melhor-antipulgas-para-cachorro/` | 100 | 1.1s | 0ms | 0 | 0.8s | 0.8s |

Desktop runs score even higher (e.g., homepage LCP 0.5s, all metrics score 1.0).

## Core Web Vitals status (lab-based, since no field data exists yet)

- **LCP**: PASS on all 3 pages — all well under 2.5s "Good" threshold (worst case 2.0s on homepage).
- **INP**: No direct INP lab metric from Lighthouse, but Total Blocking Time is 0ms on every page — strong proxy for low main-thread cost, so INP is very likely in the "Good" (<200ms) range.
- **CLS**: PASS on all 3 pages — 0.0 measured, no layout-shift diagnostics flagged.

All three pages are essentially best-in-class on lab metrics: 817 KiB (home), 77 KiB (coleira-gps), and 82 KiB (antipulgas) total network payload; JS execution/main-thread work ~0.0–0.1s; no render-blocking or third-party-script bottlenecks detected; no opportunities returned by Lighthouse.

## Bottlenecks identified

1. No CrUX field data — cannot confirm real-user 75th-percentile experience yet; purely a data-availability gap, not a performance defect. Follow up once traffic/indexing improves (tracked in `smartpetgadgets-indexing-status.md`).
2. Homepage LCP (2.0s mobile) is the slowest of the three pages tested, though still comfortably "Good." If more content/images are added to the homepage hero section in the future, monitor LCP so it doesn't creep toward 2.5s.
3. Accessibility scores (93/93/91) are solid but not 100 — not a CWV issue, but worth a quick pass (likely color-contrast or ARIA attributes) since it's an easy incremental win when performance is already maxed out.

## Recommendations (prioritized)

1. **Low priority / monitoring only**: Because all lab CWV metrics are already in the "Good" zone with wide margins (LCP ≤2.0s vs 2.5s threshold, CLS 0.0, TBT 0ms), no urgent performance remediation is needed. Re-run this audit once CrUX field data becomes available (after indexing/traffic ramps) to confirm real-user 75th percentile matches lab results.
2. **Preserve current image/asset discipline**: Homepage payload (817 KiB) is higher than individual articles (~80 KiB) — verify hero/OG images stay compressed (WebP/AVIF) and lazy-load below-the-fold images as more cards are added to the homepage (relevant given `smartpetgadgets-home-cards-manual.md` — manual card edits could introduce unoptimized images over time).
3. **Quick win**: Address the accessibility score gap (91-93) with a Lighthouse accessibility pass — not CWV-related but low-effort given performance headroom is already exhausted.
4. **Set up monitoring**: Once CrUX field data is available, re-run `crux_history.py` to track the 28-day rolling p75 for LCP/INP/CLS and catch regressions early, since current numbers are lab-only single-run snapshots.

## Raw data references
- `/tmp/claude-1000/-home-projetos-blog/2c469ed0-1649-4023-bcee-49d627e57fea/scratchpad/psi_home.json`
- `/tmp/claude-1000/-home-projetos-blog/2c469ed0-1649-4023-bcee-49d627e57fea/scratchpad/psi_coleira.json`
- `/tmp/claude-1000/-home-projetos-blog/2c469ed0-1649-4023-bcee-49d627e57fea/scratchpad/psi_anti.json`
