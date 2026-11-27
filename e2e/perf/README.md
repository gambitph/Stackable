# Frontend performance suite (`e2e/perf`)

Tests for how Stackable loads its frontend CSS and what that costs on a page
view: which stylesheets load for which blocks, the legacy-CSS compatibility flag,
options/queries, DOM nodes, cascade order, and a DynamicWP-style budget.

Unlike the Playground e2e suites, this drives a **local throwaway WordPress site**
(`php -S` + SQLite) because it needs to reset the database to a fresh install,
switch plugin builds, switch themes and measure memory/queries.

## Site

* `STK_PERF_WP_PATH` (default `/workspace/perf-site`): a WordPress install with the
  SQLite drop-in, Twenty Twenty-Five and Twenty Twenty-One.
* `STK_PERF_SNAPSHOT`: the fresh-install SQLite DB restored before each spec.
* `STK_PERF_URL` (default `http://127.0.0.1:8896`): the specs start `php -S` there.
* `mu/stk-perf-test-hooks.php` is installed as a mu-plugin (metrics comment, a
  "without Stackable" request header, late/AJAX rendering hooks).

## Running

```
STK_PERF_PLUGIN=/path/to/built/plugin \
STK_PERF_LEGACY=off|on|release \      # new behavior | legacy flag on | old release (no flag)
STK_PERF_OPCACHE=0 \                  # 0 = article-comparable memory numbers
STK_PERF_PREMIUM_MOCK=/path/to/stackable-e2e-mock-premium.php \   # Premium builds only
npm run test:perf
```

| Spec | Covers |
|---|---|
| `frontend-assets.spec.js` | Per-scenario CSS: no Stackable CSS without blocks; only the blocks on the page; color schemes only when used; design system only when set; theme compatibility; late (after footer) and admin-ajax rendered blocks; `stackable_force_css_load`. |
| `gating-options.spec.js` | Fresh install vs upgrade from 3.20.3, the flag is autoloaded, turning it off sticks; Stackable's extra queries on a simple page (budget), queries don't grow with block types; Stackable options are autoloaded. |
| `dom-styles.spec.js` | Number of Stackable `<style>`/`<link>` tags and DOM nodes over core on the benchmark page. |
| `cascade-order.spec.js` | On real pages (block + classic theme, late rendering) the rules on the page keep the canonical stylesheet order. |
| `legacy-identical.spec.js` | With the legacy flag on the output is identical to the old release (record the reference with `STK_PERF_LEGACY=release STK_PERF_REF_WRITE=1`). |
| `benchmark-budget.spec.js` | DynamicWP method (page size, queries, DOM, peak memory) vs the core-blocks page without Stackable; budgets via `STK_PERF_BUDGET_*`. |
| `premium.spec.js` | Premium: block stylesheet handles, Premium CSS only for its blocks, no Freemius queries on the frontend, memory. |

## Visual / computed-style regression (`visual/`)

`npm run test:perf:visual -- <outDir>` captures the 36 targets of the regression
site (Twenty Twenty-Five, Twenty Twenty-One, custom breakpoints; 1440/768/375)
and compares them with a baseline capture. Computed styles are the pass/fail
signal; pixel diffs are reported only (animations make them noisy). With
`STK_PERF_LEGACY=on` the Stackable asset list must also match the baseline.

`npm run test:perf:css-order -- <pluginDir> --legacy=<release dist> [--premium]`
checks the split stylesheets against the legacy bundle (missing rules and order
flips that can conflict), allowing the reviewed changes in `known-order-changes.json`.
