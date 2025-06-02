import { addAttributes } from './attributes'
import { Edit } from './edit'
import { addStyles } from './style'

export * from './use-alignment'

export { deprecateInnerBlockRowGapAndContainerHeight } from './deprecated/index'

export const Alignment = () => {
	return null
}

Alignment.InspectorControls = Edit

Alignment.addAttributes = addAttributes

Alignment.addStyles = addStyles
