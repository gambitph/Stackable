
/**
 * WordPress dependencies
 */
import { useRefEffect } from '@wordpress/compose'
import { useCallback } from '@wordpress/element'
import {
	useSelect, useDispatch, useRegistry, select,
} from '@wordpress/data'
import {
	createBlock, cloneBlock, switchToBlockType,
} from '@wordpress/blocks'
import { store as blockEditorStore } from '@wordpress/block-editor'
import { useBlockContext } from '~stackable/hooks'

function convertBlockToList( block ) {
	const list = switchToBlockType( block, 'stackable/icon-list-new' )
	if ( list ) {
		return list
	}
	const paragraph = switchToBlockType( block, 'core/paragraph' )
	if ( ! paragraph ) {
		return null
	}
	return switchToBlockType( paragraph, 'stackable/icon-list-new' )
}

export function convertToListItems( blocks ) {
	const listItems = []

	for ( let block of blocks ) {
		if ( block.name === 'stackable/icon-list-item' ) {
			listItems.push( block )
		} else if ( block.name === 'stackable/icon-list-new' ) {
			listItems.push( ...block.innerBlocks )
		} else if ( ( block = convertBlockToList( block ) ) ) {
			for ( const { innerBlocks } of block ) {
				listItems.push( ...innerBlocks )
			}
		}
	}

	return listItems
}

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

// Modified useMerge from gutenberg list item hooks.
export const useMerge = ( clientId, onMerge ) => {
	const blockContext = useBlockContext( clientId )
	const { previousBlock } = blockContext

	const registry = useRegistry()
	const outdentListItem = useOutdentListItem( blockContext, clientId )

	const { mergeBlocks, moveBlocksToPosition } = useDispatch( 'core/block-editor' )

	const { getBlockOrder, getBlockRootClientId } = useSelect( 'core/block-editor' )

	const getParentListItemId = id => {
		const { parentBlock: parentListBlock } = select( 'stackable/block-context' ).getBlockContext( id )
		const { parentBlock: parentIconListItemBlock } = select( 'stackable/block-context' ).getBlockContext( parentListBlock.clientId )

		if ( parentIconListItemBlock?.name !== 'stackable/icon-list-item' ) {
			return
		}

		return parentIconListItemBlock.clientId
	}

	const getTrailingId = id => {
		const order = getBlockOrder( id )

		if ( ! order.length ) {
			return id
		}

		return getTrailingId( order[ order.length - 1 ] )
	}

	/**
	 * Return the next list item with respect to the given list item. If none,
	 * return the next list item of the parent list item if it exists.
	 *
	 * @param {string} id A list item client ID.
	 * @return {string?} The client ID of the next list item.
	 */
	function _getNextId( id ) {
		const { nextBlock: next } = select( 'stackable/block-context' ).getBlockContext( id )
		if ( next ) {
			return next.clientId
		}
		const parentListItemId = getParentListItemId( id )
		if ( ! parentListItemId ) {
			return
		}
		return _getNextId( parentListItemId )
	}

	/**
	 * Given a client ID, return the client ID of the list item on the next
	 * line, regardless of indentation level.
	 *
	 * @param {string} id The client ID of the current list item.
	 * @return {string?} The client ID of the next list item.
	 */
	function getNextId( id ) {
		const order = getBlockOrder( id )

		// If the list item does not have a nested list, return the next list
		// item.
		if ( ! order.length ) {
			return _getNextId( id )
		}

		// Get the first list item in the nested list.
		return getBlockOrder( order[ 0 ] )[ 0 ]
	}

	return useCallback( forward => {
		function mergeWithNested( clientIdA, clientIdB ) {
			registry.batch( () => {
				const [ nestedListClientId ] = getBlockOrder( clientIdB )
				// Move any nested list items to the previous list item.
				if ( nestedListClientId ) {
					moveBlocksToPosition(
						getBlockOrder( nestedListClientId ),
						nestedListClientId,
						getBlockRootClientId( clientIdA )
					)
				}
				mergeBlocks( clientIdA, clientIdB )
			} )
		}

		if ( forward ) {
			const nextBlockClientId = getNextId( clientId )

			if ( ! nextBlockClientId ) {
				onMerge( forward )
				return
			}

			if ( getParentListItemId( nextBlockClientId ) ) {
				outdentListItem( nextBlockClientId )
			} else {
				mergeWithNested( clientId, nextBlockClientId )
			}
		} else {
			const previousBlockClientId = previousBlock?.clientId
			if ( getParentListItemId( clientId ) ) {
				// Outdent nested lists.
				outdentListItem()
			} else if ( previousBlockClientId ) {
				const trailingId = getTrailingId( previousBlockClientId )
				mergeWithNested( trailingId, clientId )
			} else {
				onMerge( forward )
			}
		}
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

export const useCopy = clientId => {
	const {
		getBlockRootClientId, getBlockName, getBlockAttributes,
	} =
		useSelect( blockEditorStore )

	return useRefEffect( node => {
		function onCopy( event ) {
			// The event propagates through all nested lists, so don't override
			// when copying nested list items.
			if ( event.clipboardData.getData( '__unstableWrapperBlockName' ) ) {
				return
			}

			const rootClientId = getBlockRootClientId( clientId )
			event.clipboardData.setData(
				'__unstableWrapperBlockName',
				getBlockName( rootClientId )
			)
			event.clipboardData.setData(
				'__unstableWrapperBlockAttributes',
				JSON.stringify( getBlockAttributes( rootClientId ) )
			)
		}

		node.addEventListener( 'copy', onCopy )
		node.addEventListener( 'cut', onCopy )
		return () => {
			node.removeEventListener( 'copy', onCopy )
			node.removeEventListener( 'cut', onCopy )
		}
	}, [] )
}
