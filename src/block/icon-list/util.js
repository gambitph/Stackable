/**
 * Internal dependencies
 */
import { deprecatedIcon_2_9_1 } from './deprecated'

/**
 * External dependencies
 */
import { range } from 'lodash'

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

// This function is resource heavy. We have to memoize this to improve performance.

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

// This function is resource heavy. We have to memoize this to improve performance.

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
