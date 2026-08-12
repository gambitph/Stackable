---
name: explain-codebase-concept
description: Onboard to how one Ahentic concept, feature, or subsystem is wired — chat summary plus visual HTML walkthrough (optional durable copy under docs/walkthroughs/).
disable-model-invocation: true
---

# Explain Codebase Concept

Onboard a **repo / Ahentic beginner** (stack-literate: WP/JS assumed) to **one** concept, feature, or subsystem so they can contribute — extend, fix bugs, or add related behavior — without inventing a second architecture doc.

**Deliverables (every run):** chat summary **and** a self-contained HTML walkthrough (Tailwind + Mermaid).  
**Authority:** compose and cite the doc ladder + live code. PRD / CONTRACT win on disagreement. Flag drift; **offer** doc fixes — do not auto-write product law.  
**Not this skill:** deepening/refactor candidates (`improve-codebase-architecture`), bug hunts (`diagnosing-bugs`), or a whole-product tour (point at `docs/architecture.md` and offer a menu of slices).

See [HTML-REPORT.md](HTML-REPORT.md) for the report scaffold and section rules. Human index: [`docs/agents/explain-concept.md`](../../../docs/agents/explain-concept.md).

## Process

### 1. Scope

**Done when:** one coherent slice is named in a single sentence (concept / flow / subsystem), or the user picked from a short menu.

- If the ask maps cleanly to `CONTEXT.md`, `docs/architecture.md`, or a `CONTRACT.md` → state the assumed scope and proceed.
- If several slices fit → offer a **short menu** (A / B / C), not a full grill.
- If they ask to “explain all of Ahentic” → point at [`docs/architecture.md`](../../../docs/architecture.md); offer 3–5 high-value follow-on concepts. Do not generate a mega-walkthrough.

Normalize subsystem / filename asks into the **runtime path that makes the concept real** (sidebar → REST → orchestrator → …), not a folder dump.

### 2. Explore

**Done when:** glossary terms for the slice are loaded, the relevant CONTRACT + how-it-works are read, the live path is traced, and any doc↔code drift is noted.

1. **Docs-first ladder** (skip missing files silently): `CONTEXT.md` → `docs/architecture.md` → relevant `src/**/CONTRACT.md` + colocated how-it-works → PRD/ADR only if the slice is about intended behavior or a recorded trade-off.
2. **Code trace** — use the Agent tool with `subagent_type=Explore` to follow the runtime path end-to-end. Neighbors that are not load-bearing stay **black boxes** with pointers to their CONTRACT / how-it-works.
3. Collect primary files and key symbols for the Cast and Step-through (prefer a tight set over exhaustiveness).
4. Note contribution hooks: usual touch path, ability-checklist / tests / catalogues that must stay in sync when this slice changes.

Use **CONTEXT.md** vocabulary for domain names. Use codebase-design terms (`module`, `seam`, `interface`, …) **only** in Neighbors / Change map when they help a contributor locate a change. Keep ELI5 in plain English.

### 3. Write the HTML walkthrough

**Done when:** the file exists, opens in the browser, and contains all nine mandatory sections in order (see [HTML-REPORT.md](HTML-REPORT.md)).

1. Resolve temp dir from `$TMPDIR`, else `/tmp` (or `%TEMP%` on Windows).
2. Write `$TMPDIR/concept-walkthrough-<slug>-<timestamp>.html` (slug from the concept name; kebab-case).
3. Open it: `open <path>` (macOS), `xdg-open <path>` (Linux), `start <path>` (Windows).
4. Tell the user the absolute path.

Empty sections still appear as a one-liner (e.g. “No doc drift found”) so the shape stays recognizable.

### 4. Chat handoff

**Done when:** the user has a short summary in-thread and clear next offers.

In chat (≈5–8 lines):

- What the concept is (one sentence)
- The runtime path in plain words
- Where to look first (2–4 primary files)
- How you’d usually change it (one sentence)
- Absolute path to the HTML file

Then **offer**:

- (a) zoom a black-boxed neighbor into its own walkthrough  
- (b) walk a related concept  
- (c) fix doc drift (if any were listed)  
- (d) **save a durable copy** under `docs/walkthroughs/` for humans (see below)

### 5. Durable docs (optional)

**Done when:** either the user declined, or `docs/walkthroughs/<slug>.html` is written, the folder README index lists it, and the HTML banner states it is pedagogical — not product law.

Default output stays in temp. When the user asks to keep / commit / add as docs:

1. Write (or refresh) `docs/walkthroughs/<slug>.html` with the **same** mandatory outline and a visible banner: pedagogical walkthrough; PRD / CONTRACT / how-it-works win; regenerate when the slice drifts.
2. Update `docs/walkthroughs/README.md` index (slug, title, one-line summary, date).
3. Do **not** `git commit` unless the user explicitly asks. Do **not** invent product “should” in the walkthrough — cite PRDs; absorb real product gaps via domain-modeling / PRD edits only when the user accepts that offer.
4. Do **not** replace or duplicate `CONTRACT.md` / colocated how-it-works as the source of truth; the walkthrough **points at** them.

Walkthroughs are supporting orientation maps (cross-stack, beginner-shaped). They are not a fourth product-law surface (see ADR-0001 / PRD index).

## Collision guard

| Ask | Skill |
| --- | --- |
| How does X work / onboard me on X | **This skill** |
| Deepen / shallow modules / architecture review | `improve-codebase-architecture` |
| Something’s broken / failing | `diagnosing-bugs` |
| Whole-system map only | `docs/architecture.md` (no mega-HTML) |
