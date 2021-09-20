/**
 * BLOCK: Blog Posts
 */
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
 * External dependencies
 */
import { BlogPostsIcon } from '~stackable/icons'
import { v2disabledBlocks as disabledBlocks } from 'stackable'

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
	icon: BlogPostsIcon,
	supports: {
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
		anchor: true,
	},
	attributes: schema,
	example,

	save,
	edit,
	deprecated,

	// Stackable modules.
	modules: {
		'advanced-general': true,
		'advanced-block-spacing': true,
		'advanced-column-spacing': {
			verticalColumnAlign: true,
			verticalContentAlign: false,
			paddings: false,
		},
		'advanced-custom-attributes': true,
		'advanced-responsive': true,
		'block-background': {
			importantBackgroundSize: true,
		},
		'block-separators': true,
		'block-title': {
			blockTitleMarginBottomImportant: true,
			blockDescriptionMarginBottomImportant: true,
		},
		'content-align': true,
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.blog-posts.custom-css.default', '' ),
		},
	},
}
