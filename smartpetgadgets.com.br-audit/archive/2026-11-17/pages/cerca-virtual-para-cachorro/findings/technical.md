# Técnico — /cerca-virtual-para-cachorro/ (24/10/2026)

**Nota: 85/100**

## O que funciona
- HTTP 200, HTTPS, HSTS, X-Content-Type-Options, X-Frame-Options e Referrer-Policy ativos.
- GSC URL Inspection: "Submitted and indexed", canonical do Google = canonical declarado, robots permitido. Último crawl: 28/09/2026 (mobile).
- HTML estático (não é SPA). O arquivo no ar é idêntico ao local.
- No sitemap.xml (lastmod 2026-10-19) e no llms.txt.

## Problemas
| Sev. | Problema | Evidência | Correção |
|---|---|---|---|
| High | Página quase órfã | Só a home linka para ela. O pilar `/coleira-gps-para-pet/` não linka, mesmo sendo o pai declarado no breadcrumb. GSC `referring_urls: []` | Linkar a partir do pilar e de pelo menos 4 posts do cluster (ver on-page.md) |
| Medium | Último crawl é anterior à alteração | Crawl em 28/09, mas `last-modified`/lastmod é 19/10 | Depois das correções, pedir indexação no GSC |
| Low | Sem landmark `<main>` | Lighthouse `landmark-one-main` | Envolver o conteúdo em `<main>` |
| Low | Contraste de cor | Lighthouse `color-contrast` (provavelmente `.meta`/`.disclosure` com opacity .65–.7) | Subir a opacidade para ≥ .8 ou usar uma cor sólida |
| Low | Cache curto em estáticos | Lighthouse `cache-insight` (5 KiB) | `Cache-Control` longo para /img/ no .htaccess |
| Low | Sem header nem navegação global | Só o breadcrumb; nenhum menu/logo | Template com header do site |
