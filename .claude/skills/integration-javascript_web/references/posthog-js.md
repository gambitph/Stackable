# PostHog JavaScript Web SDK

**SDK Version:** <version>

Posthog-js allows you to automatically capture usage and send events to PostHog.

## Categories

- Initialization
- Identification
- Capture
- Error tracking
- Surveys
- Logs
- LLM analytics
- Privacy
- Session replay
- Feature flags
- Toolbar
- Lifecycle

## PostHog

This is the SDK reference for the PostHog JavaScript Web SDK. You can learn more about example usage in the [JavaScript Web SDK documentation](/docs/libraries/js). You can also follow [framework specific guides](/docs/frameworks) to integrate PostHog into your project.
This SDK is designed for browser environments. Use the PostHog [Node.js SDK](/docs/libraries/node) for server-side usage.

### Other methods

#### PostHog()

**Release Tag:** public

Creates an uninitialized PostHog instance.

**Notes:**

Most browser applications should use the default exported singleton and call `posthog.init()`. Construct a new instance only when you need to manage a separate SDK instance manually.

### Returns

- `any`

### Examples

```ts
const instance = new PostHog()
instance.init('<ph_project_api_key>', { api_host: 'https://us.i.posthog.com' })
```

---

#### clearIdentity()

**Release Tag:** public

Clear HMAC-based identity verification, reverting to anonymous mode.

### Returns

- `void`

### Examples

```ts
posthog.clearIdentity()
```

---

#### get_explicit_consent_status()

**Release Tag:** public

Returns the explicit consent status of the user.

**Notes:**

This can be used to check if the user has explicitly opted in or out of data capturing, or neither. This does not take the default config options into account, only whether the user has made an explicit choice, so this can be used to determine whether to show an initial cookie banner or not.

### Returns

**Union of:**
- `'granted'`
- `'denied'`
- `'pending'`

### Examples

```ts
const consentStatus = posthog.get_explicit_consent_status()
if (consentStatus === "granted") {
    // user has explicitly opted in
} else if (consentStatus === "denied") {
    // user has explicitly opted out
} else if (consentStatus === "pending"){
    // user has not made a choice, show consent banner
}
```

---

#### get_session_id()

**Release Tag:** public

Returns the current session_id.

**Notes:**

This should only be used for informative purposes. Any actual internal use case for the session_id should be handled by the sessionManager.

### Returns

- `string`

### Examples

```ts
// Generated example for get_session_id
posthog.get_session_id();
```

---

#### getAllFeatureFlags()

**Release Tag:** public

Returns all currently cached feature flags as `FeatureFlagResult`s. This is a synchronous read of the flags from the last load (no network request); call `reloadFeatureFlags()` first to refresh. Unlike `getFeatureFlag()`, it does not send a `$feature_flag_called` event.

### Returns

- `FeatureFlagResult[]`

### Examples

```ts
// Generated example for getAllFeatureFlags
posthog.getAllFeatureFlags();
```

---

#### push()

**Release Tag:** public

push() keeps the standard async-array-push behavior around after the lib is loaded. This is only useful for external integrations that do not wish to rely on our convenience methods (created in the snippet).

### Parameters

- **`item`** (`SnippetArrayItem`) - A `[function_name, ...args]` array to be executed.

### Returns

- `void`

### Examples

```ts
posthog.push(['register', { a: 'b' }]);
```

---

#### setIdentity()

**Release Tag:** public

Set HMAC-based identity verification.

**Notes:**

When set, products like conversations use server-verified identity (distinct_id + HMAC hash) instead of anonymous session identifiers. The hash should be computed server-side as HMAC-SHA256 of the distinct_id using the project's API secret.

### Parameters

- **`distinctId`** (`string`) - The verified user distinct_id
- **`hash`** (`string`) - HMAC-SHA256 of distinctId using the project API secret

### Returns

- `void`

### Examples

```ts
posthog.setIdentity('user_123', 'a1b2c3d4e5f6...')
```

---

### Error tracking methods

#### addExceptionStep()

**Release Tag:** public

Add a breadcrumb-like step that will be attached to the next captured exception.

### Parameters

- **`message`** (`string`) - The step message.
- **`properties?`** (`Properties`) - Additional context for this step.

### Returns

- `void`

### Examples

```ts
posthog.addExceptionStep('Checkout button clicked', {
  checkout_id: 'ch_123',
})
```

---

#### captureException()

**Release Tag:** public

Capture a caught exception manually

### Parameters

- **`error`** (`unknown`) - The error or exception-like value to capture.
- **`additionalProperties?`** (`Properties`) - Any additional properties to add to the error event.

### Returns

**Union of:**
- `CaptureResult`
- `undefined`

### Examples

#### Capture a caught exception

```ts
// Capture a caught exception
try {
  // something that might throw
} catch (error) {
  posthog.captureException(error)
}
```

#### With additional properties

```ts
// With additional properties
posthog.captureException(error, {
  customProperty: 'value',
  anotherProperty: ['I', 'can be a list'],
  ...
})
```

---

#### startExceptionAutocapture()

**Release Tag:** public

turns exception autocapture on, and updates the config option `capture_exceptions` to the provided config (or `true`)

### Parameters

- **`config?`** (`ExceptionAutoCaptureConfig`) - optional configuration option to control the exception autocapture behavior

### Returns

- `void`

### Examples

#### Start with default exception autocapture rules. No-op if already enabled

```ts
// Start with default exception autocapture rules. No-op if already enabled
posthog.startExceptionAutocapture()
```

#### Start and override controls

```ts
// Start and override controls
posthog.startExceptionAutocapture({
  // you don't have to send all of these (unincluded values will use the default)
  capture_unhandled_errors: true || false,
  capture_unhandled_rejections: true || false,
  capture_console_errors: true || false
})
```

---

#### stopExceptionAutocapture()

**Release Tag:** public

turns exception autocapture off by updating the config option `capture_exceptions` to `false`

### Returns

- `void`

### Examples

```ts
// Stop capturing exceptions automatically
posthog.stopExceptionAutocapture()
```

---

### Identification methods

#### alias()

**Release Tag:** public

Creates an alias linking two distinct user identifiers. Learn more about [identifying users](/docs/product-analytics/identify)

**Notes:**

PostHog will use this to link two distinct_ids going forward (not retroactively). Call this when a user signs up to connect their anonymous session with their account.

### Parameters

- **`alias`** (`string`) - A unique identifier that you want to use for this user in the future.
- **`original?`** (`string`) - The current identifier being used for this user.

### Returns

**Union of:**
- `CaptureResult`
- `void`
- `number`

### Examples

#### link anonymous user to account on signup

```ts
// link anonymous user to account on signup
posthog.alias('user_12345')
```

#### explicit alias with original ID

```ts
// explicit alias with original ID
posthog.alias('user_12345', 'anonymous_abc123')
```

---

#### createPersonProfile()

**Release Tag:** public

Creates a person profile for the current user, if they don't already have one and config.person_profiles is set to 'identified_only'. Produces a warning and does not create a profile if config.person_profiles is set to 'never'. Learn more about [person profiles](/docs/product-analytics/identify)

### Returns

- `void`

### Examples

```ts
posthog.createPersonProfile()
```

---

#### get_distinct_id()

**Release Tag:** public

Returns the current distinct ID for the user.

**Notes:**

This is either the auto-generated ID or the ID set via `identify()`. The distinct ID is used to associate events with users in PostHog.

### Returns

- `string`

### Examples

#### get the current user ID

```ts
// get the current user ID
const userId = posthog.get_distinct_id()
console.log('Current user:', userId)
```

#### use in loaded callback

```ts
// use in loaded callback
posthog.init('token', {
    loaded: (posthog) => {
        const id = posthog.get_distinct_id()
        // use the ID
    }
})
```

---

#### get_property()

**Release Tag:** public

Returns the value of a super property. Returns undefined if the property doesn't exist.

**Notes:**

get_property() can only be called after the PostHog library has finished loading. init() has a loaded function available to handle this automatically.

### Parameters

- **`property_name`** (`string`) - The name of the super property you want to retrieve

### Returns

**Union of:**
- `Property`
- `undefined`

### Examples

```ts
// grab value for '$user_id' after the posthog library has loaded
posthog.init('<YOUR PROJECT TOKEN>', {
    loaded: function(posthog) {
        user_id = posthog.get_property('$user_id');
    }
});
```

---

#### getGroups()

**Release Tag:** public

Returns the current groups.

### Returns

- `Record<string, any>`

### Examples

```ts
// Generated example for getGroups
posthog.getGroups();
```

---

#### getSessionProperty()

**Release Tag:** public

Returns the value of the session super property named property_name. If no such property is set, getSessionProperty() will return the undefined value.

**Notes:**

This is based on browser-level `sessionStorage`, NOT the PostHog session. getSessionProperty() can only be called after the PostHog library has finished loading. init() has a loaded function available to handle this automatically.

### Parameters

- **`property_name`** (`string`) - The name of the session super property you want to retrieve

### Returns

**Union of:**
- `Property`
- `undefined`

### Examples

```ts
// grab value for 'user_id' after the posthog library has loaded
posthog.init('YOUR PROJECT TOKEN', {
    loaded: function(posthog) {
        user_id = posthog.getSessionProperty('user_id');
    }
});
```

---

#### group()

**Release Tag:** public

Associates the user with a group for group-based analytics. Learn more about [groups](/docs/product-analytics/group-analytics)

**Notes:**

Groups allow you to analyze users collectively (e.g., by organization, team, or account). This sets the group association for all subsequent events and reloads feature flags.

### Parameters

- **`groupType`** (`string`) - Group type (example: 'organization')
- **`groupKey`** (`string`) - Group key (example: 'org::5')
- **`groupPropertiesToSet?`** (`Properties`) - Optional properties to set for group

### Returns

- `void`

### Examples

#### associate user with an organization

```ts
// associate user with an organization
posthog.group('organization', 'org_12345', {
    name: 'Acme Corp',
    plan: 'enterprise'
})
```

#### associate with multiple group types

```ts
// associate with multiple group types
posthog.group('organization', 'org_12345')
posthog.group('team', 'team_67890')
```

---

#### identify()

**Release Tag:** public

Associates a user with a unique identifier instead of an auto-generated ID. Learn more about [identifying users](/docs/product-analytics/identify)

**Notes:**

By default, PostHog assigns each user a randomly generated `distinct_id`. Use this method to replace that ID with your own unique identifier (like a user ID from your database).

### Parameters

- **`new_distinct_id?`** (`string`) - A string that uniquely identifies a user. If not provided, the distinct_id currently in the persistent store (cookie or localStorage) will be used.
- **`userPropertiesToSet?`** (`Properties`) - Optional: An associative array of properties to store about the user. Note: For feature flag evaluations, if the same key is present in the userPropertiesToSetOnce, it will be overwritten by the value in userPropertiesToSet.
- **`userPropertiesToSetOnce?`** (`Properties`) - Optional: An associative array of properties to store about the user. If property is previously set, this does not override that value.

### Returns

- `void`

### Examples

#### basic identification

```ts
// basic identification
posthog.identify('user_12345')
```

#### identify with user properties

```ts
// identify with user properties
posthog.identify('user_12345', {
    email: 'user@example.com',
    plan: 'premium'
})
```

#### identify with set and set_once properties

```ts
// identify with set and set_once properties
posthog.identify('user_12345',
    { last_login: new Date() },  // updates every time
    { signup_date: new Date() }  // sets only once
)
```

---

#### onSessionId()

**Release Tag:** public

Register an event listener that runs whenever the session id or window id change. If there is already a session id, the listener is called immediately in addition to being called on future changes.
Can be used, for example, to sync the PostHog session id with a backend session.

### Parameters

- **`callback`** (`SessionIdChangedCallback`) - The callback function will be called once a session id is present or when it or the window id are updated.

### Returns

- `() => void`

### Examples

```ts
posthog.onSessionId(function(sessionId, windowId) { // do something })
```

---

#### reset()

**Release Tag:** public

Resets all user data and starts a fresh session.
⚠️ **Warning**: Only call this when a user logs out. Calling at the wrong time can cause split sessions.
This clears: - Session ID and super properties - User identification (sets new random distinct_id) - Cached data and consent settings

### Parameters

- **`reset_device_id?`** (`boolean`) - Whether to generate a new device ID as well as a new distinct ID.

### Returns

- `void`

### Examples

#### reset on user logout

```ts
// reset on user logout
function logout() {
    posthog.reset()
    // redirect to login page
}
```

#### reset and generate new device ID

```ts
// reset and generate new device ID
posthog.reset(true)  // also resets device_id
```

---

#### resetGroups()

**Release Tag:** public

Resets only the group properties of the user currently logged in. Learn more about [groups](/docs/product-analytics/group-analytics)

### Returns

- `void`

### Examples

```ts
posthog.resetGroups()
```

---

#### setInternalOrTestUser()

**Release Tag:** public

Marks the current user as a test user by setting the `$internal_or_test_user` person property to `true`. This also enables person processing for the current user.
This is useful for using in a cohort your internal/test filters for your posthog org.

### Returns

- `void`

### Examples

```ts
// Manually mark as test user
posthog.setInternalOrTestUser()

// Or use internal_or_test_user_hostname config for automatic detection
posthog.init('token', { internal_or_test_user_hostname: 'localhost' })
```

---

#### setPersonProperties()

**Release Tag:** public

Sets properties on the person profile associated with the current `distinct_id`. Learn more about [identifying users](/docs/product-analytics/identify)

**Notes:**

Updates user properties that are stored with the person profile in PostHog. If `person_profiles` is set to `identified_only` and no profile exists, this will create one.

### Parameters

- **`userPropertiesToSet?`** (`Properties`) - Optional: An associative array of properties to store about the user. Note: For feature flag evaluations, if the same key is present in the userPropertiesToSetOnce, it will be overwritten by the value in userPropertiesToSet.
- **`userPropertiesToSetOnce?`** (`Properties`) - Optional: An associative array of properties to store about the user. If property is previously set, this does not override that value.

### Returns

- `void`

### Examples

#### set user properties

```ts
// set user properties
posthog.setPersonProperties({
    email: 'user@example.com',
    plan: 'premium'
})
```

#### set properties

```ts
// set properties
posthog.setPersonProperties(
    { name: 'Max Hedgehog' },  // $set properties
    { initial_url: '/blog' }   // $set_once properties
)
```

---

#### unsetPersonProperties()

**Release Tag:** public

Removes properties from the person profile associated with the current `distinct_id`. Learn more about [identifying users](/docs/product-analytics/identify)

**Notes:**

Deletes the given person properties from the person profile in PostHog. This is the counterpart to  — instead of hand-passing `$unset` inside a `capture()` call, you can remove properties with a dedicated method. If `person_profiles` is set to `never`, this call is ignored.

### Parameters

- **`propertyNames`** (`string | string[]`) - The name (or names) of the person properties to remove.

### Returns

- `void`

### Examples

#### remove a single property

```ts
// remove a single property
posthog.unsetPersonProperties('plan')
```

#### remove multiple properties

```ts
// remove multiple properties
posthog.unsetPersonProperties(['plan', 'email'])
```

---

### Surveys methods

#### cancelPendingSurvey()

**Release Tag:** public

Cancels a pending survey that is waiting to be displayed (e.g., due to a popup delay).

### Parameters

- **`surveyId`** (`string`) - The survey ID whose pending display should be cancelled.

### Returns

- `void`

### Examples

```ts
// Generated example for cancelPendingSurvey
posthog.cancelPendingSurvey();
```

---

#### canRenderSurvey()

**Release Tag:** deprecated

Checks the feature flags associated with this Survey to see if the survey can be rendered. This method is deprecated because it's synchronous and won't return the correct result if surveys are not loaded. Use `canRenderSurveyAsync` instead.

### Parameters

- **`surveyId`** (`string`) - The ID of the survey to check.

### Returns

**Union of:**
- `SurveyRenderReason`
- `null`

### Examples

```ts
// Generated example for canRenderSurvey
posthog.canRenderSurvey();
```

---

#### canRenderSurveyAsync()

**Release Tag:** public

Checks the feature flags associated with this Survey to see if the survey can be rendered.

### Parameters

- **`surveyId`** (`string`) - The ID of the survey to check.
- **`forceReload?`** (`boolean`) - If true, the survey will be reloaded from the server, Default: false

### Returns

- `Promise<SurveyRenderReason>`

### Examples

```ts
posthog.canRenderSurveyAsync(surveyId).then((result) => {
    if (result.visible) {
        // Survey can be rendered
        console.log('Survey can be rendered')
    } else {
        // Survey cannot be rendered
        console.log('Survey cannot be rendered:', result.disabledReason)
    }
})
```

---

#### displaySurvey()

**Release Tag:** public

Display a survey programmatically as either a popover or inline element.

### Parameters

- **`surveyId`** (`string`) - The survey ID to display.
- **`options?`** (`DisplaySurveyOptions`) - Display configuration. Defaults to a popover that respects dashboard conditions and delays.

### Returns

- `void`

### Examples

#### Display as popover (respects all conditions defined in the dashboard)

```ts
// Display as popover (respects all conditions defined in the dashboard)
posthog.displaySurvey('survey-id-123')
```

#### Display inline in a specific element

```ts
// Display inline in a specific element
posthog.displaySurvey('survey-id-123', {
  displayType: DisplaySurveyType.Inline,
  ignoreConditions: false,
  ignoreDelay: false,
  selector: '#survey-container'
})
```

#### Force display ignoring conditions and delays

```ts
// Force display ignoring conditions and delays
posthog.displaySurvey('survey-id-123', {
  displayType: DisplaySurveyType.Popover,
  ignoreConditions: true,
  ignoreDelay: true
})
```

---

#### getActiveMatchingSurveys()

**Release Tag:** public

Get surveys that should be enabled for the current user. See [fetching surveys documentation](/docs/surveys/implementing-custom-surveys#fetching-surveys-manually) for more details.

### Parameters

- **`callback`** (`SurveyCallback`) - The callback function will be called when the surveys are loaded or updated.
- **`forceReload?`** (`boolean`) - Whether to force a reload of the surveys.

### Returns

- `void`

### Examples

```ts
posthog.getActiveMatchingSurveys((surveys) => {
     // do something
})
```

---

#### getSurveys()

**Release Tag:** public

Get list of all surveys.

### Parameters

- **`callback`** (`SurveyCallback`) - Function that receives the array of surveys.
- **`forceReload?`** (`boolean`) - Optional boolean to force an API call for updated surveys.

### Returns

- `void`

### Examples

```ts
function callback(surveys, context) {
  // do something
}

posthog.getSurveys(callback, false)
```

---

#### onSurveysLoaded()

**Release Tag:** public

Register an event listener that runs when surveys are loaded.
Callback parameters: - surveys: Survey[]: An array containing all survey objects fetched from PostHog using the getSurveys method - context:  isLoaded: boolean, error?: string : An object indicating if the surveys were loaded successfully

### Parameters

- **`callback`** (`SurveyCallback`) - The callback function will be called when surveys are loaded or updated.

### Returns

- `() => void`

### Examples

```ts
posthog.onSurveysLoaded((surveys, context) => { // do something })
```

---

#### renderSurvey()

**Release Tag:** deprecated

Although we recommend using popover surveys and display conditions, if you want to show surveys programmatically without setting up all the extra logic needed for API surveys, you can render surveys programmatically with the renderSurvey method.
This takes a survey ID and an HTML selector to render an unstyled survey.

### Parameters

- **`surveyId`** (`string`) - The ID of the survey to render.
- **`selector`** (`string`) - The selector of the HTML element to render the survey on.

### Returns

- `void`

### Examples

```ts
posthog.renderSurvey(coolSurveyID, '#survey-container')
```

---

### Capture methods

#### capture()

**Release Tag:** public

Captures an event with optional properties and configuration.

**Notes:**

You can capture arbitrary object-like values as events. [Learn about capture best practices](/docs/product-analytics/capture-events)

### Parameters

- **`event_name`** (`EventName`) - The name of the event (e.g., 'Sign Up', 'Button Click', 'Purchase')
- **`properties?`** (`Properties | null`) - Properties to include with the event describing the user or event details
- **`options?`** (`CaptureOptions`) - Optional configuration for the capture request

### Returns

**Union of:**
- `CaptureResult`
- `undefined`

### Examples

```ts
// basic event capture
posthog.capture('cta-button-clicked', {
    button_name: 'Get Started',
    page: 'homepage'
})
```

---

#### on()

**Release Tag:** public

Exposes a set of events that PostHog will emit. e.g. `eventCaptured` is emitted immediately before trying to send an event
Unlike `onFeatureFlags` and `onSessionId` these are not called when the listener is registered, the first callback will be the next event _after_ registering a listener
Available events: - `eventCaptured`: Emitted immediately before trying to send an event - `featureFlagsReloading`: Emitted when feature flags are being reloaded (e.g. after `identify()`, `group()`, or `reloadFeatureFlags()`)

### Parameters

- **`event`** (`'eventCaptured' | 'featureFlagsReloading'`) - The event to listen for.
- **`cb`** (`(...args: any[]) => void`) - The callback function to call when the event is emitted.

### Returns

- `() => void`

### Examples

#### 

```ts
posthog.on('eventCaptured', (event) => {
  console.log(event)
})
```

#### Track when feature flags are reloading to show a loading state

```ts
// Track when feature flags are reloading to show a loading state
posthog.on('featureFlagsReloading', () => {
  console.log('Feature flags are being reloaded...')
})
```

---

#### register_for_session()

**Release Tag:** public

Registers super properties for the current session only.

**Notes:**

Session super properties are automatically added to all events during the current browser session. Unlike regular super properties, these are cleared when the session ends and are stored in sessionStorage.

### Parameters

- **`properties`** (`Properties`) - An associative array of properties to store about the user

### Returns

- `void`

### Examples

#### register session-specific properties

```ts
// register session-specific properties
posthog.register_for_session({
    current_page_type: 'checkout',
    ab_test_variant: 'control'
})
```

#### register properties for user flow tracking

```ts
// register properties for user flow tracking
posthog.register_for_session({
    selected_plan: 'pro',
    completed_steps: 3,
    flow_id: 'signup_flow_v2'
})
```

---

#### register_once()

**Release Tag:** public

Registers super properties only if they haven't been set before.

**Notes:**

Unlike `register()`, this method will not overwrite existing super properties. Use this for properties that should only be set once, like signup date or initial referrer.

### Parameters

- **`properties`** (`Properties`) - An associative array of properties to store about the user
- **`default_value?`** (`Property`) - Value to override if already set in super properties (ex: 'False') Default: 'None'
- **`days?`** (`number`) - How many days since the users last visit to store the super properties

### Returns

- `void`

### Examples

#### register once-only properties

```ts
// register once-only properties
posthog.register_once({
    first_login_date: new Date().toISOString(),
    initial_referrer: document.referrer
})
```

#### override existing value if it matches default

```ts
// override existing value if it matches default
posthog.register_once(
    { user_type: 'premium' },
    'unknown'  // overwrite if current value is 'unknown'
)
```

---

#### register()

**Release Tag:** public

Registers super properties that are included with all events.

**Notes:**

Super properties are stored in persistence and automatically added to every event you capture. These values will overwrite any existing super properties with the same keys.

### Parameters

- **`properties`** (`Properties`) - properties to store about the user
- **`days?`** (`number`) - How many days since the user's last visit to store the super properties

### Returns

- `void`

### Examples

#### register a single property

```ts
// register a single property
posthog.register({ plan: 'premium' })
```

#### register multiple properties

```ts
// register multiple properties
posthog.register({
    email: 'user@example.com',
    account_type: 'business',
    signup_date: '2023-01-15'
})
```

#### register with custom expiration

```ts
// register with custom expiration
posthog.register({ campaign: 'summer_sale' }, 7) // expires in 7 days
```

---

#### unregister_for_session()

**Release Tag:** public

Removes a session super property from the current session.

**Notes:**

This will stop the property from being automatically included in future events for this session. The property is removed from sessionStorage.

### Parameters

- **`property`** (`string`) - The name of the session super property to remove

### Returns

- `void`

### Examples

```ts
// remove a session property
posthog.unregister_for_session('current_flow')
```

---

#### unregister()

**Release Tag:** public

Removes a super property from persistent storage.

**Notes:**

This will stop the property from being automatically included in future events. The property will be permanently removed from the user's profile.

### Parameters

- **`property`** (`string`) - The name of the super property to remove

### Returns

- `void`

### Examples

```ts
// remove a super property
posthog.unregister('plan_type')
```

---

### Logs methods

#### captureLog()

**Release Tag:** public

Capture a log entry and send it to the PostHog logs endpoint.

### Parameters

- **`options`** (`CaptureLogOptions`) - The log entry options

### Returns

- `void`

### Examples

```ts
posthog.captureLog({
  body: 'checkout completed',
  level: 'info',
  attributes: { order_id: 'ord_789', amount_cents: 4999 },
})
```

---

### LLM analytics methods

#### captureTraceFeedback()

**Release Tag:** public

Capture written user feedback for a LLM trace. Numeric values are converted to strings.

### Parameters

- **`traceId`** (`string | number`) - The trace ID to capture feedback for.
- **`userFeedback`** (`string`) - The feedback to capture.

### Returns

- `void`

### Examples

```ts
// Generated example for captureTraceFeedback
posthog.captureTraceFeedback();
```

---

#### captureTraceMetric()

**Release Tag:** public

Capture a metric for a LLM trace. Numeric values are converted to strings.

### Parameters

- **`traceId`** (`string | number`) - The trace ID to capture the metric for.
- **`metricName`** (`string`) - The name of the metric to capture.
- **`metricValue`** (`string | number | boolean`) - The value of the metric to capture.

### Returns

- `void`

### Examples

```ts
// Generated example for captureTraceMetric
posthog.captureTraceMetric();
```

---

### Privacy methods

#### clear_opt_in_out_capturing()

**Release Tag:** public

Clear the user's opt in/out status of data capturing and cookies/localstorage for this PostHog instance

### Returns

- `void`

### Examples

```ts
// Generated example for clear_opt_in_out_capturing
posthog.clear_opt_in_out_capturing();
```

---

#### has_opted_in_capturing()

**Release Tag:** public

Checks if the user has opted into data capturing.

**Notes:**

Returns the current consent status for event tracking and data persistence.

### Returns

- `boolean`

### Examples

```ts
if (posthog.has_opted_in_capturing()) {
    // show analytics features
}
```

---

#### has_opted_out_capturing()

**Release Tag:** public

Checks if the user has opted out of data capturing.

**Notes:**

Returns the current consent status for event tracking and data persistence.

### Returns

- `boolean`

### Examples

```ts
if (posthog.has_opted_out_capturing()) {
    // disable analytics features
}
```

---

#### is_capturing()

**Release Tag:** public

Checks whether the PostHog library is currently capturing events.
Usually this means that the user has not opted out of capturing, but the exact behaviour can be controlled by some config options.
Additionally, if the cookieless_mode is set to `'on_reject'`, we will capture events in cookieless mode if the user has opted out or been defaulted to opt-out.

### Returns

- `boolean`

### Examples

```ts
// Generated example for is_capturing
posthog.is_capturing();
```

---

#### opt_in_capturing()

**Release Tag:** public

Opts the user into data capturing and persistence.

**Notes:**

Enables event tracking and data persistence (cookies/localStorage) for this PostHog instance. By default, captures an `$opt_in` event unless disabled.

### Parameters

- **`options?`** (`{
        captureEventName?: EventName | null | false; /** event name to be used for capturing the opt-in action */
        captureProperties?: Properties; /** set of properties to be captured along with the opt-in action */
    }`) - A dictionary of opt-in options.

### Returns

- `void`

### Examples

#### simple opt-in

```ts
// simple opt-in
posthog.opt_in_capturing()
```

#### opt-in with custom event and properties

```ts
// opt-in with custom event and properties
posthog.opt_in_capturing({
    captureEventName: 'Privacy Accepted',
    captureProperties: { source: 'banner' }
})
```

#### opt-in without capturing event

```ts
// opt-in without capturing event
posthog.opt_in_capturing({
    captureEventName: false
})
```

---

#### opt_out_capturing()

**Release Tag:** public

Opts the user out of data capturing and persistence.

**Notes:**

Disables event tracking and data persistence (cookies/localStorage) for this PostHog instance. If `opt_out_persistence_by_default` is true, SDK persistence will also be disabled.

### Returns

- `void`

### Examples

```ts
// opt user out (e.g., on privacy settings page)
posthog.opt_out_capturing()
```

---

### Initialization methods

#### debug()

**Release Tag:** public

Enables or disables debug mode for detailed logging.

**Notes:**

Debug mode logs all PostHog calls to the browser console for troubleshooting. Can also be enabled by adding `?__posthog_debug=true` to the URL.

### Parameters

- **`debug?`** (`boolean`) - If true, will enable debug mode.

### Returns

- `void`

### Examples

#### enable debug mode

```ts
// enable debug mode
posthog.debug(true)
```

#### disable debug mode

```ts
// disable debug mode
posthog.debug(false)
```

---

#### getPageViewId()

**Release Tag:** public

Returns the current page view ID.

### Returns

**Union of:**
- `string`
- `undefined`

### Examples

```ts
// Generated example for getPageViewId
posthog.getPageViewId();
```

---

#### init()

**Release Tag:** public

Initializes a new instance of the PostHog capturing object.

**Notes:**

All new instances are added to the main posthog object as sub properties (such as `posthog.library_name`) and also returned by this function. [Learn more about configuration options](https://posthog.com/docs/libraries/js/config)

### Parameters

- **`token`** (`string`) - Your PostHog API token
- **`config?`** (`OnlyValidKeys<Partial<PostHogConfig>, Partial<PostHogConfig>>`) - A dictionary of config options to override
- **`name?`** (`string`) - The name for the new posthog instance that you want created

### Returns

- `PostHog`

### Examples

#### basic initialization

```ts
// basic initialization
posthog.init('<ph_project_api_key>', {
    api_host: '<ph_client_api_host>'
})
```

#### multiple instances

```ts
// multiple instances
posthog.init('<ph_project_api_key>', {}, 'project1')
posthog.init('<ph_project_api_key>', {}, 'project2')
```

---

#### set_config()

**Release Tag:** public

Updates the configuration of the PostHog instance.

### Parameters

- **`config`** (`Partial<PostHogConfig>`) - A dictionary of new configuration values to update

### Returns

- `void`

### Examples

```ts
// Generated example for set_config
posthog.set_config();
```

---

### Session replay methods

#### get_session_replay_url()

**Release Tag:** public

Returns the Replay url for the current session.

### Parameters

- **`options?`** (`{
        withTimestamp?: boolean;
        timestampLookBack?: number;
    }`) - Options for the URL.

### Returns

- `string`

### Examples

#### basic usage

```ts
// basic usage
posthog.get_session_replay_url()
```

#### timestamp

```ts
// timestamp
posthog.get_session_replay_url({ withTimestamp: true })
```

#### timestamp and lookback

```ts
// timestamp and lookback
posthog.get_session_replay_url({
  withTimestamp: true,
  timestampLookBack: 30 // look back 30 seconds
})
```

---

#### sessionRecordingStarted()

**Release Tag:** public

returns a boolean indicating whether session recording is currently running

### Returns

- `boolean`

### Examples

```ts
// Stop session recording if it's running
if (posthog.sessionRecordingStarted()) {
  posthog.stopSessionRecording()
}
```

---

#### startSessionRecording()

**Release Tag:** public

turns session recording on, and updates the config option `disable_session_recording` to false

### Parameters

- **`override?`** (`{
        sampling?: boolean;
        linked_flag?: boolean;
        url_trigger?: true;
        event_trigger?: true;
    } | true`) - optional boolean to override the default sampling behavior - ensures the next session recording to start will not be skipped by sampling or linked_flag config. `true` is shorthand for  sampling: true, linked_flag: true

### Returns

- `void`

### Examples

#### Start and ignore controls

```ts
// Start and ignore controls
posthog.startSessionRecording(true)
```

#### Start and override controls

```ts
// Start and override controls
posthog.startSessionRecording({
  // you don't have to send all of these
  sampling: true || false,
  linked_flag: true || false,
  url_trigger: true || false,
  event_trigger: true || false
})
```

---

#### stopSessionRecording()

**Release Tag:** public

turns session recording off, and updates the config option disable_session_recording to true

### Returns

- `void`

### Examples

```ts
// Stop session recording
posthog.stopSessionRecording()
```

---

### Feature flags methods

#### getEarlyAccessFeatures()

**Release Tag:** public

Get the list of early access features. To check enrollment status, use `isFeatureEnabled`. [Learn more in the docs](/docs/feature-flags/early-access-feature-management#option-2-custom-implementation)

### Parameters

- **`callback`** (`EarlyAccessFeatureCallback`) - The callback function will be called when the early access features are loaded.
- **`force_reload?`** (`boolean`) - Whether to force a reload of the early access features.
- **`stages?`** (`EarlyAccessFeatureStage[]`) - The stages of the early access features to load.

### Returns

- `void`

### Examples

```ts
const posthog = usePostHog()
const activeFlags = useActiveFeatureFlags()

const [activeBetas, setActiveBetas] = useState([])
const [inactiveBetas, setInactiveBetas] = useState([])
const [comingSoonFeatures, setComingSoonFeatures] = useState([])

useEffect(() => {
  posthog.getEarlyAccessFeatures((features) => {
    // Filter features by stage
    const betaFeatures = features.filter(feature => feature.stage === 'beta')
    const conceptFeatures = features.filter(feature => feature.stage === 'concept')

    setComingSoonFeatures(conceptFeatures)

    if (!activeFlags || activeFlags.length === 0) {
      setInactiveBetas(betaFeatures)
      return
    }

    const activeBetas = betaFeatures.filter(
            beta => activeFlags.includes(beta.flagKey)
        );
    const inactiveBetas = betaFeatures.filter(
            beta => !activeFlags.includes(beta.flagKey)
        );
    setActiveBetas(activeBetas)
    setInactiveBetas(inactiveBetas)
  }, true, ['concept', 'beta'])
}, [activeFlags])
```

---

#### getFeatureFlag()

**Release Tag:** public

Gets the value of a feature flag for the current user.

**Notes:**

Returns the feature flag value which can be a boolean, string, or undefined. Supports multivariate flags that can return custom string values.

### Parameters

- **`key`** (`string`) - Key of the feature flag.
- **`options?`** (`FeatureFlagOptions`) - Optional lookup settings. If `{ send_event: false }`, we won't send a `$feature_flag_called` event to PostHog. If `{ fresh: true }`, we won't return cached values from localStorage - only values loaded from the server.

### Returns

**Union of:**
- `boolean`
- `string`
- `undefined`

### Examples

#### check boolean flag

```ts
// check boolean flag
if (posthog.getFeatureFlag('new-feature')) {
    // show new feature
}
```

#### check multivariate flag

```ts
// check multivariate flag
const variant = posthog.getFeatureFlag('button-color')
if (variant === 'red') {
    // show red button
}
```

---

#### getFeatureFlagPayload()

**Release Tag:** deprecated

Get feature flag payload value matching key for user (supports multivariate flags).

### Parameters

- **`key`** (`string`) - Key of the feature flag.

### Returns

- `JsonType`

### Examples

```ts
const betaFeature = posthog.getFeatureFlagResult('beta-feature')
if (betaFeature?.variant === 'some-value') {
     const someValue = betaFeature?.payload
     // do something
}
```

---

#### getFeatureFlagResult()

**Release Tag:** public

Get a feature flag evaluation result including both the flag value and payload.
By default, this method emits the `$feature_flag_called` event.

### Parameters

- **`key`** (`string`) - Key of the feature flag.
- **`options?`** (`FeatureFlagOptions`) - Options for the feature flag lookup.

### Returns

**Union of:**
- `FeatureFlagResult`
- `undefined`

### Examples

#### 

```ts
const result = posthog.getFeatureFlagResult('my-flag')
if (result?.enabled) {
    console.log('Flag is enabled with payload:', result.payload)
}
```

#### multivariate flag

```ts
// multivariate flag
const result = posthog.getFeatureFlagResult('button-color')
if (result?.variant === 'red') {
    showRedButton(result.payload)
}
```

---

#### isFeatureEnabled()

**Release Tag:** public

Checks if a feature flag is enabled for the current user.

**Notes:**

Returns true if the flag is enabled, false if disabled, or undefined if not found. This is a convenience method that treats any truthy value as enabled.

### Parameters

- **`key`** (`string`) - Key of the feature flag.
- **`options?`** (`FeatureFlagOptions`) - Optional lookup settings. If `{ send_event: false }`, we won't send a `$feature_flag_called` event to PostHog. If `{ fresh: true }`, we won't return cached values from localStorage - only values loaded from the server.

### Returns

**Union of:**
- `boolean`
- `undefined`

### Examples

#### simple feature flag check

```ts
// simple feature flag check
if (posthog.isFeatureEnabled('new-checkout')) {
    showNewCheckout()
}
```

#### disable event tracking

```ts
// disable event tracking
if (posthog.isFeatureEnabled('feature', { send_event: false })) {
    // flag checked without sending $feature_flag_called event
}
```

---

#### onFeatureFlags()

**Release Tag:** public

Register an event listener that runs when feature flags become available or when they change. If there are flags, the listener is called immediately in addition to being called on future changes. Note that this is not called only when we fetch feature flags from the server, but also when they change in the browser.

### Parameters

- **`callback`** (`FeatureFlagsCallback`) - The callback function will be called once the feature flags are ready or when they are updated. It'll return a list of feature flags enabled for the user, the variants, and also a context object indicating whether we succeeded to fetch the flags or not.

### Returns

- `() => void`

### Examples

```ts
posthog.onFeatureFlags(function(featureFlags, featureFlagsVariants, { errorsLoading }) {
    // do something
})
```

---

#### reloadFeatureFlags()

**Release Tag:** public

Feature flag values are cached. If something has changed with your user and you'd like to refetch their flag values, call this method.

### Returns

- `void`

### Examples

```ts
posthog.reloadFeatureFlags()
```

---

#### resetGroupPropertiesForFlags()

**Release Tag:** public

Resets the group properties for feature flags.

### Parameters

- **`group_type?`** (`string`) - Optional group type to reset. If omitted, all group properties are reset.

### Returns

- `void`

### Examples

```ts
posthog.resetGroupPropertiesForFlags()
```

---

#### resetPersonPropertiesForFlags()

**Release Tag:** public

Resets the person properties for feature flags.

### Parameters

- **`reloadFeatureFlags?`** (`boolean`) - Whether to reload feature flags.

### Returns

- `void`

### Examples

#### 

```ts
posthog.resetPersonPropertiesForFlags()
```

#### Reset properties without reloading

```ts
// Reset properties without reloading
posthog.resetPersonPropertiesForFlags(false)
```

---

#### setGroupPropertiesForFlags()

**Release Tag:** public

Set override group properties for feature flags. This is used when dealing with new groups / where you don't want to wait for ingestion to update properties. Takes in an object, the key of which is the group type.

### Parameters

- **`properties`** (`{
        [type: string]: Properties;
    }`) - The properties to override, the key of which is the group type.
- **`reloadFeatureFlags?`** (`boolean`) - Whether to reload feature flags.

### Returns

- `void`

### Examples

#### Set properties with reload

```ts
// Set properties with reload
posthog.setGroupPropertiesForFlags({'organization': { name: 'CYZ', employees: '11' } })
```

#### Set properties without reload

```ts
// Set properties without reload
posthog.setGroupPropertiesForFlags({'organization': { name: 'CYZ', employees: '11' } }, false)
```

---

#### setPersonPropertiesForFlags()

**Release Tag:** public

Sometimes, you might want to evaluate feature flags using properties that haven't been ingested yet, or were set incorrectly earlier. You can do so by setting properties the flag depends on with these calls:

### Parameters

- **`properties`** (`Properties`) - The properties to override.
- **`reloadFeatureFlags?`** (`boolean`) - Whether to reload feature flags.

### Returns

- `void`

### Examples

#### Set properties

```ts
// Set properties
posthog.setPersonPropertiesForFlags({'property1': 'value', property2: 'value2'})
```

#### Set properties without reloading

```ts
// Set properties without reloading
posthog.setPersonPropertiesForFlags({'property1': 'value', property2: 'value2'}, false)
```

---

#### updateEarlyAccessFeatureEnrollment()

**Release Tag:** public

Opt the user in or out of an early access feature. [Learn more in the docs](/docs/feature-flags/early-access-feature-management#option-2-custom-implementation)

### Parameters

- **`key`** (`string`) - The key of the feature flag to update.
- **`isEnrolled`** (`boolean`) - Whether the user is enrolled in the feature.
- **`stage?`** (`string`) - The stage of the feature flag to update.

### Returns

- `void`

### Examples

```ts
const toggleBeta = (betaKey) => {
  if (activeBetas.some(
    beta => beta.flagKey === betaKey
  )) {
    posthog.updateEarlyAccessFeatureEnrollment(
      betaKey,
      false
    )
    setActiveBetas(
      prevActiveBetas => prevActiveBetas.filter(
        item => item.flagKey !== betaKey
      )
    );
    return
  }

  posthog.updateEarlyAccessFeatureEnrollment(
    betaKey,
    true
  )
  setInactiveBetas(
    prevInactiveBetas => prevInactiveBetas.filter(
      item => item.flagKey !== betaKey
    )
  );
}

const registerInterest = (featureKey) => {
  posthog.updateEarlyAccessFeatureEnrollment(
    featureKey,
    true
  )
  // Update UI to show user has registered
}
```

---

#### updateFlags()

**Release Tag:** public

Manually update feature flag values without making a network request.
This is useful when you have feature flag values from an external source (e.g., server-side evaluation, edge middleware) and want to inject them into the client SDK.

### Parameters

- **`flags`** (`Record<string, boolean | string>`) - An object mapping flag keys to their values (boolean or string variant)
- **`payloads?`** (`Record<string, JsonType>`) - Optional object mapping flag keys to their JSON payloads
- **`options?`** (`{
        merge?: boolean;
    }`) - Optional settings. Use `{ merge: true }` to merge with existing flags instead of replacing.

### Returns

- `void`

### Examples

```ts
// Replace all flags with server-evaluated values
posthog.updateFlags({
  'my-flag': true,
  'my-experiment': 'variant-a'
})

// Merge with existing flags (update only specified flags)
posthog.updateFlags(
  { 'my-flag': true },
  undefined,
  { merge: true }
)

// With payloads
posthog.updateFlags(
  { 'my-flag': true },
  { 'my-flag': { some: 'data' } }
)
```

---

### Toolbar methods

#### loadToolbar()

**Release Tag:** public

returns a boolean indicating whether the [toolbar](/docs/toolbar) loaded

### Parameters

- **`params`** (`ToolbarParams`) - Toolbar parameters.

### Returns

- `boolean`

### Examples

```ts
// Generated example for loadToolbar
posthog.loadToolbar();
```

---

### Lifecycle methods

#### shutdown()

**Release Tag:** public

Flushes any queued events and resolves once teardown is complete.

**Notes:**

This exists primarily for parity with the server-side [Node.js SDK](/docs/libraries/node), whose `shutdown()` you call once before a process exits. In the browser there is no process to exit — the SDK already flushes pending events on `pagehide`/`unload` — so this method is mostly a graceful no-op that best-effort flushes the request queues and always resolves.
It is safe to call in isomorphic teardown code (for example a Nuxt/Next module that calls `shutdown()` on both the server and the client) so the same symmetric cleanup works in either environment without throwing.

### Parameters

- **`_shutdownTimeoutMs?`** (`number`) - Accepted for call-site parity with the Node.js SDK. The browser flush is synchronous, so this is ignored.

### Returns

- `Promise<void>`

### Examples

```ts
// symmetric teardown that runs on both server and client
await posthog.shutdown()
```

---