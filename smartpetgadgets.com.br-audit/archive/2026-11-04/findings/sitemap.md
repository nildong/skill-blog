# Achados do sitemap - smartpetgadgets.com.br (2026-11-04)

Auditoria anterior: 2026-10-29. Sitemap ao vivo idêntico ao local (`diff` sem diferenças). Descoberta via robots.txt: `Sitemap:` declarado, 200, urlset válido.

## Portões
| Verificação | Resultado | Status vs anterior |
|---|---|---|
| XML válido, namespace 0.9, 78 `<url>` com loc+lastmod, 0 duplicadas | PASSA | persistente (ok) |
| 78/78 retornam 200 sem redirect (sem seguir redirects) | PASSA | persistente (ok) |
| canonical == loc em 78/78 | PASSA | persistente (ok) |
| Sem noindex (meta ou X-Robots-Tag) em nenhuma URL | PASSA | persistente (ok) |
| Sem changefreq/priority | PASSA | persistente (ok) |
| Limites (78 URLs, bem abaixo de 50k/50MB) | PASSA | persistente (ok) |
| Cobertura disco vs sitemap: toda pasta com index.html na raiz (77 + home) está no sitemap | PASSA | persistente (ok) |
| Sitemap vs llms.txt: conjuntos de URLs idênticos (comm vazio) | PASSA | persistente (ok) |
| /reports/ responde 410 e não está no sitemap; robots não bloqueia (Google vê o 410) | PASSA | corrigido (commit 34ff7ea) |
| /audit/, /briefs/, /calendars/ respondem 404 ao vivo (não publicados) | PASSA | novo (verificado) |

## Achados

### S-01 Baixa - lastmod em massa e defasado do conteúdo (PERSISTENTE)
Evidência: 58/78 URLs com lastmod 2026-10-14, mais 7 em 10-15 (65 de 78 nas duas datas). Das 72 páginas com JSON-LD `dateModified`, 63 divergem do lastmod do sitemap; em todas o sitemap é mais novo (nunca mais antigo), ex.: `/camera-pet-resolucao-1080p-x-2k/` sitemap 10-14 vs dateModified 2026-08-22; `/tapete-higienico-para-cachorro/` 10-14 vs 08-19. Sem `dateModified` (6): home, autores, contato, política de privacidade, política editorial, sobre (esperado em páginas institucionais).
Risco: o Google pode passar a ignorar o lastmod do site se não refletir mudanças reais.
Correção: lastmod = data da última mudança material (alinhar a `dateModified`, ou `git log` do conteúdo excluindo commits em massa de GA4/template); atualizar `dateModified` e lastmod na mesma edição.

### S-02 Baixa - lastmod de alguns posts mais antigo/divergente em sentido oposto: NÃO ocorre (sem achado)
Nenhuma URL tem `dateModified` posterior ao lastmod do sitemap (0 casos).

### S-03 Info - lastmod da home avançou 10-26 -> 10-29 (NOVO, informativo)
Commit de 2026-10-29 (miniaturas WebP da home). Coerente com mudança real; sem ação.

### S-04 Info - Arquivo local_dirs.txt na raiz (NOVO)
Untracked, não é publicado como página nem consta no sitemap; confirmar que não será implantado (não é indexável de forma relevante, mas é lixo de deploy). Correção: remover ou adicionar ao .gitignore/exclusão de deploy.

### S-05 Info - Chave IndexNow presente (PERSISTENTE)
`/a1f6cd69536df7bc75a53518c642c336.txt` 200. Submeter URLs alteradas após o deploy.

### S-06 Info - Sem sitemap de imagem/vídeo; manutenção manual (PERSISTENTE)
Páginas tapete e cercado têm VideoObject. Sitemap e llms.txt são manuais; sugerido script pré-deploy que gere ambos a partir das pastas e acuse divergência (hoje consistentes).

## Corrigido / Persistente / Novo
- Corrigido: /reports/ agora 410 e sem Disallow (confirmar remoção GSC dos backup-fase2a pendente na memória do projeto).
- Persistente: S-01, S-05, S-06 (todos portões ok mantidos).
- Novo: S-03, S-04 (ambos Info).
- Nenhum Crítico/Alto/Médio: sem URLs 404/redirect/noindex/410 no sitemap; nenhuma página órfã fora do sitemap.
