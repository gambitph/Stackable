/**
 * External dependencies
 */
import {
	createAllCombinationAttributes,
	createBackgroundAttributes,
	createButtonAttributes,
	createImageAttributes,
	createTypographyAttributes,
	descriptionPlaceholder,
	createBorderAttributes,
} from '~stackable/util'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export default {
	design: {
		type: 'string',
		default: 'basic',
	},
	columns: {
		type: 'number',
		default: 2,
	},
	borderRadius: {
		type: 'number',
		default: '',
	},
	shadow: {
		type: 'number',
		default: '',
	},

	// Column.
	...createBackgroundAttributes( 'column%s' ),

	// Border.
	...createBorderAttributes( 'column%s' ),

	// Image.
	showImage: {
		type: 'boolean',
		default: true,
	},
	...createImageAttributes( 'image%s', {
		exclude: [
			'Url',
			'Id',
			'Alt',
			'BlendMode',
		],
	} ),
	...createAllCombinationAttributes(
		'image%sId', {
			type: 'number',
			default: '',
		},
		[ '1', '2', '3' ]
	),
	...createAllCombinationAttributes(
		'image%sUrl', {
			type: 'string',
			default: '',
			// Some layouts can have the image as an image background. Need this to be a normal attribute and not from `src`.
			// source: 'attribute',
			// selector: '.ugb-pricing-box__item%d .ugb-pricing-box__image img',
			// attribute: 'src',
		},
		[ '1', '2', '3' ]
	),
	...createAllCombinationAttributes(
		'image%sAlt', {
			type: 'string',
			default: '',
			source: 'attribute',
			selector: '.ugb-pricing-box__item%d .ugb-pricing-box__image img',
			attribute: 'alt',
		},
		[ '1', '2', '3' ]
	),
	...createAllCombinationAttributes(
		'image%sShape', {
			type: 'string',
			default: '',
		},
		[ '1', '2', '3' ]
	),
	...createAllCombinationAttributes(
		'image%s%s', {
			type: 'boolean',
			default: false,
		},
		[ '1', '2', '3' ],
		[ 'ShapeFlipX', 'ShapeFlipY', 'ShapeStretch' ]
	),
	// Used by sectioned layout.
	...createAllCombinationAttributes(
		'image%sHeight', {
			type: 'number',
			default: '',
		},
		[ '', 'Tablet', 'Mobile' ]
	),

	// Title.
	showTitle: {
		type: 'boolean',
		default: true,
	},
	...createAllCombinationAttributes(
		'title%s', {
			type: 'string',
			source: 'html',
			selector: '.ugb-pricing-box__item%d .ugb-pricing-box__title',
			default: __( 'Title', i18n ),
		},
		[ '1', '2', '3' ]
	),
	titleTag: {
		type: 'string',
		default: '',
	},
	...createTypographyAttributes( 'title%s' ),
	titleColor: {
		type: 'string',
		default: '',
	},

	// Price.
	showPrice: {
		type: 'boolean',
		default: true,
	},
	showPricePrefix: {
		type: 'boolean',
		default: true,
	},
	showPriceSuffix: {
		type: 'boolean',
		default: true,
	},
	...createAllCombinationAttributes(
		'pricePrefix%s', {
			type: 'string',
			source: 'html',
			selector: '.ugb-pricing-box__item%d .ugb-pricing-box__price-prefix',
			default: '$',
		},
		[ '1', '2', '3' ]
	),
	...createTypographyAttributes( 'pricePrefix%s' ),
	pricePrefixColor: {
		type: 'string',
		default: '',
	},
	...createAllCombinationAttributes(
		'price%s', {
			type: 'string',
			source: 'html',
			selector: '.ugb-pricing-box__item%d .ugb-pricing-box__price',
			default: '9',
		},
		[ '1', '2', '3' ]
	),
	...createTypographyAttributes( 'price%s' ),
	priceColor: {
		type: 'string',
		default: '',
	},
	...createAllCombinationAttributes(
		'priceSuffix%s', {
			type: 'string',
			source: 'html',
			selector: '.ugb-pricing-box__item%d .ugb-pricing-box__price-suffix',
			default: '.00',
		},
		[ '1', '2', '3' ]
	),
	...createTypographyAttributes( 'priceSuffix%s' ),
	priceSuffixColor: {
		type: 'string',
		default: '',
	},

	// Sub Price.
	showSubPrice: {
		type: 'boolean',
		default: true,
	},
	...createAllCombinationAttributes(
		'subPrice%s', {
			type: 'string',
			source: 'html',
			selector: '.ugb-pricing-box__item%d .ugb-pricing-box__subprice',
			default: __( 'Sub Price', i18n ),
		},
		[ '1', '2', '3' ]
	),
	...createTypographyAttributes( 'subPrice%s' ),
	subPriceColor: {
		type: 'string',
		default: '',
	},

	// Button.
	showButton: {
		type: 'boolean',
		default: true,
	},
	...createButtonAttributes( 'button%s', {
		exclude: [
			'Text',
			'Url',
			'NewTab',
			'NoFollow',
			'Sponsored',
			'Ugc',
		],
	} ),
	...createButtonAttributes( 'button1%s', {
		selector: '.ugb-pricing-box__item1 .ugb-button',
	} ),
	...createButtonAttributes( 'button2%s', {
		selector: '.ugb-pricing-box__item2 .ugb-button',
	} ),
	...createButtonAttributes( 'button3%s', {
		selector: '.ugb-pricing-box__item3 .ugb-button',
	} ),

	// Description.
	showDescription: {
		type: 'boolean',
		default: true,
	},
	...createAllCombinationAttributes(
		'description%s', {
			type: 'string',
			source: 'html',
			selector: '.ugb-pricing-box__item%d .ugb-pricing-box__description',
			default: descriptionPlaceholder( 'short' ),
		},
		[ '1', '2', '3' ]
	),
	...createTypographyAttributes( 'description%s' ),
	descriptionColor: {
		type: 'string',
		default: '',
	},

	hoverEffect: {
		type: 'string',
		default: '',
	},

	// Alignment.
	...createAllCombinationAttributes(
		'%s%sAlign', {
			type: 'string',
			default: '',
		},
		[ 'Image', 'Title', 'Price', 'SubPrice', 'Button', 'Description' ],
		[ '', 'Tablet', 'Mobile' ]
	),

	// Spacing.
	...createAllCombinationAttributes(
		'%s%sBottomMargin', {
			type: 'number',
			default: '',
		},
		[ 'Image', 'Title', 'Price', 'SubPrice', 'Button', 'Description' ],
		[ '', 'Tablet', 'Mobile' ]
	),

	// Advanced colors.
	...createAllCombinationAttributes(
		'Column%sBackgroundColor', {
			type: 'string',
			default: '',
		},
		[ '1', '2', '3' ]
	),

	// Colored background.
	...createAllCombinationAttributes(
		'Column%sHeaderBackgroundColor', {
			type: 'string',
			default: '',
		},
		[ '1', '2', '3' ]
	),
}
