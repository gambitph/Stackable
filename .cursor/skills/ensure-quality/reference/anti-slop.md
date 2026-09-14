# Anti-slop baseline

Stable gate against common AI-generated maintainability failures.
Applies on every review, even when the repo documents nothing.
**Repo docs override** this baseline where they conflict; discovery must still load project anti-slop / maintainability rules and checklists and treat those as hard Standards.

Goal: one place to change a behaviour; catalogues and heuristics stay single-sourced; no phantom advertised capabilities.

## Checks (apply every finding to the diff)

### 1. Before you paste

If the change clones a near-identical block that already exists (registration lists, boilerplate guards, label maps, switch cases, clear/reset loops), require extract-or-reuse of a shared helper **before** the nth copy.
Flag new copy-paste helpers that sit beside an existing one doing the same job.

### 2. Catalogues stay derived

Identity and policy for tools/commands/abilities/features live in **one** authoritative registration or catalog path.
Sibling lists (names, flags, progress labels, switch cases, stubs) must be **derived** from that source, or updated in one documented checklist pass - never hand-synced "for convenience."

### 3. Ship or silence

Do not name a tool, command, ability, route, or feature in prompts, playbooks, docs, or error copy unless it is registered and executable on the path you advertise.
**Phantom names** (advertised but missing, or registered but unreachable) are errors.

### 4. Deepen, don't layer

Prefer putting new behaviour into an existing module cluster / seam when one fits.
Flag a second public registry, twin API, parallel state dictionary, or shadow orchestration path added without an explicit extract.
Prefer extracting a coherent cluster over growing a known god-file with another pasted case.
Depth means a small interface with leverage - not a new shallow wrapper around the same complexity (see deep-module intuition below).

### 5. Single source for shared heuristics

Heuristics duplicated across languages or tiers (e.g. placeholder detection, optimistic UI labels vs server progress text) need one definition of truth: shared data, generated copy, or a documented sync backed by a test.
Flag a second hard-coded copy of the same rule.

### 6. Completion surfaces

When the diff adds or renames a catalogued identity, prompt route, public tool, or session/UI field that other lists must know about:

- every obligated list/map/prompt/playbook is updated
- no phantom names remain
- no new duplicate helper was introduced beside an existing one
- any project checklist for that change type is completed (discover these)

### 7. Scope and speculative slop

Flag from the diff (not from taste alone):

- Speculative generality - abstractions, parameters, or hooks the intent/spec does not need
- Drive-by refactors unrelated to intent
- Comments/docs that narrate what the code already says, or TODOs that paper over unfinished behaviour
- New dependencies when the repo already has an equivalent
- Tests that only grep source strings (also enforced in the test stage)

### 8. Quality bar (judgement)

Prefer simplicity, robustness, and long-term maintainability over "shipped faster" shortcuts that create parallel structure.
When the diff touches a clearly broken lint/test flake adjacent to the change, fixing it is in-scope for this gate (classify per `reference/findings.md`).

## Deep-module intuition (light)

Use only as a lens for anti-layering findings - not a full redesign mandate inside this gate:

- **Deep** - lots of behaviour behind a small interface at a clear seam
- **Shallow** - interface nearly as complex as the implementation; pass-through wrappers
- Prefer deepening an existing seam over adding another shallow module beside it
- Full redesign belongs to architecture skills / HITL, not silent auto-fix

## Classification hints

Review (and all stages) follow mechanical one-liner `auto-fix` in `reference/findings.md`.
Default to `ask-user` for anti-slop unless the edit is truly a one-liner.

| Pattern | Typical action |
| --- | --- |
| Phantom name in prompt/docs; one-line remove of a stray mention | `auto-fix` only if a pure one-liner and intent-aligned; else `ask-user` |
| Phantom name needing catalog wire-up or multi-file sync | `ask-user` |
| Hand-synced sibling list clearly derivable | `ask-user` (re-derive / checklist pass is not a one-liner) |
| New parallel registry / twin API / shadow state store | `ask-user` (product/architecture) |
| nth copy-paste of existing boilerplate | `ask-user` if extract is needed; `auto-fix` only for a trivial call-site swap onto an **already existing** helper |
| Speculative abstraction unused by intent | `ask-user` (even if deletion looks clean) |
| Source-grep-only test added in diff | flag in review; rewrite usually `ask-user` in test stage |

When unsure, choose **`ask-user`**.
