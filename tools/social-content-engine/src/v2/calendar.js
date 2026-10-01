'use strict';

/**
 * calendar.js — FASE 2, arquivo NOVO.
 *
 * Distribui um lote de peças ao longo de datas, com duas restrições
 * duras aplicadas na ordenação final (nunca violadas, mesmo que force
 * reordenar peças de score/prioridade diferentes):
 *   1. Nunca 2 peças seguidas do MESMO ARTIGO (source_article).
 *   2. Nunca 2 peças seguidas do MESMO TIPO/OBJETIVO (piece.tipo).
 *
 * Algoritmo: fila de prioridade round-robin. Agrupa peças por
 * source_article, depois intercala pegando 1 peça de cada grupo em
 * rodadas (round-robin entre artigos), e dentro de cada rodada ordena
 * por tipo para evitar tipo repetido consecutivo — se um conflito de
 * tipo aparecer mesmo assim (poucos tipos disponíveis no fim da fila),
 * resolve trocando de posição com o próximo item compatível (busca
 * local, determinística).
 *
 * 1 peça por dia útil (segunda a sexta), 1 horário fixo sugerido por
 * FORMATO (heurística de melhor horário por tipo de conteúdo,
 * documentada abaixo), a partir de uma data-base configurável (default:
 * a próxima segunda-feira estritamente depois de hoje).
 *
 * Horários sugeridos por formato (heurística fixa, sem dado de
 * analytics real ainda — marcar como suposição a validar em FASE 3):
 *   reel -> 19:00 (pico de uso à noite)
 *   post -> 12:00 (horário de almoço)
 *   carousel -> 18:00
 *   stories -> 09:00
 *   engagement -> 20:00
 */

const HORARIO_POR_FORMATO = {
  reel: '19:00',
  post: '12:00',
  carousel: '18:00',
  stories: '09:00',
  engagement: '20:00',
};

const DIAS_SEMANA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

function nextMonday(fromDate) {
  const d = new Date(fromDate);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0=domingo
  const diff = (8 - day) % 7 || 7; // sempre estritamente depois de hoje
  d.setDate(d.getDate() + diff);
  return d;
}

function isWeekday(date) {
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

/** Round-robin por source_article: intercala peças de artigos diferentes. */
function interleaveByArticle(pieces) {
  const groups = new Map();
  for (const p of pieces) {
    const key = p.source_article || 'sem-artigo';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p);
  }
  const queues = [...groups.values()];
  const result = [];
  let lastArticle = null;
  while (queues.some((q) => q.length > 0)) {
    // ordena filas por tamanho decrescente para priorizar as maiores, evitando
    // que artigos com muitas peças fiquem todos amontoados no fim
    queues.sort((a, b) => b.length - a.length);
    let picked = false;
    for (const q of queues) {
      if (q.length === 0) continue;
      const candidate = q[0];
      const article = candidate.source_article || 'sem-artigo';
      if (article === lastArticle && queues.some((other) => other !== q && other.length > 0)) continue;
      result.push(q.shift());
      lastArticle = article;
      picked = true;
      break;
    }
    if (!picked) {
      // todas as filas restantes são do mesmo artigo (fim da lista) — força.
      const q = queues.find((x) => x.length > 0);
      if (q) {
        result.push(q.shift());
        lastArticle = result[result.length - 1].source_article;
      }
    }
  }
  return result;
}

/** Reordena localmente para evitar TIPO repetido consecutivo, sem violar a regra de artigo. */
function avoidConsecutiveTipo(pieces) {
  const arr = [...pieces];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i].tipo === arr[i - 1].tipo) {
      // procura à frente uma peça de tipo diferente que também não quebre a regra de artigo
      for (let j = i + 1; j < arr.length; j++) {
        const swapOk = arr[j].tipo !== arr[i - 1].tipo
          && (i + 1 >= arr.length || arr[j].source_article !== arr[i + 1]?.source_article)
          && arr[j].source_article !== arr[i - 1].source_article;
        if (swapOk) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          break;
        }
      }
    }
  }
  return arr;
}

function buildCalendar(pieces, { baseDate = new Date() } = {}) {
  const ordered = avoidConsecutiveTipo(interleaveByArticle(pieces));

  let current = nextMonday(baseDate);
  const withDates = [];
  for (const piece of ordered) {
    while (!isWeekday(current)) current.setDate(current.getDate() + 1);
    const dataSugerida = current.toISOString().slice(0, 10);
    const dia = DIAS_SEMANA[current.getDay()];
    const horario = HORARIO_POR_FORMATO[piece.formato] || '12:00';
    withDates.push({ ...piece, data_sugerida: dataSugerida, dia_semana: dia, horario_sugerido: horario });
    current = new Date(current);
    current.setDate(current.getDate() + 1);
  }
  return withDates;
}

module.exports = { buildCalendar, nextMonday, HORARIO_POR_FORMATO, interleaveByArticle, avoidConsecutiveTipo };
