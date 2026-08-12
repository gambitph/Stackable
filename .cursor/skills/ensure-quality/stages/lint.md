# Stage: lint

Completion: required lint commands green (or remaining issues classified and resolved / blocked).

## What to run

Run the lint/format commands from discovery for languages the diff touches.
Prefer check-first; apply autofix only when mechanical and scoped to touched files; re-check after.

If discovery found nothing for a touched language, record that gap - do not invent a linter the repo never configured.

Run advisory tools from discovery when available; if missing, note `not run` - do not block solely for absent advisory tooling.

## Findings

Lint violations → findings (`l1`, …), almost always `auto-fix` when a fixer or local edit clears them.
Rule-disable debates, large suppressions, or intentional style exceptions → `ask-user`.

## Fix loop

Prefer mechanical fixers, then hand-fix leftovers.
Re-run the same lint commands after fixes (2-round cap).
