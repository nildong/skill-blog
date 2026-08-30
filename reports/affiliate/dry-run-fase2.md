# Dry-run Fase 2A — de/para das 29 URLs (nenhuma alteração aplicada)

**Status:** todos os 7 `affiliate_url` necessários (1 Lista + 6 produtos) estão preenchidos com os links exatos fornecidos pelo usuário. Este dry-run mostra o plano completo de substituição. **Nenhum HTML foi alterado. Nenhum commit. Nenhum deploy.**

## Validação de segurança (executada antes deste dry-run)

| Checagem | Resultado |
|---|---|
| Os 6 produtos individuais possuem `affiliate_url` não nulo | ✅ OK |
| `list.affiliate_url` preenchido | ✅ OK — `https://meli.la/1YoZvow` |
| Os 6 IDs correspondem aos produtos corretos (nome conferido) | ✅ OK |
| Nenhum dos 7 `affiliate_url` é `null` | ✅ OK (7/7 preenchidos) |
| Nenhum link de afiliado foi construído/inferido pelo código — todos vieram literalmente do usuário | ✅ OK |
| Os 5 artigos NO_MATCH permanecem intocados (sem `affiliate_url` atribuído, sem entrada no plano de troca) | ✅ OK |
| `MLB48883369` (secundário) e `MLB63214646` (duplicado, `active:false`) seguem sem `affiliate_url` e fora do plano | ✅ OK |
| Somente os 15 artigos autorizados da Fase 2A estão no plano de alteração | ✅ OK (confirmado abaixo, 15 artigos, 22 ocorrências) |

## Grupo 1 — Produto individual (6 artigos, 9 ocorrências)

| Artigo | Anchor atual | URL atual | Destino final | `affiliate_url` exato a ser usado | Justificativa |
|---|---|---|---|---|---|
| `comedouro-automatico-gato-obeso` | "Ver no Mercado Livre →" | `lista.../comedouro-automatico-gatos?matt_word=...` | Produto: Velds 4L App (`MLB50393304`) | `https://meli.la/2CyWKk6` | App + programação de porções — recurso central para controle de peso citado no artigo. |
| `comedouro-automatico-para-dois-gatos` | "Ver no Mercado Livre →" | `lista.../comedouro-automatico?matt_word=...` | Produto: 6L 3 Tigelas (`MLB63273800`) | `https://meli.la/2hiYAmt` | Único produto da base com 3 tigelas, feito para múltiplos gatos — match direto com o título. |
| `comedouro-automatico-para-viagem` | "Ver no Mercado Livre →" | `lista.../comedouro-automatico?matt_word=...` | Produto: Alimentador 8L Wi-Fi (`MLB59318484`) | `https://meli.la/2c9hSTQ` | Maior capacidade + monitoramento remoto via app, relevante para viagem. |
| `comedouro-x-bebedouro-automatico` | "Mercado Livre" | `lista.../kit-comedouro-e-bebedouro-automatico?matt_word=...` | Produto: Kit 3L (`MLBU757044226`) | `https://meli.la/1yw2Tt1` | Artigo trata exatamente de kits combinados comedouro+bebedouro. |
| `comedouro-x-bebedouro-automatico` | "Ver no Mercado Livre →" | `lista.../kit-comedouro-e-bebedouro-automatico?matt_word=...` | Produto: Kit 3L (`MLBU757044226`) | `https://meli.la/1yw2Tt1` | (2ª ocorrência do mesmo artigo/produto) |
| `configurar-app-comedouro-wifi` | "Ver no Mercado Livre →" | `lista.../comedouro-automatico-programavel?matt_word=...` | Produto: WiFi NewPet 5L Tuya (`MLB54519773`) | `https://meli.la/17VqkwJ` | Produto da base mais ligado ao app Tuya citado no tutorial. |
| `comedouro-newpet-4l-review` | "Mercado Livre — busca \"Newpet 4L\"" | `lista.../newpet-4l?matt_word=...` | Produto: New Pet 4L principal (`MLB54558374`) | `https://meli.la/1tguuU6` | Ambiguidade resolvida pelo usuário: MLB54558374 é o produto principal entre os 3 anúncios equivalentes. |
| `comedouro-newpet-4l-review` | "Mercado Livre — busca \"Newpet 4L\"" (2ª) | `lista.../newpet-4l?matt_word=...` | Produto: New Pet 4L principal (`MLB54558374`) | `https://meli.la/1tguuU6` | (2ª ocorrência) |
| `comedouro-newpet-4l-review` | "Ver no Mercado Livre →" | `lista.../newpet-4l?matt_word=...` | Produto: New Pet 4L principal (`MLB54558374`) | `https://meli.la/1tguuU6` | (3ª ocorrência) |

**Subtotal Grupo 1:** 9 ocorrências em 6 artigos.

## Grupo 2 — Lista de Afiliados (9 artigos, 13 ocorrências)

| Artigo | Anchor atual | URL atual | Destino final | `affiliate_url` exato a ser usado | Justificativa |
|---|---|---|---|---|---|
| `comedouro-automatico-anti-formiga` | "Ver no Mercado Livre →" | `lista.../comedouro-anti-formiga?matt_word=...` | Lista de Afiliados | `https://meli.la/1YoZvow` | Educativo, não recomenda 1 modelo. |
| `comedouro-automatico-faz-mal` | "Ver no Mercado Livre →" | `lista.../comedouro-automatico?matt_word=...` | Lista de Afiliados | `https://meli.la/1YoZvow` | Riscos gerais da categoria, não 1 produto. |
| `comedouro-automatico-para-pet` | "Mercado Livre — Comedouro Automático" | `lista.../comedouro-automatico?matt_word=...` | Lista de Afiliados | `https://meli.la/1YoZvow` | Guia pilar/comparativo amplo. |
| `comedouro-automatico-para-pet` | "Mercado Livre — Comedouro Automático" (2ª) | `lista.../comedouro-automatico?matt_word=...` | Lista de Afiliados | `https://meli.la/1YoZvow` | (2ª ocorrência) |
| `comedouro-automatico-para-pet` | "Ver no Mercado Livre →" | `lista.../comedouro-automatico?matt_word=...` | Lista de Afiliados | `https://meli.la/1YoZvow` | (3ª ocorrência) |
| `comedouro-automatico-vale-a-pena` | "Ver no Mercado Livre →" | `lista.../comedouro-automatico?matt_word=...` | Lista de Afiliados | `https://meli.la/1YoZvow` | Avalia a categoria inteira, não um modelo. |
| `comedouro-gato-x-cachorro-diferenca` | "Ver no Mercado Livre →" | `lista.../comedouro-automatico?matt_word=...` | Lista de Afiliados | `https://meli.la/1YoZvow` | Compara categorias por espécie. |
| `como-limpar-comedouro-automatico` | "Ver no Mercado Livre →" | `lista.../comedouro-automatico?matt_word=...` | Lista de Afiliados | `https://meli.la/1YoZvow` | Baixa intenção comercial direta. |
| `melhor-alimentador-automatico-gatos` | "Mercado Livre — Comedouro Automático Gatos" | `lista.../comedouro-automatico-gatos?matt_word=...` | Lista de Afiliados | `https://meli.la/1YoZvow` | Comparativo explícito de mais vendidos. |
| `melhor-alimentador-automatico-gatos` | "Ver no Mercado Livre →" | `lista.../comedouro-automatico-gatos?matt_word=...` | Lista de Afiliados | `https://meli.la/1YoZvow` | (2ª ocorrência) |
| `melhor-comedouro-automatico-cachorro` | "Mercado Livre — Comedouro Automático" | `lista.../comedouro-automatico?matt_word=...` | Lista de Afiliados | `https://meli.la/1YoZvow` | Comparativo explícito por faixa de preço/recurso. |
| `melhor-comedouro-automatico-cachorro` | "Ver no Mercado Livre →" | `lista.../comedouro-automatico?matt_word=...` | Lista de Afiliados | `https://meli.la/1YoZvow` | (2ª ocorrência) |
| `comedouro-com-ou-sem-wifi` | "Ver no Mercado Livre →" | `lista.../comedouro-automatico?matt_word=...` | Lista de Afiliados (CTA principal) | `https://meli.la/1YoZvow` | Comparação de categorias; sem CTA duplo. Menção contextual ao Velds 4L (`MLB50393304`, `https://meli.la/2CyWKk6`) pode ser inserida no corpo do texto, sem virar um segundo botão. |

**Subtotal Grupo 2:** 13 ocorrências em 9 artigos.

## Grupo 3 — NO_MATCH, intocados (5 artigos, 7 ocorrências)

| Artigo | Ocorrências | URL atual | Ação |
|---|---|---|---|
| `cat-mate-c500-review` | 2 | `lista.../cat-mate-c500?matt_word=...` | Sem alteração — Fase 2B |
| `comedouro-newpet-2l-review` | 2 | `lista.../newpet-2l?matt_word=...` | Sem alteração — Fase 2B |
| `comedouro-vdrbg-4l-wifi-review` | 2 | `lista.../comedouro-automatico-programavel?matt_word=...` | Sem alteração — Fase 2B |
| `melhor-comedouro-interativo-gato` | 1 | `lista.../comedouro-interativo-gato?matt_word=...` | Sem alteração — Fase 2B |
| `comedouro-cachorro` | 0 | (sem link hoje) | Sem alteração — Fase 2B (confirmado NO_MATCH pelo conteúdo: kit manual, não eletrônico) |

**Subtotal Grupo 3:** 7 ocorrências em 4 artigos + 1 artigo órfão sem link.

## Conferência final

| Grupo | Artigos | Ocorrências |
|---|---|---|
| Grupo 1 — produto individual | 6 | 9 |
| Grupo 2 — Lista de Afiliados | 9 | 13 |
| **Total autorizado para Fase 2A** | **15** | **22** |
| Grupo 3 — NO_MATCH (intocado) | 5 | 7 |
| **Total geral** | **20** | **29** ✅ bate com a Fase 1 |

## `affiliate_url` usados neste plano (referência rápida)

| ID / Lista | `affiliate_url` |
|---|---|
| Lista "COMEDOUROS AUTO P GATOS" | `https://meli.la/1YoZvow` |
| `MLB50393304` (Velds 4L App) | `https://meli.la/2CyWKk6` |
| `MLB63273800` (6L 3 Tigelas) | `https://meli.la/2hiYAmt` |
| `MLB59318484` (Alimentador 8L Wi-Fi) | `https://meli.la/2c9hSTQ` |
| `MLBU757044226` (Kit 3L) | `https://meli.la/1yw2Tt1` |
| `MLB54519773` (WiFi NewPet 5L Tuya) | `https://meli.la/17VqkwJ` |
| `MLB54558374` (New Pet 4L principal) | `https://meli.la/1tguuU6` |

Todos copiados literalmente de `.data/affiliate-products.json`, sem nenhuma modificação.

---

**Nenhum HTML foi alterado nesta etapa. Nenhum commit ou deploy foi feito.** Este relatório é a etapa "mostre antes de tocar" solicitada — a execução real (edição dos 15 arquivos `index.html`, geração de diff, backup e testes) só deve começar com uma autorização explícita separada para a Fase 2A.
