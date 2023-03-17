import { addAttributes } from './attributes'
import { Edit } from './edit'
import { Style } from './style'
import { horizontalOrientationMigrate } from './deprecated'

export * from './use-alignment'

export const Alignment = () => {
	return null
}

Alignment.InspectorControls = Edit

Alignment.addAttributes = addAttributes

Alignment.Style = Style

Alignment.deprecated = {
	horizontalOrientationMigrate,
}
