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
	colorSchemes: [],
	baseColorScheme: '',
	backgroundModeColorScheme: '',
	containerModeColorScheme: '',
}

const STORE_ACTIONS = {
	updateColorSchemes: colorSchemes => ( {
		type: 'UPDATE_COLOR_SCHEMES',
		colorSchemes,
	} ),
	updateDefaultColorScheme: colorSchemeObj => ( {
		type: 'UPDATE_DEFAULT_COLOR_SCHEME',
		colorSchemeObj,
	} ),
}

const STORE_SELECTORS = {
	getSettings: state => ( {
		...state,
		baseColorScheme: state.colorSchemes.find( schemes => schemes.key === state.baseColorScheme )?.key || 'scheme-default-1',
		backgroundModeColorScheme: state.colorSchemes.find( schemes => schemes.key === state.backgroundModeColorScheme )?.key || 'scheme-default-2',
		containerModeColorScheme: state.colorSchemes.find( schemes => schemes.key === state.containerModeColorScheme )?.key || 'scheme-default-1',
	} ),
}

const STORE_REDUCER = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'UPDATE_COLOR_SCHEMES': {
			return {
				...state,
				colorSchemes: action.colorSchemes,
			}
		}
		case 'UPDATE_DEFAULT_COLOR_SCHEME': {
			return {
				...state,
				...action.colorSchemeObj,
			}
		}
		default: {
			return state
		}
	}
}

register( createReduxStore( 'stackable/global-color-schemes', {
	reducer: STORE_REDUCER,
	actions: STORE_ACTIONS,
	selectors: STORE_SELECTORS,
} ) )

// Load all our settings into our store.
domReady( () => {
	fetchSettings().then( response => {
		const {
			stackable_global_color_schemes: _colorSchemes,
			stackable_global_base_color_scheme: baseColorScheme,
			stackable_global_background_mode_color_scheme: backgroundModeColorScheme,
			stackable_global_container_mode_color_scheme: containerModeColorScheme,
		} = response
		const colorSchemes = _colorSchemes || []
		const defaultColorScheme = {
			baseColorScheme,
			backgroundModeColorScheme,
			containerModeColorScheme,
		}

		dispatch( 'stackable/global-color-schemes' ).updateColorSchemes( colorSchemes )
		dispatch( 'stackable/global-color-schemes' ).updateDefaultColorScheme( defaultColorScheme )
	} )
} )
