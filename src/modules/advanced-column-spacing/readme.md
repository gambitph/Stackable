# Advanced Column Spacing Module

Adds the Advanced Column Spacing panel to the block where users can change column specific settings such as paddings & column gap.

The styles are automatically added to the children of the inner block class `ugb-inner-block > *`

# Developer Notes

It's required for the block to use the `withTabbedInspector` HOC for displaying options.

# Options

`modifyStyles`

Boolean, true

If true, styles are created for the margin & padding values.

	paddings: true,
	columnGap: true,
	height: true,
	verticalAlign: true,
	modifyStyles: true,
	enablePaddingTop: true,
	enablePaddingRight: true,
	enablePaddingBottom: true,
	enablePaddingLeft: true,
