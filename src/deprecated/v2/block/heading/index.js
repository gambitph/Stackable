/**
 * BLOCK: Heading Block.
 */

/**
 * External dependencies
 */
import { disabledBlocks } from 'stackable'
import { HeadingIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import './design'
import edit from './edit'
import save from './save'
import deprecated from './deprecated'
import schema from './schema'
import example from './example'
import _metadata from './block.json'

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
	title: metadata.title + ' (v2)',
	icon: HeadingIcon,
	attributes: schema,
	example,
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
		'advanced-custom-attributes': true,
		'advanced-responsive': true,
		'content-align': true,
		'custom-css': {
			default: applyFilters( 'stackable.heading.custom-css.default', '' ),
		},
	},
}
