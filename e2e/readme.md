# E2E Testing

Stackable's end-to-end tests verify admin pages, block editor flows, global
settings, Design Library, and (premium suite) Dynamic Content / premium settings.

WordPress is provided by [`@wp-playground/cli`](https://www.npmjs.com/package/@wp-playground/cli)
(WASM PHP + SQLite, **no Docker**). Playwright's `webServer` boots it
automatically before the suite runs.

## Prerequisites

Just Node **20+** - no Docker, Composer, Local WP, or `.env` file.

For **premium** specs you also need `pro__premium_only/` checked out under
the free plugin root (clone `bfintal/Stackable-Premium` into that directory).
Playground mounts the plugin tree as a real directory, so a symlink that
points outside the mount will not expose premium files inside WASM PHP.

## Usage

### Free suite

Build plugin assets first (Playground mounts this repo; enqueue needs `dist/`):

```bash
npm run build:e2e
```

Run free e2e tests (Playground starts on port `9420` if nothing is already listening):

```bash
npm run test:e2e
```

or with the Playwright UI:

```bash
npm run test:debug
```

### Premium suite

```bash
# Mount premium (once), e.g.:
# git clone git@github.com:bfintal/Stackable-Premium.git pro__premium_only

npm run build:e2e:premium
npm run test:e2e:premium
```

or with the Playwright UI:

```bash
npm run test:debug:premium
```

Premium uses port `9421`, `playwright.premium.config.js`, and the shared
`e2e/playground-blueprint.json`. It mounts:

- `e2e/config/stackable-e2e-mu-plugin.php` (Dynamic Content post meta for REST;
  Design Library CDN fixtures via `pre_http_request`)
- `pro__premium_only/e2e/mu-plugins/stackable-e2e-mock-premium.php` (injects a
  Freemius in-memory license, exits Freemius activation/opt-in mode, and
  suppresses the post-activation admin redirect so Settings stays registered
  and REST `rest-nonce` is not poisoned with Getting Started HTML)

After premium builds, restore the free build type if you need free packaging:

```bash
node ./tools/update-build-type.js free
```

Locally, Playwright reuses an already-running Playground on the suite's port
when present (fast repeat runs). In CI it always boots fresh. If a stale
instance is misbehaving after editing PHP/JS that Playground mounted at boot,
kill whatever is listening on that port and re-run.

Optional overrides:

```
WP_PORT=9420
WP_BASE_URL=http://127.0.0.1:9420
WP_PHP_VERSION=8.2
WP_VERSION=latest
WP_USERNAME=admin
WP_PASSWORD=password
STACKABLE_SLUG=stackable/plugin
```

## CI

| Repo | Workflow | Suites |
|------|----------|--------|
| Free (`gambitph/Stackable`) | `.github/workflows/e2e-tests.yml` | Free matrix (`build:e2e` → `test:e2e`) |
| Premium (`bfintal/Stackable-Premium`) | `pro__premium_only/.github/workflows/e2e-tests.yml` | Free then premium (checks out free as root + premium as `pro__premium_only/`) |

PHP/WP matrix cells are Playground `--php` / `--wp` values (major.minor).
`tools/playwright-test-matrix.js` syncs both workflow files.

## What is covered

### Free (`e2e/tests/`)

| Surface | Flow |
|---------|------|
| Admin | Activate redirects to Getting Started; settings save |
| Block editor | Insert Text block; inspector tabs; attribute updates |
| Global settings | Color / typography surfaces |
| Design Library | Open, load patterns, insert |
| Existing blocks | Fixture post from blueprint has no block validation errors |

### Premium (`pro__premium_only/e2e/tests/`)

| Surface | Flow |
|---------|------|
| Settings | Role Manager tab available when premium mock is mounted |
| Dynamic Content | Post title / meta / featured image resolve on the frontend |

## Files

| Path | Role |
| --- | --- |
| `../playwright.config.js` | Free suite; Playground on 9420 |
| `../playwright.premium.config.js` | Premium suite; Playground on 9421 |
| `playground-blueprint.json` | Shared login + activate Stackable + seed tours / existing-blocks post |
| `config/global-setup.js` | Cookie auth + write `e2e/.auth/test-env.json` |
| `config/stackable-e2e-mu-plugin.php` | DC post meta + Design Library CDN mock |
| `config/fixtures/design-library-*.json` | Mock patterns/pages served via `pre_http_request` |
| `test-utils/` | Shared fixtures |
| `tests/*.spec.ts` | Free browser specs |
| `../pro__premium_only/e2e/tests/*.spec.ts` | Premium browser specs |
| `../pro__premium_only/e2e/mu-plugins/stackable-e2e-mock-premium.php` | E2E-only Freemius license injection |
| `.auth/` | Gitignored; written by global setup |

## Troubleshooting

- **`browserType.launch: Executable doesn't exist`** - run
  `npx playwright install chromium` once per machine.
- **Stale plugin behaviour after editing PHP** - Playground snapshots the
  mount at boot. Stop the process on the suite port and re-run.
- **Design Library empty / CDN errors on a reused local server** - free suite
  mounts `stackable-e2e-mu-plugin.php` for CDN fixtures. A Playground started
  before that mount will not pick it up (`reuseExistingServer`). Kill the
  process on port `9420` (or set `CI=1`) and re-run. Specs also mock the
  Design Library REST responses in the browser as a fallback.
- **Settings / editor assets missing** - run `npm run build:e2e` (or
  `build:e2e:premium`) so `dist/` exists for enqueue.
- **Premium Role Manager / DC missing** - ensure `pro__premium_only/` is present,
  `STACKABLE_BUILD` is `premium`, and the mock MU-plugin is mounted. Kill any
  stale Playground on port `9421` so the blueprint re-runs.

## Dev Notes

- Pattern mirrors [Cimo e2e](https://github.com/gambitph/Cimo/tree/master/e2e)
  (Playground CLI + `@wordpress/e2e-test-utils-playwright`).
- Gutenberg e2e workflow: https://github.com/WordPress/gutenberg/blob/trunk/.github/workflows/end2end-test.yml
