/**
 * WordPress dependencies
 */
import { createReduxStore, register } from '@wordpress/data'
import { models } from '@wordpress/api'

// Default state for the store
const DEFAULT_STATE = {
	settings: {},
}

// Store actions
const STORE_ACTIONS = {
	updateSettings: settings => {
		return {
			type: 'UPDATE_SETTINGS',
			settings,
		}
	},
	saveSettings: () => {
		return {
			type: 'SAVE_SETTINGS',
		}
	},
}

// Store selectors
const STORE_SELECTORS = {
	getSettings: state => state.settings,
}

// Store reducer
const STORE_REDUCER = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'UPDATE_SETTINGS': {
			return {
				...state,
				settings: {
					...state.settings,
					...action.settings,
				},
			}
		}
		case 'SAVE_SETTINGS': {
			const model = new models.Settings( state.settings ) // eslint-disable-line camelcase
			model.save()
			return state
		}
		default:
			return state
	}
}

export const registerSettingsStore = () => {
	register(
		createReduxStore( 'stackable/settings', {
			reducer: STORE_REDUCER,
			actions: STORE_ACTIONS,
			selectors: STORE_SELECTORS,
		} )
	)
}
