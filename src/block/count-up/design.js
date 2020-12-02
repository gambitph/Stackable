/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Remove text from block designs being applied.
addFilter( 'stackable.count-up.design.no-text-attributes', 'stackable/count-up', attributes => {
	return omit( attributes, [
		'title1',
		'title2',
		'title3',
		'title4',
		'countText1',
		'countText2',
		'countText3',
		'countText4',
		'description1',
		'description2',
		'description3',
		'description4',
	] )
} )

addFilter( 'stackable.count-up.design.filtered-block-attributes', 'stackable/count-up', attributes => {
	return {
		...attributes,
		design: attributes.design || 'plain',
	}
} )
