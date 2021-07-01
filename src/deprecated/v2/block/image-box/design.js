/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Remove text from block designs being applied.
addFilter( 'stackable.image-box.design.no-text-attributes', 'stackable/image-box', attributes => {
	return omit( attributes, [
		'subtitle1',
		'subtitle2',
		'subtitle3',
		'subtitle4',
		'title1',
		'title2',
		'title3',
		'title4',
		'description1',
		'description2',
		'description3',
		'description4',
	] )
} )

// Ignore these attributes when exporting / applying designs.
addFilter( 'stackable.image-box.design.filtered-block-attributes', 'stackable/image-box', ( attributes, blockAttributes = null ) => {
	return {
		...omit( attributes, [
			'link1Url',
			'link2Url',
			'link3Url',
			'link4Url',
			'link1NewTab',
			'link2NewTab',
			'link3NewTab',
			'link4NewTab',
			'link1NoFollow',
			'link2NoFollow',
			'link3NoFollow',
			'link4NoFollow',
			'image1Alt',
			'image2Alt',
			'image3Alt',
			'image4Alt',
			'image1Id',
			...( blockAttributes && blockAttributes.image1Id ? [ 'image1Url' ] : [] ),
			'image2Id',
			...( blockAttributes && blockAttributes.image2Id ? [ 'image2Url' ] : [] ),
			'image3Id',
			...( blockAttributes && blockAttributes.image3Id ? [ 'image3Url' ] : [] ),
			'image4Id',
			...( blockAttributes && blockAttributes.image4Id ? [ 'image4Url' ] : [] ),
		] ),
	}
} )
