/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.columns.design.filtered-block-attributes', 'stackable/columns', attributes => {
	return {
		...attributes,
		design: attributes.design || 'plain',
	}
} )
