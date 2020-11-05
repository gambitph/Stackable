/*
 * Plugin used to register utility store for Stackable.
 */

/**
 * External dependencies
 */
import {
	omit, cloneDeep, find,
} from 'lodash'

/**
 * Wordpress dependencies
 */
import {
	registerStore, select, dispatch,
} from '@wordpress/data'
import domReady from '@wordpress/dom-ready'

// Include all the stored state.
const DEFAULT_STATE = {

	/**
	 * initialBlocks is not meant to be reactive. It only
	 * contains the list of initial blocks loaded in the editor.
	 */
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
		return block ? block.clientId : null
	},
}

const STORE_ACTIONS = {
	// Action used for updating the initial blocks.
	updateInitialBlocks: ( payload = cloneDeep( select( 'core/block-editor' ).getBlocks() ) ) => {
		const existingBlocks = []

		const populateExistingBlocksRecursive = blocks => {
			blocks.forEach( block => {
				existingBlocks.push( omit( block, 'innerBlocks' ) )
				// Recursive innerBlocks
				if ( Array.isArray( block.innerBlocks ) && block.innerBlocks.length ) {
					populateExistingBlocksRecursive( block.innerBlocks )
				}
			} )
		}

		populateExistingBlocksRecursive( payload )

		return {
			type: 'UPDATE_INITIAL_BLOCKS',
			payload: existingBlocks,
		}
	},
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

// Register store.
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
