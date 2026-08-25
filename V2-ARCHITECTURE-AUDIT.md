# V2 Architecture Audit

**Data:** 2026-08-25
**Branch de origem:** `develop-v2` (criada a partir de `main` @ `2f7cfcd`)
**Escopo:** auditoria somente-leitura. Nenhum arquivo de código, configuração, credencial ou conteúdo foi alterado durante esta análise. Único artefato produzido: este relatório.

---

## 1. Executive Summary

A V1 é um site estático (HTML puro, sem build step, sem framework, sem backend) com 73 pastas de artigo publicáveis, hospedado na Hostinger e publicado via um único script `deploy.sh` (SFTP/SSH + rsync). Não existe pipeline de CI/CD, não existe banco de dados, não existe API própria, e não existe nenhum "site indexer" ou "SEO auditor" programático hoje — o que existe hoje sob esses nomes são **relatórios Markdown gerados manualmente por sessões de agente** (`reports/*.md`), não ferramentas reutilizáveis.

O projeto usa a skill `blog` do Claude Code (`.claude/skills/blog/`) apenas para o deploy — o restante do fluxo editorial (auditoria, cannibalização, cluster planning, SEO check) foi conduzido por sub-skills do pacote `blog` mais amplo (`blog-audit`, `blog-analyze`, `blog-cluster`, `blog-seo-check`, etc., listados no ambiente do usuário) mas **nenhuma delas tem artefato de código dentro deste repositório** — elas vivem fora do repo, na configuração global do Claude Code do usuário. Isso é uma distinção crítica para a V2: a V2 não vai "evoluir" scripts existentes no repo (eles não existem aqui), vai **criar do zero, dentro deste repo, versões locais/reutilizáveis do que hoje só existe como skill global + relatório avulso**.

Os artigos têm schema completo e consistente (BlogPosting, Person, Organization, BreadcrumbList, ImageObject, Product/Review quando aplicável), FAQPage em 30/73 (~41%), zero imagens sem alt, e uma arquitetura de conteúdo em clusters pilar→satélite bem estabelecida, documentada em `cluster-*/cluster-plan.json`. Os principais gaps identificados pelas próprias auditorias já feitas (`reports/*.md`) são: FAQPage incompleto, alguns posts órfãos (sem links de entrada), e um cluster ("porta eletrônica") com conteúdo raso e risco de canibalização.

A V2 pode ser construída como um conjunto de módulos **read-only sobre o filesystem local** (HTML estático, sem servidor), que leem os 73 `index.html` diretamente do disco, sem precisar de banco de dados — o "índice" pode começar como um JSON gerado por varredura, sem infraestrutura nova. Isso reduz drasticamente o risco e o custo da V2.0.

---

## 2. Current V1 Architecture

```
Autor/Claude Code
      │
      │ (workflow manual/skill blog-write, blog-brief, blog-outline, etc. — fora deste repo)
      ▼
 pasta-do-post/index.html + pasta-do-post/img/*   (HTML estático, sem build)
      │
      │ .claude/skills/blog/scripts/deploy.sh <pasta>
      ▼
  1. valida <title> existe
  2. valida imagens referenciadas existem localmente
  3. avisa (não bloqueia) sobre vídeos
  4. regenera sitemap.xml (varredura de todos index.html)
  5. rsync -avz --delete via SSH/SFTP (chave preferencial, senha fallback com sshpass)
  6. imprime URL publicada
      ▼
 Hostinger public_html/<slug>/   (produção: smartpetgadgets.com.br)
```

Não há camada de aplicação, não há framework JS, não há CMS, não há banco de dados. Cada página é um arquivo HTML autocontido com CSS inline no `<head>` e JSON-LD inline. O `.htaccess` com os redirects 301 de slug **vive só no servidor Hostinger**, fora desta árvore local (confirmado em `reports/seo-audit-2026-08-24.md`).

## 3. Current V1 Capabilities

Confirmado por leitura direta de código/conteúdo — nada suposto:

- Publicação de post único via `deploy.sh` (valida HTML/imagens, gera sitemap, envia por rsync/SSH).
- Geração de `sitemap.xml` automática a cada deploy (varre todo `index.html` do repo, exclui `img/`, `briefs/`, `calendars/`).
- 73 artigos publicados + páginas institucionais (`sobre`, `contato`, `politica-editorial`, `autores/nildo-alves`).
- Um cluster documentado formalmente com JSON de planejamento (`cluster-comedouro-automatico-pet/cluster-plan.json`, `cluster-plan-fase2.json`), incluindo `cannibalization-report.md`, `quality-report.md`, `seo-check-report.md`, `cluster-scorecard.md`, `editorial-policy.md`, `cluster-map.html` — esse é o único cluster com esse nível de instrumentação; os demais 60+ posts não têm pasta de planejamento equivalente versionada.
- Schema JSON-LD por artigo: `BlogPosting`, `Person` (autor), `Organization` (publisher), `BreadcrumbList`, `ImageObject`, e, quando aplicável, `FAQPage`/`Question`/`Answer` e `Product`/`Review`/`Rating`.
- `robots.txt` permitindo explicitamente crawlers de IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.) além dos tradicionais.
- Um `briefs/` com um único brief versionado (`comedouro-elevado-individual-cachorro-brief.md`) — não é o padrão para todos os posts existentes.
- Um `calendars/` com um único calendário editorial (`2026-09-editorial-calendar.md`).
- Dois relatórios de auditoria em `reports/` (`blog-audit-2026-08-24.md`, `seo-audit-2026-08-24.md`) — **gerados por skills externas ao repo**, não por scripts aqui presentes.

## 4. Current Directory Structure

```
/home/projetos/blog/
├── .claude/skills/blog/          # única skill com código versionado no repo (deploy)
│   ├── SKILL.md
│   └── scripts/{deploy.sh,ssh-setup.md,.env.example,.env(gitignored),.gitignore}
├── <71 pastas de post>/          # cada uma: index.html + img/*.{jpg,webp,png,mp4}
│   └── ex: comedouro-cachorro/index.html, comedouro-cachorro/img/*
├── cluster-comedouro-automatico-pet/   # único cluster com planejamento .md/.json versionado
│   ├── pillar-*.md, a1..d2*.md (rascunhos, não são os index.html publicados)
│   ├── cluster-plan.json, cluster-plan-fase2.json
│   ├── cannibalization-report.md, quality-report.md, seo-check-report.md, cluster-scorecard.md
│   ├── editorial-policy.md, cluster-map.html, images/
├── autores/nildo-alves/index.html
├── briefs/comedouro-elevado-individual-cachorro-brief.md
├── calendars/2026-09-editorial-calendar.md
├── reports/{blog-audit-2026-08-24.md, seo-audit-2026-08-24.md}
├── contato/, sobre/, politica-editorial/    # páginas institucionais
├── img/                                     # assets globais (logo, favicons, og-home)
├── index.html                               # home
├── robots.txt, sitemap.xml
├── .gitignore, README.md
└── (arquivos temporários fora do controle: .tmp_*.txt/.py — não versionados, listados em .gitignore)
```

Não existe `package.json`, `requirements.txt`, nem qualquer script Python versionado no repo (o único `.py` encontrado, `.tmp_filter.py`, é um arquivo temporário de sessão, ignorado pelo git). Ou seja: **não há hoje nenhum "analisador canônico" (`scripts/analyze_blog.py`) dentro deste repositório**, apesar de `reports/blog-audit-2026-08-24.md` mencionar esse script como indisponível "no ambiente sandboxed desta sessão" — ele provavelmente existe apenas como parte da skill global `blog-analyze` fora do repo, não como artefato local.

## 5. Reusable Components

| Componente | Reutilizável para V2? | Como |
|---|---|---|
| `deploy.sh` | Sim, integralmente | V2 deve continuar chamando este script como etapa final de publicação; nenhum módulo novo deve reimplementar SFTP/rsync |
| Convenção `slug/index.html` + `slug/img/` | Sim | Base estrutural para o Site Indexer (unidade de varredura = 1 pasta = 1 URL) |
| Schema JSON-LD padrão por artigo (`BlogPosting`/`Person`/`Organization`/`BreadcrumbList`) | Sim, como referência de parsing | O Site Indexer pode extrair esses blocos com um parser HTML simples (ou regex robusto, já usado nas auditorias anteriores via `grep`) |
| `cluster-plan.json` (schema de cluster com `id`, `links_to`, `links_from`, `primary_keyword`, `template`) | Sim, como formato de dados | Bom candidato a schema formal para o módulo Content Intelligence (mas hoje só existe para 1 de ~15 clusters) |
| Geração de sitemap dentro de `deploy.sh` | Parcial | Lógica de varredura de `index.html` pode ser extraída para um módulo compartilhado (`site-indexer`) e reutilizada tanto pelo deploy quanto pelo indexer, evitando duplicação |
| `reports/*.md` (formato de relatório) | Sim, como template de saída | Os relatórios manuais anteriores já seguem um formato (Health Dashboard, Fila de Ação Priorizada, tabela por post) que pode virar o output padrão do SEO Auditor V2 |
| `robots.txt` / `sitemap.xml` | Não precisam mudar | V2 deve gerá-los do mesmo jeito, não substituir |

## 6. Technical Debt

- **Nenhum script de análise versionado no repo** — todo o trabalho de auditoria até aqui foi feito ad-hoc por sessões de agente com `grep`/leitura manual, sem reprodutibilidade nem histórico de execução dentro do git. Reports existem mas não os comandos que os geraram.
- **Instrumentação de cluster inconsistente**: apenas 1 cluster de ~15 tem `cluster-plan.json`/`cannibalization-report.md`/etc. Os outros 60 posts não têm planejamento formal versionado — dificulta um Content Intelligence module que espera esse formato universalmente.
- **`.htaccess` fora do repo**: redirects 301 de slug vivem só no servidor, não versionados, não auditáveis localmente. Risco de drift entre o que o time acha que está redirecionando e o que realmente está.
- **Sem testes automatizados de nenhum tipo** (HTML, links, schema, deploy) — a única validação hoje é o `deploy.sh` (title + imagens existem) rodado no momento da publicação, não em CI.
- **Arquivos temporários não limpos automaticamente** (`.tmp_*` na raiz) — já mitigado por `.gitignore`, mas indica ausência de convenção de scratch dir dentro do próprio fluxo do projeto.
- **CSS inline duplicado em cada `index.html`** (não é bug, é decisão de arquitetura para site estático simples) — qualquer módulo V2 que precise editar HTML em massa precisa lidar com isso com cuidado (parsing HTML real, não regex ingênuo, para evitar quebrar `<style>`).

## 7. Current SEO Capabilities

| Recurso | Status |
|---|---|
| `<title>` único por página | ✅ Existente (confirmado, 72 títulos verificados sem duplicata em auditoria anterior) |
| Meta description | ✅ Existente (nenhuma ausente/duplicada) |
| H1 | ✅ Existente |
| H2/H3 hierarquia | ⚠️ Parcial — vários posts satélite têm só 2 H2 (conteúdo raso, ver `reports/blog-audit-2026-08-24.md`) |
| Slug | ✅ Existente, com histórico de mudanças documentado (memória do usuário: `smartpetgadgets-slug-changes.md`) |
| Canonical | ✅ Existente, self-referencing em 100% dos artigos |
| robots.txt | ✅ Existente, inclui crawlers de IA |
| sitemap.xml | ✅ Existente, gerado automaticamente no deploy |
| Schema Article/BlogPosting | ✅ Existente em ~100% dos posts |
| Schema Person (autor) | ✅ Existente e consistente (confirmado corrigido em auditoria anterior) |
| Schema Organization | ✅ Existente |
| Schema BreadcrumbList | ✅ Existente |
| Schema FAQPage | ⚠️ Parcial — 30/73 posts (~41%) |
| Schema Product/Review/Rating | ⚠️ Parcial — apenas em posts de review de produto específico |
| Links internos | ⚠️ Parcial — arquitetura pilar↔satélite existe, mas havia (antes da correção já aplicada) 6 posts órfãos; não há garantia automatizada de que isso não recorra |
| Links externos | ✅ Existentes (1113 ocorrências contadas), não classificados por tier de fonte |
| Alt text em imagens | ✅ 100%, zero ausente |
| `loading="lazy"` em imagens não-hero | ✅ 100% |
| OG tags / Twitter Card | ✅ Existente na home; presença em posts individuais não auditada nesta sessão |
| Detecção de canibalização | ⚠️ Só feita manualmente/ad-hoc (última vez: 2026-08-24, resultado: nenhuma ALTO/MÉDIO) |

## 8. Current Content Architecture

- **Unidade de conteúdo:** 1 pasta = 1 URL = 1 `index.html` autocontido.
- **Padrões de post identificados:** pillar ("Guia Completo 2026"), listicle ("Melhor X: os 8 mais vendidos"), product-review ("X Review Completo"), comparativo ("X vs Y"), FAQ/dúvidas (`duvidas-*`), erros comuns (`erros-comuns-*`).
- **Clusters temáticos por produto:** comedouro automático, coleira GPS, câmera pet, porta eletrônica, brinquedo interativo, e alguns posts avulsos (tapete higiênico, cercado, soprador) que a própria auditoria já sinalizou como fracamente conectados ao resto do site.
- **Formato de planejamento de cluster** (quando existe): JSON com `id`, `title`, `primary_keyword`, `secondary_keywords`, `search_volume_estimate`, `template`, `word_count_target`, `links_to`, `links_from` — só usado em 1 cluster.
- **Briefs e calendários:** existem mas cobrem apenas uma fração do conteúdo publicado (1 brief, 1 calendário mensal) — não há garantia de que todo post futuro passe por esse processo.
- **Autoria:** um único autor (Nildo Alves), com página de autor própria e schema Person consistente.

## 9. Current Deployment Architecture

Ver diagrama na seção 2. Pontos relevantes para a V2:

- Autenticação: chave SSH (recomendado) ou senha via `sshpass` (fallback), nunca hardcoded — credenciais vêm de `.claude/skills/blog/scripts/.env` (gitignored) ou variáveis de ambiente exportadas na sessão.
- `deploy.sh` é **idempotente por post**: `rsync --delete` sincroniza a pasta remota daquele slug especificamente, sem tocar em outras pastas.
- Sitemap e home (`index.html` da raiz) são sempre resincronizados a cada deploy de qualquer post — efeito colateral desejado (mantém sitemap atualizado) mas significa que **qualquer deploy de post único já sobrescreve a home remota** com a versão local.
- Não existe backup/rollback automatizado no script. A auditoria anterior usou uma pasta `.media-backup/` manual, criada e depois apagada por sessão, não uma prática de rollback do `deploy.sh`.
- Não existe dry-run nem staging remoto — o deploy vai direto para produção.

## 10. Current APIs and Integrations

**Sem API externa (hoje):**
- Deploy (SFTP/SSH via `rsync`) — infraestrutura, não é "SEO/content" API, mas está listada porque é a única integração externa que o repo de fato usa.
- Geração de sitemap — 100% local.

**API externa usada indiretamente (fora deste repo, via skills globais do Claude Code):** WebSearch/WebFetch para pesquisa (usado pela skill `blog-researcher`/`blog-discourse`/`blog-google` do ambiente do usuário, não versionado aqui). Não há chave de API própria do projeto para isso guardada no repo.

**Nenhuma API paga está configurada neste repositório** (sem `.env` de SERP API, DataForSEO, YouTube Data API, TTS, geração de imagem, etc. dentro de `.claude/skills/blog/scripts/`).

Necessidades futuras identificadas para os módulos V2 propostos pelo usuário, separadas conforme solicitado:

| Funcionalidade V2 | Sem API externa | Precisa de API externa |
|---|---|---|
| Site Indexer (varrer HTML local, extrair title/meta/H1-H3/schema/links/imagens) | ✅ 100% local | — |
| SEO Auditor (regras on-page, canibalização por similaridade de título/keyword, órfãos) | ✅ 100% local | — |
| Internal Linking suggestions (baseado no índice já construído) | ✅ 100% local | — |
| SERP Analysis / Search Intent / rank tracking | — | ✅ Sim (ex.: DataForSEO, SerpApi, ou Google Search Console API já usada em auditorias passadas do usuário) |
| Competitor Analysis / Content Gap | — | ✅ Sim (mesma API de SERP, + scraping/WebFetch de páginas concorrentes) |
| Keyword research / volume real | — | ✅ Sim (Google Ads Keyword Planner API, ou DataForSEO) |
| YouTube video discovery para Video Intelligence | — | ✅ Sim (YouTube Data API v3) |
| Transcrição de vídeo | — | ✅ Sim (ex.: Whisper API ou similar) |
| Geração de voz (audio/podcast) | — | ✅ Sim (já há precedente: skill `blog-audio` usa Gemini TTS fora deste repo) |
| Geração de imagem | — | ✅ Sim (já há precedente: skill `blog-image` usa Gemini via MCP fora deste repo) |
| Geração/publicação de vídeo | — | ✅ Sim (nenhuma integração hoje) |
| GSC performance (indexação, cliques, impressões) | — | ✅ Sim (Search Console API — mencionado na memória do usuário como já usado manualmente, não integrado ao repo) |

Nenhuma dessas APIs foi instalada ou configurada nesta auditoria, conforme instruído.

## 11. Proposed V2 Architecture

```
                         V1 (preservado, intocado)
                         ┌─────────────────────────┐
                         │  post/index.html + img/  │
                         │  deploy.sh (SFTP/SSH)    │
                         └────────────┬─────────────┘
                                      │ lê (read-only)
                                      ▼
                         ┌─────────────────────────┐
                         │   Site Indexer (V2.0)    │  → gera índice local (JSON)
                         │  varre todo o repo local │     de: posts, títulos, metas,
                         │  (sem tocar nada)        │     H1-H3, schema, links, imgs
                         └────────────┬─────────────┘
                                      │ consome índice
                    ┌─────────────────┼──────────────────┐
                    ▼                 ▼                  ▼
        ┌───────────────────┐ ┌──────────────┐  ┌──────────────────┐
        │  SEO Auditor       │ │  Content     │  │  Internal Linking │
        │  (V2.0)             │ │  Intelligence│  │  Suggestor (V2.3) │
        │  score on-page,     │ │  (briefs,    │  │                    │
        │  canibalização,     │ │  outlines,   │  │                    │
        │  órfãos, FAQ gap    │ │  clusters)   │  │                    │
        └──────────┬──────────┘ └──────┬───────┘  └─────────┬─────────┘
                    │                   │                    │
                    ▼                   ▼                    ▼
        ┌───────────────────────────────────────────────────────────┐
        │           Auto Fix (V2.4) — propõe diffs, nunca aplica     │
        │           sem revisão explícita; sempre com backup local   │
        └───────────────────────────────────┬─────────────────────────┘
                                              │ só depois de aprovado
                                              ▼
                                   deploy.sh (V1, sem mudança)
```

Módulos que dependem de API externa (SERP Research, Competitor Analysis, Video Intelligence) ficam como **camadas opcionais plugadas no Site Indexer / Content Intelligence**, não como dependência obrigatória do core.

## 12. Proposed V2 Modules

1. **Site Indexer** — varre todas as pastas com `index.html` (exceto infraestrutura), extrai: title, meta description, H1/H2/H3, canonical, JSON-LD (todos os `@type`), links internos/externos, imagens (`src`, `alt`, `loading`), presença de vídeo. Produz `index.json` versionável. Reaproveita a lógica de varredura já existente em `deploy.sh` (seção "gerar sitemap").
2. **SEO Auditor** — consome `index.json`, aplica as mesmas regras já usadas manualmente nos `reports/*.md` (duplicidade de title/meta, canibalização por similaridade de keyword, posts órfãos por contagem de inbound links, FAQPage ausente, H2 insuficiente) e gera relatório no mesmo formato Markdown já em uso.
3. **Content Intelligence** — generaliza o formato `cluster-plan.json` (hoje usado só em 1 cluster) para todos os clusters existentes e futuros; suporta geração de outline/brief a partir do índice.
4. **Internal Linking Suggestor** — usa `index.json` + `cluster-plan.json` para sugerir (não aplicar) links pilar↔satélite ausentes, generalizando o que já foi feito manualmente na sessão de 2026-08-24.
5. **Auto Fix** — camada que recebe sugestões do SEO Auditor / Internal Linking Suggestor e propõe patches (diff), exigindo aprovação explícita antes de qualquer escrita em `index.html`; sempre cria backup antes de qualquer alteração.
6. **Affiliate Content (Review/Ranking/Comparison Engine)** — módulo de geração assistida para os 3 formatos já identificados no acervo atual (`*-review`, `melhor-*`, `*-x-*`), usando os posts existentes como template.
7. **Video Intelligence** — fases conforme proposto pelo usuário; depende de API externa (YouTube Data API) a partir da fase 1.

## 13. Proposed Directory Structure

A estrutura sugerida pelo usuário faz sentido **com um ajuste**: hoje só existe uma skill (`blog`) dentro de `.claude/skills/`; as demais citadas na pergunta (blog-audit, blog-analyze, blog-cluster etc.) são skills **globais** do Claude Code do usuário, fora deste repo. Se a intenção da V2 é que os módulos fiquem **dentro deste repositório** (versionados, ligados ao conteúdo específico deste site), a estrutura abaixo é adequada:

```
.claude/skills/
├── blog/                  # existente — deploy (não tocar)
├── site-indexer/          # V2.0 — varredura local, gera index.json
├── seo-auditor/           # V2.0 — regras on-page + canibalização + órfãos
├── content-planner/       # V2.2/V2.3 — briefs/outlines/clusters generalizados
├── internal-linking/      # V2.3 — sugestões de link pilar↔satélite
├── seo-research/          # V2.1 — SERP/Search Intent (requer API externa)
├── affiliate/             # V2.5 — review/ranking/comparison engine
└── video-intelligence/    # V2.6 — requer API externa desde a fase 1
```

mais um diretório de dados gerados (não código):

```
.data/
├── index.json              # saída do Site Indexer (git-ignorado ou versionado — decisão em aberto, ver seção 22)
└── reports/                # saída do SEO Auditor — pode reaproveitar reports/ já existente
```

Recomendação: **não criar todos os diretórios de uma vez**. Validar com `site-indexer/` + `seo-auditor/` primeiro (V2.0); os demais só devem ser criados quando a fase correspondente do roadmap começar, para evitar esqueleto vazio sem uso.

## 14. API Requirements

Ver tabela completa na seção 10. Resumo de prioridade:

- **V2.0 (Site Indexer + SEO Auditor): zero APIs externas.** Pode ser implementado e testado 100% localmente contra os 73 posts já existentes.
- **V2.1 (SERP Research): precisa de 1 API de SERP/keyword** (ex.: DataForSEO, já mencionado como referência de custo em outra skill do ambiente do usuário — ~$0.01/call).
- **V2.5 (Affiliate engine): nenhuma API obrigatória**, mas se quiser preço/estoque em tempo real do Mercado Livre, precisaria de scraping ou API não oficial (fora do escopo desta auditoria, não avaliado).
- **V2.6 (Video Intelligence): YouTube Data API** no mínimo; transcrição e TTS são fases posteriores dentro do próprio V2.6.

## 15. Security

- Credenciais de deploy já seguem boa prática: chave SSH preferencial, `.env` gitignored, nunca hardcoded no script (confirmado lendo `deploy.sh` linha a linha).
- `.claude/skills/blog/scripts/.env` **existe localmente** (fora do git, confirmado via `.gitignore` da pasta) — não foi lido o conteúdo nesta auditoria (não necessário e evitado deliberadamente).
- Nenhuma chave de API para os futuros módulos V2 está configurada ainda — quando forem adicionadas, devem seguir o mesmo padrão: `.env` por skill, nunca no código, nunca commitado.
- Recomendação para V2: cada novo módulo com API externa deve ter seu próprio `.env.example` dentro da própria pasta da skill (mesmo padrão do `blog/scripts/.env.example`), documentado no respectivo `SKILL.md`.
- O Auto Fix (módulo V2.4) é o maior risco de segurança/integridade de conteúdo da V2: deve **nunca escrever direto em produção**, sempre operar sobre os arquivos locais do repo, exigir aprovação humana explícita, e criar backup antes de qualquer escrita (mesmo padrão manual já usado na sessão de otimização de mídia de 2026-08-24, mas automatizado).

## 16. Backward Compatibility

- Nenhum módulo V2 proposto (Site Indexer, SEO Auditor, Content Intelligence, Internal Linking) precisa modificar `deploy.sh` ou o formato de `index.html` existente para funcionar — todos são consumidores read-only do HTML atual.
- O único módulo que eventualmente escreve em `index.html` é o Auto Fix, e mesmo esse deve operar por diffs revisáveis, não substituição de arquivo.
- `deploy.sh` continua sendo o único caminho de publicação — a V2 não deve introduzir um segundo mecanismo de deploy paralelo.

## 17. Testing Strategy

- **Testes unitários:** para o parser HTML do Site Indexer (extração de title/meta/schema/links) — usar uma amostra fixa de 3-5 `index.html` reais do repo como fixtures, cobrindo os formatos distintos (post simples sem FAQ, post com FAQPage, post de review com Product/Rating, página institucional).
- **Testes de integração:** rodar o Site Indexer contra o repo inteiro e validar que o número de posts encontrados bate com a contagem manual (73, conforme `reports/seo-audit-2026-08-24.md`) e que o sitemap gerado pelo indexer é idêntico ao gerado por `deploy.sh` para o mesmo conjunto de arquivos.
- **Validação HTML:** manter a validação já existente em `deploy.sh` (title presente, imagens existem) e estender no SEO Auditor para JSON-LD válido (parse sem erro) e tags balanceadas.
- **Validação SEO:** comparar a saída do novo SEO Auditor contra os `reports/*.md` já existentes como "golden output" — se o auditor V2 não reproduzir os achados já confirmados manualmente (ex.: 30/73 com FAQPage, 6 órfãos antes da correção), há bug no auditor, não no conteúdo.
- **Testes de deploy:** `deploy.sh` já não deve ser alterado; se algum módulo V2 vier a chamá-lo programaticamente, testar em modo dry-run contra uma pasta de post fake antes de qualquer chamada real.
- **Testes de rollback:** para o Auto Fix, testar o ciclo backup → aplicar patch → restaurar backup em um post de teste (não em produção) antes de liberar o módulo para uso real.
- **Testes de API:** para módulos V2.1+ (SERP, YouTube etc.), usar mocks/fixtures de resposta da API nos testes, nunca bater na API real em CI.
- **Testes com artigos existentes:** todo módulo novo deve ser validado primeiro contra os 73 posts já publicados antes de ser usado para gerar/alterar conteúdo novo.

## 18. Migration Strategy

- Trabalho de V2 continua inteiramente na branch `develop-v2`; `main` permanece como V1 estável e não é tocada.
- Cada módulo (Site Indexer, SEO Auditor, etc.) pode ganhar sua própria sub-branch a partir de `develop-v2` se o trabalho ficar grande, com merge de volta para `develop-v2` ao final de cada fase do roadmap.
- Promoção `develop-v2 → main` só deve acontecer quando um módulo estiver testado e não houver nenhuma alteração ao mecanismo de deploy ou aos `index.html` de produção sem revisão humana explícita.
- Rollback: como a V2 é aditiva (novos diretórios `.claude/skills/*` + `.data/`), reverter é trivial — remover a pasta do módulo não afeta V1. O risco real de rollback só existe se/quando o Auto Fix (V2.4) começar a escrever em `index.html` de produção; para essa fase, backup automático antes de cada escrita é obrigatório (ver seção 15).

## 19. Implementation Roadmap

Mantendo a divisão sugerida pelo usuário — ela já reflete corretamente a dependência real de APIs (módulos locais primeiro, módulos com API externa depois):

| Fase | Escopo | Depende de API externa? |
|---|---|---|
| V2.0 | Site Indexer + SEO Auditor | Não |
| V2.1 | SERP Research + Search Intent | Sim |
| V2.2 | Competitor Analysis + Content Gap | Sim |
| V2.3 | Cannibalization automatizada + Internal Linking Suggestor | Não (usa índice local) |
| V2.4 | SEO Score + Auto Fix | Não (mas é o módulo de maior risco — precisa de aprovação humana e backup) |
| V2.5 | Review + Ranking + Comparison Engine (Affiliate) | Não obrigatório |
| V2.6 | Video Intelligence (fases 1-6 do usuário) | Sim, desde a fase 1 |
| V3 | AI Video Generation | Sim |

Sugestão de ajuste: mover **V2.3 (Cannibalization + Internal Linking) para antes de V2.1/V2.2**, já que V2.3 não depende de nenhuma API externa e reaproveita diretamente o índice local do V2.0 — entregaria valor mais cedo sem custo de API. Ordem alternativa: V2.0 → V2.3 → V2.1 → V2.2 → V2.4 → V2.5 → V2.6 → V3. Decisão final cabe ao usuário (ver seção 22).

## 20. Risks

- **Auto Fix escrevendo em produção sem revisão** — maior risco técnico da V2; mitigação: aprovação humana obrigatória + backup automático + diff revisável antes de qualquer escrita (detalhado nas seções 15 e 17).
- **Divergência entre o índice do Site Indexer e a realidade do `.htaccess` remoto** — o índice local não vê os redirects 301 que só existem no servidor; qualquer análise de "URL órfã" ou "link quebrado" feita só localmente pode ter falso positivo/negativo em relação a slugs antigos redirecionados. Mitigação: manter uma cópia local documentada do `.htaccess` (mesmo que só como referência, atualizada manualmente) — hoje nem isso existe no repo.
- **Custo de API não orçado** — nenhuma chave de SERP/YouTube/etc. está configurada; V2.1+ não pode começar sem decisão de orçamento e provedor.
- **Duplicação de lógica entre `deploy.sh` (geração de sitemap) e o novo Site Indexer** se não forem cuidadosamente desacoplados — risco de os dois divergirem com o tempo. Mitigação: extrair a lógica de varredura para um módulo compartilhado que ambos chamam (ou aceitar a duplicação controlada, documentando explicitamente a decisão).
- **Inconsistência de instrumentação de cluster** — só 1 de ~15 clusters tem `cluster-plan.json`; se o Content Intelligence (V2.2/V2.3) assumir esse formato como universal, vai falhar/produzir lacunas para os outros 14 clusters até que sejam retroativamente documentados.

## 21. Recommended First Implementation

**Site Indexer (V2.0), sozinho, sem SEO Auditor ainda.** Justificativa: é o único módulo do qual todos os outros dependem (inclusive SEO Auditor, Internal Linking, Content Intelligence), tem zero dependência de API externa, e pode ser validado objetivamente contra os relatórios manuais já existentes (`reports/blog-audit-2026-08-24.md` e `reports/seo-audit-2026-08-24.md` servem como "golden answer" para verificar se o indexer está extraindo os dados certos). Só depois de o índice estar validado e estável faz sentido construir o SEO Auditor por cima dele.

## 22. Questions / Decisions Required

1. **Formato/persistência do índice:** `index.json` deve ser versionado no git (histórico de mudanças do site ao longo do tempo) ou gerado sob demanda e ignorado (`.gitignore`, como artefato derivado)? Afeta o tamanho do repo e a estratégia de diff.
2. **Onde os módulos V2 devem viver de fato:** dentro de `.claude/skills/*` (como o usuário sugeriu) ou em uma pasta separada tipo `tools/` fora do namespace de skills do Claude Code? A resposta muda se a intenção é que os módulos sejam invocáveis como skills (`/site-indexer`, `/seo-auditor`) ou apenas scripts internos chamados por uma skill orquestradora única.
3. **Linguagem/runtime dos módulos:** o repo não tem nenhuma dependência de Node ou Python hoje (nenhum `package.json`/`requirements.txt`). Qual linguagem para os novos módulos? Isso determina se será preciso introduzir `requirements.txt`/`package.json`/etc. pela primeira vez no repo.
4. **Orçamento e provedor de API para V2.1+** (SERP/keyword research) — nenhuma decisão tomada ainda; necessário antes de iniciar V2.1.
5. **Reordenar o roadmap** para priorizar V2.3 (Internal Linking, sem API) antes de V2.1/V2.2 (com API)? Ver sugestão na seção 19.
6. **Retroativar `cluster-plan.json` para os ~14 clusters sem ele** antes ou depois de construir o Content Intelligence (V2.2/V2.3)? Afeta se o Content Intelligence pode assumir esse formato como universal desde o início.
7. **Política de FAQPage ausente (43/73 posts):** a V2 deve incluir um módulo específico para gerar/sugerir FAQPage automaticamente, ou isso fica fora de escopo da "SEO Content Intelligence" e continua manual?

---

## Confirmação Final

- **Branch atual:** `develop-v2`
- **Status do git ao final desta auditoria:** limpo, exceto pelo novo arquivo `V2-ARCHITECTURE-AUDIT.md` (não commitado — commit não realizado, conforme instrução de não fazer commit/push nesta etapa).
- **Arquivos modificados:** nenhum. Nenhum arquivo existente foi alterado, nenhuma dependência instalada, nenhum deploy executado, nenhuma credencial acessada ou alterada.
- **Único artefato criado:** este relatório, `V2-ARCHITECTURE-AUDIT.md`, na raiz do repositório.
