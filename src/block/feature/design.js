/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Remove text from block designs being applied.
addFilter( 'stackable.feature.design.no-text-attributes', 'stackable/feature', attributes => {
	return omit( attributes, [
		'title',
		'description',
		'buttonText',
	] )
} )

// Ignore these attributes when exporting / applying designs.
addFilter( 'stackable.feature.design.filtered-block-attributes', 'stackable/feature', ( attributes, blockAttributes = null ) => {
	return omit( attributes, [
		'imageId',
		...( blockAttributes && blockAttributes.imageId ? [ 'imageUrl' ] : [] ),
		'imageAlt',
		'buttonUrl',
		'buttonNewTab',
		'buttonNoFollow',
	] )
} )
