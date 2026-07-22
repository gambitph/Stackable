# JavaScript web - Docs

> **Note:** This doc refers to our [posthog-js](https://github.com/PostHog/posthog-js) library for use on the browser. For server-side JavaScript, see our [Node SDK](/docs/libraries/node.md).

## Installation

### Option 1: Add the JavaScript snippet to your HTML Recommended

HTML

PostHog AI

```html
<script>
  !(function (t, e) {
    var o, n, p, r;
    e.__SV ||
      ((window.posthog = e),
      (e._i = []),
      (e.init = function (i, s, a) {
        function g(t, e) {
          var o = e.split(".");
          (2 == o.length && ((t = t[o[0]]), (e = o[1])),
            (t[e] = function () {
              t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
            }));
        }
        (((p = t.createElement("script")).type = "text/javascript"),
          (p.crossOrigin = "anonymous"),
          (p.async = !0),
          (p.src =
            s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") + "/static/array.js"),
          (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r));
        var u = e;
        for (
          void 0 !== a ? (u = e[a] = []) : (a = "posthog"),
            u.people = u.people || [],
            u.toString = function (t) {
              var e = "posthog";
              return ("posthog" !== a && (e += "." + a), t || (e += " (stub)"), e);
            },
            u.people.toString = function () {
              return u.toString(1) + ".people (stub)";
            },
            o =
              "init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(
                " ",
              ),
            n = 0;
          n < o.length;
          n++
        )
          g(u, o[n]);
        e._i.push([i, s, a]);
      }),
      (e.__SV = 1));
  })(document, window.posthog || []);
  posthog.init("<ph_project_token>", {
    api_host: "https://us.i.posthog.com",
    defaults: "2026-05-30",
  });
</script>
```

Keeping the SDK version up to date

Be careful to avoid things which can cause the SDK version to be cached and fail to update. See: [Ways SDK versions fall behind](/docs/health-checks/keeping-sdks-current.md#ways-sdk-versions-fall-behind)

Using TypeScript with the script tag?

If you're using TypeScript and want type safety for `window.posthog`, install the `@posthog/types` package:

Terminal

PostHog AI

```bash
npm install @posthog/types
```

Then create a type declaration file:

typescript

PostHog AI

```typescript
// posthog.d.ts
import type { PostHog } from '@posthog/types'
declare global {
    interface Window {
        posthog?: PostHog
    }
}
export {}
```

See the [TypeScript types documentation](/docs/libraries/js/types.md) for more details.

### Option 2: Install via package manager

PostHog AI

### npm

```bash
npm install --save posthog-js
```

### Yarn

```bash
yarn add posthog-js
```

### pnpm

```bash
pnpm add posthog-js
```

### Bun

```bash
bun add posthog-js
```

And then include it with your project token and host (which you can find in [your project settings](https://us.posthog.com/settings/project)):

Web

PostHog AI

```javascript
import posthog from 'posthog-js'
posthog.init('<ph_project_token>', {
  api_host: 'https://us.i.posthog.com',
  defaults: '2026-05-30'
})
```

See our framework specific docs for [Next.js](/docs/libraries/next-js.md), [React](/docs/libraries/react.md), [Vue](/docs/libraries/vue-js.md), [Angular](/docs/libraries/angular.md), [Astro](/docs/libraries/astro.md), [Remix](/docs/libraries/remix.md), and [Svelte](/docs/libraries/svelte.md) for more installation details.

Update early, update often

We ship weirdly fast, especially for our JavaScript web SDK. If you choose the npm package instead of the HTML snippet, be sure to update it frequently:

To actually *update* the package, you need to update the version constraint in your `package.json` file and then reinstall, or run `update` instead of `install`:

PostHog AI

### npm

```bash
npm update posthog-js
```

### pnpm

```bash
pnpm update posthog-js
```

### Yarn

```bash
yarn upgrade posthog-js
```

Bundle all required extensions (advanced)

By default, the JavaScript Web library only loads the core functionality. It lazy-loads extensions such as surveys or the session replay 'recorder' when needed.

This can cause issues if:

-   You have a Content Security Policy (CSP) that blocks inline scripts.
-   You want to optimize your bundle at build time to ensure all dependencies are ready immediately.
-   Your app is running in environments like the Chrome Extension store or [Electron](/tutorials/electron-analytics.md) that reject or block remote code loading.

To solve these issues, we have multiple import options available below.

**Note:** With any of the `no-external` options, the toolbar will be unavailable as this is only possible as a runtime dependency loaded directly from `us.posthog.com`.

Web

PostHog AI

```javascript
// No external code loading possible (this disables all extensions such as Replay, Surveys, Exceptions etc.)
import posthog from 'posthog-js/dist/module.no-external'
// No external code loading possible but all external dependencies pre-bundled
import posthog from 'posthog-js/dist/module.full.no-external'
// All external dependencies pre-bundled and with the ability to load external scripts (primarily useful is you use JS snippets)
import posthog from 'posthog-js/dist/module.full'
// Finally you can also import specific extra dependencies
import "posthog-js/dist/posthog-recorder"
import "posthog-js/dist/surveys"
import "posthog-js/dist/exception-autocapture"
import "posthog-js/dist/tracing-headers"
import "posthog-js/dist/web-vitals"
import posthog from 'posthog-js/dist/module.no-external'
// All other posthog commands are the same as usual
posthog.init('<ph_project_token>', { api_host: 'https://us.i.posthog.com', defaults: '2026-05-30' })
```

**Note:** You should ensure if using this option that you always import `posthog-js` from the same module, otherwise multiple bundles could get included. At this time `@posthog/react` does not work with any module import other than the default.

Tree shaking with the slim bundle (advanced)

If you only need a subset of PostHog features, you can use the **slim bundle** to reduce your bundle size. It gives you the core functionality (event capture, identify, group analytics) and lets you explicitly opt in to additional features via extension bundles. This is currently experimental, but offers the biggest reduction in bundle size.

Web

PostHog AI

```javascript
import posthog from 'posthog-js/dist/module.slim'
import {
    SessionReplayExtensions,
    AnalyticsExtensions,
} from 'posthog-js/dist/extension-bundles'
posthog.init('<ph_project_token>', {
    api_host: 'https://us.i.posthog.com',
    defaults: '2026-05-30',
    __extensionClasses: {
        ...SessionReplayExtensions,
        ...AnalyticsExtensions,
    }
})
```

**Note:** Always import `posthog-js` from the same module path (`posthog-js/dist/module.slim`) throughout your app, otherwise multiple bundles could get included.

#### Available extension bundles

| Bundle | What's included |
| --- | --- |
| FeatureFlagsExtensions | [Feature Flags](/docs/feature-flags.md) |
| SessionReplayExtensions | [Session Replay](/docs/session-replay.md) |
| AnalyticsExtensions | [Autocapture](/docs/product-analytics/autocapture.md), pageview tracking, [heatmaps](/docs/toolbar/heatmaps.md), dead click detection, [web vitals](/docs/web-analytics/web-vitals.md) |
| ErrorTrackingExtensions | [Error Tracking](/docs/error-tracking.md) |
| SurveysExtensions | [Surveys](/docs/surveys.md) |
| ExperimentsExtensions | [Experiments](/docs/experiments.md) |
| SiteAppsExtensions | [JS snippets](/docs/js-snippets.md) |
| TracingExtensions | Distributed tracing header injection |
| ToolbarExtensions | [Toolbar](/docs/toolbar.md) |
| LogsExtensions | [Log capture](/docs/logs.md) |
| ConversationsExtensions | Conversations |
| AllExtensions | Everything (equivalent to the default posthog-js bundle) |

**Note:** Each extension bundle includes its own dependencies. You don't need to worry about adding them separately.

Don't want to send test data while developing?

If you don't want to send test data while you're developing, you can do the following:

Web

PostHog AI

```javascript
if (!window.location.host.includes('127.0.0.1') && !window.location.host.includes('localhost')) {
    posthog.init('<ph_project_token>', { api_host: 'https://us.i.posthog.com', defaults: '2026-05-30' })
}
```

What is the \`defaults\` option?

The `defaults` is a date, such as `2026-05-30`, for a configuration snapshot used as defaults to initialize PostHog. This default is overridden when you explicitly set a value for any of the options.

## Identifying users

> **Identifying users is required.** Call `posthog.identify('your-user-id')` after login to link events to a known user. This is what connects frontend event captures, [session replays](/docs/session-replay.md), [LLM traces](/docs/ai-engineering.md), and [error tracking](/docs/error-tracking.md) to the same person — and lets backend events link back too.
>
> See our guide on [identifying users](/docs/getting-started/identify-users.md) for how to set this up.

Once you've installed PostHog, see our [features doc](/docs/libraries/js/features.md) for more information about what you can do with it. You can also install the [PostHog VS Code extension](/docs/vscode-extension.md) to see live analytics, flag status, and session replay links inline in your code.

### Track across marketing website & app

We recommend putting PostHog both on your homepage and your application if applicable. That means you'll be able to follow a user from the moment they come onto your website, all the way through signup and actually using your product.

> PostHog automatically sets a cross-domain cookie, so if your website is `yourapp.com` and your app is on `app.yourapp.com` users will be followed when they go from one to the other. See our tutorial on [cross-website tracking](/tutorials/cross-domain-tracking.md) if you need to track users across different domains.

### Replay triggers

You can configure "replay triggers" in your [project settings](https://app.posthog.com/project/settings). You can configure triggers to enable or pause session recording when the user visit a page that matches the URL(s) you configure.

You are also able to setup "event triggers". Session recording will be started immediately before PostHog queues any of these events to be sent to the backend.

## Opt out of data capture

You can completely opt-out users from data capture. To do this, there are two options:

1.  Opt users out by default by setting `opt_out_capturing_by_default` to `true` in your [PostHog config](/docs/libraries/js/config.md).

Web

PostHog AI

```javascript
posthog.init('<ph_project_token>', {
    opt_out_capturing_by_default: true,
});
```

2.  Opt users out on a per-person basis by calling `posthog.opt_out_capturing()`.

Similarly, you can opt users in:

Web

PostHog AI

```javascript
posthog.opt_in_capturing()
```

To check if a user is opted out:

Web

PostHog AI

```javascript
posthog.has_opted_out_capturing()
```

## Running more than one instance of PostHog at the same time

While not a first-class citizen, PostHog allows you to run more than one instance of PostHog at the same time if you, for example, want to track different events in different posthog instances/projects.

`posthog.init` accepts a third parameter that can be used to create named instances.

TypeScript

PostHog AI

```typescript
posthog.init('<ph_project_token>', {}, 'project1')
posthog.init('<ph_project_token>', {}, 'project2')
```

You can then call these different instances by accessing it on the global `posthog` object

TypeScript

PostHog AI

```typescript
posthog.project1.capture('some_event')
posthog.project2.capture('other_event')
```

> **Note:** You'll probably want to disable autocapture (and some other events) to avoid them from being sent to both instances. Check all of our [config options](/docs/libraries/js/config.md) to better understand that.

## Development

For instructions on how to run `posthog-js` locally and setup your development environment, please checkout the README on the [posthog-js](https://github.com/PostHog/posthog-js#README) repository.

### Community questions

Ask a question

### Was this page useful?

HelpfulCould be better