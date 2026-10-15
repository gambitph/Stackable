# Panel Advaned Settings

An Advanced Panel that can have a toggle switch, and an advanced pull down for showing more controls.

# Auto-Toggle Modifying Attributes

The panel's toggle switch and the controls inside the panel are normally independent from each other.

But you can set the panel to watch for changes in attributes to automatically turn on the toggle with this setup.

```js
<PanelAdvancedSettings
	hasToggle={ true }
	toggleOnSetAttributes={ [ 'attr1', 'attr2' ] }
	toggleAttributeName={ 'showAttr' }
/>
```

With those 3 props above, the panel will watch for changes in the current block's `attr1` and `attr2` attributes.
If any of those gets assigned a value other than blank (empty string), the `showAttr` atttribute will be set to `true`.

*This preserves the undo/redo functionality to just 1 step.*

# Responsive Visibility

Inside a `ResponsiveControlFilterProvider`, the panel can hide itself when Core Responsive Styles is filtering controls for Tablet or Mobile.

Panels made from `BaseControl` or `BaseControl2` children normally do not need a `responsive` prop.
The children register their visibility, and the panel hides when every registered control is filtered.

Use `responsive={ false }` when the whole panel is desktop-only and its custom children cannot register their own responsive capability.
Use `responsive="all"` when a custom panel explicitly supports every viewport.

An omitted capability on a panel with no registered controls is treated as unknown, so the panel remains visible.
This avoids hiding custom or third-party panel content by accident.

See the [Responsive Styles compatibility note](../inspector-tabs/readme.md) for the complete inspector flow.
