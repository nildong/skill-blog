# Análise GEO — smartpetgadgets.com.br

Data: 2026-09-30

## 1. Score de Prontidão GEO: 68/100

| Categoria | Peso | Score | Notas |
|---|---|---|---|
| Citabilidade | 25% | 15/25 | Artigos são estruturados, mas não foi confirmado um bloco de resposta autocontido de 130-170 palavras no topo do corpo (verificamos apenas schema/datas de um artigo, não o corpo completo) |
| Legibilidade Estrutural | 20% | 16/20 | Schema FAQPage presente, BreadcrumbList presente, URLs limpas; hierarquia de headings assumida a partir da checagem do H1 |
| Conteúdo Multimodal | 15% | 10/15 | Imagens de destaque + imagens internas presentes; nenhum vídeo/infográfico/ferramenta confirmado |
| Sinais de Autoridade e Marca | 20% | 14/20 | Autoria com Person + Organization, datePublished/dateModified presentes (mesma data = nenhuma cadência de atualização visível); sem presença confirmada em Wikipedia/Reddit/YouTube/LinkedIn |
| Acessibilidade Técnica | 20% | 13/20 | HTML renderizado no servidor (bom), crawlers de IA explicitamente permitidos via Content-Signal, llms.txt presente |

HTML estático sem dependência de JS é a maior vantagem estrutural do site — fica totalmente visível para qualquer crawler de IA testado, com ou sem renderização de JavaScript.

## 2. Breakdown por Plataforma

Não medido com DataForSEO/SE Ranking — sem acesso a essas ferramentas nesta execução. Apenas leituras qualitativas:

- **Google AI Overviews / AI Mode**: posicionamento razoável — HTML estático, schema presente. Indexação **não é mais o gargalo**: o site está 100% indexado (confirmado pelo usuário via GSC UI em 2026-09-28 e reconfirmado em 2026-09-30). O fator limitante agora é ranking/relevância/autoridade, não cobertura de indexação — a elegibilidade para AI Overview depende de a página já rankear bem na busca clássica, então o trabalho a priorizar é SEO tradicional (posição, CTR), não mais indexação.
- **ChatGPT / Perplexity**: OAI-SearchBot e PerplexityBot explicitamente permitidos. Sem presença confirmada em Wikipedia ou Reddit (as duas fontes de citação mais fortes para essas plataformas) — este é o elo mais fraco para essas superfícies.
- **Bing Copilot**: Bingbot permitido via Content-Signal; não verificado separadamente no Bing Webmaster Tools.

## 3. Status de Acesso dos Crawlers de IA (robots.txt, verificado em 2026-09-30)

Todas as entradas abaixo usam `Content-Signal: search=yes, ai-input=yes, ai-train=no` + `Allow: /`.

| Crawler | Capacidade que governa | Status |
|---|---|---|
| Googlebot (implícito, não listado separadamente) | Elegibilidade para Google Search / AI Overviews / AI Mode | Permitido (coberto por `User-agent: *`) |
| GPTBot | Apenas treinamento de modelo OpenAI | Permitido, mas com sinal `ai-train=no` — sinal contraditório, ver abaixo |
| OAI-SearchBot | Citabilidade no ChatGPT Search | Permitido |
| ChatGPT-User | Navegação do ChatGPT acionada pelo usuário | Permitido (diretiva "pode não se aplicar" segundo a OpenAI de qualquer forma) |
| ClaudeBot | Apenas treinamento da Anthropic | Permitido, com `ai-train=no` (contraditório, ver abaixo) |
| Claude-SearchBot | Citabilidade na busca do Claude | Permitido |
| Claude-User | Navegação do Claude acionada pelo usuário | Permitido |
| PerplexityBot | Busca da Perplexity | Permitido |
| Perplexity-User | Busca acionada pelo usuário na Perplexity | Permitido (geralmente ignora o robots.txt de qualquer forma) |
| Google-Extended | Apenas treinamento e grounding de Gemini/Vertex — NÃO afeta Google Search/AIO/AI Mode | Permitido |
| CCBot | Dados de treinamento do Common Crawl | Permitido |
| Applebot | Descoberta via Siri/Spotlight/Safari | Permitido |
| Applebot-Extended | Sinal de opt-out de treinamento da Apple Intelligence | Permitido |
| `anthropic-ai` | Não é um user-agent da Anthropic atualmente documentado (removido do artigo de suporte a crawlers da Anthropic) | Presente no robots.txt mas provavelmente inócuo; sem problema em manter |

**Contradição a sinalizar**: `Content-Signal: ai-train=no` está definido em todos os blocos, inclusive nos crawlers cujo único propósito é treinamento (GPTBot, ClaudeBot, CCBot, Google-Extended, Applebot-Extended), enquanto `Allow: /` concede acesso total aos caminhos. Isso é uma postura intencional e coerente (permitir a busca/citação, mas recusar o treinamento), não um erro de configuração — sinalizando apenas para confirmar que é uma escolha deliberada, não um descuido. Nenhuma mudança é recomendada se o objetivo for realmente recusar o treinamento.

## 4. Status do llms.txt: Presente

`/llms.txt` retorna 200. O conteúdo é mínimo — descrição do site + 5 links (Início, Sobre, Contato, Política editorial, Política de Privacidade, Autores). **Não lista nenhum artigo do blog**, apesar de 70+ posts publicados no sitemap. Segundo o guia de otimização para IA do Google, esse arquivo não tem peso nenhum no Google Search, mas, se for mantido para outros crawlers de IA, deveria ao menos representar o conteúdo que afirma mapear. Recomendação: ou expandir para listar as páginas pilares/de cluster mais importantes (10-20 URLs de maior valor), ou aceitá-lo como artefato de baixa prioridade e deixar como está — não tratar a expansão como uma alavanca de ranking.

## 5. Análise de Menções de Marca

Não medido diretamente (exigiria WebSearch/DataForSEO para buscas de site: e do nome da marca). Conhecido a partir de memória de sessões anteriores:
- A página do Facebook `@smartpetgadgetsbr` está no ar (desbloqueia a distribuição do social-content-engine) — ver memória `smartpetgadgets-facebook-page`.
- Sem presença confirmada em Wikipedia, Reddit, YouTube ou LinkedIn para a marca.
- `sameAs: []` no schema Organization da página inicial — vazio, ou seja, nem o próprio schema declara nenhum perfil social/de entidade ainda, incluindo a página do Facebook que já está no ar.

**Esta é a lacuna de maior alavancagem**: menções de marca se correlacionam 3x mais fortemente com citações de IA do que backlinks, e este site atualmente não tem nenhuma presença verificável além do próprio domínio.

## 6. Citabilidade em Nível de Passagem

Não auditado exaustivamente nos 70+ posts nesta execução (exigiria revisão do corpo de cada artigo). Verificação pontual em `coleira-gps-para-pet/`: ~2.160 palavras, schema FAQPage com 3 pares de Pergunta/Resposta — boa estrutura para extração. Recomenda-se rodar o `blog-geo` (sub-skill específica do blog) por cluster para pontuação em nível de passagem em todo o catálogo, em vez de fazer isso de forma pontual aqui.

## 7. Checagem de Server-Side Rendering

**Aprovado.** A página inicial e o artigo verificado são HTML estático, sem dependência de renderização no cliente observada. Totalmente visível para crawlers que não executam JavaScript (GPTBot, PerplexityBot, ClaudeBot, etc., em seus comportamentos de teste público).

## 8. Top 5 Mudanças de Maior Impacto

1. **Corrigir o `sameAs: []` no schema Organization** — adicionar ao menos a URL da página do Facebook já no ar; adicionar outros perfis conforme forem criados. Melhoria de custo zero e imediata em entity-linking.
2. **Construir presença real de menções de marca** — presença em Reddit/YouTube/Wikipedia tem a correlação mais forte documentada com citação de IA; atualmente é o sinal mais fraco deste site. Começar pelo YouTube (maior correlação), aproveitando os ativos de conteúdo já existentes.
3. **Focar em ranking/CTR, não em indexação** — o site já está 100% indexado (confirmado pelo usuário em 2026-09-28 e 2026-09-30), então esse gargalo está resolvido. O fator que agora limita a elegibilidade para AI Overviews é a posição/autoridade na busca clássica (relevância e sinais de ranking tradicionais de SEO), não mais cobertura de indexação.
4. **Expandir ou aposentar o llms.txt** — atualmente lista 5 páginas estáticas e omite todos os 70+ artigos; ou torná-lo representativo, ou parar de mantê-lo como artefato de curadoria (não tem peso no Google de qualquer forma).
5. **Adicionar cadência de atualização em `dateModified`** — o artigo verificado mostra `datePublished == dateModified`, ou seja, nenhum sinal de atualização visível ainda. O estudo de citação da SE Ranking associa recência (conteúdo com menos de 3 meses) a uma probabilidade de citação ~3x maior; uma rotina programada de atualização nos artigos dos principais clusters (ex.: cluster coleira-gps) ajudaria assim que essas páginas forem indexadas.

## 9. Recomendações de Schema

- Schema Organization: preencher `sameAs` (Facebook agora, outros conforme forem criados).
- Considerar adicionar schema Person com credenciais para a entidade autor em todo o site — sinalizado como trabalho adiado em uma sessão anterior (memória `smartpetgadgets-cluster-coleira-gps`); ainda em aberto.
- Schema FAQPage já presente no artigo verificado — validar se está aplicado de forma consistente em todos os artigos de cluster que têm seção de FAQ.

## 10. Sugestões de Reformatação de Conteúdo

- Nenhuma revisão de passagens em todo o catálogo foi feita nesta execução. Recomenda-se uma execução dedicada do `blog-geo` por artigo (ou por cluster) para identificar passagens específicas sem um bloco de resposta autocontido de 130-170 palavras nos primeiros 30% da página — isso está fora do escopo desta auditoria GEO em nível de site, mas é o próximo passo natural.

---

**Nota de escopo**: Esta auditoria verificou robots.txt, llms.txt, schema/SSR da página inicial e um artigo de amostra. Não rodou DataForSEO/SE Ranking para scores de citação por plataforma, não rastreou o catálogo completo de 70+ artigos para citabilidade em nível de passagem, e não verificou de forma independente a presença de menções de marca via busca. Trate o score de 68/100 como direcional, não como medição de precisão.
