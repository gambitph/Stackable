/**
 * BLOCK: Spacer Block.
 */

import { __ } from '@wordpress/i18n'
import { disabledBlocks } from 'stackable'
import { SpacerIcon } from '@stackable/icons'

export const schema = {
	height: {
		default: 50,
		type: 'number',
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

export const name = 'ugb/spacer'

export const settings = {
	title: __( 'Spacer' ),
	description: __( 'Sometimes you just need some space.' ),
	icon: SpacerIcon,
	category: 'stackable',
	keywords: [
		__( 'Spacer' ),
		__( 'Stackable' ),
	],
	attributes: schema,
	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},
}
