# Achados de Qualidade de Conteúdo — smartpetgadgets.com.br

**Nota Content Quality: 76/100** (era 75 em 2026-11-04)

Data: 2026-11-06 · Revisor: Content Quality (QRG de 11/09/2025) · Comparação com a auditoria de 2026-11-04 (archive/2026-11-04/findings/content.md)

Escopo: 78 URLs do sitemap (72 posts + home, autor, sobre, política editorial, contato, privacidade). Fonte local em /home/projetos/blog. Amostra ao vivo (render_page, `--mode never`): melhor-camera-para-monitorar-pet, **byte a byte idêntica ao local**.

Método: o mesmo de 10-29 e 11-04, para que os números sejam comparáveis. Há um único ajuste: o novo bloco `.cta-top` (commit `a7379a2`) **fica fora do corpo**. Sem esse ajuste, todos os 68 posts "ganhariam" cerca de 20 palavras e a legibilidade subiria artificialmente.
- Corpo = do H1 até o box do autor, sem byline, `.cta-box`, `.cta-top`, `.disclosure`, figure e FAQ.
- Sobreposição da FAQ = fração dos tokens da FAQ (sem stopwords) que também aparecem no corpo.
- Flesch adaptado ao PT, com sílabas estimadas. Serve como medida relativa.

Commits desde 11-04:
- `a7379a2`: CTA no topo em 68 posts, barra fixa no mobile e evento GA4.
- `71f1c59`: 14 títulos e metas reescritos.
- `1efc1aa`: abertura com resposta direta em 9 artigos de produto caro.

Como antes, quase nenhum corpo foi reescrito além do 1º parágrafo.

## Notas

| Métrica | 11-06 | 11-04 |
|---|---|---|
| Qualidade de conteúdo | **76/100** | 75 |
| E-E-A-T ponderado (modelo interno) | 61/100 | 62 |
| Prontidão para citação por IA | **80/100** | 77 |

| Fator E-E-A-T (pesos internos da skill; o Google não publica pesos numéricos) | Nota | Base |
|---|---|---|
| Experiência (20%) | 45 | Sem mudança. Não há fotos próprias, medições nem prints. |
| Expertise (25%) | 60 | Sem mudança. As novas aberturas batem com o corpo de cada página (verificado: Tapo C200 9 m/360°, Newpet 4L 12 s/3 pilhas D, Amicus 1,5→3,5 L). |
| Autoridade (25%) | 55 | Sem mudança. O Person continua sem `image` e sem `knowsAbout`, com 1 `sameAs`. |
| Confiabilidade (30%) | 79 (era 80) | Caiu 1 ponto por três motivos: a data "Atualizado em 5 de novembro" saiu em 9 páginas que só mudaram 1 parágrafo, uma meta promete conteúdo que o corpo não tem, e o CTA genérico agora aparece 2 vezes em páginas finas. |

## Delta vs auditoria 2026-11-04

| Item (ID 11-04) | Status 11-06 | Evidência |
|---|---|---|
| Abertura sem veredito nas páginas de produto caro | **CORRIGIDO** (novo ganho) | 9 páginas abrem com produto indicado e números. Exemplo: melhor-camera indica a "TP-Link Tapo C200: Full HD, giro de 360°…". |
| L6: `<title>` de tapete-higienico sem "Nekko" | **CORRIGIDO** | Agora "Tapete Higiênico Bamboo.dry Nekko: Review, Prós e Contras" (71f1c59). |
| L5: VDRBG no title, "Velds" no corpo | **CONTINUA (parcial)** | O corpo agora cita "VDRBG" 2 vezes, mas "Velds" segue com 25. O parágrafo seguinte diz "comparamos… o Velds 4L Wi-Fi" sem explicar que é o mesmo produto, e os dois nomes ficaram lado a lado. |
| H1: clusters finos | **CONTINUA** | <600 palavras: 36 de 72 (eram 37); <400: 29 (=); <800: 40 (=). Mediana de 610 (era 586). melhor-camera passou de 280 para 345 e continua abaixo de 400. |
| H1: FAQ que repete o corpo | **CONTINUA** | Sobreposição mediana de 0,873 (era 0,876). ≥0,9: 29 posts (eram 31); ≥0,8: 45 (=). |
| H1: sinais de escala (datas) | **CONTINUA** | 48 de 72 posts nunca modificados (eram 56). Os 8 a menos vêm das bumps de data em 11-05. |
| M1: "Key Takeaways" com "- " literal | **CONTINUA** | 24 páginas, 113 parágrafos. **Em 7 das 9 páginas com abertura nova, o bloco fica logo abaixo dela.** |
| M2: entidade do autor e políticas finas | **CONTINUA** | Person sem `image` e `knowsAbout`, com 1 `sameAs`. /sobre/ tem 390 palavras e politica-editorial 245. Nenhuma das duas fala de uso de IA, explica a fórmula da nota ou traz log de correções. |
| M3: sem artefatos de experiência própria | **CONTINUA** | — |
| M4: CTA genérico de afiliado | **PIOROU** | O CTA final genérico segue com 75 ocorrências. **Somou-se um CTA de topo genérico em 61 posts** ("Quer ver o preço agora? Confira a oferta atual no Mercado Livre."), mais a barra fixa no mobile. Os stubs de cerca de 300 palavras têm agora 2 CTAs sem nome de produto, mais a barra (ver M9). |
| M5: "Melhor" coleira para gato = ANXK G68 | **CONTINUA (e ampliado)** | Continua com "5,0 com 1 avaliação" e sem fonte felina. A página já recomenda coleira com engate breakaway. **A nova abertura de coleira-gps-para-pet também passou a indicar o ANXK G68**, então a escolha fraca agora aparece em 2 páginas. |
| M6: lacunas YMYL | **CONTINUA** | "FDA" tem 0 ocorrências em melhor-antipulgas. coleira-seresto e cachorro-de-casa-pega-pulga têm 0 links externos. A varinha segue com "o gato consegue brincar mesmo quando você não está segurando", sem aviso de supervisão. |
| M7: legibilidade | **CONTINUA** | Mediana de 29,05 palavras por frase. PT-Flesch 42,0 (era 41,1). 532 de 2.049 frases (26%) passam de 35 palavras. Os mesmos 9 posts seguem abaixo de 30. |
| M8: qualidade das citações | **CONTINUA** | "retrieved" aparece 115 vezes em 57 páginas. Os mesmos 8 posts seguem sem link externo. |
| L1: Review com author Organization | **CONTINUA** | 29 nós em 11 páginas. |
| L2: descrições do autor e legenda ambígua | **CONTINUA** | O box do autor tem 3 redações (49 / 3 / 20 páginas). "não testamos cada camada" continua em tapete-higienico. |
| L3: templating de metadados | **LIMPO** | 78 pares: `site_risk: low`, `templated_ratio: 0.0`, `shared_cta_phrases: {}`. Os 14 títulos novos não seguem template. |
| L4: home diz "71 artigos" | **CONTINUA** | O sitemap tem 72 posts. |
| L6 (resto): Biosec | **CONTINUA** | O preço da Biosec segue datado de 04/10 e o dos demais de 23/10. O H3 "Ficha Técnica Detalhada: Biosec" continua sob o H2 "Problemas Comuns e Como Evitar". |
| Datas de atualização nas 9 páginas | **NOVO** (M10) | dateModified e "Atualizado em" mudaram para 05/11 com acréscimos de 20 a 90 palavras. |
| Meta promete o que o corpo não entrega | **NOVO** (M11) | camera-pet-com-dispensador-de-petisco. |
| "Câmera só funciona em 2,4 GHz" | **NOVO** (L8) | Afirmação absoluta, que outra página do site contradiz. |

---

## CRÍTICO
Nenhum.

## ALTO

### H1: CONTINUA. Clusters finos e padronizados, com FAQs que repetem o corpo
- **36 de 72 posts têm menos de 600 palavras** de corpo (29 têm menos de 400). Fora do cluster comedouro, que está pausado, são **28 stubs com menos de 400 palavras**, todos nos clusters câmera, brinquedo, porta e coleira.
- Os mais finos:
  - brinquedo-interativo-gato-idoso-vale-a-pena (275)
  - brinquedo-interativo-substitui-brincadeira-tutor (284)
  - erros-comuns-camera-monitorar-pet (288)
  - como-escolher-brinquedo-interativo-gato-entediado (293)
  - camera-pet-cachorro-ansiedade-separacao (295)
  - duvidas-camera-para-monitorar-pet (295)
  - porta-eletronica-impede-entrada-outros-animais (297)
- **melhor-camera-para-monitorar-pet tem 345 palavras.** É uma página de dinheiro, e agora a abertura afirma "a melhor… é a TP-Link Tapo C200". Faltam profundidade, a frase "Não testamos" e preços datados para sustentar esse veredito.
- **Sobreposição da FAQ:** mediana de 0,873, com 29 posts em 0,9 ou mais. Os piores são duvidas-camera, duvidas-porta (0,981), duvidas-brinquedo (0,978) e duvidas-coleira (0,971).
- Datas: 48 de 72 posts nunca foram modificados, e 44 foram publicados em 22/08.

Correção, em ordem de prioridade (sem script em massa):
1. **melhor-camera-para-monitorar-pet:** reconstrua no padrão de bebedouro e tapete, com tabela datada de preço por modelo, prós e contras, "Não testamos" e a explicação de por que a C200 vence. Depois funda nela duvidas-camera e erros-comuns-camera e aplique 301.
2. **Cluster porta (12 stubs):** funda duvidas-porta, erros-comuns-porta, impede-outros-animais, microchip-x-rfid e sensor-de-luz em porta-eletronica-automatica-para-pet, que já tem abertura nova, e aplique 301.
3. **Cluster brinquedo:** funda gato-idoso, substitui-tutor, entediado e duvidas-brinquedo num pilar de brinquedo para gato.
4. Nos stubs que ficarem no ar, onde a sobreposição for ≥0,9, apague a FAQ ou troque por perguntas realmente novas (custo, compatibilidade, garantia).

## MÉDIO

### M9: NOVO / PIOROU. CTA de topo genérico em páginas finas (amplia o M4)
- O commit `a7379a2` pôs um CTA logo após o 1º parágrafo em 68 posts. **61 usam o mesmo texto genérico:** "Quer ver o preço agora? Confira a oferta atual no Mercado Livre." Só 7 comparativos usam "Veja a comparação com preço e link de cada modelo".
- Somado ao CTA final genérico (75 ocorrências) e à barra fixa no mobile, um stub informativo de cerca de 300 palavras fica com 2 CTAs e 1 barra que não dizem qual produto é. Exemplos: duvidas-porta-eletronica-pet e camera-pet-grava-sem-internet.
- Pelo QRG, conteúdo principal raso com monetização proeminente e pouco valor agregado de afiliado é perfil de página Low.
- Recomendação, **sem aplicar em massa**:
  - Não mexa no cluster comedouro, que está pausado pelo dono.
  - Nos stubs que serão fundidos (H1), não vale reescrever o CTA: a fusão resolve.
  - Nas páginas que vendem um produto específico, troque o texto genérico pelo nome do produto e um motivo, como já fazem os CTAs do bebedouro ("Fonte AGBE AG-200 1,8 L: veja o preço de hoje"). Comece por camera-para-monitorar-pet, coleira-gps-para-pet e porta-eletronica-automatica-para-pet.
  - Nas páginas puramente informativas, um link para o comparativo do cluster serve melhor que um link direto ao ML.

### M10: NOVO. Data de atualização mudada por acréscimo pequeno
- Nas 9 páginas de `1efc1aa`, dateModified e o "Atualizado em 5 de novembro de 2026" visível mudaram por causa de um único parágrafo reescrito, de +20 a +90 palavras.
- Exemplos: comedouro-newpet-4l-review (+33), porta-eletronica-automatica (+31) e camera-para-monitorar-pet (+21).
- O Google pede que a data só mude com alteração substancial. Hoje o risco é baixo, mas o padrão vira sinal de manipulação de frescor se repetido.
- Correção: daqui em diante, só mude a data quando a mudança for substancial (preços, tabela, seções). Para mudanças menores, registre a alteração num log em politica-editorial (M2).

### M11: NOVO. A meta reescrita promete o que o corpo não entrega
- **camera-pet-com-dispensador-de-petisco:** a nova meta diz "quando ajuda na ansiedade do pet", mas o corpo (355 palavras) não usa "ansiedade", "ansioso" nem "estresse" nenhuma vez. A promessa vira clique com rejeição.
- **como-instalar-porta-eletronica-pet:** o title diz "Vidro, Madeira e Parede", mas "parede" e "alvenaria" só aparecem na frase de abertura. Não há passo a passo de alvenaria, e o corpo tem 341 palavras.
- Correção, nestas 2 páginas: escreva a seção prometida e linke camera-pet-cachorro-ansiedade-separacao, ou ajuste a meta ou o title ao que existe.

### M1: CONTINUA. Marcadores "- " literais em blocos "Key Takeaways"
- São 113 parágrafos em 24 páginas.
- **Prioridade:** 7 das 9 páginas com abertura nova têm o bloco logo abaixo da resposta direta, o que prejudica justamente a extração por IA que o commit buscava: camera-para-monitorar-pet, coleira-gps-para-pet, comedouro-com-ou-sem-wifi, comedouro-newpet-4l-review, comedouro-vdrbg-4l-wifi-review, melhor-bebedouro-automatico-pet e porta-eletronica-automatica-para-pet.
- Correção: converta primeiro essas 7 para `<ul><li>` e "Pontos principais". As outras 17 podem ser feitas depois, revisando cada uma.

### M2: CONTINUA. Entidade do autor e páginas de política finas
- O Person tem `jobTitle` "Curadoria de produtos pet" e 1 `sameAs` (Facebook), sem `image` e sem `knowsAbout`.
- /sobre/ tem 390 palavras e politica-editorial 245.
- Não há declaração de uso de IA, a fórmula das notas (tapete 8,8–7,0; newpet-4l 8,3) não é explicada e não há log de correções.

Correção: acrescente foto, `knowsAbout` e mais perfis em `sameAs`. Na política editorial, inclua a declaração de uso de IA, a fórmula da nota e um log de correções datado. Comece pela correção de 29/10 e pelas aberturas de 05/11, o que também resolve o M10.

### M3: CONTINUA. Não há artefatos de experiência própria
O teto de Experiência (45) é estrutural. Para subir, adicione foto, medição ou print reais em 2 ou 3 reviews carro-chefe. Os candidatos são as páginas que o ChatGPT já cita: tapete e coleira-gato.

### M5: CONTINUA (ampliado). "Melhor" coleira GPS para gatos = ANXK G68
- O produto tem "5,0 com 1 avaliação", e a coleira que vem com ele não é breakaway. A página já orienta usar engate de segurança e é honesta sobre isso.
- O title segue "Melhor Coleira com GPS para Gatos em 2026" e não há nenhuma fonte felina.
- **Novo:** a abertura de coleira-gps-para-pet agora diz "Para gato, o modelo que indicamos é o rastreador ANXK G68 4G, de 27 g".
- Há uma incoerência de preço: o mesmo parágrafo diz "preços vão de menos de R$ 100 a mais de R$ 150 (levantamento de agosto de 2026)", mas o ANXK custa R$ 301,99 (24/10).
- Correção:
  - Em coleira-gps-para-gato, chame-o de "o mais leve que encontramos (27 g), com só 1 avaliação" e cite International Cat Care sobre coleiras breakaway.
  - Em coleira-gps-para-pet, atualize a faixa de preço com data e diga que os 4G custam a partir de cerca de R$ 300.

### M6: CONTINUA. Lacunas YMYL
- **melhor-antipulgas-para-cachorro:** recomenda as isoxazolinas sem o alerta da FDA e do CVM sobre eventos neurológicos ("FDA" aparece 0 vezes). Das três, é a correção mais importante, porque se trata de medicamento.
- **coleira-seresto-antipulgas e cachorro-de-casa-pega-pulga:** 0 links externos. Cite a bula da Elanco e uma fonte veterinária.
- **brinquedo-interativo-pilha-x-recarregavel:** a varinha com ventosa segue sem aviso de supervisão por causa da cordinha.

### M7: CONTINUA. Legibilidade
- Mediana de 29 palavras por frase e PT-Flesch 42. 26% das frases passam de 35 palavras.
- Piores: como-escolher-brinquedo-entediado (15,4), melhor-comedouro-interativo-gato (18,5) e brinquedo-substitui-tutor (22,9). Os três devem ser fundidos (H1).
- As aberturas novas usam frases mais curtas. Modelos: coleira-gato (72,5) e cerca-virtual (67,7).

### M8: CONTINUA. Qualidade das citações
- "retrieved" aparece 115 vezes em 57 páginas; só 11 páginas usam "consultado em".
- 8 posts não têm nenhum link externo: cachorro-de-casa-pega-pulga, coleira-gps-para-pet, coleira-seresto-antipulgas, duvidas-brinquedo-interativo-gato, melhor-alimentador-automatico-gatos, melhor-bolinha-inteligente-para-gato, melhor-comedouro-automatico-cachorro e porta-eletronica-x-alcapao-tradicional.
- **coleira-gps-para-pet ganhou abertura voltada a citação por IA, mas continua sem nenhuma fonte externa.** Corrija esta primeiro.
- Fontes de varejo e listicle dominam. coleira-gps-x-microchip deveria citar gov.br/SinPatinhas.

## BAIXO / INFO
- **L5: CONTINUA (parcial).** Em comedouro-vdrbg-4l-wifi-review, a abertura diz "VDRBG 4L Wi-Fi" e a frase seguinte diz "comparamos… o Velds 4L Wi-Fi". Acrescente uma frase: "No Mercado Livre o mesmo aparelho aparece como VDRBG ou Velds".
- **L8: NOVO.** Em como-configurar-camera-pet-wifi, a frase "câmeras de segurança residenciais funcionam exclusivamente nessa banda [2,4 GHz]" vem de um varejista (TemProduto Express). Ela contradiz comedouro-com-ou-sem-wifi, que indica um modelo "Wi-Fi dual band". A meta nova repete o absoluto ("câmera pet só funciona em 2,4 GHz"). Troque por "a maioria funciona só em 2,4 GHz".
- **L9: NOVO.** A abertura de comedouro-com-ou-sem-wifi recomenda "o comedouro 6L avaliado aqui" sem nome nem modelo. Uma recomendação sem entidade é pouco citável e "avaliado" é ambíguo. Use o nome do anúncio e, se for o caso, "comparado" em vez de "avaliado".
- **L1: CONTINUA.** 29 nós Review em 11 páginas usam `author: Organization`. Unifique para Person "Nildo Alves".
- **L2: CONTINUA.** O box do autor tem 3 redações. A legenda "não testamos cada camada isoladamente em laboratório" em tapete-higienico ainda sugere algum teste. Troque por "não testamos o produto".
- **L3: LIMPO.** Templating de metadados: `site_risk: low`, `templated_ratio: 0.0`, `shared_cta_phrases: {}`. Há só `brand-suffix-in-description` em contato, politica-editorial e politica-de-privacidade.
- **L4: CONTINUA.** A home diz "71 artigos", mas são 72 posts.
- **L6: CONTINUA (parcial).** "Nekko" no title foi corrigido. Sobram a data da Biosec (04/10 contra 23/10) e o H3 da Biosec sob "Problemas Comuns".
- **INFO:** o lastmod do sitemap é 2026-11-05 em 61 posts cujo dateModified é mais antigo, porque o deploy regenera o lastmod. Ver findings/sitemap.md.

## O que funciona
- **As aberturas com resposta direta estão bem feitas.** Indicam produto, números e alternativas, e foram conferidas contra o próprio corpo, sem contradição. São o padrão das páginas que o ChatGPT já cita.
- A honestidade continua coerente: nenhuma alegação de teste reapareceu e as aberturas novas não dizem "testamos".
- Os 14 títulos novos respondem à pergunta da busca ("Sim, no SD", "Até Quantos Dias É Seguro?") sem template, e o H1 acompanha o title.
- Não há duplicação entre páginas; a duplicação está dentro de cada página (FAQ).

## Prontidão para citação por IA (80/100, era 77)
- **Ganhos:** 9 páginas de produto caro com veredito nomeado e números nos primeiros 60 a 100 palavras.
- **Freios:**
  - "Key Takeaways" com "- " logo abaixo da resposta em 7 dessas 9 páginas;
  - coleira-gps-para-pet sem nenhuma fonte externa;
  - melhor-camera com veredito forte em 345 palavras;
  - produto sem nome em comedouro-com-ou-sem-wifi;
  - "retrieved" em inglês;
  - fontes de baixa autoridade nas páginas de saúde.

## Achados estruturados (audit-data.json, Content Quality)

```json
{"category":"Content Quality","date":"2026-11-06","score":76,"prior_score":75,
"eeat":{"experience":45,"expertise":60,"authoritativeness":55,"trustworthiness":79,"weighted":61},
"ai_citation_readiness":80,
"findings":[
{"id":"CQ-FIXED3","severity":"info","status":"fixed","title":"Direct-answer openings with named product + specs on 9 high-ticket pages (1efc1aa); consistent with page bodies"},
{"id":"CQ-FIXED4","severity":"info","status":"fixed","title":"tapete-higienico-para-cachorro <title> now includes Nekko (71f1c59)"},
{"id":"CQ-H1","severity":"high","status":"open","title":"36/72 posts <600 body words (29 <400; 28 stubs <400 outside paused comedouro cluster); FAQ overlap median 0.873, 29 posts >=0.9; melhor-camera 345 words with strong 'best' verdict","urls":["/melhor-camera-para-monitorar-pet/","/duvidas-camera-para-monitorar-pet/","/duvidas-porta-eletronica-pet/","/brinquedo-interativo-gato-idoso-vale-a-pena/"]},
{"id":"CQ-M9","severity":"medium","status":"worsened","title":"New generic top CTA on 61 posts + generic final CTA (75) + mobile sticky bar; thin ~300-word stubs now carry 2 unnamed affiliate CTAs"},
{"id":"CQ-M10","severity":"medium","status":"new","title":"dateModified/'Atualizado em' bumped to 2026-11-05 on 9 pages for single-paragraph edits (+20-90 words)"},
{"id":"CQ-M11","severity":"medium","status":"new","title":"Rewritten meta/title promise not delivered: camera-pet-com-dispensador (meta 'ansiedade', 0 mentions in body); como-instalar-porta ('Parede' in title, no masonry section)","urls":["/camera-pet-com-dispensador-de-petisco/","/como-instalar-porta-eletronica-pet/"]},
{"id":"CQ-M1","severity":"medium","status":"open","title":"113 literal '- ' paragraphs in English 'Key Takeaways' on 24 pages; 7 of 9 new direct-answer pages have it right below the opening"},
{"id":"CQ-M2","severity":"medium","status":"open","title":"Author Person lacks image/knowsAbout, 1 sameAs; no AI-use statement, rating formula or corrections log"},
{"id":"CQ-M3","severity":"medium","status":"open","title":"No first-hand experience artifacts"},
{"id":"CQ-M5","severity":"medium","status":"open","title":"ANXK G68 (1 review) recommended as 'Melhor' for cats and now also in coleira-gps-para-pet opening; no feline source; price range text (<R$100 to >R$150, Aug) inconsistent with R$301.99","urls":["/coleira-gps-para-gato/","/coleira-gps-para-pet/"]},
{"id":"CQ-M6","severity":"medium","status":"open","title":"YMYL: no FDA isoxazoline warning in melhor-antipulgas; seresto/pulga 0 external links; varinha no supervision caveat"},
{"id":"CQ-M7","severity":"medium","status":"open","title":"Median 29 words/sentence, PT-Flesch 42; 26% sentences >35 words; 9 posts <30"},
{"id":"CQ-M8","severity":"medium","status":"open","title":"115 'retrieved' on 57 pages; 8 posts with no external link incl. coleira-gps-para-pet (now GEO-targeted)"},
{"id":"CQ-L1","severity":"low","status":"open","title":"29 Review nodes on 11 pages use author Organization"},
{"id":"CQ-L2","severity":"low","status":"open","title":"3 author-box descriptors; tapete-higienico caption 'não testamos cada camada' ambiguous"},
{"id":"CQ-L3","severity":"low","status":"ok","title":"Metadata templating clean: site_risk low, templated_ratio 0.0, shared_cta_phrases {}"},
{"id":"CQ-L4","severity":"low","status":"open","title":"Home '71 artigos' vs 72 posts"},
{"id":"CQ-L5","severity":"low","status":"partial","title":"vdrbg: opening says VDRBG, next paragraph 'Velds' (25x) with no explanation"},
{"id":"CQ-L6","severity":"low","status":"partial","title":"melhor-tapete Biosec date 04/10 and H3 under 'Problemas Comuns' (Nekko title fixed)"},
{"id":"CQ-L8","severity":"low","status":"new","title":"como-configurar-camera-pet-wifi claims cameras work 'exclusivamente' on 2.4 GHz (retailer source), contradicted by dual-band feeder recommended elsewhere"},
{"id":"CQ-L9","severity":"low","status":"new","title":"comedouro-com-ou-sem-wifi opening recommends unnamed 'comedouro 6L avaliado aqui'"},
{"id":"CQ-INFO1","severity":"info","status":"paused","title":"Comedouro cluster CTA/product depth paused by owner; not included in CTA recommendations"}]}
```
