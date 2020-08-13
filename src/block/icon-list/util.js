/**
 * Internal Dependencies
 */
import { deprecatedIcon_2_9_1 } from './deprecated'

/**
 * Create a DOM Element based on HTML string
 *
 * @param {string} htmlString
 *
 * @return {*} DOM Element
 */
export const createElementFromHTMLString = htmlString => {
	const parentElement = document.createElement( 'div' )
	parentElement.innerHTML = htmlString

	return parentElement.firstChild
}

/**
 * Convert SVG tag to base64 string
 *
 * @param {string} svgTag
 * @param color
 * @return {string} base64 string
 */
export const convertSVGStringToBase64 = ( svgTag = '', color = '#000' ) => {
	if ( ! svgTag || ! svgTag.match( /svg/ ) ) {
		return
	}

	const svgEl = createElementFromHTMLString( svgTag )

	if ( svgEl.querySelector( 'path' ) ) {
		svgEl.querySelector( 'path' ).setAttribute( 'fill', color )
	}

	if ( svgEl.querySelector( 'g' ) ) {
		svgEl.querySelector( 'g' ).setAttribute( 'fill', color )
	}

	/**
	 * Use XMLSerializer to create XML string from DOM Element
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLSerializer
	 */
	const serializedString = new XMLSerializer().serializeToString( svgEl ) //eslint-disable-line no-undef

	return window.btoa( serializedString )
}

/**
 * Handles icon atttribute deprecation in 2.9.1
 *
 * @param {string} icon
 * @param {string} iconShape
 *
 * @return {string} SVG String
 */
export const updateIconAttribute = ( icon = '', iconShape = 'default' ) => {
	if ( ! icon ) {
		return deprecatedIcon_2_9_1[ `check-default` ]
	}
	const updatedIcon = deprecatedIcon_2_9_1[ `${ icon }-${ iconShape || 'default' }` ]
	return updatedIcon ? updatedIcon : icon
}
