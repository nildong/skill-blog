#!/usr/bin/env bash
# Supervisor: reinicia run_full_batch.py a cada crash (ex.: OOM) até o lote
# completo (474 imagens + 134 vídeos) estar no disco. Idempotente: cada
# reinício pula arquivos já gerados.
set -u
cd "$(dirname "$0")"
PY=/tmp/sce-venv/bin/python3
LOG=batch_progress.log
TARGET_VID=134
TARGET_IMG=474

attempt=0
while true; do
  attempt=$((attempt + 1))
  n_img=$(find ../../output_midia_avancada/imagens -name "PECA-*.png" 2>/dev/null | wc -l)
  n_vid=$(find ../../output_midia_avancada/videos -name "PECA-*.mp4" 2>/dev/null | wc -l)
  echo "[$(date +%H:%M:%S)] supervisor tentativa $attempt — imagens $n_img/$TARGET_IMG, videos $n_vid/$TARGET_VID" >> "$LOG"

  if [ "$n_img" -ge "$TARGET_IMG" ] && [ "$n_vid" -ge "$TARGET_VID" ]; then
    echo "[$(date +%H:%M:%S)] supervisor: LOTE COMPLETO detectado, encerrando." >> "$LOG"
    break
  fi

  "$PY" run_full_batch.py >> batch_stdout.log 2>&1
  rc=$?
  echo "[$(date +%H:%M:%S)] supervisor: processo saiu com rc=$rc" >> "$LOG"

  if [ "$attempt" -gt 40 ]; then
    echo "[$(date +%H:%M:%S)] supervisor: excedeu 40 tentativas, abortando." >> "$LOG"
    exit 1
  fi
  sleep 2
done
