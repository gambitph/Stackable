/**
 * BLOCK: Icon Block.
 */

/**
 * External dependencies
 */
import { disabledBlocks, i18n } from 'stackable'
import { IconIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import './design'
import edit from './edit'
import save from './save'
import deprecated from './deprecated'
import schema from './schema'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'

export const name = 'ugb/icon'

export const settings = {
	title: __( 'Icon', i18n ),
	description: __( 'Pick an icon or upload your own SVG icon to decorate your content.', i18n ),
	icon: IconIcon,
	category: 'common',
	keywords: [
		__( 'Icon', i18n ),
		__( 'SVG', i18n ),
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
		'advanced-column-spacing': {
			paddings: false,
		},
		'advanced-responsive': true,
		'block-background': true,
		'block-separators': true,
		'block-title': {
			marginBottomImportant: true,
		},
		'content-align': true,
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.icon.custom-css.default', '' ),
		},
	},
}
