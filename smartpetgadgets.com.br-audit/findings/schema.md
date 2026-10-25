# Schema.org / JSON-LD Audit — smartpetgadgets.com.br

Date: 2026-10-23 | Delta vs 2026-10-22 | Method: local source parse of all 78 crawl URLs (/home/projetos/blog/<slug>/index.html), JSON-LD parsed with json.loads, type/property/date/URL checks.
**Score: 88/100**

## Summary
- 78/78 pages parsed: 0 invalid JSON, 0 microdata/RDFa, 0 `http://` contexts, 0 relative URLs, 0 placeholders, 0 missing image/logo files, all dates ISO 8601, no dateModified < datePublished, no future dates.
- Types site-wide: BlogPosting 72, BreadcrumbList 72, FAQPage 72, Person 73, Product 29 (all inside Review/ItemList patterns), Review 29, ItemList 4, VideoObject 2, ProfilePage 1. HowTo = 0, AggregateRating = 0, SpecialAnnouncement = 0.
- Page split: 72 posts (BlogPosting+BreadcrumbList+FAQPage); 6 non-posts (home, sobre, contato, politica-editorial, politica-de-privacidade, autores/nildo-alves) correctly without BlogPosting/FAQ.

## Delta vs 2026-10-22
| Item | Status |
|---|---|
| Author Person missing `image` | STILL OPEN (Medium). sameAs (Facebook) + description present; no `image`. |
| WebSite SearchAction | Unchanged, no action (no internal search). |
| `worstRating` "1" on comedouro-newpet-2l-review | STILL OPEN (Low). Only deviation site-wide (all others "0"). |
| ItemList count | 3 -> 4 ItemLists: melhor-tapete-higienico-para-cachorro is NEW (7 products); melhor-comedouro-automatico-cachorro (7), melhor-alimentador-automatico-gatos (5), comedouro-vdrbg-4l-wifi-review (3). |
| FAQPage count | 72 (prior report said 73 of 77; no FAQ-bearing page lost, count basis differs). Info only. |
| Fake ratings / HowTo | None. Stays clean. |

## Findings

### MEDIUM — Author Person has no `image`
`/autores/nildo-alves/` Person: name, url, worksFor, jobTitle, sameAs, description; no `image`. Per-post author stays name+url (fine). Fix: add real author photo URL to the Person on the author page.

### LOW — ItemList Products on comparison pages lack `image` (and `offers`)
- melhor-tapete-higienico-para-cachorro (new): 7 Product items each have name, description, Review (editorial rating, author Organization, reviewBody, datePublished) but **no `image`** (7/7) and no `offers`. Valid Product-review-snippet structure (review present satisfies Google's one-of requirement), but `image` is recommended; without it Product snippet eligibility is weaker.
- melhor-comedouro-automatico-cachorro: 3 of 7 Products lack `image` (4 have it).
- melhor-alimentador-automatico-gatos / vdrbg: all Products have image.
- `offers` absent everywhere (consistent with owner-paused affiliate/Product work; Info). Fix: add `image` (the product photo already on the page) to the 10 items.

### LOW — melhor-tapete-higienico ItemList details
- Rating scale consistent (bestRating 10, worstRating 0, values 8.8 down to 7.0 descending in list order, matches visible ranking and 7 H3s). Good.
- Review `datePublished` is mixed: item 1 = 2026-10-04, items 2-7 = 2026-10-23, while BlogPosting datePublished = 2026-10-04 / dateModified = 2026-10-23. Not an error, but reviews for items 2-7 were written at rewrite time; acceptable. Optionally normalize.
- ItemList is a separate top-level block, not linked to BlogPosting (`mainEntity`/`hasPart`) — optional; no Google impact (ItemList carousel only applies to Recipe/Course/Movie/Restaurant).
- reviewBody for item 6 states "Maior nota individual do grupo (4.9)" yet its editorial score is 7.7 (lowest-but-one); text refers to Mercado Livre buyer rating, ambiguous in a Review whose ratingValue is the site's own score. Suggest rewording ("nota 4.9 dos compradores no Mercado Livre") to avoid a rating/text mismatch.

### INFO — Listicle pages without ItemList
melhor-antipulgas-para-cachorro, melhor-bebedouro-automatico-pet, melhor-bolinha-inteligente-para-gato, melhor-camera-para-monitorar-pet, melhor-coleira-gps-sem-mensalidade, melhor-comedouro-interativo-gato carry only BlogPosting/Breadcrumb/FAQ. Adding Product/Review ItemList is the same Product/Review work the owner paused (affiliate cluster) — do not apply mechanically; revisit with the content rework.

### INFO — FAQPage on 72 posts
Valid structure, but Google retired FAQ rich results for all sites (2026-05-07). No SERP benefit, AI/GEO benefit unconfirmed. Leave as is; do not add to new posts expecting SERP gain. Genuine reader Q&A pages should use QAPage.

### INFO — Product/Review on affiliate posts remains paused by owner; no `aggregateRating` anywhere (correct, avoids fake-rating risk).

## Validation of core entities
- Organization (home): name, url, logo, sameAs (Facebook) — pass. WebSite: name+url — pass (no SearchAction, Low/no action).
- BlogPosting x72: headline, description, image (array), datePublished, dateModified, author Person, publisher Organization+logo ImageObject, mainEntityOfPage — all present, 0 missing.
- BreadcrumbList x72: absolute https URLs, valid.
- VideoObject x2 (cercado-para-cachorros, tapete-higienico-para-cachorro): valid.

## Priority list
1. Medium: author `image` on Person.
2. Low: add `image` to 10 ItemList Products (7 on tapete, 3 on comedouro cachorro).
3. Low: fix reviewBody wording on tapete item 6; normalize worstRating on newpet-2l.
4. Info: ItemList on other listicles gated on owner's paused Product/Review rework.
