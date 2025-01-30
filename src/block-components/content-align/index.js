import './deprecated'
import { addAttributes } from './attributes'
import { Edit } from './edit'

export const ContentAlign = () => {
	return null
}

export { getContentAlignmentClasses } from './use-content-align'

ContentAlign.InspectorControls = Edit

ContentAlign.addStyles = () => {}

ContentAlign.addAttributes = addAttributes

