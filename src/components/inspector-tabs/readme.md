# Responsive Styles compatibility

This note describes how the Stackable inspector works with the Responsive Styles feature introduced in WordPress 7.1.
It documents the current implementation and does not define a separate responsive attribute system.

## Why the bridge exists

WordPress represents its responsive editing selection as a private block style state such as `@tablet` or `@mobile`.
When one of those states is selected, Core replaces the normal block inspector with its style-state inspector.
That inspector renders controls registered with Core style states, but it does not render Stackable's custom inspector controls.

Stackable already selects its desktop, tablet, and mobile attributes from the editor's visual device type.
The compatibility bridge therefore resets only Core's style-state viewport to `default` while a Stackable block is selected.
It does not change the visual device preview.
Stackable continues to read and write its existing viewport-specific attributes.

When selection leaves the Stackable block, the bridge restores Core's `@tablet` or `@mobile` style-state viewport so native blocks retain their normal behavior.

## Runtime flow

1. [`use-core-responsive-editing.js`](../../hooks/use-core-responsive-editing.js) safely unlocks the private block editor selectors and dispatchers.
2. [`use-core-responsive-styles-compatibility.js`](./use-core-responsive-styles-compatibility.js) keeps the normal Stackable inspector mounted and restores Core state when Stackable no longer owns the selection.
3. [`use-responsive-control-visibility.js`](../../hooks/use-responsive-control-visibility.js) combines Core's Responsive Styles toggle with Stackable's visual device type.
4. [`index.js`](./index.js) scopes that filtering state to Stackable inspector controls.
5. [`base-control/index.js`](../base-control/index.js) and [`base-control2/index.js`](../base-control2/index.js) hide controls that do not support the current viewport.
6. [`responsive-control-visibility/index.js`](../responsive-control-visibility/index.js) lets controls report their visibility to their parent panel.
7. [`panel-advanced-settings/panel-body.js`](../panel-advanced-settings/panel-body.js) hides a panel when all registered controls are filtered, or when the panel has an explicit unsupported capability.
8. [`panel-tabs/editor.scss`](../panel-tabs/editor.scss) hides Core's own Advanced panel while Stackable responsive filtering is active.

## Visibility rules

Filtering is inactive when Responsive Styles is disabled or the visual device is Desktop.
All Stackable controls and panels remain visible in those cases.

Filtering is active when Responsive Styles is enabled and the visual device is Tablet or Mobile.
During filtering, a control is visible only when its existing `screens` or `responsive` metadata includes the current device.

Use `responsive="all"` or `screens="all"` for controls that support Desktop, Tablet, and Mobile.
Use an array when a control supports only specific devices.
An omitted or false control capability is treated as non-responsive during filtering.

The metadata affects inspector visibility only.
It does not select attributes, change values, or alter Stackable's existing responsive write behavior.

## Panel behavior

Panels containing `BaseControl` or `BaseControl2` children normally do not need a `responsive` prop.
Their child controls register their visibility, and the panel hides itself when every registered child is filtered.

Panels with custom, filtered, or third-party content may not have children that participate in registration.
Known desktop-only panels must use `responsive={ false }` so their capability is explicit.
An unannotated panel with no registered controls remains visible because its capability is unknown.
This fallback avoids accidentally hiding a custom panel that may support responsive editing.

## Core Advanced panel

WordPress owns the built-in Advanced panel that contains controls such as HTML anchor and Additional CSS classes.
It is not a Stackable `PanelAdvancedSettings`, so Stackable cannot pass `responsive={ false }` to it.

`ResponsivePanelTabs` adds the `ugb-panel-tabs--is-responsive-filtering` marker while responsive filtering is active.
The panel-tabs stylesheet uses that marker to hide Core's `.block-editor-block-inspector__advanced` panel.
Stackable's own Advanced tab remains available.

## Private API boundary

WordPress 7.1 does not expose the required Responsive Styles state through a public API.
The bridge uses `window.wp.privateApis.__dangerousOptInToUnstableAPIsOnlyForCoreModules` to unlock the block editor store.
All private API access is isolated and guarded with optional access and `try` blocks.

If the private API is unavailable, the helpers return `undefined` and responsive filtering defaults to inactive.
This prevents an unsupported WordPress version or a future private API change from causing a JavaScript error.

When WordPress exposes a stable public API, replace the private access inside `use-core-responsive-editing.js` while preserving the rest of the visibility interface.
