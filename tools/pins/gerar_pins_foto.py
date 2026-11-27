#!/usr/bin/env python3
"""Gera pins do Pinterest no modelo "foto cheia" (1000x1500 PNG): foto ocupando o pin inteiro,
título curto em branco sobre um degradê escuro embaixo, selo pequeno e a marca discreta.

Uso:
  python3 tools/pins/gerar_pins_foto.py reports/pins-foto.csv                        # gera todos
  python3 tools/pins/gerar_pins_foto.py reports/pins-foto.csv --linhas 1,3            # só essas linhas
  python3 tools/pins/gerar_pins_foto.py reports/pins-foto.csv --bulk reports/x.csv --inicio 2026-12-09

A planilha é UTF-8 (com ou sem BOM), separador ";", colunas:
  Foto; Foco; Posição; Selo; Texto na imagem; Pasta (board); Título do pin; Descrição do pin; Link
"Foco" é o object-position da foto (ex.: "50% 40%"); vazio = centro.
"Posição" é "topo" ou "base" (padrão): onde vai o título, longe do assunto da foto.
"Texto na imagem" aceita "|" para forçar a quebra de linha. Mantenha em até 6 palavras.
Com --bulk, grava o CSV do "Criar Pins em massa" com UTM no link e 1 pin por dia (--hora, UTC).
"""
import argparse
import csv
import html
import sys
from datetime import date, timedelta
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).parent))
from gerar_pins import PALETAS, PALETA_PADRAO, foto_data_uri, slugify  # noqa: E402

W, H = 1000, 1500
URL_PINS = "https://smartpetgadgets.com.br/pins/"

# Reduz a fonte até o título caber em 3 linhas
FIT_JS = """
<script>
  document.fonts.ready.then(() => {
    const h = document.getElementById('t');
    let size = parseInt(h.dataset.max);
    const lh = parseFloat(getComputedStyle(h).lineHeight) / parseFloat(getComputedStyle(h).fontSize);
    const linhas = () => Math.round(h.offsetHeight / (size * lh));
    h.style.fontSize = size + 'px';
    while ((linhas() > 3 || h.scrollWidth > h.clientWidth + 1) && size > 56) { size -= 3; h.style.fontSize = size + 'px'; }
    document.body.dataset.pronto = '1';
  });
</script>"""


def montar_html(linha):
    c1, c2, claro, escuro = PALETAS.get(linha["Pasta (board)"], PALETA_PADRAO)
    e = html.escape
    titulo = "<br>".join(e(p.strip()) for p in linha["Texto na imagem"].split("|"))
    foco = linha.get("Foco", "").strip() or "50% 50%"
    topo = linha.get("Posição", "").strip().lower() == "topo"
    selo = f'<span class="selo">{e(linha["Selo"])}</span>' if linha.get("Selo", "").strip() else ""
    css = f"""
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  html, body {{ width: {W}px; height: {H}px; overflow: hidden; }}
  body {{ font-family: 'Poppins', sans-serif; color: #fff; position: relative; background: #111; }}
  .foto {{ position: absolute; inset: 0; width: {W}px; height: {H}px; object-fit: cover; object-position: {foco}; }}
  .sombra {{ position: absolute; inset: 0;
             background: linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,0) 16%, rgba(0,0,0,0) 46%,
                                         rgba(0,0,0,.55) 66%, rgba(0,0,0,.85) 100%); }}
  .marca {{ position: absolute; top: 48px; left: 56px; display: flex; align-items: center; gap: 14px;
            font-weight: 700; font-size: 30px; letter-spacing: .3px; text-shadow: 0 2px 10px rgba(0,0,0,.45); }}
  .marca svg {{ width: 40px; height: 40px; fill: #fff; filter: drop-shadow(0 2px 6px rgba(0,0,0,.4)); }}
  .texto {{ position: absolute; left: 64px; right: 64px; bottom: 96px; }}
  .topo .sombra {{ background: linear-gradient(0deg, rgba(0,0,0,.30) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 50%,
                                             rgba(0,0,0,.55) 70%, rgba(0,0,0,.82) 100%); }}
  .topo .texto {{ top: 130px; bottom: auto; }}
  .selo {{ display: inline-block; background: {c1}; color: #fff; font-weight: 800; font-size: 32px;
           padding: 12px 30px; border-radius: 999px; margin-bottom: 28px; box-shadow: 0 8px 22px rgba(0,0,0,.3); }}
  h1 {{ font-weight: 900; line-height: 1.04; letter-spacing: -1.5px; text-shadow: 0 4px 24px rgba(0,0,0,.45);
        text-wrap: balance; }}
  .rodape {{ margin-top: 34px; display: flex; align-items: center; gap: 18px; font-weight: 600; font-size: 32px; opacity: .92; }}
  .rodape::before {{ content: ""; width: 56px; height: 6px; border-radius: 3px; background: {c1}; }}
"""
    corpo = f"""
<img class="foto" src="{foto_data_uri(linha['Foto'])}">
<div class="sombra"></div>
<div class="marca"><svg viewBox="0 0 64 64"><ellipse cx="32" cy="42" rx="14" ry="12"/><ellipse cx="14" cy="26" rx="6" ry="8"/>
  <ellipse cx="26" cy="16" rx="6" ry="8"/><ellipse cx="38" cy="16" rx="6" ry="8"/><ellipse cx="50" cy="26" rx="6" ry="8"/></svg>Smart Pet Gadgets</div>
<div class="texto">
  {selo}
  <h1 id="t" data-max="112">{titulo}</h1>
  <div class="rodape">smartpetgadgets.com.br</div>
</div>"""
    return f"""<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800;900&display=block" rel="stylesheet">
<style>{css}</style></head>
<body class="{'topo' if topo else 'base'}">{corpo}
{FIT_JS}
</body></html>"""


def utm(link, nome):
    sep = "&" if "?" in link else "?"
    return f"{link}{sep}utm_source=pinterest&utm_medium=social&utm_campaign=pins-foto&utm_content={Path(nome).stem}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("csv")
    ap.add_argument("--linhas", help="números das linhas de dados (1 = primeira após o cabeçalho), separados por vírgula")
    ap.add_argument("--saida", default="pins")
    ap.add_argument("--bulk", help="grava aqui o CSV do Pinterest (Criar Pins em massa)")
    ap.add_argument("--inicio", help="data do primeiro pin no --bulk (AAAA-MM-DD)")
    ap.add_argument("--hora", default="14:00", help="horário UTC de publicação no --bulk (padrão 14:00)")
    args = ap.parse_args()

    with open(args.csv, encoding="utf-8-sig", newline="") as f:
        linhas = list(csv.DictReader(f, delimiter=";"))
    escolhidas = {int(x) for x in args.linhas.split(",")} if args.linhas else None
    saida = Path(args.saida)
    saida.mkdir(exist_ok=True)
    nomes = [f"foto-{n:02d}-{slugify(l['Título do pin'], 50)}.png" for n, l in enumerate(linhas, 1)]

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
        for n, (linha, nome) in enumerate(zip(linhas, nomes), 1):
            if escolhidas and n not in escolhidas:
                continue
            page.set_content(montar_html(linha), wait_until="networkidle")
            page.wait_for_selector("body[data-pronto='1']", timeout=15000)
            page.screenshot(path=str(saida / nome), clip={"x": 0, "y": 0, "width": W, "height": H})
            print(f"OK {nome}")
        browser.close()

    if args.bulk:
        if not args.inicio:
            ap.error("--bulk precisa de --inicio")
        d0 = date.fromisoformat(args.inicio)
        with open(args.bulk, "w", newline="") as f:
            w = csv.writer(f)
            w.writerow(["Title", "Media URL", "Pinterest board", "Thumbnail", "Description", "Link", "Publish date", "Keywords"])
            for i, (linha, nome) in enumerate(zip(linhas, nomes)):
                w.writerow([linha["Título do pin"], URL_PINS + nome, linha["Pasta (board)"], "", linha["Descrição do pin"],
                            utm(linha["Link"], nome), f"{d0 + timedelta(days=i)}T{args.hora}:00", linha.get("Palavra-chave", "")])
        print(f"OK {args.bulk}")


if __name__ == "__main__":
    main()
