'use strict';

/**
 * media-planner.js — FASE 2, arquivo NOVO. NÃO gera nenhuma imagem/vídeo,
 * apenas produz um PLANO (JSON) por peça.
 *
 * Limitação confirmada por leitura de reports/social-content/social-content-audit-v2.md
 * (seção 5): o gerador V1 (`generate_assets.py`) escolhe a foto-base por
 * `seed = hash(row["id"]) % 10000` usando o `hash()` nativo do Python, que é
 * RANDOMIZADO entre execuções (sem PYTHONHASHSEED fixo) — não existe, e não é
 * possível reconstruir retroativamente, um crosswalk determinístico
 * "PECA-NNN.png -> qual das 15 fotos Pexels". Além disso, o texto do hook fica
 * CRAVADO no PNG final (não é uma camada separada), e o próprio relatório de
 * auditoria já recomenda (seção 6) regenerar as ~435 imagens/vídeos
 * correspondentes aos 63 artigos com V2, porque o hook V2 é reescrito
 * manualmente e por isso quase sempre difere do texto que already está
 * cravado no PNG V1 mesmo nos casos classe A.
 *
 * Diante disso, a regra determinística adotada aqui (documentada, não
 * escondida) é:
 *
 *   REGENERAR sempre que a peça é V2 fato-do-corpo (todas as 307 desta fase),
 *   pois o texto mudou em relação ao PNG V1 existente e não há como apontar
 *   com segurança qual PNG antigo corresponde à nova peça.
 *
 *   REAPROVEITAR só seria aplicável a peças cujo hook NÃO mudou entre V1 e V2
 *   — nenhuma peça desta leva se qualifica (confirmado pela leitura do
 *   próprio conteúdo: todas têm `source.source_type = 'body_fact'`, ou seja,
 *   hook reescrito a partir do corpo do artigo, diferente do hook V1 baseado
 *   em heading).
 *
 * O `score` (score.js) e a classe A/B/C/D do artigo (quando disponível) NÃO
 * mudam a decisão REAPROVEITAR/REGENERAR (que é estrutural, ver acima), mas
 * entram como `prioridade` (1 = mais urgente regenerar primeiro) para
 * sequenciar o trabalho de mídia real da FASE 3: score mais alto primeiro
 * (mais perto de pronto pra publicar, desbloqueia mais rápido).
 *
 * A FOTO-BASE reaproveitada é escolhida de forma determinística (nunca por
 * hash randomizado) por `cluster -> índice fixo`, usando o mesmo catálogo de
 * clusters do manifest do Pexels cache (tools/social-content-engine/assets/pexels_cache/manifest.json),
 * com fallback para 'geral' quando o cluster do artigo não tem fotos próprias
 * (mesmo fallback que generate_assets.py já usa para porta-eletrônica).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const MANIFEST_PATH = path.join(ROOT, 'tools', 'social-content-engine', 'assets', 'pexels_cache', 'manifest.json');
const IMG_V2_DIR = path.join('output_midia_avancada', 'imagens_v2');
const VID_V2_DIR = path.join('output_midia_avancada', 'videos_v2');

const CLUSTER_ALIASES = {
  'comedouro-automatico-para-pet': 'comedouros',
  'coleira-gps-para-pet': 'coleira-gps',
  'camera-para-monitorar-pet': 'cameras',
  'brinquedo-interativo-para-pet': 'brinquedos',
  'bebedouro-fonte-para-pet': 'fontes',
  'tapete-higienico-para-pet': 'higiene',
};

function loadManifest() {
  try {
    const raw = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    const list = Array.isArray(raw) ? raw : (raw.clusters ? Object.entries(raw.clusters).flatMap(([cluster, items]) => items.map((it) => ({ ...it, cluster }))) : []);
    const clusters = {};
    for (const item of list) {
      if (!clusters[item.cluster]) clusters[item.cluster] = [];
      clusters[item.cluster].push(item);
    }
    return { clusters };
  } catch (e) {
    return null;
  }
}

function resolvePhotoCluster(articleCluster, manifest) {
  const known = manifest ? new Set(Object.keys(manifest.clusters || {})) : new Set(['comedouros', 'fontes', 'cameras', 'coleira-gps', 'brinquedos', 'higiene', 'geral']);
  const alias = CLUSTER_ALIASES[articleCluster] || articleCluster;
  if (alias && known.has(alias)) return alias;
  // heurística por substring, mesmo espírito do fallback do generate_assets.py
  if (/comedouro/.test(articleCluster || '')) return known.has('comedouros') ? 'comedouros' : 'geral';
  if (/coleira|gps/.test(articleCluster || '')) return known.has('coleira-gps') ? 'coleira-gps' : 'geral';
  if (/camera/.test(articleCluster || '')) return known.has('cameras') ? 'cameras' : 'geral';
  if (/brinquedo/.test(articleCluster || '')) return known.has('brinquedos') ? 'brinquedos' : 'geral';
  if (/bebedouro|fonte/.test(articleCluster || '')) return known.has('fontes') ? 'fontes' : 'geral';
  if (/tapete|higien/.test(articleCluster || '')) return known.has('higiene') ? 'higiene' : 'geral';
  return 'geral';
}

/** Índice determinístico (não hash randomizado) dentro do cluster de fotos, por slug. */
function deterministicIndex(slug, modulo) {
  let acc = 0;
  for (let i = 0; i < slug.length; i++) acc = (acc * 31 + slug.charCodeAt(i)) % 1000003;
  return modulo > 0 ? acc % modulo : 0;
}

function mediaPathFor(slug, formato, contentId) {
  // content_id já é único e descritivo (ex: "<slug>-reel-v2-01"); evita
  // duplicar slug/formato no nome do arquivo.
  const base = String(contentId || `${slug}-${formato}`).replace(/[^a-z0-9-]/gi, '-');
  const png = path.join(IMG_V2_DIR, `${base}.png`);
  const mp4 = formato === 'reel' ? path.join(VID_V2_DIR, `${base}.mp4`) : null;
  return { png, mp4 };
}

function fileExists(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

function planMediaForPiece(piece, articleCluster) {
  const manifest = loadManifest();
  const photoCluster = resolvePhotoCluster(articleCluster, manifest);
  const photosInCluster = manifest && manifest.clusters ? (manifest.clusters[photoCluster] || []).length : null;
  const photoIndex = photosInCluster ? deterministicIndex(piece.content_id || piece.slug || '', photosInCluster) : null;

  const { png, mp4 } = mediaPathFor(piece.source_article || piece.slug, piece.formato, piece.content_id);
  const pngExists = fileExists(png);
  const mp4Exists = mp4 ? fileExists(mp4) : null;

  const prioridade = typeof piece.score === 'number' ? Math.round((100 - piece.score) * 10) : 500;

  return {
    media_status: 'REGENERAR',
    motivo: 'Peça V2 fato-do-corpo: hook reescrito difere do texto cravado no PNG/MP4 V1; não há crosswalk confiável PECA-NNN -> foto-base (hash Python não determinístico, ver comentário no topo do arquivo). Foto-base do cluster pode ser reaproveitada; a arte (overlay de texto) precisa ser regenerada só com HOOK principal + complemento opcional, sem número de peça/kicker/nome de formato.',
    foto_base_cluster: photoCluster,
    foto_base_indice_sugerido: photoIndex,
    media_path_planejado: {
      imagem: png,
      video: mp4,
    },
    arquivo_existe: {
      imagem: pngExists,
      video: mp4 ? mp4Exists : null,
    },
    prioridade_regeneracao: prioridade,
  };
}

function planMediaForBatch(pieces, articleClusterBySlug) {
  return pieces.map((piece) => ({
    ...piece,
    media_plan: planMediaForPiece(piece, articleClusterBySlug.get(piece.source_article) || null),
  }));
}

module.exports = { planMediaForPiece, planMediaForBatch, resolvePhotoCluster, deterministicIndex };
