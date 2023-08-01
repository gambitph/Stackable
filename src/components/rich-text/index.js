/**
 * Our own RichText component that uses our own hooks to load custom fonts.
 */

/**
 * External dependencies
 */
import { useBlockAttributesContext, useFontLoader } from '~stackable/hooks'
import { getAttrNameFunction } from '~stackable/util'
/**
 * WordPress dependencies
 */
import { RichText as _RichText } from '@wordpress/block-editor'
import {
	 forwardRef,
	 memo,
} from '@wordpress/element'

const RichText = memo( forwardRef( ( props, ref ) => {
	const {
		attrNameTemplate,
	} = props

	const {
		fontFamily,
	} = useBlockAttributesContext( attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		return {
			fontFamily: attributes[ getAttrName( 'fontFamily' ) ],
		}
	} )

	useFontLoader( fontFamily )

	return (
		<_RichText
			ref={ ref }
			{ ...props }
		/>
	)
} ) )

RichText.defaultProps = {
	attrNameTemplate: '%s',
}

RichText.Content = props => {
	return (
		<_RichText.Content
			{ ...props }
		/>
	)
}

export default RichText
