# Auditoria de Imagens — smartpetgadgets.com.br (2026-11-04)

Fontes: varredura do código local (home + 73 posts, 239 `<img>`) + checagem ao vivo da home.

## Nota: 80/100 (anterior: 76)

## Corrigido desde 2026-10-29
- **Home:** todos os cards agora usam miniaturas WebP 400w/800w com `srcset` (74 `src` únicos, todos `-400w.webp`). Era o maior problema de peso (~550 KB acima da dobra e ~7 MB no scroll). Resolvido.

## Persistente
| Severidade | Finding | Evidência | Correção |
|---|---|---|---|
| Média | Heroes dos posts antigos ainda em JPG | 97 de 239 `<img>` não são WebP/AVIF; 6 arquivos > 200 KB (ex.: `porta-eletronica-impede-entrada-outros-animais-hero.jpg` 344 KB, `porta-eletronica-funciona-porta-de-vidro-hero.jpg` 237 KB, `duvidas-porta-eletronica-pet-hero.jpg` 227 KB, `brinquedo-interativo-substitui-brincadeira-tutor-hero.jpg` 219 KB, `comedouro-cachorro-suporte-baia-02.webp` 210 KB, `comedouro-automatico-para-dois-gatos-hero.jpg` 200 KB) | Converter os heroes JPG para WebP 1200w + 800w (mesmo script usado na home) e servir com `srcset` |
| Média | `fetchpriority="high"` só em 10 páginas | 10 de 73 posts | Adicionar `fetchpriority="high"` (e não `loading="lazy"`) no hero de todos os posts; começar pelas páginas de dinheiro |
| Baixa | 10 `alt=""` na home | cards de destaque (decorativos, título repetido no card) | Aceitável; opcionalmente alt descritivo curto |

## O que funciona
- 0 imagens sem `alt`, 0 sem `width`/`height` (CLS protegido).
- Nenhum hero com `loading="lazy"`; 155 imagens abaixo da dobra com lazy.
- Posts novos (tapete, bebedouro, brinquedo, coleira-gato, cerca) já saem com hero WebP + fetchpriority.
