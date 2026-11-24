# Technical SEO - smartpetgadgets.com.br (2026-11-04)

**Nota Technical SEO: 96/100** (anterior 2026-10-29: 95). **Nota On-Page SEO: 95/100**.
Escopo: 78 URLs do sitemap rastreadas ao vivo (status, canonical, title, meta, H1/H2, viewport, lang, robots meta, JSON-LD, OG, GA4, links internos), sondas de headers/redirects, comparação live vs local.

## Delta vs auditoria 2026-10-29
| Achado anterior | Status agora |
|---|---|
| T-01 robots `Disallow: /reports/` vs 410 | CORRIGIDO. robots.txt ao vivo sem Disallow /reports/ (só `Disallow: /?s=`); /reports/ e /reports/backup-fase2a-x/ retornam 410. Resta acompanhar GSC Removals. |
| T-02 http://www com 2 saltos | CONTINUA. http://www -> 301 https://www -> 301 https://apex. |
| T-03 /index.html 200 | CONTINUA (canonical da home é `/`, consolida). |
| T-04 WAF para UAs falsos | Não reavaliado (não verificável deste IP). |
| T-05 404 padrão da hospedagem | CONTINUA. Corpo "This Page Does Not Exist", sem nav, `lang` en. Status 404 correto. |
| T-06 headers de segurança mínimos | CONTINUA (sem Permissions-Policy; CSP só frame-ancestors). |
| T-07 deploy não reproduzível | CONTINUA. `img/logo-dark.png` ainda untracked mas live (200); `img/logoblog.png` 404 live. |
| T-08 IndexNow sem evidência de envio | CONTINUA. |
| T-09 links internos rasos | MELHOROU. Nenhum órfão; só /politica-de-privacidade/ com 2 inlinks (antes 1). |
| GA4 em todas as páginas | CONFIRMADO: 78/78 com G-WDT1Q1NLKK. |
| Miniaturas WebP na home | CONFIRMADO ao vivo (srcset, md5 da home live == local). |
Novo: T-10 (meta/title fora de faixa em 5 páginas, Low).

## Status por categoria
Crawlability PASS | Indexability PASS | Security PASS (mínimo) | URL structure PASS | Mobile PASS | CWV (fonte) PASS | JS rendering PASS (HTML estático, sem SPA) | hreflang N/A (site mono-idioma, sem hreflang; correto) | IndexNow PARTIAL

## Findings

### T-02 Low - http://www em 2 saltos (continua)
Evidência: `curl -I http://www.smartpetgadgets.com.br/` -> 301 https://www... -> 301 https://smartpetgadgets.com.br/. http://apex e https://www têm 1 salto.
Correção: no topo do .htaccess, regra única `RewriteCond %{HTTP_HOST} ^www\. [NC,OR]` + `RewriteCond %{HTTPS} off` -> `RewriteRule ^(.*)$ https://smartpetgadgets.com.br/$1 [R=301,L]` (desativar Force HTTPS do hPanel se sobrepor).

### T-03 Low - /index.html responde 200 (continua)
Evidência: `https://smartpetgadgets.com.br/index.html` 200 (138.936 bytes, igual à home).
Correção: `RewriteCond %{THE_REQUEST} \s/index\.html` + `RewriteRule ^index\.html$ / [R=301,L]`.

### T-05 Low - Página 404 genérica da hospedagem (continua)
Evidência: `/nao-existe` -> 404 correto, título "This Page Does Not Exist", 4511 bytes, mesma Last-Modified de 2025.
Correção: criar /404.html em pt-BR com menu e links para home/clusters e `ErrorDocument 404 /404.html`.

### T-06 Low - Headers de segurança mínimos (continua)
Evidência: HSTS 1 ano includeSubDomains (sem preload), nosniff, Referrer-Policy, X-Frame-Options SAMEORIGIN, CSP só `frame-ancestors 'self'`. Falta Permissions-Policy.
Correção: `Header set Permissions-Policy "camera=(), microphone=(), geolocation=()"`. CSP completo opcional (JSON-LD/GA4 inline).

### T-07 Low - Deploy não reproduzível a partir do git (continua)
Evidência: `git ls-files img/logo-dark.png` vazio, mas referenciado por páginas e servido (200). Muitos untracked (img/ML, img/modelo, local_dirs.txt, audit/, reports/social/). Branch develop-v2 à frente de main. /.git e /.htaccess 403; /README.md, /audit/ etc. 404 (bom).
Correção: `git add img/logo-dark.png`; .gitignore para capturas/auditorias; mergear develop-v2 em main.

### T-08 Low - IndexNow: chave hospedada, sem evidência de submissão (continua)
Correção: POST dos URLs alterados a api.indexnow.org após cada deploy (só Bing/Yandex/Naver).

### T-04 Low/Info - WAF com UAs de crawler falsos (herdado, não reverificado)
Verificar em GSC Crawl Stats e Bing Webmaster ausência de 403/429.

### T-10 Low (novo) - Title/meta fora da faixa recomendada em 5 páginas
Evidência: meta description 191 chars em /autores/nildo-alves/ e 161 em /comedouro-automatico-gato-obeso/ (truncam no SERP); title curto (27 e 25 chars) em /contato/ e /sobre/; /autores/nildo-alves/ com apenas 1 H2.
Correção: encurtar metas para <=155 chars; ampliar titles de /sobre/ e /contato/ (ex. "Sobre o Smart Pet Gadgets - Quem Somos e Como Avaliamos"); adicionar H2s na página de autor.

### T-09 Info - Profundidade de links internos
/politica-de-privacidade/ com 2 inlinks (provável só rodapé de algumas páginas). Link no rodapé de todos os posts resolve (GA4 exige divulgação).

## O que funciona
- 78/78 URLs do sitemap: 200, sem duplicatas, todas com barra final, sem redirecionamentos; canonical único e autorreferente em todas; sem meta robots/noindex.
- 0 títulos duplicados, 0 metas duplicadas, 1 H1 por página, viewport e lang pt-BR em todas, JSON-LD e OG em 78/78, GA4 em 78/78, sem referências http:// (mixed content).
- 0 órfãs; 0 links internos quebrados (alvos fora do sitemap: 2, ambos 200 sem redirect).
- Redirects: http->https 1 salto, www->apex, /soprador-para-pet/ -> /soprador-pet/ (301 único), /sobre -> /sobre/ 301.
- 410 em /reports/ e /_backup*, agora visível ao Google (robots liberado). robots.txt declara sitemap e libera crawlers de IA/busca com Content-Signal.
- HTTP/2, brotli, HSTS, TTFB baixo, HTML estático (sem necessidade de renderização JS); home live idêntica à local.
- Sitemap com lastmod em todas as 78 URLs (mais recente 2026-10-29).
