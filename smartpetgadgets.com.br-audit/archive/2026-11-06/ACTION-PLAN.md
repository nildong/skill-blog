# Plano de Ação — smartpetgadgets.com.br (2026-11-06)

Score 85/100 (era 84).

Concluído desde 11-04:
- [x] Pasta de cluster removida (410) e `.htaccess` negando `.md`/`.json`
- [x] Sitemap reenviado (11-04)
- [x] Preload do bebedouro corrigido (LCP 3,5 s → 0,9 s)
- [x] 14 titles/metas reescritos
- [x] Aberturas GEO em 9 páginas
- [x] CTA do topo e barra fixa no ar
- [x] dateModified do vdrbg corrigido

## Fase 1: Correções Críticas (Semana 1)
- [x] Testar o `affiliate_click` (2026-11-06): top, final e sticky disparam e chegam ao GA4 Realtime. O 0 era falta de cliques reais.
- [ ] Registrar `cta_position` como dimensão personalizada de evento no GA4 (Admin → Definições personalizadas).
- [x] IndexNow: 25 URLs enviadas em 2026-11-06 (HTTP 200).
- [ ] Pedir indexação no GSC das 23 páginas alteradas em 11-05 (manual, ~10 por dia).
- [ ] Incluir só a tag `affiliate-cta.js?v=1` (sem o bloco do topo, que eles já dispensam por ter link antes do 1º H2) nos 4 posts sem medição:
  - `coleira-seresto-antipulgas`
  - `comedouro-automatico-para-pet`
  - `comedouro-newpet-4l-review`
  - `configurar-app-comedouro-wifi`
- [ ] Corrigir o `rel` dos links de afiliado:
  - `sponsored nofollow` nos 5 links de seresto;
  - `nofollow` nos 3 de `cachorro-de-casa-pega-pulga`.
- [ ] Barra fixa mobile:
  - corrigir o gatilho no antipulgas, onde `#comparativo` a esconde antes de ela aparecer;
  - trocar o padding do body de 64px para 72px;
  - aumentar o "×" para 44x44.
- [ ] CTA do topo em páginas sem lista: nomear o produto ou remover. Começar por sem-mensalidade, onde só deve ficar se o anúncio for confirmado sem mensalidade. Depois câmeras, bebedouro-automatico e gps-gato.

## Fase 2: Melhorias de Alto Impacto (Semanas 2–3)
- [ ] `melhor-bebedouro-automatico-pet`: reaproveitar os cards do `bebedouro-inox-x-ceramica` e retitular para "fonte para gato". Subiu de 17,3 para 10,3, então é o melhor retorno por hora.
- [ ] Câmeras: manter `camera-para-monitorar-pet` (mais impressões) e fazer 301 da outra, expandindo para 6 a 8 modelos. Candidatos: Tapo C500, iM4 C, eufy C220, Furbo e C100.
- [ ] `melhor-coleira-gps-sem-mensalidade`: refazer como lista por tecnologia (chip pré-pago, AirTag, Bluetooth), com ItemList.
- [ ] Antipulgas: hero WebP com srcset e preload. LCP hoje de 2,8 s.
- [ ] Investigar no GSC por query, antes e depois de 10-22:
  - `melhor-comedouro-automatico-cachorro` (24,5);
  - `melhor-tapete-higienico-para-cachorro` (10 → 17, principal landing do ChatGPT).
- [ ] Corrigir o title ou a meta de `camera-pet-com-dispensador` e `como-instalar-porta`. Trocar "71 artigos" por 72 na home.
- [ ] `coleira-gps-para-gato` e `coleira-gps-para-pet`: rebaixar o ANXK G68 e atualizar o preço com data.

## Fase 3: Conteúdo & Autoridade (Mês 2)
- [ ] Consolidar os stubs de câmera, porta e brinquedo nos pilares (301), e reescrever os FAQs que repetem o corpo.
- [ ] Preço datado e uma linha de método ("consultado em… / não testamos") nas páginas de dinheiro.
- [ ] Grafo `@id` (`#org`, `#website`, `#person`) com a foto do autor e `sameAs`. Requer a foto, que você precisa fornecer.
- [ ] Converter "Key Takeaways" em `<ul>` e renomear para "Pontos principais", começando pelas 7 páginas com abertura nova.
- [ ] Converter os heroes JPG para WebP (6 com mais de 200 KB) e colocar `fetchpriority="high"` em todos os heroes.
- [ ] Alerta da FDA no antipulgas e links externos em seresto e pulga.
- [ ] Backlinks: exportar o relatório "Links" do GSC e colocar o link do site no perfil do Facebook.

## Fase 4: Monitoramento & Iteração (Contínuo)
- [ ] Medir o CTR das 14 páginas retituladas entre 26/11 e 03/12, e então decidir a P2/P3.
- [ ] Comparar as sessões do ChatGPT nas 9 páginas GEO entre 06/11 e 05/12.
- [ ] Ler o `affiliate_click` por página depois de 2 a 3 semanas de dados.
- [ ] Regra de deploy: só subir o lastmod ou a data visível quando houver mudança material, não em mudança de template.
