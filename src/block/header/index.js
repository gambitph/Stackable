/**
 * BLOCK: Header Block.
 */

/**
 * External dependencies
 */
import { HeaderIcon } from '~stackable/icons'
import { disabledBlocks, i18n } from 'stackable'

/**
 * Internal dependencies
 */
import './design'
import deprecated from './deprecated'
import edit from './edit'
import save from './save'
import schema from './schema'
import example from './example'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

export const name = 'ugb/header'

export const settings = {
	title: __( 'Header', i18n ),
	description: __( 'A large header title area. Typically used at the very top of a page.', i18n ),
	icon: HeaderIcon,
	category: 'layout',
	keywords: [
		__( 'Header', i18n ),
		__( 'Stackable', i18n ),
	],
	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
		anchor: true,
	},
	attributes: schema,
	example,

	deprecated,
	edit,
	save,

	// Stackable modules.
	modules: {
		'advanced-general': true,
		'advanced-block-spacing': true,
		'advanced-column-spacing': {
			columnGap: false,
			paddings: false,
		},
		'advanced-custom-attributes': true,
		'advanced-responsive': true,
		'advanced-conditional-display': true,
		'block-background': true,
		'block-separators': true,
		// 'block-title': true,
		'container-link': true,
		'content-align': true,
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.header.custom-css.default', '' ),
		},
	},
}
