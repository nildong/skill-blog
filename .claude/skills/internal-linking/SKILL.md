---
name: internal-linking
description: Sugere (não insere) oportunidades de link interno a partir de .data/site-index.json e .data/seo-audit.json, com score explicável, anchor sugerido e evidências. Use quando o usuário pedir sugestões de link interno, quiser saber quais páginas deveriam se linkar, ou pedir para priorizar links para páginas órfãs. Nunca insere, remove ou altera links em nenhum artigo — apenas sugere.
---

# Internal Linking Engine

Terceiro módulo da V2 (junto com Cannibalization). Lê `.data/site-index.json`
e (opcionalmente) `.data/seo-audit.json`, e produz sugestões de link
interno: `.data/internal-linking.json` e `reports/internal-linking.md`.

## Quando usar

- Usuário pede "sugestões de link interno", "onde eu deveria linkar esse
  artigo", "quais páginas estão pouco conectadas", "priorize links para
  páginas órfãs".
- Depois de rodar o Site Indexer (obrigatório) e, se possível, o SEO
  Auditor (opcional — habilita priorização de páginas órfãs).

## Quando NÃO usar

- Para inserir os links de fato — este módulo só sugere. Qualquer inclusão
  de link em `index.html` precisa ser feita manualmente e revisada, fora
  deste módulo.
- Sem `.data/site-index.json` — rode a skill `site-indexer` primeiro.

## Como executar

```bash
cd tools/shared && npm install && cd ../internal-linking && npm install
npm run suggest
```

Gera/sobrescreve `.data/internal-linking.json` e
`reports/internal-linking.md`; imprime um resumo no terminal.

## Como interpretar o resultado

- `reports/internal-linking.md` — comece pela seção "Top Oportunidades".
  Sugestões com destino órfão vêm primeiro, marcadas 🔴.
- Cada sugestão tem: origem, destino, score (0-100, explicável — ver
  `tools/internal-linking/README.md` para os pesos), anchor sugerido,
  motivo e evidências textuais concretas.
- Máximo de 5 sugestões por página de origem (decisão deliberada — evita
  incentivar links de baixa qualidade só para preencher cota).

## Distinguir sugestão de alteração

Este módulo **nunca modifica HTML**. Toda saída é uma recomendação para
avaliação humana. Se o usuário pedir para "aplicar" uma sugestão, isso é
uma tarefa manual separada (editar o `index.html` com cuidado, preservando
a estrutura existente) — não algo que este módulo faz sozinho.

## Fase 3.1 — qualidade do score

O score usa overlap ponderado (termos genéricos/editoriais como "guia",
"completo", "melhor" contam pouco; anos contam zero) e reconhece relações
pilar↔satélite (bônus de score, com guarda contra falso positivo — ver
`tools/internal-linking/README.md`, seção "Fase 3.1"). Ainda assim, para
sugestões com score no limite inferior (35-40), vale conferir manualmente
se a relação faz sentido editorial antes de aceitar.

## Garantias

- Não acessa a internet, não usa APIs externas, não usa LLM.
- Não modifica nenhum artigo.
- Determinístico: mesma entrada sempre produz o mesmo resultado.
