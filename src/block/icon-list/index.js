/**
 * BLOCK: Icon List Block.
 */

/**
 * External dependencies
 */
import { createTypographyAttributes, createResponsiveAttributes } from '~stackable/util'
import { IconListIcon } from '~stackable/icons'
import { range } from 'lodash'
import { disabledBlocks, i18n } from 'stackable'

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
import { __, sprintf } from '@wordpress/i18n'
import { applyFilters, addFilter } from '@wordpress/hooks'
import { DEFAULT_CHECK_SVG, createIconListIconAttributes } from './util'

export const schema = {
	icon: {
		type: 'string',
		default: DEFAULT_CHECK_SVG,
	},
	iconShape: {
		type: 'string',
	},
	iconColor: {
		type: 'string',
	},
	...createResponsiveAttributes( 'icon%sSize', {
		type: 'number',
		default: '',
	} ),
	columns: {
		type: 'number',
		default: 2,
	},
	tabletColumns: {
		type: 'number',
		default: '',
	},
	mobileColumns: {
		type: 'number',
		default: '',
	},
	text: {
		source: 'html',
		selector: 'ul',
		multiline: 'li',
		default: range( 1, 7 ).map( i => sprintf( __( 'Line %d', i18n ), i ) ).map( s => `<li>${ s }</li>` ).join( '' ),
	},
	displayAsGrid: {
		type: 'boolean',
		default: false,
	},
	gap: {
		type: 'number',
		default: '',
	},
	listTextColor: {
		type: 'string',
		default: '',
	},
	opacity: {
		type: 'number',
		default: '',
	},
	rotation: {
		type: 'number',
		default: '',
	},
	...createTypographyAttributes( 'listText%s' ),
	...createIconListIconAttributes(),
}

export const name = 'ugb/icon-list'

export const settings = {
	title: __( 'Icon List', i18n ),
	description: __( 'An unordered list with icons. You can use this as a list of features or benefits.', i18n ),
	icon: IconListIcon,
	category: 'common',
	keywords: [
		__( 'Icon List', i18n ),
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
		// 'advanced-column-spacing': true,
		'advanced-responsive': true,
		'block-background': true,
		'block-separators': true,
		'block-title': true,
		'content-align': true,
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.icon-list.custom-css.default', '' ),
		},
	},
}

// If the user changes the icon in the inspector, change all icons
addFilter( 'stackable.icon-list.setAttributes', 'stackable/icon-list/icon', ( attributes, blockProps ) => {
	if ( typeof attributes.icon === 'undefined' ) {
		return attributes
	}

	range( 1, 21 ).forEach( index => {
		if ( blockProps.attributes[ `icon${ index }` ] ) {
			attributes[ `icon${ index }` ] = undefined
		}
	} )

	return attributes
} )
