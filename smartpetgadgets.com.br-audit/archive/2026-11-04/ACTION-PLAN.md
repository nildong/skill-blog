# Plano de Ação — smartpetgadgets.com.br (2026-11-04)

Score 84/100 (era 83). Itens concluídos desde 10-29: alegações de teste, byline, `Disallow: /reports/`, miniaturas WebP da home e CrUX API.

## Fase 1: Correções Críticas (Semana 1)
- [ ] Remover `/cluster-comedouro-automatico-pet/` do servidor (briefs .md, JSON, relatórios, `cluster-map.html`). Tirar a pasta do deploy, negar `*.md` e `*.json` no `.htaccess` e pedir a remoção no GSC.
- [ ] Reenviar o sitemap no GSC. O último envio foi em 08-26.
- [ ] Bebedouro: corrigir o preload, que aponta para o JPG enquanto a página serve WebP. Antipulgas: hero WebP 480w/800w com srcset e `fetchpriority="high"`.
- [ ] Ajustar o `rel` dos links do Mercado Livre:
  - `sponsored` nos 5 links diretos de `coleira-seresto-antipulgas`;
  - `nofollow` nos 3 links de `cachorro-de-casa-pega-pulga`.
- [ ] Investigar a queda de `melhor-comedouro-automatico-cachorro` (de 9,8 para 22,8). Comparar a versão antes e depois do commit `987323d` (10-22) e restaurar o que mudou de intenção (H1, title, produtos).

## Fase 2: Melhorias de Alto Impacto (Semanas 2–3)
- [ ] Reescrever title e meta das 27 páginas entre as posições 4 e 20 com 0 cliques. Começar por:
  - `viagem`
  - `vdrbg`
  - `erros-comuns-coleira`
  - `camera-grava-sem-internet`
  - `gato-x-cachorro`
  - `dois-gatos`
- [ ] Refazer `melhor-coleira-gps-sem-mensalidade` como lista por tecnologia, com ItemList:
  - grupos: chip pré-pago, AirTag/Find My, Bluetooth;
  - colunas: "Mensalidade?" e "Chip/mês".
- [ ] Resolver a canibalização da câmera:
  - tirar "Melhor" do title de `camera-para-monitorar-pet`, que passa a ser o guia;
  - expandir `melhor-camera-para-monitorar-pet` para 6 a 8 modelos.
  - Se preferir consolidar, faça 301 para a URL com mais impressões.
- [ ] Bebedouro:
  - novo title "Melhor Fonte/Bebedouro Automático… N Modelos";
  - tabela com L, dB, sensor e refil;
  - CTA logo depois da introdução.
- [ ] `coleira-gps-para-gato`: 3 a 4 escolhas, uma por tecnologia. Rebaixar o ANXK G68.
- [ ] Adicionar cerca de 25 links internos para as 17 páginas com menos de 3 links de entrada. A lista está em `findings/cluster.md`. Inclui `soprador-pet`, os hubs `duvidas-` e os pilares de antipulgas e tapete.

## Fase 3: Conteúdo & Autoridade (Mês 2)
- [ ] Converter os 113 `<p>- …</p>` em `<ul><li>` por script. Renomear "Key Takeaways" para "Pontos principais".
- [ ] Montar o grafo `@id` (`#org`, `#website`, `#person`) com a foto do autor. As Reviews passam a ter Person como `author`. Padronizar o box do autor.
- [ ] Fundir os stubs finos nos pilares com 301, ou expandi-los. Reescrever os FAQs com sobreposição acima de 0,9.
- [ ] Antipulgas:
  - alerta da FDA sobre isoxazolinas;
  - bula do fabricante;
  - ItemList;
  - linha para gestante e filhote.
- [ ] Trocar as 115 citações "retrieved" por "consultado em DD/MM/AAAA" com link para a fonte primária.
- [ ] Converter para WebP e adicionar `fetchpriority` nos heroes dos posts antigos. Começar pelos 6 arquivos acima de 200 KB.
- [ ] Criar o canal no YouTube e adicioná-lo ao `sameAs`. Buscar links editoriais.
- [ ] Tabelas no mobile: adicionar dica de rolagem e tap targets de 44px.
- [ ] Product/ItemList nas seções novas de produto, quando a reformulação de afiliados for retomada.

## Fase 4: Monitoramento (Contínuo)
- [ ] GSC toda semana:
  - `melhor-comedouro-automatico-cachorro`
  - `melhor-alimentador-automatico-gatos`
  - par da câmera
  - home (posição 44,3)
- [ ] Sitemap e índices:
  - `lastmod` com a data real da mudança;
  - envio ao IndexNow após cada deploy;
  - gerar o `llms.txt` no mesmo script do sitemap.
- [ ] Servidor:
  - redirect de http://www em 1 salto;
  - 301 de `/index.html`;
  - página 404 com a marca;
  - header Permissions-Policy.
- [ ] Política para bots de treino: alinhar o `Allow` com `ai-train=no` e o 429 do servidor.
- [ ] Repositório: commitar `logo-dark.png`, configurar `.gitignore` e fazer merge de `develop-v2` em `main`.
- [ ] Backlinks: configurar a chave gratuita da Moz e exportar o relatório "Links" do GSC.
- [ ] Criar o baseline de drift após o próximo deploy.
- [ ] Ainda pendente de antes: fotos do AGBE e da Patas Fiéis no bebedouro, e a confirmação da remoção dos backups no GSC.
