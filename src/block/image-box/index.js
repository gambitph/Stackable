/**
 * BLOCK: Image Box Block.
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
import { ImageBoxIcon } from '~stackable/icons'
import {
	createBackgroundAttributes,
	createTypographyAttributes,
	createResponsiveAttributes,
	createAllCombinationAttributes,
	createImageAttributes,
	createImageBackgroundAttributes,
} from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { disabledBlocks, i18n } from 'stackable'

export const schema = {
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
		[ 'NewTab', 'NoFollow' ]
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
		defualt: '',
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
		defualt: '',
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

export const name = 'ugb/image-box'

export const settings = {
	title: __( 'Image Box', i18n ),
	description: __( 'Display an image that shows more information when hovered on. Can be used as a fancy link to other pages.', i18n ),
	icon: ImageBoxIcon,
	category: 'stackable',
	keywords: [
		__( 'Image Box', i18n ),
		__( 'Stackable', i18n ),
	],
	supports: {
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},
	attributes: schema,

	deprecated,
	edit,
	save,

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
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.image-box.custom-css.default', '' ),
		},
	},
}

// The "height" option is really the "columnHeight" option. @see edit.js
// Disable the default column height.
addFilter( 'stackable.image-box.advanced-column-spacing.styles', 'stackable/image-box/column-height', styles => {
	styles[ '> .ugb-inner-block > .ugb-block-content > *' ] = {
		minHeight: undefined,
	}
	styles.tablet[ '> .ugb-inner-block > .ugb-block-content > *' ] = {
		minHeight: undefined,
	}
	styles.mobile[ '> .ugb-inner-block > .ugb-block-content > *' ] = {
		minHeight: undefined,
	}

	return styles
} )
