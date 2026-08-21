# Stackable

Stackable is a WordPress block plugin (Gutenberg) that ships a design system of blocks, global settings, and a design library.
The free product is the core block set and editor tooling on WordPress.org.
Premium deepens the same spine with Dynamic Content, conditional display, extra blocks/features, and Freemius licensing under `pro__premium_only/`.

## Language

### Product

**Stackable**:
The WordPress plugin product (this codebase).
_Avoid_: Stackable Ultimate Gutenberg Blocks (except plugin slug / marketing titles), SUG B (as casual name)

**Block**:
A `stackable/*` Gutenberg block under `src/block/<name>/` (V3).
_Avoid_: ugb block (v2 namespace - deprecated), "element" alone when you mean a block

**Block component**:
Reusable editor building block under `src/block-components/` (alignment, image, typography, style, etc.) composed into blocks.
_Avoid_: component alone when you mean a WordPress `@wordpress/components` control

**Design Library**:
In-editor library for inserting designs, patterns, pages, and related layouts into the current document.
_Avoid_: pattern library alone (too vague), template kit (unless marketing copy), Site Kit (full-site import)

**Site Kit**:
A plugin-owned import package that seeds a site: pages, optional patterns, menu, front page, canvas templates, theme styles overlay and/or variation, optional Global Design System, and Start Stackable snap-in flags.
_Avoid_: Design Library page (insert-into-editor), theme demo import, starter site (competitor name), Default (the theme on activate)

**Default**:
The Start Stackable first-activation site (designed blog, no import). Not a kit slug.
_Avoid_: default kit package, reset, import-on-activate

**Start Stackable**:
The companion block theme (sibling repo). Complete block theme on its own and the site shell. Not this plugin.
_Avoid_: putting theme chrome or sticky-header CSS in this plugin

**Shell contract**:
Theme primitives a Site Kit may depend on (header parts, sticky/transparent flags, full-width canvas, header-height token, theme styles overlay reception). Defined in Start Stackable PRDs and `docs/prd/site-kits.CONTRACT.md`.
_Avoid_: kit-only CSS hacks that fake chrome in the plugin

**Global settings**:
Site-wide Stackable design tokens and controls (colors, typography, spacing, block styles, color schemes, presets) under `src/plugins/global-settings/` and related PHP.
_Avoid_: theme.json (WP core / Start Stackable), customizer (unless literally that UI), Site Kit (the package that may *write* these options)

**Global Block Styles**:
Reusable named styles applied across matching blocks (premium-capable surface in the design system).
_Avoid_: CSS class stylesheet alone, theme style variation (WP FSE)

**Dynamic Content** (premium):
Resolve fields / post data into block attributes and frontend output.
_Avoid_: ACF alone (one source among many), shortcodes (unless documenting a specific bridge)

**Conditional display** (premium):
Show/hide blocks based on rules (user, query, custom fields, etc.).
_Avoid_: visibility CSS alone, display conditions (unless matching UI copy)

**uniqueId**:
Per-block CSS/instance identifier Stackable uses for scoped styles.
_Avoid_: clientId alone (editor-only WP id), block id (ambiguous)

### Runtime

**STACKABLE_BUILD**:
PHP constant (`free` | `premium`) flipped by build scripts; gates loading `pro__premium_only/`.
_Avoid_: BUILD_TYPE alone, isPro (runtime localize derived from build + Freemius plan)

**STACKABLE_I18N**:
Text domain constant: `stackable-ultimate-gutenberg-blocks`.
_Avoid_: inventing a shorter domain string in new strings

**sugb_fs / Freemius**:
Licensing and updates for premium builds via Freemius SDK helpers in this repo.
_Avoid_: inventing a custom lite license stack beside Freemius in this repo

**~stackable**:
JS path alias to `src/` (see `jsconfig.json`).
_Avoid_: relative `../../../` climbs for cross-folder imports when the alias fits

### Packaging

**Free**:
Directory-safe plugin tree: core blocks, editor UI, design library (free surface), global settings, WordPress.org distribution.
_Avoid_: lite, basic tier (as the technical name)

**Premium**:
Code under `pro__premium_only/` loaded when `STACKABLE_BUILD === 'premium'` and Freemius premium gates allow it.
_Avoid_: pro features sprinkled in the free tree

**V2 / deprecated**:
Legacy `ugb/*` blocks and `src/deprecated/` paths kept for migration and recovery - not the default for new work.
_Avoid_: extending v2 as the primary implementation path
