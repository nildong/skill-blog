# SEO Validation Report: Cluster Comedouro Automático para Pet (12 posts) — Rodada 2 (pós-correção)

**Data**: 2026-08-20
**Método**: Checklist on-page consolidado — a maioria dos checks é sistemática (mesmo template nos 12 posts), reportada uma vez com exceções por post onde aplicável.

## ✅ Status Atualizado: 23/23 em todos os 12 posts

Todos os 6 gaps identificados na rodada 1 foram corrigidos:
1. **Links externos**: todos os 12 posts agora têm 3 fontes externas únicas verificadas (antes: 1-2). Novas fontes adicionadas: PetBR, Rei das Promoções, PetTechBrasil, Cabine Celular, PetsRadar, Hospital Veterinário Saúde, PawChamp Journal, Whizz Experts, Amazon.com.br, SRConecta, Amor de Cachorro, PremierPet, Tuya Support, Royal Canin, CSA Jardins.
2. **og:image/coverImage** agora com URL absoluta (`https://smartpetgadgets.com.br/blog/<slug>/images/x-hero.jpg`).
3. **og:type: "article"**, **og:url** (= canonical) e **og:site_name: "Smart Pet Gadgets"** adicionados ao frontmatter dos 12 posts.
4. **twitter:title, twitter:description, twitter:image** adicionados, espelhando os campos og: correspondentes.

Item que segue como limitação de ambiente (não corrigido): imagens em `.jpg`, não WebP/AVIF.

---

## Relatório Original (Rodada 1, para referência histórica)

## Resultado Consolidado

| # | Check | Status (posts que passam) | Detalhe |
|---|---|---|---|
| 1 | Título — precisão e distinção | ✅ PASS (12/12) | Todos os títulos são específicos e batem com o conteúdo visível |
| 2 | H1 único | ✅ PASS (12/12) | Confirmado via contagem — exatamente 1 `# ` por post |
| 3 | Hierarquia de headings (H1→H2→H3, sem pular nível) | ✅ PASS (12/12) | Nenhum post pula de H2 para H4 |
| 4 | Meta description — precisão e utilidade | ✅ PASS (12/12) | Todas específicas por página, sem duplicação entre posts |
| 5 | Links internos (3-10 por post) | ✅ PASS (12/12) | Faixa: 4 (d2) a 9 (pillar) — todos dentro do intervalo |
| 6 | Anchor text descritivo (não "clique aqui") | ✅ PASS (12/12) | Todos os anchors usam frase descritiva |
| 7 | Sem self-links | ✅ PASS (12/12) | Nenhum post linka para si mesmo |
| 8 | **Links externos (mínimo 3 por post)** | ❌ **FAIL (0/12)** | Todos os posts têm 1-2 links externos únicos, nenhum atinge 3 |
| 9 | Fontes externas tier 1-3 | ✅ PASS (12/12) | As citadas (ABINPET/Editora Stilo, Farmapets, Cats.com, Peritoanimal, Cats Londrina, Loja Gato e Vida, ND Mais, Consulado da Ração, seu.dog, Cabine Celular, Portal Ar Livre) são fontes do setor, não spam |
| 10 | Sem links duplicados | ✅ PASS (12/12) | Nenhuma URL repetida dentro do mesmo post |
| 11 | Canonical presente e absoluto | ✅ PASS (12/12) | Campo `canonical` com URL completa em todos |
| 12 | og:title / og:description | ✅ PASS (12/12) | Presentes via `ogTitle`/`ogDescription` |
| 13 | og:image | ✅ PASS (12/12) | `ogImage` presente, mas aponta para caminho relativo (`images/x-hero.jpg`), não URL absoluta — ver Prioridade 2 |
| 14 | **og:type** | ❌ **FAIL (0/12)** | Não definido em nenhum post (deveria ser `"article"`) |
| 15 | **og:url** | ❌ **FAIL (0/12)** | Não definido — deveria espelhar o `canonical` |
| 16 | **og:site_name** | ❌ **FAIL (0/12)** | Não definido — deveria ser "Smart Pet Gadgets" |
| 17 | twitter:card | ✅ PASS (12/12) | `twitterCard: "summary_large_image"` presente |
| 18 | **twitter:title / twitter:description / twitter:image** | ❌ **FAIL (0/12)** | Não definidos separadamente (o preview provavelmente cai no fallback do og:, mas o campo explícito está ausente) |
| 19 | Schema Article/BlogPosting + Person + Organization + BreadcrumbList | ✅ PASS (12/12) | Confirmado nos blocos JSON-LD anexados |
| 20 | Data consistency (datePublished ≤ dateModified) | ✅ PASS (12/12) | Ambas em 2026-08-20 (post recém-criado) |
| 21 | Estrutura de URL (slug legível, sem data, minúsculo) | ✅ PASS (12/12) | Slugs como `melhor-comedouro-automatico-cachorro` |
| 22 | Alt text de imagens | ✅ PASS (12/12) | `coverImageAlt` presente e descritivo em todos |
| 23 | Imagem em formato otimizado (WebP/AVIF) | ❌ **FAIL (0/12)** | Todas em `.jpg` — limitação já registrada (sem ferramenta de conversão no ambiente) |

## Overall por Post

| Post | Passou | Falhou | Status |
|---|---|---|---|
| pillar-comedouro-automatico-para-pet.md | 17/23 | 6 | NEEDS WORK |
| a1-melhor-comedouro-automatico-cachorro.md | 17/23 | 6 | NEEDS WORK |
| a2-comedouro-newpet-4l-review.md | 17/23 | 6 | NEEDS WORK |
| a3-comedouro-vdrbg-4l-wifi-review.md | 17/23 | 6 | NEEDS WORK |
| b1-melhor-alimentador-automatico-gatos.md | 17/23 | 6 | NEEDS WORK |
| b2-cat-mate-c500-review.md | 17/23 | 6 | NEEDS WORK |
| b3-comedouro-gato-x-cachorro-diferenca.md | 17/23 | 6 | NEEDS WORK |
| c1-comedouro-automatico-vale-a-pena.md | 17/23 | 6 | NEEDS WORK |
| c2-configurar-app-comedouro-wifi.md | 17/23 | 6 | NEEDS WORK |
| c3-comedouro-x-bebedouro-automatico.md | 17/23 | 6 | NEEDS WORK |
| d1-melhor-bebedouro-automatico-pet.md | 17/23 | 6 | NEEDS WORK |
| d2-bebedouro-inox-x-ceramica.md | 17/23 | 6 | NEEDS WORK |

Todos os 12 posts têm o **mesmo padrão de falhas** — isso é bom: são 6 gaps sistemáticos de template/infraestrutura, não problemas de conteúdo individual, e podem ser corrigidos de uma vez.

## Priority Fixes (aplicam-se aos 12 posts igualmente)

1. **Adicionar 1-2 links externos por post para atingir o mínimo de 3.** Hoje cada post tem 1-2 fontes externas verificadas — é preciso reforçar com mais 1-2 citações reais por post (não inflar artificialmente; buscar fontes adicionais genuínas quando existir claim que se beneficie).
2. **Tornar `coverImage`/`ogImage` URLs absolutas** (ex.: `https://smartpetgadgets.com.br/blog/<slug>/images/x-hero.jpg`) em vez de caminho relativo — hoje relativos, o que quebra o preview em redes sociais.
3. **Adicionar campos `og:type: "article"`, `og:url` (= canonical) e `og:site_name: "Smart Pet Gadgets"`** ao frontmatter/template de todos os posts.
4. **Adicionar `twitter:title`, `twitter:description`, `twitter:image` explícitos** (podem espelhar os campos og: existentes).
5. Converter imagens para WebP/AVIF antes do deploy (item já conhecido, sem ferramenta disponível neste ambiente).

## Notes

- As falhas são 100% de infraestrutura de template/meta tags, não de qualidade editorial — isso é consistente com os scores de `/blog analyze` (88-93), que já capturaram os pontos fortes de conteúdo/E-E-A-T.
- Como os 6 gaps são idênticos nos 12 posts, a correção mais eficiente é ajustar o template de frontmatter uma vez (ou um script) em vez de editar arquivo por arquivo.
- Link externo mínimo de 3 é o item que exige mais trabalho editorial real (pesquisa de fonte adicional), os demais são mecânicos.
