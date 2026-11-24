# Perfil de Backlinks — smartpetgadgets.com.br

**Data da auditoria:** 2026-11-04 (anterior: 2026-10-23)
**Fontes:** Tier 0 apenas (Common Crawl Web Graph + verification crawler). Moz, Bing, Keywords Everywhere e DataForSEO não configurados (`backlinks_auth.py --check` confirma tier 0).
**Limite:** com menos de 4 dos 7 fatores de pontuação com dados, **não há Backlink Health Score numérico (DADOS INSUFICIENTES)**.

## Delta vs 2026-10-23
- **Sem mudança.** CC: `in_crawl: false`, `in_rankings: false`, todas as métricas null. Release `cc-main-2026-jan-feb-mar`, resposta vinda de **cache local (2026-10-03)**, ou seja, sem consulta nova à rede. Nenhum grafo CC mais recente foi avaliado.
- Verification crawler segue sem uso: não existe lista de backlinks conhecidos no repo (busca por `*backlink*`, `*links*.csv`, `*referring*` sem resultados). Achado Medium anterior continua ABERTO.
- `sameAs` da home agora contém apenas a página do Facebook (`facebook.com/smartpetgadgetsbr`); sem outros perfis.
- Severidades inalteradas: High 1, Medium 1, Low 1, Critical nenhum (não é possível confirmar nem descartar).

## Métricas

| Métrica | Valor | Fonte (confiança) |
|---|---|---|
| No grafo do Common Crawl | Não | CC, domínio (0.50) |
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
- Interpretação (inferência, não fato): consistente com perfil de backlinks muito fino e com a perda de termos comerciais de topo para marketplaces; a ausência no grafo trimestral é evidência fraca de "zero links".
- Correção: priorizar aquisição de links editoriais relevantes (sites/fóruns BR de pets e reviews, PR digital ancorado em pilares como o cluster de coleira GPS com 11 artigos); ampliar `sameAs` (Instagram, YouTube, etc., quando existirem) como sinal de entidade, não como backlink.

### Médio
**2. Sem inventário-base de backlinks.**
- Correção: exportar o relatório "Links" do Google Search Console (links externos principais e sites de origem) para um arquivo e rodar `verify_backlinks.py --target https://smartpetgadgets.com.br/ --links <arquivo> --json`. Isso gera o primeiro dado real, independente do CC.

### Baixo
**3. Teto do Tier 0.**
- Correção: configurar chave gratuita da Moz (2.500 linhas/mês) em `MOZ_API_KEY` ou `/home/ng/.config/claude-seo/backlinks-api.json` para subir ao Tier 1 (confiança 0.50 para 0.85).

## Limites dos dados
- Resultado CC veio do cache de 2026-10-03; grafos são trimestrais e domínios pequenos/novos costumam ficar de fora.
- Nenhum fator da pontuação (domínios referenciadores, âncoras, toxicidade, velocidade, follow/nofollow, geo) foi medido; nenhum número foi estimado.
- `validate_backlink_report.py` não foi executado (sem novas alegações numéricas).
- E-E-A-T e crawlabilidade ficam com `/seo content` e `/seo technical`.
