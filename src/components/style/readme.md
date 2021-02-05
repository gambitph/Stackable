# BlockStyles

Outputs a `<style>` block which contains the converted CSS style string from
a CSS object.

## Usage

The main purpose of this component is to allow another avenue of providing styles
to a block aside from inlined CSS.

```
const styleObject = applyFilters( 'stackable.separator.styles', {
	'.ugb-separator': {
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		marginTop: `${ marginTop - 1 }${ marginUnit }`, // -1 to prevent white lines.
		marginBottom: `${ marginBottom - 1 }${ marginUnit }`, // -1 to prevent white lines.
		marginRight: marginRight !== '' ? `${ marginRight }${ marginUnit }` : undefined,
		marginLeft: marginLeft !== '' ? `${ marginLeft }${ marginUnit }` : undefined,
		paddingLeft: paddingLeft !== '' ? `${ paddingLeft }${ paddingUnit }` : undefined,
		paddingRight: paddingRight !== '' ? `${ paddingRight }${ paddingUnit }` : undefined,
	},
	'.ugb-separator__bottom-pad': {
		height: `${ paddingBottom }${ paddingUnit }`,
		background: layer1Color ? layer1Color : undefined,
	},
	tablet: {
		'.ugb-separator': {
			marginTop: `${ marginTop - 1 }${ marginUnit }`,
			marginBottom: `${ marginBottom - 1 }${ marginUnit }`,
		},
	},
}, design, props )

// ...

// Somewhere in edit.js or save.js, this outputs the styleObject ready for previewing or saving.
<BlockStyles
	blockUniqueClassName={ getUniqueIDFromProps( props ) }
	blockMainClassName="ugb-separator"
	style={ styleObject }
/>
```
