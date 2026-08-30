# Auditoria de Afiliados — Fase 1 (somente leitura)

**Data:** 2026-08-30
**Escopo:** 73 artigos publicados em smartpetgadgets.com.br
**Ação executada:** apenas leitura e análise. Nenhum HTML foi alterado, nenhum commit, nenhum deploy.

## Números gerais

| Métrica | Valor |
|---|---|
| Artigos analisados no total | 73 |
| Artigos relacionados ao cluster de comedouros/alimentadores | 20 |
| Links do Mercado Livre encontrados nesses 20 artigos | 29 |
| Links potencialmente problemáticos | 29 (100% dos encontrados) |
| Artigos do cluster sem nenhum link do Mercado Livre no domínio `mercadolivre.com.br` | 1 (`comedouro-cachorro`) — **correção pós-auditoria:** não é órfão; já monetizado via `meli.la`, ver nota abaixo |

## O problema encontrado nos links atuais

Todos os 29 links apontam para URLs no padrão:

```
https://lista.mercadolivre.com.br/<termo-de-busca>?matt_word=nildoalvesdeoliveiramenild&matt_tool=10906170
```

Ou seja: são **resultados de busca por palavra-chave** com seu identificador de afiliado (`matt_word`/`matt_tool`) anexado — não são links de produto individual, e não são o link oficial da "Lista de Afiliados" compartilhável do Mercado Livre.

Implicações:
- O conteúdo do destino pode mudar a qualquer momento (o Mercado Livre decide o que aparece naquela busca), sem controle seu.
- Nenhum desses 29 links aponta hoje para um dos 15 produtos da base oficial (`.data/affiliate-products.json`).
- Nenhum aponta para `list.affiliate_url` (que ainda está `null`, pendente de você colar o link oficial da Lista compartilhada).
- Termos de busca se repetem bastante: `comedouro-automatico` (a busca mais genérica) aparece em 10 dos 20 artigos, inclusive em artigos com intenção bem diferente entre si (ex.: artigo de viagem e artigo "faz mal" usam o mesmíssimo link).

## Distribuição de intenção comercial

| Intenção | Qtd. artigos | Ação recomendada típica |
|---|---|---|
| Review de produto específico | 5 | Produto individual (quando existe correspondência na base) ou marcar sem correspondência |
| Multi-gatos / caso de uso específico | 2 | Produto individual |
| Guia comparativo / "melhor X" | 5 | Lista de Afiliados |
| Informacional (mitos, riscos, limpeza) | 4 | Lista de Afiliados ou CTA leve |
| Comparação de categoria (com/sem Wi-Fi, gato x cachorro) | 2 | CTA duplo ou Lista (decisão pendente) |
| Tutorial de app | 1 | Produto individual (o que usa o app citado) |
| Kit combo | 1 | Produto individual |

## Achados que precisam da sua decisão antes da Fase 2

1. **3 produtos quase-duplicados na base** para "NewPet 4L com voz" (`MLB54558374`, `MLB48883369`, `MLB63214646`). Provavelmente o mesmo produto anunciado por vendedores/variações diferentes. `comedouro-newpet-4l-review` precisa de 1 escolhido por você.
2. **4 artigos sem produto correspondente na base**: `cat-mate-c500-review`, `comedouro-newpet-2l-review`, `comedouro-vdrbg-4l-wifi-review`, `melhor-comedouro-interativo-gato`. São reviews/nichos de produtos que não estão entre os 15 (marca diferente ou capacidade diferente). Recomendo não forçar substituição — decidir caso a caso.
3. ~~1 artigo órfão de monetização~~ **CORRIGIDO (auditoria pós-Fase 2A, 2026-08-30):** `comedouro-cachorro` **não é órfão**. Ele já possui 2 ocorrências de um link de afiliado próprio, `https://meli.la/1iG4YjY`, presentes no HTML desde antes da Fase 2A. A varredura original desta Fase 1 só buscou pelo domínio `mercadolivre.com.br` e não detectou links já encurtados em `meli.la`, gerando esse falso positivo. Esse link não está registrado em `.data/affiliate-products.json` (é de um produto/kit fora da base de 15) — o artigo segue sem produto exato na base, mas **já está monetizado** e não deve ser tratado como oportunidade órfã em uma futura Fase 2B.
4. **`list.affiliate_url` ainda não fornecido** — enquanto isso, todo artigo recomendado para "Lista de Afiliados" (8 artigos) fica sem destino real até você colar o link.

## Correção pós-auditoria (2026-08-30, após validação da Fase 2A)

A auditoria pós-migração (somente leitura) revelou uma lacuna no método de varredura desta Fase 1: a busca original só reconhecia links do domínio `mercadolivre.com.br`, ignorando links já encurtados (`meli.la/...`). Isso fez `comedouro-cachorro` ser classificado erroneamente como "órfão de monetização" quando na verdade já tinha 2 links de afiliado próprios (`https://meli.la/1iG4YjY`), pré-existentes e fora da base de 15 produtos.

**Regra corrigida para as próximas fases/clusters:** um artigo só pode ser classificado como "órfão de monetização" depois de verificar todas estas fontes:
1. URLs `meli.la/*`
2. URLs oficiais de afiliado do Mercado Livre em qualquer outro formato
3. URLs `mercadolivre.com.br` explicitamente registradas como `affiliate_url` em alguma base de dados
4. URLs presentes em `.data/affiliate-products.json`

Nenhum HTML, link ou mapeamento da Fase 2A foi alterado por esta correção — é puramente documental.

## Arquivos gerados nesta fase

- `reports/affiliate/affiliate-audit.md` (este arquivo)
- `reports/affiliate/article-product-mapping.md` (tabela artigo → intenção → produto → justificativa)
- `reports/affiliate/affiliate-opportunities.json` (mesmo mapeamento em formato estruturado, para consumo por uma futura Fase 2)

Nenhum artigo HTML foi modificado. Nenhum commit ou deploy foi realizado.
