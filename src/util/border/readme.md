# Button Utility / Helper Functions

A set of helper functions for an easier implementation of Button options in blocks.

# Attribute List Helper

Adds the required Button attributes:

```js
import { createButtonAttributes } from '@stackable/util'

const attributes = {
	// Creates the attributes button1TextColor, button1BackgroundColor, button1BackgroundColor2, ...
	...createButtonAttributes( 'button1%s' ),
}
```

This is the same as doing:

```js
const attributes = {
	button1TextColor = '',
	button1BackgroundColor = '',
	button1BackgroundColor2 = '',
	// and more...
}
```

# Button Styles Helper

Adds the Button styles from the Button attributes:

```js
import { createButtonStyles } from '@stackable/util'

export const createStyles = props => {
	return {
		'.ugb-card__button1': {
			...createButtonStyles( 'button1%s', '', props.attributes ),
		},
		'.ugb-card__button1:before': {
			...createButtonStyles( 'button1%s', 'before', props.attributes ),
		}
	}
```

This is the same as doing:

```js
export const createStyles = props => {
	return {
		'.ugb-card__button1': {
			backgroundColor: props.attributes.button1BackgroundColor !== '' ? props.attributes.button1BackgroundColor : undefined,
			color: props.attributes.button1TextColor !== '' ? props.attributes.button1TextColor : undefined,
			// and more...
		}
	}
```
