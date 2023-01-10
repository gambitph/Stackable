import { addAttributes } from './attributes'
import { Style } from './style'
import { Edit } from './edit'

export const Divider = props => {
	const {
		attributes,
		className,
	} = props

	return (
		<div className={ className }>
			{ attributes?.dividerType }
		</div>
	)
}

Divider.Content = props => {
	const {
		attributes,
		className,
	} = props

	return (
		<div className={ className }>
			{ attributes?.dividerType }
		</div>
	)
}

Divider.InspectorControls = Edit

Divider.addAttributes = addAttributes

Divider.Style = Style
