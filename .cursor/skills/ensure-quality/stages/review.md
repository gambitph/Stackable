# Stage: review

Completion: every Risk, Spec, Standards, and anti-slop finding classified; review `auto-fix` limited to mechanical one-liners (≤2 rounds) or escalated; adversarial re-review of fixer output done; no unresolved `ask-user` left (or pipeline blocked); risk level recorded.

## Four lenses

Review the pinned fixed point (three-dot committed diff + dirty worktree) on four lenses.
Primary question: **will this break, leak, or silently undo what the user wanted?**

Prefer parallel sub-agents so lenses do not pollute each other, then classify into findings (`r1`, `r2`, …) via `reference/findings.md`:

1. **Risk / correctness** (primary)
2. **Spec / intent conformance**
3. **Standards + anti-slop + smells**

Paste into any sub-agent the full text it needs from this skill - sub-agents cannot see sibling files unless you include them.

Do a **full review pass** before returning.
Do not stop after the first valid finding.
Continue until you have enumerated all material issues you can substantiate in the changed code.

### Risk / correctness

Focus findings on risks introduced by changed code.
Inspect surrounding code, call sites, shared helpers, tests, and invariants when needed to understand root cause.

Hunt for:

- Bugs and incorrect edge cases
- Security issues (authz gaps, secret leakage, unsafe input handling)
- Performance regressions
- Breaking changes
- Insufficient error handling

Also:

- Anchor every finding to a specific file and one-indexed line when possible
- Be concise and actionable - no generic advice like "add more tests"
- Only comment on things that genuinely matter
- Do **not** report styling, formatting, linting, compilation, or type-checking issues (lint stage owns those)
- Do **not** run the full test or lint suites during review (later stages own those)

**Simplification** means reducing complexity through non-functional refactoring (deduplication, clearer control flow).
It does **not** mean removing features, changing product behavior, or stripping intentional user-facing output.

**Durable fix vs containment:**

- Determine from intent and evidence whether a bug-fix claims a durable fix or explicitly authorized short-term containment
- For a claimed durable fix, reconstruct the failing sequence and required invariant; ask whether the same failure remains reachable via sibling paths or shared state
- When source evidence proves the failure remains reachable, report the concrete path and recommend the earliest shared boundary that would make the invariant hold - do not demand a redesign from code shape or duplication alone
- Do not block explicitly authorized honest containment merely because a later durable fix is possible
- Do not expand user scope or turn optional broader improvements into blockers

### Spec / intent conformance

Locate the originating spec in this order:

1. Issue/PR references in commit messages - fetch if the environment allows
2. A path the user passed
3. Spec/PRD/ticket files under common docs locations matching the branch or feature
4. Else use **intent** as the spec source and say so

The intent synthesized in preconditions is **authoritative acceptance criteria** for this run (not a soft hint).

Report:

- (a) requirements missing or partial
- (b) behaviour in the diff that wasn't asked for (scope creep)
- (c) requirements that look implemented but wrong
- (d) **intent contradictions**: the change removes or omits source-verifiable behavior marked required, or adds behavior marked forbidden

Quote the spec/intent line for each finding.
Intent contradictions and product-behavior disputes are always `ask-user` - never `auto-fix`.
Scope creep that is also speculative slop may appear on both Spec and anti-slop - emit one finding, note both lenses.

### Standards + anti-slop

Sources (all of):

1. Standards / maintainability / anti-slop paths from discovery (project wins on conflict)
2. Full anti-slop baseline in `reference/anti-slop.md`
3. Full smell baseline in `reference/smells.md`

Report, per file/hunk where relevant:

- (a) every place the diff violates a documented project standard - cite source path + rule
- (b) every anti-slop baseline hit - name the check (e.g. "Ship or silence", "Catalogues stay derived") and quote the hunk
- (c) any Fowler smell from the baseline - name it and quote the hunk

Documented project rules and anti-slop **ship-or-silence / phantom / parallel-registry** hits can be hard violations.
Baseline smells and deep-module intuition are judgement calls.
Skip anything the lint stage will enforce.

### Reviewer test-quality action

Flag every **newly added** source-content-only test assertion in the accepted change's scope (see the test-quality rule in `stages/test.md` and `reference/anti-slop.md`).
Require remove or semantic rewrite of same-pattern tests encountered directly in that scope.
Do not turn an ordinary change into an unrelated repository-wide test cleanup.
Classification of rewrites usually lands in the test stage; review may emit the finding and hand off.

### Completion surfaces

If discovery found a checklist for this kind of change (ability/tool catalog, API surface, agent docs), run it against the diff before leaving review.
Missing checklist items → findings.

## Project hotspots

After discovery, prefer concrete findings over essay commentary wherever the project's own docs call out invariants (boundaries, catalogs, security, persistence, public APIs).
Do not invent hotspots the repo never stated - the anti-slop baseline already covers the generic patterns.

## Risk assessment

After listing all findings, set:

- `risk_level`: `low` | `medium` | `high`
- `risk_rationale`: one sentence why

Guidance:

- **low** - well-bounded, mostly cosmetic, or straightforward with little ambiguity
- **medium** - room to improve, but safe to proceed with concerns as follow-ups / HITL
- **high** - should not ship without explicit human approval; fundamental, risky, ambiguous, or strong negative signals

This assessment feeds Summary **Risk**.
When `high`, prefer recommending `fix` or careful review over `approve`/`skip` in HITL.

## Fix loop

Review-stage `auto-fix` is **mechanical one-liners only** (see `reference/findings.md`).
Bugs, security, behavior, intent conflicts, and non-trivial anti-slop always go through HITL.

### When applying agreed or auto-fix review fixes

1. Double-check each finding is still legitimate against the current code
2. Prefer the smallest correct **root-cause** fix within the changed area over patching only the reported line
3. **Fix forward** - do not delete or revert intentional author code to silence a finding; add validation, handle edge cases, or tighten logic instead. Only reintroduce a small amount of previously deleted logic when that is the smallest reasonable correctness/security fix
4. Apply all intended fixes first; do not interleave full-suite verification between individual fixes
5. After fixes, run one **focused** verification limited to the touched package, file, or test - not the complete repository test or lint suite (later stages own those)
6. Do not add comments that only narrate the fix

### Adversarial re-review after fixes

Treat fixer edits (and any same-round test changes) as **unreviewed new code**, not a settled resolution of the findings that prompted them.

- Prior findings and fix summaries are claims, not evidence
- Verify each claimed fix against the current code
- Independently judge whether behavior the fix introduced is correct - not merely whether it implements what was prescribed
- A test added or changed in the same fix round as the code it exercises is part of that round's claim, not independent proof
- Re-run Risk + Spec (+ Standards/anti-slop on touched hunks); full four lenses again only if the fix was broad
- Escalate leftovers and all `ask-user` items through the HITL pause in `SKILL.md`

Deepening or removing a parallel registry is almost never silent auto-fix - use HITL.
