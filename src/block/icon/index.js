/**
 * BLOCK: Icon Block.
 */

/**
 * External dependencies
 */
import { disabledBlocks, i18n } from 'stackable'
import {
	createAllCombinationAttributes,
	createIconAttributes,
	createResponsiveAttributes,
	createTypographyAttributes,
} from '~stackable/util'
import { IconIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import './design'
import edit from './edit'
import save from './save'
import deprecated from './deprecated'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'

const schema = {
	// This is for optimization purposes.
	compiledStyles: {
		source: 'html',
		selector: 'style',
		default: '',
	},

	columns: {
		type: 'number',
		default: 1,
	},
	alignment: {
		type: 'string',
		default: 'center',
	},

	// Icons.
	icon1: {
		type: 'string',
		source: 'html',
		selector: '.ugb-icon__item1 .ugb-icon-inner-svg',
		default: 'far-star',
	},
	icon2: {
		type: 'string',
		source: 'html',
		selector: '.ugb-icon__item2 .ugb-icon-inner-svg',
		default: 'far-circle',
	},
	icon3: {
		type: 'string',
		source: 'html',
		selector: '.ugb-icon__item3 .ugb-icon-inner-svg',
		default: 'far-square',
	},
	icon4: {
		type: 'string',
		source: 'html',
		selector: '.ugb-icon__item4 .ugb-icon-inner-svg',
		default: 'far-heart',
	},
	icon5: {
		type: 'string',
		source: 'html',
		selector: '.ugb-icon__item5 .ugb-icon-inner-svg',
		default: 'far-arrow-alt-circle-up',
	},
	icon6: {
		type: 'string',
		source: 'html',
		selector: '.ugb-icon__item6 .ugb-icon-inner-svg',
		default: 'far-times-circle',
	},
	icon7: {
		type: 'string',
		source: 'html',
		selector: '.ugb-icon__item7 .ugb-icon-inner-svg',
		default: 'far-check-circle',
	},
	icon8: {
		type: 'string',
		source: 'html',
		selector: '.ugb-icon__item8 .ugb-icon-inner-svg',
		default: 'far-question-circle',
	},
	...createIconAttributes( 'icon%s' ),

	// Links.
	...createAllCombinationAttributes(
		'Url%s', {
			type: 'string',
			source: 'attribute',
			selector: '.ugb-icon__item%s .ugb-icon__icon',
			attribute: 'href',
			default: '',
		},
		[ '1', '2', '3', '4', '5', '6', '7', '8' ]
	),
	...createAllCombinationAttributes(
		'NewTab%s', {
			type: 'boolean',
			source: 'attribute',
			selector: '.ugb-icon__item%s .ugb-icon__icon',
			attribute: 'target',
			default: '',
		},
		[ '1', '2', '3', '4', '5', '6', '7', '8' ]
	),
	...createAllCombinationAttributes(
		'NoFollow%s', {
			type: 'boolean',
			default: '',
		},
		[ '1', '2', '3', '4', '5', '6', '7', '8' ]
	),

	// Title.
	showTitle: {
		type: 'boolean',
		default: false,
	},
	titleTop: {
		type: 'boolean',
		default: false,
	},
	...createAllCombinationAttributes(
		'Title%s', {
			type: 'string',
			source: 'html',
			selector: '.ugb-icon__item%s .ugb-icon__title',
			default: __( 'Title', i18n ),
		},
		[ '1', '2', '3', '4', '5', '6', '7', '8' ]
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

	// Spacing.
	...createResponsiveAttributes( 'icon%sBottomMargin', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( 'title%sBottomMargin', {
		type: 'number',
		default: '',
	} ),

	// Alignment
	...createAllCombinationAttributes(
		'%s%sAlign', {
			type: 'string',
			default: '',
		},
		[ 'Icon', 'Title' ],
		[ '', 'Tablet', 'Mobile' ]
	),

	hoverEffect: {
		type: 'string',
		default: '',
	},
}

export const name = 'ugb/icon'

export const settings = {
	title: __( 'Icon', i18n ),
	description: __( 'Pick an icon or upload your own SVG icon to decorate your content.', i18n ),
	icon: IconIcon,
	category: 'common',
	keywords: [
		__( 'Icon', i18n ),
		__( 'SVG', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	supports: {
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
		anchor: true,
	},

	edit,
	save,
	deprecated,

	// Stackable modules.
	modules: {
		'advanced-general': true,
		'advanced-block-spacing': true,
		'advanced-column-spacing': {
			paddings: false,
		},
		'advanced-responsive': true,
		'block-background': true,
		'block-separators': true,
		'block-title': true,
		'content-align': true,
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.icon.custom-css.default', '' ),
		},
	},
}
