/**
 * Internal dependencies
 */
import { addAttributes } from './attributes'
import { Edit } from './edit'

/**
 * External dependencies
 */
import { Link } from '~stackable/components'
import { getPropsWithDefaults } from '../../util/props'

export const BlockLink = () => {
	return null
}

BlockLink.Content = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, BLOCK_LINK_CONTENT_DEFAULT_PROPS )
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

const BLOCK_LINK_CONTENT_DEFAULT_PROPS = {
	className: '',
	attributes: {},
	href: '',
	isHidden: true,
}

BlockLink.InspectorControls = Edit

BlockLink.addAttributes = addAttributes

BlockLink.addStyles = () => {}
