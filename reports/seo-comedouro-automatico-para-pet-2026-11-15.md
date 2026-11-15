# SEO audit: /comedouro-automatico-para-pet/ (15/11/2026)

## Diagnosis

| Item | Situation |
|---|---|
| GSC, 180 days | ~25 impressions and 1 click. Position swings between 1 and 13 on rare anonymized queries, with no query volume. |
| Format | Generic guide with no products, while the SERP is a mix of stores and "melhores comedouros automáticos 2026" lists. |
| Affiliate CTA | Only 1 CTA, pointing to `meli.la/1YoZvow`, a broken link (the monitor reports "sem_produto"; it is the old list link). **The page sends no clicks to any product.** |
| Top CTA / sticky / affiliate-cta.js | Missing. |
| Schema | BlogPosting, Breadcrumb and FAQ (3 questions). No ItemList, Product, about or mentions. |
| Dates | Published 20/08, never updated (dateModified 20/08). |
| Images | 1 hero only, no product photos. |
| Internal links | Good: the hub links to all 20 posts in the cluster, and 24 posts link back to it. |

## SERP (head terms "comedouro automático" / "melhor comedouro automático")

- Stores: Cobasi, Petz, Magalu, Mercado Livre and Buscapé.
- Lists of 5 to 10 models: my-best, buscamelhores, gdm, seuguiadetecnologia and guiaomelhor.
- Recurring models: Newpet 4L (custo-benefício), Xiaomi 5L, PetKit, PetLibro, Velds, and mechanical gravity feeders (Alvorada Praticão at R$39,90).
- The dominant intent is commercial comparison. A guide with no products does not compete.

## Cannibalization

- `melhor-comedouro-automatico-cachorro`: ranks for "melhor comedouro para cachorro" (pos 55) and "comedouro automático de cachorro" (pos 19).
- `melhor-alimentador-automatico-gatos`: ranks for "melhor comedouro automático para gatos" (pos 45) and "alimentador automatico para gatos" (pos 31).
- Proposed split: the hub targets the generic, species-neutral term ("comedouro automático", "para cães e gatos", "qual comprar") with a ranking of 6 models across different types. It sends readers to the dog and cat pages by species, and those pages keep their specific terms.

## Plan (same pattern as Seresto, brinquedo and bebedouro)

1. Title: "Comedouro Automático para Pet: 6 Melhores de 2026 (Cães e Gatos)". New meta description with the top pick and its price.
2. Answer-first opening, picks grid (best overall, best cheap, best Wi-Fi, best for 2 pets), comparison table, 6 product cards with spec, prós and contras.
3. Keep the guide sections (types, how it works, cleaning) as questions in the H2s, and expand the FAQ to about 9 questions.
4. Top CTA, sticky bar and affiliate-cta.js. Replace 1YoZvow on this page.
5. Schema: ItemList with Product and Offer, about and mentions, dateModified.
6. Real images from the Mercado Livre CDN. Update the home card and featured slot, llms.txt and the sitemap.

## Catalog links checked today (monitor)

| Link | Product | Price |
|---|---|---|
| 1tguuU6 | New Pet 4L com voz | R$229,80 |
| 2CyWKk6 | Velds 4L app | R$251,23 |
| 1yw2Tt1 | Kit comedouro + bebedouro 3L | R$47,90 |
| 2hiYAmt | Newpet 6L 3 tigelas | R$328,80 |
| 17VqkwJ | Newpet Wi-Fi 5L Tuya | R$318,80 |
| 2c9hSTQ | Newpet 8L Wi-Fi | **broken** |
| 1YoZvow | (list link) | **broken** |

## Implemented (15/11/2026, live)

- Title: "Comedouro Automático: 6 Melhores para Cães e Gatos em 2026". The H1 keeps "(Guia Completo)" so the 26 internal links with that anchor still match.
- Ranking:
  1. Newpet 4L (2PtKj8u, R$238,80)
  2. Ideal Dog 8 kg gravity feeder (1Wi7uhp, R$54,10)
  3. Feeder with camera, 6L (1xzMqr5, R$299,69)
  4. Newpet 6L with 3 bowls (2wxsQQM, R$328,90)
  5. Xiaomi Feeder 2 (2orQjdj, R$1.299,99)
  6. 2-in-1 gravity feeder + water (2nYXrfG, R$102,56)
- Keywords from the CSV, used in the H2s and body text:
  - "comedouro elétrico para cachorro" (110 + variants), in the elétrico x gravidade H2;
  - "comedouro para cães grandes" (90 + 70 + 20), in its own H2;
  - "comedouro e bebedouro" (320–480), in the 2 em 1 card, linking to comedouro-x-bebedouro, which keeps the main role for that term;
  - "comedouro pet" and "alimentador automático" as synonyms.
- Generic CSV terms ("comedouro", "comedouro para cães", 1–3.6K) mean a plain bowl, not an automatic feeder. They were not targeted, to avoid an intent mismatch.
- 10 FAQs plus FAQ schema, ItemList/Product/Offer, about/mentions, top CTA, sticky bar and affiliate-cta.js.
- All of the old hub's internal links were kept.
- The list link 1YoZvow was replaced with 2PtKj8u (Newpet 4L) in comedouro-automatico-vale-a-pena and comedouro-gato-x-cachorro-diferenca.
- Home (featured slot and card) and llms.txt were updated.

## Notes on the products

- #2 (2 em 1): no reviews, and the description says "sem garantia".
- #4 (Newpet 6L, 2wxsQQM): no reviews yet. The other Newpet 6L listing (2hiYAmt) shows +500 sold.
- #3 (camera): the listing says the package does not include a power adapter, and one buyer reports the camera does not see at night.
