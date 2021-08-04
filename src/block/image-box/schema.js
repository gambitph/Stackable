/**
 * External dependencies
 */
import {
	createBackgroundAttributes,
	createTypographyAttributes,
	createResponsiveAttributes,
	createAllCombinationAttributes,
	createImageAttributes,
	createImageBackgroundAttributes,
	createBorderAttributes,
} from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'

export default {
	design: {
		type: 'string',
		default: 'basic',
	},
	columns: {
		type: 'number',
		default: 3,
	},
	borderRadius: {
		type: 'number',
		default: '',
	},
	shadow: {
		type: 'number',
		default: '',
	},

	// Border.
	...createBorderAttributes( 'column%s' ),

	// Link.
	...createAllCombinationAttributes(
		'link%sUrl', {
			type: 'string',
			default: '',
			source: 'attribute',
			selector: '.ugb-image-box__item%d .ugb-image-box__overlay-link',
			attribute: 'href',
		},
		[ '1', '2', '3', '4' ]
	),
	...createAllCombinationAttributes(
		'link%s%s', {
			type: 'boolean',
			default: '',
		},
		[ '1', '2', '3', '4' ],
		[
			'NewTab',
			'NoFollow',
			'Sponsored',
			'Ugc',
		]
	),

	// Image.
	...createImageAttributes( 'image%s', {
		exclude: [
			'Url',
			'Id',
			'Alt',
			'BlendMode',
		],
	} ),
	...createImageBackgroundAttributes( 'image%s' ),
	imageSize: {
		type: 'string',
		default: 'large',
	},
	...createAllCombinationAttributes(
		'image%s%s', {
			type: 'number',
			default: '',
		},
		[ '1', '2', '3', '4' ],
		[ 'Id', 'FullWidth', 'FullHeight' ]
	),
	...createAllCombinationAttributes(
		'image%s%s', {
			type: 'string',
			default: '',
		},
		[ '1', '2', '3', '4' ],
		[ 'Url', 'FullUrl' ]
	),

	// Overlay.
	showOverlay: {
		type: 'boolean',
		default: false,
	},
	...createBackgroundAttributes( 'overlay%s' ),
	overlayOpacity: {
		type: 'number',
		default: 0.7,
	},

	// Overlay Hover.
	showOverlayHover: {
		type: 'boolean',
		default: true,
	},
	...createBackgroundAttributes( 'overlayHover%s' ),
	overlayHoverOpacity: {
		type: 'number',
		default: 0.7,
	},

	...createResponsiveAttributes( 'imageBackground%sHeight', {
		type: 'number',
		default: '',
	} ),

	// Effects.
	imageHoverEffect: {
		type: 'string',
		default: '',
	},
	hoverEffect: {
		type: 'string',
		default: '',
	},

	// Line.
	lineColor: {
		type: 'string',
		default: '',
	},
	lineSize: {
		type: 'number',
		default: '',
	},
	...createResponsiveAttributes( 'Line%sAlign', {
		type: 'string',
		default: '',
	} ),

	// Subtitle.
	...createAllCombinationAttributes(
		'subtitle%s', {
			type: 'string',
			source: 'html',
			selector: '.ugb-image-box__item%d .ugb-image-box__subtitle',
			default: __( 'Subtitle', i18n ),
		},
		[ '1', '2', '3', '4' ]
	),
	showSubtitle: {
		type: 'boolean',
		default: true,
	},
	...createTypographyAttributes( 'subtitle%s' ),
	subtitleColor: {
		type: 'string',
		default: '',
	},

	// Title.
	...createAllCombinationAttributes(
		'title%s', {
			type: 'string',
			source: 'html',
			selector: '.ugb-image-box__item%d .ugb-image-box__title',
			default: __( 'Title', i18n ),
		},
		[ '1', '2', '3', '4' ]
	),
	showTitle: {
		type: 'boolean',
		default: true,
	},
	titleTag: {
		type: 'string',
		default: '',
	},
	...createTypographyAttributes( 'title%s' ),
	titleColor: {
		type: 'string',
		default: '',
	},

	// Description.
	...createAllCombinationAttributes(
		'description%s', {
			type: 'string',
			source: 'html',
			selector: '.ugb-image-box__item%d .ugb-image-box__description',
			default: __( 'Description', i18n ),
		},
		[ '1', '2', '3', '4' ]
	),
	showDescription: {
		type: 'boolean',
		default: true,
	},
	...createTypographyAttributes( 'description%s' ),
	descriptionColor: {
		type: 'string',
		default: '',
	},

	// Arrow.
	showArrow: {
		type: 'boolean',
		default: false,
	},
	arrowColor: {
		type: 'string',
		default: '',
	},
	...createResponsiveAttributes( 'Arrow%sSize', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( 'Arrow%sAlign', {
		type: 'string',
		default: '',
	} ),

	// Alignments.
	...createAllCombinationAttributes(
		'%s%sAlign', {
			type: 'string',
			default: '',
		},
		[ 'Subtitle', 'Title', 'Description', 'Arrow' ],
		[ '', 'Tablet', 'Mobile' ]
	),

	// Spacing.
	...createAllCombinationAttributes(
		'%s%sBottomMargin', {
			type: 'number',
			default: '',
		},
		[ 'Subtitle', 'Title', 'Line', 'Description', 'Arrow' ],
		[ '', 'Tablet', 'Mobile' ]
	),
}
