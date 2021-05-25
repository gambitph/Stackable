/**
 * Internal dependencies
 */
import { addAttributes } from './attributes'
import { Style } from './style'
import { Edit } from './edit'

export const Button = props => {
	return (
		<a // eslint-disable-line
			className={ props.className }
		>
			{ props.children }
		</a>
	)
}

Button.Content = props => {
	return (
		<a // eslint-disable-line
			className={ props.className }
		>
			{ props.children }
		</a>
	)
}

Button.InspectorControls = Edit

Button.addAttributes = addAttributes

Button.Style = Style
