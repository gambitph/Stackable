/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const showOptions = blockProps => {
	const {
		design = 'basic',
		numberStyle = '',
		showNumber = true,
		showTitle = true,
		showDescription = true,
	} = blockProps.attributes

	return applyFilters( 'stackable.number-box.show', {
		backgroundColor: design !== 'plain',
		borderRadius: design !== 'plain',
		border: design !== 'plain' && design !== 'faded',
		shadow: design !== 'plain',
		numberColor: true,
		numberBGColor: ( design === 'basic' || design === 'plain' ) && numberStyle !== 'none',
		numberStyle: true,
		columnBackground: design !== 'plain',
		numberSpacing: showNumber && ! [ 'heading', 'heading2', 'background', 'faded' ].includes( design ),
		titleSpacing: showTitle,
		descriptionSpacing: showDescription,
	}, blockProps )
}
