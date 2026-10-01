#!/usr/bin/env bash
#
# fetch-product.sh — Busca dados de produto e avaliações reais no Mercado Livre
# via API pública, para alimentar briefs de artigos comparativos (Top-N/afiliados).
#
# Uso:
#   ./fetch-product.sh MLB1234567890
#   ./fetch-product.sh MLB1234567890 --out saida.json
#
# Requisitos: curl, jq
#
# Endpoints usados (públicos, sem autenticação):
#   GET https://api.mercadolibre.com/items/{ITEM_ID}
#   GET https://api.mercadolibre.com/items/{ITEM_ID}/description
#   GET https://api.mercadolibre.com/reviews/item/{ITEM_ID}
#
# Nota: a API pública tem rate limit. Não rode isso em loop apertado sobre
# muitos ITEM_IDs — espace as chamadas (o script já dá um sleep entre elas).

set -euo pipefail

API_BASE="https://api.mercadolibre.com"
SLEEP_BETWEEN=1

usage() {
  echo "Uso: $0 <ITEM_ID> [--out arquivo.json]" >&2
  echo "Exemplo: $0 MLB1234567890" >&2
  exit 1
}

[ $# -ge 1 ] || usage

ITEM_ID="$1"
shift

OUT_FILE=""
while [ $# -gt 0 ]; do
  case "$1" in
    --out)
      OUT_FILE="$2"
      shift 2
      ;;
    *)
      echo "Argumento desconhecido: $1" >&2
      usage
      ;;
  esac
done

if ! command -v jq >/dev/null 2>&1; then
  echo "Erro: jq não encontrado. Instale com: sudo apt install jq" >&2
  exit 1
fi

if ! [[ "$ITEM_ID" =~ ^[A-Z]{2,4}[0-9]+$ ]]; then
  echo "Aviso: '$ITEM_ID' não parece um ITEM_ID válido do Mercado Livre (ex.: MLB1234567890). Continuando mesmo assim..." >&2
fi

fetch_json() {
  local url="$1"
  local resp
  resp=$(curl -s -w '\n%{http_code}' "$url")
  local status
  status=$(echo "$resp" | tail -n1)
  local body
  body=$(echo "$resp" | sed '$d')

  if [ "$status" -ge 400 ]; then
    echo "null"
    echo "Aviso: $url retornou HTTP $status" >&2
  else
    echo "$body"
  fi
}

echo "Buscando item $ITEM_ID..." >&2
ITEM_JSON=$(fetch_json "$API_BASE/items/$ITEM_ID")
sleep "$SLEEP_BETWEEN"

echo "Buscando descrição..." >&2
DESC_JSON=$(fetch_json "$API_BASE/items/$ITEM_ID/description")
sleep "$SLEEP_BETWEEN"

echo "Buscando avaliações..." >&2
REVIEWS_JSON=$(fetch_json "$API_BASE/reviews/item/$ITEM_ID")

# Monta pacote resumido, já mastigado para uso em brief/outline
RESULT=$(jq -n \
  --argjson item "$ITEM_JSON" \
  --argjson desc "$DESC_JSON" \
  --argjson reviews "$REVIEWS_JSON" \
  '{
    item_id: $item.id,
    titulo: $item.title,
    preco: $item.price,
    moeda: $item.currency_id,
    condicao: $item.condition,
    quantidade_vendida: $item.sold_quantity,
    disponivel: $item.available_quantity,
    permalink: $item.permalink,
    imagens: [ $item.pictures[]?.secure_url ],
    atributos: [ $item.attributes[]? | {nome: .name, valor: .value_name} ],
    descricao: ($desc.plain_text // $desc.text // null),
    avaliacoes: {
      nota_media: $reviews.rating_average,
      total: $reviews.paging.total,
      distribuicao: $reviews.rating_levels,
      comentarios: [ $reviews.reviews[]? | {
        nota: .rate,
        titulo: .title,
        comentario: .content,
        data: .date_created,
        util_sim: .likes,
        util_nao: .dislikes
      } ]
    }
  }')

if [ -n "$OUT_FILE" ]; then
  echo "$RESULT" > "$OUT_FILE"
  echo "Salvo em $OUT_FILE" >&2
else
  echo "$RESULT"
fi
