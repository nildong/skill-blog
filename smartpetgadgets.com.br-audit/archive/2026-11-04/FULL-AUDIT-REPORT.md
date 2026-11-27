# Auditoria SEO Completa — smartpetgadgets.com.br
Data: 2026-11-04 | Tipo: publisher afiliado/review (pet gadgets, pt-BR), HTML estático na Hostinger, 72 posts / 78 URLs | Auditoria anterior: 2026-10-29

## Resumo Executivo

**SEO Health Score: 84/100** (era 83).

As correções da semana funcionaram, conferidas no site ao vivo:
- **E-E-A-T:** as alegações de teste e a byline duplicada sumiram das 77 páginas.
- **Home:** passou para miniaturas WebP. PSI mobile foi de 92 para 99 e o peso caiu 67%.
- **Robots:** o `Disallow: /reports/` saiu, e o Google agora vê o 410.

O que não mudou: as páginas de dinheiro. O SXO aponta formato errado nas mesmas páginas de 10-29.

| Categoria | Peso | 10-29 | 11-04 |
|---|---|---|---|
| SEO Técnico | 22% | 95 | **96** |
| Qualidade de Conteúdo | 23% | 73 | **75** |
| SEO On-Page | 20% | 83 | **84** |
| Schema / Dados Estruturados | 10% | 85 | **84** |
| Performance (CWV) | 10% | 90 | **96** |
| Preparo para Busca com IA | 10% | 71 | **72** |
| Imagens | 5% | 76 | **80** |

Diagnósticos complementares, fora do score:
- SXO Gap 65/100 (era 66)
- Agentic 96/100, Lighthouse Agentic 3/3
- GEO 71/100
- Backlinks: dados insuficientes

### Top 5 Problemas
1. **Pasta interna publicada (novo).** `/cluster-comedouro-automatico-pet/` responde 200 para estes arquivos:
   - `about.md` e os briefs `a1-…` a `d2-…`
   - `cluster-plan.json` e `cluster-plan-fase2.json`
   - `quality-report.md`, `cannibalization-report.md` e `cluster-map.html`

   Isso expõe a estratégia e cria conteúdo duplicado dos posts em `.md`.
2. **Páginas de dinheiro com formato errado, sem mudança desde 10-29:**
   - `melhor-coleira-gps-sem-mensalidade` não nomeia nenhum produto (CRÍTICO no SXO).
   - O par de câmeras se canibaliza: posição 19,5 contra 17,2, e o hub usa "Melhor Câmera…" no title.
   - `melhor-bebedouro-automatico-pet` tem 2 produtos e 1 CTA, enquanto o SERP pede "N fontes comparadas".
3. **Queda de `melhor-comedouro-automatico-cachorro`.** Foi da posição 9,8 para 22,8 e não se recuperou com o recrawl de 10-31. A queda coincide com o commit `987323d` (10-22, "atualiza produtos e links de afiliado"). É hipótese, não prova.
4. **O CTR é o gargalo.** Foram 3.604 impressões e 42 cliques (1,17%). 27 páginas estão entre as posições 4 e 20 com 0 cliques. Ainda não há clique não-marca identificável.
5. **Conteúdo raso e com cara de rascunho:**
   - 37 de 72 posts têm menos de 600 palavras.
   - Os FAQs repetem o corpo (sobreposição mediana de 0,876).
   - 113 marcadores "- " literais em 24 páginas, com "Key Takeaways" em inglês.

### Top 5 Quick Wins
1. Remover `/cluster-comedouro-automatico-pet/` do servidor e do deploy, e pedir a remoção no GSC (15 min).
2. Reenviar o sitemap no GSC. O último envio foi em 08-26, há 70 dias.
3. Bebedouro: trocar o preload do JPG para o WebP. Antipulgas: hero WebP com srcset e `fetchpriority`. LCP esperado vai de 3,5 s para ~1 s.
4. Ajustar title e meta das páginas nas posições 4 a 8 com 0 cliques:
   - `comedouro-automatico-para-viagem`
   - `comedouro-vdrbg-4l-wifi-review`
   - `erros-comuns-coleira-gps-pet`
   - `camera-pet-grava-sem-internet`
   - `comedouro-gato-x-cachorro-diferenca`
5. Corrigir o `rel` dos links do Mercado Livre:
   - `sponsored` nos 5 links diretos em `coleira-seresto-antipulgas`;
   - `nofollow` nos 3 de `cachorro-de-casa-pega-pulga`.

## Dados do Google (GSC 10-06..11-02 contra 09-08..10-05)
- **Totais:** 42 cliques (eram 16), 3.604 impressões (eram 1.080), CTR de 1,17% e posição média 9,9.
- **Tendência:** as impressões diárias subiram de ~80 para 130–190.
- **Queries:** 48 de 136 queries estão no top 10 (antes eram 10 de 58).
- **Top páginas:**
  - `configurar-app-comedouro-wifi`: 12 cliques, posição 4,5.
  - `bebedouro-inox-x-ceramica`: 4 cliques, posição 7,8.
  - `comedouro-automatico-para-dois-gatos`: 159 impressões, posição 6,4.
- **Subindo:** "qual a melhor coleira com gps para gatos" foi de 25 para 15. "melhor câmera para monitorar pet" foi de 29 para 11.
- **Caindo:**
  - `melhor-comedouro-automatico-cachorro`: de 9,8 para 22,8.
  - `melhor-alimentador-automatico-gatos`: de 16,1 para 23,4.
  - Home: de 30,2 para 44,3.
- **Indexação e sitemap:** inspeção de 10 URLs, todas indexadas e com canonical correto. O sitemap tem 78 URLs e 0 erros.
- **GA4 e CrUX:** 11 sessões orgânicas desde 10-26 (amostra pequena). O CrUX não tem dados por falta de tráfego; o 403 anterior foi resolvido.
- **Updates do Google:** só o September 2026 Spam Update (09-24), sem queda coincidente. O ledger está defasado desde 09-28.

## SEO Técnico — 96/100
**O que funciona:**
- As 78 URLs do sitemap respondem 200, têm canonical próprio e nenhuma tem noindex.
- Não há links quebrados nem páginas órfãs.
- O site ao vivo é idêntico ao repositório (md5).
- `/reports/` responde 410 e agora fica visível ao Google.
- O GA4 está em 78 de 78 páginas.
- HSTS, HTTP/2 e brotli estão ativos. `.git` e `.htaccess` respondem 403.

**Findings:**
- **[Alta] Pasta de planejamento publicada** (ver Top 1). Remover a pasta, adicionar um deny para `*.md` e `*.json` no `.htaccess` (exceto assets) e excluir a pasta do script de deploy.
- **[Baixa]** http://www faz 2 saltos de redirect. Trocar por um 301 único.
- **[Baixa]** `/index.html` responde 200. Fazer 301 para `/`.
- **[Baixa]** A página 404 é a padrão da Hostinger. Criar uma 404 com a marca.
- **[Baixa]** Falta o header Permissions-Policy.
- **[Baixa]** O deploy não é reproduzível pelo git: `logo-dark.png` não está versionado e `local_dirs.txt` está solto na raiz.
- **[Info]** A chave do IndexNow está publicada, mas não há envios.

## Qualidade de Conteúdo — 75/100
**O que funciona:**
- A transparência agora é coerente: um único autor e nenhuma alegação de teste. O resíduo é a legenda do tapete, "não testamos cada camada…", que vale trocar.
- Os ledes respondem logo de início.
- As seções novas trazem tabelas datadas e "Pontos de atenção".
- Os alertas de MDR1/ivermectina e cerca GPS × elétrica estão bem feitos.

**Findings:**
- **[Alta]** Clusters rasos (câmera, brinquedo, porta). 37 de 72 posts têm menos de 600 palavras, 29 menos de 400.
- **[Média]** FAQs redundantes: 31 posts têm sobreposição acima de 0,9.
- **[Média, novo]** 113 `<p>- …</p>` e "Key Takeaways" são Markdown não convertido. Trocar por `<ul>` e "Pontos principais".
- **[Média]** Lacunas YMYL: o antipulgas não tem o alerta da FDA sobre isoxazolinas, e Seresto e pulga não têm fonte externa.
- **[Média]** 115 citações "retrieved" em inglês. Cerca de 85% das fontes são varejo ou listicle.
- **[Média]** Não há artefatos de experiência própria. O CTA genérico se repete em 75 páginas. O ANXK G68 é chamado de "Melhor" com 1 avaliação.
- **[Baixa, novo]** O box do autor tem 3 descrições diferentes. A home diz "71 artigos", mas são 72.

## SEO On-Page — 84/100
**O que funciona:** os títulos e as metas são únicos e cada página tem 1 H1. Todos os clusters têm links hub↔spoke nos dois sentidos, o que estava incompleto em 10-29.

**Findings:**
- **[Alta]** 27 páginas estão entre as posições 4 e 20 com 0 cliques. É preciso reescrever title e meta.
- **[Alta]** Canibalização no cluster de câmera. O hub vira guia, e "Melhor…" fica só na página de compra, que deve ser expandida para 1.200+ palavras. A alternativa é consolidar com 301.
- **[Média]** 17 páginas recebem menos de 3 links internos. A lista de ~25 links está em `findings/cluster.md`.
- **[Média]** O hub do comedouro duplica o tema de `comedouro-automatico-vale-a-pena`, e os dois usam "Guia 2026" no title.
- **[Baixa]** Metas longas em `/autores/nildo-alves/` (191 caracteres) e `gato-obeso` (161). Títulos curtos em `/sobre/` e `/contato/`.

## Schema — 84/100
**O que funciona:**
- Os 78 JSON-LD são válidos e os 72 BlogPosting estão completos.
- Há BreadcrumbList em todos os posts.
- 291 das 292 perguntas de FAQ batem com o texto visível.
- As 29 Reviews não alegam teste.

**Findings:**
- **[Média]** O grafo não tem `@id` e a Person não tem `image`.
- **[Média]** Bebedouro-inox, brinquedo-pilha e antipulgas não têm Product nem ItemList. Isso depende da reformulação de afiliados, que está pausada.
- **[Baixa]** O autor das Reviews é Organization, enquanto o BlogPosting usa Person. Há 10 Products sem `image`, `worstRating` igual a 1 no newpet-2l e o `reviewBody` do Sanol cita 4.9 contra uma nota de 7.7.
- **[Info]** O FAQPage não gera mais rich result. Pode ser mantido, mas não vale adicionar por esse motivo.

## Performance — 96/100 (lab, sem CrUX)
| Página | Mobile | LCP | CLS |
|---|---|---|---|
| / | 99 | 1,7 s | 0,001 |
| melhor-comedouro-automatico-cachorro | 100 | 0,8 s | 0 |
| melhor-bebedouro-automatico-pet | 90 | 3,5 s | 0 |
| melhor-antipulgas-para-cachorro | 90 | 3,5 s | 0 |
| coleira-gps-para-pet | 100 | 0,8 s | 0 |

- **[Alta]** Bebedouro: o preload aponta para o JPG, mas o `<picture>` serve WebP, então a imagem é baixada duas vezes.
- **[Alta]** Antipulgas: o hero é 1200×1200, sem `fetchpriority` nem preload.
- **[Média]** O GA4 gera long tasks (TBT de 110–120 ms). Carregar depois do evento `load`.
- **[Baixa]** A home tem 7 imagens eager. Deixar eager só a do LCP. Assets versionados podem usar `immutable`.

## Preparo para Busca com IA — 72/100
**O que funciona:**
- O `llms.txt` lista 78 de 78 URLs, sincronizado com o sitemap.
- Os crawlers de busca de IA recebem 200.
- Lighthouse Agentic 3/3 e Agent-UX 100.

**Findings:**
- **[Alta]** As páginas principais de coleira GPS não têm nada citável: nenhum produto, nenhum número.
- **[Alta]** A presença fora do site é mínima: só o Facebook. O domínio não aparece no grafo do Common Crawl.
- **[Média]** O antipulgas (YMYL) não tem ItemList nem revisão veterinária.
- **[Baixa]** O robots.txt diz `Allow` para o GPTBot e o meta-externalagent, mas o servidor devolve 429, e o Content-Signal diz `ai-train=no`. É preciso escolher uma política coerente.
- **[Baixa]** O `llms.txt` é manual. Gerar junto com o sitemap.

## Imagens — 80/100
- **Corrigido:** a home está 100% em WebP 400w/800w com srcset.
- **[Média]** 97 de 239 imagens dos posts não estão em WebP, e 6 arquivos passam de 200 KB. O maior é `porta-eletronica-impede-entrada-outros-animais-hero.jpg`, com 344 KB.
- **[Média]** Só 10 de 73 posts têm `fetchpriority="high"` no hero.
- **[Baixa]** 10 `alt=""` nos cards da home (decorativos).

## Visual / Mobile (82/100, fora do score)
- **O que funciona:** nenhuma das 12 combinações de página, viewport e tema tem rolagem horizontal. O modo escuro está ok. A sobreposição breadcrumb/toggle foi resolvida.
- **[Média]** O primeiro CTA do bebedouro só aparece em y=7.888 no mobile.
- **[Média]** A tabela do comedouro rola no mobile sem nenhuma dica de rolagem.
- **[Baixa]** Os tap targets têm 35px (o mínimo recomendado é 44px). O 4º item do menu da home fica cortado. O breadcrumb do bebedouro aponta para a categoria errada.

## Afiliados (fora do score; a reformulação continua pausada)
- 90 dos 96 IDs meli.la não estão no catálogo. É só um relato; não aplicar fix em massa.
- O disclosure está presente nos 72 posts com meli.la. 149 de 152 links têm `sponsored`.
- 21 posts mostram preços, mas só 9 trazem a data "consultado em".

## Backlinks
O Common Crawl não tem o domínio (release jan–mar 2026). Sem Moz ou Bing, não há como pontuar. O próximo passo é exportar o relatório "Links" do GSC e configurar a chave gratuita da Moz.

## Arquivos
- `findings/*.md`: detalhes por especialista.
- `screenshots/`: capturas de desktop e mobile, nos temas claro e escuro.
- `audit-data.json`: dados estruturados.
- `ACTION-PLAN.md`: plano de ação priorizado.
