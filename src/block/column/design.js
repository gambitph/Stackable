/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.column.design.filtered-block-attributes', 'stackable/column', attributes => {
	return {
		...attributes,
		design: attributes.design || 'plain',
	}
} )
