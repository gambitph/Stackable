export * from './styles'
import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'

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

	if ( id ) {
		return {
			type: 'youtube',
			id,
		}
	}

	// Check for Vimeo.
	id = ( url.match( /vimeo\.com\/(\w*\/)*(\d+)/i ) || [] )[ 2 ]
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
 * Makes a unique ID based on the block's clientID.
 *
 * @param {string} clientID The block's clientID
 *
 * @return {string} A unique ID
 */
export const getUniqueID = clientID => {
	// Create a unique ID based on the block's clientId.
	const last7 = ( 'ugb-' + clientID.substring( clientID.length - 7 ) )
	const first7 = ( 'ugb-' + clientID.substring( 0, 7 ) )

	// Make sure we have a unique one.
	const lastExists = document.querySelectorAll( `.${ last7 }` ).length > 1
	return lastExists ? first7 : last7
}

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
	const minified = css.replace( /\/\*.*?\*\//g, '' ) // Comments.
		.replace( /\n\s*\n/g, '' ) // Comments.
		.replace( /[\n\r \t]/g, ' ' ) // Spaces.
		.replace( / +/g, ' ' ) // Multi-spaces.
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

/**
 * Global responsive setting functions. This is used by the
 * WhenResponsiveScreen and ResponsiveToggle components to
 * specify the current responsive screen size.
 */
let _currentSelectedScreen = 'desktop'
export const getSelectedScreen = () => _currentSelectedScreen
export const setSelectedScreen = value => _currentSelectedScreen = value

let _currentScreenPickerIsOpen = false
export const isScreenPickerOpen = () => _currentScreenPickerIsOpen
export const setIsScreenPickerOpen = value => _currentScreenPickerIsOpen = value
