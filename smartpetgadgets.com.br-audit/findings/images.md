# Auditoria de Imagens - smartpetgadgets.com.br (2026-11-17)

Fontes: varredura do HTML local das 9 páginas (local = live) + PSI (image-delivery-insight).

## Nota: 82/100 (anterior 2026-11-06: 80)

| Página | `<img>` | sem alt | alt="" | sem width/height | lazy | fetchpriority hero | Formatos |
|---|---|---|---|---|---|---|---|
| / | 88 | 0 | 10 | 0 | 80 | não (8 eager) | 2 PNG + cards WebP/srcset |
| melhor-racao-para-gato | 7 | 0 | 0 | 0 | 6 | sim | 7 WebP |
| melhor-racao-para-cachorro | 7 | 0 | 0 | 0 | 6 | sim | 7 WebP |
| melhor-bebedouro-automatico-pet | 8 | 0 | 0 | 0 | 7 | sim (+preload) | 6 WebP, 2 JPG |
| comedouro-automatico-para-pet | 8 | 0 | 0 | 0 | 7 | sim | 6 WebP, 2 JPG |
| camera-pet-com-dispensador-de-petisco | 8 | 0 | 0 | 0 | 7 | sim | 6 WebP, 2 JPG |
| coleira-gps-para-gato | 7 | 0 | 0 | 0 | 6 | sim (+preload) | 7 JPG (src) |
| configurar-app-comedouro-wifi | 6 | 0 | 0 | 0 | 5 | NÃO | 4 JPG, 2 WebP |
| bebedouro-inox-x-ceramica | 6 | 0 | 0 | 0 | 5 | NÃO | 6 JPG (src; hero em picture WebP) |

Nenhuma imagem acima de 150 KB nas 9 páginas. 0 sem alt, 0 sem dimensões (CLS 0 em todas).

## Achados
| Severidade | Finding | Evidência | Correção |
|---|---|---|---|
| Média | Hero do inox x cerâmica sem srcset responsivo, fetchpriority e preload | WebP 66 KB (1200w) servido ao mobile; `-400w` (11 KB) e `-800w` (31 KB) existem e não são usados; LCP 2,7 s | srcset 400/800/1200 + sizes, `fetchpriority="high"`, preload |
| Média | Fotos de produto em JPG com WebP já gerado ao lado | inox x cerâmica: `agbe-ag-200.jpg` 47 KB vs `.webp` 25 KB; PSI image-delivery -45 KiB | Envolver em `<picture>` com WebP |
| Baixa | coleira-gps-para-gato: 7 JPG sem WebP em `<picture>` | varredura | Converter e usar `<picture>` |
| Baixa | configurar-app-comedouro-wifi: hero eager sem fetchpriority | linha do hero `loading="eager"` | Adicionar `fetchpriority="high"` |
| Baixa | Home: 8 imagens eager sem fetchpriority | varredura | Marcar só a LCP como high |
| Info | 10 `alt=""` na home | cards decorativos | Aceitável |
| Info | Auditoria global de 06/11 (6 arquivos > 200 KB em posts antigos) não reverificada nesta amostra | - | Manter pendente |

## O que funciona
- Alt descritivos e dimensões em 100% das imagens das 9 páginas.
- Lazy em todas, exceto hero; posts de dinheiro mais novos com WebP + fetchpriority.
