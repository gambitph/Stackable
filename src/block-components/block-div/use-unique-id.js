import { useEffect } from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'
import { useSelect } from '@wordpress/data'

export const createUniqueClass = uid => `${ uid.substring( 0, 7 ) }`

export const useUniqueId = () => {
	const { clientId } = useBlockEditContext()

	const { attributes } = useSelect(
		select => {
			const { getBlockAttributes } = select( 'core/block-editor' )
			return {
				attributes: getBlockAttributes( clientId ),
			}
		},
		[ clientId ]
	)

	useEffect( () => {
		// When there's no unique ID yet, create one.
		if ( ! attributes.uniqueId ) {
			attributes.uniqueId = createUniqueClass( clientId )
		// If there's one already, check whether the we need to re-create one.
		// Duplicating a block or copy pasting a block may give us duplicate IDs.
		} else if ( createUniqueClass( clientId ) !== attributes.uniqueId ) {
			if ( document.querySelectorAll( `[data-id="${ attributes.uniqueId }"]` ).length > 1 ) {
				attributes.uniqueId = createUniqueClass( clientId )
			}
		}
	}, [ clientId ] )
}
