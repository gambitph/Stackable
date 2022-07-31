/**
 * This hook provides additional information about the current block such as its
 * innerBlock location, siblings, isFirstBlock, isLastBlock and more. These
 * information are needed by some Stackable functions to run, such as the column
 * width drag handlers of Column blocks.
 *
 * This hook is performant and only runs whenever the structure of the blocks in
 * the editor changes, it only does it once (not on a per block basis) and using
 * one select call, so it saves a lot of processing time.
 */

/**
 * External depedencies
 */
import { nth } from 'lodash'

/**
 * WordPress dependencies
 */
import {
	subscribe, select, createReduxStore, register, dispatch, useSelect,
} from '@wordpress/data'
import { useBlockEditContext } from '@wordpress/block-editor'

// Create our store.
const STORE_ACTIONS = {
	setBlockTree: blockTree => {
		return { type: 'UPDATE_BLOCK_TREE', blockTree }
	},
}

const STORE_SELECTORS = {
	getBlockContext: ( state, clientId ) => state[ clientId ] || {},
}

const STORE_REDUCER = ( state = {}, action ) => {
	switch ( action.type ) {
		case 'UPDATE_BLOCK_TREE': {
			const blocks = {}

			action.blockTree.forEach( rootBlock => {
				// Gather information about the root block.
				const { clientId, innerBlocks } = rootBlock
				blocks[ clientId ] = {
					numInnerBlocks: innerBlocks.length,
					hasInnerBlocks: !! innerBlocks.length,
					innerBlocks,
				}

				const parseBlock = ( innerBlocks, parentBlock ) => {
					innerBlocks.forEach( ( block, index ) => {
						// Some of our other blocks use the Column block in
						// non-column arrangements, for those, we need to
						// set special parameters so that the other UI
						// elements (like column width drag handlers) do not
						// show up.
						if ( block.name === 'stackable/column' ) {
							if ( parentBlock.name === 'stackable/accordion' ||
								parentBlock.name === 'stackable/image-box' ) {
								blocks[ block.clientId ] = {
									blockIndex: index,
									parentBlock,
									isFirstBlock: true,
									isLastBlock: true,
									isOnlyBlock: true,
									adjacentBlock: null,
									adjacentBlockIndex: -1,
									adjacentBlocks: [],
									numInnerBlocks: block.innerBlocks.length,
									hasInnerBlocks: !! block.innerBlocks.length,
									innerBlocks: block.innerBlocks,
								}
							}
						}

						// Gather all the info about the block.
						if ( ! blocks[ block.clientId ] ) {
							const isLastBlock = innerBlocks.length - 1 === index
							blocks[ block.clientId ] = {
								blockIndex: index,
								parentBlock,
								isFirstBlock: index === 0,
								isLastBlock,
								isOnlyBlock: innerBlocks.length === 1,
								adjacentBlock: nth( innerBlocks, ! isLastBlock ? index + 1 : index - 1 ),
								adjacentBlockIndex: ! isLastBlock ? index + 1 : index - 1,
								adjacentBlocks: innerBlocks || [],
								numInnerBlocks: block.innerBlocks.length,
								hasInnerBlocks: !! block.innerBlocks.length,
								innerBlocks: block.innerBlocks,
							}
						}

						// Recurse innerBlocks.
						parseBlock( block.innerBlocks, block )
					} )
				}

				// Go through all the inner blocks.
				parseBlock( innerBlocks, rootBlock )
			} )

			return { ...blocks }
		}
	}
	return state
}

register( createReduxStore( 'stackable/block-context', {
	reducer: STORE_REDUCER,
	actions: STORE_ACTIONS,
	selectors: STORE_SELECTORS,
} ) )

// This holds the current tree of client ids, we check against this if the
// block/content structure has changed.
let prevClientIds = null

// Subscribe to all editor changes, so we can listen in to block structure
// changes.
subscribe( () => {
	const tree = select( 'core/block-editor' ).__unstableGetClientIdsTree()

	if ( ! prevClientIds ) {
		prevClientIds = tree
		const blocks = select( 'core/block-editor' ).getBlocks()
		dispatch( 'stackable/block-context' ).setBlockTree( blocks )
		return
	}

	// We can do a direct comparison here since the object being returned
	// isn't changed unless the client id tree is changed, so this holds up
	// even when blocks are edited.
	if ( tree !== prevClientIds ) {
		prevClientIds = tree
		const blocks = select( 'core/block-editor' ).getBlocks()
		dispatch( 'stackable/block-context' ).setBlockTree( blocks )
	}
} )

// Export our hook.
const useBlockContext = ( blockClientId = null ) => {
	const blockProps = useBlockEditContext()
	const clientId = blockClientId || blockProps.clientId
	return useSelect( select => {
		return select( 'stackable/block-context' ).getBlockContext( clientId )
	} )
}

export default useBlockContext
