# Images — smartpetgadgets.com.br

Score: 90/100

Checked homepage (71 images, all home-card thumbnails) + 2 sample articles via direct HTML fetch.

## What works
- **Alt text coverage: 100%** on all sampled pages (homepage's 71 images, both sampled articles) — every `<img>` has a non-empty `alt` attribute, mostly descriptive rather than keyword-stuffed (e.g. "Cachorro usando coleira com dispositivo de rastreamento GPS ao ar livre").
- `loading="lazy"` applied consistently on homepage card images.
- `width`/`height` attributes set on homepage cards, preventing CLS (confirmed by seo-performance: CLS 0.0 across all 3 sampled pages).
- WebP used for many hero images (mixed with .jpg on older posts).

## Issues
- **Low**: Image count is very uneven across articles — `melhor-antipulgas-para-cachorro` has only 4 images across ~1,656 words; `coleira-gps-para-pet` has just 1. seo-sxo flagged this independently as a competitive gap against marketplace/listicle SERPs that show 5-10 product photos. This is as much a content-strategy issue as an image-SEO one — see `sxo.md`.
- **Not checked this pass**: file-size optimization (no Lighthouse image-weight audit run standalone; seo-performance's 98/100 score with 0ms TBT suggests no gross oversizing, but a dedicated pass would confirm WebP/AVIF conversion opportunities on the remaining .jpg heroes).

## Recommendation
No urgent fixes. If pursuing the seo-sxo recommendation to rebuild head-term pages as fuller listicles, add 1 product image per compared item — this serves both the Images and SXO findings simultaneously.
