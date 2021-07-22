
/**
 * Internal dependencies
 */
import './design'

/**
 * External dependencies
 */
import {
	createAllCombinationAttributes,
	createTypographyAttributes,
	createResponsiveAttributes,
	createButtonAttributes,
	createBorderAttributes,
} from '~stackable/util'
import {
	createBackgroundAttributes,
} from '../../util'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * Note that this block is half dynamic, half static. We use attributes
 * here since we generate some save.js markup.
 *
 * These should be identical to the ones used in PHP.
 *
 * @see attributes.php
 */
export default {
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
	taxonomyFilterType: {
		type: 'string',
		default: '__in',
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

	// Border.
	...createBorderAttributes( 'column%s' ),

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
		default: '',
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

	// Pagination
	showPagination: {
		type: 'boolean',
		default: false,
	},
	showNextPrevious: {
		type: 'boolean',
		default: true,
	},
	nextLabel: {
		type: 'string',
		default: __( 'Next »', i18n ),
	},
	previousLabel: {
		type: 'string',
		default: __( '« Previous', i18n ),
	},
	...createButtonAttributes( 'pagination%s', {
		exclude: [
			'Url',
			'NewTab',
			'NoFollow',
			'Icon',
			'IconPosition',
		],
	} ),
	...createResponsiveAttributes( 'pagination%sAlign', {
		type: 'string',
		default: '',
	} ),

	// Button.
	showLoadMoreButton: {
		type: 'boolean',
		default: false,
	},
	loadMoreItems: {
		type: 'number',
		default: '',
	},
	...createButtonAttributes( 'loadMoreButton%s', {
		exclude: [
			'Url',
			'NewTab',
			'NoFollow',
		],
	} ),
	loadMoreButtonText: {
		type: 'string',
		default: __( 'Load More', i18n ),
	},
	...createResponsiveAttributes( 'loadMoreButton%sAlign', {
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
	...createResponsiveAttributes( 'LoadMoreButton%sTopMargin', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( 'Pagination%sTopMargin', {
		type: 'number',
		default: '',
	} ),

}
