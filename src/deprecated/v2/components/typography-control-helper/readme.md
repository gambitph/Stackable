# Typography Control Helper

Use the helper functions in `@stackable/util/typography` in conjuction with this.

Adds the `TypographyControl` in a quicker way:

```js
import { TypographyControlHelper } from '@stackable/components'

const edit = props {
	return (
		// Creates a Typography Control for all the required attributes.
		<TypographyControlHelper
			attrNameTemplate="title%s"
			setAttributes={ props.setAttributes }
			blockAttributes={ props.attributes }
		/>
	)
}
```

This is the same as doing:

```js
import { TypographyControl } from '@stackable/components'

const edit = props {
	return (
		<TypographyControl
			fontFamily={ props.attributes.titleFontFamily }
			fontSize={ props.attributes.titleFontSize }
			tabletFontSize={ props.attributes.titleTabletFontSize }
			mobileFontSize={ props.attributes.titleMobileFontSize }
			onChangeFontFamily={ value => props.setAttributes( { titleFontFamily: value } ) }
			onChangeFontSize={ value => props.setAttributes( { titleFontSize: value } ) }
			onChangeTabletFontSize={ value => props.setAttributes( { titleTitleFontSize: value } ) }
			onChangeMobileFontSize={ value => props.setAttributes( { titleMobileFontSize: value } ) }
			// and more...
		/>
	)
}
```
