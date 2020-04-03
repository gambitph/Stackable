/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const showOptions = blockProps => {
	const {
		design = 'basic',
		columns = 2,
	} = blockProps.attributes

	return applyFilters( 'stackable.feature-grid.show', {
		reverseColumns: design !== 'grid' && design !== 'plain',
		verticalGap: design !== 'plain' && columns > 2,
	}, blockProps )
}

export const getColumnCountFromDesign = ( columns, design ) => {
	if ( design === 'grid' ) {
		return columns <= 5 ? 2 :
			columns <= 7 ? 3 : 4
	} else if ( design === 'uneven' ) {
		return columns <= 3 ? 2 : 3
	} else if ( design === 'uneven-2' ) {
		return columns <= 3 ? 2 :
			columns === 4 ? 3 : 4
	} else if ( design === 'tiled' ) {
		return columns <= 3 ? 2 :
			columns === 4 ? 3 :
				columns === 5 ? 4 : 5
	}
	return columns
}
