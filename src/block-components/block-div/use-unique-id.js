/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'
import { dispatch, useSelect } from '@wordpress/data'

export const createUniqueClass = uid => `${ uid.substring( 0, 7 ) }`

export const useUniqueId = ( attributes, autoApplyUniqueId = true ) => {
	const { clientId } = useBlockEditContext()
	const { getEditorDom } = useSelect( 'stackable/editor-dom' )

	// Need to do this when the clientId changes (when a block is
	// cloned/duplicated).
	useEffect( () => {
		// If auto apply unique id is disabled, don't generate a new one. But if
		// there already is a unique id, we need to still check if it's unique.
		if ( ! autoApplyUniqueId && ! attributes.uniqueId ) {
			return
		}

		// When there's no unique ID yet, create one.
		const uniqueClass = createUniqueClass( clientId )
		if ( ! attributes.uniqueId ) {
			dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
			// Use dispatch here because if performed in multiple blocks they will all use the same context
			dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, { uniqueId: uniqueClass })

			// If there's one already, check whether the we need to re-create one.
			// Duplicating a block or copy pasting a block may give us duplicate IDs.
		} else if ( uniqueClass !== attributes.uniqueId ) {
			// There should only be one block each with the same unique ID, or
			// else we'll have styling conflicts.
			const blocks = getEditorDom()?.querySelectorAll( `[data-block-id="${ attributes.uniqueId }"]` ) || []
			const els = Array.prototype.filter.call( blocks, el => {
				// Exclude reusable blocks because they can have the same unique ID.
				return ! el.closest( '[data-type="core/block"]' )
			} )

			if ( els.length > 1 ) {
				dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
				// Use dispatch here because if performed in multiple blocks they will all use the same context
				dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, { uniqueId: uniqueClass })
			}
		}
	}, [ clientId ] )
}
