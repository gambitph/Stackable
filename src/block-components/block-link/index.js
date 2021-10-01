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
	const {
		href, attributes, isHidden,
	} = props

	if ( ! attributes.blockLinkUrl ) {
		return null
	}

	return (
		<Link.Content
			className="stk-block-link stk--transparent-overlay"
			href={ href || attributes.blockLinkUrl }
			target={ attributes.blockLinkNewTab ? '_blank' : '' }
			rel={ attributes.blockLinkRel || undefined }
			title={ attributes.blockLinkTitle || undefined }
			aria-hidden={ isHidden ? 'true' : undefined }
			tabindex={ isHidden ? '-1' : undefined }
		/>
	)
}

BlockLink.Content.defaultProps = {
	className: '',
	attributes: {},
	href: '',
	isHidden: true,
}

BlockLink.InspectorControls = Edit

BlockLink.addAttributes = addAttributes

BlockLink.addStyles = () => {}
