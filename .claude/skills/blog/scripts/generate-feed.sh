#!/usr/bin/env bash
#
# generate-feed.sh — Gera o feed.xml (RSS 2.0) a partir de um BLOG_ROOT.
#
# O feed é o que o Chrome usa no botão "Seguir": quem segue o site recebe
# os posts novos no Discover. Entram só as páginas com schema Article/
# BlogPosting (posts de verdade — sobre/contato/políticas ficam de fora),
# ordenadas por datePublished, com a imagem grande (og:image) em
# <media:content> para o Discover poder mostrar o card com foto.
#
# Uso como biblioteca (sourced por deploy.sh):
#   source generate-feed.sh
#   generate_feed "$BLOG_ROOT" "$DOMAIN" "$FEED_OUTPUT_PATH"
#
# Uso direto (CLI):
#   ./generate-feed.sh <blog_root> <domain> <output_path>
#
set -euo pipefail

generate_feed() {
  local blog_root="$1"
  local domain="$2"
  local output_path="$3"

  python3 - "$blog_root" "$domain" "$output_path" <<'PY'
import glob, html, json, os, re, sys
from datetime import datetime, timezone
from email.utils import format_datetime
from xml.sax.saxutils import escape

root, domain, out = sys.argv[1], sys.argv[2].rstrip('/'), sys.argv[3]
# Mesmas pastas de infraestrutura que o sitemap ignora, mais o cluster
# (removido do servidor, responde 410).
SKIP = ('img', 'briefs', 'calendars', 'node_modules', 'tools', 'reports', '_backup', 'audit', 'cluster-comedouro-automatico-pet')

def meta(h, attr, name):
    m = re.search(r'<meta %s="%s" content="([^"]*)"' % (attr, re.escape(name)), h)
    return html.unescape(m.group(1)) if m else ''

def to_dt(s):
    dt = datetime.fromisoformat(s.replace('Z', '+00:00'))
    if dt.tzinfo is None:
        dt = dt.replace(hour=9, tzinfo=timezone.utc)
    return dt

items = []
for f in glob.glob(os.path.join(root, '*', '**', 'index.html'), recursive=True):
    rel = os.path.relpath(os.path.dirname(f), root)
    if rel.split(os.sep)[0].startswith(SKIP) or '/.' in '/' + rel:
        continue
    h = open(f, encoding='utf-8').read()
    art = None
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', h, re.S):
        try:
            d = json.loads(block)
        except ValueError:
            continue
        for it in (d.get('@graph', [d]) if isinstance(d, dict) else d):
            if isinstance(it, dict) and it.get('@type') in ('Article', 'BlogPosting', 'NewsArticle'):
                art = it
    if not art or not art.get('datePublished'):
        continue
    title = meta(h, 'property', 'og:title') or html.unescape(re.search(r'<title>(.*?)</title>', h, re.S).group(1).strip())
    items.append({
        'title': title,
        'link': f'{domain}/{rel}/',
        'desc': meta(h, 'name', 'description'),
        'date': to_dt(art['datePublished']),
        'image': meta(h, 'property', 'og:image'),
        'author': (art.get('author') or {}).get('name', '') if isinstance(art.get('author'), dict) else '',
    })

items.sort(key=lambda i: (i['date'], i['link']), reverse=True)
last = max((i['date'] for i in items), default=datetime.now(timezone.utc))

with open(out, 'w', encoding='utf-8') as o:
    o.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    o.write('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xmlns:dc="http://purl.org/dc/elements/1.1/">\n')
    o.write('  <channel>\n')
    o.write('    <title>Smart Pet Gadgets</title>\n')
    o.write(f'    <link>{domain}/</link>\n')
    o.write(f'    <atom:link href="{domain}/feed.xml" rel="self" type="application/rss+xml" />\n')
    o.write('    <description>Guias, comparativos e reviews de gadgets para cães e gatos: comedouros automáticos, coleiras GPS, câmeras e mais.</description>\n')
    o.write('    <language>pt-BR</language>\n')
    o.write(f'    <lastBuildDate>{format_datetime(last)}</lastBuildDate>\n')
    for i in items:
        o.write('    <item>\n')
        o.write(f'      <title>{escape(i["title"])}</title>\n')
        o.write(f'      <link>{escape(i["link"])}</link>\n')
        o.write(f'      <guid isPermaLink="true">{escape(i["link"])}</guid>\n')
        o.write(f'      <pubDate>{format_datetime(i["date"])}</pubDate>\n')
        if i['author']:
            o.write(f'      <dc:creator>{escape(i["author"])}</dc:creator>\n')
        o.write(f'      <description>{escape(i["desc"])}</description>\n')
        if i['image']:
            o.write(f'      <media:content url="{escape(i["image"])}" medium="image" />\n')
        o.write('    </item>\n')
    o.write('  </channel>\n</rss>\n')
PY
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  if [[ $# -lt 3 ]]; then
    echo "Uso: $0 <blog_root> <domain> <output_path>" >&2
    exit 1
  fi
  generate_feed "$1" "$2" "$3"
fi
