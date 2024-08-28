import { setDefaultBlockName, getDefaultBlockName } from '@wordpress/blocks'
import { useEffect } from '@wordpress/element'

export const TextDefaultBlock = () => {
	// Set the default block to stackable/text
	useEffect( () => {
		if ( getDefaultBlockName() === 'stackable/text' ) {
			return null
		}
		setDefaultBlockName( 'stackable/text' )
	}, [] )

	return null
}
