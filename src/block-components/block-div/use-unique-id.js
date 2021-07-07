import { useEffect } from '@wordpress/element'
import { select } from '@wordpress/data'
import { useBlockEditContext } from '@wordpress/block-editor'

export const createUniqueClass = uid => `${ uid.substring( 0, 7 ) }`

export const useUniqueId = () => {
	const { clientId } = useBlockEditContext()

	useEffect( () => {
		const attributes = select( 'core/block-editor' ).getBlockAttributes( clientId )
		if ( ! attributes ) {
			return
		}

		// When there's no unique ID yet, create one.
		if ( ! attributes.uniqueId ) {
			attributes.uniqueId = createUniqueClass( clientId )
			// If there's one already, check whether the we need to re-create one.
			// Duplicating a block or copy pasting a block may give us duplicate IDs.
		} else if ( createUniqueClass( clientId ) !== attributes.uniqueId ) {
			if ( document.querySelectorAll( `[data-block-id="${ attributes.uniqueId }"]` ).length > 1 ) {
				attributes.uniqueId = createUniqueClass( clientId )
			}
		}
	}, [ clientId ] )
}
