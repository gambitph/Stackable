// Checks whether the block is invalid because of a styling issue.
import {
	getSaveContent,
} from '@wordpress/blocks'
import {
	isEqual, difference, filter, first,
} from 'lodash'

// We will auto-recover if there are errors encountered in these tags.
const ALLOWED_ERROR_TAGS = [ 'style', 'svg' ]

export const isInvalid = ( block, allowedTags = ALLOWED_ERROR_TAGS ) => {
	const {
		name, isValid, validationIssues, originalContent,
	} = block

	// Only do this for Stackable blocks.
	if ( ! name || ! name.match( /^ugb\// ) ) {
		return false
	}

	// Only do this for blocks with .ugb-main-block and not separator block.
	if ( ! name.match( /separator/ ) && ! originalContent.match( /ugb-main-block/ ) ) {
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

	// Check whether the wp image class has changed.
	if ( isWPImageClassChanged( validationIssues[ 0 ] ) ) {
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

	// Check whether we're missing an aria-level attribute. For accordion block in < 2.13.2
	if ( isAriaLevel( validationIssues[ 0 ] ) ) {
		return true
	}

	// Check whether the block has no data-video attribute
	if ( isDataVideo( validationIssues[ 0 ] ) ) {
		return true
	}

	// Check whether the block has no aria-hidden attribute
	if ( isAriaHidden( validationIssues[ 0 ] ) ) {
		return true
	}

	// Check whether the block has no focusable attribute
	if ( isFocusable( validationIssues[ 0 ] ) ) {
		return true
	}

	// Check whether the style content is different.
	if ( isDifferentStyleContent( block ) ) {
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

export const isWPImageClassChanged = issue => {
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

	const newWPImageClassName = first( issue.args[ 2 ].match( /wp-image-\d+/ ) )
	const oldWPImageClassName = first( issue.args[ 3 ].match( /wp-image-\d+/ ) )

	if ( newWPImageClassName && oldWPImageClassName ) {
		return oldWPImageClassName !== newWPImageClassName
	}

	return false
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
 * Check whether an aria-level attribute was removed. Issue with accordion block < 2.13.2
 *
 * @param {Array} issue The invalidation object
 * @return {boolean} True or false
 */
export const isAriaLevel = issue => {
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

	const oldExists = issue.args[ 2 ].some( attributePair => attributePair[ 0 ] === 'aria-level' )
	const newExists = issue.args[ 1 ].some( attributePair => attributePair[ 0 ] === 'aria-level' )

	if ( oldExists && ! newExists ) {
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
 * Compares 2 arrays and returns the index of the first character difference
 *
 * @param {string} a String to compare
 * @param {string} b String to compare
 *
 * @return {number} Index of where the difference occured
 */
export const findFirstDiffPos = ( a, b ) => {
	const longerLength = Math.max( a.length, b.length )
	for ( let i = 0; i < longerLength; i++ ) {
		if ( a[ i ] !== b[ i ] ) {
			return i
		}
	}

	return -1
}

/**
 * From a partial HTML, get all the tags and generate the HTML tag hierarchy
 * e.g. <div>...<style></style>...<span>...
 * will return
 * [ "div", "span" ]
 *
 * @param {string} html The html to convert to a tag tree
 *
 * @return {Array} List of html tags.
 */
export const getTagTree = html => {
	const tags = ( html.match( /<\/?[\w\d]+/g ) || [] ).map( tag => tag.replace( '<', '' ) )
	return tags.reduce( ( stack, tag ) => {
		if ( tag.indexOf( '/' ) === 0 ) {
			stack.pop()
		} else {
			stack.push( tag )
		}
		return stack
	}, [] )
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

	const diff1 = originalContent.substr( 0, findFirstDiffPos( originalContent, expectedContent ) )
	const diff2 = expectedContent.substr( 0, findFirstDiffPos( originalContent, expectedContent ) )

	return filter( [
		...getTagTree( diff1 ),
		...getTagTree( diff2 ),
	] )
}

/**
 * Checks whether the block has
 * no data-video attribute. For video popup block.
 *
 * @param {Object} issue the validation object
 * @return {boolean} if true, the block has no data-video. Otherwise, false.
 */
export const isDataVideo = issue => {
	if ( ! issue.args ) {
		return false
	}

	if ( issue.args.length !== 3 ) {
		return false
	}

	if ( ! issue.args[ 0 ].match( /attributes/ ) ) {
		return false
	}

	const newHasDataVideo = issue.args[ 1 ].some( attribute => attribute[ 0 ] === 'data-video' )
	const oldHasDataVideo = issue.args[ 2 ].some( attribute => attribute[ 0 ] === 'data-video' )
	return newHasDataVideo && ! oldHasDataVideo
}

/**
 * Checks whether the block has
 * no aria-hidden attribute.
 *
 * @param {Object} issue the validation object
 * @return {boolean} if true, the block has no aria-hidden. Otherwise, false.
 */
export const isAriaHidden = issue => {
	if ( ! issue.args ) {
		return false
	}

	if ( issue.args.length !== 3 ) {
		return false
	}

	if ( ! issue.args[ 0 ].match( /attributes/ ) ) {
		return false
	}

	const newHasAriaHidden = issue.args[ 1 ].some( attribute => attribute[ 0 ] === 'aria-hidden' )
	const oldHasAriaHidden = issue.args[ 2 ].some( attribute => attribute[ 0 ] === 'aria-hidden' )
	return newHasAriaHidden && ! oldHasAriaHidden
}

/**
 * Checks whether the block has
 * no focusable attribute.
 *
 * @param {Object} issue the validation object
 * @return {boolean} if true, the block has no focusable. Otherwise, false.
 */
export const isFocusable = issue => {
	if ( ! issue.args ) {
		return false
	}

	if ( issue.args.length !== 3 ) {
		return false
	}

	if ( ! issue.args[ 0 ].match( /attributes/ ) ) {
		return false
	}

	const newHasFocusable = issue.args[ 1 ].some( attribute => attribute[ 0 ] === 'focusable' )
	const oldHasFocusable = issue.args[ 2 ].some( attribute => attribute[ 0 ] === 'focusable' )
	return newHasFocusable && ! oldHasFocusable
}

/**
 * Checks whether the block has a different
 * style content
 *
 * @param {Object} block
 * @return {boolean} if true, the block has a different style content. Otherwise, false
 */
export const isDifferentStyleContent = block => {
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

	const originalStyleContent = originalContent.match( /<style>[^\<]*<\/style>/g )?.[ 0 ]
	const expectedStyleContent = expectedContent.match( /<style>[^\<]*<\/style>/g )?.[ 0 ]

	if ( originalStyleContent && expectedStyleContent ) {
		return originalStyleContent !== expectedStyleContent
	}

	return false
}
