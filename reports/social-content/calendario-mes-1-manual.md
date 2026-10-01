# Calendário Editorial — Mês 1 (publicação manual no Meta Business Suite)

**Base:** 313 peças aprovadas pelo Social Content Engine (Reel, Post, Carrossel, Stories, Engagement), geradas a partir de 66 artigos do smartpetgadgets.com.br. Nenhuma peça foi publicada ainda — este é o plano de organização + 4 exemplos prontos para copiar/colar.

> **Nota de honestidade:** as 313 peças existem como *saída do gerador* (`tools/social-content-engine`), não como um arquivo único já salvo em disco — os relatórios em `reports/social-content/escala-lote*.md` confirmam que nenhum `.data/social-content/{slug}.json` final foi gravado. Os 4 exemplos abaixo foram gerados agora, ao vivo, rodando o motor real (não inventados). Para ter as 313 em uma planilha única pronta pra ir marcando "postado", o próximo passo técnico é rodar um script de exportação — posso montar isso se você confirmar.

---

## 1. Grade semanal (4-5 posts/semana)

Regra de espaçamento: peças do mesmo artigo/cluster não se repetem na mesma semana (ver `spacing-rule-v2.js` — overlap ≥0.70 → 21 dias, ≥0.50 → 14 dias entre peças parecidas).

| Dia | Formato | Papel no funil | Fonte típica |
|---|---|---|---|
| **Segunda** | Carrossel educativo | Topo de funil — retenção/salvamento | Artigos REVIEW ou comparativos com ≥6 headings reais |
| **Quarta** | Reel demonstração/dica | Topo/meio — tráfego + descoberta | Fato específico do corpo do artigo (nunca preço) |
| **Sexta** | Post conversão (afiliado) | Fundo de funil — intenção de compra | Artigos com produto afiliado vinculado no cluster |
| **Sábado** | Stories (enquete + CTA) | Engajamento leve, aquece a audiência do fim de semana | FAQ real ou H1 do artigo |
| *(Terça, alternada)* | Engagement (pergunta) | Comentários, sinal de alcance orgânico | Pergunta FAQ real ou par comparativo "A x B" |

Semanas 1-4 sugeridas por cluster (evita repetir cluster 2 semanas seguidas):

| Semana | Segunda (Carrossel) | Quarta (Reel) | Sexta (Post conversão) | Sáb (Stories) |
|---|---|---|---|---|
| 1 | Comedouro Newpet 4L (review) | Brinquedo interativo automático p/ gato | Comedouro com/sem Wi-Fi | Comedouro Newpet 4L |
| 2 | Porta eletrônica automática p/ pet (pillar) | Coleira GPS x microchip | Coleira GPS bluetooth x chip operadora | Porta eletrônica |
| 3 | Câmera para monitorar pet | Comedouro gato x cachorro (diferença) | Comedouro Newpet 2L (review) | Câmera monitorar pet |
| 4 | Bebedouro inox x cerâmica | Cercado para cachorros | Comedouro VDRBG 4L Wi-Fi (review) | Tapete higiênico |

---

## 2. Quatro exemplos reais, prontos para copiar/colar

### 🟦 Exemplo 1 — Carrossel educativo
**Artigo-fonte:** [Comedouro Newpet 4L: Review Completo](https://smartpetgadgets.com.br/comedouro-newpet-4l-review/)

| Slide | Papel | Texto |
|---|---|---|
| 1 | Gancho | **Comedouro Newpet 4L: Review Completo (Vale a Pena?)** — Review do comedouro automático Newpet 4L: capacidade, gravação de voz, prós, contras e se vale a pena comprar em 2026. |
| 2 | Problema | Principais Recursos do Newpet 4L |
| 3 | Informação 1 | Como funciona a programação no painel |
| 4 | Informação 2 | Uso em casas com mais de um pet |
| 5 | Informação 3 | Ficha Técnica |
| 6 | Erro comum | Manutenção e Cuidados no Dia a Dia |
| 7 | Conclusão | Review do comedouro automático Newpet 4L: capacidade, gravação de voz, prós, contras e se vale a pena comprar em 2026. |
| 8 | CTA | Quer saber mais? Confira os modelos analisados e o guia completo |

**Criativo sugerido:** slide 1 usa a foto hero já existente (`img/comedouro-newpet-4l-review-hero.jpg`); slides 2-6 precisam de arte nova — grid modular cinza-escuro/branco com ícone do gadget (linha "moderna, minimalista tech" da identidade visual), 1 dado por slide, tipografia grande sem serifa.
**CTA final:** "Link do review completo na bio / comentários 👉 smartpetgadgets.com.br/comedouro-newpet-4l-review/"

---

### 🟩 Exemplo 2 — Reel de demonstração/dica
**Artigo-fonte:** [Brinquedo Interativo Automático para Gato](https://smartpetgadgets.com.br/brinquedo-interativo-automatico-para-gato/)

**Gancho (primeiros 2s, texto na tela):**
> "A fonte de energia do brinquedo automático muda tudo na hora de escolher"

**Roteiro:**
- **Problema:** Tutor escolhe o brinquedo só pelo visual e depois se frustra com a energia (pilha, recarregável ou USB).
- **Informação:** A fonte de energia varia entre pilha, bateria recarregável ou USB — cada uma tem implicações diferentes de custo recorrente e praticidade, vale considerar isso antes de decidir pelo modelo.
- **Solução:** Guia completo de brinquedo interativo para gato → smartpetgadgets.com.br/brinquedo-interativo-automatico-para-gato/

**Cenas sugeridas:** closes dos 3 tipos de fonte de energia lado a lado (pilha / bateria recarregável no cabo USB / plugado); gato interagindo com o brinquedo ligado.
**Duração:** ~30s.
**CTA (legenda + card final):** "Guia completo com os 3 tipos e quando vale cada um → link na bio"
**Hashtags:** #smartpetgadgets #brinquedointerativoparagato #gatos

---

### 🟧 Exemplo 3 — Post de conversão (afiliado)
**Artigo-fonte:** [Comedouro com ou sem Wi-Fi](https://smartpetgadgets.com.br/comedouro-com-ou-sem-wifi/)

**Título-gatilho:** Se o Wi-Fi cair, seu pet fica sem comer? Não.

**Legenda:**
> Se a internet do comedouro Wi-Fi cair, a alimentação do seu pet não para: a maioria dos modelos mantém a última programação salva localmente e continua liberando as porções normalmente. O que você perde é só o controle remoto e as notificações pelo app. 📶
>
> No artigo: quando vale pagar a mais pelo Wi-Fi e quando o modelo sem conexão resolve igual, por menos.

**Criativo sugerido:** foto de produto (comedouro Wi-Fi) com ícone de "sinal Wi-Fi caído" sobreposto, ou split-screen "com Wi-Fi vs sem Wi-Fi" — mesma paleta tech usada nos outros criativos de produto.
**CTA:** "Veja o guia completo no Smart Pet Gadgets → smartpetgadgets.com.br/comedouro-com-ou-sem-wifi/" (o guia linka o(s) produto(s) afiliado(s) do cluster comedouro-automático)
**Hashtags:** #smartpetgadgets #comedouroautomaticoparapet

---

### 🟪 Exemplo 4 — Stories (enquete + CTA) / Engagement
**Artigo-fonte:** [Comedouro Newpet 4L: Review Completo](https://smartpetgadgets.com.br/comedouro-newpet-4l-review/)

**Story 1 — Enquete:**
> "Para Quem o Newpet 4L é Indicado?" — [Sim] / [Não]

**Story 2 — CTA (link/arraste):**
> "Arraste para cima e leia: Comedouro Newpet 4L: Review Completo (Vale a Pena?)"

**Post de engajamento (mesmo artigo, outro dia):**
> Pergunta: "Como funciona a programação no painel do comedouro automático?" — convide a audiência a comentar o que já tentaram/travaram na configuração do próprio comedouro.

**Criativo sugerido:** template de enquete padrão do Instagram/Facebook Stories, fundo com a cor de marca, foto de produto pequena no canto.
**CTA:** link direto para o artigo via sticker de link (Stories) ou comentário fixado (post de engajamento).

---

## 3. Estrutura de planilha para o Meta Business Suite

Colunas recomendadas para você colar no Business Suite / planilha de controle:

| Data | Formato | Artigo-fonte | Gancho/Título | Copy | CTA | Link | Hashtags | Status |
|---|---|---|---|---|---|---|---|---|
| (preencher) | Carrossel/Reel/Post/Stories/Engagement | slug do artigo | — | — | — | URL | — | A postar / Agendado / Postado |

Isso dá pra popular com as 313 peças assim que exportarmos do motor.

## Próximo passo sugerido (não iniciado)
Gerar um export único (CSV ou JSON) das 313 peças reais rodando o Social Content Engine sobre os 66 artigos, já no formato da tabela acima, pronto para colar no Business Suite mês a mês. Aviso antes de rodar, já que é a primeira vez que o output completo seria materializado em arquivo.
