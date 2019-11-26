/**
 * BLOCK: Card Block.
 */

/**
 * External dependencies
 */
import { CardIcon } from '~stackable/icons'
import {
	createBackgroundAttributes,
	createImageBackgroundAttributes,
	createAllCombinationAttributes,
	createTypographyAttributes,
	createButtonAttributes,
	createResponsiveAttributes,
	descriptionPlaceholder,
} from '~stackable/util'

/**
 * Internal dependencies
 */
import './design'
import deprecated from './deprecated'
import edit from './edit'
import save from './save'

/**
 * WordPress dependencies
 */
import { disabledBlocks, i18n } from 'stackable'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'

export const schema = {
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
		defualt: '',
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

export const name = 'ugb/card'

export const settings = {
	title: __( 'Card', i18n ),
	description: __( 'Describe a single subject in a small card. You can use this to describe your product, service or a person.', i18n ),
	icon: CardIcon,
	category: 'stackable',
	keywords: [
		__( 'Card', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	supports: {
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
			default: applyFilters( 'stackable.card.custom-css.default', '' ),
		},
	},
}

// For column spacings, use advanced paddings & vertical align on the content area only.
addFilter( 'stackable.card.advanced-column-spacing.paddings.selector', 'stackable/card', () => '.ugb-card__content' )
addFilter( 'stackable.card.advanced-column-spacing.vertical-align.selector', 'stackable/card', () => '.ugb-card__content' )
