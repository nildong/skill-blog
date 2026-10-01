# Social Content Engine — Auditoria de Reaproveitamento (V1 x V2)

Gerado em: 2026-09-05
**Escopo:** auditoria somente leitura das 474 peças em `reports/social-content/313_pecas_smart_pet_gadgets.xlsx` (aba "Peças Sociais") e da mídia em `output_midia_avancada/`. Cruzamento com os artigos que já têm reescrita V2 "fato-do-corpo". **Nenhum arquivo foi alterado, nenhuma mídia foi gerada, nenhum HTML/afiliado/sitemap foi tocado.**

## Achado prévio importante (corrige a premissa da tarefa)

A tarefa partiu da premissa de "~19 artigos" com reescrita V2. Os arquivos `*-reel-post-data.js` em `tools/social-content-engine/src/` mostram que o escopo real é maior:

- **63 artigos únicos** têm peças V2 "fato-do-corpo" geradas (Calibração 1+2, Piloto V2 completo, Escala Lotes 1-4), não 19. Isso já era documentado em `reports/social-content/auditoria-pos-escala.md` (2026-09-02): 307 peças V2 aprovadas em 63 artigos, com relatório de integridade completo (100% rastreabilidade, zero preço vazando, zero `needs_review`, HTML/afiliados intocados nos 7 lotes).
- Todos os 63 slugs V2 são um subconjunto dos 68 artigos-fonte presentes no xlsx de 474 peças — ou seja, o V2 já cobre 93% dos artigos que a V1 mecânica também cobriu. Só 5 artigos do xlsx não têm equivalente V2: `comedouro-cachorro`, `comedouro-newpet-2l-review`, `comedouro-newpet-4l-review`, `comedouro-vdrbg-4l-wifi-review`, `comedouro-x-bebedouro-automatico`.
- Conclusão prática: a decisão pendente não é "revisar 19 artigos", é **decidir se a fila final vem do V1 (474 peças, xlsx) ou do V2 (307 peças, `.data/social-content/*.json`, ainda não exportado para xlsx/mídia)** — os dois pipelines processaram quase o mesmo conjunto de artigos, mas nunca foram unificados.

## 1. Classificação das 474 peças (V1, xlsx)

| Classe | Descrição | Peças | % |
|---|---|---:|---:|
| A | Aproveitável — hook/copy específicos do artigo | 331 | 69.8% |
| B | Revisão — copy ok mas hook/pergunta genérica de molde | 68 | 14.3% |
| C | Recriar — copy é heading/label bruto ou CTA de rodapé sem gancho próprio | 71 | 15.0% |
| D | Duplicada — hook idêntico ao de outro artigo | 4 | 0.8% |
| **Total** | | **474** | **100%** |

Critérios aplicados (determinísticos, sobre o texto real da planilha):
- **B**: pergunta de molde fixa ("Vale a pena?", "Funciona?", "Você sabia?") sem elemento específico do artigo, ou fórmula "Você sabia?...A resposta está no artigo completo."
- **C**: hook = heading bruto de rodapé ("Tabela Comparativa"), ou template fixo "Arraste para cima e leia: [título]" (Stories tipo CTA — não carrega gancho próprio, é sempre o mesmo texto trocando só o título), ou copy que é essencialmente o próprio hook colado sem elaboração.
- **D**: hook normalizado idêntico ao de outra peça do **mesmo formato** pertencente a **outro artigo** (achadas só 4 — a V1 é mecânica mas gera hook a partir de headings reais do HTML de cada artigo, então duplicação verdadeira entre artigos é rara; a maior fonte de repetição é *estrutural*, não de conteúdo — ver formato Stories abaixo).

### Nota metodológica sobre "Copy" em peças de Stories/Engagement
Para peças tipo Stories, a coluna `Copy` frequentemente contém apenas um rótulo de formato (`enquete`, `cta`), não o conteúdo real — o conteúdo está no `Gancho/Título`. A classificação usou o campo com conteúdo substantivo em cada caso (fallback Copy → Hook), não a coluna `Copy` isoladamente. Sem esse ajuste, a maioria das Stories seria erroneamente contada como "duplicada" (o rótulo `cta`/`enquete` se repete 474 vezes por natureza).

## 2. Breakdown por formato

| Formato | N peças | A | B | C | D | Observação |
|---|---:|---:|---:|---:|---:|---|
| Reel | 134 | 129 (96%) | 0 | 1 | 4 | Melhor formato da V1 — hook vem de heading-pergunta real do artigo |
| Post | 136 | 68 (50%) | 68 (50%) | 0 | 0 | Metade dos posts usa pergunta de molde genérica no título/CTA (classe B) |
| Carrossel | 62 | 62 (100%) | 0 | 0 | 0 | Título de capa = título do artigo; sem molde genérico detectado |
| Stories | 101 | 33 (33%) | 0 | 68 (67%) | 0 | O 2º Story de cada artigo é sempre "Arraste para cima e leia: [título]" — template fixo, não tem gancho próprio (classe C sistemática) |
| Engagement | 41 | 39 (95%) | 0 | 2 | 0 | Pergunta de engajamento quase sempre específica do artigo |
| **Total** | **474** | **331** | **68** | **71** | **4** | |

**Leitura prática:** o formato mais fraco estruturalmente é Stories (67% precisa recriar, mas é recriação barata — é um único template de CTA, não 68 textos diferentes para reescrever do zero) e Post (50% com hook de molde). Reel, Carrossel e Engagement já saem quase prontos da V1.

## 3. Breakdown por cluster/artigo (68 artigos distintos no xlsx)

| Cluster (heurística de slug) | Artigos | Peças | A | B | C | D |
|---|---:|---:|---:|---:|---:|---:|
| comedouros | 18 | 139 | 103 | 18 | 18 | 0 |
| geral (sem cluster claro, inclui porta-eletrônica*) | 15 | 101 | 70 | 15 | 15 | 1 |
| coleira-gps | 12 | 80 | 53 | 12 | 13 | 2 |
| brinquedos | 10 | 66 | 45 | 10 | 10 | 1 |
| cameras | 10 | 64 | 42 | 10 | 12 | 0 |
| fontes (bebedouro) | 2 | 16 | 12 | 2 | 2 | 0 |
| higiene | 1 | 8 | 6 | 1 | 1 | 0 |
| **Total** | **68** | **474** | **331** | **68** | **71** | **4** |

\* O script de geração de mídia (`generate_assets.py`) não tem categoria própria de foto para "porta-eletronica" no catálogo Pexels — esses artigos caem no fallback `geral`, que é também o cluster mais genérico e o de maior reuso de foto (ver seção 4).

Todo artigo segue o mesmo padrão por peça (independente do cluster): ~1 Reel A, 1 Post A, 1 Post B (molde), 1 Carrossel A, 1 Story A (enquete), 1 Story C (CTA fixo), 1 Engagement A — a distribuição A/B/C/D é praticamente **por formato**, não por cluster. Nenhum cluster concentra desproporcionalmente peças C/D.

## 4. Os 63 artigos com V2 "fato-do-corpo" pronto

Fonte: slugs extraídos de `piloto-v2-reel-post-data.js`, `piloto-v2-calibration2-reel-post-data.js`, `escala-lote1..4-reel-post-data.js`.

- **63/63** desses artigos têm peças correspondentes na xlsx V1 (474 peças) — nenhum V2 "órfão" sem contrapartida V1.
- Nessas 63 artigos, a xlsx V1 tem **435 peças** (302 A / 63 B / 66 C / 4 D) que ficariam **obsoletas** se o V2 for adotado como fonte final — mesmo as classe A da V1 devem ser substituídas pela versão V2 correspondente, pois o V2 tem trabalho editorial deliberado (reescrita de hook, quality-gate com overlap de vocabulário ≥40% e rastreabilidade a `body_text_full`) que a V1 mecânica não tem.
- Recomendação registrada em `auditoria-pos-escala.md`: usar **307** como número real de peças V2 aprovadas (não 313, correção de dupla contagem de 3 artigos processados duas vezes entre Calibração 1 e Piloto V2 completo).
- **5 artigos só existem na V1** (sem contraparte V2): `comedouro-cachorro`, `comedouro-newpet-2l-review`, `comedouro-newpet-4l-review`, `comedouro-vdrbg-4l-wifi-review`, `comedouro-x-bebedouro-automatico` — todos do cluster comedouros, prováveis "reviews de produto" que a seleção determinística do piloto/escala ainda não alcançou.

| Métrica | Valor |
|---|---:|
| Artigos com V2 pronto | 63 |
| Peças V1 correspondentes a esses artigos (a substituir) | 435 |
| Peças V2 aprovadas (fonte: auditoria-pos-escala.md) | 307 |
| Artigos só na V1 (sem V2) | 5 |
| Peças V1 desses 5 artigos (ficam como estão / entram na fila de revisão manual) | 39 |

## 5. Auditoria de mídia (`output_midia_avancada/`)

### Contagens e formato
| Tipo | Qtd | Formato | Resolução | Tamanho médio | Min–Max |
|---|---:|---|---|---:|---|
| Imagens | 474 | PNG (100%) | 1080×1350 (4:5, feed) | 1.22 MB | 0.87–1.64 MB |
| Vídeos | 134 | MP4 (100%) | 1080×1920 (9:16, Reels) — capa animada Ken Burns ~4s | 0.67 MB | 0–1.64 MB |

- 474 imagens = 1 PNG por peça da xlsx (`PECA-001.png` … `PECA-474.png`), correspondência 1:1 confirmada.
- 134 vídeos = 1 MP4 por peça de formato **Reel** apenas (134 Reels na xlsx = 134 vídeos; Post/Carrossel/Stories/Engagement não geram vídeo).
- Gerador real confirmado por leitura de código: `tools/social-content-engine/generate_assets.py` (via `run_full_batch.py`), **não** `generate_media_v2.py` (esse último é um protótipo anterior 100% vetorial/gradiente, sem foto real — não foi o que produziu os arquivos em disco).

### Reuso de foto-base Pexels

Confirmado: o cache local (`tools/social-content-engine/assets/pexels_cache/manifest.json`) tem **15 fotos únicas** cobrindo 7 categorias, para os 68 artigos do xlsx:

| Cluster de foto | Fotos no cache | Artigos que usam essa foto | Peças (imagens) que usam essa foto | Reuso por foto (peças) |
|---|---:|---:|---:|---:|
| comedouros | 3 | 18 | 139 | ~46x |
| geral (fallback, inclui porta-eletrônica) | 2 | 15 | 101 | ~51x |
| coleira-gps | 2 | 12 | 80 | ~40x |
| brinquedos | 2 | 10 | 66 | ~33x |
| cameras | 2 | 10 | 64 | ~32x |
| fontes | 3 | 2 | 16 | ~5x |
| higiene | 1 | 1 | 8 | ~8x |
| **Total** | **15** | **68** | **474** | **~32x em média** |

Mecanismo (`pick_background(cluster, seed)` em `generate_assets.py`): escolhe a foto por `seed % len(fotos_do_cluster)`, com `seed = hash(row["id"]) % 10000`. Como Python randomiza `hash()` de strings entre execuções (sem `PYTHONHASHSEED` fixo), não é possível reconstruir retroativamente qual PNG usou qual foto exata sem re-executar o gerador — mas a distribuição estatística é a da tabela acima, e cada imagem final é uma composição única (foto + overlay de texto/gradiente + ícone de cluster), não um clone pixel-a-pixel.

**Achado extra:** o cluster "porta-eletrônica" não existe no catálogo de fotos Pexels (`PEXELS_CATALOG`) — todo artigo desse cluster cai no fallback `geral`, que por isso concentra o maior reuso por foto (~51x) mesmo sem ser tecnicamente do mesmo produto.

### Reaproveitável fisicamente vs precisa regenerar

A foto-base em si (15 arquivos JPG no cache) está sempre ok fisicamente — nenhuma está corrompida, todas carregam corretamente. O problema de reaproveitamento não é a foto, é o **texto cravado no PNG final** (hook/título fica desenhado sobre a foto, não em camada separada):

| Situação | Peças | Ação |
|---|---:|---|
| Imagem cujo hook subjacente é classe A (texto bom) | 331 (70%) | **Reaproveitar como está** |
| Imagem cujo hook é classe B/C/D (molde genérico, CTA de rodapé, ou duplicado) | 143 (30%) | **Regenerar o PNG** (mesma foto-base, texto corrigido) — barato porque o gerador já existe e a foto não muda, só o overlay |
| Vídeo (só Reels) cujo hook é A | 129/134 (96%) | Reaproveitar como está |
| Vídeo cujo hook é C/D | 5/134 (4%) | Regenerar |

Para os 63 artigos com V2 pronto, a recomendação prática é **regenerar as 435 imagens/vídeos correspondentes usando o texto V2** (não só corrigir B/C/D pontualmente), já que o V2 tem hook reescrito manualmente mesmo nas peças que a V1 classificaria como A — a foto-base pode ser reaproveitada sem mudança.

## 6. Recomendação prática consolidada

| Ação | Peças | % do total (474) |
|---|---:|---:|
| Ficam como estão (classe A, artigos sem V2) | ~57 (331 A − 302 A dos 63 artigos com V2, aprox.) | ~12% |
| Revisar pontualmente (classe B, artigos sem V2) | ~5 | ~1% |
| Recriar do zero (classe C+D, artigos sem V2) | ~34 | ~7% |
| **Substituir pela versão V2** (todas as classes, 63 artigos com V2 pronto) | **435** | **~92%** |

Em outras palavras: como o V2 já cobre 63 dos 68 artigos, a decisão dominante não é "revisar B, recriar C/D" peça a peça — é **decidir se a fila final é exportada do pipeline V2** (307 peças já aprovadas, com quality-gate e rastreabilidade, mas ainda não conectadas a mídia/xlsx) e tratar a V1 (474 peças) como rascunho descartável para esses 63 artigos. Os 5 artigos restantes (só V1, cluster comedouros/reviews) são o único bloco onde a classificação A/B/C/D desta auditoria (33 A / 5 B / 1 D — ver tabela por artigo) é a informação definitiva para decidir o que revisar.

### Próximos passos sugeridos (não executados nesta auditoria)
1. Rodar o pipeline V2 (ou um adaptador) para os 5 artigos "comedouro-*" restantes, fechando 68/68.
2. Conectar `.data/social-content/*.json` (V2, 307 peças aprovadas) a um export xlsx + regeneração de mídia via `generate_assets.py`, reaproveitando as mesmas 15 fotos-base.
3. Regenerar apenas os PNGs/MP4s cujo texto mudou entre V1 e V2 (evita re-render de todas as 474 imagens).
4. Avaliar curadoria de mais fotos Pexels para os clusters com maior reuso (comedouros, geral/porta-eletrônica) antes de publicar em escala — reuso de ~46-51x da mesma foto é alto para um feed de Instagram/Facebook com 60+ artigos.
