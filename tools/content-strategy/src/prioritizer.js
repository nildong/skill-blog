'use strict';

/**
 * Regras de prioridade (documentadas — seção 14 do prompt da Fase 4,
 * recalibradas na Fase 4.1 depois de a regra original inflar P0: "DIFFERENTIATE_CONTENT
 * com confidence != LOW" promovia QUALQUER par `possible` a P0, mesmo sem
 * envolver pilar — 38 de 45 P0 reais não envolviam pilar nenhum. A nova
 * regra considera TIPO + papel estratégico (pilar envolvido) + score +
 * confidence, não só "tipo X sempre vira P0".
 *
 * Para tipos que NÃO são DIFFERENTIATE_CONTENT, mantém a regra original
 * baseada só no score total:
 *  P0: total >= 70
 *  P1: total 50-69
 *  P2: total 30-49
 *  P3: total < 30
 *
 * Para DIFFERENTIATE_CONTENT, usa uma matriz separada (`opportunity.
 * involves_pillar`, calculado em opportunities.js a partir do papel real
 * das duas páginas do par):
 *
 *  - Baixa confiança (LOW, score do par 40-49): P2 ou P3 — nunca P0/P1,
 *    mesmo envolvendo pilar (evidência fraca demais para "urgente").
 *  - Envolve PILLAR, confidence MEDIUM/HIGH: P0 se score total da
 *    oportunidade >= 60 OU confidence HIGH; senão P1. Canibalização
 *    tocando o hub de um cluster é sempre pelo menos alta prioridade.
 *  - Entre SATELLITES (nenhum lado é pilar), confidence MEDIUM/HIGH:
 *    P1 se score total >= 60; senão P2.
 *
 * NO_ACTION é sempre P3, independente do tipo.
 */
function assignPriority(opportunity) {
  if (opportunity.type === 'NO_ACTION') return 'P3';

  const total = opportunity.score_breakdown ? opportunity.score_breakdown.total : opportunity.score;

  if (opportunity.type === 'DIFFERENTIATE_CONTENT') {
    return assignDifferentiatePriority(opportunity, total);
  }

  if (total >= 70) return 'P0';
  if (total >= 50) return 'P1';
  if (total >= 30) return 'P2';
  return 'P3';
}

function assignDifferentiatePriority(opportunity, total) {
  const { confidence, involves_pillar: involvesPillar } = opportunity;

  if (confidence === 'LOW') {
    return total >= 40 ? 'P2' : 'P3';
  }

  if (involvesPillar) {
    return total >= 60 || confidence === 'HIGH' ? 'P0' : 'P1';
  }

  return total >= 60 ? 'P1' : 'P2';
}

/**
 * Consolida a lista de oportunidades: remove duplicatas exatas
 * (mesmo type + page + recommended_action — não deveria ocorrer pela
 * construção dos geradores, mas é uma defesa explícita), atribui
 * prioridade, e ordena por (prioridade, score desc).
 */
function consolidate(opportunities) {
  const seen = new Set();
  const deduped = [];
  for (const opp of opportunities) {
    const key = `${opp.type}|${opp.page}|${opp.recommended_action}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push({ ...opp, priority: assignPriority(opp) });
  }

  const priorityRank = { P0: 0, P1: 1, P2: 2, P3: 3 };
  deduped.sort((a, b) => {
    if (priorityRank[a.priority] !== priorityRank[b.priority]) return priorityRank[a.priority] - priorityRank[b.priority];
    return b.score - a.score;
  });

  return deduped;
}

module.exports = { assignPriority, assignDifferentiatePriority, consolidate };
