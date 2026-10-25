# Technical SEO Findings - smartpetgadgets.com.br (DELTA vs 2026-10-22)

Audit date: 2026-10-23. Method: live curl (headers, redirects, probes), crawl.json (78 URLs, all 200), sitemap.xml diff vs repo directories, source inspection of changed pages. Note: `sitemap_discovery.py` runtime returned "not ready" (/seo setup needed); sitemap and robots were validated manually with curl instead.

Technical score: **94/100** (prior 96). No Critical or High. Slight drop is for the newly detected two-hop www redirect on http and title/description overflow on the rewritten tapete page.

## Category status

| Category | Status | Notes |
|---|---|---|
| Crawlability | PASS | robots.txt unchanged and valid; sitemap declared, 78 loc, 200, no backup/reports URLs |
| Indexability | PASS | 78/78 crawl URLs 200, self-canonical, no robots meta, no duplicate titles |
| Security | PASS | HSTS, CSP frame-ancestors, XCTO, XFO, Referrer-Policy live and match .htaccess |
| URL structure | PASS (1 note) | See L1 (http://www two hops) |
| Mobile | PASS | viewport present; responsive srcset on rewritten page |
| CWV (source) | PASS | width/height on all imgs, hero eager+fetchpriority=high on new page |
| Structured data | PASS | tapete page: BlogPosting, BreadcrumbList, ItemList, FAQPage |
| JS rendering | PASS | static SSR |
| IndexNow | PASS | key file live (200, content matches), deploy.sh pings |

## Confirmed fixed since last audit
- Sitemap _backup* fix holds: live sitemap has 78 URLs, zero backup/report entries; every repo directory with an index.html is in the sitemap and vice versa. Sitemap lastmods updated (2026-10-23 on recent edits).
- cerca-virtual-para-cachorro restored: 200, self-canonical, no redirect rule in .htaccess (only the soprador-para-pet rule remains). Fixed.
- melhor-tapete-higienico-para-cachorro: 200, trailing-slash 301 works, canonical correct, 9/9 images have width/height, 15 affiliate links carry rel sponsored.
- Backup/orphan exposure: /reports/ (404, also Disallowed in robots), /jev-seo-reports/, /tools/, /briefs/, /audit/, /output_social_v2/, /calendars/, README.md, V2-*.md, local_dirs.txt, /smartpetgadgets.com.br-audit/, /.claude/ all 404; .git/.env/.htaccess return 403; /cluster-comedouro-automatico-pet/ 403. /reports/backup-fase2a-1/ is 404 (GSC removal follow-up looks safe to close once GSC confirms).
- 404 handling: real 404 status, custom page, no soft-404.
- Still good: https redirect, www to non-www, legacy slug 301 (soprador-para-pet to soprador-pet), llms.txt 200, robots AI-crawler policy unchanged.

## Open items (carried over)
- L2 (carried): title/description overflow. From crawl: titles over 60 chars on comedouro-automatico-para-dois-gatos (64), -gato-obeso (61, desc 161), -para-viagem (64), comedouro-gato-x-cachorro-diferenca (61), coleira-gps-cachorro-que-foge (66). Low.
- L3 (carried): homepage has an FAQ heading but no FAQPage JSON-LD (homepage JSON-LD count 2). Low.
- L4 (carried): Person schema on /autores/nildo-alves/ still lacks `image`. Low.
- Homepage PSI never run (72 images). Low.

## New findings
- **Medium - M1: Rewritten tapete page title and description too long.** /melhor-tapete-higienico-para-cachorro/ title is 67 chars ("Melhor Tapete Higienico para Cachorro em 2026: Comparamos 7 Modelos") and description 170 chars; both will truncate in SERP. Trim to <=60 / <=155.
- **Low - L1: http://www two hops.** http://www.smartpetgadgets.com.br/ 301s to https://www... then 301s to https://smartpetgadgets.com.br/ (2 hops). The prior report said single hop for all variants; true for http apex and https www only. Fix: add an HTTPS/host canonicalization rule in .htaccess that redirects any non-canonical host or scheme straight to https://smartpetgadgets.com.br (RewriteCond on %{HTTPS} off [OR] host starts with www).
- **Low - L5: Possible cannibalization.** /tapete-higienico-para-cachorro/ (review, "Vale a Pena? Review 2026") and the new 7-product /melhor-tapete-higienico-para-cachorro/ target the same head term. Both self-canonical and both in sitemap. Differentiate intent (single product review vs. comparison) and cross-link, or consolidate with a 301 if the review is thin.
- **Low - L6: Thin utility pages.** /contato/ (197 words), /politica-editorial/ (245), /sobre/ (390), and /melhor-camera-para-monitorar-pet/ (587 words, lowest of the money posts) are short. Utility pages are acceptable; the camera comparison is the only one worth expanding. Utility pages carry 1 JSON-LD block, which is fine.
- **Low - L7: Author page description 191 chars** (truncation only).
- **Info - I1: Cache headers.** HTML returns 200 without explicit cache-control (LiteSpeed default); static assets have max-age=604800. Consider longer immutable caching for hashed or versioned images. Not an issue today.
- **Info - I2: Working tree is dirty.** Repo has many uncommitted edits (comedouro cluster HTML/images, sitemap.xml, llms.txt). The live sitemap already reflects the changes, so confirm deploy and git state match before the next push.
- **Info - I3: Sitemap tooling.** claude-seo runtime needs `/seo setup` for sitemap_discovery.py.

## Evidence
- Live: /, /robots.txt, /sitemap.xml, /llms.txt, /a1f6cd69536df7bc75a53518c642c336.txt, redirect probes (http, www, index.html, no-slash, legacy slug), 404 probe, backup/orphan probes.
- Local: /home/projetos/blog/.htaccess, /home/projetos/blog/sitemap.xml, /home/projetos/blog/cerca-virtual-para-cachorro/index.html, crawl.json in scratchpad/audit.
