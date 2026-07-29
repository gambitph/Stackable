# E2E Testing

Stackable's end-to-end testing aims to test the high-level functions of the
plugin in order to quickly assess whether everything is in working condition.

Our goal is to have this run in every Github pull request, and for RC builds.

At the minimum, e2e testing should test the following:
- Plugin's admin pages are intact
- Plugin's licensing functionality is working (for Premium codebase only)
- Blocks are present in the Block Editor and working
- Blocks are present in the Site Editor
- Global settings and functionality is working
- Design Library opens, loads patterns/pages, filters, and inserts designs
- Dynamic Content resolves on the frontend (Premium codebase only)
- Perform the above tests in all supported lower WordPress versions

Ideally, we should also handle these:
- Blocks / content from old plugin versions to this new one do not show errors
  in editor
- Blocks / content from old plugin versions to this new one look identical in
  the frontend

Github workflow should also test:
- Different WP versions that we support
- Different PHP versions that we support

# Usage

Copy the example env file in the free plugin root, then edit values:

```bash
cp .env.example .env
```

See `.env.example` for all variables. For Local by Flywheel, use your site’s
real URL (often `https://yoursite.local`). Playwright is configured with
`ignoreHTTPSErrors` for Local’s self-signed cert. Leave `WP_TEST_POSTID`
unset locally to skip `existing-blocks.spec.ts` (CI creates that post).

In Freemius, make sure the license key is:
- new
- lifetime unlimited quota
- has an owner
- non-blocking and white-labeled

Run this command to run e2e:

```bash
npm run test:debug
```

or without the UI:

```bash
npm run test
```

# Dynamic Content (Premium)

Premium Dynamic Content tests live in
`pro__premium_only/e2e/tests/dynamic-content.spec.ts`.

The post-meta test needs this must-use plugin so `stk_e2e_dc_meta` is available
over the REST API:

`e2e/config/stackable-e2e-mu-plugin.php`

Premium CI maps it into wp-env automatically. For local wp-env, add:

```json
"mappings": {
  "wp-content/mu-plugins/stackable-e2e.php": "./e2e/config/stackable-e2e-mu-plugin.php"
}
```

For a non-wp-env site (e.g. local.local), copy or symlink that file into
`wp-content/mu-plugins/stackable-e2e.php`.

# Dev Notes

- Our main basis: https://github.com/meszarosrob/wordpress-e2e-playwright-intro-2023
- Gutenberg e2e Github workflow: https://github.com/WordPress/gutenberg/blob/trunk/.github/workflows/end2end-test.yml
