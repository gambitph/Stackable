/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const showOptions = blockProps => {
	const {
		design = 'basic',
		showImage = true,
		showTitle = true,
		showDescription = true,
		showButton = true,
	} = blockProps.attributes

	return applyFilters( 'stackable.feature-grid.show', {
		columnBackground: design !== 'plain',
		columnBackground1: design !== 'plain',
		columnBackground2: design !== 'plain',
		columnBackground3: design !== 'plain',
		columnBackground4: design !== 'plain',
		imageSpacing: showImage && design !== 'horizontal',
		titleSpacing: showTitle,
		descriptionSpacing: showDescription,
		buttonSpacing: showButton,
	}, blockProps )
}
