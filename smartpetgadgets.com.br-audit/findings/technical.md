# SEO Técnico — 95/100

## O que funciona

- 79/79 URLs do sitemap respondem 200; nenhum redirect em cadeia; nenhuma URL fora do sitemap além de 2 vídeos .mp4
- Canonical autorreferente em 100% das páginas; nenhum noindex acidental
- HTTPS com HSTS, nosniff, X-Frame-Options, Referrer-Policy
- robots.txt com Content-Signal (search=yes, ai-input=yes, ai-train=no) e sitemap declarado; GSC lê 79 URLs + 262 imagens, 0 erros
- Chave IndexNow publicada; feed.xml e llms.txt (79 URLs) no ar; .htaccess bloqueado (403)
- 301 de melhor-camera-para-monitorar-pet para camera-para-monitorar-pet funcionando

## Achados

### [Low] Content-Type sem charset

O servidor envia 'content-type: text/html' sem charset. O <meta charset> está no byte 721 (dentro dos 1024 exigidos), então navegadores e o Google decodificam certo, mas clientes HTTP simples (alguns crawlers de IA) leem como Latin-1 — o crawl desta auditoria recebeu os títulos com mojibake.

**Correção:** Adicionar 'AddDefaultCharset UTF-8' no .htaccess.

### [Info] URL antiga de câmera ainda recebe impressões

/melhor-camera-para-monitorar-pet/ (301 desde 17/11) ainda aparece com 221 impr. em 28 dias; é o tempo normal de consolidação do Google.

**Correção:** Manter o 301; conferir em ~15/12 se as impressões passaram para /camera-para-monitorar-pet/.
