#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

exec env \
  NOTIFY_SOUND_FILE="${REPO_ROOT}/assets/music/notif2.mp3" \
  NOTIFY_INSTANCE_KEY="notif2" \
  "${SCRIPT_DIR}/play_task_bell.sh" "$@"
