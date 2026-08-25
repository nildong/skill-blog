# Calendário Editorial: Setembro 2026 — Smart Pet Gadgets

## Contexto
- Site: 1 post publicado (`comedouro-cachorro`), infraestrutura 100% estática (SFTP), operação solo.
- Posicionamento: blog de cuidados gerais para cães e gatos, com reviews de produto como formato principal e guias educativos de apoio (afiliado: Mercado Livre).
- Cadência recomendada: **2 posts/semana** é o teto realista pra operação solo com deploy manual. Se a rotina apertar, caia para 1/semana em vez de atrasar publicações — consistência importa mais que volume.

## Progresso dos clusters
| Cluster | Pilar | Spokes publicados | Spokes planejados (set/26) | Cobertura |
|---|---|---|---|---|
| Alimentação Canina | Publicado (`comedouro-cachorro`) | 0/3 | 3 | 0% → prioridade máxima este mês |
| Saúde e Peso | Não iniciado | 0/2 | 1 | 0% |
| Higiene e Bem-estar | Não iniciado | 0/2 | 1 | 0% |
| Comportamento/Enriquecimento (gatos) | Não iniciado | 0/2 | 1 | 0% |

Regra aplicada: como nenhum cluster passou de 50%, priorizei completar o cluster **Alimentação Canina** (que já tem pilar publicado e 3 âncoras de texto esperando virar links reais no post atual) antes de abrir os outros dois clusters.

## Semana 1 (31/ago–06/set)
| Dia | Tipo | Título | Template | Cluster | Palavra-chave alvo | Status |
|---|---|---|---|---|---|---|
| Ter | Novo | Comedouro Elevado Individual para Cachorro: Guia de Compra 2026 | product-review | Alimentação Canina | comedouro elevado individual para cachorro | Brief |
| Sex | Novo | Melhores Bebedouros Automáticos para Cachorro: Comparativo 2026 | comparison | Alimentação Canina | bebedouro automático para cachorro | Brief |

## Semana 2 (07–13/set)
| Dia | Tipo | Título | Template | Cluster | Palavra-chave alvo | Status |
|---|---|---|---|---|---|---|
| Ter | Novo | Como Organizar a Alimentação de Vários Cães (Canil, ONG ou Casa Multi-pet) | how-to-guide | Alimentação Canina | organizar alimentação de vários cães | Brief |
| Sex | Novo | Como Saber se Meu Cachorro Está Acima do Peso: Sinais e Quando Procurar o Vet | how-to-guide | Saúde e Peso | cachorro acima do peso | Brief |

## Semana 3 (14–20/set)
| Dia | Tipo | Título | Template | Cluster | Palavra-chave alvo | Status |
|---|---|---|---|---|---|---|
| Ter | Novo | Meu Gato Está com Sobrepeso? Como Identificar e o Que Fazer | how-to-guide | Saúde e Peso | gato com sobrepeso | Brief |
| Sex | Atualização | Revisar `comedouro-cachorro`: checar preço/disponibilidade do anúncio, confirmar dados de mercado ainda vigentes | - | Alimentação Canina | comedouro para cachorro | Refresh |

## Semana 4 (21–27/set)
| Dia | Tipo | Título | Template | Cluster | Palavra-chave alvo | Status |
|---|---|---|---|---|---|---|
| Ter | Novo | Melhores Tapetes Higiênicos para Cachorro: Como Escolher | product-review | Higiene e Bem-estar | tapete higiênico para cachorro | Brief |
| Sex | Novo | Brinquedos Interativos para Gato Entediado: Guia de Enriquecimento Ambiental | listicle | Comportamento/Enriquecimento | brinquedos interativos para gato | Brief |

## Mix de conteúdo do mês
- Novos: 7
- Atualizações de freshness: 1 (o único post existente — checagem de preço/disponibilidade do anúncio, não reescrita completa)
- Repurposed: 0 (ainda não há conteúdo suficiente publicado para reaproveitar; volta a entrar no mix a partir de outubro)
- Tipos: 3 product-review/comparison, 4 how-to-guide, 1 listicle

## Fila de atualização por mudança material
| Post | Gatilho de revisão | Evidência | Prioridade | Quando |
|---|---|---|---|---|
| `comedouro-cachorro` | Preço/disponibilidade do anúncio no Mercado Livre muda com frequência | Link de afiliado aponta pra oferta específica | Média | Semana 3 |

## Ganchos sazonais
- **Outubro** = mês de conscientização sobre adoção responsável no Brasil (boa janela pra pauta de comportamento/adaptação de pet adotado) — planejar com 4-6 semanas de antecedência a partir de agora.
- Nenhum outro gancho sazonal forte identificado para setembro no nicho pet; não force uma pauta sazonal só para preencher calendário.

## Distribuição
| Post | Publicação | LinkedIn | Reddit (r/pets, r/dogs BR) | Newsletter |
|---|---|---|---|---|
| Todos os novos | Dia de publicação | Mesmo dia | +2-3 dias (insight genuíno, não link solto) | Ainda não há lista — avaliar criação a partir de 3-4 posts publicados |

## Próximos passos
1. `/blog brief comedouro elevado individual para cachorro` para o primeiro item da Semana 1
2. `/blog write` a partir do brief aprovado
3. Repetir o padrão brief → write → seo-check → deploy.sh para cada item
4. Reavaliar este calendário no fim de setembro e gerar o de outubro
