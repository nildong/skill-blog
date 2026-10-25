# Sitemap Audit - smartpetgadgets.com.br (delta vs 2026-10-22)

Audit date: 2026-10-23. Sources: live sitemap.xml and robots.txt, local sitemap.xml, crawl.json (78 URLs), llms.txt, .data/site-index.json (generated 2026-10-14).

## Pass/fail
| Check | Result |
|---|---|
| XML valid, namespace, 78 URLs, no duplicates, far below limits | PASS |
| No priority/changefreq | PASS |
| Live vs local sitemap | PASS (identical, md5 bd948ee1...) |
| Sitemap vs crawl (78 vs 78) | PASS (zero diff both ways) |
| Status/canonical/noindex | PASS (all 200, final == URL, canonical self, no noindex) |
| robots.txt Sitemap directive | PASS (`Sitemap: https://smartpetgadgets.com.br/sitemap.xml`; only /reports/ and /?s= disallowed) |
| _backup* leak | PASS (no backup URLs; no _backup dirs at repo root) |
| llms.txt coverage | FAIL (cerca-virtual-para-cachorro missing) |
| site-index.json coverage | FAIL (stale, 77 posts, cerca-virtual missing) |
| lastmod accuracy | PARTIAL (see below) |

## Findings

1. MEDIUM - cerca-virtual-para-cachorro/ still absent from llms.txt and .data/site-index.json (unchanged since prior audit). It is in sitemap, crawl, and is 200. Fix: regenerate site-index and add to llms.txt. Note llms.txt has uncommitted changes and still lacks it.

2. LOW - lastmod mismatch for 9 pages. Sitemap says 2026-10-15; last git commit is 2026-10-14 and each file has uncommitted modifications (mtime 2026-10-15): brinquedo-interativo-pilha-x-recarregavel, comedouro-automatico-anti-formiga, comedouro-automatico-faz-mal, comedouro-automatico-gato-obeso, comedouro-automatico-para-dois-gatos, comedouro-automatico-para-viagem, comedouro-com-ou-sem-wifi, como-limpar-comedouro-automatico, configurar-app-comedouro-wifi. The dates reflect real edits, but those edits are uncommitted yet apparently live (live sitemap equals local). Commit them to keep repo and production aligned. Affiliate-cluster work is paused per memory, so confirm these edits are intended to ship.

3. LOW - lastmod distribution: 65 of 78 at 2026-10-14 (bulk title-update date), 9 at 10-15, 1 at 10-19, 1 at 10-22, 2 at 10-23 (home plus one other). Home 10-23 is plausible (card edits). The 10-14 cluster is likely a mass title change, so it is a weak freshness signal but not fabricated. Without per-file git history, other lastmods match last commit date exactly (69/78 verified).

4. INFO - sitemap.xml and llms.txt show as modified in the working tree (uncommitted), yet live sitemap matches local: deployment is happening from the working tree without commits. Commit sitemap.xml and llms.txt.

5. INFO - Resolved since prior audit: none new regressions; backup exclusion remains effective.

## Missing / extra pages
- In crawl, not sitemap: none.
- In sitemap, not 200/redirected: none.
- Quality gates: no location-page pattern (not applicable).
