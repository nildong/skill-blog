# Blog Audit Report — smartpetgadgets.com.br

**Data da auditoria:** 2026-09-30
**Total de páginas:** 77 (74 posts + 3 institucionais: `/sobre/`, `/contato/`, `/politica-editorial/`, `/politica-de-privacidade/` — 4 institucionais na verdade)

---

## ⚠️ Nota metodológica importante

O analyzer genérico do skill `blog` (`analyze_blog.py`, scores 0-100) é calibrado para **Markdown + inglês**. Este site é **HTML + português**, e isso causa falsos positivos sistemáticos em 3 sinais:

1. **Links internos/externos**: o analyzer busca `[texto](url)` (sintaxe Markdown); este site usa `<a href="https://...">` (HTML com URLs absolutas). Resultado: **72 de 75 posts pontuaram 0 em "internal_linking"**, mesmo tendo em média 15+ links internos reais por página (confirmado pelo site-indexer: 1.181 links internos no site todo).
2. **Definições de entidade**: o analyzer procura `**termo** is/are/refers to` (Markdown + inglês); o site usa `<strong>termo</strong> é/são` (HTML + português). 74/75 posts foram marcados incorretamente como "sem definições".
3. **Exemplos/evidência diferenciada**: o analyzer procura frases-gatilho em inglês ("for example", "such as", "consider"). Não existem em conteúdo português. 75/75 posts foram marcados.

**Consequência:** os scores abaixo (67,7/100 de média) estão sistematicamente subestimados e **não devem ser lidos como nota de qualidade absoluta**. Eles ainda são úteis como **ranking relativo entre posts** (mesmo viés aplicado a todos, então a ordenação interna é válida) — por isso o "Per-Post Score" abaixo é mantido, mas com essa ressalva.

Para os sinais que realmente importam neste site (linkagem interna real, órfãs, canibalização, schema, metadados), usei as ferramentas determinísticas já calibradas para este projeto: `site-indexer`, `seo-auditor`, `cannibalization`, `internal-linking` (todas rodadas com o índice atualizado hoje, pós-reconstrução da página de antipulgas).

---

## Health Overview (ferramentas calibradas para este site)

| Métrica | Resultado |
|---|---|
| Páginas indexadas no site | 77 |
| Critical (seo-auditor) | 0 |
| Errors (seo-auditor) | 0 |
| Warnings (seo-auditor) | 1 |
| Info/oportunidades (seo-auditor) | 12 |
| Páginas órfãs (sem links de entrada) | **0** |
| Conflitos de canibalização HIGH | **0** |
| Conflitos de canibalização POSSIBLE (revisar) | 56 de 2.485 pares analisados |
| Relações pilar↔satélite (arquitetura intencional, não é conflito) | 184 |
| Conteúdo com mais de 60 dias sem atualização | **0** |
| JSON-LD inválido | 0 |
| Imagens sem alt text | 0 (de 186 imagens) |
| H1 ausente ou duplicado | 0 |

**Leitura geral:** o site está tecnicamente muito saudável. Zero críticos, zero erros, zero órfãs, zero canibalização de alta severidade, zero conteúdo realmente velho. Os 12 itens de nível Info são polimentos (title/description um pouco longos, imagens sem width/height, FAQ heading sem schema correspondente).

---

## Per-Post Score (analyzer genérico — ranking relativo, ver ressalva acima)

Score médio: 67,7/100 · Nenhum post abaixo de 50 · Nenhum post acima de 90 (esperado, dado o viés sistemático contra HTML/português)

| Faixa | Contagem |
|---|---|
| 90+ | 0 |
| 70-89 | 31 |
| 50-69 | 44 |
| <50 | 0 |

### 10 posts com score relativo mais baixo

| Post | Score |
|---|---|
| `/contato/` | 52 *(página institucional, não editorial — score baixo esperado)* |
| `/politica-editorial/` | 54 *(institucional)* |
| `/sobre/` | 54 *(institucional)* |
| `/politica-de-privacidade/` | 58 *(institucional)* |
| `/duvidas-camera-para-monitorar-pet/` | 60 |
| `/duvidas-brinquedo-interativo-gato/` | 61 |
| `/coleira-gps-cachorro-que-foge/` | 62 |
| `/duvidas-coleira-gps-pet/` | 62 |
| `/erros-comuns-porta-eletronica-pet/` | 62 |
| `/porta-eletronica-gato-x-cachorro-diferenca/` | 62 |

Padrão visível: os scores mais baixos entre posts editoriais concentram-se em conteúdo **formato FAQ/dúvidas** — provavelmente porque esse formato tem parágrafos curtos e estrutura de pergunta-resposta, que o analyzer pontua mal em "depth"/"structure" mesmo quando o conteúdo cumpre bem sua função (responder dúvidas pontuais).

### 5 posts com score relativo mais alto

| Post | Score |
|---|---|
| `cercado-para-cachorros` | 78 |
| `tapete-higienico-para-cachorro` | 76 |
| `comedouro-automatico-gato-obeso` | 76 |
| `coleira-seresto-antipulgas` | 76 |
| `melhor-antipulgas-para-cachorro` | 74 *(reconstruída hoje, 3→6 produtos)* |

---

## Canibalização — Top 10 Pares "Possible" (revisar manualmente)

Score heurístico, nunca "certeza" de conflito. Nenhum par chegou a HIGH.

| Score | Página A | Página B |
|---|---|---|
| 66 | `/brinquedo-interativo-gato-idoso-vale-a-pena/` | `/duvidas-brinquedo-interativo-gato/` |
| 65 | `/comedouro-newpet-2l-review/` | `/comedouro-newpet-4l-review/` |
| 63 | `/comedouro-gato-x-cachorro-diferenca/` | `/porta-eletronica-gato-x-cachorro-diferenca/` |
| 60 | `/camera-pet-x-coleira-gps-qual-escolher/` | `/coleira-gps-x-microchip/` |
| 60 | `/comedouro-newpet-4l-review/` | `/comedouro-vdrbg-4l-wifi-review/` |
| 59 | `/porta-eletronica-funciona-porta-de-vidro/` | `/porta-eletronica-sensor-de-luz-como-funciona/` |
| 58 | `/coleira-gps-cachorro-que-foge/` | `/melhor-coleira-gps-sem-mensalidade/` |
| 57 | `/coleira-gps-cachorro-pequeno-porte/` | `/coleira-gps-cachorro-que-foge/` |
| 55 | `/camera-pet-x-coleira-gps-qual-escolher/` | `/coleira-gps-bluetooth-x-chip-operadora/` |
| 55 | `/como-configurar-camera-pet-wifi/` | `/configurar-app-comedouro-wifi/` |

A maioria são pares de reviews de modelo similar (Newpet 2L vs 4L) ou dúvidas/erros do mesmo tema — esperado em um site de cluster denso, geralmente resolvível diferenciando o título/intenção em vez de mesclar. Relatório completo com sinais de diferenciação em `reports/cannibalization.md`.

---

## Oportunidades de Link Interno — Top 5

Nenhuma é para página órfã (não há órfãs). São reforços de cluster:

1. `/comedouro-automatico-para-pet/` → `/comedouro-vdrbg-4l-wifi-review/` (score 53) — anchor sugerido: "Como Funciona o App do VDRBG 4L Wi-Fi"
2. `/comedouro-automatico-para-pet/` → `/comedouro-automatico-gato-obeso/` (score 52)
3. `/duvidas-brinquedo-interativo-gato/` ↔ `/erros-comuns-brinquedo-interativo-gato/` (score 52, mútuo)
4. `/comedouro-gato-x-cachorro-diferenca/` → `/porta-eletronica-gato-x-cachorro-diferenca/` (score 51)
5. `/como-escolher-brinquedo-interativo-gato-entediado/` ↔ `/duvidas-brinquedo-interativo-gato/` (score 51, mútuo)

Lista completa (174 sugestões) em `reports/internal-linking.md`. Nenhuma foi aplicada — são apenas sugestões para revisão manual.

---

## Freshness

| Faixa | Contagem |
|---|---|
| ≤7 dias | 16 |
| 8-30 dias | 57 |
| 31-60 dias | 4 |
| >60 dias | 0 |

4 páginas na faixa 31-60 dias (prioridade baixa, ainda dentro do razoável para site jovem):
- `/autores/nildo-alves/` — 42 dias
- `/cercado-para-cachorros/` — 38 dias
- `/comedouro-cachorro/` — 38 dias
- `/soprador-pet/` — 38 dias

---

## Issues do SEO Auditor (determinístico, 0 críticos/erros)

**Warning (1):**
- `FAQ_HEADING_WITHOUT_SCHEMA` na home (`/`) — heading menciona FAQ mas não há schema FAQPage correspondente. Baixo impacto (FAQPage não gera mais rich result desde maio/2026), mas inconsistência editorial vale corrigir.

**Info / oportunidades (12):**
- 4x `TITLE_TOO_LONG` (62-66 caracteres, recomendado até 60): `/camera-para-monitorar-pet/`, `/coleira-gps-cachorro-que-foge/`, `/como-escolher-brinquedo-interativo-gato-entediado/`, `/porta-eletronica-microchip-x-rfid-coleira/`
- 1x `DESCRIPTION_TOO_LONG` (166 caracteres): `/cachorro-de-casa-pega-pulga/`
- 3x `JSONLD_MISSING`: `/contato/`, `/politica-editorial/`, `/sobre/` (páginas institucionais sem Organization/WebSite schema)
- 3x `IMAGE_DIMENSIONS_MISSING`: `/autores/nildo-alves/`, `/politica-de-privacidade/`, `/politica-editorial/`
- 1x `IMAGE_COUNT_HIGH`: home tem 71 imagens (cards de post) — esperado dado o volume de conteúdo, não é um problema real

Relatório completo em `reports/seo-audit.md`.

---

## Prioritized Action Queue

| Prioridade | Item | Ação recomendada |
|---|---|---|
| 1 | FAQ heading sem schema na home | Adicionar FAQPage schema ou remover o heading "FAQ" da home se não for uma seção de perguntas real |
| 2 | 3 páginas institucionais sem JSON-LD | Adicionar Organization/WebSite schema em `/sobre/`, `/contato/`, `/politica-editorial/` |
| 3 | 4 titles acima de 60 caracteres | Encurtar para reduzir risco de truncamento no SERP |
| 4 | 1 meta description acima de 160 caracteres | Encurtar `/cachorro-de-casa-pega-pulga/` |
| 5 | 3 páginas sem width/height em imagens | Adicionar para reduzir CLS |
| 6 | 56 pares de canibalização "possible" | Revisar manualmente os top 10 listados acima, priorizando os de score mais alto (Newpet 2L vs 4L, dúvidas vs erros comuns) |
| 7 | 4 páginas na faixa 31-60 dias | Refresh leve (checar links, atualizar preços/specs) — baixa prioridade, ainda não estão "stale" de verdade |

---

## Notas

- Nenhuma página órfã, nenhum conflito de canibalização de alta severidade, nenhum JSON-LD inválido, nenhuma imagem sem alt — a arquitetura de conteúdo deste site está bem cuidada.
- O score médio de 67,7/100 do analyzer genérico **não deve ser usado como métrica de qualidade absoluta** para decisões de investimento de conteúdo — ele mede mal precisamente os pontos fortes deste site (linkagem interna densa, HTML bem estruturado, schema rico). Para decisões reais, priorizar os achados do `seo-auditor`/`cannibalization`/`internal-linking` (calibrados) acima da tabela de scores.
- Dados gerados a partir de: `.data/site-index.json` (regenerado hoje, 77 páginas), `.data/seo-audit.json`, `.data/cannibalization.json`, `.data/internal-linking.json`, `sitemap.xml`.

**Próximos passos sugeridos:**
- `/blog analyze <post>` no post de score relativo mais baixo entre os editoriais (`duvidas-camera-para-monitorar-pet`, 60) para ver se há problema real além do viés do analyzer.
- Revisar os 2-3 pares de canibalização de maior score antes de criar novo conteúdo no mesmo tema.
