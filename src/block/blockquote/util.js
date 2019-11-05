/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const showOptions = blockProps => {
	const {
		design = 'basic',
	} = blockProps.attributes

	return applyFilters( 'stackable.blockquote.show', {
		containerBackground: design === 'basic',
		borderRadius: design === 'basic',
		shadow: design === 'basic',
	}, blockProps )
}
