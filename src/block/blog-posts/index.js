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

/**
 * External dependencies
 */
import { BlogPostsIcon } from '~stackable/icons'
import { disabledBlocks, i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

export const name = 'ugb/blog-posts'

export const settings = {
	title: __( 'Posts', i18n ),
	description: __( 'Your latest blog posts. Use this to showcase a few of your posts in your landing pages.', i18n ),
	icon: BlogPostsIcon,
	category: 'layout',
	keywords: [
		__( 'Blog Posts', i18n ),
		__( 'Stackable', i18n ),
	],
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
			default: applyFilters( 'stackable.blog-posts.custom-css.default', '' ),
		},
	},
}
