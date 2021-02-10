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

// Ignore these attributes when exporting / applying designs.
addFilter( 'stackable.card.design.filtered-block-attributes', 'stackable/card', attributes => {
	return {
		...omit( attributes, [
			'icon1',
			'icon2',
			'icon3',
			'icon4',
		] ),
	}
} )
