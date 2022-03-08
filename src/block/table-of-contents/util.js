/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n'
import { select } from '@wordpress/data'
import { applyFilters } from '@wordpress/hooks'

const convertBlockToHeadingObject = block => {
	if ( block.name === 'stackable/heading' ) {
		return {
			content: block.attributes.text,
			level: parseInt( block.attributes.textTag.substr( 1 ), 10 ),
			anchor: block.attributes.anchor,
			clientId: block.clientId,
		}
	}

	return applyFilters( 'stackable.block.table-of-contents.convert-block', null, block ) || { // Allow other plugins to add their own heading block.
		// Native core/heading
		content: block.attributes.content,
		level: block.attributes.level,
		anchor: block.attributes.anchor,
		clientId: block.clientId,
	}
}

export const getUpdatedHeadings = ( getEditorDom, attributes ) => {
	const editorDom = getEditorDom()
	if ( editorDom ) {
		return getHeadingsFromEditorDom( editorDom, attributes )
	}
	return attributes.headings
}

/**
 * Returns a flatted list of all blocks objects
 *
 * @param {Function} getBlocks
 *
 * @return {Array} Array of block objects
 */
export const getAllBlocks = getBlocks => {
	const flatten = blocks => {
		const result = []
		for ( const block of blocks ) {
			result.push( block )
			if ( block.innerBlocks.length !== 0 ) {
				result.push( ...flatten( block.innerBlocks ) )
			}
		}
		return result
	}
	return flatten( getBlocks() || [] )
}

/**
 * Extracts text, anchor, exclusion, and level from a list of heading blocks.
 *
 * @param {NodeList} headingBlocks The list of heading blocks.
 * @param {Array} headings
 * @return {Array} The list of heading parameters.
 */
export const getHeadingsFromHeadingBlocks = ( headingBlocks, headings ) => {
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

		const content = heading.textContent
		const matchingHeading = headings.find( heading => heading.content === content && heading.level === level )
		const isExcluded = matchingHeading ? matchingHeading.isExcluded : false
		const customContent = matchingHeading ? matchingHeading.customContent : ''

		return {
			anchor, content, customContent, isExcluded,
		}
	} )
}

/**
 * Extracts heading data from the provided editorDom.
 *
 * @param {string} editorDom The editorDom to extract heading data from.
 * @return {Array} The list of heading parameters.
 */
export const getHeadingsFromEditorDom = editorDom => {
	const allowedHeadingBlocks = applyFilters( 'stackable.block.table-of-contents.allowed-headings', [
		'core/heading',
		'stackable/heading',
	] )
	const query = allowedHeadingBlocks.map( name => `.wp-block[data-type="${ name }"]` ).join( ', ' )
	const headingBlocks = editorDom.querySelectorAll( query )

	return [ ...headingBlocks ].map( heading => {
		const clientId = heading.getAttribute( 'data-block' )
		const block = select( 'core/block-editor' ).getBlock( clientId )
		return convertBlockToHeadingObject( block )
	} )
}

/**
 * Takes a flat list of heading parameters and nests them based on each header's
 * immediate parent's level.
 *
 * Lifted from Kadence block's implementation.
 *
 * @param {Array} headingList The flat list of headings to nest.
 * @param {number} index       The current list index.
 * @return {Array} The nested list of headings.
 */
export const linearToNestedHeadingList = ( headingList, index = 0 ) => {
	const nestedHeadingList = []
	headingList.forEach( ( heading, key ) => {
		// if ( heading.content === '' ) {
		// 	return
		// }
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
