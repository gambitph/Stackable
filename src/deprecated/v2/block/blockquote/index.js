/**
 * BLOCK: Blockquote
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */
/**
 * Internal dependencies
 */
import './design'
import deprecated from './deprecated'
import edit from './edit'
import save from './save'
import schema from './schema'
import example from './example'
import _metadata from './block.json'

/**
 * External dependencies
 */
import { BlockquoteIcon } from '~stackable/icons'
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
	title: metadata.title + ' (v2)',
	icon: BlockquoteIcon,
	supports: {
		align: [ 'center', 'wide', 'full' ],
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
		'block-background': {
			importantBackgroundSize: true,
		},
		'block-separators': true,
		// 'block-title': true,
		'content-align': true,
		'block-designs': true,
		'container-link': true,
		'custom-css': {
			default: applyFilters( 'stackable.blockquote.custom-css.default', '' ),
		},
	},
}
