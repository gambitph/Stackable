/**
 * BLOCK: Notification
 */

/**
 * Internal dependencies
 */
import deprecated from './deprecated'
import edit from './edit'
import save from './save'
import schema from './schema'
import example from './example'

/**
 * External dependencies
 */
import { ExpandIcon } from '~stackable/icons'
import { disabledBlocks, i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

export const name = 'ugb/expand'

export const settings = {
	title: __( 'Expand / Show More', i18n ),
	description: __( 'Display a small snippet of text. Your readers can toggle it to show more information.', i18n ),
	icon: ExpandIcon,
	category: 'layout',
	keywords: [
		__( 'Expand', i18n ),
		__( 'Show more/less', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	example,
	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
		anchor: true,
	},

	deprecated,
	edit,
	save,

	// Stackable modules.
	modules: {
		'advanced-general': true,
		'advanced-block-spacing': true,
		// 'advanced-column-spacing': {
		// 	columnGap: false,
		// 	height: false,
		// 	verticalContentAlign: false,
		// 	paddingSelector: '.ugb-block-content',
		// },
		'advanced-responsive': true,
		'advanced-conditional-display': true,
		// 'block-background': true,
		// 'block-separators': true,
		// 'block-title': true,
		'content-align': true,
		'custom-css': {
			default: applyFilters( 'stackable.expand.custom-css.default', '' ),
		},
	},
}
