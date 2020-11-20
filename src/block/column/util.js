/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const showOptions = blockProps => {
	const {
		design = 'basic',
		align = '',
		showBlockBackground = false,
	} = blockProps.attributes

	return applyFilters( 'stackable.column.show', {
		columnBackground: design !== 'plain',
		borderRadius: design !== 'plain' && ! ( ! showBlockBackground && align === 'full' ),
		border: design !== 'plain' && ! ( ! showBlockBackground && align === 'full' ),
	}, blockProps )
}
