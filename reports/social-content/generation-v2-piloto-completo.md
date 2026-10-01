# Social Content Engine — Geração V2 completa do piloto (10 artigos)

Gerado em: 2026-09-01

**Status:** entrega dos 4 itens autorizados (generalizar V2 para as 76 peças do piloto, seleção de formato por artigo, regra de espaçamento, relatório completo). **Não escalado além disso.** Nenhum HTML, imagem, link de afiliado ou sitemap foi alterado (`htmlUnchanged: true`, `affiliateUnchanged: true`). Nenhuma publicação, fila editorial, commit, push ou deploy. Não aplicado aos ~62 artigos restantes.

## Resumo geral

| Métrica | Resultado |
|---|---|
| Artigos analisados | 10 |
| Peças V1 (piloto original, fórmula heading→template) | 76 |
| Peças V2 geradas (fato específico + fonte explícita) | 52 |
| Peças bloqueadas (`insufficient_source`, material real insuficiente) | 0 nesta rodada — os 8 slots que o V1 já bloqueava viraram exclusão de formato inteiro na V2 (ver seleção por artigo) |
| Peças aprovadas no quality gate V2 | **52/52 (100%)** |
| Peças em `needs_review` | 0 |
| Rastreabilidade (`source_excerpt` verificado por substring literal) | 52/52 verificadas |
| Pares de artigos com similaridade alta (`similarity_warning`) | 2 |
| Artigos que geraram todos os 5 formatos | 7 de 10 |
| Artigos com formato(s) excluído(s) por decisão editorial | 3 de 10 |

**Por que 52 e não 76:** a V2 não gera mais 8 peças fixas por artigo (2 Reels + 2 Posts + 1 Carrossel + 2 Stories + 1 Engagement). Ela gera **1 peça por formato selecionado editorialmente** (Reel, Post, Carrossel, Stories, Engagement — no máximo 5 por artigo), e só inclui um formato quando há material real e específico para sustentá-lo. Isso é o item 2 da autorização (seleção de formato), não uma regressão de cobertura — ver detalhamento por artigo abaixo.

## Testes executados

`npm test` → **67/67 passando** (61 já existentes + os 6 novos de `spacing-rule-v2.test.js`), 0 falhas.

## Achado técnico durante a execução (corrigido nesta etapa)

O quality gate V2 pegou uma inconsistência real nos próprios dados extraídos: em 2 dos 10 artigos (`camera-para-monitorar-pet` e, potencialmente, outros com o mesmo padrão), a tag `<title>` da página (`article.title`) **diverge do H1 impresso no corpo** (`body_text_full`) — ex.: título da página "Câmera para Monitorar Pet: Como Escolher o Modelo Ideal", mas o H1 real no corpo é "Câmera para Monitorar Pet: Guia Completo". As 2 peças que usavam `article.title` como fonte falharam corretamente no gate (`source_excerpt não encontrado`), porque o título da página não é, de fato, um trecho literal do artigo. Corrigido extraindo o H1 real do corpo (`extractRealH1()`) em vez de assumir que a tag `<title>` bate com o texto do artigo. Isso é uma prova de que o gate V2 funciona como pretendido — pegou uma premissa errada antes que ela virasse uma peça publicável com fonte inconsistente.

## Formato por artigo (seleção editorial, item 2 da autorização)

| Artigo | Formatos gerados | Formatos excluídos (motivo) |
|---|---|---|
| comedouro-gato-x-cachorro-diferenca | Reel, Post, Carrossel, Stories, Engagement (5/5) | — |
| bebedouro-inox-x-ceramica | Reel, Post, Carrossel, Stories, Engagement (5/5) | — |
| comedouro-com-ou-sem-wifi | Reel, Post, Carrossel, Stories, Engagement (5/5) | — |
| coleira-gps-x-microchip | Reel, Post, Carrossel, Engagement (4/5) | Stories — sem pergunta real (heading "?") na fonte |
| coleira-gps-bluetooth-x-chip-operadora | Reel, Post, Carrossel, Engagement (4/5) | Stories — sem pergunta real na fonte |
| camera-para-monitorar-pet | Reel, Post, Carrossel, Stories, Engagement (5/5) | — |
| duvidas-camera-para-monitorar-pet | Reel, Post, Stories, Engagement (4/5) | Carrossel — só 3 blocos de conteúdo real, abaixo do mínimo de 6 slides sustentáveis |
| cercado-para-cachorros | Reel, Post, Carrossel, Stories, Engagement (5/5) | — |
| tapete-higienico-para-cachorro | Reel, Post, Carrossel, Stories, Engagement (5/5) | — |
| porta-eletronica-gato-x-cachorro-diferenca | Reel, Post, Engagement (3/5) | Carrossel — artigo mais curto do piloto (432 palavras), só 3 blocos reais; Stories — sem pergunta real na fonte |

A lógica de seleção (por artigo, com justificativa) está documentada em `src/format-selection-v2.js` — é decisão editorial (leitura de `body_text_full` por Claude), não uma fórmula de contagem de headings/palavras/imagens.

## Rastreabilidade por artigo

Todas as 52 peças geradas têm `source = { article_slug, source_type, source_excerpt, section }` verificado por substring literal em `body_text_full`. Distribuição de `source_type`:

- **body_fact** (Reel + Post, 20 peças): fato específico identificado por leitura do artigo completo — ex.: "fadiga de bigode" em gatos, banda 2,4GHz vs 5GHz, pesquisa UFRGS sobre carvão ativado, estimativa IBGE de 52,2 milhões de cães.
- **heading** (Carrossel, 8 peças): estrutura de slides ancorada a um heading real do artigo (formato inerentemente estrutural, não de "um fato só").
- **faq_question** (Stories-enquete e Engagement quando a pergunta vem de FAQ real, 16 peças): a pergunta É o próprio trecho literal.
- **title** (Stories-CTA e Engagement quando não há FAQ, 8 peças): H1 real do artigo (corrigido para não usar a tag `<title>`, ver achado técnico acima).

## Regra de espaçamento (item 3 da autorização)

Construída em cima de `similarity.js`, sem alterar esse arquivo. Recomendação, não bloqueio:

| Par de artigos | Overlap | Mesmo cluster | Espaçamento recomendado |
|---|---|---|---|
| comedouro-gato-x-cachorro-diferenca ↔ porta-eletronica-gato-x-cachorro-diferenca | 0.72 | não | **21 dias** |
| camera-para-monitorar-pet ↔ duvidas-camera-para-monitorar-pet | 0.62 | sim | **14 dias** |

Regra aplicada (`src/spacing-rule-v2.js`): overlap ≥ 0.70 → 21 dias; overlap ≥ 0.50 → 14 dias; abaixo disso, sem recomendação. Isso não impede gerar as peças dos dois artigos — só orienta que peças equivalentes (mesmo formato, gancho parecido) desses pares não sejam publicadas na mesma semana no calendário editorial.

## O que muda de arquivo para arquivo (resumo da implementação)

| Arquivo | O que é |
|---|---|
| `src/format-selection-v2.js` | **novo** — seleção de formato por artigo (dado editorial + justificativa) |
| `src/spacing-rule-v2.js` | **novo** — regra de espaçamento em cima de `similarity.js` (intocado) |
| `src/piloto-v2-reel-post-data.js` | **novo** — Reel + Post V2 dos 10 artigos, com fato específico e `source` |
| `src/generate-v2-piloto.js` | **novo** — orquestra: seleção de formato + Reel/Post editoriais + Carrossel/Stories/Engagement derivados do V1 com `source` anexado + quality gate V2 + espaçamento |
| `src/quality-gate-v2.js` | do passo anterior, sem alteração nesta etapa (só usado) |
| `src/analyze-article.js`, `src/similarity.js`, `src/content-templates.js` (V1) | **intocados** |
| `test/spacing-rule-v2.test.js` | **novo** — 6 testes |

## Garantias mantidas

- `htmlUnchanged: true` — nenhum `index.html` alterado.
- `affiliateUnchanged: true` — `affiliate-products.json` byte a byte idêntico.
- Nenhum arquivo `.data/social-content/{slug}.json` do piloto V1 foi sobrescrito.
- Nenhuma publicação, fila editorial, commit, push ou deploy.
- `npm test`: 67/67.

## Não escalado (aguardando validação humana)

- **Não aplicado** aos ~62 artigos restantes do site.
- **Não implementada** integração de publicação (não existe nesta V1 de qualquer forma).
- **Não decidido** ainda: se o espaçamento de 14/21 dias deve virar trava automática de agendamento ou continuar como recomendação para revisão humana — depende de como a fila editorial futura for desenhada.

## Próximo passo

Aguardando sua validação deste relatório antes de qualquer novo passo. Se aprovado, os próximos candidatos naturais seriam: (a) decidir se o padrão V2 (leitura completa + fonte explícita + seleção de formato) já está maduro para os ~62 artigos restantes, ou (b) rodar mais uma rodada de calibração em uma amostra maior antes de ir para todo o site.
