# Auditoria Visual / Mobile - smartpetgadgets.com.br (2026-11-06)

Páginas: `/`, `/coleira-gps-para-pet/` (pilar), `/melhor-antipulgas-para-cachorro/` (comparativo), `/comedouro-automatico-vale-a-pena/` (comedouro). Viewports 1350x940 e 390x844 (mobile com touch), claro e escuro.
Screenshots (em `screenshots/`): `{home|coleira|antipulgas|comedouro}_{desktop|mobile}[_dark].png`, mais `{pagina}_mobile_bar[_dark].png` (rolagem com a barra fixa) e `{pagina}_mobile_scrolled.png`. Foco: CTA de afiliado no topo e barra fixa mobile (deploy 2026-11-05), modo escuro, hero/LCP.

## Veredito: APROVADO com problemas médios. Nota Images/Visual: 83/100

## Verificações
- Rolagem horizontal: 0/16 combinações (scrollWidth == viewport). OK.
- H1 acima da dobra em todas (base <= 217px mobile, <= 216px desktop). OK.
- Sem banner de cookies/consentimento nas 4 páginas, portanto não há sobreposição com a barra fixa. A única outra camada fixa é o botão de tema (topo direito, 44px desktop / 40px mobile).
- Modo escuro (toggle + `prefers-color-scheme`): fundo rgb(18,18,18); CTA do topo escuro com borda laranja e botão #b23a0d legível; barra fixa vira #1c1c1c; links em laranja claro (padrão #ffab73) legíveis; logo da home troca para `logo-dark.png`. OK.
- Hero/LCP: coleira e antipulgas com `loading=eager` + `fetchpriority=high` e srcset (480w/800w no mobile/desktop). Comedouro "vale a pena": `eager`, mas `fetchpriority=auto` (hero único sem srcset, 1 arquivo para mobile e desktop). Home: sem hero em imagem, o LCP é texto/logo (logo com `loading=auto`).
- Hero antipulgas ocupa 358x358 no mobile (quadrado, caixa Simparic sobre branco): empurra o texto e o CTA para baixo; no escuro o fundo branco da foto destoa do tema.

## Novo CTA do topo (`.cta-top`) e barra fixa (`.cta-bar`)
| Página | CTA topo mobile (y) | CTA topo desktop (y) | Primeira linha de afiliado antes | Barra fixa mobile |
|---|---|---|---|---|
| Coleira pilar | 872-1036 (abaixo da dobra de 844) | 831-938 (botão visível, dobra 940) | link inline no 1º parágrafo | aparece de ~1200 até ~8900 |
| Antipulgas | 963-1130 (abaixo da dobra) | 1165-1248 (abaixo da dobra) | primeiro botão em y=3658 mobile / 2937 desktop | NUNCA aparece (ver achado 1) |
| Comedouro | 924-1088 (abaixo da dobra) | 871-978 (botão em 901-948, visível) | antes: sem CTA no topo | aparece de ~1200 até ~9400 |
| Home | sem CTA de afiliado (só "Comece pelo guia", botão do topo oculto no mobile) | idem | n/a | não existe (correto) |

## Achados
1. MÉDIO (novo) - Comparativo antipulgas: a barra fixa mobile nunca é exibida. O JS (`affiliate-cta.js`) mostra a barra só depois que o CTA do topo sai da tela (y>1130) e a esconde assim que `#comparativo` entra na viewport (y=1888, ou seja, a partir de scroll 1044). A janela é negativa, então a barra está morta nesse tipo de página (testado em 1150, 1400, 1700, 2800, 3200 e 6 pontos até o fim). Correção: para comparativos, esconder só depois que `#comparativo` passar do topo (`boundingClientRect.top < 0`), não ao intersectar; ou observar o `top` do alvo com `rootMargin` negativo.
2. MÉDIO (novo) - O CTA do topo fica abaixo da dobra no mobile nas 3 páginas de post (872 a 963 contra 844) e a barra fixa só entra depois de ~1200. Não parece spam: é um bloco único, discreto (fundo laranja 8%, borda esquerda, aviso "Link de afiliado — sem custo extra para você"), sem animação. O ponto de atenção é o oposto, o usuário só vê um CTA depois de 1 a 1,5 telas. No desktop, coleira e comedouro mostram o botão na dobra (comedouro por pouco, y=901-948 em 940). Correção opcional: no mobile, reduzir o hero (ou usar proporção 16:9 no antipulgas) para trazer o CTA para <=800px.
3. BAIXO (novo) - A barra fixa tem 72px de altura e o `body` reserva `padding-bottom:64px`; sobram 8px que podem cobrir a última linha do rodapé quando ela aparece junto. Na prática a barra some perto do fim (some ao chegar no `.cta-box`/`footer`), então o impacto é pequeno. Correção: `padding-bottom:calc(72px + env(safe-area-inset-bottom))`.
4. BAIXO (novo) - Tap targets da barra: botão principal 327x51 (OK); botão fechar "×" 29x34 (< 44x44, fica ao lado do CTA e dá risco de toque errado). Correção: `min-width:44px;min-height:44px`. Botão do CTA do topo: 266x47 desktop e 327x51 mobile (OK).
5. BAIXO (novo) - O botão de tema (fixed, 40x40, fundo branco 85%) fica sobre o texto na rolagem mobile (visto em `comedouro_mobile_bar_dark.png`: cobre o fim da linha "VDRBG..."/links). Em desktop não atrapalha. Correção: esconder o toggle ao rolar para baixo ou ancorá-lo no cabeçalho dos posts (não fixo), e subir para 44x44.
6. BAIXO - Cores da barra: botão #b23a0d com texto branco (contraste ~6:1, OK); no claro a barra é branca com sombra e some ao fechar (`sessionStorage`). Sem sobreposição com o botão de tema (topo vs base).
7. BAIXO (mantido) - Tap targets pequenos em links de breadcrumb/byline/inline (16-17px de altura) e botões secundários de cards ("Ver preço" 86x35, "Ler artigo →" 85x35). Correção: `min-height:44px` e `display:inline-block` com padding.
8. BAIXO (mantido) - Home mobile: menu com o 4º item cortado ("S...") com rolagem interna sem indicação. Correção: fade na borda direita ou reduzir padding.
9. BAIXO (mantido) - Posts sem header/nav do site (só breadcrumb + toggle); a home sem CTA no hero (as categorias funcionam como CTA).
10. BAIXO (novo) - Aviso "Link de afiliado" no CTA do topo está em .78rem (~12,5px) com opacidade 0,7: legível, mas abaixo de 16px. Manter por ser nota legal, aumentar para .85rem melhora o contraste no escuro.

## Delta vs 2026-11-04
| Item | 11-04 | 11-06 | Status |
|---|---|---|---|
| CTA acima da dobra (comedouro) | primeiro CTA em y=1784 mobile / 1526 desktop | CTA do topo em y=924 mobile / 871 desktop | MELHOROU (entra na dobra no desktop; ~80px abaixo no mobile) |
| Bebedouro/antipulgas: CTA no início | nenhum (bebedouro) | `.cta-top` com link âncora em antipulgas (y=963 mobile) | MELHOROU (bebedouro não retestado) |
| Barra fixa mobile | não existia | ativa em posts de produto; mostra de ~1200 até o `.cta-box` | NOVO (OK) |
| Barra fixa em comparativos | n/a | nunca aparece em antipulgas (achado 1) | NOVO PROBLEMA |
| Sobreposição breadcrumb x toggle | resolvido | continua resolvido em 390px | MANTIDO |
| Overflow horizontal | 0/12 | 0/16 | MANTIDO |
| Modo escuro | OK | OK, inclui barra e CTA do topo | MANTIDO |
| Toggle 40px mobile | 40x40 | 40x40, agora também cobre texto na rolagem | MANTIDO (+achado 5) |
| Tap targets < 44px | presentes | presentes (+ "×" da barra 29x34) | MANTIDO/PIORA LEVE |
| Menu da home cortado ("S...") | sim | sim | MANTIDO |
| Tabela larga no comedouro (645px) | sim | não retestada (outro post) | NÃO VERIFICADO |
| Bebedouro: 1 link de afiliado | PIOROU | não retestado | NÃO VERIFICADO |
