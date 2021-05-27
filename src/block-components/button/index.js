/**
 * Internal dependencies
 */
import { addAttributes } from './attributes'
import { Style } from './style'
import { Edit } from './edit'

/**
 * External dependencies
 */
import { Link } from '~stackable/components'

export const Button = props => {
	return (
		<Link className={ props.className }>
			{ props.children }
		</Link>
	)
}

Button.Content = props => {
	const {
		attributes,
	} = props

	return (
		<Link.Content
			className={ props.className }
			href={ attributes.linkUrl }
			target={ attributes.linkNewTab ? '_blank' : '' }
			rel={ attributes.linkRel }
			aria-hidden="true"
			tabindex="-1"
		>
			{ props.children }
		</Link.Content>
	)
}

Button.InspectorControls = Edit

Button.addAttributes = addAttributes

Button.Style = Style
