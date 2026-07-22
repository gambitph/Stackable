# PostHog setup report

PostHog is initialized in the Gutenberg editor (`src/blocks.js`) and the admin settings page (`src/welcome/admin.js` → `getting-started.js`) via a shared `src/posthog.js` module. Identity is **per install** (opaque UUID in WP options), not per WordPress user and not the Site Address — so localhost clones don’t collide. Environment variables (`POSTHOG_TOKEN`, `POSTHOG_HOST`) are injected at build time via webpack into both JS and `src/posthog-config.php` (gitignored).

Events are intentionally sparse so free-tier quota lasts, while still supporting three outcome cohorts: **Converted** (free → premium), **Retained** (still active at 30/90/180/365 days), and **Churned** (deactivated/uninstalled).

## Events

| Event name | Description | Properties | Where |
|---|---|---|---|
| `plugin_activated` | Stackable was activated | — | Queued in PHP on activation; fired from JS on next admin/editor load |
| `plugin_deactivated` | Stackable was deactivated | — | PHP Capture API on deactivation (`src/posthog.php`) |
| `premium_plugin_activated` | Premium Stackable was activated (upgrade signal) | — | Queued with `plugin_activated` when `STACKABLE_BUILD === 'premium'` |
| `first_stackable_content` | First time any `stackable/*` block appears (once ever) | `source`: `editor` \| `design_library` \| `publish` | Editor subscribe (`src/plugins/posthog-first-content.js`), Design Library insert, or first publish with Stackable content |
| `stackable_page_published` | Milestone when distinct published pages with Stackable content hit 1, then every 5 (5, 10, 15…) | `milestone`, `stackable_published_pages` | PHP `save_post` (`src/posthog.php`) |
| `design_library_inserted` | User inserted a design from the Design Library | `tab`, `count` | `src/lazy-components/design-library/index.js` |
| `premium_interest` | Clicked Get Premium / Learn More / Unlock on an upsell | `feature` (e.g. `motion-effects`) | `src/components/pro-control/index.js`, Getting Started Unlock CTAs |
| `guided_tour_started` | User started a guided tour | `tour` | `src/lazy-components/modal-tour/index.js` |
| `guided_tour_completed` | User finished all steps of a guided tour | `tour` | `src/lazy-components/modal-tour/index.js` |
| `global_settings_edited` | A Design System panel was edited | `panel` (e.g. `typography`) | Pooled once per panel per page load across global settings save paths |

### Identity

| Field | Value |
|---|---|
| PostHog `distinct_id` | Opaque install UUID (`stackable_posthog_install_id` option), created once per install |
| Person/event prop `install_id` | Same UUID |
| Person/event prop `site_address` | Normalized WP Site Address (`home_url`) — metadata only, not the id |

JS and PHP use the same install UUID so editor events and server events (publish, deactivate) join on one install. Local sites sharing `localhost` / `local.local` stay independent. Changing Site Address does not split the person.

JS bootstraps `distinctID` + `isIdentifiedID: true` at `posthog.init` (no `identify()` — that would send `$identify`). Automatic SDK events are disabled (pageview, pageleave, autocapture, rageclick, dead clicks, heatmaps, session recording, surveys, feature flags). Only explicit `captureEvent()` / PHP Capture API calls send data. Person props update via `$set` on those captures.

### Person properties (`$set` / `$set_once`)

Synced on captures from PHP context + local flags:

| Property | Meaning |
|---|---|
| `install_id` | Opaque install UUID |
| `site_address` | WP Site Address (URL), for filtering/debugging |
| `build` | `free` \| `premium` |
| `stackable_published_pages` | Count of distinct published posts with Stackable blocks |
| `stackable_published_milestone` | Last fired publish milestone (0, 1, 5, 10…) |
| `has_first_stackable_content` | Ever created Stackable content |
| `has_design_library_insert` | Ever inserted from Design Library |
| `first_stackable_content_source` | `$set_once`: `editor` \| `design_library` \| `publish` |

Not sent: WordPress user ID, name, email, or username.

One-time PHP backfill seeds published-page IDs + milestone **without** firing historical `stackable_page_published` events.

Not tracked (by design): block inserts, Design Library opens/tab changes, editor opens, competitor detection — these would burn free-tier events without improving the three-cohort comparison.

## Dashboards

| Dashboard | Purpose |
|---|---|
| [Stackable cohort outcomes (wizard)](https://us.posthog.com/project/518160/dashboard/1869197) | Activations, upgrades, churn, interest, tours, Design Library, global settings |
| [Stackable conversion paths (wizard)](https://us.posthog.com/project/518160/dashboard/1870844) | What converters did before `premium_plugin_activated` |
| [Stackable retention thresholds (wizard)](https://us.posthog.com/project/518160/dashboard/1870842) | First content / Design Library / publish as retention thresholds |
| [Stackable churn typology (wizard)](https://us.posthog.com/project/518160/dashboard/1870843) | Type A/B/C churn proxies via person props + funnels |

### Conversion paths insights

| Insight | Purpose |
|---|---|
| [Path: activate → first content → premium](https://us.posthog.com/project/518160/insights/utFKM69e) | Core conversion path |
| [Path: activate → Design Library → premium](https://us.posthog.com/project/518160/insights/tnxUEtGo) | Design Library before upgrade |
| [Path: activate → published page → premium](https://us.posthog.com/project/518160/insights/zBDc9Qr1) | Publish depth before upgrade |
| [Path: premium interest → premium](https://us.posthog.com/project/518160/insights/2Z2mcRqg) | Upsell → paid |
| [First Stackable content](https://us.posthog.com/project/518160/insights/34ZQzwFa) | Leading indicator volume |
| [First content by source](https://us.posthog.com/project/518160/insights/qOMg4fGG) | editor vs design_library vs publish |
| [Published page milestones](https://us.posthog.com/project/518160/insights/UiFBC4lf) | Milestone distribution |

### Retention thresholds insights

| Insight | Purpose |
|---|---|
| [Retention: activate → first content](https://us.posthog.com/project/518160/insights/aRYeumSY) | Weekly retention to first content |
| [Retention: activate → Design Library](https://us.posthog.com/project/518160/insights/i2BP3CU8) | Weekly retention to Design Library |
| [Retention: activate → published page](https://us.posthog.com/project/518160/insights/NyQixGIl) | Weekly retention to publish milestone |
| [Threshold: activate → content → publish](https://us.posthog.com/project/518160/insights/1zqdd2KQ) | Depth funnel |

### Churn typology insights

| Insight | Purpose |
|---|---|
| [Churn: activate → deactivate](https://us.posthog.com/project/518160/insights/DAdb0aAf) | Overall churn funnel |
| [Type A proxy: never first content](https://us.posthog.com/project/518160/insights/dpwc30cr) | Deactivated without first content |
| [Type B proxy: content no publish](https://us.posthog.com/project/518160/insights/J89eEBZf) | First content, no publish, then churn |
| [Type C proxy: published then churn](https://us.posthog.com/project/518160/insights/AfeWnVg9) | Published then deactivated |

### Cohort outcomes insights (existing)

| Insight | Purpose |
|---|---|
| [Activations, deactivations & upgrades](https://us.posthog.com/project/518160/insights/7EI0gZos) | Primary outcomes over time |
| [Activation → premium conversion](https://us.posthog.com/project/518160/insights/qexBXZUt) | Converted cohort funnel |
| [Activation → churn](https://us.posthog.com/project/518160/insights/IjOgHT9k) | Churned cohort funnel |
| [Premium interest → upgrade](https://us.posthog.com/project/518160/insights/oMAXasDH) | Upsell → paid conversion |
| [Design Library inserts](https://us.posthog.com/project/518160/insights/eqZQfp4M) | Retention leading indicator (by `tab`) |
| [Premium interest by feature](https://us.posthog.com/project/518160/insights/57CVVxfw) | Which upsells get clicks |
| [Guided tour completion](https://us.posthog.com/project/518160/insights/khJkAZu7) | Onboarding engagement |
| [Global settings edited by panel](https://us.posthog.com/project/518160/insights/nqaP9wYR) | Design System depth (by `panel`) |

## Cohort analysis notes

Cohorts are **installs** (sites), not WP users.

- **Converted**: sites with `premium_plugin_activated` (often after `premium_interest` and/or first content / Design Library / publish).
- **Retained**: sites that cross thresholds (`first_stackable_content`, Design Library, publish milestones) and keep returning; no recent `plugin_deactivated`.
- **Churned**: sites with `plugin_deactivated`. Typology proxies use person props (`has_first_stackable_content`, `stackable_published_milestone`).

## Verify before merging

- [ ] Confirm `POSTHOG_TOKEN` / `POSTHOG_HOST` are set in `.env` and that `npm run start` / production build regenerates `src/posthog-config.php`.
- [ ] Confirm events appear under a person whose distinct ID is an install UUID (not a Site Address or user ID); `site_address` should appear as a person/event property.
- [ ] Activate/deactivate the plugin and confirm `plugin_activated` / `plugin_deactivated` appear in PostHog on the same install person.
- [ ] On a premium build, confirm `premium_plugin_activated` fires alongside `plugin_activated`.
- [ ] Add a Stackable block in the editor and confirm one `first_stackable_content` (`source: editor`); reload and confirm it does not fire again.
- [ ] Publish a page with Stackable content and confirm `stackable_page_published` at milestone `1` (and later at 5, 10…).
- [ ] Edit each global settings panel twice and confirm only one `global_settings_edited` per panel per page load.
- [ ] Insert a Design Library design and click a Get Premium / Learn More upsell; confirm those events land.
