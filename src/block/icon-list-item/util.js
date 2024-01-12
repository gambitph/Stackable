
/**
 * WordPress dependencies
 */
import { useRefEffect } from '@wordpress/compose'
import { useCallback } from '@wordpress/element'
import { useSelect } from '@wordpress/data'
import { cloneBlock, switchToBlockType } from '@wordpress/blocks'
import { store as blockEditorStore } from '@wordpress/block-editor'

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
