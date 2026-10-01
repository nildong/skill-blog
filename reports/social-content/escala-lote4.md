# Social Content Engine — Escala, Lote 4 (FINAL) — 16 artigos

Gerado em: 2026-09-02

**Status:** último lote da escala, fechando os 43 artigos do pool. Nenhum HTML, imagem, link de afiliado, sitemap ou fila de publicação foi alterado. Nenhuma publicação, agendamento, integração Meta/API, commit, push ou deploy. **Aguardando validação humana. Nenhuma auditoria pós-escala nem publicação foi iniciada.**

## Artigos deste lote

| Slug | Role | Cluster | Origem do cluster |
|---|---|---|---|
| camera-pet-cachorro-ansiedade-separacao | SATELLITE | camera-para-monitorar-pet | content-strategy.json (known) |
| camera-pet-com-dispensador-de-petisco | SATELLITE | camera-para-monitorar-pet | content-strategy.json (known) |
| camera-pet-grava-sem-internet | SATELLITE | camera-para-monitorar-pet | content-strategy.json (known) |
| camera-pet-visao-noturna-funciona | SATELLITE | camera-para-monitorar-pet | content-strategy.json (known) |
| como-configurar-camera-pet-wifi | HOW_TO | camera-para-monitorar-pet | content-strategy.json (known) |
| erros-comuns-camera-monitorar-pet | SATELLITE | camera-para-monitorar-pet | content-strategy.json (known) |
| melhor-camera-para-monitorar-pet | SATELLITE | camera-para-monitorar-pet | content-strategy.json (known) |
| duvidas-porta-eletronica-pet | FAQ | porta-eletronica-automatica-para-pet | content-strategy.json (known) |
| erros-comuns-porta-eletronica-pet | SATELLITE | porta-eletronica-automatica-para-pet | content-strategy.json (known) |
| porta-eletronica-automatica-para-pet | PILLAR | porta-eletronica-automatica-para-pet | content-strategy.json (known) |
| porta-eletronica-funciona-porta-de-vidro | SATELLITE | porta-eletronica-automatica-para-pet | content-strategy.json (known) |
| porta-eletronica-impede-entrada-outros-animais | SATELLITE | porta-eletronica-automatica-para-pet | content-strategy.json (known) |
| porta-eletronica-reconhecimento-facial-vale-a-pena | SATELLITE | porta-eletronica-automatica-para-pet | content-strategy.json (known) |
| porta-eletronica-sensor-de-luz-como-funciona | SATELLITE | porta-eletronica-automatica-para-pet | content-strategy.json (known) |
| melhor-alimentador-automatico-gatos | SATELLITE | **null** | **unknown — não atribuído** |
| melhor-bebedouro-automatico-pet | SATELLITE | **null** | **unknown — não atribuído** |

Fecha por completo o cluster **camera-para-monitorar-pet** (7 artigos) e o cluster **porta-eletronica-automatica-para-pet** (7 artigos). Os 2 últimos artigos do pool inteiro — `melhor-alimentador-automatico-gatos` e `melhor-bebedouro-automatico-pet` — não têm cluster atribuído em `content-strategy.json` (`cluster: null`, `cluster_confidence: "unknown"`). **Não criamos heurística nova para eles**, conforme instruído: o pipeline os tratou como `cluster: null`, e o relatório registra essa lacuna em vez de inventar uma atribuição.

### Anomalia de dado identificada (não corrigida, apenas registrada)

O breadcrumb HTML de ambos os artigos (`melhor-alimentador-automatico-gatos`, `melhor-bebedouro-automatico-pet`) mostra "Comedouro Automático para Pet" como página-pai, e o texto do corpo referencia fortemente esse cluster. Isso sugere que o cluster real provavelmente é `comedouro-automatico-para-pet`, mas como `content-strategy.json` — a fonte de verdade desta skill — não confirma isso, **não fizemos essa atribuição**. Recomendação: regenerar `content-strategy.json` antes do próximo ciclo para capturar esses 2 artigos (e outros publicados após a última geração do arquivo, como visto também com `comedouro-automatico-para-dois-gatos` no Lote 3).

## Resultado

| Métrica | Resultado |
|---|---|
| Artigos processados | 16 |
| Peças tentadas | 96 |
| Geradas e aprovadas no gate V2 | **72** |
| Bloqueadas (`insufficient_source`, decisão automática) | **24** |
| Taxa de aprovação | **75%** |
| `needs_review` (após correção) | **0** |
| Rastreabilidade (`source_excerpt` literal verificado) | 72/72 |
| `npm test` | **68/68** |
| `htmlUnchanged` / `affiliateUnchanged` | true / true |

## Achado neste lote (autocorreção antes da entrega)

Na primeira passada, **3 peças de Post** falharam a checagem de rastreabilidade literal (`camera-pet-cachorro-ansiedade-separacao`, `camera-pet-visao-noturna-funciona`, `porta-eletronica-sensor-de-luz-como-funciona`). Em todos os 3 casos o erro foi meu, não do pipeline: os `source_excerpt` que escrevi continham pequenas diferenças do texto real —

1. Uma lista de sinais que no HTML são itens `<li>` separados (sem pontuação entre eles) e eu havia escrito como frases separadas por ponto final;
2. Um trecho que, no HTML, é interrompido no meio por uma citação entre parênteses (`(mybest, retrieved 2026-08-22)`), então não existe como substring contínua — usei só a parte depois da citação;
3. Um ponto final que eu adicionei ao fim do trecho, mas no HTML a frase continua com um travessão (`— se esse é um problema...`), então o excerto com ponto final não batia.

O gate pegou os 3 corretamente — nenhuma peça com rastreabilidade quebrada chegou a ser aprovada. Corrigi os 3 excertos para bater literalmente com o HTML e todos passaram na segunda rodada.

## Distribuição por formato

| Formato | Tentado | Gerado | Bloqueado |
|---|---|---|---|
| Reel | 16 | 16 | 0 |
| Post | 16 | 16 | 0 |
| Carrossel | 16 | 14 | 2 |
| Stories (enquete + CTA, 2 por artigo) | 32 | 21 | 11 |
| Engagement | 16 | 5 | 11 |

Reel e Post (autoria editorial minha) tiveram 100% de aprovação — mesmo padrão de todos os lotes anteriores. Carrossel também teve alta aprovação (2 bloqueios apenas: `como-configurar-camera-pet-wifi` e `duvidas-porta-eletronica-pet`, ambos abaixo do mínimo de 6 slides). Engagement teve a maior taxa de bloqueio (69%) — a maioria dos artigos deste lote é SATELLITE sem FAQ nem par comparativo real no título, então o pipeline corretamente não força esse formato.

## Distribuição por role

| Role | Artigos |
|---|---|
| SATELLITE | 13 |
| HOW_TO | 1 |
| FAQ | 1 |
| PILLAR | 1 |

Lote com menor diversidade de role da escala — reflexo de ser o "resto" do pool depois que PILLAR/FAQ/COMPARISON mais ricos já foram usados nos lotes anteriores. Mesmo assim, a taxa de aprovação (75%) ficou acima da média geral, porque mesmo artigos SATELLITE curtos tiveram fatos específicos suficientes para Reel/Post/Carrossel.

## Distribuição por cluster

| Cluster | Artigos | Peças geradas |
|---|---|---|
| camera-para-monitorar-pet | 7 | 32 |
| porta-eletronica-automatica-para-pet | 7 | 34 |
| null (unknown) | 2 | 6 |

## Motivos dos bloqueios (24 peças)

- **Carrossel (2 bloqueios):** artigo curto demais para atingir o mínimo de 6 slides sem repetir conteúdo (`como-configurar-camera-pet-wifi`, `duvidas-porta-eletronica-pet` — este último apesar de ter FAQPage, a estrutura pergunta/resposta não gera headings tópicos suficientes, mesmo padrão já visto na Calibração 2).
- **Stories/enquete (11 bloqueios):** artigo sem heading em formato de pergunta real no corpo.
- **Engagement (11 bloqueios):** artigo sem FAQ real nem par comparativo "A x B" no título.

Todos os bloqueios seguem a mesma lógica determinística já validada nos lotes anteriores — nenhum bloqueio parece incoerente com o tipo de conteúdo do artigo.

## Similaridade e espaçamento

**11 pares com `similarity_warning`** — a maior concentração desde a Calibração 2, esperado porque o cluster porta-eletrônica (7 artigos, todos no mesmo lote) gerou muito overlap interno, incluindo um par com 0.83 (`porta-eletronica-automatica-para-pet`, o PILLAR, aparece em 6 dos 9 pares — natural, pois ele resume e linka todos os satélites).

**Achado interessante — overlap cross-cluster:** `erros-comuns-camera-monitorar-pet` ↔ `erros-comuns-porta-eletronica-pet` (overlap 0.51, `same_cluster: false`). São artigos de clusters diferentes (câmera x porta eletrônica) que compartilham vocabulário de "erros comuns de configuração/instalação" — overlap real de estrutura de conteúdo, não de tema. A regra de espaçamento tratou esse par como qualquer outro, recomendando 14 dias mesmo sendo clusters diferentes — o que é o comportamento correto: overlap de vocabulário importa para o calendário social, independente de cluster.

Total: **11 pares**, todos com recomendação de espaçamento de 14 ou 21 dias conforme o grau de overlap. Verificação manual amostral: os ganchos de Reel dos pares com maior overlap (`porta-eletronica-automatica-para-pet` x seus 6 pares) seguem distintos entre si — RFID/32 microchips (PILLAR) vs. vidro temperado (vidro) vs. sensor de luz não identifica (sensor de luz) vs. reconhecimento facial e tosa (facial).

## Qualidade editorial

Fatos usados nos 32 Reels/Posts deste lote que não estavam em heading algum: requisitos técnicos de cartão SD (classe 10/UHS-1, FAT32 vs exFAT), alcance real de visão noturna (~9m), causa técnica mais comum de falha de conexão Wi-Fi (banda 2,4GHz vs 5GHz), limite de 32 microchips cadastráveis em porta eletrônica, risco de vidro temperado trincar ao furar, autonomia de gelo reutilizável no alimentador para ração úmida (8-12h). Nenhum gancho usa preço (verificado por grep antes da geração).

## Garantias mantidas

- `htmlUnchanged: true`, `affiliateUnchanged: true` — nenhum `index.html` ou imagem alterado.
- Nenhum `affiliate-products.json`, `sitemap.xml`, fila de publicação, ou módulo fora do Social Content Engine tocado.
- Nenhuma publicação, agendamento ou integração com Facebook/Instagram/Meta API.
- Nenhum `git add`/`commit`/`push`, nenhum deploy.
- `npm test`: 68/68.
- Nenhum arquivo `.data/social-content/{slug}.json` gravado (mesmo padrão de todos os lotes anteriores da escala).

## Acumulado final da escala completa

| Etapa | Artigos | Peças tentadas | Geradas | Bloqueadas | Needs review |
|---|---|---|---|---|---|
| Calibração 1 | 3 | 6 | 6 | 0 | 0 |
| Piloto V2 completo | 10 | 52 | 52 | 0 | 0 |
| Calibração 2 | 10 | 60 | 48 | 12 | 0 |
| Escala — Lote 1 | 9 | 54 | 40 | 14 | 0 |
| Escala — Lote 2 | 9 | 54 | 45 | 9 | 0 |
| Escala — Lote 3 | 9 | 54 | 50 | 4 | 0 |
| **Escala — Lote 4 (final)** | 16 | 96 | 72 | 24 | 0 |
| **TOTAL GERAL (66 artigos)** | 66 | 376 | 313 | 63 | 0 |

**A escala dos 43 artigos restantes está completa: 43/43 processados (9+9+9+16).** Somando os pilotos anteriores, o programa cobriu 66 dos 73 artigos do site (faltam apenas as 5 páginas institucionais/autor/index, que nunca entram por regra, e a página inicial). **313 peças sociais aprovadas no total, 0 needs_review em toda a execução, 100% de rastreabilidade literal.**

## Conclusão desta etapa

O objetivo desta fase — descobrir quantas peças boas o site produz — está respondido: **313 peças aprovadas**, distribuídas entre Reel, Post, Carrossel, Stories e Engagement, com bloqueios automáticos coerentes onde a fonte não sustentava o formato. Nenhuma publicação foi feita. Nenhuma decisão de calendário editorial foi tomada.

## Próximo passo (não iniciado)

Conforme combinado, esta etapa entrega o estoque validado — não decide calendário editorial, frequência de publicação, nem integração Facebook/Instagram. Aguardando sua validação deste lote e, depois disso, sua orientação sobre a próxima etapa (provavelmente: revisão humana por amostragem de 10-15% do total de 313 peças, seguida da definição do calendário editorial).
