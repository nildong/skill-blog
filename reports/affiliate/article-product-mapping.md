# Mapeamento Artigo → Produto — Fase 1 revisada (após decisões do usuário)

Legenda: 🟢 alta confiança · 🟡 média · 🔴 sem correspondência (NO_MATCH) · ✅ confirmado por decisão do usuário

| Artigo | Intenção | Produto/CTA final | Status | Justificativa |
|---|---|---|---|---|
| `cat-mate-c500-review` | Review de produto específico | — | 🔴 NO_MATCH | Cat Mate C500 não está na base de 15. Não substituir. |
| `comedouro-automatico-anti-formiga` | Informacional | Lista de Afiliados | 🟡 aprovado | Educativo, não recomenda 1 modelo. |
| `comedouro-automatico-faz-mal` | Informacional | Lista de Afiliados | 🟡 aprovado | Riscos gerais da categoria. |
| `comedouro-automatico-gato-obeso` | Controle de porção (gato) | Velds 4L App (`MLB50393304`) | 🟢 aprovado | App + programação de porções. |
| `comedouro-automatico-para-dois-gatos` | Multi-gatos | 6L 3 Tigelas NewPet (`MLB63273800`) | 🟢 aprovado | Match direto com o título. |
| `comedouro-automatico-para-pet` | Guia comparativo (pilar) | Lista de Afiliados | 🟢 aprovado | Guia amplo, não é sobre 1 produto. |
| `comedouro-automatico-para-viagem` | Autonomia/capacidade | Alimentador 8L Wi-Fi (`MLB59318484`) | 🟢 aprovado | Capacidade + monitoramento remoto. |
| `comedouro-automatico-vale-a-pena` | Decisão de compra geral | Lista de Afiliados | 🟢 aprovado | Avalia a categoria inteira. |
| `comedouro-cachorro` | Review de kit **manual** (não é eletrônico) | Já monetizado com link próprio (`meli.la/1iG4YjY`), fora da base de 15 | 🔴 NO_MATCH ✅ | **Verificado no conteúdo (JSON-LD/FAQ):** é um kit de 20 cochos manuais de 8L com suporte metálico tipo baia, para fixação em cerca/curral — produto de fazenda/canil, não é alimentador automático eletrônico. New Pet 4L não é substituto adequado. Confirma-se NO_MATCH quanto à base de 15 produtos. **Correção pós-auditoria:** o artigo NÃO é órfão — já tem 2 links de afiliado próprios em `meli.la/1iG4YjY`, não capturados pela varredura original (que só buscava `mercadolivre.com.br`). |
| `comedouro-com-ou-sem-wifi` | Comparação Wi-Fi vs. sem Wi-Fi | Lista de Afiliados (CTA principal) + menção contextual ao Velds 4L (`MLB50393304`) se fizer sentido no texto | 🟡 aprovado ✅ | Decisão do usuário: sem CTA duplo redundante; Lista informa primeiro, menção ao Velds é orgânica no corpo do texto, não um segundo botão. |
| `comedouro-gato-x-cachorro-diferenca` | Comparação por espécie | Lista de Afiliados | 🟡 aprovado | Compara categorias, não 1 modelo. |
| `comedouro-newpet-2l-review` | Review de produto específico | — | 🔴 NO_MATCH | Base não tem versão 2L. |
| `comedouro-newpet-4l-review` | Review de produto específico | New Pet 4L com Voz — **principal** (`MLB54558374`) | 🟢 aprovado ✅ | Decisão do usuário resolveu a ambiguidade entre 3 anúncios: `MLB54558374` é o produto principal (mais vendidos/avaliações, dado reportado pelo usuário). `MLB48883369` fica registrado como secundário/alternativa de preço, sem uso nesta Fase 2A. `MLB63214646` marcado `active:false` — tratado como duplicado, fora de uso. |
| `comedouro-vdrbg-4l-wifi-review` | Review de produto específico (marca VDRBG) | — | 🔴 NO_MATCH | Marca não está na base; trocar marca num review é editorialmente arriscado. |
| `comedouro-x-bebedouro-automatico` | Kit combo | Kit Comedouro+Bebedouro 3L (`MLBU757044226`) | 🟢 aprovado | Match direto com o tema do artigo. |
| `como-limpar-comedouro-automatico` | Informacional (manutenção) | Lista de Afiliados | 🟡 aprovado | Baixa intenção comercial direta. |
| `configurar-app-comedouro-wifi` | Tutorial do app Tuya | Comedouro WiFi NewPet 5L Tuya (`MLB54519773`) | 🟡 aprovado | Produto da base mais ligado ao app citado. |
| `melhor-alimentador-automatico-gatos` | Guia comparativo (gatos) | Lista de Afiliados | 🟢 aprovado | Comparativo explícito. |
| `melhor-comedouro-automatico-cachorro` | Guia comparativo (cães) | Lista de Afiliados | 🟢 aprovado | Comparativo explícito. |
| `melhor-comedouro-interativo-gato` | Categoria "interativo" | — | 🔴 NO_MATCH | Nenhum produto da base é do tipo quebra-cabeça/interativo. |

## Lista final — 15 artigos autorizados para Fase 2A

**Produto individual (6):**
1. `comedouro-automatico-gato-obeso` → `MLB50393304` (Velds 4L App)
2. `comedouro-automatico-para-dois-gatos` → `MLB63273800` (6L 3 Tigelas)
3. `comedouro-automatico-para-viagem` → `MLB59318484` (Alimentador 8L Wi-Fi)
4. `comedouro-x-bebedouro-automatico` → `MLBU757044226` (Kit 3L)
5. `configurar-app-comedouro-wifi` → `MLB54519773` (WiFi NewPet 5L Tuya)
6. `comedouro-newpet-4l-review` → `MLB54558374` (New Pet 4L com Voz — principal)

**Lista de Afiliados (9):**
7. `comedouro-automatico-anti-formiga`
8. `comedouro-automatico-faz-mal`
9. `comedouro-automatico-para-pet`
10. `comedouro-automatico-vale-a-pena`
11. `comedouro-gato-x-cachorro-diferenca`
12. `como-limpar-comedouro-automatico`
13. `melhor-alimentador-automatico-gatos`
14. `melhor-comedouro-automatico-cachorro`
15. `comedouro-com-ou-sem-wifi` (Lista + menção contextual ao Velds 4L no corpo do texto)

## Fase 2B (adiada, fora do escopo desta migração) — 5 artigos NO_MATCH

- `cat-mate-c500-review`
- `comedouro-newpet-2l-review`
- `comedouro-vdrbg-4l-wifi-review`
- `melhor-comedouro-interativo-gato`
- `comedouro-cachorro` (confirmado NO_MATCH quanto à base de 15 produtos — é kit manual, não eletrônico. **Já monetizado** via `meli.la/1iG4YjY`, pré-existente; não é oportunidade órfã — não precisa de ação na Fase 2B, apenas eventual avaliação futura de se esse link/produto deveria entrar na base oficial)

## ⚠️ Bloqueio para execução real da Fase 2

Tanto `list.affiliate_url` quanto o `affiliate_url` dos 6 produtos individuais ainda estão `null` em `.data/affiliate-products.json`. Sem esses links, a Fase 2 pode no máximo apontar para `product_url` (link público, sem comissão) — **não** para um link de afiliado de fato. Recomendo só rodar a migração real depois que:
1. Você colar o link de compartilhamento público da Lista "COMEDOUROS AUTO P GATOS"; e
2. Confirmar se `affiliate_url` dos 6 produtos individuais será o mesmo `product_url` (com o parâmetro de afiliado do Mercado Livre já embutido) ou um link gerado à parte pela Central de Afiliados.
