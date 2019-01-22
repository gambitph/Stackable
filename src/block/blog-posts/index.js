/**
 * BLOCK: Blog Posts
 */

import { __ } from '@wordpress/i18n'
import { BlogPostsIcon } from '@stackable/icons'
import { disabledBlocks } from 'stackable'

export const name = 'ugb/blog-posts'

export const settings = {
	title: __( 'Posts' ),
	description: __( 'Your latest blog posts. Use this to showcase a few of your posts in your landing pages.' ),
	icon: BlogPostsIcon,
	category: 'stackable',
	keywords: [
		__( 'Blog Posts' ),
		__( 'Stackable' ),
	],

	supports: {
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	// Stackable specific settings.
	sAdminTitle: __( 'Blog Posts' ),
	sDemoURL: 'https://wpstackable.com/blog-posts-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
