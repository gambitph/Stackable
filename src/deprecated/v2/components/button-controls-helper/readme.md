# Button Controls Helper

Use the helper functions in `@stackable/util/button` in conjuction with this.

Adds the `ButtonControls` in a quicker way:

```js
import { ButtonControlsHelper } from '@stackable/components'

const edit = props {
	return (
		// Creates a Button Controls for all the required attributes.
		<ButtonControlsHelper
			attrNameTemplate="button1%s"
			setAttributes={ props.setAttributes }
			blockAttributes={ props.attributes }
		/>
	)
}
```

This is the same as doing:

```js
import { ButtonControls } from '@stackable/components'

const edit = props {
	return (
		<ButtonControls
			buttonColorType={ props.attributes.button1ColorType },
			buttonColor={ props.attributes.button1Color },
			buttonColor2={ props.attributes.button1Color2 },
			onChangeButtonColorType={ value => props.setAttributes( { button1ColorType: value } ) }
			onChangeButtonColor={ value => props.setAttributes( { button1Color: value } ) }
			onChangeButtonColor2={ value => props.setAttributes( { button1Color2: value } ) }
			// and more...
		/>
	)
}
```
