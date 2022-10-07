import { addAttributes } from './attributes'
import { Edit } from './edit'
import { Style } from './style'

export const ContentAlign = () => {
	return null
}

export { getContentAlignmentClasses } from './use-content-align'

ContentAlign.InspectorControls = Edit

ContentAlign.Style = Style

ContentAlign.addAttributes = addAttributes

