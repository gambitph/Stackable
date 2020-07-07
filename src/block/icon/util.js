/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const showOptions = blockProps => {
	const {
		showTitle = true,
	} = blockProps.attributes

	return applyFilters( 'stackable.icon.show', {
		titleSpacing: showTitle,
	}, blockProps )
}
