/**
 * BLOCK: Separator Block.
 */

/**
 * Internal dependencies
 */
import { default as deprecated } from './deprecated'
import { default as edit } from './edit'
import { default as save } from './save'

/**
 * External dependencies
 */
import { SeparatorIcon } from '~stackable/icons'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { disabledBlocks, i18n } from 'stackable'
import { applyFilters } from '@wordpress/hooks'

export const schema = {
	align: {
		type: 'string',
		default: 'full',
	},
	design: {
		type: 'string',
		default: 'wave-1',
	},
	height: {
		type: 'number',
		default: 200,
	},
	tabletHeight: {
		type: 'number',
		default: '',
	},
	mobileHeight: {
		type: 'number',
		default: '',
	},
	flipVertically: {
		type: 'boolean',
		default: false,
	},
	flipHorizontally: {
		type: 'boolean',
		default: false,
	},
	backgroundColor: {
		type: 'string',
		default: '',
	},
	marginTop: {
		type: 'number',
		default: 0,
	},
	marginBottom: {
		type: 'number',
		default: 0,
	},
	tabletMarginTop: {
		type: 'number',
		default: '',
	},
	tabletMarginBottom: {
		type: 'number',
		default: '',
	},
	mobileMarginTop: {
		type: 'number',
		default: '',
	},
	mobileMarginBottom: {
		type: 'number',
		default: '',
	},
	paddingTop: {
		type: 'number',
		default: 0,
	},
	paddingBottom: {
		type: 'number',
		default: 0,
	},
	tabletPaddingTop: {
		type: 'number',
		default: '',
	},
	tabletPaddingBottom: {
		type: 'number',
		default: '',
	},
	mobilePaddingTop: {
		type: 'number',
		default: '',
	},
	mobilePaddingBottom: {
		type: 'number',
		default: '',
	},

	// Separator
	layer1Color: {
		type: 'string',
		default: '',
	},
	layer1Width: {
		type: 'number',
		default: 1,
	},
	layer1Flip: {
		type: 'boolean',
		default: false,
	},
	layer1Shadow: {
		type: 'boolean',
		default: false,
	},

	// Layer 2
	layer2: {
		type: 'boolean',
		default: false,
	},
	layer2Color: {
		type: 'string',
		default: '',
	},
	layer2Height: {
		type: 'number',
		default: 1,
	},
	layer2Width: {
		type: 'number',
		default: 1,
	},
	layer2Flip: {
		type: 'boolean',
		default: false,
	},
	layer2Opacity: {
		type: 'number',
		default: 0.5,
	},
	layer2BlendMode: {
		type: 'string',
		default: '',
	},

	// Layer 3
	layer3: {
		type: 'boolean',
		default: false,
	},
	layer3Color: {
		type: 'string',
		default: '',
	},
	layer3Height: {
		type: 'number',
		default: 1,
	},
	layer3Width: {
		type: 'number',
		default: 1,
	},
	layer3Flip: {
		type: 'boolean',
		default: false,
	},
	layer3Opacity: {
		type: 'number',
		default: 0.5,
	},
}

export const name = 'ugb/separator'

export const settings = {
	title: __( 'Separator', i18n ),
	description: __( 'A fancy separator to be placed between containers and content.', i18n ),
	icon: SeparatorIcon,
	category: 'stackable',
	keywords: [
		__( 'Separator', i18n ),
		__( 'SVG Divider', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	supports: {
		align: [ 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},
	deprecated,
	save,
	edit,

	// Stackable modules.
	modules: {
		'advanced-general': true,
		'advanced-responsive': true,
		'advanced-block-spacing': {
			enableMarginRight: false,
			enableMarginLeft: false,
			enablePaddingRight: false,
			enablePaddingLeft: false,
			height: false,
			width: false,
			horizontalContentAlign: false,
			verticalContentAlign: false,
			modifyStyles: false,
		},
		'custom-css': {
			default: applyFilters( 'stackable.separator.custom-css.default', '' ),
		},
	},
}
