/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const showOptions = blockProps => {
	const {
		design = 'basic',
		showIcon = false,
		showTitle = true,
		showDescription = true,
		showButton = true,
	} = blockProps.attributes

	return applyFilters( 'stackable.notification.show', {
		columnBorder: false,
		columnBackground: design !== 'plain',
		backgroundColor: design !== 'plain',
		borderRadius: design !== 'plain',
		shadow: design !== 'plain',
		iconSpacing: showIcon,
		titleSpacing: showTitle,
		descriptionSpacing: showDescription,
		buttonSpacing: showButton,
		iconAlign: true,
		iconLocation: false,
	}, blockProps )
}
