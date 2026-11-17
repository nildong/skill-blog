# Auditoria SEO Completa — smartpetgadgets.com.br
Data: 2026-11-17 | Tipo: publisher afiliado/review (pet gadgets, pt-BR), HTML estático na Hostinger, 80 URLs no sitemap (74 posts + 6 institucionais) | Auditoria anterior: 2026-11-06 (cópia em `archive/2026-11-06/`)

## Resumo Executivo

**SEO Health Score: 85/100** (igual a 11-06).

| Categoria | Peso | 11-17 | 11-06 |
|---|---|---|---|
| SEO Técnico | 22% | 93 | 95 |
| Qualidade de Conteúdo | 23% | 79 | 76 |
| SEO On-Page | 20% | 81 | 85* |
| Schema / Dados Estruturados | 10% | 86 | 85 |
| Performance (CWV) | 10% | 98 | 99 |
| Prontidão para Busca com IA | 10% | 75 | 73 |
| Imagens | 5% | 82 | 80 |

\* A nota on-page de 11-06 cobriu só 3 páginas; a de hoje cobre as 80 URLs e não é diretamente comparável.

Prontidão para IA = GEO 74 (citabilidade 87) + agentes 96, com peso maior para GEO.

**Leitura geral:** a parte técnica está madura (sem achado Crítico ou Alto em técnico, sitemap, performance e agentes). O que segura o site são três coisas:
1. **Posição média ~9.** As páginas ficam no fim da página 1, e é isso que derruba o CTR, não título ruim.
2. **Páginas do próprio site competindo entre si.** Os 8 hubs novos são bons, mas convivem com páginas antigas sobre a mesma busca (câmera, comedouro e bebedouro).
3. **Autoridade baixa.** Não há backlinks mensuráveis, o autor e a marca são fracos no schema e os hubs reescritos perderam as fontes externas.

### Dados do Google (28d: 18/10–14/11 contra 20/09–17/10)
- **Busca:** 63 cliques e 5.090 impressões, CTR 1,24% e posição 9,3. No período anterior: 29 cliques, 2.450 impressões, 1,18% e 10,1. Os cliques e as impressões dobraram e o CTR ficou estável.
- **Dispositivo:** o mobile tem 76% das impressões, na posição 7,0. O desktop está na posição 16,6, na página 2.
- **Concentração:** `/configurar-app-comedouro-wifi/` faz 22 dos 63 cliques (CTR 4,1%). 25 páginas estão nas posições 4 a 20, com 30 impressões ou mais e 0 cliques.
- **Origem das visitas (GA4, 27/10–16/11):** cerca de 177 sessões. Orgânico 61 (era 17), Direct 61, ChatGPT/Gemini 30, Social 25.
- **Cliques de afiliado:** 18 eventos `affiliate_click`. Dez vieram do ChatGPT (~34% das sessões dele), contra 2 do Google (~3%).
- **Indexação:** as páginas inspecionadas estão indexadas e o sitemap tem 80 URLs, sem erros. As duas de ração e `/brinquedo-interativo-automatico-para-gato/` ainda não foram recrawladas depois da mudança.
- **Dados de campo:** o CrUX não tem dados, por tráfego baixo (esperado).

### Top 5 problemas
1. **[Alta] Canibalização no cluster câmera.** `camera-para-monitorar-pet` e `melhor-camera-para-monitorar-pet` dividem 9–10 dos 10 resultados da busca. A money page tem 386–648 palavras, nenhum preço e resume um único listicle (mybest).
2. **[Alta] Três rankings de comedouro com vencedores diferentes.** O hub elege a Newpet 4L, `melhor-comedouro-automatico-cachorro` a VDRBG, e há dois rankings antigos com preços de outubro. `melhor-comedouro-automatico-cachorro` caiu da posição 9,8 para 22,8.
3. **[Alta] Hubs reescritos perderam as fontes externas.** O comedouro foi de 2 para 0 e a câmera com petisco de 1 para 0. As rações, que fazem afirmações de saúde, não citam nenhuma fonte. 11 posts estão sem link externo.
4. **[Alta] Busca "Credeli ou Simparic/NexGard" sem página que atenda.** As buscas estão na posição ~30. O topo é de comparações diretas, e o antipulgas é um Top-6 sem comparação na mesma faixa de peso. Também falta o alerta FDA/CVM sobre isoxazolinas.
5. **[Alta] Autoridade off-page não mensurável e provavelmente baixa.** O domínio não aparece no Common Crawl e não há chave Moz/Bing. O Person e a Organization não têm `@id` nem foto, e o `sameAs` está incompleto.

### Top 5 quick wins
1. **`/bebedouro-inox-x-ceramica/` (512 impr., pos. 6,3, 6 cliques):**
   - Título com "fonte" e "gato": "Fonte para Gato: Inox, Cerâmica ou Plástico? O Mais Higiênico".
   - Caixa levando ao ranking de bebedouros.
   - Corrigir o hero: `srcset` 400/800/1200w, `fetchpriority="high"` e preload. O LCP mobile voltou para 2,7 s.
2. **`/comedouro-automatico-para-dois-gatos/` (194 impr., pos. 6,2):** título "Comedouro Automático para 2 Gatos: Duplo ou com Chip RFID?" e uma tabela de 3 soluções.
3. **Atributo `rel` dos links de afiliado:** `sponsored nofollow` nos 6 links da Seresto e `nofollow` nos 3 de `cachorro-de-casa-pega-pulga`. Incluir `affiliate-cta.js` em `/comedouro-newpet-4l-review/`.
4. **Pedido de indexação no GSC e IndexNow:** pedir indexação de brinquedo-gato e das duas rações, e enviar ao IndexNow as URLs alteradas entre 12 e 16/11.
5. **Commit:** fazer o commit do `sitemap.xml` (já no ar) e de `img/logo-dark.png`, para o próximo deploy não reverter nada.

---

## SEO Técnico — 93/100
**O que funciona:**
- As 80 URLs respondem 200, com canonical autorreferente, sem noindex, com viewport e GA4.
- Não há títulos ou metas duplicados.
- `/cluster-comedouro-automatico-pet/` e `/reports/` respondem 410, e `.htaccess` nega `.md`, `.json`, `.git` e `/pins/`.
- HSTS, nosniff, X-Frame-Options e Referrer-Policy estão ativos.

| Sev. | Achado | Correção |
|---|---|---|
| Média | 9 links de afiliado com `rel` incompleto (6 Seresto sem `sponsored`, 3 em `cachorro-de-casa-pega-pulga` sem `nofollow`) | `rel="sponsored nofollow noopener"` |
| Média | `/comedouro-newpet-4l-review/` tem afiliado mas não carrega `affiliate-cta.js` | Incluir a tag; as outras 3 páginas apontadas em 11-06 já foram corrigidas |
| Baixa | Deploy não reproduzível: `sitemap.xml` modificado e sem commit, `img/logo-dark.png` no ar mas fora do git | Commit |
| Baixa | http://www faz 2 saltos de redirect, `/index.html` responde 200, a página 404 é genérica e em inglês, e falta Permissions-Policy | Ajustar o `.htaccess` (pendente desde 11-06) |
| Baixa | Metas e títulos fora da faixa em `/contato/`, `/sobre/`, a página do autor e as duas "erros-comuns" | Ajuste pontual |
| Info | Não há evidência de ping no IndexNow para as URLs de 12–16/11 | Enviar |

Detalhes: `findings/technical.md`

## Qualidade de Conteúdo — 79/100
**O que funciona:**
- **8 hubs reescritos como rankings** (2.600–3.600 palavras). Cada um abre com o produto escolhido e o preço datado, e tem as seções "Não testamos" e "Como Escolhemos".
- **Botões de afiliado:** os CTAs nomeiam o produto.
- **Corrigido desde 11-06:**
  - o ANXK G68 deixou de ser chamado de melhor coleira para gato;
  - a câmera com petisco ganhou a seção de ansiedade;
  - a Seresto cita 5 fontes fortes.

| Sev. | Achado | Correção |
|---|---|---|
| Alta | Os hubs novos competem com posts finos que cobrem a mesma busca: câmera (3 páginas para "melhor câmera pet"), comedouro (3 rankings com vencedores diferentes), brinquedo (gato idoso, pilha x recarregável) | Juntar com 301 ou mudar o ângulo. O merge dos comedouros precisa do seu OK, porque o cluster está pausado |
| Alta | `melhor-camera-para-monitorar-pet` tem 386 palavras, nenhum preço nem método e é a versão de um único listicle | Reconstruir no formato de ranking (7 modelos: C500, iM4 C, eufy C220, Ezviz…) e juntar os posts finos |
| Alta | Fontes externas perdidas nos hubs. As rações, um tema de saúde, não têm fonte | Recolocar 2–4 fontes por hub (fabricante, WSAVA/AAFCO nas rações) |
| Média | O antipulgas recomenda 4 isoxazolinas sem o alerta FDA/CVM (tremores e convulsões) | Caixa de alerta com fonte e um "consulte o veterinário" visível |
| Média | 29 posts com menos de 450 palavras, intocados desde 22/08, com 2 CTAs genéricos e barra fixa. O monitor de preços achou 7 links de afiliado mortos e variação de até 22% nos rankings antigos de comedouro | Trocar os links mortos, juntar ou ampliar os finos que têm impressão |
| Média | E-E-A-T 63: o autor não tem foto nem perfis, e não há evidência de uso próprio | Foto, bio e perfis do autor. Fotos próprias quando houver produto em mãos |

Detalhes: `findings/content.md`

## SEO On-Page — 81/100
- Títulos, metas, H1 e canonicals estão limpos. Não há metadados em template (`site_risk: low`).
- Guias e posts finos usam "Melhor" no título e disputam a busca com o ranking do próprio cluster.
- Money pages com poucos links internos de entrada:
  - rações: 2 links cada;
  - câmera com petisco: 4;
  - antipulgas: 4.

  Para comparar, os guias antigos recebem 10–21.
- 18 páginas recebem menos de 3 links internos (eram 17). `comedouro-automatico-para-viagem` está na posição 6,1 com só 2. `camera-pet-cachorro-ansiedade-separacao` é um beco sem saída.
- O CTR por página e por busca está em `reports/ctr-diagnostico-2026-11-17.md`. A reescrita P1 de 05/11 mostra sinal inicial: o CTR foi de 0,28% para 1,21% na mesma posição.

Detalhes: `findings/cluster.md` (tabela com 49 links internos sugeridos), `findings/sxo.md`

## Schema / Dados Estruturados — 86/100
**O que funciona:**
- 0 erros de parse e BreadcrumbList em todos os posts.
- `mainEntityOfPage` é igual ao canonical.
- As 347 perguntas do FAQ batem com o texto visível.
- Os Products foram de 29 para 63, com 34 Offers completos nos 6 rankings. Isso explica os 79 PRODUCT_SNIPPETS no GSC, que estão na posição 18 e ainda com 0 cliques.

| Sev. | Achado | Correção |
|---|---|---|
| Média | Os 34 Offers têm `price` fixo sem `priceValidUntil`. Se o preço mudar, o markup diverge da página | O price-monitor passa a sinalizar divergência entre JSON-LD e anúncio (só relatório) |
| Média | Nenhuma Organization, WebSite ou Person tem `@id`. Os 75 Person não têm `image` nem `sameAs` | Ajuste de template com a foto do autor |
| Baixa | 10 Products sem `image` (tapete 7, `melhor-comedouro-automatico-cachorro` 3) e 33 sem `brand` | Completar onde a marca for verificável |
| Baixa | `dateModified` divergente em `cachorro-de-casa-pega-pulga` e `comedouro-automatico-vale-a-pena`. Há um `worstRating` "1" em `comedouro-newpet-2l-review` | Ajuste pontual |
| Info | Faltam `hasMerchantReturnPolicy` e `shippingDetails`: decisão mantida (afiliado). O FAQPage não gera rich result desde 07/05/2026 | — |

Detalhes: `findings/schema.md`

## Performance (CWV) — 98/100
- **Lab mobile:** 8 de 9 páginas têm LCP de 0,8–1,7 s, TBT de 0–70 ms e CLS ≈ 0.
- **Desktop:** nota 98,9.
- **Regressão (Média):** `/bebedouro-inox-x-ceramica/` está com LCP mobile de 2,7 s (era 1,2 s). O hero usa só o WebP de 1200w e há os arquivos de 400 e 800w sem uso. Faltam `fetchpriority` e preload. A correção é copiar o padrão de `/melhor-bebedouro-automatico-pet/`.
- **Scripts:** `affiliate-cta.js` não piora o CLS nem o TBT. O gtag é a maior tarefa na main thread (274 ms no inox), um teto e não um problema hoje.
- **Dados de campo:** o CrUX tem 404 por tráfego baixo.

Detalhes: `findings/performance.md`

## Imagens — 82/100
- Nas 9 páginas medidas, nenhuma imagem está sem `alt` ou sem dimensões, e nenhuma passa de 150 KB.
- **Pendências:**
  - fotos de produto do inox servidas em JPG, com o WebP já gerado ao lado (AGBE: 47 KB, contra 25 KB);
  - 7 JPG sem WebP em `coleira-gps-para-gato`;
  - sem `fetchpriority` no hero de `configurar-app-comedouro-wifi`;
  - os 6 arquivos acima de 200 KB em posts antigos (de 11-06) não foram reverificados.

Detalhes: `findings/images.md`

## Prontidão para Busca com IA — 75/100 (GEO 74, citabilidade 87, agentes 96)
- **Os 7 rankings novos são bem citáveis:** abrem com o produto escolhido, números e preço datado, têm 8–9 tabelas e a seção de método. A reescrita da coleira de gato não fez a página perder o ChatGPT.
- **Robôs de busca de IA:** o robots.txt libera os robôs de busca do ChatGPT, Claude e Perplexity. O GPTBot e o meta-externalagent recebem 429, o que só afeta treino.
- **Arquivos para agentes:** o `llms.txt` tem 80 URLs, iguais às do sitemap, e só a descrição de `configurar-app-comedouro-wifi` está desatualizada. O Lighthouse Agentic Browsing dá 3/3 na home e nos rankings.

| Sev. | Achado | Correção |
|---|---|---|
| Alta | O tapete higiênico (a página que mais converte pelo ChatGPT) tem preços de 23/10, não tem seção de método e cita 6 fontes como "retrieved" | Preço de novembro, seção de método e "consultado em" |
| Alta | Duas páginas que a IA já visita estão no formato antigo: `melhor-camera-para-monitorar-pet` e `melhor-comedouro-automatico-cachorro`. Esta abre sem vencedor e contradiz o hub | Ver os itens de canibalização |
| Alta | Entidade fraca: sem `@id`, sem foto do autor, o Pinterest não está no `sameAs`, o YouTube dá 404 e não há Wikidata | Template e perfis |
| Alta | `coleira-gps-sem-mensalidade` e porta eletrônica estão sem nenhum produto | Depende da sua escolha de produtos |
| Média | 102 citações "retrieved" em inglês em 51 páginas. Há divergência entre `lastmod` e `dateModified` em 63 URLs | Troca em lote. Não mexer no `lastmod` quando a mudança for só de template |
| P2 | O robots.txt dá `Allow: /` aos robôs de treino, mas o sinal é `ai-train=no` | Decisão sua: `Disallow` só nos tokens de treino, se a intenção é não treinar |

Detalhes: `findings/geo.md`, `findings/agentic.md`

## Experiência de Busca (SXO) — 70/100 (era 66)
As buscas foram feitas de verdade pelo WebSearch, mas AI Overview, Shopping, anúncios e "Perguntas relacionadas" **não foram vistos**, então o efeito deles no CTR é hipótese.

| Página | Sev. | Problema | Recomendação |
|---|---|---|---|
| Antipulgas: "Credeli ou Simparic" | Crítica | O topo é de comparações diretas | Nova URL `/credeli-ou-simparic/`, tabela na mesma faixa de peso, dados da bula, revisor com CRMV |
| Par de câmeras | Crítica | O topo é de listas com C500, iM4 C, eufy C220 e Ezviz | Juntar em um ranking de 7 modelos e redirecionar a outra |
| Comedouro para dois gatos | Alta | ~80% dos resultados são lojas ou páginas de produto. A página é um guia de comportamento com 1 produto | Novo título e tabela de 3 soluções |
| Bebedouro inox x cerâmica | Alta | O título não tem "fonte" nem "gato" | Novo título e caixa levando ao ranking |
| Ração para cachorro | Média | Faltam marcas de consenso (Golden/Premier, Biofresh, Gran Plus, Hill's, Purina) | Depois de 01/12 |
| Coleira GPS para gato | Alinhada | O Tractive tem 5 páginas de produto no SERP e 0 menções na página | Caixa e FAQ do Tractive, só no corpo |
| Bebedouro ranking e comedouro hub | Alinhadas | — | Só medir até 01/12 |

Detalhes: `findings/sxo.md`

## Visual / Mobile — 82/100
- Não há overflow horizontal e o modo escuro está OK. O menu da home não corta mais o 4º item.
- **[Média, piorou]** No mobile, o botão de afiliado fica em y≈1.130 e a caixa de picks em ≈1.300, com a dobra em 812. A causa é o H1 de 4 linhas, o hero e o bloco de meta.
- **[Média]** A barra fixa mobile não aparece na ração. Nas outras páginas ela some depois de ~6.000 px, em páginas de 27–33 mil px.
- **[Baixa]**
  - "×" da barra com 29x34 px;
  - botão de tema cobrindo o texto;
  - 24–42 tap targets abaixo de 44 px por página;
  - texto do artigo em 14,4 px.

Detalhes: `findings/visual.md`, capturas em `screenshots/`

## Backlinks — sem dados suficientes
- O domínio não está no grafo do Common Crawl, e não há chave Moz, Bing ou Keywords Everywhere.
- Inferência (Alta): falta autoridade para levar as páginas das posições 6–10 ao top 5.
- **Próximo passo:** exportar o relatório "Links" do GSC e criar uma chave gratuita da Moz.

Detalhes: `findings/backlinks.md`

## Limitações
- Os SERPs não foram vistos com recursos especiais. Não há DataForSEO para citações reais em IA. O WAF não foi testado com user agents de agentes, por falta de autorização.
- O ledger de atualizações do Google está desatualizado (50 dias). Nenhuma variação foi atribuída a core updates.
- Janela de medição: as páginas alteradas depois de 05/11 não devem ser reescritas antes de ~01/12.
