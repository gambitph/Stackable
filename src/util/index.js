export * from './admin'
export * from './font'
export * from './attributes'
export * from './typography'
export * from './border'
export * from './image'
export * from './image-background'
export * from './button'
export * from './styles'
export * from './social'
export * from './blocks'
export * from './svg'
export * from './hooks'
export * from './icon'
export * from './fontawesome'
export * from './user'
export * from './colors'
export * from './element'

/**
 * WordPress dependencies
 */

import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import striptags from 'striptags'
import { inRange } from 'lodash'
import { getBlockVariations } from '@wordpress/blocks'
import { compare } from 'compare-versions'

export const getUniqueBlockClass = uniqueId => uniqueId ? `stk-${ uniqueId }` : ''

/**
 * Returns an array range of numbers.
 *
 * @param {number} start Starting number range.
 * @param {number} end Ending number range.
 *
 * @return {Array} The range of start to end.
 *
 * @see https://stackoverflow.com/questions/36947847/how-to-generate-range-of-numbers-from-0-to-n-in-es2015-only
 */
export const range = ( start, end ) => {
	return Array.from( { length: ( end - start ) }, ( v, k ) => k + start )
}

/**
 * Check whether a URL is a video file.
 *
 * @param {string} url
 *
 * @return {boolean} True if a video.
 */
export const urlIsVideo = url => url?.endsWith( 'mp4' ) || url?.endsWith( 'webm' ) || url?.endsWith( 'ogg' )

/**
 * From a URL, get the video ID and provider: YouTube or Vimeo.
 *
 * @param {string} url
 *
 * @return {Object} An object containing the video ID and provider name.
 */
export const getVideoProviderFromURL = url => {
	let id = ''

	// Check for YouTube.
	id = ( url.match( /youtube\.com\/watch\?v=([^\&\?\/]+)/i ) || [] )[ 1 ]

	if ( ! id ) {
		id = ( url.match( /youtube\.com\/embed\/([^\&\?\/]+)/i ) || [] )[ 1 ]
	}
	if ( ! id ) {
		id = ( url.match( /youtube\.com\/v\/([^\&\?\/]+)/i ) || [] )[ 1 ]
	}
	if ( ! id ) {
		id = ( url.match( /youtu\.be\/([^\&\?\/]+)/i ) || [] )[ 1 ]
	}
	if ( ! id ) {
		id = ( url.match( /youtube\.com\/shorts\/([^\&\?\/]+)/i ) || [] )[ 1 ]
	}

	if ( id ) {
		return {
			type: 'youtube',
			id,
		}
	}

	// Check for Vimeo.
	id = ( url.match( /vimeo\.com\/(\d+)/i ) || [] )[ 1 ] // https://vimeo.com/VIDEO_ID or https://vimeo.com/VIDEO_ID/PRIVACY_HASH

	if ( ! id ) {
		id = ( url.match( /vimeo\.com\/(\w*\/)*(\d+)/i ) || [] )[ 2 ] // https://vimeo.com/CATEGORY/IDENTIFIER/VIDEO_ID
	}
	if ( ! id ) {
		id = ( url.match( /^\d+$/i ) || [] )[ 0 ]
	}

	if ( id ) {
		return {
			type: 'vimeo',
			id,
		}
	}

	return {
		type: 'youtube',
		id: url,
	}
}

/**
 * Generates a placeholder text for short to long descriptions.
 * Deprecations are dependent on this, this shouldn't change.
 *
 * @param {string} length The length of the placeholder. Values are: short, medium, long, normal. Defaults to normal.
 *
 * @return {string} Placeholder string.
 */
export const descriptionPlaceholder = length => {
	if ( length === 'short' ) {
		return __( 'Description for this block. You can use this space for describing your block.', i18n )
	} else if ( length === 'medium' ) {
		return `${ descriptionPlaceholder() } ${ descriptionPlaceholder( 'short' ) }`
	} else if ( length === 'long' ) {
		return `${ descriptionPlaceholder( 'medium' ) } ${ descriptionPlaceholder() } ${ descriptionPlaceholder( 'short' ) }`
	}
	return __( 'Description for this block. Use this space for describing your block. Any text will do.', i18n )
}

/**
 * Are we inside the Gutenberg Block Editor?
 *
 * @return {boolean} True if inside the Gutenberg Block Editor, false if not (e.g. in the frontend).
 */
export const isEditor = () => typeof window.wp !== 'undefined' && typeof window.wp.editor !== 'undefined'

/**
 * Simple CSS minification.
 *
 * @see https://stackoverflow.com/questions/15411263/how-do-i-write-a-better-regexp-for-css-minification-in-php
 *
 * @param {string} css CSS to minify.
 * @param {boolean} important Add !important to all rules.
 *
 * @return {string} Minified CSS
 */
export const minifyCSS = ( css, important = false ) => {
	if ( ! css ) {
		return css
	}

	const minified = css.replace( /\/\*.*?\*\//g, '' ) // Comments.
		.replace( /\n\s*\n/g, '' ) // Comments.
		.replace( /[\n\r \t]/g, ' ' ) // Spaces.
		.replace( / +/g, ' ' ) // Multi-spaces.
		.replace( /:is/g, ' :is' )
		.replace( / ?([,:;{}]) ?/g, '$1' ) // Extra spaces.
		.replace( /[^\}\{]+\{\}/g, '' ) // Blank selectors.
		.replace( /[^\}\{]+\{\}/g, '' ) // Blank selectors. Repeat to catch empty media queries.
		.replace( /;}/g, '}' ) // Trailing semi-colon.
		.trim()

	if ( ! important ) {
		return minified
	}

	return minified
		.replace( /\s?\!important/g, '' ) // Remove all !important
		.replace( /([;\}])/g, ' !important$1' ) // Add our own !important.
		.replace( /\} !important\}/g, '}}' ) // Ending of media queries "}}" get an added !important from the previous line, remove it.
		.trim()
}

const BREAKPOINTS = {
	Tablet: 1024 - 1, // Need to minus one so we can detect between values.
	Mobile: 768 - 1, // Need to minus one so we can detect between values.
}

/**
 * "Compiles" CSS - compiles the CSS for use of a specific block only.
 *
 * @param {string} css
 * @param {string} mainClass
 * @param {string} uniqueID
 * @param {boolean} isEditor If true, will preppend '.editor-styles-wrapper' to all selectors.
 * @param {string} deviceType the current editor device type.
 * @return {string} CSS
 */
export const compileCSS = ( css, mainClass, uniqueID, isEditor = false, deviceType = 'Desktop' ) => {
	// Regex steps:
	// Add the unique ID:
	// 		".ugb-accordion" -> ".uniqueID .ugb-accordion"
	// 		".ugb-accordion__title" -> ".uniqueID .ugb-accordion__title"
	// Connect the unique ID and the main class:
	// 		".ugb-accordion" -> ".uniqueID.ugb-accordion"
	// 		".ugb-accordion__title" -> ".uniqueID .ugb-accordion__title"
	return ( css || '' ).replace( /\/\*[\s\S]*?\*\//g, '' )
		.replace( /\/\/(.*)?\n/g, '' )
		.replace( /([^}]+)({)/g, ( match, selector, paren ) => {
			// Ignore media queries (re-add them after fixing the classes)
			if ( selector.match( /@\w+/ ) ) {
				return selector.replace( /(@\w+[^{]+{\s*)([^{]+)/g, ( match, mediaQuery, selector ) => {
					const newSelector = prependCSSClass( selector, mainClass, uniqueID )

					if ( isEditor && deviceType !== 'Desktop' ) {
						let minWidth = mediaQuery?.match( /min-width:\s*(\d+)px/ )?.[ 1 ]
						let maxWidth = mediaQuery?.match( /max-width:\s*(\d+)px/ )?.[ 1 ]

						if ( typeof minWidth !== 'string' ) {
							minWidth = 0
						}

						if ( typeof maxWidth !== 'string' ) {
							maxWidth = 9999
						}

						// If the value is for the responsive screen, enable them.
						if ( inRange( BREAKPOINTS[ deviceType ], parseInt( minWidth ), parseInt( maxWidth ) ) ) {
							return `@media screen { ${ newSelector } ${ paren }`
						}
					}

					return `${ mediaQuery } ${ newSelector } ${ paren }`
				} )
			}

			const newSelector = prependCSSClass( selector, mainClass, uniqueID )
			return ( isEditor ? '.editor-styles-wrapper ' : '' ) + `${ newSelector } ${ paren }`
		} ).trim()
}

const prependCSSClassCache = {}

/**
 * Ensures the cssSelector is only applied to the uniqueClassName element.
 * Wraps the cssSelector with a uniqueClassName, and takes into account the mainClassName.
 * If the cssSelector is already using the uniqueClassName, a new class isn't added anymore.
 *
 * For example:
 * .title-block -> .my-title-be8d9a.title-block
 * .title-block span -> .my-title-be8d9a.title-block span
 * span -> .my-title-be8d9a span
 *
 * @param {string} cssSelector The CSS selector.
 * @param {string} mainClassName The main class of the block to target.
 * @param {string} uniqueClassName The unique parent classname to wrap the selector.
 * @param {string} wrapSelector All selectors will be wrapped in this if provided.
 *
 * @return {string} The modified CSS selector.
 */
export const prependCSSClass = ( cssSelector, mainClassName = '', uniqueClassName = '', wrapSelector = '' ) => {
	const key = `${ cssSelector }-${ mainClassName }-${ uniqueClassName }-${ wrapSelector }`
	if ( prependCSSClassCache[ key ] ) {
		return prependCSSClassCache[ key ]
	}

	const selector = cssSelector.trim().replace( /[\n\s\t]+/g, ' ' )
		// Ensure that the commas inside :is and :where are untouched.
		.replace( /:(is|where|matches)\([^\)]*\)/g, s => {
			return s.replace( /,/g, '|||' )
		} )
		.split( ',' )
		.map( s => {
			let newSelector = ''
			if ( s.includes( '[data-block=' ) ||
			     s === 'html' ||
			     s === 'body'
			) {
				newSelector = s
			} else if ( s.includes( '%s' ) ) {
				newSelector = s.replaceAll( '%s', uniqueClassName )
			} else if ( ! uniqueClassName || ! mainClassName ) {
				newSelector = s
			} else if ( s.includes( uniqueClassName ) ) {
				newSelector = s
			} else if ( uniqueClassName && ! mainClassName ) {
				newSelector = `.${ uniqueClassName } ${ s.trim() }`
			} else {
				newSelector = `.${ uniqueClassName } ${ s.trim() }`
					.replace( new RegExp( `(.${ uniqueClassName }) (.${ mainClassName }(#|:|\\[|\\.|\\s|$))`, 'g' ), '$1$2' )
					.replace( /\s:(?!(is|where))/, ':' ) // If the selector given is just a pseudo selector ':before', it will produce ' :before', remove the extra space.
			}
			return wrapSelector ? `${ wrapSelector } ${ newSelector }` : newSelector
		} )
		.join( ', ' )
		// Bring back the commas inside :is and :where.
		.replace( /\|\|\|/g, ', ' )

	prependCSSClassCache[ key ] = selector
	return selector
}

/**
 * Moves an array value to a new index.
 *
 * @param {Array} values The array to manipulate
 * @param {number} oldIndex Index to move from
 * @param {number} newIndex Index to move to
 */
export const moveArrayIndex = ( values, oldIndex, newIndex ) => {
	values.splice( oldIndex < newIndex ? newIndex + 1 : newIndex, 0, values[ oldIndex ] ) // Add the value in new position.
	values.splice( oldIndex < newIndex ? oldIndex : oldIndex + 1, 1 ) // Remove value in old position.
	return values
}

/**
 * Recursively add uniqueId to inner blocks.
 *
 * @param {Array} innerBlocks
 *
 * @return {void}
 */
export const recursivelyAddUniqueIdToInnerBlocks = ( innerBlocks = [] ) => {
	if ( innerBlocks.length === 0 ) {
		return null
	}

	innerBlocks.forEach( innerBlock => {
		if ( innerBlock.name.startsWith( 'stackable/' ) ) {
			// Only do this for blocks with variations, because if a block
			// doesn't have a uniqueId it will show the layout picker.
			const hasVariations = getBlockVariations( innerBlock.name ).length > 0
			if ( hasVariations ) {
				innerBlock.attributes = {
					...innerBlock.attributes,
					uniqueId: createUniqueClass( innerBlock.clientId ),
				}
			}
		}

		recursivelyAddUniqueIdToInnerBlocks( innerBlock.innerBlocks )
	} )
}

/**
 * Checks whether the DOM element is the parent of another DOM element.
 *
 * @param {Element} parent Parent element
 * @param {Element} child Child element
 * @return {boolean} True if the parent has the child
 */
export const isElementDescendant = function( parent, child ) {
	let node = child.parentNode
	while ( node ) {
		if ( node === parent ) {
			return true
		}

		// Traverse up to the parent
		node = node.parentNode
	}

	// Go up until the root but couldn't find the `parent`
	return false
}

/**
 * Sanitized a string to be used as an id attribute in html
 *
 * @param {string} str
 * @return {string} The sanitized
 */
export const sanitizeIdAttr = str => {
	return striptags( str.replace( /&lt;/g, '<' ).replace( /&gt;/g, '>' ).replace( /&nbsp;/g, ' ' ).replace( /&[\w\d]+;/g, '-' ) )
		.replace( /<[^>]*>/g, '' )
		.replace( /[^\w\d\s-_]/g, '' )
		.replace( /[^\w\d]/g, '-' )
		.replace( /[-]+/g, '-' )
		.trim()
		.toLowerCase()
}

export const createUniqueClass = uid => `${ uid.substring( 0, 7 ) }`

/**
 * A more human-readable style of semantic version compare
 *
 * @param {string} version1
 * @param {string} operator
 * @param {string} version2
 * @return {boolean} True if the operator is met.
 */
export const semverCompare = ( version1, operator, version2 ) => {
	return compare( version1, version2, operator )
}
