/**
 * BLOCK: New Block.
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
	descriptionPlaceholder, createTypographyAttributes, createAllCombinationAttributes,
} from '~stackable/util'

const schema = {
	alignment: {
		type: 'string',
		default: 'center',
	},

	// Title.
	title: {
		source: 'html',
		selector: '.ugb-heading__title',
		default: descriptionPlaceholder( 'short' ),
	},
	...createTypographyAttributes( 'title%s' ),
	titleColor: {
		type: 'string',
		defualt: '',
	},

	// Subtitle.
	subtitle: {
		source: 'html',
		selector: '.ugb-heading__subtitle',
		default: descriptionPlaceholder( 'short' ),
	},
	showSubtitle: {
		type: 'boolean',
		default: true,
	},
	...createTypographyAttributes( 'subtitle%s' ),
	subtitleColor: {
		type: 'string',
		defualt: '',
	},

	// Top Line.
	showTopLine: {
		type: 'boolean',
		default: false,
	},
	topLineColor: {
		type: 'string',
		defualt: '',
	},
	topLineHeight: {
		type: 'number',
		defualt: '',
	},
	topLineWidth: {
		type: 'number',
		defualt: '',
	},
	topLineWidthUnit: {
		type: 'string',
		defualt: '',
	},

	// Bottom Line.
	showBottomLine: {
		type: 'boolean',
		default: false,
	},
	bottomLineColor: {
		type: 'string',
		defualt: '',
	},
	bottomLineHeight: {
		type: 'number',
		defualt: '',
	},
	bottomLineWidth: {
		type: 'number',
		defualt: '',
	},
	bottomLineWidthUnit: {
		type: 'string',
		defualt: '',
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
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.heading.custom-css.default', '' ),
		},
	},
}
