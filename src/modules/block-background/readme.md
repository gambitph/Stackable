# Block Background Module

Adds the ability for a block to have a background for the entire thing.

Overrides the behavior of supports->align.

# Developer Notes

1. This module automatically makes your block have `support` for `center`, `wide` and `full`.

2. When using this module, a second `BlockAlignmentToolbar` is added to the block. 

The original will still be there, and you'll have to write include some CSS to hide the original `BlockAlignmentToolbar`:

```css
// Hide the block alignment toolbar, because we will replace it with our own in the
[data-type="ugb/number-box"] > .editor-block-list__block-edit > .editor-block-contextual-toolbar > .editor-block-toolbar > .components-toolbar:nth-child(2) {
	display: none;
}
```

3. It's required for the block to use the `withTabbedInspector` HOC for displaying options.
