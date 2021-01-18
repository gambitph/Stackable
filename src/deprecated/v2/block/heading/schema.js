/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	createTypographyAttributes, createAllCombinationAttributes,
} from '~stackable/util'

export default {
	alignment: {
		type: 'string',
		default: 'center',
	},

	// Title.
	title: {
		source: 'html',
		selector: '.ugb-heading__title',
		default: __( 'Title for This Block', i18n ),
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
	subtitle: {
		source: 'html',
		selector: '.ugb-heading__subtitle',
		default: __( 'Subtitle for this block', i18n ),
	},
	showSubtitle: {
		type: 'boolean',
		default: true,
	},
	...createTypographyAttributes( 'subtitle%s' ),
	subtitleColor: {
		type: 'string',
		default: '',
	},

	// Top Line.
	showTopLine: {
		type: 'boolean',
		default: false,
	},
	topLineColor: {
		type: 'string',
		default: '',
	},
	topLineHeight: {
		type: 'number',
		default: '',
	},
	topLineWidth: {
		type: 'number',
		default: '',
	},
	topLineWidthUnit: {
		type: 'string',
		default: '',
	},

	// Bottom Line.
	showBottomLine: {
		type: 'boolean',
		default: false,
	},
	bottomLineColor: {
		type: 'string',
		default: '',
	},
	bottomLineHeight: {
		type: 'number',
		default: '',
	},
	bottomLineWidth: {
		type: 'number',
		default: '',
	},
	bottomLineWidthUnit: {
		type: 'string',
		default: '',
	},

	// Alignments.
	...createAllCombinationAttributes(
		'%s%sAlign', {
			type: 'string',
			default: '',
		},
		[ 'Title', 'Subtitle', 'TopLine', 'BottomLine' ],
		[ '', 'Tablet', 'Mobile' ]
	),

	// Spacing.
	...createAllCombinationAttributes(
		'%s%sBottomMargin', {
			type: 'number',
			default: '',
		},
		[ 'Title', 'Subtitle', 'TopLine', 'BottomLine' ],
		[ '', 'Tablet', 'Mobile' ]
	),
}
