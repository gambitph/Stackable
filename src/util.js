import { __ } from '@wordpress/i18n'

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
		return __( 'Description for this block. You can use this space for describing your block.' )
	} else if ( length === 'medium' ) {
		return `${ descriptionPlaceholder() } ${ descriptionPlaceholder( 'short' ) }`
	} else if ( length === 'long' ) {
		return `${ descriptionPlaceholder( 'medium' ) } ${ descriptionPlaceholder() } ${ descriptionPlaceholder( 'short' ) }`
	}
	return __( 'Description for this block. Use this space for describing your block. Any text will do.' )
}

/**
 * Are we inside the Gutenberg Block Editor?
 *
 * @return {boolean} True if inside the Gutenberg Block Editor, false if not (e.g. in the frontend).
 */
export const isEditor = () => typeof window.wp !== 'undefined' && typeof window.wp.editor !== 'undefined'
