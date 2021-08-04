
/**
 * Internal dependencies
 */
import './design'

/**
 * External dependencies
 */
import {
	descriptionPlaceholder,
	createBackgroundAttributes,
	createImageAttributes,
	createTypographyAttributes,
	createButtonAttributes,
	createAllCombinationAttributes,
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
		default: 3,
	},
	borderRadius: {
		type: 'number',
		default: '',
	},
	shadow: {
		type: 'number',
		default: '',
	},

	// Background.
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
		[ '1', '2', '3', '4' ]
	),
	...createAllCombinationAttributes(
		'image%sUrl', {
			type: 'string',
			default: '',
			source: 'attribute',
			selector: '.ugb-feature-grid__item%d .ugb-feature-grid__image img',
			attribute: 'src',
		},
		[ '1', '2', '3', '4' ]
	),
	...createAllCombinationAttributes(
		'image%sAlt', {
			type: 'string',
			default: '',
			source: 'attribute',
			selector: '.ugb-feature-grid__item%d .ugb-feature-grid__image img',
			attribute: 'alt',
		},
		[ '1', '2', '3', '4' ]
	),
	...createAllCombinationAttributes(
		'image%sShape', {
			type: 'string',
			default: '',
		},
		[ '1', '2', '3', '4' ]
	),
	...createAllCombinationAttributes(
		'image%s%s', {
			type: 'boolean',
			default: false,
		},
		[ '1', '2', '3', '4' ],
		[ 'ShapeFlipX', 'ShapeFlipY', 'ShapeStretch' ]
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
			selector: '.ugb-feature-grid__item%d .ugb-feature-grid__title',
			default: __( 'Title', i18n ),
		},
		[ '1', '2', '3', '4' ]
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

	// Description.
	showDescription: {
		type: 'boolean',
		default: true,
	},
	...createAllCombinationAttributes(
		'description%s', {
			type: 'string',
			source: 'html',
			selector: '.ugb-feature-grid__item%d .ugb-feature-grid__description',
			default: descriptionPlaceholder( 'short' ),
		},
		[ '1', '2', '3', '4' ]
	),
	...createTypographyAttributes( 'description%s' ),
	descriptionColor: {
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
		selector: '.ugb-feature-grid__item1 .ugb-button',
	} ),
	...createButtonAttributes( 'button2%s', {
		selector: '.ugb-feature-grid__item2 .ugb-button',
	} ),
	...createButtonAttributes( 'button3%s', {
		selector: '.ugb-feature-grid__item3 .ugb-button',
	} ),
	...createButtonAttributes( 'button4%s', {
		selector: '.ugb-feature-grid__item4 .ugb-button',
	} ),

	// Alignments.
	...createAllCombinationAttributes(
		'%s%sAlign', {
			type: 'string',
			default: '',
		},
		[ 'Image', 'Title', 'Description', 'Button' ],
		[ '', 'Tablet', 'Mobile' ]
	),

	// Spacing.
	...createAllCombinationAttributes(
		'%s%sBottomMargin', {
			type: 'number',
			default: '',
		},
		[ 'Image', 'Title', 'Description', 'Button' ],
		[ '', 'Tablet', 'Mobile' ]
	),

	hoverEffect: {
		type: 'string',
		default: '',
	},

	// Advanced colors.
	...createAllCombinationAttributes(
		'Column%sBackgroundColor', {
			type: 'string',
			default: '',
		},
		[ '1', '2', '3', '4' ]
	),
}
