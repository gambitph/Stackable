/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	createTypographyAttributes,
	createAllCombinationAttributes,
} from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export default {
	design: {
		type: 'string',
		default: 'plain',
	},
	columns: {
		type: 'number',
		default: 1,
	},
	reverseTitle: {
		type: 'boolean',
		default: false,
	},
	alignment: {
		type: 'string',
		default: 'center',
	},

	// Column Rule.
	showColumnRule: {
		type: 'boolean',
		default: false,
	},
	columnRuleColor: {
		type: 'string',
		default: '',
	},
	columnRuleWidth: {
		type: 'number',
		default: '',
	},
	columnRuleHeight: {
		type: 'number',
		default: '',
	},

	// Title.
	showTitle: {
		type: 'boolean',
		default: false,
	},
	titleTag: {
		type: 'string',
		default: '',
	},
	title: {
		source: 'html',
		selector: '.ugb-text__title',
		default: __( 'Block Title', i18n ),
	},
	...createTypographyAttributes( 'title%s' ),
	titleColor: {
		type: 'string',
		default: '',
	},
	titleVerticalAlign: {
		type: 'string',
		default: '',
	},

	// Subtitle.
	showSubtitle: {
		type: 'boolean',
		default: false,
	},
	subtitle: {
		type: 'string',
		source: 'html',
		selector: '.ugb-text__subtitle',
		default: __( 'Subtitle', i18n ),
	},
	...createTypographyAttributes( 'subtitle%s' ),
	subtitleColor: {
		type: 'string',
		default: '',
	},
	subtitleOnTop: {
		type: 'boolean',
		default: false,
	},

	// Text.
	text1: {
		type: 'string',
		source: 'html',
		selector: '.ugb-text__text-1',
		default: '',
	},
	text2: {
		type: 'string',
		source: 'html',
		selector: '.ugb-text__text-2',
		default: '',
	},
	text3: {
		type: 'string',
		source: 'html',
		selector: '.ugb-text__text-3',
		default: '',
	},
	text4: {
		type: 'string',
		source: 'html',
		selector: '.ugb-text__text-4',
		default: '',
	},
	...createTypographyAttributes( 'text%s' ),
	textColor: {
		type: 'string',
		default: '',
	},

	// Alignments.
	...createAllCombinationAttributes(
		'%s%sAlign', {
			type: 'string',
			default: '',
		},
		[ 'Title', 'Subtitle', 'Text' ],
		[ '', 'Tablet', 'Mobile' ]
	),

	// Spacing.
	...createAllCombinationAttributes(
		'%s%sBottomMargin', {
			type: 'number',
			default: '',
		},
		[ 'Title', 'Subtitle', 'Text' ],
		[ '', 'Tablet', 'Mobile' ]
	),

	displayCondition: {
		type: 'object',
	},
}
