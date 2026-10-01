# SXO (Search Experience Optimization) Findings — smartpetgadgets.com.br

Date: 2026-09-30
Method: SERP-backwards analysis. Target pages rendered via `render_page.py --mode auto`
and parsed via `parse_html.py`. SERP top-10 pulled via WebSearch for 4 representative
Portuguese queries. Page types classified with page-type-taxonomy.md.

Context: Site is ~100% indexed in GSC (2026-09-28) but historically low impressions/clicks.
This is a **relevance/experience-match problem, not an indexation problem.**

---

## SXO Gap Score: 56 / 100 — "Needs Work"

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Page Type | 11/15 | Comparison/blog format is defensible, but head-term SERPs are dominated by marketplace listings + 5–10 item listicles the site doesn't match |
| Content Depth | 9/15 | Flagship comparison 1,656 words / only 3 products; competitors run "10 opções" at 2,000+ words |
| UX Signals | 9/15 | Good heading structure (7–8 H2s), but thin on comparison tables and scan aids |
| Schema | 11/15 | 3 schema blocks per article — a genuine strength vs many competitors |
| Media | 5/15 | 1–4 images per page vs listicles packed with product photos + comparison visuals |
| Authority | 4/15 | New low-DA affiliate site competing with Mercado Livre, Amazon, Petz, Petlove; ~0 historical impressions |
| Freshness | 7/10 | 2026-dated, current — a strength |

---

## PRIMARY FINDING — Page-Type / Format Mismatch on HEAD commercial queries (severity: HIGH)

The site's underperformance splits cleanly by query class:

**A) Head commercial queries — MISMATCH (HIGH).**
Queries: `melhor antipulgas para cachorro`, `comedouro automático para gato`, `coleira gps para cachorro`.
SERP top-10 consensus is a blend of:
- **Marketplace / Product-listing pages** (Mercado Livre, Amazon, Leroy Merlin) occupying multiple slots — Product type.
- **Broad multi-product listicles** ("10 opções", "5 melhores", "As 5 melhores sem mensalidade 2026") from high-authority pet retailers (Petz, Petlove) and affiliate sites — Comparison type with 5–10 products, many images, tables.

Target pages are **narrow blog/comparison posts**:
- `melhor-antipulgas-para-cachorro` → only 3 products (Simparic/Bravecto/NexGard), 4 images, 1,656 words. SERP listicles cover 5–10 options incl. pipettes, sprays, Frontline, Advocate — the site omits entire product formats users expect.
- `comedouro-automatico-para-dois-gatos` → 1,474 words, **1 image**, targets a long-tail while the head term SERP is marketplace-heavy.

Mismatch driver isn't purely page-type (comparison is arguably right); it's **breadth + media + authority**: the page cannot satisfy the "show me the full ranked field with photos and prices" expectation, and it competes for slots that marketplaces structurally own.

**B) Long-tail informational queries — ALIGNED.**
Query: `comedouro automático faz mal para gato` → SERP is entirely blog posts (patasdacasa, sougato, gatomaníacas, publico.pt). The site's format matches perfectly here. Pages like "comedouro automático faz mal?" and "para dois gatos" sit in the site's true sweet spot.

**Implication:** The site is publishing blog-format content and pointing it at head commercial terms where marketplaces + established-authority listicles win. Impressions are low because the format/authority don't match the dominant SERP intent for those terms.

---

## User Stories (each cites a SERP signal)

1. **As a worried dog owner** (awareness), I want to know if a flea product is safe/effective for my dog's weight, because I fear harming my pet, but I'm blocked by an **information gap** — the site's 3-product scope omits pipette/spray options I see everywhere else.
   *(Signal: SERP results list Bravecto/NexGard/Simparic/Advocate/Frontline across formats; "eficácia e segurança" framing.)*

2. **As a comparison shopper** (consideration), I want a full ranked list of the best options with photos and prices, because I'm overwhelmed by choices, but I'm blocked by **comparison fatigue** — competitors give "10 opções"; the site gives 3.
   *(Signal: listicle titles "10 opções", "5 Melhores", "As 5 Melhores Coleiras GPS".)*

3. **As a ready-to-buy tutor** (decision), I want to buy the collar/feeder now, because I've decided, but I'm blocked by a **format mismatch** — I land on marketplace listings (ML, Amazon), not a blog.
   *(Signal: Mercado Livre / Amazon / Leroy Merlin occupy multiple top slots for product terms.)*

4. **As a skeptical cat owner** (awareness→consideration), I want to know if an automatic feeder harms my cat, because I've heard it causes anxiety, but I'm blocked by **trust gap** if the source lacks vet credibility.
   *(Signal: "faz mal" SERP full of blogs quoting feline specialists; risk-framed PAA-style content.)*

5. **As a budget-conscious buyer** (decision), I want a GPS collar with no monthly fee, because recurring costs deter me, but I'm blocked by **price sensitivity** — top results explicitly promise "sem mensalidade".
   *(Signal: "As 5 Melhores Coleiras GPS sem mensalidade 2026", AirTag/SmartTag alternatives.)*

---

## Persona Scores (flagship comparison page as representative)

| Persona | Relevance | Clarity | Trust | Action | Total | Rating |
|---------|-----------|---------|-------|--------|-------|--------|
| Comparison Shopper (broad list) | 13 | 15 | 14 | 12 | 54 | Needs Work |
| Ready-to-Buy Tutor | 10 | 14 | 12 | 10 | 46 | Needs Work |
| Worried/Safety-first Owner | 18 | 17 | 15 | 14 | 64 | Good |
| Budget-Conscious Buyer | 11 | 13 | 12 | 11 | 47 | Needs Work |
| Skeptical (does-it-harm) Owner | 19 | 18 | 16 | 15 | 68 | Good |

**Weakest persona: Ready-to-Buy Tutor (46/100).** The page reads as an article, not a buying surface; affiliate CTAs and current prices are not the primary above-fold element the way marketplace results are.
- Fix: Add an above-fold comparison table (product | preço | duração | peso | link "Ver preço") with clear affiliate buttons per row.

**Systemic issues across personas:**
- **Media (all personas):** too few product images; add per-product photos + a visual comparison table.
- **Breadth (Comparison + Budget):** expand from 3 to 5–8 options including pipette/spray formats and no-monthly-fee GPS models to match SERP field.
- **Action (commercial personas):** CTAs are secondary; competitors and marketplaces surface price/buy prominently.

**Priority actions:**
1. Rebuild flagship head-term pages as full ranked listicles (5–8 items) with above-fold comparison table, product images, and prominent "Ver preço" CTAs.
2. Add multiple product images site-wide (media score is the single lowest content dimension: 5/15).
3. Double down on long-tail informational content (the ALIGNED bucket) where format already wins and marketplaces don't compete — fastest path to first impressions/clicks.
4. Build authority (author E-E-A-T, vet review credentials, backlinks) — the structural blocker vs Petz/Petlove/marketplaces.

---

## SERP Feature Notes
- Product terms: heavy marketplace + shopping presence (ML, Amazon, Leroy Merlin), video result (YouTube) for GPS collars.
- Informational terms: blog-only SERP, no marketplace intrusion — the winnable space.
- Related/qualifier signals observed: "sem mensalidade", "custo-benefício", "vale a pena", "faz mal", "2026" — strong evaluative + risk + freshness intent.

## Cross-Skill Recommendations
- Authority/E-E-A-T gaps → run `/seo content` (author credibility, vet review).
- Product schema for listicle rebuilds → `/seo schema` (ItemList / Product / review ratings).
- Thin/narrow pages → `/seo page` audit for the head-term comparison pages.

## Limitations
- WebSearch does not expose live PAA boxes, AI Overview, or ad density; user stories inferred from result titles/snippets and related-query patterns, not scraped SERP features.
- Some results were .pt (Portugal) domains; Brazil-localized ranking may differ slightly from WebSearch's US-based index — treat exact positions as directional.
- Persona scores are based on the flagship antipulgas comparison page as a representative sample, not every page.
- Competitor Domain Authority not measured quantitatively; authority gap is inferred from brand prominence.
