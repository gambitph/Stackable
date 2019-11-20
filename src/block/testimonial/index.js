/**
 * BLOCK: Testimonial Block.
 */

/**
 * Internal dependencies
 */
import './design'
import deprecated from './deprecated'
import edit from './edit'
import save from './save'

/**
 * External dependencies
 */
import {
	createBackgroundAttributes,
	createImageAttributes,
	createAllCombinationAttributes,
	createTypographyAttributes,
	createImageBackgroundAttributes,
	descriptionPlaceholder,
} from '~stackable/util'
import { TestimonialIcon } from '~stackable/icons'
import { disabledBlocks, i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'

export const schema = {
	design: {
		type: 'string',
		default: 'basic',
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
		defualt: '',
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

export const name = 'ugb/testimonial'

export const settings = {
	title: __( 'Testimonial', i18n ),
	description: __( 'Showcase what your users say about your product or service.', i18n ),
	icon: TestimonialIcon,
	category: 'stackable',
	keywords: [
		__( 'Testimonial', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	supports: {
		align: [ 'wide' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	deprecated,
	edit,
	save,

	// Stackable modules.
	modules: {
		'advanced-general': true,
		'advanced-block-spacing': true,
		'advanced-column-spacing': {
			verticalColumnAlign: true,
		},
		'advanced-responsive': true,
		'block-background': true,
		'block-separators': true,
		'block-title': true,
		'content-align': true,
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.testimonial.custom-css.default', '' ),
		},
	},
}

// Reset some attributes if some global attributes are set.
addFilter( 'stackable.testimonial.setAttributes', 'stackable/testimonial/imageShape', attributes => {
	if ( typeof attributes.imageShape !== 'undefined' ) {
		return {
			...attributes,
			image1Shape: '',
			image2Shape: '',
			image3Shape: '',
			image1ShapeFlipX: '',
			image1ShapeFlipY: '',
			image1ShapeStretch: '',
			image2ShapeFlipX: '',
			image2ShapeFlipY: '',
			image2ShapeStretch: '',
			image3ShapeFlipX: '',
			image3ShapeFlipY: '',
			image3ShapeStretch: '',
		}
	}

	if ( typeof attributes.imageShapeFlipX !== 'undefined' ) {
		return {
			...attributes,
			image1ShapeFlipX: '',
			image2ShapeFlipX: '',
			image3ShapeFlipX: '',
		}
	}

	if ( typeof attributes.imageShapeFlipY !== 'undefined' ) {
		return {
			...attributes,
			image1ShapeFlipY: '',
			image2ShapeFlipY: '',
			image3ShapeFlipY: '',
		}
	}

	if ( typeof attributes.imageShapeStretch !== 'undefined' ) {
		return {
			...attributes,
			image1ShapeStretch: '',
			image2ShapeStretch: '',
			image3ShapeStretch: '',
		}
	}

	if ( typeof attributes.columnBackgroundColor !== 'undefined' || typeof attributes.columnBackgroundColorType !== 'undefined' ) {
		return {
			...attributes,
			column1BackgroundColor: '',
			column2BackgroundColor: '',
			column3BackgroundColor: '',
		}
	}

	return attributes
} )
