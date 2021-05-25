# Block Styles

Stackable block styles work differently from Gutenberg's block styles - we're not using Gutenberg's native solution because:
1. it adds a **Style panel** that you cannot easily remove (or move to another place)
2. there is an issue that causes slow React rendering times
3. when changing styles, we also need to be able to adjust some of the block's attributes.

# Usage

## Defining Styles
```js
// In block-styles.js

import ImageStyleDefault from './images/default.svg'
import ImageStyleHorizontal from './images/horizontal.svg'
import { i18n } from 'stackable'
import { __ } from '@wordpress/i18n'

export const blockStyles = [
	{
		name: 'default',
		label: 'Default',
		isDefault: true,
		image: ImageStyleDefault,
	},
	{
		name: 'horizontal',
		label: __( 'Horizontal', i18n ),
		image: ImageStyleHorizontal,
	},
]
```

## Adding the Inspector Options & Using in Edit

```js
// In edit.js
import { blockStyles } from './block-styles'
import { useBlockStyle } from '~stackable/hooks'

const edit = props => {
	const blockStyle = useBlockStyle( blockStyles )

	render (
		<BlockStyle.InspectorControls styles={ blockStyles } />
	)
}
```

## Using in Style

```js
// In style.js
import { blockStyles } from './block-styles'
import { useBlockAttributes, getBlockStyle } from '~stackable/hooks'
import { useMemo } from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

export const CardStyles = props => {
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )
	const blockStyle = useMemo( () => getBlockStyle( blockStyles, attributes.className ), [ attributes.className ] )
	// blockStyle === 'horizontal'
}

CardStyles.Content = props => {
	const blockStyle = getBlockStyle( blockStyles, props.attributes.className )
	// blockStyle === 'horizontal'
}
```

## Using in Save

```js
// In save.js
import { blockStyles } from './block-styles'

const Save = props => {
	const blockStyle = getBlockStyle( blockStyles, props.attributes.className )
	// blockStyle === 'horizontal'
}
```
