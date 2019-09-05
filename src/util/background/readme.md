# Background Utility / Helper Functions

A set of helper functions for an easier implementation of background options in blocks.

# Attribute List Helper

Adds the required Background attributes:

```js
import { createBackgroundAttributes } from '@stackable/util'

const attributes = {
	// Creates the attributes titleFontFamily, titleFontSize, titleMobileFontSize, ...
	...createBackgroundAttributes( 'title%s' ),
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

# Background Styles Helper

Adds the Background styles from the Background attributes:

```js
import { createBackgroundStyles } from '@stackable/util'

export const createStyles = props => {
	return {
		'.ugb-number-box__title': {
			...createBackgroundStyles( 'title%s', 'desktop', props.attributes ),
		}
		tablet: {
			'.ugb-number-box__title': {
				...createBackgroundStyles( 'title%s', 'tablet', props.attributes ),
			}	
		}
		mobile: {
			'.ugb-number-box__title': {
				...createBackgroundStyles( 'title%s', 'mobile', props.attributes ),
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
