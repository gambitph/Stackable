import { attributes } from './attributes'
import { Edit } from './edit'
import { addStyles } from './style'

export * from './use-alignment'

export const Alignment = () => {
	return null
}

Alignment.InspectorControls = Edit

Alignment.attributes = attributes

Alignment.addStyles = addStyles
