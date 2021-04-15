/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	createAllCombinationAttributes,
	createIconAttributes,
	createResponsiveAttributes,
	createTypographyAttributes,
} from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export default {
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

	displayCondition: {
		type: 'object',
	},
}
