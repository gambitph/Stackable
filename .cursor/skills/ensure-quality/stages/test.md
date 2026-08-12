# Stage: test

Completion: required suites green, or remaining failures classified and resolved via auto-fix / HITL / blocked.

## What to run

Use the **baseline** and **extended** commands chosen in `reference/discover.md`.

- Always run baseline when discovered.
- Run extended when discovery rules say so (UI/e2e/harness touched, or intent/user asks).
- Prefer a targeted subset of an extended suite when the blast radius is clear; full suite when unsure.
- Record every skipped suite and why in the summary.

If no tests are discovered, do not invent a stack - note it and continue unless repo docs require coverage for this kind of change (`ask-user`).

## Test-quality rule (anti-slop)

This is the test-stage half of the anti-slop gate (`reference/anti-slop.md`).
The review stage also flags **newly added** source-grep-only tests in the changed scope; this stage owns rewrite/fix of those findings.

Never add a test whose only evidence is that it opens, reads, greps, parses, or snapshots implementation source and finds or omits particular strings, tokens, function names, prompt phrases, or incidental snapshots.
That does not prove behavior - matching text can be dead code, and a behaviour-preserving refactor can change it.

Instead execute a public or executable seam and assert observable behavior, state, output, side effects, or failure modes.
For declarative artifacts (workflow YAML, JSON, generated config), invoke the real consumer or assert a typed/normalized semantic model - not a raw substring over the file.

Reading a file is legitimate when the file *is* the owned contract (generated output, serialized protocol, intentional snapshot).
Name that contract.

For a regression, reproduce the failure when feasible: red before the fix, green after.

Obey any stricter testing policy the repo documents.
Catalog/phantom guard tests the project already owns are real contracts - keep them green; do not replace them with weaker source greps.

## Findings

Failing tests → findings (`t1`, …).
Missing coverage for a behavior this diff introduces → finding; classify `auto-fix` only when a small seam-level test is obvious and intent agrees, else `ask-user`.
Slop tests introduced in the diff (source-grep only) → finding; prefer rewriting to a behavior assertion (`ask-user` if non-trivial).

## Fix loop

Fix failing tests or obvious regressions under `auto-fix` when the production fix is clear and mechanical.
Behavior changes to make a test pass that would alter product intent → `ask-user`.
Re-run the same commands after fixes (still within the 2-round cap).
