/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Remove text from block designs being applied.
addFilter( 'stackable.card.design.no-text-attributes', 'stackable/card', attributes => {
	return omit( attributes, [
		'title1',
		'title2',
		'title3',
		'subtitle1',
		'subtitle2',
		'subtitle3',
		'description1',
		'description2',
		'description3',
		'button1Text',
		'button2Text',
		'button3Text',
	] )
} )

// Ignore these attributes when exporting / applying designs.
addFilter( 'stackable.card.design.filtered-block-attributes', 'stackable/card', ( attributes, blockAttributes = null ) => {
	return omit( attributes, [
		...( blockAttributes && blockAttributes.image1Id ? [ 'image1Url' ] : [] ),
		'image1Id',
		...( blockAttributes && blockAttributes.image2Id ? [ 'image2Url' ] : [] ),
		'image2Id',
		...( blockAttributes && blockAttributes.image3Id ? [ 'image3Url' ] : [] ),
		'image3Id',
		'button1Url',
		'button1NewTab',
		'button1NoFollow',
		'button2Url',
		'button2NewTab',
		'button2NoFollow',
		'button3Url',
		'button3NewTab',
		'button3NoFollow',
	] )
} )
