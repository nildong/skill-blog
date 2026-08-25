# SEO Auditor

Segundo módulo da V2 da skill-blog (ver `V2-ARCHITECTURE-AUDIT.md`, seções
11-13, e `tools/site-indexer/README.md` para o módulo anterior). Consome
`.data/site-index.json` (gerado pelo Site Indexer) e produz uma auditoria
SEO determinística: `.data/seo-audit.json` (dados estruturados) e
`reports/seo-audit.md` (relatório humano).

## Objetivo

ANALISA → DETECTA → CLASSIFICA → REPORTA. **Não corrige nada.** Nenhum
`index.html` é modificado por este módulo — a correção (Auto Fix) é um
módulo futuro e separado (ver roadmap na auditoria de arquitetura).

## O que NÃO faz

- Não acessa a internet (nenhuma API, nenhum SERP, nenhum Google).
- Não modifica artigos, schemas, links, imagens ou vídeos.
- Não executa deploy.
- Não calcula um "SEO Score" agregado (decisão explícita desta fase —
  primeiro construir dados confiáveis; o score vem depois, consumindo
  este auditor).

## Arquitetura

```
tools/seo-auditor/
├── package.json          # zero dependências de produção
├── src/
│   ├── index.js           # CLI
│   ├── rules.js           # severidades, categorias, thresholds (documentados)
│   ├── link-graph.js       # grafo de links internos (inbound/outbound/quebrados)
│   ├── auditor.js          # orquestração: roda todos os checks, agrega
│   ├── report.js           # gera .data/seo-audit.json e reports/seo-audit.md
│   └── checks/
│       ├── metadata.js      # title, description, canonical
│       ├── headings.js      # H1-H4 (reusa structural_warnings do indexer)
│       ├── content.js       # word_count, thin content
│       ├── links.js         # outbound baixo, órfã (inbound=0), quebrado
│       ├── images.js        # alt ausente/vazio, dimensões
│       ├── media.js         # vídeo sem schema, embed não resolvido
│       ├── schema.js        # JSON-LD ausente/inválido, tipos esperados
│       ├── faq.js           # FAQ visível vs. FAQPage estruturado
│       ├── technical.js     # lang, charset, robots noindex
│       └── site_structure.js # páginas isoladas (0 inbound E 0 outbound)
├── test/
│   ├── support/helpers.js   # fábrica de "post" sintético para os testes
│   ├── checks.test.js
│   ├── auditor.test.js
│   ├── link-graph.test.js
│   └── report.test.js
└── README.md
```

**Dependências de reuso (decisão consciente de arquitetura):** este módulo
**não instala nenhuma dependência de produção nova**. Ele:

1. Lê `.data/site-index.json` já pronto — não reparseia HTML, não usa
   `cheerio`. Toda a extração de dados brutos já foi feita pelo Site
   Indexer; o Auditor só interpreta esses dados (evita duplicar parsing).
2. Reutiliza `tools/site-indexer/src/writer.js` (escrita atômica de JSON)
   via `require('../../site-indexer/src/writer')` — em vez de duplicar a
   mesma função de tmp-file + rename aqui. É um acoplamento consciente e
   pequeno entre dois módulos irmãos dentro de `tools/`; se um dia isso
   precisar ser extraído para uma lib compartilhada (`tools/shared/`),
   fica documentado aqui como candidato natural — não foi feito agora
   para não introduzir arquitetura prematura.

## Como executar

```bash
# 1. Gerar/atualizar o índice primeiro (se ainda não existir ou estiver desatualizado)
cd tools/site-indexer && npm install && npm run index && cd ../..

# 2. Rodar a auditoria
cd tools/seo-auditor
npm install   # não há dependências de produção, mas cria node_modules vazio de forma consistente
npm run audit
```

```bash
npm run audit -- --input .data/site-index.json
npm run audit -- --output .data/seo-audit.json --report reports/seo-audit.md
npm run audit -- --quiet
npm run audit -- --help
```

## Severidades

| Severidade | Significado |
|---|---|
| `CRITICAL` | Página essencialmente quebrada/inutilizável para SEO (ex: sem conteúdo nenhum). Corrigir antes de qualquer outra coisa. |
| `ERROR` | Problema técnico objetivo, com evidência clara, que provavelmente prejudica indexação/ranqueamento/UX. Fato verificável, não opinião. |
| `WARNING` | Desvio de boa prática recomendada, mas não uma quebra objetiva. Vale corrigir, não é urgente. |
| `INFO` | Oportunidade de melhoria ou observação neutra. Nunca implica que a página está "errada". |

Regra geral: quando uma regra não pode determinar com certeza que algo é
um problema, ela usa `WARNING` ou `INFO`, nunca `ERROR`/`CRITICAL`.

## Categorias

`technical`, `metadata`, `headings`, `content`, `internal_links`, `images`,
`media`, `schema`, `faq`, `site_structure`.

## Thresholds (todos documentados em `src/rules.js`)

| Threshold | Valor | Uso |
|---|---|---|
| `TITLE_MIN_LEN` / `TITLE_MAX_LEN` | 15 / 60 | Fora da faixa → `INFO` (nunca erro) |
| `DESCRIPTION_MIN_LEN` / `DESCRIPTION_MAX_LEN` | 50 / 160 | Fora da faixa → `INFO` |
| `CONTENT_ERROR_WORDS` | 150 | Abaixo disso, post → `CONTENT_EXTREMELY_SHORT` (`ERROR`) |
| `CONTENT_WARNING_WORDS` | 300 | `[150, 300)`, post → `CONTENT_SHORT` (`WARNING`) |
| `CONTENT_INFO_WORDS` | 400 | `[300, 400)`, post → `CONTENT_BRIEF` (`INFO`, oportunidade — não erro) |
| `THIN_H2_COUNT` | 2 | Post com `h2_count <= 2` → `HEADING_STRUCTURE_THIN` (`INFO`) |
| `LOW_INTERNAL_LINKS` | 3 | `<=` esse número de links de saída → `INFO` |
| `HIGH_IMAGE_COUNT_INFO` | 15 | Acima disso → `INFO` de revisão de contexto |

Nenhum threshold é tratado como "penalização garantida pelo Google" — são
heurísticas conservadoras usadas só para classificar severidade.

## Regras DETERMINÍSTICAS vs. OPORTUNIDADES

**Determinísticas** (evidência objetiva, sempre a mesma para o mesmo HTML):
`TITLE_MISSING`, `TITLE_DUPLICATE`, `DESCRIPTION_MISSING`,
`DESCRIPTION_DUPLICATE`, `CANONICAL_MISSING`, `CANONICAL_MISMATCH`,
`H1_MISSING`, `H1_MULTIPLE`, `H2_BEFORE_H1`, `HEADING_EMPTY`,
`CONTENT_MISSING`, `CONTENT_EXTREMELY_SHORT`, `ORPHAN_PAGE`,
`BROKEN_INTERNAL_LINK`, `IMAGE_ALT_MISSING`, `IMAGE_ALT_EMPTY`,
`JSONLD_INVALID`, `JSONLD_MISSING`, `FAQ_SCHEMA_EMPTY`,
`FAQ_HEADING_WITHOUT_SCHEMA`, `LANGUAGE_MISSING`, `CHARSET_MISSING`,
`ROBOTS_NOINDEX`, `ISOLATED_PAGE`.

**Oportunidades** (`INFO`, nunca implicam erro): `TITLE_TOO_LONG/SHORT`,
`DESCRIPTION_TOO_LONG/SHORT`, `HEADING_STRUCTURE_THIN`, `CONTENT_BRIEF`,
`LOW_INTERNAL_LINKS`, `IMAGE_COUNT_HIGH`, `IMAGE_DIMENSIONS_MISSING`,
`VIDEO_WITHOUT_SCHEMA`, `SCHEMA_BREADCRUMB_MISSING`, `FAQ_OPPORTUNITY`.
`CONTENT_SHORT` é `WARNING` (não `INFO`) — está entre determinística e
oportunidade: a faixa de palavras em si é um fato objetivo, mas a
recomendação nunca afirma que o conteúdo está "errado" (ver seção
"Contagem de palavras" abaixo).

### Contagem de palavras é um SINAL, não um veredito de qualidade

Não existe um número universal de palavras "ideal" para SEO. Uma página
com intenção de busca específica e objetiva (ex: "a porta eletrônica
impede a entrada de outros animais?") pode responder completamente à
pergunta em poucas centenas de palavras e ser um conteúdo perfeitamente
bom — texto curto não é sinônimo de conteúdo incompleto. Por isso a regra
de conteúdo (`src/checks/content.js`) usa três faixas com severidade
decrescente conforme o tamanho, aplicadas somente a `page_type === 'post'`:

| Faixa (palavras) | Issue | Severidade | Interpretação |
|---|---|---|---|
| `< 150` | `CONTENT_EXTREMELY_SHORT` | `ERROR` | Bem abaixo do padrão do site — vale revisar com prioridade |
| `150 – 299` | `CONTENT_SHORT` | `WARNING` | Abaixo do padrão — vale avaliar, não é urgente |
| `300 – 399` | `CONTENT_BRIEF` | `INFO` | Oportunidade de revisão, **não um problema** |
| `>= 400` | (nenhum issue) | — | — |

A recomendação de `CONTENT_SHORT`/`CONTENT_BRIEF` é sempre "considere
avaliar se o conteúdo cobre completamente a intenção de busca" — nunca
"adicionar mais palavras". `word_count` sozinho nunca decide se uma página
tem um problema real; é só um dos sinais que compõem o quadro. A regra
**não** usa `h2_count` como condição (decisão explícita — ver histórico
desta seção): um post com word_count baixo mas headings bem estruturados
ainda cai na faixa correspondente ao seu word_count, sem exceção por
estrutura. Isso é intencional para manter a regra simples e auditável;
`HEADING_STRUCTURE_THIN` (categoria `headings`) já cobre estrutura rasa
separadamente, como um sinal independente.

## Órfã vs. sem links de saída (distinção importante)

- `NO_INTERNAL_LINKS` / `LOW_INTERNAL_LINKS`: a página tem poucos/nenhum
  link **de saída** (`internal_link_count`).
- `ORPHAN_PAGE`: **nenhuma outra página do site aponta para ela**
  (inbound = 0), calculado a partir do grafo completo de links internos
  (`src/link-graph.js`). São conceitos independentes — uma página pode ter
  muitos links de saída e ainda ser órfã (ninguém a referencia), ou vice-versa.
- `ISOLATED_PAGE` (categoria `site_structure`): caso mais grave — inbound
  **e** outbound ambos zero.

## Detecção de link interno quebrado

Um link interno (`<a href>` apontando para o próprio domínio ou caminho
relativo) é considerado quebrado quando, após normalização
(`src/link-graph.js`), não corresponde a nenhuma `url_path` conhecida do
site. **Links para arquivos** (última parte do path com extensão, ex:
`.pdf`) são deliberadamente **ignorados** por essa checagem — não são
páginas do site-index e sinalizá-los como "quebrados" seria um falso
positivo não determinável localmente com os dados disponíveis.

## Formato de saída

`.data/seo-audit.json`:

```jsonc
{
  "version": 1,
  "generated_at": "...",
  "site": { "total_pages": 72, "source_index_generated_at": "..." },
  "summary": { "critical": 0, "errors": 0, "warnings": 1, "info": 62 },
  "categories": { "metadata": { "critical": 0, "error": 0, "warning": 0, "info": 3 }, "...": "..." },
  "pages": [
    {
      "path": "comedouro-cachorro/index.html",
      "url": "/comedouro-cachorro/",
      "slug": "comedouro-cachorro",
      "page_type": "post",
      "title": "...",
      "status": "pass",   // "pass" | "warning" | "error"
      "issues": [
        { "id": "...", "category": "...", "severity": "...", "evidence": "...", "recommendation": "..." }
      ]
    }
  ]
}
```

`status` por página: `error` se houver algum issue `CRITICAL`/`ERROR`;
senão `warning` se houver algum `WARNING`; senão `pass` (mesmo com `INFO`s).

`reports/seo-audit.md`: resumo executivo (Top Priorities), depois seções
por severidade (Critical/Errors/Warnings/Opportunities) e por categoria
(Site Structure, Internal Linking, Metadata, Headings, Content, Images,
Schema, FAQ, Media).

## Limitações conhecidas

- **Heurística de FAQ por heading é textual e sem contexto semântico**:
  `heading_detected` dispara para qualquer `<h2>`/`<h3>` cujo texto
  contenha "FAQ"/"perguntas frequentes" — inclusive quando o heading é,
  por exemplo, o título de um card na home que **linka** para um artigo de
  FAQ, não uma seção de FAQ da própria página. Validado manualmente: a
  home (`/`) recebe `FAQ_HEADING_WITHOUT_SCHEMA` por esse motivo — é uma
  detecção tecnicamente correta (o texto está lá) mas semanticamente
  fraca. Como a severidade é `WARNING` (não `ERROR`), o impacto de um
  eventual falso positivo é baixo; documentado aqui em vez de "corrigido"
  nesta fase (auditor não deve inventar heurísticas mais complexas sem
  validação adicional).
- **`cluster`/`category` não existem no índice** (sempre `null`, herdado
  do Site Indexer) — por isso a regra de "clusters com poucos artigos"
  mencionada no prompt da Fase 2 **não foi implementada**; ver comentário
  em `src/checks/site_structure.js`.
- **Canonical mismatch só é checável quando o canonical é uma URL absoluta
  válida** — se o valor não for parseável como URL, a checagem é pulada
  silenciosamente (não gera falso positivo, mas também não valida nada).
- **Broken internal link não verifica o `.htaccess` do servidor** — um
  link para um slug antigo que tem redirect 301 configurado no Hostinger
  (fora desta árvore local, ver auditoria de arquitetura) pode aparecer
  como quebrado aqui mesmo estando funcional em produção via redirect.

## Testes

```bash
npm test
```

44 testes (`node --test test/*.test.js`), cobrindo cada check
individualmente (com fixtures sintéticas via `test/support/helpers.js`),
o grafo de links, a agregação do `auditor.js` e a geração dos relatórios.
Não dependem das 72 páginas reais. Depois de rodar os testes, valide
contra o conteúdo real com `npm run audit` e inspecione o
`.data/seo-audit.json` gerado.

## Quando rodar

Sempre depois de regenerar `.data/site-index.json` (ou seja, depois de
publicar/editar posts) — o Auditor não detecta sozinho se o índice está
desatualizado, apenas processa o que encontra nele.
