/**
 * Our own RichText component that uses our own hooks to load custom fonts.
 */

/**
 * External dependencies
 */
import { useBlockAttributesContext, useFontLoader } from '~stackable/hooks'
import { getAttrNameFunction } from '~stackable/util'
import { getPropsWithDefaults } from '../../util/props'
/**
 * WordPress dependencies
 */
import { RichText as _RichText } from '@wordpress/block-editor'
import {
	 forwardRef,
	 memo,
} from '@wordpress/element'

const RichText = memo( forwardRef( ( incomingProps, ref ) => {
	const props = getPropsWithDefaults( incomingProps, RICH_TEXT_DEFAULT_PROPS )
	const {
		attrNameTemplate,
		...propsToPass
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
			{ ...propsToPass }
		/>
	)
} ) )

const RICH_TEXT_DEFAULT_PROPS = {
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
