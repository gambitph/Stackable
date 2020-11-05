/*
 * Plugin used to register utility store for Stackable.
 */

/**
 * External dependencies
 */
import { cloneDeep, find } from 'lodash'

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
	isInitializing: true,
}

const STORE_SELECTORS = {
	getInitialBlocks: state => state.initialBlocks,
	getInitialBlockClientId: ( state, clientId ) => {
		if ( state.isInitializing ) {
			return undefined
		}
		const block = find( state.initialBlocks, blockEntry => blockEntry.clientId === clientId )
		return block ? cloneDeep( block ) : null
	},
}

const STORE_ACTIONS = {
	updateInitialBlocks: ( payload = cloneDeep( select( 'core/block-editor' ).getBlocks() ) ) => ( {
		type: 'UPDATE_INITIAL_BLOCKS',
		payload,
	} ),
	setIsInitializing: payload => ( {
		type: 'SET_IS_INITIALIZING',
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
		case 'SET_IS_INITIALIZING': {
			return {
				...state,
				isInitializing: action.payload,
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
	dispatch( 'stackable/util' ).updateInitialBlocks()
	dispatch( 'stackable/util' ).setIsInitializing( false )
} )
