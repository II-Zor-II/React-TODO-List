#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
DEFAULT_SOUND_FILE="${REPO_ROOT}/assets/music/notif2.mp3"
SOUND_FILE="${NOTIFY_SOUND_FILE:-${DEFAULT_SOUND_FILE}}"
PLAYER="${NOTIFY_PLAYER:-mpg123}"
PLAYER_CANDIDATES_RAW="${NOTIFY_PLAYER_CANDIDATES:-${PLAYER},mpg123,paplay,pw-play,ffplay,mpv,play,cvlc}"
PLAYER_CMD=()
HOST_EXEC_RAW="${NOTIFY_HOST_EXEC:-}"
HOST_PREFIX=()
DEFAULT_INSTANCE_KEY="$(basename "${SOUND_FILE}")"
DEFAULT_INSTANCE_KEY="${DEFAULT_INSTANCE_KEY%.*}"
INSTANCE_KEY="${NOTIFY_INSTANCE_KEY:-${DEFAULT_INSTANCE_KEY}}"
INSTANCE_KEY="${INSTANCE_KEY//[^a-zA-Z0-9._-]/_}"
STATE_DIR="${TMPDIR:-/tmp}/sproutbound-notify/${INSTANCE_KEY}"
PID_FILE="${STATE_DIR}/player.pid"
LOCK_FILE="${STATE_DIR}/player.lock"
COOLDOWN_FILE="${STATE_DIR}/last_trigger_ms"
COOLDOWN_LOCK_FILE="${STATE_DIR}/cooldown.lock"

if [[ ! -f "${SOUND_FILE}" ]]; then
  echo "Notification file not found: ${SOUND_FILE}" >&2
  exit 1
fi

setup_host_prefix() {
  if [[ -n "${HOST_EXEC_RAW}" ]]; then
    # shellcheck disable=SC2206
    HOST_PREFIX=(${HOST_EXEC_RAW})
    return 0
  fi

  if [[ "${NOTIFY_PREFER_HOST:-1}" != "1" ]]; then
    return 0
  fi

  # Only auto-enable host bridge when actually sandboxed.
  if [[ -z "${NOTIFY_FORCE_HOST:-}" ]] && [[ ! -f "/.flatpak-info" ]]; then
    return 0
  fi

  if command -v flatpak-spawn >/dev/null 2>&1; then
    HOST_PREFIX=(flatpak-spawn --host)
    return 0
  fi

  if command -v host-spawn >/dev/null 2>&1; then
    HOST_PREFIX=(host-spawn)
    return 0
  fi
}

command_available() {
  local cmd="${1}"

  if [[ ${#HOST_PREFIX[@]} -eq 0 ]]; then
    command -v "${cmd}" >/dev/null 2>&1
    return $?
  fi

  case "${HOST_PREFIX[0]}" in
    flatpak-spawn)
      "${HOST_PREFIX[@]}" which "${cmd}" >/dev/null 2>&1
      return $?
      ;;
    host-spawn)
      "${HOST_PREFIX[@]}" which "${cmd}" >/dev/null 2>&1
      return $?
      ;;
    *)
      # Custom host exec wrappers may not support probing; attempt execution.
      return 0
      ;;
  esac
}

current_epoch_ms() {
  local now_ms
  now_ms="$(date +%s%3N 2>/dev/null || true)"
  if [[ "${now_ms}" =~ ^[0-9]+$ ]]; then
    echo "${now_ms}"
    return 0
  fi

  echo "$(( $(date +%s) * 1000 ))"
}

cooldown_allows_notification() {
  local cooldown_seconds="${NOTIFY_COOLDOWN_SECONDS:-1}"
  if ! [[ "${cooldown_seconds}" =~ ^[0-9]+$ ]]; then
    cooldown_seconds=1
  fi

  if (( cooldown_seconds <= 0 )); then
    return 0
  fi

  mkdir -p "${STATE_DIR}"

  local now_ms cooldown_ms
  now_ms="$(current_epoch_ms)"
  cooldown_ms=$(( cooldown_seconds * 1000 ))

  check_cooldown_and_stamp() {
    local last_ms elapsed_ms
    last_ms="$(cat "${COOLDOWN_FILE}" 2>/dev/null || true)"
    if [[ "${last_ms}" =~ ^[0-9]+$ ]]; then
      elapsed_ms=$(( now_ms - last_ms ))
      if (( elapsed_ms >= 0 && elapsed_ms < cooldown_ms )); then
        return 1
      fi
    fi

    echo "${now_ms}" > "${COOLDOWN_FILE}"
    return 0
  }

  if command -v flock >/dev/null 2>&1; then
    (
      flock -x 9
      check_cooldown_and_stamp
    ) 9>"${COOLDOWN_LOCK_FILE}"
    return $?
  fi

  check_cooldown_and_stamp
}

run_audio_command() {
  local timeout_seconds_raw timeout_seconds
  timeout_seconds_raw="${NOTIFY_PLAYER_TIMEOUT_SECONDS:-8}"
  if [[ "${timeout_seconds_raw}" =~ ^[0-9]+$ ]]; then
    timeout_seconds="${timeout_seconds_raw}"
  else
    timeout_seconds=8
  fi

  run_with_optional_timeout() {
    if (( timeout_seconds > 0 )) && command -v timeout >/dev/null 2>&1; then
      timeout -k 2 "${timeout_seconds}" "$@"
      return $?
    fi

    "$@"
  }

  run_with_stdio_policy() {
    # Some players (notably mpg123 on certain Linux setups) can crash when both
    # stdout/stderr are redirected to /dev/null. Allow callers to disable that.
    if [[ "${NOTIFY_REDIRECT_STDIO:-1}" == "0" ]]; then
      run_with_optional_timeout "$@"
      return $?
    fi

    run_with_optional_timeout "$@" >/dev/null 2>&1
  }

  start_background_player() {
    if [[ -f "${PID_FILE}" ]]; then
      local existing_pid
      existing_pid="$(cat "${PID_FILE}" 2>/dev/null || true)"
      if [[ -n "${existing_pid}" ]] && kill -0 "${existing_pid}" >/dev/null 2>&1; then
        return 0
      fi
    fi

    if (( timeout_seconds > 0 )) && command -v timeout >/dev/null 2>&1; then
      nohup timeout -k 2 "${timeout_seconds}" "$@" >/dev/null 2>&1 &
    else
      nohup "$@" >/dev/null 2>&1 &
    fi
    echo "$!" > "${PID_FILE}"
    return 0
  }

  # Default is background mode so the caller returns immediately.
  if [[ "${NOTIFY_BACKGROUND:-1}" == "1" ]]; then
    mkdir -p "${STATE_DIR}"

    # Default coalescing avoids many overlapping player instances on bursty events.
    if [[ "${NOTIFY_COALESCE:-1}" == "1" ]]; then
      if command -v flock >/dev/null 2>&1; then
        (
          flock -n 9 || exit 0
          start_background_player "$@"
        ) 9>"${LOCK_FILE}"
        return 0
      fi

      start_background_player "$@"
      return 0
    fi

    if (( timeout_seconds > 0 )) && command -v timeout >/dev/null 2>&1; then
      nohup timeout -k 2 "${timeout_seconds}" "$@" >/dev/null 2>&1 &
    else
      nohup "$@" >/dev/null 2>&1 &
    fi
    return 0
  fi

  run_with_stdio_policy "$@"
}

player_cmd_from_selection() {
  local selected_player="${1}"

  case "${selected_player}" in
    mpg123)
      PLAYER_CMD=(mpg123 -q)
      ;;
    paplay)
      PLAYER_CMD=(paplay)
      if [[ -n "${NOTIFY_PAPLAY_DEVICE:-}" ]]; then
        PLAYER_CMD+=(--device="${NOTIFY_PAPLAY_DEVICE}")
      fi
      ;;
    pw-play)
      PLAYER_CMD=(pw-play)
      if [[ -n "${NOTIFY_PW_TARGET:-}" ]]; then
        PLAYER_CMD+=(--target "${NOTIFY_PW_TARGET}")
      fi
      ;;
    ffplay)
      PLAYER_CMD=(ffplay -nodisp -autoexit -loglevel error)
      ;;
    mpv)
      PLAYER_CMD=(mpv --no-video --really-quiet)
      ;;
    cvlc)
      PLAYER_CMD=(cvlc --play-and-exit --intf dummy)
      ;;
    play)
      PLAYER_CMD=(play -q)
      ;;
    *)
      echo "Unsupported NOTIFY_PLAYER value: ${selected_player}" >&2
      return 1
      ;;
  esac
}

play_with_selected_player() {
  local selected_player="${1:-${PLAYER}}"
  local exec_cmd=()
  local min_playback_ms_raw min_playback_ms
  local start_ms end_ms elapsed_ms

  if ! player_cmd_from_selection "${selected_player}"; then
    return 1
  fi

  if ! command_available "${selected_player}"; then
    return 1
  fi

  exec_cmd=("${PLAYER_CMD[@]}" "${SOUND_FILE}")
  if [[ ${#HOST_PREFIX[@]} -gt 0 ]]; then
    exec_cmd=("${HOST_PREFIX[@]}" "${exec_cmd[@]}")
  fi

  min_playback_ms_raw="${NOTIFY_MIN_PLAYBACK_MS:-500}"
  if [[ "${min_playback_ms_raw}" =~ ^[0-9]+$ ]]; then
    min_playback_ms="${min_playback_ms_raw}"
  else
    min_playback_ms=500
  fi

  start_ms="$(current_epoch_ms)"
  if run_audio_command "${exec_cmd[@]}"; then
    end_ms="$(current_epoch_ms)"
    elapsed_ms=$(( end_ms - start_ms ))

    if [[ "${NOTIFY_BACKGROUND:-1}" != "1" ]] && (( min_playback_ms > 0 )) && (( elapsed_ms >= 0 )) && (( elapsed_ms < min_playback_ms )); then
      echo "Player '${selected_player}' exited too quickly (${elapsed_ms}ms); treating as failed playback." >&2
      return 1
    fi

    echo "PLAYBACK_OK:${selected_player}"
    return 0
  fi

  echo "Player '${selected_player}' failed to play notification audio." >&2
  return 1
}

play_with_player_candidates() {
  local seen=","
  local raw_candidates=()
  local candidate trimmed

  IFS=',' read -r -a raw_candidates <<< "${PLAYER_CANDIDATES_RAW}"

  for candidate in "${raw_candidates[@]}"; do
    trimmed="${candidate//[[:space:]]/}"
    if [[ -z "${trimmed}" ]]; then
      continue
    fi

    if [[ "${seen}" == *",${trimmed},"* ]]; then
      continue
    fi
    seen="${seen}${trimmed},"

    if play_with_selected_player "${trimmed}"; then
      return 0
    fi
  done

  return 1
}

play_with_desktop_default() {
  # Disabled by default to avoid opening media player windows.
  if [[ "${NOTIFY_ALLOW_DESKTOP_OPEN:-0}" != "1" ]]; then
    return 1
  fi

  if command_available gio; then
    local gio_cmd=(gio open "${SOUND_FILE}")
    if [[ ${#HOST_PREFIX[@]} -gt 0 ]]; then
      gio_cmd=("${HOST_PREFIX[@]}" "${gio_cmd[@]}")
    fi
    if run_audio_command "${gio_cmd[@]}"; then
      echo "PLAYBACK_OK:gio-open"
      return 0
    fi
  fi

  if command_available xdg-open; then
    local xdg_cmd=(xdg-open "${SOUND_FILE}")
    if [[ ${#HOST_PREFIX[@]} -gt 0 ]]; then
      xdg_cmd=("${HOST_PREFIX[@]}" "${xdg_cmd[@]}")
    fi
    if run_audio_command "${xdg_cmd[@]}"; then
      echo "PLAYBACK_OK:xdg-open"
      return 0
    fi
  fi

  return 1
}

describe_runtime_context() {
  if [[ ${#HOST_PREFIX[@]} -gt 0 ]]; then
    echo "Notification host bridge: ${HOST_PREFIX[*]}" >&2
    return 0
  fi

  if [[ -f "/.flatpak-info" ]]; then
    echo "Notification runtime appears sandboxed and no host bridge command is configured." >&2
    echo "Set NOTIFY_HOST_EXEC='flatpak-spawn --host' or install host-spawn for host playback." >&2
    return 0
  fi

  return 0
}

auto_install_player() {
  # Opt out with NOTIFY_AUTO_INSTALL=0
  if [[ "${NOTIFY_AUTO_INSTALL:-1}" != "1" ]]; then
    return 1
  fi

  local package_name=""
  run_with_privilege_noninteractive() {
    if [[ "${EUID}" == "0" ]]; then
      "$@"
      return $?
    fi

    if sudo -n true >/dev/null 2>&1; then
      sudo -n "$@"
      return $?
    fi

    return 1
  }

  run_with_privilege_interactive() {
    if [[ "${EUID}" == "0" ]]; then
      "$@"
      return $?
    fi

    if [[ -t 0 ]]; then
      sudo "$@"
      return $?
    fi

    return 1
  }

  case "${PLAYER}" in
    mpg123) package_name="mpg123" ;;
    paplay) package_name="pulseaudio-utils" ;;
    pw-play) package_name="pipewire-bin" ;;
    ffplay) package_name="ffmpeg" ;;
    mpv) package_name="mpv" ;;
    cvlc) package_name="vlc" ;;
    play) package_name="sox" ;;
    *) return 1 ;;
  esac

  if command -v "${PLAYER}" >/dev/null 2>&1; then
    return 0
  fi

  if command -v apt-get >/dev/null 2>&1; then
    run_with_privilege_noninteractive apt-get update -y >/dev/null 2>&1 || true
    run_with_privilege_noninteractive apt-get install -y "${package_name}" >/dev/null 2>&1 && return 0

    if [[ -t 0 ]]; then
      echo "Installing missing audio player package: ${package_name}" >&2
      run_with_privilege_interactive apt-get update -y >/dev/null && run_with_privilege_interactive apt-get install -y "${package_name}" >/dev/null && return 0
    fi
  fi

  if command -v dnf >/dev/null 2>&1; then
    run_with_privilege_noninteractive dnf install -y "${package_name}" >/dev/null 2>&1 && return 0

    if [[ -t 0 ]]; then
      echo "Installing missing audio player package: ${package_name}" >&2
      run_with_privilege_interactive dnf install -y "${package_name}" >/dev/null && return 0
    fi
  fi

  if command -v pacman >/dev/null 2>&1; then
    run_with_privilege_noninteractive pacman -Sy --noconfirm "${package_name}" >/dev/null 2>&1 && return 0

    if [[ -t 0 ]]; then
      echo "Installing missing audio player package: ${package_name}" >&2
      run_with_privilege_interactive pacman -Sy --noconfirm "${package_name}" >/dev/null && return 0
    fi
  fi

  if command -v zypper >/dev/null 2>&1; then
    run_with_privilege_noninteractive zypper --non-interactive install "${package_name}" >/dev/null 2>&1 && return 0

    if [[ -t 0 ]]; then
      echo "Installing missing audio player package: ${package_name}" >&2
      run_with_privilege_interactive zypper --non-interactive install "${package_name}" >/dev/null && return 0
    fi
  fi

  return 1
}

terminal_bell_fallback() {
  printf '\a' >&2 || true
  echo "Fell back to terminal bell (no working MP3 player found)." >&2
  echo "PLAYBACK_OK:terminal-bell"
}

if ! cooldown_allows_notification; then
  exit 0
fi

setup_host_prefix
describe_runtime_context

if play_with_player_candidates; then
  exit 0
fi

if play_with_desktop_default; then
  exit 0
fi

if ! command_available "${PLAYER}"; then
  if [[ ${#HOST_PREFIX[@]} -eq 0 ]] && auto_install_player && play_with_selected_player; then
    exit 0
  fi
fi

terminal_bell_fallback

if [[ "${NOTIFY_STRICT:-0}" == "1" ]]; then
  echo "Strict mode enabled; exiting with failure because MP3 playback was not available." >&2
  exit 1
fi

exit 0
