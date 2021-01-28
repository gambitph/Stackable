import { useEffect } from '@wordpress/element'

export const createUniqueClass = uid => `${ uid.substring( 0, 7 ) }`

const useUniqueId = props => {
	useEffect( () => {
		// When there's no unique ID yet, create one.
		if ( ! props.attributes.uniqueId ) {
			props.attributes.uniqueId = createUniqueClass( props.clientId )
		// If there's one already, check whether the we need to re-create one.
		// Duplicating a block or copy pasting a block may give us duplicate IDs.
		} else if ( createUniqueClass( props.clientId ) !== props.attributes.uniqueId ) {
			if ( document.querySelectorAll( `[data-id="${ props.attributes.uniqueId }"]` ).length > 1 ) {
				props.attributes.uniqueId = createUniqueClass( props.clientId )
			}
		}
	}, [] )
}

export default useUniqueId
