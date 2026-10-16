/**
 * Link values that should skip Gutenberg-style URL validation.
 *
 * Stackable link fields accept shortcodes, dynamic content tokens, and other
 * non-URL strings that Gutenberg's LinkControl now rejects.
 */

/**
 * WordPress dependencies
 */
import {
	getProtocol,
	isValidFragment,
	isValidProtocol,
	prependHTTP,
} from '@wordpress/url'

const SHORTCODE_VALUE = /^\s*\[[^\]]+\]/
const EXECUTABLE_PROTOCOLS = [ 'javascript', 'data', 'vbscript' ]

/**
 * True when the value starts with a browser-executable protocol.
 * ASCII control characters and whitespace are ignored because browsers remove
 * them while parsing schemes such as `java\nscript:`.
 *
 * @param {*} value
 * @return {boolean} Whether the value uses an executable protocol.
 */
export const hasExecutableProtocol = value => {
	if ( typeof value !== 'string' ) {
		return false
	}

	const separatorIndex = value.indexOf( ':' )
	if ( separatorIndex === -1 ) {
		return false
	}

	const protocol = value
		.slice( 0, separatorIndex )
		.replace( /[\u0000-\u0020\u007f]/g, '' )
		.toLowerCase()

	return EXECUTABLE_PROTOCOLS.includes( protocol )
}

const prependHTTPS = url => {
	if ( getProtocol( url ) && ! hasPossibleTLD( url ) ) {
		return url
	}

	const withProtocol = prependHTTP( url )
	return withProtocol.startsWith( 'http://' )
		? `https://${ withProtocol.slice( 'http://'.length ) }`
		: withProtocol
}

const hasDynamicContentToken = value =>
	value.includes( '!#stk_dynamic' ) || value.includes( 'data-stk-dynamic' )

const isHashLink = value => value.startsWith( '#' ) && isValidFragment( value )

const isRelativePath = value =>
	value.startsWith( '/' ) ||
	value.startsWith( './' ) ||
	value.startsWith( '../' )

/**
 * True when the string looks like a bare domain, with an optional port.
 * Domain labels are limited to 63 characters by DNS.
 *
 * @param {string} url
 * @return {boolean} Whether the value looks like a bare domain.
 */
const hasPossibleTLD = url => {
	const cleanedURL = url.split( /[?#]/ )[ 0 ]
	const possibleTLD = '[a-zA-Z](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])'
	return new RegExp( `^[^/\\s:]+\\.${ possibleTLD }(?::\\d{1,5})?(?:\\/|$)` ).test( cleanedURL )
}

/**
 * True when the value should be treated as a URL rather than a free-form string.
 *
 * @param {string} value
 * @return {boolean} Whether the value looks like a URL.
 */
export const isUrlLike = value => {
	if ( ! value || value.includes( ' ' ) ) {
		return false
	}

	const protocol = getProtocol( value )

	return (
		isValidProtocol( protocol ) ||
		value.startsWith( 'www.' ) ||
		isHashLink( value ) ||
		hasPossibleTLD( value ) ||
		isRelativePath( value )
	)
}

/**
 * True when URL validation should not run.
 *
 * @param {string} value
 * @return {boolean} Whether the value is a shortcode, dynamic token, or other non-URL.
 */
export const isPassThroughLinkValue = value => {
	if ( ! value || typeof value !== 'string' ) {
		return true
	}

	const trimmed = value.trim()
	if ( ! trimmed ) {
		return true
	}
	if ( hasExecutableProtocol( trimmed ) ) {
		return false
	}

	if ( hasDynamicContentToken( trimmed ) ) {
		return true
	}

	if ( SHORTCODE_VALUE.test( trimmed ) ) {
		return true
	}

	return ! isUrlLike( trimmed )
}

/**
 * True when a URL-like value can be parsed as a URL.
 *
 * @param {string} value
 * @return {boolean} Whether the URL-like value is valid.
 */
export const isValidUrlLikeValue = value => {
	if ( isHashLink( value ) || isRelativePath( value ) ) {
		return true
	}

	try {
		// eslint-disable-next-line no-new
		new URL( prependHTTPS( value ) )
		return true
	} catch {
		return false
	}
}

/**
 * True when the link field may keep this value.
 *
 * @param {string} value
 * @return {boolean} Whether the value is allowed.
 */
export const isValidLinkValue = value => {
	if ( hasExecutableProtocol( value ) ) {
		return false
	}

	if ( isPassThroughLinkValue( value ) ) {
		return true
	}

	return isValidUrlLikeValue( value.trim() )
}

/**
 * Normalize URL-like values by trimming and prepending https when needed.
 * Shortcodes, dynamic content, and other non-URLs are left as entered.
 *
 * @param {string} value
 * @return {string} Normalized value.
 */
export const normalizeLinkValue = value => {
	if ( typeof value !== 'string' ) {
		return value
	}

	const trimmed = value.trim()
	if ( hasExecutableProtocol( trimmed ) ) {
		return ''
	}

	if ( isPassThroughLinkValue( trimmed ) ) {
		return trimmed
	}

	if ( isHashLink( trimmed ) || isRelativePath( trimmed ) ) {
		return trimmed
	}

	const normalized = prependHTTPS( trimmed )
	return isValidUrlLikeValue( normalized ) ? normalized : value
}
