# Technical SEO Audit — smartpetgadgets.com.br

**Date:** 2026-09-30
**Scope:** Full static HTML affiliate blog (~74 posts), Hostinger hosting, Brazilian Portuguese pet niche.

## Technical Score: 92/100

---

## 1. Crawlability — PASS
- `robots.txt` present, well-formed, declares `Sitemap: https://smartpetgadgets.com.br/sitemap.xml`.
- Explicit per-bot rules with `Content-Signal` directives (search=yes, ai-input=yes, ai-train=no) for GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-User, Claude-SearchBot, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, GoogleOther, Bingbot, CCBot, Applebot, Applebot-Extended, and default `*`. This is an advanced, current (2026) AI-crawler governance setup — ahead of most sites in this niche.
- `Disallow: /reports/` correctly keeps internal report pages out of crawl; confirmed 0 `/reports/` URLs leaked into sitemap.xml.
- No `noindex` meta tags found on sampled pages.
- `llms.txt` present (200, text/plain, last modified 2026-09-28) — supports agentic/LLM discovery.

## 2. Sitemap — PASS
- `sitemap_discovery.py` confirms robots.txt declaration is valid and live: `https://smartpetgadgets.com.br/sitemap.xml` returns HTTP 200, `kind: urlset`, `valid: true`.
- No sitemap index; single flat urlset, 77 `<loc>` entries — appropriate for site size (no need for an index file yet).
- Common fallback paths (`sitemap_index.xml`, `sitemap-index.xml`, `wp-sitemap.xml`) correctly 404 — not applicable since this is a static site, not WordPress; no stale/conflicting sitemap references found.
- `lastmod` dates present and recent/plausible (spread across 2026-08-23 to 2026-09-28), consistent with ongoing content updates.

## 3. Indexability — PASS (verify no regression)
- Canonical tags present and self-referential on homepage and sampled post (`https://smartpetgadgets.com.br/bebedouro-inox-x-ceramica/`), using the full trailing-slash, non-www, HTTPS form consistently.
- No `noindex`/`nofollow` directives found.
- **GSC status verification:** Per prior notes, the site was reported 100% indexed in Google Search Console as of 2026-09-28/09-30 after a www→non-www redirect fix applied 2026-08-23. This audit did not regress that: both HTTP→HTTPS and www→non-www 301 redirects are live and correctly resolve to the canonical `https://smartpetgadgets.com.br/` host. No new indexability blockers (noindex, broken canonicals, robots disallow) were introduced. Recommend a fresh GSC Coverage/Pages report pull to reconfirm the 100% figure going forward, since this audit is source-level only and cannot read live GSC data.

## 4. Security — PASS
HTTPS is enforced with strong headers present on every response sampled (homepage, post, www, http, 404):
- `strict-transport-security: max-age=31536000; includeSubDomains` (HSTS)
- `content-security-policy: frame-ancestors 'self'` (and `upgrade-insecure-requests` on the bare-HTTP redirect response)
- `x-content-type-options: nosniff`
- `x-frame-options: SAMEORIGIN`
- `referrer-policy: strict-origin-when-cross-origin`

**Minor gap (Low priority):** No HSTS `preload` directive, and CSP is minimal (`frame-ancestors` only — no `script-src`/`default-src` hardening). Not urgent for a static affiliate site with no user input, but worth considering if third-party ad/affiliate scripts are added later.

## 5. URL Structure & Redirects — PASS
- Clean, descriptive, hyphenated slugs (e.g. `/bebedouro-inox-x-ceramica/`, `/comedouro-automatico-para-dois-gatos/`), no query params or ID-based URLs.
- `http://` → `https://` non-www: 301, single hop, correct target.
- `https://www.` → `https://` non-www: 301, single hop, correct target. **Confirms the 2026-08-23 www→non-www fix is still in place and has not regressed.**
- No-trailing-slash → trailing-slash: 301, correct target (URL normalization consistent).
- 404s return true HTTP 404 status (not soft-404 200), with a distinct 4.4KB error page.
- No redirect chains (>1 hop) detected in any path tested.

## 6. Mobile-Friendliness — PASS
- `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` present on homepage and sampled post.
- CSS includes `@media (prefers-color-scheme: dark)` support and appears to use system-font stacks with relative units — no indication of fixed-width/desktop-only layout.
- No Flash, no fixed-pixel-width containers observed in the inline stylesheet excerpt reviewed.

## 7. Core Web Vitals (lab/source-inspection estimate) — PASS, minor watch items
- **CLS:** Images consistently include explicit `width`/`height` attributes (e.g. `width="400" height="180"`), which reserves layout space and mitigates shift — good practice, low CLS risk.
- **LCP:** Below-the-fold images on the homepage correctly use `loading="lazy"`. The homepage logo (likely LCP candidate area) does not use lazy-loading, which is correct (lazy-loading the LCP element would hurt LCP). No render-blocking external stylesheets detected (`<link rel="stylesheet">` count = 0 on homepage — CSS appears to be inlined in `<style>`, which favors fast first paint but should be monitored for CSS bloat as the site grows).
- **INP:** Site is fully static HTML with no client-side JS framework markers detected (no React/Next/Angular root divs, no `<script src>` bundles found on sampled post page) — minimal main-thread JS work expected, low INP risk.
- No actual field/lab metrics (PSI/CrUX) were collected in this audit — recommend running PageSpeed Insights or CrUX API periodically to confirm these source-level estimates against real user data.

## 8. Structured Data — PASS
Sampled post (`/bebedouro-inox-x-ceramica/`) includes valid-looking JSON-LD for:
- `BlogPosting` with `Person` (author, name + profile URL) and `Organization` (publisher, with logo `ImageObject`)
- `WebPage`, `BreadcrumbList` (3 `ListItem`s)
- `FAQPage` with 4 `Question`/`Answer` pairs
Homepage includes `Organization` and `WebSite` (with `SearchAction`) schema.

Note on prior memory item ("Person-schema fix deferred to a dedicated site-wide session" re: Coleira GPS cluster): the Person schema on this sampled post is well-formed (has both `name` and `url`), so no defect is visible in this sample. This audit only inspected one post outside the Coleira GPS cluster — the deferred site-wide Person-schema review across all ~74 posts (and specifically the 11-article GPS collar cluster) should still be scheduled to confirm no malformed/empty Person objects exist elsewhere.

## 9. JavaScript Rendering — PASS
- `render_page.py --mode auto` did not trigger SPA/Playwright rendering (no SPA shell detected), consistent with the site being fully static, server-rendered HTML.
- Content is immediately present in raw HTML source — no JS-dependent content-injection risk for crawlers.

## 10. IndexNow Protocol — NOT IMPLEMENTED (Medium priority)
- No IndexNow key file found at the root (`/indexnow-key*` returns 404).
- Recommend implementing IndexNow (Bing, Yandex, Naver support it; a growing share of AI answer engines also consume it) to accelerate indexing of new/updated posts beyond relying solely on sitemap crawl frequency, especially useful given the site is actively publishing/updating content (10+ posts updated in the last week per sitemap `lastmod` data).

---

## Prioritized Issues

**Critical:** None.

**High:** None.

**Medium:**
1. IndexNow protocol not implemented — add a key file + submission script (or plugin/webhook) to ping Bing/Yandex/Naver on publish/update. (Section 9)
2. Confirm 100% GSC indexation claim with a fresh Coverage/Pages export — this audit verified no source-level regression but cannot read live GSC data directly. (Section 3)

**Low:**
1. CSP is minimal (`frame-ancestors 'self'` only); consider adding `default-src`/`script-src` directives if third-party scripts are introduced. No HSTS `preload` flag set. (Section 4)
2. Homepage inlines all CSS in `<style>` with no external stylesheet — fine for current site size, but monitor for bloat as more posts/components are added, which could start affecting render performance. (Section 6)
3. Complete the deferred site-wide Person-schema audit (previously noted for the Coleira GPS cluster) — this run's single-post sample was clean, but full coverage wasn't verified. (Section 8)

## Recommendations Detail
1. **IndexNow:** Generate a key (e.g. random hex string), host it at `/<key>.txt`, and add a lightweight script (cron or git post-commit hook) to POST updated URLs to `https://api.indexnow.org/indexnow` whenever `sitemap.xml` changes. Low effort, immediate indexing-speed benefit for a static Hostinger site with no CMS webhook.
2. **GSC verification:** Pull Search Console → Indexing → Pages report and cross-check the 77 sitemap URLs (76 posts/author pages + homepage) against "Indexed" count to reconfirm the 100% figure referenced in memory, now that this audit confirms no technical regression occurred since 2026-08-23.
3. **CSP hardening:** If/when affiliate network tracking scripts, analytics, or ad tags are added, extend CSP with `script-src 'self' <trusted-domains>` to reduce injection risk, and add `preload` to the HSTS header once submitted to the HSTS preload list (optional, low urgency for current risk profile).
