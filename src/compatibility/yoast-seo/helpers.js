/**
 * Yoast SEO compatibility helpers.
 *
 * Pure functions for mapping Yoast analysis marks to Stackable block annotations.
 *
 * @see https://github.com/gambitph/Stackable/issues/2422
 */

/**
 * WordPress dependencies
 */
import { create } from '@wordpress/rich-text'
import {
	flatMap, flatten, isUndefined, uniq,
} from 'lodash'

/**
 * Stackable blocks that support Yoast SEO text highlighting.
 * Maps block names to their annotatable attribute and RichText identifier.
 */
export const STACKABLE_ANNOTATABLE_BLOCKS = {
	'stackable/text': {
		attributeKey: 'text',
		richTextIdentifier: 'text',
	},
	'stackable/heading': {
		attributeKey: 'text',
		richTextIdentifier: 'text',
	},
	'stackable/subtitle': {
		attributeKey: 'text',
		richTextIdentifier: 'text',
	},
	'stackable/icon-list-item': {
		attributeKey: 'text',
		richTextIdentifier: 'text',
	},
	'stackable/button': {
		attributeKey: 'text',
		richTextIdentifier: 'text',
	},
	'stackable/image': {
		attributeKey: 'figcaptionText',
		richTextIdentifier: 'text',
	},
}

export const FIELD_TO_STACKABLE_BLOCKS = {
	heading: [ 'stackable/heading', 'stackable/subtitle' ],
	paragraph: [ 'stackable/text', 'stackable/icon-list-item' ],
	caption: [ 'stackable/image' ],
}

const START_MARK = "<yoastmark class='yoast-text-mark'>"
const END_MARK = '</yoastmark>'
const START_MARK_DOUBLE_QUOTED = '<yoastmark class="yoast-text-mark">'

const htmlTagsRegex = /(<([a-z]|\/)[^<>]+>)/ig
const htmlEntitiesRegex = /&(?:[a-zA-Z]+|#[0-9]+|#x[0-9a-fA-F]+);/ig

/**
 * Retrieves the HTML for a block attribute.
 *
 * @param {Object} block The block.
 * @param {string} attributeKey The attribute key.
 *
 * @return {string} The HTML.
 */
export const getBlockHtml = ( block, attributeKey ) => {
	const richTextData = block.attributes[ attributeKey ]
	return typeof richTextData === 'string' ? richTextData : ( richTextData || '' ).toString()
}

/**
 * Gets the fields to mark from an array of Mark objects.
 *
 * @param {Array} marks Yoast Mark objects.
 *
 * @return {Array} Fields to mark.
 */
export const getFieldsToMark = marks => {
	return uniq( flatten( marks.map( mark => {
		if ( ! isUndefined( mark.getFieldsToMark ) ) {
			return mark.getFieldsToMark()
		}
		return undefined
	} ) ) )
}

/**
 * Checks whether a block should receive annotations based on fieldsToMark.
 *
 * @param {Object} block The block.
 * @param {Array}  fieldsToMark Fields to mark from Yoast marks.
 *
 * @return {boolean} Whether the block should be annotated.
 */
export const shouldAnnotateBlock = ( block, fieldsToMark ) => {
	if ( ! STACKABLE_ANNOTATABLE_BLOCKS[ block.name ] ) {
		return false
	}

	if ( fieldsToMark.length === 0 ) {
		return true
	}

	return fieldsToMark.some( field => {
		const stackableBlocks = FIELD_TO_STACKABLE_BLOCKS[ field ]
		return stackableBlocks && stackableBlocks.includes( block.name )
	} )
}

/**
 * Finds all indices for a given string in a text.
 *
 * @param {string}  text Text to search through.
 * @param {string}  stringToFind Text to search for.
 * @param {boolean} caseSensitive Whether the search is case-sensitive.
 *
 * @return {number[]} All indices of the found occurrences.
 */
export const getIndicesOf = ( text, stringToFind, caseSensitive = true ) => {
	const indices = []
	if ( text.length === 0 ) {
		return indices
	}

	let searchStartIndex = 0
	let index

	if ( ! caseSensitive ) {
		stringToFind = stringToFind.toLowerCase()
		text = text.toLowerCase()
	}

	while ( ( index = text.indexOf( stringToFind, searchStartIndex ) ) > -1 ) {
		indices.push( index )
		searchStartIndex = index + stringToFind.length
	}

	return indices
}

/**
 * Returns the offsets of yoastmark occurrences in a marked sentence.
 *
 * @param {string} markedSentence The marked sentence.
 *
 * @return {Array} Start and end offsets.
 */
export const getYoastmarkOffsets = markedSentence => {
	let startMarkIndex = markedSentence.indexOf( START_MARK )
	const doesNotContainDoubleQuotedMark = startMarkIndex >= 0

	if ( ! doesNotContainDoubleQuotedMark ) {
		startMarkIndex = markedSentence.indexOf( START_MARK_DOUBLE_QUOTED )
	}

	const offsets = []

	while ( startMarkIndex >= 0 ) {
		markedSentence = doesNotContainDoubleQuotedMark
			? markedSentence.replace( START_MARK, '' )
			: markedSentence.replace( START_MARK_DOUBLE_QUOTED, '' )

		const endMarkIndex = markedSentence.indexOf( END_MARK )
		if ( endMarkIndex < startMarkIndex ) {
			return []
		}
		markedSentence = markedSentence.replace( END_MARK, '' )

		offsets.push( {
			startOffset: startMarkIndex,
			endOffset: endMarkIndex,
		} )

		startMarkIndex = doesNotContainDoubleQuotedMark
			? markedSentence.indexOf( START_MARK )
			: markedSentence.indexOf( START_MARK_DOUBLE_QUOTED )
	}

	return offsets
}

/**
 * Calculates annotations using search-based highlighting.
 *
 * @param {string} text The content of the block.
 * @param {Object} mark The Yoast mark object.
 *
 * @return {Array} Annotation ranges.
 */
export const calculateAnnotationsForTextFormat = ( text, mark ) => {
	const originalSentence = mark.getOriginal().replace( /(<([^>]+)>)/ig, '' )
	const markedSentence = mark.getMarked().replace( /(<(?!\/?yoastmark)[^>]+>)/ig, '' )
	const sentenceIndices = getIndicesOf( text, originalSentence )

	if ( sentenceIndices.length === 0 ) {
		return []
	}

	const yoastmarkOffsets = getYoastmarkOffsets( markedSentence )
	const blockOffsets = []

	yoastmarkOffsets.forEach( yoastmarkOffset => {
		sentenceIndices.forEach( sentenceIndex => {
			const startOffset = sentenceIndex + yoastmarkOffset.startOffset
			let endOffset = sentenceIndex + yoastmarkOffset.endOffset

			if ( yoastmarkOffset.startOffset === 0 && yoastmarkOffset.endOffset === mark.getOriginal().length ) {
				endOffset = sentenceIndex + originalSentence.length
			}

			blockOffsets.push( { startOffset, endOffset } )
		} )
	} )

	return blockOffsets
}

/**
 * Retrieves the length for HTML tags, adjusting for br tags.
 *
 * @param {Array} htmlTags Matched HTML tags.
 *
 * @return {number} Total tag length.
 */
const getTagsLength = htmlTags => {
	let tagsLength = 0
	for ( let i = htmlTags.length - 1; i >= 0; i-- ) {
		const [ tag ] = htmlTags[ i ]
		let tagLength = tag.length
		if ( /^<\/?br/.test( tag ) ) {
			tagLength -= 1
		}
		tagsLength += tagLength
	}
	return tagsLength
}

/**
 * Adjusts mark offsets when the block HTML contains HTML tags.
 *
 * @param {string} slicedBlockHtmlToStartOffset HTML slice to start offset.
 * @param {string} slicedBlockHtmlToEndOffset   HTML slice to end offset.
 * @param {number} blockStartOffset             Block start offset.
 * @param {number} blockEndOffset               Block end offset.
 *
 * @return {Object} Adjusted offsets.
 */
const adjustOffsetsForHtmlTags = ( slicedBlockHtmlToStartOffset, slicedBlockHtmlToEndOffset, blockStartOffset, blockEndOffset ) => {
	const foundHtmlTagsToStartOffset = [ ...slicedBlockHtmlToStartOffset.matchAll( htmlTagsRegex ) ]
	blockStartOffset -= getTagsLength( foundHtmlTagsToStartOffset )

	const foundHtmlTagsToEndOffset = [ ...slicedBlockHtmlToEndOffset.matchAll( htmlTagsRegex ) ]
	blockEndOffset -= getTagsLength( foundHtmlTagsToEndOffset )

	return { blockStartOffset, blockEndOffset }
}

/**
 * Adjusts mark offsets when the block HTML contains HTML entities.
 *
 * @param {string} slicedBlockHtmlToStartOffset HTML slice to start offset.
 * @param {string} slicedBlockHtmlToEndOffset   HTML slice to end offset.
 * @param {number} blockStartOffset             Block start offset.
 * @param {number} blockEndOffset               Block end offset.
 *
 * @return {Object} Adjusted offsets.
 */
const adjustOffsetsForHtmlEntities = ( slicedBlockHtmlToStartOffset, slicedBlockHtmlToEndOffset, blockStartOffset, blockEndOffset ) => {
	let matchedHtmlEntities = [ ...slicedBlockHtmlToStartOffset.matchAll( htmlEntitiesRegex ) ]
	for ( let i = matchedHtmlEntities.length - 1; i >= 0; i-- ) {
		const [ , matchedEntityWithoutAmp ] = matchedHtmlEntities[ i ]
		blockStartOffset -= matchedEntityWithoutAmp.length
	}

	matchedHtmlEntities = [ ...slicedBlockHtmlToEndOffset.matchAll( htmlEntitiesRegex ) ]
	for ( let i = matchedHtmlEntities.length - 1; i >= 0; i-- ) {
		const [ , matchedEntityWithoutAmp ] = matchedHtmlEntities[ i ]
		blockEndOffset -= matchedEntityWithoutAmp.length
	}

	return { blockStartOffset, blockEndOffset }
}

/**
 * Adjusts mark offsets for HTML tags and entities.
 *
 * @param {number} blockStartOffset Block start offset.
 * @param {number} blockEndOffset   Block end offset.
 * @param {string} blockHtml        Block HTML.
 *
 * @return {Object} Adjusted offsets.
 */
const adjustMarkOffsets = ( blockStartOffset, blockEndOffset, blockHtml ) => {
	const slicedBlockHtmlToStartOffset = blockHtml.slice( 0, blockStartOffset )
	const slicedBlockHtmlToEndOffset = blockHtml.slice( 0, blockEndOffset )

	const adjustedOffsetsInCaseOfHtmlTags = adjustOffsetsForHtmlTags(
		slicedBlockHtmlToStartOffset,
		slicedBlockHtmlToEndOffset,
		blockStartOffset,
		blockEndOffset
	)
	blockStartOffset = adjustedOffsetsInCaseOfHtmlTags.blockStartOffset
	blockEndOffset = adjustedOffsetsInCaseOfHtmlTags.blockEndOffset

	const adjustedOffsetsInCaseOfHtmlEntities = adjustOffsetsForHtmlEntities(
		slicedBlockHtmlToStartOffset,
		slicedBlockHtmlToEndOffset,
		blockStartOffset,
		blockEndOffset
	)

	return adjustedOffsetsInCaseOfHtmlEntities
}

/**
 * Creates annotations from position-based marks.
 *
 * @param {Object} mark           Yoast mark object.
 * @param {string} blockClientId  Block client ID.
 * @param {string} blockHtml      Block HTML.
 * @param {string} richText       Block plain text.
 *
 * @return {Array} Annotation ranges.
 */
export const createAnnotationsFromPositionBasedMarks = ( mark, blockClientId, blockHtml, richText ) => {
	if ( blockClientId !== mark.getBlockClientId() ) {
		return []
	}

	const blockStartOffset = mark.getBlockPositionStart()
	const blockEndOffset = mark.getBlockPositionEnd()

	const slicedHtml = blockHtml.slice( blockStartOffset, blockEndOffset )
	const slicedRichText = richText.slice( blockStartOffset, blockEndOffset )

	if ( slicedHtml === slicedRichText ) {
		return [ { startOffset: blockStartOffset, endOffset: blockEndOffset } ]
	}

	const adjustedMarkOffsets = adjustMarkOffsets( blockStartOffset, blockEndOffset, blockHtml )
	return [ {
		startOffset: adjustedMarkOffsets.blockStartOffset,
		endOffset: adjustedMarkOffsets.blockEndOffset,
	} ]
}

/**
 * Creates annotations for a Stackable text block.
 *
 * @param {Object} block The block.
 * @param {Array}  marks Yoast mark objects.
 *
 * @return {Array} Annotations to apply.
 */
export const getAnnotationsForStackableBlock = ( block, marks ) => {
	const { attributeKey, richTextIdentifier } = STACKABLE_ANNOTATABLE_BLOCKS[ block.name ]
	const blockHtml = getBlockHtml( block, attributeKey )

	const record = create( { html: blockHtml } )
	const richText = record.text

	return flatMap( marks, mark => {
		let annotations
		if ( mark.hasBlockPosition && mark.hasBlockPosition() ) {
			annotations = createAnnotationsFromPositionBasedMarks( mark, block.clientId, blockHtml, richText )
		} else {
			annotations = calculateAnnotationsForTextFormat( richText, mark )
		}

		if ( ! annotations ) {
			return []
		}

		return annotations.map( annotation => ( {
			...annotation,
			block: block.clientId,
			richTextIdentifier,
		} ) )
	} )
}

/**
 * Recursively gets annotations for Stackable blocks.
 *
 * @param {Array} blocks Editor blocks.
 * @param {Array} marks  Yoast mark objects.
 * @param {Array} fieldsToMark Fields to mark.
 *
 * @return {Array} Annotations to apply.
 */
export const getAnnotationsForStackableBlocks = ( blocks, marks, fieldsToMark ) => {
	return flatMap( blocks, block => {
		const innerBlockAnnotations = block.innerBlocks?.length
			? getAnnotationsForStackableBlocks( block.innerBlocks, marks, fieldsToMark )
			: []

		if ( ! shouldAnnotateBlock( block, fieldsToMark ) ) {
			return innerBlockAnnotations
		}

		return getAnnotationsForStackableBlock( block, marks ).concat( innerBlockAnnotations )
	} )
}
