# Site Kits - agent implementation guide

Load this file before adding Site Kit admin UI, import REST, kit packages, or e2e for kits.
Product law here wins over Design Library page-insert behavior (that is a different feature).
Developer companion: [`site-kits.md`](./site-kits.md).
Package schema: [`site-kits.CONTRACT.md`](./site-kits.CONTRACT.md).
Theme shell: sibling `../Start-Stackable/docs/prd/start-stackable.agents.md`.
ADR: [`../adr/0003-default-is-the-theme.md`](../adr/0003-default-is-the-theme.md).

## Law

A **Site Kit** is a plugin-owned import package: pages + optional patterns + menu + front page + template map + theme styles (variation slug and/or overlay) + optional design-system payload + theme snap-in.
**Design Library Pages** insert one page of markup into the current editor. That is not a Site Kit.
**Default** is Start Stackable on activate. It is not a kit package. Catalog may label it; that label does not import or reset.
Start Stackable is the **intended shell**. Import still runs without it; header flags no-op and a notice says chrome is limited.

v1 ships **three** kits (not counting Default).
Wizard: catalog → preview → optional design-system tweaks (side panel) → import.
Import requires an explicit user click. Never import on plugin or theme activation.

Deepen existing seams:

- Catalog/preview UI: admin under Stackable (same app as welcome/settings), not a parallel options framework.
- Tokens: write **existing** Global Settings options. Do not add a second design-system store.
- Markup: `stackable/*` + core, same as Design Library packages.
- CDN: same design-library retrieve/cache pattern unless an ADR says otherwise.

Premium: applying Stackable Global Design System from the side panel and extra kit patterns follow existing Freemius gates for those surfaces.
Theme style variation and/or `theme.styles` overlay + pages/menu/templates may run for free users when the markup is free blocks.
Do not put premium PHP in the free tree.

## Do not

Ship kit HTML in the Start Stackable repo.
Build a theme options panel that imports kits.
Import on theme or plugin activation.
Treat Default as an importable slug or a kit reset.
Fork a new style generator or a second REST “demo” plugin.
Fake sticky/transparent headers in plugin CSS. Extend the theme shell contract instead.

## Wizard

1. User opens Stackable admin → Site Kits (theme activation does not open this).
2. Catalog lists three kits. Optional Default **label** is not clickable-as-import.
3. Select a kit. Side panel shows design-system controls bound to the kit’s `designSystem` defaults (colors, fonts, spacing that already exist in Global Settings).
4. Confirm import. Capability check. Consent string in the UI.
5. Importer: create/update pages, assign templates, set front page, create menu, apply `styleVariation` then `theme.styles` overlay if Start Stackable is active, write header flags, write GDS if allowed, register optional patterns.
6. Redirect to the front page or a “view site” success state.

**Done when:** one click from step 4 produces a front page that uses `full-width`, kit blocks render (no recovery UI), nav contains kit items, and with Start Stackable active the home header overlays the hero.

## Module map (intended)

| Path | Role |
| --- | --- |
| `src/site-kits/` (new cluster) | PHP register, REST, import orchestration |
| `src/welcome/` or admin app | Catalog + wizard UI (reuse admin stack) |
| Existing `src/plugins/global-settings/` | Target of `designSystem` writes |
| Existing `src/design-library/` | Package fetch/cache if kits live next to library JSON |
| `pro__premium_only/` | Premium-only GDS apply / extra patterns |
| `e2e/config/fixtures/site-kits-*.json` | Mock packages for Playwright |
| `e2e/tests/site-kits.spec.ts` | Free-safe catalog/preview |
| `pro__premium_only/e2e/tests/site-kits.spec.ts` | Full import + GDS |

## Import orchestration

Follow [`site-kits.CONTRACT.md`](./site-kits.CONTRACT.md).

Order:

1. Validate `version` and capability.
2. If theme is `start-stackable`, apply `styleVariation` (if set), then `theme.styles` overlay (if set), then header/footer flags.
3. Write GDS (gated).
4. Upsert pages by `stk_site_kit` + `stk_site_kit_page` post meta (slug).
5. Assign page templates (`full-width` default for marketing).
6. Upsert a menu; assign to the theme’s primary navigation location / block ref via supported WP APIs.
7. Set static front page.
8. Flush uniqueId/CSS caches if the plugin has that hook.

Re-import updates the same posts. It does not create `Home (2)`.

**Done when:** running import twice leaves one Home, one menu, and updated content.

## Without Start Stackable

Import pages + GDS + menu + front page.
Skip header flags and missing style variations.
Show an admin notice: install Start Stackable for sticky/transparent chrome.
Do not refuse import.

## Implementation sequence

### 1. Contract + fixtures

Check in one v1 JSON fixture with two pages (home + about), `full-width`, dummy Stackable markup that already exists in e2e catalog.

**Done when:** schema in CONTRACT matches the fixture; PHP validator rejects unknown `version`.

### 2. REST catalog + get

GET list and GET package. Permission: `edit_pages` for get; import stays stricter.

**Done when:** authenticated e2e can fetch three slugs; unauthenticated gets 401/403.

### 3. Import without GDS

Pages, templates, menu, front page.

**Done when:** e2e import fixture, visit `/`, see kit heading text, no block recovery.

### 4. Snap-in

Detect `stk--is-stackable-theme`. Write flags + variation + styles overlay.

**Done when:** with Start Stackable mounted, home uses transparent overlay; with another block theme, import still succeeds.

### 5. Side panel GDS

Bind to existing Global Settings REST/options.

**Done when:** changing primary color in the panel then importing makes frontend kit buttons use that token (premium path if gated).

### 6. Admin wizard UI

Three previews, side panel, confirm.
Default label does not import.

**Done when:** the e2e table below that matches this surface is green.

## E2E (create these)

Use Playground + Playwright like the rest of `e2e/`.
Mock kit JSON via `pre_http_request` (same pattern as Design Library fixtures).
Mount Start Stackable as a theme in the **snap-in** specs only (blueprint extra).

| Spec | Assertions |
| --- | --- |
| `e2e/tests/site-kits-catalog.spec.ts` | Site Kits screen lists three kits; preview loads; no import on page load or on theme/plugin activate; Default label (if shown) does not create pages. |
| `e2e/tests/site-kits-import.spec.ts` | Import fixture; Home is front page; About exists; menu links work; `full-width` (no theme post title on Home); frontend shows `.stk-block`; no recovery UI in editor. |
| `e2e/tests/site-kits-reimport.spec.ts` | Import twice; still one Home; content is the second payload. |
| `e2e/tests/site-kits-without-theme.spec.ts` | Core theme (not Start Stackable); import succeeds; notice about Start Stackable; pages work. |
| `e2e/tests/site-kits-permissions.spec.ts` | Editor without `edit_theme_options` cannot import (403). |
| `pro__premium_only/e2e/tests/site-kits-gds.spec.ts` | Side panel changes a color; after import, Global Settings and frontend reflect it; no `ProControl` while premium mocked. |
| `e2e/tests/site-kits-snap-in.spec.ts` | Start Stackable active; after import, `body.stk--is-stackable-theme`; header has sticky/transparent class; hero sits under header (geometry assertion). |

Design Library “Pages” tab tests stay in `design-library.spec.ts`.
Do not reuse those as kit coverage.

## Completion for a plugin PR

- CONTRACT still accurate.
- No kit importer in the theme repo.
- Matching e2e specs green.
- `CONTEXT.md` terms updated if you added language.
