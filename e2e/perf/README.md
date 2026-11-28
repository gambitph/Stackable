# Frontend CSS checks (`e2e/perf`)

Correctness tests for how Stackable loads its frontend CSS: which stylesheets
load for which blocks, the legacy-CSS compatibility flag, option queries,
cascade order, `stackable_force_css_load`, and computed styles vs the legacy
bundle.

Unlike the Playground e2e suites, this drives a **local throwaway WordPress
site** (`php -S` + SQLite) because it needs to reset the database to a fresh
install, switch plugin builds and switch themes.

## Site

* `STK_PERF_WP_PATH` (default `<tmp>/stk-perf-ci/site`, what `ci/setup-site.sh` creates): a WordPress install with the
  SQLite drop-in, Twenty Twenty-Five and Twenty Twenty-One.
* `STK_PERF_SNAPSHOT`: the fresh-install SQLite DB restored before each spec.
* `STK_PERF_URL` (default `http://127.0.0.1:8896`): the specs start `php -S` there.
* `mu/stk-perf-test-hooks.php` is installed as a mu-plugin (metrics comment, a
  "without Stackable" request header, late/AJAX rendering hooks).

## Running

```
STK_PERF_PLUGIN=/path/to/built/plugin \
STK_PERF_LEGACY=off|on|release \      # new behavior | legacy flag on | old release (no flag)
STK_PERF_PREMIUM_MOCK=/path/to/stackable-e2e-mock-premium.php \   # Premium builds only
npm run test:perf
```

Or run the same path CI uses: `bash e2e/perf/ci/run.sh <plugin build> off`
(`STK_PERF_CI_DIR` for the site folder, `STK_PERF_URL` for another port).

| Spec | Covers |
|---|---|
| `frontend-assets.spec.js` | Per-scenario CSS: no Stackable CSS without blocks; only the blocks on the page; color schemes only when used; design system only when set; theme compatibility; late (after footer) and admin-ajax rendered blocks; `stackable_force_css_load`. |
| `gating-options.spec.js` | Fresh install vs upgrade from 3.20.3, the flag is autoloaded, turning it off sticks; Stackable's extra queries on a simple page, queries don't grow with block types; Stackable options are autoloaded. |
| `dom-styles.spec.js` | Number of Stackable `<style>`/`<link>` tags on the benchmark page. |
| `cascade-order.spec.js` | On real pages (block + classic theme, late rendering) the rules on the page keep the canonical stylesheet order. |
| `legacy-identical.spec.js` | With the legacy flag on the output is identical to the old release (record the reference with `STK_PERF_LEGACY=release STK_PERF_REF_WRITE=1`). |
| `premium.spec.js` | Premium: block stylesheet handles, Premium CSS only for its blocks, no Freemius queries on the frontend, dynamic content and conditional display. |
| `freemius-cache.spec.js` | Premium (with the e2e license mock): the frontend license cache follows license activation / deactivation and admin page loads on the next request. |
| `visual-compare.spec.js` | Computed styles of every element with the new loading vs the legacy bundle, same site and markup (TT5 + TT1, 1440/768/375, color schemes + custom breakpoints). Catches rules a block's stylesheet has for other blocks' markup. |
| `force-load.spec.js` | `stackable_force_css_load`: Stackable markup added by a script after load (`?stk_inject`), blocks rendered late, custom breakpoints and color schemes (with and without a base scheme) are styled the same as with the legacy bundle. |
| `lazy-php.spec.js` | Editor-only PHP is not loaded on the frontend. |

## CI

`.github/workflows/e2e-tests.yml` (job `frontend-css`, legacy flag off and on)
runs `e2e/perf/ci/run.sh build/stackable <off|on>`:

* `ci/setup-site.sh` makes the site (WordPress 6.8.3 + SQLite, TT5 + TT1, WP-CLI)
  and the snapshot.
* `off`: the static CSS order check (`visual/run-css-order.js`), then `test:perf`,
  then the performance budget (`ci/budget-check.js`).
* `on`: records the output of the last release from WordPress.org for
  `legacy-identical.spec.js` (`STK_PERF_RELEASE`, default 3.20.3; the stylesheets
  are compared as sets of rules because the release's rule order wasn't fixed),
  then `test:perf`, then the performance budget.

## Performance budget (`ci/budget-check.js`)

A short HTTP-only check (no browser) on the 4-block benchmark page. It fails
if Stackable's CSS bytes, inline `<style>` bytes, JS bytes, extra database
queries, or extra DOM nodes go over a limit. Typical run: about 2.5–3 seconds
(one site reset and a few fetches).

The limits live in `DEFAULT_BUDGETS` inside `ci/budget-check.js`. If a change
legitimately needs more CSS, JS, queries, or DOM, raise the matching number
there and say why in the commit. Do not raise a budget only to make CI green.

| Mode | CSS | Inline `<style>` | JS | Queries over core | DOM nodes over core |
|---|---:|---:|---:|---:|---:|
| New loading (legacy flag off) | 28 kB | 28 kB | 4 kB | +3 | +12 |
| Legacy loading (flag on) | 130 kB | 8 kB | 8 kB | +3 | +16 |

On this branch the measured values were about 21 kB CSS (all of it inline) and
1.7 kB JS (the injected-block loader), +1 query and +3 DOM nodes (flag off);
flag on is about 109 kB CSS, 3.6 kB inline, no loader, +1 query and +5 DOM
nodes. Override one limit while debugging with `STK_BUDGET_CSS`,
`STK_BUDGET_INLINE`, `STK_BUDGET_JS`, `STK_BUDGET_QUERIES` or `STK_BUDGET_DOM`.

`npm run test:perf:css-order -- <pluginDir> --legacy=<release dist> [--premium]`
checks the split stylesheets against the legacy bundle (missing rules and order
flips that can conflict), allowing the reviewed changes in `known-order-changes.json`.
