# Achados do sitemap - smartpetgadgets.com.br (2026-11-06)

Auditoria anterior: 2026-11-04. Sitemap ao vivo idêntico ao local (`diff` sem diferenças). Descoberta via `sitemap_discovery.py`: único candidato `found` = `/sitemap.xml` (via robots.txt, 200, urlset válido). Candidatos comuns (`sitemap_index.xml`, `sitemap-index.xml`, `wp-sitemap.xml`) 404, esperado (não declarados). Crawl: `pages/crawl-2026-11-06.json`.

## Portões
| Verificação | Resultado | Status vs anterior |
|---|---|---|
| XML válido, namespace 0.9, 78 `<url>` com loc+lastmod, 0 duplicadas | PASSA | persistente (ok) |
| 78/78 retornam 200, final == loc (sem redirect) | PASSA | persistente (ok) |
| canonical == loc em 78/78 | PASSA | persistente (ok) |
| Sem noindex (meta robots do crawl) em nenhuma URL | PASSA | persistente (ok) |
| Sem changefreq/priority | PASSA | persistente (ok) |
| Limites (78 URLs, bem abaixo de 50k/50MB) | PASSA | persistente (ok) |
| Cobertura disco vs sitemap: 0 pastas de post com index.html fora do sitemap; 0 URLs sem pasta (ignorados audit/, reports/, img/, *-audit/, cluster-comedouro-automatico-pet/) | PASSA | persistente (ok) |
| Sitemap declarado no robots.txt (`Sitemap: https://smartpetgadgets.com.br/sitemap.xml`) | PASSA | persistente (ok) |
| Sitemap vs llms.txt: 78 vs 78, conjuntos idênticos (`comm` vazio) | PASSA | persistente (ok) |
| lastmod == data do último commit de `<slug>/index.html` | PASSA (78/78) | melhorou (ver S-01) |
| Não publicados: audit/, briefs/, jev-seo-reports/, output_social_v2/, tools/, README.md, local_dirs.txt respondem 404; /reports/ 410 | PASSA | persistente (ok) |

## Delta vs 2026-11-04
| Item | 2026-11-04 | 2026-11-06 | Delta |
|---|---|---|---|
| URLs no sitemap | 78 | 78 | 0 |
| URLs 200 / canonical ok / indexáveis | 78/78 | 78/78 | 0 |
| lastmod 2026-10-14 (+10-15) | 65 | 0 | corrigido (data em massa antiga sumiu) |
| lastmod 2026-11-04 | 0 | 7 | novo (commit GA4 pós-load) |
| lastmod 2026-11-05 | 0 | 71 | novo (CTA, títulos/metas, abertura GEO) |
| lastmod divergente do `git log` do index.html | não medido | 0/78 | ok |
| URLs com `dateModified` JSON-LD divergente do lastmod | 63/72 | 63/72 | igual (sitemap mais novo) |
| Pastas fora do sitemap | 0 | 0 | 0 |
| llms.txt vs sitemap | idênticos | idênticos | 0 |
| local_dirs.txt | untracked na raiz | untracked na raiz, 404 ao vivo | persistente |

## Achados

### S-01 Baixa - lastmod segue as datas de commit, não de mudança material (PERSISTENTE, mudou de forma)
Evidência: o sitemap agora reflete exatamente o último commit de cada página (71 em 2026-11-05, 7 em 2026-11-04), então não há mais lastmod defasado. Porém 71 URLs em 11-05 incluem os 68 posts que receberam apenas CTA no topo, barra fixa e evento GA4 (boilerplate), além de 14 retitulagens e 9 aberturas GEO (mudança de conteúdo real, cerca de 23 páginas sem sobreposição maior). Aproximadamente 48 posts tiveram lastmod elevado por mudança só de template. Os 7 de 11-04 vêm do commit de GA4 pós-load em todas as páginas. Das 72 páginas com `dateModified`, 63 divergem do lastmod (sitemap sempre mais novo), ex.: `/brinquedo-automatico-cachorro-sozinho/` dateModified 2026-08-22 vs lastmod 2026-11-05 (35 páginas com 08-22, 7 com 08-20). Páginas retitladas como `/bebedouro-inox-x-ceramica/` têm dateModified 2026-10-25 vs lastmod 11-05.
Risco: o Google pode descontar o lastmod se parecer sempre "novo" sem mudança relevante. Mantê-lo em todos os URLs com mesma data repete o padrão de lastmod em massa.
Correção: lastmod = última mudança material (excluir commits de CTA/GA4/template); para as 14 retitulagens e 9 aberturas GEO, atualizar `dateModified` para 2026-11-05 junto com o lastmod. Não é necessário repor datas antigas nos 48 posts apenas com CTA, mas o próximo deploy não deve elevar lastmod em massa.

### S-02 Info - Sem lastmod posterior ao conteúdo no sentido oposto (sem achado)
Nenhuma URL tem `dateModified` posterior ao lastmod (0 casos).

### S-03 Info - local_dirs.txt na raiz (PERSISTENTE)
Untracked, 404 ao vivo, não está no sitemap. Remover ou excluir do deploy.

### S-04 Info - Pastas locais não publicadas (NOVO, informativo)
`jev-seo-reports/`, `output_social_v2/` e `tools/` (versionados ou não) e `README.md`, `V2-ARCHITECTURE-AUDIT.md` respondem 404 ao vivo. Manter fora do deploy (mesma política da pasta de cluster, 410 em /reports/).

### S-05 Info - Chave IndexNow e affiliate-cta.js (PERSISTENTE)
`/a1f6cd69536df7bc75a53518c642c336.txt` presente. Submeter ao IndexNow as 23 páginas com mudança material de 11-05 (e opcionalmente as demais). `affiliate-cta.js` responde 200 ao vivo (upload manual confirmado).

### S-06 Info - Sitemap e llms.txt manuais, sem sitemap de imagem/vídeo (PERSISTENTE)
Hoje consistentes (78 = 78). Sugerido script pré-deploy que gere ambos e acuse divergência de lastmod vs mudança material.

## Corrigido / Persistente / Novo
- Corrigido: lastmod em massa de 2026-10-14 deixou de existir (agora acompanha commits reais).
- Persistente: S-01 (reformulado), S-03, S-05, S-06.
- Novo: S-04 (Info).
- Nenhum Crítico/Alto/Médio: sem 404/redirect/noindex no sitemap; nenhuma página órfã fora do sitemap.
