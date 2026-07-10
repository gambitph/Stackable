# AGENTS.md

## Cursor Cloud specific instructions

Stackable is a WordPress Gutenberg block-library plugin. It only runs inside a WordPress install, so end-to-end testing needs a running WordPress with the built plugin activated.

### Environment (already provisioned in the VM snapshot)
- Node 22, PHP 8.3, Composer and Docker are installed. Dependencies (`node_modules`, Composer `vendor/` for `wp-cli/i18n-command`) are refreshed by the startup update script.
- Docker is required for the WordPress test environment (`@wordpress/env`) and for the Playwright e2e path. The Docker daemon is not managed by systemd here; if `docker ps` fails, start it with `sudo dockerd` (a background/tmux process) — configured for the `fuse-overlayfs` storage driver and `iptables-legacy`.

### Build / run / lint (see `package.json`, `README.MD`) — important gotchas
- Dev (watch): `npm run start` (webpack `--watch` + `gulp watch`). Intended dev workflow.
- Build for this public/free repo: use `npm run build:no-translate` (this is exactly what CI `plugin-build.yml` / `playwright.yml` run). Do NOT use `npm run build` here — it calls `build:translations`, which `cd`s into `pro__premium_only/` (a premium-only directory absent from this repo) and fails.
- Output: JS/CSS to `dist/`, packaged plugin to `build/stackable` + `build/stackable.zip`.
- Lint CSS: `npm run lint-css` (stylelint) — works. Lint JS: `npm run lint-js` currently CRASHES (`ESLint 7.32.0` `template-curly-spacing` "Cannot read properties of null" on `src/block/accordion/edit.js`), on both Node 18 and 22; this is a pre-existing pinned-toolchain bug and CI does not run `lint-js`.
- Unit tests: `npm run test:scripts` (wp-scripts jest) or legacy `npm run test:fast`. Playwright e2e (`npm run test`) needs a WordPress target configured via a root `.env` (see `e2e/readme.md`) and a Freemius license for premium/licensing tests.

### Shared WordPress dev environment (all three sibling plugins)
- A `wp-env` project lives at `/home/ubuntu/wp-dev` with a `.wp-env.json` that mounts Cimo, Interactions and Stackable (by absolute path) into one WordPress site. It is kept out of the repos on purpose.
- Start/stop: `cd /home/ubuntu/wp-dev && npx wp-env start` / `npx wp-env stop`. Run WP-CLI: `npx wp-env run cli wp <cmd>`.
- Site: http://localhost:8888/wp-admin (user `admin`, password `password`). wp-env auto-activates the mounted plugins on start.
- Hello-world check: create a post, open the inserter, add a Stackable block (e.g. Card), publish. Blocks require the built `dist/` assets to exist.
- After changing plugin source, rebuild assets (`npm run build:no-translate` or keep `npm run start` watching); wp-env serves the repo directory live, so no reinstall is needed.
