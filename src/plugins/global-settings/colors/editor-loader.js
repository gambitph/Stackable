/**
 * WordPress dependencies
 */
import {
	useSelect,
} from '@wordpress/data'
import {
	useEffect, useState, render,
} from '@wordpress/element'
import domReady from '@wordpress/dom-ready'

/**
 * External dependencies
 */
import rgba from 'color-rgba'
import { compact, isPlainObject } from 'lodash'

const renderGlobalStyles = ( newColors, setStyles ) => {
	// Output all our --stk-global-colors.
	const styleRules = newColors.map( color => {
		if ( ! isPlainObject( color ) ) {
			return null
		}

		if ( typeof color.slug === 'string' && color.slug.startsWith( 'stk-global-color' ) ) {
			return `--${ color.slug || '' }: ${ color.color || '' };`
		}

		return null
	} )

	setStyles( `:root { ${ compact( styleRules ).join( '' ) }}` )

	// Output all the rgba colors, detect the actual color values.
	const rgbaStyleRules = newColors.map( color => {
		if ( ! isPlainObject( color ) ) {
			return null
		}

		if ( typeof color.slug === 'string' && color.slug.startsWith( 'stk-global-color' ) ) {
			const rgbaColor = rgba( window.getComputedStyle( document.documentElement ).getPropertyValue( `--${ color.slug }` ).trim() )
			if ( Array.isArray( rgbaColor ) && rgbaColor.length !== 0 ) {
				rgbaColor.splice( 3, 1 )
				return `--${ color.slug || '' }-rgba: ${ rgbaColor.join( ', ' ) };`
			}
		}

		return null
	} )

	setStyles( styles => `${ styles } :root { ${ compact( rgbaStyleRules ).join( ' ' ) }}` )
}

const GlobalColorStyles = () => {
	const { colors } = useSelect( select => ( {
		colors: select( 'core/block-editor' ).getSettings().colors,
	} ) )
	const [ styles, setStyles ] = useState( '' )

	useEffect( () => {
		if ( colors && Array.isArray( colors ) ) {
			renderGlobalStyles( colors, setStyles )
		}
	}, [ JSON.stringify( colors ) ] )

	return styles
}

domReady( () => {
	const wrapper = document.createElement( 'style' )
	document.body.appendChild( wrapper )
	render( <GlobalColorStyles />, wrapper )
} )
