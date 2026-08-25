'use strict';

const { SEVERITY, makeIssue } = require('../rules');

const CATEGORY = 'media';

/**
 * Vídeo é tratado como OPORTUNIDADE, nunca exigência — nenhuma página é
 * penalizada por não ter vídeo. As únicas checagens aqui são sobre
 * páginas que JÁ têm vídeo, mas onde falta a estruturação correspondente.
 */
function checkMedia(page) {
  const issues = [];

  if (!page.has_video) return issues;

  const hasVideoObjectSchema = page.schema_types.includes('VideoObject');
  if (!hasVideoObjectSchema) {
    issues.push(
      makeIssue({
        id: 'VIDEO_WITHOUT_SCHEMA',
        category: CATEGORY,
        severity: SEVERITY.INFO,
        evidence: `${page.video_count} vídeo(s) na página sem schema VideoObject correspondente`,
        recommendation: 'Adicionar JSON-LD VideoObject para elegibilidade a rich results de vídeo.',
      })
    );
  }

  const unresolvedEmbeds = page.videos.filter((v) => (v.type === 'youtube' || v.type === 'vimeo') && !v.id);
  if (unresolvedEmbeds.length > 0) {
    issues.push(
      makeIssue({
        id: 'VIDEO_EMBED_ID_UNRESOLVED',
        category: CATEGORY,
        severity: SEVERITY.WARNING,
        evidence: `${unresolvedEmbeds.length} embed(s) de vídeo cujo ID não pôde ser extraído da URL (${unresolvedEmbeds.map((v) => v.url).join(', ')})`,
        recommendation: 'Verificar se a URL do embed está no formato padrão esperado pela plataforma.',
      })
    );
  }

  return issues;
}

module.exports = { checkMedia };
