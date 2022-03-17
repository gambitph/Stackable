# Layout Picker Reset

The layout picker reset button automatically appears on the toolbar of all
Stackable blocks that have variations.

To disable the reset button on a block, add the following in the `supports`
property of the block definition:

```js
supports: {
	stkLayoutReset: false,
}
```
