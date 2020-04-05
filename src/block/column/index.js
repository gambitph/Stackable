/**
 * BLOCK: Advanced Columns
 */
/**
 * External dependencies
 */
import { StackableIcon } from '~stackable/icons'
import { i18n } from 'stackable'
import {
	createBackgroundAttributes, createResponsiveAttributes, createAllCombinationAttributes,
} from '~stackable/util'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

export const schema = {
	design: {
		type: 'string',
		default: 'plain',
	},

	...createResponsiveAttributes( '%sColumnContentVerticalAlign', {
		type: 'string',
		default: '',
	} ),
	...createResponsiveAttributes( 'content%sWidth', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( 'content%sWidthUnit', {
		type: 'string',
		default: '',
	} ),
	...createResponsiveAttributes( 'content%sHorizontalAlign', {
		type: 'string',
		default: '',
	} ),

	borderRadius: {
		type: 'number',
		default: '',
	},
	shadow: {
		type: 'number',
		default: '',
	},

	// Column Background
	...createBackgroundAttributes( 'column%s' ),

	// Text Colors
	...createAllCombinationAttributes(
		'%sColor', {
			type: 'string',
			default: '',
		},
		[ 'Heading', 'BodyText', 'Link', 'LinkHover' ]
	),
}

export const name = 'ugb/column'

export const settings = {
	title: __( 'Advanced Column', i18n ),
	description: __( 'A single column within an advanced columns block. Get advanced options on how you want your column to look.', i18n ),
	icon: StackableIcon,
	parent: [ 'ugb/columns' ],
	category: 'layout',
	keywords: [
		__( 'Advanced Columns', i18n ),
		__( 'section rows', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,

	supports: {
		inserter: false,
		reusable: false,
		html: false,
	},

	edit,
	save,

	modules: {
		'advanced-general': true,
		'advanced-block-spacing': true,
		'advanced-column-spacing': {
			columnGap: false,
		},
		'advanced-responsive': true,
		// 'block-background': true,
		// 'block-separators': true,
		// 'block-title': true,
		'content-align': true,
		'custom-css': {
			default: applyFilters( 'stackable.column.custom-css.default', '' ),
		},
	},
}
