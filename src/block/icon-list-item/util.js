
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
	}, [ blockContext, clientId ] )
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
		const item = cloneBlock( getBlock( clientId ) )
		const previousItem = cloneBlock( getBlock( previousBlock.clientId ) )

		// Create an icon list block for the preceding icon list item if it doesn't exist.
		if ( ! previousItem.innerBlocks?.length ) {
			previousItem.innerBlocks = [ createBlock( 'stackable/icon-list-new' ) ]
		}

		previousItem.
			// Get the last icon list block of the preceding icon list item.
			innerBlocks[ previousItem.innerBlocks.length - 1 ].
			// Add the cloned icon list item to the end of the preceding icon list item's last icon list block.
			innerBlocks.push( item )

		// Replace the preceding icon list item with the cloned icon list item.
		replaceBlocks( [ previousBlock.clientId, clientId ], [ previousItem ] )
	}, [ blockContext, clientId ] )
}

export const useMerge = ( blockContext, clientId, text ) => {
	const {
		parentBlock,
		previousBlock,
		hasInnerBlocks,
		innerBlocks,
	} = blockContext

	const registry = useRegistry()
	const outdentListItem = useOutdentListItem( blockContext, clientId )

	const {
		updateBlockAttributes,
		removeBlock,
		moveBlocksToPosition,
	} =
    useDispatch( 'core/block-editor' )

	const {
		getBlockAttributes,
	} = useSelect( 'core/block-editor' )

	let blockToMerge = previousBlock
	let willOutdent = false
	const { parentBlock: iconListItemParentBlock } = useBlockContext( parentBlock.clientId )
	if ( ! previousBlock || iconListItemParentBlock?.name === 'stackable/icon-list-item' ) {
		willOutdent = true
	}
	const { hasInnerBlocks: previousHasInnerBlocks, innerBlocks: previousInnerBlocks } = useBlockContext( previousBlock?.clientId )
	if ( previousHasInnerBlocks ) {
		// Get the last icon list block of the preceding icon list item.
		const lastIconList = previousInnerBlocks[ previousInnerBlocks.length - 1 ]
		// Get the last icon list item block.
		blockToMerge = lastIconList.innerBlocks[ lastIconList.innerBlocks.length - 1 ]
	}

	return useCallback( () => {
		registry.batch( () => {
			if ( willOutdent ) {
				outdentListItem()
				return
			}

			const currentAttributes = getBlockAttributes( blockToMerge.clientId )

			// eslint-disable-next-line stackable/no-update-block-attributes
			updateBlockAttributes(
				blockToMerge.clientId,
				{ text: currentAttributes.text + text }
			)

			if ( hasInnerBlocks ) {
				const clientIds = innerBlocks.map( block => block.clientId )
				moveBlocksToPosition( clientIds, clientId, blockToMerge.clientId )
			}

			removeBlock( clientId )
		} )
	}, [ blockContext, clientId ] )
}

export const useOnSplit = ( clientId, attributes ) => {
	const {
		getBlock,
	} = useSelect( 'core/block-editor' )

	return useCallback( ( value, isOriginal ) => {
		const block = getBlock( clientId )
		let newBlock

		if ( isOriginal || value ) {
			newBlock = cloneBlock( block, {
				...attributes,
				text: value,
			} )
		} else {
			newBlock = cloneBlock( block, {
				...attributes,
				text: '',
			} )
		}

		if ( isOriginal ) {
			newBlock.clientId = clientId
			if ( newBlock.innerBlocks?.length ) {
				newBlock.innerBlocks = []
			}
		}

		return newBlock
	}, [ clientId, attributes ] )
}
