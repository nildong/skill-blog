# Price Monitor

Monitor semanal dos links de afiliado (`meli.la`) publicados nos artigos. Compara o preço que o
artigo mostra com o preço atual no Mercado Livre e avisa quando um link deixou de abrir um produto.

## Objetivo

VERIFICA → COMPARA → REPORTA. **Não altera nenhum artigo** e não faz deploy: as correções de preço
ou a troca de produto são feitas depois, a pedido.

## Como funciona

1. `src/scan.js` lê todos os `*/index.html` publicados e junta cada link `meli.la` com o preço
   mostrado perto dele: a linha da tabela comparativa, a ficha (`<th>Preço</th>`) do card do produto,
   o `offers.price` do schema ItemList ou, em reviews de produto único, a ficha técnica da página.
2. `src/meli.js` abre cada link. A página de afiliado que o `meli.la` abre
   (`/social/<afiliado>?ref=…`) não é bloqueada e traz na meta description
   `Olha o que eu encontrei! <título> - R$ <preço> no Mercado Livre`, além do número do anúncio (MLB…).
   As páginas de produto do Mercado Livre (`/p/…`, `/up/…`, `produto.mercadolivre…`) caem em
   `account-verification` para acessos automáticos, por isso não são usadas.
3. `src/report.js` classifica:
   - **Preço mudou**: diferença de 5% ou mais (ajustável com `--threshold`) entre artigo e anúncio.
   - **Alerta**: o link não abre um produto (anúncio pausado/finalizado ou link de lista), o link
     passou a apontar para outro anúncio desde a última rodada, a consulta foi bloqueada ou deu erro.

## Uso

```bash
node tools/price-monitor/src/index.js                 # todos os links
node tools/price-monitor/src/index.js --limit 10      # teste rápido
node tools/price-monitor/src/index.js --threshold 10  # só variações de 10% ou mais
node --test tools/price-monitor/test/*.test.js
```

Há uma pausa de 3–4 s entre consultas para não sobrecarregar o Mercado Livre (cerca de 8 min para
~120 links).

## Saídas

- `reports/price-monitor/AAAA-MM-DD.md` e `reports/price-monitor/latest.md`: relatório para humanos.
- `.data/price-monitor/AAAA-MM-DD.json`: resultado bruto da rodada.
- `.data/price-monitor/state.json`: último título, preço e anúncio de cada link (detecta troca de anúncio).

## Agendamento

Crontab local, toda segunda às 8h:

```
0 8 * * 1 cd /home/projetos/blog && /usr/bin/node tools/price-monitor/src/index.js >> .data/price-monitor/cron.log 2>&1
```

## Limitações

- Só lê título e preço. Nota, número de avaliações e estoque não aparecem na página de afiliado.
- "Preço no artigo" é o primeiro preço encontrado perto do link. Artigos antigos que não mostram preço
  só geram alerta se o link quebrar.
- Para status exato (ativo/pausado/finalizado) e estoque, o caminho é a API oficial com OAuth
  (`~/.config/ml-api/`), que precisa do App ID do app em developers.mercadolivre.com.br.
