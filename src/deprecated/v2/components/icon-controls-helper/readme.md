# Icon Controls Helper

Use the helper functions in `@stackable/util/icon` in conjuction with this.

Adds the `IconControls` in a quicker way:

```js
import { IconControlsHelper } from '@stackable/components'

const edit = props {
	return (
		// Creates a Icon Controls for all the required attributes.
		<IconControlsHelper
			attrNameTemplate="icon1%s"
			setAttributes={ props.setAttributes }
			blockAttributes={ props.attributes }
		/>
	)
}
```

This is the same as doing:

```js
import { IconControls } from '@stackable/components'

const edit = props {
	return (
		<IconControls
			iconColorType={ props.attributes.icon1ColorType },
			iconColor={ props.attributes.icon1Color },
			iconColor2={ props.attributes.icon1Color2 },
			onChangeIconColorType={ value => props.setAttributes( { icon1ColorType: value } ) }
			onChangeIconColor={ value => props.setAttributes( { icon1Color: value } ) }
			onChangeIconColor2={ value => props.setAttributes( { icon1Color2: value } ) }
			// and more...
		/>
	)
}
```
