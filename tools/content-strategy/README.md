# Content Strategy Engine

Quinto módulo da V2 (Fase 4, recalibrado na Fase 4.1). Cruza os dados já
produzidos pelas fases 1-3 (`site-index.json`, `seo-audit.json`,
`internal-linking.json`, `cannibalization.json`) para responder: **"o que
devemos criar, melhorar ou atualizar primeiro?"**. Não escreve artigos,
não modifica HTML, não publica nada.

## Fase 4.1 — correções aplicadas

A validação manual da Fase 4 encontrou 3 problemas, todos corrigidos:

1. **P0 inflado** (`src/prioritizer.js`): a regra antiga promovia
   qualquer `DIFFERENTIATE_CONTENT` com `confidence !== 'LOW'` a P0,
   independente de envolver pilar. Substituída por
   `assignDifferentiatePriority()`: exige `involves_pillar === true` (novo
   campo calculado em `opportunities.js` a partir do `role` real das duas
   páginas do par) + score/confidence para virar P0; pares entre satélites
   vão no máximo a P1; confidence LOW nunca passa de P2.
2. **`UPDATE_EXISTING` só por INFO em institucionais**
   (`buildUpdateExistingOpportunities`): agora exige pelo menos uma issue
   não-INFO quando `page.role === 'INSTITUTIONAL'`; sem isso, a página cai
   em `NO_ACTION`.
3. **Boilerplate inflando canibalização entre temas diferentes**
   (`tools/shared/semantic-terms.js`): adicionados `pet` e `automatico`
   (e `automatica`) à lista de termos genéricos — descobertos como os
   reais responsáveis pelo falso positivo `melhor-alimentador-automatico-
   gatos` × `melhor-comedouro-automatico-cachorro` (peso 1.0 antes,
   dominava ~30% do overlap de título apesar de "gatos" × "cachorro"
   serem completamente distintos). Essa mudança é em `tools/shared/`,
   então afeta também Internal Linking e Cannibalization (módulos
   irmãos) — ambos foram reexecutados como parte da regressão desta fase.

## ⚠️ Novo achado durante a validação da Fase 4.1 (não corrigido)

Reexecutar Cannibalization com o ajuste #3 acima teve um efeito colateral
não previsto: **4 pares pilar↔satélite subiram de `possible` para
`high`** (ex: `porta-eletronica-automatica-para-pet` ↔
`porta-eletronica-impede-entrada-outros-animais`, 57→75). Causa: são
pares onde o lado satélite tem `format: informational` (sem prefixo de
slug reconhecido) — `SATELLITE_FORMATS` em
`tools/shared/format-classifier.js` não inclui `FORMATS.INFORMATIONAL`,
então `relationshipType()` nunca os reconhece como `pillar_satellite`
(fica `different_format`), e por isso a Content Strategy os promove a P0
como se fossem canibalização real entre satélites — quando na verdade são
o mesmo padrão pilar↔satélite já tratado para FAQ/REVIEW/HOW_TO/etc.
Matematicamente, descontar `pet`/`automatico` do denominador do overlap
ponderado aumentou a fração relativa para pares cujo overlap real
(não-genérico) já era alto — um efeito colateral esperável da fórmula
`interseção/mínimo`, não um bug de lógica isolado.
**Impacto real:** 4 dos 7 P0 atuais são desse tipo — ainda estritamente
melhor que os 45 P0 antes da Fase 4.1 (todos os 7 P0 agora pelo menos
envolvem um pilar de fato, o que já é o comportamento pretendido), mas a
classificação HIGH/P0 específica desses 4 pares provavelmente deveria ser
`complementary`, não conflito real.
**Não corrigido nesta rodada** — seguindo a instrução explícita de não
encadear correções indefinidamente. **Solução possível para decisão
futura:** adicionar `FORMATS.INFORMATIONAL` a `SATELLITE_FORMATS` (ou
criar uma checagem separada baseada só em `inboundCount` baixo + link já
existente com o pilar) para que páginas satélite sem prefixo de slug
reconhecido também sejam tratadas como complementares ao pilar.

## Objetivo

ANALISA → CLASSIFICA → PRIORIZA → REPORTA. Ver seção "Princípio
Fundamental" abaixo — o motor distingue "o site tem um problema" de "o
site precisa de um artigo novo".

## Princípio fundamental

Não confundir "problema" com "novo conteúdo é necessário". Exemplos
tratados explicitamente:

- FAQ ausente → `IMPROVE_FAQ` (melhorar página existente), nunca `NEW_CONTENT`.
- Baixa conectividade → `IMPROVE_INTERNAL_LINKING`, nunca `NEW_CONTENT`.
- Canibalização → `DIFFERENTIATE_CONTENT` (diferenciar), nunca exclusão automática.
- Conteúdo curto → só `EXPAND_EXISTING` com sinal COMBINADO (ver seção EXPAND_EXISTING).
- Cluster com lacuna de formato → `NEW_CONTENT`, mas só se o cluster já for
  estabelecido (pilar + >= 3 páginas) — não é keyword research.

## Fontes de dados

`.data/site-index.json` (obrigatório), `.data/seo-audit.json`,
`.data/internal-linking.json`, `.data/cannibalization.json` (opcionais —
se ausentes, o motor roda mesmo assim, com a limitação registrada em
`limitations`). Nenhum dado é recomputado: o motor só cruza o que essas
4 fases já calcularam.

## Arquitetura

```
tools/content-strategy/
├── package.json
├── README.md
├── src/
│   ├── index.js         CLI: carrega fontes, orquestra, escreve saída
│   ├── loader.js         carrega os 4 JSONs (obrigatório/opcional)
│   ├── analyzer.js        inventário editorial + visão por cluster
│   ├── classifier.js      papel editorial (PILLAR/SATELLITE/...) + cluster inferido
│   ├── scorer.js          score_breakdown determinístico (impact/strategic_value/evidence/confidence/effort)
│   ├── opportunities.js   gera candidatos por tipo (UPDATE_EXISTING, EXPAND_EXISTING, ...)
│   ├── prioritizer.js     dedup + P0-P3
│   ├── report.js          markdown
│   └── writer.js          escrita atômica (reaproveita tools/site-indexer/src/writer.js)
└── test/
    ├── loader.test.js, classifier.test.js, scorer.test.js,
    │   prioritizer.test.js, analyzer.test.js, opportunities.test.js
    └── support/helpers.js
```

**Zero dependências novas.** Reaproveita `tools/shared/format-classifier.js`
(papel/pilar), `tools/shared/profile.js` + `semantic-terms.js` (heurística
fraca de cluster), `tools/seo-auditor/src/link-graph.js` (inbound) e
`tools/site-indexer/src/writer.js` (escrita atômica).

## Papéis editoriais (`role`)

`PILLAR | SATELLITE | FAQ | REVIEW | COMPARISON | GUIDE | HOW_TO |
INSTITUTIONAL | OTHER` — mapeados 1:1 (quando possível) a partir do
`format` já calculado por `tools/shared/format-classifier.js`
(TROUBLESHOOTING/LIST/INFORMATIONAL viram `SATELLITE`; UNKNOWN vira
`OTHER`, nunca forçado).

## Inferência de cluster (3 níveis de confiança)

- **`known`**: existe uma relação `pillar_satellite` REAL, já calculada
  por Internal Linking ou Cannibalization (Fase 3) — só consultada, nunca
  recalculada aqui.
- **`probable`**: nenhuma relação real encontrada; overlap ponderado de
  slug+título com algum pilar cruza `WEAK_CLUSTER_OVERLAP_THRESHOLD`
  (0.34, conservador). Heurística fraca, explicitamente marcada como tal.
- **`unknown`**: `cluster: null`. Nunca forçado.

## Cobertura de cluster (`coverage`)

Classificação qualitativa simples (não um score): `GOOD` (tem pilar + >=3
formatos distintos + 0 páginas em status `error`), `PARTIAL` (tem pilar,
cobertura mais rasa), `THIN` (sem pilar identificado). **Não implica** que
um cluster PARTIAL/THIN precise de mais conteúdo — só descreve o que
existe hoje.

## Score (`score_breakdown`)

| Componente | Peso máx. | Critério |
|---|---:|---|
| `impact` | 30 | Severidade das evidências (CRITICAL=100%, ERROR=80%, WARNING=50%, INFO=25% do peso) |
| `strategic_value` | 25 | PILLAR=100%, INSTITUTIONAL=10%, demais escalam com `inbound_links` (satura em 15) |
| `evidence` | 20 | Satura em 4+ evidências independentes |
| `confidence` | 15 | HIGH=15, MEDIUM=9, LOW=4 |
| `effort` | 10 | Inverso ao esforço real (favorece quick wins): IMPROVE_INTERNAL_LINKING=10 → NEW_CONTENT=2 |

`total` = soma dos 5. Determinístico — mesma entrada sempre produz o
mesmo `score_breakdown`.

## Prioridades (P0-P3)

**Regra pretendida** (ver achado #1 acima para o bug atual):
- **P0**: `total >= 70` OU `DIFFERENTIATE_CONTENT` envolvendo página PILLAR com risco real.
- **P1**: `total` 50-69.
- **P2**: `total` 30-49.
- **P3**: `total < 30`, ou `NO_ACTION` (sempre P3).

## Tipos de oportunidade — matriz de decisão

| Tipo | Quando usar |
|---|---|
| `NEW_CONTENT` | Cluster estabelecido (pilar + ≥3 páginas) com formato específico ausente (FAQ/REVIEW/COMPARISON/HOW_TO) |
| `UPDATE_EXISTING` | Issues técnicas do SEO Auditor (title/description/canonical/H1/schema/alt/links quebrados) — **deveria** exigir severidade ≥ WARNING (ver achado #2) |
| `EXPAND_EXISTING` | `CONTENT_EXTREMELY_SHORT` sozinho, OU `CONTENT_SHORT` + `HEADING_STRUCTURE_THIN` juntos. Nunca `CONTENT_BRIEF` sozinho (achado da Fase 3) |
| `IMPROVE_INTERNAL_LINKING` | Página órfã (`ORPHAN_PAGE`) OU ≥3 sugestões de entrada com score ≥45 ainda não aplicadas |
| `IMPROVE_FAQ` | `FAQ_HEADING_WITHOUT_SCHEMA`/`FAQ_SCHEMA_EMPTY` (correção rápida), ou `FAQ_OPPORTUNITY` só em páginas PILLAR/REVIEW |
| `DIFFERENTIATE_CONTENT` | Par de Cannibalization com `level` `possible`/`high` (nunca `complementary`/`low`) |
| `NO_ACTION` | Página sem oportunidade gerada, status SEO ≠ `error`, só issues INFO, sem canibalização real |

## Validação real (72 páginas) — antes × depois da Fase 4.1

| Métrica | Antes (Fase 4) | Depois (Fase 4.1) |
|---|---:|---:|
| Total de oportunidades | 61 | 53 |
| No action | 8 | 17 |
| P0 | 45 | **7** |
| P1 | 1 | 6 |
| P2 | 15 | 40 |
| P3 | 0 | 0 |
| DIFFERENTIATE_CONTENT | 45 | 42 |
| UPDATE_EXISTING | 3 | **0** |
| IMPROVE_INTERNAL_LINKING | 7 | 6 |
| NEW_CONTENT | 5 | 4 |
| IMPROVE_FAQ | 1 | 1 |
| EXPAND_EXISTING | 0 | 0 |

Todos os 7 P0 atuais envolvem uma página PILLAR (confirmado
individualmente) — contra apenas 7 de 45 antes. Os 3 `UPDATE_EXISTING`
institucionais desapareceram (todos eram INFO-only) e as 3 páginas caem
corretamente em `NO_ACTION`.

## Determinismo

Executado duas vezes consecutivas; `.data/content-strategy.json` idêntico
byte a byte (exceto `generated_at`).

## Limitações

- `NEW_CONTENT` só detecta lacuna de FORMATO em cluster já estabelecido —
  não estima demanda de busca, não sugere tema/keyword específico, não
  detecta "página intermediária ausente" a partir de padrões de relação
  recorrentes (fora de escopo desta fase).
- Cluster é inferido (heurística), não lido de um campo confiável — ver
  seção "Inferência de cluster".
- `coverage` por cluster é qualitativa, não uma métrica de completude real.
- Sem volume de busca, CPC, tendências ou concorrência externa — Fase 4
  não é keyword research (ver seção do prompt).
- Sem datas de publicação/atualização no índice — "conteúdo desatualizado"
  só é detectável por sinais estruturais, não por idade.
- Herda limitações conhecidas das fases anteriores (ex: `FAQ_HEADING_
  WITHOUT_SCHEMA` na home é um falso positivo documentado desde a Fase 2 —
  o Content Strategy Engine propaga essa oportunidade fielmente, sem
  reavaliar a limitação original).

## Como executar

```bash
cd tools/content-strategy
npm install   # sem dependências de produção, mas mantém node_modules consistente
npm run strategy
```

```bash
npm run strategy -- --quiet
npm run strategy -- --help
```

## Testes

```bash
npm test
```
40 testes (`node --test`), cobrindo loader, classifier (papel + cluster,
3 níveis de confiança), scorer (determinismo, score ≠ confidence), analyzer
(inventário + coverage GOOD/THIN), opportunities (os 7 tipos, incluindo os
casos de falso positivo já corrigidos na Fase 3: `CONTENT_BRIEF` sozinho
não gera `EXPAND_EXISTING`) e prioritizer (P0-P3, dedup). Fixtures
sintéticas, não dependem dos 72 posts reais.
