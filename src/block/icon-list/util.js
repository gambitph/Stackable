/**
 * External dependencies
 */
import { range } from 'lodash'
import { faGetSVGIcon } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

/**
 * The default check SVG.
 */
export const DEFAULT_CHECK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 190"><polygon points="173.8,28.4 60.4,141.8 15.7,97.2 5.1,107.8 60.4,163 184.4,39 173.8,28.4"/></svg>'

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
		svgTagString = DEFAULT_CHECK_SVG
	}

	if ( typeof svgTag === 'string' && svgTag.split( '-' ).length === 2 ) {
		const [ prefix, iconName ] = svgTag.split( '-' )
		svgTagString = faGetSVGIcon( prefix, iconName )
	}

	const svgEl = createElementFromHTMLString( svgTagString )
	if ( svgEl ) {
		const svgChildElements = svgEl.querySelectorAll( '*' )

		if ( color ) {
			svgChildElements.forEach( child => {
				if ( child && ! [ 'DEFS', 'TITLE', 'DESC' ].includes( child.tagName ) ) {
					child.setAttribute( 'fill', color )
					child.setAttribute( 'stroke', color )
					child.style.fill = color
					child.style.stroke = color
				}
			} )
			svgEl.setAttribute( 'style', `fill: ${ color } !important; color: ${ color } !important` )
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
