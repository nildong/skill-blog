# Site Indexer

Primeiro módulo da V2 da skill-blog (ver `V2-ARCHITECTURE-AUDIT.md`, seções 11-13).
Varre localmente os `index.html` do site smartpetgadgets.com.br e gera um
índice estruturado (`.data/site-index.json`) usado pelos módulos seguintes
da V2 (SEO Auditor, Internal Linking, Content Intelligence, etc.).

## Objetivo

Responder, de forma reprodutível e versionável, perguntas como "quantos
posts têm FAQPage?", "quais têm múltiplos H1?", "quais imagens não têm
alt?" — sem depender de `grep` manual repetido a cada auditoria.

## O que NÃO faz

- Não acessa a internet (nenhuma chamada de rede, nenhuma API).
- Não modifica nenhum `index.html` nem nenhuma imagem/vídeo.
- Não executa `deploy.sh` nem publica nada.
- Não lê nem indexa arquivos sensíveis (`.env`, chaves SSH, `.pem`, `.key`).
- Não usa banco de dados — a saída é um único arquivo JSON.

## Arquitetura

```
tools/site-indexer/
├── package.json          # dependência única: cheerio (parser HTML)
├── src/
│   ├── index.js           # CLI: parse de argv, orquestração, relatório
│   ├── scanner.js         # varredura de diretórios -> lista de index.html
│   ├── parser.js          # HTML -> dados brutos (cheerio)
│   ├── analyzer.js        # dados brutos + caminho -> registro final do post
│   └── writer.js          # escrita atômica do JSON de saída
├── test/
│   ├── fixtures/           # HTMLs pequenos e um mini-site para os testes
│   ├── parser.test.js
│   ├── analyzer.test.js
│   ├── scanner.test.js
│   └── writer.test.js
└── README.md
```

Runtime: Node.js (>=18.17), CommonJS. Testes: runner nativo `node:test`
(zero dependência extra). Dependência de produção: `cheerio@1.0.0` (pinada
nessa versão — `cheerio@1.2.0` exige Node >=20.18.1, incompatível com o
Node 18.19.1 disponível neste ambiente).

O site em si continua sendo HTML estático puro — Node.js é usado **apenas**
para esta ferramenta de análise, não para servir ou construir o site.

## Instalação

```bash
cd tools/site-indexer
npm install
```

## Uso

```bash
npm run index                    # varre a raiz do repo, grava .data/site-index.json
npm run index -- --root .        # especifica raiz explicitamente
npm run index -- --verbose       # imprime OK/ERR por arquivo
npm run index -- --quiet         # só grava o JSON, sem relatório no stdout
npm run index -- --output /tmp/x.json
npm run index -- --help
```

## Estrutura do `site-index.json`

```jsonc
{
  "version": 1,
  "generated_at": "2026-08-25T18:00:00.000Z",
  "site": {
    "root": "/home/projetos/blog",
    "total_html_files_found": 72,
    "total_posts_indexed": 72,
    "domain": "smartpetgadgets.com.br"
  },
  "stats": { /* mesmos números do relatório impresso no terminal */ },
  "warnings": ["slug/index.html: no_h1", "..."],
  "errors": [],
  "posts": [
    {
      "path": "comedouro-cachorro/index.html",
      "slug": "comedouro-cachorro",
      "url_path": "/comedouro-cachorro/",
      "page_type": "post",              // "home" | "post" | "institutional" | "author"
      "title": "...",
      "meta_description": "...",
      "canonical": "...",
      "robots": "...",
      "language": "pt-BR",
      "charset": "UTF-8",
      "headings": [{ "tag": "h1", "text": "...", "empty": false }, "..."],
      "heading_summary": { "total": 18, "h1_count": 1, "h2_count": 10, "h3_count": 7, "h4_count": 0 },
      "structural_warnings": [],          // ex: "no_h1", "multiple_h1", "h2_before_h1", "empty_heading"
      "content": {
        "word_count": 1683,
        "char_count": 9800,
        "paragraph_count": 22,
        "list_count": 3,
        "table_count": 0,
        "blockquote_count": 0,
        "method": "texto de <body> após remover script/style/noscript/nav/header/svg; ..."
      },
      "internal_links": [{ "href": "...", "anchor_text": "...", "type": "absolute|relative" }],
      "external_links": [{ "href": "...", "anchor_text": "...", "domain": "..." }],
      "internal_link_count": 7,
      "external_link_count": 4,
      "images": [{ "src": "...", "alt": "...", "alt_missing": false, "alt_empty": false, "title": null, "width": "...", "height": "...", "loading": "...", "format": "webp" }],
      "image_count": 4,
      "images_missing_alt": 0,
      "images_empty_alt": 0,
      "videos": [{ "type": "youtube|vimeo|html5|iframe-other", "url": "...", "id": "..." }],
      "video_count": 0,
      "has_video": false,
      "schemas": [{ "valid": true, "error": null, "types": ["BlogPosting"], "raw_length": 512 }],
      "schema_types": ["BlogPosting", "FAQPage", "..."],
      "schema_count": 4,
      "schema_invalid_count": 0,
      "faq": { "detected": true, "schema_detected": true, "heading_detected": true, "question_count": 4 },
      "cluster": null,       // não determinável com segurança hoje (ver limitações)
      "category": null,
      "author": null,
      "date_published": null,
      "date_modified": null
    }
  ]
}
```

## Significado dos campos "estruturais"

- `structural_warnings`: lista de problemas objetivos encontrados nos
  headings — **apenas registrados, nunca corrigidos** por este módulo.
  - `no_h1`: nenhum `<h1>` na página.
  - `multiple_h1`: mais de um `<h1>`.
  - `h2_before_h1`: primeiro `<h2>` aparece antes do primeiro `<h1>` no documento.
  - `empty_heading`: algum heading (h1-h4) com texto vazio.
- `faq.detected`: `true` se houver JSON-LD `FAQPage` **ou** um heading
  textual mencionando "FAQ"/"perguntas frequentes". `faq.schema_detected`
  isola especificamente a evidência estruturada (JSON-LD) — use este campo
  quando precisar saber se o FAQ é elegível a rich snippet no Google.

## Limitações conhecidas

- **`cluster`, `category`, `date_published`, `date_modified`, `author`
  ficam sempre `null`** nesta fase: não há convenção uniforme e confiável
  no HTML atual para extrair essas informações sem risco de inventar dado
  (ver `V2-ARCHITECTURE-AUDIT.md`, seção 6). Ficam como extensão futura.
- **`.htaccess`/redirects 301** vivem só no servidor Hostinger, fora desta
  árvore local — o indexer não tem visibilidade sobre slugs antigos
  redirecionados.
- **Contagem de palavras é uma aproximação**: remove `script/style/
  noscript/nav/header/svg` e faz split por espaço em branco no texto
  restante do `<body>`. Não distingue "conteúdo principal" de outras áreas
  (ex: sidebar, se existisse) além dessa exclusão por tag.
- **`author` não é extraído do JSON-LD** nesta fase — o parser expõe os
  `@type` agregados de cada bloco `application/ld+json`, mas não os campos
  internos (`author`, `datePublished`, etc.) de cada schema. Pode ser
  adicionado no `parser.js` numa iteração futura sem quebrar o formato do
  índice (é aditivo).

## Tratamento de erros

- Erros por arquivo (ex: HTML ilegível) **não interrompem a varredura**:
  são registrados em `errors[]` e o indexer segue para o próximo arquivo.
- Diretórios ilegíveis (permissão negada) também são registrados como erro
  e a varredura continua nos demais diretórios.
- HTML malformado (tags não fechadas) é tolerado pelo parser (`cheerio`,
  via `htmlparser2`), que sempre produz uma árvore best-effort em vez de
  lançar exceção.
- Arquivo HTML vazio produz um registro de post com todos os campos vazios
  (`title: null`, `word_count: 0`, etc.), sem erro.
- Arquivo inexistente faz `parseFile` lançar exceção — é o CLI
  (`src/index.js`) quem captura isso por arquivo e registra em `errors[]`.

## Segurança

Antes de indexar um arquivo, o CLI verifica se o caminho parece sensível
(`.env`, `.env.*`, chaves SSH, `.pem`, `.key`) e, se for o caso, **pula o
arquivo e registra um warning**, em vez de ler seu conteúdo. Na prática,
como o scanner nunca varre pastas como `.claude/skills/blog/scripts/`
(não contém `index.html`), essa checagem é uma segunda camada de defesa,
não a única.

## Executando os testes

```bash
npm test
```

Os testes usam apenas fixtures pequenas em `test/fixtures/` (HTMLs
sintéticos + um mini-site de 3 páginas para o scanner) — não dependem dos
73 posts reais do site. Depois de rodar os testes, valide manualmente
contra o conteúdo real com `npm run index` e inspecione alguns posts no
`.data/site-index.json` gerado.

## Como adicionar um novo detector

1. Se o dado vem diretamente do HTML (uma tag/atributo nova), adicione a
   extração em `src/parser.js`, dentro da função `extractX` relevante (ou
   crie uma nova `extractY($)` e chame-a em `parseHtmlContent`).
2. Se o dado é uma **interpretação** do que o parser já extraiu (ex: um
   novo tipo de warning estrutural), adicione em `src/analyzer.js`.
3. Adicione fixtures em `test/fixtures/` cobrindo o caso novo e os casos
   de borda (ausência do dado, dado malformado).
4. Rode `npm test`, depois `npm run index` contra o projeto real e
   inspecione manualmente 2-3 posts reais para confirmar que o dado bate
   com o HTML.
5. Documente o campo novo neste README (seção "Estrutura do
   `site-index.json`").

## Quando regenerar o índice

O índice é uma **fotografia** do estado atual dos `index.html`. Regenere
(`npm run index`) sempre que:

- novos posts forem publicados/removidos;
- conteúdo relevante de um post existente for editado (title, headings,
  links, imagens, schema);
- antes de rodar o SEO Auditor (módulo seguinte da V2), para garantir que
  ele está analisando o estado atual, não uma versão desatualizada.

O comando é idempotente: pode ser executado quantas vezes for necessário,
sempre sobrescrevendo `.data/site-index.json` (escrita atômica — nunca
deixa o arquivo truncado mesmo se interrompido no meio).
