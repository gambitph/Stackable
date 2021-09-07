import { addAttributes } from './attributes'
import { Edit } from './edit'
import { Style } from './style'

export const Transform = () => {
	return null
}

Transform.InspectorControls = Edit

Transform.addAttributes = addAttributes

Transform.Style = Style
