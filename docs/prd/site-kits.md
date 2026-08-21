# Site Kits - developer implementation guide

This is the human guide for the plugin feature.
Agents should follow [`site-kits.agents.md`](./site-kits.agents.md).
Schema: [`site-kits.CONTRACT.md`](./site-kits.CONTRACT.md).
ADR: [`../adr/0002-site-kits-owned-by-plugin.md`](../adr/0002-site-kits-owned-by-plugin.md), [`../adr/0003-default-is-the-theme.md`](../adr/0003-default-is-the-theme.md).
Theme shell: `../Start-Stackable/docs/prd/start-stackable.md` (plan: `start-stackable.plan.md`, check: `start-stackable.check.md`).

## What a Site Kit is

A Site Kit is **one-click site assembly**: multiple pages, a menu, a front page, canvas templates, optional patterns, a theme style variation and/or theme styles overlay, header flags, and a design-system payload.

It is not:

- The Design Library **Pages** tab (inserts markup into the post you are editing).
- A WordPress pattern or a template part.
- A theme demo importer (illegal in Start Stackable; wrong ownership).
- **Default** (Start Stackable on activate: designed blog, no import).

v1: **three** kits (Default is not one of them).
UX: pick a kit → preview → tweak design system in a **side panel** → import.
Never import on theme or plugin activation.

## How it relates to Start Stackable

```
Start Stackable (theme)
  Default on activate: designed blog, chrome, theme.json
  shell: header/footer, canvases, sticky/transparent flags
        ▲
        │  kit declares parts + flags + variation and/or styles overlay (CONTRACT)
        │
 Stackable (plugin)
  wizard + import + GDS writes + page HTML
        ▲
        │  package JSON
        │
 Site Kit
  pages, menu, theme styles, designSystem, snap-in
```

The theme does not know kit slugs.
The plugin does not implement sticky CSS.
If a kit needs new chrome (for example hide-footer on checkout), add a shell primitive in the theme PRD and a field in the CONTRACT, in one change.

A kit writes **two** visual layers that share token slugs:

1. Theme styles (shipped variation slug and/or `theme.styles` overlay as user Global Styles) so header, footer, and blog match the kit.
2. Stackable Global Design System so `stackable/*` on imported pages match.

Without Start Stackable, import still creates pages and settings.
Sticky/transparent Home heroes will not match the design.
Show a notice recommending the theme.
Do not hard-fail.

The Site Kits catalog may show Default as a **label** ("you are on the theme").
It is not an importable slug.
Clicking it does not reset an imported kit.

## Product surfaces

| Surface | Repo | Notes |
| --- | --- | --- |
| Site Kits admin (catalog, preview, side panel, import) | Plugin | Stackable top-level admin, not a theme page |
| Design systems library (browse pre-made systems, tweak, apply) | Plugin | Same Global Settings store; kits can apply one as `designSystem` |
| Header sticky/transparent | Theme | Shell contract |
| Design Library patterns/pages | Plugin | Insert-into-editor; kits may *reuse* the same CDN items as page content |

Design systems in admin are **presets for Global Settings**, not a third token engine.
A kit’s `designSystem` object should be the same shape those presets already use.

## Freemium

Keep Directory-safe code in the free tree.

Recommended split:

- **Free:** catalog, preview, import of pages/menu/templates/style variation/`theme.styles` overlay using free blocks.
- **Premium:** side-panel writes to Global Color Schemes / presets / extra patterns, matching today’s GDS gates.

If a kit page contains premium-only blocks, skip or replace them in the free importer rather than fatally erroring.
Do not ship premium logic under `src/` in the free package.

## Suggested implementation

1. **`src/site-kits/`** - PHP: register submenu, REST, importer class.
   One importer, many kit JSON files. Do not copy-paste an importer per kit.
2. **Admin UI** - extend `src/welcome/` (or the current admin app) with a Site Kits route.
   Reuse existing components for color/typography if they already edit GDS.
3. **Packages** - CDN JSON like Design Library, with e2e fixtures under `e2e/config/fixtures/`.
4. **Identity of imported pages** - post meta `stk_site_kit` + `stk_site_kit_page` so re-import updates.
5. **Theme detection** - `body` class `stk--is-stackable-theme` or `get_template() === 'start-stackable'`.

Import transaction: prefer doing GDS + pages in one request with capability checks.
If page insert fails, do not leave a half-applied style variation without a rollback or a clear error.

## Relationship to existing Design Library

Design Library remains “browse and insert into the current document”.
Site Kits remain “replace/seed the site”.
Shared: CDN, block markup flavor, caching.
Not shared: the insert modal should not silently run a full-site import.

Full-page templates in the library can be *sources* for kit `pages[].content`, but the kit still owns menu, front page, and shell flags.

## Local testing

```bash
npm run build:e2e
npm run test:e2e
```

For snap-in tests, Playground must activate `start-stackable`.
Until that blueprint exists, manually: symlink the theme into the Playground data dir or add it to `e2e/playground-blueprint.json`.

Premium GDS:

```bash
npm run build:e2e:premium
npm run test:e2e:premium
```

Manual walkthrough:

1. Theme off, plugin on: import, confirm pages, confirm notice.
2. Start Stackable on: import, confirm overlay header + no page title on Home.
3. Re-import: no duplicate pages.
4. Editor without `edit_theme_options`: import blocked.

## E2E specs to create

The authoritative checklist is in [`site-kits.agents.md`](./site-kits.agents.md#e2e-create-these).

When writing specs:

- Mock HTTP like `e2e/test-utils/mock-design-library.ts`.
- Assert recovery UI, not console validation noise.
- Snap-in: measure header vs first `.stk-block` or `alignfull` section (`top` within a few pixels before scroll).
- After scroll, header computed background is opaque.
- Catalog spec must prove **no** pages were created until import is clicked, and **no** import on activate.

## Review questions

- Can Theme Review still accept Start Stackable if this feature exists only in the plugin?
- Does activate (theme or plugin) import anything? It must not.
- Does re-import duplicate content?
- Are GDS writes going through the existing options API?
- Does a site **without** Start Stackable still get a usable imported site (pages + menu), even if the hero is not overlaid?
