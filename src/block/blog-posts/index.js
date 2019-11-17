/**
 * BLOCK: Blog Posts
 */
/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import deprecated from './deprecated'

/**
 * External dependencies
 */
import { BlogPostsIcon } from '~stackable/icons'
import { disabledBlocks, i18n } from 'stackable'
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'

const schema = {
	// TODO: Add new attributes, then generate the PHP version based on this.
}

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
	attributes: schema,

	save,
	edit,
	deprecated,

	// Stackable modules.
	modules: {
		'advanced-general': true,
		'advanced-block-spacing': true,
		'advanced-column-spacing': true,
		'advanced-responsive': true,
		'block-background': true,
		'block-separators': true,
		'block-title': true,
		'content-align': true,
		'custom-css': {
			default: applyFilters( 'stackable.blog-posts.custom-css.default', '' ),
		},
	},
}

// Since this is a dynamic block, do not declare any attributes during block registration or else we will lose all our attributes in PHP.
// @see https://github.com/WordPress/gutenberg/issues/18439
addFilter( 'stackable.blog-posts.settings', 'stackable/block-posts', blockSettings => omit( blockSettings, [ 'attributes' ] ) )
