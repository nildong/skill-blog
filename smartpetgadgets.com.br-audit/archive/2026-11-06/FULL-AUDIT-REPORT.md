# Auditoria SEO Completa — smartpetgadgets.com.br
Data: 2026-11-06 | Tipo: publisher afiliado/review (pet gadgets, pt-BR), HTML estático na Hostinger, 72 posts / 78 URLs | Auditoria anterior: 2026-11-04 (cópia em `archive/2026-11-04/`)

## Resumo Executivo

**SEO Health Score: 85/100** (era 84).

O deploy de 11-05 está no ar e não quebrou nada:
- `/cluster-comedouro-automatico-pet/` responde 410 e o `.htaccess` nega `.md` e `.json`.
- `affiliate-cta.js` responde 200, sem CLS e com TBT ≤ 100 ms.
- Os 14 titles novos não têm duplicados e nenhum passa de 65 caracteres.
- O bebedouro foi de LCP 3,5 s para 0,9 s, e o sitemap foi reenviado em 11-04.

O que não mudou: o formato das páginas de dinheiro e o CTR. O CTA novo também trouxe dois riscos: o evento `affiliate_click` tem 0 disparos, e em páginas sem lista de produtos o botão é genérico.

| Categoria | Peso | 11-04 | 11-06 |
|---|---|---|---|
| SEO Técnico | 22% | 96 | **95** |
| Qualidade de Conteúdo | 23% | 75 | **76** |
| SEO On-Page | 20% | 84 | **85** |
| Schema / Dados Estruturados | 10% | 84 | **85** |
| Performance (CWV) | 10% | 96 | **99** |
| Preparo para Busca com IA | 10% | 72 | **73** |
| Imagens | 5% | 80 | **80** |

Diagnósticos fora do score:
- SXO Gap 66/100 (era 65)
- GEO 72 (era 71)
- Agentic 96, Lighthouse Agentic 3/3
- Visual 83 (era 82)
- Google Data 63
- Backlinks: dados insuficientes

### Top 5 Problemas
1. **Páginas de dinheiro com formato errado, sem mudança desde 10-29:**
   - `melhor-coleira-gps-sem-mensalidade` não nomeia nenhum produto (CRÍTICO no SXO). Agora tem um "Ver preço" de um produto sem nome, numa página que alerta sobre taxas escondidas.
   - O par de câmeras se canibaliza. `melhor-camera-para-monitorar-pet` tem 345 palavras e 4 modelos.
   - `melhor-bebedouro-automatico-pet` tem 2 produtos. Correção do registro anterior: os 4–5 produtos de 10-25 estão no `bebedouro-inox-x-ceramica`.
2. **`affiliate_click` = 0 eventos no GA4 desde 11-05.** Foram só ~15 sessões depois do deploy, então isso não prova falha, mas o rastreio precisa ser testado antes de medir a conversão do CTA.
3. **CTA do topo genérico.** Em sem-mensalidade, nas duas páginas de câmera, em bebedouro-automatico e em gps-gato, o botão diz só "Ver preço no Mercado Livre", e a barra fixa repete isso até o rodapé. No antipulgas, a barra fixa nunca aparece porque `#comparativo` a esconde antes. A barra tem 72px, mas o body reserva 64px.
4. **CTR caindo:**
   - 28 dias: 42 cliques e 3.740 impressões, CTR de 1,12%.
   - 7 dias: CTR de 0,85%, o pior da série.
   - 27 páginas estão entre as posições 4 e 20 com 0 cliques.
   - O Google ainda não rastreou os titles novos (último crawl até 10-31).
5. **Conteúdo raso.** 36 de 72 posts têm menos de 600 palavras e 29 têm menos de 400. Em 29 posts a FAQ repete o corpo.

### Top 5 Quick Wins
1. Testar um clique real de afiliado no GA4 DebugView ou Realtime (10 min).
2. Pedir indexação, via Inspeção de URL, das 14 páginas retituladas e das 9 com abertura GEO, e enviar ao IndexNow.
3. Incluir só a tag `affiliate-cta.js` (sem o bloco do topo; eles foram pulados de propósito em 11-05 porque já têm link antes do 1º H2) nos 4 posts com afiliado que hoje ficam sem medição e sem barra fixa:
   - `coleira-seresto-antipulgas`
   - `comedouro-automatico-para-pet`
   - `comedouro-newpet-4l-review`
   - `configurar-app-comedouro-wifi`

   Corrigir também o `rel` de 8 links: 5 em seresto e 3 em `cachorro-de-casa-pega-pulga`.
4. Barra fixa: corrigir o gatilho no antipulgas e trocar o padding do body de 64px para 72px.
5. Ajustar as 2 promessas de title e meta sem cobertura no texto:
   - `camera-pet-com-dispensador` fala em ansiedade;
   - `como-instalar-porta` fala em parede.

   Corrigir também o "71 artigos" da home (são 72).

## Dados do Google (GSC 10-07..11-03; GA4 10-27..11-05)
- **28 dias:** 42 cliques (eram 17), 3.740 impressões (eram 1.161), posição 9,8.
- **7 dias:** 10 cliques, 1.172 impressões, CTR 0,85%, posição 9,0. As impressões sobem e os cliques não.
- **Maiores oportunidades com 0 cliques:**
  - `coleira-gps-para-gato`: 138 impressões
  - `camera-para-monitorar-pet`: 136
  - `melhor-antipulgas-para-cachorro`: 123
- **Caindo:**
  - `melhor-comedouro-automatico-cachorro`: 9,8 → 22,8 (24,5 nos últimos 7 dias).
  - `melhor-tapete-higienico-para-cachorro`: 10,0 → 17,0. É novo, e é a principal landing do ChatGPT.
  - Home: posição 43.
- **GA4:** 91 sessões no total.
  - Direct 32, Facebook 25, ChatGPT 17 e Orgânico 17.
  - O ChatGPT cai em tapete (11) e coleira-gps-para-gato (6).
- **Indexação:** 12 de 12 URLs inspecionadas indexadas. O sitemap foi reenviado em 11-04, com 0 erros. O CrUX segue sem dados.
- **Updates do Google:** só o Spam Update de 09-24, sem queda coincidente. O ledger está defasado em 39 dias.

## SEO Técnico — 95/100
**O que funciona:**
- 78 de 78 URLs respondem 200, com canonical próprio, 1 H1 e sem noindex.
- 0 links internos quebrados.
- GA4 pós-load em 78 de 78 páginas.
- O deploy de 11-05 foi confirmado ao vivo.

**Achados:**
- **Médio:** 4 posts com afiliado não carregam `affiliate-cta.js`. Foram pulados de propósito porque já têm link cedo, mas assim ficam sem `affiliate_click` e sem barra fixa. Basta incluir o script.
- **Médio:** 8 links de afiliado sem `sponsored`/`nofollow`.
- **Baixo, persistentes:**
  - `http://www` faz 2 saltos de redirect;
  - `/index.html` responde 200;
  - a página 404 é a genérica da hospedagem, em inglês;
  - falta o header Permissions-Policy;
  - `img/logo-dark.png` está no ar, mas fora do git;
  - não há IndexNow.
- **Info:** `affiliate-cta.js` tem cache de 7 dias. Use `?v=` ao alterá-lo.

Detalhes em `findings/technical.md`.

## Qualidade de Conteúdo — 76/100
E-E-A-T 61, citação por IA 80. As 9 aberturas com resposta direta estão boas.

**Achados:**
- **Alto:** conteúdo raso. A prioridade é reconstruir `melhor-camera` e consolidar nela as páginas de dúvidas e de erros comuns de câmera (301). Depois, porta e brinquedo.
- **PIOROU:** 61 posts ganharam o CTA genérico do topo. Em páginas de ~300 palavras ficam 2 CTAs mais a barra.
- **Novo:** a data "Atualizado em 5/11" mudou em 9 páginas por causa de um único parágrafo.
- **Novo:** 2 titles ou metas prometem o que o texto não tem.
- O ANXK G68 tem 1 avaliação e é recomendado em 2 páginas, com preço de agosto (hoje R$ 301,99).
- "Key Takeaways" com marcadores `- ` soltos em 24 páginas.
- Antipulgas sem o alerta da FDA. Seresto e pulga sem link externo.

Detalhes em `findings/content.md`.

## SEO On-Page — 85/100
Os titles reescritos estão no ar, sem duplicados. O gargalo é o CTR: 27 páginas entre as posições 4 e 20 com 0 cliques. Ainda não dá para medir o efeito da reescrita, então meça entre 26/11 e 03/12. Restam metas curtas em `erros-comuns-porta` (94 caracteres) e `erros-comuns-brinquedo` (108), e titles curtos em sobre e contato.

## Schema — 85/100
- 0 erros de parse em 78 URLs: 72 BlogPosting, 72 FAQPage (só Info, o rich result foi aposentado) e 29 Product+Review.
- O `dateModified` do vdrbg foi corrigido.
- Continua: não há grafo `@id`, e as 73 Persons não têm `image` nem `sameAs`.
- As seções novas (bebedouro, pilha, GPS gato, cerca) não têm Product.
- Novo: `dateModified` divergente em `comedouro-automatico-vale-a-pena`.

Detalhes em `findings/schema.md`.

## Performance — 99/100
- PSI mobile com média de 99. Bebedouro 99 (LCP 0,9 s), home 99, GPS 100.
- O antipulgas é o único acima do limite: LCP de 2,8 s.
- O `affiliate-cta.js` não causou regressão (CLS 0).
- O INP do clique fica sem verificação até haver dados de campo.

## Imagens — 80/100
Sem mudança:
- 6 heroes com mais de 200 KB (o maior tem 344 KB);
- 91 JPG em 239 imagens;
- `fetchpriority` em 11 posts;
- 0 imagens sem alt ou sem dimensões.

## Preparo para Busca com IA — 73/100
**O que funciona:**
- Os crawlers de busca de IA estão liberados.
- O `llms.txt` está alinhado: 78 de 78 URLs, com os titles novos.
- O ChatGPT trouxe 17 sessões, empatado com o orgânico.

**Achados:**
- **Alto:** as aberturas de sem-mensalidade e de porta-eletronica não nomeiam produto.
- **Médio:** 8 das 9 aberturas não têm preço, e nenhuma tem uma linha de método ("consultado em… / não testamos").
- **Médio:** o lastmod subiu em massa para 11-05 em 71 de 78 URLs por causa de uma mudança de template. Isso apaga o sinal das 23 mudanças reais.
- Falta grafo de entidade (`@id`, foto e `sameAs` do autor).

Detalhes em `findings/geo.md` e `findings/agentic.md`.

## SXO — Gap 66/100
- Em páginas de comparação (comedouro, tapete, antipulgas, inox-x-ceramica), o CTA do topo leva à tabela de produtos, o que se encaixa no SERP de listas "top N".
- Em páginas sem lista, o CTA é genérico e é um HIGH novo.
- Comedouro-cachorro: o head term agora mostra páginas de categoria da Petlove e da Cobasi, e a troca de produtos de 10-22 deixou 3 de 7 modelos com câmera. É hipótese; a confirmação depende de dados do GSC por query.

Detalhes em `findings/sxo.md`.

## Backlinks
O domínio segue fora do Common Crawl e não há chaves Moz nem Bing, então não há score. Próximo passo: exportar o relatório "Links" do GSC e colocar o link do site no perfil do Facebook.
