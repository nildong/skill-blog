# Auditoria SEO Completa — smartpetgadgets.com.br

> **Correção (27/11):** dos "10 links com problema", 7 eram alarme falso do monitor: era o mesmo produto, só com outro número de anúncio (outro vendedor ou variação). Os problemas reais são 3 links que não abrem produto (2p4GhJA, 1pm2i23, 2b9cBHh) e o 1RWrc8a, que em 27/11 passou a abrir outro produto (Kit Coleira c/ AirTag, R$ 237,90). O monitor foi corrigido; a lista está em `reports/price-monitor/substituicoes.txt`.

**Data:** 26/11/2026 · **Health Score: 88/100** (87 em 24/11, 85 em 17/11) · **Tipo:** publisher afiliado (reviews e guias pet, Mercado Livre)

**Escopo:** 79/79 URLs do sitemap rastreadas, PageSpeed mobile em 4 páginas, Search Console (28 dias até 23/11 + série desde 01/10), URL Inspection do /black-friday-pet/, monitor de preços de 23/11. Rodada inline (sem subagentes: sem screenshots, backlinks nem SXO por SERP). A auditoria de 24/11 está em `archive/2026-11-24/`.

## Notas por categoria

| Categoria | Peso | Nota | 24/11 |
|---|---|---|---|
| SEO Técnico | 22% | 96 | 95 |
| Qualidade de Conteúdo | 23% | 79 | 80 |
| SEO On-Page | 20% | 86 | 84 |
| Schema | 10% | 89 | 89 |
| Performance | 10% | 98 | 98 |
| Busca por IA | 10% | 82 | 80 |
| Imagens | 5% | 90 | 90 |

## O que mudou desde 24/11

- **Resolvido:** `<main>` nos posts (falta só em 5 páginas institucionais); `content-type: text/html; charset=UTF-8` nas 79 URLs; /black-friday-pet/ agora recebe 10 links internos (antes 1), está **indexado** (GSC: "Submitted and indexed", rastreado em 23/11, canonical aceito); acessibilidade 100 no BF, configurar-app e antipulgas.
- **Não resolvido:** os **10 links de afiliado com problema continuam no ar** nos mesmos 14 posts, e os 29 preços divergentes também. A Black Friday é amanhã (27/11).
- **Tráfego:** 28 dias = 109 cliques / 8.759 impressões (eram 88 / 7.348). Só o dia 23/11 teve 10 cliques e 732 impressões (média da semana anterior: 7 cliques e 501 impr./dia).

## Resumo executivo

O site está tecnicamente limpo: 79/79 com status 200, canonicals corretos, nenhum título ou meta duplicado, JSON-LD sem erro de parse, PSI mobile 99–100. O único problema sério é o mesmo de 24/11, agora com prazo vencendo: **links de afiliado que levam ao produto errado ou a lugar nenhum, na véspera do dia de maior intenção de compra do ano.**

### Top 5 problemas
1. **[Crítico]** 10 meli.la com problema em 14 posts, a 1 dia da Black Friday (3 não abrem produto; 7 abrem outro anúncio)
2. **[Alto]** 29 preços divergentes em 5% ou mais, incluindo a tag Android (R$ 151–159 no texto, R$ 90 agora) em 3 posts que o próprio post de BF cita como -41%
3. **[Médio]** Contraste da cor `#d9480f` na home (`.feat-more`, `.read-more`): 4,29:1, abaixo de 4,5:1, e a home é a única página que ainda tem acessibilidade 96
4. **[Médio]** bebedouro-inox-x-ceramica: 711 impr. na pos 5,7 com CTR de 0,42%, o pior CTR do site para essa posição
5. **[Baixo]** 5 páginas institucionais sem `<main>`; tabela do antipulgas sem `<th>`; 3 metas longas

### Top 5 ganhos rápidos
1. Trocar os 10 meli.la hoje (lista em `reports/price-monitor/latest.md`); se não der, tirar o botão desses 10 itens até gerar o link novo
2. Atualizar os preços dos 3 posts com a tag Android e dos 2 com o Tapo C200 (são os que recebem os links de BF)
3. `#d9480f` → `#b23a0d` (a mesma cor já usada em 24/11) nas classes `.feat-more` e `.read-more` da home
4. Trocar `<div>` por `<main>` em /sobre/, /contato/, /politica-editorial/, /politica-de-privacidade/ e /autores/nildo-alves/
5. Encurtar as metas de autor (191), configurar-app (163) e seresto (161)

## Técnico (96)
- Funcionando: 79/79 com 200; sitemap com 79 URLs + 262 imagens e 0 erros no GSC; robots.txt com Content-Signal; HSTS; charset UTF-8 no header; feed.xml, llms.txt e IndexNow no ar.
- [Baixo] 5 páginas institucionais sem `<main>`.
- [Info] /melhor-camera-para-monitorar-pet/ (301 desde 17/11) ainda tem 235 impr. em 28 dias: é consolidação normal.

## Conteúdo (79)
- Funcionando: mediana de 1.566 palavras; divulgação honesta do método; post de BF com 2.467 palavras e dados próprios do monitor.
- [Crítico] 10 links de afiliado: 2p4GhJA (brinquedo-gato), 1pm2i23 (anti-formiga) e 2b9cBHh (viagem, comedouro-x-bebedouro) não abrem produto. 1RWrc8a (5 posts de GPS) abre um kit de tag para iPhone; 1KigM7V e 15xb2sx (ração cachorro) abrem outras rações, uma terapêutica (Royal Canin Gastrointestinal Low Fat); 1qA4yst e 2KPepVS (ração gato) idem; 2nYXrfG (comedouro-para-pet, comedouro-x-bebedouro); 2om5jBS (porta-eletronica).
- [Alto] 29 preços divergentes (detalhe no monitor). O monitor roda de novo na segunda, 30/11, e essa leitura deve alimentar a atualização do /black-friday-pet/.
- [Baixo] Páginas institucionais rasas: /contato/, /politica-editorial/, /sobre/.

## On-Page (86)
- Funcionando: nenhum título ou meta duplicado; 1 H1 por página; BF com 10 links internos.
- [Médio] bebedouro-inox-x-ceramica: pos 5,7, 711 impr., 3 cliques. O GSC só atribui 15 dessas impressões a queries visíveis (o resto é cauda anônima), então não dá para escolher o título pela query principal; o título atual ("Bebedouro Inox, Cerâmica ou Plástico: Qual o Melhor?") não tem gancho de resposta. Já estava na fila pós-freeze.
- [Médio] Rações: melhor-racao-para-cachorro com 494 impr., pos 10,1, CTR 0,4%; melhor-racao-para-gato subiu de pos 21,8 para 19,6. Os links de afiliado das duas estão trocados (ver Conteúdo).
- [Baixo] Metas longas: autor (191), configurar-app (163), seresto (161).
- [Lembrete] Remover os blocos `bf-link` dos 9 posts depois de 01/12.

## Schema (89)
- JSON-LD presente e sem erro de parse nas 79 páginas; BF com Breadcrumbs válido no URL Inspection.
- Sem mudança desde 24/11 (o aviso de hasMerchantReturnPolicy foi mantido por decisão).

## Performance (98)
- PSI mobile: home 99, BF 99, configurar-app 100, antipulgas 100. Sobram só oportunidades pequenas (cache de 23 KiB e ~75 KiB de JS sem uso, provavelmente gtag).

## Busca por IA (82)
- Funcionando: crawlers de IA liberados; llms.txt com 79 URLs; `<main>` nos posts; ChatGPT continua sendo a 2ª fonte e a das vendas.
- [Médio] Pouca presença fora do site (só Facebook e Pinterest).

## Imagens (90)
- As 10 imagens sem alt da home são as miniaturas dos cards, com `alt=""` decorativo e o título ao lado. Está correto.
- Novas páginas continuam precisando dos recortes -16x9/-4x3/-1x1.
