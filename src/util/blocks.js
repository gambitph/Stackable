/**
 * External dependencies
 */
import { omit } from 'lodash'
import { loadGoogleFontInAttributes, moveArrayIndex } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { createBlock } from '@wordpress/blocks'
import { dispatch, select } from '@wordpress/data'

const ignoreAttributes = [
	'uniqueClass',
]

// Checks whether a block is modified or not.
const cachedDefaultAttributes = {}
export function isUnmodifiedBlock( block ) {
	if ( ! cachedDefaultAttributes[ block.name ] ) {
		cachedDefaultAttributes[ block.name ] = createBlock( block.name ).attributes
	}
	return Object.keys( cachedDefaultAttributes[ block.name ] ).every( attrName => {
		if ( ignoreAttributes.includes( attrName ) ) {
			return true
		}
		return cachedDefaultAttributes[ block.name ][ attrName ] === block.attributes[ attrName ]
	} )
}

export const applyBlockDesign = ( attributes, clientId = null ) => {
	const {
		getBlockName, getSelectedBlockClientId, getBlockAttributes, hasMultiSelection, getMultiSelectedBlockClientIds,
	} = select( 'core/block-editor' )
	const { updateBlockAttributes } = dispatch( 'core/block-editor' )
	const { getBlockType } = select( 'core/blocks' )

	// If multiple blocks are selected, apply the block design to them all.
	if ( ! clientId && hasMultiSelection() ) {
		getMultiSelectedBlockClientIds().forEach( clientId => {
			applyBlockDesign( attributes, clientId )
		} )
		return
	}

	const blockClientId = clientId ? clientId : getSelectedBlockClientId()
	if ( ! blockClientId ) {
		return
	}

	const currentBlockAttributes = getBlockAttributes( blockClientId )
	const blockName = getBlockName( blockClientId ).replace( /^\w+\//g, '' )
	const attributeDefinition = getBlockType( getBlockName( blockClientId ) ).attributes
	const defaultAttributes = Object.keys( attributeDefinition ).reduce( ( attrs, attrName ) => {
		return {
			...attrs,
			[ attrName ]: attributeDefinition[ attrName ] ? attributeDefinition[ attrName ].default : '',
		}
	}, {} )
	// Omit the attributes which should not be overridden, for example: urls,
	// media ids, open in new tabs, etc.
	const blockAttributesFiltered = applyFilters( `stackable.${ blockName }.design.filtered-block-attributes`, { ...defaultAttributes, ...attributes }, currentBlockAttributes )

	// When applying attributes to a block, we assume that there's already text
	// inputted in the block, so we shouldn't apply all the text attributes of
	// the design.
	const blockAttributes = applyFilters( `stackable.${ blockName }.design.no-text-attributes`, blockAttributesFiltered, currentBlockAttributes )

	// Check for any Fonts that we need to load.
	loadGoogleFontInAttributes( blockAttributes )

	updateBlockAttributes( blockClientId, omit( blockAttributes, [ 'uniqueClass' ] ) )
}

/**
 * Moves an innerBlock to a new index.
 *
 * @param {string} clientId The block to modify
 * @param {number} fromIndex innerBlock old index
 * @param {number} toIndex innerBlock new index
 */
export const moveInnerBlock = ( clientId, fromIndex, toIndex ) => {
	const { getBlock } = select( 'core/block-editor' )
	const { replaceInnerBlocks } = dispatch( 'core/block-editor' )
	const currentBlock = getBlock( clientId )
	const newInnerBlocks = moveArrayIndex( currentBlock.innerBlocks, fromIndex, toIndex )

	replaceInnerBlocks( clientId, newInnerBlocks, false )
}
