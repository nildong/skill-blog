#!/usr/bin/env bash
#
# generate-sitemap.sh — Gera o sitemap.xml a partir de um BLOG_ROOT.
#
# Extraído de deploy.sh (Etapa "correção do sitemap" da V2) para ser
# testável isoladamente, sem precisar de credenciais SFTP nem rede — o bug
# real que motivou esta extração foi o sitemap de produção incluindo URLs
# de tools/site-indexer/test/fixtures/mini-site/ (fixtures de teste, não
# páginas do site), porque a exclusão de diretórios não cobria tools/.
#
# Uso como biblioteca (sourced por deploy.sh):
#   source generate-sitemap.sh
#   generate_sitemap "$BLOG_ROOT" "$DOMAIN" "$SITEMAP_OUTPUT_PATH"
#
# Uso direto (CLI, útil para depuração manual):
#   ./generate-sitemap.sh <blog_root> <domain> <output_path>
#
set -euo pipefail

# Diretórios de infraestrutura nunca são páginas do site — excluídos em
# qualquer profundidade. "tools" foi adicionado depois do bug real
# descrito acima; ver test/generate-sitemap.test.sh para o teste de
# regressão que impede essa classe de bug de voltar.
generate_sitemap() {
  local blog_root="$1"
  local domain="$2"
  local output_path="$3"

  {
    echo '<?xml version="1.0" encoding="UTF-8"?>'
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

    # Raiz do site (home)
    if [[ -f "$blog_root/index.html" ]]; then
      local home_lastmod
      home_lastmod="$(date -r "$blog_root/index.html" +%Y-%m-%d 2>/dev/null || date +%Y-%m-%d)"
      echo "  <url>"
      echo "    <loc>${domain}/</loc>"
      echo "    <lastmod>${home_lastmod}</lastmod>"
      echo "  </url>"
    fi

    # Todas as subpastas com index.html, em qualquer profundidade (inclui
    # autores/nome/, etc.). Exclui diretórios de infraestrutura: .git/
    # .claude/ (via -not -path '*/.*'), img, briefs, calendars,
    # node_modules, tools — nenhum desses contém páginas reais do site.
    while IFS= read -r -d '' htmlfile; do
      local rel_dir
      rel_dir="$(dirname "${htmlfile#"$blog_root"/}")"
      case "$rel_dir" in
        img|img/*|briefs|briefs/*|calendars|calendars/*|node_modules|node_modules/*|tools|tools/*) continue ;;
      esac
      local lastmod
      lastmod="$(date -r "$htmlfile" +%Y-%m-%d 2>/dev/null || date +%Y-%m-%d)"
      echo "  <url>"
      echo "    <loc>${domain}/${rel_dir}/</loc>"
      echo "    <lastmod>${lastmod}</lastmod>"
      echo "  </url>"
    done < <(find "$blog_root" -mindepth 2 -name index.html -not -path '*/.*' -print0 | sort -z)

    echo '</urlset>'
  } > "$output_path"
}

# Permite rodar como CLI direto (não só sourced) — útil para debug manual
# e é o que o teste de regressão usa.
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  if [[ $# -lt 3 ]]; then
    echo "Uso: $0 <blog_root> <domain> <output_path>" >&2
    exit 1
  fi
  generate_sitemap "$1" "$2" "$3"
fi
