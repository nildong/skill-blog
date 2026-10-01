#!/usr/bin/env python3
"""
Motor gráfico V2 (FASE 3 — piloto) — Smart Pet Gadgets

Diagramação corrigida em relação ao V1 (generate_assets.py):
  - Sem PECA-XXX / ID técnico visível na arte.
  - Sem nome do formato (REEL/POST/STORY/CARROSSEL) escrito na peça.
  - Sem "kicker" de produção (cluster/etiqueta de bastidor).
  - Um único bloco de texto: o HOOK principal (+ complemento opcional
    curto quando fizer sentido, ex.: em carrossel/stories), nada mais.
  - Marca (wordmark) discreta, pequena, canto inferior — não é bloco de
    texto de gancho, é só assinatura visual.

Reaproveita a MESMA foto-base do Pexels por cluster (assets/pexels_cache/),
mas a arte de texto é nova (sem overlay antigo "placa laranja com kicker").

Entrada: seleção de 25 peças do piloto (.data/social-content-v2-export.json,
filtradas pela lista de IDs do piloto FASE 3).
Saída: output_social_v2/{posts,reels,carrosseis,stories,engagement}/SPG-NNN/
100% local. Não publica nada, não altera artigos/afiliados/sitemap.
"""
import json
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[2]
ENGINE_DIR = Path(__file__).resolve().parent
EXPORT_JSON = ROOT / ".data" / "social-content-v2-export.json"
OUT_DIR = ROOT / "output_social_v2"
PEXELS_CACHE = ENGINE_DIR / "assets" / "pexels_cache"

IMG_W, IMG_H = 1080, 1350
STORY_W, STORY_H = 1080, 1920
VID_W, VID_H = 1080, 1920
FPS = 24
VID_DURATION = 4.5

ACCENT = (255, 107, 0)
ACCENT_2 = (255, 168, 0)
INK = (17, 19, 22)
WHITE = (255, 255, 255)
MUTED = (223, 226, 230)

CLUSTER_RULES = [
    ("comedouro", "comedouros"),
    ("bebedouro", "fontes"),
    ("coleira-gps", "coleira-gps"),
    ("microchip", "coleira-gps"),
    ("camera", "cameras"),
    ("porta-eletronica", "porta-eletronica"),
    ("alcapao", "porta-eletronica"),
    ("brinquedo", "brinquedos"),
    ("cercado", "brinquedos"),
    ("tapete", "higiene"),
]

PEXELS_CATALOG = {
    "comedouros": [27960068, 17393531, 20109380],
    "fontes": [8881548, 36864444, 11577768],
    "cameras": [27435433, 8498526],
    "coleira-gps": [19765892, 4422098],
    "porta-eletronica": [46024, 8495182],
    "brinquedos": [4422100, 35711491],
    "higiene": [723130],
    "geral": [46024, 8495182],
}


CLUSTER_FIELD_MAP = {
    "comedouro-automatico-para-pet": "comedouros",
    "coleira-gps-para-pet": "coleira-gps",
    "camera-para-monitorar-pet": "cameras",
    "brinquedo-interativo-automatico-para-gato": "brinquedos",
    "porta-eletronica-automatica-para-pet": "porta-eletronica",
}


def detect_cluster(slug_or_url: str, cluster_field: str = None) -> str:
    """Prioriza o campo CLUSTER já classificado (content-strategy.json via
    export-v2). Só cai para heurística de substring na URL quando o CLUSTER
    do artigo é None (não classificado)."""
    if cluster_field and cluster_field in CLUSTER_FIELD_MAP:
        return CLUSTER_FIELD_MAP[cluster_field]
    s = slug_or_url.lower()
    for needle, cluster in CLUSTER_RULES:
        if needle in s:
            return cluster if cluster in PEXELS_CATALOG else "geral"
    return "geral"


def pick_background(cluster, seed=0):
    ids = PEXELS_CATALOG.get(cluster) or PEXELS_CATALOG["geral"]
    photo_id = ids[seed % len(ids)]
    path = PEXELS_CACHE / f"{photo_id}.jpg"
    return Image.open(path).convert("RGB"), photo_id


def find_font(bold=False):
    import os
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
    src_w, src_h = img.size
    scale = max(target_w / src_w, target_h / src_h)
    new_w, new_h = int(src_w * scale), int(src_h * scale)
    img = img.resize((new_w, new_h), Image.LANCZOS)
    left = (new_w - target_w) // 2
    top = (new_h - target_h) // 2
    return img.crop((left, top, left + target_w, top + target_h))


def darken_overlay(img_rgb, top_alpha=50, bottom_alpha=175):
    w, h = img_rgb.size
    layer = Image.new("L", (1, h))
    for y in range(h):
        ratio = y / h
        layer.putpixel((0, y), int(top_alpha + (bottom_alpha - top_alpha) * ratio))
    alpha = layer.resize((w, h))
    black = Image.new("RGBA", (w, h), (5, 6, 8, 255))
    black.putalpha(alpha)
    return Image.alpha_composite(img_rgb.convert("RGBA"), black)


def gradient_plate(size, radius, c1, c2):
    w, h = size
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


def paste_with_shadow(base_rgba, plate_rgba, pos, blur=18, shadow_alpha=130, shadow_offset=(0, 12)):
    shadow = Image.new("RGBA", base_rgba.size, (0, 0, 0, 0))
    mask = plate_rgba.split()[-1]
    shadow_shape = Image.new("RGBA", plate_rgba.size, (0, 0, 0, shadow_alpha))
    shadow.paste(shadow_shape, (pos[0] + shadow_offset[0], pos[1] + shadow_offset[1]), mask)
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    base_rgba = Image.alpha_composite(base_rgba, shadow)
    base_rgba.paste(plate_rgba, pos, plate_rgba)
    return base_rgba


def wordmark_small(draw, x, y, fill=(255, 255, 255, 200)):
    f = font(22, bold=True)
    draw.text((x, y), "smartpetgadgets.com.br", font=f, fill=fill)


def build_text_plate(hook, complement, w, max_lines=4):
    """Placa única com o HOOK (+ complemento opcional), sem kicker/ID/formato."""
    plate_w = int(w * 0.90)
    pad_x, pad_top, pad_bottom = 48, 44, 40
    scratch = Image.new("RGBA", (plate_w, 10))
    d = ImageDraw.Draw(scratch)

    title_font = font(54, bold=True)
    max_w = plate_w - pad_x * 2
    lines = wrap_text(d, hook, title_font, max_w)
    while len(lines) > max_lines and title_font.size > 30:
        title_font = font(title_font.size - 4, bold=True)
        lines = wrap_text(d, hook, title_font, max_w)
    line_h = int(title_font.size * 1.18)

    comp_font = font(30)
    comp_lines = []
    if complement:
        comp_lines = wrap_text(d, complement, comp_font, max_w)[:2]
    comp_line_h = int(comp_font.size * 1.3)

    plate_h = pad_top + len(lines) * line_h + (14 + len(comp_lines) * comp_line_h if comp_lines else 0) + pad_bottom
    plate = gradient_plate((plate_w, plate_h), radius=28, c1=ACCENT, c2=ACCENT_2)
    pd = ImageDraw.Draw(plate)
    y = pad_top
    for line in lines:
        pd.text((pad_x, y), line, font=title_font, fill=INK)
        y += line_h
    if comp_lines:
        y += 14
        for line in comp_lines:
            pd.text((pad_x, y), line, font=comp_font, fill=(40, 26, 10))
            y += comp_line_h
    return plate


def render_static(hook, complement, cluster, seed, w, h, out_path, story_style=False):
    photo, photo_id = pick_background(cluster, seed)
    bg = cover_resize(photo, w, h)
    canvas = darken_overlay(bg, top_alpha=45 if not story_style else 60, bottom_alpha=170).convert("RGBA")

    plate = build_text_plate(hook, complement, w)
    plate_x = (w - plate.width) // 2
    plate_y = int(h * 0.30) if not story_style else int(h * 0.40)
    canvas = paste_with_shadow(canvas, plate, (plate_x, plate_y))

    d = ImageDraw.Draw(canvas)
    wordmark_small(d, 40, h - 56)
    canvas.convert("RGB").save(out_path, "PNG", quality=95)
    return photo_id


def ease_out(t):
    return 1 - (1 - t) ** 3


def render_video(hook, cluster, seed, out_path, w=VID_W, h=VID_H, duration=VID_DURATION):
    from moviepy import ImageSequenceClip

    photo, _pid = pick_background(cluster, seed)
    big = cover_resize(photo, int(w * 1.2), int(h * 1.2))
    bw, bh = big.size

    def frame_at(t):
        progress = min(t / duration, 1.0)
        zoom = 1.0 + 0.06 * progress
        crop_w, crop_h = w / zoom * (bw / w), h / zoom * (bh / h)
        crop_w, crop_h = min(crop_w, bw), min(crop_h, bh)
        cx, cy = bw / 2, bh / 2
        box = (cx - crop_w / 2, cy - crop_h / 2, cx + crop_w / 2, cy + crop_h / 2)
        frame = big.crop(box).resize((w, h), Image.LANCZOS)
        frame = darken_overlay(frame, top_alpha=40, bottom_alpha=185).convert("RGBA")
        d = ImageDraw.Draw(frame)

        reveal_start, reveal_end = 0.3, 1.2
        reveal = 1.0 if t >= reveal_end else ease_out(max(0.0, (t - reveal_start) / (reveal_end - reveal_start)))
        if reveal > 0.02:
            plate = build_text_plate(hook, None, w)
            plate.putalpha(plate.split()[-1].point(lambda a: int(a * reveal)))
            offset = int((1 - reveal) * 30)
            frame = paste_with_shadow(frame, plate, ((w - plate.width) // 2, int(h * 0.36) + offset), blur=16)
            d = ImageDraw.Draw(frame)

        wordmark_small(d, 40, h - 56)
        return np.array(frame.convert("RGB"))

    n_frames = int(duration * FPS)
    frames = [frame_at(i / FPS) for i in range(n_frames)]
    clip = ImageSequenceClip(frames, fps=FPS)
    clip.write_videofile(str(out_path), codec="libx264", audio=False, logger=None)


FORMAT_TO_DIR = {
    "reel": "reels",
    "post": "posts",
    "carousel": "carrosseis",
    "stories": "stories",
    "engagement": "engagement",
}


def load_rows(pilot_ids):
    data = json.loads(EXPORT_JSON.read_text(encoding="utf-8"))
    rows = [r for r in data["rows"] if r["ID"] in pilot_ids]
    return rows, data


def slides_for_carousel(row):
    """Deriva de 3 a 5 slides curtos (hook + 2-4 pontos) a partir da LEGENDA
    (pipe-separated no export). Só reorganiza texto já existente — não inventa."""
    parts = [p.strip() for p in row["LEGENDA"].split("|") if p.strip()]
    if len(parts) < 3:
        parts = [row["HOOK"]] + parts
    return parts[:5] if len(parts) >= 3 else (parts + [row["HOOK"]])[:3]


def story_variants_for(row):
    """2-4 imagens verticais simples (pergunta/enquete) por artigo."""
    hook = row["HOOK"] or row["LEGENDA"]
    variants = [hook]
    if row.get("CTA"):
        variants.append(row["CTA"])
    return variants[:4] if len(variants) >= 2 else [hook, "Responde no story! 👇"]


def main(pilot_ids, overrides=None):
    overrides = overrides or {}
    rows, _data = load_rows(pilot_ids)
    manifest = []
    for row in rows:
        cluster = detect_cluster(row["ARTICLE_URL"], row.get("CLUSTER"))
        seed = hash(row["content_id_origem"]) % 10000
        fmt = row["FORMATO"]
        piece_dir = OUT_DIR / FORMAT_TO_DIR.get(fmt, "posts") / row["ID"]
        piece_dir.mkdir(parents=True, exist_ok=True)

        hook = overrides.get(row["ID"], {}).get("hook", row["HOOK"] or row["LEGENDA"][:120])
        entry = {"ID": row["ID"], "FORMATO": fmt, "cluster_visual": cluster, "media": []}

        if fmt == "post":
            out = piece_dir / f"{row['ID']}.png"
            pid = render_static(hook, None, cluster, seed, IMG_W, IMG_H, out)
            entry["media"].append({"tipo": "imagem", "path": str(out.relative_to(ROOT)), "pexels_id": pid})

        elif fmt == "reel":
            out_img = piece_dir / f"{row['ID']}-capa.png"
            pid = render_static(hook, None, cluster, seed, IMG_W, IMG_H, out_img)
            entry["media"].append({"tipo": "imagem_capa", "path": str(out_img.relative_to(ROOT)), "pexels_id": pid})
            out_vid = piece_dir / f"{row['ID']}.mp4"
            render_video(hook, cluster, seed, out_vid)
            entry["media"].append({"tipo": "video", "path": str(out_vid.relative_to(ROOT))})

        elif fmt == "carousel":
            slides = slides_for_carousel(row)
            for i, slide_text in enumerate(slides, start=1):
                out = piece_dir / f"{row['ID']}-slide{i}.png"
                pid = render_static(slide_text, None, cluster, seed + i, IMG_W, IMG_H, out)
                entry["media"].append({"tipo": f"imagem_slide_{i}", "path": str(out.relative_to(ROOT)), "pexels_id": pid})

        elif fmt == "stories":
            variants = story_variants_for(row)
            for i, v in enumerate(variants, start=1):
                out = piece_dir / f"{row['ID']}-story{i}.png"
                pid = render_static(v, None, cluster, seed + i, STORY_W, STORY_H, out, story_style=True)
                entry["media"].append({"tipo": f"imagem_story_{i}", "path": str(out.relative_to(ROOT)), "pexels_id": pid})

        elif fmt == "engagement":
            out = piece_dir / f"{row['ID']}.png"
            pid = render_static(hook, None, cluster, seed, IMG_W, IMG_H, out)
            entry["media"].append({"tipo": "imagem", "path": str(out.relative_to(ROOT)), "pexels_id": pid})

        manifest.append(entry)
        print(f"ok {row['ID']} ({fmt}): {len(entry['media'])} arquivo(s)")

    manifest_path = OUT_DIR / "fase3-piloto-media-manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Manifesto: {manifest_path}")
    return manifest


if __name__ == "__main__":
    import sys
    ids = sys.argv[1:] or json.loads((ENGINE_DIR / "fase3_pilot_ids.json").read_text())
    main(ids)
