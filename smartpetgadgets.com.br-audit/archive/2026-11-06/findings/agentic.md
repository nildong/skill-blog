# Prontidão para agentes: smartpetgadgets.com.br

Verificado em 2026-11-06. Ferramentas: `lighthouse_agentic.py` (PSI), `agentic_check.py`, `agent_ux_check.py` (home + 2 posts). Fatos de padrões datados de 2026-09-23 (vendor-matrix). `--ua-matrix` não executado. Anterior: 2026-11-04.

## Delta vs 2026-11-04
| Item | 11-04 | 11-06 | Mudança |
|---|---|---|---|
| Lighthouse mobile / desktop | 3/3 / 3/3 (13.6.0) | 3/3 / 3/3 (13.6.0) | igual |
| Agent-UX home | 100 | 100 | igual (254 links, 6 botões, 2.342 nós, 0 sem nome) |
| Palavras sem JS (home) | 3.134 | 3.123 | ruído |
| llms.txt | 19.746 bytes | 19.811 bytes, 78 URLs (= 78 `<loc>` do sitemap) | atualizado em 11-05, sem deriva |
| Content-Signal | 16 grupos iguais | 16 grupos iguais | igual |
| Markdown / WebMCP / .well-known / ai-catalog | 404 / n/a | 404 / n/a | igual |
| CTA de afiliado (barra fixa) | inexistente | novo em 68 posts | sem regressão de acessibilidade |

## Lighthouse Agentic Browsing
- Mobile: **3/3** (Lighthouse 13.6.0). Desktop: **3/3** (Lighthouse 13.6.0).
- Contados e aprovados: `agent-accessibility-tree` (0 regras axe falhas), `cumulative-layout-shift` (0,001 mobile, 0 desktop), `llms-txt`.
- Não aplicáveis: `webmcp-form-coverage`, `webmcp-registered-tools`, `webmcp-schema-validity` (0 formulários), `ard-schema` (entra na contagem só se existir ai-catalog.json, hoje 404).

## Heurística Agent-UX (separada do Lighthouse)
| Página | Nota | Status | Botões / links | Sem nome | Div-onclick |
|---|---|---|---|---|---|
| Home | 100 | completa | 6 / 180 (254 âncoras no HTML) | 0 | 0 |
| /melhor-comedouro-automatico-cachorro/ | 100 | completa | 1 / 32 | 0 | 0 |
| /coleira-gps-para-gato/ | 100 | completa | 1 / 22 | 0 | 0 |

Novo CTA de afiliado (affiliate-cta.js, 2026-11-05):
- CTA do topo (`.cta-top`): `<a>` com texto visível ("Ver os produtos recomendados ↓"), âncora `#comparativo-rapido`. Link, não botão, correto para navegação.
- CTAs finais (`.cta-btn`): `<a>` com `rel="nofollow sponsored noopener"`, nome acessível "Ver no Mercado Livre"; SVGs decorativos sem texto. Nome repetido em vários links da mesma página (não descreve o produto).
- Barra fixa mobile: injetada por JS (`<a>` + `<button type="button" aria-label="Fechar">`). Nomes presentes, botão é botão real. Como é criada por JS e só aparece no scroll, o agente que não rola/não executa JS não a vê; o conteúdo equivalente já existe no HTML (CTA do topo), então não há perda.
- Observação: `target="_blank"` sem aviso no nome acessível; baixa relevância.

## Verificações HTTP
| Prio | Verificação | Status |
|---|---|---|
| P0 | Conteúdo sem JS | ok (3.123 palavras) |
| P0 | robots.txt | ok (200, 16 grupos; 11 tokens de IA nomeados, nenhum bloqueado na raiz) |
| P1 | Content-Signal (rascunho) | ok, todos os grupos `search=yes, ai-input=yes, ai-train=no` |
| P1 | llms.txt | ok (200, text/plain, 19.811 bytes; llms-full.txt 404) |
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
- **P2 (baixa/média):** `GPTBot` e demais crawlers de treino com `Allow: /` mas `ai-train=no`. Content-Signal é só preferência, não aplicação. Correção: se a intenção é não treinar, usar `Disallow: /` para GPTBot, ClaudeBot, CCBot, Google-Extended e Applebot-Extended, mantendo OAI-SearchBot/Claude-SearchBot permitidos. Nota: o ChatGPT é a 2ª fonte de tráfego (busca/usuário), então não bloquear OAI-SearchBot nem ChatGPT-User.
- **P3 (info):** nomes acessíveis dos CTAs "Ver no Mercado Livre" repetidos; opcional usar `aria-label` com o nome do produto (ex.: "Ver [produto] no Mercado Livre") para agentes que listam links fora de contexto.
- **P3 (info):** posts têm 1 a 2 landmarks (home tem 92 pela contagem do script); a nota é 100, mas `<main>`/`<nav>`/`<article>` claros ajudam a navegação por árvore. Verificar.
- **Oportunidade (P1/info):** sem entrega em Markdown. Gerar siblings `.md` no build e `<link rel="alternate" type="text/markdown">`. Nenhum consumidor confirmado. Cuidado: o .htaccess nega `.md`/`.json` (regra do cluster privado), então exigiria exceção.
- **Oportunidade (P3):** sem feed RSS/Atom (/feed.xml 404) e sem security.txt (404 em /security.txt e /.well-known/security.txt). Higiene, opcional.
- **Manutenção:** llms.txt é manual (78/78 URLs hoje); atrelar a regeneração ao `generate-sitemap.sh`.
- **N/A:** WebMCP, ai-catalog.json, agent card, UCP, OAuth. Só publicar ai-catalog.json se houver recurso real; um catálogo inválido cria falha contada.

## Notas de status de padrões (verificado 2026-09-23)
- Content-Signal: política Cloudflare CC0 + draft IETF individual expirado; preferência, Google não age sobre ela.
- llms.txt: especificação comunitária; Lighthouse verifica, Google Search ignora.
- WebMCP: rascunho do W3C CG; WebKit se opõe, Mozilla neutro.
- ai-catalog.json / ARD, Web Bot Auth: propostas/rascunhos.

## Nota Agentic: 96/100 (anterior 96 em 11-04)
Todos os P0 passam, Lighthouse 3/3 em ambos, Agent-UX 100 nas 3 páginas testadas, CTA novo sem regressão. Deduções: incoerência Allow vs ai-train=no (-2), sem Markdown/feed (-2, oportunidades). Sem promessa de efeito em ranking, citação ou tráfego.
