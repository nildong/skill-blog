'use strict';

/**
 * cta-rules.js — FASE 2, arquivo NOVO.
 *
 * Decide, para um LOTE (array) de peças já classificadas por
 * enrichment.js, qual OBJETIVO de CTA cada peça recebe, respeitando a
 * distribuição-alvo agregada do lote:
 *
 *   40% interação/comentários, sem link   (OBJETIVO: interacao)
 *   20% curiosidade, sem link             (OBJETIVO: curiosidade)
 *   15% educação, sem link                (OBJETIVO: educacao)
 *   10% entretenimento/identificação, sem link (OBJETIVO: entretenimento)
 *   10% autoridade, sem link              (OBJETIVO: autoridade)
 *    5% tráfego, COM link                 (OBJETIVO: trafego_com_link)
 *
 * Regra de decisão do link (a única categoria que carrega URL no CTA):
 *  - Toda peça de TIPO=CTA_ARTIGO é candidata natural a levar link
 *    (é literalmente o propósito dela: empurrar tráfego pro artigo).
 *  - No máximo 1-2 peças de OUTROS tipos por artigo também podem levar
 *    link (ex.: o Post principal já tem CTA com URL na cópia
 *    fato-do-corpo original) — mas a COTA AGREGADA de 5% do lote
 *    inteiro é o limite duro: se incluir todas as CTA_ARTIGO already
 *    estourar 5%, as excedentes (as com score de prioridade mais
 *    baixo) são REBAIXADAS para 'interacao' sem link.
 *  - Prioridade para manter o link quando há mais candidatas que cota:
 *    1º peças TIPO=CTA_ARTIGO (esse é o job delas), 2º peças cujo
 *    campo `cta` original já contém uma URL http(s) (copy fato-do-corpo
 *    já veio com CTA de link do autor humano).
 *
 * Mapeamento determinístico de TIPO -> família de objetivo "natural"
 * (usado para primeiro palpite antes de aplicar a cota):
 *   PERGUNTA, ENQUETE, OPINIAO                    -> interacao
 *   CURIOSIDADE, VOCE_SABIA, MITO_OU_VERDADE       -> curiosidade
 *   DICA_PRATICA, ERRO_COMUM, PROBLEMA_SOLUCAO, ALERTA, COMPARACAO, LISTA -> educacao
 *   IDENTIFICACAO_PET, HUMOR_LEVE                  -> entretenimento
 *   AUTORIDADE                                     -> autoridade
 *   CTA_ARTIGO                                     -> trafego_com_link (candidato)
 *
 * O ajuste fino para bater EXATAMENTE a distribuição-alvo (dentro de
 * arredondamento) é feito por rebalanceamento determinístico: se uma
 * família tem excesso, as peças excedentes (ordenadas por content_id
 * para determinismo) são realocadas para a família mais próxima com
 * déficit, na ordem de prioridade acima (trafego_com_link sempre por
 * último a perder/ganhar peças, por ser a mais restrita).
 */

const URL_RE = /https?:\/\//;

const FAMILIA_POR_TIPO = {
  PERGUNTA: 'interacao',
  ENQUETE: 'interacao',
  OPINIAO: 'interacao',
  CURIOSIDADE: 'curiosidade',
  VOCE_SABIA: 'curiosidade',
  MITO_OU_VERDADE: 'curiosidade',
  DICA_PRATICA: 'educacao',
  ERRO_COMUM: 'educacao',
  PROBLEMA_SOLUCAO: 'educacao',
  ALERTA: 'educacao',
  COMPARACAO: 'educacao',
  LISTA: 'educacao',
  IDENTIFICACAO_PET: 'entretenimento',
  HUMOR_LEVE: 'entretenimento',
  AUTORIDADE: 'autoridade',
  CTA_ARTIGO: 'trafego_com_link',
};

const TARGET_RATIO = {
  interacao: 0.40,
  curiosidade: 0.20,
  educacao: 0.15,
  entretenimento: 0.10,
  autoridade: 0.10,
  trafego_com_link: 0.05,
};

const CTA_TEMPLATES = {
  interacao: 'Conta pra gente nos comentários 👇',
  curiosidade: 'Você já tinha reparado nisso? Reage aí 👀',
  educacao: 'Salva esse post pra não esquecer 📌',
  entretenimento: 'Marca aquele tutor que precisa ver isso 🐾',
  autoridade: 'Segue pra mais análises como essa',
  trafego_com_link: null, // preserva o CTA original com link (fato-do-corpo)
};

function firstGuessFamilia(piece) {
  return FAMILIA_POR_TIPO[piece.tipo] || 'educacao';
}

function applyCtaRules(pieces) {
  const withGuess = pieces.map((p) => ({ ...p, _familia: firstGuessFamilia(p) }));
  const total = withGuess.length;
  if (total === 0) return [];

  const targetCounts = {};
  for (const [fam, ratio] of Object.entries(TARGET_RATIO)) {
    targetCounts[fam] = Math.max(1, Math.round(ratio * total));
  }

  // Passo 1: decide quem mantém link (cota de 5%, prioridade CTA_ARTIGO > CTA original com URL).
  const linkCandidates = withGuess
    .filter((p) => p._familia === 'trafego_com_link' || URL_RE.test(p.cta || ''))
    .sort((a, b) => {
      const aArtigo = a.tipo === 'CTA_ARTIGO' ? 0 : 1;
      const bArtigo = b.tipo === 'CTA_ARTIGO' ? 0 : 1;
      if (aArtigo !== bArtigo) return aArtigo - bArtigo;
      return String(a.content_id).localeCompare(String(b.content_id));
    });
  const linkQuota = targetCounts.trafego_com_link;
  const keepLinkIds = new Set(linkCandidates.slice(0, linkQuota).map((p) => p.content_id));

  // Passo 2: aplica família final por peça; quem não guarda link entra no "pool a
  // realocar" em vez de cair direto em 'educacao' (evita concentrar tudo lá).
  const assigned = new Map(); // content_id -> familia final (sem link)
  const pool = [];
  for (const p of withGuess) {
    if (p._familia === 'trafego_com_link' && keepLinkIds.has(p.content_id)) {
      assigned.set(p.content_id, 'trafego_com_link');
    } else if (p._familia !== 'trafego_com_link' && URL_RE.test(p.cta || '') && keepLinkIds.has(p.content_id)) {
      assigned.set(p.content_id, 'trafego_com_link');
    } else if (p._familia === 'trafego_com_link') {
      pool.push(p); // excedente de CTA_ARTIGO sem link — precisa de família nova
    } else {
      assigned.set(p.content_id, p._familia);
    }
  }

  // Passo 3: rebalanceamento determinístico do pool — preenche primeiro as
  // famílias (exceto trafego_com_link) com maior déficit em relação à meta.
  const currentCounts = {};
  for (const fam of assigned.values()) currentCounts[fam] = (currentCounts[fam] || 0) + 1;
  const nonLinkFamilies = Object.keys(TARGET_RATIO).filter((f) => f !== 'trafego_com_link');

  const poolSorted = [...pool].sort((a, b) => String(a.content_id).localeCompare(String(b.content_id)));
  for (const p of poolSorted) {
    nonLinkFamilies.sort((a, b) => {
      const deficitA = targetCounts[a] - (currentCounts[a] || 0);
      const deficitB = targetCounts[b] - (currentCounts[b] || 0);
      return deficitB - deficitA;
    });
    const chosen = nonLinkFamilies[0];
    assigned.set(p.content_id, chosen);
    currentCounts[chosen] = (currentCounts[chosen] || 0) + 1;
  }

  const result = withGuess.map((p) => {
    const familia = assigned.get(p.content_id);
    const comLink = familia === 'trafego_com_link';
    const ctaFinal = comLink ? (p.cta || CTA_TEMPLATES.trafego_com_link) : (CTA_TEMPLATES[familia] || p.cta);
    return {
      ...p,
      _familia: undefined,
      objetivo_cta: familia,
      cta_com_link: comLink,
      cta_sugerido: ctaFinal,
    };
  });

  return result;
}

function reportDistribution(pieces) {
  const counts = {};
  for (const p of pieces) counts[p.objetivo_cta] = (counts[p.objetivo_cta] || 0) + 1;
  const total = pieces.length || 1;
  const pct = {};
  for (const [k, v] of Object.entries(counts)) pct[k] = `${((v / total) * 100).toFixed(1)}%`;
  return { counts, pct, total };
}

module.exports = { applyCtaRules, reportDistribution, FAMILIA_POR_TIPO, TARGET_RATIO };
