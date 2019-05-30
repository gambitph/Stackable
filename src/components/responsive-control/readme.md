# Responsive Control

The given control will be displayed 3 times for each screen resolution: desktop, tablet & mobile.

A screen switcher will be displayed on the provided child control.

# Props

`onChange`

If provided, will be called with the arguments: attributeName, value & screen. `setAttributes` will not be called.

Helpful if you want to perform other things aside from just setting an attribute.

```js
onChange={ ( attributeName, value, screen ) => {
	setAttributes( {
		[ attributeName ]: value,
		// Some other things you like to set at the same time for undo/redo preservation.						
	} )
} }
```
