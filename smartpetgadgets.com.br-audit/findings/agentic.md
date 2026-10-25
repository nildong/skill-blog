# Agent Readiness Findings — smartpetgadgets.com.br

> **Re-check 2026-10-23 (partial, delta only).** The Claude SEO runtime was not ready ("Run `/seo setup`"), so `lighthouse_agentic.py`, `agentic_check.py` and `agent_ux_check.py` did not run. Setup was not run automatically. Only curl probes were done. **Lighthouse X/N and the Agent-UX score are unavailable for this pass.** The 2026-10-22 values below (3/3 mobile and desktop on Lighthouse 13.5.0; Agent-UX 100, complete) are carried over and not re-verified.
>
> Delta vs 2026-10-22 (curl, live):
> - UNCHANGED, P2: `llms.txt` (200, 19,892 B, was ~19.5 KB) still has no `cerca-virtual-para-cachorro` entry. The page returns 200 and is in the sitemap. The sitemap now has 78 `<loc>` entries.
> - UNCHANGED: robots.txt (200, 1,490 B) has named per-vendor groups, all `Allow: /`, each with `Content-Signal: search=yes, ai-input=yes, ai-train=no`. `/` also has `Disallow: /reports/` and `/?s=`. Content-Signal is a draft/proposal (vendor-matrix, 2026-09-23).
> - UNCHANGED: `Accept: text/markdown` on `/` returns `text/html`. `/index.md`, `/llms-full.txt`, `/.well-known/ai-catalog.json`, `agent-card.json` and `api-catalog` all return 404, which is an opportunity, not a defect.
> - UNCHANGED: no `registerTool` or `modelContext` and no `<form` in the home HTML, so WebMCP is not applicable (W3C CG draft).
> - Not retested: the UA-matrix and the earlier GPTBot 429 (not authorized).
> - Re-run `/seo setup`, then this audit, to refresh the Lighthouse fraction.

Checked: 2026-10-22. Vendor/standards status dated from `vendor-matrix.md` (last full check 2026-09-23). UA-matrix WAF probing was **not run** this pass (not authorized for this audit); the previous transient-429 finding from the 2026-10-11 pass is not re-confirmed or re-tested here.

## Lighthouse Agentic Browsing fraction

- Mobile: **3/3** (Lighthouse 13.5.0, PSI mobile, category_score 1)
- Desktop: **3/3** (Lighthouse 13.5.0, PSI desktop, category_score 1)

Counted audits (both form factors): `agent-accessibility-tree` (pass), `cumulative-layout-shift` (pass, CLS 0), `llms-txt` (pass). `webmcp-form-coverage`, `webmcp-registered-tools`, `webmcp-schema-validity`, and `ard-schema` are not-applicable (no forms needing WebMCP, no ai-catalog.json signalled), so they do not count toward the fraction.

Path to a higher N (not a current deficiency): publishing a valid `/.well-known/ai-catalog.json` would add one more counted audit (`ard-schema`). An invalid catalog would instead add a counted failure, so only do this if there is a real agent resource (MCP server, A2A agent, skills) to list — this site is content-only, so it is an opportunity, not a gap.

## Agent-UX heuristic (accessibility-tree, separate from Lighthouse)

Score: **100/100**, status: **complete** (no partial reasons, no issues).

- 224 real anchors, 1 real button, 0 `div onclick` fake widgets
- 78 semantic landmarks detected
- Accessibility tree: 1,567 nodes, 225 interactive (224 `role=link`, 1 `role=button`), 0 unnamed interactive nodes
- 0 inputs without label/ARIA

This confirms the static, server-rendered HTML is clean and directly consumable by an accessibility-tree-based agent (e.g., Claude in Chrome, Comet) without needing JS execution. 2,652 words of primary content render without JavaScript; no JS-shell marker.

## Findings by priority

### P0 — none

Server rendering, robots.txt reachability, and named AI user-agent groups (16 groups, all `root_allowed: true`) all pass.

### P2 — Medium: llms.txt is missing 1 of 77 live articles (the recently restored post)

- Evidence: `llms.txt` now lists 76 article links under `## Artigos` plus 6 utility pages — a large improvement over the prior audit's near-empty 6-link stub. Comparing the 76 slugs in `llms.txt` against the 76 post directories that have a live `index.html`, the one gap is **`cerca-virtual-para-cachorro`**: it returns `200` live, is present in `sitemap.xml` (line 80), and has 2 internal links from other posts, but has no entry anywhere in `llms.txt`.
- Likely cause: this post was restored on 2026-10-19 per the recent commit `30cc996 fix(cerca-virtual-para-cachorro): restaura artigo e remove redirect indevido`, and `llms.txt` (last modified per git status, but apparently regenerated before or without that restoration) was not re-run afterward to pick it up.
- This does not fail the Lighthouse `llms-txt` audit (which only checks format: H1, one Markdown link, 50+ chars, not completeness), so the Lighthouse fraction is unaffected. It is a content-accuracy gap in an agent-discovery aid, not a defect that blocks crawling — the page is still reachable via sitemap.xml and internal links.
- Fix: re-run whatever script/process generates `llms.txt` from the current post inventory (or add the single missing line manually) so all 77 live articles are listed. Keep this file in sync going forward whenever a post is restored, renamed, or removed (see the existing slug-change log for this site).

### P1 — Info: no Markdown-equivalent content delivery (opportunity, not a defect)

- Evidence: `Accept: text/markdown` negotiation on `/` returns `200 text/html` (no distinct Markdown body, `vary_accept: true` but no `x_markdown_tokens`), no `rel="alternate" type="text/markdown"` link found, and `/index.md` / a sampled post's `/index.md` both return `404`.
- No consumer agent is confirmed to request Markdown via content negotiation (per vendor-matrix gap note, checked 2026-09-23), so this is optional.
- Fix (optional): offer a Markdown-equivalent via `Accept: text/markdown` + `Vary: Accept`, a `rel="alternate"` link, or `.md` sibling URLs if the team wants to pre-empt future agent fetchers.

### P2 — Info: WebMCP absent (not applicable, expected for a content site)

- 0 forms, 0 `registerTool(` call sites, no `navigator.modelContext` / `document.modelContext`. Lighthouse reports all `webmcp-*` audits as not-applicable.
- WebMCP is a W3C Community Group **draft**, not a standard; WebKit opposes it, Mozilla is neutral (dated 2026-09-23). Chrome's WebMCP origin trial runs M149–M156 with no ship milestone announced.
- This site has no search/booking/checkout/lead forms, so WebMCP tool registration is not applicable rather than a gap. No action needed unless the site adds transactional forms.

### P3 — Opportunity: no ai-catalog.json, no `/.well-known/` agent-discovery files

- `/.well-known/ai-catalog.json`, `/.well-known/agent-card.json` (A2A), `/.well-known/api-catalog` (RFC 9727), OAuth Protected Resource/Authorization Server metadata, and `/.well-known/ucp` (commerce profile) all return 404.
- All correctly scored `not-applicable` / `na` — these only matter if the site operates a matching service (MCP server, A2A agent, UCP commerce profile, OAuth-protected API). A pure content/affiliate blog has none of these, so their absence is expected, not a defect.

### Pass, with the one gap above: llms.txt

- `https://smartpetgadgets.com.br/llms.txt` returns `200 text/plain`, ~19.5 KB, with an H1, a description blockquote, a "## Pages" section (6 utility links), and a "## Artigos" section with 76 of the 77 live article links (see P2 finding above for the missing one). Lighthouse's `llms-txt` audit passes on both form factors.
- Note: `llms.txt` is a **community spec** (llmstxt.org), not a web standard. Google Search does not use it; Lighthouse checks it only as a lab heuristic. Its presence is a convenience signal, not a ranking or citation guarantee.
- `llms-full.txt` is absent (404) — optional, not required by the Lighthouse check.

## Access policy lines

- **Training**: GPTBot, ClaudeBot, CCBot are named in robots.txt and allowed at the root (`root_allowed: true`); Content-Signal declares `ai-train=no` for all of them — i.e., crawling/indexing is permitted but the site is explicitly opting out of AI training use via the Content-Signal preference (not enforceable; Google has made no statement on honoring Content-Signal, dated 2026-09-23).
- **Search**: OAI-SearchBot, Claude-SearchBot, PerplexityBot are named and allowed; Content-Signal declares `search=yes` for all — consistent allow-for-citation policy across vendors.
- **User-triggered**: ChatGPT-User, Claude-User, Perplexity-User, Google-Agent are named/handled; robots.txt behavior for these varies by vendor documentation (Claude-User honours robots.txt; ChatGPT-User "may not apply"; Perplexity-User and Google-Agent "generally ignore" robots.txt per vendor docs, dated 2026-09-23) — none are blocked at the root regardless.

## Standards-status notes (dated 2026-09-23 per vendor-matrix.md)

- **Content-Signal**: Cloudflare CC0 policy + an IETF individual draft that expired 2026-04-04; a stated preference, not an enforcement mechanism. Google has made no statement on honoring it, and Google's own robots.txt spec doesn't list the field.
- **WebMCP**: W3C Community Group draft only. WebKit opposes it; Mozilla is neutral. Chrome origin trial M149–M156, no shipping milestone set.
- **ai-catalog.json / Agentic Resource Discovery (ARD)**: spec 1.0, checked by Lighthouse 13.5's `ard-schema` audit; not a ratified standard.
- **llms.txt**: community convention (llmstxt.org), checked by Lighthouse as a lab heuristic; ignored by Google Search.
- **Web Bot Auth**: IETF draft `draft-ietf-webbotauth-httpsig-protocol-00` (2026-09-01); not observed or tested on this site in this audit (UA-matrix probing was not run this pass).

## What changed since the 2026-10-11 audit

- `llms.txt` went from a 6-link, ~600-byte stub to a 19.5 KB file listing 76 of 77 live articles plus 6 utility pages — the High-severity "near-empty stub" finding from the prior audit is resolved, with one small follow-up (the missing `cerca-virtual-para-cachorro` entry) left to fix.
- The previously observed transient GPTBot 429s were not re-tested this pass (no UA-matrix run) and should not be assumed resolved or reproduced either way.

## Score: 92/100

Rationale: all P0s pass (clean server-rendered HTML, reachable robots.txt with 16 deliberate per-vendor groups, CLS 0, well-formed accessibility tree), Lighthouse Agentic Browsing is a full 3/3 on both form factors, and llms.txt — the item flagged High-severity in the previous audit — is now populated with 76/77 articles. The 8-point deduction is for: the one missing article in llms.txt (P2, easy fix), and the standing opportunities that are expected for a content-only blog and not true defects (no Markdown delivery, no ai-catalog.json/.well-known agent-discovery files, WebMCP not applicable) — these cap the score below-perfect as documented opportunities rather than failures. No ranking, citation, or traffic effect is implied by this score.
