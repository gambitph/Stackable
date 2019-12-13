With Click Open Inspector
=========================

Usage:
```js
withClickOpenInspector( [
	// [ 'selector that will match the clicked element', 'panelId' ],
	[ '.ugb-cta__title', 'title' ],
	[ '.ugb-cta__description', 'description' ],
	[ '.ugb-button', 'button' ],
] )
```

Make sure that Panels have the class `ugb-panel--${ panelId }`.

You can also use
```js
<PanelAdvancedSettings
	title={ __( 'Title', i18n ) }
	id="title"
	// ...
/>
```
