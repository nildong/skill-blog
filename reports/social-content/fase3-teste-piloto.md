# FASE 3 — Piloto de 25 peças com mídia física real

**Gerado em:** 2026-09-05
**Escopo:** 25 peças (5 artigos x 5 formatos), mídia física gerada de verdade
(PNG/MP4), corte de score recalibrado, sem tocar HTML/afiliados/sitemap, sem
publicar em Facebook/Instagram.

---

## 1. Decisões aplicadas nesta fase

### 1.1 Corte de score PRONTO_PUBLICAR: 85 → 70

Alterado em `tools/social-content-engine/src/v2/score.js`. Peças com score
70-84 recebem `status: PRONTO_PUBLICAR` mas ficam adicionalmente marcadas
`revisao_leve: true` (campo `REVISAO_LEVE` no export/planilha) — recomenda-se
uma revisão humana rápida antes de publicar, mas o motor já as considera
aptas. Peças com score < 70 continuam `REVISAR` forçado.

Efeito no corpus completo (307 peças, não só o piloto): `PRONTO_PUBLICAR`
subiu de 9 para 123 peças; `REVISAR` caiu de 298 para 184. Os testes em
`test/v2/*.test.js` foram atualizados para o novo corte (85 → 70 nos
asserts) e **os 82 testes do projeto passam** (14 v2 + 68 v1).

### 1.2 Mídia física nova (não mais planejamento)

Criado `tools/social-content-engine/generate_assets_v2.py`, adaptado de
`generate_assets.py` (V1) com a diagramação corrigida conforme pedido:

- **Removido**: kicker de formato/cluster ("REEL · COMEDOUROS"), ID técnico
  (`PECA-XXX`/`SPG-NNN`) impresso na arte, "placa inclinada" de banner de
  anúncio.
- **Mantido/novo**: um único bloco de texto — o HOOK principal (+
  complemento curto opcional em casos que fazem sentido) — sobre a mesma
  foto-base do Pexels usada por cluster no V1 (`assets/pexels_cache/`),
  com overlay de escurecimento para legibilidade e wordmark discreta
  (`smartpetgadgets.com.br`, 22px, canto inferior esquerdo) em vez do selo
  grande do V1.
- Vídeo (Reels): Ken Burns simples sobre a mesma foto (zoom lento + fade-in
  do bloco de hook), sem barra de progresso nem kicker, wordmark discreta.

Bug encontrado e corrigido durante a execução: a primeira versão do detector
de cluster usava substring da URL do artigo, e o artigo
"Câmera Pet ou Coleira GPS" continha ambos os termos "coleira-gps" e
"camera" — a ordem das regras fazia cair no cluster errado (coleira-gps em
vez de câmera). Corrigido para priorizar o campo `CLUSTER` já classificado
pelo `content-strategy.json` (via `collectSource`), com heurística de
substring como fallback só quando `CLUSTER` é `null`. As 5 peças do artigo de
câmera foram regeneradas após o fix.

---

## 2. Os 5 artigos escolhidos

Critério: um artigo por cluster real (dos 5 clusters classificados entre os
63 artigos com copy V2 real — os 5 stubs do comedouro ficaram de fora, como
determinado), priorizando o artigo com maior diversidade de formato
disponível e maior score médio dentro do cluster.

| # | Cluster | Artigo | URL |
|---|---|---|---|
| 1 | comedouro-automatico-para-pet | Comedouro Automático Ajuda no Controle de Peso do Gato? | /comedouro-automatico-gato-obeso/ |
| 2 | coleira-gps-para-pet | Coleira GPS para Cachorro de Pequeno Porte: O Que Considerar | /coleira-gps-cachorro-pequeno-porte/ |
| 3 | camera-para-monitorar-pet | Câmera Pet ou Coleira GPS: Qual Escolher para seu Pet? | /camera-pet-x-coleira-gps-qual-escolher/ |
| 4 | brinquedo-interativo-automatico-para-gato | Brinquedo Interativo para Gato: Pilha ou Recarregável? | /brinquedo-interativo-pilha-x-recarregavel/ |
| 5 | porta-eletronica-automatica-para-pet | Porta Eletrônica ou Alçapão Tradicional: Qual Escolher? | /porta-eletronica-x-alcapao-tradicional/ |

Nota de desenho: cada artigo tinha exatamente 1 peça de cada formato
disponível (reel, post, carousel, stories, engagement) — não havia 2 posts
por artigo no corpus atual. Optamos por 5 formatos x 5 artigos = 25 peças
exatas (em vez de forçar um 2º post artificial), preservando a meta de
~25 peças e a diversidade de cluster pedida.

---

## 3. As 25 peças

### Artigo 1 — Comedouro Automático x Controle de Peso

| ID | Formato | Score | Status | Hook | CTA |
|---|---|---|---|---|---|
| SPG-033 | post | 77 | PRONTO_PUBLICAR (revisão leve) | Gato come rápido demais? A liberação fracionada pode ajudar | Salva esse post pra não esquecer 📌 |
| SPG-011 | reel | 86 | PRONTO_PUBLICAR | Mais de 50% dos gatos estão acima do peso — o comedouro automático ajuda, mas não sozinho | Salva esse post pra não esquecer 📌 |
| SPG-094 | carousel | 60 | REVISAR | (5 slides: título + obesidade + o que o comedouro controla + porção + frequência) | Salva esse post pra não esquecer 📌 |
| SPG-148 | stories | 61 | REVISAR | O comedouro automático sozinho faz o gato emagrecer? (enquete) | Conta pra gente nos comentários 👇 |
| SPG-264 | engagement | 70 | PRONTO_PUBLICAR (revisão leve) | Qual o tamanho de porção ideal para programar no comedouro? | Conta pra gente nos comentários 👇 |

Mídia: `output_social_v2/posts/SPG-033/SPG-033.png`,
`reels/SPG-011/{SPG-011-capa.png, SPG-011.mp4}`,
`carrosseis/SPG-094/SPG-094-slide{1..5}.png`,
`stories/SPG-148/SPG-148-story{1,2}.png`,
`engagement/SPG-264/SPG-264.png`.

### Artigo 2 — Coleira GPS para Cachorro de Pequeno Porte

| ID | Formato | Score | Status | Hook | CTA |
|---|---|---|---|---|---|
| SPG-045 | post | 73 | PRONTO_PUBLICAR (revisão leve) | Dispositivo pesado demais? O próprio tutor acaba tirando a coleira | Salva esse post pra não esquecer 📌 |
| SPG-025 | reel | 73 | PRONTO_PUBLICAR (revisão leve) | Existem coleiras GPS de menos de 10 gramas — e isso importa mais do que parece | Salva esse post pra não esquecer 📌 |
| SPG-074 | carousel | 55 | REVISAR | (5 slides: título + peso + autonomia + case + conclusão) | Salva esse post pra não esquecer 📌 |
| SPG-158 | stories | 61 | REVISAR | (enquete sobre peso do dispositivo) | Conta pra gente nos comentários 👇 |
| SPG-274 | engagement | 70 | PRONTO_PUBLICAR (revisão leve) | Cães Pequenos Também Fogem — E Agora? | Conta pra gente nos comentários 👇 |

Mídia: `output_social_v2/posts/SPG-045/SPG-045.png`,
`reels/SPG-025/{SPG-025-capa.png, SPG-025.mp4}`,
`carrosseis/SPG-074/SPG-074-slide{1..5}.png`,
`stories/SPG-158/SPG-158-story{1,2}.png`,
`engagement/SPG-274/SPG-274.png`.

### Artigo 3 — Câmera Pet ou Coleira GPS

| ID | Formato | Score | Status | Hook | CTA |
|---|---|---|---|---|---|
| SPG-065 | post | 79 | PRONTO_PUBLICAR (revisão leve) | Câmera pet e coleira GPS não competem — resolvem problemas diferentes | Salva esse post pra não esquecer 📌 |
| SPG-055 | reel | 78 | PRONTO_PUBLICAR (revisão leve) | Câmera pet não ajuda em nada se o seu problema é cachorro que foge | Salva esse post pra não esquecer 📌 |
| SPG-168 | carousel | 60 | REVISAR | (5 slides comparando os dois produtos) | Salva esse post pra não esquecer 📌 |
| SPG-182 | stories | 46 | REVISAR | (enquete sobre qual produto o seguidor usa) | Conta pra gente nos comentários 👇 |
| SPG-303 | engagement | 61 | REVISAR | **Reformulado nesta fase** (ver §4): "Na sua casa quem vence: câmera pet ou coleira GPS? Manda a resposta nos comentários." | Conta pra gente nos comentários 👇 |

Mídia: `output_social_v2/posts/SPG-065/SPG-065.png`,
`reels/SPG-055/{SPG-055-capa.png, SPG-055.mp4}`,
`carrosseis/SPG-168/SPG-168-slide{1..5}.png`,
`stories/SPG-182/SPG-182-story{1,2}.png`,
`engagement/SPG-303/SPG-303.png`.

### Artigo 4 — Brinquedo Interativo: Pilha ou Recarregável

| ID | Formato | Score | Status | Hook | CTA |
|---|---|---|---|---|---|
| SPG-067 | post | 76 | PRONTO_PUBLICAR (revisão leve) | Bateria recarregável aguenta quantos usos? | Salva esse post pra não esquecer 📌 |
| SPG-048 | reel | 85 | PRONTO_PUBLICAR | Só 2% das pilhas comuns são recicladas no Brasil | Salva esse post pra não esquecer 📌 |
| SPG-164 | carousel | 60 | REVISAR | (5 slides pilha x recarregável) | Salva esse post pra não esquecer 📌 |
| SPG-239 | stories | 46 | REVISAR | (enquete pilha x recarregável) | Conta pra gente nos comentários 👇 |
| SPG-299 | engagement | 59 | REVISAR | **Reformulado nesta fase** (ver §4): "Time pilha ou time recarregável no brinquedo interativo do seu gato? Deixa aqui embaixo." | Conta pra gente nos comentários 👇 |

Mídia: `output_social_v2/posts/SPG-067/SPG-067.png`,
`reels/SPG-048/{SPG-048-capa.png, SPG-048.mp4}`,
`carrosseis/SPG-164/SPG-164-slide{1..5}.png`,
`stories/SPG-239/SPG-239-story{1,2}.png`,
`engagement/SPG-299/SPG-299.png`.

### Artigo 5 — Porta Eletrônica ou Alçapão Tradicional

| ID | Formato | Score | Status | Hook | CTA |
|---|---|---|---|---|---|
| SPG-062 | post | 90 | PRONTO_PUBLICAR | Quanto custa a diferença entre alçapão e porta eletrônica? | Salva esse post pra não esquecer 📌 |
| SPG-046 | reel | 78 | PRONTO_PUBLICAR (revisão leve) | Seu alçapão tradicional deixa entrar qualquer bicho do tamanho certo | Salva esse post pra não esquecer 📌 |
| SPG-161 | carousel | 60 | REVISAR | (5 slides alçapão x porta eletrônica) | Salva esse post pra não esquecer 📌 |
| SPG-191 | stories | 59 | REVISAR | (enquete sobre qual opção o seguidor usa) | Conta pra gente nos comentários 👇 |
| SPG-296 | engagement | 59 | REVISAR | Porta Eletrônica ou Alçapão Tradicional? Conta pra gente qual você usa. (mantido como referência-base — ver §4) | Conta pra gente nos comentários 👇 |

Mídia: `output_social_v2/posts/SPG-062/SPG-062.png`,
`reels/SPG-046/{SPG-046-capa.png, SPG-046.mp4}`,
`carrosseis/SPG-161/SPG-161-slide{1..5}.png`,
`stories/SPG-191/SPG-191-story{1,2}.png`,
`engagement/SPG-296/SPG-296.png`.

**Resumo de status do piloto:** 13 PRONTO_PUBLICAR (5 sem ressalva + 8 com
revisão leve recomendada) / 12 REVISAR. Isso é consistente com o corpus
completo — carrossel e stories tendem a REVISAR mais porque seus critérios
de "ADEQUACAO_FORMATO"/"CURIOSIDADE" penalizam hooks que ainda repetem o
título do artigo em vez de um gancho reescrito; é uma limitação real do
fato-do-corpo disponível para esses dois formatos, não um bug do piloto.

---

## 4. Repetition-detector: colisões e reformulação

Rodamos `repetition-detector.js` sobre as 25 peças isoladas e, para
contexto, sobre o corpus completo de 307. Dentro das 25, a maioria dos pares
sinalizados é o **CTA-template** ("Salva esse post..." / "Confira o guia
completo...") — isso é esperado por design (cota de distribuição de CTA por
família de objetivo) e é excluído do critério DIVERSIDADE do score.

O único padrão de colisão **criativa real** (hook/pergunta/ideia central)
encontrado: as 3 peças de `engagement` vindas de artigos `COMPARACAO`
("X ou Y?") usavam o mesmo template de pergunta: **"X ou Y? Conta pra gente
qual você usa."** — SPG-296 (porta eletrônica), SPG-299 (brinquedo) e
SPG-303 (câmera).

Ação tomada: mantivemos SPG-296 como referência (primeiro na ordem) e
reformulamos SPG-299 e SPG-303 preservando exatamente o mesmo fato de
origem — qual comparação o artigo faz — só variando a frase de conexão:

- SPG-303: *"Câmera Pet ou Coleira GPS? Conta pra gente qual você usa."* →
  *"Na sua casa quem vence: câmera pet ou coleira GPS? Manda a resposta nos
  comentários."*
- SPG-299: *"Brinquedo Interativo para Gato: Pilha ou Recarregável? Conta
  pra gente qual você usa."* → *"Time pilha ou time recarregável no
  brinquedo interativo do seu gato? Deixa aqui embaixo."*

Nenhum fato novo foi inventado — apenas a formulação da pergunta. Isso está
registrado em `.data/social-content-v2-export.json` (`OBSERVACAO` de cada
linha) e refletido em `legenda.txt`/`publicar.txt` das duas peças.

---

## 5. Antes (V1) x Depois (V2) — diagramação da arte

**V1 (`generate_assets.py`)**: banner com placa laranja inclinada
("sticker" de anúncio) contendo *3 blocos de texto*: (1) kicker em
letras espaçadas ("REEL · COMEDOUROS"), (2) o gancho, e no rodapé (3) selo
grande "SMART PET GADGETS" + linha CTA + domínio + **ID técnico da peça +
crédito da foto** ("PECA-014 · Foto: Pexels"). Lia como material de
produção interna vazando para o feed — a mistura de rótulo de formato,
cluster e ID técnico competia com o gancho e sinalizava "isto foi feito por
um sistema", quebrando a sensação de post nativo de uma página real.

**V2 (`generate_assets_v2.py`, esta fase)**: *um único bloco* — a placa com
o hook (+ complemento opcional) — sem kicker, sem nome de formato, sem ID.
A única assinatura de marca é uma linha pequena e discreta
("smartpetgadgets.com.br") no canto inferior, do tamanho de um rodapé de
Instagram, não de um selo de produção. O resultado lido a olho nu (ver
imagens geradas, ex. `SPG-011-capa.png`, `SPG-048-capa.png`) se aproxima
mais de um post editorial real do que de um banner de anúncio com etiqueta
de sistema.

---

## 6. Resultado dos testes

```
npm test  → 82/82 passando (14 test/v2/*.test.js + 68 test/*.test.js)
```

Ajustes feitos para o novo corte: `test/v2/repetition-and-score.test.js` e
`test/v2/export-v2.test.js` tiveram os asserts de limiar atualizados de 85
para 70 (mesma lógica de teste, novo valor calibrado).

Validação de integridade (`node src/index.js dry-run --pilot`, que roda a
checagem de hash de HTML e diff de `affiliate-products.json` reaproveitada
do V1):

```
[OK] affiliate-products.json não foi alterado
[OK] Nenhum index.html de artigo foi alterado
```

Confirmado também via `git diff --stat` direto: nenhuma alteração em
`*.html`, `sitemap.xml` ou `.data/affiliate-products.json` nesta sessão.
Nenhum `git add`/`commit`/`push` foi executado.

---

## 7. Teste do scroll — autoavaliação honesta

Pergunta aplicada: *"Se eu estivesse rolando o Facebook e visse esta
publicação de uma página que não conheço, eu pararia para olhar?"*

**SPG-011 (reel, comedouro) — "Mais de 50% dos gatos estão acima do peso —
o comedouro automático ajuda, mas não sozinho".**
Sim, pararia. Número chocante + foto real de gato comendo + a segunda parte
do hook ("mas não sozinho") cria tensão/curiosidade em vez de parecer
propaganda direta de produto. É o mais forte dos 5 (score 86, o único sem
ressalva de revisão).

**SPG-045 (post, coleira GPS) — "Dispositivo pesado demais? O próprio tutor
acaba tirando a coleira".**
Provavelmente sim, mas com menos certeza. O hook é relevante para quem tem
cachorro pequeno, mas a foto de fundo (pessoa e cachorro na calçada,
enquadramento distante) não mostra claramente o problema — não há close no
"peso do dispositivo". Funcionaria melhor com uma foto mais específica de
coleira GPS. Score 73, com revisão leve recomendada — concordo com essa
marcação.

**SPG-065 (post, câmera x coleira GPS) — "Câmera pet e coleira GPS não
competem — resolvem problemas diferentes".**
Honestamente, não tenho certeza que pararia no primeiro segundo — é um hook
mais "explicativo" que "chocante", sem número ou tensão imediata. Ele educa
bem, mas compete pior por atenção nos primeiros 0,5s de scroll do que
SPG-011 ou SPG-048. A foto (cachorro cheirando um teclado) também não
comunica "câmera" à primeira vista — resquício do bug de cluster que
corrigimos, mitigado mas não perfeito mesmo depois do fix.

**SPG-048 (reel, brinquedo pilha x recarregável) — "Só 2% das pilhas comuns
são recicladas no Brasil".**
Sim, pararia — estatística ambiental inesperada, fora do nicho pet
imediato, e a foto (cachorro feliz recebendo carinho) contrasta bem com a
seriedade do dado. Esse tipo de gancho "cruza nicho" (meio-ambiente +
pet-tech) tem potencial real de compartilhamento. Score 85, quase no topo.

**SPG-062 (post, porta eletrônica) — "Quanto custa a diferença entre
alçapão e porta eletrônica?"**
Sim — pergunta de decisão de compra bem direta, close no rosto do gato
(alta qualidade visual), e "quanto custa" é um gatilho de curiosidade
confiável para quem já está pesquisando o produto. É o score mais alto do
lote (90) e, na minha leitura, o hook mais "vendável" sem parecer
propaganda.

**Veredito consolidado**: 4 das 5 peças analisadas (SPG-011, SPG-045,
SPG-048, SPG-062) passariam razoavelmente bem no teste do scroll; SPG-065
é a mais fraca do grupo — não por causa da nova diagramação (que está limpa
nas 5), mas porque o *hook* em si é mais didático que instigante e a foto
de fundo não reforça o tema "câmera". Ficaria REVISAR/reforço editorial
antes de publicar, mesmo estando com score PRONTO_PUBLICAR (79, revisão
leve). Isso é consistente com a marcação `revisao_leve` do próprio motor —
o sistema já sinaliza para olhar de novo peças nessa faixa 70-84 antes de
publicar, e a leitura manual confirma que a marcação faz sentido.

Peças `carousel`/`stories` (REVISAR nesta fase, scores 46-61) não foram
incluídas no teste do scroll de propósito — elas dependem mais de
visualização em sequência (deslizar/toque) do que do primeiro frame
estático, e o próprio motor já as sinaliza como precisando de revisão antes
de publicar.

---

## 8. Limitações conhecidas e ficam para FASE 4

- Carrossel e Stories seguem estruturalmente mais fracos no score porque o
  hook exportado cai no fallback do título do artigo (carousel) ou fica
  vazio (stories usa `pergunta`), não porque a arte física esteja ruim —
  vale revisar `enrichment.js`/`export-v2.js` para popular um `HOOK` mais
  forte nesses dois formatos antes da escala.
- O cluster "porta-eletronica-automatica-para-pet" reaproveita fotos do
  pool "geral" (não há foto Pexels dedicada de porta/alçapão no cache
  atual) — aceitável para o piloto, mas vale curar 1-2 fotos específicas
  antes da FASE 4.
- Este relatório cobre só as 25 peças do piloto; as ~280 peças restantes do
  corpus de 307 continuam com mídia **planejada** (não física) até nova
  autorização explícita para a FASE 4.

---

## 9. Artefatos desta fase

- `tools/social-content-engine/src/v2/score.js` — corte 70 + `revisao_leve`.
- `tools/social-content-engine/generate_assets_v2.py` — motor gráfico V2.
- `tools/social-content-engine/apply_fase3_media_paths.py` — grava caminho
  de mídia real no export/planilha para as peças do piloto.
- `.data/social-content-v2-export.json` — atualizado (307 linhas
  recalculadas com corte 70; 25 linhas do piloto com `ARQUIVO_MIDIA`,
  `ARQUIVO_MIDIA_VIDEO`, `ARQUIVOS_MIDIA_TODOS`, `ARQUIVO_EXISTE: true`).
- `reports/social-content/social_content_v2.xlsx` — regerado.
- `output_social_v2/{posts,reels,carrosseis,stories,engagement}/SPG-NNN/` —
  25 pastas com mídia física (50 PNG + 5 MP4) + `legenda.txt` +
  `publicar.txt` atualizados.
- `output_social_v2/fase3-piloto-media-manifest.json` — manifesto das 25
  peças geradas nesta fase.
