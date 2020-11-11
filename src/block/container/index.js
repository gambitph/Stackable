/**
 * BLOCK: Container Block.
 */

/**
 * External dependencies
 */
import { ContainerIcon } from '~stackable/icons'
import {
	createResponsiveAttributes,
	createAllCombinationAttributes,
	createBackgroundAttributes,
	createImageBackgroundAttributes,
} from '~stackable/util'
import { disabledBlocks, i18n } from 'stackable'

/**
 * Internal dependencies
 */
import deprecated from './deprecated'
import edit from './edit'
import save from './save'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'

export const schema = {
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

export const name = 'ugb/container'

export const settings = {
	title: __( 'Container', i18n ),
	description: __( 'A styled container that you can add other blocks inside. Use this to create unique layouts.', i18n ),
	icon: ContainerIcon,
	category: 'layout',
	keywords: [
		__( 'Container Layout', i18n ),
		__( 'Row', i18n ),
		__( 'Stackable', i18n ),
	],
	supports: {
		anchor: true,
		align: [ 'center', 'wide', 'full' ],
		html: false,
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
		// Add EditorsKit block navigator toolbar.
		editorsKitBlockNavigator: true,
	},
	deprecated,
	edit,
	save,
	attributes: schema,

	// Stackable modules.
	modules: {
		'advanced-general': true,
		'advanced-block-spacing': true,
		'advanced-column-spacing': {
			columnGap: false,
			paddings: false,
		},
		'advanced-responsive': true,
		'block-background': true,
		'block-separators': true,
		// 'block-title': true,
		'content-align': true,
		'custom-css': {
			default: applyFilters( 'stackable.container.custom-css.default', '' ),
		},
	},
}

// Remove the default way of how the column spacing -> vertical align works since we are using another method in `style.js`
addFilter( 'stackable.container.advanced-column-spacing.vertical-align', 'stackable/container', () => ( {} ) )
