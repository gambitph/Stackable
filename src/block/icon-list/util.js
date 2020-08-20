/**
 * External dependencies
 */
import { range, keys } from 'lodash'

/**
 * Wordpress dependencies
 */
import { sprintf } from '@wordpress/i18n'

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

	return parentElement.firstChild
}

/**
 * Convert SVG tag to base64 string
 *
 * @param {string} svgTag
 * @param {string} color
 * @return {string} base64 string
 */
export const convertSVGStringToBase64 = ( svgTag = '', color = '#000' ) => {
	if ( ! svgTag || ! svgTag.match( /svg/ ) ) {
		return
	}

	const svgEl = createElementFromHTMLString( svgTag )

	const pathElements = svgEl.querySelectorAll( 'path' )
	const gElements = svgEl.querySelectorAll( 'g' )

	if ( svgEl.querySelector( 'path' ) ) {
		keys( pathElements ).forEach( key => {
			pathElements[ key ].setAttribute( 'fill', color )
		} )
	}

	if ( svgEl.querySelector( 'g' ) ) {
		keys( gElements ).forEach( key => {
			gElements[ key ].setAttribute( 'fill', color )
		} )
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
 * Creates icon attributes for Icon List Block
 *
 * @since 2.10.0
 * @param {string} attrNameTemplate
 * @param {number} number of icon attributes
 * @return {Object} Generated attributes
 */
export const createIconListIconAttributes = ( attrNameTemplate = 'icon%d', number = 20 ) => {
	if ( number < 1 ) {
		return null
	}

	const attrNameFormat = ( index = 1 ) => sprintf( attrNameTemplate, index )

	const createIconListIconAttribute = ( index = 1 ) => ( {
		[ `${ attrNameFormat( index ) }` ]: {
			type: 'string',
			default: '',
		},
	} )

	let attributes = {}

	range( 1, number + 1 ).forEach( index => {
		attributes = {
			...attributes,
			...createIconListIconAttribute( index ),
		}
	} )

	return attributes
}
