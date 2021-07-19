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
import _metadata from './block.json'

/**
 * External dependencies
 */
import { ExpandIcon } from '~stackable/icons'
import { disabledBlocks } from 'stackable'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

const {
	name,
	...metadata
} = _metadata

export { name }

export const settings = {
	...metadata,
	icon: ExpandIcon,
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
		'advanced-custom-attributes': true,
		// 'advanced-column-spacing': {
		// 	columnGap: false,
		// 	height: false,
		// 	verticalContentAlign: false,
		// 	paddingSelector: '.ugb-block-content',
		// },
		'advanced-responsive': true,
		// 'block-background': true,
		// 'block-separators': true,
		// 'block-title': true,
		'content-align': true,
		'custom-css': {
			default: applyFilters( 'stackable.expand.custom-css.default', '' ),
		},
	},
}
