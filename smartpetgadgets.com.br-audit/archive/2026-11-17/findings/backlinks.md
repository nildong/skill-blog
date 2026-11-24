# Perfil de Backlinks — smartpetgadgets.com.br

**Data:** 2026-11-17 (anterior: 2026-11-06)
**Fontes:** Tier 0 (Common Crawl, cache de 2026-10-03, release cc-main-2026-jan-feb-mar; verification crawler). Moz, Bing, Keywords Everywhere e DataForSEO ausentes.
**Backlink Health Score:** DADOS INSUFICIENTES (0 de 7 fatores medidos). Nenhum número estimado.

## Delta vs 2026-11-06
| Item | 11-06 | 11-17 | Mudança |
|---|---|---|---|
| Tier | 0 | 0 | Nenhuma |
| CC in_crawl / in_rankings | false / false | false / false | Nenhuma (mesmo cache, 0.50) |
| PageRank / Harmonic | null | null | Nenhuma |
| Lista de backlinks para verify | inexistente | inexistente (sem export GSC "Links" em /reports) | Nenhuma |
| Facebook @smartpetgadgetsbr | existe | HTTP 200 | Estável |
| Pinterest | n/d | 53 pins agendados 11-11..11-28 (informado, não verificado por mim) | Novo canal |

Sem mudança mensurável nas fontes. Domínios referenciadores, âncoras, toxicidade, velocidade, follow/nofollow e geografia: **sem fonte**.

## Achados

### Alto
**1. Autoridade off-page não mensurável e provavelmente baixa (inferência).**
Domínio ausente do grafo CC (Common Crawl, 0.50). Ausência é evidência fraca, não prova de zero links. Mas o padrão de GSC é coerente: posição média ~9,8 com ~42 cliques/28d e 3,7 mil impressões; queda de melhor-comedouro-automatico-cachorro (9,8 para 22,8) e home (30 para 43) sugere páginas sem peso para sustentar posições 6-10.
**Implicação para pos 6-10:** nessas posições, a diferença para o top 5 em nichos de afiliados (comparativos, "melhor X") costuma ser autoridade de domínio e links ao cluster. Conteúdo e CTR já estão sendo trabalhados; links são a alavanca restante, mas não há dado para quantificar o gap (inferência, não observado).

### Médio
**2. Sem inventário-base de backlinks.** Exportar GSC > Links (sites de origem, páginas mais linkadas) e rodar `verify_backlinks.py --target https://smartpetgadgets.com.br/ --links <arquivo> --json`. Passo mais barato para ter o primeiro dado real; também revela se o cluster de GPS recebe algum link.

**3. Pinterest e Facebook geram sinais sociais, não autoridade.** Links de pins e página FB são tipicamente nofollow/de redirecionamento; ajudam descoberta e entidade (sameAs só com Facebook). Não contar como backlinks de ranking. Confirmar nos pins que a URL de destino é a do artigo (não home) e usar UTM só se canonicalização estiver ok.

**4. Ações de link building sugeridas (priorizadas):** (a) linkar páginas pos 6-10 a partir de menções em parcerias/fóruns/comunidades pet BR; (b) conteúdo citável (dados, testes dos rankings de GPS/bebedouro) para atrair citações; (c) perfis de marca (Instagram, YouTube, Pinterest) no sameAs; (d) evitar compra de links e diretórios em massa.

### Baixo
**5. Teto do Tier 0.** Chave gratuita Moz (2.500 linhas/mês) em `MOZ_API_KEY` ou `/home/ng/.config/claude-seo/backlinks-api.json` leva a confiança de 0.50 para 0.85 e traz DA, spam score, domínios referenciadores e âncoras.

## Limites
- CC do cache de 2026-10-03; sem `--update` nesta rodada.
- Nada sobre âncoras ou domínios referenciadores foi observado.
- Validator não executado (sem novas alegações numéricas além de métricas GSC citadas do google-data.md).
- E-E-A-T: `/seo content`; crawlabilidade: `/seo technical`.
