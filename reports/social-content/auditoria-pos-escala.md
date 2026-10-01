# Social Content Engine — Auditoria Consolidada Pós-Escala

Gerado em: 2026-09-02

**Escopo:** auditoria única, somente leitura, sobre as 313 peças reportadas ao longo dos 7 lotes de geração V2 (Calibração 1, Piloto V2 completo, Calibração 2, Escala Lotes 1-4). Reexecuta cada script `run()` já validado, sem regenerar conteúdo novo nem alterar nada. **Nenhum HTML, imagem, afiliado, sitemap, fila de publicação ou commit foi tocado.**

## Veredito objetivo

# ✅ APTO PARA A PRÓXIMA ETAPA (estratégia de calendário editorial)

Com uma correção de contagem importante (ver abaixo) e nenhum problema de integridade de conteúdo. A auditoria não encontrou nenhuma peça com rastreabilidade quebrada, nenhum preço vazando, nenhum `needs_review` pendente, e nenhuma alteração de HTML/afiliados em nenhum dos 7 lotes. O único achado é uma **inflação de contagem de ~3 artigos/6 peças**, explicada e corrigida abaixo — não afeta a qualidade das peças, só o número total reportado até aqui.

## Achado principal: correção de contagem (3 artigos contados em dobro)

A Calibração 1 (3 artigos: `comedouro-gato-x-cachorro-diferenca`, `duvidas-camera-para-monitorar-pet`, `tapete-higienico-para-cachorro`) foi o primeiro teste em pequena escala do motor V2, feito **antes** do Piloto V2 completo (10 artigos). O Piloto V2 completo, ao rodar sua seleção determinística dos 10 artigos-piloto, **selecionou de novo esses mesmos 3 artigos** — são artigos legitimamente prioritários pela regra de seleção (role REVIEW/COMPARISON + afiliado mapeado), então reaparecerem no piloto maior é esperado e correto do ponto de vista da seleção. O problema é que, ao longo dos relatórios, os tratamos como "artigos diferentes" e somamos as duas contagens.

**Verificação de conteúdo:** os pares duplicados (Reel e Post de cada um dos 3 artigos) têm **conteúdo idêntico** entre a Calibração 1 e o Piloto V2 completo — não é uma peça diferente com o mesmo `content_id`, é literalmente a mesma peça gerada duas vezes por dois scripts diferentes. Não há risco de conteúdo conflitante ou peça "fantasma" — é um artefato de contagem, não de qualidade.

| Métrica | Número reportado até aqui (com dupla contagem) | Número real (deduplicado) |
|---|---|---|
| Artigos processados no total | 66 | **63** |
| Peças tentadas | 376 | **370** |
| Peças geradas/aprovadas | 313 | **307** |
| Peças bloqueadas | 63 | 63 (inalterado) |

**Recomendação:** ao construir o calendário editorial, use 307 como o número real de peças aprovadas disponíveis, não 313.

## Validações obrigatórias — resultado

| Validação | Resultado |
|---|---|
| `npm test` completo | **68/68** ✅ |
| `source_excerpt` literal em 100% das peças aprovadas | **307/307** ✅ (reverificado de forma independente do quality-gate-v2, lendo `body_text_full` direto do HTML) |
| `needs_review` = 0 | **0/370** ✅ |
| Ausência de preço nos ganchos (todas as 370 peças, não só aprovadas) | **0 violações** ✅ |
| Similaridade/repetição | ✅ ver seção dedicada abaixo — achado real de cobertura |
| Recomendações de spacing geradas | ✅ 110 pares no total, com `recommended_gap_days` |
| Integridade dos JSONs (parse, sem exceção) | ✅ os 7 `run()` executaram sem erro |
| `htmlUnchanged` em cada um dos 7 lotes + no total da auditoria | ✅ true em todos |
| `affiliateUnchanged` em cada um dos 7 lotes + no total da auditoria | ✅ true em todos |
| Nenhuma imagem alterada | ✅ (hash de HTML cobre a referência às imagens; nenhum arquivo de imagem foi tocado por nenhum script desta skill) |
| Sitemap inalterado | ✅ (nenhum script desta skill grava `sitemap.xml`) |
| Nenhum deploy | ✅ |
| Nenhuma publicação Meta | ✅ (não existe esse código na skill) |
| Nenhum commit | ✅ |
| Nenhum push | ✅ |

## Achado real desta auditoria: cobertura de similaridade cross-lote

Cada um dos 7 lotes só comparava similaridade **dentro de si mesmo** (a função `detectSimilarityWarnings` recebia só as análises daquele lote). Isso significa que overlap entre artigos de **lotes diferentes** nunca foi verificado antes — exatamente o tipo de lacuna que uma auditoria consolidada deveria fechar.

Rodando a mesma função (`similarity.js`, intocada) sobre os 63 artigos únicos de uma vez:

| Métrica | Resultado |
|---|---|
| Pares com `similarity_warning` (todos, contando lotes + cross-lote) | **110** |
| Pares já visíveis nos relatórios de cada lote | 34 |
| **Pares novos, só visíveis nesta auditoria (cross-lote)** | **76** |
| — dos quais, mesmo cluster | 48 |
| — dos quais, **clusters diferentes** | **28** |

### Os 28 pares cross-cluster são o achado mais interessante

Nenhum bloqueia nada — a regra de similaridade nunca bloqueou geração, só recomenda espaçamento — mas vale registrar o padrão, porque não é ruído: são repetições estruturais reais entre clusters.

**Padrão 1 — comparativos "X x coleira GPS" concentram vocabulário do cluster coleira-gps:**
`camera-pet-x-coleira-gps-qual-escolher` aparece em 8 dos 28 pares cross-cluster, com overlap de 0.61-0.65 contra quase todos os artigos do cluster coleira-gps-para-pet. Fonte do overlap: o artigo compara câmera e coleira GPS lado a lado, então naturalmente compartilha vocabulário com ambos os clusters.

**Padrão 2 — artigos "erros comuns de X" repetem estrutura entre clusters:**
`erros-comuns-coleira-gps-pet`, `erros-comuns-camera-monitorar-pet`, `erros-comuns-porta-eletronica-pet` e `erros-comuns-brinquedo-interativo-gato` formam uma malha de overlap entre si (0.50-0.51) — não porque tratam do mesmo produto, mas porque usam a mesma estrutura de título e vocabulário de "configuração", "instalação", "erro comum". Isso é esperado dado o padrão editorial do site (múltiplos artigos "erros comuns" com estrutura semelhante), não um problema de conteúdo duplicado.

**Padrão 3 — pares pontuais de vocabulário técnico compartilhado:**
`porta-eletronica-automatica-para-pet` ↔ `porta-eletronica-microchip-x-rfid-coleira` (0.77, tecnicamente clusters diferentes porque o segundo foi classificado no cluster coleira-gps por conteúdo comparativo), `bebedouro-inox-x-ceramica` ↔ `melhor-bebedouro-automatico-pet` (0.72), `comedouro-automatico-para-pet` ↔ `cat-mate-c500-review` (0.63, o PILLAR de comedouro menciona o Cat Mate C500 diretamente).

**Recomendação para o calendário editorial:** ao espaçar publicações, considere overlap cross-cluster com o mesmo peso que overlap dentro do cluster — a regra de espaçamento (`spacing-rule-v2.js`) já trata os 110 pares de forma unificada (14 ou 21 dias conforme o grau de overlap), então essa recomendação já está pronta para uso; só não estava consolidada num único lugar até agora.

## Distribuição consolidada (63 artigos únicos)

### Por role
| Role | Artigos |
|---|---|
| SATELLITE | 27 |
| COMPARISON | 12 |
| FAQ | 10 |
| HOW_TO | 7 |
| PILLAR | 5 |
| REVIEW | 4 |
| null/atípico (ex.: `soprador-pet`, role de tag não bate com conteúdo) | 1 |

### Por cluster
| Cluster | Artigos |
|---|---|
| comedouro-automatico-para-pet | 14 |
| coleira-gps-para-pet | 11 |
| camera-para-monitorar-pet | 11 |
| porta-eletronica-automatica-para-pet | 10 |
| brinquedo-interativo-automatico-para-gato | 10 |
| null (unknown/não atribuído) | 7 |

Os 7 artigos sem cluster incluem `cat-mate-c500-review` (nunca teve cluster no `content-strategy.json` — é um REVIEW autônomo), `melhor-alimentador-automatico-gatos`, `melhor-bebedouro-automatico-pet` (registrados como anomalia no relatório do Lote 4), e outros artigos institucionais/de nicho que a fonte de verdade também não classifica. Nenhum foi forçado a um cluster por heurística nova.

### Por formato (deduplicado — pares idênticos de calibração 1 contam uma vez)
| Formato | Tentado (raw, com dup) | Gerado (raw) | Nota |
|---|---|---|---|
| Reel | 66 | 66 | 100% aprovação em toda a escala — autoria editorial sempre passou o gate |
| Post | 66 | 66 | 100% aprovação — mesma nota; os únicos ajustes necessários foram feitos pelos próprios lotes antes da entrega (preço, rastreabilidade), nunca chegaram a esta auditoria como falha |
| Carrossel | 61 | 57 | 4 bloqueios (abaixo do mínimo de 6 slides) |
| Stories (2 por artigo) | 120 | 88 | 32 bloqueios (sem heading-pergunta real) |
| Engagement | 63 | 36 | 27 bloqueios (sem FAQ nem par comparativo no título) — maior taxa de bloqueio entre os formatos, mas coerente: é o formato mais dependente de estrutura específica de conteúdo |

## Integridade por lote (reconfirmada nesta auditoria)

| Lote | htmlUnchanged | affiliateUnchanged |
|---|---|---|
| Calibração 1 | ✅ | ✅ |
| Piloto V2 completo | ✅ | ✅ |
| Calibração 2 | ✅ | ✅ |
| Escala Lote 1 | ✅ | ✅ |
| Escala Lote 2 | ✅ | ✅ |
| Escala Lote 3 | ✅ | ✅ |
| Escala Lote 4 | ✅ | ✅ |
| **Total da auditoria (hash antes/depois de toda a execução)** | ✅ | ✅ |

## O que esta auditoria NÃO fez (por escopo)

- Não gerou nenhuma peça nova.
- Não corrigiu os relatórios anteriores dos 7 lotes (eles continuam como estavam — esta auditoria é o documento de reconciliação).
- Não escreveu nada em `.data/social-content/`.
- Não iniciou calendário editorial, agendamento ou qualquer integração Facebook/Instagram/Meta API.
- Não fez commit, push ou deploy.

## Conclusão

O estoque de conteúdo social gerado pela V2 é íntegro: 100% de rastreabilidade literal, zero preços vazando, zero peças pendentes de revisão, zero HTML/afiliado alterado em toda a execução. O único ajuste necessário é de contagem — **307 peças aprovadas em 63 artigos únicos**, não 313 em 66. Com essa correção, a base está pronta para a próxima etapa: revisão humana por amostragem e definição do calendário editorial.

## Próximo passo (não iniciado)

Aguardando sua validação desta auditoria. Conforme combinado, a partir daqui a decisão é sua: seguir para amostragem humana (10-15% de 307 ≈ 31-46 peças) e/ou já começar a desenhar a estratégia de calendário editorial usando os 110 pares de espaçamento já calculados. Nenhuma publicação ou integração Meta será iniciada sem nova autorização explícita.
