# Prontidão para agentes: smartpetgadgets.com.br

Verificado em 2026-11-04. Ferramentas: `lighthouse_agentic.py` (PSI), `agentic_check.py`, `agent_ux_check.py` (home). Fatos de padrões datados de 2026-09-23 (vendor-matrix). `--ua-matrix` não executado. Anterior: 2026-10-29.

## Lighthouse Agentic Browsing
- Mobile: **3/3** (Lighthouse 13.6.0). Desktop: **3/3** (Lighthouse 13.6.0). Anterior: 3/3 na versão 13.5.0, sem regressão.
- Contados e aprovados: `agent-accessibility-tree` (0 regras axe falhas), `cumulative-layout-shift` (0,001 mobile), `llms-txt`.
- Não aplicáveis: `webmcp-form-coverage`, `webmcp-registered-tools`, `webmcp-schema-validity` (0 formulários). `ard-schema` entra na contagem só se existir ai-catalog.json (hoje 404).

## Heurística Agent-UX (separada do Lighthouse)
Home: **100, completa**. 254 links, 6 botões, 0 div-onclick, 92 landmarks, 2.347 nós na árvore, 186 interativos, 0 sem nome, 0 inputs sem label. Igual ao anterior.

## Verificações HTTP
| Prio | Verificação | Status |
|---|---|---|
| P0 | Conteúdo sem JS | ok (3.134 palavras) |
| P0 | robots.txt | ok (200, 16 grupos; 11 tokens de IA nomeados, nenhum bloqueado na raiz) |
| P1 | Content-Signal (rascunho) | ok, todos os grupos `search=yes, ai-input=yes, ai-train=no` |
| P1 | llms.txt | ok (200, 19.746 bytes; llms-full.txt 404) |
| P1 | 404 real | ok |
| P1 | Agentes acionados pelo usuário | ok, nenhum bloqueado |
| P1 | Markdown | info: Accept: text/markdown devolve text/html; /index.md 404 |
| P2/P3 | WebMCP (rascunho), `/.well-known` (api-catalog, oauth, agent-card, ucp), ai-catalog.json | n/a, todos 404; esperado em site de conteúdo |

## Política de acesso
- Treino (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot): robots permite (`Allow: /`), preferência declarada `ai-train=no`. Incoerência: robots.txt diz Allow, o sinal diz não treinar.
- Busca (OAI-SearchBot, Claude-SearchBot, PerplexityBot): permitido, `search=yes`.
- Acionado pelo usuário (ChatGPT-User, Claude-User, Perplexity-User): permitido, nenhum bloqueio.

## Findings
- **P0:** nenhum.
- **P2 (baixa/média):** `GPTBot` com `Allow: /` mas `ai-train=no`. Content-Signal é só preferência, não aplicação. Correção: se a intenção é não treinar, usar `Disallow: /` para GPTBot, ClaudeBot, CCBot, Google-Extended e Applebot-Extended, mantendo OAI-SearchBot/Claude-SearchBot permitidos. Observação: em 10-29, GPTBot recebeu 429 repetidos; hoje a requisição única deu 200, sem reteste de carga.
- **P3 (info):** UAs falsos de buscadores a partir de IP não oficial recebem 403 (verificação rDNS do host). Confirmar Bingbot real no Bing Webmaster Tools.
- **Oportunidade (P1/info):** sem entrega em Markdown. Gerar siblings `.md` no build e `<link rel="alternate" type="text/markdown">`. Nenhum consumidor confirmado.
- **Oportunidade (P3):** sem feed RSS/Atom e sem security.txt (RFC 9116). Higiene, opcional.
- **Manutenção:** llms.txt é manual (78/78 URLs na última verificação); atrelar a regeneração ao `generate-sitemap.sh` para evitar deriva.
- **N/A:** WebMCP, ai-catalog.json, agent card, UCP, OAuth. Só publicar ai-catalog.json se houver recurso real; um catálogo inválido cria falha contada.

## Notas de status de padrões (verificado 2026-09-23)
- Content-Signal: política Cloudflare CC0 + draft IETF individual expirado; preferência, Google não age sobre ela.
- llms.txt: especificação comunitária; Lighthouse verifica, Google Search ignora.
- WebMCP: rascunho do W3C CG; WebKit se opõe, Mozilla neutro.
- ai-catalog.json / ARD, Web Bot Auth: propostas/rascunhos.

## Nota: 96/100 (anterior 95 em 10-29)
Todos os P0 passam, Lighthouse 3/3 em ambos, Agent-UX 100. Deduções: incoerência Allow vs ai-train=no (-2), sem Markdown/feed (-2, oportunidades). Sem promessa de efeito em ranking, citação ou tráfego.
