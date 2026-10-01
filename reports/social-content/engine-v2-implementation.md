# Social Content Engine V2 — FASE 2 (infraestrutura do engine)

Gerado em: 2026-09-05
**Escopo real desta sessão:** construir a infraestrutura de enrichment/score/CTA/mídia/calendário/export do pipeline V2 e rodá-la sobre as 307 peças V2 "fato-do-corpo" já aprovadas (63 artigos). **Não foi gerada nenhuma imagem/vídeo novo, nenhum HTML/afiliado/sitemap foi tocado, nenhum commit/push foi feito.**

## 1. O que foi construído

Todos os arquivos abaixo são NOVOS, paralelos ao V1 (nenhum arquivo do V1 listado nas regras duras foi modificado):

| Arquivo | Função |
|---|---|
| `tools/social-content-engine/src/v2/collect-source.js` | Materializa em memória e persiste (`.data/social-content-v2-source.json`) as 307 peças V2 reais + 5 artigos stub, lendo os 6 scripts V1 existentes (`generate-v2-calibration(2).js`, `generate-v2-piloto.js`, `generate-escala-lote1..4.js`) via `require()`/`run()` — nenhum deles escreve arquivo, só retornam dados em memória. |
| `tools/social-content-engine/src/v2/enrichment.js` | Classifica cada peça em 1 dos 16 TIPOS por regras determinísticas (documentadas no topo do arquivo, ordem de prioridade explícita). |
| `tools/social-content-engine/src/v2/cta-rules.js` | Aplica a cota agregada de objetivo/CTA (40/20/15/10/10/5%) com rebalanceamento determinístico do excedente da cota de link. |
| `tools/social-content-engine/src/v2/repetition-detector.js` | Estende `similarity.js` (`tools/shared/terms.js` + `semantic-terms.js`) para comparar hook, pergunta-gancho, CTA e ideia central entre todas as peças do lote (limiar configurável, default 0.6). |
| `tools/social-content-engine/src/v2/score.js` | Score 0-100 (11 critérios documentados), status PRONTO_PUBLICAR (≥85) / REVISAR. |
| `tools/social-content-engine/src/v2/media-planner.js` | Decide REAPROVEITAR/REGENERAR e caminho planejado de mídia por peça (não gera arquivo). |
| `tools/social-content-engine/src/v2/calendar.js` | Distribui as peças em datas úteis a partir da próxima segunda-feira, sem 2 peças seguidas do mesmo artigo nem do mesmo TIPO. |
| `tools/social-content-engine/src/v2/export-v2.js` | Orquestrador (`--dry-run` / real), escreve `.data/social-content-v2-export.json`, chama o exportador Python e escreve `output_social_v2/`. |
| `tools/social-content-engine/export_xlsx_v2.py` | Lê o JSON de export e escreve `reports/social-content/social_content_v2.xlsx` (abas PECAS e CALENDARIO). |
| `tools/social-content-engine/test/v2/export-v2.test.js` | 8 testes de integração do pipeline completo. |
| `tools/social-content-engine/test/v2/repetition-and-score.test.js` | 6 testes unitários de repetition-detector/score/enrichment. |
| `output_social_v2/{posts,reels,carrosseis,stories,engagement,calendario,legendas,publicacao}/SPG-NNN/{legenda.txt,publicar.txt}` + `README.md` | Árvore de saída, 307 pastas. |
| `.data/social-content-v2-source.json` | Snapshot materializado das 307 peças-fonte + 5 stub (novo). |
| `.data/social-content-v2-export.json` | Export final enriquecido (novo). |
| `reports/social-content/social_content_v2.xlsx` | Planilha nova (não sobrescreve `313_pecas_smart_pet_gadgets.xlsx`). |

Ambiente Python: `openpyxl` não estava instalado e não havia `pip` disponível no ambiente base — resolvido criando um virtualenv local em `tools/social-content-engine/.venv_xlsx/` (adicionado ao `.gitignore`) só para rodar o exportador xlsx. `export-v2.js` usa esse Python automaticamente se existir, com fallback para `python3` do sistema; se nenhum tiver `openpyxl`, o pipeline principal não trava — só reporta a falha do xlsx.

## 2. Decisões de design importantes (para validar com o dono do produto antes da FASE 3)

1. **Fonte real das 307 peças**: não existia nenhum JSON único com as 307 peças — elas só existiam como retorno em memória de 6 scripts V1 (`generate-v2-*.js`). `collect-source.js` é a primeira materialização real desse conjunto. Confirmado por execução real: **307 peças "generated" + 63 "insufficient_source"** (peças deliberadamente não geradas por falta de material real, cada uma com motivo documentado) — os números batem exatamente com `reports/social-content/social-content-audit-v2.md`.
2. **Média por formato**: reel 63, post 63, carousel 57, stories 88, engagement 36 (total 307). Nem todo artigo tem os 5 formatos — carousel/engagement ficam abaixo de 63 porque `insufficient_source` foi mais comum nesses formatos.
3. **Distribuição de CTA obtida**: `{ educacao: 56.7%, interacao: 29.3%, curiosidade: 9.1%, trafego_com_link: 4.9%, entretenimento: 0%, autoridade: 0% }` — bem distante do alvo (`40/20/15/10/10/5`). Causa raiz: a classificação por TIPO (enrichment.js), aplicada ao texto real das 307 peças, nunca produziu os TIPOS que mapeiam para `entretenimento` (IDENTIFICACAO_PET, HUMOR_LEVE) nem `autoridade` (AUTORIDADE) — o conteúdo fato-do-corpo é majoritariamente educativo/comparativo, não há "reviews"/menções de teste nem linguagem de humor/identificação de pet no corpus atual. **Isto é um achado real sobre o conteúdo-fonte, não um bug do classificador** — precisa de validação humana: ou (a) o mix de TIPOS na próxima leva de copy precisa incluir mais ângulos de humor/autoridade, ou (b) a distribuição-alvo 40/20/15/10/10/5 precisa ser revista para refletir o que o corpus real produz.
4. **Score médio ficou baixo (score médio ~66/100, só 9/307 = 2.9% PRONTO_PUBLICAR)**. Os critérios mais penalizados na média foram CURIOSIDADE (0.38/9.09) e HOOK (4.2/9.09) — a maioria dos hooks é declarativa/informativa (fato do corpo do artigo), não pergunta/curiosidade. Isso é uma leitura honesta da heurística aplicada ao conteúdo real, não um ajuste forçado para "passar". **Precisa de validação do dono do produto**: ou o bar de 85 é alto demais para este tipo de copy educativo, ou boa parte das 307 peças realmente precisa de reescrita de hook antes de publicar (recomendação: revisar a amostra de REVISAR com score entre 70-84, que provavelmente só precisa de ajuste leve no hook).
5. **Repetição sinalizada em 204 pares** — threshold 0.6 aplicado sobre vocabulário de nicho compartilhado (ex: "comedouro automático", "coleira gps") gera bastante sobreposição real entre artigos do mesmo cluster. O campo CTA foi **excluído do cálculo de DIVERSIDADE** (mas mantido no relatório de pares) porque o CTA é intencionalmente templado por família de objetivo (cta-rules.js) — comparar CTA ali geraria falso-positivo em massa. Decisão a validar: o threshold 0.6 pode estar generoso demais para um nicho com vocabulário técnico limitado; considerar comparar apenas os termos de maior peso semântico (já é o que `weightedOverlapCoefficient` faz) ou subir o limiar para ~0.7-0.75 antes da FASE 3.
6. **Media-planner**: decisão adotada foi **REGENERAR 100% das 307 peças** (nenhuma REAPROVEITAR), porque (a) o gerador V1 escolhe a foto-base por hash Python não determinístico entre execuções — não existe crosswalk confiável PECA-NNN → foto-base para reconstruir, e (b) o hook V2 é reescrito a partir do corpo do artigo e por isso quase sempre difere do texto já cravado no PNG V1. Isso está alinhado com a própria recomendação do relatório de auditoria (seção 6). A foto-base Pexels (cluster) É reaproveitada — só o overlay de texto muda.
7. **STUB_PENDENTE**: os 5 artigos `comedouro-cachorro`, `comedouro-newpet-2l-review`, `comedouro-newpet-4l-review`, `comedouro-vdrbg-4l-wifi-review`, `comedouro-x-bebedouro-automatico` foram marcados `STUB_PENDENTE` e excluídos do pipeline de enrichment/score/export, conforme instruído — nenhuma copy nova foi inventada para eles.

## 3. Resultado dos testes

```
npm test  (tools/social-content-engine/)
# tests 82
# pass 82
# fail 0
```
82 = 68 testes V1 (intocados) + 14 testes novos da FASE 2 (`test/v2/export-v2.test.js`: 8, `test/v2/repetition-and-score.test.js`: 6). Cobertura conforme pedido: IDs únicos, nenhuma URL fora do site-index, nenhum campo obrigatório vazio, nenhuma peça abaixo de score 85 marcada PRONTO_PUBLICAR, todo ARQUIVO_MIDIA dentro da convenção planejada (nenhum caminho fantasioso), cota de CTA com link dentro de faixa razoável, stubs de comedouro fora da fila, e testes unitários de repetition-detector/score/enrichment.

## 4. Contagem final de peças por STATUS

| STATUS | Peças | % |
|---|---:|---:|
| PRONTO_PUBLICAR | 9 | 2.9% |
| REVISAR | 298 | 97.1% |
| **Total exportado** | **307** | 100% |
| STUB_PENDENTE (fora do pipeline) | 5 artigos (0 peças, sem copy) | — |

## 5. Limitações e divergências em relação à premissa da tarefa

- **307 peças confere exatamente** com o número citado na tarefa e no `social-content-audit-v2.md` — nenhuma divergência aqui.
- **Distribuição de CTA e score médio divergem bastante do alvo** — ver seção 2, itens 3 e 4. Recomendo revisão humana antes de tratar os números de PRONTO_PUBLICAR como decisão final.
- **`openpyxl`/`pip` não vinham instalados no ambiente** — contornado com virtualenv local (`tools/social-content-engine/.venv_xlsx/`, ignorado no git). Se o ambiente de produção não tiver Python com `openpyxl` disponível, o xlsx falha graciosamente (pipeline principal não trava) e isso fica registrado no console (`xlsxResult.ok === false`).
- **Media-planner não tem crosswalk peça-a-peça com a classificação A/B/C/D do relatório de auditoria** — decisão foi REGENERAR tudo, com motivo documentado (ver seção 2, item 6), não uma correspondência 1:1 pedida originalmente (que se mostrou impossível de reconstruir por causa do hash não determinístico do gerador V1).

## 6. O QUE FALTA (NÃO executado nesta sessão)

### FASE 3 — piloto real (NÃO executada)
- Escolher 5 artigos reais (sugestão: os 5 com maior score médio, e/ou 1 por cluster) e gerar de fato a mídia (Pillow/moviepy, adaptando `generate_assets.py` para ler o novo overlay "só HOOK + complemento, sem número de peça/kicker/nome de formato").
- Validar visualmente as artes geradas.
- Publicar manualmente (ou via ferramenta de agendamento) essas 5 peças reais na página do Facebook (@smartpetgadgetsbr, já ativa) e medir engajamento real antes de escalar.
- Rodar os 5 artigos "comedouro-*" pendentes pelo pipeline de escrita V2 fato-do-corpo (fechar 68/68), removendo o STUB_PENDENTE.

### FASE 4 — geração completa (NÃO executada)
- Gerar as ~298 imagens/vídeos restantes (307 − 5 do piloto) só depois de validar a FASE 3.
- Reavaliar threshold de score/CTA/repetição com base no aprendizado da FASE 3 antes de aplicar em escala.
- Conectar ao calendário de publicação real (ferramenta de agendamento do Facebook/Instagram).

**Nada da FASE 3 ou FASE 4 foi executado nesta sessão** — apenas a infraestrutura determinística (classificação, score, CTA, plano de mídia, calendário e export) foi construída e rodada sobre os dados já existentes.
