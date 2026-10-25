# Search Experience Optimization (SxO) Findings — smartpetgadgets.com.br

Analysis date: 2026-10-23 (re-check; previous pass 2026-10-22)
Method: SERP-backwards analysis (pt-BR WebSearch, 8 queries) vs. on-page type/depth/format
of the target pages. Page types use the SxO page-type taxonomy. On-page metrics come from
the local source `/home/projetos/blog/<slug>/index.html` (read-only). Live state of the two
pages that changed was confirmed via WebFetch. Personas and user stories are derived only
from observed SERP signals.

This is an **SXO Gap Score**, separate from the SEO Health Score.

**SXO Gap Score: 63 / 100 (previous 60, DELTA +3)**

---

## Executive summary / DELTA

The primary bottleneck is still **page-type mismatch on commercial "melhor X" terms**.
It is smaller than it was yesterday:

- **FIXED:** `/melhor-tapete-higienico-para-cachorro/` went from a single-product post with a
  listicle title (MISMATCH) to a 7-product comparison: "Comparativo Rápido" table
  + "O Ranking Completo", ItemList + Product/Review schema, 9 images, 15 affiliate links,
  dateModified 2026-10-23. The live page matches the local source. Now **ALIGNED**.
- **CONFIRMED ALIGNED, now fresher:** `/melhor-comedouro-automatico-cachorro/` has 7 ranked
  products (VDRBG 4L Wi-Fi, Dogis Tech DA010BR, Newpet 4L, Madog, Jwcom JW4L-W, Hi by
  Geonav, Luatek), ItemList, 8 images, 14 affiliate links, dateModified 2026-10-22.
- **UNCHANGED MISMATCH:** the GPS and camera commercial pages, plus four more "melhor"
  pages, are still guide or essay content under a listicle title (1 image, 1 affiliate
  link, no ItemList).
- **NEW FINDINGS in this pass:** (a) camera-intent **cannibalization**: two pages,
  neither of them a real listicle; (b) a **keyword-variant gap** on the cat feeder page
  ("alimentador" vs. the queried "comedouro"); (c) the antipulgas listicle **still has no
  ItemList**.

Measurement note: word counts in this pass are visible text only (scripts, styles and
JSON-LD removed). The 2026-10-22 pass reported larger numbers, e.g. 3,508 vs. 2,105 for
melhor-comedouro-automatico-cachorro, because it used a different count. Compare word
counts within one pass only, not across passes.

---

## Keyword-by-keyword SERP vs. target (the 6 requested terms)

| # | Keyword | SERP dominant type (consensus) | Target page | Target type | Verdict | Delta vs 10-22 |
|---|---|---|---|---|---|---|
| 1 | melhor tapete higiênico para cachorro | Comparison/Top-N (my-best x3) + buyer's-guide blog (Petz x4, Buscapé x2). Listicle about 55%, guide about 45% | melhor-tapete-higienico-para-cachorro | Comparison (7 products) + guide sections (gel vs comum, tamanho, camadas, adestramento) | **ALIGNED** | MISMATCH -> ALIGNED |
| 2 | melhor comedouro automático para gatos | Ecommerce category (Cobasi, 7 of 9 URLs, 1 domain) + Comparison/Top-N (my-best x2). Domain-level: about 50/50 | melhor-alimentador-automatico-gatos | Comparison (6 products, ItemList) | **ALIGNED (type) / MEDIUM (lexical)**: title and H1 say "Alimentador", the query and my-best say "Comedouro" | new finding |
| 3 | melhor comedouro automático cachorro | Comparison/Top-N (Mercado Livre blog, my-best x3, Cupom Online) about 55%; guide (Buscapé/Zoom) about 22%; Product (Petz x2) about 22% | melhor-comedouro-automatico-cachorro | Comparison (7 products, ItemList) | **ALIGNED** | ALIGNED, refreshed 10-22 |
| 4 | coleira gps cachorro | **Fragmented / low consensus**: ecommerce search (Buscapé x2), Top-N (my-best x2), news and reviews (Tecnoblog x2, TecMundo), blog (andrelemos), complaint (Reclame Aqui). No type above 35% | coleira-gps-para-pet | Blog guide (1,662 words, 3 images, 2 affiliate links, no ItemList/Product, mod 2026-08-22) | **HIGH mismatch**: a guide with no product set against a SERP whose commercial slots are listicles and shops | unchanged |
| 5 | melhor antipulgas para cachorro | Ecommerce category (Cobasi x6) + guide-listicle (Petlove x2, vet-led "consulte o veterinário") + Top-N (my-best). Domain-level: listicle/guide 2 of 3 | melhor-antipulgas-para-cachorro | Comparison (6 named products as H3s, table, 7 images, 12 affiliate links, mod 2026-10-14) | **ALIGNED (type) / MEDIUM (schema + YMYL trust)**: no ItemList/Product, no veterinary reviewer | unchanged |
| 6 | câmera para monitorar pet | Comparison/Top-N (mundodosreviews, seuguiadetecnologia, guiaomelhor, itigic) about 45%, the strongest relevant block; news (ohoje); product pages (petdoctors, petcircle) | camera-para-monitorar-pet **and** melhor-camera-para-monitorar-pet | Both are guides or stubs: 1,016 and 587 words, 1 image, 1 affiliate link each, no ItemList | **CRITICAL mismatch + cannibalization** | unchanged, cannibalization newly flagged |

Supporting checks:
- "melhor coleira gps sem mensalidade": Top-N listicles hold about 70% of the SERP
  (cupomonline x2, mundodosreviews, buscamelhores, guiaomelhor x2, my-best). Leroy Merlin
  product pages make up the rest. The target page is an essay: 949 words, 0 ranked
  products, 1 image, 1 affiliate link. **CRITICAL.**
- "melhor bebedouro automático para gato": Top-N (my-best "top 10 2026") + guide
  (Buscapé) + category (Cobasi). The target has only 2 "categoria" products, 1 image and
  1 affiliate link. **HIGH.**

---

## FINDING 1 (PRIMARY): Listicle-title pages still shipping non-listicle content

**Severity: CRITICAL** on GPS-sem-mensalidade and camera, **HIGH** on the others.

The 2026-10-22 audit flagged this pattern. One page from that list (tapete) has been
converted. The remaining offenders, from local source:

| Page | Title promise | Words | Ranked products | ItemList | Images | Affiliate links | Mod | Severity |
|---|---|---|---|---|---|---|---|---|
| melhor-coleira-gps-sem-mensalidade | "Melhor Coleira GPS Sem Mensalidade" | 949 | 0 | no | 1 | 1 | 08-22 | CRITICAL |
| melhor-camera-para-monitorar-pet | "Melhores Câmeras Pet 2026: TP-Link, Newpet, Intelbras" | 587 | 3 (H2 stubs) | no | 1 | 1 | 08-22 | CRITICAL |
| camera-para-monitorar-pet | "Melhor Câmera para Monitorar Pet: Como Escolher" | 1,016 | 0 | no | 1 | 1 | 08-22 | CRITICAL (cannibal) |
| melhor-bebedouro-automatico-pet | "Melhor Bebedouro Automático para Pet" | 1,791 | 2 | no | 1 | 1 | 08-20 | HIGH |
| melhor-comedouro-interativo-gato | "Melhor Comedouro Interativo para Gato" | 707 | 0 | no | 1 | 1 | 08-22 | HIGH |
| melhor-bolinha-inteligente-para-gato | "Melhor Bolinha Inteligente para Gato" | 663 | 0 | no | 1 | 1 | 08-22 | HIGH |

Pages that now meet the listicle template (reference set): melhor-tapete-higienico-para-cachorro,
melhor-comedouro-automatico-cachorro, melhor-alimentador-automatico-gatos (ItemList, 6-9
images, comparison table, "Como Avaliamos" section), plus melhor-antipulgas-para-cachorro
(content matches the template, schema does not).

**Recommendation.** Use the tapete/comedouro-cachorro template as is: "Comparativo
Rápido" table -> "O Ranking Completo" with 5-8 products, each with its own photo, price
band, pros/cons and CTA -> "Como Escolher" -> "Como Avaliamos" -> FAQ, with ItemList + Product
schema. For melhor-coleira-gps-sem-mensalidade, add explicit columns "Mensalidade?",
"Tecnologia (GPS+SIM / Bluetooth / Find My)" and "Alcance", because the winning SERP
pages are organized along exactly those axes (buscamelhores "AirTag vs GPS", my-best).

## FINDING 2: Camera-intent cannibalization (NEW)

**Severity: CRITICAL**

`camera-para-monitorar-pet` (title "Melhor Câmera para Monitorar Pet: Como Escolher") and
`melhor-camera-para-monitorar-pet` ("Melhores Câmeras Pet 2026") both target the same
"melhor câmera pet" intent. Both self-canonicalize and each links to the other once.
Neither matches the Top-N SERP. Google has to choose between two weak candidates.

**Recommendation.** Make `melhor-camera-para-monitorar-pet` the 6-8 product listicle
(TP-Link Tapo C200, Intelbras iM3, Xiaomi, Positivo, Newpet 2K and Petcube are the models
the SERP repeats). Re-angle `camera-para-monitorar-pet` to the informational slice (title
"Câmera para Monitorar Pet: Como Funciona e Como Escolher", no "Melhor"), or 301 it into
the listicle if GSC shows no separate query set. Log any slug change in the redirect memo.

## FINDING 3: GPS head term still served by a guide

**Severity: HIGH**

The "coleira gps cachorro" SERP is fragmented. That is an opening for a **hybrid**
page, a guide with an embedded ranking, more than for a pure listicle. `coleira-gps-para-pet`
has no product set, no ItemList, 3 images, 2 affiliate links, and its date is 2026-08-22.
The Reclame Aqui result in the top 9 signals strong reliability and support anxiety around
subscription brands (The Pet GPS).

**Recommendation.** Insert a "Top 5 Coleiras GPS 2026" block (table + ItemList) high on
`coleira-gps-para-pet` and link it to the rebuilt sem-mensalidade listicle. Add a "suporte /
reclamações" trust row per product. `coleira-gps-para-gato` ("Qual Escolher em 2026?",
6 affiliate links, 1 image, no ItemList) needs the same treatment at MEDIUM priority.

## FINDING 4: Quick-win schema and lexical gaps on aligned listicles (NEW)

**Severity: MEDIUM**

- `melhor-antipulgas-para-cachorro`: 6 ranked products but the only ListItems are
  breadcrumbs. No ItemList, no Product schema. Antiparasitic medication is YMYL, and
  Petlove's ranking page leans on veterinary guidance. Add ItemList and a
  "Revisado por médico-veterinário" byline if one is genuinely available. Run `/seo schema`
  and `/seo content` (E-E-A-T).
- `melhor-alimentador-automatico-gatos`: the title and H1 use "Alimentador", while the
  query, my-best ("Comedouros") and Cobasi use "comedouro". Example retitle: "Melhor
  Comedouro Automático para Gatos (Alimentador) 2026: 6 Modelos Comparados".

## FINDING 5: Freshness and media split

**Severity: MEDIUM**

The 4 listicles are dated October 2026 and carry 6-9 images. Every remaining mismatched
page is dated 2026-08-20/22 and has 1 image. Competitors put "2026" in their titles. Run
the rebuilds as genuine content passes so the new dateModified is earned.

## What is working (keep)

- Comparison template (tapete, comedouro-cachorro, alimentador-gatos): correct type,
  ItemList, a methodology section ("Como Avaliamos"), refreshed dates.
- `tapete-higienico-para-cachorro` (Bamboo.dry review, "Vale a Pena?") is a clean intent
  split from the new listicle. Buscapé ranks a "vale a pena comprar?" page for the same
  topic, so this is not cannibalization. Keep it, and keep the cross-link.
- Review pages (newpet-2l/4l, vdrbg, cat-mate, seresto, comedouro-cachorro, cercado):
  correct Review/Product type for branded long-tail.

---

## User stories (SERP-signal derived)

1. **Awareness, GPS.** As a tutor whose dog escapes, I want to know which GPS collars work
   without a monthly fee, because subscriptions scare me, but I'm blocked by unclear
   tech (Bluetooth vs SIM vs Find My). *Signal: "sem mensalidade" query cluster;
   buscamelhores "AirTag vs GPS"; result snippets "Bluetooth de longo alcance ou cartão SIM
   pré-pago".*
2. **Consideration, GPS.** As a buyer burned by tracker reviews, I want evidence that the
   device and app stay connected, because the moment my dog is lost is when it fails, but
   I'm blocked by brand trust. *Signal: Reclame Aqui The Pet GPS complaint ranking for
   "coleira gps cachorro".*
3. **Consideration, camera.** As a remote-working tutor, I want to compare 1080p/2K,
   night vision and two-way audio across 5+ cameras, because I'll watch the pet daily,
   but I'm blocked by pages that list only 1-3 models. *Signal: 4 Top-N listicles; repeated
   models Tapo C200 / Intelbras iM3 / Petcube.*
4. **Decision, antipulgas.** As a dog owner choosing a pill vs a pipette vs a collar, I
   want a pick by weight band that a vet signs off on, because it is medication, but I'm
   blocked by fear of the wrong dose. *Signal: Petlove "consulte o veterinário ... peso e
   idade"; my-best Bravecto/NexGard by weight.*
5. **Decision, tapete.** As a puppy owner, I want the right size and absorbency at the best
   price per unit, because I go through pads daily, but I'm blocked by sizes ranging from
   40x50 to 90x100 cm. *Signal: my-best size guidance; Petz "carvão ativado vs Jumbo".*

---

## Persona scoring (Relevance / Clarity / Trust / Action, 25 each)

| Persona (signal) | Page scored | Rel | Clar | Trust | Act | Total |
|---|---|---|---|---|---|---|
| Subscription-averse GPS buyer (sem mensalidade cluster) | melhor-coleira-gps-sem-mensalidade | 13 | 12 | 8 | 6 | **39** |
| Daily-monitoring camera shopper (Top-N camera SERP) | melhor-camera-para-monitorar-pet | 12 | 11 | 8 | 7 | **38** |
| Anxious escape-dog owner (Reclame Aqui, fragmented SERP) | coleira-gps-para-pet | 16 | 16 | 11 | 9 | **52** |
| Vet-cautious antipulgas buyer (Petlove) | melhor-antipulgas-para-cachorro | 21 | 19 | 14 | 19 | **73** |
| Puppy-pad bulk buyer (my-best sizes) | melhor-tapete-higienico-para-cachorro | 23 | 21 | 17 | 21 | **82** |
| Large-dog feeder buyer (my-best capacity by size) | melhor-comedouro-automatico-cachorro | 22 | 20 | 17 | 21 | **80** |

Recommendations, weakest persona first:
1. **Camera shopper (38):** build the 6-8 model listicle and resolve the cannibal pair.
   Add a spec column for resolution, night vision, audio, microSD/nuvem and price.
2. **Subscription-averse GPS buyer (39):** rebuild as a ranked listicle with a
   "Mensalidade?" column and a technology badge per product.
3. **Escape-dog owner (52):** add a Top 5 table + ItemList to the GPS pillar and a
   "confiabilidade/suporte" row per product.
4. **Vet-cautious buyer (73):** ItemList + a veterinary review line + a weight-band
   picker at the top.
5. Tapete and comedouro (80+): only add real hands-on photos (Trust 17 -> 20+).

---

## Ranked conversion queue (next)

1. `melhor-coleira-gps-sem-mensalidade`: CRITICAL, highest-intent term, 0 products today.
2. `melhor-camera-para-monitorar-pet` + re-angle or 301 `camera-para-monitorar-pet`: CRITICAL, cannibalization.
3. `melhor-bebedouro-automatico-pet`: HIGH, 2 -> 6+ products (SERP: my-best top 10).
4. `coleira-gps-para-pet`: HIGH, add Top 5 block + ItemList (hybrid).
5. `melhor-comedouro-interativo-gato`: HIGH (0 products, 707 words).
6. `melhor-bolinha-inteligente-para-gato`: HIGH (0 products, 663 words).
Quick wins (under 1 hour each): ItemList on `melhor-antipulgas-para-cachorro`; "comedouro" in the
title/H1 of `melhor-alimentador-automatico-gatos`; Top-N block on `coleira-gps-para-gato`.
Watchlist (not SERP-checked): `brinquedo-interativo-automatico-para-gato` (869 words, 1 image),
`porta-eletronica-automatica-para-pet` (934 words, 1 image), both guides on head terms.

---

## SXO Gap Score breakdown: 63 / 100 (was 60)

| Dimension | Score | Evidence |
|---|---|---|
| Page Type | 10/15 (+1) | 4 of 6 requested terms aligned (tapete is new). GPS head + camera mismatched; 6 "melhor" pages still off-type |
| Content Depth | 11/15 | Listicles 2.1-3.3k words with method sections; mismatched pages 587-1,016 words |
| UX Signals | 10/15 (+1) | Comparison tables + ranking on 4 pages; the rest have a single CTA |
| Schema | 11/15 (+1) | ItemList + Product/Review on 3 listicles; missing on antipulgas, GPS, camera |
| Media | 8/15 | 6-9 images on listicles; 1 image on every mismatched page |
| Authority | 7/15 | Thin Person entity (no image/sameAs); no vet reviewer on YMYL antipulgas |
| Freshness | 6/10 | Listicles October 2026; the GPS, camera and bebedouro set is August 2026 |

Closing queue items 1-4 would move this to about 72-75.

---

## Structured findings (audit-data.json, category "Search Experience")

```json
{
  "category": "Search Experience",
  "date": "2026-10-23",
  "sxo_gap_score": 63,
  "previous_score": 60,
  "delta": 3,
  "keywords": [
    {"kw": "melhor tapete higiênico para cachorro", "serp_type": "Comparison+Guide", "target": "/melhor-tapete-higienico-para-cachorro/", "verdict": "ALIGNED", "delta": "MISMATCH->ALIGNED"},
    {"kw": "melhor comedouro automático para gatos", "serp_type": "Category+Comparison", "target": "/melhor-alimentador-automatico-gatos/", "verdict": "ALIGNED", "issue": "lexical: alimentador vs comedouro"},
    {"kw": "melhor comedouro automático cachorro", "serp_type": "Comparison", "target": "/melhor-comedouro-automatico-cachorro/", "verdict": "ALIGNED"},
    {"kw": "coleira gps cachorro", "serp_type": "Fragmented (Ecommerce/Comparison/News)", "target": "/coleira-gps-para-pet/", "verdict": "HIGH"},
    {"kw": "melhor antipulgas para cachorro", "serp_type": "Category+Comparison", "target": "/melhor-antipulgas-para-cachorro/", "verdict": "ALIGNED", "issue": "no ItemList; YMYL trust"},
    {"kw": "câmera para monitorar pet", "serp_type": "Comparison", "target": ["/camera-para-monitorar-pet/", "/melhor-camera-para-monitorar-pet/"], "verdict": "CRITICAL", "issue": "cannibalization"}
  ],
  "conversion_queue": [
    "/melhor-coleira-gps-sem-mensalidade/",
    "/melhor-camera-para-monitorar-pet/",
    "/melhor-bebedouro-automatico-pet/",
    "/coleira-gps-para-pet/",
    "/melhor-comedouro-interativo-gato/",
    "/melhor-bolinha-inteligente-para-gato/"
  ]
}
```

---

## Limitations

- `render_page.py` / `parse_html.py` could not run ("Claude SEO runtime is not ready. Run
  `/seo setup`"). On-page metrics come from local static HTML (the site is static, so the
  risk is low). Live state of tapete and comedouro-cachorro was checked with WebFetch and
  matches local.
- SERPs come from WebSearch (about 9 URLs per query, often several URLs from one domain),
  not a rank tracker. No direct capture of PAA, AI Overview, ads or local pack.
  Consensus percentages are approximate.
- No GSC data in this pass. The tapete rewrite went live 2026-10-23, too recent to see a
  ranking effect. Re-check its positions in 2-4 weeks with `gsc_query.py`.
- Word counts use a different method from the 10-22 pass. Do not compare them across passes.
- Bolinha, comedouro-interativo, brinquedo and porta-eletronica verdicts are inferred from
  page structure. Their SERPs were not queried.

Next: generate a PDF report with `/seo google report`.
