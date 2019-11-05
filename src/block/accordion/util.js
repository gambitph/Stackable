/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const showOptions = blockProps => {
	const {
		design = 'basic',
		showTitle = true,
	} = blockProps.attributes

	return applyFilters( 'stackable.accordion.show', {
		headerBackground: design === 'basic',
		containerBackground: design === 'colored' || design === 'line-colored',
		borderRadius: design !== 'plain',
		shadow: design !== 'plain',
		border: design === 'line-colored' || design === 'plain',
		titleSpacing: showTitle,
	}, blockProps )
}
