/**
 * External dependencies
 */
import { fetchSettings } from '~stackable/util'

/**
 * WordPress dependencies
 */
import {
	register, createReduxStore, dispatch,
} from '@wordpress/data'
import domReady from '@wordpress/dom-ready'

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
		baseColorScheme: state.baseColorScheme || 'scheme-default-1',
		backgroundModeColorScheme: state.backgroundModeColorScheme || 'scheme-default-2',
		containerModeColorScheme: state.containerModeColorScheme || 'scheme-default-1',
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
		const colorSchemes = Array.isArray( _colorSchemes ) && _colorSchemes.length > 0 ? _colorSchemes : [ {
			name: 'Default Scheme',
			key: 'scheme-default-1',
			colorScheme: {
				backgroundColor: { desktop: '' },
				headingColor: { desktop: '' },
				textColor: { desktop: '' },
				linkColor: { desktop: '' },
				accentColor: { desktop: '' },
				buttonBackgroundColor: { desktop: '' },
				buttonTextColor: { desktop: '' },
				buttonOutlineColor: { desktop: '' },
			},
		}, {
			name: 'Color Scheme 2',
			key: 'scheme-default-2',
			colorScheme: {
				backgroundColor: { desktop: '' },
				headingColor: { desktop: '' },
				textColor: { desktop: '' },
				linkColor: { desktop: '' },
				accentColor: { desktop: '' },
				buttonBackgroundColor: { desktop: '' },
				buttonTextColor: { desktop: '' },
				buttonOutlineColor: { desktop: '' },
			},
		} ]

		const defaultColorScheme = {
			baseColorScheme,
			backgroundModeColorScheme,
			containerModeColorScheme,
		}

		dispatch( 'stackable/global-color-schemes' ).updateColorSchemes( colorSchemes )
		dispatch( 'stackable/global-color-schemes' ).updateDefaultColorScheme( defaultColorScheme )
	} )
} )
