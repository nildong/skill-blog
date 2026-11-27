# Plano de Ação — smartpetgadgets.com.br

Correções priorizadas a partir da auditoria SEO completa (Health Score 83/100, SXO Gap Score 58/100). Ver `FULL-AUDIT-REPORT.pt-BR.md` para evidências e `findings/*.md` para detalhes por categoria.

---

## Fase 1: Correções Críticas (Semana 1)

| # | Item | Por quê | Esforço |
|---|---|---|---|
| 1 | Substituir o `AggregateRating` fabricado (4,8★/5.501 avaliações) em `coleira-seresto-antipulgas` pelo padrão de `Review` único já correto em 7 outros posts de review | Risco de ação manual do Google sobre rich results de review **em todo o site** | P |
| 2 | Auditar os 77 posts em busca de outras instâncias de avaliação copiada/fabricada | O mesmo risco de política pode se repetir em outros lugares sem ser notado | P |
| 3 | Corrigir o CSS do modo escuro para que o texto do logo "Smart Pet" fique visível contra o fundo escuro | O logo está atualmente invisível para todo visitante em modo escuro | PP |
| 4 | Remover o schema depreciado `HowTo`/`HowToStep` de `configurar-app-comedouro-wifi` | Zero valor de rich result desde setembro de 2023, peso morto | PP |
| 5 | Reescrever título/meta de `/cerca-virtual-para-cachorro/` (53 impr, pos 9,8, 0 cliques/90d) | Candidato mais evidente de zero-CTR-apesar-da-visibilidade, mesmo tratamento dos 3 posts já corrigidos | P |

## Fase 2: Melhorias de Alto Impacto (Semanas 2-3)

| # | Item | Por quê | Esforço |
|---|---|---|---|
| 6 | Reescrever título/meta de `/comedouro-automatico-para-dois-gatos/`, `/soprador-para-pet/`, `/como-limpar-comedouro-automatico/` | Próximo nível de candidatos a zero-CTR (pos <9, 32-46 impr, 0 cliques) | P |
| 7 | Reconstruir `/melhor-comedouro-automatico-cachorro/` e `/melhor-alimentador-automatico-gatos/` como listicles rankeados de verdade (6-8 produtos nomeados, imagem/preço/veredito por produto, schema `ItemList`+`Product`+`Review`, CTAs "Ver preço" em destaque) | Descompasso CRÍTICO de SXO nas queries de maior valor comercial do site; `/comedouro-vdrbg-4l-wifi-review/` prova que o padrão funciona internamente | M |
| 8 | Expandir a bio do autor com credenciais/experiência concretas; considerar um aviso de revisão veterinária em posts relacionados à saúde | A autoria rasa é um risco real de E-E-A-T em conteúdo pet-saúde YMYL-adjacente | M |
| 9 | Resolver afirmações não verificáveis de "testamos/comparamos" — adicionar evidência real de teste (fotos, medições) ou suavizar a linguagem para corresponder ao modelo editorial real de pesquisa de mesa | Evita contradizer o próprio processo declarado do site; caso contrário é um marcador reconhecido de conteúdo de baixa qualidade | M |
| 10 | Regenerar o `llms.txt` a partir do `site-index.json` para listar os 77 artigos | O stub atual lista 6 páginas utilitárias, anulando seu propósito | P |
| 11 | Preencher `Organization.sameAs` com a página do Facebook no ar (`@smartpetgadgetsbr`) | Sinal gratuito de entidade/autoridade, atualmente um array vazio (pior do que omitir) | PP |
| 12 | Densificar os links internos do cluster de câmera: hub→spoke ausente, malha spoke-a-spoke, elevar `melhor-camera-para-monitorar-pet` para 5+ links de entrada | Cluster é uma casca estrutural (26 conexões vs. 62 na referência Coleira GPS) | M |
| 13 | Adicionar 3 links de entrada contextuais à página órfã `cercado-para-cachorros` | Atualmente 0 links de entrada, invisível ao PageRank interno | PP |
| 14 | Fechar 4 lacunas de link hub-spoke no comedouro, priorizando os 2 posts de review afiliados | Maior cluster (20 posts), lacunas mensuráveis no grafo de links | P |
| 15 | Montar uma presença modesta fora do site (shorts no YouTube reaproveitando conteúdo existente, participação em comunidades pet relevantes no Brasil) | Presença zero em terceiros limita a citação por IA (ChatGPT/Perplexity) independentemente da qualidade on-page | G |
| 16 | Adicionar arquivo de chave IndexNow e integrar o push-indexing ao fluxo de publicação | Automação barata dado que o processo de deploy em HTML estático já existe | P |

## Fase 3: Conteúdo e Autoridade (Mês 2)

| # | Item | Por quê | Esforço |
|---|---|---|---|
| 17 | Adicionar tabelas comparativas aos posts de review/comparação | Atende SXO (persona Tutor Pronto para Comprar) e GEO (extração por AI Overview/Perplexity) simultaneamente | M |
| 18 | Adicionar 1 imagem de produto por item comparado em posts com poucas imagens (ex.: `melhor-antipulgas-para-cachorro`: 4 imagens/1.656 palavras; `coleira-gps-para-pet`: 1 imagem) | Lacuna competitiva frente a SERPs de marketplace/listicle que mostram 5-10 fotos de produto | M |
| 19 | Dar a antipulgas (3 posts) e tapete higiênico (2 posts) um pilar definido + links bidirecionais | Nenhuma estrutura hub-and-spoke atualmente; `melhor-tapete` é um beco sem saída (0 links de saída) | P |
| 20 | Diferenciar as 3 páginas comerciais de lista de coleira-GPS que se sobrepõem, via títulos/modificadores mais nítidos (porte/fuga/sem-mensalidade) + links explícitos "veja também" | Pares de canibalização em nível "possível" (score até 67); não precisa fundir, só diferenciar melhor | P |
| 21 | Cortar a meta description de 221 caracteres de `melhor-antipulgas-para-cachorro`; varrer as 76 URLs restantes em busca do mesmo padrão de excesso | Risco de truncamento do snippet na SERP | P |
| 22 | Expandir páginas utilitárias rasas (`/sobre`, `/contato`) e posts de FAQ com menos de 600 palavras | Conecta com a correção de credibilidade do autor (#8); atualmente dependem demais de atribuição a terceiros | P |
| 23 | Enriquecer a entidade de schema Person (image, sameAs) na página do autor | Correção de uma única entidade beneficia os 77 posts que a referenciam | P |
| 24 | Converter em lote as imagens de hero legadas em `.jpg` restantes para WebP; otimizar/pré-carregar a imagem de hero da home | O PSI aponta 376-1.668 KiB de economia potencial na entrega de imagens | M |
| 25 | Adicionar schema FAQPage aos 6 posts que ainda não têm | Consistência; observação: o FAQPage perdeu seu benefício de rich result na SERP em maio de 2026, então isso é para estrutura de citação por IA, não para snippets de SERP | P |

## Fase 4: Monitoramento e Iteração (Contínuo)

| # | Item | Por quê |
|---|---|---|
| 26 | Habilitar a Chrome UX Report API no projeto do Google Cloud (atualmente 403, não o 404 esperado) | Desbloqueia dados reais de campo de CWV para auditorias futuras |
| 27 | Retestar o comportamento do GPTBot com requisições espaçadas (1 a cada poucos segundos); escalar para a Hostinger se os 429 se repetirem | Confirmar se os 429 observados foram artefatos de rate-limit, não um bloqueio real por UA |
| 28 | Acompanhar a posição média no GSC de `/cerca-virtual-para-cachorro/` como o sinal mais precoce de recuperação de ranking | Página mais próxima do top-10, melhor indicador antecipado de que as correções de título/meta estão funcionando |
| 29 | Rodar novamente `content-strategy.json`/`cannibalization.json` após as correções de link do cluster | Confirmar que nenhuma sobreposição nova foi introduzida pelas mudanças de link interno |
| 30 | Monitorar a melhora de CTR nas páginas reescritas, de acordo com o padrão de correção já aplicado aos 3 posts anteriores | Valida a abordagem de reescrita de título/meta das Fases 1-2 antes de aplicá-la ao site inteiro |
| 31 | Adicionar uma chave gratuita da Moz (ou similar) para mover a análise de backlinks do Tier 0 (só Common Crawl) para o Tier 1 | A auditoria de backlinks atual não tem dados suficientes para um score numérico; isso desbloqueia um |
| 32 | Adicionar `ga4_property_id` para desbloquear dados de tráfego orgânico/páginas de destino do GA4 | Atualmente indisponível, limita uma visão mais completa do comportamento de conversão orgânica |

---

## Explicitamente adiado (não aplicar mecanicamente)
- **Catalogação dos links de afiliado do comedouro** (63 de 76 posts com links `meli.la` não catalogados) — confirmado tanto pelo subagente de e-commerce quanto pelo de SXO como um problema de profundidade de conteúdo, não de rastreamento de links. Corrigir como parte do padrão de reformulação do item #7 (usando o VDRBG como modelo), não como uma atualização mecânica isolada de catálogo. Isso está alinhado com a decisão de pausa já existente.

---
*Legenda de esforço: PP = Muito Pequeno, P = Pequeno, M = Médio, G = Grande*
