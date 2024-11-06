
/**
 * WordPress dependencies
 */
import { useRefEffect } from '@wordpress/compose'
import { useCallback, useRef } from '@wordpress/element'
import {
	useSelect, useDispatch, dispatch,
} from '@wordpress/data'
import {
	cloneBlock,
	switchToBlockType,
	createBlock,
	getDefaultBlockName,
	pasteHandler,
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

export const useEnter = ( text, clientId ) => {
	const {
		removeBlocks, selectionChange, insertBlocks,
	} = useDispatch( blockEditorStore )
	const {
		getBlock, getBlockRootClientId, getBlockIndex,
	} = useSelect( blockEditorStore )

	const textRef = useRef( text )
	textRef.current = text

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

				// Delete the inner blocks from index 0 to blockIndex in the topParentListBlock
				// Native doesn't do it this way, it uses one replaceBlock action, but it's
				// slow with Stackable, so we just remove the excess blocks.
				const clientIdsToRemove = topParentListBlock.innerBlocks.reduce( ( clientIds, innerBlock, index ) => {
					if ( index >= blockIndex ) {
						clientIds.push( innerBlock.clientId )
					}
					return clientIds
				}, [] )
				removeBlocks( clientIdsToRemove, false )

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

				const topParentListBlockIndex = getBlockIndex( topParentListBlock.clientId )
				const rootClientId = getBlockRootClientId( topParentListBlock.clientId )

				// Insert the new blocks.
				insertBlocks( [ middle, ...tail ], topParentListBlockIndex + 1, rootClientId )

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

export const useOnPaste = ( clientId, parentClientId, attributes, setAttributes ) => {
	const { insertBlocks } = useDispatch( blockEditorStore )
	const { getBlockIndex } = useSelect( blockEditorStore )

	return useCallback( event => {
		event.preventDefault()
		const html = event.clipboardData.getData( 'text/html' )
		const plain = event.clipboardData.getData( 'text/plain' )

		// Convert first to core/list block.
		const list = pasteHandler( {
			HTML: html,
			plainText: plain,
			mode: 'BLOCKS',
		} )

		// If list[0] has inner blocks, it has been converted to core/list block, else list has core/paragraph elements.
		const items = list[ 0 ].innerBlocks.length ? list[ 0 ].innerBlocks : list

		const content = items.map( item => item.attributes.content.toPlainText().replaceAll( '\n', '<br>' ) )

		// If current icon list item has no text, use the first item as text.
		if ( ! attributes.text ) {
			const firstItem = content.shift()
			setAttributes( { text: firstItem } )
		}

		// create new icon list items
		const newBlocks = content.map( text => {
			const block = createBlock( 'stackable/icon-list-item', {
				...attributes,
				text,
			} )

			return block
		} )
		dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
		insertBlocks( newBlocks, getBlockIndex( clientId ) + 1, parentClientId )
	}, [ clientId, parentClientId, attributes, setAttributes ] )
}
