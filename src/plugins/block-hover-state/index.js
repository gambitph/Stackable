import { dispatch, useSelect } from '@wordpress/data'
import { useEffect } from '@wordpress/element'

/**
 * Listens to any block selection changes. This is done as a plugin (and not
 * implemented as a hook on a block level) so that we only have one listener
 * active. Doing this prevents errors when our blocks are used inside Query Loop
 * blocks.
 *
 * Used mainly by the useBlockHoverState hook.
 *
 * @return {Object} Null, nothing is rendered
 */
export const BlockHoverState = () => {
	const {
		getEditorDom,
		selectedClientId,
		selectedParentClientId,
		selectedParentHoverBlock,
		hoverStateClientId,
	} = useSelect( select => {
		const selectedClientId = select( 'core/block-editor' ).getSelectedBlockClientId() || select( 'core/block-editor' ).getFirstMultiSelectedBlockClientId()

		const parentClientId = select( 'core/block-editor' ).getBlockRootClientId( selectedClientId )
		// Extract only the parent block's clientId instead of the entire block object
		// This prevents unnecessary re-renders when the block object reference changes
		const parentBlock = select( 'core/block-editor' ).getBlock( parentClientId )
		const selectedParentClientId = parentBlock?.clientId || null

		return {
			getEditorDom: select( 'stackable/editor-dom' ).getEditorDom,
			selectedClientId,
			selectedParentClientId,
			selectedParentHoverBlock: select( 'stackable/hover-state' ).getSelectedParentHoverBlock(),
			hoverStateClientId: select( 'stackable/hover-state' ).getSelectedBlock(),
		}
	} )

	// Update the selected id in the store if the selected block changes.
	useEffect( () => {
		// Compare clientIds instead of object references for better performance
		if ( hoverStateClientId !== selectedClientId || selectedParentHoverBlock !== selectedParentClientId ) {
			if ( selectedClientId ) {
				dispatch( 'stackable/hover-state' ).updateSelectedBlock( selectedClientId, getEditorDom() )
			} else {
				// If there's no selected block, clear the hover states.
				dispatch( 'stackable/hover-state' ).clearSelectedBlock()
			}
		}
	}, [ getEditorDom, selectedParentClientId, selectedClientId, hoverStateClientId, selectedParentHoverBlock ] )

	// Don't render anything.
	return null
}
