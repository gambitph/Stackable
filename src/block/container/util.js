/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const showOptions = blockProps => {
	const {
		design = 'basic',
		align = '',
		showBlockBackground = false,
		blockInnerWidth = '',
	} = blockProps.attributes

	return applyFilters( 'stackable.container.show', {
		restrictContent: ( ! showBlockBackground && align === 'full' ) || ( showBlockBackground && blockInnerWidth === 'full' ),
		columnBackground: design !== 'plain',
		borderRadius: design !== 'plain' && ! ( ! showBlockBackground && align === 'full' ),
		image: design !== 'basic' && design !== 'plain',
	}, blockProps )
}
