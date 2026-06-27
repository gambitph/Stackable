/**
 * WordPress dependencies
 */
import { register, createReduxStore } from '@wordpress/data'

const PAGE_ICONS = new Map()

// Include all the stored state.
const DEFAULT_STATE = PAGE_ICONS

const STORE_ACTIONS = {
	addPageIcon: ( icon, iconId ) => ( {
		type: 'ADD_PAGE_ICON',
		icon,
		iconId,
	} ),
	removePageIcon: icon => ( {
		type: 'REMOVE_PAGE_ICON',
		icon,
	} ),
}

const STORE_SELECTORS = {
	getPageIcons: pageIcons => pageIcons,
}

const STORE_REDUCER = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'ADD_PAGE_ICON': {
			const newState = new Map( state )
			if ( state.has( action.icon ) ) {
				// Keep the existing ID to prevent race conditions where multiple components
				// try to add the same icon with different IDs
				const existingData = state.get( action.icon )
				newState.set( action.icon, { id: existingData.id, count: existingData.count + 1 } )
				return newState
			}

			newState.set( action.icon, { id: action.iconId, count: 1 } )
			return newState
		}
		case 'REMOVE_PAGE_ICON': {
			if ( state.has( action.icon ) ) {
				const newState = new Map( state )
				const count = state.get( action.icon ).count - 1

				if ( count < 1 ) {
					newState.delete( action.icon )
					return newState
				}

				newState.set( action.icon, { id: state.get( action.icon ).id, count } )
				return newState
			}

			return state
		}
		default: {
			return state
		}
	}
}

register( createReduxStore( 'stackable/page-icons', {
	reducer: STORE_REDUCER,
	actions: STORE_ACTIONS,
	selectors: STORE_SELECTORS,
} ) )

