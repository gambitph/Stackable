# Advanced Block Spacing Module

Adds the Advanced Block Spacing panel to the block where users can change main block settings such as margins & paddings.

The styles are automatically added to the main block class `ugb-main-block`

# Developer Notes

It's required for the block to use the `withTabbedInspector` HOC for displaying options.

# Options

`modifyStyles`

Boolean, true

If true, styles are created for the margin & padding values.

	margins: true,
	paddings: true,
	height: true,
	width: true,
	horizontalAlign: true,
	verticalAlign: true,
	modifyStyles: true,
	enableMarginTop: true,
	enableMarginRight: true,
	enableMarginBottom: true,
	enableMarginLeft: true,
	enablePaddingTop: true,
	enablePaddingRight: true,
	enablePaddingBottom: true,
	enablePaddingLeft: true,
