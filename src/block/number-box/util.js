/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const showOptions = blockProps => {
	const {
		design = 'basic',
		numberStyle = '',
	} = blockProps.attributes

	return applyFilters( 'stackable.number-box.show', {
		spacingNumber: true,
		backgroundColor: design !== 'plain',
		borderRadius: design !== 'plain',
		shadow: design !== 'plain',
		numberColor: true,
		numberBGColor: ( design === 'basic' || design === 'plain' ) && numberStyle !== 'none',
		numberStyle: true,
		columnBackground: design !== 'plain',
	}, blockProps )
}
