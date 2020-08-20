/**
 * BLOCK: Icon List Block.
 */

/**
 * External dependencies
 */
import { createTypographyAttributes } from '~stackable/util'
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
import { createIconListIconAttributes } from './util'

export const schema = {
	icon: {
		type: 'string',
		default: '<svg data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>',
	},
	iconShape: {
		type: 'string',
	},
	iconColor: {
		type: 'string',
	},
	iconSize: {
		type: 'number',
		default: 20,
	},
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
		default: 16,
	},
	listTextColor: {
		type: 'string',
		default: '',
	},
	opacity: {
		type: 'number',
		default: 1.0,
	},
	rotation: {
		type: 'number',
		default: 0,
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
