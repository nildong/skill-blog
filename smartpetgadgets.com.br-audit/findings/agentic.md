# Agent Readiness Audit — smartpetgadgets.com.br

Checked: 2026-09-30. Standards-status dates per vendor-matrix.md (last full check 2026-09-23).

## Lighthouse Agentic Browsing

- Mobile: **3/3** (Lighthouse 13.5.0, mobile form factor)
- Desktop: **3/3** (Lighthouse 13.5.0, desktop form factor)

Counted audits, both strategies: `agent-accessibility-tree` (pass), `cumulative-layout-shift` (pass, CLS 0), `llms-txt` (pass). WebMCP audits (`webmcp-form-coverage`, `webmcp-registered-tools`, `webmcp-schema-validity`) and `ard-schema` are not-applicable — no forms/tools and no `ai-catalog.json` were found, so they don't count toward the fraction. Lighthouse itself lists one path to add a counted audit: publish a valid `/.well-known/ai-catalog.json` (invalid would add a counted failure instead, so only do this with real agent resources to list).

## Agent-UX heuristic (accessibility-tree quality)

Score: **100/100** — status: complete (not partial).

Evidence: 1538 accessibility-tree nodes, 220 interactive nodes, all real `<a>` anchors (0 real `<button>` elements, 0 div-onclick widgets), 77 semantic landmarks, 0 unnamed interactive elements, 0 inputs missing labels/ARIA. This is a separate 0-100 heuristic, not part of the Lighthouse fraction above.

## Findings by priority

### P0 (none — all pass)
- Server rendering: pass. 2,562 words visible without JS; no JS-shell marker.
- robots.txt reachable: pass. 200, 16 groups.
- Deliberate robots.txt groups for AI agents: pass. Named groups for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, CCBot. No search crawler blocked at root.

### P1
- **Content-Signal policy** — pass, and intentional per your framing: all 16 groups declare `search=yes, ai-input=yes, ai-train=no`. This is a coherent policy (allow AI search citation and live user-triggered fetches, opt out of model training) consistently applied with no orphan lines or named groups missing a signal. Note for the report: Content-Signal is a CC0/IETF-draft preference, not an enforcement mechanism — Google has stated it does not act on it, and adherence depends on each vendor's crawler honoring it voluntarily.
- **llms.txt** — pass on the Lighthouse binary check (H1, Markdown link, 600 bytes, well past the 50-char floor), but only lists 5 static pages and omits all 70+ published articles. This is a coverage gap, not a Lighthouse failure — Lighthouse only validates the file's format, not completeness. Opportunity: extend llms.txt (or add a curated subset / category index) to surface the article catalog for agents that consult it, since AI search crawlers (OAI-SearchBot, Claude-SearchBot, PerplexityBot) are explicitly allowed to index and cite this content per the Content-Signal policy above.
- **Markdown delivery** — info/opportunity, not a defect. No `Accept: text/markdown` content negotiation, no `rel="alternate" type="text/markdown"`, and `/index.md` 404s. No primary source currently shows any consumer agent requesting Markdown (vendor-matrix.md, checked 2026-09-23), so this has no confirmed access-policy or ranking impact today.
- **User-triggered agents vs robots.txt** — pass, with a documented caveat: Claude-User honours robots.txt (and root is allowed here); ChatGPT-User's robots.txt adherence "may not apply"; Perplexity-User and Google-Agent "generally ignore" robots.txt for user-triggered actions. None are blocked at root on this site regardless.
- **HTTP 404 handling** — pass. Unknown URL returns a real 404, no soft-404/catch-all 200.

### P2 (opportunities, not defects)
- **WebMCP** — no `registerTool(` call sites, 0 forms found, `navigator.modelContext` / `document.modelContext` not present. WebMCP is a W3C Community Group **draft**, not a standard (WebKit opposes it, Mozilla is neutral; checked 2026-09-23), and the site has no transactional forms to annotate, so this is informative only — it does not affect the Lighthouse fraction (all three WebMCP audits were not-applicable).
- **ai-catalog.json / Agentic Resource Discovery (ARD)** — absent, not signalled, `/.well-known/ai-catalog.json` returns 404. ARD is spec 1.0 checked by Lighthouse 13.5's `ard-schema` audit (checked 2026-09-23); absence is treated as not-applicable by Lighthouse, so this is an opportunity only if the site later exposes agent resources (MCP server, A2A agent, skills) worth cataloging — not before.
- Other `/.well-known` files probed (api-catalog, oauth-protected-resource, oauth-authorization-server, agent-card.json, ucp) all 404 — all correctly not-applicable; none of these map to a service this site operates.

### P3
- No A2A agent card, no UCP commerce profile, no declarative WebMCP form annotations — all not-applicable given current site functionality (informational blog, no checkout/booking/API).

## Access policy summary (explicit lines)

- **Training**: ai-train=no across GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot — training access is opted out site-wide.
- **Search**: search=yes across all named AI search crawlers (OAI-SearchBot, Claude-SearchBot, PerplexityBot) and Google-Extended — indexing/citation in AI search is allowed.
- **User-triggered**: ai-input=yes for all agents at root; root not blocked for ChatGPT-User, Claude-User, Perplexity-User, Google-Agent. Actual enforcement varies by vendor (see P1 caveat above) since Content-Signal and robots.txt user-agent groups are voluntary, not enforced.

## Standards-status notes (per vendor-matrix.md, checked 2026-09-23)

- Content-Signal: Cloudflare Content Signals Policy (CC0) + IETF draft — a preference, not enforcement; Google states it does not act on it.
- WebMCP: W3C Community Group draft, not a standard; WebKit opposes, Mozilla neutral.
- ai-catalog.json / ARD: spec 1.0, now checked by Lighthouse 13.5 (`ard-schema`), still an emerging/optional convention.
- Markdown delivery: no primary source confirms any consumer agent requests `Accept: text/markdown`.
