
/**
 * WordPress dependencies
 */
import { useCallback } from '@wordpress/element'
import {
	useSelect, useDispatch, useRegistry,
} from '@wordpress/data'
import { createBlock, cloneBlock } from '@wordpress/blocks'
import { useBlockContext } from '~stackable/hooks'

export const useOutdentListItem = ( blockContext, clientId ) => {
	const {
		parentBlock,
		hasInnerBlocks,
		innerBlocks,
		adjacentBlocks,
		blockIndex,
	} = blockContext
	const registry = useRegistry()

	const {
		moveBlocksToPosition,
		removeBlock,
		insertBlock,
		updateBlockListSettings,
	} = useDispatch( 'core/block-editor' )
	const {
		getBlockListSettings,
		getBlock,
	} = useSelect( 'core/block-editor' )

	const parentIconListClientId = parentBlock?.clientId
	const { parentBlock: parentIconListItemBlock } = useBlockContext( parentIconListClientId )
	const { parentBlock: targetBlock, blockIndex: parentIconListItemBlockIndex } = useBlockContext( parentIconListItemBlock?.clientId )
	const toClientId = targetBlock?.clientId
	const targetIndex = parentIconListItemBlockIndex + 1

	return useCallback( () => {
		registry.batch( () => {
			// Get succeeding icon list item blocks.
			const clientIds = adjacentBlocks.slice( blockIndex + 1 ).map( block => block.clientId )

			// Move the succeeding icon list item blocks as inner blocks of the outdented icon list item block.
			if ( clientIds.length ) {
				// Get the first nested icon list block.
				let innerBlockClientId = hasInnerBlocks ? innerBlocks[ 0 ].clientId : undefined

				if ( ! hasInnerBlocks ) {
					const block = cloneBlock( getBlock( parentBlock.clientId ), {}, [] )
					innerBlockClientId = block.clientId

					insertBlock( block, 0, clientId, false )
					// Allows to move blocks to the new nested icon list block.
					updateBlockListSettings(
						block.clientId,
						getBlockListSettings( parentIconListClientId )
					)
				}
				moveBlocksToPosition( clientIds, parentIconListClientId, innerBlockClientId )
			}

			// Outdent the icon list item block.
			moveBlocksToPosition( [ clientId ], parentIconListClientId, toClientId, targetIndex )

			if ( blockIndex === 0 ) {
				removeBlock( parentIconListClientId )
			}
		} )
	}, [ blockContext ] )
}

export const useIndentListItem = ( blockContext, clientId ) => {
	const {
		previousBlock,
	} = blockContext

	const {
		replaceBlocks,
	} =
	useDispatch( 'core/block-editor' )

	const {
		getBlock,
	} = useSelect( 'core/block-editor' )

	return useCallback( () => {
		// Clone the icon list item to be indented
		// and the preceding icon list item.
		const item = [ cloneBlock( getBlock( clientId ) ) ]
		const previousItem = cloneBlock( getBlock( previousBlock.clientId ) )

		// Create an icon list block for the preceding icon list item if it doesn't exist.
		if ( ! previousItem.innerBlocks?.length ) {
			previousItem.innerBlocks = [ createBlock( 'stackable/icon-list-new' ) ]
		}

		previousItem.
			// Get the last icon list block of the preceding icon list item.
			innerBlocks[ previousItem.innerBlocks.length - 1 ].
			// Add the cloned icon list item to the end of the preceding icon list item's last icon list block.
			innerBlocks.push( ...item )

		// Replace the preceding icon list item with the cloned icon list item.
		replaceBlocks( [ previousBlock.clientId, clientId ], [ previousItem ] )
	}, [ blockContext, clientId ] )
}
