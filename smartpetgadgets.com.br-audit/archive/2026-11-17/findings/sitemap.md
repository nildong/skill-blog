# Achados do sitemap - smartpetgadgets.com.br (2026-11-17)

Auditoria anterior: 2026-11-06 (78 URLs). Score atual: **96/100** (anterior: ~95).

## Resumo
- Sitemap ao vivo (`/sitemap.xml`, 200, application/xml) e local `/home/projetos/blog/sitemap.xml` sao **byte a byte identicos** (`diff` vazio). O local tem alteracoes nao commitadas (4 lastmod -> 2026-11-16), mas ja estao implantadas. Falta apenas `git commit` (risco de perder/reverter no proximo deploy a partir do HEAD).
- 80 URLs (+2 vs 11-06: `/melhor-racao-para-cachorro/` e `/melhor-racao-para-gato/`), sem duplicatas, sem `priority`/`changefreq`, bem abaixo de 50k URLs / 50 MB.

## Portoes
| Verificacao | Resultado |
|---|---|
| XML valido, namespace 0.9, loc + lastmod em todas | PASSA |
| 80/80 retornam 200 sem redirect | PASSA |
| canonical == loc em 80/80; nenhum noindex | PASSA |
| Cobertura: 0 pastas `<slug>/index.html` fora do sitemap; 0 URLs sem pasta (exceto `/` e `/autores/nildo-alves/`, que sao paginas legitimas) | PASSA |
| Sem URLs problematicas: `/soprador-para-pet/` (301, fora do sitemap), `/cluster-comedouro-automatico-pet/` (410, fora), `/reports/` (410), nenhum `backup-*` listado | PASSA |
| robots.txt: `Sitemap: https://smartpetgadgets.com.br/sitemap.xml` presente; `Allow: /`, sem bloqueios do sitemap | PASSA |
| Sitemap vs llms.txt ao vivo: conjuntos identicos (80) | PASSA |
| lastmod vs ultimo commit do index.html: 78/80 iguais | PASSA com ressalva (S-02) |

## Delta vs 2026-11-06
| Item | 11-06 | 11-17 |
|---|---|---|
| URLs | 78 | 80 (+2 racao) |
| Distribuicao lastmod | 71 em 11-05, 7 em 11-04 | 49 em 11-05, 10 em 11-12, 6 em 11-15, 4 em 11-16, 4 em 11-04, 3 em 11-14, 2 em 11-11, 2 em 11-08 |
| lastmod igual ao commit | 78/78 | 78/80 |
| Criticos/Altos/Medios | 0 | 0 |

Corrigido/melhorou: lastmod agora diferenciado por pagina (antes 71 em uma unica data), refletindo reescritas reais (rankings de bebedouro, brinquedo, comedouro, camera, Seresto, coleira GPS).
Persistente: S-01 (boilerplate), S-04.

## Achados

### S-01 Baixa - 49 URLs ainda com lastmod 2026-11-05 vindo de mudanca de template
O lote de CTA/barra fixa/GA4 de 11-05 continua sendo o lastmod de 49 posts; apenas parte teve mudanca de conteudo (retitulagens P1, aberturas GEO). Mudanca ja antiga e nao e mais um pico em massa; nao mexer retroativamente. Evitar que futuros ajustes de template elevem lastmod em massa.

### S-02 Info - Local nao commitado e 2 lastmod com 1 dia de diferenca
- `sitemap.xml` com 4 lastmod -> 11-16 (`brinquedo-interativo-automatico-para-gato`, `coleira-gps-para-gato`, `coleira-gps-para-pet`, `coleira-seresto-antipulgas`) corresponde aos commits de schema (362c384, 55dda7a), ja ao vivo. Recomendado commitar.
- `comedouro-automatico-faz-mal` e `comedouro-automatico-para-dois-gatos`: lastmod 11-11, commit 11-12 (146cbc8); `Last-Modified` HTTP ao vivo = 11-11. Diferenca de fuso/upload, sem impacto.
- Nota: os 4 de 11-16 foram so ajuste de schema (brand/Product), mudanca tecnica pequena; aceitavel, mas nao e conteudo.

### S-03 Info - Manutencao manual
Sitemap e llms.txt sao manuais (hoje consistentes, 80 = 80). Sugerido script pre-deploy que gere ambos e compare. Sem sitemap de imagem/video (opcional).

### S-04 Info - Itens nao publicados (persistente)
`local_dirs.txt`, `audit/`, `reports/`, `fotos/` etc. estao untracked; `/reports/` e 410 ao vivo. Garantir que nao entrem no deploy; nenhum aparece no sitemap.

### S-05 Info - IndexNow
Submeter ao IndexNow as URLs com lastmod de 11-12 a 11-16 (reescritas) e as 2 novas de racao, se ainda nao feito.

## Nota de score
Sem erros de XML, status, noindex ou cobertura: 96/100. Descontos: lastmod de template (S-01, -2) e pendencia de commit/manutencao manual (S-02/S-03, -2).
