# Responsive Preview

This enables the responsive preview mode in editor mode.

WordPress 5.5 added a Responsive Preview Mode which allows users to check
the responsiveness of their inside the Block Editor.

This responsive preview mode works well with simple blocks, it doesn't work well
with blocks that have complex HTML structures like Stackable blocks. The
incompatibility is with how the responsive preview mode works when adjusting the
view.

Stackable blocks use media queries to apply CSS rules according to viewport's
width. The corresponding media queries are used when the viewport dimensions of
the browser is changed. However, Gutenberg's preview only changes the width of a
specific DOM element, therefore the necessary media queries are not triggered.

To support this, a `MutationObserver` is added to subscribe to changes in editor
container. Then each Stackable media query in the page is then modified to force
the browser to apply responsive designs accordingly.

# Additional Notes

* `__experimentalSetPreviewDeviceType` and `__experimentalGetPreviewDeviceType`
  can be used to set/get the current preview device. 

