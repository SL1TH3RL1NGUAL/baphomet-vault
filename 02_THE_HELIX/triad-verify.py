#!/usr/bin/env python3
import json
import subprocess
import sys
from pathlib import Path
from datetime import datetime

REPO_ROOT = Path(__file__).resolve().parents[1]
GUARDIAN_KEYS_DIR = REPO_ROOT / "02_THE_HELIX" / "guardian-keys"
GHOSTNERVE_LOG = REPO_ROOT / "03_THE_WITNESS" / "ghostnerve.log"

def update_ghostnerve(event_type, status, detail=""):
    ts = datetime.utcnow().isoformat() + "Z"
    entry = {"ts": ts, "event": event_type, "status": status, "detail": detail}
    GHOSTNERVE_LOG.parent.mkdir(parents=True, exist_ok=True)
    with GHOSTNERVE_LOG.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")

def verify_with_ssh_keygen(payload: bytes, signature_file: Path, pubkey_file: Path) -> bool:
    cmd = [
        "ssh-keygen", "-Y", "verify",
        "-f", str(pubkey_file),
        "-I", "guardian",
        "-n", "fellowstar",
        "-s", str(signature_file),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    out, err = proc.communicate(input=payload)
    return proc.returncode == 0

def verify_guardian_signature(payload: str, signature_path: str, guardian_key_name: str):
    pubkey = GUARDIAN_KEYS_DIR / guardian_key_name
    sig = Path(signature_path)

    if not pubkey.exists():
        update_ghostnerve("AUTH_FAILURE", "SEVER", f"Missing key: {guardian_key_name}")
        return False

    if not sig.exists():
        update_ghostnerve("AUTH_FAILURE", "SEVER", f"Missing signature: {signature_path}")
        return False

    ok = verify_with_ssh_keygen(payload.encode("utf-8"), sig, pubkey)
    if ok:
        update_ghostnerve("CONSTITUTIONAL_UPGRADE", "SUCCEED", f"guardian={guardian_key_name}")
    else:
        update_ghostnerve("AUTH_FAILURE", "SEVER", f"guardian={guardian_key_name}")
    return ok

def main():
    if len(sys.argv) != 4:
        print("Usage: triad-verify.py <payload-file> <signature-file> <guardian-pubkey-filename>", file=sys.stderr)
        sys.exit(1)

    payload_file, signature_file, guardian_key_name = sys.argv[1:]
    payload = Path(payload_file).read_text(encoding="utf-8")

    ok = verify_guardian_signature(payload, signature_file, guardian_key_name)
    sys.exit(0 if ok else 1)

if __name__ == "__main__":
    main()
