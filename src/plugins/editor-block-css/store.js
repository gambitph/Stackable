/**
 * WordPress dependencies
 */
import { registerStore } from '@wordpress/data'

const DEFAULT_STATE = {
	blockStyles: {},
	lastChange: null,
}

const STORE_ACTIONS = {
	setBlockCss: ( key, css ) => ( {
		type: 'SET_BLOCK_CSS',
		key,
		css,
	} ),
	removeBlockCss: key => ( {
		type: 'REMOVE_BLOCK_CSS',
		key,
	} ),
}

const STORE_SELECTORS = {
	getBlockStyles: state => state.blockStyles,
	getLastChange: state => state.lastChange,
}

const STORE_NAME = 'stackable/editor-block-css'

const STORE_REDUCER = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'SET_BLOCK_CSS': {
			return {
				...state,
				blockStyles: {
					...state.blockStyles,
					[ action.key ]: action.css,
				},
				lastChange: {
					type: 'SET',
					key: action.key,
					css: action.css,
				},
			}
		}
		case 'REMOVE_BLOCK_CSS': {
			const blockStyles = { ...state.blockStyles }
			delete blockStyles[ action.key ]

			return {
				...state,
				blockStyles,
				lastChange: {
					type: 'REMOVE',
					key: action.key,
				},
			}
		}
	}
	return state
}

if ( ! window.__stkEditorBlockCssStoreRegistered ) {
	window.__stkEditorBlockCssStoreRegistered = true

	registerStore( STORE_NAME, {
		reducer: STORE_REDUCER,
		actions: STORE_ACTIONS,
		selectors: STORE_SELECTORS,
	} )
}
