/**
 * This store keeps the height and open state of the navigation view so that it can be
 * shared across all navigation views.
 */

/**
 * WordPress dependencies
 */
import { registerStore } from '@wordpress/data'

const DEFAULT_HEIGHT = 220

let height = window.localStorage.getItem( 'stk__navigation_view_height' )
height = height ? JSON.parse( height ) : DEFAULT_HEIGHT
if ( height > 1000 ) {
	height = 1000
}

let isOpen = window.localStorage.getItem( 'stk__navigation_view_is_open' )
isOpen = isOpen ? JSON.parse( isOpen ) : true

// Include all the stored state.
const DEFAULT_STATE = {
	height,
	isOpen,
}

const STORE_ACTIONS = {
	updateHeight: height => {
		window.localStorage.setItem( 'stk__navigation_view_height', height )
		return {
			type: 'UPDATE_NAVIGATION_VIEW_HEIGHT',
			height,
		}
	},
	updateIsOpen: isOpen => {
		window.localStorage.setItem( 'stk__navigation_view_is_open', isOpen )
		return {
			type: 'UPDATE_NAVIGATION_VIEW_ISOPEN',
			isOpen,
		}
	},
}

const STORE_SELECTORS = {
	getHeight: state => state.height,
	getIsOpen: state => state.isOpen,
}

const STORE_REDUCER = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'UPDATE_NAVIGATION_VIEW_HEIGHT': {
			return {
				...state,
				height: action.height,
			}
		}
		case 'UPDATE_NAVIGATION_VIEW_ISOPEN': {
			return {
				...state,
				isOpen: action.isOpen,
			}
		}
	}
	return state
}

registerStore( 'stackable/navigation-view', {
	reducer: STORE_REDUCER,
	actions: STORE_ACTIONS,
	selectors: STORE_SELECTORS,
} )
