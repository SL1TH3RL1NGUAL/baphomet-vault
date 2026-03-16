#!/bin/bash
# GHOST-MIRROR: ENCRYPTED REPLICATION
# Objective: Commit Ghostnerve pulses to a hidden branch with GPG encryption.

set -euo pipefail

echo "🪞 Initiating Ghost-Mirror Replication..."

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_SRC="${REPO_ROOT}/03_THE_WITNESS/ghostnerve.log"
ENCRYPTED_LOG="${REPO_ROOT}/ghostnerve.log.gpg"
BRANCH_NAME="ghostnerve-memory"
GPG_RECIPIENT="${GHOST_MIRROR_GPG_RECIPIENT:-}"

if [[ -z "${GPG_RECIPIENT}" ]]; then
  echo "ERROR: GHOST_MIRROR_GPG_RECIPIENT not set."
  exit 1
fi

if [[ ! -f "${LOG_SRC}" ]]; then
  echo "WARN: No ghostnerve.log found at ${LOG_SRC}."
  exit 0
fi

cd "${REPO_ROOT}"

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

git show-ref --verify --quiet "refs/heads/${BRANCH_NAME}" \
  && git checkout "${BRANCH_NAME}" --quiet \
  || git checkout -b "${BRANCH_NAME}" --quiet

gpg --yes --batch --recipient "${GPG_RECIPIENT}" --output "${ENCRYPTED_LOG}" --encrypt "${LOG_SRC}"

sha256sum "${ENCRYPTED_LOG}" > "${ENCRYPTED_LOG}.sha256"

git add "${ENCRYPTED_LOG}" "${ENCRYPTED_LOG}.sha256"
git commit -m "PULSE: $(date +%s)" --quiet || echo "No changes to commit."

git push origin "${BRANCH_NAME}" --quiet

git checkout "${CURRENT_BRANCH}" --quiet

echo "✅ Replication Complete. Memory is Persistent."
