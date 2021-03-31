import { addAttributes } from './attributes'
import { Edit } from './edit'

export * from './use-responsive'

export const Responsive = () => {
	return null
}

Responsive.InspectorControls = Edit

Responsive.addAttributes = addAttributes
