/**
 * External dependencies
 */
import {
	createResponsiveAttributes,
	createAllCombinationAttributes,
	createBackgroundAttributes,
	createImageBackgroundAttributes,
	createBorderAttributes,
} from '~stackable/util'

export default {
	restrictContentWidth: {
		type: 'boolean',
		default: false,
	},
	design: {
		type: 'string',
		default: 'basic',
	},
	...createResponsiveAttributes( '%sHeight', {
		type: 'string',
		default: '',
	} ),
	height: {
		type: 'string',
		default: 'normal',
	},
	...createResponsiveAttributes( 'content%sWidth', {
		type: 'number',
		default: '',
	} ),
	...createAllCombinationAttributes(
		'content%s%sAlign', {
			type: 'string',
			default: '',
		},
		[ 'Vertical', 'Horizontal' ],
		[ '', 'Tablet', 'Mobile' ]
	),

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

	// Column Background
	...createBackgroundAttributes( 'column%s' ),

	// Image.
	...createImageBackgroundAttributes( 'image%s' ),
	imageSize: {
		type: 'string',
		default: 'full',
	},
	...createAllCombinationAttributes(
		'Image%s%s', {
			type: 'number',
			default: '',
		},
		[ '', 'Tablet', 'Mobile' ],
		[ 'Height', 'Width' ]
	),
	...createResponsiveAttributes( 'image%sHeightUnit', {
		type: 'string',
		default: 'px',
	} ),
	...createResponsiveAttributes( 'image%sWidthUnit', {
		type: 'string',
		default: '%',
	} ),

	// Text Colors
	...createAllCombinationAttributes(
		'%sColor', {
			type: 'string',
			default: '',
		},
		[ 'Heading', 'BodyText', 'Link', 'LinkHover' ]
	),

	// Options for image2 & image3 when responsive.
	imageCollapseOnMobile: {
		type: 'boolean',
		default: true,
	},
	imageCollapseOnMobileHeight: {
		type: 'number',
		default: 300,
	},
}
