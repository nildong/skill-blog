# Plano de Ação — smartpetgadgets.com.br (2026-11-17)

Score 85/100 (igual a 11-06). Relatório completo: `FULL-AUDIT-REPORT.md`.

**Regra da janela de medição:** não reescrever título, meta ou corpo das páginas alteradas depois de 05/11 antes de ~01/12. São as 14 P1 e as reescritas de 12 a 16/11: coleiras, brinquedo, bebedouro ranking, comedouro hub, câmera petisco, Seresto e Tuya. Correções técnicas (rel, imagem, links internos de saída) podem ser feitas.

Concluído desde 11-06:
- [x] `affiliate-cta.js` em Seresto, comedouro hub e configurar-app (falta o Newpet 4L)
- [x] `affiliate_click` funcionando (18 eventos, 10 do ChatGPT)
- [x] 8 hubs reescritos como rankings; duas rações publicadas
- [x] Schema: Products sem offers removidos da Seresto; brand nos rankings

## Fase 1: Correções rápidas (Semana 1)
- [ ] `rel="sponsored nofollow noopener"` nos 6 links da Seresto e nos 3 de `cachorro-de-casa-pega-pulga`
- [ ] Incluir `affiliate-cta.js?v=1` em `/comedouro-newpet-4l-review/`
- [ ] Corrigir o hero de `/bebedouro-inox-x-ceramica/`: srcset 400/800/1200w, `fetchpriority="high"` e preload (o LCP mobile voltou para 2,7 s)
- [ ] Trocar os 7 links de afiliado mortos apontados pelo price-monitor (`reports/price-monitor/latest.md`)
- [ ] Commit do `sitemap.xml` (já no ar) e de `img/logo-dark.png`
- [ ] Pedir indexação no GSC de `/brinquedo-interativo-automatico-para-gato/`, `/melhor-racao-para-cachorro/` e `/melhor-racao-para-gato/`, e enviar ao IndexNow as URLs de 12–16/11
- [ ] Antipulgas: caixa de alerta FDA/CVM sobre isoxazolinas, com fonte. É uma correção de segurança, liberada mesmo dentro da janela
- [ ] Barra fixa mobile: corrigir o gatilho na ração e aumentar o "×" para 44x44

## Fase 2: Alto impacto (Semanas 2–3, só páginas fora da janela)
- [ ] `/bebedouro-inox-x-ceramica/`: título "Fonte para Gato: Inox, Cerâmica ou Plástico? O Mais Higiênico", e a seção "Modelos à Venda" vira uma caixa que leva ao ranking
- [ ] `/comedouro-automatico-para-dois-gatos/`: título "Comedouro Automático para 2 Gatos: Duplo ou com Chip RFID?" e uma tabela de 3 soluções com produto
- [ ] Câmera: reconstruir `melhor-camera-para-monitorar-pet` como ranking de 7 modelos e fazer 301 de `camera-para-monitorar-pet` e dos posts finos de câmera para ela (decisão sua sobre qual URL fica)
- [ ] Nova página `/credeli-ou-simparic/` (com NexGard), tabela na mesma faixa de peso, dados da bula, revisor com CRMV
- [ ] Aplicar os links internos prioritários 1–13 de `findings/cluster.md`: rações a partir do cluster comedouro, `comedouro-automatico-para-viagem`, câmera petisco e antipulgas
- [ ] Tapete higiênico (a página que mais converte pelo ChatGPT): preços de novembro, seção "Como escolhemos" e "consultado em"

## Fase 3: Conteúdo e autoridade (Mês 2, a partir de 01/12)
- [ ] Medir P1 e as reescritas de 12–16/11 (cliques e CTR por página contra os baselines nas memórias)
- [ ] Comedouro: decidir o que fazer com `melhor-comedouro-automatico-cachorro` e os 2 rankings antigos (merge, 301 ou ângulo próprio). O cluster está pausado e precisa do seu OK
- [ ] Recolocar 2–4 fontes externas nos hubs (comedouro, câmera petisco) e nas rações (WSAVA/AAFCO, fabricante)
- [ ] Ração para cachorro: incluir Golden/Premier, Biofresh, Gran Plus, Hill's e Purina, e a linha "castrado"
- [ ] Coleira GPS para gato: caixa e FAQ do Tractive
- [ ] Entidade: `@id` em Organization, WebSite e Person, foto do autor, `sameAs` (Facebook, Pinterest) e remover o YouTube que dá 404
- [ ] Produtos em `coleira-gps-sem-mensalidade` e na porta eletrônica (você escolhe os produtos)
- [ ] Backlinks: exportar "Links" do GSC, criar chave gratuita da Moz e começar a divulgação dos rankings
- [ ] 29 posts finos: juntar com o ranking do cluster (301) ou ampliar só os que têm impressão
- [ ] Mobile: subir o CTA e a caixa de picks para a primeira tela (H1 mais curto ou picks antes do hero)

## Fase 4: Monitoramento (Contínuo)
- [ ] Price-monitor semanal: sinalizar divergência entre o `price` do JSON-LD e o anúncio
- [ ] Trocar em lote os 102 "retrieved" por "consultado em". Não mexer no `lastmod` quando a mudança for só de template
- [ ] GA4: `affiliate_click` por origem (ChatGPT contra Google) e conferir as vendas no painel do ML Afiliados
- [ ] Decidir a política do robots.txt para robôs de treino (`ai-train=no` contra `Allow`)
- [ ] Baixa: `.htaccess` (www em 1 salto, 301 de `/index.html`, 404 em pt-BR, Permissions-Policy), fonte do artigo em 16 px, tap targets
- [ ] Atualizar o `llms.txt` (descrição de configurar-app) a cada novo título
