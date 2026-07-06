#!/usr/bin/env bash
set -Eeuo pipefail

SERVICE_NAME="${1:-${SERVICE_NAME:-espanolo}}"
DB_MODE="${DB_MODE:-auto}" # auto, push, migrate, skip
RUN_SEED="${RUN_SEED:-0}" # 1 to run npm run db:seed after database sync

cd "$(dirname "${BASH_SOURCE[0]}")/.."

run() {
  printf "\n==> %s\n" "$*"
  "$@"
}

on_error() {
  printf "\nUpdate failed. Fix the command above, then rerun this script.\n" >&2
}
trap on_error ERR

if ! command -v git >/dev/null 2>&1; then
  printf "git is required but was not found.\n" >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  printf "npm is required but was not found.\n" >&2
  exit 1
fi

run git pull --ff-only
run npm install
run npm run db:generate

if [[ "$DB_MODE" == "auto" ]]; then
  migration_count="$(find prisma/migrations -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')"
  if [[ "$migration_count" == "0" ]]; then
    DB_MODE="push"
  else
    DB_MODE="migrate"
  fi
fi

case "$DB_MODE" in
  push)
    run npm run db:push
    ;;
  migrate)
    run npx prisma migrate deploy
    ;;
  skip)
    printf "\n==> Skipping database sync because DB_MODE=skip\n"
    ;;
  *)
    printf "Unsupported DB_MODE: %s. Use auto, push, migrate, or skip.\n" "$DB_MODE" >&2
    exit 1
    ;;
esac

if [[ "$RUN_SEED" == "1" ]]; then
  run npm run db:seed
fi

run npm run build

systemctl_cmd=(systemctl)
if [[ "${EUID:-$(id -u)}" -ne 0 ]]; then
  systemctl_cmd=(sudo systemctl)
fi

run "${systemctl_cmd[@]}" restart "$SERVICE_NAME"
run "${systemctl_cmd[@]}" --no-pager --full status "$SERVICE_NAME"

printf "\nUpdate complete for service: %s\n" "$SERVICE_NAME"
