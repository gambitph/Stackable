# Icon Search component

Used for picking icons or uploading custom SVGs

Returns the SVG string of the icon selected (or uploaded)

## Developer Notes

If a custom SVG icon is uploaded, it will have a class of `ugb-custom-icon`

```html
<svg class="ugb-custom-icon">...</svg>
```

For blocks that automatically color block components depending on the column
background, automatic coloring should NOT be applied to custom uploaded icons or
else they would look broken after uploading.

You can use the `ugb-custom-icon` to filter out the custom icons from being
styles. For example, in the notification block's `style.js`:

```js
[ '.ugb-notification__icon svg:not(.ugb-custom-icon)' ]: {
	color: whiteIfDarkBlackIfLight( iconColor ),
}
```
