# Technical SEO - smartpetgadgets.com.br (2026-11-17)

**Nota Technical SEO: 93/100** (anterior 2026-11-06: 95).
Escopo: 80 URLs do sitemap rastreadas ao vivo (HTML bruto, Accept-Encoding padrão), sondas de headers/redirects/404/410/arquivos internos, .htaccess local, JSON-LD de todas as páginas, comparação com a auditoria de 2026-11-06.
A queda de 2 pontos vem de: regressão na cobertura de CTA (nova página de produto sem CTA), links de afiliado sem rel completo persistindo, `sitemap.xml` com mudanças não commitadas, e os itens Low antigos ainda abertos sem avanço.

## Status por categoria
Crawlability PASS | Indexability PASS | Security PASS (mínimo) | URL structure PASS | Mobile PASS | CWV (fonte) PASS | JS rendering PASS (HTML estático, sem SPA) | hreflang N/A (site só pt-BR, 0 tags) | IndexNow PARTIAL | Links de afiliado PARTIAL

## Delta vs 2026-11-06
| Item anterior | Status agora |
|---|---|
| T-11 posts sem CTA/JS | MELHOROU. /coleira-seresto-antipulgas/, /comedouro-automatico-para-pet/ e /configurar-app-comedouro-wifi/ agora carregam `affiliate-cta.js?v=1`. CONTINUA em /comedouro-newpet-4l-review/ (tem links meli.la, sem CTA). |
| T-12 links sem nofollow | CONTINUA (9 links: 3 em /cachorro-de-casa-pega-pulga/ `sponsored noopener`; 6 em /coleira-seresto-antipulgas/ só `noopener`). Era 8; 9 agora. |
| T-02 http://www em 2 saltos | CONTINUA. http://www -> 301 https://www -> 301 apex. |
| T-03 /index.html 200 | CONTINUA (200, 142.086 bytes). |
| T-05 404 genérico | CONTINUA (404, 4.511 bytes, lang="en-us"). |
| T-06 Permissions-Policy | CONTINUA ausente. |
| T-07 deploy não reproduzível | CONTINUA. `img/logo-dark.png` untracked e live 200; `img/logoblog.png` 404 live. Dezenas de diretórios untracked. `sitemap.xml` modificado e não commitado (idêntico ao live). |
| T-08 IndexNow | PARTIAL, ver T-08. Arquivo de chave existe e responde 200. |
| T-10 title/meta fora da faixa | CONTINUA (mesmas páginas) + 2 metas de 161/163 chars. |
| T-13 metas curtas erros-comuns | CONTINUA (94 e 108 chars). |
| T-14 MIME do JS | CONTINUA (`application/x-javascript`). Ganhou `?v=1`/`?v=2` nas tags, cache-bust resolvido. |
| Sitemap | OK. 80 URLs (eram 78), lastmod mais recente 2026-11-16. Local e live idênticos. |
| 410 em /cluster-comedouro-automatico-pet/ | MANTIDO (410, 824 bytes; /reports/x.md também 410). |
| Duplicados | 0 títulos e 0 metas duplicados. |

## O que funciona (verificado hoje)
- 80/80 URLs do sitemap: 200, sem redirecionamento, canonical autorreferente, sem meta robots/noindex, viewport presente, GA4 G-WDT1Q1NLKK em 80/80, Open Graph em 80/80, 0 links http:// (mixed content).
- 1 H1 por página (a home tem `<h1 class="page-title">`, ok).
- Novos posts (/melhor-racao-para-gato/, /melhor-racao-para-cachorro/, rankings de coleira GPS, brinquedo, bebedouro, comedouro hub, câmera petisco, tutorial Tuya) estão todos no sitemap, 200, com canonical correta, title/meta válidos.
- JSON-LD: 0 blocos com JSON inválido em 80 páginas. Tipos: BlogPosting 74, BreadcrumbList 74, FAQPage 74, ItemList 12, Product 7, VideoObject 2, ProfilePage 1, Organization 1, WebSite 1. (Validação de campos/brand: ver findings/schema.md.)
- 0 links internos para URLs fora do sitemap; nenhum arquivo local `*/index.html` ficou fora do sitemap.
- 300 `<img>`: 100% com atributos width/height (CLS baixo), 213 com `loading="lazy"`; LCP da página testada (/coleira-gps-para-gato/) com `<link rel="preload" as="image" fetchpriority="high">`.
- CSS inline (0 stylesheets bloqueantes), scripts só `defer` (theme-toggle.js?v=2, affiliate-cta.js?v=1); gtag carregado após o load.
- Compressão Brotli (`content-encoding: br`, `vary: Accept-Encoding`); HTTP/2 + HTTP/3 (alt-svc); TTFB da home ~0,22 s; maior HTML 141 KB (home).
- robots.txt: Allow para todos, `Disallow: /?s=`, 15 user-agents de IA/busca declarados com Content-Signal (ai-train=no), Sitemap declarado. `sitemap_discovery.py` validou https://smartpetgadgets.com.br/sitemap.xml (urlset válido, 200); sitemap_index/wp-sitemap não existem (esperado).
- Redirect slug: /soprador-para-pet/ -> 301 /soprador-pet/ (1 salto). Sem barra final -> 301 para versão com barra. https://www/x/ -> 301 apex em 1 salto.
- Exposição: .htaccess, .git/config, /pins/ = 403; /audit/, /tools/, .data/, PROMPT_TAILTRONIX.md, local_dirs.txt, auditorias .md = 404/negados. Nada sensível público.
- Headers de segurança: HSTS 1 ano includeSubDomains, nosniff, Referrer-Policy strict-origin-when-cross-origin, X-Frame-Options SAMEORIGIN, CSP frame-ancestors.

## Findings

### T-11 Medium (parcial) - /comedouro-newpet-4l-review/ com links de afiliado sem CTA
Evidência: a página tem links meli.la/mercadolivre mas não referencia `/affiliate-cta.js` (única das páginas de produto restante; as outras 3 foram corrigidas). Sem CTA topo, barra fixa mobile e evento GA4 `affiliate_click`.
Correção: aplicar o mesmo bloco CTA + `<script src="/affiliate-cta.js?v=1" defer>`, ou registrar a exclusão como intencional.

### T-12 Medium (continua) - 9 links de afiliado sem rel completo
Evidência (varredura live):
- /cachorro-de-casa-pega-pulga/: 3x https://meli.la/2dk6x44 com `rel="sponsored noopener"` (sem nofollow).
- /coleira-seresto-antipulgas/: 6x https://www.mercadolivre.com.br/coleira-antipulgas-... com `rel="noopener"` apenas (sem sponsored, link comercial; risco de política Google sobre links pagos).
Correção: `rel="nofollow sponsored noopener"`. Prioridade no Seresto, onde falta `sponsored`.

### T-15 Low (novo) - sitemap.xml e muitos arquivos live sem commit
Evidência: `git status` mostra `sitemap.xml` modificado (diff = só lastmod, 4 linhas) e iguais ao live; dezenas de diretórios untracked (img/ML, img/modelo, fotos/, audit/, reports/social/). Branch develop-v2, main atrás.
Correção: commitar sitemap; `.gitignore` para capturas/auditorias; merge em main. Risco: deploy não reproduzível a partir do repositório (ver T-07).

### T-10 Low (continua) - title/meta fora da faixa
Evidência: /autores/nildo-alves/ meta 191; /contato/ title 27 + meta 71; /sobre/ title 25; /coleira-seresto-antipulgas/ meta 161; /configurar-app-comedouro-wifi/ meta 163 (tendem a truncar).
Correção: metas 130-155; ex. title de /sobre/ "Sobre o Smart Pet Gadgets - Quem Somos e Como Avaliamos".

### T-13 Low (continua) - metas curtas
Evidência: /erros-comuns-porta-eletronica-pet/ 94 chars; /erros-comuns-brinquedo-interativo-gato/ 108 chars.
Correção: 130-155 chars com benefício + chamada.

### T-02 Low (continua) - http://www em 2 saltos
Evidência: `curl -I http://www.smartpetgadgets.com.br/` -> 301 https://www.smartpetgadgets.com.br/ -> 301 https://smartpetgadgets.com.br/. O .htaccess só trata host www; http->https vem do hPanel.
Correção: regra única no topo: `RewriteCond %{HTTP_HOST} ^www\. [NC,OR]` + `RewriteCond %{HTTPS} off` -> `RewriteRule ^(.*)$ https://smartpetgadgets.com.br/$1 [R=301,L]`.

### T-03 Low (continua) - /index.html responde 200
Evidência: https://smartpetgadgets.com.br/index.html -> 200, 142.086 bytes (canonical da home consolida, mas é URL duplicada).
Correção: `RewriteCond %{THE_REQUEST} \s/index\.html` + `RewriteRule ^index\.html$ / [R=301,L]`.

### T-05 Low (continua) - 404 genérico em inglês
Evidência: /nao-existe/ -> 404, 4.511 bytes, `<html lang="en-us">`, página padrão da Hostinger. Sem links de retorno.
Correção: /404.html pt-BR com busca/clusters + `ErrorDocument 404 /404.html`.

### T-06 Low (continua) - Permissions-Policy ausente, CSP mínima
Correção: `Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"`. HSTS sem `preload` (opcional).

### T-07 Low (continua) - logo-dark.png untracked; logoblog.png 404
Evidência: https://smartpetgadgets.com.br/img/logo-dark.png 200 mas untracked; https://smartpetgadgets.com.br/img/logoblog.png 404 (untracked local, não enviado). Verificar se alguma página referencia logoblog.png (varredura local de `/img/` não achou referência ausente).
Correção: `git add img/logo-dark.png`.

### T-08 Low (parcial) - IndexNow
Evidência: chave a1f6cd69536df7bc75a53518c642c336.txt live 200 e `deploy.sh` (linhas ~164-194) envia o arquivo-chave, mas não há evidência de ping às URLs alteradas (a API IndexNow não é chamada no trecho verificado; /indexnow.txt 404 é irrelevante).
Correção: após cada deploy, POST em https://api.indexnow.org/indexnow com as URLs alteradas (rankings novos, Tuya, schema brand). Benefício apenas Bing/Yandex/Naver; Google ignora.

### T-14 Info - affiliate-cta.js como application/x-javascript
Funciona. Opcional: `AddType text/javascript .js`. Cache 7 dias com `?v=` já tratado.

### T-04 Info - WAF com UAs falsos (não reavaliado)
Checar GSC Crawl Stats e Bing Webmaster por 403/429.

## Prioridade
1. Medium: T-12 (`sponsored` ausente no Seresto), T-11 (newpet-4l sem CTA).
2. Low: T-15/T-07 (repositório), T-10/T-13 (metas), T-02/T-03/T-05/T-06 (.htaccess/404), T-08 (ping IndexNow).
Nenhum Critical ou High.
