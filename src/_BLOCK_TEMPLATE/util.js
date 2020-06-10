// TODO: Search and replace BLOCKSLUG with slug of block e.g. "heading"
/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const showOptions = blockProps => {
	const {
		design = 'basic',
		showTitle = true,
		showDescription = true,
		showButton = true,
	} = blockProps.attributes

	return applyFilters( 'stackable.BLOCKSLUG.show', {
		columnBackground: design !== 'plain',
		titleSpacing: showTitle,
		descriptionSpacing: showDescription,
		buttonSpacing: showButton,
	}, blockProps )
}
