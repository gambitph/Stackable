/**
 * The Client Tree is an internal list of all client IDs and their descendants.
 * This is used to populate the block context and to help identify the different
 * properties of each block: parent, sibling, index, previous/next block, etc.
 *
 * This is important for Stackable because we need to know where the block is to
 * be able to show/hide some controls and to be able to enable/disable block
 * functionality. For example, the link panel of an Image Block cannot be shown
 * if it's used inside an Image Box block.
 */

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
		dispatch( 'stackable/block-context' )?.updateClientTree()
	}, [ allClientIds ] )

	// Don't render anything.
	return null
}
