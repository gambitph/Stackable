/**
 * Internal dependencies
 */
import { addAttributes } from './attributes'
import { Edit } from './edit'

/*+
 * External dependencies
 */
import { Link as LinkComponent } from '~stackable/components'

export const Link = props => {
	return (
		<LinkComponent className={ props.className }>
			{ props.children }
		</LinkComponent>
	)
}

Link.Content = props => {
	const {
		attributes,
	} = props

	return (
		<LinkComponent.Content
			className={ props.className }
			href={ attributes.linkUrl }
			target={ attributes.linkNewTab ? '_blank' : '' }
			rel={ attributes.linkRel }
			aria-hidden="true"
			tabindex="-1"
		>
			{ props.children }
		</LinkComponent.Content>
	)
}

Link.InspectorControls = Edit

Link.addAttributes = addAttributes

