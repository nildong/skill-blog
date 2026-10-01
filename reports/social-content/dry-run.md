# Social Content Engine — Dry-Run (Piloto)

Gerado em: 2026-09-05T22:06:06.549Z

**Modo:** dry-run / pilot. Nenhuma peça de conteúdo social (Reel, Post, Carrossel, Stories, Pergunta) foi gerada nesta etapa — apenas a oportunidade de cada formato foi estruturada, conforme autorizado. Nenhum HTML, imagem, link de afiliado ou sitemap foi alterado. Nada foi publicado no Facebook/Instagram.

**⚠️ Esta é a 2ª execução do dry-run**, com o seletor revisado após feedback do usuário: a 1ª execução pontuava afiliado como critério dominante e concentrou 8/10 artigos no único cluster com afiliado mapeado (comedouros). O seletor foi reescrito para priorizar interesse/engajamento/compartilhamento/tráfego, com monetização como fator secundário de peso baixo, e para distribuir a seleção por cotas de cluster. Ver seção "Comparação com o piloto anterior".

## Critérios de seleção dos 10 artigos (revisado)

Ordem de prioridade: interesse do público → engajamento (comentário) → compartilhamento → tráfego para o blog → diversidade de clusters → monetização (secundário).

Pontuação por candidato (score máximo teórico 88, monetização limitada a 8 pts — <10% do teto dos outros 4 fatores combinados):

| Fator | Regra | Pontos |
|-------|-------|--------|
| Engajamento | FAQ existente na fonte / role=FAQ | 20 / 15 |
| Interesse | role REVIEW/COMPARISON/HOW_TO/GUIDE / satélite >=400 palavras | 20 / 8 |
| Interesse | slug indica problema/dúvida comum (erros-comuns-*, duvidas-*) | +10 |
| Compartilhamento | role COMPARISON / imagens próprias (1 ou 2+) | 15 / 5-10 |
| Tráfego | inbound_links (do content-strategy.json): >=10 / >=5 / >=1 | 15 / 10 / 5 |
| Monetização (secundário) | produto afiliado ativo no cluster | 8 |

Depois de pontuar, a seleção é preenchida por **cotas de diversidade de cluster** (não apenas top-10 por score):

| Grupo | Cota |
|-------|------|
| Comedouros | 3 |
| Coleira/GPS | 2 |
| Câmera/monitoramento | 2 |
| Cachorro/higiene/acessórios (substituto: cluster unknown) | 2 |
| Outros clusters | 1 |

Dentro de cada grupo, desempate por score desc → word_count desc → slug asc. Se um grupo não tiver candidatos suficientes, as vagas restantes são preenchidas pelo melhor score geral, fora de cota, e isso é documentado explicitamente (não se inventa cluster nem se força candidato fraco na cota). Páginas institucionais (contato, sobre, política editorial, autores) são sempre excluídas.

### Distribuição por grupo nesta execução

| Grupo | Cota | Preenchido | Status | Artigos |
|-------|------|------------|--------|---------|
| comedouros | 3 | 3 | ✅ atingida | comedouro-gato-x-cachorro-diferenca, bebedouro-inox-x-ceramica, comedouro-com-ou-sem-wifi |
| coleira-gps | 2 | 2 | ✅ atingida | coleira-gps-x-microchip, coleira-gps-bluetooth-x-chip-operadora |
| camera-monitoramento | 2 | 2 | ✅ atingida | camera-para-monitorar-pet, duvidas-camera-para-monitorar-pet |
| cachorro-higiene-acessorios (substituto: cluster unknown) | 2 | 2 | ✅ atingida | cercado-para-cachorros, tapete-higienico-para-cachorro |
| outros-clusters | 1 | 1 | ✅ atingida | porta-eletronica-gato-x-cachorro-diferenca |

## Os 10 artigos selecionados

| # | Slug | Score | Grupo | Cluster | Fonte/Confiança | Papel | Palavras |
|---|------|-------|-------|---------|------------------|-------|----------|
| 1 | comedouro-gato-x-cachorro-diferenca | 83 | comedouros | comedouro-automatico-para-pet | content-strategy/known | COMPARISON | 1456 |
| 2 | bebedouro-inox-x-ceramica | 78 | comedouros | comedouro-automatico-para-pet | heuristic/low | COMPARISON | 1644 |
| 3 | comedouro-com-ou-sem-wifi | 78 | comedouros | comedouro-automatico-para-pet | content-strategy/known | COMPARISON | 1494 |
| 4 | coleira-gps-x-microchip | 50 | coleira-gps | coleira-gps-para-pet | content-strategy/known | COMPARISON | 593 |
| 5 | coleira-gps-bluetooth-x-chip-operadora | 50 | coleira-gps | coleira-gps-para-pet | content-strategy/known | COMPARISON | 579 |
| 6 | camera-para-monitorar-pet | 48 | camera-monitoramento | camera-para-monitorar-pet | content-strategy/known | PILLAR | 969 |
| 7 | duvidas-camera-para-monitorar-pet | 48 | camera-monitoramento | camera-para-monitorar-pet | content-strategy/known | FAQ | 611 |
| 8 | cercado-para-cachorros | 55 | cachorro-higiene-acessorios (substituto: cluster unknown) | — | none/unknown | REVIEW | 2050 |
| 9 | tapete-higienico-para-cachorro | 55 | cachorro-higiene-acessorios (substituto: cluster unknown) | — | none/unknown | REVIEW | 2040 |
| 10 | porta-eletronica-gato-x-cachorro-diferenca | 50 | outros-clusters | porta-eletronica-automatica-para-pet | content-strategy/known | COMPARISON | 432 |

### Justificativa por artigo (com detalhamento de potencial)

**1. comedouro-gato-x-cachorro-diferenca** (score 83 — engajamento 20, interesse 20, compartilhamento 20, tráfego 15, monetização 8)
- engajamento: 4 pergunta(s) de FAQ já formulada(s) na fonte (+20)
- interesse: role=COMPARISON (+20)
- compartilhamento: formato comparativo, natural para "marca alguém que..." (+15)
- compartilhamento: 1 imagem própria (+5)
- tráfego: 12 links internos de entrada (+15)
- monetização (secundário): 2 produto(s) afiliado(s) ativo(s) no cluster (+8)

**2. bebedouro-inox-x-ceramica** (score 78 — engajamento 20, interesse 20, compartilhamento 20, tráfego 10, monetização 8)
- engajamento: 4 pergunta(s) de FAQ já formulada(s) na fonte (+20)
- interesse: role=COMPARISON (+20)
- compartilhamento: formato comparativo, natural para "marca alguém que..." (+15)
- compartilhamento: 1 imagem própria (+5)
- tráfego: 6 links internos de entrada (+10)
- monetização (secundário): 2 produto(s) afiliado(s) ativo(s) no cluster (+8)

**3. comedouro-com-ou-sem-wifi** (score 78 — engajamento 20, interesse 20, compartilhamento 25, tráfego 5, monetização 8)
- engajamento: 4 pergunta(s) de FAQ já formulada(s) na fonte (+20)
- interesse: role=COMPARISON (+20)
- compartilhamento: formato comparativo, natural para "marca alguém que..." (+15)
- compartilhamento: 3 imagens próprias (material visual para carrossel) (+10)
- tráfego: 4 link(s) interno(s) de entrada (+5)
- monetização (secundário): 2 produto(s) afiliado(s) ativo(s) no cluster (+8)

**4. coleira-gps-x-microchip** (score 50 — engajamento 0, interesse 20, compartilhamento 20, tráfego 10, monetização 0)
- interesse: role=COMPARISON (+20)
- compartilhamento: formato comparativo, natural para "marca alguém que..." (+15)
- compartilhamento: 1 imagem própria (+5)
- tráfego: 8 links internos de entrada (+10)

**5. coleira-gps-bluetooth-x-chip-operadora** (score 50 — engajamento 0, interesse 20, compartilhamento 20, tráfego 10, monetização 0)
- interesse: role=COMPARISON (+20)
- compartilhamento: formato comparativo, natural para "marca alguém que..." (+15)
- compartilhamento: 1 imagem própria (+5)
- tráfego: 9 links internos de entrada (+10)

**6. camera-para-monitorar-pet** (score 48 — engajamento 20, interesse 8, compartilhamento 5, tráfego 15, monetização 0)
- engajamento: 3 pergunta(s) de FAQ já formulada(s) na fonte (+20)
- interesse: conteúdo satélite com 969 palavras (+8)
- compartilhamento: 1 imagem própria (+5)
- tráfego: 23 links internos de entrada (+15)

**7. duvidas-camera-para-monitorar-pet** (score 48 — engajamento 20, interesse 18, compartilhamento 5, tráfego 5, monetização 0)
- engajamento: 5 pergunta(s) de FAQ já formulada(s) na fonte (+20)
- interesse: conteúdo satélite com 611 palavras (+8)
- interesse: slug indica conteúdo de problema/dúvida comum (+10)
- compartilhamento: 1 imagem própria (+5)
- tráfego: 4 link(s) interno(s) de entrada (+5)

**8. cercado-para-cachorros** (score 55 — engajamento 20, interesse 20, compartilhamento 10, tráfego 5, monetização 0)
- engajamento: 4 pergunta(s) de FAQ já formulada(s) na fonte (+20)
- interesse: role=REVIEW (+20)
- compartilhamento: 5 imagens próprias (material visual para carrossel) (+10)
- tráfego: 4 link(s) interno(s) de entrada (+5)

**9. tapete-higienico-para-cachorro** (score 55 — engajamento 20, interesse 20, compartilhamento 10, tráfego 5, monetização 0)
- engajamento: 4 pergunta(s) de FAQ já formulada(s) na fonte (+20)
- interesse: role=REVIEW (+20)
- compartilhamento: 4 imagens próprias (material visual para carrossel) (+10)
- tráfego: 4 link(s) interno(s) de entrada (+5)

**10. porta-eletronica-gato-x-cachorro-diferenca** (score 50 — engajamento 0, interesse 20, compartilhamento 20, tráfego 10, monetização 0)
- interesse: role=COMPARISON (+20)
- compartilhamento: formato comparativo, natural para "marca alguém que..." (+15)
- compartilhamento: 1 imagem própria (+5)
- tráfego: 5 links internos de entrada (+10)

## Comparação com o piloto anterior

Piloto anterior gerado em: 2026-08-31T16:38:04.633Z

| Piloto anterior | Cluster | Piloto novo | Cluster | Status |
|------------------|---------|-------------|---------|--------|
| comedouro-gato-x-cachorro-diferenca | comedouro-automatico-para-pet | | | mantido |
| bebedouro-inox-x-ceramica | comedouro-automatico-para-pet | | | mantido |
| comedouro-com-ou-sem-wifi | comedouro-automatico-para-pet | | | mantido |
| coleira-gps-x-microchip | coleira-gps-para-pet | | | mantido |
| coleira-gps-bluetooth-x-chip-operadora | coleira-gps-para-pet | | | mantido |
| camera-para-monitorar-pet | camera-para-monitorar-pet | | | mantido |
| duvidas-camera-para-monitorar-pet | camera-para-monitorar-pet | | | mantido |
| cercado-para-cachorros | — | | | mantido |
| tapete-higienico-para-cachorro | — | | | mantido |
| porta-eletronica-gato-x-cachorro-diferenca | porta-eletronica-automatica-para-pet | | | mantido |

**Resumo:** 10 artigo(s) mantido(s), 0 removido(s), 0 novo(s).

O piloto anterior tinha 8/10 artigos do cluster "comedouro-automatico-para-pet" (concentração de 80% em um único tema, causada por afiliado dominar o score). Este piloto revisado distribui por 5 grupos de diversidade — ver tabela de distribuição acima.

## Análise detalhada por artigo

### 1. Comedouro Automático para Gato x Cachorro: Qual a Diferença?

- **URL:** https://smartpetgadgets.com.br/comedouro-gato-x-cachorro-diferenca/
- **Público provável:** tutores de gatos e cães
- **Cluster:** comedouro-automatico-para-pet (`cluster_source: content-strategy`, `cluster_confidence: known`)
- **Papel editorial:** COMPARISON
- **Palavras (fonte):** 1456
- **Imagens próprias reaproveitáveis:** 1 — img/comedouro-gato-x-cachorro-diferenca-hero.jpg
- **FAQ na fonte:** 4 pergunta(s)
- **Produtos afiliados no cluster:** Comedouro Automático New Pet 4L com Gravação de Voz para Cães e Gatos; Comedouro Automático 4L Newpet para Cães e Gatos com Voz e App
- **Artigos relacionados (links internos):** /comedouro-automatico-para-pet/, /autores/nildo-alves/, /melhor-comedouro-automatico-cachorro/, /melhor-alimentador-automatico-gatos/, /cat-mate-c500-review/, /comedouro-vdrbg-4l-wifi-review/, /comedouro-newpet-4l-review/, /comedouro-x-bebedouro-automatico/, /bebedouro-inox-x-ceramica/, /comedouro-automatico-vale-a-pena/

**Potencial por formato:**

| Formato | Potencial | Motivo |
|---------|-----------|--------|
| Reel | 🟢 alto | role=COMPARISON, 1 imagem(ns) própria(s) para storyboard |
| Post | 🟢 alto | 1456 palavras de conteúdo-fonte |
| Carrossel | 🟢 alto | 1456 palavras — proxy de material para 6-8 slides |
| Stories | 🟢 alto | 4 pergunta(s) de FAQ já formulada(s) na fonte |
| Pergunta/engajamento | 🟢 alto | FAQ existente dá base para pergunta de comentário |
| Vídeo curto | 🟢 alto | role=COMPARISON, 1 imagem(ns) própria(s) para storyboard |
| CTA | 🟢 alto | produto afiliado mapeado no cluster — CTA pode direcionar ao guia que já linka o produto |
| Remarketing | 🟢 alto | review/comparação com produto mapeado — bom para remarketing de intenção de compra |

**⚠️ Aviso de similaridade** (possível sobreposição de tema com outro artigo do piloto — não gerar conteúdo social quase idêntico sem diferenciar):
- vs `porta-eletronica-gato-x-cachorro-diferenca`: overlap 0.72 (mesmo cluster: não)

### 2. Bebedouro Fonte para Gato: Inox x Cerâmica, Qual Escolher?

- **URL:** https://smartpetgadgets.com.br/bebedouro-inox-x-ceramica/
- **Público provável:** tutores de gatos
- **Cluster:** comedouro-automatico-para-pet (`cluster_source: heuristic`, `cluster_confidence: low`)
- **Papel editorial:** COMPARISON
- **Palavras (fonte):** 1644
- **Imagens próprias reaproveitáveis:** 1 — img/bebedouro-inox-x-ceramica-hero.jpg
- **FAQ na fonte:** 4 pergunta(s)
- **Produtos afiliados no cluster:** Comedouro Automático New Pet 4L com Gravação de Voz para Cães e Gatos; Comedouro Automático 4L Newpet para Cães e Gatos com Voz e App
- **Artigos relacionados (links internos):** /comedouro-automatico-para-pet/, /autores/nildo-alves/, /melhor-bebedouro-automatico-pet/, /politica-editorial/, /comedouro-x-bebedouro-automatico/, /sobre/, /contato/

**Potencial por formato:**

| Formato | Potencial | Motivo |
|---------|-----------|--------|
| Reel | 🟢 alto | role=COMPARISON, 1 imagem(ns) própria(s) para storyboard |
| Post | 🟢 alto | 1644 palavras de conteúdo-fonte |
| Carrossel | 🟢 alto | 1644 palavras — proxy de material para 6-8 slides |
| Stories | 🟢 alto | 4 pergunta(s) de FAQ já formulada(s) na fonte |
| Pergunta/engajamento | 🟢 alto | FAQ existente dá base para pergunta de comentário |
| Vídeo curto | 🟢 alto | role=COMPARISON, 1 imagem(ns) própria(s) para storyboard |
| CTA | 🟢 alto | produto afiliado mapeado no cluster — CTA pode direcionar ao guia que já linka o produto |
| Remarketing | 🟢 alto | review/comparação com produto mapeado — bom para remarketing de intenção de compra |

**Problemas/limitações identificados:**
- ⚠️ Cluster determinado só por heurística fraca de slug (cluster_source=heuristic) — confirmar manualmente antes de basear CTA/remarketing nisso.

### 3. Comedouro Automático Com ou Sem Wi-Fi: Qual Escolher?

- **URL:** https://smartpetgadgets.com.br/comedouro-com-ou-sem-wifi/
- **Público provável:** não determinado (título não especifica espécie)
- **Cluster:** comedouro-automatico-para-pet (`cluster_source: content-strategy`, `cluster_confidence: known`)
- **Papel editorial:** COMPARISON
- **Palavras (fonte):** 1494
- **Imagens próprias reaproveitáveis:** 3 — img/comedouro-com-ou-sem-wifi-hero.webp, img/comedouro-com-ou-sem-wifi-02.webp, img/comedouro-com-ou-sem-wifi-03.webp
- **FAQ na fonte:** 4 pergunta(s)
- **Produtos afiliados no cluster:** Comedouro Automático New Pet 4L com Gravação de Voz para Cães e Gatos; Comedouro Automático 4L Newpet para Cães e Gatos com Voz e App
- **Artigos relacionados (links internos):** /comedouro-automatico-para-pet/, /autores/nildo-alves/, /comedouro-newpet-4l-review/, /comedouro-vdrbg-4l-wifi-review/, /configurar-app-comedouro-wifi/, /comedouro-newpet-2l-review/, /politica-editorial/, /sobre/, /contato/

**Potencial por formato:**

| Formato | Potencial | Motivo |
|---------|-----------|--------|
| Reel | 🟢 alto | role=COMPARISON, 3 imagem(ns) própria(s) para storyboard |
| Post | 🟢 alto | 1494 palavras de conteúdo-fonte |
| Carrossel | 🟢 alto | 1494 palavras — proxy de material para 6-8 slides |
| Stories | 🟢 alto | 4 pergunta(s) de FAQ já formulada(s) na fonte |
| Pergunta/engajamento | 🟢 alto | FAQ existente dá base para pergunta de comentário |
| Vídeo curto | 🟢 alto | role=COMPARISON, 3 imagem(ns) própria(s) para storyboard |
| CTA | 🟢 alto | produto afiliado mapeado no cluster — CTA pode direcionar ao guia que já linka o produto |
| Remarketing | 🟢 alto | review/comparação com produto mapeado — bom para remarketing de intenção de compra |

### 4. Coleira GPS ou Microchip: Qual a Diferença e Quando Usar

- **URL:** https://smartpetgadgets.com.br/coleira-gps-x-microchip/
- **Público provável:** não determinado (título não especifica espécie)
- **Cluster:** coleira-gps-para-pet (`cluster_source: content-strategy`, `cluster_confidence: known`)
- **Papel editorial:** COMPARISON
- **Palavras (fonte):** 593
- **Imagens próprias reaproveitáveis:** 1 — img/coleira-gps-x-microchip-hero.jpg
- **FAQ na fonte:** 0 pergunta(s)
- **Produtos afiliados no cluster:** nenhum mapeado ainda (não é erro)
- **Artigos relacionados (links internos):** /coleira-gps-para-pet/, /autores/nildo-alves/, /como-funciona-coleira-gps-cachorro/, /coleira-gps-para-gato/, /sobre/, /politica-editorial/, /contato/

**Potencial por formato:**

| Formato | Potencial | Motivo |
|---------|-----------|--------|
| Reel | 🟢 alto | role=COMPARISON, 1 imagem(ns) própria(s) para storyboard |
| Post | 🟢 alto | 593 palavras de conteúdo-fonte |
| Carrossel | 🟡 médio | 593 palavras — proxy de material para 6-8 slides |
| Stories | 🟡 médio | sem FAQ detectado; precisaria formular pergunta nova a partir do corpo do artigo |
| Pergunta/engajamento | 🟢 alto | artigo comparativo — pergunta "qual você prefere" é natural |
| Vídeo curto | 🟢 alto | role=COMPARISON, 1 imagem(ns) própria(s) para storyboard |
| CTA | 🟡 médio | sem produto afiliado mapeado neste cluster ainda — CTA fica limitado a tráfego para o artigo |
| Remarketing | 🔴 baixo | sem sinal forte de intenção de compra para remarketing |

**Problemas/limitações identificados:**
- ⚠️ Nenhum produto afiliado ativo mapeado neste cluster em affiliate-products.json — CTA de produto não é possível ainda (não é erro, é limitação de dados atual).

### 5. Coleira GPS Sem Chip: Bluetooth ou Rede da Operadora?

- **URL:** https://smartpetgadgets.com.br/coleira-gps-bluetooth-x-chip-operadora/
- **Público provável:** não determinado (título não especifica espécie)
- **Cluster:** coleira-gps-para-pet (`cluster_source: content-strategy`, `cluster_confidence: known`)
- **Papel editorial:** COMPARISON
- **Palavras (fonte):** 579
- **Imagens próprias reaproveitáveis:** 1 — img/coleira-gps-bluetooth-x-chip-operadora-hero.jpg
- **FAQ na fonte:** 0 pergunta(s)
- **Produtos afiliados no cluster:** nenhum mapeado ainda (não é erro)
- **Artigos relacionados (links internos):** /coleira-gps-para-pet/, /autores/nildo-alves/, /melhor-coleira-gps-sem-mensalidade/, /coleira-gps-cachorro-que-foge/, /como-funciona-coleira-gps-cachorro/, /sobre/, /politica-editorial/, /contato/

**Potencial por formato:**

| Formato | Potencial | Motivo |
|---------|-----------|--------|
| Reel | 🟢 alto | role=COMPARISON, 1 imagem(ns) própria(s) para storyboard |
| Post | 🟢 alto | 579 palavras de conteúdo-fonte |
| Carrossel | 🟡 médio | 579 palavras — proxy de material para 6-8 slides |
| Stories | 🟡 médio | sem FAQ detectado; precisaria formular pergunta nova a partir do corpo do artigo |
| Pergunta/engajamento | 🟢 alto | artigo comparativo — pergunta "qual você prefere" é natural |
| Vídeo curto | 🟢 alto | role=COMPARISON, 1 imagem(ns) própria(s) para storyboard |
| CTA | 🟡 médio | sem produto afiliado mapeado neste cluster ainda — CTA fica limitado a tráfego para o artigo |
| Remarketing | 🔴 baixo | sem sinal forte de intenção de compra para remarketing |

**Problemas/limitações identificados:**
- ⚠️ Nenhum produto afiliado ativo mapeado neste cluster em affiliate-products.json — CTA de produto não é possível ainda (não é erro, é limitação de dados atual).

### 6. Câmera para Monitorar Pet: Como Escolher o Modelo Ideal

- **URL:** https://smartpetgadgets.com.br/camera-para-monitorar-pet/
- **Público provável:** não determinado (título não especifica espécie)
- **Cluster:** camera-para-monitorar-pet (`cluster_source: content-strategy`, `cluster_confidence: known`)
- **Papel editorial:** PILLAR
- **Palavras (fonte):** 969
- **Imagens próprias reaproveitáveis:** 1 — img/camera-para-monitorar-pet-hero.jpg
- **FAQ na fonte:** 3 pergunta(s)
- **Produtos afiliados no cluster:** nenhum mapeado ainda (não é erro)
- **Artigos relacionados (links internos):** /autores/nildo-alves/, /camera-pet-cachorro-ansiedade-separacao/, /camera-pet-com-dispensador-de-petisco/, /camera-pet-resolucao-1080p-x-2k/, /melhor-camera-para-monitorar-pet/, /camera-pet-x-coleira-gps-qual-escolher/, /camera-pet-grava-sem-internet/, /como-configurar-camera-pet-wifi/, /erros-comuns-camera-monitorar-pet/, /duvidas-camera-para-monitorar-pet/

**Potencial por formato:**

| Formato | Potencial | Motivo |
|---------|-----------|--------|
| Reel | 🟡 médio | role=PILLAR, 1 imagem(ns) própria(s) para storyboard |
| Post | 🟢 alto | 969 palavras de conteúdo-fonte |
| Carrossel | 🟢 alto | 969 palavras — proxy de material para 6-8 slides |
| Stories | 🟢 alto | 3 pergunta(s) de FAQ já formulada(s) na fonte |
| Pergunta/engajamento | 🟢 alto | FAQ existente dá base para pergunta de comentário |
| Vídeo curto | 🟡 médio | role=PILLAR, 1 imagem(ns) própria(s) para storyboard |
| CTA | 🟡 médio | sem produto afiliado mapeado neste cluster ainda — CTA fica limitado a tráfego para o artigo |
| Remarketing | 🔴 baixo | sem sinal forte de intenção de compra para remarketing |

**Problemas/limitações identificados:**
- ⚠️ Nenhum produto afiliado ativo mapeado neste cluster em affiliate-products.json — CTA de produto não é possível ainda (não é erro, é limitação de dados atual).

**⚠️ Aviso de similaridade** (possível sobreposição de tema com outro artigo do piloto — não gerar conteúdo social quase idêntico sem diferenciar):
- vs `duvidas-camera-para-monitorar-pet`: overlap 0.62 (mesmo cluster: sim)

### 7. Câmera para Monitorar Pet: Perguntas Frequentes (FAQ)

- **URL:** https://smartpetgadgets.com.br/duvidas-camera-para-monitorar-pet/
- **Público provável:** não determinado (título não especifica espécie)
- **Cluster:** camera-para-monitorar-pet (`cluster_source: content-strategy`, `cluster_confidence: known`)
- **Papel editorial:** FAQ
- **Palavras (fonte):** 611
- **Imagens próprias reaproveitáveis:** 1 — img/duvidas-camera-para-monitorar-pet-hero.jpg
- **FAQ na fonte:** 5 pergunta(s)
- **Produtos afiliados no cluster:** nenhum mapeado ainda (não é erro)
- **Artigos relacionados (links internos):** /camera-para-monitorar-pet/, /autores/nildo-alves/, /camera-pet-grava-sem-internet/, /camera-pet-cachorro-ansiedade-separacao/, /como-configurar-camera-pet-wifi/, /sobre/, /politica-editorial/, /contato/

**Potencial por formato:**

| Formato | Potencial | Motivo |
|---------|-----------|--------|
| Reel | 🟡 médio | role=FAQ, 1 imagem(ns) própria(s) para storyboard |
| Post | 🟢 alto | 611 palavras de conteúdo-fonte |
| Carrossel | 🟡 médio | 611 palavras — proxy de material para 6-8 slides |
| Stories | 🟢 alto | 5 pergunta(s) de FAQ já formulada(s) na fonte |
| Pergunta/engajamento | 🟢 alto | FAQ existente dá base para pergunta de comentário |
| Vídeo curto | 🟡 médio | role=FAQ, 1 imagem(ns) própria(s) para storyboard |
| CTA | 🟡 médio | sem produto afiliado mapeado neste cluster ainda — CTA fica limitado a tráfego para o artigo |
| Remarketing | 🔴 baixo | sem sinal forte de intenção de compra para remarketing |

**Problemas/limitações identificados:**
- ⚠️ Nenhum produto afiliado ativo mapeado neste cluster em affiliate-products.json — CTA de produto não é possível ainda (não é erro, é limitação de dados atual).

**⚠️ Aviso de similaridade** (possível sobreposição de tema com outro artigo do piloto — não gerar conteúdo social quase idêntico sem diferenciar):
- vs `camera-para-monitorar-pet`: overlap 0.62 (mesmo cluster: sim)

### 8. Cercado para Cachorros Divipets: Vale a Pena? Review

- **URL:** https://smartpetgadgets.com.br/cercado-para-cachorros/
- **Público provável:** tutores de cães
- **Cluster:** — (`cluster_source: none`, `cluster_confidence: unknown`)
- **Papel editorial:** REVIEW
- **Palavras (fonte):** 2050
- **Imagens próprias reaproveitáveis:** 5 — img/cercado-cachorros-divipets-01.webp, img/cercado-cachorros-divipets-02.webp, img/cercado-cachorros-divipets-03.webp, img/cercado-cachorros-divipets-04.webp, img/cercado-cachorros-divipets-05.webp
- **FAQ na fonte:** 4 pergunta(s)
- **Produtos afiliados no cluster:** nenhum mapeado ainda (não é erro)
- **Artigos relacionados (links internos):** /autores/nildo-alves/, /comedouro-cachorro/, /tapete-higienico-para-cachorro/, /politica-editorial/, /sobre/, /contato/

**Potencial por formato:**

| Formato | Potencial | Motivo |
|---------|-----------|--------|
| Reel | 🟢 alto | role=REVIEW, 5 imagem(ns) própria(s) para storyboard |
| Post | 🟢 alto | 2050 palavras de conteúdo-fonte |
| Carrossel | 🟢 alto | 2050 palavras — proxy de material para 6-8 slides |
| Stories | 🟢 alto | 4 pergunta(s) de FAQ já formulada(s) na fonte |
| Pergunta/engajamento | 🟢 alto | FAQ existente dá base para pergunta de comentário |
| Vídeo curto | 🟢 alto | role=REVIEW, 5 imagem(ns) própria(s) para storyboard |
| CTA | 🟡 médio | sem produto afiliado mapeado neste cluster ainda — CTA fica limitado a tráfego para o artigo |
| Remarketing | 🔴 baixo | sem sinal forte de intenção de compra para remarketing |

**Problemas/limitações identificados:**
- ⚠️ Cluster não determinado (nem por content-strategy.json, nem por heurística de slug) — produtos afiliados relacionados podem não ser encontrados mesmo que existam.
- ⚠️ Nenhum produto afiliado ativo mapeado neste cluster em affiliate-products.json — CTA de produto não é possível ainda (não é erro, é limitação de dados atual).

### 9. Tapete Higiênico para Cachorro: Vale a Pena? Review 2026

- **URL:** https://smartpetgadgets.com.br/tapete-higienico-para-cachorro/
- **Público provável:** tutores de cães
- **Cluster:** — (`cluster_source: none`, `cluster_confidence: unknown`)
- **Papel editorial:** REVIEW
- **Palavras (fonte):** 2040
- **Imagens próprias reaproveitáveis:** 4 — img/tapete-higienico-02-lifestyle-apartamento.webp, img/tapete-higienico-04-seis-camadas.webp, img/tapete-higienico-07-carvao-bambu.webp, img/tapete-higienico-05-embalagem-kit30.webp
- **FAQ na fonte:** 4 pergunta(s)
- **Produtos afiliados no cluster:** nenhum mapeado ainda (não é erro)
- **Artigos relacionados (links internos):** /autores/nildo-alves/, /comedouro-cachorro/, /soprador-pet/, /politica-editorial/, /sobre/, /contato/

**Potencial por formato:**

| Formato | Potencial | Motivo |
|---------|-----------|--------|
| Reel | 🟢 alto | role=REVIEW, 4 imagem(ns) própria(s) para storyboard |
| Post | 🟢 alto | 2040 palavras de conteúdo-fonte |
| Carrossel | 🟢 alto | 2040 palavras — proxy de material para 6-8 slides |
| Stories | 🟢 alto | 4 pergunta(s) de FAQ já formulada(s) na fonte |
| Pergunta/engajamento | 🟢 alto | FAQ existente dá base para pergunta de comentário |
| Vídeo curto | 🟢 alto | role=REVIEW, 4 imagem(ns) própria(s) para storyboard |
| CTA | 🟡 médio | sem produto afiliado mapeado neste cluster ainda — CTA fica limitado a tráfego para o artigo |
| Remarketing | 🔴 baixo | sem sinal forte de intenção de compra para remarketing |

**Problemas/limitações identificados:**
- ⚠️ Cluster não determinado (nem por content-strategy.json, nem por heurística de slug) — produtos afiliados relacionados podem não ser encontrados mesmo que existam.
- ⚠️ Nenhum produto afiliado ativo mapeado neste cluster em affiliate-products.json — CTA de produto não é possível ainda (não é erro, é limitação de dados atual).

### 10. Porta Eletrônica para Gato x Cachorro: Qual a Diferença?

- **URL:** https://smartpetgadgets.com.br/porta-eletronica-gato-x-cachorro-diferenca/
- **Público provável:** tutores de gatos e cães
- **Cluster:** porta-eletronica-automatica-para-pet (`cluster_source: content-strategy`, `cluster_confidence: known`)
- **Papel editorial:** COMPARISON
- **Palavras (fonte):** 432
- **Imagens próprias reaproveitáveis:** 1 — img/porta-eletronica-gato-x-cachorro-diferenca-hero.jpg
- **FAQ na fonte:** 0 pergunta(s)
- **Produtos afiliados no cluster:** nenhum mapeado ainda (não é erro)
- **Artigos relacionados (links internos):** /porta-eletronica-automatica-para-pet/, /autores/nildo-alves/, /porta-eletronica-microchip-x-rfid-coleira/, /comedouro-gato-x-cachorro-diferenca/, /sobre/, /politica-editorial/, /contato/

**Potencial por formato:**

| Formato | Potencial | Motivo |
|---------|-----------|--------|
| Reel | 🟢 alto | role=COMPARISON, 1 imagem(ns) própria(s) para storyboard |
| Post | 🟢 alto | 432 palavras de conteúdo-fonte |
| Carrossel | 🟡 médio | 432 palavras — proxy de material para 6-8 slides |
| Stories | 🟡 médio | sem FAQ detectado; precisaria formular pergunta nova a partir do corpo do artigo |
| Pergunta/engajamento | 🟢 alto | artigo comparativo — pergunta "qual você prefere" é natural |
| Vídeo curto | 🟢 alto | role=COMPARISON, 1 imagem(ns) própria(s) para storyboard |
| CTA | 🟡 médio | sem produto afiliado mapeado neste cluster ainda — CTA fica limitado a tráfego para o artigo |
| Remarketing | 🔴 baixo | sem sinal forte de intenção de compra para remarketing |

**Problemas/limitações identificados:**
- ⚠️ Nenhum produto afiliado ativo mapeado neste cluster em affiliate-products.json — CTA de produto não é possível ainda (não é erro, é limitação de dados atual).

**⚠️ Aviso de similaridade** (possível sobreposição de tema com outro artigo do piloto — não gerar conteúdo social quase idêntico sem diferenciar):
- vs `comedouro-gato-x-cachorro-diferenca`: overlap 0.72 (mesmo cluster: não)

## Dados ausentes / limitações gerais

- Nenhuma peça de conteúdo social (texto de Reel, legenda de Post, slide de Carrossel, Stories, pergunta) foi gerada nesta fase — apenas a oportunidade por formato, conforme escopo autorizado.
- Cluster nunca é lido de um campo confiável — vem de `.data/content-strategy.json` quando disponível (known/probable), ou de heurística fraca de prefixo de slug como último recurso (sempre marcada `cluster_source: "heuristic"`, `cluster_confidence: "low"`). Nunca tratado como verdade absoluta.
- Produtos afiliados só existem hoje para o cluster "comedouro-automatico-para-pet" em affiliate-products.json — artigos de outros clusters legitimamente aparecem com 0 produtos mapeados; isso não é um erro do engine.
- "Imagens próprias reaproveitáveis" é uma contagem de imagens do artigo (excluindo logo/favicon/apple-touch), não uma avaliação de qualidade/composição/direitos de uso — validação visual continua manual.
- Aviso de similaridade usa apenas overlap ponderado de termos do TÍTULO entre os 10 artigos do piloto (mesma fórmula de tools/shared/semantic-terms.js) — não analisa o corpo inteiro; é um sinal para revisão humana, não uma decisão automática.
- O grupo de diversidade "cachorro-higiene-acessórios" não corresponde a nenhum cluster real identificado pelo Content Strategy Engine hoje (só existem 5 pilares: comedouro, câmera, coleira-gps, porta-eletrônica, brinquedo-interativo) — usamos como substituto o grupo de artigos com cluster "unknown" (ex.: cercado-para-cachorros, tapete-higiênico-para-cachorro), documentado explicitamente. Não é o mesmo que um cluster editorial real desse tema.
- Cotas de diversidade são aplicadas apenas dentro do Social Content Engine — a alteração NÃO modifica tools/content-strategy (o Content Strategy Engine e seu content-strategy.json continuam exatamente como estavam).

## Próximo passo (aguardando autorização)

Esta é a etapa **DRY-RUN**. O fluxo obrigatório é: AUDITORIA → DRY-RUN → REVISÃO → AUTORIZAÇÃO → GERAÇÃO PILOTO. Nenhuma peça de conteúdo (Reel/Post/Carrossel/Stories/Pergunta) deve ser gerada, e nada deve ser publicado, até autorização explícita para a fase seguinte.
