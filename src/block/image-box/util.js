/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const showOptions = blockProps => {
	const {
		design = 'basic',
		showSubtitle = true,
		showTitle = true,
		showDescription = true,
		showArrow = false,
	} = blockProps.attributes

	return applyFilters( 'stackable.image-box.show', {
		columnBackground: true,
		borderRadius: true,
		shadow: true,
		line: design === 'box' || design === 'line',
		subtitleSpacing: showSubtitle,
		titleSpacing: showTitle,
		lineSpacing: design === 'line',
		descriptionSpacing: showDescription,
		arrowSpacing: showArrow,
	}, blockProps )
}
