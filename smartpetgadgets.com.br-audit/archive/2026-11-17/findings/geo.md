# Auditoria GEO / AI Search Readiness: smartpetgadgets.com.br

Data: 2026-11-17 (reauditoria; anterior 2026-11-06, nota 72)
Escopo: robots.txt e comportamento real por User-Agent, llms.txt contra sitemap (80 URLs) e `<title>`/meta locais, citabilidade dos 7 hubs/rankings reescritos entre 11-12 e 11-16 (mais as páginas fracas de 11-06), grafo de entidade, marca fora do site e referências de IA no GA4.
Método: robots.txt, llms.txt e sitemap baixados ao vivo e comparados com o repositório (llms.txt e sitemap idênticos à cópia de trabalho; 11 páginas-chave com hash igual ao local, deploy confirmado). Métricas por página extraídas do `<article>` do HTML local. Sondagem de UA educada (10 UAs x 1 requisição em `/coleira-gps-para-gato/`, 2 s de intervalo, IP não-vendor, então o resultado mostra o comportamento do WAF e não a verificação por IP). GA4 560945876 somente leitura, 27/10 a 16/11. Off-site: Wikidata API, handle do YouTube, página do Facebook.

**Não medido:** citação real dentro do ChatGPT, Perplexity, AI Overviews ou Copilot (sem DataForSEO). As notas medem *prontidão*. As citações confirmadas são o tráfego de referência e os cliques de afiliado no GA4.

---

## Delta vs 2026-11-06

| Área | 11-06 | 11-17 | Mudança |
|---|---|---|---|
| robots.txt | 16 grupos Allow, Content-Signal `ai-train=no` | **Idêntico** | = |
| Bots de busca/fetch de IA (ao vivo) | 200 | 200 (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User) | = |
| GPTBot / meta-externalagent | 429 / 429 | 429 / 429 | = (só treino) |
| llms.txt | 78/78, 0 divergência | **80/80 URLs; 79/80 iguais; 1 descrição desatualizada** (configurar-app-comedouro-wifi, reescrita em fa44a68) | PIOROU levemente (Low) |
| Hubs com resposta direta + produto vencedor + R$ datado + "Como escolhemos / não testamos" + ItemList/Product | 0 (só o tapete chegava perto) | **7**: coleira-gps-para-gato, coleira-gps-para-pet (cachorro), melhor-bebedouro, brinquedo-gato, comedouro-automatico-para-pet, camera-pet-com-dispensador, Seresto (sem linha de método) | MELHOROU MUITO |
| Páginas sem produto (sem-mensalidade, porta) | Sem produto | **Sem mudança** (dM 05/11, 0 R$) | Não corrigido (High) |
| melhor-camera-para-monitorar-pet | 662 palavras, 0 R$ | 648 palavras, 0 R$, sem ItemList | Não corrigido |
| "retrieved YYYY-MM-DD" | 115 em 57 páginas | **102 em 51**; "consultado" 63 | MELHOROU (parcial) |
| `<lastmod>` = `dateModified` | 63/72 divergem | **63 URLs divergem**; 49 ainda carimbadas com 2026-11-05; agora também correções só de schema sobem o lastmod (coleira-gato 16/11 vs dM 12/11; bebedouro-inox 14/11 vs dM 25/10) | Não corrigido (Medium) |
| Grafo de entidade | Sem `@id`, Person sem image/sameAs pessoal | **Idêntico** | Não corrigido (High, 3a auditoria seguida) |
| Off-site | YouTube 404, Wikidata 0, Facebook 200 | Idêntico; Pinterest com 53 pins agendados, mas fora do `sameAs` | = |
| ChatGPT no GA4 | 17 sessões (2a origem), 2 landing pages | **29 sessões acumuladas (3a origem, Google subiu para 56)**; 12 sessões de 06/11 a 16/11; **10 dos 14 `affiliate_click` desde 05/11 vieram do ChatGPT** | Canal de IA continua sendo o que converte |

**Nota GEO: 74/100 (+2). Citabilidade: 87/100 (+5).** Os 7 rankings novos copiam o padrão das páginas citadas e acrescentam o que faltava em 11-06: preço datado, linha de método e schema. O ganho total é pequeno porque os três bloqueios estruturais não mudaram: o grafo de entidade, a presença fora do site e o lastmod. As páginas fracas de 11-06 também continuam iguais.

---

## 1. Acesso de crawlers de IA: PASS (bots de busca)

robots.txt: 200, 16 grupos, todos `Allow: /` com `Content-Signal: search=yes, ai-input=yes, ai-train=no`, `Disallow: /?s=` só no `*`, Sitemap declarado.

| Crawler | Governa | robots | Ao vivo 11-17 |
|---|---|---|---|
| OAI-SearchBot | Citação no ChatGPT Search | Allow | 200 |
| ChatGPT-User | Fetch pedido pelo usuário no ChatGPT | Allow | 200 |
| Claude-SearchBot | Citação na busca do Claude | Allow | 200 |
| Claude-User | Fetch pedido pelo usuário no Claude | Allow | 200 |
| PerplexityBot / Perplexity-User | Citação / fetch no Perplexity | Allow | 200 / 200 |
| Googlebot (via `*`) | Google Search, AI Overviews e AI Mode | Allow | n/t (GSC 100% indexado) |
| Bingbot | Índice Bing, base do Copilot | Allow | n/t; verificar no BWT |
| Applebot | Siri, Spotlight e Safari | Allow | n/t |
| GPTBot | Só **treino** OpenAI; não afeta o ChatGPT Search | Allow | **429** |
| ClaudeBot | Só treino Anthropic; não afeta a busca do Claude | Allow | 200 |
| CCBot | Treino Common Crawl | Allow | 200 |
| Google-Extended | Treino e grounding do Gemini/Vertex; **não** afeta Search/AIO | Allow | token robots |
| Applebot-Extended | Treino Apple Intelligence; não afeta Siri/Spotlight | Allow | token robots |
| meta-externalagent | Meta AI | via `*` | **429** |

- **[Low] Política e aplicação divergem (sem mudança).** GPTBot e meta-externalagent levam 429 do LiteSpeed, mas o robots dá Allow. Isso não afeta a citação no ChatGPT. Se a intenção é `ai-train=no`, troque por `Disallow: /` nos grupos GPTBot, ClaudeBot e CCBot. O Content-Signal só declara uma preferência; o robots é o mecanismo que esses bots dizem respeitar.
- **[Info]** Não há RSL 1.0 (`/license.xml` e `/.well-known/rsl` dão 404) nem `llms-full.txt` (404). Os dois são opcionais.

## 2. llms.txt: PRESENTE, 1 DIVERGÊNCIA [Low]

- Ao vivo: `200 text/plain`, last-modified 15/11 06:22, idêntico ao repositório.
- 80 URLs = 80 `<loc>` do sitemap: 0 faltando, 0 extras. Os 2 posts novos (rações) e todos os retítulos de 11-12 a 11-16 estão refletidos (por exemplo, "Coleira GPS para Cachorro: 5 Melhores Rastreadores de 2026" em coleira-gps-para-pet).
- **Divergência:** a descrição de `configurar-app-comedouro-wifi` ainda é a anterior ("...e como pr...") e não acompanhou a meta nova de fa44a68 ("...o modo d..."). **Correção:** copie a meta description atual para a linha do llms.txt (1 minuto).
- O risco continua o mesmo: o arquivo é mantido à mão. O peso dele na nota é baixo, porque o Google diz que não usa llms.txt.

## 3. Citabilidade de passagens: 87/100

### 3.1 Hubs e rankings reescritos entre 11-12 e 11-16 (todos no ar, hash igual ao local)

| Página | Palavras | R$ | Tabelas | H2/H3 (pergunta) | Abertura (primeiras 60 palavras) | Método / "não testamos" | ItemList+Product | Avaliação |
|---|---|---|---|---|---|---|---|---|
| coleira-gps-para-gato | 3.932 | 41 | 8 | 23 (6) | Vencedor The Pet GPS 4G, 12 meses de chip, 7 dias de bateria, **R$ 718 em 12/11/2026** | Sim / Sim | Sim | **Forte** |
| coleira-gps-para-pet (cachorro) | 3.933 | 41 | 8 | 24 (8) | The Pet GPS 4G, R$ 718 em 12/11/2026, alternativa barata | Sim / Sim | Sim | **Forte.** Só 9 frases repetidas com a versão de gato, todas de boilerplate (CTA, rodapé, bio) |
| melhor-bebedouro-automatico-pet | 3.654 | 48 | 8 | 23 (11) | Amicus Aqua Clay 2,5 L, nota 4,8 em 456, R$ 170,90 em 13/11/2026 | Sim / Sim | Sim | **Forte** |
| brinquedo-interativo-automatico-para-gato | 3.617 | 42 | 8 | 24 (12) | Varinha New Pet, 4,9 em 75, R$ 98,80 | Sim / Sim | Sim | **Forte** |
| comedouro-automatico-para-pet | 4.726 | 47 | 9 | 34 (16) | Newpet 4L, 40 porções de cerca de 5 g, 4,9 em 208 | Sim / Sim | Sim | **Forte.** O preço só aparece depois da palavra 60 |
| camera-pet-com-dispensador-de-petisco | 3.767 | 38 | 9 | 28 (14) | Câmera Pet 2K New Pet, 355°, 0,5 L, R$ 598 em 15/11/2026 | Sim / Sim | Sim | **Forte** |
| coleira-seresto-antipulgas | 3.383 | 17 | 3 | 28 (18) | "Sim, vale a pena": 8 meses, cerca de R$ 20/mês, 4,9 em 10.417 | **Não / Não** | Product+Review | **Forte**, mas ainda tem **5 "retrieved"** e nenhuma linha de método |

Padrão confirmado: a primeira frase responde à query do título com produto, 2 a 4 números e preço com data. A frase "Não testamos as fontes; veja como escolhemos" abre a seção de ranking, e a seção "Como Escolhemos" é datada ("Selecionamos seis fontes de água no Mercado Livre, em 13/11/2026..."). Cada H2 abre com uma frase que se sustenta sozinha (por exemplo, "Uma estimativa comum é de 50 a 100 ml de água por quilo de peso ao dia..."). Os parágrafos têm em média 47 a 58 palavras: são curtos e fáceis de extrair, mas quase nenhum passa de 130 palavras. Isso não é problema, porque o Google diz que não é preciso dividir o conteúdo em blocos para IA.

**Evidência de efeito:** a coleira-gps-para-gato foi reescrita em 12/11, e todas as 6 sessões vindas do ChatGPT desde 06/11 caíram **depois** da reescrita (14 a 16/11). Junto com o tapete, ela gerou 10 `affiliate_click`. A troca do vencedor (ANXK G68 por The Pet GPS 4G) não fez a página perder a citação.

### 3.2 Páginas que continuam fracas

| Página | Palavras | R$ | Problema | Severidade |
|---|---|---|---|---|
| melhor-coleira-gps-sem-mensalidade | 995 | 0 | Responde "Sim, existe", mas não nomeia nenhum modelo; sem ItemList. O hub de cachorro agora tem produtos que podem ser reaproveitados aqui | **High** |
| porta-eletronica-automatica-para-pet | 967 | 0 | Sem produto, preço ou tabela | **High** |
| melhor-camera-para-monitorar-pet | 648 | 0 | Nomeia Tapo C200 e Newpet 2K, mas sem preço nem ItemList. **Recebeu a primeira sessão do Gemini (com 1 affiliate_click).** Agora tem sobreposição com camera-pet-com-dispensador e camera-para-monitorar-pet (1.038 palavras, 0 R$, 4 "retrieved") | **High** |
| melhor-comedouro-automatico-cachorro | 2.104 | 18 | Abertura no padrão antigo ("Comparamos 7... O melhor pra você depende de três coisas"), sem vencedor nas primeiras 60 palavras. dM 22/10 e preços de outubro. **Recebeu 1 sessão do ChatGPT em 16/11.** Concorre com o hub comedouro-automatico-para-pet (vencedor Newpet 4L) | Medium |
| melhor-alimentador-automatico-gatos | 2.114 | 15 | Mesmo padrão antigo, dM 11/10. Usa "Velds 4L Wi-Fi", enquanto o resto do site usa VDRBG (inconsistência de entidade, ver memória do usuário) | Medium |
| melhor-tapete-higienico-para-cachorro | 3.324 | 31 | Página que mais converte via ChatGPT (5 cliques), mas os preços são de 23/10 e não há linha "não testamos". Se o preço ficar velho, a página perde a vantagem que tem sobre os concorrentes | **High (receita)** |
| cerca-virtual-para-cachorro | 2.102 | 10 | Abertura com definição, sem produto. Já é o próximo item planejado | Medium |

### 3.3 Findings

- **[High] Atualizar o tapete higiênico antes que o preço envelheça.** Na janela, as duas páginas que convertem são o tapete e a coleira-gato. A coleira já tem preço de 12/11. O tapete está com preço de 23/10. **Correção:** refazer o levantamento de preço (nov/2026), acrescentar a linha "Como escolhemos / não testamos" no formato dos hubs e trocar os 6 "retrieved" por "consultado em". Não mexer na abertura, que já funciona.
- **[High] Páginas que a IA já visita, mas ainda no formato antigo:** melhor-camera-para-monitorar-pet (Gemini) e melhor-comedouro-automatico-cachorro (ChatGPT). **Correção:** aplicar o padrão dos hubs: vencedor e R$ datado na primeira frase, ItemList+Product, linha de método. Na câmera, decida entre consolidar `melhor-camera` e `camera-para-monitorar-pet` (uma vira hub e a outra vira apoio ou redirect) e linkar para o ranking de dispensador. A escolha de produto e de canonical precisa da sua confirmação.
- **[High] sem-mensalidade e porta eletrônica continuam sem produto** (pendência de 11-05, aguardando sua escolha). Para a sem-mensalidade, os modelos Bluetooth/AirTag/SmartTag2 que já estão no hub de gato servem como ponto de partida.
- **[Medium] Abertura dos rankings antigos sem vencedor** (comedouro-cachorro e alimentador-gatos). Alinhe o vencedor com o hub (Newpet 4L) para o site não dar duas respostas diferentes à mesma pergunta. Uma IA que encontra respostas contraditórias no mesmo domínio tende a citar outro site.
- **[Medium] 102 "retrieved YYYY-MM-DD" em inglês em 51 páginas**, 5 delas na Seresto recém-reescrita. **Correção:** `(fonte: X, consultado em DD/MM/AAAA)` com link, de preferência para fonte primária (fabricante, bula, CRMV/WSAVA).
- **[Low] Seresto sem linha de método.** Acrescente uma frase como "Dados do anúncio e da bula consultados em 14/11/2026; não testamos o produto" logo após a abertura.
- **[Info] Já está bom:** os 7 hubs seguem o mesmo esqueleto, o número da abertura reaparece no corpo e na tabela, o preço vem sempre com data e loja, e os H2 em forma de pergunta abrem com a resposta.

## 4. Autoridade e entidade: FRACA [High] (sem mudança há 3 auditorias)

- Home: `Organization` {name, url, logo, sameAs:[facebook]} **sem `@id`**. `WebSite` sem `@id` e sem `publisher`.
- BlogPosting (conferido em coleira-gps-para-gato, de 12/11): `author` = {Person, name, url} inline, sem `@id`, image ou sameAs. `publisher` = Organization inline {name, logo}, sem `@id` nem url. Os 7 hubs novos repetem o mesmo modelo.
- Página do autor: ProfilePage > Person com jobTitle e uma description honesta ("Não possui formação veterinária..."), o que é bom para a confiança. Mas falta `@id` e `image`, e o único `sameAs` é a página da **marca** no Facebook, não um perfil pessoal.
- Off-site: YouTube @smartpetgadgetsbr 404; Wikidata 0 resultados; sem LinkedIn; Reddit não medido. Facebook 200. O Pinterest recebe 53 pins de 11/11 a 28/11, mas não está no `sameAs` da Organization (o perfil não pôde ser verificado de fora, porque o Pinterest responde 200 para qualquer handle). Os sinais com maior correlação com citação em IA (YouTube cerca de 0,737, Reddit, Wikipedia) continuam zerados.

**Correção (1 a 2 h, dá para fazer por script nos 80 arquivos):**
```json
{"@type":"Organization","@id":"https://smartpetgadgets.com.br/#org","sameAs":["https://www.facebook.com/smartpetgadgetsbr","<URL real do Pinterest>"]}
{"@type":"WebSite","@id":"https://smartpetgadgets.com.br/#website","publisher":{"@id":"https://smartpetgadgets.com.br/#org"}}
{"@type":"Person","@id":"https://smartpetgadgets.com.br/autores/nildo-alves/#person","image":"<foto>","sameAs":["<perfil pessoal>"]}
```
Nos BlogPosting, use `"publisher":{"@id":".../#org"}` e `"author":{"@id":".../#person","name":...,"url":...}`.

## 5. Acessibilidade técnica: FORTE

O site é HTML estático renderizado no servidor, sem shell SPA. A abertura de todos os hubs está no HTML bruto, logo depois do H1, da data e do aviso de afiliado, e o CTA vem depois da resposta. HTTPS+HSTS; `/reports/`, `/_backup*` e o cluster com 410. Descontos na nota: 429 para GPTBot e meta-externalagent; Bingbot real não verificado; `<lastmod>` impreciso.

- **[Medium] `<lastmod>` continua sem valor como sinal de frescor.** 63 URLs divergem do `dateModified`: 49 ainda têm o carimbo de 2026-11-05 (por exemplo, 35 páginas com dM em agosto) e, desde 11-12, correções só de schema ou de link também sobem o lastmod (coleira-gps-para-gato 16/11 contra dM 12/11; bebedouro-inox 14/11 contra dM 25/10; 7 posts do cluster de coleira com 12/11 e dM 22/08). O Bing, base do Copilot e de parte do ChatGPT Search, usa lastmod para priorizar recrawl. Com isso, os 7 hubs que mudaram de verdade ficam misturados com ~55 páginas sem mudança de conteúdo. **Correção:** gerar `<lastmod>` = `dateModified` da página no script do sitemap e subir os dois só quando o conteúdo mudar.

## 6. Multimodal: MODERADO

8 a 9 tabelas por hub. O tutorial do Tuya ganhou ilustrações próprias (4cb6a81), e os hubs usam fotos de produto. Só 2 páginas têm embed de vídeo, não há VideoObject e o canal do YouTube não existe.

---

## GEO Health Score

| Dimensão | Peso | 11-06 | 11-17 | Ponderado |
|---|---|---|---|---|
| Citabilidade | 25% | 82 | **87** | 21,8 |
| Legibilidade estrutural | 20% | 86 | 89 | 17,8 |
| Multimodal | 15% | 58 | 60 | 9,0 |
| Autoridade e marca | 20% | 39 | 41 | 8,2 |
| Acessibilidade técnica | 20% | 87 | 86 | 17,2 |
| **Total** | | **72** | **74** | **74,0** |

## Notas por plataforma

| Plataforma | 11-06 | 11-17 | Observação |
|---|---|---|---|
| Google AI Overviews | 73 | 75 | Segue o Googlebot, não o Google-Extended. Os hubs com tabela, FAQ e Product facilitam a extração. Google é agora a 1a origem no GA4 (43 sessões de 06/11 a 16/11). O lastmod impreciso pesa pouco, porque o Google já ignora lastmod pouco confiável. |
| ChatGPT Search | 72 | 77 | OAI-SearchBot e ChatGPT-User dão 200. A coleira-gato reescrita continuou sendo citada (6 sessões depois de 12/11), e surgiu uma 3a landing (comedouro-cachorro). 10 dos 14 cliques de afiliado vêm daqui. |
| Perplexity | 75 | 77 | Preços datados e linhas de método favorecem. Os 102 "retrieved" em inglês e a falta de fonte primária pesam contra. 0 sessões no GA4. |
| Bing Copilot | 64 | 65 | Depende do índice Bing, que usa lastmod para recrawl, e o lastmod continua impreciso. Bing mandou 4 sessões no período. Sem presença fora do site. |
| Gemini (nota) | — | — | 1a referência (melhor-camera, com 1 affiliate_click). Segue o índice do Google. |

## Top 5 mudanças de maior impacto

| # | Mudança | Severidade | Esforço | Impacto |
|---|---|---|---|---|
| 1 | Atualizar o tapete higiênico (preço de nov/2026, linha de método, "consultado em"), sem mexer na abertura | High | Baixo (2 h) | Alto (página que mais converte) |
| 2 | Padrão de hub em melhor-camera-para-monitorar-pet (Gemini) e melhor-comedouro-automatico-cachorro (ChatGPT), com vencedor alinhado ao hub; decidir a consolidação melhor-camera x camera-para-monitorar-pet (precisa da sua confirmação) | High | Médio (1 dia) | Alto |
| 3 | Grafo de entidade: `@id` em Organization/WebSite/Person, referências nos BlogPosting, foto e sameAs pessoal do autor, Pinterest no sameAs | High | Baixo (1 a 2 h, por script) | Alto |
| 4 | Produtos reais em melhor-coleira-gps-sem-mensalidade e porta-eletronica (escolha sua) | High | Médio | Alto |
| 5 | `<lastmod>` = `dateModified` gerado no script do sitemap; corrigir a descrição do Tuya no llms.txt; trocar os 102 "retrieved" | Medium / Low | Baixo (1 a 2 h) | Médio |

Longo prazo (High, esforço alto): canal YouTube @smartpetgadgetsbr com 3 a 5 vídeos curtos (coleira-gato, tapete, comedouro), incluído no sameAs e embutido como VideoObject.

Como medir: compare as landing pages do `chatgpt.com` e do `gemini.google.com` de 17/11 a 16/12 com a janela de 06/11 a 16/11 (ChatGPT: coleira-gato 6, tapete 5, comedouro-cachorro 1). O sinal de sucesso é algum dos 6 hubs novos (bebedouro, brinquedo, comedouro-pet, câmera-petisco, coleira-pet, Seresto) aparecer como landing.

---

## Findings estruturados (audit-data.json, categoria: AI Search Readiness)

```json
{
  "category": "AI Search Readiness",
  "score": 74,
  "prior_score": 72,
  "date": "2026-11-17",
  "citability_score": 87,
  "dimensions": {"citability": 87, "structural_readability": 89, "multimodal": 60, "authority_brand": 41, "technical_accessibility": 86},
  "platforms": {"google_aio": 75, "chatgpt_search": 77, "perplexity": 77, "bing_copilot": 65},
  "crawler_access": {
    "robots_txt": "16 grupos, todos Allow, Content-Signal search=yes, ai-input=yes, ai-train=no; idêntico a 11-06",
    "live": {"OAI-SearchBot": 200, "ChatGPT-User": 200, "Claude-SearchBot": 200, "Claude-User": 200, "PerplexityBot": 200, "Perplexity-User": 200, "ClaudeBot": 200, "CCBot": 200, "GPTBot": 429, "meta-externalagent": 429}
  },
  "llms_txt": {"status": "present", "last_modified": "2026-11-15", "urls": 80, "sitemap_urls": 80, "missing": 0, "extra": 0, "title_desc_mismatch": 1, "mismatch_pages": ["configurar-app-comedouro-wifi (descrição)"], "generator": false},
  "rsl": "absent",
  "ai_referrals_ga4": {"window": "2026-10-27..2026-11-16", "chatgpt_sessions": 29, "chatgpt_sessions_since_11_06": 12, "chatgpt_rank": 3, "landing_pages_since_11_06": {"coleira-gps-para-gato": 6, "melhor-tapete-higienico-para-cachorro": 5, "melhor-comedouro-automatico-cachorro": 1}, "gemini_sessions": 1, "affiliate_click_since_11_05": {"total": 14, "from_chatgpt": 10}},
  "findings": [
    {"id": "geo-tapete-price-refresh", "severity": "High", "title": "Tapete higiênico (maior conversão via ChatGPT) com preços de 23/10, sem linha de método e com 6 'retrieved'", "fix": "Novo levantamento de preço (nov/2026), linha 'Como escolhemos/não testamos', 'consultado em'; manter a abertura"},
    {"id": "geo-ai-visited-old-format", "severity": "High", "title": "melhor-camera (Gemini) e melhor-comedouro-automatico-cachorro (ChatGPT) recebem tráfego de IA mas seguem o formato antigo (sem vencedor/R$ na abertura, sem ItemList na câmera)", "fix": "Aplicar o padrão de hub; alinhar o vencedor com o hub comedouro-automatico-para-pet; decidir a consolidação do cluster de câmera"},
    {"id": "geo-no-product-pages", "severity": "High", "title": "melhor-coleira-gps-sem-mensalidade e porta-eletronica-automatica-para-pet ainda sem produto, preço ou ItemList", "fix": "2 a 4 produtos reais com preço datado (escolha do usuário)"},
    {"id": "geo-entity-graph", "severity": "High", "title": "Organization/WebSite/Person sem @id; author/publisher inline; Person sem image e sameAs pessoal; Pinterest fora do sameAs", "fix": "@id #org/#website/#person, referências nos BlogPosting, foto e perfil pessoal"},
    {"id": "geo-offsite-brand", "severity": "High", "title": "YouTube 404, Wikidata 0, sem LinkedIn; só Facebook (e Pinterest não verificado)", "fix": "Canal YouTube com vídeos curtos, sameAs, VideoObject"},
    {"id": "geo-old-rankings-no-winner", "severity": "Medium", "title": "melhor-comedouro-automatico-cachorro e melhor-alimentador-automatico-gatos abrem sem vencedor e podem contradizer o hub; alimentador usa 'Velds' e o resto do site usa VDRBG", "fix": "Vencedor na 1a frase, consistente com o hub; padronizar o nome do produto"},
    {"id": "geo-sitemap-lastmod", "severity": "Medium", "title": "63 URLs com lastmod diferente do dateModified; 49 ainda com o carimbo de 2026-11-05; correções só de schema também sobem o lastmod", "fix": "lastmod = dateModified gerado no script; subir só com mudança de conteúdo"},
    {"id": "geo-retrieved-citations", "severity": "Medium", "title": "102 'retrieved YYYY-MM-DD' em 51 páginas (5 na Seresto reescrita)", "fix": "'consultado em DD/MM/AAAA' com link para fonte primária"},
    {"id": "geo-seresto-no-method", "severity": "Low", "title": "Seresto reescrita sem linha de método/'não testamos'", "fix": "Frase de método datada logo após a abertura"},
    {"id": "geo-llms-desc-drift", "severity": "Low", "title": "llms.txt: descrição de configurar-app-comedouro-wifi não acompanhou a meta nova (fa44a68)", "fix": "Copiar a meta atual; idealmente gerar o llms.txt no script do sitemap"},
    {"id": "geo-training-bot-429", "severity": "Low", "title": "GPTBot e meta-externalagent recebem 429 apesar do Allow", "fix": "Disallow nos bots de treino ou liberar no hPanel"},
    {"id": "geo-hub-pattern", "severity": "Info", "title": "7 hubs reescritos de 11-12 a 11-16 com vencedor + números + R$ datado na abertura, método, 8-9 tabelas e ItemList/Product; coleira-gato continuou citada pelo ChatGPT depois da reescrita", "fix": "Nenhuma; usar como template"}
  ]
}
```
