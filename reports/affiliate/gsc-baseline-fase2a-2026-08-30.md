# Baseline GSC — Fase 2A (cluster de comedouros)

**Data da coleta:** 2026-08-30
**Property:** `sc-domain:smartpetgadgets.com.br`
**Período atual consultado:** 2026-07-31 a 2026-08-27 (28 dias, respeitando o lag de 2-3 dias do Search Console)
**Período de comparação (28 dias anteriores):** 2026-07-03 a 2026-07-30 → **0 linhas retornadas**. Não existe dado prévio no site inteiro nesse período; não há baseline anterior para comparar.

**Contexto do deploy:** a migração de links de afiliado (Fase 2A) foi publicada em produção em 2026-08-30, ou seja, **depois** do fim do período aqui analisado. Este relatório é a fotografia do estado **imediatamente antes** de qualquer efeito possível do deploy aparecer nos dados do Google (o crawl mais recente confirmado via URL Inspection também é anterior ao deploy).

## Totais do site inteiro (28 dias)

| Métrica | Valor |
|---|---|
| Impressões | 42 |
| Cliques | 0 |
| CTR | 0% |
| Posição média | — (n/a, sem cliques) |

## Os 15 artigos da Fase 2A — individualmente

| Artigo | Impressões | Cliques | CTR | Posição média | Consultas |
|---|---|---|---|---|---|
| comedouro-automatico-gato-obeso | 0 | 0 | — | — | — |
| comedouro-automatico-para-dois-gatos | 0 | 0 | — | — | — |
| comedouro-automatico-para-viagem | 0 | 0 | — | — | — |
| comedouro-x-bebedouro-automatico | 0 | 0 | — | — | — |
| configurar-app-comedouro-wifi | 0 | 0 | — | — | — |
| comedouro-newpet-4l-review | 0 | 0 | — | — | — |
| comedouro-automatico-anti-formiga | 0 | 0 | — | — | — |
| comedouro-automatico-faz-mal | 0 | 0 | — | — | — |
| comedouro-automatico-para-pet | 0 | 0 | — | — | — |
| comedouro-automatico-vale-a-pena | 0 | 0 | — | — | — |
| comedouro-gato-x-cachorro-diferenca | 0 | 0 | — | — | — |
| como-limpar-comedouro-automatico | 0 | 0 | — | — | — |
| melhor-alimentador-automatico-gatos | 0 | 0 | — | — | — |
| **melhor-comedouro-automatico-cachorro** | **1** | 0 | 0% | 10,0 | `vdrbg` |
| comedouro-com-ou-sem-wifi | 0 | 0 | — | — | — |

**Resumo:** 14 de 15 artigos com zero impressões/cliques. 1 artigo (`melhor-comedouro-automatico-cachorro`) com 1 impressão isolada para a consulta "vdrbg", posição média 10.

## Classificação (régua acordada)

| Categoria | Qtd. | Artigos |
|---|---|---|
| 🟢 Vencedores (preservar e monetizar mais) | 0 | — |
| 🟡 Potencial (melhorar CTR/conteúdo) | 0 | — |
| 🟠 Posição 11-30 (prioridade máxima de SEO) | 0 | — |
| 🔴 Sem impressões/dados suficientes | 14 | todos exceto `melhor-comedouro-automatico-cachorro` |
| ⚪ Dado insuficiente para classificar (1 impressão isolada) | 1 | `melhor-comedouro-automatico-cachorro` |

## Contexto de indexação (URL Inspection, mesma data)

Cruzando com a inspeção rodada em 2026-08-30: 13/15 artigos já `Submitted and indexed`, `last_crawl_time` entre 21 e 28/08 (todos anteriores ao deploy). 2 exceções sem relação com a Fase 2A:
- `comedouro-x-bebedouro-automatico` — "URL is unknown to Google" (nunca rastreada).
- `melhor-alimentador-automatico-gatos` — "Discovered - currently not indexed".

## Leitura

Ausência de impressões/cliques nos 15 artigos **não é atribuível à Fase 2A** — o site inteiro está em estágio inicial de indexação/descoberta (consistente com o snapshot de GSC de 2026-08-25 já registrado na memória do projeto: 38/72 páginas indexadas, ~0 impressões de busca). Não havia tráfego orgânico prévio nos 15 artigos que pudesse ter sido prejudicado pela troca de links de afiliado. O risco real da migração era técnico (canonical, JSON-LD, links quebrados), já auditado e confirmado como zero regressões.

## Uso deste baseline

Este arquivo é a referência fixa para as comparações futuras:
- **+7 dias:** próxima checagem em 2026-09-06.
- **+14 dias:** 2026-09-13.
- **+28 dias:** 2026-09-27.

Em cada checagem, repetir a mesma consulta (`gsc_query`, dimensões `page,query`, mesma property) para os mesmos 15 artigos e comparar contra os números desta tabela. O objetivo nesta fase do site é observar a curva de impressões saindo do zero — otimização de CTR só faz sentido depois que houver volume de impressões mensurável.
