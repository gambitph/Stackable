/**
 * External dependencies
 */
import { deburr, trim } from 'lodash'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

/**
 * Returns the text without markup.
 *
 * @param {string} text The text.
 *
 * @return {string} The text without markup.
 */
const getTextWithoutMarkup = text => {
	const dummyElement = document.createElement( 'div' )
	dummyElement.innerHTML = text
	return dummyElement.innerText
}

/**
 * Get the slug from the content.
 *
 * @param {string} content The block content.
 *
 * @return {string} Returns the slug.
 */
const getSlug = content => {
	// Get the slug.
	return trim(
		deburr( getTextWithoutMarkup( content ) )
			.replace( /[^\p{L}\p{N}]+/gu, '-' )
			.toLowerCase(),
		'-'
	)
}

/**
 * Generate the anchor for a heading.
 *
 * @param {string} content The content we are generate the element ID from.
 * @param {Array} blocks An array of matching blocks we generate IDs for.
 *
 * @return {string|null} Return the heading anchor.
 */
export const generateAnchor = ( content, blocks ) => {
	const baseSlug = getSlug( content )

	// If slug is empty, then return null.
	// Returning null instead of an empty string allows us to check again when the content changes.
	if ( '' === baseSlug ) {
		return null
	}

	if ( ! blocks.some( blocks => blocks.attributes.anchor === baseSlug ) ) {
		return baseSlug
	}

	let i = 1
	let slug = `${ baseSlug }-${ i }`
	while ( blocks.some( blocks => blocks.attributes.anchor === slug ) ) {
		slug = `${ baseSlug }-${ i++ }`
	}

	return applyFilters( 'stackable.block.table-of-contents.generate-anchor', null, slug ) || slug
}
