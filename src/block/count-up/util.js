/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const showOptions = blockProps => {
	return applyFilters( 'stackable.count-up.show', {
		columnBackground: false,
	}, blockProps )
}
