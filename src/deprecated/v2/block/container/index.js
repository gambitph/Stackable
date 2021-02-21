/**
 * BLOCK: Container Block.
 */

/**
 * External dependencies
 */
import { ContainerIcon } from '~stackable/icons'
import { disabledBlocks, i18n } from 'stackable'

/**
 * Internal dependencies
 */
import deprecated from './deprecated'
import edit from './edit'
import save from './save'
import schema from './schema'
import example from './example'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'

export const name = 'ugb/container'

export const settings = {
	title: __( 'Container', i18n ),
	description: __( 'A styled container that you can add other blocks inside. Use this to create unique layouts.', i18n ),
	icon: ContainerIcon,
	category: 'layout',
	keywords: [
		__( 'Container Layout', i18n ),
		__( 'Row', i18n ),
		__( 'Stackable', i18n ),
	],
	supports: {
		anchor: true,
		align: [ 'center', 'wide', 'full' ],
		html: false,
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
		// Add EditorsKit block navigator toolbar.
		editorsKitBlockNavigator: true,
	},
	deprecated,
	edit,
	save,
	attributes: schema,
	example,

	// Stackable modules.
	modules: {
		'advanced-general': true,
		'advanced-block-spacing': true,
		'advanced-column-spacing': {
			columnGap: false,
			paddings: false,
		},
		'advanced-responsive': true,
		'block-background': true,
		'block-separators': true,
		// 'block-title': true,
		'content-align': true,
		'custom-css': {
			default: applyFilters( 'stackable.container.custom-css.default', '' ),
		},
	},
}

// Remove the default way of how the column spacing -> vertical align works since we are using another method in `style.js`
addFilter( 'stackable.container.advanced-column-spacing.vertical-align', 'stackable/container', () => ( {} ) )
