---
name: site-indexer
description: Gera/atualiza o índice estruturado local dos 72 posts do site (títulos, metas, headings, links, imagens, vídeos, JSON-LD, FAQ) em .data/site-index.json. Use antes de qualquer auditoria de SEO, análise de canibalização, sugestão de link interno, ou pergunta que exija saber "quantos posts têm X" / "quais posts fazem Y" sem precisar reler todos os HTMLs manualmente. Não modifica artigos nem faz deploy.
---

# Site Indexer

Módulo local (sem acesso à internet) que varre todos os `index.html`
publicáveis do repositório e gera `.data/site-index.json` — um mapa
estruturado do site inteiro. É a base para os próximos módulos da V2 (SEO
Auditor, Internal Linking, Content Gap etc., ver `V2-ARCHITECTURE-AUDIT.md`).

## Quando usar

- Antes de responder perguntas agregadas sobre o site ("quantos posts têm
  FAQPage?", "quais posts não têm H1?", "quais imagens estão sem alt?").
- Antes de rodar o SEO Auditor ou o Internal Linking Suggestor (quando
  existirem), para garantir que estão lendo o estado atual do site.
- Depois de publicar, editar ou remover posts, se `.data/site-index.json`
  estiver desatualizado em relação ao conteúdo atual.

## Quando NÃO usar

- Para modificar conteúdo — este módulo é somente leitura.
- Para publicar (isso é `.claude/skills/blog/scripts/deploy.sh`, não este módulo).
- Como fonte de dados de SERP/keyword/concorrência — o indexer não acessa
  a internet; isso é escopo de um módulo futuro (`seo-research`), ainda
  não implementado.

## Como executar

```bash
cd tools/site-indexer
npm install   # só na primeira vez, ou se package.json mudar
npm run index
```

Isso grava/sobrescreve `.data/site-index.json` na raiz do repo e imprime
um relatório resumido no terminal (arquivos encontrados, posts indexados,
warnings, errors, e contagens agregadas de metadata/estrutura/links/mídia/
schema).

## Como interpretar `.data/site-index.json`

Ver `tools/site-indexer/README.md` para o schema completo campo a campo.
Resumo rápido: um objeto por post em `posts[]`, com `slug`, `title`,
`headings`, `internal_links`/`external_links`, `images`, `videos`,
`schemas`, `faq`. Campos que o indexer não consegue determinar com
segurança (`cluster`, `category`, `date_published`, `date_modified`,
`author`) ficam como `null` — não são inventados.

## Regenerar o índice

O índice é uma fotografia do estado atual dos arquivos. Rode `npm run
index` de novo sempre que o conteúdo dos posts mudar. O comando é
idempotente e usa escrita atômica — seguro rodar quantas vezes for
necessário.

## Garantias

- Não acessa a internet.
- Não modifica nenhum `index.html`, imagem ou vídeo.
- Não executa `deploy.sh` nem publica nada.
- Não lê `.env`, chaves SSH, ou qualquer credencial.
- Erros em um arquivo individual não interrompem a varredura dos demais.
