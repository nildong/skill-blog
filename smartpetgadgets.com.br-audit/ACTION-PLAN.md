# Plano de Ação — smartpetgadgets.com.br

Baseado na auditoria SEO completa de 2026-09-30 (claude-seo v2.4.1). Health Score: 86/100.

## Fase 1 — Correções Críticas (Semana 1)

- [ ] **Remover o `AggregateRating` copiado** em `/coleira-seresto-antipulgas/` (4,8★, 5.501 avaliações) — risco de ação manual do Google por dados estruturados enganosos. Manter apenas o `Review` editorial, no mesmo padrão das outras 7 páginas de produto.
- [ ] **Popular `Organization.sameAs`** no schema da home com a URL do Facebook (`@smartpetgadgetsbr`).
- [ ] **Corrigir o 403 no índice `/autores/`** (a página individual `/autores/nildo-alves/` funciona, o hub não).

## Fase 2 — Melhorias de Alto Impacto (Semanas 2-3)

- [ ] **Reconstruir páginas de termos comerciais de cabeça** (`melhor-antipulgas-para-cachorro`, `comedouro-automatico-para-pet`, `melhor-coleira-gps-sem-mensalidade`) como listicles completos (5-8 itens) com tabela comparativa acima da dobra e CTAs claros ("Ver preço"). Esse é o maior gap identificado (SXO 56/100) — os SERPs desses termos são dominados por marketplaces e listicles amplos de concorrentes com mais autoridade.
- [ ] **Adicionar imagens de produto** por item comparado nas páginas reconstruídas.
- [ ] **Cortar a meta description de `melhor-antipulgas-para-cachorro`** de 221 para ~155 caracteres; varrer as 76 URLs em busca do mesmo padrão de descrição longa.
- [ ] **Expandir artigos satélites finos** (500-903 palavras) ou consolidá-los dentro dos artigos-pilar correspondentes.

## Fase 3 — Conteúdo e Autoridade (Mês 2)

- [ ] **Adicionar sinais reais de experiência prática** com os produtos (fotos próprias, notas de uso) onde for viável — ou reformular explicitamente os posts como análise comparativa de especificações em vez de review implícito de uso real.
- [ ] **Construir presença de marca** começando pelo YouTube (maior correlação com citação em IA), aproveitando os ativos de conteúdo já existentes.
- [ ] **Expandir o `llms.txt`** para representar o catálogo real de artigos (ou aposentá-lo — não tem peso no Google de qualquer forma).
- [ ] **Implementar IndexNow** para pickup mais rápido no Bing/Copilot.

## Fase 4 — Monitoramento e Iteração (Contínuo)

- [ ] Verificar habilitação da API CrUX no Google Cloud Console; repuxar dados de campo de CWV assim que o tráfego crescer.
- [ ] Acompanhar "cerca virtual para cachorro" (atualmente posição 11,1) como a candidata mais próxima de furar para a página 1.
- [ ] Rodar Search Analytics do GSC mensalmente para acompanhar movimento de posição/CTR nas páginas de termos de cabeça após a reconstrução.
- [ ] Padronizar o tipo de `Review.author` (Person vs Organization) em todas as páginas de review de produto.

---

**Prioridade #1 de negócio:** o site está tecnicamente saudável (92/100 técnico, 98/100 performance, 100% indexado). O próximo ciclo de trabalho deve ser quase todo em **conteúdo/formato** (Fase 2) — é onde está o maior gap (SXO 56/100) e onde o retorno em ranking/cliques é mais provável, dado que os termos de cauda longa já convertem bem no formato atual.
