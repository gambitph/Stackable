/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const showOptions = blockProps => {
	const {
		design = 'plain',
		columns = 1,
		showTitle = false,
		showSubtitle = false,
	} = blockProps.attributes

	return applyFilters( 'stackable.text.show', {
		columns: columns && columns > 1,
		reverseTitle: design !== 'plain',
		titleSpacing: showTitle,
		subtitleSpacing: showSubtitle,
	}, blockProps )
}
