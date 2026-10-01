# Auditoria SEO Completa — smartpetgadgets.com.br

Data: 2026-09-30 · claude-seo v2.4.1

## Resumo Executivo

**SEO Health Score: 86/100**

Tipo de negócio detectado: publisher/afiliado de conteúdo (nicho pet gadgets, português brasileiro).

O site está tecnicamente muito bem construído — HTML estático, headers de segurança corretos, Core Web Vitals praticamente perfeitos, 100% indexado no Google (confirmado pelo usuário em 2026-09-28/09-30). O gargalo real não é técnico: é **ranking e formato de página** em termos comerciais de cabeça, e uma lacuna de **schema arriscada** que merece correção imediata.

### Top 5 Problemas Críticos/Altos
1. **[Crítico]** `AggregateRating` em `/coleira-seresto-antipulgas/` (4,8★, 5.501 avaliações) parece copiado de um marketplace em vez de coletado no site — risco de ação manual do Google.
2. **[Alto]** Termos comerciais de cabeça (`melhor antipulgas para cachorro`, `comedouro automático para gato`, `coleira gps sem mensalidade`) perdem para marketplaces e listicles amplos de 5-10 itens com tabela e fotos — mismatch de formato e amplitude de conteúdo.
3. **[Alto]** Nenhum sinal de experiência prática com os produtos — a própria página `/sobre/` admite que as reviews partem de fotos/specs do vendedor, não de teste real. Isso limita o pilar "Experience" do E-E-A-T.
4. **[Médio]** `Organization.sameAs` vazio no schema da home, apesar da página do Facebook (`@smartpetgadgetsbr`) já estar no ar.
5. **[Médio]** `llms.txt` lista só 5 páginas estáticas, omitindo os 70+ artigos publicados.

### Top 5 Quick Wins
1. Remover o `AggregateRating` copiado em `coleira-seresto-antipulgas` (mantendo o Review editorial).
2. Popular `Organization.sameAs` com a URL do Facebook.
3. Cortar a meta description de `melhor-antipulgas-para-cachorro` de 221 para ~155 caracteres.
4. Corrigir o erro 403 no índice `/autores/` (a página individual do autor funciona, o hub não).
5. Expandir ou aposentar o `llms.txt`.

---

## SEO Técnico — 92/100

**O que funciona bem:**
- Redirecionamentos HTTP→HTTPS e www→non-www limpos, em um único salto 301, para `https://smartpetgadgets.com.br/` canônico (correção de 2026-08-23 sem regressão).
- Headers de segurança presentes: HSTS, CSP, X-Frame-Options, nosniff, Referrer-Policy.
- `robots.txt` bem formado, com diretivas `Content-Signal` granulares por bot de IA, bloqueando corretamente `/reports/`.
- Sitemap ativo, 77 URLs, sem páginas órfãs ou bloqueadas vazando para dentro.
- HTML 100% estático renderizado no servidor — zero risco de SPA/JS não renderizado.
- Canonicais autorreferenciados e consistentes, nenhum `noindex` encontrado.

**Problemas:**
- **Médio** — Protocolo IndexNow não implementado (ajudaria pickup mais rápido no Bing/Copilot).
- **Baixo** — CSP presente mas minimalista.

---

## Qualidade de Conteúdo — 82/100

**O que funciona bem:**
- Todo artigo abre com resposta direta + bloco "Principais Pontos".
- JSON-LD válido (BlogPosting/Product/FAQ/Breadcrumb).
- Estatísticas datadas e atribuídas (ex.: "5.501 avaliações, capturado em 2026-09-14").
- Disclosure de afiliado, ressalvas veterinárias, autor nomeado com bio.
- Nenhum tique de "voz de IA"; prosa natural em PT-BR.
- Zero templating detectável entre artigos.

**Problemas:**
- **Alto** — Ausência de sinais de experiência prática (pilar Experience do E-E-A-T pontuou 55/100).
- **Médio** — 4 artigos amostrados ficam entre 500-903 palavras, abaixo do piso de cobertura visto em outros artigos (1.390-1.430 palavras).
- **Médio** — `Organization.sameAs` vazio.
- **Médio** — Índice `/autores/` retorna 403.

---

## On-Page SEO — 85/100

**O que funciona bem:**
- Títulos únicos, descritivos, com keyword na frente (53-75 caracteres) nas 3 amostras.
- H1 presente exatamente uma vez por página, distinto do `<title>`.
- Meta descriptions únicas em todas as amostras.
- Slugs de URL limpos e descritivos.

**Problemas:**
- **Médio** — Meta description de `melhor-antipulgas-para-cachorro` tem 221 caracteres, muito além do limite prático de ~155-160 do Google (será cortada no SERP).

---

## Schema / Dados Estruturados — 82/100

**O que funciona bem:**
- BlogPosting, Person, Organization, BreadcrumbList bem formados nas 76 páginas, sem propriedades obrigatórias faltando, sem tipos depreciados.

**Problemas:**
- **Crítico** — `AggregateRating` em `coleira-seresto-antipulgas` parece copiado de marketplace — risco de ação manual por dados estruturados enganosos.
- **Info** — `FAQPage` presente em 71/76 páginas, mas desde a atualização de política do Google de 2026-05-07 não gera mais rich result para nenhum site (não é mais exclusivo de gov/saúde) — inofensivo, mas pare de contar como ativo de SEO.
- **Médio** — `sameAs` vazio; tipo de `Review.author` inconsistente (Person vs Organization) entre páginas de produto.

---

## Performance (Core Web Vitals) — 98/100

- **LCP**: 0,9-2,0s nas 3 páginas amostradas — bem abaixo do limite "Bom" de 2,5s.
- **INP** (via Total Blocking Time como proxy): 0ms em todas as páginas amostradas.
- **CLS**: 0,0 em todas as páginas amostradas.
- CrUX (dados de campo) retornou 403 — provável API não habilitada no projeto GCP configurado, ou volume insuficiente de tráfego real para o limiar de relato do CrUX. Não é um problema do site.

---

## Imagens — 90/100

- Cobertura de alt text: 100% nas páginas amostradas.
- `loading="lazy"` e `width`/`height` aplicados consistentemente nos cards da home (CLS 0,0 confirma).
- **Baixo** — Quantidade de imagens desigual entre artigos (ex.: `melhor-antipulgas-para-cachorro` tem só 4 imagens em ~1.656 palavras) — fraco frente aos concorrentes de marketplace/listicle que mostram 5-10 fotos de produto.

---

## Prontidão para Busca por IA (GEO/Agentic) — 80/100

- Lighthouse Agentic Browsing: 3/3 mobile e desktop.
- Árvore de acessibilidade para agentes: 100/100, 220 nós interativos limpos, 0 elementos sem nome.
- Política `Content-Signal` deliberada e consistente nos 16 grupos de crawler.
- **Médio** — `llms.txt` omite o catálogo de artigos.
- **Médio** — Nenhuma presença de marca verificada além do próprio domínio (Wikipedia, Reddit, YouTube, LinkedIn) — menções de marca correlacionam 3x mais com citações de IA do que backlinks.

---

## Sitemap — 92/100

- XML válido, 77 URLs, 12KB, bem abaixo dos limites.
- Cobertura bate exatamente com o site (home + 76 páginas), sem órfãos, sem 404/redirecionados.
- **Baixo** — 68% das URLs compartilham o mesmo `lastmod` (2026-09-20), sugerindo um "touch" em lote em vez de datas reais de edição.

---

## Experiência de Busca (SXO) — 56/100 ⚠️ Maior alavanca de melhoria

Esta foi a análise mais reveladora da auditoria. O diagnóstico se divide por classe de busca:

- **Termos comerciais de cabeça** (`melhor antipulgas para cachorro`, `comedouro automático para gato`, `coleira gps para cachorro`): os SERPs são dominados por marketplaces (Mercado Livre, Amazon, Leroy Merlin) e listicles amplos de 5-10 itens de varejistas de alta autoridade (Petz, Petlove). As páginas do site são comparações estreitas — ex.: a página de antipulgas compara só 3 comprimidos de marca (1.656 palavras, 4 imagens) contra concorrentes com "10 opções", fotos e tabelas de preço. O formato está quase certo, mas a amplitude, a mídia e a autoridade de domínio estão atrás.
- **Termos de cauda longa informacionais** (`comedouro automático faz mal para gato`, `...para dois gatos`): os SERPs são só de blogs, sem intrusão de marketplace — o formato do site **se alinha perfeitamente**. Este é o espaço onde já se ganha.

**Dimensões mais fracas:** Autoridade (4/15) e Mídia (5/15). **Pontos fortes:** schema (3 blocos/página) e atualidade (2026).

**Persona mais fraca:** Tutor Pronto para Comprar (46/100) — as páginas leem como artigo, não como superfície de compra; preços/CTAs não aparecem acima da dobra como nos resultados de marketplace.

---

## Dados Reais do Google Search Console (últimos 28 dias, 2026-09-02 a 2026-09-27)

- **Cliques: 9 | Impressões: 442 | CTR: 2,04% | Posição média: 11,2**
- Todas as 33 linhas de query/página retornadas têm 0 cliques — visibilidade existe, mas quase nenhum clique. Confirma que o problema é ranking/CTR, não indexação (consistente com a confirmação do usuário em 2026-09-28/09-30).
- Melhor query: "cerca virtual para cachorro" → `/cerca-virtual-para-cachorro/`, posição 11,1, 20 impressões, 0 cliques — logo abaixo da página 1, forte candidata a otimização.
- Maioria das outras queries fica nas posições 20-65.
- Amostra de 5 URLs via URL Inspection: todas **PASS** (indexadas, sem problemas).
- Sitemap: 77 URLs enviadas, 0 erros/avisos.
- PSI (dados de laboratório, home mobile): Performance 99, SEO 100, Best Practices 100, LCP 1.990ms, CLS 0.
- CrUX (dados de campo): 403 nos dois endpoints — verificar habilitação da API no Google Cloud Console.

---

## Nota de Escopo

Esta auditoria cobriu: técnico, conteúdo (amostra de homepage + 9 artigos), on-page (amostra de 3 páginas), schema (76 páginas), sitemap (77 URLs), performance (3 páginas via PSI), prontidão para agentes de IA (Lighthouse Agentic Browsing), SXO (5 queries-alvo via análise reversa de SERP), e dados reais do GSC/PSI (Tier 1, credenciais configuradas). GA4 não configurado (sem property ID) — não incluído. CrUX retornou 403 em ambos os endpoints. Backlinks avançados (Moz/Bing Webmaster) não configurados — apenas Common Crawl básico disponível, não auditado a fundo nesta passada.
