# Findings taxonomy

Every stage emits zero or more findings.
Each finding has: `id` (stable in-run, e.g. `r1`, `t2`), `severity` (`error` | `warning` | `info`), `file` (path or `-`), `description`, and `action`.

## Actions

| Action | Meaning | Who decides |
| --- | --- | --- |
| `auto-fix` | Mechanical one-liner (or equally tiny local edit); safe to fix without asking | Agent, within the 2-round cap |
| `ask-user` | Challenges stated intent, changes product behavior, risk/correctness judgment, or needs a human call | User via HITL pause |
| `no-op` | Informational; nothing to change | Nobody |

## Classification rules

### `auto-fix` (mechanical one-liners only)

Mark **`auto-fix`** only when **all** of these hold:

- The fix is a **mechanical one-liner** (or equally tiny local edit), e.g. unused import, obvious typo, dead one-liner, stale comment contradicted by this diff, trivial call-site swap onto an **already existing** helper
- It does not change user-visible product behavior
- It does not touch permissions, schemas, public APIs, UX copy, or architecture
- It does not delete or rewrite tests, extract/deepen modules, or re-derive catalogues

### Never `auto-fix` (use `ask-user`)

Mark **`ask-user`** when any of these hold:

- Bugs, security issues, performance risks, or error-handling design
- The finding disputes a deliberate choice captured in intent (including removed required or added forbidden behavior)
- The fix would change product behavior, UX copy, permissions, schemas, or public APIs
- Speculative refactor, large rewrite, test deletion/rewrite, or anti-slop deepen (extract shared helper, collapse parallel registry, re-derive catalogues)
- Severity is high and the right fix is ambiguous

Anti-slop classification detail: `reference/anti-slop.md` (Classification hints).

### `no-op`

Mark **`no-op`** for style notes already out of scope, compliments, or context the user should see but not act on.

When unsure between `auto-fix` and `ask-user`, choose **`ask-user`**.

## Stage nuance

- **Review:** `auto-fix` is strictly mechanical one-liners; risk/correctness and intent findings always park for HITL. After any review fix, run the adversarial re-review in `stages/review.md`.
- **Test / lint / document:** still use mechanical/low-risk `auto-fix` within the 2-round cap when the stage file allows; behavior or intent changes remain `ask-user`.

## Severity hints

- `error` - must clear before `ready` (failing tests, blocking lint, broken contract, security footgun, intent contradiction that must not ship)
- `warning` - should clear; may become `ask-user` if the fix is judgmental
- `info` - usually `no-op`

Tooling failures (test red, linter red) are findings too - classify the *underlying* defect; the red command is evidence, not the taxonomy itself.
