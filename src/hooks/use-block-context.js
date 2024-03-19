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
import {
	nth, cloneDeep, isEmpty,
} from 'lodash'

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

			action.blockTree.forEach( ( rootBlock, index, siblingBlocks ) => {
				// Gather information about the root block.
				const {
					clientId, innerBlocks, name,
				} = rootBlock
				blocks[ clientId ] = {
					blockIndex: index,
					numInnerBlocks: innerBlocks.length,
					hasInnerBlocks: !! innerBlocks.length,
					adjacentBlocks: siblingBlocks || [],
					nextBlock: nth( siblingBlocks, index + 1 ),
					previousBlock: index === 0 ? undefined : nth( siblingBlocks, index - 1 ), // nth will loop back to the last if index is -1.
					innerBlocks,
					rootBlockClientId: clientId,
					parentTree: [],
				}

				// Form the block name tree so inner blocks would know their locations.
				const parentTree = [ { clientId, name } ]

				const parseBlock = ( innerBlocks, parentBlock ) => {
					innerBlocks.forEach( ( block, index ) => {
						// Some of our other blocks use the Column block in
						// non-column arrangements, for those, we need to
						// set special parameters so that the other UI
						// elements (like column width drag handlers) do not
						// show up.
						if ( block.name === 'stackable/column' ) {
							const supportsColumnResize = select( 'core/blocks' ).getBlockSupport( parentBlock.name, 'stkColumnResize' ) !== false
							if ( ! supportsColumnResize ) {
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
									rootBlockClientId: rootBlock.clientId,
									parentTree: cloneDeep( parentTree ),
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
								nextBlock: nth( innerBlocks, index + 1 ),
								previousBlock: index === 0 ? undefined : nth( innerBlocks, index - 1 ), // nth will loop back to the last if index is -1.
								numInnerBlocks: block.innerBlocks.length,
								hasInnerBlocks: !! block.innerBlocks.length,
								innerBlocks: block.innerBlocks,
								rootBlockClientId: rootBlock.clientId,
								parentTree: cloneDeep( parentTree ),
							}
						}

						// Update the parent tree.
						parentTree.push( {
							clientId: block.clientId,
							name: block.name,
						} )

						// Recurse innerBlocks.
						parseBlock( block.innerBlocks, block )

						// Update the parent tree.
						parentTree.pop()
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
// let oldAllClientIds = null

// Subscribe to all editor changes, so we can listen in to block structure
// changes.
subscribe( () => {
	const tree = select( 'stackable/block-editor' )?.getClientTree()
	if ( tree && ! prevClientIds ) {
		console.log( 'subscribe1', tree )
		prevClientIds = tree
		const blocks = fixReusableInnerBlocks( tree )
		dispatch( 'stackable/block-context' ).setBlockTree( blocks )
		return
	}

	// We can do a direct comparison here since the object being returned
	// isn't changed unless the client id tree is changed, so this holds up
	// even when blocks are edited.
	if ( tree && tree !== prevClientIds ) {
		console.log( 'subscribe2', tree )
		prevClientIds = tree
		const blocks = fixReusableInnerBlocks( tree )
		dispatch( 'stackable/block-context' ).setBlockTree( blocks )
	}
} )

// Use to correct the blocks returned from getBlocks.
// Applies only core/block (reusable blocks) - Adds missing innerBlocks
const fixReusableInnerBlocks = blocks => {
	return ( blocks || [] ).map( block => {
		return {
			...block,
			innerBlocks: fixReusableInnerBlocks( block.innerBlocks ),
			name: select( 'core/block-editor' ).getBlockName( block.clientId ),
		}
	} )
}

// The default context if none is found. This can be true when the block is
// being previewed as an example.
const DEFAULT_CONTEXT = {
	hasInnerBlocks: true, // This is true so that the "No blocks found" placeholder won't be shown.
}

// Export our hook.
const useBlockContext = ( blockClientId = null ) => {
	const blockProps = useBlockEditContext()
	const clientId = blockClientId || blockProps.clientId
	return useSelect( select => {
		const blockContext = select( 'stackable/block-context' ).getBlockContext( clientId )
		console.log( 'blockContext' )
		return ! isEmpty( blockContext ) ? blockContext : DEFAULT_CONTEXT
	} )
}

export default useBlockContext
