---
name: seo-auditor
description: Roda a auditoria SEO local determinística (título/meta duplicados, H1 ausente, conteúdo curto, páginas órfãs, links quebrados, imagens sem alt, JSON-LD/FAQ inconsistente) a partir de .data/site-index.json, gerando .data/seo-audit.json e reports/seo-audit.md. Use quando o usuário pedir uma auditoria de SEO, quiser saber os principais problemas do site, ou pedir uma fila de prioridades de correção. Apenas relata — nunca corrige artigos automaticamente.
---

# SEO Auditor

Segundo módulo da V2 (depois do Site Indexer). Lê `.data/site-index.json`
e produz uma auditoria SEO objetiva e determinística: `.data/seo-audit.json`
(dados) e `reports/seo-audit.md` (relatório humano com Top Priorities).

## Quando usar

- Usuário pede "auditoria de SEO", "quais os principais problemas do
  site", "fila de prioridades", "quais páginas estão órfãs", "há links
  quebrados?", "quais posts têm conteúdo curto?".
- Antes de decidir o que corrigir manualmente (ou, futuramente, antes de
  rodar o módulo Auto Fix, que ainda não existe).

## Quando NÃO usar

- Para corrigir os problemas encontrados — este módulo só relata. Qualquer
  correção em `index.html` precisa ser feita manualmente e revisada, fora
  deste módulo.
- Como fonte de SEO Score — esta fase não calcula um score agregado
  (decisão explícita; vem em módulo futuro).
- Se `.data/site-index.json` não existir ou estiver desatualizado — rode
  primeiro a skill `site-indexer`.

## Como executar

```bash
cd tools/site-indexer && npm install && npm run index && cd ../..   # se o índice não existir/estiver desatualizado
cd tools/seo-auditor && npm install && npm run audit
```

Gera/sobrescreve `.data/seo-audit.json` e `reports/seo-audit.md`, e
imprime um resumo (páginas auditadas, Critical/Errors/Warnings/Info) no
terminal.

## Como interpretar o resultado

- `reports/seo-audit.md` — comece pela seção "Top Priorities" (ordenada
  por severidade: CRITICAL → ERROR → WARNING → INFO).
- `.data/seo-audit.json` — um objeto por página em `pages[]`, com
  `status` (`pass`/`warning`/`error`) e `issues[]` (cada issue tem `id`,
  `category`, `severity`, `evidence`, `recommendation`).
- Severidade `INFO` é sempre oportunidade, nunca "erro" — não tratar como
  bloqueante.

Ver `tools/seo-auditor/README.md` para a lista completa de regras,
thresholds documentados e limitações conhecidas (ex: heurística de FAQ por
heading pode gerar falso positivo semântico em títulos de card que
apenas linkam para um FAQ, não são um FAQ).

## Garantias

- Não acessa a internet, não usa APIs externas.
- Não modifica nenhum artigo, schema, link, imagem ou vídeo.
- Não executa deploy.
- Regras determinísticas: mesmo `site-index.json` de entrada sempre
  produz o mesmo `seo-audit.json`.
