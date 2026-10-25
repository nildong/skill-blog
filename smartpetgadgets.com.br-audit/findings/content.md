# Content Quality Findings — smartpetgadgets.com.br

Date: 2026-10-23 · Reviewer: Content Quality (QRG Sep 11, 2025) · Delta against the 2026-10-22 audit
Scope: 78 crawled URLs (72 posts, home, author page, sobre, politica-editorial, contato, privacidade). Method: on-disk HTML parsed with BeautifulSoup. Removed before counting: `<head>`, scripts and styles, breadcrumb nav, `p.meta` byline, `.cta-box`, `.disclosure` and the author box. Readability uses Flesch adapted to Portuguese (Fernandes) with a rough syllable estimate, so read it as relative, not exact. Metadata check: `metadata_template.py --pairs-file` across all 78 pairs.

## Scores

| Metric | Score | Prior (10-22) |
|---|---|---|
| Content quality | **71/100** | 79 |
| E-E-A-T (weighted, internal model) | 59/100 | ~65 |
| AI citation readiness | 76/100 | 82 |
| On-Page SEO (titles, metas, headings, internal links) | **82/100** | n/a |

E-E-A-T breakdown (this skill's weights, not Google's):
- Experience (20%): **45**. No first-hand artifacts anywhere. One page claims testing the site never did (see H1).
- Expertise (25%): **58**. Honest no-credential disclosure. "Como Avaliamos" appears on only 13/72 posts, but /sobre/ says "a seção Como Avaliamos de cada artigo deixa isso claro".
- Authoritativeness (25%): **55**. Unchanged: author has no image and only one `sameAs` (Facebook).
- Trustworthiness (30%): **72** (was ~85). Disclosures and policy pages are good, but the authorship and testing statements contradict each other across 50+ pages (H1, H2).

Why the score went down: most of the drop comes from closer measurement, not from new damage. This pass strips chrome and measures FAQ redundancy, and that showed problems the 10-22 pass missed (H1-H3). The one real content change, the tapete rewrite, is a clear improvement apart from one factual error.

---

## CRITICAL

None.

## HIGH

### H1 — NEW (missed 10-22): unsupported first-hand testing claim
`comedouro-vdrbg-4l-wifi-review/` Key Takeaways: *"Testamos 3 comedouros automáticos de 4L: Velds (app Wi-Fi), Newpet (app + voz) e um modelo programável com LCD sem app."* It was added in commit abb7e02. The author page, /sobre/ and the "Não testamos fisicamente" lines on soprador-pet and tapete-higienico all say the site does not test products. The 10-22 claim that "all 'testamos' uses are negated" is wrong.
Fix: rewrite it as "Comparamos 3 comedouros..." unless real test evidence (photos, measurements) exists and gets published.

### H2 — NEW: authorship statements contradict each other site-wide
- 61 pages show the byline "Por Nildo Alves" and then, above the CTA, *"Escrito pela Equipe Smart Pet Gadgets, redação especializada em comparativos..."*. No team exists. /sobre/ names only one writer, so it is unclear who wrote the page.
- 52 pages have an author box saying *"Testa e pesquisa produtos para cães e gatos"*. That contradicts the author page and the "Não testamos" disclosures.
- The tapete rewrite already uses the honest box text ("Pesquisa especificações de fabricante...") but still has the "Equipe" line.
Fix: one template-level change. Replace the "Equipe/redação especializada" paragraph with the Nildo Alves attribution, and use the tapete author-box wording on every page. This is the highest-value Trust fix available.

### H3 — CONFIRMED and sharper than reported: the camera, brinquedo and porta-eletrônica clusters are thin
Body word counts with chrome removed. The crawl's 600-750 figures included chrome.

| Cluster | Posts | Median body words | Median after removing FAQ restatement |
|---|---|---|---|
| Camera | 11 | 530 | ~350 |
| Brinquedo interativo | 9 | 473 | ~320 |
| Porta eletrônica | 11 | 501 | ~336 |
| Coleira GPS (for comparison) | 11 | 752 | ~580 |
| Comedouro (for comparison) | 18 | 1,410 | ~1,200 |

- 31/72 posts are under 600 body words and 40/72 are under 800 (10-22 reported 8 and 31).
- FAQ sections repeat the body almost word for word. Median token overlap between FAQ answers and body is 0.88, and 42 pages score 0.8 or higher (porta-eletronica-sensor-de-luz and porta-eletronica-x-alcapao score 1.0). The FAQPage schema therefore adds little new content.
- Every page in these clusters follows one template: an answer-first lede, 3-5 short H2s (1-2 sentences each), the FAQ restatement, a conclusion, 2-4 internal links and a generic CTA. 44/72 posts were published on 2026-08-22 and 58/72 have never been modified.
- Under the QRG, a repeated structure across pages, generic content and no original insight are markers of low-effort scaled content. The pages are accurate and cite sources. The problem is that they add almost nothing that the cited source does not already say.
- Example: `melhor-camera-para-monitorar-pet/` (439 words). All four product claims come from one source (mybest). The table's "Recurso extra" column restates the "Destaque" column. A single unnamed Mercado Livre CTA covers four products. The page is unchanged since 08-22.

Fix, in priority order:
1. Merge the micro-FAQ, "erros comuns" and "vale a pena" stubs into each cluster pillar where intent overlaps (e.g. brinquedo-gato-idoso, brinquedo-entediado and brinquedo-substitui-tutor into the brinquedo pillar), and 301 the merged URLs.
2. On the posts that stay, replace the restated FAQs with new questions, or drop the FAQ.
3. Rebuild melhor-camera-para-monitorar-pet as a real comparison along the lines of the tapete rewrite: named models, dated prices, specs table, pros and cons, and who should buy what.

## MEDIUM

### M1 — STILL OPEN: author identity is thin
No change since 10-22: no photo or `image`, a single `sameAs` (Facebook), generic `jobTitle` ("Curadoria de produtos pet"), no `knowsAbout`. /sobre/ (374 words) and /politica-editorial/ (228 words) have the same length and text as before.
Add to politica-editorial:
- an explicit statement on whether and how AI tools are used in writing (QRG transparency)
- how the "nota" scores are calculated (relevant to tapete, see M3)
- a corrections log

### M2 — STILL OPEN: Experience is capped by the curation model
No first-hand photos, measurements or app screenshots on any flagship review. Recommendation unchanged: add real hands-on artifacts to 3-4 flagship reviews, and do not claim testing anywhere else (see H1).

### M3 — NEW: review of the melhor-tapete-higienico-para-cachorro rewrite (7-product comparison)
Strengths. This is now the best page on the site and a good model for the others:
- 2,955 body words; ItemList, FAQPage and BlogPosting schema; 7 unique affiliate links
- every price dated ("consultado no Mercado Livre em 23/10/2026")
- pros and cons for each product and a "Como escolher" decision guide
- honest note on the Petlike listing (packaging says 6 layers, technical field says 1)
- sourced sizing, layer and change-frequency guidance; a "Como Avaliamos" section that says no lab testing was done
- the honest author-box wording

Problems:
- **Factual error.** The page says Luxena Pipi has *"o menor preço por unidade do grupo (R$ 0,92)"*, in the Resumo and twice in the card. At the page's own prices, Luxena is R$ 42,23/50 = **R$ 0,84** and Biosec is R$ 44/50 = **R$ 0,88**. The R$ 0,92 figure does not match the stated Pix price. Recompute every per-unit figure and keep them consistent.
- **Mixed price dates.** The Biosec price is from 04/10 and the other six are from 23/10. The #1 pick has the oldest price. Re-check Biosec.
- **Ratings with no stated method.** The notes (8.8 down to 7.0) have no formula, and politica-editorial does not explain them. State the inputs and weights.
- **Wording.** "Quer o mais vendido e testado" suggests testing; use "mais avaliado". The Pet Confortável con, "Menor nota do grupo, empatada com o Biosec", reads oddly because Biosec is ranked #1.
- **Heading order.** The H3 "Ficha Técnica Detalhada: Biosec" sits under the H2 "Problemas Comuns". The FAQ comes after the conclusion and CTA. Move the ficha into or after the ranking.
- **Leftover "Escrito pela Equipe" line** (H2).
- **Weak internal link.** It points filhote readers to the comedouro guide. Better targets: tapete-higienico-para-cachorro (Nekko review, already linked) and cercado-para-cachorros.
- **Overlap.** Possible overlap with `tapete-higienico-para-cachorro/` (review of one product, never modified since 08-19). They are complementary if the review page targets "vale a pena Bamboo.dry Nekko" and links up to the comparison. Make sure it does.

### M4 — NEW: thin-affiliate pattern on information posts outside the comedouro cluster
Every camera, brinquedo and porta-eletrônica information post ends with a single "Confira o preço... Mercado Livre" CTA that names no product. Example: porta-eletronica-funciona-porta-de-vidro names no model at all. On 300-word pages this makes monetization look like the main purpose. Either name and justify the linked product in the body, or link to the cluster's comparison page instead of directly to the marketplace.

### M5 — Readability: sentences are long for mobile
Median sentence length is 25 words site-wide and 27-34 on the longer money pages (melhor-tapete 32.4, coleira-seresto 33.9). Approximate PT Flesch median is 44 ("difícil"). Several brinquedo and comedouro pages score below 30 (melhor-comedouro-interativo-gato 16.5). Aim for an average of 15-20 words per sentence. Split sentences joined by em dashes and parenthetical source clauses.

## LOW / INFO

- **L1 — Metadata templating: clean (re-verified).** 78 pairs: `site_risk: low`, `templated_ratio: 0.0`, `templated_count: 0`, `shared_cta_phrases: {}`, no site flags. Only secondary flag: `brand_suffix_in_description` on contato, politica-editorial and politica-de-privacidade (cosmetic).
- **L2 — Freshness.** 58/72 posts have dateModified == datePublished. All 44 posts from 08-22 are untouched. When pages are refreshed, change the dateModified only for real updates, and add a changelog line.
- **L3 — Cannibalization.** Low risk, as before. The pillar-to-FAQ pairs only make sense as complementary if the FAQs answer new questions (see H3).
- **L4 — Affiliate disclosure.** Compliant: inline, at the CTA and in the footer.
- **INFO — Comedouro cluster CTA/product depth.** Paused by the owner for reformulation. Not re-flagged. Body depth is fine (median ~1,200 unique words).

## AI citation readiness (76/100)
- Strengths: answer-first ledes; dated, linked third-party sources ("retrieved 2026-xx-xx"); FAQPage and ItemList schema; the tapete page has many quotable facts (prices, sizes, layer counts, review counts).
- Weaknesses: thin pages restate one external source, so answer engines will cite that source instead. FAQ answers duplicate the body. Long sentences reduce how well passages can be extracted. The Luxena per-unit error is exactly the kind of number that gets quoted.

## On-Page SEO (82/100)
- Titles are unique (0 duplicates). Canonicals all self-referential. Every page has one H1. Title and H1 match on 63/78. No metadata templating.
- Over length:
  - titles over 60 characters: melhor-tapete (67), coleira-gps-cachorro-que-foge (66), comedouro-para-viagem (64), comedouro-para-dois-gatos (64), and 2 others at 61
  - descriptions over 160 characters: author page (191), melhor-tapete (170), gato-obeso (161)
  - short descriptions: contato (71), erros-comuns-porta (94)
- Internal linking:
  - median of 4 contextual links per post; 23 posts have 3 or fewer
  - anchors are often generic ("volte ao guia completo de...")
  - thin clusters link mostly within themselves; few links go to the comparison or money pages
- Headings: the template gives a flat H2 list where many H2s cover only one sentence. Heading order problem on melhor-tapete (M3).
- 8 posts cite no external sources, including melhor-comedouro-automatico-cachorro, melhor-alimentador-automatico-gatos and coleira-gps-para-pet.

## Delta summary

| Item | Status |
|---|---|
| Hollow author entity (10-11 H1) | Fixed earlier; residual M1 still open, unchanged |
| "We tested" claims (10-11 H2) | **Regressed / missed**: vdrbg "Testamos 3" (H1) |
| Byline "Equipe" / "Testa e pesquisa" conflict | **NEW HIGH** (H2) |
| Thin content | **Escalated**: real body counts lower; 31 posts <600w, FAQ restatement (H3) |
| sobre / politica-editorial depth | Still open, unchanged |
| melhor-tapete rewrite | **NEW**: big improvement; 1 factual error plus minor fixes (M3) |
| Thin-affiliate CTAs on info posts | **NEW** (M4) |
| Metadata templating | Still clean |
| Comedouro CTA depth | Paused by owner (Info) |

## Structured findings (audit-data.json, Content Quality)

```json
{"category":"Content Quality","score":71,"eeat":{"experience":45,"expertise":58,"authoritativeness":55,"trustworthiness":72,"weighted":59},"ai_citation_readiness":76,"onpage_seo":82,
"findings":[
{"id":"CQ-H1","severity":"high","status":"new","title":"Unsupported 'Testamos 3 comedouros' claim","urls":["/comedouro-vdrbg-4l-wifi-review/"]},
{"id":"CQ-H2","severity":"high","status":"new","title":"Byline conflict: 'Equipe Smart Pet Gadgets, redação especializada' (61 pages) + 'Testa e pesquisa produtos' author box (52 pages) vs single non-testing author"},
{"id":"CQ-H3","severity":"high","status":"escalated","title":"Camera/brinquedo/porta clusters ~320-350 unique body words; FAQ restates body (median overlap 0.88); templated structure, 44 posts same day"},
{"id":"CQ-M1","severity":"medium","status":"open","title":"Author identity thin: no image, single sameAs; sobre/politica-editorial unchanged; no AI-use or scoring-method disclosure"},
{"id":"CQ-M2","severity":"medium","status":"open","title":"No first-hand experience artifacts on flagship reviews"},
{"id":"CQ-M3","severity":"medium","status":"new","title":"melhor-tapete: per-unit price error (Luxena R$0,92 claimed lowest; actual R$0,84, Biosec R$0,88), mixed price dates, rating method undisclosed, heading order","urls":["/melhor-tapete-higienico-para-cachorro/"]},
{"id":"CQ-M4","severity":"medium","status":"new","title":"Unnamed-product Mercado Livre CTA on ~30 thin info posts outside comedouro cluster"},
{"id":"CQ-M5","severity":"medium","status":"new","title":"Long sentences (median 25 words), PT-Flesch ~44"},
{"id":"CQ-L1","severity":"low","status":"ok","title":"Metadata templating clean: site_risk low, templated_ratio 0.0"},
{"id":"CQ-L2","severity":"low","status":"open","title":"58/72 posts never modified"},
{"id":"CQ-INFO1","severity":"info","status":"paused","title":"Comedouro cluster CTA/product depth paused by owner"}]}
```
