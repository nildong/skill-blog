# tools/shared

Utilitários pequenos, reutilizados por `tools/internal-linking` e
`tools/cannibalization` (Fase 3 da V2). Não é um módulo com CLI própria —
só um ponto único de código compartilhado, evitando duplicar a mesma
lógica de extração de texto/termos nos dois módulos analíticos.

## Por que este módulo existe

`tools/site-indexer` (Fase 1) guarda em `site-index.json` apenas
`word_count` (contagem), não o texto bruto do body — decisão deliberada
da Fase 1 para manter o índice enxuto. Internal Linking e Cannibalization
precisam do texto real para calcular sobreposição de termos de conteúdo,
então esta pasta oferece:

- `html-text.js` — reextrai o texto plano do `<body>` de um `index.html`
  (mesmo critério de exclusão de tags do parser do Site Indexer:
  script/style/noscript/nav/header/footer/svg fora). É uma reimplementação
  **deliberadamente mínima** (só texto, não a estrutura inteira) — não
  duplica o parser completo do Site Indexer, só a parte que falta.
- `terms.js` — stopwords em português, tokenização, extração de termos
  (bag of words com frequência) e coeficiente de overlap BRUTO entre dois
  conjuntos de termos.
- `profile.js` — combina site-index.json (title/headings/slug) + texto do
  body num único "perfil de termos" por página, usado como entrada para os
  scorers de Internal Linking e Cannibalization.
- `semantic-terms.js` (Fase 3.1) — camada de peso editorial sobre os
  termos: `weightedOverlapCoefficient` e `sharedTermsWeighted` descontam
  termos genéricos ("guia", "completo", "melhor"...) e anos, resolvendo o
  falso positivo de páginas não relacionadas inflando score só por
  compartilhar frases padrão do site.
- `format-classifier.js` (Fase 3.1) — `detectFormat(post, {inboundCount})`
  classifica cada página em `pillar | faq | troubleshooting | comparison |
  review | list | how_to | guide | informational | institutional |
  unknown`, e `relationshipType(formatA, formatB)` identifica relações
  pilar↔satélite ou formatos diferenciados — usado por Internal Linking
  (bônus de score) e Cannibalization (nível `complementary`) para não
  tratar a arquitetura intencional pilar→satélite do site como conflito.

## Dependência

`cheerio@1.0.0` (mesma versão pinada usada em `tools/site-indexer` —
Node 18 no ambiente exige essa versão, `cheerio@1.2.0` requer Node ≥20.18).
Instalada aqui, em `tools/shared/node_modules`, porque os módulos que
`require()` estes arquivos por caminho relativo (`../../shared/...`)
resolvem dependências a partir da localização do próprio arquivo.

## Uso

Não tem CLI. É consumido via `require('../../shared/terms')` etc. a
partir de `tools/internal-linking/src/*` e `tools/cannibalization/src/*`.
