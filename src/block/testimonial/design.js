/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Remove text from block designs being applied.
addFilter( 'stackable.testimonial.design.no-text-attributes', 'stackable/testimonial', attributes => {
	return omit( attributes, [
		'testimonial1',
		'testimonial2',
		'testimonial3',
		'name1',
		'name2',
		'name3',
		'position1',
		'position2',
		'position3',
	] )
} )

// Ignore these attributes when exporting / applying designs.
addFilter( 'stackable.testimonial.design.filtered-block-attributes', 'stackable/testimonial', ( attributes, blockAttributes = null ) => {
	return {
		...omit( attributes, [
			'image1Id',
			...( blockAttributes && blockAttributes.image1Id ? [ 'image1Url' ] : [] ),
			'image2Id',
			...( blockAttributes && blockAttributes.image2Id ? [ 'image2Url' ] : [] ),
			'image3Id',
			...( blockAttributes && blockAttributes.image3Id ? [ 'image3Url' ] : [] ),
			'image1Alt',
			'image2Alt',
			'image3Alt',
		] ),
		design: attributes.design || 'basic',
	}
} )
