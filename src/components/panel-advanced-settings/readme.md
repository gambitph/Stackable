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
