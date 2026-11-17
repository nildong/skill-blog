# Auditoria GEO / AI Search Readiness: smartpetgadgets.com.br

Data: 2026-11-06 (reauditoria; anterior 2026-11-04, nota 71)
Escopo: robots.txt (política de IA + Content-Signal), comportamento real por User-Agent, llms.txt vs sitemap (78 URLs) depois dos 14 retítulos de 11-05, citabilidade das 9 aberturas reescritas em 1efc1aa comparadas às 2 páginas que o ChatGPT já cita e ao resto do site, entidade/autor, marca fora do site, referências do ChatGPT no GA4.
Método: robots.txt, llms.txt, sitemap, home e as 22 páginas alteradas em 11-05 foram baixados ao vivo e comparados byte a byte com o repositório (todos idênticos, deploy confirmado). Métricas site-wide extraídas dos 72 posts locais do sitemap. Sondagem de UA educada (10 UAs x 1 requisição em `/melhor-camera-para-monitorar-pet/`, 2 s de intervalo, IP não-vendor). GA4 (propriedade 560945876, somente leitura): origem das sessões de 27/10 a 05/11 e landing pages do chatgpt.com até 06/11. Off-site: API Wikidata, handle do YouTube, página Facebook (a busca do Reddit bloqueia acesso automatizado, então não foi medida).

**Não medido:** citação real dentro do ChatGPT, Perplexity ou AI Overviews (sem DataForSEO). As notas medem *prontidão*. A única citação confirmada é o tráfego de referência no GA4.

---

## Delta vs 2026-11-04

| Área | 11-04 | 11-06 | Mudança |
|---|---|---|---|
| robots.txt | 16 grupos Allow, Content-Signal `ai-train=no`, Disallow `/?s=` | **Idêntico** (last-modified 29/10) | = |
| llms.txt | 78/78, sem gerador | **78/78, 72/72 artigos com título e meta iguais aos `<title>`/meta, incluindo os 14 retítulos** (atualizado 05/11 19:13, junto com 71f1c59) | = (mantido em dia à mão) |
| Aberturas com resposta direta | 4 de 12 páginas de produto caro | **12 de 12**: as 9 de 1efc1aa já estão no ar | MELHOROU |
| Produto nomeado na abertura | — | 7 de 9 (exceções: coleira-sem-mensalidade, porta-eletrônica) | MELHOROU (parcial) |
| Preço (R$) nas 9 editadas | 1 de 9 com preço | **1 de 9** (coleira-gps-para-pet, com dado de "agosto de 2026") | Não corrigido |
| ItemList / Product site-wide | 4 / 11 páginas | 4 / 11 | = |
| `dateModified` | 56 de 72 em 2026-08 | 48 de 72 em 2026-08; as 9 editadas em 2026-11-05 | MELHOROU (com ressalva, ver 3.3) |
| sitemap `<lastmod>` | Batia com `dateModified` na maior parte | **71 de 78 = 2026-11-05; 63 de 72 posts divergem do `dateModified`** (o commit do CTA a7379a2 carimbou tudo) | PIOROU (Medium) |
| Citações "retrieved YYYY-MM-DD" | 115 em 57 páginas | 115 em 57 (23 delas nas 9 editadas) | Não corrigido |
| Grafo de entidade (Organization/Person `@id`, image, sameAs pessoal) | Ausente | **Ausente** | Não corrigido (High) |
| GPTBot / meta-externalagent | 429 / 429 | 429 / 429 | = (só treino) |
| Off-site | YouTube 404, Wikidata 0, Facebook 200 | Idêntico | = |
| ChatGPT no GA4 | 16 sessões, 2 landing pages | **17 sessões (2a origem), as mesmas 2 landing pages**; nenhuma sessão nas 9 editadas até 06/11 | Cedo demais para medir |

**Nota GEO: 72/100 (+1).** As aberturas diretas sobem a citabilidade (80 para 82). O carimbo em massa do `<lastmod>` tira 1 ponto de acessibilidade técnica, porque apaga o sinal de frescor justamente das 9 páginas que mudaram de verdade. Os três bloqueios de sempre continuam: páginas sem produto (coleira sem mensalidade, porta eletrônica), grafo de entidade e presença fora do site.

---

## 1. Acesso de crawlers de IA: PASS (bots de busca)

robots.txt: 200, 1.470 B, 16 grupos, todos `Allow: /` com `Content-Signal: search=yes, ai-input=yes, ai-train=no`, Sitemap presente. Igual ao repositório.

| Crawler | Governa | robots | Ao vivo 11-06 |
|---|---|---|---|
| OAI-SearchBot | Citação no ChatGPT Search | Allow | 200 |
| ChatGPT-User | Fetch iniciado pelo usuário no ChatGPT | Allow | 200 |
| Claude-SearchBot | Citação na busca do Claude | Allow | 200 |
| Claude-User | Fetch iniciado pelo usuário no Claude | Allow | 200 |
| PerplexityBot / Perplexity-User | Citação / fetch no Perplexity | Allow | 200 / 200 |
| Googlebot (via `*`) | Google Search + AI Overviews | Allow | n/t (spoof dá 403; GSC 100% indexado) |
| Bingbot | Índice Bing, base do Copilot | Allow | n/t (spoof dá 403); verificar no BWT |
| Applebot | Siri/Spotlight/Safari | Allow | n/t |
| GPTBot | Só **treino** OpenAI, não afeta o ChatGPT Search | Allow | **429** |
| ClaudeBot | Só treino Anthropic, não afeta a busca do Claude | Allow | 200 |
| CCBot | Treino Common Crawl | Allow | 200 |
| Google-Extended | Treino/grounding Gemini e Vertex; **não** afeta Search/AIO | Allow | token robots |
| Applebot-Extended | Treino Apple Intelligence; não afeta Siri/Spotlight | Allow | token robots |
| meta-externalagent | Meta AI | via `*` | **429** |

Findings (sem mudança desde 11-04):
- **[Low] Política e aplicação divergem.** GPTBot e meta-externalagent levam 429 do LiteSpeed, mas o robots dá Allow. Não afeta a citação no ChatGPT (OAI-SearchBot e ChatGPT-User dão 200). **Correção:** se a intenção é `ai-train=no`, use `Disallow: /` nos grupos GPTBot, ClaudeBot e CCBot. Content-Signal é só uma preferência declarada; o robots é o mecanismo que esses vendors dizem respeitar. Se a intenção é permitir, libere os UAs no hPanel.
- **[Info]** RSL 1.0 ausente (`/license.xml` e `/.well-known/rsl` dão 404). `llms-full.txt` dá 404. Os dois são opcionais.

## 2. llms.txt: PRESENTE, EM DIA

- `200 text/plain`, 20.134 B, last-modified 2026-11-05 19:13, idêntico ao repo.
- 78 URLs únicas = 78 `<loc>` do sitemap. 0 faltando, 0 extras.
- **Artigos: 72/72 títulos e descrições batem** com o `<title>` e a meta description ao vivo, incluindo os 14 retitulados em 71f1c59 (cachorro-de-casa-pega-pulga, camera-pet-grava-sem-internet, comedouro-vdrbg-4l-wifi-review etc.). O commit 1efc1aa veio depois (19:58), mas não mexeu em title/meta, então não houve deriva.
- `## Pages` (6) usa rótulos curtos ("Início", "Contato") sem descrição. É intencional e não é erro; se quiser, acrescente uma linha de descrição em "Sobre", "Política Editorial" e na página do autor, que são as páginas de confiança que um LLM procura.
- **[Low] Risco residual:** o arquivo continua manual. Foi atualizado corretamente em 11-05, mas depende de lembrar. **Correção:** gerar o `llms.txt` dentro do script do sitemap (sitemap + `<title>` + meta). O Google diz que não usa llms.txt, então o peso dele na nota é baixo.

## 3. Citabilidade de passagens

### 3.1 As 9 aberturas de 1efc1aa (todas no ar)

| Página | Responde nas 1as 40-60 palavras? | Produto nomeado | Números na abertura | R$ na página | ItemList/Product | Avaliação |
|---|---|---|---|---|---|---|
| melhor-camera-para-monitorar-pet | Sim | Tapo C200, Newpet 2K, Intelbras iM3 C, Haiz Mini Botz | 360°, 9 m, Full HD | 0 | Não / Não | **Forte.** Veredito por perfil, no modelo da coleira-gato. Faltam preço e schema |
| melhor-bebedouro-automatico-pet | Sim | Tobo Raia, Amicus Aqua Flow | 2,5 L; 1,5 a 3,5 L | 0 | Não / Não | **Forte.** Veredito por número de pets. Faltam preço e schema |
| comedouro-vdrbg-4l-wifi-review | Sim | VDRBG, Newpet 4L App | 4 L, 1-40 porções, 2 MP | 0 | Sim / Sim | **Forte.** Veredito + ponto fraco + alternativa |
| comedouro-newpet-4l-review | Sim | Newpet 4L, VDRBG, Cat Mate C500 | 4 L, 12 s, 3 pilhas D | 0 | Não / Sim | **Forte** |
| coleira-gps-para-pet | Parcial (definição antes da resposta) | ANXK G68 (só para gato) | R$ 100-150, 27 g | 6 | Não / Não | **Média.** Preço de "agosto de 2026" numa página "atualizada em 5/11"; não indica modelo para cachorro |
| camera-para-monitorar-pet | Parcial (definição + checklist) | Tapo C200 "mais citado em comparativos" | 360°, 9 m | 0 | Não / Não | **Média.** "Mais citado" sem fonte |
| comedouro-com-ou-sem-wifi | Sim | Newpet 4L; "comedouro 6L avaliado aqui" (sem nome) | 0 nas 60 primeiras palavras | 0 | Não / Não | **Média.** 103 palavras; o 2o produto não tem nome |
| melhor-coleira-gps-sem-mensalidade | Sim ("Sim, existe") | **Nenhum** | 0 | 0 | Não / Não | **Fraca.** O título promete "melhor" e a página não indica modelo |
| porta-eletronica-automatica-para-pet | Sim (critério de escolha) | **Nenhum** | 0 | 0 (sem tabela) | Não / Não | **Fraca.** Sem produto, preço nem tabela |

Conferência de consistência: os fatos novos das aberturas aparecem no corpo de cada página (Intelbras iM3 10x, Haiz 8x, "9 metros" 4x, Tobo 2,5 L, Amicus 3,5 L, "1 a 40 porções", "12 segundos", "3 pilhas tipo D"). Nenhuma abertura inventou um número que o corpo não sustenta.

### 3.2 Comparação com as páginas que o ChatGPT cita

| Grupo | Páginas | Palavras (média) | Páginas com R$ | H2/H3 em pergunta (média) | ItemList | Product | "retrieved" | Fonte datada / "não testamos" |
|---|---|---|---|---|---|---|---|---|
| Citadas (tapete, coleira-gato) | 2 | 2.589 | 2/2 (31 e 8 menções) | 7,0 | 1 | 1 | 6 | coleira-gato: "consultado em" + "não testamos" |
| 9 editadas em 11-05 | 9 | 1.429 | **1/9** | 4,8 | 1 | 2 | 23 | **0/9** |
| Restante | 61 | 1.165 | 18/61 | 5,2 | 2 | 8 | 86 | 4 páginas com "não testamos" |

Leitura: as aberturas agora têm o mesmo **formato** das páginas citadas, mas faltam três coisas que as páginas citadas têm. (1) Preço datado: 8 das 9 não citam nenhum R$, e uma resposta de IA sobre compra quase sempre traz preço. (2) Linha de método e fonte ("anúncios consultados em DD/MM/2026; não testamos os aparelhos"): a coleira-gato tem, as 9 não. (3) Profundidade: 1.429 palavras contra 2.589, com melhor-camera em 662.

### 3.3 Findings

- **[High] Duas páginas de produto caro continuam sem produto para citar.** `melhor-coleira-gps-sem-mensalidade` e `porta-eletronica-automatica-para-pet` agora respondem bem à pergunta conceitual, mas não nomeiam modelo, preço ou número. Para a query "melhor coleira GPS sem mensalidade", o motor de IA cita quem nomeia um produto. **Correção:** 2 a 4 modelos reais com preço datado, alcance ou tipo de identificação, limitação principal, tabela e ItemList+Product. A porta precisa também de uma tabela microchip x RFID x facial com faixa de preço. Exige escolher os produtos afiliados, então precisa da sua confirmação.
- **[Medium] Preço datado ausente em 8 das 9 editadas.** **Correção:** uma linha por produto no padrão "faixa de R$ X a Y no Mercado Livre em nov/2026", na tabela e na abertura. Em `coleira-gps-para-pet`, troque "levantamento de agosto de 2026" por um levantamento de novembro, ou a página fica dizendo "atualizado em 5/11" com preço de três meses atrás.
- **[Medium] Sem linha de método nas 9 editadas.** **Correção:** copiar da coleira-gato uma frase curta logo após a abertura, por exemplo: "Como montamos: ficha técnica do fabricante e anúncios consultados em DD/MM/2026. Não testamos os aparelhos." É uma passagem citável e honesta, e sustenta frases como "o mais citado em comparativos" (camera-para-monitorar-pet), que hoje não têm fonte.
- **[Medium] `<lastmod>` do sitemap não serve mais como sinal de frescor.** O commit do CTA (a7379a2) colocou 2026-11-05 em 71 de 78 URLs. 63 dos 72 posts agora têm `<lastmod>` diferente do `dateModified` (por exemplo, 35 páginas com dM 2026-08-22, a maioria de porta, câmera, coleira e brinquedo). O Google só usa lastmod se ele for consistentemente preciso, e o Bing (base do Copilot e de parte do ChatGPT Search) usa lastmod para priorizar recrawl. Resultado: as 9 páginas que mudaram de verdade ficam indistinguíveis das 62 em que só entrou um botão. **Correção:** voltar o `<lastmod>` de cada URL para o `dateModified` da página e, daqui em diante, só subir os dois quando o conteúdo mudar (não para CTA, script ou mudança de template).
- **[Low] `dateModified` subiu para uma edição de um parágrafo.** Nas 9 páginas, o "Atualizado em 5 de novembro" vem de uma troca de abertura. Isso é aceitável porque a resposta principal mudou, mas fica fraco se o resto da página continuar com preço e dados de agosto. **Correção:** na próxima passada (preço + método), a data passa a refletir uma revisão real. Não suba a data de novo sem mudança de conteúdo.
- **[Medium] Artefatos de citação:** continuam 115 strings em inglês "retrieved YYYY-MM-DD" em 57 páginas (23 nas 9 editadas), contra 16 "consultado em". **Correção:** reescrever como `(fonte: X, consultado em DD/MM/AAAA)` com link e preferir fonte primária (fabricante, bula, CRMV/WSAVA).
- **[Low] Cobertura de schema:** melhor-camera, melhor-bebedouro e coleira-gps-para-gato nomeiam 2 a 4 produtos sem ItemList/Product. São os candidatos mais baratos para ganhar o mesmo schema do tapete.
- **[Info] Já está bom:** veredito por perfil em melhor-camera e melhor-bebedouro, veredito + ponto fraco + alternativa nos dois reviews de comedouro, e nenhuma abertura com número sem respaldo no corpo.

## 4. Autoridade e entidade: FRACA [High] (sem mudança)

- Home: `Organization` {name, url, logo, sameAs:[facebook]} **sem `@id`**. `WebSite` não tem `@id` nem `publisher`.
- Nos 72 BlogPosting, `author` = {Person, name, url} sem `@id`, image ou sameAs, e `publisher` = Organization inline {name, logo} sem `@id` nem url. Confirmado em melhor-camera-para-monitorar-pet depois de 1efc1aa.
- Página do autor (editada em 71f1c59 só para listar os novos títulos): Person e ProfilePage sem `@id` e sem `image`. O único `sameAs` é a página da marca no Facebook, não um perfil pessoal.
- Off-site: YouTube @smartpetgadgetsbr 404, Wikidata 0 resultados para "Smart Pet Gadgets", sem LinkedIn; Reddit não medido. Facebook @smartpetgadgetsbr 200. Os sinais com maior correlação com citação em IA (YouTube ~0,737, Reddit, Wikipedia) continuam zerados.

**Correção (schema, 1-2 h, scriptável):**
```json
{"@type":"Organization","@id":"https://smartpetgadgets.com.br/#org","sameAs":["https://www.facebook.com/smartpetgadgetsbr","<YouTube>"]}
{"@type":"WebSite","@id":"https://smartpetgadgets.com.br/#website","publisher":{"@id":"https://smartpetgadgets.com.br/#org"}}
{"@type":"Person","@id":"https://smartpetgadgets.com.br/autores/nildo-alves/#person","image":"<foto>","sameAs":["<perfil pessoal>"]}
```
Nos 72 BlogPosting: `"publisher":{"@id":".../#org"}` e `"author":{"@id":".../#person"}`, mantendo name e url.

## 5. Acessibilidade técnica: FORTE

HTML estático SSR, sem shell SPA. As aberturas novas estão no HTML bruto, sem depender de JS, logo depois do H1, da linha de data e do aviso de afiliado. O bloco de CTA de a7379a2 entra **depois** da abertura, então não fica entre a pergunta e a resposta. HTTPS+HSTS, 404 reais, `/reports/` e `/_backup*` com 410. Descontos: 429 para GPTBot e meta-externalagent, Bingbot real não verificado e, agora, `<lastmod>` impreciso em 63 posts.

## 6. Multimodal: MODERADO (sem mudança)

Imagens WebP com alt e srcset nos cards da home, tabelas em 46 de 72 posts (das páginas de produto caro, só a porta eletrônica não tem). Só 2 páginas têm embed de vídeo. Não há VideoObject nem canal no YouTube. As imagens de produto são em sua maioria geradas por IA, sem foto real.

---

## GEO Health Score

| Dimensão | Peso | 11-04 | 11-06 | Ponderado |
|---|---|---|---|---|
| Citabilidade | 25% | 80 | 82 | 20,5 |
| Legibilidade estrutural | 20% | 86 | 86 | 17,2 |
| Multimodal | 15% | 58 | 58 | 8,7 |
| Autoridade e marca | 20% | 39 | 39 | 7,8 |
| Acessibilidade técnica | 20% | 88 | 87 | 17,4 |
| **Total** | | **71** | **72** | **71,6** |

## Notas por plataforma

| Plataforma | 11-04 | 11-06 | Observação |
|---|---|---|---|
| Google AI Overviews | 72 | 73 | Segue o Googlebot, não o Google-Extended. Aberturas diretas ajudam na extração. O lastmod impreciso pesa pouco porque o Google já desconsidera lastmod não confiável. |
| ChatGPT Search | 70 | 72 | OAI-SearchBot e ChatGPT-User dão 200 e o llms.txt está em dia. As 9 páginas agora seguem o formato das 2 já citadas, mas sem preço nem linha de método. Ainda não há referência do ChatGPT para elas (GA4 até 06/11). |
| Perplexity | 74 | 75 | Vereditos com números ajudam. Os "retrieved" em inglês apontando para blogs concorrentes pesam contra. |
| Bing Copilot | 65 | 64 | Depende do índice Bing, que usa lastmod para recrawl: o carimbo em massa atrapalha a priorização das 9 páginas. Bingbot real não verificado. Sem presença fora do site. |

## Top 5 mudanças de maior impacto

| # | Mudança | Severidade | Esforço | Impacto |
|---|---|---|---|---|
| 1 | Nomear 2 a 4 produtos reais, com preço datado, tabela e ItemList+Product, em `melhor-coleira-gps-sem-mensalidade` e `porta-eletronica-automatica-para-pet` (pede sua escolha dos produtos afiliados) | High | Médio (1 dia) | Alto |
| 2 | Preço datado (nov/2026) e linha "Como montamos / consultado em / não testamos" nas 9 editadas; atualizar o levantamento de agosto da coleira-gps-para-pet; ItemList+Product em melhor-camera e melhor-bebedouro | Medium | Baixo-Médio (3-4 h) | Alto |
| 3 | Grafo de entidade: `@id` em Organization/WebSite/Person, publisher e author por referência nos 72 posts, foto e sameAs pessoal do autor | High | Baixo (1-2 h, scriptável) | Alto |
| 4 | Voltar o `<lastmod>` do sitemap para o `dateModified` real de cada página e só subir os dois quando o conteúdo mudar; verificar o Bingbot no BWT | Medium | Baixo (1 h) | Médio |
| 5 | Canal YouTube @smartpetgadgetsbr com 3 a 5 vídeos curtos (tapete, coleira-gato, câmera), incluído no sameAs e embutido como VideoObject; trocar os 115 "retrieved" por "consultado em" com fonte primária | High / Medium | Alto | Alto (longo prazo) |

Como medir: no GA4, compare as landing pages do `chatgpt.com` de 06/11 a 05/12 com a base de 27/10 a 05/11 (17 sessões, só tapete e coleira-gato). Se alguma das 9 aparecer como landing, o formato funcionou. Se nenhuma aparecer, o fator decisivo provavelmente é o preço/produto e não a abertura.

---

## Findings estruturados (audit-data.json, categoria: AI Search Readiness)

```json
{
  "category": "AI Search Readiness",
  "score": 72,
  "prior_score": 71,
  "date": "2026-11-06",
  "dimensions": {"citability": 82, "structural_readability": 86, "multimodal": 58, "authority_brand": 39, "technical_accessibility": 87},
  "platforms": {"google_aio": 73, "chatgpt_search": 72, "perplexity": 75, "bing_copilot": 64},
  "crawler_access": {
    "robots_txt": "16 grupos, todos Allow, Content-Signal search=yes, ai-input=yes, ai-train=no; Disallow apenas /?s=; idêntico a 11-04",
    "live": {"OAI-SearchBot": 200, "ChatGPT-User": 200, "Claude-SearchBot": 200, "Claude-User": 200, "PerplexityBot": 200, "Perplexity-User": 200, "ClaudeBot": 200, "CCBot": 200, "GPTBot": 429, "meta-externalagent": 429}
  },
  "llms_txt": {"status": "present", "last_modified": "2026-11-05", "urls": 78, "sitemap_urls": 78, "missing": 0, "extra": 0, "article_title_desc_mismatch": 0, "retitled_2026_11_05_reflected": "14/14", "generator": false},
  "rsl": "absent",
  "chatgpt_referrals_ga4": {"window": "2026-10-27..2026-11-05", "sessions": 17, "rank": 2, "landing_pages": ["melhor-tapete-higienico-para-cachorro", "coleira-gps-para-gato"], "edited_pages_with_referrals": 0},
  "findings": [
    {"id": "geo-no-product-pages", "severity": "High", "title": "melhor-coleira-gps-sem-mensalidade e porta-eletronica-automatica-para-pet abrem com resposta direta mas não nomeiam produto, preço nem número", "fix": "2-4 produtos reais com preço datado, tabela, ItemList+Product (escolha de afiliado pede confirmação)"},
    {"id": "geo-entity-graph", "severity": "High", "title": "Organization/WebSite/Person sem @id; publisher e author inline nos 72 posts; Person sem image e sameAs pessoal", "fix": "@id #org/#website/#person, referências nos BlogPosting, foto e perfil pessoal do autor"},
    {"id": "geo-offsite-brand", "severity": "High", "title": "YouTube 404, Wikidata 0, sem LinkedIn; só Facebook ativo", "fix": "Canal YouTube com vídeos curtos, sameAs, VideoObject"},
    {"id": "geo-edited-pages-no-price", "severity": "Medium", "title": "8 das 9 páginas editadas em 11-05 sem nenhum preço; coleira-gps-para-pet usa preço de agosto numa página atualizada em 5/11", "fix": "Faixa de preço com data (nov/2026) na abertura e na tabela"},
    {"id": "geo-edited-pages-no-method", "severity": "Medium", "title": "Nenhuma das 9 editadas tem linha de método/fonte datada ('consultado em', 'não testamos'), ao contrário da coleira-gps-para-gato já citada", "fix": "Frase 'Como montamos' logo após a abertura"},
    {"id": "geo-sitemap-lastmod-stamped", "severity": "Medium", "title": "71/78 lastmod = 2026-11-05 após o commit do CTA (a7379a2); 63/72 posts com lastmod diferente do dateModified", "fix": "lastmod = dateModified real; subir só com mudança de conteúdo"},
    {"id": "geo-retrieved-citations", "severity": "Medium", "title": "115 citações 'retrieved YYYY-MM-DD' em inglês em 57 páginas (23 nas 9 editadas)", "fix": "'consultado em DD/MM/AAAA' com link para fonte primária"},
    {"id": "geo-datemodified-thin-edit", "severity": "Low", "title": "dateModified das 9 páginas subiu por troca de um parágrafo; resto da página com dados de agosto", "fix": "Fazer a passada de preço/método para a data refletir revisão real; não subir de novo sem conteúdo"},
    {"id": "geo-schema-coverage", "severity": "Low", "title": "melhor-camera, melhor-bebedouro e coleira-gps-para-gato nomeiam produtos sem ItemList/Product", "fix": "ItemList+Product no padrão do tapete"},
    {"id": "geo-training-bot-429", "severity": "Low", "title": "GPTBot e meta-externalagent recebem 429 apesar de Allow no robots", "fix": "Disallow nos bots de treino ou liberar no hPanel"},
    {"id": "geo-llms-manual", "severity": "Low", "title": "llms.txt em dia (72/72 artigos, 14 retítulos refletidos) mas mantido à mão", "fix": "Gerar no script do sitemap"},
    {"id": "geo-direct-answer-openings", "severity": "Info", "title": "12/12 páginas de produto caro abrem com resposta direta; 7/9 editadas nomeiam produto com números sustentados pelo corpo", "fix": "Nenhuma; manter o padrão em posts novos"}
  ]
}
```
