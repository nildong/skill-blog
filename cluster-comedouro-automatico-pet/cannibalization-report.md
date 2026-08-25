# Cannibalization Report (Local Mode): Cluster Comedouro Automático para Pet

**Modo**: Local (grep-based, sem DataForSEO — nenhuma credencial `DATAFORSEO_LOGIN`/`DATAFORSEO_PASSWORD` configurada neste ambiente).
**Posts analisados**: 12 (pillar + A1-A3 + B1-B3 + C1-C3 + D1-D2)

## Resultado Geral

✅ **Nenhuma palavra-chave primária idêntica** entre os 12 posts — zero clusters de severidade Critical ou High.

## Summary Table

| Post A | Post B | Sobreposição | Severidade | Recomendação |
|---|---|---|---|---|
| pillar | a1, b1 | "comedouro/alimentador automático [espécie]" | Low (subset match) | NO ACTION — hub-and-spoke intencional |
| a3 (VDRBG "vale a pena comprar?") | c1 ("vale a pena um comedouro automático?") | frase de intenção "vale a pena" | Medium (semantic overlap) | NO ACTION — a3 é específico de produto (VDRBG), c1 é decisão de categoria; intents distintos |
| pillar | c1, c3, d1 | menções de "vale a pena" / "bebedouro" no corpo do pillar | Low (subset) | NO ACTION — pillar apenas resume e linka para os posts dedicados |

## Detalhamento

### Cluster 1: Pillar x A1/B1 (hub-and-spoke)
- **Pillar** título: "Comedouro Automático para Pet: Guia Completo 2026" (palavra-chave ampla)
- **A1**: "Melhor Comedouro Automático para Cachorro" | **B1**: "Melhor Alimentador Automático para Gatos"
- Isso é **subset match esperado**: o pillar deve ranquear pelo termo genérico, os spokes pelo termo específico com modificador de espécie + intenção comercial ("melhor"). Essa é exatamente a arquitetura hub-and-spoke planejada no `cluster-plan.json`. **Nenhuma ação necessária.**

### Cluster 2: A3 x C1 (frase "vale a pena")
- **A3**: "Comedouro VDRBG 4L Wi-Fi: Vale a Pena Comprar?" — produto específico, intenção de decisão de compra de um modelo.
- **C1**: "Vale a Pena Comprar um Comedouro Automático? Prós, Contras e Preço" — categoria inteira, intenção de decisão anterior à escolha do produto.
- Overlap é de frase de intenção comum ("vale a pena"), não de palavra-chave principal. Google trata "vale a pena X específico" e "vale a pena X genérico" como buscas de intenção diferente. **Sem ação — intents genuinamente diferentes**, mas monitorar rankings trimestralmente é uma boa prática (documentado aqui para auditoria futura).

### Cluster 3: Pillar x C1/C3/D1 (menções internas)
- O pillar tem seções curtas ("Vale a Pena Comprar...?", "Substitui o Bebedouro?") que resumem os tópicos de C1 e C3/D1 antes de linkar para eles. Isso é o padrão de "seção-resumo + link para conteúdo dedicado" — comportamento saudável de pillar page, não canibalização, desde que o pillar não tente rankear pela cauda longa desses tópicos (o que não é o caso: o pillar não tem H1/título voltado a "vale a pena" ou "bebedouro" como termo principal).

## Conclusão

O cluster está **livre de canibalização de palavra-chave primária**. A única recomendação é de monitoramento (não de ação corretiva): acompanhar trimestralmente se A3 e C1 competem no SERP para consultas como "comedouro automático vale a pena" — caso um comece a canibalizar o outro nos rankings reais, considerar reforçar a diferenciação do título de A3 (ex.: "VDRBG 4L Wi-Fi vale o preço?").

## Próximos Passos
- Nenhuma ação corretiva necessária antes da publicação.
- Para uma checagem com dados reais de SERP (não apenas estrutural), rodar `/blog cannibalization --api` com credenciais DataForSEO configuradas.
