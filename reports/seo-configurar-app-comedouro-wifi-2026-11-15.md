# SEO audit: /configurar-app-comedouro-wifi/ (15/11/2026)

## Data (GSC, 180 days)
- 790 impressions, 22 clicks, average position 4.5, CTR 2.8%. This is the best page in the comedouro cluster.
- Monthly trend:

| Month | Impressions | Clicks | Average position |
|---|---|---|---|
| Sep | 68 | 1 | 5.6 |
| Oct | 451 | 13 | 4.6 |
| Nov (to 15th) | 271 | 8 | 4.2 |

- Visible queries are conversational support questions: "onde eu clico?", "telefone para suporte", "qual é o aplicativo", "o manual de instruções", "como configurar o wi-fi", "como conectar wi-fi". These are people with the feeder in hand who are stuck. They look like AI Mode or assistant-style questions, which makes the page a GEO opportunity.

## What works
- Specific title and meta ("não conecta? quase sempre é 5 GHz").
- Numbered H3 steps, problem/cause/solution table, FAQ schema, breadcrumb pointing to the hub.

## Problems
1. **Product box before the steps.** The two "Ainda vai comprar?" picks sit above the step-by-step. The reader already owns a feeder and wants the answer, so the products push it down.
   - The Geonav uses its own app (Geonav Home), not Tuya, so it is off-topic in a Tuya guide.
   - Its price is out of date: R$258,53 on the page, R$237 now.
2. **Broken link:** `meli.la/2NM1C8D` in the intro (monitor reports "sem_produto").
3. **No answer-first opening.** The intro takes 2 paragraphs to reach the point. There is no short summary of the steps that Google or an AI could quote.
4. **Missing content that matches the real queries:**
   - which app to use (Tuya Smart, Smart Life, or the brand's own app such as Geonav Home or Mi Home);
   - how to put the feeder in pairing mode (reset button, fast vs slow blinking LED, EZ vs AP mode);
   - how to separate the 2.4 GHz network on operator routers (Vivo, Claro, TIM);
   - iPhone "rede local" permission;
   - Wi-Fi password with special characters;
   - feeder serving at the wrong time (time zone or clock);
   - how to record the voice message;
   - manual feeding button;
   - support and manual (where to find them, QR code on the box).
5. **No real app screenshots.** There is only 1 generic hero image. Screens of the pairing flow are the biggest possible E-E-A-T gain for a how-to.
6. **Leftover formatting:**
   - standalone link paragraphs (`<p><a>review…</a></p>`);
   - "Key Takeaways" in English;
   - "Atualizado em 20/08" (never updated);
   - only 4 FAQs.
7. **Generic final CTA** ("Confira o preço…") with no product name. It points to the Newpet 5L Tuya (17VqkwJ, R$318,80).

## Recommendations (in order)
1. Answer first: a summary box at the top with 5 steps of one line each. Move the products to the end, after troubleshooting, with a Tuya model (Newpet 4L 2PtKj8u and/or Newpet 5L 17VqkwJ) and a link to the hub ranking.
2. New H2s, phrased as questions:
   - "Qual aplicativo usar no comedouro automático?"
   - "Como colocar o comedouro em modo de pareamento?"
   - "Como separar a rede 2,4 GHz no roteador da operadora?"
   - "Comedouro soltando ração na hora errada: como corrigir?"
   - "Como gravar a mensagem de voz?"
3. FAQ from 4 to about 10 questions, built from the actual GSC queries.
4. Fix the broken link and the old price, remove the leftover links, update dateModified.
5. Real Tuya app screenshots (from the user), 4 or 5 images with descriptive alt text.
6. Title (optional, small risk at position 4): "Comedouro Wi-Fi Não Conecta? Como Configurar no App Tuya (Passo a Passo)". It matches the "não conecta" problem queries.

HowTo schema no longer produces rich results on Google (since 2023), so it is not worth adding. Clear numbered steps and FAQ schema are what work for AI Overviews.
