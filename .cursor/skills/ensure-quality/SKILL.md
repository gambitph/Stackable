---
name: ensure-quality
description: >-
  Local quality gate for the current worktree: review for risk/correctness
  (break, leak, undo intent), standards, spec, and anti-slop; then test,
  document, lint. Mechanical one-liner auto-fix and HITL for ask-user
  findings; ship-readiness summary.
  Use when the user asks to ensure quality, run the quality gate, validate before
  commit, or gate changes; after finishing substantive or AI-generated code
  changes; and always before the agent commits.
---

# Ensure quality

Inner-loop quality gate: **risk/correctness** review plus **anti-AI-slop**.
Asks whether the change will **break, leak, or silently undo what the user wanted**, and catches parallel structure, hand-synced catalogues, phantom names, and other common agent failure modes early.
Moves review, test, docs, and lint closer to the work before it leaves the machine.
No daemon, no second worktree, no push/PR - this skill *is* the gate.

Self-contained: everything needed lives under this skill folder.
Project-agnostic: discover how *this* repo tests, lints, documents, and states maintainability rules - do not assume a stack.

**Stages (order):** review → test → document → lint.
Load each stage file only when that stage runs.
Load `reference/discover.md` once during preconditions.
Anti-slop baseline: `reference/anti-slop.md` (always on during review; repo rules override on conflict).

## When to run

Fire this skill when any of these hold:

- The user asks to ensure quality / validate / gate / check before commit.
- You just finished substantive source changes (feature, fix, refactor).
- You are about to create a git commit.

Skip auto-invoke for pure Q&A, exploration with no edits, or when the user said to keep iterating without gating.

## Preconditions

1. **Synthesize intent.** Capture what the user set out to accomplish - goal, constraints, tradeoffs, ruled-in/out approaches - in their terms, enriched with decisions you made while working. A thin "fixed stuff" line is not enough; rewrite from conversation context first. This intent is **authoritative acceptance criteria** for the review stage.
2. **Discover the project.** Follow `reference/discover.md`. Record the chosen test commands, lint commands, standards sources, anti-slop / maintainability docs, checklists, and doc surfaces for this run.
3. **Pin the fixed point.** Default: merge-base of the current `HEAD` (and dirty worktree) against the first existing of: upstream tracking remote's default branch, then `origin/develop`, `origin/main`, `origin/master`, then local `develop` / `main` / `master`. Honor an explicit user override (`since abc123`, `origin/main`, …). Confirm the ref resolves.
4. **Scope the diff.** Include committed commits since the fixed point *and* uncommitted/staged work. Warn if on a default branch; still proceed.
5. **Skip flags.** Run all four stages unless the user explicitly skips one (`skip lint`, `lint only`, …). Auto-invoke never skips.

Completion: intent written, discovery recorded, fixed point named, diff non-empty (or report `ready` with nothing to gate and stop).

## Pipeline loop

For each stage in order:

1. Read `stages/<stage>.md` and run it.
2. Collect **findings** using the taxonomy in `reference/findings.md`.
3. **Auto-fix** every `auto-fix` finding without asking, then re-run the stage. Cap at **2** auto-fix rounds for that stage; leftover findings escalate to HITL.
   - **Review stage:** `auto-fix` is **mechanical one-liners only**. After any review fix, follow the root-cause fixer rules and **adversarial re-review** in `stages/review.md` (treat fixer output as untrusted new code).
   - **Test / document / lint:** mechanical/low-risk auto-fix as each stage file allows.
4. If any `ask-user` findings remain, **pause** - see [HITL pause](#hitl-pause). Do not start the next stage until the pause resolves.
5. `no-op` findings are reported only; nothing to do.
6. If the stage stays red after rounds / declined fixes, go to [Blocked](#blocked).

Leave all quality fixes **uncommitted** unless the user already asked you to commit or ship.

### HITL pause

Batch every current-stage `ask-user` finding in one message.
Present each like a grill round - question, options, recommendation - then wait.
When review recorded `risk_level: high`, prefer recommending careful `fix` over casual `approve`/`skip`.

```
⏸ **Quality gate - <stage>** (<n> ask-user findings)

❓ **F1** - **<short title>**: <verbatim finding: file, description, why it challenges intent or product behavior>

Options:
- **fix** - apply a fix (optionally with your guidance)
- **approve** - accept as-is and continue
- **skip** - drop this finding for this run
- **abort** - stop the whole gate

➡️ <your recommended option and one-line why>
```

Translate the user's answers into actions, apply agreed fixes, re-run the stage, then continue.
For review-stage fixes agreed in HITL, still apply fixer discipline and adversarial re-review from `stages/review.md`.
Do not paraphrase away finding detail.
Do not continue past unresolved `ask-user` findings.

### Blocked

Stop the pipeline.
Leave fixes dirty.
Emit the [Summary](#summary) with **Ship readiness: blocked** and the remaining findings.
Do not commit.
Do not claim green.
Do not silently skip the failing stage.

## Summary

Always end a completed or blocked run with this fixed brief (this order):

1. **Intent** - short paragraph
2. **Risk** - Low / Med / High + one sentence why (use the review-stage risk assessment when review ran)
3. **Diff scope** - fixed point → worktree; key files
4. **Findings** - counts by stage; call out risk-lens and anti-slop hits; auto-fixed vs HITL vs accepted vs remaining
5. **Tests run** - commands + pass/fail; note skipped suites and why
6. **Docs** - updated / checked / none needed
7. **Lint** - commands + result
8. **Ship readiness** - `ready` or `blocked` + what's left
9. **Uncommitted fix set** - bullets if any quality fixes were applied
