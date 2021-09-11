import { dispatch, useSelect } from '@wordpress/data'
import { useEffect } from '@wordpress/element'

/**
 * Listens to any block selection changes. Used mainly by the useBlockHoverState
 * hook.
 *
 * @return {Object} Null, nothing is rendered
 */
export const BlockHoverState = () => {
	const {
		selectedClientId,
		hoverStateClientId,
	} = useSelect( select => {
		return {
			selectedClientId: select( 'core/block-editor' ).getSelectedBlockClientId(),
			hoverStateClientId: select( 'stackable/hover-state' ).getSelectedBlock(),
		}
	}, [] )

	// Update the selected id in the store if the selected block changes.
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

	// Don't render anything.
	return null
}
