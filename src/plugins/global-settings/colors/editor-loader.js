/**
 * Wordpress dependencies
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

const GlobalColorStyles = () => {
	const { colors, defaultColors } = useSelect( select => ( {
		 colors: select( 'core/block-editor' ).getSettings().colors,
		 defaultColors: select( 'stackable-global-colors' ).getSettings().defaultColors,
	} ) )
	const [ styles, setStyles ] = useState( '' )

	const renderGlobalStyles = newColors => {
		// Output all our --stk-global-colors.
		const styleRules = newColors.map( color => {
			if ( color.colorVar && color.color ) {
				return `${ color.colorVar || '' }: ${ color.color || '' };`
			}

			return ''
		} )

		setStyles( `:root { ${ styleRules.join( '' ) }}` )

		// Output all the rgba colors, detect the actual color values.
		const rgbaStyleRules = newColors.map( color => {
			if ( color.colorVar ) {
				const rgbaColor = rgba( window.getComputedStyle( document.documentElement ).getPropertyValue( color.colorVar ).trim() )
				if ( Array.isArray( rgbaColor ) && rgbaColor.length !== 0 ) {
					rgbaColor.splice( 3, 1 )
					return `${ color.colorVar || '' }-rgba: ${ rgbaColor.join( ', ' ) };`
				}
			}

			return ''
		} )

		setStyles( styles => `${ styles } :root { ${ rgbaStyleRules.join( ' ' ) }}` )
	}

	useEffect( () => {
		const timeout = setTimeout( () => {
			if ( defaultColors && Array.isArray( defaultColors ) && defaultColors.length ) {
				renderGlobalStyles( colors )
			}
		}, 100 )
		return () => clearTimeout( timeout )
	}, [ colors, defaultColors ] )

	return <style>{ styles }</style>
}

domReady( () => {
	const wrapper = document.createElement( 'div' )
	document.body.appendChild( wrapper )
	render( <GlobalColorStyles />, wrapper )
} )
