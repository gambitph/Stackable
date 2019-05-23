# Typography Utility / Helper Functions

A set of helper functions for an easier implementation of typography options in blocks.

# Attribute List Helper

Adds the required typography attributes:

```js
import { createTypographyAttributes } from '@stackable/util'

const attributes = {
	// Creates the attributes titleFontFamily, titleFontSize, titleMobileFontSize, ...
	...createTypographyAttributes( 'title%s' ),
}
```

This is the same as doing:

```js
const attributes = {
	titleFontFamily = '',
	titleFontSize = '',
	titleTabletFontSize = '',
	titleMobileFontSize = '',
	titleFontSizeUnit = 'px',
	titleTabletFontSizeUnit = 'px',
	titleMobileFontSizeUnit = 'px',
	// and more...
}
```

# Typography Control Helper (for Block Edit)

Adds the Typography Control in a quicker way:

```js
import { TypographyControlHelper } from '@stackable/util'

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

# Typography Styles Helper

Adds the typography styles from the typography attributes:

```js
import { createTypographyStyles } from '@stackable/util'

export const createStyles = props => {
	return {
		'.ugb-number-box__title': {
			...createTypographyStyles( 'title%s', 'desktop', props.attributes ),
		}
		tablet: {
			'.ugb-number-box__title': {
				...createTypographyStyles( 'title%s', 'tablet', props.attributes ),
			}	
		}
		mobile: {
			'.ugb-number-box__title': {
				...createTypographyStyles( 'title%s', 'mobile', props.attributes ),
			}	
		}
	}
```

This is the same as doing:

```js
export const createStyles = props => {
	return {
		'.ugb-number-box__title': {
			fontFamily: props.attributes.fontFamily !== '' ? props.attributes.fontFamily : undefined,
			fontSize: props.attributes.fontSize !== '' ? `${ props.attributes.fontSize }${ props.attributes.fontSizeUnit }` : undefined,
			// and more...
		}
		tablet: {
			'.ugb-number-box__title': {
				fontSize: props.attributes.tabletFontSize !== '' ? `${ props.attributes.tabletFontSize }${ props.attributes.tabletFontSizeUnit }` : undefined,
				/// and more...
			}	
		}
		mobile: {
			'.ugb-number-box__title': {
				fontSize: props.attributes.mobileFontSize !== '' ? `${ props.attributes.mobileFontSize }${ props.attributes.mobileFontSizeUnit }` : undefined,
				/// and more...
			}	
		}
	}
```
