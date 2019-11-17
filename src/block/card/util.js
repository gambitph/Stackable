/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const showOptions = blockProps => {
	const {
		design = 'basic',
		showImage = true,
		showTitle = true,
		showSubtitle = true,
		showDescription = true,
		showButton = true,
	} = blockProps.attributes

	return applyFilters( 'stackable.card.show', {
		columnBackground: design !== 'plain',
		borderRadius: true,
		shadow: true,
		imageHeight: ( design === 'basic' || design === 'plain' ) && design !== 'horizontal-card',
		imageWidth: design === 'horizontal',
		imageSpacing: design === 'plain' && showImage,
		titleSpacing: showTitle,
		subtitleSpacing: showSubtitle,
		descriptionSpacing: showDescription,
		buttonSpacing: showButton,
	}, blockProps )
}
