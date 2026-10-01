#!/usr/bin/env python3
"""Roda o lote completo V4: todas as imagens (474) e todos os vídeos de Reel
(~134), com log de progresso para acompanhamento externo."""
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from generate_assets import (  # noqa: E402
    load_rows, render_banner, render_video, build_xlsx,
    OUT_IMG, OUT_VID, detect_cluster, ensure_pexels_cache,
)

LOG = Path(__file__).resolve().parent / "batch_progress.log"


def log(msg):
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG, "a") as f:
        f.write(line + "\n")


def main():
    OUT_IMG.mkdir(parents=True, exist_ok=True)
    OUT_VID.mkdir(parents=True, exist_ok=True)
    ensure_pexels_cache()

    rows, total, generated_at = load_rows()
    log(f"Carregado: {len(rows)} peças (export {generated_at})")

    build_xlsx(rows, total, generated_at)
    log("Planilha .xlsx (re)gravada")

    log(f"Iniciando IMAGENS: {len(rows)} peças")
    t0 = time.time()
    for i, row in enumerate(rows, 1):
        out_path = OUT_IMG / f"{row['id']}.png"
        if out_path.exists():
            continue
        img = render_banner(row)
        img.save(out_path, "PNG", quality=95)
        if i % 25 == 0 or i == len(rows):
            log(f"  imagens {i}/{len(rows)}")
    log(f"Imagens concluídas em {time.time() - t0:.0f}s")

    reels = [r for r in rows if r["formato"] == "Reel"]
    log(f"Iniciando VIDEOS: {len(reels)} Reels")
    t0 = time.time()
    for i, row in enumerate(reels, 1):
        out_path = OUT_VID / f"{row['id']}.mp4"
        if out_path.exists():
            continue
        render_video(row, out_path)
        elapsed = time.time() - t0
        log(f"  video {i}/{len(reels)}: {out_path.name} (decorrido {elapsed:.0f}s)")
    log(f"Vídeos concluídos em {time.time() - t0:.0f}s")

    n_img = len(list(OUT_IMG.glob("PECA-*.png")))
    n_vid = len(list(OUT_VID.glob("PECA-*.mp4")))
    log(f"LOTE COMPLETO. Imagens no disco: {n_img} | Vídeos no disco: {n_vid}")


if __name__ == "__main__":
    main()
