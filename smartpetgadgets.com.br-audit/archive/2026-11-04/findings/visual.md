# Auditoria Visual / Mobile - smartpetgadgets.com.br (2026-11-04)

Páginas: `/`, `/melhor-comedouro-automatico-cachorro/`, `/melhor-bebedouro-automatico-pet/`. Viewports 1366x768 e 390x844 (mobile com touch), claro e escuro.
Screenshots (sobrescritos) em `screenshots/`: `{home|comedouro|bebedouro}_{desktop|mobile}[_dark].png` e `{pagina}_mobile_full.png`.

## Veredito: APROVADO com problemas médios. Nota Images/Visual: 82/100

## Verificações
- Rolagem horizontal da página: 0/12 combinações (scrollWidth == viewport). OK.
- H1 acima da dobra em todas (base <= 259px mobile, <= 216px desktop). Fonte base 16px. OK.
- Modo escuro: fundo rgb(18,18,18) aplicado nas 3 páginas; botão de tema alterna e legível; logo da home visível. OK.
- Botão de tema: 44px desktop / 40px mobile, sem sobreposição com o breadcrumb em 390px (o breadcrumb quebra linha antes). Sobreposição de 10-29 não reproduzida.
- Imagens: 0 imagens com resolução abaixo de 80% do tamanho exibido; posts com alt em 100%.

## Achados
1. MÉDIO - Bebedouro: primeiro link de afiliado em y=7888 (mobile) / 4797 (desktop), e só 1 link de afiliado (antes eram 7 em 10-29). Sem CTA acima da dobra e quase sem CTA no post. Correção: card/tabela de picks com botão "Ver preço" após a introdução (como o comedouro) e CTAs nas seções de produto.
2. MÉDIO - Comedouro, tabela no mobile: 645px num wrapper de 358px com `overflow-x:auto` (rola, não quebra a página), mas sem dica visual de rolagem. Correção: sombra/gradiente na borda direita, ou `min-width` com coluna produto fixa (sticky), ou layout em cards no mobile.
3. MÉDIO - Comedouro: primeiro CTA ("Ver preço") em y=1784 mobile / 1526 desktop (14 links). Fora da dobra, mas ~2 telas, aceitável. Correção opcional: botão "Ver melhor preço" após o bloco de resumo.
4. BAIXO - Tap targets < 44px: botões "Ver preço" 86x35, "Ler artigo →" 85x35, "Ler review →" 90x35; links do breadcrumb/byline/links inline 16-17px de altura (Início 34x16, Nildo Alves 71x16). Botão de tema 40x40 no mobile. Correção: `min-height:44px` nos botões e `padding:.5rem 0`/`display:inline-block` nos links do breadcrumb e de listas; tema 44x44.
5. BAIXO - Home mobile: o menu tem 4º item cortado ("S..." visível, provavelmente "Sobre"/"Contato") com rolagem interna do nav; sem indicação de que há mais itens. Correção: reduzir padding dos itens ou adicionar fade/gradiente na borda direita.
6. BAIXO - Home: 10 imagens sem `alt` (de 86). Correção: alt descritivo ou `alt=""` se decorativas.
7. BAIXO - Bebedouro: breadcrumb com pai "Comedouro Automático para Pet" (categoria de comedouro para um post de bebedouro). Correção: usar categoria "Alimentação e hidratação" ou equivalente.
8. BAIXO - Home sem botão de CTA no hero; as categorias ("21 artigos →") funcionam como CTA e ficam visíveis no mobile. Sem ação urgente.
9. BAIXO (não reverificado) - Posts continuam sem header/nav do site (só breadcrumb + toggle).

## Delta vs 2026-10-29
- RESOLVIDO: sobreposição breadcrumb/botão de tema em 390px; sem overflow em nenhum viewport testado.
- PIORA: bebedouro caiu de 7 para 1 link de afiliado (primeiro em y=7888 mobile vs 9981 antes, mas por haver menos links).
- MANTIDO: tabela larga do comedouro no mobile (645px, igual a 10-29/anterior), CTAs distantes da dobra no bebedouro, tap targets pequenos.
- Não reverificado nesta rodada: bullets literais "- " em Takeaways (tapete/bebedouro) - bebedouro não foi testado para isso; checar.
