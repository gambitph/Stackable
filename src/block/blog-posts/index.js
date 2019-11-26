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

/**
 * External dependencies
 */
import {
	createBackgroundAttributes,
	createAllCombinationAttributes,
	createTypographyAttributes,
	createResponsiveAttributes,
} from '~stackable/util'
import { BlogPostsIcon } from '~stackable/icons'
import { disabledBlocks, i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

/**
 * Note that this block is half dynamic, half static. We use attributes
 * here since we generate some save.js markup.
 *
 * These should be identical to the ones used in PHP.
 *
 * @see attributes.php
 */
const schema = {
	design: {
		type: 'string',
		default: 'basic',
	},
	columns: {
		type: 'number',
		default: 2,
	},
	borderRadius: {
		type: 'number',
		default: '',
	},
	shadow: {
		type: 'number',
		default: '',
	},
	contentOrder: {
		type: 'string',
		default: '',
	},

	// Posts.
	numberOfItems: {
		type: 'number',
		default: 6,
	},
	order: {
		type: 'string',
		default: 'desc',
	},
	orderBy: {
		type: 'string',
		default: 'date',
	},
	postType: {
		type: 'string',
		default: 'post',
	},
	taxonomyType: {
		type: 'string',
		default: 'category',
	},
	taxonomy: {
		type: 'string',
		default: '',
	},
	postOffset: {
		type: 'number',
		default: '',
	},
	postExclude: {
		type: 'string',
		default: '',
	},
	postInclude: {
		type: 'string',
		default: '',
	},

	// Column.
	...createBackgroundAttributes( 'column%s' ),

	// Featured Image.
	showImage: {
		type: 'boolean',
		default: true,
	},
	imageSize: {
		type: 'string',
		default: '',
	},
	...createResponsiveAttributes( 'image%sWidth', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( 'image%sHeight', {
		type: 'number',
		default: '',
	} ),

	// Category.
	showCategory: {
		type: 'boolean',
		default: true,
	},
	...createTypographyAttributes( 'category%s' ),
	categoryHighlighted: {
		type: 'boolean',
		default: false,
	},
	categoryColor: {
		type: 'string',
		default: '',
	},
	categoryHoverColor: {
		type: 'string',
		default: '',
	},
	...createResponsiveAttributes( 'Category%sAlign', {
		type: 'string',
		default: '',
	} ),

	// Title.
	showTitle: {
		type: 'boolean',
		default: true,
	},
	...createTypographyAttributes( 'title%s' ),
	titleTag: {
		type: 'string',
		defualt: '',
	},
	titleColor: {
		type: 'string',
		default: '',
	},
	titleHoverColor: {
		type: 'string',
		default: '',
	},
	...createResponsiveAttributes( 'Title%sAlign', {
		type: 'string',
		default: '',
	} ),

	// Excerpt.
	showExcerpt: {
		type: 'boolean',
		default: true,
	},
	...createTypographyAttributes( 'excerpt%s' ),
	excerptLength: {
		type: 'number',
		default: '',
	},
	excerptColor: {
		type: 'string',
		default: '',
	},
	...createResponsiveAttributes( 'Excerpt%sAlign', {
		type: 'string',
		default: '',
	} ),

	// Meta.
	showMeta: {
		type: 'boolean',
		default: true,
	},
	showAuthor: {
		type: 'boolean',
		default: true,
	},
	showDate: {
		type: 'boolean',
		default: true,
	},
	showComments: {
		type: 'boolean',
		default: true,
	},
	...createTypographyAttributes( 'meta%s' ),
	metaColor: {
		type: 'string',
		default: '',
	},
	metaSeparator: {
		type: 'string',
		default: '',
	},
	...createResponsiveAttributes( 'Meta%sAlign', {
		type: 'string',
		default: '',
	} ),

	// Readmore.
	showReadmore: {
		type: 'boolean',
		default: true,
	},
	readmoreText: {
		type: 'string',
		default: '',
	},
	...createTypographyAttributes( 'readmore%s' ),
	readmoreColor: {
		type: 'string',
		default: '',
	},
	readmoreHoverColor: {
		type: 'string',
		default: '',
	},
	...createResponsiveAttributes( 'Readmore%sAlign', {
		type: 'string',
		default: '',
	} ),

	// Spacing.
	...createAllCombinationAttributes(
		'%s%sBottomMargin', {
			type: 'number',
			default: '',
		},
		[ 'Image', 'Category', 'Title', 'Excerpt', 'Meta', 'Readmore' ],
		[ '', 'Tablet', 'Mobile' ]
	),
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
		'advanced-column-spacing': {
			verticalColumnAlign: true,
			verticalContentAlign: false,
		},
		'advanced-responsive': true,
		'block-background': true,
		'block-separators': true,
		'block-title': true,
		'content-align': true,
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.blog-posts.custom-css.default', '' ),
		},
	},
}
