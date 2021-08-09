/**
 * External dependencies
 */
import {
	createImageBackgroundAttributes,
	createAllCombinationAttributes,
	createTypographyAttributes,
	createButtonAttributes,
	createResponsiveAttributes,
	descriptionPlaceholder,
	createBorderAttributes,
} from '~stackable/util'
import {
	createBackgroundAttributes,
} from '../../util'

/**
 * WordPress dependencies
 */
import { i18n } from 'stackable'
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

	// Background.
	...createBackgroundAttributes( 'column%s' ),

	// Border.
	...createBorderAttributes( 'column%s' ),

	// Image.
	showImage: {
		type: 'boolean',
		default: true,
	},
	...createImageBackgroundAttributes( 'image%s' ),
	...createAllCombinationAttributes(
		'imageBackground%s%s', {
			type: 'number',
			default: '',
		},
		[ '', 'Tablet', 'Mobile' ],
		[ 'Width', 'Height' ]
	),
	...createResponsiveAttributes( 'imageBackground%sWidthUnit', {
		type: 'string',
		default: '%',
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
		},
		[ '1', '2', '3' ]
	),

	// Title.
	...createAllCombinationAttributes(
		'title%s', {
			type: 'string',
			source: 'html',
			selector: '.ugb-card__item%d .ugb-card__title',
			default: __( 'Title for This Block', i18n ),
		},
		[ '1', '2', '3' ]
	),
	showTitle: {
		type: 'boolean',
		default: true,
	},
	titleTag: {
		type: 'string',
		default: '',
	},
	...createTypographyAttributes( 'title%s' ),
	titleColor: {
		type: 'string',
		default: '',
	},

	// Subtitle.
	...createAllCombinationAttributes(
		'subtitle%s', {
			type: 'string',
			source: 'html',
			selector: '.ugb-card__item%d .ugb-card__subtitle',
			default: __( 'Subtitle for This Block', i18n ),
		},
		[ '1', '2', '3' ]
	),
	showSubtitle: {
		type: 'boolean',
		default: true,
	},
	...createTypographyAttributes( 'subtitle%s' ),
	subtitleColor: {
		type: 'string',
		default: '',
	},

	// Description.
	...createAllCombinationAttributes(
		'description%s', {
			type: 'string',
			source: 'html',
			selector: '.ugb-card__item%d .ugb-card__description',
			default: descriptionPlaceholder( 'medium' ),
		},
		[ '1', '2', '3' ]
	),
	showDescription: {
		type: 'boolean',
		default: true,
	},
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
		selector: '.ugb-card__item1 .ugb-button',
	} ),
	...createButtonAttributes( 'button2%s', {
		selector: '.ugb-card__item2 .ugb-button',
	} ),
	...createButtonAttributes( 'button3%s', {
		selector: '.ugb-card__item3 .ugb-button',
	} ),

	// Alignments.
	...createAllCombinationAttributes(
		'%s%sAlign', {
			type: 'string',
			default: '',
		},
		[ 'Image', 'Title', 'Subtitle', 'Description', 'Button' ],
		[ '', 'Tablet', 'Mobile' ]
	),

	// Spacing.
	...createAllCombinationAttributes(
		'%s%sBottomMargin', {
			type: 'number',
			default: '',
		},
		[ 'Image', 'Title', 'Subtitle', 'Description', 'Button' ],
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

	hoverEffect: {
		type: 'string',
		default: '',
	},
}
