import { Link } from '~stackable/components'
import { addAttributes } from './attributes'
import { Edit } from './edit'

export const BlockLink = () => {
	return null
}

BlockLink.Content = props => {
	const { attributes } = props

	if ( ! attributes.hasBlockLink ) {
		return null
	}

	return (
		<Link.Content
			className="stk-block-link"
			href={ attributes.blockLinkUrl }
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
}

BlockLink.InspectorControls = Edit

BlockLink.addAttributes = addAttributes

BlockLink.addStyles = () => {}
