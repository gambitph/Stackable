# Responsive Preview

This enables the responsive preview mode in editor mode.

WordPress 5.5 added a Responsive Preview Mode which allows users to check
the responsiveness of Stackable blocks inside editor mode. `__experimentalSetPreviewDeviceType`
and `__experimentalGetPreviewDeviceType` are introduced to subscribe to
these changes. 

By default, Stackable blocks are using media queries to apply CSS rules according
to viewport's width. Thus, applying these css rules according to DOMElement's width
is impossible.

To achieve this, a `MutationObserver` is added to subscribe to changes
in editor container. Each Stackable media queries are then modified to
force the browser to apply responsive designs according to the editor's width.
