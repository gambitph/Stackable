import { useSelect } from '@wordpress/data'

export const useBlockAttributes = clientId => {
	return useSelect(
		select => {
			return select( 'core/block-editor' ).getBlockAttributes( clientId )
		},
		[ clientId ]
	)
}
