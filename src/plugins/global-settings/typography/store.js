/**
 * WordPress dependencies
 */
import { register, createReduxStore } from '@wordpress/data'

// Include all the stored state.
const DEFAULT_STATE = {
	typographySettings: {},
}

const STORE_ACTIONS = {
	updateSettings: typographySettings => ( {
		type: 'UPDATE_TYPOGRAPHY',
		typographySettings,
	} ),
}

const STORE_SELECTORS = {
	getSettings: state => state.typographySettings,
}

const STORE_REDUCER = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'UPDATE_TYPOGRAPHY': {
			return {
				...state,
				typographySettings: action.typographySettings,
			}
		}
		default: {
			return state
		}
	}
}

register( createReduxStore( 'stackable/global-typography', {
	reducer: STORE_REDUCER,
	actions: STORE_ACTIONS,
	selectors: STORE_SELECTORS,
} ) )
