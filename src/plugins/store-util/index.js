/*
 * Plugin used to register utility store for Stackable.
 */

/**
 * External dependencies
 */
import { find } from 'lodash'

/**
 * Wordpress dependencies
 */
import {
	registerStore, select, dispatch,
} from '@wordpress/data'
import domReady from '@wordpress/dom-ready'

// Include all the stored state.
const DEFAULT_STATE = {
	initialBlocks: [],
}

const STORE_SELECTORS = {
	getInitialBlocks: state => state.initialBlocks,
	getInitialBlockClientId: ( state, clientId ) => {
		if ( ! state.initialBlocks.length ) {
			return undefined
		}
		const block = find( state.initialBlocks, blockEntry => blockEntry.clientId === clientId )
		return block ? block : null
	},
}

const STORE_ACTIONS = {
	updateInitialBlocks: ( payload = [] ) => ( {
		type: 'UPDATE_INITIAL_BLOCKS',
		payload,
	} ),
}

const STORE_REDUCER = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'UPDATE_INITIAL_BLOCKS': {
			return {
				...state,
				initialBlocks: action.payload,
			}
		}
		default: {
			return state
		}
	}
}

registerStore( 'stackable/util', {
	reducer: STORE_REDUCER,
	actions: STORE_ACTIONS,
	selectors: STORE_SELECTORS,
} )

// Populate the initial blocks
domReady( () => {
	const initialBlocks = select( 'core/block-editor' ).getBlocks()
	dispatch( 'stackable/util' ).updateInitialBlocks( initialBlocks )
} )
