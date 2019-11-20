/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.feature-grid.design.apply-block-attributes', 'stackable/feature-grid', ( attributes, blockAttributes = null ) => {
	return omit( attributes, [
		'image1Id',
		...( blockAttributes && blockAttributes.image1Id ? [ 'image1Url' ] : [] ),
		'image2Id',
		...( blockAttributes && blockAttributes.image2Id ? [ 'image2Url' ] : [] ),
		'image3Id',
		...( blockAttributes && blockAttributes.image3Id ? [ 'image3Url' ] : [] ),
		'image4Id',
		...( blockAttributes && blockAttributes.image4Id ? [ 'image4Url' ] : [] ),
		'title1',
		'title2',
		'title3',
		'title4',
		'description1',
		'description2',
		'description3',
		'description4',
		'button1Text',
		'button1Url',
		'button1NewTab',
		'button1NoFollow',
		'button2Text',
		'button2Url',
		'button2NewTab',
		'button2NoFollow',
		'button3Text',
		'button3Url',
		'button3NewTab',
		'button3NoFollow',
		'button4Text',
		'button4Url',
		'button4NewTab',
		'button4NoFollow',
	] )
} )

addFilter( 'stackable.feature-grid.edit.designs', 'stackable/feature-grid', designs => {
	return {
		...designs,
		// TODO: sample, remove this
		// corporate: {
		// 	label: __( 'Corporate', i18n ),
		// 	attributes: {
		// 		borderRadius: 50,
		// 		containerBackgroundColor: '#fcb900',
		// 	},
		// },
	}
} )
