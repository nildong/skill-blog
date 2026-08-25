'use strict';

/**
 * Stopwords em português — palavras funcionais muito comuns que não
 * carregam significado temático e por isso são descartadas antes de
 * comparar termos entre páginas. Lista deliberadamente conservadora:
 * inclui artigos, preposições, conjunções, pronomes e alguns verbos
 * auxiliares muito frequentes. NÃO inclui nenhum termo do nicho pet
 * (ex: "pet", "cão", "gato", "coleira", "comedouro" ficam de fora da
 * lista e são sempre tratados como termos relevantes).
 */
const STOPWORDS_PT = new Set([
  'a', 'o', 'as', 'os', 'um', 'uma', 'uns', 'umas',
  'de', 'da', 'do', 'das', 'dos', 'em', 'no', 'na', 'nos', 'nas',
  'para', 'por', 'pelo', 'pela', 'pelos', 'pelas',
  'com', 'sem', 'sob', 'sobre', 'entre', 'até', 'após', 'ante',
  'e', 'ou', 'mas', 'se', 'que', 'como', 'quando', 'onde', 'qual', 'quais',
  'ao', 'aos', 'à', 'às', 'num', 'numa', 'nele', 'nela', 'neles', 'nelas',
  'é', 'são', 'foi', 'foram', 'ser', 'estar', 'está', 'estão', 'ter', 'tem', 'têm', 'há',
  'seu', 'sua', 'seus', 'suas', 'meu', 'minha', 'meus', 'minhas',
  'este', 'esta', 'estes', 'estas', 'esse', 'essa', 'esses', 'essas',
  'isso', 'isto', 'aquilo', 'aquele', 'aquela', 'aqueles', 'aquelas',
  'ele', 'ela', 'eles', 'elas', 'eu', 'tu', 'nós', 'vós', 'você', 'vocês',
  'já', 'não', 'sim', 'também', 'muito', 'muita', 'muitos', 'muitas',
  'mais', 'menos', 'todo', 'toda', 'todos', 'todas',
  'outro', 'outra', 'outros', 'outras', 'mesmo', 'mesma', 'mesmos', 'mesmas',
  'cada', 'qualquer', 'algum', 'alguma', 'alguns', 'algumas',
  'nenhum', 'nenhuma', 'dele', 'dela', 'deles', 'delas',
  'pode', 'podem', 'deve', 'devem', 'assim', 'então', 'porém', 'contudo',
]);

const MIN_TERM_LENGTH = 2;

/**
 * Remove acentos/diacríticos (NFD + strip) para comparação mais robusta
 * (ex: "câmera" e "camera" devem contar como o mesmo termo). Usado só
 * internamente para tokenização/comparação — nunca para exibir texto ao
 * usuário (anchors/evidências usam o texto original, não normalizado).
 */
function stripDiacritics(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/**
 * Quebra um texto em tokens normalizados (minúsculo, sem acento, sem
 * pontuação), removendo stopwords e tokens curtos demais.
 */
function tokenize(text) {
  if (!text) return [];
  const normalized = stripDiacritics(text.toLowerCase());
  const rawTokens = normalized.split(/[^a-z0-9]+/).filter(Boolean);
  return rawTokens.filter((t) => t.length >= MIN_TERM_LENGTH && !STOPWORDS_PT.has(t));
}

/**
 * Extrai termos relevantes de um ou mais textos e retorna um Map
 * (termo -> frequência). Aceita string única ou array de strings (ex:
 * lista de headings) — trata todos como uma única "bag of words".
 */
function extractTerms(textOrTexts) {
  const texts = Array.isArray(textOrTexts) ? textOrTexts : [textOrTexts];
  const freq = new Map();
  for (const text of texts) {
    for (const token of tokenize(text)) {
      freq.set(token, (freq.get(token) || 0) + 1);
    }
  }
  return freq;
}

/**
 * Coeficiente de sobreposição (overlap coefficient): |A ∩ B| / min(|A|, |B|).
 * Escolhido em vez de Jaccard porque compara conjuntos de tamanhos muito
 * diferentes (ex: termos do title, ~3-8 termos, vs. termos do conteúdo,
 * dezenas/centenas) — Jaccard penalizaria demais o conjunto menor mesmo
 * quando ele está inteiramente contido no maior. Retorna 0-1; 0 se
 * qualquer um dos conjuntos for vazio.
 */
function overlapCoefficient(termsA, termsB) {
  const setA = termsA instanceof Map ? new Set(termsA.keys()) : new Set(termsA);
  const setB = termsB instanceof Map ? new Set(termsB.keys()) : new Set(termsB);
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  const [smaller, larger] = setA.size <= setB.size ? [setA, setB] : [setB, setA];
  for (const term of smaller) {
    if (larger.has(term)) intersection += 1;
  }
  return intersection / smaller.size;
}

/**
 * Retorna a lista de termos em comum entre dois conjuntos/Maps de termos,
 * ordenada por relevância (soma das frequências nos dois lados, desc).
 * Usada para gerar evidências legíveis ("termos em comum: coleira, gps").
 */
function sharedTerms(termsA, termsB, limit = 5) {
  const mapA = termsA instanceof Map ? termsA : new Map([...termsA].map((t) => [t, 1]));
  const mapB = termsB instanceof Map ? termsB : new Map([...termsB].map((t) => [t, 1]));
  const shared = [];
  for (const [term, freqA] of mapA) {
    if (mapB.has(term)) shared.push({ term, weight: freqA + mapB.get(term) });
  }
  shared.sort((a, b) => b.weight - a.weight);
  return shared.slice(0, limit).map((s) => s.term);
}

module.exports = { STOPWORDS_PT, MIN_TERM_LENGTH, tokenize, extractTerms, overlapCoefficient, sharedTerms, stripDiacritics };
