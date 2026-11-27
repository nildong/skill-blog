# Price Monitor

Monitor semanal dos links de afiliado (`meli.la`) publicados nos artigos. Compara o preço que o
artigo mostra com o preço atual no Mercado Livre e avisa quando um link deixou de abrir um produto.

## Objetivo

VERIFICA → COMPARA → REPORTA. O monitor **não altera nenhum artigo** e não faz deploy. A troca de
links quebrados é feita à parte por `src/substituir.js`, a partir de uma lista que você preenche (ver abaixo).

## Como funciona

1. `src/scan.js` lê todos os `*/index.html` publicados e junta cada link `meli.la` com o preço
   mostrado perto dele: a linha da tabela comparativa, a ficha (`<th>Preço</th>`) do card do produto,
   o `offers.price` do schema ItemList ou, em reviews de produto único, a ficha técnica da página.
2. `src/meli.js` abre cada link. A página de afiliado que o `meli.la` abre
   (`/social/<afiliado>?ref=…`) não é bloqueada e traz na meta description
   `Olha o que eu encontrei! <título> - R$ <preço> no Mercado Livre`, além do número do anúncio (MLB…).
   O card desse anúncio na mesma página traz nota, vendidos ("+500 vendidos"), preço anterior e
   "ÚLTIMAS N" quando o estoque está acabando.
   As páginas de produto do Mercado Livre (`/p/…`, `/up/…`, `produto.mercadolivre…`) caem em
   `account-verification` para acessos automáticos, por isso não são usadas.
3. `src/report.js` classifica:
   - **Preço mudou**: diferença de 5% ou mais (ajustável com `--threshold`) entre artigo e anúncio.
   - **Alerta**: o link não abre um produto (anúncio pausado/finalizado ou link de lista), o link
     passou a abrir **outro produto** (título diferente do produto original), a consulta foi bloqueada ou deu erro.
     Mudar só o número do anúncio, com o mesmo produto (outro vendedor ou variação do catálogo), não gera alerta.
   - **Sinais de qualidade**: nota abaixo de 4,3 ou últimas unidades.

## Uso

```bash
node tools/price-monitor/src/index.js                 # todos os links
node tools/price-monitor/src/index.js --limit 10      # teste rápido
node tools/price-monitor/src/index.js --threshold 10  # só variações de 10% ou mais
node --test tools/price-monitor/test/*.test.js
```

Há uma pausa de 3–4 s entre consultas para não sobrecarregar o Mercado Livre (cerca de 8 min para
~120 links).

## Trocar links quebrados

1. Gere o meli.la do produto substituto (de preferência a página de catálogo `/p/MLB…`, que sobrevive
   quando um vendedor pausa o anúncio).
2. Adicione `link-antigo link-novo` em `reports/price-monitor/substituicoes.txt` (uma troca por linha).
3. Prévia (não altera nada): `node tools/price-monitor/src/substituir.js`
4. Aplicar: `node tools/price-monitor/src/substituir.js --aplicar`. Troca o link exato em todos os
   artigos (botões e schema), atualiza o `state.json`, marca a linha como `# feito` e grava
   `reports/price-monitor/substituicoes-AAAA-MM-DD.md` com o que revisar no texto (nome do produto,
   preço mostrado). Não faz deploy.

## Saídas

- `reports/price-monitor/AAAA-MM-DD.md` e `reports/price-monitor/latest.md`: relatório para humanos.
- `.data/price-monitor/AAAA-MM-DD.json`: resultado bruto da rodada.
- `.data/price-monitor/state.json`: última leitura de cada link (título, preço, anúncio, nota, vendidos) e
  `expected`, o produto que o artigo indica. O `expected` só muda via `substituir.js`, então o alerta
  de produto trocado continua aparecendo até a troca ser feita.

## Agendamento

Crontab local, toda segunda às 8h:

```
0 8 * * 1 cd /home/projetos/blog && /usr/bin/node tools/price-monitor/src/index.js >> .data/price-monitor/cron.log 2>&1
```

## Limitações

- Lê título, preço, nota, vendidos e "últimas unidades". O número e o texto das avaliações e a ficha
  técnica não aparecem na página de afiliado.
- "Preço no artigo" é o primeiro preço encontrado perto do link. Artigos antigos que não mostram preço
  só geram alerta se o link quebrar.
- Para status exato (ativo/pausado/finalizado) e estoque, o caminho é a API oficial com OAuth
  (`~/.config/ml-api/`), que em 27/11 ainda recusa a chave secreta (`invalid_client`) do app 2967690669617513.
