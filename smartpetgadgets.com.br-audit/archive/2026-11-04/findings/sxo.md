# SXO (Search Experience Optimization) — smartpetgadgets.com.br

Data: 2026-11-04 (passada anterior: 2026-10-29)
Escopo: 7 páginas de dinheiro + a gêmea canibal `camera-para-monitorar-pet`.
Método: render live (`render_page.py --mode always`, 8 URLs, todas 200) + `parse_html.py`; SERP pt-BR via WebSearch (8 queries); taxonomia SXO de tipo de página; personas e user stories derivadas apenas de sinais observados no SERP.

Este é o **SXO Gap Score**, separado do SEO Health Score.

**SXO Gap Score: 65 / 100 (anterior 66, DELTA -1)**

---

## O que mudou desde 2026-10-29

- **Nenhuma página de dinheiro mudou de conteúdo.** Os únicos commits desde 10-29 são miniaturas WebP 400w/800w nos cards da home (9ccf3a3). Contagens live idênticas: sem-mensalidade 915 palavras, melhor-camera 577, camera-para-monitorar 997, gps-gato 1.818.
- **Os dois CRITICAL continuam abertos** e as páginas completam 74 dias sem atualização (datadas de 08-22).
- **Novas análises nesta passada** (antes só herdadas de 10-23, sem SERP): `melhor-bebedouro-automatico-pet` passa a **HIGH** (SERP confirmado; é a causa do -1) e `melhor-antipulgas-para-cachorro` passa a **MEDIUM (trust YMYL)**.
- **Mudanças no SERP:**
  - **Tapete:** agora tem mais guias informativos (Buscapé "como usar"/"vale a pena", Petz blog x4) do que Top-N. A página continua ALIGNED porque é um híbrido.
  - **Camera:** o SERP de "melhor câmera" agora traz mais modelos que a nossa página não cobre (Tapo C500, iM4 C, eufy C220, Furbo 360, Ezviz TY1).
  - **GPS gato:** o SERP agora traz o ML blog, o Buscapé/Zoom e uma PDP de coleira Tractive. Os sinais de Find My/AirTag ficaram mais fortes.

---

## Página x SERP

| Página | SERP dominante (aprox.) | Tipo atual | Veredito | Delta |
|---|---|---|---|---|
| melhor-comedouro-automatico-cachorro | Top-N ~60% (my-best x3, mundodosreviews, qualmelhorcomprar, qualeamelhor, guiaomelhor, melhoresparacomprar, cupomonline) + guias de varejo (ML blog x2, Buscapé/Zoom) + PDP/categoria (Petz x2, Cobasi, Petlove) | Comparativo 7 produtos, ItemList + 7 Product, 8 imgs, 2.135 palavras | **ALIGNED** | = |
| melhor-tapete-higienico-para-cachorro | Guias ~50% (Buscapé/Zoom x3, Petz blog x4) + Top-N my-best x3 + categoria Cobasi + PDP Buscapé | Comparativo 7 + seções de guia, ItemList, 9 imgs, 3.346 palavras | **ALIGNED** | = (SERP ficou mais informativo) |
| melhor-bebedouro-automatico-pet | Top-N ~85% ("10 modelos silenciosos": guiaomelhor x7, qualmelhorcomprar x3, buscamelhores x2, my-best x2, mundodosreviews, selektz) + PDPs | "Como Escolher", **2 produtos** (Tobo, Amicus), 1 img, 1 link afiliado, sem ItemList, 08-20 | **HIGH** | novo SERP (antes herdado) |
| melhor-coleira-gps-sem-mensalidade | Top-N ~75% (cupomonline x2, buscamelhores x2, guiaomelhor x3, qualmelhorcomprar x2, my-best, mundodosreviews, petscare) + PDPs (Leroy x2, Fruugo) | Ensaio, **0 produtos**, 915 palavras, 1 img, 08-22 | **CRITICAL** | = |
| coleira-gps-para-gato | Top-N ~50% (buscamelhores x2, qualmelhorcomprar x3, guiaomelhor x2) + guias (Buscapé/Zoom, ML blog, Petz) + PDP (Leroy x2, Tractive, Zoom busca) | Guia + **1 pick** (ANXK G68 4G, 1 avaliação, exige SIM), sem ItemList | **HIGH** | = |
| melhor-camera-para-monitorar-pet (+ camera-para-monitorar-pet) | Top-N ~90% (buscamelhores x3, guiaomelhor x3, qualmelhorcomprar x2, mundodosreviews x2, melhoresparacomprar "10 modelos", seuguiadetecnologia, my-best) | Stub de 577 palavras com 4 modelos; a gêmea é um guia de 997 palavras e está em destaque na home | **CRITICAL + canibalização** | = |
| melhor-antipulgas-para-cachorro | Top-N ~55% (my-best x3, mundodosreviews x2, buscamelhores x2, guiaomelhor, cupomonline, amoprodutinhos) + **guias de varejo com autoridade veterinária ~30%** (Petlove x3, Petz blog) + categoria Cobasi | Comparativo 6 produtos, tabela, 7 imgs, 12 links afiliados, 9 FAQs, **sem ItemList/Product, sem revisor veterinário** | **MEDIUM (trust/YMYL)** | novo SERP |

---

## Findings (severidade + correção)

### 1. CRITICAL: sem-mensalidade não tem produtos num SERP de listicles (sem mudança)
O SERP segmenta os modelos por tecnologia: chip pré-pago (Dog Tracker Universal, TKStar TK909), AirTag/Find My (a ressalva "não funciona sem iPhones por perto") e alcance limitado (Findster Duo+, GUPTOMES). O SERP também diverge sobre se o Tractive cobra mensalidade.
**Correção:**
- Refazer a página no template do tapete/comedouro, com 5-7 produtos em 3 segmentos.
- Usar as colunas "Mensalidade da marca?", "Custo do chip/mês", "Tecnologia", "Alcance", "Bateria" e "Peso".
- Reaproveitar JT-08-AL e ANXK G68. Adicionar 1-2 tags Find My e o TK909, se ele estiver no ML.
- Incluir uma caixa "Tractive cobra mensalidade? Sim". Isso resolve a confusão do SERP e é um ganho de confiança.
- Adicionar ItemList + Product.

### 2. CRITICAL: par de câmeras canibalizado, stub de 4 modelos (sem mudança, gap maior)
O SERP agora lista 10 modelos (melhoresparacomprar). Os modelos recorrentes que a página não cobre são Tapo C500, Intelbras iM4 C, eufy C220, Furbo 360 e Ezviz TY1. A página tem 0 menções a "nuvem" e "microSD", e o custo de nuvem é um critério do SERP.
**Correção:**
- Montar 1 listicle de 6-8 modelos numa única URL e fazer 301 da outra. Escolher a URL que fica pelo número de impressões no GSC e registrar a mudança no memo de slugs.
- Usar as colunas resolução, visão noturna, áudio bidirecional, 360°/fixa, microSD vs nuvem (+R$/mês), petisco e preço.
- Tirar `camera-para-monitorar-pet` do destaque da home até a reconstrução.

### 3. HIGH: bebedouro automático é "Como Escolher" com 2 produtos num SERP de "10 modelos" (novo)
O SERP fala em "fonte para gato" e o nosso título não usa nem "fonte" nem "gato". Os critérios do SERP são silencioso (<30 dB), filtro de carvão, sensor de movimento, sem fio/bateria e capacidade de 1,8 L vs 3 L. Os modelos recorrentes são GONDMAX 3L com sensor, Newpet 2,6L com sensor e Catit 43725. A página tem 0 preços em R$, só 1 imagem e nenhum desses modelos.
**Correção:**
- Retitular para "Melhor Fonte/Bebedouro Automático para Gato e Cachorro 2026: N Modelos Comparados".
- Montar 5-7 produtos com tabela rápida (L, dB, sensor, fio/bateria, filtro e custo do refil).
- Reaproveitar os 5 cards de `bebedouro-inox-x-ceramica` e linkar a página nos dois sentidos.
- Adicionar ItemList + Product e fotos reais.

### 4. HIGH: GPS gato tem 1 pick que exige SIM (sem mudança)
O SERP reforçou dois sinais: compatibilidade com o celular ("iPhone = Find My") e a ressalva "alguns exigem plano de dados". O nosso único pick tem 1 avaliação e precisa de chip.
**Correção:**
- Montar 3-4 picks por tecnologia: 4G SIM (ANXK G68), tag Find My + coleira com engate antienforcamento, e Tractive com plano (US$5/mês declarado).
- Pôr uma tabela no topo com peso (g), "precisa de chip?", "iPhone/Android" e mensalidade.
- Adicionar ItemList.

### 5. MEDIUM: antipulgas tem o formato certo e trust fraco para YMYL (novo)
O formato bate com o SERP: comparativo de 6 com tabela e 9 FAQs. Porém ~30% do SERP é Petlove/Petz, que têm conteúdo assinado por veterinários. O SERP também trata "depende do pet, consulte o veterinário" como a resposta principal. Comparado com o SERP, a página tem estes gaps:
- não tem revisor veterinário. O único "CRMV" na página é uma dica de compra;
- não cobre NexGard Spectra nem Simparic Trio (as versões com vermífugo, que o SERP cita);
- não cobre spray para filhote;
- não tem uma linha sobre gestantes/lactantes por princípio ativo;
- não cobre coleiras. O my-best, o mundodosreviews e o amoprodutinhos têm listicles próprios de coleira, e só o nosso post da Seresto trata disso.

**Correção:**
- Conseguir um revisor veterinário com CRMV e Person schema (ver `/seo content`), ou suavizar as afirmações.
- Adicionar uma linha "Versão com vermífugo" na tabela.
- Adicionar uma linha "gestante/lactante/filhote (idade mínima)".
- Adicionar ItemList + Product sem Review próprio (`/seo schema`).
- Linkar `coleira-seresto-antipulgas`.

### 6. LOW: ajustes nas páginas alinhadas (sem mudança)
- **Comedouro:** o `<title>` "Guia 2026" não bate com o meta "7 comedouros". Usar "…2026: 7 Modelos Comparados".
- **Tapete:** 0 menções a "lavável", "adesivo" e "macho", que o SERP de guias trata como tipo e uso. Adicionar uma seção "Descartável x lavável" e "Tapete com adesivo para machos".

---

## User stories (derivadas do SERP)

1. **Decisão, sem mensalidade.** Como comprador avesso a assinatura, quero rastreadores separados por chip pré-pago / Find My / alcance limitado, com o custo mensal real, porque os anúncios "sem mensalidade" escondem custos. Hoje encontro uma página sem produtos. *Sinal: TK909 "paga só a recarga", "AirTag não funciona sem iPhones", Tractive descrito como sem mensalidade num site e com assinatura em outro.*
2. **Consideração, câmera.** Como tutor que trabalha fora, quero 6+ câmeras comparadas em visão noturna, áudio, 360° e custo de nuvem. Hoje encontro 4 modelos em 577 palavras. *Sinal: SERP 90% Top-N, "10 modelos com visão noturna e áudio", fixa vs pan/tilt.*
3. **Consideração, fonte para gato.** Como dono de um gato que bebe pouca água, quero uma fonte silenciosa com filtro e saber se 1,8 L basta, porque ruído afasta o gato. Hoje encontro 2 produtos sem preço. *Sinal: títulos "10 modelos silenciosos", "<30 dB", "1,8 L para um gato".*
4. **Consideração, GPS gato.** Como dono de gato com acesso à rua e com iPhone, quero saber se uma tag Find My resolve sem mensalidade e se a coleira solta em caso de enrosco. Hoje encontro 1 pick com SIM. *Sinal: "compatível com Apple Find My", Leroy "sem assinatura, sem SIM", Tractive "cat collar integrated mount".*
5. **Awareness para decisão, antipulgas.** Como tutor de uma cadela prenhe ou de um filhote, quero saber qual princípio ativo é seguro e qual versão já inclui vermífugo, porque erro de dose é risco real. Hoje encontro uma página sem revisor veterinário e sem Spectra/Trio. *Sinal: Petlove/Petz "caso a caso", "NexGard Spectra para cães de 2-3,5 kg", "spray para filhotes".*

---

## Persona scoring (Relevância / Clareza / Confiança / Ação, 25 cada)

| Persona (sinal) | Página | Rel | Clar | Conf | Ação | Total | Delta |
|---|---|---|---|---|---|---|---|
| Comprador de câmera para monitoramento diário (Top-N 90%) | melhor-camera + gêmea | 11 | 11 | 8 | 7 | **37** | -1 (SERP subiu a régua) |
| GPS avesso a assinatura (Top-N segmentado) | gps-sem-mensalidade | 13 | 12 | 8 | 6 | **39** | = |
| Dono de gato buscando fonte silenciosa ("10 modelos silenciosos") | melhor-bebedouro-automatico | 13 | 15 | 11 | 9 | **48** | novo |
| Dono de gato com acesso à rua / iPhone (Find My, Tractive) | coleira-gps-para-gato | 15 | 17 | 10 | 13 | **55** | -1 (sinal Find My mais forte) |
| Tutor YMYL com filhote/gestante (Petlove/Petz) | melhor-antipulgas | 19 | 19 | 13 | 19 | **70** | novo |
| Tutor de cão grande buscando comedouro (Top-N) | melhor-comedouro-cachorro | 21 | 19 | 18 | 22 | **80** | = |
| Comprador de tapete para filhote, lavável/macho (guias) | melhor-tapete | 20 | 21 | 18 | 22 | **81** | -1 (gap lavável/macho) |

Melhorias, da persona mais fraca para a mais forte: câmera (Finding 2) → sem mensalidade (1) → fonte para gato (3) → GPS gato (4) → antipulgas (5) → comedouro/tapete (6).

---

## SXO Gap Score: 65 / 100 (era 66)

| Dimensão | Score | Evidência |
|---|---|---|
| Page Type | 9/15 (-1) | 3 alinhadas (comedouro, tapete, antipulgas); bebedouro-automatico agora HIGH com SERP confirmado; 2 CRITICAL + GPS gato HIGH |
| Content Depth | 11/15 (=) | 2,1k-3,3k nas alinhadas; 577 / 915 / 997 nas CRITICAL |
| UX Signals | 11/15 (=) | Tabelas e "Comparativo Rápido" nas alinhadas; títulos "Como Escolher" em páginas comerciais |
| Schema | 11/15 (=) | ItemList só em comedouro e tapete; antipulgas, bebedouro, GPS e câmera não têm |
| Media | 9/15 (=) | 7-9 imgs nas alinhadas; 1 img em bebedouro, sem-mensalidade e câmera |
| Authority | 7/15 (=) | Disclosure e "não testamos" (+); antipulgas YMYL sem veterinário (-); pick de GPS com 1 avaliação (-) |
| Freshness | 7/10 (=) | 3 páginas de dinheiro datadas de 08-20/08-22, sem atualização há ~74 dias |

Projeção: Findings 1-3 levam o score a ~73-75; com 4-5, ~78.

---

## Structured findings (audit-data.json, categoria "Search Experience")

```json
{
  "category": "Search Experience",
  "date": "2026-11-04",
  "sxo_gap_score": 65,
  "previous_score": 66,
  "delta": -1,
  "content_changes_since_previous": "none (only home WebP thumbnails)",
  "pages": [
    {"url": "/melhor-comedouro-automatico-cachorro/", "serp_type": "Top-N ~60% + retail guides + PDP/category", "verdict": "ALIGNED", "delta": "=", "fix": "title -> '2026: 7 Modelos Comparados'"},
    {"url": "/melhor-tapete-higienico-para-cachorro/", "serp_type": "Guides ~50% + Top-N", "verdict": "ALIGNED", "delta": "=", "fix": "add lavavel x descartavel and adesivo/macho sections"},
    {"url": "/melhor-bebedouro-automatico-pet/", "serp_type": "Top-N ~85% ('10 modelos silenciosos')", "verdict": "HIGH", "delta": "new SERP check", "fix": "retitle fonte/gato, 5-7 products + table, ItemList, real photos"},
    {"url": "/melhor-coleira-gps-sem-mensalidade/", "serp_type": "Top-N ~75% segmented by tech", "verdict": "CRITICAL", "delta": "=", "fix": "segmented 5-7 product listicle, mensalidade/chip cost columns, ItemList"},
    {"url": "/coleira-gps-para-gato/", "serp_type": "Top-N ~50% + guides + PDP", "verdict": "HIGH", "delta": "=", "fix": "3-4 picks by tech (SIM, Find My, Tractive), top table, ItemList"},
    {"url": ["/melhor-camera-para-monitorar-pet/", "/camera-para-monitorar-pet/"], "serp_type": "Top-N ~90%", "verdict": "CRITICAL", "delta": "= (gap widened)", "fix": "one 6-8 model listicle + 301 twin; nuvem/microSD column; remove from home featured"},
    {"url": "/melhor-antipulgas-para-cachorro/", "serp_type": "Top-N ~55% + vet-authored retail guides ~30%", "verdict": "MEDIUM", "delta": "new SERP check", "fix": "CRMV reviewer, Spectra/Trio, gestante/filhote row, ItemList/Product"}
  ],
  "persona_scores": {"camera": 37, "gps_sem_mensalidade": 39, "bebedouro_automatico": 48, "gps_gato": 55, "antipulgas": 70, "comedouro_cachorro": 80, "tapete": 81}
}
```

---

## Limitações

- O SERP veio do WebSearch (8 queries, com vários resultados do mesmo domínio), não de um rank tracker do google.com.br. PAA, AI Overview, anúncios e local pack não foram capturados. Os percentuais são aproximados.
- Sem dados do GSC: não dá para confirmar qual URL de câmera tem impressões, nem se o SERP observado é o que o site realmente disputa.
- Above-the-fold e layout mobile não foram verificados visualmente (ver `visual.md`). Os renders foram feitos com Playwright em desktop.
- Os produtos/modelos citados no SERP vêm de sites afiliados; não foi verificado se estão disponíveis no ML para links meli.la.
- Fora do escopo desta passada (veredito de 10-29 mantido): bebedouro-inox-x-ceramica, brinquedo-pilha-x-recarregável, cerca-virtual, home, comedouro-interativo, bolinha, alimentador-gatos.

Gerar relatório em PDF? Use `/seo google report`.
