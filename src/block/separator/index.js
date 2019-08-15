/**
 * BLOCK: Separator Block.
 */

import { disabledBlocks, i18n } from 'stackable'
import { __ } from '@wordpress/i18n'
import { SeparatorIcon } from '@stackable/icons'

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
	paddingTop: {
		type: 'number',
		default: 0,
	},
	paddingBottom: {
		type: 'number',
		default: 0,
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

	// Custom CSS attributes.
	customCSSUniqueID: {
		type: 'string',
		default: '',
	},
	customCSS: {
		type: 'string',
		default: '',
	},
	customCSSCompiled: {
		type: 'string',
		default: '',
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
}
