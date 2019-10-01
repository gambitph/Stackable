/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const showOptions = blockProps => {
	const {
		design = 'basic',
		showImage = true,
		showTitle = true,
		showPrice = true,
		showSubPrice = true,
		showButton = true,
		showDescription = true,
	} = blockProps.attributes

	// const showButton = showButton1 || showButton2 || showButton3 || showButton4
	return applyFilters( 'stackable.feature-grid.show', {
		columnBackground: design !== 'plain',
		borderRadius: design !== 'plain',
		shadow: design !== 'plain',
		imageSpacing: showImage && ( showTitle || showPrice || showSubPrice || showButton || showDescription ),
		titleSpacing: showTitle && ( showPrice || showSubPrice || showButton || showDescription ),
		priceSpacing: showPrice && ( showSubPrice || showButton || showDescription ),
		subPriceSpacing: showSubPrice && ( showButton || showDescription ),
		buttonSpacing: showButton && showDescription,
	}, blockProps )
}
