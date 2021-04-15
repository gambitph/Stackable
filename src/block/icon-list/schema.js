/**
 * External dependencies
 */
import { createTypographyAttributes, createResponsiveAttributes } from '~stackable/util'
import { range } from 'lodash'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import { DEFAULT_CHECK_SVG, createIconListIconAttributes } from './util'

export default {
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

	displayCondition: {
		type: 'object',
	},
}
