import { useBlockEditContext } from '@wordpress/block-editor'
import { register, createReduxStore, useSelect } from '@wordpress/data'
// import { useMemo } from '@wordpress/element'

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
	updateSelectedBlock: ( clientId, editorDom ) => {
		// We need to specify `.editor-styles-wrapper` to avoid targeting the navigation list view.
		const blockEl = editorDom?.querySelector( `[data-block="${ clientId }"]` )

		// Get the currently parent-hover block if there is one.
		const parentHoverEl = blockEl?.closest( '.stk-hover-parent' )?.closest( '[data-block]' )
		const parentHoverClientId = parentHoverEl?.getAttribute( 'data-block' ) || null

		// Get all the child blocks of the currently parent-hover block.
		const parentHoverChildrenClientIds = Array.from( parentHoverEl?.querySelectorAll( '[data-block]' ) || [] )
			.map( el => el.getAttribute( 'data-block' ) ) || []

		// Get all child blocks of the currently hovered block.
		const hoverChildrenClientIds = Array.from( blockEl?.querySelectorAll( '[data-block]' ) || [] )
			.map( el => el.getAttribute( 'data-block' ) ) || []

		const collapsedEl = blockEl?.closest( '.stk-block-accordion' )?.closest( '[data-block]' ) || ( blockEl?.getAttribute( 'data-type' ) === 'stackable/accordion' ? blockEl : null )
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

register( createReduxStore( 'stackable/hover-state', {
	reducer: STORE_REDUCER,
	actions: STORE_ACTIONS,
	selectors: STORE_SELECTORS,
} ) )

export const useBlockHoverState = () => {
	const { clientId } = useBlockEditContext()
	const clientIds = useSelect( select => select( 'core/block-editor' ).getMultiSelectedBlockClientIds() )

	const {
		currentHoverState,
		blockHoverClass,
		hasParentHoverState,
		hasCollapsedState,
		isCollapsedBlock,
	} = useSelect( select => {
		const hoverState = select( 'stackable/hover-state' ).getHoverState()
		const hoverStateClientId = select( 'stackable/hover-state' ).getSelectedBlock()

		const {
			getSelectedParentHoverBlock,
			getSelectedParentHoverBlockChildren,
			getSelectedHoverChildren,
			getHasParentHoverState,
			getHasCollapsedState,
			getSelectedCollapsedBlock,
			getSelectedCollapsedBlockChildren,
		} = select( 'stackable/hover-state' )


		const hasParentHoverState = getHasParentHoverState()
		const parentHoverClientId = getSelectedParentHoverBlock()
		const hasCollapsedState = getHasCollapsedState()
		const collapsedClientId = getSelectedCollapsedBlock()

		// return useMemo( () => {
		const isBlockSelected = clientId === hoverStateClientId || clientIds.includes( clientId )
		const isParentHoverBlock = clientId === parentHoverClientId
		const isCollapsedBlock = clientId === collapsedClientId

		// The hover state only applies to the currently selected block.
		let blockHoverClass = ''
		let currentHoverState = 'normal'
		if ( isBlockSelected ) {
			if ( hoverState === 'hover' || hoverState === 'parent-hover' ) {
				blockHoverClass = 'stk--is-hovered'
			}

			currentHoverState = hoverState

			// If we changed the hover state to parent-hover, but the block
			// doesn't have a parent to hover, make it hover instead.
			if ( ! hasParentHoverState && hoverState === 'parent-hover' ) {
				currentHoverState = 'hover'
			}

		// Also change the hover states of the other
		} else if ( isParentHoverBlock ) {
			if ( hoverState === 'hover' || hoverState === 'parent-hover' ) {
				blockHoverClass = 'stk--is-hovered'
				currentHoverState = 'hover'
			}

		} else {

			const parentHoverChildrenClientIds = getSelectedParentHoverBlockChildren()
			const hoverChildrenClientIds = getSelectedHoverChildren()
			const collapsedChildrenClientIds = getSelectedCollapsedBlockChildren()

			const isChildOfParentHover = parentHoverChildrenClientIds.includes( clientId )
			const isChildOfHoverBlock = hoverChildrenClientIds.includes( clientId )
			const isChildOfCollapsedBlock = collapsedChildrenClientIds.includes( clientId )

			if ( isChildOfParentHover || isChildOfHoverBlock ) {
				if ( hoverState === 'hover' || hoverState === 'parent-hover' ) {
					blockHoverClass = 'stk--is-hovered'
					currentHoverState = 'parent-hover'
				}
			} else if ( isChildOfCollapsedBlock || isCollapsedBlock ) {
				// We won't add any classes here anymore.
				currentHoverState = 'collapsed'
			}
		}

		return {
			hoverState: select( 'stackable/hover-state' ).getHoverState(),
			hoverStateClientId: select( 'stackable/hover-state' ).getSelectedBlock(),
		}
	}, [ clientId, clientIds ] )

	return [ currentHoverState, blockHoverClass, hasParentHoverState, hasCollapsedState, isCollapsedBlock ]
}

// This just returns the `blockHoverClass` value from the useBlockHoverState
// hook above. But we separate the logic for better performance.
export const useBlockHoverClass = () => {
	const { clientId } = useBlockEditContext()
	const clientIds = useSelect( select => select( 'core/block-editor' ).getMultiSelectedBlockClientIds() )
	const {
		hoverState,
		parentHoverChildrenClientIds,
	} = useSelect( select => {
		return {
			hoverState: select( 'stackable/hover-state' ).getHoverState(),
			parentHoverChildrenClientIds: select( 'stackable/hover-state' ).getSelectedParentHoverBlockChildren(),
		}
	}, [] )

	const {
		getSelectedBlock,
		getSelectedParentHoverBlock,
		getSelectedParentHoverBlockChildren,
		getSelectedHoverChildren,
	} = useSelect( 'stackable/hover-state' )

	const hoverStateClientId = getSelectedBlock()
	const parentHoverClientId = getSelectedParentHoverBlock()

	// return useMemo( () => {

		const isBlockSelected = clientId === hoverStateClientId || clientIds.includes( clientId )
		const isParentHoverBlock = clientId === parentHoverClientId

		// The hover state only applies to the currently selected block.
		let blockHoverClass = ''
		if ( isBlockSelected ) {
			if ( hoverState === 'hover' || hoverState === 'parent-hover' ) {
				blockHoverClass = 'stk--is-hovered'
			}

		// Also change the hover states of the other
		} else if ( isParentHoverBlock ) {
			if ( hoverState === 'hover' || hoverState === 'parent-hover' ) {
				blockHoverClass = 'stk--is-hovered'
			}

		} else {

			const hoverChildrenClientIds = getSelectedHoverChildren()

			const isChildOfParentHover = parentHoverChildrenClientIds.includes( clientId )
			const isChildOfHoverBlock = hoverChildrenClientIds.includes( clientId )

			if ( isChildOfParentHover || isChildOfHoverBlock ) {
				if ( hoverState === 'hover' || hoverState === 'parent-hover' ) {
					blockHoverClass = 'stk--is-hovered'
				}
			}
		}

		return blockHoverClass
	// }, [ hoverState, clientId, hoverStateClientId, parentHoverClientId ] )
}
