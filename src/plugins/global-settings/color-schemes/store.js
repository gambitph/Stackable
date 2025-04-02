/**
 * External dependencies
 */
import { fetchSettings } from '~stackable/util'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	register, createReduxStore, dispatch,
} from '@wordpress/data'
import domReady from '@wordpress/dom-ready'
import { __ } from '@wordpress/i18n'

// Include all the stored state.
const DEFAULT_STATE = {
	colorSchemes: [],
	hideColorSchemeColors: '',
	baseColorScheme: '',
	backgroundModeColorScheme: '',
	containerModeColorScheme: '',
	isOpen: false,
}

const STORE_ACTIONS = {
	updateColorSchemes: colorSchemes => ( {
		type: 'UPDATE_COLOR_SCHEMES',
		colorSchemes,
	} ),
	updateSettings: settings => ( {
		type: 'UPDATE_SETTINGS',
		settings,
	} ),
	setIsOpen: isOpen => ( {
		type: 'SET_IS_OPEN',
		isOpen,
	} ),
}

const STORE_SELECTORS = {
	getSettings: state => ( {
		...state,
		baseColorScheme: state.baseColorScheme || 'scheme-default-1',
		backgroundModeColorScheme: state.backgroundModeColorScheme || 'scheme-default-2',
		containerModeColorScheme: state.containerModeColorScheme || 'scheme-default-1',
	} ),
	getIsOpen: state => state.isOpen,
}

const STORE_REDUCER = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'UPDATE_COLOR_SCHEMES': {
			return {
				...state,
				colorSchemes: action.colorSchemes,
			}
		}
		case 'UPDATE_SETTINGS': {
			return {
				...state,
				...action.settings,
			}
		}
		case 'SET_IS_OPEN': {
			return {
				...state,
				isOpen: action.isOpen,
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
			stackable_global_hide_color_scheme_colors: hideColorSchemeColors,
			stackable_global_base_color_scheme: baseColorScheme,
			stackable_global_background_mode_color_scheme: backgroundModeColorScheme,
			stackable_global_container_mode_color_scheme: containerModeColorScheme,
		} = response

		const colorSchemes = Array.isArray( _colorSchemes ) && _colorSchemes.length > 0 ? _colorSchemes : [ {
			name: __( 'Default Scheme', i18n ),
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
			hideInPicker: false,
		}, {
			name: __( 'Background Scheme', i18n ),
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
			hideInPicker: false,
		} ]

		const settings = {
			colorSchemes,
			hideColorSchemeColors,
			baseColorScheme,
			backgroundModeColorScheme,
			containerModeColorScheme,
		}

		dispatch( 'stackable/global-color-schemes' ).updateSettings( settings )
	} )
} )
