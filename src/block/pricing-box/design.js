/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.pricing-box.design.apply-block-attributes', 'stackable/pricing-box', ( attributes, blockAttributes = null ) => {
	return omit( attributes, [
		'image1Id',
		...( blockAttributes && blockAttributes.image1Id ? [ 'image1Url' ] : [] ),
		'image2Id',
		...( blockAttributes && blockAttributes.image2Id ? [ 'image2Url' ] : [] ),
		'image3Id',
		...( blockAttributes && blockAttributes.image3Id ? [ 'image3Url' ] : [] ),
		'image1Alt',
		'image2Alt',
		'image3Alt',
		'title1',
		'title2',
		'title3',
		'pricePrefix1',
		'pricePrefix2',
		'pricePrefix3',
		'price1',
		'price2',
		'price3',
		'priceSuffix1',
		'priceSuffix2',
		'priceSuffix3',
		'subPrice1',
		'subPrice2',
		'subPrice3',
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
		'description1',
		'description2',
		'description3',
	] )
} )

addFilter( 'stackable.pricing-box.edit.designs', 'stackable/pricing-box', designs => {
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
