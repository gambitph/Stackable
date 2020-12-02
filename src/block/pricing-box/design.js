/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Remove text from block designs being applied.
addFilter( 'stackable.pricing-box.design.no-text-attributes', 'stackable/pricing-box', attributes => {
	return omit( attributes, [
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
		'button2Text',
		'button3Text',
		'description1',
		'description2',
		'description3',
	] )
} )

// Ignore these attributes when exporting / applying designs.
addFilter( 'stackable.pricing-box.design.filtered-block-attributes', 'stackable/pricing-box', ( attributes, blockAttributes = null ) => {
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
			'button1Url',
			'button1NewTab',
			'button1NoFollow',
			'button2Url',
			'button2NewTab',
			'button2NoFollow',
			'button3Url',
			'button3NewTab',
			'button3NoFollow',
		] ),
		design: attributes.design || 'basic',
	}
} )
