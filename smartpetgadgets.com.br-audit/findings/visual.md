# Auditoria Visual / Mobile - smartpetgadgets.com.br (2026-11-17)

Páginas: `/`, `/melhor-bebedouro-automatico-pet/`, `/comedouro-automatico-para-pet/`, `/coleira-gps-para-gato/`, `/camera-pet-com-dispensador-de-petisco/`, `/melhor-racao-para-cachorro/`.
Viewports: desktop 1920x1080 e mobile 375x812 (touch). Modo escuro em home, bebedouro e comedouro.
Screenshots em `screenshots/`: `{home|bebedouro|comedouro|coleiragato|camera|racao}_{desktop|mobile}.png`, `*_mobile_bar.png` (scroll 1500) e `*_dark.png` onde aplicável.
Comparação: archive/2026-11-06/findings/visual.md.

## Veredito: APROVADO com problemas médios. Nota Visual: 82/100 (11-06: 83)

## Verificações
- Overflow horizontal: 0/16 combinações (scrollWidth == viewport). As tabelas `.compare` passam de 375px, mas ficam contidas (rolagem interna). OK, porém sem indicação visual de rolagem (ver achado 5).
- H1 acima da dobra em todas (mobile y=72-97, desktop y=72). H1 ocupa 120-200px no mobile (4 linhas nos rankings).
- Fonte: base 16px; parágrafos do artigo 14,4px (.9rem) em todos os posts, abaixo do recomendado (16px). Visualmente legível, mas pequeno.
- Modo escuro (home, bebedouro, comedouro): fundo #121212, links laranja claro, barra e caixas legíveis. OK.
- Sem banner de cookies; única camada fixa além da barra é o botão de tema (40x40, topo direito).

## Dobra mobile: resposta e CTA
| Página | Resposta direta no 1º viewport (812) | Botão do CTA topo (y) | Caixa "picks" (y) | Barra fixa |
|---|---|---|---|---|
| Bebedouro | SIM (texto + link inline p/ Amicus, preço) | 1127 (abaixo) | 1297 | aparece scroll ~900-6900 |
| Comedouro | SIM (idem) | 1181 | 1350 | aparece ~1500-6600 |
| Coleira gato | SIM | 1151 | 1321 | aparece ~1500-6300 |
| Câmera | SIM | 1233 | 1402 | aparece ~1500-5700 |
| Ração cachorro | SIM (resposta Quatree em negrito, link) | 840+ (borda da dobra; botão não visível) | sem picks | NUNCA aparece |
Desktop 1920x1080: botão do CTA topo na dobra em bebedouro/comedouro (y=915), coleira (888), câmera (955); ração (ver y=831 do bloco, botão cortado); picks abaixo da dobra (y>1072).

## Achados
1. MÉDIO (mantido, agora em 5 posts): botão de afiliado e caixa "picks" ficam abaixo da primeira tela no mobile (botão em y=1127-1233, picks em 1297-1402, dobra 812). A resposta existe como texto com link inline, o que mitiga, mas o botão destacado só aparece após 1,3-1,5 telas. Causas: H1 de 4 linhas (200px) + meta de 3 linhas + hero de 180px+. Correção: encurtar H1/meta no mobile, esconder "Leitura/curadoria" em 1 linha, hero com altura menor, ou mover o `.cta-top` para antes da imagem.
2. MÉDIO (mantido): comparativo da ração (`/melhor-racao-para-cachorro/`): a barra fixa mobile nunca aparece (0 em todas as 68 posições testadas, page 20.327px), mesmo problema do antipulgas em 11-06. Primeiro botão de afiliado do corpo só em y=4859 mobile. O bloco `.cta-top` fica em 840 (limite da dobra), logo é o único CTA por ~4000px. Correção: ajustar a lógica de `affiliate-cta.js` (ocultar só quando `#comparativo` passar do topo) ou exibir a barra quando o CTA topo sair da tela.
3. MÉDIO (novo): nos 4 posts com "picks" a barra fixa desaparece de ~6000-6900px até o fim da página (20-27k px), ou seja, o leitor que passa pelas seções finais (FAQ, metodologia) fica sem CTA persistente; também some ao entrar no bloco `#comparativo`/picks (scroll ~1200-1500, onde o screenshot `*_mobile_bar*.png` não mostra barra). Janela de exibição ~25% do documento. Avaliar se é intencional (some perto do `.cta-box`).
4. BAIXO (mantido): botão "×" da barra 29x34 (< 44x44). Barra tem 72px; sem sobreposição visível com conteúdo nos screenshots em scroll.
5. BAIXO (novo): tabelas `.compare` mais largas que a tela (rolagem interna) sem indicador (sombra/fade) nem dica "deslize" no mobile; coluna "Preço" aparece cortada ("Preç") no screenshot escuro do bebedouro. Correção: sombra na borda direita + texto "deslize".
6. BAIXO (mantido): tap targets < 44px: 24-42 de 43-71 elementos `a/button` por página (ex.: comedouro 42/71 mobile, 56/71 desktop; home 92/266). Principalmente links inline e breadcrumbs. Botões de CTA (266x47, 213x46) ok.
7. BAIXO (mantido): botão de tema fixo 40x40 sobrepõe o texto na rolagem mobile (visível em `bebedouro_mobile_bar_dark.png`, canto superior direito sobre o texto). Correção: 44x44 e esconder ao rolar.
8. BAIXO (mantido): aviso "Link de afiliado" ~12,5px, opacidade reduzida.
9. BAIXO (novo): `.cta-top` do ração tem só 83px (desktop) e 167px (mobile), sem caixa picks; é o post mais "seco" visualmente em comparação com os outros rankings.

## Delta vs 2026-11-06
| Item | 11-06 | 11-17 | Status |
|---|---|---|---|
| Menu da home cortado ("S...") | sim | 3 itens (Início, Categorias, Artigos) visíveis, sem corte | RESOLVIDO |
| Overflow horizontal | 0/16 | 0/16 | MANTIDO |
| Modo escuro | OK | OK | MANTIDO |
| CTA topo abaixo da dobra mobile | 872-963 | botão 1127-1233 (mais abaixo: H1/hero maiores e picks box) | PIOROU (~+200px) |
| Barra fixa em comparativos | morta (antipulgas) | morta (ração) | MANTIDO (ainda não corrigido) |
| Barra fixa nos demais posts | ~1200-8900/9400 | ~900/1500-5700/6900 | JANELA REDUZIDA |
| Botão "×" 29x34 | sim | sim | MANTIDO |
| Toggle 40px cobrindo texto | sim | sim | MANTIDO |
| Tap targets < 44px | presentes | presentes | MANTIDO |
| Resposta direta na 1ª tela mobile | n/a | presente em 5/5 posts | NOVO (positivo) |
| Parágrafo 14,4px | n/a | 14,4px em todos os posts | NOVO (baixo) |
