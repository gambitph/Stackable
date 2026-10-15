/**
 * Internal dependencies
 */
import { addAttributes } from './attributes'
import { Edit } from './edit'

/*+
 * External dependencies
 */
import { Link as LinkComponent } from '~stackable/components'
import { useBlockAttributesContext } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { getPropsWithDefaults } from '../../util/props'

export const Link = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, LINK_DEFAULT_PROPS )
	const linkHasLink = useBlockAttributesContext( attributes => attributes.linkHasLink )

	if ( ! linkHasLink ) {
		return props.children
	}

	return (
		<LinkComponent
			{ ...props.linkProps }
			className={ props.className }
		>
			{ props.children }
		</LinkComponent>
	)
}

const LINK_DEFAULT_PROPS = {
	className: '',
	linkProps: {},
}

Link.Content = props => {
	const {
		linkProps = {},
		attributes,
	} = props

	if ( ! attributes.linkHasLink ) {
		return props.children
	}

	return (
		<LinkComponent.Content
			{ ...linkProps }
			className={ props.className }
			href={ attributes.linkUrl || undefined }
			target={ attributes.linkNewTab ? '_blank' : undefined }
			rel={ attributes.linkRel || undefined }
			title={ attributes.linkTitle || undefined }
		>
			{ props.children }
		</LinkComponent.Content>
	)
}

Link.InspectorControls = Edit

Link.addAttributes = addAttributes

