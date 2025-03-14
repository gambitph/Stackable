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
import { cloneDeep } from 'lodash'

// Include all the stored state.
const DEFAULT_STATE = {
	colorSchemes: [],
	baseColorScheme: '',
	backgroundModeColorScheme: '',
	containerModeColorScheme: '',
	colorSchemesInUse: {},
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
	updateColorSchemesInUse: props => ( {
		type: 'UPDATE_COLOR_SCHEMES_IN_USE',
		props,
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
		case 'UPDATE_COLOR_SCHEMES_IN_USE': {
			const {
				newScheme, oldScheme, clientId, mode = 'container',
			} = action.props

			const schemes = cloneDeep( state.colorSchemesInUse )

			const oldSchemeKey = oldScheme ? `${ mode }-${ oldScheme }` : ''
			const newSchemeKey = newScheme ? `${ mode }-${ newScheme }` : ''

			if ( oldSchemeKey in schemes ) {
				const index = schemes[ oldSchemeKey ].indexOf( clientId )
				if ( index !== -1 ) {
					schemes[ oldSchemeKey ].splice( index, 1 )
				}

				if ( schemes[ oldSchemeKey ].length === 0 ) {
					delete schemes[ oldSchemeKey ]
				}
			}

			if ( newSchemeKey in schemes ) {
				const index = schemes[ newSchemeKey ].indexOf( clientId )
				if ( index === -1 ) {
					schemes[ newSchemeKey ].push( clientId )
				}
			} else if ( newSchemeKey !== '' ) {
				schemes[ newSchemeKey ] = [ clientId ]
			}

			return {
				...state,
				colorSchemesInUse: schemes,
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
