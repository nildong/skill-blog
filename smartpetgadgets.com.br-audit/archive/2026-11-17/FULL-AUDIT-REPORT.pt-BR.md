# Auditoria SEO Completa — smartpetgadgets.com.br

Data da auditoria: 11/10/2026
Tipo de negócio: Site de conteúdo afiliado/review (nicho de pet gadgets, português do Brasil), HTML estático renderizado no servidor, 77 posts publicados, sem checkout de e-commerce direto — monetiza via links de afiliado do Mercado Livre (meli.la).

## Health Score SEO Geral: 83 / 100

| Categoria | Score | Peso |
|---|---|---|
| SEO Técnico | 92 | 22% |
| Qualidade de Conteúdo | 72 | 23% |
| SEO On-Page | 85 | 20% |
| Schema / Dados Estruturados | 70 | 10% |
| Performance (CWV) | 99 | 10% |
| Preparo para Busca com IA | 78 | 10% |
| Imagens | 90 | 5% |

Diagnóstico complementar (não entra no score ponderado): **SXO Gap Score 58/100** — este é o número mais explicativo de toda a auditoria. Ele mede se o *formato* da página corresponde ao que o Google efetivamente recompensa para a consulta-alvo, independente da limpeza técnica.

## Resumo Executivo

O site é tecnicamente excelente e está quase totalmente indexado (77/77 URLs do sitemap confirmadas com status 200 e indexadas no GSC), mas rankeia mal: **a CTR geral do site nos últimos 90 dias é 1,34% com posição média 10,0**, bem abaixo do benchmark de ~2-3% esperado nessa posição. Isso **não é um problema de indexação** — é a combinação de (1) um descompasso real entre o formato da página e o que o Google espera nas queries comerciais de maior valor, (2) uma camada de autoria rasa/não verificável que prejudica a confiança em conteúdo relacionado à saúde, e (3) dois riscos concretos de rich results (uma avaliação fabricada e um bug de visibilidade no modo escuro) que precisam ser corrigidos independentemente da estratégia de ranking.

### Top 5 Problemas Críticos/Altos
1. **CRÍTICO — AggregateRating não genuína** em `coleira-seresto-antipulgas` (4,8★/5.501 avaliações, quase certamente copiada de dados de marketplace). Risco de ação manual do Google sobre rich results de review **em todo o site**, não apenas nessa URL.
2. **CRÍTICO — Logo invisível no modo escuro.** A marca "Smart Pet" renderiza em texto escuro sobre fundo preto no `prefers-color-scheme: dark`, em todas as páginas.
3. **CRÍTICO (SXO) — Páginas "melhor-*" têm o formato errado** para sua SERP. "melhor comedouro automático para cachorro 2026" e queries similares são dominadas por listas rankeadas de 6-10 itens com fotos/preços/schema ItemList; as páginas do site entregam 3 categorias abstratas, 1 imagem e nenhum schema Product.
4. **ALTO — E-E-A-T do autor é rasa.** Bio de 50-72 palavras, sem credenciais, linguagem "testamos/comparamos" sem evidência verificável de primeira mão (fotos, medições) — um risco real em conteúdo relacionado à saúde pet (YMYL).
5. **ALTO — Gap de visibilidade no ranking confirmado nos dados do GSC.** Várias páginas têm impressões reais + posição média próxima da primeira página + zero cliques em 90 dias (mesmo padrão dos 3 posts já corrigidos) — uma categoria de quick win escalável.

### Top 5 Quick Wins
1. Substituir o AggregateRating fabricado pelo padrão de `Review` único já usado corretamente em 7 outros posts de review.
2. Corrigir o CSS do modo escuro para que o texto do logo fique visível.
3. Reescrever título/meta de `/cerca-virtual-para-cachorro/` (53 impressões, posição 9,8, 0 cliques/90d — o candidato mais evidente).
4. Preencher `Organization.sameAs` com a página do Facebook já no ar (`@smartpetgadgetsbr`).
5. Regenerar o `llms.txt` para listar os 77 artigos em vez de 6 páginas utilitárias (gerável via script a partir de `site-index.json`).

---

## SEO Técnico (92/100)

**O que funciona:** HTTPS forçado com HSTS/CSP/X-Frame-Options; redirects 301 limpos de um único salto (http→https, www→sem-www, slug antigo→novo); sitemap 77/77 corresponde ao site-index, todas as URLs retornando 200; HTML totalmente estático renderizado no servidor (sem risco de renderização via JS); desambiguação do schema Review Newpet 4L/2L se mantém sem regressão; schema Person confirmado presente (contradizendo uma nota de memória interna desatualizada que o classificava como ausente).

**Achados:**
- **Médio** — Nenhum arquivo de chave IndexNow na raiz do site; o push-indexing do Bing/Yandex/Naver não está integrado ao fluxo de deploy do HTML estático.
- **Baixo** — A entidade de schema Person é rasa (apenas name+url, sem image/sameAs/description).
- **Baixo** — A home tem um título estilo FAQ sem o schema FAQPage correspondente.

## Qualidade de Conteúdo (72/100)

**O que funciona:** estrutura de resposta-primeiro em todos os posts amostrados; schema FAQPage em 71/77 posts com respostas autocontidas; divulgação de afiliados presente e compatível (aviso inline estilo FTC + política no footer + `rel="nofollow sponsored noopener"`); 0% de duplicação de frases templatizadas entre os 77 pares de metadados; afirmações datadas e com fonte citada.

**Achados:**
- **Alto** — Entidade de autor rasa demais para conteúdo relacionado à saúde pet (YMYL-adjacente): nenhuma credencial, anos de experiência ou qualificação veterinária divulgados em nenhum lugar, ainda que todos os 77 posts se apoiem nessa única voz para afirmações relacionadas à saúde.
- **Alto** — Afirmações de primeira mão não verificáveis: os posts de review usam linguagem "testamos/comparamos", mas a bio descreve curadoria baseada em especificações de fabricante, sem fotos/medições/capturas de tela originais — um marcador reconhecido de conteúdo de baixa qualidade que arrisca contradizer o próprio modelo editorial declarado do site.
- **Médio** — Profundidade comercial do cluster de comedouro confirmada rasa — consistente com um alerta interno anterior; deixar para o esforço de reformulação de conteúdo já pausado, em vez de um fix mecânico.
- **Médio** — Páginas utilitárias rasas (`/sobre` com 210 palavras, `/contato` com 190 palavras) e alguns posts de FAQ com menos de 600 palavras dependem demais de atribuição a terceiros.

## SEO On-Page (85/100)

**O que funciona:** títulos únicos, descritivos, com a palavra-chave em destaque (53-75 caracteres); exatamente um H1 por página, distinto do título; meta descriptions únicas; canonicais autorreferenciais; slugs limpos e descritivos, sem resíduo de query-string.

**Achados:**
- **Médio** — A meta description de `melhor-antipulgas-para-cachorro` tem 221 caracteres, bem além do limite prático de truncamento do Google (~155-160 caracteres); provavelmente compartilhado por outros posts de comparação/review com estilo autoral similar — vale uma varredura nas 76 URLs restantes (fora a home).

## Schema / Dados Estruturados (70/100)

**O que funciona:** 77/77 posts têm JSON-LD sintaticamente válido (0 inválidos pelo validador local); 7 de 8 posts de review usam corretamente o padrão de `Review` único; Breadcrumb, `VideoObject` (2 posts) e schema de comparação `ItemList`-de-`Product` corretamente implementados; schema `Product` corretamente omite preço/offers dado que não há mecanismo de sincronização de preço em tempo real (adicionar preço desatualizado seria piorar em relação a omitir).

**Achados:**
- **Crítico** — `AggregateRating` não genuína (4,8★, 5.501 avaliações) em `coleira-seresto-antipulgas`, quase certamente copiada do Mercado Livre/dados de fabricante em vez de reviews genuínas de primeira parte. Isso viola a política de Review/AggregateRating do Google; o risco é de elegibilidade de rich results **em todo o site**, não limitado a essa URL. **Corrigir primeiro.**
- **Alto** — Schema `HowTo`/`HowToStep` depreciado ainda presente em `configurar-app-comedouro-wifi` (descontinuado pelo Google em setembro de 2023, zero valor de rich result). Remover.
- **Médio** — `Organization.sameAs` da home é um array vazio — pior do que omitir o campo, agora que a página do Facebook está no ar.
- **Baixo** — O schema `WebSite` não tem `SearchAction` (ok se não houver busca interna funcional).

## Performance / Core Web Vitals (99/100)

**O que funciona:** Lighthouse 98-100/100 na home (mobile/desktop) e nos 3 posts internos amostrados; LCP de 0,77s a 2,24s em todas as páginas (todas "Bom"); TBT 0ms e CLS 0 em tudo que foi medido; sem CSS/JS bloqueando renderização, sem fontes customizadas, sem scripts de terceiros/ads; divisão correta entre `loading="eager"`/`loading="lazy"`; HTTP/2 com compressão, HTTP/3 anunciado.

**Achados:**
- **Baixo** — A hero da home é uma imagem de fundo CSS em JPEG simples de 198KB, sem preload — o único ponto fraco mensurável atrás do LCP mobile comparativamente mais alto da home (2,24s) vs ~0,8-1,0s nos posts internos.
- **Baixo** — Várias miniaturas de hero/card continuam em `.jpg` em vez de `.webp` em posts mais antigos.
- **Informativo** — O PSI aponta "melhorar a entrega de imagens": 376 KiB de economia potencial na home mobile, 1.668 KiB na home desktop (23 das 24 requisições no desktop são imagens). Não está prejudicando os scores de CWV atualmente, mas é um quick win de payload total.
- **Informativo** — O CrUX (dados reais de usuário) retornou **403 Forbidden** tanto no endpoint de origem quanto no de histórico — um problema de chave de API/habilitação (não o 404 usual por baixo tráfego). Os dados de laboratório usados neste score não são afetados e são sólidos; corrigir a chave de API no GCP para desbloquear confirmação com dados reais em auditorias futuras.

## Preparo para Busca com IA / GEO (78/100)

**O que funciona:** aberturas de resposta-primeiro, H2s em formato de pergunta, respostas de FAQ autocontidas em todos os posts amostrados; fração de Agentic Browsing do Lighthouse 3/3; heurística Agent-UX 100/100 (220 âncoras reais, 0 widgets-div falsos, 77 landmarks semânticos — totalmente consumível sem JS); `Content-Signal` do robots.txt permite corretamente todos os principais crawlers de IA; `llms.txt` existe e retorna 200; desambiguação de entidade (Newpet 4L vs 2L) se mantém.

**Achados:**
- **Alto** — `llms.txt` é um stub quase vazio (611 bytes, 6 páginas utilitárias, zero dos 77 artigos listados).
- **Alto** — Presença de marca em terceiros é zero (sem presença no YouTube/Reddit/Wikidata) — menções no YouTube são o correlato mais forte de citação por IA encontrado em pesquisas de GEO; isso limita a citabilidade em ChatGPT/Perplexity independentemente da qualidade on-page.
- **Médio** — Posts de comparação/review são só texto corrido, sem tabelas escaneáveis que AI Overviews/Perplexity preferem para extração.
- **Médio** — 6 dos 77 posts ainda sem schema FAQPage.
- **Baixo** — Respostas `429` breves observadas ao sondar com user-agent GPTBot em sequência rápida; o robots.txt permite GPTBot explicitamente e os headers do WAF foram idênticos entre as respostas — provavelmente um artefato de rate-limit das próprias requisições em sequência da auditoria, não um bloqueio por UA. Vale um reteste com intervalo entre requisições.

## Imagens (90/100)

**O que funciona:** cobertura de alt-text de 100% em todas as páginas amostradas, descritivo em vez de keyword-stuffing; `loading="lazy"` aplicado de forma consistente; `width`/`height` definidos, prevenindo CLS; WebP usado em muitas imagens de hero.

**Achados:**
- **Baixo** — Contagem de imagens muito desigual entre artigos: `melhor-antipulgas-para-cachorro` tem apenas 4 imagens em ~1.656 palavras, `coleira-gps-para-pet` tem só 1. É a mesma lacuna apontada pela análise de SXO em relação a concorrentes de marketplace/listicle que mostram 5-10 fotos de produto por página.

## SXO — Análise de Experiência de Busca (58/100 — complementar)

Esta é a camada de diagnóstico que explica *por que* um site tecnicamente limpo e totalmente indexado ainda tem desempenho ruim. A análise retroativa de SERP em 7 posts, cobrindo 3 classes de intenção, encontrou uma divisão clara:

- **Páginas "melhor"/comerciais têm um descompasso CRÍTICO.** `/melhor-comedouro-automatico-cachorro/` e `/melhor-alimentador-automatico-gatos/` alvejam queries cuja SERP é dominada por listas rankeadas de 6-10 itens com imagem por produto, faixas de preço e schema `ItemList`/`Product`. As páginas do site entregam 3 "categorias" abstratas, 1 imagem de hero, 2 links de afiliado, 1 CTA e nenhum schema Product — elas não conseguem satisfazer a intenção de "me mostre o campo rankeado completo", independentemente de quão bem indexadas estejam.
- **A limpeza pausada do cluster de comedouro é confirmada como um problema de SXO, não de catalogação de links.** As páginas comerciais têm em média 1-2 links de afiliado e um CTA pouco destacado; a única página bem construída, `/comedouro-vdrbg-4l-wifi-review/`, tem 9 links em 3 CTAs com schema Product+Review+ItemList completo — prova de que essa profundidade é viável internamente e deveria ser o modelo para a reformulação, não um patch mecânico.
- **Páginas informativas/comparativas estão corretamente alinhadas** (`comedouro-automatico-vale-a-pena`, `comedouro-com-ou-sem-wifi`) e são genuinamente as vitórias de ranking mais rápidas no curto prazo — não converter essas em listicles.
- **O scoring de personas confirma a ordem de prioridade:** a persona "Tutor Pronto para Comprar" tem score 43-44/100 nas páginas "melhor" (as mais fracas, de maior valor comercial) vs. 77/100 na review do VDRBG — corrigir a experiência de compra nas páginas "melhor-*" primeiro.

## Clusters Semânticos de Tópicos

- **O cluster Coleira GPS (11 posts) é o modelo de referência**: o hub linka para todos os 10 spokes, todos os spokes linkam de volta, 62 conexões intra-cluster (~5,6/post). Nenhuma ação necessária — replicar essa densidade nos outros clusters.
- **ALTO — `cercado-para-cachorros` é um verdadeiro órfão** (0 links de entrada, não pertence a nenhum cluster).
- **ALTO — O cluster Câmera (10 posts) é uma casca estrutural**: apenas 26 conexões intra-cluster vs. 62 na referência Coleira GPS; vários spokes quase órfãos dentro do próprio cluster; a página comercial `melhor-camera-para-monitorar-pet` tem apenas 2 links de entrada.
- **Médio** — O hub de comedouro (20 posts, o maior cluster) tem 4 lacunas de cobertura, incluindo dois posts de review afiliados; candidato a ser dividido em sub-pilares informacional + comercial. Antipulgas (3 posts) e tapete higiênico (2 posts) não têm pilar definido.
- A canibalização de keywords em todo o site **não** é um problema relevante: 0 conflitos "altos", score máximo "possível" de 67 — diferenciação (títulos/modificadores), e não fusão, é o remédio correto para o punhado de páginas coleira/newpet que se sobrepõem.

## Backlinks (Tier 0 — apenas Common Crawl)

O domínio **não está presente no grafo web do Common Crawl** (`in_crawl: false`), e não existe nenhum inventário de backlinks conhecidos no repositório. Menos de 4 dos 7 fatores padrão de scoring têm alguma fonte de dados nesse tier, então nenhum Backlink Health Score numérico foi produzido — isso é reportado como dado insuficiente, não como score zero. O gap de autoridade de base está marcado como **Alto** e é consistente com o achado de SXO de que termos comerciais de cabeça perdem para marketplaces/listicles de maior autoridade. Quick win: preencher `Organization.sameAs` com a página do Facebook como sinal gratuito de entidade; médio prazo: extrair o relatório de Links do GSC como primeiro dado real de backlink, e considerar uma chave gratuita da Moz para alcançar o Tier 1 em auditorias futuras.

## Camada de E-commerce / Afiliados

A divulgação de afiliados está bem implementada e consistente (texto inline "Link de afiliado", `rel="nofollow sponsored noopener"`, página de política editorial linkada). A lacuna conhecida de catalogação do cluster de comedouro (links `meli.la` não catalogados contra um catálogo de 15 entradas de produtos afiliados) é confirmada, mas intencionalmente **não corrigida mecanicamente** aqui, conforme a decisão de pausa já em vigor — deve ser resolvida como parte da reformulação de conteúdo (ver seção de SXO), não como tarefa técnica isolada. O schema `Offers`/preço é corretamente omitido em todo o site dado que não há mecanismo de sincronização de preço em tempo real.

## Dados de Campo do Google Search Console (janela de 90 dias, 13/07/2026 a 08/10/2026)

| Métrica | Valor |
|---|---|
| Cliques | 18 |
| Impressões | 1.340 |
| CTR | 1,34% |
| Posição média | 10,0 |

74 das 77 páginas enviadas registraram impressões; 67 queries distintas. Indexação confirmada saudável via Inspeção de URL (home + página de maior impressão, ambas "Enviada e indexada", canônico correspondente, sem problemas de cobertura) — consistente com a confirmação prévia de ~100% de indexação.

**Candidatos a zero-clique-apesar-de-visibilidade** (mesmo padrão dos 3 posts já corrigidos com reescrita de título/meta):
| Página | Impressões | Posição média | Cliques |
|---|---|---|---|
| /cerca-virtual-para-cachorro/ | 53 | 9,8 | 0 |
| /comedouro-automatico-para-dois-gatos/ | 46 | 7,1 | 0 |
| /soprador-para-pet/ | 44 | 8,4 | 0 |
| /como-limpar-comedouro-automatico/ | 35 | 5,8 | 0 |

Os dados reais de campo do CrUX ficaram indisponíveis neste ciclo (403 Forbidden, problema de habilitação de API — não um problema de volume de tráfego). O GA4 não está configurado (sem ID de propriedade).

---

## Notas de Metodologia
- Reaproveitamos dados estruturados locais existentes (`.data/site-index.json`, `.data/seo-audit.json`, `.data/content-strategy.json`, `.data/cannibalization.json`, `.data/internal-linking.json`) em vez de re-rastrear as 77 páginas do zero; buscas pontuais ao vivo (6-12 páginas por categoria) validaram e estenderam esses conjuntos de dados.
- 13 subagentes especialistas rodaram em paralelo: técnico, conteúdo, schema, sitemap, performance, visual, geo, agentic, sxo, dados de campo do Google, backlinks, e-commerce, cluster.
- Não existia baseline de drift antes desta auditoria; nenhuma foi capturada nesta rodada (fora do escopo — rodar `drift_baseline.py` separadamente se o acompanhamento contínuo de regressão for desejado).
- As evidências completas por categoria estão em `findings/*.md`; as capturas de tela estão em `screenshots/`.
