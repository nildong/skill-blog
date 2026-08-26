#!/usr/bin/env bash
#
# generate-sitemap.test.sh — Teste de regressão para generate-sitemap.sh.
#
# Motivo de existir: o sitemap.xml de produção incluiu, em algum momento,
# URLs de tools/site-indexer/test/fixtures/mini-site/ (fixtures de teste,
# não páginas reais do site) porque a lógica de exclusão de diretórios não
# cobria tools/. Este teste constrói uma árvore de diretórios sintética
# reproduzindo exatamente esse cenário (mais os outros diretórios que já
# deveriam ser excluídos) e falha se qualquer um deles aparecer no
# sitemap gerado, ou se uma página real do site ficar de fora.
#
# Uso:
#   ./generate-sitemap.test.sh
#
# Sai com código 0 se todos os casos passarem, 1 caso algum falhe.
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GENERATE_SITEMAP="$SCRIPT_DIR/../generate-sitemap.sh"

TMP_ROOT="$(mktemp -d)"
trap 'rm -rf "$TMP_ROOT"' EXIT

FAILURES=0

assert_contains() {
  local haystack="$1" needle="$2" label="$3"
  if grep -qF "$needle" "$haystack"; then
    echo "  OK: $label"
  else
    echo "  FALHOU: esperava encontrar '$needle' em $haystack ($label)"
    FAILURES=$((FAILURES + 1))
  fi
}

assert_not_contains() {
  local haystack="$1" needle="$2" label="$3"
  if grep -qF "$needle" "$haystack"; then
    echo "  FALHOU: NÃO esperava encontrar '$needle' em $haystack ($label)"
    FAILURES=$((FAILURES + 1))
  else
    echo "  OK: $label"
  fi
}

echo "=== Setup: árvore de diretórios sintética ==="

# Home
cat > "$TMP_ROOT/index.html" <<'EOF'
<html><head><title>Home</title></head><body>Home</body></html>
EOF

# Página real do site — deve aparecer no sitemap.
mkdir -p "$TMP_ROOT/comedouro-cachorro"
echo '<html><head><title>Comedouro</title></head><body>x</body></html>' > "$TMP_ROOT/comedouro-cachorro/index.html"

# Fixture de teste dentro de tools/ (o bug real) — NÃO deve aparecer.
mkdir -p "$TMP_ROOT/tools/site-indexer/test/fixtures/mini-site/post-a"
echo '<html><head><title>Fixture</title></head><body>x</body></html>' > "$TMP_ROOT/tools/site-indexer/test/fixtures/mini-site/index.html"
echo '<html><head><title>Fixture Post A</title></head><body>x</body></html>' > "$TMP_ROOT/tools/site-indexer/test/fixtures/mini-site/post-a/index.html"

# Outros diretórios de infraestrutura que já deveriam ser excluídos.
mkdir -p "$TMP_ROOT/node_modules/algum-pacote"
echo '<html><head><title>NM</title></head><body>x</body></html>' > "$TMP_ROOT/node_modules/algum-pacote/index.html"

mkdir -p "$TMP_ROOT/briefs"
echo '<html><head><title>Brief</title></head><body>x</body></html>' > "$TMP_ROOT/briefs/index.html"

mkdir -p "$TMP_ROOT/calendars"
echo '<html><head><title>Calendar</title></head><body>x</body></html>' > "$TMP_ROOT/calendars/index.html"

mkdir -p "$TMP_ROOT/img"
echo '<html><head><title>Img</title></head><body>x</body></html>' > "$TMP_ROOT/img/index.html"

echo ""
echo "=== Executando generate_sitemap ==="
OUTPUT="$TMP_ROOT/sitemap.xml"
bash "$GENERATE_SITEMAP" "$TMP_ROOT" "https://smartpetgadgets.com.br" "$OUTPUT"

if [[ ! -f "$OUTPUT" ]]; then
  echo "FALHOU: $OUTPUT não foi gerado."
  exit 1
fi

echo ""
echo "=== Verificações ==="
assert_contains "$OUTPUT" "https://smartpetgadgets.com.br/" "home incluída"
assert_contains "$OUTPUT" "https://smartpetgadgets.com.br/comedouro-cachorro/" "página real incluída"

assert_not_contains "$OUTPUT" "tools/site-indexer" "fixture de teste (o bug original) excluída"
assert_not_contains "$OUTPUT" "/mini-site/" "fixture de teste excluída (variante de path)"
assert_not_contains "$OUTPUT" "node_modules" "node_modules excluído"
assert_not_contains "$OUTPUT" "/briefs/" "briefs excluído"
assert_not_contains "$OUTPUT" "/calendars/" "calendars excluído"
assert_not_contains "$OUTPUT" "/img/" "img excluído"

echo ""
if [[ "$FAILURES" -eq 0 ]]; then
  echo "PASS: todos os casos passaram."
  exit 0
else
  echo "FAIL: $FAILURES caso(s) falharam."
  exit 1
fi
