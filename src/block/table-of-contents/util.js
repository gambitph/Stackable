/**
 * External dependencies
 */
import striptags from 'striptags'

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n'
import { select } from '@wordpress/data'
import { applyFilters } from '@wordpress/hooks'

const convertBlockToHeadingObject = block => {
	let heading = {}
	if ( block.name === 'stackable/heading' ) {
		heading = {
			content: block.attributes.text,
			level: parseInt( block.attributes.textTag.substr( 1 ), 10 ),
			anchor: block.attributes.anchor,
			clientId: block.clientId,
		}
	} else if ( block.name === 'ugb/heading' ) {
		const level = block.attributes.titleTag || 'h2'
		heading = {
			content: block.attributes.title,
			level: parseInt( level.substr( 1 ), 10 ),
			anchor: block.attributes.anchor,
			clientId: block.clientId,
		}
	} else {
		heading = applyFilters( 'stackable.block.table-of-contents.convert-block', null, block ) || { // Allow other plugins to add their own heading block.
			// Native core/heading
			content: block.attributes.content,
			level: block.attributes.level,
			anchor: block.attributes.anchor,
			clientId: block.clientId,
		}
	}

	// Fix things.
	heading.tag = heading.level
	// In WP 6.5, the content is now an object and not just a string.
	const textContent = typeof heading.content === 'string' ? heading.content : heading.content?.text
	heading.content = striptags( textContent || '' )

	return heading
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
		'ugb/heading',
	] )
	const query = allowedHeadingBlocks.map( name => `.wp-block[data-type="${ name }"]` ).join( ', ' )
	const headingBlocks = editorDom.querySelectorAll( query )

	return [ ...headingBlocks ].reduce( ( headings, heading ) => {
		// Do not include blocks which are part of the Site Editor heading and footer.
		const template = heading.closest( '[data-type="core/template-part"]' )
		if ( template ) {
			if ( template.tagName === 'HEADER' || template.tagName === 'FOOTER' ) {
				return headings
			}
		}

		const clientId = heading.getAttribute( 'data-block' )
		const block = select( 'core/block-editor' ).getBlock( clientId )
		if ( block ) {
			headings.push( convertBlockToHeadingObject( block ) )
		}
		return headings
	}, [] )
}

/**
 * Converts a flat list of heading objects and nests them based on the immediate
 * subheading's level. This takes into account incorrect heading level
 * arrangements.
 * .
 *
 * @param {Array} headings Heading objects formed by getHeadingsFromEditorDom
 * @param {Object} internalData Internal data object used to generated the
 * nested heading list. The index used to generate the list is stored in the
 * internalData.index property.
 *
 * @return {Array} A tree of heading objects.
 */
export const linearToNestedHeadingList = ( headings, internalData = { index: 0 } ) => {
	const newHeadings = []

	while ( headings.length ) {
		const currHeading = headings.shift()
		const children = []

		while ( headings.length ) {
			if ( headings[ 0 ].level <= currHeading.level ) {
				break
			}
			children.push( { ...headings.shift() } )
		}

		newHeadings.push( {
			heading: { ...currHeading },
			index: internalData.index++,
			children: linearToNestedHeadingList( children, internalData ),
		} )
	}

	return newHeadings
}
