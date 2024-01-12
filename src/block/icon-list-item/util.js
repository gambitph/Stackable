
/**
 * WordPress dependencies
 */
import { useRefEffect } from '@wordpress/compose'
import { useCallback } from '@wordpress/element'
import { useSelect, useDispatch } from '@wordpress/data'
import {
	cloneBlock,
	switchToBlockType,
	createBlock,
	getDefaultBlockName,
} from '@wordpress/blocks'
import { store as blockEditorStore } from '@wordpress/block-editor'
import { ENTER } from '@wordpress/keycodes'

function convertBlockToList( block ) {
	const list = switchToBlockType( block, 'stackable/icon-list' )
	if ( list ) {
		return list
	}
	const paragraph = switchToBlockType( block, 'core/paragraph' )
	if ( ! paragraph ) {
		return null
	}
	return switchToBlockType( paragraph, 'stackable/icon-list' )
}

export function convertToListItems( blocks ) {
	const listItems = []

	for ( let block of blocks ) {
		if ( block.name === 'stackable/icon-list-item' ) {
			listItems.push( block )
		} else if ( block.name === 'stackable/icon-list' ) {
			listItems.push( ...block.innerBlocks )
		} else if ( ( block = convertBlockToList( block ) ) ) {
			for ( const { innerBlocks } of block ) {
				listItems.push( ...innerBlocks )
			}
		}
	}

	return listItems
}

export const useOnSplit = ( clientId, attributes ) => {
	const { getBlock } = useSelect( 'core/block-editor' )

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

export const useEnter = ( textRef, clientId ) => {
	const { replaceBlocks, selectionChange } = useDispatch( blockEditorStore )
	const {
		getBlock, getBlockRootClientId, getBlockIndex,
	} = useSelect( blockEditorStore )

	return useRefEffect(
		element => {
			function onKeyDown( event ) {
				if ( event.defaultPrevented || event.keyCode !== ENTER ) {
					return
				}
				if ( textRef.current.length ) {
					return
				}
				event.preventDefault()

				// Here we are in top level list so we need to split.
				const topParentListBlock = getBlock(
					getBlockRootClientId( clientId )
				)
				const blockIndex = getBlockIndex( clientId )
				const head = cloneBlock( {
					...topParentListBlock,
					innerBlocks: topParentListBlock.innerBlocks.slice(
						0,
						blockIndex
					),
				} )
				const middle = createBlock( getDefaultBlockName() )
				// Last list item might contain a `list` block innerBlock
				// In that case append remaining innerBlocks blocks.
				const after = [
					...( topParentListBlock.innerBlocks[ blockIndex ]
						.innerBlocks[ 0 ]?.innerBlocks || [] ),
					...topParentListBlock.innerBlocks.slice( blockIndex + 1 ),
				]
				const tail = after.length
					? [
						cloneBlock( {
							...topParentListBlock,
							innerBlocks: after,
						} ),
					  ]
					: []
				replaceBlocks(
					topParentListBlock.clientId,
					[ head, middle, ...tail ],
					1
				)
				// We manually change the selection here because we are replacing
				// a different block than the selected one.
				selectionChange( middle.clientId )
			}

			element.addEventListener( 'keydown', onKeyDown )
			return () => {
				element.removeEventListener( 'keydown', onKeyDown )
			}
		},
		[ clientId ]
	)
}
