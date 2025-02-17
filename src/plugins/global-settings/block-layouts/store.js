/**
 * External dependencies
 */
// import { head } from 'lodash'

/**
 * WordPress dependencies
 */
import {
	register, createReduxStore, dispatch,
} from '@wordpress/data'
import domReady from '@wordpress/dom-ready'
import { fetchSettings } from '~stackable/util'

// Include all the stored state.
const DEFAULT_STATE = {
	blockLayouts: [],
}

const STORE_ACTIONS = {
	updateBlockLayouts: blockLayouts => ( {
		type: 'UPDATE_BLOCK_LAYOUTS',
		blockLayouts,
	} ),
}

const STORE_SELECTORS = {
	getBlockLayouts: state => state.blockLayouts,
}

const STORE_REDUCER = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'UPDATE_BLOCK_LAYOUTS': {
			return {
				...state,
				blockLayouts: action.blockLayouts,
			}
		}
		default: {
			return state
		}
	}
}

register( createReduxStore( 'stackable/global-block-layouts', {
	reducer: STORE_REDUCER,
	actions: STORE_ACTIONS,
	selectors: STORE_SELECTORS,
} ) )

// Load all our settings into our store.
domReady( () => {
	fetchSettings().then( response => {
		const {
			stackable_global_block_layouts: _blockLayouts,
		} = response
		const blockLayouts = _blockLayouts || []

		dispatch( 'stackable/global-block-layouts' ).updateBlockLayouts( blockLayouts )
	} )
} )
