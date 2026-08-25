# Blog Audit Report — smartpetgadgets.com.br

**Data da auditoria:** 2026-08-24
**Total de posts:** 65
**Score médio (estimado):** ~82/100
**Metodologia:** análise estrutural via grep em `/home/projetos/blog/*/index.html` (title, meta description, H1/H2, alt de imagens, JSON-LD, FAQPage, BreadcrumbList, Person, canonical, OG tags, links internos/externos). Core Web Vitals e page speed reais não foram verificados nesta rodada (sem acesso a browser/Lighthouse).

---

## TL;DR

- ✅ **Pontos fortes:** 100% dos posts com alt text, meta description e schema Article/BreadcrumbList/Person.
- ⚠️ **Maior lacuna:** só 30/65 posts (46%) têm FAQPage.
- 🚨 **6 posts órfãos** sem nenhum link interno de entrada.
- 🚨 **Cluster "porta eletrônica"** (7 posts, só 2 H2 cada) com risco real de canibalização por conteúdo raso.
- 🟡 4 outros clusters com sobreposição parcial de intenção (câmera pet, comedouro automático, comedouro Wi-Fi, coleira GPS).
- 📉 **Scores mais baixos:** soprador-pet (64), cercado-para-cachorros (68), comedouro-automatico-anti-formiga (68).

---

## Health Dashboard

| Métrica | Resultado |
|---|---|
| Posts com schema completo (Article/BlogPosting + BreadcrumbList + Person) | ~65/65 |
| Posts com FAQPage | 30/65 (46%) |
| Posts com alt ausente em imagens | 0 (ponto forte) |
| Posts com meta description ausente/ruim | 0 detectado |
| Posts órfãos (zero links internos de entrada) | 6/65 (9%) |
| Clusters com risco de canibalização | 5 identificados |

---

## 🎯 Fila de Ação Priorizada (menor score primeiro)

| # | Post | Score | Problema principal | Ação recomendada |
|---|---|---|---|---|
| 1 | soprador-pet | 64 | Órfão + fora do nicho pet-tech | Adicionar links de entrada a partir de posts de cuidados/higiene; revisar se pertence ao cluster |
| 2 | cercado-para-cachorros | 68 | Órfão | Linkar a partir de hubs relacionados a cães/contenção |
| 3 | comedouro-automatico-anti-formiga | 68 | Órfão | Linkar a partir de comedouro-automatico-para-pet e comedouro-automatico-vale-a-pena |
| 4 | comedouro-automatico-para-viagem | 68 | Órfão | Linkar a partir do pillar de comedouro automático |
| 5 | comedouro-com-ou-sem-wifi | 70 | Órfão (apesar de bom conteúdo) | Linkar a partir de reviews de comedouro Wi-Fi |
| 6 | tapete-higienico-para-cachorro | 74 | Só 2 links de saída, fora do cluster central | Linkar a partir de posts de cuidados gerais com cães |
| 7 | erros-comuns-brinquedo-interativo-gato | 74 | Órfão apesar de ter FAQPage | Linkar a partir de duvidas-brinquedo-interativo-gato e brinquedo-interativo-automatico-para-gato |
| 8 | comedouro-cachorro | 76 | Só 1 link de saída | Adicionar links internos para reviews e comparativos |
| 9 | porta-eletronica-reconhecimento-facial-vale-a-pena | 79 | Só 2 H2, conteúdo raso | Expandir estrutura (mais H2) para reduzir risco de conteúdo fino |
| 10 | como-configurar-camera-pet-wifi | 79 | Apenas 3 H2 (menor do site) | Expandir seções |

---

## 🔗 Páginas Órfãs (zero links de entrada)

| Página | Links de entrada | Fontes de link recomendadas |
|---|---|---|
| soprador-pet | 0 | comedouro-automatico-para-pet, tapete-higienico-para-cachorro, cercado-para-cachorros |
| cercado-para-cachorros | 0 | comedouro-cachorro, tapete-higienico-para-cachorro, cerca-virtual-para-cachorro |
| comedouro-automatico-anti-formiga | 0 | comedouro-automatico-para-pet, comedouro-automatico-vale-a-pena, como-limpar-comedouro-automatico |
| comedouro-automatico-para-viagem | 0 | comedouro-automatico-para-pet, melhor-comedouro-automatico-cachorro, comedouro-automatico-vale-a-pena |
| comedouro-com-ou-sem-wifi | 0 | configurar-app-comedouro-wifi, comedouro-newpet-2l-review, comedouro-vdrbg-4l-wifi-review |
| erros-comuns-brinquedo-interativo-gato | 0 | duvidas-brinquedo-interativo-gato, brinquedo-interativo-automatico-para-gato, como-escolher-brinquedo-interativo-gato-entediado |

---

## ⚔️ Canibalização de Palavra-Chave

| Tema/keyword | Posts concorrentes | Recomendação |
|---|---|---|
| "porta eletrônica" (comparativos "X vs Y") | porta-eletronica-microchip-x-rfid-coleira, porta-eletronica-x-alcapao-tradicional, porta-eletronica-gato-x-cachorro-diferenca, porta-eletronica-impede-entrada-outros-animais, porta-eletronica-funciona-porta-de-vidro, porta-eletronica-sensor-de-luz-como-funciona, porta-eletronica-reconhecimento-facial-vale-a-pena | **Differentiate** — todos têm só 2 H2 (conteúdo fino); risco real de sobreposição de intenção. Priorizar aprofundar 2-3 dos mais fracos e reforçar diferenciação de intenção nos demais |
| "câmera para monitorar pet" | camera-para-monitorar-pet (hub), melhor-camera-para-monitorar-pet | **Differentiate** — títulos quase idênticos; garantir que um seja claramente "como escolher" e o outro "ranking de modelos", reforçando isso no H1/meta |
| "comedouro automático" genérico | comedouro-automatico-para-pet, melhor-comedouro-automatico-cachorro, comedouro-automatico-vale-a-pena, comedouro-com-ou-sem-wifi | **Differentiate** — ângulos diferentes, mas títulos parecidos ("Guia Completo 2026"); revisar títulos para reforçar diferenciação |
| "comedouro Wi-Fi / app" | comedouro-newpet-2l-review, comedouro-newpet-4l-review, comedouro-vdrbg-4l-wifi-review, configurar-app-comedouro-wifi, comedouro-com-ou-sem-wifi | **Differentiate** — sobreposição parcial entre configurar-app-comedouro-wifi e comedouro-com-ou-sem-wifi |
| "coleira GPS sem mensalidade/chip" | coleira-gps-para-pet (hub), coleira-gps-x-microchip, coleira-gps-bluetooth-x-chip-operadora, melhor-coleira-gps-sem-mensalidade | **Differentiate** — sobreposição parcial entre os dois últimos |

---

## 🕒 Stale Content (Freshness)

Não verificado nesta rodada — não foi possível confirmar de forma confiável os campos `dateModified`/`datePublished` em todos os 65 posts via grep em lote sem leitura individual. Recomenda-se rodar `/blog decay` (com export do Search Console) ou uma checagem dedicada de `dateModified` no schema de cada post numa próxima sessão.

---

## 📋 Scores por Post (estimativa estrutural completa)

<details>
<summary>Ver tabela completa dos 65 posts (ordenada por score decrescente)</summary>

| Post | Score | Principal problema |
|---|---|---|
| coleira-gps-para-pet | 89 | Falta FAQPage |
| duvidas-coleira-gps-pet | 89 | — |
| comedouro-automatico-para-pet | 88 | Falta FAQPage |
| porta-eletronica-automatica-para-pet | 88 | Falta FAQPage |
| camera-para-monitorar-pet | 88 | Falta FAQPage |
| brinquedo-interativo-automatico-para-gato | 87 | Falta FAQPage |
| duvidas-porta-eletronica-pet | 87 | — |
| duvidas-camera-para-monitorar-pet | 87 | — |
| melhor-comedouro-automatico-cachorro | 87 | — |
| melhor-alimentador-automatico-gatos | 87 | — |
| duvidas-brinquedo-interativo-gato | 86 | — |
| erros-comuns-coleira-gps-pet | 86 | — |
| comedouro-automatico-vale-a-pena | 86 | — |
| comedouro-newpet-4l-review | 86 | — |
| comedouro-vdrbg-4l-wifi-review | 86 | — |
| erros-comuns-porta-eletronica-pet | 85 | — |
| erros-comuns-camera-monitorar-pet | 85 | — |
| coleira-gps-x-microchip | 85 | — |
| coleira-gps-bluetooth-x-chip-operadora | 85 | — |
| melhor-bebedouro-automatico-pet | 85 | — |
| comedouro-x-bebedouro-automatico | 85 | — |
| comedouro-gato-x-cachorro-diferenca | 85 | — |
| comedouro-newpet-2l-review | 85 | — |
| cat-mate-c500-review | 85 | — |
| coleira-gps-cachorro-que-foge | 84 | — |
| coleira-gps-cachorro-pequeno-porte | 84 | — |
| coleira-gps-para-gato | 84 | — |
| como-funciona-coleira-gps-cachorro | 84 | — |
| cerca-virtual-para-cachorro | 84 | — |
| melhor-camera-para-monitorar-pet | 84 | Falta FAQPage |
| bebedouro-inox-x-ceramica | 84 | — |
| comedouro-automatico-gato-obeso | 84 | — |
| como-instalar-porta-eletronica-pet | 83 | — |
| camera-pet-x-coleira-gps-qual-escolher | 83 | Só 2 H2 |
| melhor-coleira-gps-sem-mensalidade | 83 | Falta FAQPage |
| comedouro-automatico-faz-mal | 83 | — |
| como-limpar-comedouro-automatico | 83 | — |
| porta-eletronica-gato-x-cachorro-diferenca | 82 | Só 2 H2 |
| porta-eletronica-microchip-x-rfid-coleira | 82 | Só 2 H2 |
| porta-eletronica-sensor-de-luz-como-funciona | 82 | Só 2 H2 |
| porta-eletronica-funciona-porta-de-vidro | 82 | Só 2 H2 |
| camera-pet-visao-noturna-funciona | 81 | Só 2 H2 |
| camera-pet-com-dispensador-de-petisco | 81 | Só 2 H2 |
| camera-pet-cachorro-ansiedade-separacao | 81 | Só 2 H2 |
| camera-pet-grava-sem-internet | 81 | Só 2 H2 |
| camera-pet-resolucao-1080p-x-2k | 81 | Só 2 H2 |
| configurar-app-comedouro-wifi | 82 | — |
| melhor-comedouro-interativo-gato | 82 | Só 2 H2 |
| melhor-bolinha-inteligente-para-gato | 82 | Só 2 H2 |
| como-escolher-brinquedo-interativo-gato-entediado | 82 | Só 2 H2 |
| porta-eletronica-impede-entrada-outros-animais | 80 | Só 2 H2, tema saturado |
| porta-eletronica-x-alcapao-tradicional | 80 | Só 2 H2 |
| brinquedo-automatico-cachorro-sozinho | 80 | Só 2 H2 |
| brinquedo-interativo-gato-idoso-vale-a-pena | 79 | Só 2 H2, tema fino |
| brinquedo-interativo-substitui-brincadeira-tutor | 79 | Só 2 H2 |
| brinquedo-interativo-pilha-x-recarregavel | 79 | Só 2 H2 |
| brinquedo-interativo-sensor-infravermelho-como-funciona | 79 | Só 2 H2 |
| porta-eletronica-reconhecimento-facial-vale-a-pena | 79 | Só 2 H2, conteúdo raso |
| como-configurar-camera-pet-wifi | 79 | Apenas 3 H2 (menor do site) |
| comedouro-cachorro | 76 | Poucos links de saída (1) |
| erros-comuns-brinquedo-interativo-gato | 74 | Órfão apesar de FAQPage |
| tapete-higienico-para-cachorro | 74 | Poucos links de saída (2) |
| comedouro-com-ou-sem-wifi | 70 | Órfão |
| cercado-para-cachorros | 68 | Órfão, poucos links de saída |
| comedouro-automatico-anti-formiga | 68 | Órfão |
| comedouro-automatico-para-viagem | 68 | Órfão |
| soprador-pet | 64 | Órfão, tema fora do núcleo do cluster |

</details>

---

## ⚠️ Limitações desta auditoria

- Não usa o analisador canônico `scripts/analyze_blog.py` (indisponível no ambiente sandboxed desta sessão) — scores são estimativas por sinais estruturais via grep, não substituem o scoring de 100 pontos completo.
- Core Web Vitals, page speed e mobile-friendliness reais não verificados (sem execução de browser/Lighthouse).
- Links externos (1113 ocorrências) não foram classificados por tier de fonte individualmente.
- Freshness (stale content) não verificada nesta rodada.

---

## ✅ Próximos Passos

1. Linkar os 6 posts órfãos a partir dos hubs relacionados (ver tabela de páginas órfãs acima).
2. Revisar/expandir os posts do cluster "porta eletrônica" para diferenciar intenção e sair do conteúdo fino.
3. Adicionar FAQPage nos 35 posts que ainda não têm.
4. Numa próxima sessão: rodar checagem de freshness (`dateModified`) e um score canônico mais preciso via `/blog analyze`, post a post, começando pelos de menor nota.
