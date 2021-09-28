import { useBlockEditContext } from '@wordpress/block-editor'
import {
	registerStore, dispatch, useSelect,
} from '@wordpress/data'
import { useCallback } from '@wordpress/element'

// Include all the stored state.
const DEFAULT_STATE = {
	selectedBlock: null,
	hoverState: 'normal',
	hasParentHoverState: false,
	selectedParentHoverBlock: null,
	selectedParentHoverChildren: [],
	selectedHoverChildren: [],

	// Accordion collapsed state.
	hasCollapsedState: false,
	selectedCollapsedBlock: null,
	selectedCollapsedChildren: [],
}

const STORE_ACTIONS = {
	updateSelectedBlock: clientId => {
		// We need to specify `.edit-post-visual-editor__content-area` to avoid targeting the navigation list view.
		const blockEl = document.querySelector( `.edit-post-visual-editor__content-area [data-block="${ clientId }"]` )

		// Get the currently parent-hovered block if there is one.
		const parentHoverEl = blockEl?.closest( '.stk-hover-parent' )?.closest( '[data-block]' )
		const parentHoverClientId = parentHoverEl?.getAttribute( 'data-block' ) || null

		// Get all the child blocks of the currently parent-hovered block.
		const parentHoverChildrenClientIds = Array.from( parentHoverEl?.querySelectorAll( '[data-block]' ) || [] )
			.map( el => el.getAttribute( 'data-block' ) ) || []

		// Get all child blocks of the currently hovered block.
		const hoverChildrenClientIds = Array.from( blockEl?.querySelectorAll( '[data-block]' ) || [] )
			.map( el => el.getAttribute( 'data-block' ) ) || []

		const collapsedEl = blockEl?.closest( '.stk-block-accordion' )?.closest( '[data-block]' )
		const collapsedClientId = collapsedEl?.getAttribute( 'data-block' ) || null

		// Get all the child blocks of the accordion block.
		const collapsedChildrenClientIds = Array.from( collapsedEl?.querySelectorAll( '[data-block]' ) || [] )
			.map( el => el.getAttribute( 'data-block' ) ) || []

		return {
			type: 'UPDATE_SELECTED_BLOCK',
			clientId,
			parentHoverClientId,
			hasParentHoverState: !! parentHoverClientId,
			parentHoverChildrenClientIds,
			hoverChildrenClientIds,
			collapsedClientId,
			collapsedChildrenClientIds,
			hasCollapsedState: !! collapsedClientId,
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
	getHasCollapsedState: state => state.hasCollapsedState,
	getSelectedCollapsedBlock: state => state.selectedCollapsedBlock,
	getSelectedCollapsedBlockChildren: state => state.selectedCollapsedChildren,
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

				// Accordion collapsed state.
				hasCollapsedState: action.hasCollapsedState,
				selectedCollapsedBlock: action.collapsedClientId,
				selectedCollapsedChildren: action.collapsedChildrenClientIds,
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
		hoverStateClientId,
		hoverState,
		parentHoverClientId,
		parentHoverChildrenClientIds,
		hoverChildrenClientIds,
		hasParentHoverState,

		hasCollapsedState,
		collapsedClientId,
		collapsedChildrenClientIds,
	} = useSelect( select => {
		return {
			selectedClientId: select( 'core/block-editor' ).getSelectedBlockClientId(),
			hoverStateClientId: select( 'stackable/hover-state' ).getSelectedBlock(),
			hoverState: select( 'stackable/hover-state' ).getHoverState(),
			parentHoverClientId: select( 'stackable/hover-state' ).getSelectedParentHoverBlock(),
			parentHoverChildrenClientIds: select( 'stackable/hover-state' ).getSelectedParentHoverBlockChildren(),
			hoverChildrenClientIds: select( 'stackable/hover-state' ).getSelectedHoverChildren(),
			hasParentHoverState: select( 'stackable/hover-state' ).getHasParentHoverState(),

			// Accordion collapsed state.
			hasCollapsedState: select( 'stackable/hover-state' ).getHasCollapsedState(),
			collapsedClientId: select( 'stackable/hover-state' ).getSelectedCollapsedBlock(),
			collapsedChildrenClientIds: select( 'stackable/hover-state' ).getSelectedCollapsedBlockChildren(),
		}
	}, [] )

	const setHoverState = useCallback( state => {
		dispatch( 'stackable/hover-state' ).updateHoverState( state )
	}, [] )

	const isBlockSelected = clientId === hoverStateClientId
	const isParentHoverBlock = clientId === parentHoverClientId
	const isChildOfParentHover = parentHoverChildrenClientIds.includes( clientId )
	const isChildOfHoverBlock = hoverChildrenClientIds.includes( clientId )
	const isCollapsedBlock = clientId === collapsedClientId
	const isChildOfCollapsedBlock = collapsedChildrenClientIds.includes( clientId )

	// The hover state only applies to the currently selected block.
	let blockHoverClass = ''
	let currentHoverState = 'normal'
	if ( isBlockSelected ) {
		if ( hoverState === 'hover' || hoverState === 'parent-hovered' ) {
			blockHoverClass = 'stk--is-hovered'
		} else if ( hoverState === 'collapsed' ) {
			blockHoverClass = 'stk--is-open'
		}
		currentHoverState = hoverState

		// If we changed the hover state to parent-hovered, but the block
		// doesn't have a parent to hover, make it hover instead.
		if ( ! hasParentHoverState && hoverState === 'parent-hovered' ) {
			currentHoverState = 'hover'
		}

	// Also change the hover states of the other
	} else if ( isParentHoverBlock ) {
		if ( hoverState === 'hover' || hoverState === 'parent-hovered' ) {
			blockHoverClass = 'stk--is-hovered'
			currentHoverState = 'hover'
		}
	} else if ( isChildOfParentHover || isChildOfHoverBlock ) {
		if ( hoverState === 'hover' || hoverState === 'parent-hovered' ) {
			blockHoverClass = 'stk--is-hovered'
			currentHoverState = 'parent-hovered'
		}
	} else if ( isChildOfCollapsedBlock || isCollapsedBlock ) {
		blockHoverClass = 'stk--is-open'
		currentHoverState = 'collapsed'
	}

	return [ currentHoverState, setHoverState, blockHoverClass, hasParentHoverState, hasCollapsedState ]
}

export const useBlockHoverClass = () => {
	const hoverState = useBlockHoverState()
	return hoverState[ 2 ]
}
