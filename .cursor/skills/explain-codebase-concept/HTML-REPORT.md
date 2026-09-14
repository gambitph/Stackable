# HTML Report Format — Concept Walkthrough

Pedagogical walkthrough of **one** Ahentic concept / feature / subsystem. Same **delivery** mechanics as `improve-codebase-architecture` (temp HTML, CDN Tailwind + Mermaid, open in browser) — different **pedagogy**. No before/after deepening cards, no Strong/Speculative badges.

## Scaffold

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Walkthrough — {{concept}} — Ahentic</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module">
      import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
      mermaid.initialize({ startOnLoad: true, theme: "neutral", securityLevel: "loose" });
    </script>
    <style>
      .seam { stroke-dasharray: 4 4; }
      .blackbox { opacity: 0.55; }
    </style>
  </head>
  <body class="bg-stone-50 text-slate-900 font-sans">
    <main class="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <!-- banner if durable copy -->
      <!-- sections 1–9 in order -->
    </main>
  </body>
</html>
```

**Temp path:** `$TMPDIR/concept-walkthrough-<slug>-<timestamp>.html`  
**Durable path (optional):** `docs/walkthroughs/<slug>.html`

When writing a durable copy, put this banner at the top of `<main>`:

```html
<aside class="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
  Pedagogical walkthrough — not product law. When this disagrees with a PRD or
  <code class="font-mono">CONTRACT.md</code>, the PRD/contract wins. Prefer regenerating
  this file over hand-editing it into a second truth.
</aside>
```

## Mandatory sections (in order)

Every report includes all nine. If a section has nothing to say, keep the heading and one line (e.g. “None.”). Do not omit sections.

### 1. Header

- Concept title (CONTEXT.md term when one exists)
- One-line “what it is”
- Scope statement (what this walkthrough covers / deliberately skips)
- Repo name + date

No long introduction — the ELI5 is next.

### 2. ELI5

Plain story of what happens for the user or system. **No file names, no class names.** A new teammate should understand the *idea* before the wiring.

### 3. Wiring diagram

Centrepiece. Mermaid `flowchart` or `sequenceDiagram` for the runtime path. Black-box neighbors: muted/dashed nodes labeled with “see `…/CONTRACT.md`” (or how-it-works path).

```html
<div class="rounded-lg border border-slate-200 bg-white p-4">
  <pre class="mermaid">
    sequenceDiagram
      participant U as User
      participant S as Sidebar
      participant R as REST
      participant O as Orchestrator
      U->>S: action
      S->>R: request
      R->>O: step
  </pre>
</div>
```

Mix Mermaid with hand-built divs/SVG when layout fights you. Keep diagrams ~320–400px tall when possible. Variety is fine; generic identical graphs are not.

### 4. Cast of modules

Glossary terms + **primary** files only (roughly 5–12). Monospaced paths. One short role clause each. Not every file that greps.

### 5. Step-through

Numbered path matching the wiring diagram. Sparse code anchors: path + key symbol (function/class/ability name). Prefer “what happens at this hop” over pasted code blocks. If a snippet helps, keep it tiny.

### 6. How it talks to neighbors

Inbound / outbound only. Black boxes with pointers to CONTRACT / how-it-works. Name a **seam** here when it helps a contributor know what not to reach across. Otherwise plain language.

### 7. Change map

Contribution-ready:

- “To extend / fix behavior in this slice, you usually touch …” (ordered touch path)
- Docs / checklists / tests / catalogues that must stay in sync (e.g. `docs/agents/ability-checklist.md`, ability catalog tests) — only when relevant
- Optional: one-line “don’t” that protects a known seam (positive phrasing preferred)

Wins for contributors, not vague “easier to maintain.”

### 8. Read next

Links into the doc ladder for this slice: CONTEXT, architecture, CONTRACT, how-it-works, PRD/ADR if relevant. Absolute-from-repo-root paths in monospace or markdown links.

### 9. Open questions / drift

Doc↔code mismatches, missing glossary terms, phantom names, unclear ownership. If none: “No doc drift found.”  
Do not silently “fix” the narrative to hide drift — list it and offer a fix in chat.

## Style

- Editorial, not dashboard. Generous whitespace. Serif optional for headings (`font-serif` with stone/slate).
- Colour sparingly: one accent; amber for the durable banner / drift callouts.
- Prose sparse. If the diagram needs a paragraph, redraw the diagram.
- Scripts: Tailwind CDN + Mermaid ESM only. Static otherwise.
- Domain vocabulary from `CONTEXT.md`. No architecture-review badge row.

## Tone

Teach the path. Concise. No throat-clearing. The reader should leave knowing what the concept is, how it is wired, where to read next, and where to change things.
