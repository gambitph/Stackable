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
	return applyFilters( 'stackable.pricing-box.show', {
		columnBackground: design !== 'plain',
		borderRadius: design !== 'plain',
		shadow: design !== 'plain',
		imageSettings: design !== 'sectioned',
		imageSpacing: showImage,
		titleSpacing: showTitle,
		priceSpacing: showPrice,
		subPriceSpacing: showSubPrice,
		buttonSpacing: showButton,
		descriptionSpacing: showDescription,
	}, blockProps )
}
