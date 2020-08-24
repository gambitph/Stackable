/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'

/**
 * Gets all the font sizes via getComputedStyle
 *
 * @param {Array} tags An array of tags.
 */
export const getFontSizes = tags => {
	const dummyElement = document.createElement( 'div' )
	dummyElement.classList.add( 'editor-styles-wrapper' )
	dummyElement.innerHTML = `<div class="wp-block">${ tags.map( t => `<${ t }></${ t }>` ).join() }</div>`
	if ( ! document || ! document.body ) {
		return {}
	}
	document.body.appendChild( dummyElement )

	const fontSizes = {}

	tags.forEach( tag => {
		const style = window.getComputedStyle( dummyElement.querySelector( tag ) ).getPropertyValue( 'font-size' )
		fontSizes[ tag ] = Math.round( parseFloat( style ) )
	} )

	document.body.removeChild( dummyElement )

	return fontSizes
}

let fontSizes = {}

/**
 * Fills up the fontSizes with font sizes.
 */
const initFontSizes = () => {
	const TAGS = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p' ]
	fontSizes = {
		...getFontSizes( TAGS ),
	}
}

/**
 * Gets a font size
 *
 * @param {string} tag
 * @param {boolean} forceInit Force to initialize the font size cache
 */
export const getDefaultFontSize = ( tag = 'p', forceInit = false ) => {
	if ( ! Object.keys( fontSizes ).length || forceInit ) {
		initFontSizes()
	}

	return fontSizes[ tag ] || fontSizes.p || 21
}

/**
 * Permanently hide the dismissible notification if clicked.
 */
domReady( () => {
	initFontSizes()
} )
