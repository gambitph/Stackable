/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.card.design.apply-block-attributes', 'stackable/card', ( attributes, blockAttributes = null ) => {
	return omit( attributes, [
		...( blockAttributes && blockAttributes.image1Id ? [ 'image1Url' ] : [] ),
		'image1Id',
		...( blockAttributes && blockAttributes.image2Id ? [ 'image2Url' ] : [] ),
		'image2Id',
		...( blockAttributes && blockAttributes.image3Id ? [ 'image3Url' ] : [] ),
		'image3Id',
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
	] )
} )

addFilter( 'stackable.card.edit.designs', 'stackable/card', designs => {
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
