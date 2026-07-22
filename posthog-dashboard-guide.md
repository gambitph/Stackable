# PostHog dashboard guide

How to use Stackable’s PostHog dashboards to learn how to:

1. Get installers to keep using Stackable (not uninstall)
2. Get free users to upgrade to premium

Unit of analysis is an **install** (opaque UUID per WordPress install), not a WordPress user. `site_address` is metadata for filtering/debugging. Read charts as “how many installs…”. Wait until you have enough real installs — empty or test-only data will mislead.

See also: [posthog-setup-report.md](./posthog-setup-report.md) for events, identity, and instrumentation.

## Dashboards

| Dashboard | Purpose |
|---|---|
| [Cohort outcomes](https://us.posthog.com/project/518160/dashboard/1869197) | Weekly pulse: activations, upgrades, churn, engagement |
| [Retention thresholds](https://us.posthog.com/project/518160/dashboard/1870842) | What keeps installs (first content, Design Library, publish) |
| [Churn typology](https://us.posthog.com/project/518160/dashboard/1870843) | Why sites leave (Type A / B / C proxies) |
| [Conversion paths](https://us.posthog.com/project/518160/dashboard/1870844) | How free → premium happens |

### How to read charts

- **Funnel:** left = started; right = succeeded; big drop = the step to fix.
- **Retention:** rows = activation weeks; columns = later weeks that came back and did the return event. Higher % in later weeks = stickier.
- **Dig in:** click a bar/step → Persons → open a few site addresses and look at their event timeline.

---

## 1. Get installers to keep using Stackable (not uninstall)

### Start here: [Retention thresholds](https://us.posthog.com/project/518160/dashboard/1870842)

| Chart | Question | What “good” looks like | What to do if weak |
|---|---|---|---|
| Activate → first content (retention) | Do new installs ever place a Stackable block? | Strong week-0 / week-1 conversion to first content | Fix first-run UX: empty editor prompts, Design Library CTA, Getting Started |
| Activate → Design Library | Is the library a stickiness driver? | Sites that insert designs return more | Push Design Library earlier / make it more discoverable |
| Activate → published page | Do they ship real pages? | Climb to milestone 1 (and 5+) | Help them publish: templates, “finish this page”, fewer dead ends |
| Activate → content → publish funnel | Where do they stall? | Drop after content but before publish = “tried but never shipped” | Focus on publish path, not more block features |

### Then: [Churn typology](https://us.posthog.com/project/518160/dashboard/1870843)

| Type | Meaning | Product response |
|---|---|---|
| **A** — never first content | Installed, never got value, deactivated | Onboarding / time-to-first-block |
| **B** — content, no publish | Tried in editor, never published | Editor → live site friction |
| **C** — published then churn | Got value, then left | Quality, support, competitors, “done for now” — different problem |

### Weekly pulse: [Cohort outcomes](https://us.posthog.com/project/518160/dashboard/1869197)

Watch **activations vs deactivations**. Rising deactivate/activate ratio = retention problem. Pair with Design Library + global settings + tour charts: if those engagement metrics fall while deactivations rise, you’re losing depth of use.

**Retention decision rule:** Find the earliest step where most churners fail (A vs B). Put roadmap effort there first — usually first content or first publish, not premium features.

---

## 2. Get free users to upgrade more

### Start here: [Conversion paths](https://us.posthog.com/project/518160/dashboard/1870844)

Compare these funnels side by side (same date range):

| Path | What it tells you |
|---|---|
| Activate → first content → premium | Is “using the product” enough to convert? |
| Activate → Design Library → premium | Does library usage predict upgrade? |
| Activate → published page → premium | Does shipping pages correlate with paid? |
| Premium interest → premium | Do upsells close, or are they noise? |

**How to read it:** whichever middle step has the **highest** conversion to `premium_plugin_activated` is your strongest “upgrade habit.” Double down on that in marketing and in-product prompts. The weakest path is where messaging is wrong or the upsell is too early.

Also check **First content by source** (`editor` vs `design_library` vs `publish`): if converters skew toward Design Library, treat that as the conversion engine.

### Then: [Cohort outcomes](https://us.posthog.com/project/518160/dashboard/1869197)

| Chart | Question | Action |
|---|---|---|
| Premium interest by feature | Which locked features get clicks? | Market / surface those first; improve weak ones or move upsells |
| Premium interest → upgrade | Interest → paid rate | Low rate = pricing/value gap or wrong timing of CTA |
| Activation → premium | Overall free→paid | North-star conversion rate over time |

**Upgrade decision rule:**

1. See what converters did *before* premium (paths dashboard).
2. See which upsells get clicks (interest by feature).
3. Push converters’ behaviors earlier for free users, and put CTAs on the features that already attract interest *after* they’ve hit a retention threshold (e.g. after first publish), not on day zero.

---

## Monthly review ritual

1. **Outcomes** — Are activations, deactivations, and upgrades trending the right way?
2. **Retention** — What % of new activates get first content / publish in 7–14 days? Improving?
3. **Churn mix** — Mostly A, B, or C? That picks the fix.
4. **Conversion** — Which path to premium is strongest? Are the right upsells clicked?
5. **Ship one bet** — e.g. “increase Design Library → first content” or “upsell after publish milestone 1 for feature X.”
6. Re-check the same charts in 4–6 weeks.

---

## Caveats

- Charts stay empty/noisy until production traffic lands.
- `plugin_deactivated` ≠ uninstall (deactivate only), but it’s the best churn proxy.
- Type A/B/C are **proxies**, not perfect labels.
- Domain is visible as the `site_address` person property — useful for spot-checking journeys, not for privacy-sensitive sharing. Persons themselves are identified by install UUID (so localhost clones don’t collide).

## Bottom line

Use **retention + churn** dashboards to decide what keeps free installs; use **conversion paths + interest-by-feature** to decide what drives upgrades.

The usual product answer: get them to **first content → first publish** for retention, then upsell the **features converters already click** after they’ve shown that depth.
