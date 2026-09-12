# Revisão de Saúde do Blog — smartpetgadgets.com.br

**Data:** 2026-09-12
**Motivo:** verificação pós-atualização do Claude Blog para v2.2.0
**Escopo:** 73 posts publicados

## Resumo executivo

Auditoria completa (SEO técnico, canibalização, link interno, profundidade de
conteúdo) rodada com as ferramentas locais do projeto (`site-indexer`,
`seo-auditor`, `cannibalization`, `internal-linking`). Nenhum problema crítico
encontrado. Quatro frentes de melhoria (P0-P3) identificadas e as três
acionáveis já aplicadas.

| Métrica | Antes | Depois |
|---|---|---|
| Páginas auditadas | 73 | 73 |
| SEO Critical / Errors | 0 / 0 | 0 / 0 |
| SEO Warnings | 1 (falso positivo) | 1 (mesmo, documentado) |
| SEO Info (oportunidades) | 60 | 48 |
| Links internos | 1.106 | 1.126 |
| Canibalização HIGH | 0 | 0 |
| Canibalização POSSIBLE | 103 | 103 (2 pares revisados manualmente) |
| Páginas órfãs | 0 | 0 |
| Posts com <400 palavras | 11 | 0 |

## P0 — Warning de FAQ na home (investigado, não aplicado)

O SEO Auditor sinalizou `FAQ_HEADING_WITHOUT_SCHEMA` na home (`/`). Investigação
manual mostrou que é **falso positivo**: os headings `<h3>` da home são títulos
de cards de listagem que linkam para posts com FAQ real (`duvidas-coleira-gps-pet`,
`duvidas-camera-para-monitorar-pet`, etc.), não uma seção de perguntas e
respostas na própria home. Adicionar `FAQPage` schema ali seria structured data
inválido (sem conteúdo Q&A real por trás). **Nenhuma alteração aplicada** —
é a limitação heurística já documentada no README do `seo-auditor`.

## P1 — Link interno (aplicado)

189 sugestões geradas pelo `internal-linking`; as 20 de maior score foram
aplicadas manualmente como parágrafos contextuais (mantendo o texto e a
estrutura original de cada artigo):

- `coleira-gps-para-pet` (2 links) → `como-funciona-coleira-gps-cachorro`, `camera-pet-x-coleira-gps-qual-escolher`
- `erros-comuns-porta-eletronica-pet` → `como-instalar-porta-eletronica-pet`
- `porta-eletronica-automatica-para-pet` → `erros-comuns-porta-eletronica-pet`
- `comedouro-automatico-para-pet` (4 links) → `melhor-comedouro-interativo-gato`, `comedouro-newpet-2l/4l-review`, `comedouro-automatico-faz-mal`, `comedouro-x-bebedouro-automatico`
- `melhor-comedouro-interativo-gato` → `comedouro-automatico-para-pet`
- `brinquedo-interativo-automatico-para-gato` → `brinquedo-interativo-substitui-brincadeira-tutor`
- `camera-pet-x-coleira-gps-qual-escolher` ↔ `coleira-gps-x-microchip` (mútuo)
- `comedouro-newpet-4l-review` → `comedouro-newpet-2l-review`
- `comedouro-vdrbg-4l-wifi-review` (2 links) → `comedouro-com-ou-sem-wifi`, `comedouro-automatico-vale-a-pena`
- `configurar-app-comedouro-wifi` → `comedouro-com-ou-sem-wifi`
- `brinquedo-interativo-gato-idoso-vale-a-pena` → `duvidas-brinquedo-interativo-gato`
- `comedouro-automatico-vale-a-pena` → `comedouro-vdrbg-4l-wifi-review`
- `brinquedo-interativo-pilha-x-recarregavel` → `duvidas-brinquedo-interativo-gato`

Resultado: +20 links internos confirmados pelo `site-indexer` (1.106 → 1.126),
zero erros novos.

## P2 — Canibalização (revisado, sem alteração necessária)

Dois pares de maior score revisados manualmente:

1. **`comedouro-newpet-2l-review` ↔ `comedouro-newpet-4l-review` (65/100)** —
   já bem diferenciados: título/H1 exclusivo por capacidade, seções cruzadas
   de comparação ("Vale a Pena Pagar Mais?"), público-alvo explícito e
   links mútuos. Overlap esperado por serem reviews de variantes do mesmo
   produto. Sem ação.
2. **`comedouro-gato-x-cachorro-diferenca` ↔ `porta-eletronica-gato-x-cachorro-diferenca` (61/100)** —
   produtos completamente diferentes (comedouro x porta eletrônica); o score
   alto vem só do padrão de título compartilhado ("X para Gato x Cachorro:
   Qual a Diferença?"), não de competição real de intenção de busca. Sem ação.

Ambos os casos confirmam que o classificador está funcionando como esperado
(sinal a revisar, não veredito) e que nenhum caso HIGH existe no site.

## P3 — Profundidade de conteúdo (aplicado)

11 posts estavam na faixa de 300-400 palavras (`CONTENT_BRIEF`, severidade
INFO). Adicionada uma seção nova por post (60-100 palavras, sem estatística
fabricada, no mesmo tom objetivo do site) tratando de uma dúvida prática
ainda não coberta:

| Post | Seção adicionada |
|---|---|
| `camera-pet-visao-noturna-funciona` | Como testar a visão noturna antes de comprar |
| `brinquedo-interativo-pilha-x-recarregavel` | Sinais de que a bateria está acabando |
| `brinquedo-interativo-sensor-infravermelho-como-funciona` | Como posicionar o brinquedo para o sensor funcionar bem |
| `camera-pet-com-dispensador-de-petisco` | Cuidados com o tipo de petisco usado |
| `camera-pet-grava-sem-internet` | Como recuperar as gravações depois |
| `camera-pet-resolucao-1080p-x-2k` | Impacto no consumo de dados e armazenamento |
| `melhor-bolinha-inteligente-para-gato` | Duração da bateria e recarga |
| `porta-eletronica-impede-entrada-outros-animais` | O que fazer se um animal não cadastrado insistir na entrada |
| `porta-eletronica-microchip-x-rfid-coleira` | É possível usar as duas tecnologias na mesma porta? |
| `porta-eletronica-reconhecimento-facial-vale-a-pena` | Funciona bem à noite? |
| `porta-eletronica-x-alcapao-tradicional` | Dá para trocar o alçapão por porta eletrônica depois? |

Resultado: 0 posts abaixo de 400 palavras após a auditoria de verificação.

## Validação final

Reindexação e reauditoria completas rodadas após cada etapa (P1 e P3):
`site-indexer` → `seo-auditor` → sem críticos, sem erros novos, contagens
de links/schema/imagens consistentes. Nenhum artigo, link de afiliado,
imagem, vídeo ou sitemap foi tocado fora do escopo descrito acima.

## Itens em aberto (não fazem parte deste ciclo)

- Fix de Person-schema site-wide (ver memória `smartpetgadgets-cluster-coleira-gps`, deferido para sessão dedicada).
- `FAQ_OPPORTUNITY` (INFO) em vários posts sem seção de FAQ — oportunidade, não problema; avaliar caso a caso se agrega valor.
- `IMAGE_DIMENSIONS_MISSING` em `/autores/nildo-alves/` — width/height ausente nas imagens dessa página.

## Relatórios de origem

- `reports/seo-audit.md`
- `reports/cannibalization.md`
- `reports/internal-linking.md`
- `.data/seo-audit.json`, `.data/cannibalization.json`, `.data/internal-linking.json`, `.data/site-index.json`
