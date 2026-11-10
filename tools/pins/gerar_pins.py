#!/usr/bin/env python3
"""Gera pins do Pinterest (1000x1500 PNG) a partir da planilha de pins.

Uso:
  python3 tools/pins/gerar_pins.py "reports/pins-smartpetgadgets (3).csv"                  # todos + pins-gerados.csv
  python3 tools/pins/gerar_pins.py "reports/pins-smartpetgadgets (3).csv" --linhas 3,14     # só essas linhas
  python3 tools/pins/gerar_pins.py "reports/pins-smartpetgadgets (3).csv" --plano           # mostra modelo/selo/foto sem gerar

A planilha é UTF-8 com BOM, separador ";". Cada linha vira pins/NN-titulo-do-pin.png.
Modelos: lista (passo a passo, erros, comparação, troca de ração), foto (~50% dos pins) e só texto.
O modelo com foto escolhe em ./fotos uma imagem do mesmo bicho do pin, sem repetir em pins seguidos.
"""
import argparse
import base64
import csv
import hashlib
import html
import io
import re
import unicodedata
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

W, H = 1000, 1500
FOTO_EXT = {".jpg", ".jpeg", ".png", ".webp"}

# Paleta por pasta: fundo (2 tons do degradê), cor clara do selo e cor escura dos textos sobre branco
PALETAS = {
    "Comedouros e Ração para Cães":              ("#ff8a3d", "#c2410c", "#fff3e6", "#7c2d12"),
    "Comedouros e Ração para Gatos":             ("#8b5cf6", "#5b21b6", "#f3e8ff", "#4c1d95"),
    "Coleiras para Cachorro e Gato":             ("#0ea5e9", "#0c4a6e", "#e0f2fe", "#0c4a6e"),
    "Brinquedos para Gato":                      ("#ec4899", "#9d174d", "#fce7f3", "#831843"),
    "Filhotes de Cachorro e Gato":               ("#f59e0b", "#b45309", "#fffbeb", "#78350f"),
    "Brinquedos e Enriquecimento para Cachorro": ("#22c55e", "#15803d", "#ecfdf5", "#14532d"),
    "Cercados e Segurança para Cachorro":        ("#475569", "#0f172a", "#f1f5f9", "#0f172a"),
    "Gatificação":                               ("#14b8a6", "#0f766e", "#f0fdfa", "#134e4a"),
}
PALETA_PADRAO = ("#ff8a3d", "#b23a0d", "#fff3e6", "#7c2d12")

# O que aparece em cada foto de ./fotos. "produto" só é usada no pin do próprio post; "evitar" nunca.
# Fotos novas que não estiverem aqui são classificadas pelo nome do arquivo (gato/cachorro).
FOTO_TEMA = {
    "bebedouro-inox-x-ceramica": "gato", "brinquedo-automatico-cachorro-sozinho": "cachorro",
    "brinquedo-interativo-automatico-para-gato": "gato", "brinquedo-interativo-gato-idoso-vale-a-pena": "gato",
    "brinquedo-interativo-pilha-x-recarregavel": "gato", "camera-pet-cachorro-ansiedade-separacao": "cachorro",
    "cat-mate-c500-review": "gato", "cerca-virtual-para-cachorro": "cachorro", "cercado-para-cachorros": "produto",
    "coleira-gps-bluetooth-x-chip-operadora": "produto", "coleira-gps-cachorro-pequeno-porte": "cachorro",
    "coleira-gps-cachorro-que-foge": "cachorro", "coleira-gps-para-gato": "gato", "coleira-gps-para-pet": "cachorro",
    "coleira-gps-x-microchip": "cachorro", "coleira-seresto-antipulgas": "produto",
    "comedouro-automatico-faz-mal": "cachorro", "comedouro-automatico-gato-obeso": "gato",
    "comedouro-automatico-para-dois-gatos": "gato", "comedouro-automatico-vale-a-pena": "neutro",
    "comedouro-cachorro": "produto", "comedouro-gato-x-cachorro-diferenca": "ambos",
    "comedouro-x-bebedouro-automatico": "gato", "como-escolher-brinquedo-interativo-gato-entediado": "gato",
    "duvidas-brinquedo-interativo-gato": "evitar", "erros-comuns-brinquedo-interativo-gato": "gato",
    "melhor-alimentador-automatico-gatos": "gato", "melhor-bebedouro-automatico-pet": "gato",
    "melhor-bolinha-inteligente-para-gato": "gato", "melhor-coleira-gps-sem-mensalidade": "cachorro",
    "melhor-comedouro-automatico-cachorro": "cachorro", "melhor-comedouro-interativo-gato": "gato",
    "melhor-racao-para-cachorro": "produto", "melhor-racao-para-gato": "produto",
    "melhor-tapete-higienico-para-cachorro": "cachorro", "porta-eletronica-automatica-para-pet": "gato",
}

# Itens escritos à mão para os pins de lista cuja descrição não traz uma enumeração curta
ITENS = {
    "Comedouro + bebedouro: precisa dos dois?": ["O que cada um resolve", "Kits combinados", "Quando ter os dois"],
    "Coleira GPS ou microchip?": ["Como o microchip funciona", "O que o GPS faz a mais", "Por que usar os dois"],
    "Bluetooth ou chip: qual comprar?": ["Alcance", "Mensalidade", "Qual escolher"],
    "5 erros com brinquedo de gato": ["Ignorar a idade do gato", "Sempre no mesmo lugar", "Não ver o tipo de piso", "Achar que substitui você"],
    "Como trocar a ração sem dar diarreia": ["Dias 1-2: 25% da nova", "Dias 3-4: metade de cada", "Dias 5-6: 75% da nova", "Dia 7: só a nova"],
    "Como trocar a ração do gato": ["Dias 1-3: 25% da nova", "Dias 4-6: metade de cada", "Dias 7-9: 75% da nova", "Dia 10: só a nova"],
}
LISTA_PADRAO = ["O que observar", "Opções comparadas", "Qual escolher"]

# Verbos têm prioridade no corte: "Comedouro de gato / Serve para cachorro?"
VERBOS = {"serve", "faz", "vale", "precisa", "funciona", "ajuda", "pode", "substitui", "existe"}
QUEBRAS = {"que", "sem", "em", "no", "na", "nos", "nas", "do", "da", "de", "dos", "das", "com", "para", "=", "+"}

ICONES = {  # traços simples, desenhados na cor do selo
    "tigela": '<path d="M14 54h100c0 26-22 42-50 42S14 80 14 54z"/><path d="M34 44c4-8 10-8 14 0M58 40c4-8 10-8 14 0M82 44c4-8 10-8 14 0"/><path d="M40 98h48"/>',
    "relogio": '<circle cx="64" cy="64" r="46"/><path d="M64 36v30l20 12"/>',
    "coleira": '<ellipse cx="64" cy="52" rx="48" ry="22"/><path d="M16 52v12c0 12 22 22 48 22s48-10 48-22V52"/><circle cx="64" cy="104" r="12"/><path d="M64 86v6"/>',
    "bola": '<circle cx="64" cy="64" r="46"/><path d="M22 46c28 10 56 10 84 0M22 82c28-10 56-10 84 0"/>',
    "pata": '<ellipse cx="64" cy="82" rx="26" ry="22"/><ellipse cx="30" cy="52" rx="11" ry="15"/><ellipse cx="52" cy="32" rx="11" ry="15"/><ellipse cx="76" cy="32" rx="11" ry="15"/><ellipse cx="98" cy="52" rx="11" ry="15"/>',
}


def slugify(texto, limite=60):
    s = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s[:limite].rstrip("-") or "pin"


def maiuscula(s):
    s = s.strip()
    return s[:1].upper() + s[1:] if s else s


def slug_do_link(linha):
    return linha["Link"].rstrip("/").rsplit("/", 1)[-1]


def gancho(linha):
    """Selo curto do topo."""
    texto = linha["Texto na imagem"].lower()
    titulos = (linha["Texto na imagem"] + " " + linha["Título do pin"]).lower()
    slug = slug_do_link(linha)
    desc = linha["Descrição do pin"].lower()
    if slug.startswith("erros-") or re.match(r"\d+ erros", texto):
        return "Erros comuns"
    if slug.startswith("duvidas-"):
        return "Dúvidas respondidas"
    if "review" in slug or "nosso review" in desc or "nossa análise" in desc:
        return "Review"
    if "-x-" in slug or re.search(r"\bou\b.*\?$|\bx\b", texto):
        return "Comparação"
    if texto.startswith("como "):
        return "Passo a passo"
    if any(k in titulos for k in ("comparad", "melhor", "preço por quilo")):
        return "Comparativo 2026"
    return "Guia completo"


def eh_lista(linha):
    return gancho(linha) in {"Comparação", "Erros comuns", "Passo a passo"} or "trocar a ração" in linha["Texto na imagem"].lower()


def dividir(texto):
    """Devolve (titulo, subtitulo). Divide quando há parênteses ou mais de 5 palavras."""
    texto = texto.strip()
    m = re.match(r"^(.*?)\s*\((.+)\)\s*(.*)$", texto)
    if m:
        principal, dentro = m.group(1), m.group(2)
        n = re.fullmatch(r"(\d+)\+", dentro.strip())
        return principal, f"A partir dos {n.group(1)} anos" if n else maiuscula(dentro)
    if len(texto.split()) <= 5:
        return texto, ""
    if ":" in texto:
        a, b = texto.split(":", 1)
        return a.strip(), maiuscula(b)
    palavras = texto.split()
    ok = lambda i: 2 <= i <= 5 and len(palavras) - i >= 2
    verbos = [i for i, p in enumerate(palavras) if ok(i) and p.lower() in VERBOS]
    cortes = [i for i, p in enumerate(palavras) if ok(i) and p.lower() in QUEBRAS]
    if not (verbos or cortes):
        return texto, ""
    # Prefere o corte mais à direita que ainda deixa 3+ palavras no subtítulo ("5 erros / Com brinquedo de gato")
    longos = [i for i in cortes if len(palavras) - i >= 3]
    i = verbos[0] if verbos else (longos[-1] if longos else cortes[-1])
    if "=" in palavras:  # "Ração seca + pouca água / = risco"
        i = palavras.index("=")
    sub = " ".join(palavras[i:])
    return " ".join(palavras[:i]), sub if sub[0] in "=+" else maiuscula(sub)


def itens_lista(linha):
    """Itens da lista: escritos à mão ou extraídos da descrição (ex.: 'tamanho da porção, tipo de ração e altura')."""
    if linha["Texto na imagem"].strip() in ITENS:
        return ITENS[linha["Texto na imagem"].strip()]
    for frase in re.split(r"(?<=[.?!])\s+", linha["Descrição do pin"]):
        trecho = None
        if ":" in frase:
            trecho = frase.split(":", 1)[1]
        elif re.search(r"\bem\b", frase) and "," in frase:
            trecho = re.split(r"\bem\b", frase)[-1]
        if not trecho or "," not in trecho:
            continue
        partes = [maiuscula(p) for p in re.split(r",\s*|\s+e\s+", trecho.strip().rstrip(".?!")) if p.strip()]
        if len(partes) >= 3 and all(len(p.split()) <= 4 and len(p) <= 30 for p in partes[:3]):
            return partes[:3]
    return LISTA_PADRAO


def bicho(linha):
    """'gato', 'cachorro' ou 'ambos', pelo texto do pin (o texto da imagem pesa mais)."""
    def conta(s):
        s = s.lower()
        return (len(re.findall(r"\bgat[oa]s?\b|\bgatinhos?\b|\bfelinos?\b|gatifica", s)),
                len(re.findall(r"\bcachorr[oa]s?\b|\bcães\b|\bcão\b", s)))
    pesos = ((linha["Texto na imagem"], 4), (linha["Título do pin"], 2), (linha["Pasta (board)"], 2), (linha["Descrição do pin"], 1))
    g = sum(conta(t)[0] * p for t, p in pesos)
    c = sum(conta(t)[1] * p for t, p in pesos)
    if g > c * 1.5:
        return "gato"
    if c > g * 1.5:
        return "cachorro"
    return "ambos"


def icone(linha):
    t = (linha["Texto na imagem"] + " " + linha["Título do pin"]).lower()
    if re.search(r"coleira|gps|cerca|microchip", t):
        return "coleira"
    if re.search(r"brinquedo|bolinha|brincar|entediado|enriquecimento", t):
        return "bola"
    if re.search(r"\bhora\b|horário|minuto", t):
        return "relogio"
    if re.search(r"ração|comedouro|bebedouro|água", t):
        return "tigela"
    return "pata"


def distribuir_modelos(linhas):
    """Lista fixa para os tipos certos; o resto divide foto/texto para ~50% de fotos, sem 3 iguais seguidos."""
    n = len(linhas)
    modelos = ["lista" if eh_lista(l) else None for l in linhas]
    livres = modelos.count(None)
    fotos_faltando = min(livres, round(n * 0.5))

    def repete(i, m):
        a = modelos[i - 2] if i >= 2 else None
        b = modelos[i - 1] if i >= 1 else None
        c = modelos[i + 1] if i + 1 < n else None
        d = modelos[i + 2] if i + 2 < n else None
        return (a == b == m) or (b == m == c) or (c == d == m)

    for i in range(n):
        if modelos[i]:
            continue
        restantes = modelos[i:].count(None)
        pref = "foto" if fotos_faltando / restantes >= 0.5 else "texto"
        outro = "texto" if pref == "foto" else "foto"
        escolha = outro if repete(i, pref) and not repete(i, outro) else pref
        modelos[i] = escolha
        fotos_faltando -= escolha == "foto"
    return modelos


class Fotos:
    """Escolhe fotos de ./fotos pelo bicho do pin, sem repetir a mesma imagem em pins seguidos."""

    def __init__(self, pasta):
        self.fotos = sorted(p for p in Path(pasta).iterdir() if p.suffix.lower() in FOTO_EXT) if Path(pasta).is_dir() else []
        self.tema = {f: FOTO_TEMA.get(f.stem) or ("gato" if "gato" in f.stem else "cachorro" if "cachorro" in f.stem else "neutro") for f in self.fotos}
        self.hash = {f: hashlib.md5(f.read_bytes()).hexdigest() for f in self.fotos}  # mesma imagem com nomes diferentes
        self.usos = {}
        self.anterior = None

    def escolher(self, linha):
        if not self.fotos:
            return None
        quer, slug = bicho(linha), slug_do_link(linha)

        assunto = ASSUNTO_ICONE[icone(linha)]

        def nota(f):
            t = self.tema[f]
            if t == "evitar" or (t == "produto" and f.stem != slug):
                return None
            if quer == "ambos":
                compat = 0 if t in ("ambos", "gato", "cachorro") else 1
            else:
                compat = 0 if t == quer else 1 if t in ("ambos", "produto") else 2 if t == "neutro" else None
            if compat is None:
                return None
            usos = self.usos.get(self.hash[f], 0)
            proprio_livre = f.stem == slug and usos == 0
            # Ordem: foto do próprio post (se ainda não usada) > mesmo bicho > mesmo assunto > menos usada
            return (not proprio_livre, compat, usos >= 2, assunto_da_foto(f) != assunto, usos, f.name)

        candidatas = [(nota(f), f) for f in self.fotos if self.hash[f] != self.anterior]
        candidatas = sorted((nt, f) for nt, f in candidatas if nt is not None)
        if not candidatas:
            return None
        escolhida = candidatas[0][1]
        h = self.hash[escolhida]
        self.usos[h] = self.usos.get(h, 0) + 1
        self.anterior = h
        return escolhida


ASSUNTO_ICONE = {"tigela": "comida", "relogio": "comida", "coleira": "coleira", "bola": "brinquedo", "pata": "outro"}


def assunto_da_foto(f):
    s = f"-{f.stem}-"  # compara palavras inteiras do nome ("separacao" não conta como "racao")
    if re.search(r"-(comedouro|racao|alimentador|bebedouro)-", s):
        return "comida"
    if re.search(r"-(coleira|cerca)-", s):
        return "coleira"
    if re.search(r"-(brinquedo|bolinha)-", s):
        return "brinquedo"
    return "outro"


def foto_data_uri(caminho):
    """A página é carregada com set_content (about:blank), que não lê file://; por isso a foto vai embutida."""
    im = Image.open(caminho).convert("RGB")
    im.thumbnail((1400, 1400))
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=88)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


PAW = """<svg width="0" height="0" style="position:absolute"><defs><g id="paw">
  <ellipse cx="32" cy="42" rx="14" ry="12"/><ellipse cx="14" cy="26" rx="6" ry="8"/>
  <ellipse cx="26" cy="16" rx="6" ry="8"/><ellipse cx="38" cy="16" rx="6" ry="8"/><ellipse cx="50" cy="26" rx="6" ry="8"/>
</g></defs></svg>"""

DECO = """
  <div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>
  <svg class="paw p1" viewBox="0 0 64 64"><use href="#paw"/></svg>
  <svg class="paw p2" viewBox="0 0 64 64"><use href="#paw"/></svg>"""

# Reduz a fonte até o título caber na área com no máximo 4 linhas; no modelo só texto,
# mostra o ícone quando sobra muito espaço entre o subtítulo e o botão.
FIT_JS = """
<script>
  document.fonts.ready.then(() => {
    const h = document.getElementById('t'), box = document.getElementById('area');
    const lh = parseFloat(getComputedStyle(h).lineHeight) / parseFloat(getComputedStyle(h).fontSize);
    let size = parseInt(h.dataset.max);
    const linhas = () => Math.round(h.offsetHeight / (size * lh));
    // Soma a altura dos elementos em vez de usar scrollHeight: a Poppins Black passa um pouco da
    // altura da linha (acentos, "g", "p") e o navegador conta isso como transbordamento.
    const limite = parseFloat(getComputedStyle(box).maxHeight) || box.clientHeight;
    const usado = () => [...box.children].filter(el => getComputedStyle(el).display !== 'none')
      .reduce((s, el) => s + el.getBoundingClientRect().height + parseFloat(getComputedStyle(el).marginTop), 0);
    const cabe = () => usado() <= limite && h.scrollWidth <= h.clientWidth + 1 && linhas() <= 4;
    h.style.fontSize = size + 'px';
    while (!cabe() && size > 48) { size -= 3; h.style.fontSize = size + 'px'; }
    const ic = document.getElementById('icone');
    if (ic) {
      const usado = [...box.children].filter(el => el !== ic).reduce((s, el) => s + el.offsetHeight, 0);
      if (box.clientHeight - usado > 420) ic.style.display = 'block';
    }
    document.body.dataset.pronto = '1';
  });
</script>"""


def montar_html(linha, layout, foto=None):
    c1, c2, claro, escuro = PALETAS.get(linha["Pasta (board)"], PALETA_PADRAO)
    selo = gancho(linha)
    e = html.escape
    if layout == "lista":
        titulo, sub = linha["Texto na imagem"].strip(), ""
    else:
        titulo, sub = dividir(linha["Texto na imagem"])
    sub_html = f'<p class="sub">{e(sub)}</p>' if sub else ""

    base_css = f"""
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  html, body {{ width: {W}px; height: {H}px; overflow: hidden; }}
  body {{ font-family: 'Poppins', sans-serif; color: #fff; position: relative;
          background: linear-gradient(160deg, {c1} 0%, {c2} 100%); }}
  .blob {{ position: absolute; border-radius: 50%; background: rgba(255,255,255,.10); }}
  .b1 {{ width: 620px; height: 620px; top: -220px; right: -240px; }}
  .b2 {{ width: 420px; height: 420px; bottom: 140px; left: -210px; background: rgba(255,255,255,.07); }}
  .b3 {{ width: 170px; height: 170px; top: 360px; left: 60px; background: rgba(255,255,255,.08); }}
  .paw {{ position: absolute; fill: rgba(255,255,255,.16); }}
  .p1 {{ width: 110px; top: 130px; right: 80px; transform: rotate(18deg); }}
  .p2 {{ width: 80px; bottom: 290px; right: 110px; transform: rotate(-12deg); }}
  .selo {{ display: inline-block; background: {claro}; color: {escuro}; font-weight: 800; font-size: 34px;
           letter-spacing: .5px; padding: 14px 36px; border-radius: 999px; box-shadow: 0 8px 24px rgba(0,0,0,.18); }}
  h1 {{ font-weight: 900; line-height: 1.07; letter-spacing: -1px; overflow-wrap: normal; hyphens: none; text-wrap: balance; max-width: 100%; }}
  .sub {{ font-weight: 700; font-size: 46px; line-height: 1.2; margin-top: 24px; opacity: .95; text-wrap: balance; }}
  .cta {{ display: inline-block; background: #fff; color: {escuro}; font-weight: 800; font-size: 36px;
          padding: 22px 48px; border-radius: 18px; box-shadow: 0 12px 30px rgba(0,0,0,.25); white-space: nowrap; }}
  .rodape {{ position: absolute; left: 0; bottom: 0; width: {W}px; background: rgba(0,0,0,.28); text-align: center;
             padding: 30px 0 34px; font-weight: 700; font-size: 38px; letter-spacing: 1px; color: #fff; }}
"""

    if layout == "foto":
        css = base_css + f"""
  .foto {{ position: absolute; top: 0; left: 0; width: {W}px; height: 860px;
           background: url('{foto_data_uri(foto)}') center/cover no-repeat; }}
  .foto::after {{ content: ""; position: absolute; inset: 0;
                  background: linear-gradient(180deg, rgba(0,0,0,.30) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 70%, rgba(0,0,0,.40) 100%); }}
  .foto .selo {{ position: absolute; top: 56px; left: 50%; transform: translateX(-50%); z-index: 2; white-space: nowrap; }}
  .painel {{ position: absolute; top: 820px; left: 0; width: {W}px; height: 576px; border-radius: 48px 48px 0 0;
             background: linear-gradient(160deg, {c1} 0%, {c2} 100%); padding: 40px 70px 34px; text-align: center;
             display: flex; flex-direction: column; align-items: center; justify-content: center; }}
  #area {{ max-height: 370px; width: 100%; flex-shrink: 0; display: flex; flex-direction: column; align-items: center; overflow: hidden; }}
  .sub {{ font-size: 42px; margin-top: 16px; }}
  .painel .cta {{ margin-top: 30px; }}
"""
        corpo = f"""
<div class="foto"><span class="selo">{e(selo)}</span></div>
<div class="painel">
  <div id="area"><h1 id="t" data-max="100">{e(titulo)}</h1>{sub_html}</div>
  <span class="cta">Veja o guia completo →</span>
</div>"""
    elif layout == "lista":
        li = "".join(f'<li><span class="num">{i}</span><span>{e(t)}</span></li>' for i, t in enumerate(itens_lista(linha), 1))
        css = base_css + f"""
  .wrap {{ position: absolute; top: 0; left: 0; width: {W}px; height: {H - 104}px; padding: 90px 80px 48px; text-align: center;
           display: flex; flex-direction: column; align-items: center; }}
  #area {{ height: 440px; width: 100%; flex-shrink: 0; margin-top: 36px; display: flex; flex-direction: column; justify-content: center; align-items: center; overflow: hidden; }}
  ol {{ list-style: none; flex: 1; display: flex; flex-direction: column; justify-content: center; text-align: left; width: 100%; padding: 10px 0 24px; }}
  ol li {{ display: flex; align-items: center; gap: 26px; background: rgba(255,255,255,.95); color: {escuro};
           font-weight: 800; font-size: 38px; line-height: 1.15; padding: 20px 30px; border-radius: 22px; margin-bottom: 18px;
           box-shadow: 0 8px 22px rgba(0,0,0,.15); }}
  .num {{ flex-shrink: 0; width: 64px; height: 64px; border-radius: 50%; background: {c2}; color: #fff;
          display: flex; align-items: center; justify-content: center; font-size: 34px; }}
"""
        corpo = f"""{DECO}
<div class="wrap">
  <span class="selo">{e(selo)}</span>
  <div id="area"><h1 id="t" data-max="104">{e(titulo)}</h1></div>
  <ol>{li}</ol>
  <span class="cta">Veja o guia completo →</span>
</div>"""
    else:
        css = base_css + f"""
  .wrap {{ position: absolute; inset: 0; padding: 90px 80px 0; text-align: center; }}
  #area {{ height: 960px; display: flex; flex-direction: column; justify-content: center; align-items: center; overflow: hidden; }}
  .sub {{ font-size: 54px; margin-top: 32px; }}
  #icone {{ display: none; width: 190px; height: 190px; margin-top: 70px; fill: none; stroke: {claro};
            stroke-width: 7; stroke-linecap: round; stroke-linejoin: round; opacity: .9; flex-shrink: 0; }}
"""
        corpo = f"""{DECO}
<div class="wrap">
  <span class="selo">{e(selo)}</span>
  <div id="area"><h1 id="t" data-max="140">{e(titulo)}</h1>{sub_html}<svg id="icone" viewBox="0 0 128 128">{ICONES[icone(linha)]}</svg></div>
  <span class="cta">Veja o guia completo →</span>
</div>"""

    return f"""<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800;900&display=block" rel="stylesheet">
<style>{css}</style></head>
<body>{PAW}{corpo}
<div class="rodape">smartpetgadgets.com.br</div>
{FIT_JS}
</body></html>"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("csv")
    ap.add_argument("--linhas", help="números das linhas de dados (1 = primeira após o cabeçalho), separados por vírgula")
    ap.add_argument("--saida", default="pins")
    ap.add_argument("--fotos", default="fotos")
    ap.add_argument("--plano", action="store_true", help="só mostra modelo, selo e foto de cada linha")
    args = ap.parse_args()

    with open(args.csv, encoding="utf-8-sig", newline="") as f:
        linhas = list(csv.DictReader(f, delimiter=";"))
    largura_num = max(2, len(str(len(linhas))))
    modelos = distribuir_modelos(linhas)

    # A escolha das fotos percorre a planilha inteira para respeitar "sem repetir em pins seguidos"
    fotos = Fotos(args.fotos)
    plano = []
    for n, (linha, modelo) in enumerate(zip(linhas, modelos), 1):
        foto = fotos.escolher(linha) if modelo == "foto" else None
        if modelo == "foto" and not foto:
            modelo = "texto"
        nome = f"{n:0{largura_num}d}-{slugify(linha['Título do pin'])}.png"
        plano.append((n, linha, modelo, foto, nome))

    if args.plano:
        for n, linha, modelo, foto, _ in plano:
            print(f"{n:2} {modelo:5} [{gancho(linha)}] {linha['Texto na imagem']}" + (f"  <- {foto.stem} ({bicho(linha)})" if foto else ""))
        print({m: modelos.count(m) for m in ("foto", "lista", "texto")})
        return

    escolhidas = {int(x) for x in args.linhas.split(",")} if args.linhas else None
    saida = Path(args.saida)
    saida.mkdir(exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
        for n, linha, modelo, foto, nome in plano:
            if escolhidas and n not in escolhidas:
                continue
            page.set_content(montar_html(linha, modelo, foto), wait_until="networkidle")
            page.wait_for_selector("body[data-pronto='1']", timeout=15000)
            page.screenshot(path=str(saida / nome), clip={"x": 0, "y": 0, "width": W, "height": H})
            print(f"OK {nome}  [{modelo}]" + (f" foto: {foto.name}" if foto else ""))
        browser.close()

    if not escolhidas:
        with open("pins-gerados.csv", "w", encoding="utf-8-sig", newline="") as f:
            w = csv.writer(f, delimiter=";")
            w.writerow(["arquivo da imagem", "pasta", "título do pin", "descrição", "link"])
            for n, linha, modelo, foto, nome in plano:
                w.writerow([f"{args.saida}/{nome}", linha["Pasta (board)"], linha["Título do pin"], linha["Descrição do pin"], linha["Link"]])
        print("OK pins-gerados.csv")


if __name__ == "__main__":
    main()
