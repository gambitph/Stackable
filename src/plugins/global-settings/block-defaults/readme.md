# Block Defaults

All blocks are included in this list.

Some blocks can opt-out of this feature by adding `stkSaveBlockStyle: false` in
the `supports` field of the block.

When editing a block style, `stkSaveBlockStyle` can be used to define a
structure of blocks to include in the style editor. This is needed by blocks
such as the Table of Contents block, where the block's display depends on the
precense of other blocks.

Example:
```js
stkSaveBlockStyle: [
	[ 'stackable/table-of-contents', {} ],
	// We need to add sample headings for the table of contents block to show things.
	[ 'core/heading', {
		content: __( 'Introduction', 'Table of Contents example text', i18n ),
		anchor: 'heading',
		level: 2,
	} ],
	// ...
	[ 'core/heading', {
		content: __( 'Conclusion', 'Table of Contents example text', i18n ),
		anchor: 'heading',
		level: 2,
	} ],
],
```

// TODO: change `stkSaveBlockStyle` to `stkSaveBlockStyle`
