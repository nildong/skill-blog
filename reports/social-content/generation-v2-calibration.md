# Social Content Engine — Calibração V2 (6 peças, quality gate novo)

Gerado em: 2026-09-01

**Status:** validação de calibração, autorizada explicitamente para esta amostra. **Não aplicado às 76 peças do piloto. Não escala para os ~62 artigos restantes.** Nenhum HTML, imagem, link de afiliado ou sitemap foi alterado — verificado automaticamente por hash antes/depois (`htmlUnchanged: true`, `affiliateUnchanged: true`).

## O que mudou nesta etapa (infraestrutura V2)

| Arquivo | Status |
|---|---|
| `src/analyze-article.js` | **intocado** |
| `src/similarity.js` | **intocado** |
| `src/content-templates.js` (gerador V1) | **intocado** — as 76 peças do piloto V1 continuam válidas como estão |
| `src/quality-gate.js` (gate V1) | só ganhou `module.exports` extras (helpers reaproveitados); zero mudança de comportamento — 52 testes V1 originais continuam passando |
| `src/quality-gate-v2.js` | **novo** — gate adicional que exige `piece.source` explícito e verifica `source_excerpt` por substring literal em `body_text_full` |
| `src/calibration-v2-data.js` | **novo** — as 6 peças desta calibração, escritas a partir da leitura do artigo completo |
| `src/generate-v2-calibration.js` | **novo** — script que roda a calibração e confirma não-alteração de HTML/afiliados |
| `test/quality-gate-v2.test.js` | **novo** — 9 testes (source ausente, excerpt inventado, slug trocado, source_type inválido, preço bloqueado mesmo com source válido, overlap não-bloqueante, etc.) |

**Testes executados:** `npm test` → 61/61 passando (52 originais + 9 novos), 0 falhas.

## O que muda na regra de rastreabilidade

**V1:** hook/legenda precisa ter ≥40% de overlap de vocabulário com title, meta_description ou algum heading.

**V2:** cada peça declara `source = { article_slug, source_type, source_excerpt, section }`. O gate verifica, de forma determinística:
1. `article_slug` bate com o artigo sendo processado.
2. `source_type` é um valor permitido (`body_fact`, `heading`, `faq_question`, `title`, `meta_description`).
3. `source_excerpt` existe **literalmente** (substring, após normalização de aspas/espaços) em `article.body_text_full`.

Se o trecho declarado não existir no artigo, a peça falha o gate — não é uma estimativa de plausibilidade, é uma prova de que a frase está lá. O overlap lexical do V1 continua calculado, mas agora é **informativo, não bloqueante** — vira só um sinal extra no relatório.

## Resultado: 6/6 peças aprovadas

| Peça | Status | Fonte declarada | Excerpt verificado | Overlap (informativo) |
|---|---|---|---|---|
| comedouro-gato-x-cachorro-diferenca — Reel V2 | ✅ generated | body_fact / "Formato do Pote e Altura do Comedouro" | ✅ | 80% |
| comedouro-gato-x-cachorro-diferenca — Post V2 | ✅ generated | body_fact / "Casas com Gato e Cachorro Juntos" | ✅ | 100% |
| duvidas-camera-para-monitorar-pet — Reel V2 | ✅ generated | body_fact / "A câmera pet funciona em qualquer rede Wi-Fi?" | ✅ | 70% |
| duvidas-camera-para-monitorar-pet — Post V2 | ✅ generated | body_fact / "Câmera para pet precisa de internet para funcionar?" | ✅ | 74% |
| tapete-higienico-para-cachorro — Reel V2 | ✅ generated | body_fact / "Antivazamento e controle de odor: até que ponto funciona?" | ✅ | 86% |
| tapete-higienico-para-cachorro — Post V2 | ✅ generated | body_fact / "Resumo rápido" (dado IBGE) | ✅ | 83% |

Nenhuma peça caiu em `needs_review`. Nenhum preço, placeholder ou produto inventado em nenhuma delas.

## V1 vs V2, lado a lado (com justificativa editorial)

### 1. comedouro-gato-x-cachorro-diferenca (COMPARISON)

**Reel V1:** "Comedouro e Bebedouro: a Mesma Lógica de Espécie se Aplica?" → narração é recorte de heading + meta_description, soa como leitura de sumário.
**Reel V2:** "Seu gato recusa comida em pote fundo? Pode não ser frescura." → explica um comportamento real que o tutor já observou, usando o fato de "fadiga de bigode" — específico, verificável, não estava em nenhum heading.
**Por quê:** o heading mais forte do artigo para gerar curiosidade não é necessariamente o mais alto na página nem o que sobrou de "próximo heading disponível" — é o que responde uma dúvida real de quem tem o problema.

**Post V1:** resumo genérico da meta_description + "Neste guia: O Que Muda na Prática" (heading vago).
**Post V2:** abre com o risco real mais citado no artigo (cão comer a porção do gato) e fecha com 3 ganchos concretos do que tem no link.
**Por quê:** dá valor imediato (retenção) sem esvaziar o motivo de clicar.

### 2. duvidas-camera-para-monitorar-pet (FAQ)

**Reel V1:** repete a pergunta do heading + meta_description genérica — zero informação nova até o clique.
**Reel V2:** "O erro de configuração mais comum em câmera pet: gente conecta na rede errada" → usa o fato específico (banda 2,4GHz vs 5GHz) que resolve a maior causa de reclamação do produto.
**Por quê:** transforma uma pergunta de FAQ genérica ("funciona sem Wi-Fi?") num gancho de solução de problema real.

**Post V1:** "Você sabia? Câmera para pet precisa de internet para funcionar? A resposta está no artigo completo." — fórmula que se repete peça a peça.
**Post V2:** entrega a resposta certa no próprio post (grava sem internet, mas perde só live/notificação/nuvem) e ainda assim mantém teaser pro link.
**Por quê:** honestidade editorial (não força clique escondendo a resposta) tende a gerar mais salvamento/compartilhamento que "clickbait" de FAQ.

### 3. tapete-higienico-para-cachorro (REVIEW)

**Reel V1:** "O que é o tapete higiênico Bamboo.dry Nekko?" — descreve o produto, não convence de nada.
**Reel V2:** "Carvão de bambu no tapete higiênico funciona mesmo, ou é só marketing?" → usa a fonte técnica citada no próprio artigo (UFRGS) pra responder a uma objeção real de compra.
**Por quê:** em REVIEW, a hierarquia pedida é clara — fato > interpretação > copy. Este gancho é sustentado por uma fonte terceira já citada no artigo, não por opinião.

**Post V1:** resumo genérico da meta_description.
**Post V2:** abre com o dado do Censo IBGE (12,5% mora em apartamento) pra contextualizar por que o produto importa, antes de descrever o que foi avaliado — e termina admitindo a limitação (não indicado pra todo porte), reforçando credibilidade em vez de propaganda.

## Garantias mantidas (nenhuma mudou)

- `htmlUnchanged: true` — nenhum `index.html` foi lido para escrita, só leitura.
- `affiliateUnchanged: true` — `affiliate-products.json` byte a byte idêntico.
- Nenhum arquivo `.data/social-content/{slug}.json` do piloto V1 foi sobrescrito — a calibração grava só nos arquivos novos `-v2-calibration` e neste relatório.
- Nenhuma publicação, fila editorial ou commit/push/deploy nesta etapa.

## Não escalado (aguardando autorização, por decisão explícita do usuário)

- **Não aplicado ainda** às 76 peças do piloto (10 artigos) — só a amostra de 3 artigos / 6 peças.
- **Não expandido** para os ~62 artigos restantes do site.
- **Não implementada** a lógica de seleção de formato por artigo (nem todo artigo precisa gerar os 8 formatos) — próximo passo depois de aprovação desta calibração.
- **Não implementada** a regra de espaçamento de publicação entre artigos com `similarity_warning` alto — `similarity.js` já produz o dado; falta a regra de agendamento em cima dele.

## Próximo passo (aguardando decisão do usuário)

Se esta calibração for aprovada:
1. Generalizar a leitura de `body_text_full` + escolha de fato mais forte para os 10 artigos completos do piloto (76 peças), com `source` explícito em cada uma.
2. Implementar seleção de formato por artigo (não forçar 8 peças sempre).
3. Implementar regra de espaçamento de publicação baseada em `similarity_warning`.
4. Rodar novo relatório completo de 76 peças para validação final.
5. Só então: autorização para os ~62 artigos restantes.
