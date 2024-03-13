/**
 * Internal dependencies
 */
import './store'

/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element'
import { dispatch, useSelect } from '@wordpress/data'

export const ClientTree = () => {
	const allClientIds = useSelect( select => {
		return select( 'core/block-editor' ).getClientIdsWithDescendants()
	} )
	useEffect( () => {
		dispatch( 'stackable/block-editor' ).updateClientTree()
	}, [ allClientIds ] )

	// Don't render anything.
	return null
}
