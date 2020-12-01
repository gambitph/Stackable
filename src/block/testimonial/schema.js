/**
 * External dependencies
 */
import {
	createBackgroundAttributes,
	createImageAttributes,
	createAllCombinationAttributes,
	createTypographyAttributes,
	createImageBackgroundAttributes,
	createBorderAttributes,
	descriptionPlaceholder,
} from '~stackable/util'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export default {
	design: {
		type: 'string',
		default: '',
	},
	borderRadius: {
		type: 'number',
		default: '',
	},
	shadow: {
		type: 'number',
		default: '',
	},
	columns: {
		type: 'number',
		default: 2,
	},

	// Column.
	...createBackgroundAttributes( 'column%s' ),

	// Border.
	...createBorderAttributes( 'column%s' ),

	// Testimonial.
	showTestimonial: {
		type: 'boolean',
		default: true,
	},
	...createAllCombinationAttributes(
		'testimonial%s', {
			type: 'string',
			source: 'html',
			selector: '.ugb-testimonial__item%d .ugb-testimonial__body',
			default: descriptionPlaceholder( 'medium' ),
		},
		[ '1', '2', '3' ]
	),
	...createTypographyAttributes( 'testimonial%s' ),
	testimonialColor: {
		type: 'string',
		default: '',
	},

	// Image.
	showImage: {
		type: 'boolean',
		default: true,
	},
	...createImageAttributes( 'image%s', {
		exclude: [
			'Url',
			'Id',
			'Alt',
			'BlendMode',
		],
	} ),
	imageShape: {
		type: 'string',
		default: 'circle',
	},
	imageSize: {
		type: 'string',
		default: 'thumbnail',
	},
	...createAllCombinationAttributes(
		'image%sId', {
			type: 'number',
			default: '',
		},
		[ '1', '2', '3' ]
	),
	...createAllCombinationAttributes(
		'image%sUrl', {
			type: 'string',
			default: '',
			// Some layouts can have the image as an image background. Need this to be a normal attribute and not from `src`.
			// source: 'attribute',
			// selector: '.ugb-pricing-box__item%d .ugb-pricing-box__image img',
			// attribute: 'src',
		},
		[ '1', '2', '3' ]
	),
	...createAllCombinationAttributes(
		'image%sAlt', {
			type: 'string',
			default: '',
			source: 'attribute',
			selector: '.ugb-testimonial__item%d .ugb-testimonial__image img',
			attribute: 'alt',
		},
		[ '1', '2', '3' ]
	),
	...createAllCombinationAttributes(
		'image%sShape', {
			type: 'string',
			default: '',
		},
		[ '1', '2', '3' ]
	),
	...createAllCombinationAttributes(
		'image%s%s', {
			type: 'boolean',
			default: false,
		},
		[ '1', '2', '3' ],
		[ 'ShapeFlipX', 'ShapeFlipY', 'ShapeStretch' ]
	),
	...createImageBackgroundAttributes( 'image%s' ),
	...createImageBackgroundAttributes( 'image1%s' ),
	...createImageBackgroundAttributes( 'image2%s' ),
	...createImageBackgroundAttributes( 'image3%s' ),

	// Name.
	showName: {
		type: 'boolean',
		default: true,
	},
	...createAllCombinationAttributes(
		'name%s', {
			type: 'string',
			source: 'html',
			selector: '.ugb-testimonial__item%d .ugb-testimonial__name',
			default: __( 'Name', i18n ),
		},
		[ '1', '2', '3' ]
	),
	nameTag: {
		type: 'string',
		default: '',
	},
	...createTypographyAttributes( 'name%s' ),
	nameColor: {
		type: 'string',
		default: '',
	},

	// Sub Position.
	showPosition: {
		type: 'boolean',
		default: true,
	},
	...createAllCombinationAttributes(
		'position%s', {
			type: 'string',
			source: 'html',
			selector: '.ugb-testimonial__item%d .ugb-testimonial__position',
			default: __( 'Position', i18n ),
		},
		[ '1', '2', '3' ]
	),
	...createTypographyAttributes( 'position%s' ),
	positionColor: {
		type: 'string',
		default: '',
	},

	hoverEffect: {
		type: 'string',
		default: '',
	},

	// Alignment.
	...createAllCombinationAttributes(
		'%s%sAlign', {
			type: 'string',
			default: '',
		},
		[ 'Testimonial', 'Image', 'Name', 'Position' ],
		[ '', 'Tablet', 'Mobile' ]
	),

	// Spacing.
	...createAllCombinationAttributes(
		'%s%sBottomMargin', {
			type: 'number',
			default: '',
		},
		[ 'Testimonial', 'Image', 'Name', 'Position' ],
		[ '', 'Tablet', 'Mobile' ]
	),

	// Advanced colors.
	...createAllCombinationAttributes(
		'Column%sBackgroundColor', {
			type: 'string',
			default: '',
		},
		[ '1', '2', '3' ]
	),

	// Bubble design
	bubbleBackgroundColor: {
		type: 'string',
		default: '',
	},
	...createAllCombinationAttributes(
		'Bubble%sBackgroundColor', {
			type: 'string',
			default: '',
		},
		[ '1', '2', '3' ]
	),

	// Vertical design
	...createAllCombinationAttributes(
		'Vertical%sImageHeight', {
			type: 'number',
			default: '',
		},
		[ '', 'Tablet', 'Mobile' ]
	),
}
