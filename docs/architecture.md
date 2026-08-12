# Architecture

High-level map of Stackable for engineers and agents.

**Glossary:** [`CONTEXT.md`](../CONTEXT.md) · **ADRs:** [`docs/adr/`](./adr/) · **Agent notes:** [`AGENTS.md`](../AGENTS.md)
**Product PRDs / contracts:** add under `docs/prd/` and colocated `CONTRACT.md` when documenting a subsystem's "should"

---

## Product surface

Stackable is a **Gutenberg block plugin** for WordPress:

- Primary runtime: block editor (React) → saved block markup + generated CSS → frontend view scripts where needed
- Global settings: design tokens (colors, typography, spacing, schemes, block styles) that influence blocks site-wide
- Design Library: insert curated designs / patterns / pages into the editor
- PHP: block registration, enqueue, REST, options, Freemius (premium), capability gates

Free = core `stackable/*` blocks, editor tooling, design library (free surface), global settings, WordPress.org package.
Premium = same spine + Dynamic Content, conditional display, extra features/blocks under `pro__premium_only/`, Freemius licensing.

---

## System diagram

```text
 Editor (Gutenberg)
        │
        ▼
 ┌───────────────────────────┐
 │ stackable/* blocks        │  src/block/<name>/
 │ + block-components        │  src/block-components/
 │ + components / hooks      │  src/components/, src/hooks/
 └─────────────┬─────────────┘
               │ save / dynamic render
               ▼
 ┌───────────────────────────┐
 │ Markup + uniqueId styles  │  generated CSS / design system
 └─────────────┬─────────────┘
               │ frontend
               ▼
 ┌───────────────────────────┐
 │ View scripts / PHP render │  accordion, carousel, DC, etc.
 └───────────────────────────┘

 Cross-cutting:
 Global settings ──► tokens / presets ──► blocks
 Design Library  ──► insert patterns/pages
 Premium filters (applyFilters 'stackable.…') ──► pro__premium_only/
```

---

## Bootstrap

1. `plugin.php` defines `STACKABLE_BUILD` (`free` | `premium`) and loads free PHP.
2. If not free, load Freemius (`freemius.php`).
3. If premium and Freemius allows, require `pro__premium_only/index.php` when present.

Build tooling flips `STACKABLE_BUILD` (`npm run update-build-type` / `tools/update-build-type.js`) and packages free vs premium zips accordingly.

---

## Major subsystems

| Subsystem | Code (typical) | Notes |
| --- | --- | --- |
| Blocks | `src/block/`, `src/blocks.php`, `src/stk-block-types.php` | V3 `stackable/*`; v2 under `src/deprecated/` |
| Block components | `src/block-components/` | Shared inspector / style / markup pieces |
| Editor components | `src/components/`, `src/higher-order/`, `src/hooks/` | Shared UI and HOCs |
| Global settings | `src/plugins/global-settings/`, `src/global-settings.php` | Colors, typography, schemes, presets, block styles |
| Design Library | `src/design-library/`, `src/lazy-components/design-library/` | Insert designs |
| Admin / welcome | `src/welcome/`, `src/admin.php` | Settings, onboarding, notices |
| Dynamic Content | `pro__premium_only/.../dynamic-content` | Premium |
| Conditional display | `pro__premium_only/.../conditional-display` | Premium |
| Compatibility | `src/compatibility/` | Themes / plugins / WP version bridges |

---

## Freemium seams (summary)

Premium extends free through Freemius gates and `applyFilters( 'stackable.…' )` / premium modules rather than forking the block spine.
Keep premium logic out of the free tree; free zip must stay Plugin Check clean.

---

## Doc precedence

When code, how-it-works, and PRD/contract/ADR disagree: **PRD/contract win** when present; else **ADR** then architecture.
Open a GitHub issue for deepen/refactor opportunities that improve locality without changing product promises.
