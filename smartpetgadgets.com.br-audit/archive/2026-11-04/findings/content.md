# Achados de Qualidade de Conteúdo — smartpetgadgets.com.br

Data: 2026-11-04 · Revisor: Content Quality (QRG de 11/09/2025) · Comparação com a auditoria de 2026-10-29 (nota 73)

Escopo: 78 URLs do sitemap (72 posts + home, autor, sobre, política editorial, contato, privacidade). Fonte local em /home/projetos/blog. Amostra ao vivo (render_page, `--mode never`) de 7 páginas: home, vdrbg, newpet-2l, melhor-tapete, bebedouro-inox-x-ceramica, camera-para-monitorar-pet e coleira-gps-x-microchip. **O HTML ao vivo é byte a byte idêntico ao local nas 7.**

Método (o mesmo de 10-29, para que os números sejam comparáveis):
- Corpo = do H1 até o box do autor. Ficam de fora byline `p.meta`, `.cta-box`, `.disclosure`, figure/figcaption e a seção de FAQ.
- Sobreposição da FAQ = fração dos tokens da FAQ (sem stopwords) que também aparecem no corpo.
- Flesch adaptado ao PT, com sílabas estimadas. Serve como medida relativa.

Contexto: desde 10-29 só entraram dois commits, `258253b` (correção de E-E-A-T) e `9ccf3a3` (miniaturas da home). **Nenhum post teve o corpo reescrito.** Por isso as métricas de volume, FAQ e legibilidade quase não mudaram.

## Notas

| Métrica | 11-04 | 10-29 |
|---|---|---|
| Qualidade de conteúdo | **75/100** | 73 |
| E-E-A-T ponderado (modelo interno) | 62/100 | 60 |
| Prontidão para citação por IA | 77/100 | 77 |

| Fator E-E-A-T (pesos internos da skill; o Google não publica pesos numéricos) | Nota | Base |
|---|---|---|
| Experiência (20%) | 45 | Igual a 10-29. Não há fotos próprias, medições nem prints. |
| Expertise (25%) | 60 | Igual a 10-29. |
| Autoridade (25%) | 55 | Igual a 10-29. Person sem `image` e sem `knowsAbout`, com um único `sameAs`. |
| Confiabilidade (30%) | **80** (era 74) | As contradições sobre testes e autoria sumiram do HTML visível e do schema de FAQ. |

## Verificação do commit 258253b ("remove alegações de teste e byline duplicada")

| Item | Local (77 páginas) | Ao vivo (7 amostras) | Status |
|---|---|---|---|
| "Testa e pesquisa" no box do autor | 0 ocorrências. Hoje o box tem 3 redações: 49× "Pesquisa e compara…", 3× "Pesquisa produtos…" e 20× "tutor de pets e curador… Pesquisa especificações…" | 0 | **CORRIGIDO** |
| "Escrito pela Equipe Smart Pet Gadgets" | 0 (eram 58) | 0 | **CORRIGIDO** |
| vdrbg FAQ "modelos testados" (texto e JSON-LD) | 0 | 0 | **CORRIGIDO** |
| Home "escolhemos e testamos" | Agora "escolhemos e comparamos" | Confirmado | **CORRIGIDO** |
| newpet-2l "já testado" e tapete "mais vendido e testado" | 0 | 0 | **CORRIGIDO** |
| Outras alegações de teste em 1ª pessoa ("testamos", "testei", "nossos testes", "experimentamos", "usamos em casa") | 0 afirmativas | 0 | Limpo |

As ocorrências de "testado/testando" que sobraram não são alegações. São instruções ao leitor (por exemplo, "conferidos e testados por pelo menos 24h antes de sair" em comedouro-viagem) ou negações explícitas ("Não testamos", em 6 posts). /sobre/ diz "Quando um produto foi testado fisicamente, isso é dito de forma explícita", o que é coerente.

Sobrou um ponto ambíguo: em tapete-higienico-para-cachorro, a legenda diz *"não testamos cada camada isoladamente em laboratório"*. A frase sugere que algum teste foi feito, mas a linha 277 da mesma página diz "Não testamos o produto fisicamente". Troque por "não testamos o produto".

---

## CRÍTICO
Nenhum.

## ALTO

### H1 — PERSISTENTE: clusters finos e padronizados, com FAQs que repetem o corpo
Os dados são praticamente os mesmos de 10-29, porque nenhum corpo foi alterado.
- **37 de 72 posts têm menos de 600 palavras** no corpo sem a FAQ. 29 têm menos de 400 e 40 têm menos de 800. A mediana é 586. Contando a FAQ, 30 ficam abaixo de 600.
- Os mais finos: brinquedo-gato-idoso (275), **melhor-camera-para-monitorar-pet (280, página de dinheiro "melhores")**, brinquedo-substitui-tutor (284), erros-comuns-camera (288), como-escolher-brinquedo-entediado (293), camera-ansiedade (295), duvidas-camera (295), porta-impede-outros-animais (297).
- **A FAQ repete o corpo.** Todos os 72 posts têm FAQ. A sobreposição mediana é **0,876**: 45 posts ficam em 0,8 ou mais e **31 em 0,9 ou mais**.
  - Exemplo: em coleira-gps-x-microchip, as 4 respostas da FAQ são frases do corpo copiadas quase literalmente ("O microchip identifica o animal caso ele seja encontrado por terceiros…").
  - As páginas duvidas-camera (0,98) e duvidas-brinquedo (0,98) repetem cada H2 como H3 da FAQ.
- **Sinais de conteúdo em escala:** 44 posts publicados em 22/08, 56 de 72 nunca modificados e nenhum post modificado desde 29/10.

Correção:
1. Funda os stubs "duvidas-", "erros-comuns-" e "vale-a-pena" de cada cluster (câmera, brinquedo, porta) no pilar correspondente e aplique 301.
2. Onde a sobreposição for de 0,9 ou mais, apague a FAQ ou escreva perguntas realmente novas (custo, compatibilidade, garantia, casos-limite).
3. Reconstrua melhor-camera no padrão do bebedouro e do tapete: tabela datada, prós e contras por modelo e a frase "Não testamos".

## MÉDIO

### M1 — NOVO (não registrado em 10-29): marcadores "- " literais em blocos "Key Takeaways"
Em **24 páginas há 113 parágrafos** do tipo `<p>- texto</p>` dentro de `<blockquote><strong>Key Takeaways</strong>`. São resíduo de Markdown que nunca foi convertido para `<ul><li>`, e o rótulo está em inglês num site pt-BR.
- Exemplos: camera-para-monitorar-pet (5), bebedouro-inox-x-ceramica (5), comedouro-gato-x-cachorro (6), melhor-tapete (5) e vdrbg (5).
- Confirmado ao vivo.
- O resíduo existe desde 25/08.
- É o padrão típico de geração em lote: piora a extração da lista por IA e por featured snippet e sinaliza conteúdo não revisado.

Correção: troque, via script, cada grupo de `<p>- …</p>` por `<ul><li>…</li></ul>` e "Key Takeaways" por "Resumo rápido" ou "Pontos principais".

### M2 — PERSISTENTE: entidade do autor e páginas de política finas
- O Person tem `jobTitle` "Curadoria de produtos pet", 1 `sameAs` (Facebook) e não tem `image` nem `knowsAbout`.
- /sobre/ tem 376 palavras e politica-editorial tem 231.
- Não há declaração de uso de IA, a fórmula das "notas" (tapete 8,8–7,0; newpet-4l 8,3) não é explicada e a seção "Correções" não tem log.

Correção: acrescente foto, `knowsAbout`, mais perfis em `sameAs`, uma declaração de uso de IA, a fórmula da nota (critérios e pesos) e um log de correções datado. Comece registrando a correção de 29/10.

### M3 — PERSISTENTE: não há artefatos de experiência própria
Nenhum review tem foto, medição ou print próprio. Agora que os textos são honestos ("comparamos"), o teto de Experiência é estrutural. Para subir, adicione artefatos reais em 3 ou 4 reviews carro-chefe.

### M4 — PERSISTENTE: CTA genérico de afiliado
**75 páginas** usam o mesmo CTA: *"🐾 Confira o preço e a disponibilidade atual no Mercado Livre."* Ele não nomeia o produto nem diz por que comprá-lo. Só o bebedouro tem CTAs nomeados. O cluster comedouro está pausado pelo dono. Fora dele, nomeie e justifique o produto, ou aponte o CTA para o comparativo do cluster.

### M5 — PERSISTENTE: escolha "Melhor" fraca em coleira-gps-para-gato
O título continua "Melhor Coleira com GPS para Gatos" e a página recomenda o ANXK G68, que tem 1 avaliação e fecho que não é breakaway. Também não cita nenhuma fonte felina (International Cat Care, por exemplo). Correção: chame-o de "o mais leve que encontramos", indique uma coleira breakaway e cite a fonte.

### M6 — PERSISTENTE: lacunas YMYL
- **melhor-antipulgas:** recomenda as isoxazolinas como alternativa "segura" sem o alerta da FDA/CVM sobre eventos neurológicos (tremores, ataxia, convulsões). "FDA" não aparece na página.
- **coleira-seresto e cachorro-de-casa-pega-pulga:** continuam sem nenhum link externo. Não citam a bula da Elanco nem uma fonte veterinária.
- **brinquedo-pilha:** a varinha continua vendida como "o gato consegue brincar mesmo quando você não está segurando", sem o aviso de cordinha e supervisão. O aviso existe só no item CHOCYN.

### M7 — PERSISTENTE: legibilidade
- Mediana de 29 palavras por frase e PT-Flesch 41. 534 de 2.027 frases (26%) passam de 35 palavras.
- 9 posts ficam abaixo de 30, com destaque para como-escolher-brinquedo-entediado (15,4) e brinquedo-substitui-tutor (22,9).
- As reescritas de outubro servem de modelo: coleira-gato 71,5 e cerca-virtual 68.

### M8 — PERSISTENTE: qualidade das citações
- Há **115 citações "(Fonte, retrieved 2026-xx-xx)" em 57 páginas**, sem mudança. Em pt-BR use "consultado em dd/mm/aaaa"; só 11 páginas usam esse formato.
- **8 posts não têm nenhum link externo:** cachorro-de-casa-pega-pulga, coleira-gps-para-pet, coleira-seresto-antipulgas, duvidas-brinquedo-interativo-gato, melhor-alimentador-automatico-gatos, melhor-bolinha-inteligente-para-gato, melhor-comedouro-automatico-cachorro e porta-eletronica-x-alcapao-tradicional.
- Cerca de 85% das fontes são varejistas ou listicles: my-best, zoomalia, clickpetroleoegas e afins. Exemplo: coleira-gps-x-microchip cita a obrigatoriedade do microchip via clickpetroleoegas, quando deveria citar gov.br/SinPatinhas.

## BAIXO / INFO
- **L1 — NOVO: autoria inconsistente no schema.** 29 nós `Review` em 11 páginas (vdrbg, melhor-tapete, melhor-comedouro-cachorro, melhor-alimentador-gatos etc.) têm `author: Organization "Smart Pet Gadgets"`. O BlogPosting da mesma página usa Person "Nildo Alves". Unifique para Person, que é coerente com a correção da byline.
- **L2 — NOVO: 3 descrições diferentes do autor** no box: "curadoria de produtos pet", "tutor de pets e curador de produtos" e "Pesquisa produtos". Padronize. Se "tutor de pets" for mantido, cite os pets na página do autor, porque isso conta como sinal de experiência.
- **L3 — Templating de metadados: limpo.** 78 pares: `site_risk: low`, `templated_ratio: 0.0`, `shared_cta_phrases: {}`. Só há o flag secundário `brand-suffix-in-description` em contato, politica-editorial e politica-de-privacidade.
- **L4 — PERSISTENTE:** a home diz "71 artigos organizados", mas o sitemap tem 72 posts.
- **L5 — PERSISTENTE:** em vdrbg, o nome VDRBG aparece no title e no H1, mas o corpo nunca usa VDRBG e diz "Velds" 35 vezes. Falta uma frase explicando a relação entre os dois nomes.
- **L6 — PERSISTENTE:** em melhor-tapete, o preço da Biosec está datado de 04/10 e os demais de 23/10. O H3 "Ficha Técnica: Biosec" está sob o H2 "Problemas Comuns". Em tapete-higienico-para-cachorro, o `<title>` ainda não traz "Nekko", embora o headline do schema traga.
- **L7 — Frescor:** 56 de 72 posts têm dateModified igual a datePublished. A correção de 29/10 não alterou as datas, o que é aceitável para uma correção pequena, mas um log em politica-editorial ajudaria (M2).

## O que funciona
- **A honestidade agora é coerente em todo o site.** Byline e schema usam o mesmo autor único, ninguém alega testes que não fez e há "Não testamos" explícito nas páginas de produto novas.
- Ledes que respondem logo de cara, tabelas comparativas e de especificação datadas (bebedouro, cerca-virtual, coleira-gato, tapete), "Pontos de atenção" por produto e preço por unidade correto no tapete.
- Não há duplicação entre páginas: a duplicação está dentro de cada página (FAQ).
- Os metadados são únicos e não seguem template.
- O alerta MDR1/ivermectina em antipulgas e a distinção entre cerca GPS e cerca com estímulo elétrico estão bem feitos.

## Prontidão para citação por IA (77/100)
- **Pontos fortes:** respostas diretas, tabelas, FAQPage e ItemList, datas de consulta nas páginas novas.
- **Pontos fracos:**
  - 37 páginas finas;
  - FAQs redundantes;
  - listas "- " sem marcação semântica (M1);
  - "retrieved" em inglês;
  - fontes de baixa autoridade em páginas de saúde.

## Delta em relação a 10-29

| Item | Status |
|---|---|
| Alegações de teste (vdrbg FAQ, home, newpet-2l, tapete, box do autor em 49 páginas) | **CORRIGIDO** (confirmado local e ao vivo) |
| "Equipe Smart Pet Gadgets" em 58 páginas | **CORRIGIDO** |
| Legenda "não testamos cada camada" em tapete-higienico | Resíduo menor (novo) |
| Marcadores "- " literais e "Key Takeaways" (24 páginas) | **NOVO** (M1) |
| Review schema com author Organization | **NOVO** (L1) |
| Clusters finos, FAQ redundante, CTA genérico | Persistente |
| Entidade do autor, uso de IA, fórmula da nota | Persistente |
| ANXK, alerta FDA, aviso da varinha, links em seresto/pulga | Persistente |
| "retrieved" (115) e 8 posts sem link externo | Persistente |
| "71 artigos", VDRBG/Velds, Biosec/heading/Nekko | Persistente |
| Templating de metadados | Limpo |

## Achados estruturados (audit-data.json, Content Quality)

```json
{"category":"Content Quality","date":"2026-11-04","score":75,"prior_score":73,
"eeat":{"experience":45,"expertise":60,"authoritativeness":55,"trustworthiness":80,"weighted":62},
"ai_citation_readiness":77,
"findings":[
{"id":"CQ-FIXED1","severity":"info","status":"fixed","title":"Testing claims removed site-wide (author box 'Testa e pesquisa' 49 pages, vdrbg FAQ+schema, home, newpet-2l, tapete); verified local + 7 live samples"},
{"id":"CQ-FIXED2","severity":"info","status":"fixed","title":"'Escrito pela Equipe Smart Pet Gadgets' removed from all 58 pages"},
{"id":"CQ-H1","severity":"high","status":"open","title":"37/72 posts <600 body words (29 <400); FAQ overlap median 0.876, 31 posts >=0.9; 56/72 never modified; melhor-camera 280 words"},
{"id":"CQ-M1","severity":"medium","status":"new","title":"113 literal '- ' paragraphs in English 'Key Takeaways' blockquotes on 24 pages (unconverted Markdown)"},
{"id":"CQ-M2","severity":"medium","status":"open","title":"Author Person lacks image/knowsAbout, 1 sameAs; no AI-use, rating-formula or corrections log"},
{"id":"CQ-M3","severity":"medium","status":"open","title":"No first-hand experience artifacts"},
{"id":"CQ-M4","severity":"medium","status":"open","title":"Generic unnamed Mercado Livre CTA on 75 pages"},
{"id":"CQ-M5","severity":"medium","status":"open","title":"coleira-gps-para-gato 'Melhor' = ANXK G68 (1 review, non-breakaway), no feline source","urls":["/coleira-gps-para-gato/"]},
{"id":"CQ-M6","severity":"medium","status":"open","title":"YMYL: no FDA isoxazoline warning; seresto/pulga no external links; varinha no supervision caveat"},
{"id":"CQ-M7","severity":"medium","status":"open","title":"Median 29 words/sentence, PT-Flesch 41; 9 posts <30"},
{"id":"CQ-M8","severity":"medium","status":"open","title":"115 English 'retrieved' citations on 57 pages; 8 posts with no external link; mostly retailer/listicle sources"},
{"id":"CQ-L1","severity":"low","status":"new","title":"29 Review nodes on 11 pages use author Organization while BlogPosting uses Person Nildo Alves"},
{"id":"CQ-L2","severity":"low","status":"new","title":"3 different author-box descriptors; tapete-higienico caption 'não testamos cada camada' ambiguous"},
{"id":"CQ-L3","severity":"low","status":"ok","title":"Metadata templating clean: site_risk low, templated_ratio 0.0, shared_cta_phrases {}"},
{"id":"CQ-L4","severity":"low","status":"open","title":"Home '71 artigos' vs 72 posts"},
{"id":"CQ-L5","severity":"low","status":"open","title":"vdrbg: VDRBG in title/H1, body says Velds 35x"},
{"id":"CQ-L6","severity":"low","status":"open","title":"melhor-tapete Biosec date 04/10 and H3 under 'Problemas Comuns'; tapete-higienico title lacks Nekko"},
{"id":"CQ-INFO1","severity":"info","status":"paused","title":"Comedouro cluster CTA/product depth paused by owner"}]}
```
