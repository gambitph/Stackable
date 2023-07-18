/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data'
import { useEffect, useState } from '@wordpress/element'

/**
 * External dependencies
 */
import rgba from 'color-rgba'
import { compact } from 'lodash'

const renderGlobalStyles = ( newColors, isEditingTemplate, setStyles ) => {
	// Output all our --stk-global-colors.
	const styleRules = newColors.map( color => {
		return `--${ color.slug || '' }: ${ color.color || '' };`
	} )

	setStyles( `:root { ${ compact( styleRules ).join( '' ) }}` )

	// Output all the rgba colors, detect the actual color values.
	const rgbaStyleRules = newColors.map( color => {
		const windowObject = isEditingTemplate ? document.querySelector( 'iframe[name="editor-canvas"]' )?.contentWindow || window : window
		const documentObject = isEditingTemplate ? windowObject.document : window.document

		const rgbaColor = rgba( windowObject.getComputedStyle( documentObject.documentElement ).getPropertyValue( `--${ color.slug }` ).trim() )
		if ( Array.isArray( rgbaColor ) && rgbaColor.length !== 0 ) {
			rgbaColor.splice( 3, 1 )
			return `--${ color.slug || '' }-rgba: ${ rgbaColor.join( ', ' ) };`
		}

		return null
	} )

	setStyles( styles => `${ styles } :root { ${ compact( rgbaStyleRules ).join( ' ' ) }}` )
}

export const GlobalColorStyles = () => {
	const { colors, isEditingTemplate } = useSelect( select => ( {
		colors: select( 'stackable/global-colors' ).getSettings().stackableColors || [],
		isEditingTemplate: select( 'core/edit-post' )?.isEditingTemplate?.() || false,
	} ) )
	const [ styles, setStyles ] = useState( '' )

	useEffect( () => {
		if ( colors && Array.isArray( colors ) ) {
			renderGlobalStyles( colors, isEditingTemplate, setStyles )
		}
	}, [ JSON.stringify( colors ) ] )

	return styles
}
