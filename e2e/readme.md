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

Create an `.env` file in the root directory of the plugin with the contents:

```
WP_BASE_URL=http://local.local/
WP_AUTH_STORAGE=wp-auth.json
WP_USERNAME=admin
WP_PASSWORD=password
```

Run this command to run e2e:

```bash
npm run test:debug
```

or without the UI:

```bash
npm run test
```

# Dev Notes

- Our main basis: https://github.com/meszarosrob/wordpress-e2e-playwright-intro-2023
- Gutenberg e2e Github workflow: https://github.com/WordPress/gutenberg/blob/trunk/.github/workflows/end2end-test.yml
