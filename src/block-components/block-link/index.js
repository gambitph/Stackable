/**
 * Internal dependencies
 */
import { addAttributes } from './attributes'
import { Edit } from './edit'

/**
 * External dependencies
 */
import { Link } from '~stackable/components'

export const BlockLink = () => {
	return null
}

BlockLink.Content = props => {
	const { href, attributes } = props

	if ( ! attributes.hasBlockLink ) {
		return null
	}

	return (
		<Link.Content
			className="stk-block-link stk--transparent-overlay"
			href={ href || attributes.blockLinkUrl }
			target={ attributes.blockLinkNewTab ? '_blank' : '' }
			rel={ attributes.blockLinkRel }
			aria-hidden="true"
			tabindex="-1"
		/>
	)
}

BlockLink.Content.defaultProps = {
	className: '',
	attributes: {},
	href: '',
}

BlockLink.InspectorControls = Edit

BlockLink.addAttributes = addAttributes

BlockLink.addStyles = () => {}
