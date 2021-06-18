import { useBlockEditContext } from '@wordpress/block-editor'
import {
	registerStore, dispatch, useSelect,
} from '@wordpress/data'
import { useEffect, useCallback } from '@wordpress/element'

// Include all the stored state.
const DEFAULT_STATE = {
	selectedBlock: null,
	hoverState: 'normal',
}

const STORE_ACTIONS = {
	updateSelectedBlock: clientId => ( {
		type: 'UPDATE_SELECTED_BLOCK',
		value: clientId,
	} ),
	updateHoverState: state => ( {
		type: 'UPDATE_HOVER_STATE',
		value: state,
	} ),
}

const STORE_SELECTORS = {
	getSelectedBlock: state => state.selectedBlock,
	getHoverState: state => state.hoverState,
}

const STORE_REDUCER = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'UPDATE_SELECTED_BLOCK': {
			return {
				selectedBlock: action.value,
				hoverState: 'normal',
			}
		}
		case 'UPDATE_HOVER_STATE': {
			return {
				...state,
				hoverState: action.value,
			}
		}
	}
	return state
}

registerStore( 'stackable/hover-state', {
	reducer: STORE_REDUCER,
	actions: STORE_ACTIONS,
	selectors: STORE_SELECTORS,
} )

export const useBlockHoverState = () => {
	const { clientId } = useBlockEditContext()
	const {
		selectedClientId,
		hoverStateClientId,
		hoverState,
	} = useSelect( select => {
		return {
			selectedClientId: select( 'core/block-editor' ).getSelectedBlockClientId(),
			hoverStateClientId: select( 'stackable/hover-state' ).getSelectedBlock(),
			hoverState: select( 'stackable/hover-state' ).getHoverState(),
		}
	}, [] )

	// Update the selected id if the selected block changes.
	useEffect( () => {
		if ( hoverStateClientId !== selectedClientId ) {
			dispatch( 'stackable/hover-state' ).updateSelectedBlock( selectedClientId )
		}
	}, [ selectedClientId, hoverStateClientId ] )

	const setHoverState = useCallback( state => {
		dispatch( 'stackable/hover-state' ).updateHoverState( state )
	}, [] )

	const isBlockSelected = clientId === hoverStateClientId

	// The hover state only applies to the currently selected block.
	const blockHoverClass = isBlockSelected && hoverState !== 'normal' ? 'stk--is-hovered' : ''
	const currentHoverState = isBlockSelected ? hoverState : 'normal'

	return [ currentHoverState, setHoverState, blockHoverClass ]
}

export const useBlockHoverClass = () => {
	const hoverState = useBlockHoverState()
	return hoverState[ 2 ]
}
