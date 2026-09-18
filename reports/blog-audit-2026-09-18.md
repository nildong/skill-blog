# Blog Audit Report — smartpetgadgets.com.br

**Audit Date:** 2026-09-18
**Total Pages:** 75 (71 posts + institucionais: `/`, `/contato/`, `/sobre/`, `/politica-de-privacidade/`, `/politica-editorial/`, `/autores/nildo-alves/`)
**Methodology:** este site usa um pipeline local próprio (site-indexer → seo-auditor → cannibalization → internal-linking) em vez do analisador genérico de 100 pontos — o analisador genérico assume `content/posts/`, e este site publica cada post como pasta própria na raiz (`slug/index.html`). Os módulos locais são deterministas, não usam LLM/heurística de score agregado, e nunca modificam artigos.

## Health Overview

| Metric | Count |
|--------|-------|
| Pages audited | 75 |
| Critical issues | 0 |
| Errors | 0 |
| Warnings | 2 |
| Info / opportunities | 11 |
| Orphan pages (0 inbound links) | 0 |
| Dead-end pages (0 outbound links) | 0 |
| Cannibalization — HIGH | 0 |
| Cannibalization — POSSIBLE (revisar) | 53 |
| Cannibalization — COMPLEMENTARY (pilar↔satélite, não é conflito) | 186 |
| Pages missing JSON-LD | 4 (all institutional) |
| Pages with FAQ heading but no FAQPage schema | 1 (home) |
| Images missing alt text | 0 |
| Stale content (git-log proxy) | 0 — todo o site foi tocado nos últimos ~24 dias |

No per-post 0-100 quality score exists in this pipeline by design (the local `seo-auditor` skill deliberately does not compute an aggregate score — see `tools/seo-auditor/README.md`). Severity is Critical/Error/Warning/Info instead, all with evidence and a concrete recommendation.

## Warnings (fix first)

| Page | Issue | Recommendation |
|------|-------|-----------------|
| `/` (home) | `FAQ_HEADING_WITHOUT_SCHEMA` — heading menciona FAQ mas não há schema `FAQPage` correspondente | Adicionar JSON-LD `FAQPage` ou remover a menção a FAQ do heading da home |
| `/politica-de-privacidade/` | `JSONLD_MISSING` — nenhum JSON-LD na página | Adicionar `Organization`/`WebSite` schema |

## Info / Opportunities

| Page | Issue |
|------|-------|
| `/autores/nildo-alves/` | Imagens sem width/height declarado (CLS) |
| `/contato/` | Apenas 3 links internos de saída (`LOW_INTERNAL_LINKS`) |
| `/contato/` | Imagens sem width/height |
| `/contato/` | Sem JSON-LD |
| `/` (home) | 70 imagens na página (acima do limiar de 15) — revisar se todas têm valor editorial |
| `/politica-de-privacidade/` | Imagens sem width/height |
| `/politica-de-privacidade/` | Oportunidade de FAQ (nenhum detectado) |
| `/politica-editorial/` | Imagens sem width/height |
| `/politica-editorial/` | Sem JSON-LD |
| `/sobre/` | Imagens sem width/height |
| `/sobre/` | Sem JSON-LD |

Full detail: `reports/seo-audit.md`.

## Orphan / Dead-End Pages

None. 0 orphan pages, 0 dead-end pages across 75 pages (1,149 internal links, avg ~15/page). This matches the memory note that the coleira-gps cluster and other recent clusters are well-interlinked.

## Topic Cannibalization

Full detail (239 pairs analyzed, 2,415 total pairs scanned): `reports/cannibalization.md`.

**0 HIGH-severity conflicts.** 53 pairs flagged POSSIBLE (score 40-69) — worth a manual look, none urgent. Top 10 by score:

| Score | Pair | Likely Reason | Suggested Action |
|-------|------|----------------|-------------------|
| 67 | brinquedo-interativo-gato-idoso-vale-a-pena ↔ duvidas-brinquedo-interativo-gato | overlapping FAQ/review intent | Differentiate — confirm review vs FAQ intent stays distinct |
| 65 | comedouro-newpet-2l-review ↔ comedouro-newpet-4l-review | same product line, different capacity | Differentiate — capacity already differentiates, verify title/H1 make it explicit |
| 63 | comedouro-gato-x-cachorro-diferenca ↔ porta-eletronica-gato-x-cachorro-diferenca | shared "gato x cachorro" comparison format across two product categories | Differentiate — low actual overlap risk, different product lines |
| 61 | coleira-gps-cachorro-pequeno-porte ↔ coleira-gps-cachorro-que-foge | overlapping GPS-collar-for-dog use cases | Differentiate — confirm distinct primary keyword per page |
| 60 | camera-pet-x-coleira-gps-qual-escolher ↔ coleira-gps-x-microchip | GPS-collar comparison content | Differentiate |
| 60 | comedouro-newpet-4l-review ↔ comedouro-vdrbg-4l-wifi-review | same capacity, different brand reviews | Differentiate — fine, competitor reviews |
| 59 | porta-eletronica-funciona-porta-de-vidro ↔ porta-eletronica-sensor-de-luz-como-funciona | shared "como funciona" pet-door format | Differentiate |
| 55 | como-configurar-camera-pet-wifi ↔ configurar-app-comedouro-wifi | shared "configurar wifi" how-to format across categories | Differentiate |
| 54 | camera-pet-x-coleira-gps-qual-escolher ↔ coleira-gps-bluetooth-x-chip-operadora | GPS collar comparison | Differentiate |
| 53 | coleira-gps-para-gato ↔ duvidas-coleira-gps-pet | overlapping GPS-collar FAQ/product intent | Differentiate |

Per the skill's own guardrail: none of these are recommended for merge or redirect — scores are heuristic, and every pair should be reviewed manually before any action. 186 additional pairs are pillar↔satellite relationships (intentional site architecture, e.g. cluster-comedouro-automatico-pet ↔ its satellites) and are not cannibalization.

## Internal Linking Opportunities

Full detail (183 suggestions, max 5/page): `reports/internal-linking.md`. No orphan-priority suggestions needed (0 orphans). Top opportunities by score:

| From | To | Score | Suggested Anchor |
|------|----|-------|-------------------|
| comedouro-automatico-para-pet | comedouro-vdrbg-4l-wifi-review | 53 | "Como Funciona o App do VDRBG 4L Wi-Fi" |
| comedouro-automatico-para-pet | comedouro-automatico-gato-obeso | 52 | "Obesidade em Gatos: Um Problema Mais Comum do que Parece" |
| como-escolher-brinquedo-interativo-gato-entediado | duvidas-brinquedo-interativo-gato | 52 | "Brinquedo Interativo para Gato: Perguntas Frequentes" |
| duvidas-brinquedo-interativo-gato | como-escolher-brinquedo-interativo-gato-entediado | 52 | "Como Escolher Brinquedo Interativo para Gato Entediado" |
| duvidas-brinquedo-interativo-gato | erros-comuns-brinquedo-interativo-gato | 52 | "Erros Comuns ao Usar Brinquedo Interativo para Gato" |

## Stale Content

Using git commit history per post as a freshness proxy (no `date_modified` frontmatter exists in this site's HTML by design — the indexer never fabricates dates, per `tools/site-indexer/README.md`). Oldest last-touched files are `cercado-para-cachorros`, `comedouro-cachorro`, `contato`, `sobre`, `soprador-pet`, `tapete-higienico-para-cachorro` — all last modified 2026-08-25, i.e. 24 days ago. Nothing qualifies as stale by any reasonable threshold; the whole site was touched during the recent FAQ/schema pass (commit `2c2a73e`) or the affiliate-link pass.

**SKIPPED: Google Search Console / GA4 decay checks** — `blog-google` credentials not invoked in this pass; per memory, GSC snapshot from 2026-08-25 still showed near-zero impressions on new content (expected for young pages), so decay-based freshness prioritization isn't meaningful yet.

**SKIPPED: robots.txt / llms.txt / AI-crawler bot policy check** — not run this pass; recommend a dedicated `/blog geo` audit given the site is young and building AI-citation surfaces.

## AI Readiness

69/71 posts have `FAQPage` schema (only the home page has a FAQ heading without matching schema, and privacy policy has no FAQ). 71/75 pages carry JSON-LD; the 4 without it are institutional (contact, about, privacy policy, editorial policy) rather than content pages, so citation-readiness impact is low. A dedicated `/blog geo` pass would give a proper 0-100 AI Citation Readiness score per post — not computed here.

## Prioritized Action Queue

| Priority | Page | Issue | Action |
|----------|------|-------|--------|
| 1 | `/` (home) | FAQ heading without FAQPage schema | Add FAQPage JSON-LD or drop the FAQ framing from the heading |
| 2 | `/politica-de-privacidade/` | No JSON-LD | Add Organization/WebSite schema |
| 3 | `/contato/`, `/sobre/`, `/politica-editorial/` | No JSON-LD, no image dimensions | Add Organization schema + width/height on images (batch fix, low effort) |
| 4 | Home | 70 images on one page | Audit for editorial value; trim or lazy-load |
| 5 | 53 POSSIBLE cannibalization pairs | Overlapping intent, mostly by design (comparison/FAQ pairs) | Spot-check top 10 above; confirm titles/H1 keep intents distinct |
| 6 | 183 internal-linking suggestions | Under-linked but non-orphan content | Work through `reports/internal-linking.md` top opportunities during next content pass |

## Reports Generated This Session

- `.data/site-index.json` (refreshed — was 3 days stale before this run, now reflects 75 pages incl. the FAQ/schema commit)
- `.data/seo-audit.json` + `reports/seo-audit.md`
- `.data/cannibalization.json` + `reports/cannibalization.md`
- `.data/internal-linking.json` + `reports/internal-linking.md`
- `reports/blog-audit-2026-09-18.md` (this file)

## Suggested Next Steps

- Run `/blog geo` on the home page and top 5 traffic-intent posts for a proper AI Citation Readiness score (not computed in this pass).
- Fix the 2 warnings above first — both are quick, low-risk edits.
- Spot-check the top-10 POSSIBLE cannibalization pairs, particularly the two `comedouro-newpet-*L-review` and `coleira-gps-cachorro-*` pairs, to confirm titles/H1s keep search intent distinct.
