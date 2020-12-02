/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Remove text from block designs being applied.
addFilter( 'stackable.feature-grid.design.no-text-attributes', 'stackable/feature-grid', attributes => {
	return omit( attributes, [
		'title1',
		'title2',
		'title3',
		'title4',
		'description1',
		'description2',
		'description3',
		'description4',
		'button1Text',
		'button2Text',
		'button3Text',
		'button4Text',
	] )
} )

// Ignore these attributes when exporting / applying designs.
addFilter( 'stackable.feature-grid.design.filtered-block-attributes', 'stackable/feature-grid', ( attributes, blockAttributes = null ) => {
	return {
		...omit( attributes, [
			'image1Id',
			...( blockAttributes && blockAttributes.image1Id ? [ 'image1Url' ] : [] ),
			'image2Id',
			...( blockAttributes && blockAttributes.image2Id ? [ 'image2Url' ] : [] ),
			'image3Id',
			...( blockAttributes && blockAttributes.image3Id ? [ 'image3Url' ] : [] ),
			'image4Id',
			...( blockAttributes && blockAttributes.image4Id ? [ 'image4Url' ] : [] ),
			'button1Url',
			'button1NewTab',
			'button1NoFollow',
			'button2Url',
			'button2NewTab',
			'button2NoFollow',
			'button3Url',
			'button3NewTab',
			'button3NoFollow',
			'button4Url',
			'button4NewTab',
			'button4NoFollow',
		] ),
		design: attributes.design || 'basic',
	}
} )
