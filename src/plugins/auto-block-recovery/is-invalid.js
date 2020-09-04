// Checks whether the block is invalid because of a styling issue.
import { Tokenizer } from 'simple-html-tokenizer'
import {
	getSaveContent,
} from '@wordpress/blocks'
import {
	DecodeEntityParser, getNextNonWhitespaceToken, isClosedByToken, isEqualTokensOfType,
} from '@wordpress/blocks/build/api/validation'
import { isEqual, difference } from 'lodash'

// We will auto-recover if there are errors encountered in these tags.
const ALLOWED_ERROR_TAGS = [ 'style', 'svg' ]

export const isInvalid = ( block, allowedTags = ALLOWED_ERROR_TAGS ) => {
	const {
		name, isValid, validationIssues,
	} = block

	// Only do this for Stackable blocks.
	if ( ! name || ! name.match( /^ugb\// ) ) {
		return false
	}

	// Only do this for invalid blocks.
	if ( isValid ) {
		return false
	}
	if ( ! validationIssues.length ) {
		return false
	}

	// Check whether we're missing a Stackable class.
	if ( isMissingStackableClass( validationIssues[ 0 ] ) ) {
		return true
	}

	// Check whether we're missing a style tag.
	if ( isMissingStyleTag( validationIssues[ 0 ] ) ) {
		return true
	}

	// Check whether we're missing an svg tag.
	if ( isMissingSvgTag( validationIssues[ 0 ] ) ) {
		return true
	}

	// Check whether we're missing an image class.
	if ( isMissingWPImageClass( validationIssues[ 0 ] ) ) {
		return true
	}

	// Check whether we're missing an image class.
	if ( isMissingVideoTag( validationIssues[ 0 ] ) ) {
		return true
	}

	// Check whether we're missing a video playsinline attribute v2.5.2 bug fix.
	if ( isMissingVideoPlaysInlineTag( validationIssues[ 0 ] ) ) {
		return true
	}

	// Check whether an image label or aria label was changed, this was an issue < 2.10.0
	if ( isImageLabel( validationIssues[ 0 ] ) ) {
		return true
	}
	if ( isLabelAttribute( validationIssues[ 0 ] ) ) {
		return true
	}

	// Get which HTML tags the error occurred.
	const tags = getInvalidationTags( block )
	if ( ! tags ) {
		return false
	}

	// If the error comes from SVG tags or the Style tag, then we can repair this invalid block.
	return tags.some( tag => allowedTags.includes( tag ) )
}

/**
 * Checks whether the validation error is because of a missing / additional Stackable classname.
 *
 * @param {Array} issue The invalidation object
 *
 * @return {boolean} True or false
 */
export const isMissingStackableClass = issue => {
	if ( ! issue.args ) {
		return false
	}

	if ( issue.args.length !== 4 ) {
		return false
	}

	if ( typeof issue.args[ 1 ] !== 'string' || typeof issue.args[ 2 ] !== 'string' || typeof issue.args[ 3 ] !== 'string' ) {
		return false
	}

	if ( issue.args[ 1 ] !== 'class' ) {
		return false
	}

	return ! isEqual( issue.args[ 2 ].match( /ugb-[^\s]+/g ), issue.args[ 3 ].match( /ugb-[^\s]+/g ) )
}

/**
 * Checks whether the validation error is because of a missing image classname.
 *
 * @param {Array} issue The invalidation object
 *
 * @return {boolean} True or false
 */
export const isMissingWPImageClass = issue => {
	if ( ! issue.args ) {
		return false
	}

	if ( issue.args.length !== 4 ) {
		return false
	}

	if ( typeof issue.args[ 1 ] !== 'string' || typeof issue.args[ 2 ] !== 'string' || typeof issue.args[ 3 ] !== 'string' ) {
		return false
	}

	if ( issue.args[ 1 ] !== 'class' ) {
		return false
	}

	return ( issue.args[ 2 ].match( /wp-image-\d+/ ) && ! issue.args[ 3 ].match( /wp-image-\d+/ ) ) ||
		( ! issue.args[ 2 ].match( /wp-image-\d+/ ) && issue.args[ 3 ].match( /wp-image-\d+/ ) )
}

/**
 * Checks whether the validation error is because of a missing / additional Style tag.
 *
 * @param {Array} issue The invalidation object
 *
 * @return {boolean} True or false
 */
export const isMissingStyleTag = issue => {
	if ( ! issue.args ) {
		return false
	}

	if ( issue.args.length !== 3 ) {
		return false
	}

	// Style tag was missing.
	if ( issue.args[ 1 ] === 'style' && issue.args[ 2 ] !== 'style' ) {
		return true
	}

	// Style tag was present but shouldn't.
	if ( issue.args[ 1 ] !== 'style' && issue.args[ 2 ] === 'style' ) {
		return true
	}

	return false
}

/**
 * Check whether an image label or aria label was changed, this was an issue < 2.10.0
 *
 * @param {Array} issue The invalidation object
 *
 * @return {boolean} True or false
 */
export const isImageLabel = issue => {
	if ( ! issue.args ) {
		return false
	}

	if ( issue.args.length !== 4 ) {
		return false
	}

	if ( typeof issue.args[ 1 ] !== 'string' ) {
		return false
	}

	if ( issue.args[ 1 ] === 'aria-label' || issue.args[ 1 ] === 'title' || issue.args[ 1 ] === 'alt' ) {
		return true
	}

	return false
}

/**
 * Check whether an image label or aria label was changed, this was an issue < 2.10.0
 *
 * @param {Array} issue The invalidation object
 *
 * @return {boolean} True or false
 */
export const isLabelAttribute = issue => {
	if ( ! issue.args ) {
		return false
	}

	if ( issue.args.length !== 3 ) {
		return false
	}

	if ( typeof issue.args[ 1 ] !== 'object' || typeof issue.args[ 2 ] !== 'object' ) {
		return false
	}
	if ( ! Array.isArray( issue.args[ 1 ] ) || ! Array.isArray( issue.args[ 2 ] ) ) {
		return false
	}

	const attributes1 = issue.args[ 1 ].map( attributePair => attributePair[ 0 ] )
	const attributes2 = issue.args[ 2 ].map( attributePair => attributePair[ 0 ] )
	const diffAttributes = difference( attributes1, attributes2 )

	if ( diffAttributes.includes( 'aria-label' ) || diffAttributes.includes( 'title' ) || diffAttributes.includes( 'alt' ) ) {
		return true
	}

	return false
}

/**
 * Checks whether the validation error is because of a missing / additional Svg tag.
 *
 * @param {Array} issue The invalidation object
 *
 * @return {boolean} True or false
 */
export const isMissingSvgTag = issue => {
	if ( ! issue.args ) {
		return false
	}

	if ( issue.args.length !== 3 ) {
		return false
	}

	// Svg tag was missing.
	if ( issue.args[ 1 ] === 'svg' && issue.args[ 2 ] !== 'svg' ) {
		return true
	}

	// Svg tag was present but shouldn't.
	if ( issue.args[ 1 ] !== 'svg' && issue.args[ 2 ] === 'svg' ) {
		return true
	}

	return false
}

/**
 * Checks whether the validation error is because of a missing Video tag.
 * There was a bug where depends on the URL, an image could be detected as a video
 * if there was an "mp4", "webm" or "ogg" anywhere in the URL.
 *
 * @param {Array} issue The invalidation object
 *
 * @return {boolean} True or false
 */
export const isMissingVideoTag = issue => {
	if ( ! issue.args ) {
		return false
	}

	if ( issue.args.length !== 3 ) {
		return false
	}

	// Style tag was missing.
	if ( issue.args[ 1 ] === 'video' && issue.args[ 2 ] !== 'video' ) {
		return true
	}

	// Style tag was missing.
	if ( issue.args[ 2 ] === 'video' && issue.args[ 1 ] !== 'video' ) {
		return true
	}

	return false
}

/**
 * Checks whether the validation error is because of a missing playsinline Video
 * tag. Before v2.5.2, video backgrounds didn't auto-play since there was a
 * missing playsinline attribute.
 *
 * @param {Array} issue The invalidation object
 *
 * @return {boolean} True or false
 */
export const isMissingVideoPlaysInlineTag = issue => {
	if ( ! issue.args ) {
		return false
	}

	if ( issue.args.length !== 3 ) {
		return false
	}

	// Attribute tags
	if ( ! Array.isArray( issue.args[ 1 ] ) ) {
		return false
	}

	// We are looking for an array [ 'playsinline', '', false ] or similar.
	if ( issue.args[ 1 ].some( el => {
		return Array.isArray( el ) && el[ 0 ] === 'playsinline'
	} ) ) {
		return true
	}

	return false
}

/**
 * Gets the HTML tag tree where the invalid block error ocurred.
 *
 * @param {Object} block The invalid block object
 *
 * @return {Array|boolean} An array of HTML tags where the error in the invalid
 * block occurred, or false if not applicable or not detected.
 */
export const getInvalidationTags = block => {
	const {
		name, attributes, innerBlocks, originalContent, isValid,
	} = block

	if ( isValid ) {
		return false
	}

	let expectedContent
	try {
		expectedContent = getSaveContent( name, attributes, innerBlocks )
	} catch ( error ) {
		return false
	}

	return getInequivalentHTMLError( originalContent, expectedContent )
}

/**
 * Tokenize an HTML string, gracefully handling any errors thrown during
 * underlying tokenization.
 *
 * Copied from @wordpress/blocks/build/api/validation
 *
 * @see getHTMLTokens in @wordpress/blocks/build/api/validation
 *
 * @param {string} html   HTML string to tokenize.
 *
 * @return {Object[]|null} Array of valid tokenized HTML elements, or null on error
 */
function getHTMLTokens( html ) {
	try {
		return new Tokenizer( new DecodeEntityParser() ).tokenize( html )
	} catch ( e ) {
	}

	return null
}

/**
 * Returns the tag trail (array of html tags) where the mismatch occurred during
 * the test if the given HTML strings are effectively equivalent. Returns false
 * when the mismatch cannot be pinpointed or if there is no error or for invalid
 * HTML. This is not a good detector whether 2 HTML strings are equivalent.
 *
 * This function is a modification of the isEquivalentHTML function.
 *
 * @see isEquivalentHTML in @wordpress/blocks/build/api/validation
 *
 * @param {string} actual   Actual HTML string.
 * @param {string} expected Expected HTML string.
 *
 * @return {Array|boolean} An array containing the HTML tags where the error occurred,
 * or false if it isn't available
 */
export function getInequivalentHTMLError( actual, expected ) {
	// Tokenize input content and reserialized save content
	const [ actualTokens, expectedTokens ] = [ actual, expected ].map(
		html => getHTMLTokens( html )
	)

	// If either is malformed then stop comparing - the strings are not equivalent
	if ( ! actualTokens || ! expectedTokens ) {
		return false
	}

	const htmlTagTrail = []
	let actualToken, expectedToken
	while ( ( actualToken = getNextNonWhitespaceToken( actualTokens ) ) ) {
		expectedToken = getNextNonWhitespaceToken( expectedTokens )

		// Add new opening tags to the tag trail.
		if ( actualToken.type === 'StartTag' ) {
			htmlTagTrail.push( actualToken.tagName.toLowerCase() )
		}

		// Inequal if exhausted all expected tokens
		if ( ! expectedToken ) {
			return htmlTagTrail
		}

		// Inequal if next non-whitespace token of each set are not same type
		if ( actualToken.type !== expectedToken.type ) {
			return htmlTagTrail
		}

		// Defer custom token type equality handling, otherwise continue and
		// assume as equal
		const isEqualTokens = isEqualTokensOfType[ actualToken.type ]
		if ( isEqualTokens && ! isEqualTokens( actualToken, expectedToken ) ) {
			return htmlTagTrail
		}

		// Remove tags from the tag trail if they close.
		if ( actualToken.type === 'StartTag' && actualToken.selfClosing === true ) {
			htmlTagTrail.pop()
		} else if ( actualToken.type === 'EndTag' ) {
			htmlTagTrail.pop()
		}

		// Peek at the next tokens (actual and expected) to see if they close
		// a self-closing tag
		if ( isClosedByToken( actualToken, expectedTokens[ 0 ] ) ) {
			// Consume the next expected token that closes the current actual
			// self-closing token
			getNextNonWhitespaceToken( expectedTokens )
		} else if ( isClosedByToken( expectedToken, actualTokens[ 0 ] ) ) {
			// Consume the next actual token that closes the current expected
			// self-closing token
			getNextNonWhitespaceToken( actualTokens )
		}
	}

	return false
}
