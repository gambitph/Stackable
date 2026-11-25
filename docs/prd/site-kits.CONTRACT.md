# Site Kit package, export, and import contract

The approved **Site Kits Design Document**, dated November 18, 2026, is the master product reference for this feature.
This contract translates that design into repository-owned interfaces.
When this contract conflicts with that design document, the design document wins and this contract must be corrected.
When the design document is silent, the existing Site Kits PRD, ADRs, and established Stackable behavior apply.

Start Stackable implements the theme shell side of this contract.
The Stackable plugin implements export, catalog retrieval, preview, theme installation and activation, and import.
The Stackable Design Library repository stores and publishes Site Kit packages.
Changing a deep interface in this file requires matching documentation and tests in every affected repository.

## Product invariants

- A Site Kit is applied only after an explicit user action.
- A Site Kit is never applied on plugin activation or theme activation.
- Start Stackable must be installed and active before a Site Kit can be applied.
- The catalog and previews remain available when Start Stackable is missing or inactive.
- Imported media is copied into the WordPress Media Library.
- An imported site must not hotlink media from the Stackable Design Library repository or CDN.
- Re-importing the same kit updates kit-owned content instead of creating duplicates.
- Existing Stackable Global Settings options remain the only Stackable design-system store.
- Default is the Start Stackable first-activation experience, not an importable package.

## Repository layout

Site Kit source packages live in the Stackable Design Library repository.

```text
library/src/site-kits/
├── site-kits.json
└── SITE_KIT_SLUG/
    ├── meta.json
    ├── preview.webp
    └── assets/
        └── ...
```

Each Site Kit has one directory named after its slug.
The preview image must be named `preview.webp`.
All package-owned images, videos, and other media must remain inside the Site Kit directory.
The published build may change the CDN base URL, but it must preserve relative relationships between `meta.json` and package media.

## Catalog file

`library/src/site-kits/site-kits.json` contains the data required to render the Site Kits catalog.
Its top-level shape follows the Design Library `pages-v4/pages.json` convention and is keyed by Site Kit slug.

```json
{
  "consultant": {
    "slug": "consultant",
    "title": "Consultant",
    "description": "A professional services website.",
    "plan": "free",
    "category": "Business",
    "pageCount": 5,
    "fullPreviewUrl": "https://example.com/consultant"
  }
}
```

### Catalog field rules

| Field | Rule |
| --- | --- |
| `slug` | Unique package identifier using only `a-z`, `0-9`, and `-`. It must never be `default`. |
| `title` | User-facing Site Kit name. |
| `description` | Short plain-language summary displayed in the picker. |
| `plan` | `free` or `premium`. The server must enforce entitlement during apply. |
| `category` | Optional user-facing category. |
| `pageCount` | Number of pages included in the package. |
| `fullPreviewUrl` | Optional external full-site preview URL. |

The catalog preview path is derived as `{slug}/preview.webp` and is not independently configurable.
The catalog may show Default as a non-importable label when required by the current Start Stackable product experience.
Default must not appear as a package slug.

## Package file

`library/src/site-kits/SITE_KIT_SLUG/meta.json` contains the complete portable Site Kit definition.
The package is JSON plus serialized Gutenberg block markup and package-local media files.
The machine-readable version 1 shape is [`../../src/site-kits/schema/site-kit-v1.schema.json`](../../src/site-kits/schema/site-kit-v1.schema.json).
The JSON Schema is authoritative for field types, required fields, allowed values, and nested entity shapes.
This contract remains authoritative for product behavior and cross-field rules that JSON Schema cannot express.

```json
{
  "version": 1,
  "slug": "consultant",
  "title": "Consultant",
  "description": "A professional services website.",
  "plan": "free",
  "requires": {
    "stackable": ">=3.20.0",
    "theme": "start-stackable"
  },
  "theme": {
    "styleVariation": "indigo",
    "styles": {},
    "settings": {},
    "templates": [],
    "templateParts": [],
    "headerPart": "header-transparent",
    "footerPart": "footer",
    "headerFlags": {
      "sticky": true,
      "transparent": true
    }
  },
  "site": {
    "showOnFront": "page",
    "frontPage": "home",
    "postsPage": null
  },
  "pages": [
    {
      "slug": "home",
      "title": "Home",
      "status": "publish",
      "template": "full-width",
      "content": "<!-- wp:stackable/hero ... -->",
      "meta": {}
    }
  ],
  "menu": {
    "location": "primary",
    "items": [
      {
        "page": "home",
        "label": "Home"
      }
    ],
    "entities": []
  },
  "patterns": [],
  "stackable": {
    "designSystem": {
      "colors": {},
      "colorSchemes": {},
      "typography": {},
      "spacing": {}
    },
    "settings": {}
  },
  "plugins": [],
  "media": []
}
```

### Package field rules

| Field | Rule |
| --- | --- |
| `version` | Integer package version. The importer rejects unknown major versions. |
| `slug` | Must match the package directory and catalog key. |
| `plan` | Must match the catalog entry. |
| `requires.theme` | Must be `start-stackable` for the first implementation. Apply is blocked until that theme is active. |
| `theme.styleVariation` | Optional Start Stackable style variation slug. It is applied before `theme.styles`. |
| `theme.styles` | Optional user Global Styles overlay for the Site Kit. |
| `theme.settings` | Portable FSE settings that are safe to apply to Start Stackable. |
| `theme.templates` | User-created or customized `wp_template` entities needed by the kit. |
| `theme.templateParts` | User-created or customized `wp_template_part` entities needed by the kit. |
| `theme.headerPart` and `theme.footerPart` | Template part slugs from the Start Stackable shell contract. |
| `theme.headerFlags` | Supported Start Stackable shell flags, including `sticky` and `transparent`. |
| `site` | Allowlisted website settings such as static front page and posts page. |
| `pages` | Pages and their serialized Gutenberg content. |
| `pages[].meta` | Only portable, explicitly allowlisted post metadata. |
| `pages[].template` | `full-width`, `page`, or `blank`. Marketing pages default to `full-width`. |
| `menu` | Menu location, page items, and block-navigation entities required by the imported templates. |
| `patterns` | Optional user patterns required by the kit. |
| `stackable.designSystem` | Maps onto existing Stackable Global Settings options. It must not create a second design-system store. |
| `stackable.settings` | Portable Stackable plugin settings included by the exporter allowlist. |
| `plugins` | Required or recommended plugins plus portable settings supplied by registered adapters. |
| `media` | Package media manifest. Every entry points to a file within the Site Kit directory. |

Token slugs in theme styles and Stackable design-system data must match the Start Stackable and Stackable token contracts.
Do not invent a parallel token vocabulary.

## Media contract

Package content may reference only package-relative media paths or stable media manifest identifiers.
The importer resolves those references against the package directory, downloads each selected asset, creates a WordPress attachment, and rewrites block content and metadata to the new local attachment URL or ID.
Block attributes that store attachment IDs use a temporary `stkSiteKitMediaIds` map keyed by the original block attribute name.
The exporter removes the source attachment ID, and the importer restores that block attribute with the new local attachment ID before saving content.
The same token map is used inside portable Global Block Style attributes.
Only known media attributes are converted, so unrelated numeric block attributes remain unchanged.
Re-import reuses an owned attachment only when its stored content hash matches the package file.
When the bytes change under the same media identifier, the importer creates and uses a new attachment instead of silently retaining stale media.
The importer must reject paths that escape the Site Kit directory.
The importer must report missing or unsupported media before changing the site.

Media entries include enough information to preserve portable metadata.

```json
{
  "id": "hero-office",
  "path": "assets/hero-office.webp",
  "mimeType": "image/webp",
  "title": "Office team",
  "alt": "A team working together in an office",
  "caption": ""
}
```

## Plugin data contract

The exporter must not dump arbitrary WordPress options.
Plugin data can contain credentials, account identifiers, filesystem paths, and other private or machine-specific information.
Each supported plugin must register an adapter that declares its portable settings, sanitization, redaction, validation, export, and import behavior.
An import-capable adapter captures its settings state during preflight and restores that snapshot when a later import operation fails.
`Stackable_Site_Kit_Plugin_Import_Adapter` defines `validate_import_settings()`, `snapshot_import_settings()`, `import_settings()`, and `restore_import_settings()` so validation, application, and rollback remain adapter-owned.
Plugins without an adapter may still be listed as active or recommended, but their settings are omitted with a validation warning.
Plugin slugs use the WordPress plugin basename, including the `.php` suffix for single-file plugins.

```json
{
  "slug": "example-plugin/example-plugin.php",
  "name": "Example Plugin",
  "required": false,
  "version": "1.2.3",
  "settings": {}
}
```

## Development exporter

The Site Kit exporter is the first implementation milestone.
It is available only when `WP_ENV` is explicitly defined as `development`.

```php
define( 'WP_ENV', 'development' );
```

The export UI lives under Stackable > Settings and is hidden in every other environment.
The export request requires `manage_options` and a valid nonce.
The exporter packages the current WordPress site as one complete Site Kit directory.

The exporter collects:

- FSE settings and user Global Styles.
- Theme templates and template parts.
- Allowlisted website settings, including the front page.
- Pages, serialized block content, and allowlisted post metadata.
- Navigation entities used by the exported site.
- Referenced media files and portable media metadata.
- Active plugin identities and adapter-provided settings.
- Stackable settings, design-system data, and color schemes.

The exporter validates the package before download.
Validation reports missing media, external media that would remain hotlinked, unsupported blocks, unsupported plugin settings, invalid slugs, incompatible theme data, and schema errors.
The exporter produces the kit directory and `meta.json`.
A curator may add or replace `preview.webp` before publishing because the exporter is not required to capture a browser screenshot.

Export uses two server requests.
`POST /stackable/v3/site-kits/export` builds and validates the current package, then returns validation warnings and a short-lived, single-use download URL.
The download URL targets the `stackable_site_kit_export_download` admin-post action and includes its own nonce.
The download action consumes the token, rebuilds and revalidates the package, writes the ZIP to a WordPress temporary path, streams it, and deletes it immediately.
No archive is stored while a developer reviews validation results, and an abandoned validation token expires without leaving a ZIP behind.

The exporter core lives under `src/site-kits/export/` and is loaded only when `WP_ENV` is explicitly `development`.
`stackable_create_site_kit_exporter()` creates a fresh exporter with focused collectors for theme data, website settings, pages, navigation, patterns, Stackable settings, plugins, and media.
Each export must use a fresh collector state so repeated requests do not retain media or warnings from an earlier package.

The ZIP archive contains `meta.json` and `assets/` at its root.
This lets a Site Kit author extract the archive directly into `library/src/site-kits/SITE_KIT_SLUG/`.
The writer uses `ZipArchive` when available and WordPress's bundled PclZip implementation as the fallback.

Local attachment URLs are rewritten to `assets/...` paths and copied into the archive.
Navigation blocks that reference pages replace source-site post IDs and URLs with the `stkSiteKitPage` page-slug token.
The importer resolves that token after package pages have been upserted.
Template navigation blocks replace source `ref` IDs with `stkSiteKitNavigation` navigation-slug tokens.
The importer resolves those tokens after package navigation entities have been upserted.
Synced pattern blocks replace source `ref` IDs with `stkSiteKitPattern` pattern-slug tokens.
The importer resolves those tokens after package patterns have been upserted.
Package entity identifiers use the schema slug grammar even when the source WordPress slug is empty, encoded, or contains unsupported characters.

Plugins register export adapters through `stackable_site_kit_export_plugin_adapters`.
The filter returns an array keyed by plugin basename, and every value implements `Stackable_Site_Kit_Plugin_Adapter`.
Adapter data is passed through the portable-data redactor before it enters `plugins[].settings`.
Credentials, tokens, secrets, and private keys are omitted with warnings even when an adapter returns them.
Stackable Global Block Styles export their names, slugs, attributes, and non-CSS attributes.
Generated `saveCss` and `editCss` values are omitted and must be regenerated by the importer.
Global Block Styles regeneration is provided through `stackable_site_kit_import_block_styles`.
The premium admin bundle extends target-side regeneration through `stackable.site-kits.block-style-generators` for premium-only blocks.
The importer rejects those styles instead of saving incomplete CSS when no generator is registered.

The exporter exposes narrow filters for Start Stackable and future integrations:

- `stackable_site_kit_export_style_variation` selects the exported style variation slug.
- `stackable_site_kit_export_header_part` and `stackable_site_kit_export_footer_part` select shell part slugs.
- `stackable_site_kit_export_sticky_header` and `stackable_site_kit_export_transparent_header` supply shell flags.
- `stackable_site_kit_export_page_meta_keys` allowlists portable page metadata.
- `stackable_site_kit_export_stackable_option_names` extends the Stackable option allowlist.

## Development importer and round trip

The development importer is the next end-to-end capability after export.
Its UI lives beside the Site Kit export control under Stackable > Settings and is available only when `WP_ENV` is explicitly defined as `development`.
The upload request requires `manage_options`, the capabilities needed by the requested import operations, and a valid nonce.

The development UI accepts a Site Kit ZIP and submits a complete import plan.
It calls the same importer orchestration that the later picker Apply route uses.
There must not be separate development and picker importer implementations.
The UI first sends the ZIP to the preparation route so the target Stackable build can regenerate portable Global Block Styles without storing generated CSS in the package.
It then sends the same ZIP, the complete plan, and the regenerated styles to the shared importer.
The importer verifies that the portable style fields are unchanged and rejects unsafe generated CSS before writing settings.

Before any site write, the server safely extracts and validates the package.
It rejects path traversal, symbolic links, unknown files, oversized input, malformed archives, unsupported schema versions, and all other package validation errors.
It requires Start Stackable to be active and completes the normal importer preflight before applying the package.
Temporary files are removed after success or failure.
An invalid package or failed preflight causes no site writes.
Import selections must explicitly use `complete` or `partial` mode.
Missing and invalid modes are rejected instead of expanding to a complete import.

Round-trip coverage exports a representative site, imports the generated ZIP into a clean site, and compares the portable result.
The comparison covers pages, theme and FSE data, navigation, website settings, Stackable design data, supported plugin settings, and locally imported media.
The imported result must not retain source-site post IDs, attachment IDs, absolute source URLs, credentials, or machine-specific paths.
This round trip must pass before catalog and picker implementation begins.

## Package validation

The validator lives at `tools/site-kits/validate-package.js`.
It validates the JSON Schema plus package rules that require directory and file-system context.

Run it with:

```bash
npm run validate:site-kit -- path/to/SITE_KIT_SLUG
```

The validator reports stable error codes for automation and human-readable messages for Site Kit authors.
It rejects unknown versions, schema violations, directory-slug mismatches, unsafe package paths, missing media files, duplicate identifiers, invalid page or media references, unlisted package media, and external media URLs.

The canonical export fixture is `e2e/config/fixtures/site-kits/valid/consultant/`.
Invalid mutation fixtures and their expected error codes are in `e2e/config/fixtures/site-kits/invalid-cases.json`.
The export validator does not require `preview.webp` because a curator may add or replace that screenshot before publication.
The Design Library publication validator added in milestone 6 must require the fixed preview filename.

## Picker and preview contract

The Site Kits page appears directly below Getting Started in the Stackable admin navigation.
Catalog cards use homepage screenshots and the same premium indicator language as the Design Library.
Selecting a Site Kit opens a detail screen with page thumbnails and the homepage selected by default.
The large preview contains only the currently selected page preview.
Preview rendering should deepen the existing Design Library preview machinery where that machinery satisfies the Site Kit requirements.

The detail sidebar shows Site Kit information followed by a **Color Scheme** picker.
The UI must not label this control as **Design System**.
Changing a color scheme updates both the page thumbnails and the large preview without saving site options.
Customize exposes editable color-scheme fields and updates the previews as values change.
The complete design-system payload remains part of export and import even when the first picker UI edits only color schemes.
All users may preview package color schemes.
Persisting premium Global Design System data during Apply follows the existing premium gate.

## Start Stackable requirement

The catalog and previews work when Start Stackable is missing or inactive.
Apply remains unavailable until Start Stackable is active.

The UI distinguishes these states:

- Active: Apply can continue.
- Installed but inactive: offer Activate.
- Missing: offer Install and Activate.
- Insufficient capability: explain that an administrator must complete the action.

The requirement banner and modal reuse the same content component.
The Apply action may look disabled, but it must remain operable enough to open the explanatory modal for pointer and keyboard users.
After successful installation or activation, the page refreshes and rechecks theme state.

## Apply modes and selection groups

The apply modal supports complete and partial application.
All groups are selected by default.

Complete apply selects every available group and makes the Site Kit the active site presentation.
It upserts kit-owned content, replaces the active homepage and selected presentation settings, and applies the package templates and design data.
It does not delete unrelated posts, media, or other content because the master design does not explicitly require destructive deletion.

Partial apply lets the user select these groups:

- Pages and content.
- Theme templates and template parts.
- Navigation and website settings.
- Stackable design system and color schemes.
- Plugins, enumerated individually.
- Supported plugin settings, nested under their plugin.

Media follows the selected content that references it and is not independently deselectable when that would leave a hotlink or broken reference.
The UI must explain dependencies and prevent invalid combinations.

## Import order and rollback

The importer performs a complete preflight before changing the site.
It validates the package version, permissions, active theme, entitlement, selected groups, media, required blocks, and plugin availability.

When selected, the importer applies data in this order:

1. Record the intended changes and the current values needed for rollback.
2. Install and activate selected plugins.
3. Import media and create the package-to-attachment map.
4. Apply theme variation, FSE settings, Global Styles, templates, template parts, and shell flags.
5. Write Stackable design-system data through existing Global Settings options.
6. Upsert pages by `stk_site_kit` and `stk_site_kit_page` post meta.
7. Import navigation and connect page references.
8. Apply allowlisted website and plugin settings.
9. Set the static front page and posts page.
10. Flush Stackable generated CSS and related caches.

If a selected operation fails, the importer rolls back completed operations where WordPress supports reversal and returns a clear error for anything that could not be restored.
Re-importing the same slug updates its existing kit-owned pages and navigation.
It must not create `Home (2)` or duplicate menus indefinitely.
Classic menus are located by their `stk_site_kit` ownership metadata rather than their display title.
Kit-owned menu items omitted by a later package are removed from the active menu during re-import.

## REST API

Route names may follow existing Stackable v3 conventions.

| Method | Path | Job |
| --- | --- | --- |
| `GET` | `/stackable/v3/site-kits` | Return the catalog and current theme requirement state. |
| `GET` | `/stackable/v3/site-kits/{slug}` | Return the validated package for preview. Reject `default`. |
| `POST` | `/stackable/v3/site-kits/export` | Build a development-only export after capability and nonce checks. |
| `POST` | `/stackable/v3/site-kits/import/prepare` | Validate a development ZIP and return portable Global Block Styles for target-side regeneration. |
| `POST` | `/stackable/v3/site-kits/import` | Validate and import a development-only uploaded ZIP through the shared importer. |
| `POST` | `/stackable/v3/site-kits/{slug}/import` | Preflight and apply selected package groups. Reject `default`. |

Catalog and package preview require `edit_pages`.
Free may list and preview premium entries, but the server must enforce entitlement during Apply.
Export requires `manage_options` and the development environment gate.
The development import route also requires `manage_options`, a valid nonce, and the development environment gate.
Both import routes call the same importer orchestration.
Import requires `edit_theme_options`, `edit_pages`, and any additional capabilities needed for selected plugin or theme actions.
Theme installation requires `install_themes`, and activation requires `switch_themes`.

## Ownership

| Write or behavior | Owner |
| --- | --- |
| Export, catalog, preview, color-scheme editing, install or activate flow, and import | Stackable plugin |
| Source packages and catalog data | Stackable Design Library repository |
| Pages, navigation, front page, page templates, and media attachments | Stackable plugin importer |
| Stackable Global Design System options | Stackable plugin through the existing settings store |
| Theme Global Styles, templates, template parts, and shell flags | Stackable plugin through supported WordPress and Start Stackable interfaces |
| Sticky and transparent header CSS | Start Stackable theme |
| Default look without an imported kit | Start Stackable theme |
