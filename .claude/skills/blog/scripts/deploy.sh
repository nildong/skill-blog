#!/usr/bin/env bash
#
# deploy.sh — Publica um post de blog na Hostinger via SFTP/SSH.
#
# Uso:
#   ./deploy.sh <pasta-do-post> [pasta-remota]
#
# Exemplo:
#   ./deploy.sh comedouro-cachorro
#   ./deploy.sh comedouro-cachorro public_html/comedouro-cachorro
#
# Credenciais (NUNCA hardcoded no script; vêm do ambiente):
#   SFTP_HOST      - host do servidor (ex: srv807.hstgr.io)
#   SFTP_USER      - usuário SFTP
#   SFTP_PORT      - porta (padrão 22)
#   SFTP_KEY_PATH  - caminho da chave privada SSH (recomendado)
#   SFTP_PASSWORD  - senha (fallback, requer 'sshpass' instalado — evite se possível)
#   REMOTE_BASE    - diretório remoto base (padrão: public_html)
#
# Configure as variáveis num arquivo .env (NÃO versionado) e exporte antes de
# rodar, ou exporte diretamente no shell:
#
#   export SFTP_HOST=srv807.hstgr.io
#   export SFTP_USER=usuario_ftp
#   export SFTP_KEY_PATH=~/.ssh/hostinger_id_ed25519
#   ./deploy.sh comedouro-cachorro
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BLOG_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"

POST_DIR="${1:-}"
REMOTE_SUBDIR="${2:-}"

if [[ -z "$POST_DIR" ]]; then
  echo "Uso: ./deploy.sh <pasta-do-post> [pasta-remota]" >&2
  exit 1
fi

# Aceita tanto o nome da pasta (ex: "cercado-para-cachorros") quanto um
# caminho absoluto já dentro de BLOG_ROOT (ex: "/home/projetos/blog/cercado-para-cachorros/"),
# que é o formato que o bot do Telegram às vezes envia.
POST_DIR="${POST_DIR%/}"
if [[ "$POST_DIR" = /* ]]; then
  LOCAL_PATH="$POST_DIR"
  POST_DIR="${LOCAL_PATH#"$BLOG_ROOT"/}"
else
  LOCAL_PATH="$BLOG_ROOT/$POST_DIR"
fi

if [[ ! -d "$LOCAL_PATH" ]]; then
  echo "Erro: pasta '$LOCAL_PATH' não existe." >&2
  exit 1
fi

# ---------------------------------------------------------------------------
# 0. Carrega .env local se existir (nunca commitado — ver .gitignore)
# ---------------------------------------------------------------------------
ENV_FILE="$SCRIPT_DIR/.env"
if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  set -a; source "$ENV_FILE"; set +a
fi

: "${SFTP_HOST:?Defina SFTP_HOST (host do servidor Hostinger)}"
: "${SFTP_USER:?Defina SFTP_USER (usuário SFTP)}"
SFTP_PORT="${SFTP_PORT:-22}"
REMOTE_BASE="${REMOTE_BASE:-public_html}"
REMOTE_PATH="$REMOTE_BASE/${REMOTE_SUBDIR:-$POST_DIR}"

echo "==> Publicando '$POST_DIR' em $SFTP_USER@$SFTP_HOST:$REMOTE_PATH"

# ---------------------------------------------------------------------------
# 1. Verificar HTML (arquivo principal existe e não está vazio)
# ---------------------------------------------------------------------------
echo "--> [1/6] Verificando HTML..."
HTML_FILE="$LOCAL_PATH/index.html"
if [[ ! -s "$HTML_FILE" ]]; then
  echo "Erro: $HTML_FILE não existe ou está vazio." >&2
  exit 1
fi
if ! grep -q "<title>" "$HTML_FILE"; then
  echo "Erro: $HTML_FILE não tem <title>." >&2
  exit 1
fi
echo "    OK: index.html válido ($(wc -c < "$HTML_FILE") bytes)"

# ---------------------------------------------------------------------------
# 2. Verificar imagens referenciadas existem localmente
# ---------------------------------------------------------------------------
echo "--> [2/6] Verificando imagens..."
MISSING_IMG=0
while IFS= read -r img_src; do
  # ignora URLs absolutas (http/https) e data URIs
  case "$img_src" in
    http://*|https://*|data:*) continue ;;
  esac
  if [[ ! -f "$LOCAL_PATH/$img_src" ]]; then
    echo "    AVISO: imagem referenciada não encontrada: $img_src"
    MISSING_IMG=1
  fi
done < <(grep -oE 'src="[^"]+\.(webp|jpg|jpeg|png|gif|svg)"' "$HTML_FILE" | sed -E 's/src="([^"]+)"/\1/')

if [[ "$MISSING_IMG" -eq 1 ]]; then
  echo "Erro: existem imagens referenciadas no HTML que não foram encontradas na pasta local." >&2
  exit 1
fi
echo "    OK: todas as imagens locais referenciadas existem"

# ---------------------------------------------------------------------------
# 3. Verificar vídeos (opcional — só avisa, não bloqueia)
# ---------------------------------------------------------------------------
echo "--> [3/6] Verificando vídeos..."
if grep -qE '<video|youtube\.com/embed' "$HTML_FILE"; then
  echo "    Post contém vídeo(s) embutido(s) — confirme que os embeds usam URLs públicas."
else
  echo "    Nenhum vídeo neste post (ok)."
fi

# ---------------------------------------------------------------------------
# 4. Gerar/atualizar sitemap.xml na raiz do blog
# ---------------------------------------------------------------------------
echo "--> [4/6] Gerando sitemap.xml..."
SITEMAP="$BLOG_ROOT/sitemap.xml"
DOMAIN="${SITE_DOMAIN:-https://smartpetgadgets.com.br}"

{
  echo '<?xml version="1.0" encoding="UTF-8"?>'
  echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  # Raiz do site (home)
  if [[ -f "$BLOG_ROOT/index.html" ]]; then
    lastmod="$(date -r "$BLOG_ROOT/index.html" +%Y-%m-%d 2>/dev/null || date +%Y-%m-%d)"
    echo "  <url>"
    echo "    <loc>${DOMAIN}/</loc>"
    echo "    <lastmod>${lastmod}</lastmod>"
    echo "  </url>"
  fi
  # Todas as subpastas com index.html, em qualquer profundidade (inclui autores/nome/, etc.)
  # Exclui diretórios de infraestrutura (.git, .claude, img, briefs, calendars, node_modules)
  while IFS= read -r -d '' htmlfile; do
    rel_dir="$(dirname "${htmlfile#"$BLOG_ROOT"/}")"
    case "$rel_dir" in
      img|img/*|briefs|briefs/*|calendars|calendars/*|node_modules|node_modules/*) continue ;;
    esac
    lastmod="$(date -r "$htmlfile" +%Y-%m-%d 2>/dev/null || date +%Y-%m-%d)"
    echo "  <url>"
    echo "    <loc>${DOMAIN}/${rel_dir}/</loc>"
    echo "    <lastmod>${lastmod}</lastmod>"
    echo "  </url>"
  done < <(find "$BLOG_ROOT" -mindepth 2 -name index.html -not -path '*/.*' -print0 | sort -z)
  echo '</urlset>'
} > "$SITEMAP"
echo "    OK: sitemap.xml atualizado ($SITEMAP)"

# ---------------------------------------------------------------------------
# 5. Conectar na Hostinger e enviar os arquivos (SSH key preferencial)
# ---------------------------------------------------------------------------
echo "--> [5/6] Enviando arquivos via SFTP..."

SSH_OPTS=(-p "$SFTP_PORT" -o StrictHostKeyChecking=accept-new)
if [[ -n "${SFTP_KEY_PATH:-}" ]]; then
  SSH_OPTS+=(-i "$SFTP_KEY_PATH")
fi

RSYNC_RSH="ssh ${SSH_OPTS[*]}"

HOME_INDEX="$BLOG_ROOT/index.html"

if [[ -n "${SFTP_KEY_PATH:-}" ]]; then
  # Caminho recomendado: autenticação por chave SSH
  rsync -avz --delete \
    -e "$RSYNC_RSH" \
    "$LOCAL_PATH/" "$SFTP_USER@$SFTP_HOST:$REMOTE_PATH/"
  rsync -avz \
    -e "$RSYNC_RSH" \
    "$SITEMAP" "$SFTP_USER@$SFTP_HOST:$REMOTE_BASE/sitemap.xml"
  if [[ -f "$HOME_INDEX" ]]; then
    rsync -avz \
      -e "$RSYNC_RSH" \
      "$HOME_INDEX" "$SFTP_USER@$SFTP_HOST:$REMOTE_BASE/index.html"
  fi
elif [[ -n "${SFTP_PASSWORD:-}" ]]; then
  if ! command -v sshpass >/dev/null 2>&1; then
    echo "Erro: SFTP_PASSWORD definido, mas 'sshpass' não está instalado." >&2
    echo "Instale com: sudo apt-get install sshpass  (ou prefira SFTP_KEY_PATH)" >&2
    exit 1
  fi
  sshpass -e -- rsync -avz --delete \
    -e "ssh ${SSH_OPTS[*]}" \
    "$LOCAL_PATH/" "$SFTP_USER@$SFTP_HOST:$REMOTE_PATH/"
  sshpass -e -- rsync -avz \
    -e "ssh ${SSH_OPTS[*]}" \
    "$SITEMAP" "$SFTP_USER@$SFTP_HOST:$REMOTE_BASE/sitemap.xml"
  if [[ -f "$HOME_INDEX" ]]; then
    sshpass -e -- rsync -avz \
      -e "ssh ${SSH_OPTS[*]}" \
      "$HOME_INDEX" "$SFTP_USER@$SFTP_HOST:$REMOTE_BASE/index.html"
  fi
else
  echo "Erro: defina SFTP_KEY_PATH (recomendado) ou SFTP_PASSWORD para autenticar." >&2
  exit 1
fi

echo "    OK: arquivos enviados"
if [[ -f "$HOME_INDEX" ]]; then
  echo "    OK: index.html (home) sincronizado"
fi

# ---------------------------------------------------------------------------
# 6. Mostrar a URL publicada
# ---------------------------------------------------------------------------
echo "--> [6/6] Publicação concluída!"
echo ""
echo "    URL: ${DOMAIN}/${REMOTE_SUBDIR:-$POST_DIR}/"
echo ""
