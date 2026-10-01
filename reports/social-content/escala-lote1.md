# Social Content Engine — Escala, Lote 1 de ~5 (9 artigos)

Gerado em: 2026-09-01

**Status:** escala autorizada explicitamente após aprovação da Calibração 2. Lote 1 de aproximadamente 5, cobrindo os 43 artigos restantes (não ~62 — ver nota de escopo abaixo). Nenhum HTML, imagem, link de afiliado ou sitemap foi alterado. Nenhuma publicação, fila editorial, commit, push ou deploy. **Aguardando aprovação humana antes do Lote 2.**

## Nota de escopo (correção do número inicial)

O site tem 73 páginas no total. Descontando os 25 artigos já usados nos dois pilotos/calibrações e as 5 páginas institucionais/autor/index, restam **43 artigos** (não ~62). Este lote processa 9 deles.

## Artigos deste lote

| Slug | Role | Cluster | Palavras |
|---|---|---|---|
| brinquedo-interativo-automatico-para-gato | PILLAR | brinquedo-interativo-automatico-para-gato | 846w |
| brinquedo-automatico-cachorro-sozinho | SATELLITE | brinquedo-interativo-automatico-para-gato | 438w |
| brinquedo-interativo-sensor-infravermelho-como-funciona | SATELLITE | brinquedo-interativo-automatico-para-gato | 379w |
| brinquedo-interativo-substitui-brincadeira-tutor | SATELLITE | brinquedo-interativo-automatico-para-gato | 418w |
| como-escolher-brinquedo-interativo-gato-entediado | HOW_TO | brinquedo-interativo-automatico-para-gato | 411w |
| erros-comuns-brinquedo-interativo-gato | SATELLITE | brinquedo-interativo-automatico-para-gato | 437w |
| melhor-bolinha-inteligente-para-gato | SATELLITE | brinquedo-interativo-automatico-para-gato | 388w |
| camera-pet-resolucao-1080p-x-2k | COMPARISON | camera-para-monitorar-pet | 389w |
| camera-pet-x-coleira-gps-qual-escolher | COMPARISON | camera-para-monitorar-pet | 437w |

7 artigos do cluster brinquedo-interativo (incluindo o PILLAR) + 2 do cluster câmera pet (ambos COMPARISON), para fechar o cluster brinquedo-interativo quase por completo neste lote.

## Resultado

| Métrica | Resultado |
|---|---|
| Artigos processados | 9 |
| Peças tentadas (Reel+Post sempre; Carrossel+2 Stories+Engagement sempre tentados) | 54 |
| Peças geradas e aprovadas no gate V2 | **40** |
| Peças bloqueadas (`insufficient_source`, decisão automática do pipeline) | **14** |
| Peças em `needs_review` | **0** (após correção — ver "Achado" abaixo) |
| Rastreabilidade (`source_excerpt` literal verificado) | 40/40 |
| `npm test` | **68/68** |
| `htmlUnchanged` / `affiliateUnchanged` | true / true |

## Achado neste lote (autocorreção antes da entrega)

Na primeira passada, 2 peças (`brinquedo-interativo-automatico-para-gato` reel, `melhor-bolinha-inteligente-para-gato` post) falharam o quality gate na checagem "não contém preço" — eu havia usado faixas de preço (R$) como gancho, o que viola a regra "preço nunca aparece em peça gerada". O gate pegou corretamente. Reescrevi os dois ganchos usando fatos não-monetários do próprio artigo (fonte de energia do brinquedo; recursos do modelo com app vs. simples) e ambos passaram normalmente na segunda passada. Nenhuma peça ruim chegou a ser aprovada — o gate funcionou como esperado.

## Visão por artigo

| Artigo | Reel | Post | Carrossel | Stories (enquete) | Stories (CTA) | Engagement |
|---|---|---|---|---|---|---|
| brinquedo-interativo-automatico-para-gato | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| brinquedo-automatico-cachorro-sozinho | ✅ | ✅ | ✅ | 🚫 sem pergunta real | ✅ | 🚫 sem FAQ nem par comparativo |
| brinquedo-interativo-sensor-infravermelho-como-funciona | ✅ | ✅ | ✅ | 🚫 sem pergunta real | ✅ | 🚫 sem FAQ nem par comparativo |
| brinquedo-interativo-substitui-brincadeira-tutor | ✅ | ✅ | ✅ | 🚫 sem pergunta real | ✅ | 🚫 sem FAQ nem par comparativo |
| como-escolher-brinquedo-interativo-gato-entediado | ✅ | ✅ | ✅ | 🚫 sem pergunta real | ✅ | 🚫 sem FAQ nem par comparativo |
| erros-comuns-brinquedo-interativo-gato | ✅ | ✅ | ✅ | 🚫 sem pergunta real | ✅ | 🚫 sem FAQ nem par comparativo |
| melhor-bolinha-inteligente-para-gato | ✅ | ✅ | ✅ | 🚫 sem pergunta real | ✅ | 🚫 sem FAQ nem par comparativo |
| camera-pet-resolucao-1080p-x-2k | ✅ | ✅ | ✅ | 🚫 sem pergunta real | ✅ | ✅ (par comparativo do título) |
| camera-pet-x-coleira-gps-qual-escolher | ✅ | ✅ | ✅ | 🚫 sem pergunta real | ✅ | ✅ (par comparativo do título) |

**Leitura do padrão:** o único artigo com FAQPage real neste lote (`brinquedo-interativo-automatico-para-gato`) foi o único a gerar 6/6 peças completas — Stories de enquete e Engagement dependem de pergunta real no conteúdo, que os 6 artigos SATELLITE/HOW_TO deste lote não têm (título declarativo, sem heading em formato de pergunta). Os 2 COMPARISON geraram Engagement normalmente a partir do par "A x B" do título, mas também não têm heading-pergunta para Stories de enquete. Nenhum bloqueio parece incoerente com o tipo de conteúdo.

## Repetição entre artigos do mesmo cluster (item pedido: espaçamento)

Como 7/9 artigos são do mesmo cluster (brinquedo-interativo-automatico-para-gato), era esperado overlap alto — e foi o que aconteceu: 5 pares com `similarity_warning`, com o PILLAR (`brinquedo-interativo-automatico-para-gato`) aparecendo em 4 deles, o que é natural — ele resume e linka todos os satélites.

| Par | Overlap | Espaçamento recomendado |
|---|---|---|
| brinquedo-interativo-automatico-para-gato ↔ como-escolher-brinquedo-interativo-gato-entediado | 0.87 | 21 dias |
| brinquedo-interativo-automatico-para-gato ↔ erros-comuns-brinquedo-interativo-gato | 0.87 | 21 dias |
| como-escolher-brinquedo-interativo-gato-entediado ↔ erros-comuns-brinquedo-interativo-gato | 0.72 | 21 dias |
| brinquedo-interativo-automatico-para-gato ↔ brinquedo-interativo-sensor-infravermelho-como-funciona | 0.58 | 14 dias |
| brinquedo-interativo-automatico-para-gato ↔ brinquedo-interativo-substitui-brincadeira-tutor | 0.58 | 14 dias |

Verificação manual: os ganchos de Reel continuam distintos apesar do overlap de vocabulário do cluster — ex. "fonte de energia" (PILLAR) vs. "sinais de tédio" (como-escolher) vs. "piso muda o modo" (erros-comuns) tratam de facetas diferentes do mesmo tema, não do mesmo ângulo.

## Qualidade editorial (avaliação qualitativa)

Os 18 Reels/Posts deste lote seguem o padrão validado nos lotes anteriores: gancho nasce de um fato específico do corpo (nunca preço, nunca heading genérico). Exemplos de fatos usados que não estavam em heading algum: distância de ativação do sensor infravermelho (~10 cm), tempo de desligamento automático (~5 min citado por fabricante), sinais físicos de tédio felino (sono excessivo, comportamento destrutivo), diferença de força de mordida entre brinquedos de cão e gato.

## Distribuição por role

Peças geradas por role neste lote: PILLAR 6/6, SATELLITE 24/36 (6 artigos × 6 peças tentadas), HOW_TO 4/6, COMPARISON 6/12 — a taxa mais baixa em COMPARISON reflete que Stories de enquete falhou nos 2 (sem heading-pergunta), não um problema sistemático de formato.

## Garantias mantidas

- `htmlUnchanged: true`, `affiliateUnchanged: true`.
- Nenhum `index.html`, imagem, `affiliate-products.json` ou `sitemap.xml` alterado.
- Nenhuma publicação, fila editorial, commit, push ou deploy.
- `npm test`: 68/68.
- Nenhum arquivo `.data/social-content/{slug}.json` gravado (mesmo padrão dos lotes de calibração — só o relatório documenta o resultado nesta fase).

## Acumulado da escala até aqui

| Etapa | Peças tentadas | Geradas | Bloqueadas | Needs review |
|---|---|---|---|---|
| Calibração 1 (3 artigos) | 6 | 6 | 0 | 0 |
| Piloto V2 completo (10 artigos) | 52 | 52 | 0 | 0 |
| Calibração 2 (10 artigos) | 60 | 48 | 12 | 0 |
| **Escala — Lote 1 (9 artigos)** | 54 | 40 | 14 | 0 |
| **Total acumulado (32 artigos)** | 172 | 146 | 26 | 0 |

Faltam **34 artigos** em ~4 lotes adicionais para completar a escala.

## Próximo passo

Aguardando sua validação deste lote antes de iniciar o Lote 2 (~9 artigos, provavelmente cluster coleira GPS + início do cluster comedouro automático).
