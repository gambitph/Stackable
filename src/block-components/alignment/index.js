import { addAttributes } from './attributes'
import { Edit } from './edit'
import { Style } from './style'

export * from './use-alignment'

export const Alignment = () => {
	return null
}

Alignment.InspectorControls = Edit

Alignment.addAttributes = addAttributes

Alignment.Style = Style
