/**
 * BLOCK: Separator Block.
 */

import { __ } from '@wordpress/i18n'
import { disabledBlocks } from 'stackable'
import { SeparatorIcon } from '@stackable/icons'

export const schema = {
	align: {
		type: 'string',
		default: 'full',
	},
	height: {
		type: 'number',
		default: 100,
	},
	paddingTop: {
		type: 'number',
		default: 50,
	},
	paddingBottom: {
		type: 'number',
		default: 50,
	},
	color: {
		type: 'string',
		default: '',
	},
	color2: {
		type: 'string',
		default: '',
	},
	color3: {
		type: 'string',
		default: '',
	},
	shadow: {
		type: 'boolean',
		default: false,
	},
	inverted: {
		type: 'boolean',
		default: false,
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
	title: __( 'Separator' ),
	description: __( 'Specially designed separator to be placed between containers and content.' ),
	icon: SeparatorIcon,
	category: 'stackable',
	keywords: [
		__( 'Separator' ),
		__( 'SVG Divider' ),
		__( 'Stackable' ),
	],
	attributes: schema,
	supports: {
		align: [ 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},
}
