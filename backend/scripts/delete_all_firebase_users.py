#!/usr/bin/env python3
"""Delete all Firebase Authentication users (safe script).

This script connects to Firebase Admin SDK and deletes all users in the
project. It supports a `--dry-run` mode and requires an explicit `--force`
flag to perform destructive deletion.

Usage:
  # dry-run: show how many users would be deleted
  python backend/scripts/delete_all_firebase_users.py --credentials /path/to/serviceAccount.json --dry-run

  # perform deletion (irreversible)
  python backend/scripts/delete_all_firebase_users.py --credentials /path/to/serviceAccount.json --force

You can also set `GOOGLE_APPLICATION_CREDENTIALS` env var instead of passing
`--credentials`.
"""
from __future__ import annotations
import argparse
import sys
from typing import List

try:
    import firebase_admin
    from firebase_admin import auth, credentials
except Exception as e:
    print("Missing firebase_admin. Install with: pip install firebase-admin")
    raise


def init_firebase(cred_path: str | None) -> None:
    if firebase_admin._apps:
        return
    if cred_path:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        firebase_admin.initialize_app()


def gather_users() -> List[dict]:
    users = []
    for user in auth.list_users().iterate_all():
        users.append({"uid": user.uid, "email": user.email})
    return users


def chunked(iterable: List[str], size: int):
    for i in range(0, len(iterable), size):
        yield iterable[i : i + size]


def delete_users(uids: List[str]) -> None:
    # Firebase allows batch delete; handle results for logging
    result = auth.delete_users(uids)
    print(f"Deleted {result.success_count} users; {result.failure_count} failures")
    if result.failure_count:
        for err in result.errors:
            print(" -", err)


def main() -> int:
    p = argparse.ArgumentParser(description="Delete all Firebase Authentication users")
    p.add_argument("--credentials", help="Path to service account JSON (optional)")
    p.add_argument("--dry-run", action="store_true", help="Show how many users would be deleted")
    p.add_argument("--force", action="store_true", help="Actually delete users (irreversible)")
    p.add_argument("--batch-size", type=int, default=500, help="Number of users to delete per batch")

    args = p.parse_args()

    if not args.dry_run and not args.force:
        print("Safety: must pass --dry-run or --force. Use --dry-run first to inspect.")
        return 2

    try:
        init_firebase(args.credentials)
    except Exception as e:
        print("Failed to initialize Firebase Admin SDK:", e)
        return 3

    users = gather_users()
    total = len(users)
    print(f"Found {total} users in Firebase Auth")

    if args.dry_run:
        sample = users[:10]
        print("Sample users (first 10):")
        for u in sample:
            print(" -", u.get("email"), u.get("uid"))
        print("Run with --force to delete these users.")
        return 0

    # destructive path
    uids = [u["uid"] for u in users]
    if not uids:
        print("No users to delete.")
        return 0

    print(f"Deleting {len(uids)} users in batches of {args.batch_size}...")
    for chunk in chunked(uids, args.batch_size):
        try:
            delete_users(chunk)
        except Exception as e:
            print("Error deleting batch:", e)

    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
