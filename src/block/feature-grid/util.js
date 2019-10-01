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
		showButton1 = true,
		showButton2 = true,
		showButton3 = true,
		showButton4 = true,
	} = blockProps.attributes

	const showButton = showButton1 || showButton2 || showButton3 || showButton4
	return applyFilters( 'stackable.feature-grid.show', {
		columnBackground: design !== 'plain',
		imageSpacing: showImage && ( showTitle || showDescription || showButton ) && design !== 'horizontal',
		titleSpacing: showTitle && ( showDescription || showButton ),
		descriptionSpacing: showDescription && showButton,
	}, blockProps )
}
