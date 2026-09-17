# Custom Attributes Block Component

Gives the ability to add custom attributes to a block or its generated link.

## Usage

The block custom attribute implementation is already handled by the Block Div Block Component.
For a link, render the attributes with `CustomAttributes.getCustomAttributes( attributes, 'linkCustomAttributes' )` or its block-link equivalent.

### Adding inspector controls in `edit.js`

```
<CustomAttributes.InspectorControls />
```

For a block with a configurable link, pass the link attribute name to add a second field below the block attributes.

```
<CustomAttributes.InspectorControls linkAttributeName="linkCustomAttributes" />
```

### Adding attributes in `schema.js`

```
CustomAttributes.addAttributes( attrObject )
```

Link attributes are registered through `Link.addAttributes` or `BlockLink.addAttributes`.
