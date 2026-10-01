# Social Content Engine — Escala, Lote 3 de ~3 (9 artigos)

Gerado em: 2026-09-01

**Status:** terceiro lote da escala, após aprovação do Lote 2 e reconciliação de contagem (43 artigos no total do pool da escala, 18 já processados nos Lotes 1-2). Nenhum HTML, imagem, link de afiliado ou sitemap foi alterado. Nenhuma publicação, fila editorial, commit, push ou deploy. **Aguardando aprovação humana antes do Lote 4 (final, 16 artigos).**

## Artigos deste lote

| Slug | Role | Cluster | Palavras (aprox.) |
|---|---|---|---|
| comedouro-automatico-anti-formiga | FAQ | comedouro-automatico-para-pet | ~1000w |
| comedouro-automatico-faz-mal | FAQ | comedouro-automatico-para-pet | ~1300w |
| comedouro-automatico-gato-obeso | FAQ | comedouro-automatico-para-pet | ~1300w |
| comedouro-automatico-para-dois-gatos | FAQ | comedouro-automatico-para-pet (heurístico — publicado após o último `content-strategy.json`) | ~1100w |
| comedouro-automatico-para-viagem | HOW_TO (+ FAQPage) | comedouro-automatico-para-pet | ~1100w |
| como-limpar-comedouro-automatico | HOW_TO (+ FAQPage) | comedouro-automatico-para-pet | ~1200w |
| configurar-app-comedouro-wifi | HOW_TO (schema HowTo + FAQPage) | comedouro-automatico-para-pet | ~950w |
| melhor-comedouro-automatico-cachorro | SATELLITE | comedouro-automatico-para-pet | ~650w |
| melhor-comedouro-interativo-gato | SATELLITE | comedouro-automatico-para-pet | ~450w |

Fecha por completo o cluster **comedouro-automatico-para-pet** (11 artigos no total, somando os 2 já feitos no Lote 2). Único lote 100% de um cluster só — decisão editorial para terminar a família antes de abrir câmera/porta-eletrônica no Lote 4.

## Resultado

| Métrica | Resultado |
|---|---|
| Artigos processados | 9 |
| Peças tentadas | 54 |
| Geradas e aprovadas no gate V2 | **50** |
| Bloqueadas (`insufficient_source`, decisão automática) | **4** |
| `needs_review` | **0** — primeira passada já limpa, nenhum preço usado nos ganchos |
| Rastreabilidade (`source_excerpt` literal verificado) | 50/50 |
| `npm test` | **68/68** |
| `htmlUnchanged` / `affiliateUnchanged` | true / true |

**Maior taxa de aprovação da escala até agora: 93%.** Motivo claro: 7 dos 9 artigos têm FAQPage real (5 têm até schema `HowTo` + FAQPage combinados), o que sustenta Stories de enquete e Engagement sem bloqueio. Só os 2 SATELLITE mais curtos (`melhor-comedouro-automatico-cachorro`, `melhor-comedouro-interativo-gato`) tiveram os bloqueios esperados.

## Visão por artigo

| Artigo | Reel | Post | Carrossel | Stories (enquete) | Stories (CTA) | Engagement |
|---|---|---|---|---|---|---|
| comedouro-automatico-anti-formiga | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| comedouro-automatico-faz-mal | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| comedouro-automatico-gato-obeso | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| comedouro-automatico-para-dois-gatos | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| comedouro-automatico-para-viagem | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| como-limpar-comedouro-automatico | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| configurar-app-comedouro-wifi | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| melhor-comedouro-automatico-cachorro | ✅ | ✅ | ✅ | 🚫 sem pergunta real | ✅ | 🚫 sem FAQ nem par comparativo |
| melhor-comedouro-interativo-gato | ✅ | ✅ | ✅ | 🚫 sem pergunta real | ✅ | 🚫 sem FAQ nem par comparativo |

**Padrão confirmado novamente:** todo artigo com FAQPage real gera 6/6; os 2 sem FAQ (nem par comparativo no título) têm Stories de enquete e Engagement bloqueados de forma coerente — o pipeline continua generalizando corretamente sem curadoria prévia.

## Repetição entre artigos do mesmo cluster

Menor concentração de overlap que os lotes anteriores — só 4 artigos com `similarity_warning`, apesar de todos os 9 serem do mesmo cluster. Isso reflete que os artigos deste lote cobrem ângulos bem diferentes entre si (anti-formiga, riscos de saúde, obesidade, dois gatos, viagem, limpeza, configuração de app, comparativo de cachorro, comparativo interativo de gato) mesmo compartilhando o mesmo tema-guarda-chuva.

| Par | Overlap | Espaçamento recomendado |
|---|---|---|
| comedouro-automatico-gato-obeso ↔ melhor-comedouro-interativo-gato | 0.58 | 14 dias |
| melhor-comedouro-automatico-cachorro ↔ melhor-comedouro-interativo-gato | 0.53 | 14 dias |
| como-limpar-comedouro-automatico ↔ melhor-comedouro-automatico-cachorro | 0.53 | 14 dias |

Verificação manual: overlap concentrado nos 2 SATELLITE mais curtos e mais genéricos (comparativos de "melhor X"), esperado — mas os ganchos de Reel seguem distintos: liberação fracionada (obesidade) vs. estímulo cognitivo (interativo) vs. defeito de calibração por porte (cachorro).

## Qualidade editorial

Fatos usados nos 18 Reels/Posts que não estavam em heading algum: princípio físico da barreira anti-formiga (canal de água, não veneno), risco de queima de placa eletrônica ao lavar a base na pia, motivo técnico da falha de pareamento Wi-Fi (band steering 2,4/5GHz), regra comportamental "número de gatos + 1", percentual de gatos obesos citado por especialista (>50%), erro de calibração mais comum em cães grandes. Nenhum gancho usa preço.

## Garantias mantidas

- `htmlUnchanged: true`, `affiliateUnchanged: true`.
- Nenhum `index.html`, imagem, `affiliate-products.json` ou `sitemap.xml` alterado.
- Nenhuma publicação, fila editorial, commit, push ou deploy.
- `npm test`: 68/68.
- Nenhum arquivo `.data/social-content/{slug}.json` gravado (mesmo padrão dos lotes anteriores).

## Nota sobre `comedouro-automatico-para-dois-gatos`

Este artigo não existe em `.data/content-strategy.json` (foi publicado depois da última geração desse arquivo). O `cluster` foi atribuído por heurística de prefixo de slug (`comedouro-automatico`), marcado `cluster_source: "heuristic"` — consistente com a regra da skill de nunca tratar cluster heurístico como definitivo. Isso não impediu a geração normal das peças, só marca a origem do dado.

## Acumulado da escala até aqui

| Etapa | Peças tentadas | Geradas | Bloqueadas | Needs review |
|---|---|---|---|---|
| Calibração 1 (3 artigos) | 6 | 6 | 0 | 0 |
| Piloto V2 completo (10 artigos) | 52 | 52 | 0 | 0 |
| Calibração 2 (10 artigos) | 60 | 48 | 12 | 0 |
| Escala — Lote 1 (9 artigos) | 54 | 40 | 14 | 0 |
| Escala — Lote 2 (9 artigos) | 54 | 45 | 9 | 0 |
| **Escala — Lote 3 (9 artigos)** | 54 | 50 | 4 | 0 |
| **Total acumulado (50 artigos)** | 280 | 241 | 39 | 0 |

Processados na escala até agora: **27 de 43** (18 dos Lotes 1-2 + 9 deste lote). Faltam **16 artigos** para completar a escala — cabe em 1 lote final maior ou 2 lotes menores (8+8), a definir com você.

## Próximo passo

Aguardando sua validação deste lote antes do Lote 4/final (16 artigos restantes: câmera pet — 4 artigos — e porta-eletrônica — 5 artigos —, mais `melhor-alimentador-automatico-gatos` e `melhor-bebedouro-automatico-pet`, cluster desconhecido).
