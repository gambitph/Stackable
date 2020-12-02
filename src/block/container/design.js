/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.container.design.filtered-block-attributes', 'stackable/container', attributes => {
	return {
		...attributes,
		design: attributes.design || 'basic',
	}
} )
