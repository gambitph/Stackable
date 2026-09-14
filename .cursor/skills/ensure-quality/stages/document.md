# Stage: document

Completion: every doc surface this diff obligates is updated or explicitly marked N/A; no drive-by doc novels.

## Change-driven only

Using the doc surfaces from discovery, update **only** what the diff forces:

- Public API / subsystem guarantees → contracts or architecture docs the project uses
- Architectural decisions that shipped → ADR (or equivalent) only when a real decision landed
- Agent/process entry points → `AGENTS.md` / `CLAUDE.md` / agent docs when those changed
- Checklists the project requires for this kind of change → run them and sync named surfaces
- Domain glossary → only if ubiquitous language actually changed

Skip:

- Hand-editing files marked auto-generated (e.g. many `CHANGELOG` pipelines)
- Rewriting how-it-works notes that already match the new code
- Whole-repo doc sweeps

Follow the project's documented conflict rule when present.
Otherwise do not invent product law - fix stale implementation docs or escalate.

Match the repo's Markdown / prose conventions when editing docs.

## Findings

Stale or missing obligated docs → findings (`d1`, …).
Obvious one-line sync contradicted by this diff → `auto-fix`.
New ADR, product-facing copy, or ambiguous contract changes → `ask-user`.

## Fix loop

Apply `auto-fix` doc edits in the worktree.
HITL for `ask-user`.
Re-check the obligated paths after edits.
