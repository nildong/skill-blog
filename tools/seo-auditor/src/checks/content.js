'use strict';

const { SEVERITY, THRESHOLDS, PAGE_TYPES, makeIssue } = require('../rules');

const CATEGORY = 'content';

/**
 * IMPORTANTE: word_count é tratado aqui como um SINAL quantitativo, não
 * como julgamento de qualidade. Não existe um número universal de
 * palavras "ideal" para SEO — uma página com intenção de busca específica
 * e objetiva (ex: "X trava a entrada de outros animais?") pode responder
 * completamente à pergunta em poucas centenas de palavras e ser um
 * conteúdo perfeitamente bom. Por isso:
 *
 *  - Só as faixas mais extremas (< 150, ERROR) e intermediárias
 *    (150-299, WARNING) são tratadas como algo a revisar com prioridade.
 *  - A faixa 300-399 é INFO ("CONTENT_BRIEF") — uma oportunidade de
 *    revisão, não um problema. A recomendação nunca diz "adicionar mais
 *    palavras"; diz para avaliar se a intenção de busca está coberta.
 *  - >= 400 palavras não gera nenhum issue de comprimento.
 *
 * Thresholds só se aplicam a `page_type === 'post'` — páginas
 * institucionais (sobre, contato, política editorial) e a página de autor
 * não são penalizadas por serem naturalmente menores.
 *
 * CONTENT_MISSING (página com 0 palavras) é a única checagem desta
 * categoria aplicada a QUALQUER tipo de página, pois uma página
 * completamente vazia é sempre um problema, independentemente do tipo.
 */
function checkContent(page) {
  const issues = [];
  const words = page.content.word_count;

  if (words === THRESHOLDS.CONTENT_CRITICAL_WORDS) {
    issues.push(
      makeIssue({
        id: 'CONTENT_MISSING',
        category: CATEGORY,
        severity: SEVERITY.CRITICAL,
        evidence: 'Nenhum texto detectado no <body> da página (0 palavras)',
        recommendation: 'Verificar se a página carregou/renderizou corretamente; adicionar conteúdo.',
      })
    );
    return issues; // demais checagens de tamanho não fazem sentido para página vazia
  }

  if (page.page_type !== PAGE_TYPES.POST) {
    return issues;
  }

  if (words < THRESHOLDS.CONTENT_ERROR_WORDS) {
    issues.push(
      makeIssue({
        id: 'CONTENT_EXTREMELY_SHORT',
        category: CATEGORY,
        severity: SEVERITY.ERROR,
        evidence: `${words} palavras detectadas (abaixo de ${THRESHOLDS.CONTENT_ERROR_WORDS})`,
        recommendation: 'Considere avaliar se o conteúdo cobre completamente a intenção de busca — o volume atual é bem abaixo do restante do site.',
      })
    );
  } else if (words < THRESHOLDS.CONTENT_WARNING_WORDS) {
    issues.push(
      makeIssue({
        id: 'CONTENT_SHORT',
        category: CATEGORY,
        severity: SEVERITY.WARNING,
        evidence: `${words} palavras detectadas (entre ${THRESHOLDS.CONTENT_ERROR_WORDS} e ${THRESHOLDS.CONTENT_WARNING_WORDS})`,
        recommendation: 'Considere avaliar se o conteúdo cobre completamente a intenção de busca.',
      })
    );
  } else if (words < THRESHOLDS.CONTENT_INFO_WORDS) {
    issues.push(
      makeIssue({
        id: 'CONTENT_BRIEF',
        category: CATEGORY,
        severity: SEVERITY.INFO,
        evidence: `${words} palavras detectadas (entre ${THRESHOLDS.CONTENT_WARNING_WORDS} e ${THRESHOLDS.CONTENT_INFO_WORDS})`,
        recommendation: 'Considere avaliar se o conteúdo cobre completamente a intenção de busca — não é necessariamente um problema, especialmente para páginas com intenção específica e objetiva.',
      })
    );
  }

  return issues;
}

module.exports = { checkContent };
