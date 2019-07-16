/**
 * BLOCK: Blog Posts
 */

import { disabledBlocks, i18n } from 'stackable'
import { __ } from '@wordpress/i18n'
import { BlogPostsIcon } from '@stackable/icons'

export const name = 'ugb/blog-posts'

export const settings = {
	title: __( 'Posts', i18n ),
	description: __( 'Your latest blog posts. Use this to showcase a few of your posts in your landing pages.', i18n ),
	icon: BlogPostsIcon,
	category: 'stackable',
	keywords: [
		__( 'Blog Posts', i18n ),
		__( 'Stackable', i18n ),
	],

	supports: {
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	// Stackable specific settings.
	sAdminTitle: __( 'Blog Posts', i18n ),
	sDemoURL: 'https://wpstackable.com/blog-posts-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
