/**
 * BLOCK: Number Box Block.
 */
/**
 * External dependencies
 */
import { NumberBoxIcon } from '~stackable/icons'

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
import { disabledBlocks, i18n } from 'stackable'

export const name = 'ugb/number-box'

export const settings = {
	title: __( 'Number Box', i18n ),
	description: __( 'Display steps or methods that your users will do in your service. For example, "Get started in just 3 easy steps: 1, 2 and 3!"', i18n ),
	icon: NumberBoxIcon,
	category: 'layout',
	keywords: [
		__( 'Number Box', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	example,
	supports: {
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
		anchor: true,
	},
	deprecated,
	save,
	edit,

	// Stackable modules.
	modules: {
		'advanced-general': true,
		'advanced-block-spacing': true,
		'advanced-column-spacing': {
			verticalColumnAlign: true,
			paddings: false,
		},
		'advanced-responsive': true,
		'advanced-conditional-display': true,
		'block-background': true,
		'block-separators': true,
		'block-title': {
			marginBottomImportant: true,
		},
		'content-align': true,
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.number-box.custom-css.default', '' ),
		},
	},
}
