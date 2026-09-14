# Documentation system: glossary / architecture / ADR / how-it-works

## Status

Accepted

## Context

Stackable's behaviour lives in a finished free tree plus a mounted premium tree.
Agents and humans need a glossary for ubiquitous language, an architecture map for finding subsystems, ADRs for hard-to-reverse trade-offs, and optional how-it-works notes that cannot invent product law.
The PRD / contract / how-it-works / CONTEXT / ADR ladder fits; Stackable starts with CONTEXT, architecture, and ADRs, and may add product PRDs and colocated `CONTRACT.md` files as areas are documented.

## Decision

We split docs as follows:

| Kind | Location | Wins when |
| --- | --- | --- |
| **Product PRD** (optional, add when documenting behaviour) | `docs/prd/*.md` (free) and `pro__premium_only/docs/prd/*.md` (premium-owned) | Code disagrees with intended product behaviour |
| **Subsystem contract** (optional) | Colocated `CONTRACT.md` at the deep-module ownership root | Code violates a must-guarantee interface |
| **How-it-works** | Colocated `*.md` next to code | Explaining current machinery (must not invent product law) |
| **Glossary** | Root [`CONTEXT.md`](../../CONTEXT.md) | Naming / ubiquitous language |
| **ADRs** | [`docs/adr/`](./) | Hard-to-reverse trade-offs |
| **Architecture map** | [`docs/architecture.md`](../architecture.md) | Finding the right subsystem |

Rules:

1. When code and docs disagree, **PRD and contract win** when they exist; otherwise ADR + architecture + shipped tests guide intent.
2. How-it-works must not invent new product law; treat gaps as bugs or open issues.
3. New narrative product docs outside this list are forbidden.
   Absorb into a PRD/contract/ADR, or do not write them.
4. Changing a deep-module **interface** requires updating the matching docs and tests in the same change.
5. Room-for-improvement refactors that deepen modules without changing product promises belong in GitHub issues, not as frozen "keep the mess" law.

## Consequences

- Agents load [`AGENTS.md`](../../AGENTS.md) and [`CONTEXT.md`](../../CONTEXT.md) before changing behaviour.
- Free Directory packaging stays free of premium PRD ownership; premium docs travel with `pro__premium_only/`.
- Existing notes (e.g. `src/dynamic-breakpoints.md`, `e2e/readme.md`) are how-it-works or harness docs under this ladder.
