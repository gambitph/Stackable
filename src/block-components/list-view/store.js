/**
 * This store keeps the height and open state of the list view so that it can be
 * shared across all list views.
 */

/**
 * WordPress dependencies
 */
import { registerStore } from '@wordpress/data'

const DEFAULT_HEIGHT = 220

let height = window.localStorage.getItem( 'stk__list_view_height' )
height = height ? JSON.parse( height ) : DEFAULT_HEIGHT
if ( height > 1000 ) {
	height = 1000
}

let isOpen = window.localStorage.getItem( 'stk__list_view_is_open' )
isOpen = isOpen ? JSON.parse( isOpen ) : true

// Include all the stored state.
const DEFAULT_STATE = {
	height,
	isOpen,
}

const STORE_ACTIONS = {
	updateHeight: height => {
		window.localStorage.setItem( 'stk__list_view_height', height )
		return {
			type: 'UPDATE_LIST_VIEW_HEIGHT',
			height,
		}
	},
	updateIsOpen: isOpen => {
		window.localStorage.setItem( 'stk__list_view_is_open', isOpen )
		return {
			type: 'UPDATE_LIST_VIEW_ISOPEN',
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
		case 'UPDATE_LIST_VIEW_HEIGHT': {
			return {
				...state,
				height: action.height,
			}
		}
		case 'UPDATE_LIST_VIEW_ISOPEN': {
			return {
				...state,
				isOpen: action.isOpen,
			}
		}
	}
	return state
}

registerStore( 'stackable/list-view', {
	reducer: STORE_REDUCER,
	actions: STORE_ACTIONS,
	selectors: STORE_SELECTORS,
} )
