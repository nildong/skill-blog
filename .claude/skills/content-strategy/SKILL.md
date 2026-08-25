---
name: content-strategy
description: Cruza site-index, seo-audit, internal-linking e cannibalization para priorizar o que criar, melhorar ou atualizar no blog, gerando .data/content-strategy.json e reports/content-strategy.md com oportunidades P0-P3. Use quando o usuário perguntar "o que devo publicar agora", "quais artigos priorizar", ou pedir uma estratégia de conteúdo. Não escreve artigos nem modifica HTML — apenas prioriza.
---

# Content Strategy Engine

Quinto módulo da V2. Responde "o que criar, melhorar ou atualizar
primeiro?" cruzando os dados já produzidos pelas fases 1-3. Não é keyword
research (sem volume de busca, sem SERP, sem API externa).

## ⚠️ Antes de usar os resultados

A Fase 4.1 corrigiu os dois problemas de calibração da Fase 4 (P0
inflado e UPDATE_EXISTING disparado só por INFO em institucionais — ver
`tools/content-strategy/README.md`, seção "Fase 4.1 — correções
aplicadas"). Um novo achado menor permanece em aberto: **4 dos 7 P0
atuais são pares pilar↔satélite onde o satélite não tem prefixo de slug
reconhecido** (`format: informational`) — provavelmente deveriam ser
`complementary`, não conflito real. Ver README, seção "Novo achado
durante a validação da Fase 4.1", antes de agir sobre esses 4 casos
específicos sem checar manualmente se são de fato pilar↔satélite.

## Quando usar

- Usuário pergunta "o que devo escrever/melhorar agora", "quais as
  prioridades editoriais", "que oportunidades de conteúdo existem".
- Depois de rodar Site Indexer, SEO Auditor, Internal Linking e
  Cannibalization (nessa ordem) — quanto mais fontes disponíveis, mais
  completa a análise (todas exceto site-index são opcionais).

## Quando NÃO usar

- Para escrever o artigo em si — este módulo só prioriza, não gera texto.
- Como fonte de volume de busca/keyword real — não existe essa camada
  ainda (ver "Fase 4 não é keyword research" no histórico do projeto).
- Para decidir sozinho excluir/consolidar páginas — `DIFFERENTIATE_CONTENT`
  nunca recomenda isso automaticamente, só diferenciação e revisão manual.

## Como executar

```bash
cd tools/content-strategy && npm install && npm run strategy
```

Requer `.data/site-index.json`. Usa `.data/seo-audit.json`,
`.data/internal-linking.json` e `.data/cannibalization.json` se existirem
(rode as skills `site-indexer`, `seo-auditor`, `internal-linking` e
`cannibalization` antes, nessa ordem, para o resultado mais completo).

## Como interpretar o resultado

- `reports/content-strategy.md` — comece por "Top 10 Opportunities" e
  "Strategic Priorities", mas revise P0 manualmente por causa do bug
  acima antes de agir sobre a lista inteira.
- Cada oportunidade tem `type`, `priority` (P0-P3), `score` +
  `score_breakdown` explicável, `confidence` (HIGH/MEDIUM/LOW — nunca
  confundir com score alto), `evidence` e `recommended_action`.
- `NO_ACTION` é um resultado legítimo, não ausência de dado — o sistema
  registra explicitamente quando não há nada a fazer numa página.
- `clusters[]` mostra cobertura por cluster (GOOD/PARTIAL/THIN) e formatos
  presentes/ausentes — útil para justificar `NEW_CONTENT`.

## Garantias

- Não acessa a internet, não usa APIs externas, não usa IA/embeddings.
- Não escreve artigos, não modifica HTML, não modifica os JSONs das fases
  anteriores, não faz deploy.
- Determinístico: mesma entrada sempre produz o mesmo
  `content-strategy.json` (exceto `generated_at`).
