# Diagnóstico de CTR — smartpetgadgets.com.br (2026-11-17)

Fonte: Search Console API (web). Período atual 2026-10-18..11-14 (28d) vs anterior 2026-09-20..10-17.

## 1. O CTR não está caindo — está estável e subindo levemente

| Período | Cliques | Impressões | CTR | Posição |
|---|---|---|---|---|
| 09-20..10-17 | 29 | 2.543 | 1,14% | — |
| 10-18..11-14 | 63 | 5.175 | 1,22% | ~9 |

Por semana: 1,0–1,4% desde outubro; semana de 11-09 = 24 cliques / 1.659 impr (1,45%), a melhor até agora.
Cliques cresceram 2,2x, impressões 2x. A sensação de "muita impressão, pouco clique" vem da **posição média ~9**, não de queda.

## 2. Por que o CTR é baixo (causas estruturais)

| Faixa de posição (por página) | Impr | Cliques | CTR |
|---|---|---|---|
| ≤ 5 | 632 | 24 | 3,8% |
| 5–10 | 3.208 | 33 | 1,0% |
| 10–20 | 1.092 | 5 | 0,5% |
| 20+ | 243 | 1 | 0,4% |

- **62% das impressões estão no fim da página 1 (pos. 5–10).** Ali, no mobile BR, o resultado fica abaixo de anúncios, Shopping, "Perguntas relacionadas" e muitas vezes AI Overview.
- **Desktop: 1.200 impressões em posição 16,6** (página 2). Quase nenhum clique possível. Mobile: pos. 7,0, CTR 1,22%.
- **86% das impressões vêm de consultas anônimas/cauda longa** (só 706 de 5.175 aparecem por query). As impressões se espalham por 79 páginas, cada uma com pouco volume.
- **Impressão sem intenção:** consultas em inglês sem relação ("pet camera vs graphics card", "neutrogena pet camera review") e head terms em que o site não compete ("melhor ração para cachorro", pos. 9–10, 0 cliques; "credeli ou simparic", pos. 28–33).
- Pelo benchmark de CTR por posição, o esperado seria ~120 cliques; o site tem 63. Metade do gap fica em 4–5 páginas (abaixo).

## 3. Onde estão os cliques perdidos (atual, 28d)

| Página | Impr | Cliq | Pos | Leitura |
|---|---|---|---|---|
| /bebedouro-inox-x-ceramica/ | 512 | 6 | 6,3 | Maior gap. Aparece para "fonte de água para gato", "bebedouro gato" etc., mas o título fala só de material. Canibaliza com /melhor-bebedouro-automatico-pet/ (já reescrito 11-14). |
| /configurar-app-comedouro-wifi/ | 538 | 22 | 4,3 | Bom (4,1%). Referência do que funciona: resposta direta + intenção de tutorial. |
| /comedouro-automatico-para-dois-gatos/ | 194 | 2 | 6,2 | Título "Como Evitar Briga" pode não casar com quem busca o produto ("comedouro automático 2 gatos"). |
| /melhor-racao-para-cachorro/ | 242 | 0 | 10,3 | Head term disputado com marcas e grandes portais. Problema de posição, não de snippet. |
| /melhor-antipulgas-para-cachorro/ | 185 | 0 | 15,6 | "credeli ou simparic/nexgard" em pos. ~30: falta a seção comparativa (P3, ainda pendente). |
| /comedouro-vdrbg-4l-wifi-review/ | 106 | 1 | 5,7 | Query de marca "vdrbg" em pos. 4,1 sem clique: talvez a loja/ML esteja acima. |
| /camera-pet-resolucao-1080p-x-2k/ | 78 | 0 | 9,3 | Quase tudo é consulta em inglês sem relação. Ignorar. |

## 4. A reescrita P1 (11-05) já dá sinal

15 páginas P1, janelas de 10 dias com a mesma posição (~7,7):
- antes (10-26..11-04): 1 clique / 354 impr = **0,28%**
- depois (11-06..11-15): 6 cliques / 497 impr = **1,21%**
- demais páginas no mesmo intervalo: 1,06% → 1,35%

Amostra pequena, mas na direção certa. As reescritas de 11-14/11-15 (Seresto, brinquedo, bebedouro, comedouro hub, câmera petisco) ainda não têm dados.

## 5. O que fazer (em ordem)

1. **Não reescrever de novo o que mudou depois de 11-05 antes de ~12-01.** Mudar de novo zera a medição.
2. **/bebedouro-inox-x-ceramica/** (maior gap): definir se ela é sobre material ou sobre "fonte/bebedouro para gato". Pôr a resposta no título (ex.: "Inox, Cerâmica ou Plástico? O Mais Higiênico p/ Gato") e direcionar a intenção "fonte de água" para /melhor-bebedouro-automatico-pet/ com link interno. Assim a canibalização de 11-14 se resolve junto.
3. **/comedouro-automatico-para-dois-gatos/**: título com intenção de compra + solução ("Comedouro Automático para 2 Gatos: Modelos com Chip e Duplo").
4. **Antipulgas: seção Credeli x Simparic x NexGard** (P3 pendente). É o único lugar com demanda real de query visível na página 3.
5. **Posição > snippet:** passar páginas de pos. 6–9 para 3–5 rende ~4x o CTR. Isso exige links internos dos hubs + backlinks, e não mais um ajuste de título.
6. Ignorar como KPI: impressões desktop (pos. 16) e as consultas em inglês da página de resolução de câmera.

## Limitações
- Os SERPs não foram vistos (AI Overview, Shopping, anúncios), então o efeito deles no CTR é uma hipótese.
- O ledger de atualizações do Google está desatualizado (50 dias); nada foi atribuído a core updates.
- Esta não é a auditoria completa do site (a de /smartpetgadgets.com.br-audit/ é anterior). É só o diagnóstico de CTR.
