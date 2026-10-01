#!/usr/bin/env python3
"""
Motor gráfico V4 — Smart Pet Gadgets
Direção de arte: banner comercial com foto real (Pexels) + placa de destaque
inclinada estilo anúncio, no espírito de banners de e-commerce/afiliado.

Fluxo:
  1. Foto real de fundo por cluster (Pexels, banco local curado em
     tools/social-content-engine/assets/pexels_cache/ — sem chave de API
     ativa neste ambiente, então usamos um catálogo curado + cache local em
     vez de busca dinâmica; ver PEXELS_CATALOG abaixo).
  2. Overlay de escurecimento (gradiente) para garantir contraste de texto.
  3. Placa/faixa inclinada, cantos arredondados, sombra projetada, em laranja
     neon, com o gancho da peça em tipografia forte.
  4. Selo/wordmark do Smart Pet Gadgets + CTA limpo no rodapé.

Entrada: .data/social-content-export.json
Saída:
  - reports/social-content/313_pecas_smart_pet_gadgets.xlsx
  - output_midia_avancada/imagens/PECA-XXX.png (1080x1350, banner com foto real)
  - output_midia_avancada/videos/PECA-XXX.mp4   (Ken Burns sobre a mesma foto)

100% local: Pillow + numpy para composição, moviepy + ffmpeg para o MP4.
As fotos vêm de images.pexels.com (CDN pública, sem necessidade de API key
para download do arquivo em si — só a *busca* exige chave, que não está
configurada neste ambiente). Créditos em assets/pexels_cache/manifest.json.
Não publica nada, não toca Facebook/Instagram, não altera artigos do blog.
"""
import json
import math
import os
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

ROOT = Path(__file__).resolve().parents[2]
ENGINE_DIR = Path(__file__).resolve().parent
EXPORT_JSON = ROOT / ".data" / "social-content-export.json"
XLSX_OUT = ROOT / "reports" / "social-content" / "313_pecas_smart_pet_gadgets.xlsx"
OUT_IMG = ROOT / "output_midia_avancada" / "imagens"
OUT_VID = ROOT / "output_midia_avancada" / "videos"
PEXELS_CACHE = ENGINE_DIR / "assets" / "pexels_cache"

# ---------------------------------------------------------------------------
# Catálogo curado de fotos Pexels por cluster (fallback local — sem API key
# ativa neste ambiente). Cada entrada baixa uma vez e fica em cache local.
# ---------------------------------------------------------------------------
PEXELS_CATALOG = {
    "comedouros": [
        {"id": 27960068, "photographer": "Jakub Zerdzicki", "photographer_url": "https://www.pexels.com/@jakubzerdzicki"},
        {"id": 17393531, "photographer": "Pexels", "photographer_url": "https://www.pexels.com"},
        {"id": 20109380, "photographer": "Pexels", "photographer_url": "https://www.pexels.com"},
    ],
    "fontes": [
        {"id": 8881548, "photographer": "Pexels", "photographer_url": "https://www.pexels.com"},
        {"id": 36864444, "photographer": "Pexels", "photographer_url": "https://www.pexels.com"},
        {"id": 11577768, "photographer": "Pexels", "photographer_url": "https://www.pexels.com"},
    ],
    "cameras": [
        {"id": 27435433, "photographer": "Pexels", "photographer_url": "https://www.pexels.com"},
        {"id": 8498526, "photographer": "Pexels", "photographer_url": "https://www.pexels.com"},
    ],
    "coleira-gps": [
        {"id": 19765892, "photographer": "Pexels", "photographer_url": "https://www.pexels.com"},
        {"id": 4422098, "photographer": "Pexels", "photographer_url": "https://www.pexels.com"},
    ],
    "brinquedos": [
        {"id": 4422100, "photographer": "Pexels", "photographer_url": "https://www.pexels.com"},
        {"id": 35711491, "photographer": "Pexels", "photographer_url": "https://www.pexels.com"},
    ],
    "higiene": [
        {"id": 723130, "photographer": "Pexels", "photographer_url": "https://www.pexels.com"},
    ],
    "geral": [
        {"id": 46024, "photographer": "Pexels", "photographer_url": "https://www.pexels.com"},
        {"id": 8495182, "photographer": "Pexels", "photographer_url": "https://www.pexels.com"},
    ],
}


def pexels_url(photo_id):
    return f"https://images.pexels.com/photos/{photo_id}/pexels-photo-{photo_id}.jpeg"


def ensure_pexels_cache():
    """Baixa (uma vez) as fotos do catálogo curado para o cache local."""
    PEXELS_CACHE.mkdir(parents=True, exist_ok=True)
    manifest = []
    for cluster, items in PEXELS_CATALOG.items():
        for it in items:
            dest = PEXELS_CACHE / f"{it['id']}.jpg"
            if not dest.exists():
                req = urllib.request.Request(pexels_url(it["id"]), headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req, timeout=20) as r, open(dest, "wb") as f:
                    f.write(r.read())
            manifest.append({**it, "cluster": cluster, "local_path": str(dest)})
    (PEXELS_CACHE / "manifest.json").write_text(json.dumps(manifest, indent=2))
    return manifest


def pick_background(cluster, seed):
    items = PEXELS_CATALOG.get(cluster) or PEXELS_CATALOG["geral"]
    choice = items[seed % len(items)]
    path = PEXELS_CACHE / f"{choice['id']}.jpg"
    if not path.exists():
        ensure_pexels_cache()
    return Image.open(path).convert("RGB"), choice


# ---------------------------------------------------------------------------
# Paleta / identidade
# ---------------------------------------------------------------------------
ACCENT = (255, 107, 0)         # laranja neon #FF6B00
ACCENT_2 = (255, 168, 0)       # ponta amarelada do degradê da placa
INK = (17, 19, 22)             # texto escuro sobre a placa clara
WHITE = (255, 255, 255)
MUTED = (223, 226, 230)

IMG_W, IMG_H = 1080, 1350
VID_W, VID_H = 1080, 1920
FPS = 24
VID_DURATION = 4.5

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
            return cluster if cluster in PEXELS_CATALOG else "geral"
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


def cover_resize(img, target_w, target_h):
    """Redimensiona a foto para preencher o quadro (crop central), como
    background-size: cover."""
    src_w, src_h = img.size
    scale = max(target_w / src_w, target_h / src_h)
    new_w, new_h = int(src_w * scale), int(src_h * scale)
    img = img.resize((new_w, new_h), Image.LANCZOS)
    left = (new_w - target_w) // 2
    top = (new_h - target_h) // 2
    return img.crop((left, top, left + target_w, top + target_h))


def darken_overlay(img_rgb, top_alpha=70, bottom_alpha=190):
    """Gradiente de escurecimento (mais forte embaixo, onde fica o rodapé) +
    leve escurecimento geral para garantir contraste de texto sobre foto."""
    w, h = img_rgb.size
    layer = Image.new("L", (1, h))
    for y in range(h):
        ratio = y / h
        layer.putpixel((0, y), int(top_alpha + (bottom_alpha - top_alpha) * ratio))
    alpha = layer.resize((w, h))
    black = Image.new("RGBA", (w, h), (5, 6, 8, 255))
    black.putalpha(alpha)
    return Image.alpha_composite(img_rgb.convert("RGBA"), black)


def rounded_rect_layer(size, radius, fill):
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius=radius, fill=fill)
    return layer


def gradient_plate(size, radius, c1, c2):
    w, h = size
    grad = Image.new("RGB", (w, h))
    arr = np.zeros((h, w, 3), dtype=np.uint8)
    ratio = np.linspace(0, 1, w).reshape(1, w)
    for c in range(3):
        arr[:, :, c] = (c1[c] + (c2[c] - c1[c]) * ratio).astype(np.uint8)
    grad = Image.fromarray(arr)
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, w - 1, h - 1], radius=radius, fill=255)
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    out.paste(grad, (0, 0), mask)
    return out


def paste_with_shadow(base_rgba, plate_rgba, pos, blur=18, shadow_alpha=140, shadow_offset=(0, 14)):
    """Cola a placa com uma sombra projetada suave atrás dela."""
    shadow = Image.new("RGBA", base_rgba.size, (0, 0, 0, 0))
    mask = plate_rgba.split()[-1]
    shadow_shape = Image.new("RGBA", plate_rgba.size, (0, 0, 0, shadow_alpha))
    shadow.paste(shadow_shape, (pos[0] + shadow_offset[0], pos[1] + shadow_offset[1]), mask)
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    base_rgba = Image.alpha_composite(base_rgba, shadow)
    base_rgba.paste(plate_rgba, pos, plate_rgba)
    return base_rgba


def wordmark(draw, x, y, fill=WHITE):
    f = font(30, bold=True)
    draw.text((x, y), "SMART PET GADGETS", font=f, fill=fill)


def draw_spaced_text(draw, xy, text, fnt, fill, spacing=4):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        bbox = draw.textbbox((0, 0), ch, font=fnt)
        x += (bbox[2] - bbox[0]) + spacing
    return x


# ---------------------------------------------------------------------------
# Composição da imagem — banner comercial com foto real
# ---------------------------------------------------------------------------
def render_banner(row, w=IMG_W, h=IMG_H):
    cluster = detect_cluster(row["artigo_slug"])
    seed = hash(row["id"]) % 10000
    photo, credit = pick_background(cluster, seed)

    bg = cover_resize(photo, w, h)
    canvas = darken_overlay(bg)

    # --- Placa inclinada com o gancho, no terço superior ---
    plate_w, plate_h = int(w * 0.92), 340
    plate = gradient_plate((plate_w, plate_h), radius=34, c1=ACCENT, c2=ACCENT_2)
    pd = ImageDraw.Draw(plate)

    kicker_font = font(24, bold=True)
    kicker = f"{FORMAT_LABELS.get(row['formato'], row['formato'].upper())} · {cluster.upper()}"
    draw_spaced_text(pd, (44, 34), kicker, kicker_font, INK, spacing=3)

    title_font = font(58, bold=True)
    max_w = plate_w - 88
    lines = wrap_text(pd, row["gancho"], title_font, max_w)
    while len(lines) > 3 and title_font.size > 34:
        title_font = font(title_font.size - 4, bold=True)
        lines = wrap_text(pd, row["gancho"], title_font, max_w)
    line_h = int(title_font.size * 1.16)
    # ajusta a altura da placa ao número de linhas
    needed_h = 100 + len(lines) * line_h + 34
    if needed_h > plate_h:
        plate_h = needed_h
        plate = gradient_plate((plate_w, plate_h), radius=34, c1=ACCENT, c2=ACCENT_2)
        pd = ImageDraw.Draw(plate)
        draw_spaced_text(pd, (44, 34), kicker, kicker_font, INK, spacing=3)
    for i, line in enumerate(lines):
        pd.text((44, 92 + i * line_h), line, font=title_font, fill=INK)

    # Inclina a placa levemente (estilo "sticker" de banner de anúncio)
    plate_rot = plate.rotate(-3.2, expand=True, resample=Image.BICUBIC)

    canvas = canvas.convert("RGBA")
    plate_pos = (int(w * 0.04) - 10, 96)
    canvas = paste_with_shadow(canvas, plate_rot, plate_pos)

    # --- Rodapé: wordmark + CTA, com scrim leve para legibilidade ---
    d = ImageDraw.Draw(canvas)
    wordmark(d, 64, h - 150)
    d.line([(64, h - 104), (w - 64, h - 104)], fill=(255, 255, 255, 60), width=1)

    cta_font = font(28, bold=True)
    d.text((64, h - 90), "Guia completo no site →", font=cta_font, fill=ACCENT)

    domain_font = font(24)
    domain = "smartpetgadgets.com.br"
    bbox = d.textbbox((0, 0), domain, font=domain_font)
    d.text((w - 64 - (bbox[2] - bbox[0]), h - 88), domain, font=domain_font, fill=MUTED)

    id_font = font(20)
    d.text((64, h - 46), f"{row['id']}  ·  Foto: {credit['photographer']} / Pexels", font=id_font, fill=(200, 203, 208))

    return canvas.convert("RGB")


# ---------------------------------------------------------------------------
# Vídeo: Ken Burns sobre a foto real + placa/wordmark/CTA animados
# ---------------------------------------------------------------------------
def ease_out(t):
    return 1 - (1 - t) ** 3


def build_ken_burns_bg(cluster, seed, w, h):
    photo, credit = pick_background(cluster, seed)
    big = cover_resize(photo, int(w * 1.22), int(h * 1.22))
    return big, credit


def ken_burns_crop(big_bg, t, duration, w, h):
    bw, bh = big_bg.size
    progress = min(t / duration, 1.0)
    zoom = 1.0 + 0.07 * progress
    crop_w, crop_h = w / zoom * (bw / w), h / zoom * (bh / h)
    crop_w, crop_h = min(crop_w, bw), min(crop_h, bh)
    cx, cy = bw / 2, bh / 2
    box = (cx - crop_w / 2, cy - crop_h / 2, cx + crop_w / 2, cy + crop_h / 2)
    return big_bg.crop(box).resize((w, h), Image.LANCZOS)


def render_video_frame(row, t, big_bg, w=VID_W, h=VID_H, duration=VID_DURATION):
    cluster = detect_cluster(row["artigo_slug"])
    frame = ken_burns_crop(big_bg, t, duration, w, h)
    frame = darken_overlay(frame, top_alpha=60, bottom_alpha=200).convert("RGBA")
    d = ImageDraw.Draw(frame)

    # Barra de progresso
    bar_y = 34
    d.rounded_rectangle([(60, bar_y), (w - 60, bar_y + 6)], radius=3, fill=(255, 255, 255, 40))
    prog_w = (w - 120) * min(t / duration, 1.0)
    d.rounded_rectangle([(60, bar_y), (60 + prog_w, bar_y + 6)], radius=3, fill=(*ACCENT, 235))

    wordmark(d, (w - 420) // 2, 74)

    # Placa com o gancho — fade + leve subida
    reveal_start, reveal_end = 0.35, 1.35
    reveal = 1.0 if t >= reveal_end else ease_out(max(0.0, (t - reveal_start) / (reveal_end - reveal_start)))
    if reveal > 0.02:
        plate_w = int(w * 0.88)
        title_font = font(52, bold=True)
        max_w = plate_w - 88
        lines = wrap_text(d, row["gancho"], title_font, max_w)
        while len(lines) > 3 and title_font.size > 32:
            title_font = font(title_font.size - 4, bold=True)
            lines = wrap_text(d, row["gancho"], title_font, max_w)
        line_h = int(title_font.size * 1.18)
        plate_h = 90 + len(lines) * line_h + 30
        plate = gradient_plate((plate_w, plate_h), radius=30, c1=ACCENT, c2=ACCENT_2)
        pd = ImageDraw.Draw(plate)
        kicker_font = font(22, bold=True)
        kicker = f"{FORMAT_LABELS.get(row['formato'], 'REEL')} · {cluster.upper()}"
        draw_spaced_text(pd, (40, 28), kicker, kicker_font, INK, spacing=3)
        for i, line in enumerate(lines):
            pd.text((40, 78 + i * line_h), line, font=title_font, fill=INK)
        plate.putalpha(plate.split()[-1].point(lambda a: int(a * reveal)))
        offset = int((1 - reveal) * 40)
        frame = paste_with_shadow(frame, plate, ((w - plate_w) // 2, int(h * 0.38) + offset), blur=16)
        d = ImageDraw.Draw(frame)

    # CTA final
    cta_start = duration - 1.1
    if t >= cta_start:
        cta_alpha = int(255 * ease_out(min((t - cta_start) / 0.6, 1.0)))
        cta_font = font(30, bold=True)
        cta = "Guia completo no link da bio →"
        cb = d.textbbox((0, 0), cta, font=cta_font)
        layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        ld = ImageDraw.Draw(layer)
        ld.text(((w - (cb[2] - cb[0])) // 2, h - 160), cta, font=cta_font, fill=(*ACCENT, cta_alpha))
        frame = Image.alpha_composite(frame, layer)

    return frame.convert("RGB")


def render_video(row, out_path, w=VID_W, h=VID_H, duration=VID_DURATION):
    from moviepy import ImageSequenceClip

    cluster = detect_cluster(row["artigo_slug"])
    big_bg, _credit = build_ken_burns_bg(cluster, hash(row["id"]) % 10000, w, h)
    n_frames = int(duration * FPS)
    frames = [np.array(render_video_frame(row, i / FPS, big_bg, w, h, duration)) for i in range(n_frames)]
    clip = ImageSequenceClip(frames, fps=FPS)
    clip.write_videofile(str(out_path), codec="libx264", audio=False, logger=None)


# ---------------------------------------------------------------------------
# Planilha
# ---------------------------------------------------------------------------
def build_xlsx(rows, total, generated_at):
    XLSX_OUT.parent.mkdir(parents=True, exist_ok=True)
    wb = Workbook()
    ws = wb.active
    ws.title = "Peças Sociais"

    headers = ["ID", "Formato", "Artigo-fonte", "Gancho/Título", "Copy", "CTA", "URL", "Status"]
    ws.append(headers)
    header_fill = PatternFill(start_color="0D1117", end_color="0D1117", fill_type="solid")
    header_font = Font(color="FF6B00", bold=True)
    for col in range(1, len(headers) + 1):
        c = ws.cell(row=1, column=col)
        c.font = header_font
        c.fill = header_fill
        c.alignment = Alignment(vertical="center")

    for row in rows:
        ws.append([row["id"], row["formato"], row["artigo_slug"], row["gancho"],
                   row.get("copy", ""), row.get("cta", ""), row.get("url", ""), "A postar"])

    for i, width in enumerate([12, 12, 32, 45, 60, 45, 45, 12], start=1):
        ws.column_dimensions[get_column_letter(i)].width = width
    ws.freeze_panes = "A2"

    meta = wb.create_sheet("Sobre")
    meta.append(["Gerado em", generated_at])
    meta.append(["Total de peças", total])
    meta.append(["Fonte", "Social Content Engine rodado sobre artigos reais do site"])
    meta.append(["Direção de arte", "V4 — banner com foto real (Pexels) + placa inclinada laranja neon + wordmark/CTA"])
    meta.append(["Créditos de foto", "assets/pexels_cache/manifest.json (photographer + link por imagem)"])
    wb.save(XLSX_OUT)


# ---------------------------------------------------------------------------
# Execução
# ---------------------------------------------------------------------------
def load_rows():
    data = json.loads(EXPORT_JSON.read_text(encoding="utf-8"))
    return data["rows"], data["total"], data["generated_at"]


def main(sample_size=8, video_sample_size=3, full_xlsx=True):
    OUT_IMG.mkdir(parents=True, exist_ok=True)
    OUT_VID.mkdir(parents=True, exist_ok=True)
    ensure_pexels_cache()

    rows, total, generated_at = load_rows()

    if full_xlsx:
        build_xlsx(rows, total, generated_at)
        print(f"Planilha salva em: {XLSX_OUT} ({len(rows)} peças)")

    by_cluster = {}
    for r in rows:
        by_cluster.setdefault(detect_cluster(r["artigo_slug"]), []).append(r)
    sample = []
    for items in by_cluster.values():
        sample.extend(items[:2])
    sample = sample[:sample_size] if sample_size else sample

    print(f"Gerando amostra de {len(sample)} imagens (V4, banner com foto real)...")
    for row in sample:
        img = render_banner(row)
        img.save(OUT_IMG / f"{row['id']}.png", "PNG", quality=95)
        print(f"  ok imagem: {row['id']}.png ({row['formato']}, {detect_cluster(row['artigo_slug'])})")

    reels = [r for r in rows if r["formato"] == "Reel"][:video_sample_size]
    print(f"Gerando amostra de {len(reels)} vídeos (Ken Burns sobre foto real)...")
    for row in reels:
        out_path = OUT_VID / f"{row['id']}.mp4"
        render_video(row, out_path)
        print(f"  ok video: {out_path.name}")

    print("Concluído.")
    print(f"Imagens em: {OUT_IMG}")
    print(f"Vídeos em: {OUT_VID}")


if __name__ == "__main__":
    main()
