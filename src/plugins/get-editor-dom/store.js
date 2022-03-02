/**
 * WordPress dependencies
 */
import { registerStore } from '@wordpress/data'

// Include all the stored state.
const DEFAULT_STATE = {
	editorDom: null,
}

const STORE_ACTIONS = {
	updateEditorDom: editorDom => {
		return {
			type: 'UPDATE_EDITOR_DOM',
			editorDom,
		}
	},
}

const STORE_SELECTORS = {
	getEditorDom: state => state.editorDom,
}

const STORE_REDUCER = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'UPDATE_EDITOR_DOM': {
			return {
				...state,
				editorDom: action.editorDom,
			}
		}
	}
	return state
}

registerStore( 'stackable/editor-dom', {
	reducer: STORE_REDUCER,
	actions: STORE_ACTIONS,
	selectors: STORE_SELECTORS,
} )
