// Checks whether the block is invalid because of a styling issue.
import { Tokenizer } from 'simple-html-tokenizer'
import {
	getSaveContent,
} from '@wordpress/blocks'
import {
	DecodeEntityParser, getNextNonWhitespaceToken, isClosedByToken, isEqualTokensOfType,
} from '@wordpress/blocks/build/api/validation'

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

	// Get which HTML tags the error occurred.
	const tags = getInvalidationTags( block )
	if ( ! tags ) {
		return false
	}

	// If the error comes from SVG tags or the Style tag, then we can repair this invalid block.
	return tags.some( tag => allowedTags.includes( tag ) )
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
