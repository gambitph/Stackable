# Site Kits - agent implementation guide

Load this file before changing Site Kit export, catalog, preview, import, package data, or E2E coverage.
The approved **Site Kits Design Document**, dated November 18, 2026, is the master product reference.
When it conflicts with repository documentation, follow the design document and update the repository documentation in the same change.
When it does not specify a behavior, preserve the existing product contracts documented here, in the developer guide, and in the ADRs.

Developer companion: [`site-kits.md`](./site-kits.md).
Package, export, and import contract: [`site-kits.CONTRACT.md`](./site-kits.CONTRACT.md).
Authoring quick guide: [`site-kits-authoring.md`](./site-kits-authoring.md).
Theme shell: sibling `../Start-Stackable/docs/prd/start-stackable.agents.md`.
Ownership ADR: [`../adr/0002-site-kits-owned-by-plugin.md`](../adr/0002-site-kits-owned-by-plugin.md).
Default ADR: [`../adr/0003-default-is-the-theme.md`](../adr/0003-default-is-the-theme.md).

## Product law

A **Site Kit** is a plugin-owned package that can assemble a complete website.
It contains pages, media, FSE settings, theme templates, website settings, Stackable settings and design-system data, and supported plugin data.
It may also contain navigation, patterns, template-part assignments, theme styles, and Start Stackable shell flags.

**Design Library Pages** insert one page of markup into the current editor.
That is not a Site Kit.

**Default** is Start Stackable on activation.
It is not a package and must never be imported or used as a reset slug.
The catalog may show it only as a non-importable label when the current product experience requires it.

Start Stackable is required to apply a Site Kit.
Users may browse the catalog and previews without it, but Apply must lead to the shared install or activate notice until the theme is active.

v1 ships three kits unless a newer product decision changes the count.
The user flow is catalog, detail preview, color-scheme selection or customization, apply options, and import.
Import requires an explicit user click.
Never import on plugin activation or theme activation.

## Deepen existing seams

- Put Site Kit PHP orchestration under `src/site-kits/`.
- Add the admin page to the existing Stackable welcome and settings app.
- Put the Site Kits page directly below Getting Started.
- Reuse the Design Library fetch and cache pattern where it fits the package catalog.
- Reuse the Design Library preview renderer where it satisfies live Site Kit preview requirements.
- Write existing Global Settings options instead of adding a second design-system store.
- Use existing WordPress media APIs to sideload assets and rewrite URLs.
- Keep premium-only PHP under `pro__premium_only/` and use existing Freemius gates.

## Do not

- Do not ship Site Kit page markup in the Start Stackable repository.
- Do not put the importer in the theme.
- Do not import on activation.
- Do not treat Default as a package.
- Do not permit Apply while Start Stackable is inactive.
- Do not build a parallel options framework or design-system store.
- Do not dump arbitrary plugin options into an export.
- Do not leave imported content hotlinked to the Design Library CDN.
- Do not fake sticky or transparent headers in plugin CSS.
- Do not allow re-import to create duplicate pages or menus.

## Package source

Source packages live in the Stackable Design Library repository.

```text
library/src/site-kits/
├── site-kits.json
└── SITE_KIT_SLUG/
    ├── meta.json
    ├── preview.webp
    └── assets/
```

Follow [`site-kits.CONTRACT.md`](./site-kits.CONTRACT.md) for the normative schema.
The catalog is keyed by slug and follows the current `pages-v4/pages.json` shape.
Every package directory contains all media that package needs.

## Module map

| Path | Role |
| --- | --- |
| `src/site-kits/` | Schema, exporter, catalog retrieval, theme state, import orchestration, and plugin adapters. |
| `src/welcome/` | Site Kits admin route, catalog, detail view, notices, apply modal, and development export UI. |
| `src/plugins/global-settings/` | Existing target for Stackable design-system and color-scheme data. |
| `src/design-library/` | Existing fetch, cache, and media-import seams to deepen where appropriate. |
| `src/lazy-components/design-library/` | Existing preview machinery to reuse where appropriate. |
| `pro__premium_only/` | Premium entitlement and premium-only extension points. |
| `e2e/config/fixtures/site-kits/` | Valid and invalid package fixtures for Playwright. |
| `e2e/tests/site-kits-*.spec.ts` | Export, catalog, preview, theme requirement, and free-safe import coverage. |
| `pro__premium_only/e2e/tests/site-kits-*.spec.ts` | Premium catalog, apply, and design-system coverage. |

## Exporter law

The exporter is the first implementation milestone.
It is visible only when `WP_ENV` is defined as `development`.
It lives under Stackable > Settings and exports the current site as one complete Site Kit directory.

The exporter captures:

- User Global Styles and portable FSE settings.
- Theme templates and template parts.
- The static front page, posts page, and other allowlisted website settings.
- Pages, serialized block content, and allowlisted post metadata.
- Navigation used by the exported templates.
- Referenced local media and portable attachment metadata.
- Active plugin identities and settings supplied by registered adapters.
- Stackable settings, design-system data, and color schemes.

The exporter must validate before download.
It must report missing media, remaining external media, invalid schema, invalid slugs, unsupported blocks, and omitted plugin settings.
It must not export secrets, credentials, arbitrary options, revisions, caches, transients, generated CSS, or machine-specific paths.

**Done when:** a developer can export a site, unzip the archive into `library/src/site-kits/SITE_KIT_SLUG/`, add or replace `preview.webp`, run package validation, and hand the package to the catalog build without manually reconstructing site data.

## Picker law

The Site Kits page appears below Getting Started.
The catalog uses homepage screenshots and follows the Design Library premium treatment.
Selecting a kit opens its detail screen.
Page thumbnails appear at the top, with the homepage selected by default.
The large preview displays only the selected page.

The sidebar shows kit information and a **Color Scheme** picker.
Do not label it **Design System**.
Changing or customizing a color scheme updates both thumbnail previews and the large preview without saving the live site.
All users may preview package color schemes.
Persisting premium Global Design System data during Apply follows the existing premium gate.

When Start Stackable is missing or inactive, show the shared requirement banner.
The same content appears in the Apply requirement modal.
Offer Install and Activate, Activate, or an administrator-required explanation based on theme state and capabilities.

## Apply law

Apply offers complete and partial modes.
All available groups are selected by default.

Partial groups are:

1. Pages and content.
2. Theme templates and template parts.
3. Navigation and website settings.
4. Stackable design system and color schemes.
5. Plugins, enumerated individually.
6. Supported settings nested under their plugin.

Media follows selected content and cannot be deselected when that would leave broken references or hotlinks.
Complete apply selects every group and makes the kit the active site presentation.
Complete apply does not delete unrelated posts or media because the master design does not require destructive deletion.

## Import orchestration

Follow [`site-kits.CONTRACT.md`](./site-kits.CONTRACT.md).

The importer performs preflight before it changes the site.
It validates version, permissions, entitlement, active theme, media, required blocks, selected groups, and plugin availability.

Order:

1. Record rollback data.
2. Install and activate selected plugins.
3. Import media and build the attachment map.
4. Apply theme variation, FSE settings, Global Styles, templates, template parts, and shell flags.
5. Write selected Stackable design-system values through existing options.
6. Upsert pages by `stk_site_kit` and `stk_site_kit_page` post meta.
7. Import navigation and resolve page references.
8. Apply selected website and supported plugin settings.
9. Set the static front page and posts page.
10. Flush Stackable generated CSS and related caches.

Re-import updates the same posts and navigation.
It does not create `Home (2)`.

## Implementation sequence

Complete these milestones in order.
Do not begin the catalog or picker implementation before the development export UI, shared importer core, and export/import round trip are usable.

### 1. Export schema and fixture

Finalize the version 1 package schema in the contract.
Add valid and invalid fixtures that cover pages, FSE data, navigation, Stackable settings, plugins, and media.
Add a validator that rejects unknown versions, invalid paths, mismatched slugs, missing files, and forbidden external media.

Implementation paths:

- Schema: `src/site-kits/schema/site-kit-v1.schema.json`.
- Validator: `tools/site-kits/validate-package.js`.
- Canonical fixture: `e2e/config/fixtures/site-kits/valid/consultant/`.
- Invalid cases: `e2e/config/fixtures/site-kits/invalid-cases.json`.
- Unit coverage: `src/site-kits/schema/__test__/validator.test.js`.

**Done when:** the validator accepts the canonical fixture and produces specific errors for every invalid fixture.

### 2. Export collectors and archive

Add focused collectors for theme data, site settings, pages, navigation, media, Stackable settings, and plugin adapters.
Keep each collector independently testable.
Build one package model and write it as a complete Site Kit directory archive.

Implementation paths:

- Export factory and orchestration: `src/site-kits/export/index.php` and `class-exporter.php`.
- Focused WordPress collectors: `src/site-kits/export/class-*-collector.php`.
- Portable data redaction: `src/site-kits/export/class-portable-data.php`.
- Plugin adapter contract: `src/site-kits/export/class-plugin-adapter.php`.
- ZIP and PclZip archive writing: `src/site-kits/export/class-archive-writer.php`.
- PHP coverage: `tests/phpunit/SiteKitExporterTest.php`, `tests/phpunit/SiteKitMediaCollectorTest.php`, and `tests/phpunit/SiteKitStackableCollectorTest.php`.

The archive root contains `meta.json` and `assets/`.
Navigation page links use `stkSiteKitPage` until the importer resolves them against imported page IDs.
Do not add plugin settings directly to the collector allowlist when an adapter is the correct ownership boundary.

**Done when:** an automated test exports a representative site and verifies `meta.json`, media files, relative references, redaction, and schema validity.

### 3. Development export UI

Add the Site Kit Export entry under Stackable > Settings.
Gate both the UI and server action on `WP_ENV === 'development'`, `manage_options`, and a nonce.
Show validation results before download.

Implementation paths:

- Settings UI: `src/welcome/site-kit-export.js` and `src/welcome/site-kit-export.scss`.
- Validation and download controller: `src/site-kits/export/class-export-controller.php`.
- Runtime package validation: `src/site-kits/class-package-validator.php`.
- Development coverage: `e2e/tests/site-kits-export.spec.ts`.
- Production absence coverage: `e2e/production-tests/site-kits-export-production.spec.ts` and `playwright.site-kits-production.config.js`.

The validation request returns a short-lived, single-use download URL only after package validation succeeds.
The download action rebuilds and revalidates the package, streams a temporary archive, and deletes the archive immediately.

**Done when:** Playwright downloads a valid Site Kit archive in development and proves the control and endpoint are unavailable otherwise.

### 4. Importer core and development import UI

Build one importer orchestration under `src/site-kits/` for both development uploads and the later customer-facing picker.
Add a development-only ZIP upload under Stackable > Settings.
Gate both the UI and server action on `WP_ENV === 'development'`, `manage_options`, operation-specific capabilities, and a nonce.
Safely extract the archive and reject path traversal, symbolic links, unknown files, oversized input, malformed archives, and invalid packages before writing anything.
Require Start Stackable to be active.
Use a complete import plan in the development UI, while keeping the importer capable of accepting the explicit selection plan that the picker will provide later.
Implement preflight, rollback recording, plugin actions, media import, theme and FSE writes, Stackable design data, page upsert, navigation resolution, website and plugin settings, front-page settings, and cache flushing in the contract order.
Always remove temporary files and perform basic cleanup after a failed import.

Implementation paths:

- Shared bootstrap and factory: `src/site-kits/import/index.php`.
- Secure package reader: `src/site-kits/import/class-package-reader.php`.
- Import plan and orchestration: `src/site-kits/import/class-import-plan.php` and `src/site-kits/import/class-importer.php`.
- Focused media, theme, content, Stackable settings, and plugin importers: `src/site-kits/import/class-*-importer.php`.
- Development upload controller: `src/site-kits/import/class-import-controller.php`.
- Settings UI and target-side Global Block Styles regeneration: `src/welcome/site-kit-import.js`, `src/welcome/site-kit-block-styles.js`, and `src/welcome/site-kit-import.scss`.
- PHP coverage: `tests/phpunit/SiteKitImportPlanTest.php`, `tests/phpunit/SiteKitImportRollbackTest.php`, `tests/phpunit/SiteKitPackageReaderTest.php`, and `tests/phpunit/SiteKitSettingsImporterTest.php`.
- Development browser coverage: `e2e/tests/site-kits-export.spec.ts`.

**Done when:** a valid exported ZIP imports into a clean development site through the same importer engine the picker will use, and an invalid upload causes no site writes.

### 5. Export/import round-trip validation

Export a representative site and import the resulting ZIP into a clean site.
Compare the imported pages, FSE data, navigation, settings, Stackable design data, and local media with the export source.
Prove that source IDs and source URLs do not leak into the imported result.
Repeat the import to cover basic idempotence and force a failure to cover basic cleanup.

**Done when:** automated round-trip coverage proves the package contract before catalog and picker work begins.

### 6. Design Library author workflow

Add the canonical example package, `site-kits.json`, package validation, and catalog build support in the Design Library repository.
Document the unzip, preview-image, validation, and publication workflow.

**Done when:** another developer can begin creating Site Kit entries using the exporter while picker work continues.

### 7. Catalog and package retrieval

Add cached catalog and package retrieval through Stackable REST routes.
Return plan data, page data, and current Start Stackable state.
Reject malformed packages and the `default` slug.

**Done when:** authenticated E2E coverage fetches three kit slugs, rejects invalid packages, and proves no content is created.

### 8. Site Kits catalog, preview, and theme requirement

Register Site Kits below Getting Started.
Build the screenshot catalog, premium indicators, loading state, empty state, error state, and Start Stackable banner.
Build page thumbnails, the selected-page preview, Color Scheme picker, and Customize controls.
Keep edits in memory until Apply succeeds.
Reuse the Design Library preview renderer where it meets the requirement.
Implement shared banner and modal content for active, inactive, missing, and insufficient-capability states.
Refresh and recheck after installation or activation.

**Done when:** the catalog remains usable without Start Stackable, preview changes do not alter saved options, and Apply remains blocked until Start Stackable is active.

### 9. Apply modal integration

Connect the picker to the shared importer built in milestone 4 instead of creating a second importer path.
Implement complete and partial selection, dependency validation, selected groups, media and plugin dependencies, and success state.
Send the resulting explicit import plan through the same preflight, rollback, and apply orchestration used by the development ZIP upload.

**Done when:** complete and partial apply work, only selected groups change, no imported media remains hotlinked, and a complete picker import produces the same result as importing the same package through the development UI.

### 10. Production hardening

Complete idempotent re-import, server-side premium checks, rollback and recovery coverage, cache flushing, security checks, accessibility, performance, and final UX states.

**Done when:** a second import updates existing kit-owned content, premium access cannot be bypassed, and a forced failure leaves the site recoverable.

## E2E coverage

Use Playground and Playwright like the rest of `e2e/`.
Mock catalog and package HTTP with the existing Design Library fixture pattern.
Mount Start Stackable for apply tests.

| Spec | Assertions |
| --- | --- |
| `e2e/tests/site-kits-export.spec.ts` | Development-only export and ZIP import controls; permission, nonce, and active-theme checks; downloaded archive validates; media is local; invalid uploads cause no writes. |
| `e2e/production-tests/site-kits-export-production.spec.ts` | Production Settings omits the export and import controls, and neither development REST route is registered. |
| `e2e/tests/site-kits-round-trip.spec.ts` | Export a representative site, import into a clean site, compare portable content and settings, and prove source IDs and URLs are absent. |
| `e2e/tests/site-kits-catalog.spec.ts` | Three kits; previews load; premium indicators render; no import on page load or activation; Default label cannot import. |
| `e2e/tests/site-kits-theme-required.spec.ts` | Catalog works without Start Stackable; banner and modal agree; missing theme can be installed; inactive theme can be activated; Apply remains blocked until active. |
| `e2e/tests/site-kits-preview.spec.ts` | Homepage is selected; page selection changes the large preview; color-scheme selection and customization update thumbnails and large preview. |
| `e2e/tests/site-kits-import.spec.ts` | Complete picker apply delegates to the shared importer and creates pages, navigation, front page, templates, local media, and valid Stackable blocks with no recovery UI. |
| `e2e/tests/site-kits-partial-import.spec.ts` | Only selected groups change; dependency rules prevent broken media and references. |
| `e2e/tests/site-kits-reimport.spec.ts` | Import twice; one Home and one kit navigation remain; content is updated. |
| `e2e/tests/site-kits-snap-in.spec.ts` | Start Stackable is active; shell classes and selected parts apply; a transparent sticky header overlays the hero and becomes opaque after scroll. |
| `e2e/tests/site-kits-permissions.spec.ts` | Users without required export, theme, plugin, or import capabilities receive the correct blocked state. |
| `e2e/tests/site-kits-rollback.spec.ts` | A forced failure restores recorded site state and reports unrecoverable operations. |
| `pro__premium_only/e2e/tests/site-kits-premium.spec.ts` | Premium kit and design-system access work only with premium entitlement; no `ProControl` remains after entitlement is mocked. |

Design Library Pages tests remain in `design-library.spec.ts`.
Do not reuse page insertion coverage as Site Kit coverage.

## Completion for a Site Kits change

- The master design and this contract agree.
- Export remains the first implementation milestone.
- The development importer and export/import round trip work before catalog and picker implementation begins.
- Package fixtures and validators match the contract.
- No Site Kit importer or package markup lives in the theme repository.
- Start Stackable is active before Apply reaches import.
- All selected media is imported locally.
- Matching unit and E2E tests pass.
- `CONTEXT.md`, architecture, developer documentation, and the Start Stackable contract are updated when their interfaces change.
