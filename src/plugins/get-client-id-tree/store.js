/**
 * External dependencies
 */
import createSelector from 'rememo'

/**
 * WordPress dependencies
 */

import {
	register, createReduxStore,
	select, dispatch, createRegistrySelector,
} from '@wordpress/data'

// Include all the stored state.
const DEFAULT_STATE = {
	clientTree: null,
	clientIds: [],
}

const STORE_ACTIONS = {
	updateClientTree: clientTree => {
		return {
			type: 'UPDATE_CLIENT_TREE',
			clientTree,
		}
	},
	updateClientIds: clientIds => {
		return {
			type: 'UPDATE_CLIENT_IDS',
			clientIds,
		}
	},
}

/**
 * This function is used in Gutenberg's List View.
 * https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/store/private-selectors.js#L75
 *
 * @param {?string} rootClientId
 */
const getUnmemoizedClientTree = rootClientId => {
	const blockOrder = select( 'core/block-editor' ).getBlockOrder( rootClientId )
	const result = []

	for ( const clientId of blockOrder ) {
		const innerBlocks = getUnmemoizedClientTree( clientId )
		const blockEditingMode = select( 'core/block-editor' ).getBlockEditingMode( clientId )
		if ( blockEditingMode !== 'disabled' ) {
			result.push( { clientId, innerBlocks } )
		} else {
			result.push( ...innerBlocks )
		}
	}

	return result
}

function getEnabledClientIdsTreeUnmemoized( state, rootClientId ) {
	const blockOrder = select( 'core/block-editor' ).getBlockOrder( state, rootClientId )
	const result = []

	for ( const clientId of blockOrder ) {
		const innerBlocks = getEnabledClientIdsTreeUnmemoized(
			state,
			clientId
		)
		if ( select( 'core/block-editor' ).getBlockEditingMode( state, clientId ) !== 'disabled' ) {
			result.push( { clientId, innerBlocks } )
		} else {
			result.push( ...innerBlocks )
		}
	}

	return result
}

/**
 * Returns a tree of block objects with only clientID and innerBlocks set.
 * Blocks with a 'disabled' editing mode are not included.
 *
 * @param {Object}  state        Global application state.
 * @param {?string} rootClientId Optional root client ID of block list.
 *
 * @return {Object[]} Tree of block objects with only clientID and innerBlocks set.
 */
const getEnabledClientIdsTree = createSelector(
	getEnabledClientIdsTreeUnmemoized,
	state => [
		state.clientIds,
	]
)

const STORE_SELECTORS = {
	getClientTree: ( state, clientId ) =>
		clientId ? state.clientTree.find( block => block.clientId === clientId )?.innerBlocks : state.clientTree,
	getEnabledClientIdsTree,
	getClientIdsTree: state => state,
}

// Use to correct the blocks returned from getBlocks.
// Applies only core/block (reusable blocks) - Adds missing innerBlocks
// const fixReusableInnerBlocks = blocks => {
// 	return ( blocks || [] ).map( block => {
// 		return {
// 			...block,
// 			innerBlocks: fixReusableInnerBlocks( block.innerBlocks ),
// 			name: select( 'core/block-editor' ).getBlockName( block.clientId ),
// 		}
// 	} )
// }

const STORE_REDUCER = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'UPDATE_CLIENT_TREE': {
			const tree = getUnmemoizedClientTree()
			// if ( tree ) {
			// tree = fixReusableInnerBlocks( tree )
			// dispatch( 'stackable/block-context' ).setBlockTree( blocks )
			// }

			console.log( 'updateClientTree' )
			return {
				...state,
				clientTree: tree,
			}
		}
		case 'UPDATE_CLIENT_IDS': {
			return {
				...state,
				clientIds: action.clientIds,
			}
		}
	}
	return state
}

register( createReduxStore( 'stackable/block-editor', {
	reducer: STORE_REDUCER,
	actions: STORE_ACTIONS,
	selectors: STORE_SELECTORS,
} ) )
