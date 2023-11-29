/**
 * External dependencies
 */
import { omit, head } from 'lodash'

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
	isInitializing: true,
	stackableColors: [],
	stackableGradients: [],
	hideThemeColors: false,
	hideDefaultColors: false,
	hideSiteEditorColors: false,
}

const STORE_ACTIONS = {
	updateSettings: ( payload = {} ) => ( {
		type: 'UPDATE_SETTINGS',
		payload: omit( payload, 'type' ),
	} ),
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

register( createReduxStore( 'stackable/global-colors', {
	reducer: STORE_REDUCER,
	actions: STORE_ACTIONS,
	selectors: STORE_SELECTORS,
} ) )

// Load all our settings into our store.
domReady( () => {
	fetchSettings().then( response => {
		const {
			stackable_global_hide_theme_colors: hideThemeColors,
			stackable_global_hide_default_colors: hideDefaultColors,
			stackable_global_hide_site_editor_colors: hideSiteEditorColors,
			stackable_global_colors: _stackableColors,
			stackable_global_gradients: stackableGradients,
		} = response
		const stackableColors = head( _stackableColors ) || []

		dispatch( 'stackable/global-colors' ).updateSettings( {
			hideThemeColors,
			hideDefaultColors,
			hideSiteEditorColors,
			stackableColors,
			stackableGradients: stackableGradients || [],
			isInitializing: false,
		} )
	} )
} )
