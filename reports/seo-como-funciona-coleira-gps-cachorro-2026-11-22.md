# Reforma — /como-funciona-coleira-gps-cachorro/ (2026-11-22)

## Diagnóstico
- **Search Console (90 dias):** 167 impressões, 2 cliques, posição média 7,3. As consultas são todas anônimas (cauda longa).
- **Monetização:** zero. O único link de afiliado (`meli.la/1LdYM2K`, no topo e no final) está **morto**, segundo o price-monitor de 16/11 (curl dá 403).
- **Link interno errado:** a âncora "cerca virtual (geofence)" apontava para o hub, e não para /cerca-virtual-para-cachorro/.
- **Conteúdo fino** (cerca de 680 palavras) e com uma única fonte fraca (blog SecSystem, citada duas vezes).
- **Lacunas técnicas:**
  - O texto não separava *localizar* (GPS/Wi-Fi/torres) de *transmitir* (chip 4G).
  - Tratava o Wi-Fi como "triangulação"; na verdade é consulta a um banco de redes mapeadas.
  - Dizia que o Bluetooth tem "alcance de metros" e ignorava as redes colaborativas (Buscar da Apple, Encontre Meu Dispositivo do Google).
  - Não falava de chip, mensalidade, Anatel, bateria e modos, nem de como a cerca virtual funciona.
- **SERP:** mistura de guias informativos (Tractive, Olhar Digital, ML blog) e listas de compra. As perguntas recorrentes são "precisa de chip?", "tem mensalidade?", "AirTag é GPS?" e "funciona sem sinal?".
- **Título:** a página não estava no teste CTR P1, então o título podia mudar.

## O que foi feito
- **Título:** "Como Funciona a Coleira GPS para Cachorro: Chip, Sinal e Precisão" (65 caracteres).
- **H1:** "Como Funciona a Coleira GPS para Cachorro: Satélite, Chip 4G e Tag Bluetooth Explicados".
- **Meta:** "A coleira acha o cão por satélite e manda a posição ao app pelo chip 4G. Tag Bluetooth não é GPS. Veja precisão, mensalidade, bateria e por que ela falha." (154 caracteres)
- **Estrutura (cerca de 2.800 palavras):**
  1. Resposta curta (duas tarefas) e CTA no topo (The Pet GPS 1m5JTVs).
  2. Resumo em 4 pontos.
  3. Passo a passo do satélite ao app (5 passos).
  4. Tabela com as 3 fontes de localização (precisão e onde falha).
  5. Chip e mensalidade (3 formatos, cobertura, 4G, Anatel).
  6. Tag Bluetooth (4 passos e alerta antiperseguição).
  7. Modos de atualização × bateria.
  8. Cerca virtual (atraso do alerta e raio).
  9. Por que falha.
  10. Um exemplo de cada tipo (4 mini-cards).
  11. Qual tipo para o seu cão (links do cluster).
  12. Como escolhemos.
  13. Conclusão e CTA.
  14. 7 FAQs.
- **Produtos** (todos já existentes no cluster, links com 200):

  | Produto | Preço | Link | Data |
  |---|---|---|---|
  | The Pet GPS 4G | R$ 718 | 1m5JTVs | 12/11 |
  | ANXK G68 4G | R$ 301,99 | 2Dvuw6G | 24/10 (preço mais antigo) |
  | Kit coleira com tag Apple (Ideashop) | R$ 123,38 | 1RWrc8a | — |
  | Coleira com tag Google (Mestre S10) | R$ 151,99 | 14wjrDr | 16/11 |

- **Fontes:**
  - Saiu: SecSystem.
  - Entraram:
    - [GPS.gov](https://archive.gps.gov/systems/gps/performance/accuracy/) (4,9 m com céu aberto)
    - [Tractive](https://tractive.com/pt/fp/live-pet-gps-tracking-for-dogs-and-cats) (5–10 m, ao vivo a cada 2–3 s)
    - [Apple – AirTag e Buscar](https://support.apple.com/pt-br/109021)
    - [Google – Encontre Meu Dispositivo](https://blog.google/intl/pt-br/produtos/android-chrome-play/5-maneiras-de-usar-o-novo-encontre-meu-dispositivo-no-android/)
- **Schema:** BlogPosting (dateModified 2026-11-22), BreadcrumbList, ItemList com 4 Product (unordered, com brand e Offer) e FAQPage com 7 perguntas.
- **Links internos corrigidos ou adicionados:**
  - cerca-virtual-para-cachorro (corrigido)
  - melhor-coleira-gps-sem-mensalidade
  - erros-comuns-coleira-gps-pet
  - coleira-gps-cachorro-pequeno-porte
  - além dos que já existiam
- **Fora da página:** card da home, llms.txt e página do autor atualizados.
- **Imagens:** as 4 dos produtos foram copiadas de coleira-gps-cachorro-pequeno-porte. O hero foi mantido e ganhou srcset 400w/800w e preload.

## Medir
- Compare com o baseline (167 impressões, 2 cliques, posição 7,3) 3 a 6 semanas depois de 22/11.
- Acompanhe os cliques em afiliado (GA4 affiliate_click) nesta página.
- Peça a indexação manual no GSC.
