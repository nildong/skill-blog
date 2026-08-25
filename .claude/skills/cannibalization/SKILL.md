---
name: cannibalization
description: Detecta possível canibalização de conteúdo (páginas competindo pela mesma intenção de busca) a partir de .data/site-index.json, com score explicável e classificação low/possible/high. Use quando o usuário pedir análise de canibalização, quiser saber se dois artigos competem entre si, ou pedir uma revisão de sobreposição de conteúdo. Nunca afirma certeza ("possível canibalização") e nunca recomenda apagar artigos.
---

# Cannibalization Detector

Quarto módulo da V2 (companheiro do Internal Linking). Lê
`.data/site-index.json` e produz `.data/cannibalization.json` +
`reports/cannibalization.md` com pares de páginas que possivelmente
competem pela mesma busca.

## Quando usar

- Usuário pede "análise de canibalização", "esses dois artigos competem
  entre si?", "quais páginas têm conteúdo sobreposto".
- Depois de rodar o Site Indexer (obrigatório).

## Quando NÃO usar

- Para decidir sozinho que uma página deve ser apagada/consolidada — este
  módulo nunca recomenda isso automaticamente; sempre pede revisão manual.
- Como veredito definitivo — o score é heurístico. Trate `high` como "vale
  revisar com prioridade", nunca como "com certeza é canibalização".

## Como executar

```bash
cd tools/shared && npm install && cd ../cannibalization && npm install
npm run detect
```

Gera/sobrescreve `.data/cannibalization.json` e `reports/cannibalization.md`;
imprime um resumo (pares analisados, HIGH/POSSIBLE) no terminal.

## Como interpretar o resultado

- Classificação: `low` (0-39, não aparece no relatório), `possible`
  (40-69), `high` (70-100) — thresholds heurísticos documentados em
  `tools/cannibalization/README.md`.
- Cada par reportado tem: títulos, sinais de sobreposição, sinais de
  **diferenciação** de intenção (quando existem — ex: título comparativo
  "X vs Y", ou formatos editoriais diferentes como FAQ vs. review),
  explicação e recomendação.
- Recomendações são sempre condicionadas a revisão manual: diferenciar
  títulos, fortalecer conteúdo, criar links entre conteúdos
  complementares, ou (só em último caso, e só com ressalva) considerar
  consolidação — nunca "apagar" como ação automática.

## Nível `complementary` (Fase 3.1)

Além de `low`/`possible`/`high`, pares podem vir classificados como
`complementary` — quando o classificador de formato compartilhado
(`tools/shared/format-classifier.js`) identifica uma relação pilar↔satélite
ou dois formatos específicos claramente diferentes (ex: how-to vs.
troubleshooting sobre o mesmo produto). O score numérico continua visível,
mas **não é tratado como conflito** — é a arquitetura intencional do site
ou conteúdo com intenções diferentes. Corrigido na Fase 3.1 depois de
validação manual encontrar exatamente esse tipo de falso positivo (ver
`tools/cannibalization/README.md`, seção "Fase 3.1", para os casos reais
e a correção aplicada).

## Garantias

- Não acessa a internet, não usa APIs externas, não usa LLM.
- Não modifica nenhum artigo.
- Cada par é analisado uma única vez (A↔B, nunca duplicado).
- Determinístico: mesma entrada sempre produz o mesmo resultado.
