import { useBlockEditContext } from '@wordpress/block-editor'
import {
	registerStore, dispatch, useSelect,
} from '@wordpress/data'
import { useEffect, useCallback } from '@wordpress/element'

// Include all the stored state.
const DEFAULT_STATE = {
	selectedBlock: null,
	hoverState: 'normal',
	hasParentHoverState: false,
	selectedParentHoverBlock: null,
	selectedParentHoverChildren: [],
	selectedHoverChildren: [],
}

const STORE_ACTIONS = {
	updateSelectedBlock: clientId => {
		const blockEl = document.querySelector( `[data-block="${ clientId }"]` )

		// Get the currently parent-hovered block if there is one.
		const parentHoverEl = blockEl?.closest( '.stk-hover-parent' )?.closest( '[data-block]' )
		const parentHoverClientId = parentHoverEl?.getAttribute( 'data-block' ) || null

		// Get all the child blocks of the currently parent-hovered block.
		const parentHoverChildrenClientIds = Array.from( parentHoverEl?.querySelectorAll( '[data-block]' ) || [] )
			.map( el => el.getAttribute( 'data-block' ) ) || []

		// Get all child blocks of the currently hovered block.
		const hoverChildrenClientIds = Array.from( blockEl?.querySelectorAll( '[data-block]' ) || [] )
			.map( el => el.getAttribute( 'data-block' ) ) || []

		return {
			type: 'UPDATE_SELECTED_BLOCK',
			clientId,
			parentHoverClientId,
			hasParentHoverState: !! parentHoverClientId,
			parentHoverChildrenClientIds,
			hoverChildrenClientIds,
		}
	},
	clearSelectedBlock: () => ( {
		type: 'CLEAR_SELECTED_BLOCK',
	} ),
	updateHoverState: state => ( {
		type: 'UPDATE_HOVER_STATE',
		value: state,
	} ),
}

const STORE_SELECTORS = {
	getSelectedBlock: state => state.selectedBlock,
	getHoverState: state => state.hoverState,
	getHasParentHoverState: state => state.hasParentHoverState,
	getSelectedParentHoverBlock: state => state.selectedParentHoverBlock,
	getSelectedParentHoverBlockChildren: state => state.selectedParentHoverChildren,
	getSelectedHoverChildren: state => state.selectedHoverChildren,
}

const STORE_REDUCER = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'UPDATE_SELECTED_BLOCK': {
			return {
				...state,
				selectedBlock: action.clientId,
				// hoverState: 'normal', // Don't reset the hover state.
				selectedParentHoverBlock: action.parentHoverClientId,
				hasParentHoverState: action.hasParentHoverState,
				selectedParentHoverChildren: action.parentHoverChildrenClientIds,
				selectedHoverChildren: action.hoverChildrenClientIds,
			}
		}
		case 'CLEAR_SELECTED_BLOCK': {
			return {
				...DEFAULT_STATE,
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
		parentHoverClientId,
		parentHoverChildrenClientIds,
		hoverChildrenClientIds,
		hasParentHoverState,
	} = useSelect( select => {
		return {
			selectedClientId: select( 'core/block-editor' ).getSelectedBlockClientId(),
			hoverStateClientId: select( 'stackable/hover-state' ).getSelectedBlock(),
			hoverState: select( 'stackable/hover-state' ).getHoverState(),
			parentHoverClientId: select( 'stackable/hover-state' ).getSelectedParentHoverBlock(),
			parentHoverChildrenClientIds: select( 'stackable/hover-state' ).getSelectedParentHoverBlockChildren(),
			hoverChildrenClientIds: select( 'stackable/hover-state' ).getSelectedHoverChildren(),
			hasParentHoverState: select( 'stackable/hover-state' ).getHasParentHoverState(),
		}
	}, [] )

	// Update the selected id if the selected block changes.
	useEffect( () => {
		if ( hoverStateClientId !== selectedClientId ) {
			if ( selectedClientId ) {
				dispatch( 'stackable/hover-state' ).updateSelectedBlock( selectedClientId )
			} else {
				// If there's no selected block, clear the hover states.
				dispatch( 'stackable/hover-state' ).clearSelectedBlock()
			}
		}
	}, [ selectedClientId, hoverStateClientId ] )

	const setHoverState = useCallback( state => {
		dispatch( 'stackable/hover-state' ).updateHoverState( state )
	}, [] )

	const isBlockSelected = clientId === hoverStateClientId
	const isParentHoverBlock = clientId === parentHoverClientId
	const isChildOfParentHover = parentHoverChildrenClientIds.includes( clientId )
	const isChildOfHoverBlock = hoverChildrenClientIds.includes( clientId )

	// The hover state only applies to the currently selected block.
	let blockHoverClass = ''
	let currentHoverState = 'normal'
	if ( isBlockSelected ) {
		if ( hoverState !== 'normal' ) {
			blockHoverClass = 'stk--is-hovered'
		}
		currentHoverState = hoverState

		// If we changed the hover state to parent-hovered, but the block
		// doens't have a parent to hover, make it hover instead.
		if ( ! hasParentHoverState && hoverState === 'parent-hovered' ) {
			currentHoverState = 'hover'
		}

	// Also change the hover states of the other
	} else if ( isParentHoverBlock ) {
		if ( hoverState !== 'normal' ) {
			blockHoverClass = 'stk--is-hovered'
			currentHoverState = 'hover'
		}
	} else if ( isChildOfParentHover || isChildOfHoverBlock ) {
		if ( hoverState !== 'normal' ) {
			blockHoverClass = 'stk--is-hovered'
			currentHoverState = 'parent-hovered'
		}
	}

	return [ currentHoverState, setHoverState, blockHoverClass, hasParentHoverState ]
}

export const useBlockHoverClass = () => {
	const hoverState = useBlockHoverState()
	return hoverState[ 2 ]
}
