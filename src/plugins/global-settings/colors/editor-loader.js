/**
 * Wordpress dependencies
 */
import {
	useSelect, dispatch,
} from '@wordpress/data'
import {
	useEffect, useState, render,
} from '@wordpress/element'
import domReady from '@wordpress/dom-ready'

/**
 * External dependencies
 */
import rgba from 'color-rgba'
import md5 from 'md5'

const GlobalColorStyles = () => {
	const { colors, defaultColors } = useSelect( select => ( {
		 colors: select( 'core/block-editor' ).getSettings().colors,
		 defaultColors: select( 'core/block-editor' ).getSettings().defaultColors,
	} ) )
	const [ styles, setStyles ] = useState( '' )

	const renderGlobalStyles = newColors => {
		const styleRules = newColors.map( color => {
			if ( color.colorVar && color.fallback ) {
				return `${ color.colorVar || '' }: ${ color.fallback || '' };`
			}

			return ''
		} )

		setStyles( `:root { ${ styleRules.join( '' ) }}` )

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
				if ( colors.some( color => ! color.colorVar || ! color.fallback ) ) {
					// Handle the addition of other colors in other plugin global color settings.
					const newColors = colors.map( color => {
						const { name, slug } = color
						const newColor = { name, slug }
						if ( ! color.colorVar || ! color.fallback ) {
							newColor.colorVar = `--stk-global-color-${ md5( Math.floor( Math.random() * new Date().getTime() ) ).substr( 0, 5 ) }`
							newColor.color = `var(${ newColor.colorVar }, ${ color.color })`
							newColor.fallback = color.color
							return newColor
						}
						return color
					} )
					dispatch( 'core/block-editor' ).updateSettings( {
						colors: newColors,
					} )
				} else {
					renderGlobalStyles( colors )
				}
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
