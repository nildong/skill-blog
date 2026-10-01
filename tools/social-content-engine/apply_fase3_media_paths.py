#!/usr/bin/env python3
"""
FASE 3 — aplica os caminhos de mídia FÍSICA real (gerada por
generate_assets_v2.py) às 25 linhas do piloto em
.data/social-content-v2-export.json, e regrava publicar.txt de cada peça
para apontar para o arquivo que agora existe de fato (em vez do caminho
planejado da FASE 2).
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
EXPORT_JSON = ROOT / ".data" / "social-content-v2-export.json"
OUT_DIR = ROOT / "output_social_v2"
MANIFEST = OUT_DIR / "fase3-piloto-media-manifest.json"

FORMAT_TO_DIR = {
    "reel": "reels",
    "post": "posts",
    "carousel": "carrosseis",
    "stories": "stories",
    "engagement": "engagement",
}


def main():
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    by_id = {m["ID"]: m for m in manifest}

    data = json.loads(EXPORT_JSON.read_text(encoding="utf-8"))
    updated = []
    for row in data["rows"]:
        if row["ID"] not in by_id:
            continue
        m = by_id[row["ID"]]
        media = m["media"]
        imgs = [x["path"] for x in media if x["tipo"].startswith("imagem")]
        vids = [x["path"] for x in media if x["tipo"] == "video"]

        row["ARQUIVO_MIDIA"] = imgs[0] if imgs else row["ARQUIVO_MIDIA"]
        row["ARQUIVO_MIDIA_VIDEO"] = vids[0] if vids else None
        row["CAPA"] = imgs[0] if imgs else row["CAPA"]
        row["ARQUIVOS_MIDIA_TODOS"] = imgs + vids
        row["ARQUIVO_EXISTE"] = True
        row["MIDIA_FASE"] = "FASE_3_REAL"
        updated.append(row)

    EXPORT_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Atualizadas {len(updated)} linhas com mídia real.")

    # Regrava publicar.txt de cada peça do piloto
    for row in updated:
        formatdir = FORMAT_TO_DIR.get(row["FORMATO"], "posts")
        piece_dir = OUT_DIR / formatdir / row["ID"]
        all_media = row.get("ARQUIVOS_MIDIA_TODOS", [])
        media_lines = "\n".join(f"  - {p}" for p in all_media)
        publicar = "\n".join([
            f"ID: {row['ID']}",
            f"Artigo: {row['ARTIGO']} ({row['ARTICLE_URL']})",
            f"Formato: {row['FORMATO']} | Tipo: {row['TIPO']} | Objetivo: {row['OBJETIVO']}",
            f"Data sugerida: {row['DATA_SUGERIDA']} ({row['DIA']}) às {row['HORARIO_SUGERIDO']}",
            f"Status: {row['STATUS']} (score {row['SCORE']}/100)" + (" [revisão leve recomendada]" if row.get("REVISAO_LEVE") else ""),
            "",
            "Mídia FÍSICA gerada nesta FASE 3 (arquivo real, não mais um plano):",
            media_lines,
            "",
            "Arte: hook principal apenas (sem PECA-XXX, sem nome de formato, sem",
            "kicker de produção) sobre a mesma foto-base Pexels do cluster do V1.",
            "",
            f"Observação: {row.get('OBSERVACAO') or '(nenhuma)'}",
        ])
        (piece_dir / "publicar.txt").write_text(publicar, encoding="utf-8")

    print("publicar.txt atualizado para as 25 peças do piloto.")


if __name__ == "__main__":
    main()
