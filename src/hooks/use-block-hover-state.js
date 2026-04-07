import { useBlockEditContext } from '@wordpress/block-editor'
import { register, createReduxStore, useSelect, createRegistrySelector } from '@wordpress/data'

// Include all the stored state.
const DEFAULT_STATE = {
	selectedBlock: null,
	hoverState: 'normal',
	hasParentHoverState: false,
	selectedParentHoverBlock: null,
	selectedParentHoverChildren: [],
	selectedHoverChildren: [],

	// O(1) membership for hover-class derivation (mirrors the arrays above).
	parentHoverChildrenIdSet: new Set(),
	hoverChildrenIdSet: new Set(),
	collapsedChildrenIdSet: new Set(),

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

/**
 * @param {typeof DEFAULT_STATE} state
 * @param {string} clientId
 * @param {string[]} multiSelectedClientIds
 * @returns {string}
 */
function computeBlockHoverClass( state, clientId, multiSelectedClientIds ) {
	const hoverStateMode = state.hoverState
	const hoverStateClientId = state.selectedBlock
	const parentHoverClientId = state.selectedParentHoverBlock
	const parentHoverSet = state.parentHoverChildrenIdSet
	const hoverChildrenSet = state.hoverChildrenIdSet

	const isHoverActive = hoverStateMode === 'hover' || hoverStateMode === 'parent-hover'

	const isBlockSelected = clientId === hoverStateClientId || multiSelectedClientIds.includes( clientId )
	if ( isBlockSelected ) {
		return isHoverActive ? 'stk--is-hovered' : ''
	}
	if ( clientId === parentHoverClientId ) {
		return isHoverActive ? 'stk--is-hovered' : ''
	}
	if ( parentHoverSet.has( clientId ) || hoverChildrenSet.has( clientId ) ) {
		return isHoverActive ? 'stk--is-hovered' : ''
	}
	return ''
}

/**
 * @param {typeof DEFAULT_STATE} state
 * @param {string} clientId
 * @param {string[]} multiSelectedClientIds
 * @param {boolean} forceUpdateHoverState
 */
function computeBlockHoverEditState( state, clientId, multiSelectedClientIds, forceUpdateHoverState ) {
	const hoverState = state.hoverState
	const hoverStateClientId = state.selectedBlock
	const parentHoverClientId = state.selectedParentHoverBlock
	const hasParentHoverState = state.hasParentHoverState
	const collapsedClientId = state.selectedCollapsedBlock
	const parentHoverSet = state.parentHoverChildrenIdSet
	const hoverChildrenSet = state.hoverChildrenIdSet
	const collapsedChildrenSet = state.collapsedChildrenIdSet

	const isHoverActive = hoverState === 'hover' || hoverState === 'parent-hover'

	const blockHoverClass = computeBlockHoverClass( state, clientId, multiSelectedClientIds )

	const isBlockSelected = clientId === hoverStateClientId || multiSelectedClientIds.includes( clientId )
	const isParentHoverBlock = clientId === parentHoverClientId
	const isCollapsedBlock = clientId === collapsedClientId

	let currentHoverState = 'normal'
	if ( isBlockSelected ) {
		currentHoverState = hoverState
		if ( ! hasParentHoverState && hoverState === 'parent-hover' ) {
			currentHoverState = 'hover'
		}
	} else if ( isParentHoverBlock ) {
		if ( isHoverActive ) {
			currentHoverState = 'hover'
		}
	} else {
		const isChildOfParentHover = parentHoverSet.has( clientId )
		const isChildOfHoverBlock = hoverChildrenSet.has( clientId )
		const isChildOfCollapsedBlock = collapsedChildrenSet.has( clientId )

		if ( isChildOfParentHover || isChildOfHoverBlock ) {
			if ( isHoverActive ) {
				currentHoverState = 'parent-hover'
			}
		} else if ( isChildOfCollapsedBlock || isCollapsedBlock ) {
			currentHoverState = 'collapsed'
		}
	}

	if ( forceUpdateHoverState ) {
		currentHoverState = hoverState
	}

	return {
		currentHoverState,
		blockHoverClass,
		hasParentHoverState: state.hasParentHoverState,
		hasCollapsedState: state.hasCollapsedState,
		isCollapsedBlock,
	}
}

const getBlockHoverClass = createRegistrySelector( select => ( state, clientId ) => {
	const multiIds = select( 'core/block-editor' ).getMultiSelectedBlockClientIds()
	return computeBlockHoverClass( state, clientId, multiIds )
} )

const getBlockHoverEditState = createRegistrySelector( select => ( state, clientId, forceUpdateHoverState ) => {
	const multiIds = select( 'core/block-editor' ).getMultiSelectedBlockClientIds()
	return computeBlockHoverEditState( state, clientId, multiIds, forceUpdateHoverState )
} )

const shouldShowHoverClass = createRegistrySelector( select => ( state, clientId ) => {
	const multiIds = select( 'core/block-editor' ).getMultiSelectedBlockClientIds()
	return computeBlockHoverClass( state, clientId, multiIds ) !== ''
} )

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
	getBlockHoverClass,
	getBlockHoverEditState,
	shouldShowHoverClass,
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
				parentHoverChildrenIdSet: new Set( action.parentHoverChildrenClientIds || [] ),
				hoverChildrenIdSet: new Set( action.hoverChildrenClientIds || [] ),

				// Accordion collapsed state.
				hasCollapsedState: action.hasCollapsedState,
				selectedCollapsedBlock: action.collapsedClientId,
				selectedCollapsedChildren: action.collapsedChildrenClientIds,
				collapsedChildrenIdSet: new Set( action.collapsedChildrenClientIds || [] ),
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

export const useBlockHoverState = ( { forceUpdateHoverState = false } = {} ) => {
	const { clientId } = useBlockEditContext()

	return useSelect( select => {
		const {
			currentHoverState,
			blockHoverClass,
			hasParentHoverState,
			hasCollapsedState,
			isCollapsedBlock,
		} = select( 'stackable/hover-state' ).getBlockHoverEditState( clientId, forceUpdateHoverState )

		return [ currentHoverState, blockHoverClass, hasParentHoverState, hasCollapsedState, isCollapsedBlock ]
	}, [ clientId, forceUpdateHoverState ] )
}

// Single useSelect: derivation runs in the store selector (registry + hover slice + Sets).
export const useBlockHoverClass = () => {
	const { clientId } = useBlockEditContext()
	return useSelect(
		select => select( 'stackable/hover-state' ).getBlockHoverClass( clientId ),
		[ clientId ]
	)
}
