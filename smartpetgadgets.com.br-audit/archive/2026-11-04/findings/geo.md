# Auditoria GEO / AI Search Readiness: smartpetgadgets.com.br

Data: 2026-11-04 (reauditoria; anterior 2026-10-29, nota 71)
Escopo: robots.txt (política de IA + Content-Signal), comportamento real por User-Agent, llms.txt vs sitemap (78 URLs), citabilidade de passagens, entidade/marca, notas por plataforma.
Método: robots.txt e llms.txt ao vivo comparados byte a byte com o repositório (idênticos). Métricas site-wide extraídas dos 78 `index.html` locais do sitemap. Sondagem educada de UA: 11 UAs x 1 requisição em `/coleira-gps-para-gato/` + 2 repetições GPTBot, IP não-vendor. Off-site: API Wikidata, handle do YouTube, página Facebook.

---

## Delta vs 2026-10-29

| Área | 10-29 | 11-04 | Mudança |
|---|---|---|---|
| robots.txt | Disallow `/reports/` + `/?s=` | Só `Disallow: /?s=` (34ff7ea, para o Google ver o 410) | OK (neutro p/ GEO) |
| llms.txt cobertura | 78/78 | **78/78, 0 extras, 0 URLs não-200** | = |
| llms.txt títulos/descrições | 72/72 batem | **78/78 batem com `<title>`/meta locais** | = (ainda manual) |
| Alegações de teste (E-E-A-T) | "Testa e pesquisa", "testamos", byline duplicada | **Removidas** (258253b, 58 posts); as páginas que restam dizem explicitamente "não testamos" | MELHOROU |
| GPTBot | 200 e depois 429 | **429 já na 1a requisição** e nas repetições | = (só treino) |
| meta-externalagent | 200 (1 req) | **429** | PIOROU (Low) |
| coleira-gps-para-pet / melhor-coleira-gps-sem-mensalidade | 0 produtos, dM 08-22 | **Inalterado** | Não corrigido (High) |
| Citações "retrieved YYYY-MM-DD" | 115 em 57 páginas | **115 em 57** ("consultado em": 7) | Não corrigido |
| ItemList / Product | 4 / 11 páginas | 4 / 11 | = |
| Organization @id/sameAs, Person image/sameAs pessoal | Ausentes | **Ausentes** | Não corrigido (High) |
| Off-site | YouTube 404, Wikidata 0 | YouTube 404, Wikidata 0, Facebook 200 | = |

**Nota: 71/100 (= anterior).** A limpeza das alegações de teste dá +1 em autoridade. O 429 do meta-externalagent tira um pouco de acessibilidade técnica. Os três bloqueios de sempre (pilar coleira, grafo de entidade, presença off-site) continuam.

---

## 1. Acesso de crawlers de IA: PASS (bots de busca)

robots.txt: 200, 16 grupos, todos `Allow: /`, todos com `Content-Signal: search=yes, ai-input=yes, ai-train=no`, Sitemap presente.

| Crawler | Governa | robots | Ao vivo 11-04 |
|---|---|---|---|
| OAI-SearchBot | Citação no ChatGPT Search | Allow | 200 |
| ChatGPT-User | Fetch iniciado pelo usuário no ChatGPT | Allow | 200 |
| Claude-SearchBot | Citação na busca do Claude | Allow | 200 |
| Claude-User | Fetch iniciado pelo usuário no Claude | Allow | 200 |
| PerplexityBot / Perplexity-User | Citação / fetch no Perplexity | Allow | 200 / 200 |
| Googlebot (via `*`) | Google Search + AI Overviews | Allow | n/t (spoof dá 403 por anti-fake-bot; GSC 100% indexado) |
| Bingbot | Índice Bing, base do Copilot | Allow | n/t (spoof dá 403); verificar no BWT |
| Applebot | Siri/Spotlight/Safari | Allow | n/t |
| GPTBot | Só **treino** OpenAI, não afeta o ChatGPT Search | Allow | **429** |
| ClaudeBot | Só treino Anthropic | Allow | 200 |
| CCBot | Treino Common Crawl | Allow | 200 |
| Google-Extended | Treino/grounding Gemini e Vertex; **não** afeta AIO | Allow | token robots |
| Applebot-Extended | Treino Apple Intelligence | Allow | token robots |
| meta-externalagent | Meta AI (treino + respostas) | via `*` | **429** |

Findings:
- **[Low-Med] Política e aplicação divergem.** GPTBot e meta-externalagent levam 429 do Hostinger/LiteSpeed, embora o robots.txt dê Allow. Isso não afeta a citação no ChatGPT, porque OAI-SearchBot e ChatGPT-User recebem 200. **Correção:** se a intenção é `ai-train=no`, troque `Allow: /` por `Disallow: /` nos grupos GPTBot, ClaudeBot e CCBot. Content-Signal é só uma preferência declarada (o Google diz que não age sobre ela), enquanto robots é o mecanismo que esses vendors documentam respeitar. Se a intenção é permitir, libere os UAs no hPanel > Segurança.
- **[Info]** O anti-spoof devolve 403 para Googlebot/Bingbot falsos. Confirme o fetch real em uma "URL Inspection" no BWT, já que o Copilot depende do índice Bing.
- **[Info]** RSL 1.0 ausente (`/license.xml`, `/.well-known/rsl` dão 404). É opcional.

## 2. llms.txt: PRESENTE, CORRETO

- `200 text/plain`, 20.069 B, last-modified 2026-10-25, idêntico ao repo. Estrutura: H1, blockquote, `## Pages` (6) e `## Artigos` (72).
- 78 URLs únicas = 78 `<loc>` do sitemap. 0 faltando, 0 extras, todas respondem 200. Títulos e descrições batem 78/78 com as páginas.
- Nenhum post novo ou retitulado desde 10-25. Os commits 258253b e 9ccf3a3 não mexeram em title/meta, por isso ainda não houve deriva.
- **[Low] Risco residual:** o arquivo continua manual. **Correção:** gerar `llms.txt` dentro do `generate-sitemap.sh` (lendo sitemap, `<title>` e meta description) para não dessincronizar no próximo retitle.
- `llms-full.txt` dá 404 (opcional).

## 3. Citabilidade de passagens

O conteúdo não mudou de forma relevante desde 10-29, e a tabela por página da auditoria anterior continua válida. Resumo:
- **Fortes (prontas para AIO/Perplexity):** melhor-tapete-higienico (7 produtos, ItemList+Product, veredito em bullets com preço/unidade), melhor-comedouro-automatico-cachorro, bebedouro-inox-x-ceramica (bloco "escolha inox se / cerâmica se", 6 tabelas), coleira-gps-para-gato e cerca-virtual (produtos nomeados, preço datado, "Em resumo").
- **Positivo novo:** as divulgações explícitas ("não testamos os aparelhos", "anúncios consultados em 25/10/2026") são passagens confiáveis e citáveis, e as alegações de teste falsas sumiram.

Findings:
- **[High] As páginas-cabeça de coleira GPS não têm o que citar.** `coleira-gps-para-pet` (pilar) e `melhor-coleira-gps-sem-mensalidade` têm 0 produtos nomeados, dM 2026-08-22 e só BlogPosting+FAQ. A sem-mensalidade tem 0 fatos numéricos, então para uma query "melhor X" um motor de IA não acha nada para citar. **Correção:** transformar as duas em comparativo de 4 a 6 itens reaproveitando ANXK G68, JT-08-AL e AirTag/SmartTag (alternativa sem GPS). Incluir tabela (rede, mensalidade, bateria, peso, preço com data), ItemList+Product, seção de metodologia e veredito de 40-60 palavras logo após o H1, no modelo do tapete.
- **[Medium] Artefatos de citação:** 115 strings em inglês "retrieved YYYY-MM-DD" em 57 páginas, contra 7 "consultado em". **Correção:** reescrever como `(fonte: X, consultado em DD/MM/AAAA)` com link e priorizar fontes primárias (fabricante, bula, CRMV/WSAVA) no lugar de blogs concorrentes.
- **[Medium] Antipulgas (YMYL)** continua sem ItemList/Product para os 6 produtos. **Correção:** adicionar o schema e uma nota visível "dados conferidos na bula em DD/MM/AAAA". Opcional: `reviewedBy` com médico-veterinário (CRMV).
- **[Low] Frescor:** 56 de 72 posts têm dM 2026-08. Foi correto **não** subir o dM no commit de E-E-A-T, que era cosmético. Subir apenas quando houver mudança real de conteúdo.
- **[Low] Cobertura de schema:** só 4 páginas têm ItemList e 11 têm Product. As de câmera, porta eletrônica e brinquedo com produtos listados podem ganhar ItemList.

## 4. Autoridade e entidade: FRACA [High]

- Home: `Organization` {name, url, logo, sameAs:[facebook]} **sem `@id`**. `WebSite` não tem `publisher`. Nos BlogPosting, o `publisher` é uma Organization inline sem `@id`/url e o `author` é {Person, name, url} sem `@id`, image ou sameAs. Resultado: os motores não conseguem juntar marca, posts e autor num único grafo.
- ProfilePage do Nildo Alves: jobTitle, worksFor e uma descrição honesta (sem formação veterinária) estão presentes. Faltam **image** e sameAs **pessoal**: o único sameAs é a página da marca no Facebook.
- Facebook @smartpetgadgetsbr: 200, já está no sameAs da Organization. Bom.
- Off-site: YouTube @smartpetgadgetsbr dá 404, Wikidata tem 0 entidades, e não há presença em Reddit nem LinkedIn. Os sinais de maior correlação com citação em IA (YouTube ~0,737, Reddit, Wikipedia) estão todos zerados.

**Correção (schema, 1-2 h):**
```json
{"@type":"Organization","@id":"https://smartpetgadgets.com.br/#org", "...": "...",
 "sameAs":["https://www.facebook.com/smartpetgadgetsbr","<YouTube>","<Instagram>"]}
{"@type":"WebSite","@id":"https://smartpetgadgets.com.br/#website","publisher":{"@id":"https://smartpetgadgets.com.br/#org"}}
{"@type":"Person","@id":"https://smartpetgadgets.com.br/autores/nildo-alves/#person","image":"<foto>","sameAs":["<perfil pessoal>"]}
```
Nos 72 BlogPosting, usar `"publisher":{"@id":".../#org"}` e `"author":{"@id":".../#person"}`, mantendo name/url. Fora do site: criar o canal YouTube (shorts de tapete e comedouro) e ganhar menções orgânicas em Reddit e grupos pet.

## 5. Acessibilidade técnica: FORTE

HTML estático SSR (home com ~4,9 mil palavras sem JS, sem shell SPA), 404 reais, HTTPS+HSTS. Na auditoria anterior, Agent-UX deu 100 e Lighthouse Agentic 3/3. Os ativos de `/reports/` e `/_backup*` respondem 410. Descontos: 429 para GPTBot e meta-externalagent, e o Bingbot real ainda não verificado.

## 6. Multimodal: MODERADO

Imagens WebP com alt, srcset 400w/800w nos cards da home (novo) e boas tabelas. Faltam vídeo, VideoObject e canal no YouTube.

---

## GEO Health Score

| Dimensão | Peso | 10-29 | 11-04 | Ponderado |
|---|---|---|---|---|
| Citabilidade | 25% | 80 | 80 | 20,0 |
| Legibilidade estrutural | 20% | 86 | 86 | 17,2 |
| Multimodal | 15% | 58 | 58 | 8,7 |
| Autoridade e marca | 20% | 38 | 39 | 7,8 |
| Acessibilidade técnica | 20% | 89 | 88 | 17,6 |
| **Total** | | **71** | **71** | **71,3** |

## Notas por plataforma

| Plataforma | 10-29 | 11-04 | Observação |
|---|---|---|---|
| Google AI Overviews | 72 | 72 | Segue o Googlebot, não o Google-Extended. Tapete, comedouro e gato estão prontos. O pilar coleira não tem fatos citáveis. |
| ChatGPT Search | 70 | 70 | OAI-SearchBot e ChatGPT-User 200, llms.txt correto. O 429 do GPTBot é só treino. O grafo de entidade é raso. |
| Perplexity | 74 | 74 | Preços datados e vereditos ajudam. Os "retrieved" apontando para blogs concorrentes pesam contra. |
| Bing Copilot | 65 | 65 | Depende do índice Bing. Falta verificar o Bingbot real. Sem pegada off-site. |

## Top 5 mudanças de maior impacto

| # | Mudança | Severidade | Esforço | Impacto |
|---|---|---|---|---|
| 1 | Reconstruir `melhor-coleira-gps-sem-mensalidade` e o pilar `coleira-gps-para-pet` como comparativos com produtos nomeados, tabela, ItemList+Product, preços datados e metodologia | High | Médio (1-2 dias) | Alto |
| 2 | Grafo de entidade: `@id` em Organization/WebSite/Person, publisher/author por referência nos 72 posts, foto e sameAs pessoal do autor | High | Baixo (1-2 h, scriptável) | Alto |
| 3 | Canal YouTube @smartpetgadgetsbr com 3-5 vídeos curtos, adicionado ao sameAs e embutido como VideoObject nos posts top | High | Alto | Alto |
| 4 | Trocar os 115 "retrieved" por "consultado em" com link para fonte primária, e adicionar ItemList+Product + nota de bula no antipulgas | Medium | Médio | Médio |
| 5 | Alinhar o robots com `ai-train=no` (Disallow GPTBot/ClaudeBot/CCBot) ou liberar os UAs no hPanel, verificar o Bingbot no BWT e automatizar o llms.txt no script do sitemap | Low-Med | Baixo (1 h) | Baixo-Médio |

---

## Findings estruturados (audit-data.json, categoria: AI Search Readiness)

```json
{
  "category": "AI Search Readiness",
  "score": 71,
  "prior_score": 71,
  "date": "2026-11-04",
  "dimensions": {"citability": 80, "structural_readability": 86, "multimodal": 58, "authority_brand": 39, "technical_accessibility": 88},
  "platforms": {"google_aio": 72, "chatgpt_search": 70, "perplexity": 74, "bing_copilot": 65},
  "crawler_access": {
    "robots_txt": "16 grupos, todos Allow, Content-Signal search=yes, ai-input=yes, ai-train=no; Disallow apenas /?s=",
    "live": {"OAI-SearchBot": 200, "ChatGPT-User": 200, "Claude-SearchBot": 200, "Claude-User": 200, "PerplexityBot": 200, "Perplexity-User": 200, "ClaudeBot": 200, "CCBot": 200, "GPTBot": 429, "meta-externalagent": 429}
  },
  "llms_txt": {"status": "present", "urls": 78, "sitemap_urls": 78, "missing": 0, "extra": 0, "non_200": 0, "title_desc_mismatch": 0, "generator": false},
  "rsl": "absent",
  "findings": [
    {"id": "geo-coleira-head-pages", "severity": "High", "title": "Pilar coleira-gps-para-pet e melhor-coleira-gps-sem-mensalidade sem produtos nomeados nem fatos citáveis (dM 2026-08-22)", "fix": "Comparativo de 4-6 produtos com tabela, ItemList+Product, preços datados, metodologia e veredito após o H1"},
    {"id": "geo-entity-graph", "severity": "High", "title": "Organization/WebSite/Person sem @id; publisher e author inline; Person sem image e sameAs pessoal", "fix": "@id #org/#website/#person, referências nos 72 BlogPosting, foto e perfil pessoal do autor"},
    {"id": "geo-offsite-brand", "severity": "High", "title": "YouTube 404, Wikidata 0, sem Reddit/LinkedIn; só Facebook ativo", "fix": "Criar canal YouTube com vídeos curtos, incluir no sameAs, buscar menções orgânicas"},
    {"id": "geo-retrieved-citations", "severity": "Medium", "title": "115 citações 'retrieved YYYY-MM-DD' em inglês em 57 páginas", "fix": "Reescrever como 'consultado em DD/MM/AAAA' com link para fonte primária"},
    {"id": "geo-antipulgas-schema", "severity": "Medium", "title": "Antipulgas (YMYL) sem ItemList/Product e sem revisor veterinário", "fix": "ItemList+Product para 6 produtos, nota de bula visível, reviewedBy opcional (CRMV)"},
    {"id": "geo-training-bot-429", "severity": "Low", "title": "GPTBot e meta-externalagent recebem 429 apesar de Allow no robots", "fix": "Disallow nos bots de treino para alinhar com ai-train=no, ou liberar no hPanel"},
    {"id": "geo-llms-manual", "severity": "Low", "title": "llms.txt correto (78/78) mas mantido à mão", "fix": "Gerar no generate-sitemap.sh a partir de sitemap + title/meta"},
    {"id": "geo-eeat-test-claims", "severity": "Info", "title": "Alegações de teste removidas em 58 posts (258253b); divulgação 'não testamos' é explícita", "fix": "Nenhuma; manter o padrão nos novos posts"}
  ]
}
```
