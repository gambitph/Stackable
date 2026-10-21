/**
 * Internal dependencies
 */
import { addAttributes } from './attributes'
import { Edit } from './edit'
import { CustomAttributes } from '../custom-attributes'

/*+
 * External dependencies
 */
import { Link as LinkComponent } from '~stackable/components'
import { useBlockAttributesContext } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const Link = props => {
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

Link.defaultProps = {
	className: '',
	linkProps: {},
}

Link.Content = props => {
	const {
		linkProps = {},
		attributes,
	} = props
	const customAttributes = CustomAttributes.getCustomAttributes( attributes, 'linkCustomAttributes' )

	if ( ! attributes.linkHasLink ) {
		return props.children
	}

	return (
		<LinkComponent.Content
			{ ...customAttributes }
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
