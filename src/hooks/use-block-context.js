/**
 * Internal dependencies
 */
import { useEditorDom } from '.'

/**
 * External dependencies
 */
import {
	first, last, indexOf, nth,
} from 'lodash'

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data'
import { useBlockEditContext } from '@wordpress/block-editor'
import { useMemo } from '@wordpress/element'

const useBlockContext = ( blockClientId = null ) => {
	// If nothing is provided, use the current block.
	const blockProps = useBlockEditContext()
	const clientId = blockClientId || blockProps.clientId
	const editorDom = useEditorDom()

	const { getBlock, getBlockParents } = useSelect( 'core/block-editor' )
	const block = getBlock( clientId )
	const parentClientId = last( getBlockParents( clientId ) )

	const hasParent = parentClientId && parentClientId !== clientId
	const parent = hasParent ? getBlock( parentClientId ) : null

	// Check if a column block isn't used as a row.
	const isRow = useMemo( () => {
		if ( ! hasParent ) {
			return false
		}
		return editorDom?.querySelector( `[data-block="${ parent.clientId }"] .stk-block` )?.classList.contains( 'stk-row' )
	}, [ editorDom, hasParent, parent?.clientId ] )

	if ( ! hasParent ) {
		return {
			numInnerBlocks: block?.innerBlocks?.length,
			hasInnerBlocks: !! block?.innerBlocks?.length,
			innerBlocks: block?.innerBlocks,
		}
	}

	const index = hasParent ? indexOf( parent?.innerBlocks, block ) : -1
	const isLastBlock = hasParent ? last( parent?.innerBlocks )?.clientId === clientId : false

	// Check if a column block isn't used as a row. If not, then don't
	// use row-like properties (column resizers, etc).
	if ( hasParent && block.name === 'stackable/column' ) {
		if ( ! isRow ) {
			return {
				blockIndex: index,
				parentBlock: parent,
				isFirstBlock: true,
				isLastBlock: true,
				isOnlyBlock: true,
				adjacentBlock: null,
				adjacentBlockIndex: -1,
				adjacentBlocks: [],
				numInnerBlocks: block?.innerBlocks?.length,
				hasInnerBlocks: !! block?.innerBlocks?.length,
				innerBlocks: block?.innerBlocks,
			}
		}
	}

	return {
		blockIndex: index,
		parentBlock: parent,
		isFirstBlock: hasParent ? first( parent?.innerBlocks )?.clientId === clientId : false,
		isLastBlock,
		isOnlyBlock: hasParent ? ( parent?.innerBlocks?.length <= 1 ) : false,
		adjacentBlock: hasParent ? nth( parent?.innerBlocks, ! isLastBlock ? index + 1 : index - 1 ) : null,
		adjacentBlockIndex: hasParent ? ( ! isLastBlock ? index + 1 : index - 1 ) : -1,
		adjacentBlocks: parent?.innerBlocks || [],
		numInnerBlocks: block?.innerBlocks?.length,
		hasInnerBlocks: !! block?.innerBlocks?.length,
		innerBlocks: block?.innerBlocks,
	}
}

export default useBlockContext
