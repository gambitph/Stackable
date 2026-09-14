---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

## Steps

1. **Orient** — Read the issue/task and the owning `src/**/CONTRACT.md` (and PRD if linked). Done when you can name the seam this change belongs in.

2. **Sibling first** — Search the nearest module/file that already does the same kind of thing. Deepen that seam; extract a shared helper before pasting the nth clone. Done when you know the target file(s) and are not inventing a parallel list, registry, or AJAX twin.

3. **Ability surface?** — If the change registers, renames, removes, or names an ability in prompts/playbooks/UI, open [`docs/agents/ability-checklist.md`](../../../docs/agents/ability-checklist.md) and complete every applicable item before coding further.

4. **Build with /tdd** where possible, at pre-agreed seams. Run the focused PHPUnit file (or Playwright module spec) after each vertical slice.

5. **Finish** — Run the full test suite once (`composer test` / `npm test` as appropriate). Then `/code-review` against the issue or spec. Commit to the current branch when the user asked for a commit (or when this skill’s commit step applies).

## Done

Applicable ability-checklist boxes are checked; focused then full tests are green; code-review has been run.
