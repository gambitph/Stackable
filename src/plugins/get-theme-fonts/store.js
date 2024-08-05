/**
 * WordPress dependencies
 */
import { createReduxStore, register } from '@wordpress/data'

// Include all the stored state.
const DEFAULT_STATE = {
	themeFonts: [],
	themeFontOptions: [],
	loadingThemeFont: true,
}

const STORE_ACTIONS = {
	updateThemeFonts: themeFonts => {
		return {
			type: 'UPDATE_THEME_FONTS',
			themeFonts,
		}
	},
}

const STORE_SELECTORS = {
	getThemeFonts: state => state,
}

const STORE_REDUCER = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'UPDATE_THEME_FONTS': {
			return {
				...state,
				themeFonts: action.themeFonts,
				themeFontOptions: action.themeFonts.map( fontFamily => {
					return { label: fontFamily, value: fontFamily }
				} ),
				loadingThemeFont: false,
			}
		}
	}
	return state
}

register( createReduxStore( 'stackable/theme-fonts', {
	reducer: STORE_REDUCER,
	actions: STORE_ACTIONS,
	selectors: STORE_SELECTORS,
} ) )

