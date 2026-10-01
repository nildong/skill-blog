#!/usr/bin/env python3
"""
Geração de mídia V2 para Smart Pet Gadgets — imagens elaboradas (estilo tech
premium, gradientes + elementos geométricos + ícone por cluster) e vídeos
curtos (capa animada de Reel, MP4) a partir das peças reais do Social
Content Engine.

Entrada: .data/social-content-export.json (mesmo export usado pelo V1,
         gerado por tools/social-content-engine/src/export-all.js).

Saída:
  - output_midia_avancada/imagens/PECA-XXX.png   (1080x1350, feed 4:5)
  - output_midia_avancada/videos/PECA-XXX.mp4     (1080x1920, capa animada ~4s, só para Reels)

Este script roda 100% local (Pillow para composição, numpy para gradientes/
frames, moviepy+ffmpeg para exportar o MP4). Não usa nenhuma API externa de
geração de imagem — não há chave configurada neste ambiente; se você tiver
uma (Gemini/DALL-E/etc.) e quiser fotos reais de produto em vez de composição
gráfica, é um passo separado.

Não publica nada, não toca Facebook/Instagram, não altera artigos do blog.
"""
import json
import math
import os
import random
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
EXPORT_JSON = ROOT / ".data" / "social-content-export.json"
OUT_IMG = ROOT / "output_midia_avancada" / "imagens"
OUT_VID = ROOT / "output_midia_avancada" / "videos"

# ---------------------------------------------------------------------------
# Identidade visual
# ---------------------------------------------------------------------------
BG_TOP = (22, 25, 30)       # chumbo azulado escuro
BG_BOTTOM = (11, 12, 15)    # quase preto
ACCENT = (255, 107, 0)      # laranja neon #FF6B00
ACCENT_SOFT = (255, 107, 0, 60)
TEXT_COLOR = (247, 247, 248)
MUTED = (140, 145, 152)
LINE_COLOR = (255, 255, 255, 18)  # linhas de circuito, quase invisíveis

IMG_W, IMG_H = 1080, 1350   # 4:5, feed
VID_W, VID_H = 1080, 1920   # 9:16, reel
FPS = 24
VID_DURATION = 4.0

FORMAT_LABELS = {
    "Reel": "REEL",
    "Post": "POST",
    "Carrossel": "CARROSSEL",
    "Stories": "STORIES",
    "Engagement": "ENGAJAMENTO",
}

CLUSTER_RULES = [
    ("comedouro", "comedouros"),
    ("bebedouro", "fontes"),
    ("coleira-gps", "coleira-gps"),
    ("microchip", "coleira-gps"),
    ("camera", "cameras"),
    ("porta-eletronica", "porta-eletronica"),
    ("brinquedo", "brinquedos"),
    ("cercado", "brinquedos"),
    ("tapete", "higiene"),
]


def detect_cluster(slug: str) -> str:
    for needle, cluster in CLUSTER_RULES:
        if needle in slug:
            return cluster
    return "geral"


def find_font(bold=False):
    for p in (
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ):
        if os.path.exists(p):
            return p
    return None


FONT_BOLD = find_font(True)
FONT_REGULAR = find_font(False)


def font(size, bold=False):
    path = FONT_BOLD if bold else FONT_REGULAR
    return ImageFont.truetype(path, size) if path else ImageFont.load_default()


# ---------------------------------------------------------------------------
# Fundo: gradiente diagonal + textura de "grid" tech
# ---------------------------------------------------------------------------
def diagonal_gradient(w, h, top, bottom):
    y = np.linspace(0, 1, h).reshape(h, 1)
    x = np.linspace(0, 1, w).reshape(1, w)
    ratio = np.clip((y * 0.7 + x * 0.3), 0, 1)
    arr = np.zeros((h, w, 3), dtype=np.uint8)
    for c in range(3):
        arr[:, :, c] = (top[c] + (bottom[c] - top[c]) * ratio).astype(np.uint8)
    return Image.fromarray(arr, "RGB")


def add_dot_grid(base_rgba, w, h, spacing=54, radius=1):
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for gy in range(0, h, spacing):
        for gx in range(0, w, spacing):
            d.ellipse([gx - radius, gy - radius, gx + radius, gy + radius], fill=(255, 255, 255, 10))
    return Image.alpha_composite(base_rgba, layer)


def add_circuit_lines(base_rgba, w, h, seed, n=7, phase=0.0, avoid_band=None):
    """avoid_band: (y0, y1) em fração de h onde não deve nascer nenhuma linha,
    para não cruzar por cima do título/gancho."""
    rnd = random.Random(seed)
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    placed = 0
    attempts = 0
    while placed < n and attempts < n * 8:
        attempts += 1
        x = rnd.randint(0, w)
        y = rnd.randint(0, h)
        length = rnd.randint(int(h * 0.08), int(h * 0.22))
        if avoid_band:
            y0, y1 = avoid_band[0] * h, avoid_band[1] * h
            if y0 - 20 <= y <= y1 + 20 or y0 - 20 <= y + length <= y1 + 20:
                continue
        placed += 1
        direction = rnd.choice([0, 1])  # 0 = vertical-then-horizontal, 1 = reverso
        bend = int(length * (0.4 + 0.3 * math.sin(phase + rnd.random() * 6.28)))
        color = (255, 107, 0, rnd.randint(14, 30))
        if direction == 0:
            d.line([(x, y), (x, y + bend)], fill=color, width=2)
            d.line([(x, y + bend), (x + length - bend, y + bend)], fill=color, width=2)
            d.ellipse([x - 3, y - 3, x + 3, y + 3], fill=(255, 107, 0, 60))
        else:
            d.line([(x, y), (x + bend, y)], fill=color, width=2)
            d.line([(x + bend, y), (x + bend, y + length - bend)], fill=color, width=2)
            d.ellipse([x - 3, y - 3, x + 3, y + 3], fill=(255, 107, 0, 60))
    return Image.alpha_composite(base_rgba, layer)


# ---------------------------------------------------------------------------
# Ícones por cluster (vetoriais, desenhados via PIL, estilo linha fina)
# ---------------------------------------------------------------------------
def icon_comedouro(d, cx, cy, s, color):
    d.ellipse([cx - s, cy - s * 0.35, cx + s, cy + s * 0.55], outline=color, width=4)
    d.arc([cx - s, cy - s * 0.75, cx + s, cy - s * 0.05], start=200, end=340, fill=color, width=4)


def icon_fonte(d, cx, cy, s, color):
    for i, r in enumerate([s * 0.4, s * 0.65, s * 0.9]):
        alpha = max(30, 140 - i * 40)
        d.arc([cx - r, cy - r * 0.5, cx + r, cy + r * 0.5], start=200, end=340, fill=color, width=3)


def icon_coleira_gps(d, cx, cy, s, color):
    d.ellipse([cx - s * 0.35, cy - s, cx + s * 0.35, cy + s * 0.2], outline=color, width=4)
    d.ellipse([cx - s * 0.12, cy - s * 0.75, cx + s * 0.12, cy - s * 0.5], fill=color)
    for r in (s * 0.5, s * 0.75):
        d.arc([cx - r, cy - s - r * 0.3, cx + r, cy - s + r * 0.7], start=300, end=60, fill=color, width=2)


def icon_camera(d, cx, cy, s, color):
    d.rounded_rectangle([cx - s, cy - s * 0.6, cx + s, cy + s * 0.6], radius=s * 0.2, outline=color, width=4)
    d.ellipse([cx - s * 0.45, cy - s * 0.4, cx + s * 0.45, cy + s * 0.4], outline=color, width=4)
    for i, r in enumerate([s * 0.15]):
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color)


def icon_porta_eletronica(d, cx, cy, s, color):
    d.rounded_rectangle([cx - s * 0.6, cy - s, cx + s * 0.6, cy + s], radius=s * 0.15, outline=color, width=4)
    for gy in range(-1, 2):
        for gx in range(-1, 2):
            px, py = cx + gx * s * 0.3, cy + gy * s * 0.45
            d.ellipse([px - 3, py - 3, px + 3, py + 3], fill=color)


def icon_brinquedo(d, cx, cy, s, color):
    points = []
    for i in range(8):
        ang = math.pi / 4 * i
        r = s if i % 2 == 0 else s * 0.5
        points.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
    d.polygon(points, outline=color, width=3)


def icon_generic(d, cx, cy, s, color):
    d.arc([cx - s, cy - s, cx + s, cy + s], start=20, end=290, fill=color, width=4)
    d.ellipse([cx - 5, cy - 5, cx + 5, cy + 5], fill=color)


ICONS = {
    "comedouros": icon_comedouro,
    "fontes": icon_fonte,
    "coleira-gps": icon_coleira_gps,
    "cameras": icon_camera,
    "porta-eletronica": icon_porta_eletronica,
    "brinquedos": icon_brinquedo,
    "higiene": icon_generic,
    "geral": icon_generic,
}


def wrap_text(draw, text, fnt, max_width):
    words, lines, current = text.split(), [], ""
    for word in words:
        trial = f"{current} {word}".strip()
        bbox = draw.textbbox((0, 0), trial, font=fnt)
        if bbox[2] - bbox[0] <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


# ---------------------------------------------------------------------------
# Composição de imagem estática (feed)
# ---------------------------------------------------------------------------
def render_image(row, w=IMG_W, h=IMG_H):
    cluster = detect_cluster(row["artigo_slug"])
    base = diagonal_gradient(w, h, BG_TOP, BG_BOTTOM).convert("RGBA")
    base = add_dot_grid(base, w, h)
    base = add_circuit_lines(base, w, h, seed=hash(row["id"]) % 10000, avoid_band=(0.30, 0.66))

    # Ícone de marca d'água grande, canto inferior direito, baixa opacidade
    icon_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    di = ImageDraw.Draw(icon_layer)
    ICONS.get(cluster, icon_generic)(di, w * 0.82, h * 0.86, w * 0.22, (255, 107, 0, 35))
    base = Image.alpha_composite(base, icon_layer)

    img = base.convert("RGB")
    d = ImageDraw.Draw(img)

    # Faixa superior fina
    d.rectangle([(0, 0), (w, 8)], fill=ACCENT)

    # Kicker: formato + cluster
    kicker_font = font(30, bold=True)
    label = f"{FORMAT_LABELS.get(row['formato'], row['formato'].upper())} · {cluster.upper()}"
    d.text((60, 56), label, font=kicker_font, fill=ACCENT)

    brand_font = font(26)
    brand = "smartpetgadgets.com.br"
    bbox = d.textbbox((0, 0), brand, font=brand_font)
    d.text((w - 60 - (bbox[2] - bbox[0]), 60), brand, font=brand_font, fill=MUTED)

    # Ícone pequeno de contexto ao lado do kicker
    di2 = ImageDraw.Draw(img)
    ICONS.get(cluster, icon_generic)(di2, w - 110, 240, 46, ACCENT)

    # Título / gancho — hierarquia forte
    title_font = font(70, bold=True)
    max_w = w - 140
    lines = wrap_text(d, row["gancho"], title_font, max_w)
    while len(lines) > 5 and title_font.size > 36:
        title_font = font(title_font.size - 6, bold=True)
        lines = wrap_text(d, row["gancho"], title_font, max_w)

    line_h = title_font.size + 16
    block_h = line_h * len(lines)
    start_y = int(h * 0.38) - block_h // 2

    for i, line in enumerate(lines):
        bbox = d.textbbox((0, 0), line, font=title_font)
        lw = bbox[2] - bbox[0]
        d.text((70, start_y + i * line_h), line, font=title_font, fill=TEXT_COLOR)

    underline_y = start_y + block_h + 26
    d.rectangle([(70, underline_y), (70 + 110, underline_y + 6)], fill=ACCENT)

    # Subtítulo (artigo-fonte legível)
    sub_font = font(28)
    subtitle = row["artigo_slug"].replace("-", " ").capitalize()
    sub_lines = wrap_text(d, subtitle, sub_font, max_w)[:2]
    for i, line in enumerate(sub_lines):
        d.text((70, underline_y + 34 + i * 36), line, font=sub_font, fill=MUTED)

    # Rodapé: CTA + ID
    footer_font = font(24)
    footer = f"Guia completo no site  ·  {row['id']}"
    d.text((70, h - 70), footer, font=footer_font, fill=MUTED)

    # Cantos levemente arredondados via máscara (acabamento premium)
    return img


# ---------------------------------------------------------------------------
# Vídeo: capa animada de Reel (~4s, 1080x1920)
# ---------------------------------------------------------------------------
def ease_out(t):
    return 1 - (1 - t) ** 3


def render_video_frame(row, t, w=VID_W, h=VID_H):
    cluster = detect_cluster(row["artigo_slug"])
    base = diagonal_gradient(w, h, BG_TOP, BG_BOTTOM).convert("RGBA")
    base = add_dot_grid(base, w, h, spacing=64)
    base = add_circuit_lines(base, w, h, seed=hash(row["id"]) % 10000, n=9, phase=t * 2.4, avoid_band=(0.36, 0.72))

    icon_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    di = ImageDraw.Draw(icon_layer)
    pulse = 1.0 + 0.03 * math.sin(t * 6.0)
    ICONS.get(cluster, icon_generic)(di, w * 0.5, h * 0.20, w * 0.14 * pulse, (255, 107, 0, 90))
    base = Image.alpha_composite(base, icon_layer)

    img = base.convert("RGB")
    d = ImageDraw.Draw(img)
    d.rectangle([(0, 0), (w, 10)], fill=ACCENT)

    brand_font = font(40, bold=True)
    brand = "SMART PET GADGETS"

    # Fase 1 (0.0-0.6s): logo/marca aparece central com fade+scale
    phase1_end = 0.6
    if t < phase1_end:
        p = ease_out(min(t / phase1_end, 1.0))
        alpha = int(255 * p)
        bbox = d.textbbox((0, 0), brand, font=brand_font)
        bw = bbox[2] - bbox[0]
        layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        dl = ImageDraw.Draw(layer)
        dl.text(((w - bw) // 2, h // 2 - 30), brand, font=brand_font, fill=(255, 255, 255, alpha))
        img = Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB")
        return img

    # Fase 2 em diante: marca sobe para o topo (fixa), gancho entra
    bbox = d.textbbox((0, 0), brand, font=brand_font)
    bw = bbox[2] - bbox[0]
    d.text(((w - bw) // 2, 90), brand, font=brand_font, fill=TEXT_COLOR)
    d.rectangle([(w // 2 - 50, 150), (w // 2 + 50, 154)], fill=ACCENT)

    # Kicker formato
    kicker_font = font(34, bold=True)
    label = f"{FORMAT_LABELS.get(row['formato'], 'REEL')} · {cluster.upper()}"
    lb = d.textbbox((0, 0), label, font=kicker_font)
    d.text(((w - (lb[2] - lb[0])) // 2, 220), label, font=kicker_font, fill=ACCENT)

    # Fase 2 (0.6-1.6s): gancho desliza de baixo + fade in
    phase2_start, phase2_end = 0.6, 1.6
    reveal = 1.0 if t >= phase2_end else ease_out(max(0.0, (t - phase2_start) / (phase2_end - phase2_start)))

    title_font = font(78, bold=True)
    max_w = w - 140
    lines = wrap_text(d, row["gancho"], title_font, max_w)
    while len(lines) > 6 and title_font.size > 40:
        title_font = font(title_font.size - 6, bold=True)
        lines = wrap_text(d, row["gancho"], title_font, max_w)

    line_h = title_font.size + 18
    block_h = line_h * len(lines)
    target_y = h // 2 - block_h // 2
    offset = int((1 - reveal) * 80)
    alpha = int(255 * reveal)

    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    dl = ImageDraw.Draw(layer)
    for i, line in enumerate(lines):
        bbox = dl.textbbox((0, 0), line, font=title_font)
        lw = bbox[2] - bbox[0]
        dl.text(((w - lw) // 2, target_y + offset + i * line_h), line, font=title_font, fill=(247, 247, 248, alpha))
    img = Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB")
    d = ImageDraw.Draw(img)

    if reveal > 0.95:
        underline_y = target_y + block_h + 30
        d.rectangle([(w // 2 - 60, underline_y), (w // 2 + 60, underline_y + 6)], fill=ACCENT)

    # Fase 3 (2.6s+): CTA no rodapé, fade in
    phase3_start = 2.6
    if t >= phase3_start:
        cta_alpha = int(255 * ease_out(min((t - phase3_start) / 0.6, 1.0)))
        cta_font = font(34, bold=True)
        cta = "Guia completo no link da bio →"
        cb = d.textbbox((0, 0), cta, font=cta_font)
        layer2 = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        dl2 = ImageDraw.Draw(layer2)
        dl2.text(((w - (cb[2] - cb[0])) // 2, h - 220), cta, font=cta_font, fill=(255, 107, 0, cta_alpha))
        img = Image.alpha_composite(img.convert("RGBA"), layer2).convert("RGB")

    return img


def render_video(row, out_path):
    from moviepy import ImageSequenceClip

    n_frames = int(VID_DURATION * FPS)
    frames = []
    for i in range(n_frames):
        t = i / FPS
        frame = render_video_frame(row, t)
        frames.append(np.array(frame))
    clip = ImageSequenceClip(frames, fps=FPS)
    clip.write_videofile(str(out_path), codec="libx264", audio=False, logger=None)


# ---------------------------------------------------------------------------
# Execução
# ---------------------------------------------------------------------------
def load_rows():
    data = json.loads(EXPORT_JSON.read_text(encoding="utf-8"))
    return data["rows"]


def main(sample_size=8, video_sample_size=3):
    OUT_IMG.mkdir(parents=True, exist_ok=True)
    OUT_VID.mkdir(parents=True, exist_ok=True)

    rows = load_rows()

    # Amostra diversificada: 1-2 peças por cluster/formato para validar qualidade
    by_cluster = {}
    for r in rows:
        cl = detect_cluster(r["artigo_slug"])
        by_cluster.setdefault(cl, []).append(r)

    sample = []
    for cl, items in by_cluster.items():
        sample.extend(items[:2])
    sample = sample[:sample_size] if sample_size else sample

    print(f"Gerando amostra de {len(sample)} imagens (V2, layout avançado)...")
    for row in sample:
        img = render_image(row)
        out_path = OUT_IMG / f"{row['id']}.png"
        img.save(out_path, "PNG", quality=95)
        print(f"  ok imagem: {out_path.name} ({row['formato']}, {detect_cluster(row['artigo_slug'])})")

    reels = [r for r in rows if r["formato"] == "Reel"][:video_sample_size]
    print(f"Gerando amostra de {len(reels)} vídeos de capa (Reel, MP4)...")
    for row in reels:
        out_path = OUT_VID / f"{row['id']}.mp4"
        render_video(row, out_path)
        print(f"  ok video: {out_path.name}")

    print("Concluído.")
    print(f"Imagens em: {OUT_IMG}")
    print(f"Vídeos em: {OUT_VID}")


if __name__ == "__main__":
    main()
