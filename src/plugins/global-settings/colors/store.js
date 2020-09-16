/**
 * Wordpress dependencies
 */
import { registerStore } from '@wordpress/data'

/**
 * External dependencies
 */
import { omit } from 'lodash'

// Include all the stored state.
const DEFAULT_STATE = {
	defaultColors: [],
	useStackableColorsOnly: false,
}

const STORE_ACTIONS = {
	updateSettings: ( payload = {} ) => ( { type: 'UPDATE_SETTINGS', payload: omit( payload, 'type' ) } ),
}

const STORE_SELECTORS = {
	getSettings: state => state,
}

const STORE_REDUCER = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'UPDATE_SETTINGS': {
			return {
				...state,
				...action.payload,
			}
		}
		default: {
			return state
		}
	}
}

registerStore( 'stackable/global-colors', {
	reducer: STORE_REDUCER,
	actions: STORE_ACTIONS,
	selectors: STORE_SELECTORS,
} )
