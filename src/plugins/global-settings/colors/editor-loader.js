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

const renderGlobalStyles = ( newColors, setStyles ) => {
	// Output all our --stk-global-colors.
	const styleRules = newColors.map( color => {
		if ( color.slug.match( /^stk-global-color/ ) ) {
			return `--${ color.slug || '' }: ${ color.color || '' };`
		}

		return ''
	} )

	setStyles( `:root { ${ styleRules.join( '' ) }}` )

	// Output all the rgba colors, detect the actual color values.
	const rgbaStyleRules = newColors.map( color => {
		if ( color.slug.match( /^stk-global-color/ ) ) {
			const rgbaColor = rgba( window.getComputedStyle( document.documentElement ).getPropertyValue( `--${ color.slug }` ).trim() )
			if ( Array.isArray( rgbaColor ) && rgbaColor.length !== 0 ) {
				rgbaColor.splice( 3, 1 )
				return `--${ color.slug || '' }-rgba: ${ rgbaColor.join( ', ' ) };`
			}
		}

		return ''
	} )

	setStyles( styles => `${ styles } :root { ${ rgbaStyleRules.join( ' ' ) }}` )
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

	return <style>{ styles }</style>
}

domReady( () => {
	const wrapper = document.createElement( 'div' )
	document.body.appendChild( wrapper )
	render( <GlobalColorStyles />, wrapper )
} )
