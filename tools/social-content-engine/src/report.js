'use strict';

const LEVEL_LABEL = { alto: '🟢 alto', médio: '🟡 médio', baixo: '🔴 baixo' };

function fmtLevel(level) {
  return LEVEL_LABEL[level] || level;
}

function buildDryRunMarkdown({ selection, packages, missingSources, generatedAt, previousPilot }) {
  const lines = [];
  lines.push('# Social Content Engine — Dry-Run (Piloto)');
  lines.push('');
  lines.push(`Gerado em: ${generatedAt}`);
  lines.push('');
  lines.push('**Modo:** dry-run / pilot. Nenhuma peça de conteúdo social (Reel, Post, Carrossel, Stories, Pergunta) foi gerada nesta etapa — apenas a oportunidade de cada formato foi estruturada, conforme autorizado. Nenhum HTML, imagem, link de afiliado ou sitemap foi alterado. Nada foi publicado no Facebook/Instagram.');
  lines.push('');
  lines.push('**⚠️ Esta é a 2ª execução do dry-run**, com o seletor revisado após feedback do usuário: a 1ª execução pontuava afiliado como critério dominante e concentrou 8/10 artigos no único cluster com afiliado mapeado (comedouros). O seletor foi reescrito para priorizar interesse/engajamento/compartilhamento/tráfego, com monetização como fator secundário de peso baixo, e para distribuir a seleção por cotas de cluster. Ver seção "Comparação com o piloto anterior".');
  lines.push('');

  lines.push('## Critérios de seleção dos 10 artigos (revisado)');
  lines.push('');
  lines.push('Ordem de prioridade: interesse do público → engajamento (comentário) → compartilhamento → tráfego para o blog → diversidade de clusters → monetização (secundário).');
  lines.push('');
  lines.push('Pontuação por candidato (score máximo teórico 88, monetização limitada a 8 pts — <10% do teto dos outros 4 fatores combinados):');
  lines.push('');
  lines.push('| Fator | Regra | Pontos |');
  lines.push('|-------|-------|--------|');
  lines.push('| Engajamento | FAQ existente na fonte / role=FAQ | 20 / 15 |');
  lines.push('| Interesse | role REVIEW/COMPARISON/HOW_TO/GUIDE / satélite >=400 palavras | 20 / 8 |');
  lines.push('| Interesse | slug indica problema/dúvida comum (erros-comuns-*, duvidas-*) | +10 |');
  lines.push('| Compartilhamento | role COMPARISON / imagens próprias (1 ou 2+) | 15 / 5-10 |');
  lines.push('| Tráfego | inbound_links (do content-strategy.json): >=10 / >=5 / >=1 | 15 / 10 / 5 |');
  lines.push('| Monetização (secundário) | produto afiliado ativo no cluster | 8 |');
  lines.push('');
  lines.push('Depois de pontuar, a seleção é preenchida por **cotas de diversidade de cluster** (não apenas top-10 por score):');
  lines.push('');
  lines.push('| Grupo | Cota |');
  lines.push('|-------|------|');
  lines.push('| Comedouros | 3 |');
  lines.push('| Coleira/GPS | 2 |');
  lines.push('| Câmera/monitoramento | 2 |');
  lines.push('| Cachorro/higiene/acessórios (substituto: cluster unknown) | 2 |');
  lines.push('| Outros clusters | 1 |');
  lines.push('');
  lines.push('Dentro de cada grupo, desempate por score desc → word_count desc → slug asc. Se um grupo não tiver candidatos suficientes, as vagas restantes são preenchidas pelo melhor score geral, fora de cota, e isso é documentado explicitamente (não se inventa cluster nem se força candidato fraco na cota). Páginas institucionais (contato, sobre, política editorial, autores) são sempre excluídas.');
  lines.push('');

  lines.push('### Distribuição por grupo nesta execução');
  lines.push('');
  lines.push('| Grupo | Cota | Preenchido | Status | Artigos |');
  lines.push('|-------|------|------------|--------|---------|');
  selection.diversity_report.forEach((g) => {
    lines.push(`| ${g.label} | ${g.quota} | ${g.filled} | ${g.met ? '✅ atingida' : '⚠️ déficit'} | ${g.picked.join(', ') || '—'} |`);
  });
  lines.push('');
  if (selection.fillers_used > 0) {
    lines.push(`**${selection.fillers_used} vaga(s) preenchida(s) fora de cota** (melhor score geral) por falta de candidatos suficientes em algum grupo — ver déficits acima.`);
    lines.push('');
  }

  lines.push('## Os 10 artigos selecionados');
  lines.push('');
  lines.push('| # | Slug | Score | Grupo | Cluster | Fonte/Confiança | Papel | Palavras |');
  lines.push('|---|------|-------|-------|---------|------------------|-------|----------|');
  selection.selected.forEach((c, i) => {
    lines.push(`| ${i + 1} | ${c.slug} | ${c.score} | ${c.diversity_group} | ${c.cluster || '—'} | ${c.cluster_source}/${c.cluster_confidence} | ${c.role || '—'} | ${c.word_count} |`);
  });
  lines.push('');

  lines.push('### Justificativa por artigo (com detalhamento de potencial)');
  lines.push('');
  selection.selected.forEach((c, i) => {
    const b = c.score_breakdown;
    lines.push(`**${i + 1}. ${c.slug}** (score ${c.score} — engajamento ${b.engagementPotential}, interesse ${b.interestPotential}, compartilhamento ${b.sharePotential}, tráfego ${b.trafficPotential}, monetização ${b.monetizationPotential})`);
    c.reasons.forEach((r) => lines.push(`- ${r}`));
    lines.push('');
  });

  if (previousPilot && previousPilot.entries && previousPilot.entries.length) {
    lines.push('## Comparação com o piloto anterior');
    lines.push('');
    lines.push(`Piloto anterior gerado em: ${previousPilot.generated_at}`);
    lines.push('');
    const prevSlugs = new Set(previousPilot.entries.map((e) => e.slug));
    const currSlugs = new Set(selection.selected.map((c) => c.slug));
    const kept = [...currSlugs].filter((s) => prevSlugs.has(s));
    const removed = [...prevSlugs].filter((s) => !currSlugs.has(s));
    const added = [...currSlugs].filter((s) => !prevSlugs.has(s));

    lines.push('| Piloto anterior | Cluster | Piloto novo | Cluster | Status |');
    lines.push('|------------------|---------|-------------|---------|--------|');
    previousPilot.entries.forEach((e) => {
      const status = currSlugs.has(e.slug) ? 'mantido' : 'removido (fora do novo piloto)';
      lines.push(`| ${e.slug} | ${e.cluster || '—'} | | | ${status} |`);
    });
    added.forEach((s) => {
      const c = selection.selected.find((x) => x.slug === s);
      lines.push(`| | | ${s} | ${c.cluster || '—'} | novo (não estava no piloto anterior) |`);
    });
    lines.push('');
    lines.push(`**Resumo:** ${kept.length} artigo(s) mantido(s), ${removed.length} removido(s), ${added.length} novo(s).`);
    lines.push('');
    lines.push('O piloto anterior tinha 8/10 artigos do cluster "comedouro-automatico-para-pet" (concentração de 80% em um único tema, causada por afiliado dominar o score). Este piloto revisado distribui por 5 grupos de diversidade — ver tabela de distribuição acima.');
    lines.push('');
  } else {
    lines.push('## Comparação com o piloto anterior');
    lines.push('');
    lines.push('Não há piloto anterior salvo em `.data/social-content-index.json` para comparar (primeira execução encontrada).');
    lines.push('');
  }

  lines.push('## Análise detalhada por artigo');
  lines.push('');
  packages.forEach((entry, i) => {
    const p = entry.pkg;
    lines.push(`### ${i + 1}. ${p.article.title}`);
    lines.push('');
    lines.push(`- **URL:** ${p.article.url}`);
    lines.push(`- **Público provável:** ${p.article.audience}`);
    lines.push(`- **Cluster:** ${p.article.cluster || '—'} (\`cluster_source: ${p.article.cluster_source}\`, \`cluster_confidence: ${p.article.cluster_confidence}\`)`);
    lines.push(`- **Papel editorial:** ${p.article.role || 'não determinado'}`);
    lines.push(`- **Palavras (fonte):** ${p.article.word_count}`);
    lines.push(`- **Imagens próprias reaproveitáveis:** ${p.signals.own_images.length}${p.signals.own_images.length ? ' — ' + p.signals.own_images.map((im) => im.src).join(', ') : ''}`);
    lines.push(`- **FAQ na fonte:** ${p.signals.faq_question_count} pergunta(s)`);
    lines.push(`- **Produtos afiliados no cluster:** ${p.signals.affiliate_products.length ? p.signals.affiliate_products.map((pr) => pr.name).join('; ') : 'nenhum mapeado ainda (não é erro)'}`);
    lines.push(`- **Artigos relacionados (links internos):** ${p.signals.related_internal_links.length ? p.signals.related_internal_links.join(', ') : 'nenhum encontrado'}`);
    lines.push('');
    lines.push('**Potencial por formato:**');
    lines.push('');
    lines.push('| Formato | Potencial | Motivo |');
    lines.push('|---------|-----------|--------|');
    lines.push(`| Reel | ${fmtLevel(p.format_potential.reel.level)} | ${p.format_potential.reel.reason} |`);
    lines.push(`| Post | ${fmtLevel(p.format_potential.post.level)} | ${p.format_potential.post.reason} |`);
    lines.push(`| Carrossel | ${fmtLevel(p.format_potential.carousel.level)} | ${p.format_potential.carousel.reason} |`);
    lines.push(`| Stories | ${fmtLevel(p.format_potential.stories.level)} | ${p.format_potential.stories.reason} |`);
    lines.push(`| Pergunta/engajamento | ${fmtLevel(p.format_potential.engagement_question.level)} | ${p.format_potential.engagement_question.reason} |`);
    lines.push(`| Vídeo curto | ${fmtLevel(p.format_potential.short_video.level)} | ${p.format_potential.short_video.reason} |`);
    lines.push(`| CTA | ${fmtLevel(p.format_potential.cta.level)} | ${p.format_potential.cta.reason} |`);
    lines.push(`| Remarketing | ${fmtLevel(p.format_potential.remarketing.level)} | ${p.format_potential.remarketing.reason} |`);
    lines.push('');
    if (p.problems.length) {
      lines.push('**Problemas/limitações identificados:**');
      p.problems.forEach((pr) => lines.push(`- ⚠️ ${pr}`));
      lines.push('');
    }
    if (p.similarity_warning) {
      lines.push('**⚠️ Aviso de similaridade** (possível sobreposição de tema com outro artigo do piloto — não gerar conteúdo social quase idêntico sem diferenciar):');
      p.similarity_details.forEach((d) => lines.push(`- vs \`${d.with}\`: overlap ${d.overlap} (mesmo cluster: ${d.same_cluster ? 'sim' : 'não'})`));
      lines.push('');
    }
  });

  lines.push('## Dados ausentes / limitações gerais');
  lines.push('');
  const limitations = [
    'Nenhuma peça de conteúdo social (texto de Reel, legenda de Post, slide de Carrossel, Stories, pergunta) foi gerada nesta fase — apenas a oportunidade por formato, conforme escopo autorizado.',
    'Cluster nunca é lido de um campo confiável — vem de `.data/content-strategy.json` quando disponível (known/probable), ou de heurística fraca de prefixo de slug como último recurso (sempre marcada `cluster_source: "heuristic"`, `cluster_confidence: "low"`). Nunca tratado como verdade absoluta.',
    'Produtos afiliados só existem hoje para o cluster "comedouro-automatico-para-pet" em affiliate-products.json — artigos de outros clusters legitimamente aparecem com 0 produtos mapeados; isso não é um erro do engine.',
    '"Imagens próprias reaproveitáveis" é uma contagem de imagens do artigo (excluindo logo/favicon/apple-touch), não uma avaliação de qualidade/composição/direitos de uso — validação visual continua manual.',
    'Aviso de similaridade usa apenas overlap ponderado de termos do TÍTULO entre os 10 artigos do piloto (mesma fórmula de tools/shared/semantic-terms.js) — não analisa o corpo inteiro; é um sinal para revisão humana, não uma decisão automática.',
    'O grupo de diversidade "cachorro-higiene-acessórios" não corresponde a nenhum cluster real identificado pelo Content Strategy Engine hoje (só existem 5 pilares: comedouro, câmera, coleira-gps, porta-eletrônica, brinquedo-interativo) — usamos como substituto o grupo de artigos com cluster "unknown" (ex.: cercado-para-cachorros, tapete-higiênico-para-cachorro), documentado explicitamente. Não é o mesmo que um cluster editorial real desse tema.',
    'Cotas de diversidade são aplicadas apenas dentro do Social Content Engine — a alteração NÃO modifica tools/content-strategy (o Content Strategy Engine e seu content-strategy.json continuam exatamente como estavam).',
  ];
  if (missingSources.length) {
    limitations.push(`Fontes de dados ausentes nesta execução: ${missingSources.join(', ')}.`);
  }
  limitations.forEach((l) => lines.push(`- ${l}`));
  lines.push('');

  lines.push('## Próximo passo (aguardando autorização)');
  lines.push('');
  lines.push('Esta é a etapa **DRY-RUN**. O fluxo obrigatório é: AUDITORIA → DRY-RUN → REVISÃO → AUTORIZAÇÃO → GERAÇÃO PILOTO. Nenhuma peça de conteúdo (Reel/Post/Carrossel/Stories/Pergunta) deve ser gerada, e nada deve ser publicado, até autorização explícita para a fase seguinte.');
  lines.push('');

  return lines.join('\n');
}

const PIECE_TYPE_LABEL = { reels: 'Reels', posts: 'Posts', carousel: 'Carrossel', stories: 'Stories', engagement: 'Pergunta/engajamento' };

function pieceHeadline(piece) {
  if (piece.status === 'insufficient_source') return `⚠️ NÃO GERADO — ${piece.reason}`;
  if (piece.hook) return `**Hook:** ${piece.hook}`;
  if (piece.titulo_gatilho) return `**Título/gatilho:** ${piece.titulo_gatilho}`;
  if (piece.pergunta) return `**Pergunta:** ${piece.pergunta}`;
  if (piece.tipo === 'enquete') return `**Enquete:** ${piece.conteudo} (${(piece.opcoes || []).join(' / ')})`;
  if (piece.tipo === 'cta') return `**Stories CTA:** ${piece.conteudo}`;
  if (piece.slides) return `**Carrossel:** ${piece.slides.length} slides`;
  return '(sem preview)';
}

function buildGenerationMarkdown({ selection, packages, missingSources, generatedAt, previousPilot }) {
  const lines = [];
  lines.push('# Social Content Engine — Geração Piloto (autorizada)');
  lines.push('');
  lines.push(`Gerado em: ${generatedAt}`);
  lines.push('');
  lines.push('**Modo:** geração piloto, autorizada explicitamente pelo usuário após revisão do dry-run diversificado. Gera até 8 peças por artigo (2 Reels, 2 Posts, 1 Carrossel, 2 Stories, 1 Pergunta de engajamento) para os mesmos 10 artigos do piloto revisado. **Nada foi publicado** — sem integração com Facebook/Instagram nesta V1. Nenhum HTML, imagem, link de afiliado ou sitemap foi alterado.');
  lines.push('');
  lines.push('**Princípio aplicado a cada peça:** todo texto criativo (hook, legenda, pergunta) é montado a partir de apenas 4 campos já extraídos do HTML real do artigo — título, meta description, headings (h2/h3) e headings que já são perguntas. Quando a fonte não tem gancho real suficiente para um formato, a peça fica `insufficient_source` em vez de inventar conteúdo — ver detalhamento por peça abaixo.');
  lines.push('');

  let totalPieces = 0, totalGenerated = 0, totalNeedsReview = 0, totalInsufficient = 0;
  packages.forEach((p) => {
    const s = p.pkg.generation_summary;
    totalPieces += s.total_pieces; totalGenerated += s.generated; totalNeedsReview += s.needs_review; totalInsufficient += s.insufficient_source;
  });

  lines.push('## Resumo geral');
  lines.push('');
  lines.push(`- Artigos processados: ${packages.length}`);
  lines.push(`- Peças totais (máximo teórico 8 × ${packages.length} = ${packages.length * 8}): ${totalPieces}`);
  lines.push(`- ✅ Geradas e aprovadas no quality gate: ${totalGenerated}`);
  lines.push(`- ⚠️ Precisam de revisão humana (falharam algum check): ${totalNeedsReview}`);
  lines.push(`- 🚫 Não geradas por falta de gancho real na fonte (não inventadas): ${totalInsufficient}`);
  lines.push('');

  lines.push('## Resumo por artigo');
  lines.push('');
  lines.push('| Artigo | Total | Geradas | Revisão | Não geradas | Status |');
  lines.push('|--------|-------|---------|---------|--------------|--------|');
  packages.forEach((p) => {
    const s = p.pkg.generation_summary;
    lines.push(`| ${p.pkg.article.slug} | ${s.total_pieces} | ${s.generated} | ${s.needs_review} | ${s.insufficient_source} | ${p.pkg.status} |`);
  });
  lines.push('');

  lines.push('## Detalhamento por artigo e peça');
  lines.push('');
  packages.forEach((p, i) => {
    const a = p.pkg.article;
    lines.push(`### ${i + 1}. ${a.title}`);
    lines.push('');
    lines.push(`- URL: ${a.url}`);
    lines.push(`- Cluster: ${a.cluster || '—'} (${a.cluster_source}/${a.cluster_confidence})`);
    lines.push('');
    Object.entries(PIECE_TYPE_LABEL).forEach(([key, label]) => {
      const pieces = p.pkg.content[key] || [];
      lines.push(`**${label}** (${pieces.length}):`);
      pieces.forEach((piece) => {
        lines.push(`- \`${piece.content_id}\` [${piece.status}] ${pieceHeadline(piece)}`);
        if (piece.quality_checks) {
          const failed = piece.quality_checks.filter((c) => !c.ok);
          if (failed.length) lines.push(`  - checks reprovados: ${failed.map((c) => c.name).join('; ')}`);
        }
      });
      lines.push('');
    });
  });

  lines.push('## Quality gate — o que é checado em cada peça');
  lines.push('');
  lines.push('- Possui artigo de origem e URL válida (`https://smartpetgadgets.com.br/...`).');
  lines.push('- Não contém placeholder (`TODO`, `{{...}}`, "lorem ipsum", "[preencher]" etc.).');
  lines.push('- Não contém preço (`R$ ...`) — preço nunca é citado em peça social gerada automaticamente.');
  lines.push('- Possui CTA quando o formato exige.');
  lines.push('- Conteúdo criativo (hook/pergunta/título-gatilho) tem sobreposição de vocabulário real (>=40%) com título, meta description ou algum heading do artigo — barreira contra texto solto não rastreável à fonte.');
  lines.push('');
  lines.push('Peça que falha qualquer check vira `needs_review` e não deve ir para fila editorial sem correção humana.');
  lines.push('');

  if (missingSources.length) {
    lines.push('## Fontes de dados ausentes nesta execução');
    lines.push('');
    missingSources.forEach((m) => lines.push(`- ${m}`));
    lines.push('');
  }

  lines.push('## Limitações desta geração');
  lines.push('');
  [
    'Geração 100% baseada em templates determinísticos sobre 4 campos-fonte (título, meta description, headings, headings-pergunta) — não é reescrita livre por um modelo de linguagem, de propósito, para manter rastreabilidade total e reprodutibilidade.',
    'Reel 2 / Post 2 / Stories 1 / Pergunta de engajamento podem não ser gerados para artigos com poucos headings reais — isso reduz o total de peças abaixo de 80, e é o comportamento esperado (não inventar) em vez de forçar 8 peças por artigo.',
    'Roteiro de Reel e legendas de Post reaproveitam a meta_description como resumo — em textos mais longos isso pode soar repetitivo entre Post 1 e o "informação" do Reel do mesmo artigo; recomenda-se revisão editorial humana antes de publicar, especialmente para variar a redação final.',
    'Sugestão de imagem por peça é apenas "usar imagem existente: <src>" ou "precisa de imagem nova" — não há avaliação de enquadramento/qualidade/direitos de uso.',
    'Nenhuma peça foi publicada, agendada ou enviada a qualquer API de Facebook/Instagram — não existe esse código nesta V1.',
  ].forEach((l) => lines.push(`- ${l}`));
  lines.push('');

  lines.push('## Próximo passo (aguardando autorização)');
  lines.push('');
  lines.push('Fluxo obrigatório: AUDITORIA → DRY-RUN → REVISÃO → AUTORIZAÇÃO → **GERAÇÃO PILOTO (concluída aqui)** → VALIDAÇÃO → AUTORIZAÇÃO → ESCALA. Esta execução entrega a geração piloto para revisão humana de qualidade. Publicação, fila editorial automática, ou expansão para os demais artigos do site exigem nova autorização explícita.');
  lines.push('');

  return lines.join('\n');
}

module.exports = { buildDryRunMarkdown, buildGenerationMarkdown };
