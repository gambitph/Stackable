/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const showOptions = blockProps => {
	const {
		design = 'basic',
		showBlockBackground = false,
		blockInnerWidth = '',
		align = '',
		showTitle = true,
		showDescription = true,
		showButton = true,
	} = blockProps.attributes

	// Border radius options aren't available in non-plain & full width.
	let borderRadius = true
	if ( design === 'plain' ) {
		borderRadius = false
	} else if ( align === 'full' ) {
		if ( ! showBlockBackground ) {
			borderRadius = false
		} else if ( blockInnerWidth === 'full' ) {
			borderRadius = false
		}
	}

	return applyFilters( 'stackable.cta.show', {
		columnBackground: design !== 'plain',
		borderRadius,
		titleSpacing: showTitle,
		descriptionSpacing: showDescription,
		buttonSpacing: showButton,
	}, blockProps )
}
