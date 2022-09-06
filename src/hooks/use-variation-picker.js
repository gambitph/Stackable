/**
 * External dependencies
 */
import { get, pick } from 'lodash'
import {
	CONTENT_ATTRIBUTES, createUniqueClass, recursivelyAddUniqueIdToInnerBlocks,
} from '~stackable/util'
import { VariationPicker } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data'
import { applyFilters } from '@wordpress/hooks'
import { createBlocksFromInnerBlocksTemplate, cloneBlock } from '@wordpress/blocks'

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
			onSelect={ ( _nextVariation = defaultVariation ) => {
				const block = getBlock( clientId )

				// Allow others to change the variation being applied. e.g. if a
				// variation was modified or added by the user.
				const nextVariation = applyFilters( 'stackable.variation-picker.variation-selected', _nextVariation, block.name )

				const attributes = getBlockAttributes( clientId )
				const _activeVariation = getActiveBlockVariation( block.name, attributes )
				const activeVariation = applyFilters( 'stackable.variation-picker.variation-selected', _activeVariation, block.name )

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

				updateBlockAttributes( clientId, newAttributes ) // eslint-disable-line stackable/no-update-block-attributes

				// Add the inner blocks of the layout / variation.
				if ( nextVariation.innerBlocks ) {
					// Create the new inner blocks based on the variation.
					const innerBlocks = createBlocksFromInnerBlocksTemplate( nextVariation.innerBlocks )
					recursivelyAddUniqueIdToInnerBlocks( innerBlocks )

					// TODO: Known issue, if you have multiple text blocks
					// scattered across different columns, changing the layout
					// can jumble those text blocks.

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
											nextVariationBlockTypes[ blockName ].push( lastBlock )
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

										nextVariationBlockTypes[ blockName ].push( lastBlock )
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
