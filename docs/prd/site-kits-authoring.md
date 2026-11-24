# Site Kit authoring quick guide

This is the temporary MVP workflow for developers creating and testing Site Kit packages.
It will be expanded before the Site Kits MVP is finished.

## Setup

Use a development WordPress site with the current Stackable build.
Add this to `wp-config.php` before the stop-editing comment:

```php
define( 'WP_ENV', 'development' );
```

Use a second clean WordPress site for import testing.
Enable the same setting there, install Stackable, and activate the Start Stackable theme.

## Export a Site Kit

1. Build the source site with the pages, local media, and Stackable settings needed by the Site Kit.
2. Open **Stackable > Settings > Import/Export**.
3. Under **Site Kit Export**, enter the slug, title, plan, and description.
4. Click **Validate Site Kit** and review any warnings.
5. Click **Download Site Kit** when validation passes.

The ZIP contains `meta.json` and an `assets/` directory.

## Validate the package

Extract the ZIP into a directory whose name matches the Site Kit slug.
From the Stackable repository, run:

```bash
npm run validate:site-kit -- path/to/SITE_KIT_SLUG
```

Do not publish or hand off a package while this command reports errors.

## Import and test the Site Kit

1. Open the clean target site.
2. Confirm that Start Stackable is the active theme.
3. Open **Stackable > Settings > Import/Export**.
4. Under **Site Kit Import**, click **Choose Site Kit ZIP**.
5. Select the exported ZIP and wait for the success message.
6. Check the imported pages, block content, media, URLs, and Stackable settings.
7. Confirm that imported images use the target site URL and do not use source attachment IDs.

The current development uploader always performs a complete import.

## Current MVP limits

For now, use this workflow for page-based Site Kits with local media and simple Global Block Styles.
Custom FSE templates, header and footer selection, sticky or transparent header flags, plugin settings, image-based Global Block Styles, and complete re-import synchronization still need the fixes recorded for the next correction pass.

The package contract is documented in [`site-kits.CONTRACT.md`](./site-kits.CONTRACT.md).
