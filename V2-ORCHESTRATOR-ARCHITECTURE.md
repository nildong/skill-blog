# V2 — Arquitetura da Camada de Orquestração e Quality Gate

**Status:** aprovado pelo usuário em 2026-08-26. Implementação em etapas
(ver Roadmap); esta entrega cobre as etapas 1-4.

## 1. Diagnóstico resumido

- `deploy.sh` funciona bem, é seguro, escopado por pasta — não é alterado.
- 5 módulos V2 (`site-indexer`, `seo-auditor`, `internal-linking`,
  `cannibalization`, `content-strategy`) já existem, determinísticos,
  Node puro, sem rede, com `tools/shared/` compartilhado.
- Skills globais de escrita (`blog-write`, `blog-brief`, `blog-schema`
  etc.) ficam fora do repo — integração só por arquivo, nunca por código.
- Faltava: orquestração (chamar os módulos em sequência, antes de
  escrever) e um Quality Gate bloqueante. Nenhum dos dois existia.
- Fluxo anterior: `ideia → conteúdo → auditoria → deploy`. Fluxo alvo:
  `ideia → análise → planejamento → escrita → validação → quality gate →
  deploy`.

## 2. Princípio arquitetural

Um 6º módulo, `tools/orchestrator/`, no mesmo padrão dos outros 5. Não
reimplementa nada: chama os módulos existentes via `require`/lógica
compartilhada (não via `child_process` de CLI, quando a lógica já está
exposta como função reutilizável), adiciona só o que é genuinamente novo
(classificação de intenção, agregação, Quality Gate), e entrega um brief
como contrato de dados para a skill global de escrita.

## 3. Fluxo completo (12 etapas)

```
1. INPUT (propose)              → article-proposal.json
2. SITE INDEX (site-indexer)    → .data/site-index.json (reaproveitado)
3. SEARCH INTENT (novo)         → dentro de preflight-report.json
4. CLUSTER (buildLinkGraph +    → dentro de preflight-report.json
   format-classifier, reaproveitados)
5. CANIBALIZAÇÃO PRÉ-ESCRITA    → dentro de preflight-report.json
   (scorer de cannibalization, reaproveitado; aproximado até --simulate)
6. CONTENT STRATEGY             → (ainda não integrado ao preflight)
7. INTERNAL LINKING PLAN        → (ainda não integrado ao preflight)
8. BRIEF (brief-builder, futuro)→ article-brief.md
9. WRITE (skill global, fora do repo)
10. SEO AUDIT (seo-auditor, reaproveitado)
11. QUALITY GATE (futuro)       → quality-gate.json / quality-report.md
12. DEPLOY (deploy.sh, inalterado, condicionado ao gate)
```

Esta entrega implementa 1-4 (parcial: 4 cobre cluster + canibalização
pré-escrita; 6-7 ficam para depois).

## 4. Componentes desta entrega

| Componente | Arquivo | Responsabilidade |
|---|---|---|
| `slugify` | `src/slugify.js` | Slug determinístico consistente com a convenção dos 72 posts |
| `propose` | `src/propose.js` | Constrói e persiste `article-proposal.json`; nunca inventa campo não informado (fica `null`) |
| `intent-classifier` | `src/intent-classifier.js` | Classifica intenção/funil/tipo recomendado por heurística lexical; keyword research sempre `"não disponível"` |
| `preflight` | `src/preflight.js` | Agrega colisão de slug + cluster check + canibalização pré-escrita aproximada |
| CLI | `src/index.js` | Dispatcher de comandos (`propose`, `preflight`) |

## 5. Integração com os módulos V2 existentes

- `tools/seo-auditor/src/link-graph.js#buildLinkGraph` — reaproveitado
  para calcular inbound count real (não existe como campo pronto em
  `site-index.json`) e alimentar corretamente `detectFormat` (necessário
  para reconhecer um pilar existente e aplicar o desconto pilar↔satélite).
- `tools/cannibalization/src/scorer.js#scoreCannibalization` —
  reaproveitado diretamente (import de função, não CLI) para a
  canibalização pré-escrita aproximada.
- `tools/shared/format-classifier.js`, `tools/shared/profile.js`,
  `tools/shared/terms.js` — reaproveitados sem modificação.

Nenhum desses módulos foi alterado nesta entrega.

## 6. Limitação conhecida e documentada

A canibalização pré-escrita usa apenas `title`/`slug` da proposta (sem
`heading`/`content` reais, porque o artigo ainda não existe) — o score
tende a **subestimar** o risco real. Isso é reportado explicitamente em
`preflight-report.json.limitations` e não é escondido. A extensão
`--simulate` (roadmap, etapa 5) resolveria isso permitindo informar
headings planejados — só será implementada com aprovação separada, por
alterar (de forma aditiva/opt-in) módulos já validados.

## 7. Keyword research — postura

Nenhum módulo inventa volume, dificuldade, CPC ou posição.
`intent-classifier` expõe explicitamente:

```json
{
  "search_volume_estimate": "não disponível",
  "keyword_difficulty": "não disponível",
  "cpc": "não disponível",
  "current_position": "não disponível",
  "basis": "Heurística lexical local — sem fonte de dados externa."
}
```

## 8. Roadmap (retomado após esta entrega)

1. ~~Scaffold `tools/orchestrator/`~~ ✅
2. ~~`propose`~~ ✅
3. ~~`intent-classifier`~~ ✅
4. ~~`preflight`~~ ✅ (cluster + canibalização pré-escrita aproximada; content-strategy/internal-linking ainda não integrados ao preflight)
5. ~~Extensão `--simulate` em `cannibalization`/`internal-linking`~~ ✅ — opt-in, comportamento padrão bit-a-bit preservado (verificado por diff antes/depois com dados reais, ignorando só `generated_at`). `preflight.js` foi em seguida refatorado para reaproveitar os dois `--simulate` diretamente (elimina duplicação, e passou a carregar `differentiation_signals` e o plano de internal linking real que faltavam antes)
6. ~~`brief-builder`~~ ✅ — transformador puro de `article-proposal.json` + `preflight-report.json` em `article-brief.md`; nunca roda nova análise, nunca inventa dado ausente (sempre "não disponível"), nunca suaviza um nível de canibalização
7. ~~`quality-gate`~~ ✅ — comando `validate <slug>`; reaproveita `seo-auditor` (SEO técnico), `cannibalization` (canibalização real pós-escrita) e checagens próprias de schema×conteúdo visível, E-E-A-T (claim de experiência pessoal) e keyword stuffing. Validado contra os 67 posts reais: 0 falso positivo (nenhum seria bloqueado retroativamente). Achado real corrigido durante o desenvolvimento: regex de "claim de experiência pessoal" tinha falso positivo em frases de transparência editorial ("não testamos") — corrigido com checagem de negação de contexto antes de declarar BLOCKER
8. ~~`deploy-gate`~~ ✅ — comando `publish <slug>`; relê `quality-gate.json` a cada chamada (nunca confia em execução anterior), confere slug e `status === APPROVED` antes de invocar `deploy.sh`. Testado nos 5 cenários exigidos (aprovado, bloqueado, slug divergente, arquivo ausente, JSON inválido), sempre com `deploy.sh` mockado — nenhum teste toca o script real

## Correção técnica separada (antes do piloto): sitemap.xml

Causa raiz corrigida em `deploy.sh` (extraída para `generate-sitemap.sh`,
testável isoladamente): a exclusão de diretórios não cobria `tools/`, e
`tools/site-indexer/test/fixtures/mini-site/` vazava para o sitemap de
produção. Teste de regressão: `.claude/skills/blog/scripts/test/generate-sitemap.test.sh`
(bash puro, sem dependências) — confirmado que falha se a exclusão for
removida e passa com a correção.
9. Teste retroativo com artigo existente
10. Primeiro artigo novo em produção

## 9. Compatibilidade

- 72 páginas publicadas: inalteradas.
- `deploy.sh`: inalterado, nunca invocado por este módulo.
- Módulos V2 existentes: inalterados, só importados como biblioteca.
- Skills globais: integração só por arquivo (`article-brief.md`, quando
  existir), sem dependência de código.
