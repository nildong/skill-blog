# Internal Linking Engine

Terceiro módulo da V2 (Fase 3), junto com `tools/cannibalization`. Consome
`.data/site-index.json` (Site Indexer) e `.data/seo-audit.json` (SEO
Auditor, opcional — usado para priorizar páginas órfãs) e produz sugestões
analíticas de link interno: `.data/internal-linking.json` e
`reports/internal-linking.md`.

## Objetivo

ANALISA → IDENTIFICA → RANQUEIA → SUGERE → REPORTA. **Nunca insere, remove
ou altera** links, anchors ou qualquer conteúdo de nenhum artigo. Toda
saída é sugestão para revisão humana.

## Algoritmo (determinístico, local, explicável)

1. **Perfil de página** (`tools/shared/profile.js`): combina `title`,
   `headings`, `slug` (de `site-index.json`) com o texto do `<body>`
   (reextraído via `tools/shared/html-text.js`, já que o índice guarda só
   `word_count`, não o texto bruto).
2. **Tokenização** (`tools/shared/terms.js`): minúsculas, sem acento, sem
   pontuação, removendo stopwords em português (lista documentada abaixo).
3. **Score de relação** (`src/scorer.js`): coeficiente de overlap
   (`|A∩B| / min(|A|,|B|)`) entre os termos de title, heading, slug e
   conteúdo dos dois posts, mais um bônus se `cluster` for igual e
   não-nulo. Cada componente tem peso documentado (ver tabela abaixo);
   soma final arredondada para 0-100.
4. **Filtros**: nunca self-link; nunca sugere `A→B` se `A` já linka para
   `B` (usa o mesmo normalizador de URL do SEO Auditor,
   `tools/seo-auditor/src/link-graph.js`, reaproveitado em vez de
   duplicado); só posts (`page_type: post`) geram sugestões como origem.
5. **Priorização de órfãs**: se `seo-audit.json` estiver disponível,
   sugestões cujo destino é uma página `ORPHAN_PAGE` (sem nenhum inbound)
   vêm primeiro na lista dessa página de origem — "prioridade máxima",
   conforme pedido, mas ainda **apenas como sugestão**, nunca como link
   automático.
6. **Limite de 5 sugestões por página de origem** (`MAX_SUGGESTIONS_PER_PAGE`
   em `src/analyzer.js`): mais que isso tende a diluir a atenção editorial
   e incentiva adicionar links de baixa qualidade só para preencher a
   cota. Dentro do limite, órfãs vêm primeiro, depois ordenado por score.

Não usa LLM, não usa API de embeddings externa, não acessa a internet.

## Pesos do score (documentados, não calibrados estatisticamente)

| Componente | Peso | Por quê |
|---|---:|---|
| Title overlap | 30 | Reflete do que a página trata de fato (sinal editorial explícito) |
| Heading overlap | 25 | Mesmo motivo que title, um nível abaixo |
| Content overlap | 20 | Pesa menos — corpo de texto longo e ruidoso, tende a supervalorizar termos genéricos do nicho |
| Slug overlap | 10 | Sinal fraco mas barato e confiável quando presente |
| Cluster match (bônus binário) | 15 | Só soma se `cluster` for igual e não-nulo nos dois lados |
| Pillar↔satellite (bônus binário, Fase 3.1) | 10 | Só soma se `tools/shared/format-classifier.js` identificar relação pilar↔satélite **e** o overlap de base (sem o bônus) já for >= `PILLAR_SATELLITE_MIN_BASE` (35) — guarda que impede o bônus de "resgatar" sozinho um par sem relação temática real (achado real da validação, ver seção Fase 3.1 abaixo) |

Soma nominal = 110 (100 + bônus pillar_satellite), sempre clampada a 100.
`MIN_SCORE = 35` (abaixo disso a relação é fraca demais para virar
sugestão). Todos os overlaps usam a versão PONDERADA
(`tools/shared/semantic-terms.js`) — termos genéricos/editoriais e anos
contam pouco ou nada, não a versão bruta de `tools/shared/terms.js`.

## Fase 3.1 — calibração de qualidade (histórico)

A validação manual da Fase 3 encontrou um falso positivo real: páginas-
pilar de clusters completamente diferentes (`coleira-gps-para-pet` vs
`melhor-comedouro-interativo-gato`) recebendo sugestão de link só por
compartilharem "Guia Completo 2026" e vocabulário genérico do nicho.
Corrigido em duas camadas:

1. Troca de `overlapCoefficient` (bruto) por `weightedOverlapCoefficient`
   (`tools/shared/semantic-terms.js`) em todos os componentes de texto.
2. Adição do bônus `PILLAR_SATELLITE`, que a princípio reintroduziu um
   falso positivo residual — o bônus sozinho conseguia empurrar pares sem
   overlap textual real (32.5/100 de base) para acima do `MIN_SCORE` só
   por um lado ser pilar e o outro satélite de **qualquer** cluster.
   Corrigido com a guarda `PILLAR_SATELLITE_MIN_BASE`: o bônus só se
   aplica se o par já teria pelo menos overlap textual moderado sem ele.

## Stopwords em português

Lista conservadora em `tools/shared/terms.js` (`STOPWORDS_PT`): artigos,
preposições, conjunções, pronomes e verbos auxiliares muito comuns (de,
da, do, para, com, em, um, uma, que, como, por, e, ou, é, são, este, esse,
etc. — lista completa no arquivo). **Nenhum termo do nicho pet é removido**
— "pet", "cão", "gato", "coleira", "comedouro" etc. sempre contam como
termos relevantes.

## Anchor text sugerido

Preferência: (1) o `<title>` da página destino se tiver até 8 palavras;
(2) um `<h2>` da página destino, se o title for mais longo; (3) fallback
para o title mesmo assim. Nunca retorna um anchor da lista de genéricos
("clique aqui", "saiba mais", "veja aqui", "confira", "leia mais", "aqui")
— se o candidato bater nessa lista, cai para o slug legível.

## Formato de saída

`.data/internal-linking.json`:
```jsonc
{
  "version": 1,
  "generated_at": "...",
  "summary": { "pages_analyzed": 72, "suggestions": 179, "orphan_target_suggestions": 0 },
  "suggestions": [
    {
      "source": "/erros-comuns-porta-eletronica-pet/",
      "target": "/como-instalar-porta-eletronica-pet/",
      "score": 59,
      "score_breakdown": { "title": 12.9, "heading": 8.3, "content": 6.7, "slug": 5.0, "cluster": 0 },
      "anchor": "Passo a Passo Geral",
      "reason": "similaridade moderada de conteúdo/título/headings",
      "evidence": ["título compartilha termo(s): instalar, porta, eletronica", "..."],
      "target_is_orphan": false
    }
  ],
  "low_connectivity_pages": [{ "slug": "...", "url_path": "...", "inbound": 0, "outbound": 1 }]
}
```

`reports/internal-linking.md`: resumo, top oportunidades, páginas com
baixa conectividade, oportunidades por cluster, e sugestões detalhadas por
página (origem/destino/score/anchor/motivo/evidências).

## Como executar

```bash
# pré-requisito: .data/site-index.json deve existir (rode o Site Indexer)
# opcional: .data/seo-audit.json (rode o SEO Auditor) para priorizar órfãs
cd tools/shared && npm install && cd ../internal-linking
npm install
npm run suggest
```

```bash
npm run suggest -- --site-index .data/site-index.json --seo-audit .data/seo-audit.json
npm run suggest -- --quiet
npm run suggest -- --help
```

## Validação real (72 páginas)

**Antes da Fase 3.1:** 179 sugestões, score 35-59.
**Depois da Fase 3.1:** 223 sugestões, score 35-64. Máximo 5 por página, 0
sugestões priorizadas por órfã (consistente — SEO Auditor não encontrou
órfãs), 0 páginas de baixa conectividade (consistente com a limpeza de
2026-08-24). O falso positivo `coleira-gps-para-pet` →
`melhor-comedouro-interativo-gato` não é mais reportado.

## Outras limitações

- `cluster` é sempre `null` no `site-index.json` real hoje (ver
  `tools/site-indexer/README.md`) — o componente CLUSTER do score nunca
  contribui na prática, só quando esse campo for populado no futuro.
- Sugestões consideram só posts (`page_type: post`) como origem — home,
  institucionais e página de autor não recebem sugestões de saída nesta
  fase (decisão de escopo).
- Não sabe nada sobre o `.htaccess` do servidor (redirects de slug fora
  desta árvore local).

## Testes

```bash
npm test
```
25 testes (`node --test`), cobrindo scorer (score alto/baixo/determinístico,
bônus de cluster), suggestions (anchor, already-links-to, reason), analyzer
(self-link, link já existente, priorização de órfã, limite de 5, exclusão
de páginas não-post) e stopwords/overlap (`tools/shared/terms.js`). Não
dependem dos 72 posts reais.
