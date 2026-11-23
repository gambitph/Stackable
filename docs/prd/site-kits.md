# Site Kits - developer implementation guide

The approved **Site Kits Design Document**, dated November 18, 2026, is the master product reference for this feature.
This guide explains how that product design fits the current Stackable codebase.
When the design document conflicts with this guide, follow the design document and update this guide.
When the design document is silent, preserve the contracts and engineering safeguards documented here.

Agent checklist: [`site-kits.agents.md`](./site-kits.agents.md).
Package, export, and import schema: [`site-kits.CONTRACT.md`](./site-kits.CONTRACT.md).
Ownership ADR: [`../adr/0002-site-kits-owned-by-plugin.md`](../adr/0002-site-kits-owned-by-plugin.md).
Default ADR: [`../adr/0003-default-is-the-theme.md`](../adr/0003-default-is-the-theme.md).
Theme shell: `../Start-Stackable/docs/prd/start-stackable.md`.

## What a Site Kit is

A Site Kit is a portable complete-website package.
It can contain pages, media, FSE settings, theme templates, website settings, navigation, Stackable settings and design-system data, and supported plugin data.

It is not:

- The Design Library Pages tab, which inserts markup into the post being edited.
- A single WordPress pattern or template part.
- A theme-owned demo importer.
- Default, which is the Start Stackable first-activation experience.

v1 ships three kits unless a newer product decision changes the count.
The user browses the catalog, opens a kit, previews its pages, chooses or customizes a color scheme, chooses what to apply, and confirms import.
Import never runs on plugin activation or theme activation.

## Product flow

1. Open Stackable > Site Kits directly below Getting Started.
2. Browse homepage screenshot cards with the same premium treatment as the Design Library.
3. Open a Site Kit detail screen.
4. Switch between included page previews, with the homepage selected by default.
5. Choose a pre-made color scheme or customize its fields.
6. See color changes in the page thumbnails and the large selected-page preview.
7. Click Apply Site Kit.
8. If Start Stackable is missing or inactive, install or activate it through the shared banner or modal flow.
9. Choose complete apply or select individual import groups.
10. Confirm import and continue to the resulting site or success state.

## Start Stackable relationship

Start Stackable is the required shell for applying Site Kits.
The Site Kits catalog and previews still work when the theme is missing or inactive.
Apply cannot reach import until Start Stackable is active.

```text
 Start Stackable theme
   header, footer, theme.json, templates, template parts, shell flags
                 ▲
                 │ Site Kit theme and FSE data
                 │
 Stackable plugin
   export, picker, preview, theme setup, import, Global Settings writes
                 ▲
                 │ package from the Design Library repository
                 │
 Site Kit
   pages, media, settings, templates, navigation, plugins, design data
```

The theme does not know Site Kit slugs.
The plugin does not implement sticky or transparent header CSS.
When a kit needs a new theme behavior, update the Start Stackable shell contract and this package contract together.

## Package location

Site Kit source packages live in the Stackable Design Library repository.

```text
library/src/site-kits/
├── site-kits.json
└── SITE_KIT_SLUG/
    ├── meta.json
    ├── preview.webp
    └── assets/
```

`site-kits.json` supplies the catalog.
Each `meta.json` supplies the complete package.
All media stays within the package directory and is copied into WordPress during import.
No imported page, template, setting, or metadata may retain a Design Library media URL.

## Export comes first

The development exporter is the first implementation milestone.
It lets the developer responsible for Site Kit entries begin creating packages before the picker and importer are complete.

The export control appears under Stackable > Settings only when the site defines:

```php
define( 'WP_ENV', 'development' );
```

The exporter creates one complete Site Kit directory archive containing:

- FSE settings and user Global Styles.
- Theme templates and template parts.
- Website settings such as the static front page.
- Pages, serialized block content, and allowlisted post metadata.
- Navigation used by the site.
- Referenced media files and attachment metadata.
- Active plugin identities and settings from supported adapters.
- Stackable settings, design-system data, and color schemes.

The exporter validates the result before download.
It reports missing media, external hotlinks, invalid schema, unsupported blocks, and unsupported plugin settings.
It never exports arbitrary options, credentials, caches, revisions, transients, generated CSS, or machine-specific paths.

The version 1 JSON Schema lives at `src/site-kits/schema/site-kit-v1.schema.json`.
Validate an exported directory with `npm run validate:site-kit -- path/to/SITE_KIT_SLUG`.

A Site Kit author unzips the archive into `library/src/site-kits/SITE_KIT_SLUG/`, adds or replaces `preview.webp`, completes catalog metadata, and runs package validation.

The exporter core is implemented under `src/site-kits/export/`.
It builds the package through focused collectors and writes an archive with `meta.json` and `assets/` at the archive root.
Local WordPress attachments are copied into the archive and their source URLs are replaced with package-relative paths.
Navigation page links use portable page slugs instead of source-site post IDs.
Plugin settings require an explicit `Stackable_Site_Kit_Plugin_Adapter`, and sensitive keys are removed before archive writing.

This core has no admin control yet.
The development-only Settings UI and download endpoint belong to implementation sequence item 3.
Item 4 then adds a development-only ZIP upload backed by the shared importer engine, and item 5 proves the export/import round trip on a clean site.
The later picker must call that same importer instead of implementing a parallel import path.

## Current codebase seams

Use the current Stackable architecture instead of building parallel systems.

| Requirement | Existing seam to deepen |
| --- | --- |
| Site Kits submenu and page shell | `src/welcome/index.php` and the existing Stackable admin tabs. |
| Development export entry | The Settings app in `src/welcome/admin.js`, next to the existing Import/Export surface. |
| Export server orchestration | New focused classes under `src/site-kits/`, loaded by `plugin.php`. |
| Development import entry | The Settings app in `src/welcome/admin.js`, next to the Site Kit export control. |
| Shared import orchestration | Focused classes under `src/site-kits/`, called by both the development upload and the picker Apply route. |
| Catalog fetch and cache | The retrieval and transient pattern in `src/design-library/init.php`. |
| Live isolated previews | `src/lazy-components/design-library/design-library-list/`. |
| Media sideload | Existing WordPress media use in `src/design-library/init.php`, extracted or deepened when sharing is useful. |
| Stackable design data | Registered options and stores under `src/global-settings.php` and `src/plugins/global-settings/`. |
| Premium access | Existing Freemius gates and `pro__premium_only/` extension points. |

The current generic settings exporter downloads a JSON settings file in the browser.
A Site Kit includes binary media and WordPress entities, so it needs a separate server-side package workflow rather than another generic settings JSON option.

## Color Scheme picker

The detail sidebar uses the label **Color Scheme**.
It must not use **Design System** in that location.

The first picker implementation edits color schemes only because that is the detailed behavior defined by the master design.
The exported and imported package still carries the complete Stackable design system.
Broader design-system editing can be added later without changing the package shape.

Preview edits stay in memory until import succeeds.
The preview must not save temporary values to the current site.

## Apply choices

All choices are checked by default.
Complete apply selects every available group and makes the Site Kit the active site presentation.
It does not delete unrelated posts or media because the master design does not explicitly require destructive deletion.

Partial apply offers:

- Pages and content.
- Theme templates and template parts.
- Navigation and website settings.
- Stackable design system and color schemes.
- Plugins, listed individually.
- Supported settings nested under their plugin.

Media is imported with the selected content that references it.
The UI prevents combinations that would leave broken references or CDN hotlinks.

## Plugin settings

Do not export the WordPress options table or every option belonging to an active plugin.
Plugin options may contain secrets and non-portable values.

Use one adapter per supported plugin.
An adapter declares which data is portable, how it is sanitized and redacted, how it is validated, and how it is restored.
Plugins without adapters can still be listed as required or recommended, but their settings are omitted with a warning.

## Import behavior

The importer validates the whole request before writing anything.
It checks the package, permissions, premium entitlement, active Start Stackable theme, selected groups, media, required blocks, and plugin availability.

The importer then:

1. Records rollback data.
2. Installs and activates selected plugins.
3. Imports media and builds attachment mappings.
4. Applies theme and FSE data.
5. Writes selected Stackable design-system data through existing options.
6. Upserts pages using Site Kit origin metadata.
7. Imports navigation and resolves page references.
8. Applies selected website and supported plugin settings.
9. Sets the front page and posts page.
10. Flushes generated CSS and caches.

Re-import updates the same kit-owned content.
It must not create duplicate Home pages or endlessly duplicate navigation.

## Freemium

Free and premium code must remain directory-safe.
Free may browse the full catalog and preview premium entries using the current Design Library premium treatment.
The server rechecks entitlement before applying a premium package or premium-only data.
All users may preview package color schemes, but persisting premium Global Design System data follows the existing premium gate.
Do not rely on a hidden or disabled button as the entitlement boundary.

Recommended split:

- Free: exporter in development, catalog, previews, theme requirement flow, and import of free packages using free blocks.
- Premium: premium package application and premium-only design-system or pattern data, following existing product gates.

If a free import encounters premium-only block content, use the existing substitution or omission policy instead of fatally failing the entire package.

## Implementation order

The authoritative sequence is in [`site-kits.agents.md`](./site-kits.agents.md#implementation-sequence).
The order is:

1. Export schema and fixtures.
2. Export collectors and archive.
3. Development export UI.
4. Importer core and development import UI.
5. Export/import round-trip validation.
6. Design Library author workflow.
7. Catalog and package retrieval.
8. Site Kits catalog, preview, and theme requirement.
9. Apply modal integration with the shared importer.
10. Production hardening, including re-import, premium enforcement, recovery, and final quality gates.

The exporter, development importer, and round-trip validation must be usable before catalog and picker implementation begins.

## Local testing

Run the focused PHP and JavaScript tests for changed modules first.
Run the Playground E2E flow after building assets.

```bash
npm run build:e2e
npm run test:e2e
```

For premium behavior:

```bash
npm run build:e2e:premium
npm run test:e2e:premium
```

Manual checks include:

1. Production environment: Site Kit export is absent and its endpoint is unavailable.
2. Development environment: export downloads a valid archive with local media and no secrets.
3. Start Stackable missing: catalog works, Apply explains and offers installation.
4. Start Stackable inactive: catalog works, Apply offers activation.
5. Start Stackable active: complete and partial apply work.
6. Color changes update every required preview without saving current options.
7. Re-import does not duplicate pages or navigation.
8. Forced import failure leaves the site recoverable.

## Review questions

- Does the implementation still follow the master design document?
- Is exporter work still the first implementation milestone?
- Can another developer build Site Kit entries from the exported archive without reconstructing data manually?
- Is the export surface unavailable outside explicit development mode?
- Are plugin settings allowlisted and redacted?
- Can catalog and preview work without Start Stackable while Apply remains blocked?
- Are all imported assets local to WordPress?
- Does partial import change only selected groups?
- Does re-import update instead of duplicate?
- Are premium checks enforced on the server?
