import { addAttributes } from './attributes'
import { Edit } from './edit'
import { addStyles } from './style'

export const Columns = () => {
	return null
}

export { deprecateColumnAndRowGap } from './deprecated/index'

Columns.InspectorControls = Edit

Columns.addStyles = addStyles

Columns.addAttributes = addAttributes
