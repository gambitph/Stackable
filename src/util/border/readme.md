# Border Utility / Helper Functions

A set of helper functions for an easier implementation of Border options in blocks.

# Attribute List Helper

Adds the required Border attributes:

```js
import { createBorderAttributes } from '@stackable/util'

const attributes = {
	// Creates the attributes borderType, borderColor, ...
	...createBorderAttributes( 'column%s' ),
}
```

This is the same as doing:

```js
const attributes = {
	columnBorderType = '',
	columnBorderColor = '',
	// and more...
}
```

# Border Styles Helper

Adds the Border styles from the Border attributes:

```js
import { createBorderStyles } from '@stackable/util'

export const createStyles = props => {
	return {
		...createBorderStyleSet( 'column%s', '.ugb-card__item', props.attributes ),
	}
}
```

This is the same as doing:

```js
export const createStyles = props => {
	return {
		'.ugb-card__item': {
			borderStyle: props.attributes.columnBorderType !== '' ? props.attributes.columnBorderType : undefined,
			borderColor: props.attributes.columnBorderColor !== '' ? props.attributes.columnBorderColor : undefined,
			// and more...
		}
	}
```
