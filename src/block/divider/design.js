/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.divider.design.filtered-block-attributes', 'stackable/divider', attributes => {
	return {
		...attributes,
		design: attributes.design || 'basic',
	}
} )
