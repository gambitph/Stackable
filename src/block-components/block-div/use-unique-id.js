import { useEffect } from '@wordpress/element'
import { select } from '@wordpress/data'
import { useBlockEditContext } from '@wordpress/block-editor'

export const createUniqueClass = uid => `${ uid.substring( 0, 7 ) }`

export const useUniqueId = ( autoApplyUniqueId = true, attrName = 'uniqueId' ) => {
	const { clientId } = useBlockEditContext()

	useEffect( () => {
		const attributes = select( 'core/block-editor' ).getBlockAttributes( clientId )
		if ( ! attributes ) {
			return
		}

		// If auto apply unique id is disabled, don't generate a new one. But if
		// there already is a unique id, we need to still check if it's unique.
		if ( ! autoApplyUniqueId && ! attributes[ attrName ] ) {
			return
		}

		// When there's no unique ID yet, create one.
		if ( ! attributes[ attrName ] ) {
			attributes[ attrName ] = `stk-${ createUniqueClass( clientId ) }`
			// If there's one already, check whether the we need to re-create one.
			// Duplicating a block or copy pasting a block may give us duplicate IDs.
		} else if ( `stk-${ createUniqueClass( clientId ) }` !== attributes[ attrName ] ) {
			if ( document.querySelectorAll( `[data-block-id="${ attributes[ attrName ].replace( 'stk-', '' ) }"]` ).length > 1 ) {
				attributes[ attrName ] = `stk-${ createUniqueClass( clientId ) }`
			}
		}
	}, [ clientId ] )
}
