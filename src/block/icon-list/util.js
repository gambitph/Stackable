/**
 * External dependencies
 */

import { faGetSVGIcon } from '~stackable/util'

// The default icon list SVG.
export const DEFAULT_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 190"><polygon points="173.8,28.4 60.4,141.8 15.7,97.2 5.1,107.8 60.4,163 184.4,39 173.8,28.4"/></svg>'

/**
 * Create a DOM Element based on HTML string
 *
 * @param {string} htmlString
 *
 * @return {*} DOM Element
 */
const createElementFromHTMLString = htmlString => {
	const parentElement = document.createElement( 'div' )
	parentElement.innerHTML = htmlString

	return parentElement.firstElementChild
}

/**
 * Convert SVG tag to base64 string
 *
 * @param {string} svgTag
 * @param {string} color
 * @return {string} base64 string
 */
export const convertSVGStringToBase64 = ( svgTag = '', color = '' ) => {
	let svgTagString = svgTag

	// If no SVG given, use the default SVG.
	if ( ! svgTag ) {
		svgTagString = DEFAULT_SVG
	}

	if ( typeof svgTag === 'string' && svgTag.split( '-' ).length === 2 ) {
		const [ prefix, iconName ] = svgTag.split( '-' )
		svgTagString = faGetSVGIcon( prefix, iconName )
	}

	const svgEl = createElementFromHTMLString( svgTagString )
	if ( svgEl ) {
		const svgChildElements = svgEl.querySelectorAll( '*' )

		if ( color ) {
			let _color = color
			if ( color.match( /#([\d\w]{6})/g ) ) {
				_color = color.match( /#([\d\w]{6})/g )[ 0 ]
			} else if ( color.match( /var\((.*)?--[\w\d-_]+/g ) ) {
				const colorVariable = color.match( /--[\w\d-_]+/g )[ 0 ]
				try {
					// Try and get the actual value, this can possibly get an error due to stylesheet access security.
					_color = window.getComputedStyle( document.documentElement ).getPropertyValue( colorVariable ) || color
				} catch ( err ) {
					_color = color
				}
			}
			svgChildElements.forEach( child => {
				if ( child && ! [ 'DEFS', 'TITLE', 'DESC' ].includes( child.tagName ) ) {
					child.setAttribute( 'fill', _color )
					child.setAttribute( 'stroke', _color )
					child.style.fill = _color
					child.style.stroke = _color
				}
			} )
			svgEl.setAttribute( 'style', `fill: ${ _color } !important; color: ${ _color } !important` )
		}

		/**
		 * Use XMLSerializer to create XML string from DOM Element
		 *
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLSerializer
		 */
		const serializedString = new XMLSerializer().serializeToString( svgEl ) //eslint-disable-line no-undef

		return window.btoa( serializedString )
	}
}
