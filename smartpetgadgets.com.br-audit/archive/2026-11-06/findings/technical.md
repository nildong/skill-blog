# Technical SEO + On-Page - smartpetgadgets.com.br (2026-11-06)

**Nota Technical SEO: 95/100** (anterior 2026-11-04: 96). **Nota On-Page SEO: 94/100** (anterior: 95).
Escopo: 78 URLs do sitemap rastreadas ao vivo (crawl-2026-11-06.json) + HTML bruto de todas para verificar links de afiliado, CTA, GA4 e links internos; sondas de headers, redirects, 404 e .htaccess local.
Queda de 1 ponto em cada nota: 4 posts com links de afiliado ainda sem CTA/JS novo, 8 links de afiliado sem `nofollow`, metas curtas nas novas páginas "erros-comuns".

## Delta vs auditoria 2026-11-04
| Achado anterior | Status agora |
|---|---|
| T-02 http://www com 2 saltos | CONTINUA. http://www -> 301 https://www -> 301 apex. |
| T-03 /index.html 200 | CONTINUA (139.283 bytes, 200; canonical da home consolida). |
| T-04 WAF para UAs falsos | Não reavaliado. |
| T-05 404 genérico da hospedagem | CONTINUA (404 correto, 4.511 bytes, página padrão em inglês). |
| T-06 headers mínimos | CONTINUA (sem Permissions-Policy; CSP só frame-ancestors). |
| T-07 deploy não reproduzível | CONTINUA. `img/logo-dark.png` live 200 mas untracked; `img/logoblog.png` 404. |
| T-08 IndexNow sem evidência | CONTINUA. |
| T-09 links internos rasos | CONTINUA/OK. 0 links internos fora do sitemap, 0 quebrados. |
| T-10 title/meta fora da faixa | CONTINUA parcialmente. /autores/nildo-alves/ meta 191; /contato/ title 27, meta 71; /sobre/ title 25. Novos casos em T-13. |
| /cluster-comedouro-automatico-pet/ (pasta pública) | CORRIGIDO. 410 na pasta e em `x.md` (824 bytes); .htaccess tem `[G,L]` + `FilesMatch (md|json)` deny. |
| 14 titles/metas reescritos (71f1c59) | CONFIRMADO. 0 títulos e 0 metas duplicados; nenhum title acima de 65 chars; todos 200, canonical autorreferente, 1 H1. |
| gtag após o load (0206b8a) | CONFIRMADO. Nenhuma tag `<script src=googletagmanager>` estática; fila criada e script carregado pós-load; G-WDT1Q1NLKK em 78/78. |
| CTA afiliado + affiliate-cta.js (a7379a2) | CONFIRMADO com ressalva: /affiliate-cta.js 200 (4.089 bytes, cache 7 dias). 68/78 páginas o referenciam (ver T-11). |
| Abertura de resposta direta em 9 artigos (1efc1aa) | Conteúdo, não verificado em profundidade aqui; as 9 páginas têm title/meta/H1 válidos. |
| Sitemap | MELHOROU. 78 URLs, lastmod mais recente 2026-11-05. |

## Status por categoria
Crawlability PASS | Indexability PASS | Security PASS (mínimo) | URL structure PASS | Mobile PASS | CWV (fonte) PASS | JS rendering PASS (HTML estático) | hreflang N/A | IndexNow PARTIAL | Links de afiliado PARTIAL

## Findings

### T-11 Medium (novo) - 4 posts com links de afiliado sem o CTA/JS novo
Evidência: 10 páginas não referenciam affiliate-cta.js. 6 são institucionais/home (esperado: /, /sobre/, /contato/, /politica-*, /autores/). 4 posts têm links meli.la/mercadolivre e ficam sem CTA topo, barra fixa mobile e evento GA4 `affiliate_click`: /coleira-seresto-antipulgas/, /comedouro-automatico-para-pet/, /comedouro-newpet-4l-review/, /configurar-app-comedouro-wifi/. Os três primeiros são páginas de produto de alta intenção.
Correção: aplicar o mesmo bloco CTA + `<script src="/affiliate-cta.js" defer>` (ou confirmar que a exclusão é intencional por causa da pausa do cluster de afiliados).

### T-12 Medium (novo) - 8 links de afiliado sem `nofollow`
Evidência (218 links meli.la/mercadolivre analisados; todos com `sponsored`, exceto os abaixo):
- /cachorro-de-casa-pega-pulga/: 3 ocorrências de https://meli.la/2dk6x44 com `rel="sponsored noopener"` (sem nofollow; o botão topo tem nofollow, o link no corpo não).
- /coleira-seresto-antipulgas/: 5 links para mercadolivre.com.br/coleira-antipulgas-...MLB15982842 com apenas `rel="noopener"` (sem sponsored; link comercial).
Correção: `rel="nofollow sponsored noopener"` em todos. `sponsored` já cobre a política do Google; nofollow mantém consistência com o restante.

### T-13 Low (novo) - Metas curtas nas páginas "erros-comuns"
Evidência: /erros-comuns-porta-eletronica-pet/ meta 94 chars; /erros-comuns-brinquedo-interativo-gato/ 108 chars (title 51/57 ok). Páginas institucionais curtas em palavras: /contato/ 197, /politica-editorial/ 245.
Correção: ampliar para 130-155 chars com benefício + chamada; páginas institucionais não são problema de thin content.

### T-02 Low - http://www em 2 saltos (continua)
Evidência: `curl -IL http://www.smartpetgadgets.com.br/` -> 301 https://www -> 301 https://smartpetgadgets.com.br/. O .htaccess só trata o host www; o http->https vem do hPanel.
Correção: regra única no topo: `RewriteCond %{HTTP_HOST} ^www\. [NC,OR]` + `RewriteCond %{HTTPS} off` -> `RewriteRule ^(.*)$ https://smartpetgadgets.com.br/$1 [R=301,L]`.

### T-03 Low - /index.html 200 (continua)
Correção: `RewriteCond %{THE_REQUEST} \s/index\.html` + `RewriteRule ^index\.html$ / [R=301,L]`.

### T-05 Low - 404 genérico (continua)
Correção: /404.html pt-BR com menu e links para clusters + `ErrorDocument 404 /404.html`.

### T-06 Low - Headers de segurança mínimos (continua)
Evidência: HSTS 1 ano includeSubDomains (sem preload), nosniff, Referrer-Policy, X-Frame-Options, CSP só frame-ancestors. Falta Permissions-Policy.
Correção: `Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"`.

### T-07 Low - Deploy não reproduzível (continua)
Evidência: `img/logo-dark.png` untracked, servido 200. Muitos diretórios untracked (img/ML, img/modelo, audit/, reports/social/, local_dirs.txt). Branch develop-v2.
Correção: `git add img/logo-dark.png`; .gitignore para capturas/auditorias; merge em main.

### T-10 Low - Title/meta fora da faixa (continua)
Evidência: meta 191 em /autores/nildo-alves/; title 27 em /contato/ e 25 em /sobre/.
Correção: meta <=155; ex. title "Sobre o Smart Pet Gadgets - Quem Somos e Como Avaliamos".

### T-08 Low - IndexNow sem evidência de submissão (continua)
Correção: POST das URLs alteradas (14 reescritas + 9 GEO + CTA) a api.indexnow.org após deploy.

### T-14 Info - affiliate-cta.js servido como application/x-javascript
Funciona; opcionalmente forçar `text/javascript` via AddType. Cache 7 dias: usar query de versão (`?v=`) em mudanças futuras.

### T-04 Info - WAF com UAs falsos (não reverificado)
Checar GSC Crawl Stats e Bing Webmaster por 403/429.

## O que funciona
- 78/78 sitemap: 200, sem redirecionamentos, sem duplicatas; canonical autorreferente em todas; sem noindex/meta robots; 1 H1 por página.
- 0 títulos/metas duplicados; nenhum title > 65 chars; 0 referências http:// (mixed content); GA4 em 78/78.
- 0 links internos quebrados ou fora do sitemap.
- 218 links de afiliado: 210 com `sponsored` + `nofollow`.
- 410 em /cluster-comedouro-automatico-pet/, /reports/ e /_backup*; .md/.json negados; robots.txt sem Disallow desses caminhos, declara sitemap e Content-Signal.
- HTTP/2, HSTS, HTML estático (sem renderização JS necessária).
