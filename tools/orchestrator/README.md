# Orchestrator

Sexto módulo da V2 (entrega parcial — etapas 1-6 do roadmap da
arquitetura). Camada de orquestração **pré-escrita**: responde "este
artigo merece existir, e com qual função?" antes de qualquer texto ser
produzido, reaproveitando os módulos V2 já existentes em vez de duplicar
sua lógica, e entrega um brief estruturado como ponte para a skill global
de escrita.

Ver `V2-ORCHESTRATOR-ARCHITECTURE.md` (na raiz do repo) para a arquitetura
completa aprovada, incluindo as etapas ainda não implementadas
(Quality Gate, deploy-gate).

## Escopo desta entrega

Implementado:
- `propose` — recebe tema/keyword/tipo/cluster candidatos em linguagem
  natural, grava `article-proposal.json`.
- `intent-classifier` — classifica intenção de busca (informational/
  commercial/transactional/navigational), estágio de funil e tipo de
  página recomendado, por heurística lexical local. Nunca usa dado de
  ferramenta externa — volume/dificuldade/CPC/posição sempre aparecem
  como `"não disponível"`.
- `preflight` — agrega, sobre a proposta: colisão de slug, checagem de
  cluster candidato (usando `buildLinkGraph` de `tools/seo-auditor` para
  contagem real de links de entrada), canibalização pré-escrita
  (reaproveita `tools/cannibalization/src/simulate.js`, incluindo
  `differentiation_signals`) e plano de internal linking pré-escrita
  (reaproveita `tools/internal-linking/src/simulate.js`).
- `brief-builder` — transforma `article-proposal.json` +
  `preflight-report.json` em `article-brief.md`. É um TRANSFORMADOR, não
  um novo mecanismo de SEO: nunca roda análise nova, nunca inventa dado
  ausente (`"não disponível"` sempre que a fonte não existir), nunca
  suaviza uma decisão do preflight (ex: nível HIGH de canibalização nunca
  aparece atenuado). Título/H1/meta description/outline ficam
  explicitamente `"não disponível"` — geração desses campos está fora do
  escopo desta etapa.

- `quality-gate` (comando `validate <slug>`) — roda sobre um artigo JÁ
  ESCRITO localmente (ainda não publicado). Reaproveita `seo-auditor`
  (SEO técnico: H1/title/description/canonical/schema/links/imagens/
  orfandade), `cannibalization` (canibalização real pós-escrita, com
  conteúdo de verdade) e adiciona checagens próprias: schema × conteúdo
  visível (FAQPage/Review/Rating/preço/autor/headline), E-E-A-T (claim de
  experiência pessoal sem confirmação), e densidade de keyword. Critérios:
  - BLOCKER: defeito estrutural real (H1/title ausente, imagem quebrada,
    schema afirmando algo não visível, canibalização HIGH, claim de teste
    pessoal não confirmado, densidade de keyword absurda ≥8%).
  - WARNING: canibalização MEDIUM, densidade de keyword 3-8%, plano de
    linking sugerido não aplicado, e o que já era WARNING no seo-auditor.
  - Nunca bloqueia por ausência de elemento opcional (FAQ, vídeo, WebP,
    schema opcional).
  - Validado contra os 67 posts reais publicados: 0 falso positivo.

- `deploy-gate` (comando `publish <slug>`) — relê `.data/pipeline/<slug>/
  quality-gate.json` a cada chamada (nunca confia em uma execução
  anterior de `validate`), confere que o arquivo existe, é JSON válido,
  pertence ao MESMO slug e tem `status === "APPROVED"`. Só então invoca
  `deploy.sh <slug>` — exatamente como já funciona hoje, sem novos
  argumentos. Qualquer uma das 4 condições falhando bloqueia sem chamar
  o script. `deployAction` é injetável para teste — nenhum teste desta
  etapa toca o `deploy.sh` real.

Pipeline completo agora disponível end-to-end nesta camada: `propose →
preflight → brief → [blog-write, skill global] → validate → publish`.

## Por que a canibalização e o internal linking pré-escrita são "aproximados"

O artigo ainda não existe, então não há corpo de texto real para
comparar — só `theme`/`keyword_candidate`/`headings` (se informados) da
proposta. O componente de conteúdo do score de canibalização (peso
25/100) fica sempre zerado; o plano de internal linking usa apenas
headings planejados do lado da proposta. Isso significa que os dois
sinais tendem a **subestimar** o risco/oportunidade real — são alertas
precoces, não veredito final. Todo `preflight-report.json` (e, por
consequência, todo `article-brief.md`) lista essa limitação
explicitamente em `limitations`.

## Como executar

```bash
cd tools/orchestrator
npm install   # sem dependências externas, mas mantém o padrão dos outros módulos
npm test

node src/index.js propose "Comedouro Automático para Dois Gatos" \
  --keyword "comedouro automático para 2 gatos" \
  --cluster comedouro-automatico-para-pet

node src/index.js preflight comedouro-automatico-para-dois-gatos

node src/index.js brief comedouro-automatico-para-dois-gatos
```

Requer `.data/site-index.json` atualizado (rode `site-indexer` antes, se
necessário — mesma dependência dos outros módulos V2).

## Artefatos gerados

- `.data/pipeline/<slug>/article-proposal.json`
- `.data/pipeline/<slug>/preflight-report.json`
- `.data/pipeline/<slug>/article-brief.md`

Nenhum HTML de artigo é escrito por este módulo. Nenhum deploy é
disparado. Nenhuma das 72 páginas existentes é lida para além de consulta
via `.data/site-index.json` e leitura de texto (somente leitura, para o
componente de conteúdo do plano de internal linking).

## Garantias

- Não acessa a internet, não usa APIs externas, não usa IA/embeddings.
- Não escreve artigos, não modifica HTML, não modifica os JSONs das fases
  anteriores, não faz deploy.
- Não modifica `deploy.sh`, `tools/cannibalization/`, `tools/seo-auditor/`
  nem nenhum outro módulo existente — só os importa como biblioteca
  (`require`), em modo leitura.
- Determinístico: mesma entrada sempre produz o mesmo resultado (a menos
  do campo `generated_at`).
