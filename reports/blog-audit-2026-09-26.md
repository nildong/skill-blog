# Blog Audit Report — LIVE (https://smartpetgadgets.com.br/)

**Audit Date:** 2026-09-26
**Modo:** Auditoria **ao vivo**, via URL pública (sitemap.xml, robots.txt, requisições HTTP diretas ao domínio) — não a partir dos arquivos locais.
**Total de URLs no sitemap:** 101 (76 páginas de conteúdo/institucionais únicas)
**Auditoria de conteúdo/SEO/schema/cannibalização mais recente (local, ainda válida):** `reports/blog-audit-2026-09-18.md` — reaproveitada abaixo onde nada mudou; esta rodada foca no que só é visível ao vivo.

---

## 🚨 Achado crítico: página no sitemap, mas não publicada (404 ao vivo)

| URL | Status ao vivo | No sitemap? | Existe localmente? | Commitado no git? |
|---|---|---|---|---|
| `/cachorro-de-casa-pega-pulga/` | **HTTP 404** | Sim (lastmod 2026-09-22) | Sim (`index.html` + `img/`) | **Não** (untracked) |

O `sitemap.xml` já foi regenerado e enviado ao servidor com esta URL datada de 22/09, mas os arquivos do post (`index.html`, imagens) nunca foram enviados via SFTP/deploy. Resultado: o Google (e qualquer bot) encontra a URL no sitemap e recebe 404 — isso é um sinal negativo de qualidade de sitemap para o Search Console.

Além disso, o post `coleira-seresto-antipulgas` (já publicado e ao vivo) tem uma edição **local não commitada** que adiciona um link interno para `/cachorro-de-casa-pega-pulga/`. Essa mudança ainda não foi para o ar — mas se for deployada isolada (sem publicar a página nova junto), vai criar um **link interno quebrado ao vivo** na página que já está no ar.

**Ação recomendada (prioridade 1):** publicar (`git add` + commit + deploy) a pasta `cachorro-de-casa-pega-pulga/` junto com a atualização de `coleira-seresto-antipulgas/index.html` no mesmo deploy. Depois, considerar solicitar reindexação da URL no Search Console.

## Página local não publicada intencionalmente ou esquecida?

| URL | Status ao vivo | No sitemap? |
|---|---|---|
| `/cluster-comedouro-automatico-pet/` | **HTTP 403** | Não |

Pasta existe localmente (`cluster-comedouro-automatico-pet/`) mas nunca foi deployada nem está no sitemap — parece rascunho/cluster de trabalho em andamento (`.data/content-strategy.json` referencia clusters). Não é um erro ao vivo (não está indexado, não gera 404), mas vale confirmar se é conteúdo pendente de publicação ou arquivo órfão para limpar.

---

## Verificação de status HTTP — todas as 76 URLs do sitemap

Checagem `curl -L` ao vivo em todas as URLs listadas no sitemap:

- **75/76 URLs → HTTP 200** ✅
- **1/76 URLs → HTTP 404** (`cachorro-de-casa-pega-pulga`, ver acima)
- Nenhum redirecionamento (3xx) encontrado — bom, sitemap não está listando URLs redirecionadas
- Nenhum erro 5xx

## robots.txt (ao vivo)

- `Allow: /` padrão para a maioria dos user-agents
- `Disallow: /reports/` (correto — não queremos crawlers em relatórios internos)
- Libera explicitamente **ClaudeBot, Claude-User, Claude-SearchBot, anthropic-ai, GPTBot, PerplexityBot, Googlebot, Google-Extended, Bingbot** e outros — boa postura para citação em IA (AI Overviews / AEO)
- Sitemap declarado corretamente: `https://smartpetgadgets.com.br/sitemap.xml`

## llms.txt

- **Não existe** (`/llms.txt` → 404). Não é um requisito, mas como o robots.txt já libera bots de IA de forma proativa, um `llms.txt` simples reforçaria a estratégia de citação em IA já em curso (ver memória "Multi-niche platform plan" e foco em AI-citation SEO). Prioridade baixa, esforço leve.

## Canonical / title (amostragem ao vivo)

Checado em home e em `coleira-seresto-antipulgas` (post mais recente): `<title>` únicos e `<link rel="canonical">` self-referencing corretos em ambos, sem duplicação aparente. Consistente com o achado da auditoria de 18/09 (nenhuma duplicação de título/meta detectada em 76 páginas).

## Sitemap coverage

- Diff entre pastas locais de conteúdo (76, excluindo `briefs/`, `calendars/`, `tools/`, `reports/`, `img/`, pastas de output) e URLs do sitemap: **idênticos**, exceto o gap do achado crítico acima e `cluster-comedouro-automatico-pet` (não publicado, corretamente ausente do sitemap).

---

## Reaproveitado da auditoria local de 2026-09-18 (ainda válido — conteúdo não mudou desde então, exceto os dois itens acima)

Não foi refeita a pontuação por post nesta rodada (auditoria de conteúdo/SEO/schema completa há 8 dias, sem mudanças estruturais no meio-tempo). Resumo do que já estava mapeado:

- **69/71 posts** com `FAQPage` schema; home tem heading de FAQ sem schema correspondente; política de privacidade sem FAQ (esperado)
- **71/75 páginas** com JSON-LD; as 4 sem schema são institucionais (contato, sobre, política de privacidade, política editorial)
- **53 pares POSSIBLE de canibalização**, majoritariamente por design (pares de comparação/FAQ) — nenhum merge/redirect recomendado sem revisão manual
- **183 sugestões de link interno** pendentes em `reports/internal-linking.md`
- **Nenhuma página órfã** (0 inbound links) identificada na análise local de grafo de links
- **SKIPPED nesta rodada:** GSC/GA4 decay (sem credenciais invocadas — snapshot de 25/08 ainda mostrava ~0 impressões, esperado para conteúdo jovem)

---

## Fila de Ações Priorizada

| Prioridade | Página/Item | Problema | Ação |
|---|---|---|---|
| 1 | `/cachorro-de-casa-pega-pulga/` | No sitemap ao vivo mas retorna 404 (nunca deployado) | Deploy imediato da pasta + commit; depois validar 200 ao vivo |
| 2 | `coleira-seresto-antipulgas/index.html` | Edição local não commitada linka para página ainda não publicada | Commitar e deployar junto com a ação acima, na mesma janela |
| 3 | `cluster-comedouro-automatico-pet/` | Pasta local sem deploy nem sitemap | Confirmar se é rascunho pendente ou lixo para remover |
| 4 | `/llms.txt` | Ausente | Criar arquivo simples (baixo esforço), reforça estratégia de citação em IA já sinalizada no robots.txt |
| 5 | Home | Heading de FAQ sem `FAQPage` schema (achado de 18/09, ainda não corrigido) | Adicionar JSON-LD ou remover o enquadramento de FAQ do heading |
| 6 | `contato`, `sobre`, `politica-de-privacidade`, `politica-editorial` | Sem JSON-LD (achado de 18/09) | Adicionar Organization schema (lote, baixo esforço) |

## Próximos passos sugeridos

- Depois de corrigir o item 1-2, rodar `curl -I` na URL para confirmar 200 e considerar solicitar reindexação via Search Console (URL Inspection).
- Rodar `/blog geo` na home e nos 5 posts de maior intenção de tráfego para pontuação formal de AI Citation Readiness (não computada nesta rodada).
- Rodar `/blog analyze cachorro-de-casa-pega-pulga` assim que estiver no ar, já que é conteúdo novo e ainda sem score formal.
