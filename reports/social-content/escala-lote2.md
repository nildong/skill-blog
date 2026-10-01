# Social Content Engine — Escala, Lote 2 de ~5 (9 artigos)

Gerado em: 2026-09-01

**Status:** segundo lote da escala, após aprovação do Lote 1. Nenhum HTML, imagem, link de afiliado ou sitemap foi alterado. Nenhuma publicação, fila editorial, commit, push ou deploy. **Aguardando aprovação humana antes do Lote 3.**

## Artigos deste lote

| Slug | Role | Cluster | Palavras |
|---|---|---|---|
| coleira-gps-para-pet | PILLAR | coleira-gps-para-pet | 1507w |
| coleira-gps-cachorro-pequeno-porte | SATELLITE | coleira-gps-para-pet | 586w |
| coleira-gps-cachorro-que-foge | SATELLITE | coleira-gps-para-pet | 546w |
| coleira-gps-para-gato | SATELLITE | coleira-gps-para-pet | 687w |
| erros-comuns-coleira-gps-pet | SATELLITE | coleira-gps-para-pet | 615w |
| melhor-coleira-gps-sem-mensalidade | SATELLITE | coleira-gps-para-pet | 659w |
| porta-eletronica-microchip-x-rfid-coleira | COMPARISON | coleira-gps-para-pet | 395w |
| comedouro-automatico-para-pet | PILLAR | comedouro-automatico-para-pet | 1468w |
| comedouro-automatico-vale-a-pena | FAQ | comedouro-automatico-para-pet | 1658w |

Fecha por completo o cluster coleira-gps-para-pet (7 artigos) e abre o cluster comedouro-automatico-para-pet com seus 2 artigos mais densos (PILLAR + FAQ, ambos com FAQPage real).

## Resultado

| Métrica | Resultado |
|---|---|
| Artigos processados | 9 |
| Peças tentadas | 54 |
| Geradas e aprovadas no gate V2 | **45** |
| Bloqueadas (`insufficient_source`, decisão automática) | **9** |
| `needs_review` | **0** — nenhuma peça falhou o gate nesta rodada, primeira passada já limpa |
| Rastreabilidade (`source_excerpt` literal verificado) | 45/45 |
| `npm test` | **68/68** |
| `htmlUnchanged` / `affiliateUnchanged` | true / true |

Taxa de aprovação mais alta que o Lote 1 (83% vs. 74%) — reflexo de o cluster coleira-gps ter mais artigos com heading-pergunta real e os 2 artigos de comedouro (PILLAR + FAQ) terem FAQPage completo, o que sustenta Stories de enquete e Engagement.

## Visão por artigo

| Artigo | Reel | Post | Carrossel | Stories (enquete) | Stories (CTA) | Engagement |
|---|---|---|---|---|---|---|
| coleira-gps-para-pet | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| coleira-gps-cachorro-pequeno-porte | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| coleira-gps-cachorro-que-foge | ✅ | ✅ | ✅ | 🚫 sem pergunta real | ✅ | 🚫 sem FAQ nem par comparativo |
| coleira-gps-para-gato | ✅ | ✅ | ✅ | 🚫 sem pergunta real | ✅ | 🚫 sem FAQ nem par comparativo |
| erros-comuns-coleira-gps-pet | ✅ | ✅ | ✅ | 🚫 sem pergunta real | ✅ | 🚫 sem FAQ nem par comparativo |
| melhor-coleira-gps-sem-mensalidade | ✅ | ✅ | ✅ | 🚫 sem pergunta real | ✅ | 🚫 sem FAQ nem par comparativo |
| porta-eletronica-microchip-x-rfid-coleira | ✅ | ✅ | ✅ | 🚫 sem pergunta real | ✅ | ✅ (par comparativo do título) |
| comedouro-automatico-para-pet | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| comedouro-automatico-vale-a-pena | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Padrão:** os 3 artigos com FAQPage real (PILLAR + `coleira-gps-cachorro-pequeno-porte`, que tem heading em formato de pergunta na seção "Cães Pequenos Também Fogem — E Agora?") geraram 6/6; `comedouro-automatico-vale-a-pena` também é FAQPage e gerou 6/6. Os demais SATELLITE sem heading-pergunta seguem o padrão já visto: Stories de enquete e Engagement bloqueados coerentemente.

## Repetição entre artigos do mesmo cluster

Overlap alto esperado dentro do cluster coleira-gps (7/9 artigos), com destaque para `melhor-coleira-gps-sem-mensalidade`, que aparece em todos os 5 pares do cluster — natural, já que ele referencia tecnologia (Bluetooth, chip, NB-IoT) comum a todos os outros satélites.

| Par | Overlap | Espaçamento recomendado |
|---|---|---|
| comedouro-automatico-para-pet ↔ comedouro-automatico-vale-a-pena | 0.81 | 21 dias |
| coleira-gps-cachorro-pequeno-porte ↔ coleira-gps-cachorro-que-foge | 0.72 | 21 dias |
| coleira-gps-para-pet ↔ coleira-gps-cachorro-que-foge | 0.72 | 21 dias |
| coleira-gps-para-pet ↔ coleira-gps-cachorro-pequeno-porte | 0.70 | 21 dias |
| melhor-coleira-gps-sem-mensalidade ↔ coleira-gps-cachorro-que-foge | 0.65 | 14 dias |
| melhor-coleira-gps-sem-mensalidade ↔ coleira-gps-para-pet | 0.61 | 14 dias |
| melhor-coleira-gps-sem-mensalidade ↔ coleira-gps-cachorro-pequeno-porte | 0.61 | 14 dias |
| melhor-coleira-gps-sem-mensalidade ↔ coleira-gps-para-gato | 0.61 | 14 dias |
| melhor-coleira-gps-sem-mensalidade ↔ erros-comuns-coleira-gps-pet | 0.61 | 14 dias |

Verificação manual: apesar do overlap alto, os ganchos de Reel continuam distintos — peso do dispositivo (pequeno porte) vs. alcance de rede (cão que foge) vs. estrutura de custo (sem mensalidade) vs. tecnologias combinadas (PILLAR). Nenhum par repete o mesmo ângulo.

## Qualidade editorial

Fatos usados nos 18 Reels/Posts que não estavam em heading algum: peso real de dispositivos leves (8-9,3g), raio de deslocamento noturno de gatos (~3km), janela de risco de hipoglicemia em jejum canino (~12h), tempo de atualização em modo econômico de coleira GPS (até 10 min), limite de cadastro de porta eletrônica (32 microchips). Nenhum gancho usa preço.

## Garantias mantidas

- `htmlUnchanged: true`, `affiliateUnchanged: true`.
- Nenhum `index.html`, imagem, `affiliate-products.json` ou `sitemap.xml` alterado.
- Nenhuma publicação, fila editorial, commit, push ou deploy.
- `npm test`: 68/68.
- Nenhum arquivo `.data/social-content/{slug}.json` gravado (mesmo padrão dos lotes anteriores).

## Acumulado da escala até aqui

| Etapa | Peças tentadas | Geradas | Bloqueadas | Needs review |
|---|---|---|---|---|
| Calibração 1 (3 artigos) | 6 | 6 | 0 | 0 |
| Piloto V2 completo (10 artigos) | 52 | 52 | 0 | 0 |
| Calibração 2 (10 artigos) | 60 | 48 | 12 | 0 |
| Escala — Lote 1 (9 artigos) | 54 | 40 | 14 | 0 |
| **Escala — Lote 2 (9 artigos)** | 54 | 45 | 9 | 0 |
| **Total acumulado (41 artigos)** | 226 | 191 | 40 | 0 |

Faltam **25 artigos** em ~3 lotes adicionais para completar a escala.

## Próximo passo

Aguardando sua validação deste lote antes de iniciar o Lote 3 (~9 artigos, provavelmente restante do cluster comedouro-automatico + início do cluster porta-eletronica e câmera).
