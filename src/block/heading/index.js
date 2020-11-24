/**
 * BLOCK: Heading Block.
 */

/**
 * External dependencies
 */
import { disabledBlocks, i18n } from 'stackable'
import { HeadingIcon } from '~stackable/icons'

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
import {
	createTypographyAttributes, createAllCombinationAttributes,
} from '~stackable/util'

const schema = {
	// This is for optimization purposes.
	compiledStyles: {
		source: 'html',
		selector: 'style',
		default: '',
	},

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

export const name = 'ugb/heading'

export const settings = {
	title: __( 'Advanced Heading', i18n ),
	description: __( 'Introduce new sections of your content in style.', i18n ),
	icon: HeadingIcon,
	category: 'common',
	keywords: [
		__( 'Heading', i18n ),
		__( 'Title', i18n ),
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
		'advanced-responsive': true,
		'content-align': true,
		'custom-css': {
			default: applyFilters( 'stackable.heading.custom-css.default', '' ),
		},
	},
}
