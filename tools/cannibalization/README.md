# Cannibalization Detector

Quarto módulo da V2 (Fase 3), companheiro de `tools/internal-linking`.
Consome `.data/site-index.json` e produz `.data/cannibalization.json` +
`reports/cannibalization.md` com pares de páginas que **possivelmente**
competem pela mesma intenção de busca.

## Objetivo

ANALISA → IDENTIFICA → RANQUEIA → SUGERE → REPORTA. **Nunca afirma
certeza.** O vocabulário do módulo inteiro usa "possível canibalização" —
nunca "é canibalização". Nunca recomenda apagar uma página automaticamente.

## Algoritmo (determinístico, local, explicável)

Mesma base de perfil de página que o Internal Linking
(`tools/shared/profile.js` + `tools/shared/terms.js`), mas com objetivo e
pesos diferentes: aqui o alvo é achar páginas que competem pela **mesma**
intenção de busca (não páginas complementares para linkar).

1. **Score de possível canibalização** (`src/scorer.js`): overlap de
   title, slug, heading e conteúdo, com pesos documentados (tabela abaixo).
2. **Sinais de diferenciação de intenção**: título com padrão comparativo
   explícito (`X vs Y`, `X ou Y`) ou prefixos de formato editorial
   diferentes entre os dois posts (`duvidas-` = FAQ, `erros-comuns-`,
   `melhor-` = ranking, `como-` = how-to, `-review` = review de produto).
   Reflete o exemplo do prompt da Fase 3: "câmera pet 1080p vs 2K" e "como
   escolher resolução da câmera pet" podem ser relacionados sem ser
   canibalização. **Esses sinais não descontam o score numérico** — ficam
   registrados separadamente em `differentiation_signals`, visíveis no
   relatório, para que a decisão de "isso é ou não é problema" continue
   sendo humana e auditável, não escondida dentro de uma fórmula.
3. **Classificação** (heurística, documentada como tal):
   - `0-39` → `low` (não reportado no JSON/relatório — ver `MIN_REPORT_SCORE`)
   - `40-69` → `possible`
   - `70-100` → `high`
4. **Cada par analisado uma única vez**: `i < j` (nunca A→B e B→A
   separadamente — a relação é simétrica). Com 67 posts elegíveis
   (`page_type: post`), isso é C(67,2) = 2.211 comparações — aceitável sem
   otimização, conforme orientado no prompt da Fase 3.
5. **Recomendação nunca é "apagar"**: sempre "revisar manualmente",
   "diferenciar títulos", "fortalecer conteúdo", "criar links entre
   conteúdos complementares" ou "consolidar somente após revisão manual".

## Pesos do score (documentados)

| Componente | Peso | Por quê |
|---|---:|---|
| Title overlap | 35 | Sinal mais direto de "para qual busca esta página foi otimizada" |
| Content overlap | 25 | Pesa menos que title/slug — dois posts do mesmo nicho compartilham muito vocabulário sem necessariamente disputar a mesma query |
| Slug overlap | 20 | Normalmente reflete a keyword principal escolhida |
| Heading overlap | 20 | Estrutura de tópicos cobertos |

Soma = 100. `MIN_REPORT_SCORE = 40` — pares abaixo disso (já seriam `low`
pela própria classificação) são omitidos do JSON/relatório para manter o
foco em conflitos que merecem revisão humana.

## Formato de saída

`.data/cannibalization.json`:
```jsonc
{
  "version": 1,
  "generated_at": "...",
  "summary": { "pages_analyzed": 67, "pairs_analyzed": 2211, "potential_conflicts": 248 },
  "pairs": [
    {
      "page_a": "/brinquedo-interativo-automatico-para-gato/",
      "page_b": "/duvidas-brinquedo-interativo-gato/",
      "score": 72,
      "level": "high",
      "signals": ["títulos semelhantes: brinquedo, interativo, gato", "..."],
      "differentiation_signals": [],
      "explanation": "...",
      "recommendation": "..."
    }
  ]
}
```

`reports/cannibalization.md`: resumo, pares com maior score, detalhamento
completo por par (títulos, sinais, sinais de diferenciação, explicação,
recomendação).

## Como executar

```bash
# pré-requisito: .data/site-index.json deve existir (rode o Site Indexer)
cd tools/shared && npm install && cd ../cannibalization
npm install
npm run detect
```

```bash
npm run detect -- --site-index .data/site-index.json
npm run detect -- --quiet
npm run detect -- --help
```

## Validação real (67 páginas elegíveis, 2.211 pares)

**Antes da Fase 3.1:** 248 pares reportados (score >= 40): 3 HIGH, 245 POSSIBLE.
**Depois da Fase 3.1:** 270 pares reportados: **0 HIGH, 139 POSSIBLE, 131 COMPLEMENTARY.**

O número total de pares reportados subiu (mais transparência: pares antes
escondidos por estarem levemente abaixo de 40 antes da reponderação
passaram a aparecer, agora corretamente classificados), mas os falsos
positivos identificados na validação da Fase 3 **desapareceram**: os 3
`HIGH` que eram pilar↔satélite viraram `complementary`; o falso positivo
de "Guia Completo 2026" entre pilares sem relação real (`coleira-gps-
para-pet` vs `comedouro-automatico-para-pet`) não é mais reportado; e um
4º falso positivo — `como-instalar-porta-eletronica-pet` (how_to) ↔
`erros-comuns-porta-eletronica-pet` (troubleshooting), nenhum dos dois
sendo pilar — também passou a ser corretamente classificado como
`complementary`. O par de risco real preservado (`comedouro-newpet-2l-
review` ↔ `comedouro-newpet-4l-review`, mesmo formato REVIEW, sem
nenhum dos dois ser pilar) continua reportado como `possible` (65/100),
confirmando que a correção não "amaciou" conflitos reais.

## Fase 3.1 — calibração de qualidade (histórico)

A validação manual da Fase 3 encontrou dois problemas, corrigidos nesta
fase de forma arquitetural e compartilhada (`tools/shared/`):

1. **Pilar × satélite tratado como conflito.** Resolvido com
   `tools/shared/format-classifier.js#detectFormat()` — classifica cada
   página em `pillar | faq | troubleshooting | comparison | review | list
   | how_to | guide | informational | institutional | unknown`, usando
   múltiplos sinais locais (schema FAQ do Site Indexer, padrões de
   slug/título, **e links de entrada** para detectar pilar). Ver
   `relationshipType()` e a nova saída `level: 'complementary'`.
2. **Frases padrão inflando similaridade.** Resolvido com
   `tools/shared/semantic-terms.js#weightedOverlapCoefficient()` — termos
   genéricos ("guia", "completo", "melhor"...) pesam 0.15 e anos pesam 0,
   em vez do peso 1.0 padrão.

**Calibração de PILLAR por inbound, não por word_count/h2_count:** a
tentativa inicial de usar contagem de palavras para detectar pilar
falhou contra os dados reais — vários satélites (reviews, listicles)
são mais longos que os pilares verdadeiros neste site. O sinal real e
limpo encontrado foi **links de entrada**: os 5 pilares conhecidos têm
inbound 23-47, com gap claro para o próximo nível (máx. 14). Threshold
final: `PILLAR_MIN_INBOUND = 20`.

**Dois bugs encontrados e corrigidos durante a própria validação da Fase
3.1** (documentados para transparência do processo):
- Checar `faq.schema_detected` antes de checar `inboundCount` fazia
  pilares com FAQ na própria página (comum — muitos pilares têm bloco de
  FAQ além de ter satélite dedicado) serem classificados como `faq` em
  vez de `pillar`, quebrando a detecção pilar↔satélite inteira. Corrigido
  invertendo a ordem de prioridade (pilar por inbound é checado primeiro).
- `comedouro-com-ou-sem-wifi` (um COMPARISON — título contém "ou") também
  tinha FAQ schema e era classificado como `faq` porque o schema tinha
  prioridade alta demais sobre sinais estruturais mais específicos
  (slug/título de comparison/review/list/how_to). Corrigido rebaixando o
  FAQ-só-por-schema para fallback, depois dos formatos mais específicos.
- O bônus `PILLAR_SATELLITE` do Internal Linking (ver README daquele
  módulo) inicialmente "resgatava" pares sem relação temática real só por
  um dos lados ser pilar e o outro satélite de qualquer cluster —
  corrigido com uma guarda de overlap mínimo antes de aplicar o bônus.

## Limitações restantes (não resolvidas nesta fase)

- **`differentiated_satellites` e `pillar_satellite` não verificam se as
  duas páginas pertencem ao mesmo cluster temático** — apenas que os
  formatos são diferentes/específicos. Isso é intencional (não há
  cluster confiável no índice hoje — sempre `null`), mas teoricamente um
  HOW_TO de um tema e um TROUBLESHOOTING de outro tema completamente
  diferente também cairiam em `differentiated_satellites` se o overlap
  textual (mesmo ponderado) ainda cruzasse o threshold de 40 — não
  encontrado na prática nos 67 posts reais, mas é uma lacuna teórica.
- 131 pares `complementary` é um número alto — não foram todos revisados
  individualmente (amostragem feita, não 100%); alguns podem ainda ter
  nuances que a heurística não capture perfeitamente.

## Outras limitações

- `cluster` sempre `null` no índice real hoje — não usado neste módulo por
  esse motivo (diferente do Internal Linking, que já tem o componente
  pronto para quando o campo for populado).
- Heurística, nunca certeza — mesmo um par `high` pode ser intencional
  (ex: pilar + satélite dedicado), como os 3 exemplos acima mostram. Todo
  resultado deste módulo precisa de revisão humana antes de qualquer ação.

## Testes

```bash
npm test
```
12 testes (`node --test`), cobrindo classificação de faixas, score alto
para títulos/slugs quase idênticos, score mais baixo para conteúdo
complementar, detecção de sinais de diferenciação (comparativo, prefixos
de formato), pares únicos (sem duplicar A↔B), threshold mínimo de
relatório, e a garantia de que nenhuma recomendação sugere apagar sem
ressalva de revisão manual. Não dependem dos 72 posts reais.
