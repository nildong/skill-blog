'use strict';

const { SEVERITY, THRESHOLDS, makeIssue } = require('../rules');

const CATEGORY = 'images';

/**
 * Imagens sem alt são agregadas em UM issue por página (com a contagem na
 * evidência) em vez de um issue por imagem — evita inundar o relatório
 * com dezenas de issues idênticos numa mesma página (ver "Qualidade dos
 * Resultados" no prompt da Fase 2).
 */
function checkImages(page) {
  const issues = [];
  const { image_count, images_missing_alt, images_empty_alt } = page;

  if (images_missing_alt > 0) {
    issues.push(
      makeIssue({
        id: 'IMAGE_ALT_MISSING',
        category: CATEGORY,
        severity: SEVERITY.ERROR,
        evidence: `${images_missing_alt} de ${image_count} imagens sem atributo alt`,
        recommendation: 'Adicionar alt descritivo a todas as imagens (acessibilidade + SEO de imagem).',
      })
    );
  }

  if (images_empty_alt > 0) {
    issues.push(
      makeIssue({
        id: 'IMAGE_ALT_EMPTY',
        category: CATEGORY,
        severity: SEVERITY.WARNING,
        evidence: `${images_empty_alt} de ${image_count} imagens com alt="" (vazio)`,
        recommendation: 'Preencher o alt com uma descrição real, a menos que a imagem seja puramente decorativa.',
      })
    );
  }

  if (image_count > THRESHOLDS.HIGH_IMAGE_COUNT_INFO) {
    issues.push(
      makeIssue({
        id: 'IMAGE_COUNT_HIGH',
        category: CATEGORY,
        severity: SEVERITY.INFO,
        evidence: `${image_count} imagens na página (acima de ${THRESHOLDS.HIGH_IMAGE_COUNT_INFO})`,
        recommendation: 'Revisar se todas as imagens têm contexto/valor editorial claro, ou se algumas podem ser removidas/otimizadas.',
      })
    );
  }

  // Ausência sistemática de width/height é só uma oportunidade (CLS),
  // nunca um erro — só sinalizado quando NENHUMA imagem da página tem
  // dimensões declaradas (evita ruído em páginas parcialmente ok).
  if (image_count > 0) {
    const noneHaveDimensions = page.images.every((img) => !img.width && !img.height);
    if (noneHaveDimensions) {
      issues.push(
        makeIssue({
          id: 'IMAGE_DIMENSIONS_MISSING',
          category: CATEGORY,
          severity: SEVERITY.INFO,
          evidence: 'Nenhuma imagem da página declara width/height',
          recommendation: 'Considerar declarar width/height (ou aspect-ratio via CSS) para reduzir Cumulative Layout Shift.',
        })
      );
    }
  }

  return issues;
}

module.exports = { checkImages };
