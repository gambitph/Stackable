# Ship: branch, commit, push

Load only after ensure-quality ended **Ship readiness: ready** with a non-empty change set.
Completion: feature branch exists if needed; one commit (or commit set) contains the gated work; branch is pushed with upstream set; working tree clean for the shipped paths (aside from ignored files).

## Branch

1. Resolve **base** the same way ensure-quality pins its fixed-point base (tracking default → `origin/develop` → `origin/main` → `origin/master` → local equivalents), unless the user named a base.
2. If `HEAD` is on that default branch, create and check out a new branch before committing.
   - Name from intent when possible (`fix/…`, `feat/…`, `chore/…`); otherwise a short dated slug.
   - If already on a feature branch, keep it.
3. Call `SetActiveBranch` (or equivalent) when the environment expects branch metadata updates.

## Commit

Follow the repo's git commit protocol (status, staged+unstaged diff, recent log style). This skill *is* the user's request to commit the gated set.

1. Stage the gated changes - including quality-gate fixes still dirty in the worktree.
2. Do not stage secrets (`.env`, credentials, private keys). Warn and stop ship if those appear in the diff.
3. Draft a concise commit message from **Intent** (why, not a file list). Append one trailer line:

   ```
   Quality-gated: risk=<low|medium|high>; ship=ready.
   ```

4. Commit via HEREDOC. Never `--no-verify` / skip hooks unless the user explicitly ordered it.
5. If a pre-commit hook modifies files and the commit succeeds, amend only when the environment's amend rules allow (HEAD created by you this turn, not pushed yet); otherwise make a follow-up commit.
6. If the commit is rejected by a hook, fix and create a **new** commit - do not amend a failed commit.
7. Never add an agent co-author trailer.

If there is nothing left to commit after the gate (already committed and clean) but unpushed commits since base exist, skip creating an empty commit and continue to push/PR those commits - still require that ensure-quality covered that range.

## Push

```bash
git push -u origin HEAD
```

Request network / full permissions as the environment requires.
Do not force-push to `main` / `master` / `develop`.
Do not force-push at all unless the user explicitly requested it.

## Hand-off

After a successful push, build the PR with `reference/pr-body.md`.
