# Social Content Engine — Calibração V2 #2 (amostra diversificada, 10 artigos novos)

Gerado em: 2026-09-01

**Status:** segunda calibração autorizada explicitamente, antes de decidir sobre a escala para os ~62 artigos restantes. Nenhum HTML, imagem, link de afiliado ou sitemap foi alterado. Nenhuma publicação, fila editorial, commit, push ou deploy. **Não aplicado aos ~62 artigos restantes.**

## Veredito objetivo

# ✅ APTO PARA ESCALA

Com uma ressalva registrada abaixo (não bloqueante): 2 bugs de infraestrutura foram encontrados e corrigidos durante esta calibração — nenhum dos dois é específico desta amostra, ambos beneficiam retroativamente o piloto 1 também. Isso é o resultado esperado e desejado de uma calibração mais ampla: expor arestas antes da escala, não confirmar que não existem.

## Por que a amostra é diferente desta vez

10 artigos **não usados no piloto 1**, escolhidos para atacar os pontos de risco pedidos:

| Slug | Role | Cluster | Palavras |
|---|---|---|---|
| porta-eletronica-x-alcapao-tradicional | COMPARISON | porta-eletronica-automatica-para-pet | 397 |
| brinquedo-interativo-pilha-x-recarregavel | COMPARISON | brinquedo-interativo-automatico-para-gato | 361 (mais curto da amostra) |
| duvidas-coleira-gps-pet | FAQ | coleira-gps-para-pet | 700 |
| duvidas-brinquedo-interativo-gato | FAQ | brinquedo-interativo-automatico-para-gato | 470 |
| cat-mate-c500-review | REVIEW | null | 1604 |
| brinquedo-interativo-gato-idoso-vale-a-pena | SATELLITE (estilo review) | brinquedo-interativo-automatico-para-gato | 393 |
| como-instalar-porta-eletronica-pet | HOW_TO | porta-eletronica-automatica-para-pet | 490 |
| como-funciona-coleira-gps-cachorro | HOW_TO | coleira-gps-para-pet | 677 |
| soprador-pet | atípico (role FAQ na tag, mas conteúdo é REVIEW) | null | 1647 |
| cerca-virtual-para-cachorro | atípico/informacional, sem FAQ, sem par comparativo no título | null | 625 |

**Zero artigos do cluster comedouros** (que dominou 8/10 do piloto 1). Distribuição de cluster: porta-eletronica (2), brinquedo-interativo (3), coleira-gps (2), sem cluster (3).

## Diferença metodológica desta calibração

No piloto 1, a seleção de Carrossel/Stories/Engagement foi feita por mim (Claude), artigo por artigo, como decisão editorial documentada em `format-selection-v2.js`. Nesta calibração 2, **removi essa curadoria prévia**: Carrossel, Stories e Engagement foram sempre tentados para os 10 artigos, e o próprio pipeline (threshold de 6 slides do V1, presença de heading-pergunta real, padrão de par comparativo no título) decidiu sozinho se cada peça vira `generated` ou `insufficient_source`. Isso testa diretamente a pergunta do usuário: **"o engine sabe dizer sozinho que não há material suficiente?"** — sem minha curadoria por cima.

Reel e Post continuam exigindo autoria editorial (leitura humana/Claude do fato mais forte) — isso não mudou e é uma limitação de escopo conhecida, não um bug.

## Resultado

| Métrica | Resultado |
|---|---|
| Artigos analisados | 10 |
| Peças tentadas (Reel+Post sempre; Carrossel+2 Stories+Engagement sempre tentados) | 60 |
| Peças geradas e aprovadas no gate V2 | **48** |
| Peças bloqueadas (`insufficient_source`, decisão automática do pipeline) | **12** |
| Peças em `needs_review` (falharam gate) | **0** |
| Rastreabilidade (`source_excerpt` literal verificado) | 48/48 |
| `npm test` | **68/68** (67 anteriores + 1 novo teste de regressão) |
| `htmlUnchanged` / `affiliateUnchanged` | true / true |

## Visão por artigo (o que o pipeline decidiu sozinho)

| Artigo | Reel | Post | Carrossel | Stories (enquete) | Stories (CTA) | Engagement |
|---|---|---|---|---|---|---|
| porta-eletronica-x-alcapao-tradicional | ✅ | ✅ | ✅ | 🚫 sem pergunta real | ✅ | ✅ (par comparativo do título) |
| brinquedo-interativo-pilha-x-recarregavel | ✅ | ✅ | ✅ | 🚫 sem pergunta real | ✅ | ✅ (par comparativo) |
| duvidas-coleira-gps-pet | ✅ | ✅ | 🚫 abaixo do mínimo de slides | ✅ | ✅ | ✅ (FAQ real) |
| duvidas-brinquedo-interativo-gato | ✅ | ✅ | 🚫 abaixo do mínimo de slides | ✅ | ✅ | ✅ (FAQ real) |
| cat-mate-c500-review | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| brinquedo-interativo-gato-idoso-vale-a-pena | ✅ | ✅ | ✅ | 🚫 sem pergunta real | ✅ | 🚫 sem FAQ nem par comparativo |
| como-instalar-porta-eletronica-pet | ✅ | ✅ | ✅ | 🚫 sem pergunta real | ✅ | 🚫 sem FAQ nem par comparativo |
| como-funciona-coleira-gps-cachorro | ✅ | ✅ | ✅ | 🚫 sem pergunta real | ✅ | 🚫 sem FAQ nem par comparativo |
| soprador-pet | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| cerca-virtual-para-cachorro | ✅ | ✅ | ✅ | 🚫 sem pergunta real | ✅ | 🚫 sem FAQ nem par comparativo |

**Leitura do padrão:** os 2 artigos com FAQ real e denso (`duvidas-coleira-gps-pet`, `duvidas-brinquedo-interativo-gato`) tiveram Carrossel bloqueado — o conteúdo de FAQ, mesmo rico em perguntas, não produz headings tópicos suficientes fora da estrutura de pergunta/resposta para sustentar 6 slides sem repetir. Já os 2 artigos mais longos e ricos (`cat-mate-c500-review`, `soprador-pet`) geraram os 6/6. Os 3 artigos sem FAQ nem título comparativo (`como-instalar-porta-eletronica-pet`, `como-funciona-coleira-gps-cachorro`, `cerca-virtual-para-cachorro`) tiveram Engagement bloqueado corretamente — não existe pergunta real nem par "A x B" pra sustentar. **O pipeline generalizou corretamente para tipos de artigo nunca vistos no piloto 1**, sem eu precisar pré-configurar nada por artigo.

## Achados técnicos (2 bugs reais, corrigidos nesta etapa)

### 1. Falso positivo no detector de placeholder
`PLACEHOLDER_RE` original (`quality-gate.js`, usado por V1 e V2) testava `/TODO|TBD|XXX/i` — o modificador `/i` (case-insensitive) se aplica à expressão inteira, não a um grupo isolado, então "TODO" batia como falso positivo contra a palavra portuguesa comum **"todo"** ("brinquedo todo dia", "programada o dia todo"). Isso reprovou incorretamente 2 peças nesta calibração (`brinquedo-interativo-pilha-x-recarregavel` post e reel do `cat-mate-c500-review`) antes da correção.

**Corrigido:** `TODO|TBD|XXX` agora são verificados em regex separado, case-sensitive; os padrões `lorem ipsum`/`{{...}}`/`[insira`/`[preencher` continuam case-insensitive. Teste de regressão adicionado em `test/quality-gate.test.js`. Esse bug já existia desde a V1 original (`content-templates.js`/`quality-gate.js` nunca foram alterados nesse ponto) — só não tinha sido detectado porque o piloto 1 não continha a palavra "todo" nos campos verificados. **Retroativamente relevante para os 76 do piloto 1**, embora não tenha causado falha lá.

### 2. Excerpt de carrossel curto demais para ser prova de rastreabilidade
`buildCarouselV2` usava sempre o heading do slide "Problema" como `source_excerpt` — em `brinquedo-interativo-pilha-x-recarregavel`, esse heading é só "Pilha Comum" (11 caracteres), abaixo do mínimo de 15 caracteres exigido pelo próprio gate V2 para considerar um excerpt substancial.

**Corrigido:** nova função `pickCarouselAnchorExcerpt()` cai para o próximo heading mais longo do carrossel e, por fim, para o H1 real do artigo, garantindo um excerpt sempre substancial.

Ambos os bugs foram pegos pelo próprio gate — nenhuma peça ruim passou silenciosamente. Depois da correção: **48/48 aprovadas, 0 em needs_review.**

## Qualidade editorial (avaliação qualitativa, os 10 pares Reel+Post)

Todos os 20 Reels/Posts desta calibração seguem o mesmo padrão validado na calibração 1: gancho vem de um fato específico do corpo do artigo (nunca de um heading genérico), nunca repete a fórmula "Você sabia? [heading]...". Exemplos de fatos usados que não estavam em nenhum heading: taxa de reciclagem de pilhas no Brasil (2%), margem de erro do GPS por satélite (5m), tempo de atualização da coleira em modo economia (até 10 min), "estresse de bigode" em gatos de face larga no Cat Mate C500, comportamento territorial felino noturno na cerca virtual.

## Repetição entre artigos semelhantes (item pedido: "as peças ficam realmente diferentes?")

4 pares de artigos tiveram `similarity_warning`:

| Par | Overlap | Espaçamento recomendado |
|---|---|---|
| brinquedo-interativo-pilha-x-recarregavel ↔ brinquedo-interativo-gato-idoso-vale-a-pena | 0.70 | 21 dias |
| duvidas-brinquedo-interativo-gato ↔ brinquedo-interativo-gato-idoso-vale-a-pena | 0.70 | 21 dias |
| porta-eletronica-x-alcapao-tradicional ↔ como-instalar-porta-eletronica-pet | 0.61 | 14 dias |
| brinquedo-interativo-pilha-x-recarregavel ↔ duvidas-brinquedo-interativo-gato | 0.60 | 14 dias |

Verificação manual dos ganchos de Reel desses 4 pares: **nenhum par tem gancho, ideia ou ângulo repetido** — ex. "Só 2% das pilhas comuns são recicladas no Brasil" (bateria) vs. "Seu gato idoso não brinca mais? Pode não ser só idade" (comportamento) tratam do mesmo cluster mas de ângulos completamente distintos. A regra de espaçamento (item 3, já implementada) está sendo aplicada corretamente aos 4 pares.

## Distribuição (item pedido: "não privilegiar reviews/afiliados")

Nenhum dos 10 artigos desta amostra tem produto afiliado mapeado no cluster (`affiliate_products: []` em todos) — mesmo assim, o pipeline gerou 48/60 peças normalmente, provando que a geração V2 **não depende de afiliado mapeado** para funcionar bem. Distribuição de peças geradas por role: COMPARISON 10/12, FAQ 10/12, REVIEW 6/6, SATELLITE-review 4/6, HOW_TO 8/12, atípico 10/12 — sem concentração desproporcional em nenhum tipo.

## Comparação com as etapas anteriores

| Etapa | Peças tentadas | Geradas | Bloqueadas | Falhas | Rastreabilidade |
|---|---|---|---|---|---|
| Calibração 1 (6 peças, 3 artigos) | 6 | 6 | 0 | 0 | 6/6 |
| Piloto V2 completo (52 peças, 10 artigos originais) | 52 | 52 | 0 | 0 | 52/52 |
| **Calibração 2 (60 peças, 10 artigos novos e diversos)** | 60 | 48 | 12 | 0 (após correção) | 48/48 |

A taxa de bloqueio subiu de 0% para 20% — **esperado e saudável**: a amostra 2 tem artigos genuinamente mais curtos e com menos FAQ real, e o pipeline reagiu corretamente reduzindo a cobertura em vez de forçar peças fracas.

## Garantias mantidas

- `htmlUnchanged: true`, `affiliateUnchanged: true`.
- Nenhum arquivo `.data/social-content/{slug}.json` sobrescrito.
- Nenhuma publicação, fila editorial, commit, push ou deploy.
- `npm test`: 68/68.

## Conclusão e critérios avaliados

| Critério pedido | Resultado |
|---|---|
| Gancho nasce do artigo, não é resumo | ✅ confirmado nos 20 Reels/Posts |
| 100% dos `source_excerpt` continuam literais | ✅ 48/48 |
| Algum tipo de artigo apresenta problema sistemático | ❌ não — os bloqueios seguem lógica coerente por tipo de conteúdo, não por bug |
| Engine sabe dizer "não há material suficiente" | ✅ 12/60 bloqueios automáticos, todos justificados |
| Exclusões coerentes (nem demais, nem de menos) | ✅ padrão observado bate com a natureza de cada artigo |
| Peças de artigos semelhantes ficam diferentes | ✅ verificado manualmente nos 4 pares com similarity_warning |
| Espaçamento aplicado corretamente | ✅ 4/4 pares com recomendação de 14 ou 21 dias |
| Sem privilégio de reviews/afiliados | ✅ nenhum artigo desta amostra tem afiliado mapeado, geração funcionou normalmente |

## ✅ APTO PARA ESCALA — com 1 ressalva de processo

Recomendo prosseguir para os ~62 artigos restantes, mas mantendo:
1. Amostragem humana (spot-check) de ~10-15% das peças geradas na escala, não confiar 100% no gate sozinho — os 2 bugs desta calibração mostram que o gate pega problemas graves, mas vale revisão humana leve por amostragem.
2. Reel/Post continuam exigindo minha leitura e autoria por artigo (não há automação total desse passo) — ao escalar para 62 artigos, isso significa ~62 iterações de leitura+escrita, não uma execução instantânea de script.
3. Facebook/Instagram continua fora de escopo — conforme combinado, essa etapa só entrega conteúdo validado, não publica.

## Próximo passo

Aguardando sua validação deste relatório antes de iniciar a escala para os ~62 artigos restantes.
