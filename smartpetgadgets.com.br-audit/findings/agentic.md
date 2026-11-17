# Prontidão para agentes: smartpetgadgets.com.br

Verificado em 2026-11-17. Ferramentas: lighthouse_agentic.py (PSI), agentic_check.py, agent_ux_check.py. Fatos de padrões datados de 2026-09-23 (vendor-matrix). `--ua-matrix` NÃO executado (sem autorização do usuário); o tratamento de WAF para user agents de agentes não foi testado. Anterior: 2026-11-06.

## Delta vs 2026-11-06
| Item | 11-06 | 11-17 | Mudança |
|---|---|---|---|
| Lighthouse mobile | 3/3 (13.6.0) | 3/3 (13.6.0) em home, /melhor-bebedouro-automatico-pet/, /comedouro-automatico-para-pet/ | igual |
| Lighthouse desktop | 3/3 | 3/3 (home) | igual |
| Agent-UX | 100 (3 páginas) | 100 (home, bebedouro, comedouro) | igual |
| Palavras sem JS (home) | 3.123 | 3.243 | conteúdo cresceu |
| llms.txt | 78 URLs | 80 URLs, sitemap com 80 `<loc>` | sem deriva |
| Content-Signal | 16 grupos iguais | 16 grupos iguais | igual |
| Markdown / WebMCP / .well-known / ai-catalog | 404 / n/a | 404 / n/a | igual |

## Lighthouse Agentic Browsing
- **3/3** mobile e **3/3** desktop (home); mobile 3/3 nas duas páginas de ranking. Lighthouse 13.6.0.
- Contados e aprovados: `agent-accessibility-tree` (0 regras axe falhas), `cumulative-layout-shift`, `llms-txt`.
- Não aplicáveis: `webmcp-form-coverage`, `webmcp-registered-tools`, `webmcp-schema-validity` (0 formulários). `ard-schema` só passa a contar se existir `/.well-known/ai-catalog.json` (hoje 404); um catálogo inválido criaria uma falha contada.

## Heurística Agent-UX (separada do Lighthouse), status: completa
| Página | Nota | Nós interativos | Sem nome | Landmarks |
|---|---|---|---|---|
| Home | 100 | 190 (6 botões, 184 links) | 0 | 94 |
| /melhor-bebedouro-automatico-pet/ | 100 | 51 | 0 | 1 |
| /comedouro-automatico-para-pet/ | 100 | 69 | 0 | 1 |

## Verificações HTTP
| Prio | Verificação | Status |
|---|---|---|
| P0 | Conteúdo sem JS | ok (3.243 palavras) |
| P0 | robots.txt | ok (200, 16 grupos, 11 tokens de IA nomeados, nenhum bloqueado na raiz) |
| P1 | Content-Signal (rascunho) | ok, `search=yes, ai-input=yes, ai-train=no` em todos |
| P1 | llms.txt | ok (200 text/plain, 20.445 bytes, 80 URLs; llms-full.txt 404) |
| P1 | 404 real | ok |
| P1 | Agentes acionados pelo usuário | ok, nenhum bloqueado em robots |
| P1 | Markdown | info: Accept: text/markdown devolve text/html; .md 404 |
| P2/P3 | WebMCP (rascunho), api-catalog, oauth, agent-card, ucp, ai-catalog.json | n/a, todos 404 |

## Markdown e .htaccess
O `.htaccess` (linha 21) tem `<FilesMatch "\.(md|json)$"> Require all denied`. Qualquer entrega via sibling `.md` ou `ai-catalog.json` em `.well-known/` esbarraria nessa regra (403). Se um dia quiser Markdown: preferir negociação `Accept: text/markdown` com `Vary: Accept` via rewrite para um diretório não-`.md` (ex.: `/_md/slug.txt` com Content-Type text/markdown), ou exceção restrita `<FilesMatch>` só para `.well-known/ai-catalog.json`. NÃO afrouxar a regra global: ela protege arquivos internos do cluster. Oportunidade, não defeito; nenhum consumidor confirmado.

## Política de acesso
- Treino (GPTBot, ClaudeBot, anthropic-ai, Google-Extended, Applebot-Extended, CCBot): robots permite (`Allow: /`), preferência declarada `ai-train=no`. Incoerência persistente.
- Busca (OAI-SearchBot, Claude-SearchBot, PerplexityBot): permitido, `search=yes`.
- Acionado pelo usuário (ChatGPT-User, Claude-User, Perplexity-User): permitido.
- WAF/CDN (Hostinger/LiteSpeed) para UAs de agentes: não testado (sem autorização para --ua-matrix).

## Findings
- **P0:** nenhum.
- **P1:** nenhum.
- **P2:** crawlers de treino com `Allow: /` mas `ai-train=no`. Content-Signal é só preferência, não aplicação. Se a intenção é não treinar, usar `Disallow: /` para GPTBot, ClaudeBot, anthropic-ai, CCBot, Google-Extended, Applebot-Extended, mantendo OAI-SearchBot, Claude-SearchBot, ChatGPT-User e Claude-User permitidos (ChatGPT é a 2ª fonte de tráfego). Decisão de negócio do dono.
- **P3:** CTAs "Ver no Mercado Livre" repetidos com o mesmo nome acessível; `aria-label` com o produto ajuda agentes que listam links fora de contexto.
- **P3:** páginas de post têm 1 landmark; a nota é 100, mas `<main>`/`<article>`/`<nav>` explícitos melhoram a navegação por árvore.
- **Oportunidade:** sem Markdown, sem feed RSS/Atom (/feed.xml 404), sem security.txt (404).
- **Manutenção:** llms.txt é manual (80/80 hoje); atrelar a regeneração ao gerador de sitemap.
- **N/A:** WebMCP, ai-catalog.json, agent card, UCP, OAuth: sem recurso transacional real.

## Notas de status de padrões (verificado 2026-09-23)
- Content-Signal: política Cloudflare CC0 + draft IETF; preferência, Google não age sobre ela (rascunho).
- llms.txt: especificação comunitária; Lighthouse verifica, Google Search ignora.
- WebMCP: rascunho W3C CG; WebKit se opõe, Mozilla neutro.
- ai-catalog.json / ARD, Web Bot Auth: propostas/rascunhos.

## Nota Agentic: 96/100 (anterior 96)
Todos os P0 e P1 passam, Lighthouse 3/3, Agent-UX 100. Deduções: incoerência Allow vs ai-train=no (-2), sem Markdown/feed (-2, oportunidades), WAF não testado sem dedução. Sem promessa de efeito em ranking, citação ou tráfego.

## JSON para audit-data.json (AI Search Readiness)
[
 {"title":"Crawlers de treino com Allow mas Content-Signal ai-train=no","severity":"Medium","description":"robots.txt permite GPTBot, ClaudeBot, CCBot etc., mas declara ai-train=no; sinal é só preferência.","recommendation":"Se não quer treino, Disallow nos tokens de treino; manter busca e agentes de usuário permitidos."},
 {"title":"Sem entrega em Markdown (oportunidade)","severity":"Info","description":"Accept: text/markdown devolve HTML; .htaccess nega .md/.json de propósito.","recommendation":"Opcional; usar rewrite para caminho não-.md e não afrouxar a regra global."},
 {"title":"Nomes acessíveis repetidos nos CTAs","severity":"Low","description":"'Ver no Mercado Livre' repetido sem o produto.","recommendation":"aria-label com o nome do produto."}
]
