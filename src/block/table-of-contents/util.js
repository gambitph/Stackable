/**
 * External dependencies
 */
import { faGetSVGIcon, createElementFromHTMLString } from '~stackable/util'
import { kebabCase } from 'lodash'

/**
 * WordPress dependencies
 */
import {
	__, _x,
} from '@wordpress/i18n'

// The default icon list SVG.
export const DEFAULT_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 190"><polygon points="173.8,28.4 60.4,141.8 15.7,97.2 5.1,107.8 60.4,163 184.4,39 173.8,28.4"/></svg>'

/**
 * Convert SVG tag to base64 string
 *
 * @param {string} svgTag
 * @param {string} color
 * @param {Object} styles additional styles
 *
 * @return {string} base64 string
 */
export const convertSVGStringToBase64 = ( svgTag = '', color = '', styles = {} ) => {
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
			const willEnqueueStyles = Object.keys( styles ).map( key => typeof styles[ key ] !== 'undefined' && styles[ key ] !== '' ? `${ kebabCase( key ) }: ${ styles[ key ] } !important;` : '' ).join( '' )
			svgEl.setAttribute( 'style', `fill: ${ _color } !important; color: ${ _color } !important;` + willEnqueueStyles )
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

// TODO: Coding standards. Subroutine to parse/indent headings lifted from
// Kadence's implentation.
/**
 * @typedef WPHeadingData
 *
 * @property {string} anchor  The anchor link to the heading, or '' if none.
 * @property {string} content The plain text content of the heading.
 * @property {number} level   The heading level.
 */

/**
 * Extracts text, anchor, exclusion, and level from a list of heading blocks.
 *
 * @param {NodeList} headingBlocks The list of heading blocks.
 * @param headings
 * @return {Array} The list of heading parameters.
 */
export function getHeadingsFromHeadingBlocks( headingBlocks, headings ) {
	return [ ...headingBlocks ].map( headingBlock => {
		let anchor = ''

		const isStkHeading = ! headingBlock.classList.contains( 'wp-block-heading' )

		const heading = isStkHeading
			? headingBlock.querySelector( ':scope > .stk-block > .stk-block-heading__text' )
			: headingBlock

		let firstId
		if ( isStkHeading ) {
			const wrapper = headingBlock.querySelector( ':scope > .stk-block-heading' )
			firstId = wrapper
				.getAttribute( 'id' )
				?.trim()
				.split( ' ' )[ 0 ]
		} else if ( heading.hasAttribute( 'id' ) ) {
			firstId = heading
				.getAttribute( 'id' )
				?.trim()
				.split( ' ' )[ 0 ]
		}
		anchor = `#${ firstId }`

		const blockId = isStkHeading ? headingBlock.dataset?.block : heading.dataset?.block
		console.log( 'BLOCKID', blockId )

		let level

		switch ( heading.tagName ) {
			case 'H1':
				level = 1
				break
			case 'H2':
				level = 2
				break
			case 'H3':
				level = 3
				break
			case 'H4':
				level = 4
				break
			case 'H5':
				level = 5
				break
			case 'H6':
				level = 6
				break
		}

		const matchingHeading = headings.find( heading => heading.blockId === blockId )
		const isExcluded = matchingHeading ? matchingHeading.isExcluded : false

		return {
			anchor, content: heading.textContent, level, blockId, isExcluded,
		}
	} )
}

/**
 * Extracts heading data from the provided editorDom.
 *
 * @param {string} editorDom The editorDom to extract heading data from.
 * @param {Array} attributes
 * @return {Array} The list of heading parameters.
 */
export function getHeadingsFromEditorDom( editorDom, attributes ) {
	// Remove template elements so that headings inside them aren't counted.
	// This is only needed for IE11, which doesn't recognize the element and
	// treats it like a div.
	for ( const template of editorDom.querySelectorAll(
		'template'
	) ) {
		editorDom.removeChild( template )
	}

	let allowedHeadings = [ 'H1', 'H2', 'H3', 'H4', 'H5', 'H6' ]
	if ( attributes ) {
		allowedHeadings = []
		if ( attributes.includeH1 ) {
			allowedHeadings.push( 'H1' )
		}
		if ( attributes.includeH2 ) {
			allowedHeadings.push( 'H2' )
		}
		if ( attributes.includeH3 ) {
			allowedHeadings.push( 'H3' )
		}
		if ( attributes.includeH4 ) {
			allowedHeadings.push( 'H4' )
		}
		if ( attributes.includeH5 ) {
			allowedHeadings.push( 'H5' )
		}
		if ( attributes.includeH6 ) {
			allowedHeadings.push( 'H6' )
		}
	}

	if ( allowedHeadings.length > 0 ) {
		const headingBlocks = editorDom.querySelectorAll(
			'.wp-block[data-type="stackable/heading"], .wp-block-heading[data-type="core/heading"]'
		)

		const allowedHeadingBlocks = [ ...headingBlocks ].filter( block => {
			const heading = ! block.classList.contains( 'wp-block-heading' )
				? block.querySelector( ':scope > .stk-block > .stk-block-heading__text' )
				: block

			return allowedHeadings.includes( heading.nodeName )
		} )

		console.log( 'FROM DOM', attributes.headings )
		return getHeadingsFromHeadingBlocks( allowedHeadingBlocks, attributes.headings )
	}
	return []
}

/**
 * @typedef WPNestedHeadingData
 *
 * @property {WPHeadingData}               heading  The heading content, anchor,
 *                                                  and level.
 * @property {number}                      index    The index of this heading
 *                                                  node in the entire nested
 *                                                  list of heading data.
 * @property {?Array<WPNestedHeadingData>} children The sub-headings of this
 *                                                  heading, if any.
 */

/**
 * Takes a flat list of heading parameters and nests them based on each header's
 * immediate parent's level.
 *
 * @param {WPHeadingData[]} headingList The flat list of headings to nest.
 * @param {number} index       The current list index.
 * @return {WPNestedHeadingData[]} The nested list of headings.
 */
export function linearToNestedHeadingList( headingList, index = 0 ) {
	const nestedHeadingList = []
	headingList.forEach( ( heading, key ) => {
		if ( heading.content === '' ) {
			return
		}
		// Make sure we are only working with the same level as the first iteration in our set.
		if ( heading.level === headingList[ 0 ].level ) {
			// Check that the next iteration will return a value.
			// If it does and the next level is greater than the current level,
			// the next iteration becomes a child of the current interation.
			if (
				headingList[ key + 1 ] !== undefined &&
				headingList[ key + 1 ].level > heading.level
			) {
				// We need to calculate the last index before the next iteration that has the same level (siblings).
				// We then use this last index to slice the array for use in recursion.
				// This prevents duplicate nodes.
				let endOfSlice = headingList.length
				for ( let i = key + 1; i < headingList.length; i++ ) {
					if ( headingList[ i ].level === heading.level ) {
						endOfSlice = i
						break
					}
				}

				// We found a child node: Push a new node onto the return array with children.
				nestedHeadingList.push( {
					heading,
					index: index + key,
					children: linearToNestedHeadingList(
						headingList.slice( key + 1, endOfSlice ),
						index + key + 1,
						true
					),
				} )
			} else {
				// No child node: Push a new node onto the return array.
				nestedHeadingList.push( {
					heading,
					index: index + key,
					children: null,
				} )
			}
		}
	} )

	return nestedHeadingList
}
