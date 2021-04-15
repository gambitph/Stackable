/**
 * External dependencies
 */
import {
	descriptionPlaceholder,
	createBackgroundAttributes,
	createTypographyAttributes,
	createButtonAttributes,
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
		default: 'plain',
	},
	...createResponsiveAttributes( 'imageColumn%sWidth', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( 'container%sWidth', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( 'container%sOffset', {
		type: 'number',
		default: '',
	} ),
	invert: {
		type: 'boolean',
		default: false,
	},
	borderRadius: {
		type: 'number',
		default: '',
	},
	shadow: {
		type: 'number',
		default: '',
	},

	// Background.
	...createBackgroundAttributes( 'column%s' ),

	// Border.
	...createBorderAttributes( 'column%s' ),

	// Image.
	...createImageAttributes( 'image%s' ),
	...createImageBackgroundAttributes( 'image%s' ),
	imageShapeStretch: {
		type: 'boolean',
		default: true,
	},
	...createResponsiveAttributes( 'imageBackground%sHeight', {
		type: 'number',
		default: '',
	} ),

	// Title.
	title: {
		source: 'html',
		selector: '.ugb-feature__title',
		default: __( 'Title for This Block', i18n ),
	},
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
	description: {
		source: 'html',
		selector: '.ugb-feature__description',
		default: descriptionPlaceholder( 'medium' ),
	},
	showDescription: {
		type: 'boolean',
		default: true,
	},
	...createTypographyAttributes( 'description%s' ),
	descriptionColor: {
		type: 'string',
		default: '',
	},

	// Button.
	showButton: {
		type: 'boolean',
		default: true,
	},
	...createButtonAttributes( 'button%s', { selector: '.ugb-button' } ),

	// Spacing.
	...createResponsiveAttributes( 'title%sBottomMargin', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( 'description%sBottomMargin', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( 'button%sBottomMargin', {
		type: 'number',
		default: '',
	} ),

	// Alignments.
	...createAllCombinationAttributes(
		'%s%sAlign', {
			type: 'string',
			default: '',
		},
		[ 'Title', 'Description', 'Button' ],
		[ '', 'Tablet', 'Mobile' ]
	),

	// Effects.
	hoverEffect: {
		type: 'string',
		default: '',
	},

	displayCondition: {
		type: 'object',
	},
}
