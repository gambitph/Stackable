# Background Utility / Helper Functions

A set of helper functions for an easier implementation of image options in blocks.

# Attribute List Helper

Adds the required Image attributes:

```js
import { createImageAttributes } from '@stackable/util'

const attributes = {
	// Creates all the attributes imageImageId, imageImageUrl, imageShape, ...
	...createImageAttributes( 'image%s' ),
}
```

This is the same as doing:

```js
const attributes = {
	imageImageId = '',
	imageImageUrl = '',
	imageShape = '',
	// and more...
}
```

# Image Styles Helper

Adds the Image styles from the Image attributes:

```js
import { createImageStyles } from '@stackable/util'

export const createStyles = props => {
	return {
		'.ugb-feature__image': {
			...createImageStyles( 'image%s', 'desktop', props.attributes ),
		}
		tablet: {
			'.ugb-feature__image': {
				...createImageStyles( 'image%s', 'tablet', props.attributes ),
			}	
		}
		mobile: {
			'.ugb-feature__image': {
				...createImageStyles( 'image%s', 'mobile', props.attributes ),
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
