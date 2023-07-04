# Background Controls Helper

Use the helper functions in `@stackable/util/background` in conjuction with this.

Adds the `BackgroundControls` in a quicker way:

```js
import { BackgroundControlsHelper } from '@stackable/components'

const edit = props {
	return (
		// Creates a Background Controls for all the required attributes.
		<BackgroundControlsHelper
			attrNameTemplate="title%s"
			setAttributes={ props.setAttributes }
			blockAttributes={ props.attributes }
		/>
	)
}
```

This is the same as doing:

```js
import { BackgroundControls } from '@stackable/components'

const edit = props {
	return (
		<BackgroundControls
			backgroundColorType={ props.attributes.backgroundColorType },
			backgroundColor={ props.attributes.backgroundColor },
			backgroundColor2={ props.attributes.backgroundColor2 },
			onChangeBackgroundColorType={ value => props.setAttributes( { backgroundColorType: value } ) }
			onChangeBackgroundColor={ value => props.setAttributes( { backgroundColor: value } ) }
			onChangeBackgroundColor2={ value => props.setAttributes( { backgroundColor2: value } ) }
			// and more...
		/>
	)
}
```
