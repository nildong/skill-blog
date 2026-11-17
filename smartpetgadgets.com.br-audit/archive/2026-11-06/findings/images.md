# Auditoria de Imagens — smartpetgadgets.com.br (2026-11-06)

Fontes: varredura do código local (home + posts, 239 `<img>`; local = live após deploy de 2026-11-05).

## Nota: 80/100 (anterior 2026-11-04: 80)

## Delta vs auditoria 2026-11-04
| Achado anterior | Status agora |
|---|---|
| Heroes de posts antigos em JPG; 6 arquivos > 200 KB | CONTINUA. 91 JPG + 6 PNG de 239 `<img>` (142 WebP). Os mesmos 6 arquivos > 200 KB (maior: `porta-eletronica-impede-entrada-outros-animais-hero.jpg`, 344 KB). |
| `fetchpriority="high"` em poucas páginas | CONTINUA. 11 páginas (era 10). |
| 10 `alt=""` na home | CONTINUA (cards decorativos; aceitável). |

## Achados
| Severidade | Finding | Evidência | Correção |
|---|---|---|---|
| Média | Heroes JPG pesados nos posts antigos | 6 arquivos > 200 KB: `porta-eletronica-impede-entrada-outros-animais-hero.jpg` 344 KB, `porta-eletronica-funciona-porta-de-vidro-hero.jpg` 237 KB, `duvidas-porta-eletronica-pet-hero.jpg` 227 KB, `brinquedo-interativo-substitui-brincadeira-tutor-hero.jpg` 219 KB, `comedouro-cachorro-suporte-baia-02.webp` 210 KB, `comedouro-automatico-para-dois-gatos-hero.jpg` 200 KB | Converter para WebP 1200w/800w com `srcset` (mesmo script dos cards da home) |
| Média | `fetchpriority="high"` só em 11 posts | 11 de ~73 posts | Adicionar no hero de todos, começando pelas páginas de dinheiro |
| Baixa | 7 imagens que não são a primeira da página sem `loading="lazy"` | varredura local | Conferir se estão acima da dobra; se não, adicionar lazy |
| Baixa | Fotos de produto pendentes no bebedouro (AGBE, Patas Fiéis) | memória de projeto (2026-10-25); usuário vai mandar capturas | Inserir quando chegarem |
| Info | 10 `alt=""` na home | cards de destaque com título repetido | Aceitável |

## O que funciona
- 0 imagens sem `alt`, 0 sem `width`/`height` (CLS protegido).
- 0 referências a arquivos locais inexistentes.
- Cards da home em WebP 400w/800w com `srcset`.
