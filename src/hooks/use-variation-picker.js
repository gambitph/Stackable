/**
 * External dependencies
 */
import { get, pick } from 'lodash'
import { createUniqueClass } from '~stackable/block-components/block-div/use-unique-id'
import { recursivelyAddUniqueIdToInnerBlocks } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data'
import { VariationPicker } from '~stackable/components'
import { createBlocksFromInnerBlocksTemplate, cloneBlock } from '@wordpress/blocks'

// Common content attributes across all Stackable blocks that should be preserved.
const CONTENT_ATTRIBUTES = [
	// Image attributes
	'imageUrl',
	'imageId',
	'imageAlt',
	// Text
	'text',
	// Icon
	'icon',
	// Link
	'linkHasLink',
	'linkUrl',
	'linkNewTab',
	'linkRel',
	'linkHasTitle',
	'linkTitle',
	// Block-level link
	'blockLinkHasLink',
	'blockLinkUrl',
	'blockLinkNewTab',
	'blockLinkRel',
	'blockLinkHasTitle',
	'blockLinkTitle',
]

/**
 * The variation picker will automatically show up when the block doesn't have a
 * uniqueId yet.  Note: The BlockDiv component automatically adds a uniqueId
 * attribute, use `autoApplyUniqueId={ false }` to disable this feature or else
 * the variation picker will never show up.
 *
 * @param {string} clientId The block client id
 * @param {string} uniqueId The uniqueId attribute of the block
 */
export const useVariationPicker = ( clientId, uniqueId ) => {
	const {
		blockType,
		defaultVariation,
		variations,
	} = useSelect(
		select => {
			const {
				getBlockVariations,
				getBlockType,
				getDefaultBlockVariation,
			} = select( 'core/blocks' )
			const {
				getBlock,
			} = select( 'core/block-editor' )

			if ( ! clientId ) {
				return {}
			}

			const block = getBlock( clientId )
			if ( ! block ) {
				return {}
			}

			const { name } = getBlock( clientId )

			return {
				blockType: getBlockType( name ),
				defaultVariation: getDefaultBlockVariation( name, 'block' ),
				variations: getBlockVariations( name, 'block' ),
			}
		},
		[ clientId, uniqueId ]
	)
	const { replaceInnerBlocks, updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const { getBlock, getBlockAttributes } = useSelect( 'core/block-editor' )
	const { getActiveBlockVariation } = useSelect( 'core/blocks' )

	return uniqueId ? null : (
		<VariationPicker
			icon={ get( blockType, [ 'icon', 'src' ] ) }
			label={ get( blockType, [ 'title' ] ) }
			variations={ variations || [] }
			onSelect={ ( nextVariation = defaultVariation ) => {
				const block = getBlock( clientId )
				const attributes = getBlockAttributes( clientId )
				const activeVariation = getActiveBlockVariation( block.name, attributes )

				let newAttributes = {}

				// If coming from an existing variation, we need to remove all
				// the attributes which are previously set for the variation.
				if ( activeVariation ) {
					newAttributes = { ...activeVariation.attributes }
					Object.keys( newAttributes ).forEach( key => newAttributes[ key ] = undefined )
				}

				// The new attributes of the layout:
				// - Cleared old attributes of the previous layout
				// - Attributes of the new layout
				// - New UniqueId
				newAttributes = {
					// Blanked attributes from the previous variation.
					...newAttributes,
					...( nextVariation.attributes || {} ),

					// When selecting a variation, add a unique Id, this will
					// indicate not to show the variation picker afterwards.
					uniqueId: createUniqueClass( clientId ),
				}

				updateBlockAttributes( clientId, newAttributes )

				// Add the inner blocks of the layout / variation.
				if ( nextVariation.innerBlocks ) {
					// Create the new inner blocks based on the variation.
					const innerBlocks = createBlocksFromInnerBlocksTemplate( nextVariation.innerBlocks )
					recursivelyAddUniqueIdToInnerBlocks( innerBlocks )

					// If the user is switching layouts, there might be inner
					// blocks already present. Copy over the contents of the old
					// inner blocks to the next variation counterpart.
					if ( block.innerBlocks.length ) {
						const nextVariationBlockTypes = getBlockTypesList( innerBlocks )
						const currentBlockTypes = getBlockTypesList( block.innerBlocks )

						// Loop through the inner blocks of the current
						// variation, and apply them to the next variation.
						Object.keys( currentBlockTypes ).forEach( blockName => {
							currentBlockTypes[ blockName ].forEach( ( currentBlock, index ) => {
								if ( nextVariationBlockTypes[ blockName ] ) {
									if ( index < nextVariationBlockTypes[ blockName ].length ) {
										const nextBlock = nextVariationBlockTypes[ blockName ][ index ]
										nextBlock.attributes = {
											...nextBlock.attributes,
											...pick( currentBlock.attributes, CONTENT_ATTRIBUTES ),
										}

									// Button and icon buttons, duplicate them if we have more inner blocks than what the variation has.
									} else if ( blockName === 'stackable/button' || blockName === 'stackable/icon-button' ) {
										const lastBlock = nextVariationBlockTypes[ blockName ][ index - 1 ]
										if ( lastBlock?.parent ) {
											const newBlock = cloneBlock( lastBlock )

											newBlock.attributes = {
												...newBlock.attributes,
												...pick( currentBlock.attributes, CONTENT_ATTRIBUTES ),
											}

											lastBlock.parent.innerBlocks.push( newBlock )
										}

									// For root text blocks that surpass what the variation has, add them to the end of the existing text.
									} else if ( blockName === 'stackable/text' ) {
										const lastBlock = nextVariationBlockTypes[ blockName ][ index - 1 ]
										const newBlock = cloneBlock( lastBlock )

										newBlock.attributes = {
											...newBlock.attributes,
											...pick( currentBlock.attributes, CONTENT_ATTRIBUTES ),
										}

										if ( lastBlock.parent ) {
											const textIndex = lastBlock.parent.innerBlocks.indexOf( lastBlock )
											if ( textIndex !== -1 ) {
												lastBlock.parent.innerBlocks.splice( textIndex + 1, 0, newBlock )
											}
										} else { // Else this is part of the main innerBlocks
											const textIndex = innerBlocks.indexOf( lastBlock )
											if ( textIndex !== -1 ) {
												innerBlocks.splice( textIndex + 1, 0, newBlock )
											}
										}
									}
								}
							} )
						} )
					}

					replaceInnerBlocks(
						clientId,
						innerBlocks,
						! activeVariation // If we are switching to another variation, keep the selection on the block so the user can switch back.
					)
				}
			} }
			allowSkip
		/>
	)
}

// Creates a flat representation of the given blocks. Given a list of blocks,
// turn them into:
//
// blockName: [ block, block, block ]
// blockName: [ block, block, block ]
const getBlockTypesList = ( blocks, results = {} ) => {
	for ( let i = 0; i < blocks.length; i++ ) {
		const blockName = blocks[ i ].name
		if ( ! results[ blockName ] ) {
			results[ blockName ] = [ blocks[ i ] ]
		} else {
			results[ blockName ].push( blocks[ i ] )
		}

		blocks[ i ].innerBlocks.forEach( innerBlock => {
			innerBlock.parent = blocks[ i ]
		} )
		getBlockTypesList( blocks[ i ].innerBlocks, results )
	}
	return results
}
