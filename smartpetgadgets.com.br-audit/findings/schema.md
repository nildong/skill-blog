# Schema.org Audit — smartpetgadgets.com.br

Date: 2026-09-30
Sample: homepage + 6 article pages (review, comparison, cluster pillar, product), cross-checked against full local repo (76 index.html pages) via grep.

## 1. Detection Summary

| Page type | Schema present |
|---|---|
| Homepage | `Organization`, `WebSite` + `SearchAction` |
| Articles (71/76 pages) | `BlogPosting`, `Person` (author), `Organization` (publisher), `ImageObject`, `WebPage` (mainEntityOfPage), `BreadcrumbList`, `FAQPage` |
| Product-review posts (8 pages) | above + `Product` with nested `Review`/`Rating`, `Brand` on some |
| `coleira-seresto-antipulgas` only | `AggregateRating` (ratingValue 4.8, reviewCount 5501) |

All blocks are JSON-LD, `@context: https://schema.org` (https, correct), absolute URLs, ISO 8601 dates (`YYYY-MM-DD`). Format practice is good and consistent site-wide.

## 2. Validation Results

- ✅ @context/format/URL/date rules: pass on all sampled blocks.
- ✅ BlogPosting required properties (headline, image, datePublished, author, publisher with logo, mainEntityOfPage) present and well-formed on every sampled article.
- ✅ BreadcrumbList: correct `ListItem` position/name/item structure.
- ⚠️ **Organization homepage `sameAs: []`** — empty array (known/flagged issue). Recommend removing the property entirely or populating with real social profile URLs; an empty array provides no benefit and is superfluous.
- ⚠️ **Product schema missing `offers`** on all 8 product-review pages (`comedouro-vdrbg-4l-wifi-review`, `cat-mate-c500-review`, `coleira-seresto-antipulgas`, `comedouro-cachorro`, `cercado-para-cachorros`, `tapete-higienico-para-cachorro`, `comedouro-newpet-2l-review`, `comedouro-newpet-4l-review`). Not required for Review-snippet eligibility (site isn't the seller), but if these are Amazon/ML affiliate links, consider adding `offers.url` (affiliate link) + `priceCurrency`/`price` only if accurate — do not fabricate price data.
- 🔴 **`coleira-seresto-antipulgas` — AggregateRating integrity risk.** `ratingValue: 4.8`, `reviewCount: 5501` almost certainly mirrors a third-party marketplace's review count (Amazon/Mercado Livre) rather than reviews collected on smartpetgadgets.com.br itself. Google's structured-data guidelines require aggregate ratings to reflect reviews actually gathered by/about the entity on the page that hosts the markup; presenting a copied third-party count as your own `AggregateRating` is a misrepresentation risk that can trigger a manual action on Review/Product rich results (separate from, and stricter than, the earlier "self-serving reviews" rule). **Recommendation: remove `aggregateRating` from this page** and keep only the site's own editorial `Review` (single Rating), matching the pattern already used correctly on the other 7 product pages, which have no AggregateRating.
- Author `Review.author` is inconsistent in type across product pages: `Person` (Nildo Alves) on `cat-mate-c500-review`, but `Organization` (Smart Pet Gadgets) on `coleira-seresto-antipulgas`. Both are valid schema.org types, but standardizing on `Person` (real author) across all review posts is preferable for E-E-A-T signaling and matches the BlogPosting author already declared on the same page.

## 3. Deprecated / No-Rich-Result Types

- No deprecated types found (no HowTo, SpecialAnnouncement, CourseInfo/EstimatedSalary/LearningVideo).
- **FAQPage is present on 71/76 pages (nearly every article).** As of the May 7 2026 Google policy, FAQPage produces **no SERP rich result for any site** (this supersedes the 2023 gov/health-only restriction). Current status: **Info priority, not Critical** — the markup is not harmful and may have unconfirmed AI/GEO value, but it should not be counted as an SEO/rich-result asset in reporting, and no further FAQPage expansion should be prioritized for Google SERP purposes. Where content is genuine reader Q&A (not just an FAQ block), consider `QAPage` instead going forward.

## 4. Missing Opportunities

- **VideoObject**: none detected in the sample; if any posts embed product/unboxing video (repo has at least one `.mp4` asset referenced in root), add `VideoObject` per `schema/templates.json` in the plugin root.
- **Organization.sameAs**: populate with the live Facebook page (`@smartpetgadgetsbr`, confirmed live per memory) and any other verified profiles — this is a quick, low-risk fix site-wide (homepage Organization block only, single edit).
- **Product.aggregateRating**: only add if/when the site collects its own on-page reviews/ratings; do not reintroduce copied marketplace counts.

## 5. Generated JSON-LD — Fixes

### 5a. Homepage Organization (replace `sameAs: []`)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Smart Pet Gadgets",
  "url": "https://smartpetgadgets.com.br/",
  "logo": "https://smartpetgadgets.com.br/img/logo.png",
  "sameAs": [
    "https://www.facebook.com/smartpetgadgetsbr"
  ]
}
```

### 5b. `coleira-seresto-antipulgas` Product block (remove AggregateRating, keep editorial Review, standardize author to Person)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Coleira Antipulgas e Carrapatos Seresto Elanco para Cães Acima de 8kg",
  "image": [
    "https://smartpetgadgets.com.br/coleira-seresto-antipulgas/img/coleira-seresto-hero.webp"
  ],
  "description": "Coleira antiparasitária de uso veterinário Seresto (Elanco), com liberação lenta e controlada de ativos contra pulgas, carrapatos e larvas por até 8 meses, indicada para cães acima de 8kg.",
  "brand": {
    "@type": "Brand",
    "name": "Seresto"
  },
  "review": {
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "4.8",
      "bestRating": "5"
    },
    "author": {
      "@type": "Person",
      "name": "Nildo Alves",
      "url": "https://smartpetgadgets.com.br/autores/nildo-alves/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Smart Pet Gadgets"
    }
  }
}
```

## 6. Category Score

**Schema / Structured Data: 82 / 100**

Rationale: strong, consistent JSON-LD implementation across the entire article catalog (BlogPosting, Person, Organization, BreadcrumbList all correct and required-property-complete) is the main strength. Points deducted for: (1) one page with a misleading third-party-sourced `AggregateRating` (integrity/manual-action risk, -10), (2) empty `sameAs` on Organization (-4), (3) inconsistent `Review.author` typing and no-longer-valuable FAQPage blanket coverage carrying false SERP expectations if left unflagged in reporting (-4).

## 7. Structured Findings (JSON for audit-data.json)

```json
{
  "category": "schema",
  "score": 82,
  "findings": [
    {
      "severity": "critical",
      "id": "schema-aggregaterating-third-party",
      "page": "/coleira-seresto-antipulgas/",
      "issue": "AggregateRating (ratingValue 4.8, reviewCount 5501) appears to mirror a third-party marketplace's review count rather than reviews collected on-site. Risk of Google manual action for misleading review/rating structured data.",
      "recommendation": "Remove aggregateRating; keep only the site's own editorial Review, matching the other 7 product-review pages."
    },
    {
      "severity": "info",
      "id": "schema-faqpage-no-serp-value",
      "page": "71 of 76 article pages",
      "issue": "FAQPage markup retired for Google rich results site-wide as of 2026-05-07 (no longer gov/health-only restriction). Markup is harmless but provides no confirmed SEO benefit.",
      "recommendation": "Do not report FAQPage as a rich-result asset; do not prioritize further FAQPage expansion for Google SEO. Consider QAPage for genuine reader Q&A content."
    },
    {
      "severity": "minor",
      "id": "schema-organization-sameas-empty",
      "page": "/ (homepage)",
      "issue": "Organization.sameAs is an empty array.",
      "recommendation": "Populate with live social profile URLs (e.g. https://www.facebook.com/smartpetgadgetsbr) or remove the property."
    },
    {
      "severity": "minor",
      "id": "schema-review-author-type-inconsistent",
      "page": "product-review pages (8)",
      "issue": "Review.author type varies between Person and Organization across otherwise-identical review blocks.",
      "recommendation": "Standardize on Person (matching the BlogPosting author on the same page) for consistency and E-E-A-T signaling."
    },
    {
      "severity": "minor",
      "id": "schema-product-missing-offers",
      "page": "product-review pages (8)",
      "issue": "Product schema has no offers property.",
      "recommendation": "Optional: add offers.url pointing to the real affiliate listing if price/availability can be kept accurate; do not fabricate price data."
    }
  ]
}
```
