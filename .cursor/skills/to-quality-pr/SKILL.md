---
name: to-quality-pr
description: >-
  Quality-gated ship: run ensure-quality, then commit dirty gated work and open
  a triage PR whose body is the gate summary (LOW_RISK_MERGE / MEDIUM_REVIEW /
  HIGH_HOLD). Guardrail against AI slop leaving the machine.
  Use when the user asks to to-quality-pr, quality PR, gate and PR, ship a PR,
  or open a PR after changes; after finishing substantive or AI-generated work
  when the next step is a pull request; prefer this over committing or opening
  a PR without a quality gate.
---

# To quality PR

Ship guardrail: **gate first, then PR**.
Runs [`ensure-quality`](../ensure-quality/SKILL.md) to completion, then commits the gated worktree and opens a pull request whose description is the gate output in a **triage-first** format.
Reviewers should decide merge-now vs inspect-first from the PR header alone.

Does not re-implement the gate.
Anti-slop / review / test / docs / lint live only in ensure-quality.

**Stages (order):** ensure-quality → ship (branch → commit → push → PR).
Load `reference/ship.md` and `reference/pr-body.md` only when ship runs.

## When to run

Fire this skill when any of these hold:

- The user asks for to-quality-pr / quality PR / gate and PR / ship a PR / open a PR after changes.
- You finished substantive or AI-generated source changes and the natural next step is a pull request.
- You would otherwise commit and open a PR without a quality gate.

Prefer **ensure-quality alone** when the user wants a local gate only (no commit, no PR).
Skip auto-invoke for pure Q&A, exploration with no edits, or when the user said to keep iterating without shipping.

## Preconditions

1. **Synthesize intent** the same way ensure-quality requires - authoritative acceptance criteria for the gate.
2. **Confirm ship target.** Record base branch (same default resolution as ensure-quality's fixed-point base) and whether the user named a PR title or branch.
3. **Dirty scope.** Note that ship will include *all* work ensure-quality gated (committed-since-fixed-point plus unstaged/staged fixes the gate applied).

Completion: intent written; ship target named; then enter the pipeline.

## Pipeline

### 1. Ensure quality

Read and execute [`.cursor/skills/ensure-quality/SKILL.md`](../ensure-quality/SKILL.md) fully for this worktree.
Honor its HITL pauses; do not ship past unresolved `ask-user` findings.
Capture its [Summary](../ensure-quality/SKILL.md#summary) fields verbatim for the PR body - do not invent a second risk score.

If Summary **Ship readiness** is `blocked` (or the gate aborts): stop.
Leave the worktree dirty.
Emit a short blocked report (intent, risk, remaining findings).
Do not commit.
Do not push.
Do not open a PR.

If the gate reports `ready` with an empty diff (nothing to gate): stop and say so - no empty PR.

### 2. Ship

Only when ensure-quality ended **Ship readiness: ready** with a non-empty gated change set.

1. Read `reference/ship.md` and follow it (branch, commit, push).
2. Read `reference/pr-body.md`, map Summary → triage verdict + body, open the PR.
3. Return the PR URL and the triage verdict to the user.

Completion: PR URL exists (or ship blocked with a concrete git/`gh` error); verdict stated; worktree clean relative to the pushed commit unless the user forbade commit.

## Triage verdict (summary)

Derived in `reference/pr-body.md` from ensure-quality **Risk** (+ caution signal):

| Verdict | Meaning for reviewers |
| --- | --- |
| `LOW_RISK_MERGE` | Skim intent + diffstat; merge if CI green |
| `MEDIUM_REVIEW` | Read **Caution** and linked hunks before merge |
| `HIGH_HOLD` | Do not merge until Caution is checked; open as **draft** unless the user already approved shipping high risk |

Empty **Caution** on Medium or High is a skill failure - rewrite before `gh pr create`.
