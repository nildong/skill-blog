# Perfil de Backlinks — smartpetgadgets.com.br

**Data da auditoria:** 2026-11-06 (anterior: 2026-11-04)
**Fontes:** Tier 0 apenas (Common Crawl Web Graph + verification crawler). Moz, Bing, Keywords Everywhere e DataForSEO não configurados (`backlinks_auth.py --check` confirma tier 0).
**Limite:** com menos de 4 dos 7 fatores de pontuação com dados, **não há Backlink Health Score numérico (DADOS INSUFICIENTES)**.

## Delta vs 2026-11-04
| Item | 2026-11-04 | 2026-11-06 | Mudança |
|---|---|---|---|
| Tier | 0 | 0 | Nenhuma |
| CC `in_crawl` / `in_rankings` | false / false | false / false | Nenhuma |
| PageRank / Harmonic | null / null | null / null | Nenhuma |
| Release CC avaliada | cc-main-2026-jan-feb-mar (cache 2026-10-03) | igual (cache 2026-10-03) | Nenhuma |
| Tentativa de atualização do CC (`--update`) | não feita | **timeout após 300 s** (download não concluído) | Nova tentativa, sem dado novo |
| Lista de backlinks conhecidos p/ verify | inexistente | inexistente (busca em `/home/projetos/blog`, só o próprio `findings/backlinks.md`) | Nenhuma |
| `sameAs` da home | só Facebook | só `facebook.com/smartpetgadgetsbr` | Nenhuma (página do Facebook já existe e é a única entidade vinculada) |
| Severidades | High 1, Medium 1, Low 1 | High 1, Medium 1, Low 1 | Nenhuma |

**Resumo:** sem mudança mensurável. O resultado do CC continua vindo do cache de 2026-10-03 e a tentativa de baixar o grafo novamente expirou, então os dados não foram renovados. Nenhum grafo mais recente que `cc-main-2026-jan-feb-mar` está listado como disponível (`--info`).

## Métricas

| Métrica | Valor | Fonte (confiança) |
|---|---|---|
| No grafo do Common Crawl | Não | CC, domínio (0.50), cache 2026-10-03 |
| Em rankings do CC | Não | CC (0.50) |
| PageRank / Harmonic centrality | null / null | CC (0.50) |
| Domínios referenciadores, qualidade, âncoras, toxicidade, velocidade, follow/nofollow, geografia | Sem fonte de dados | n/d |
| Backlinks conhecidos verificados | 0 (sem lista de entrada) | Verify |

## Achados

### Crítico
Nenhum identificado (não verificável no Tier 0).

### Alto
**1. Nenhum sinal mensurável de autoridade off-page (domínio ausente do grafo CC).**
- Evidência: `commoncrawl_graph.py smartpetgadgets.com.br --json` retorna tudo null.
- Interpretação (inferência, não fato): consistente com perfil de backlinks muito fino; a ausência no grafo trimestral é evidência fraca de "zero links", já que domínios pequenos costumam ficar de fora.
- Correção: priorizar links editoriais relevantes (sites/fóruns BR de pets e reviews, PR digital ancorado no cluster de coleira GPS com 11 artigos). Ampliar `sameAs` (Instagram, YouTube, quando existirem) como sinal de entidade, não como backlink. O perfil do Facebook, já no ar, pode receber link para o site na bio/seção "Sobre" (link de origem social, geralmente nofollow, valor de descoberta e entidade).

### Médio
**2. Sem inventário-base de backlinks.**
- Correção: exportar o relatório "Links" do Google Search Console (links externos principais e sites de origem) e rodar `verify_backlinks.py --target https://smartpetgadgets.com.br/ --links <arquivo> --json`. É a forma mais rápida de obter o primeiro dado real, sem depender do CC.

### Baixo
**3. Teto do Tier 0.**
- Correção: configurar chave gratuita da Moz (2.500 linhas/mês) em `MOZ_API_KEY` ou `/home/ng/.config/claude-seo/backlinks-api.json` para subir ao Tier 1 (confiança 0.50 para 0.85).

## Limites dos dados
- CC veio do cache de 2026-10-03; `--update` expirou em 300 s (falha de download/timeout, não ausência de dados).
- Nenhum fator da pontuação foi medido; nenhum número foi estimado.
- `validate_backlink_report.py` não foi executado (sem novas alegações numéricas).
- E-E-A-T e crawlabilidade ficam com `/seo content` e `/seo technical`.
