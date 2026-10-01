---
name: social-content-engine
description: V1 (somente leitura/dry-run) do motor que transforma artigos publicados do blog smartpetgadgets.com.br em pacotes estruturados de oportunidade de conteúdo social (Facebook/Instagram) — Reel, Post, Carrossel, Stories, Pergunta/engajamento. Não gera as peças finais, não publica, não modifica artigos, links de afiliados, imagens ou sitemap. Use quando o usuário pedir para transformar artigos em conteúdo social, planejar pauta social do blog, ou rodar o "social content engine" / "--pilot".
---

# Social Content Engine (V1 — dry-run/pilot)

Motor de conteúdo social para o Smart Pet Gadgets. Lê artigos já
publicados e estrutura, para cada um, a **oportunidade** de 8 formatos
sociais (Reel, Post educativo, Post de curiosidade, Carrossel, 2
Stories, Pergunta de engajamento) — sem gerar o texto/roteiro final
nesta versão e sem publicar nada.

```
ARTIGO DO BLOG → ANÁLISE → OPORTUNIDADE ESTRUTURADA → FILA EDITORIAL (futuro) → FB/IG (futuro)
```

## Estado atual: V1, dry-run + geração piloto (sem publicação)

Fluxo obrigatório, definido pelo usuário, e que **não deve ser pulado**:

```
AUDITORIA → DRY-RUN → REVISÃO → AUTORIZAÇÃO → GERAÇÃO PILOTO → VALIDAÇÃO → AUTORIZAÇÃO → ESCALA
```

A skill cobre hoje **DRY-RUN** (`dry-run --pilot`) e **GERAÇÃO PILOTO**
(`generate --pilot`, só depois de autorização explícita do usuário —
gera até 8 peças por artigo para os mesmos 10 do piloto revisado). Não
avance para publicação, fila editorial automática, nem expansão para
os demais artigos do site sem nova autorização explícita nesta
conversa — autorização de uma etapa não vale para a próxima.

### Geração piloto (`generate --pilot`)

```bash
node src/index.js generate --pilot
# ou: npm run generate-pilot
```

Gera 2 Reels, 2 Posts, 1 Carrossel, 2 Stories e 1 Pergunta de
engajamento por artigo, todos montados a partir de só 4 campos já
extraídos do HTML real (título, meta description, headings h2/h3,
headings que já são perguntas) — nunca por reescrita livre. Quando a
fonte não tem gancho real suficiente para um formato, a peça fica
`status: "insufficient_source"` com o motivo documentado, em vez de
inventar conteúdo. Cada peça passa por um **quality gate**
(`src/quality-gate.js`): rastreabilidade a artigo/URL, ausência de
placeholder/preço, CTA presente quando o formato exige, e sobreposição
de vocabulário real (>=40%) entre hook/pergunta/título-gatilho e a
fonte. Peça que falha vira `needs_review`. Relatório completo em
`reports/social-content/generation-piloto.md`. **Nada é publicado** —
sem integração com Facebook/Instagram nesta V1.

## Quando usar

- Usuário pede para "transformar artigos em conteúdo social", "criar
  pauta para Facebook/Instagram a partir do blog", "rodar o social
  content engine", "escolher os 10 artigos piloto para redes sociais".
- Sempre depois de `site-indexer` (obrigatório) e, se possível,
  `content-strategy` (opcional, mas melhora a qualidade do cluster —
  ver "Cluster nunca é verdade absoluta" abaixo).

## Quando NÃO usar

- Para gerar o texto final de Reels/Posts/Carrossel/Stories — essa é a
  fase "GERAÇÃO PILOTO", ainda não implementada/autorizada.
- Para publicar em Facebook/Instagram — não existe integração de
  publicação nesta V1, de propósito.
- Para alterar `affiliate-products.json`, HTML de artigos, imagens ou
  `sitemap.xml` — este módulo nunca escreve nesses arquivos.

## Como executar

```bash
cd tools/social-content-engine
npm test                    # roda os testes (node --test)
node src/index.js dry-run --pilot
# ou: npm run pilot
```

Sem `--pilot` (não implementado como fluxo separado nesta V1) o comando
padrão já roda o piloto de 10 artigos — não existe modo "todos os 73
artigos" nesta fase, de propósito (ver seção 17 do prompt original:
nunca processar todos os artigos de uma vez sem validar o piloto
primeiro).

## O que o dry-run produz

- `.data/social-content/{slug}.json` — um pacote por artigo do piloto,
  com `article`, `source` (rastreabilidade), `signals` (imagens, FAQ,
  links internos, produtos afiliados do cluster), `format_potential`
  (nível alto/médio/baixo por formato + motivo), `content` **vazio**
  (`reels: []`, `posts: []`, etc. — de propósito), `problems[]` e
  `similarity_warning`.
- `.data/social-content-index.json` — índice agregando os pacotes
  gerados (slug, cluster, `piece_count` — sempre 0 nesta fase — e
  status).
- `reports/social-content/dry-run.md` — relatório humano: critérios de
  seleção, os 10 artigos, justificativa, potencial por formato,
  problemas e limitações.

## Princípio fundamental: não inventar

A IA por trás desta skill pode resumir, reorganizar, criar ganchos e
adaptar linguagem **na fase de geração** (ainda não autorizada). Nunca
pode: inventar especificação de produto, preço, avaliação, benefício
não presente no artigo, estatística, link, ou produto afiliado que não
exista em `.data/affiliate-products.json`. Quando a informação não
existe, o pacote registra em `problems[]` — nunca preenche com
suposição.

## Cluster nunca é verdade absoluta

`site-index.json` mantém `cluster: null` para todos os posts — não é
inferido lá. Esta skill nunca recalcula cluster do zero: reaproveita
`.data/content-strategy.json` (`pages[].cluster` /
`cluster_confidence`, já validado por Internal Linking/Cannibalization)
quando existe, e cai numa heurística fraca de prefixo de slug apenas
como último recurso — sempre marcada `cluster_source: "heuristic"`,
`cluster_confidence: "low"`. Nunca trate um cluster `heuristic/low`
como definitivo antes de confirmar manualmente, especialmente antes de
basear CTA ou remarketing nele.

## Afiliados

Produtos afiliados só são **lidos** de `.data/affiliate-products.json`
para dar contexto (`signals.affiliate_products`) — nunca criados,
inferidos ou usados para montar URL. Um artigo sem produto mapeado no
cluster não é erro: é registrado como limitação em `problems[]`. Bug
conhecido e corrigido nesta V1: produtos com `cluster: null` (ainda não
classificados pelo usuário) nunca devem "casar" com artigos cujo
cluster também é `null` — ver teste de regressão em
`tools/social-content-engine/test/select-pilot.test.js`.

## Seleção do piloto (10 artigos, determinística)

Score por artigo, maior primeiro (empate: word_count desc, depois slug
asc):

1. `role` REVIEW/COMPARISON — +40
2. Produto afiliado ativo mapeado no cluster do artigo — +30
3. >=1 imagem própria (exclui logo/favicon) — +15
4. Intenção clara (`role` != INSTITUTIONAL/OTHER) — +10
5. >=600 palavras — +5

Páginas institucionais (`contato`, `sobre`, `politica-editorial`,
`autores/*`) nunca entram no piloto.

## Garantias

- Não acessa a internet, não usa IA generativa nesta fase (só
  heurísticas determinísticas sobre dados já existentes).
- Não modifica nenhum `index.html`, imagem, `affiliate-products.json`
  ou `sitemap.xml` — validado automaticamente a cada execução
  (hash antes/depois dos HTMLs, comparação byte a byte do
  affiliate-products.json).
- Não gera as 8 peças de conteúdo social completas — só a estrutura de
  oportunidade por formato.
- Não publica em Facebook/Instagram — não existe esse código nesta V1.
- Não faz `git add`/`commit`/`push`, não faz deploy.
- Determinístico: mesma entrada sempre produz a mesma seleção de
  piloto e os mesmos pacotes (exceto `generated_at`).

## Arquivos desta skill

```
tools/social-content-engine/
  src/loader.js            carrega site-index/content-strategy/affiliate-products (somente leitura)
  src/cluster-lookup.js     reaproveita cluster do content-strategy.json; fallback heurístico marcado como tal
  src/select-pilot.js       seleção determinística dos 10 artigos-piloto
  src/analyze-article.js    análise por artigo: público, potencial por formato, problemas — sem gerar conteúdo
  src/similarity.js         aviso de possível sobreposição de tema entre artigos do piloto
  src/writer.js             escrita atômica dos pacotes/índice
  src/report.js             gera reports/social-content/dry-run.md
  src/validate.js           validações pós-execução (integridade de HTML/afiliados)
  src/index.js              CLI
  test/                     node --test
```
