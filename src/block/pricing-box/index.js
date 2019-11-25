/**
 * BLOCK: Pricing Box Block.
 */

/**
 * Internal dependencies
 */
import './design'
import deprecated from './deprecated'
import edit from './edit'
import save from './save'

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
} from '~stackable/util'
import { PricingBoxIcon } from '~stackable/icons'
import { disabledBlocks, i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'

const schema = {
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
		defualt: '',
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

export const name = 'ugb/pricing-box'

export const settings = {
	title: __( 'Pricing Box', i18n ),
	description: __( 'Display the different pricing tiers of your business.', i18n ),
	icon: PricingBoxIcon,
	category: 'stackable',
	keywords: [
		__( 'Pricing Box', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	supports: {
		align: [ 'wide' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	deprecated,
	edit,
	save,

	// Stackable modules.
	modules: {
		'advanced-general': true,
		'advanced-block-spacing': true,
		'advanced-column-spacing': {
			verticalColumnAlign: true,
		},
		'advanced-responsive': true,
		'block-background': true,
		'block-separators': true,
		'block-title': true,
		'content-align': true,
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.pricing-box.custom-css.default', '' ),
		},
	},
}

// Reset some attributes if some global attributes are set.
addFilter( 'stackable.pricing-box.setAttributes', 'stackable/pricing-box/imageShape', attributes => {
	if ( typeof attributes.imageShape !== 'undefined' ) {
		return {
			...attributes,
			image1Shape: '',
			image2Shape: '',
			image3Shape: '',
			image1ShapeFlipX: '',
			image1ShapeFlipY: '',
			image1ShapeStretch: '',
			image2ShapeFlipX: '',
			image2ShapeFlipY: '',
			image2ShapeStretch: '',
			image3ShapeFlipX: '',
			image3ShapeFlipY: '',
			image3ShapeStretch: '',
		}
	}

	if ( typeof attributes.imageShapeFlipX !== 'undefined' ) {
		return {
			...attributes,
			image1ShapeFlipX: '',
			image2ShapeFlipX: '',
			image3ShapeFlipX: '',
		}
	}

	if ( typeof attributes.imageShapeFlipY !== 'undefined' ) {
		return {
			...attributes,
			image1ShapeFlipY: '',
			image2ShapeFlipY: '',
			image3ShapeFlipY: '',
		}
	}

	if ( typeof attributes.imageShapeStretch !== 'undefined' ) {
		return {
			...attributes,
			image1ShapeStretch: '',
			image2ShapeStretch: '',
			image3ShapeStretch: '',
		}
	}

	if ( typeof attributes.columnBackgroundColor !== 'undefined' || typeof attributes.columnBackgroundColorType !== 'undefined' ) {
		return {
			...attributes,
			column1BackgroundColor: '',
			column2BackgroundColor: '',
			column3BackgroundColor: '',
		}
	}

	return attributes
} )
