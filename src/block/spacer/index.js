/**
 * BLOCK: Spacer Block.
 */

import { disabledBlocks, i18n } from 'stackable'
import { __ } from '@wordpress/i18n'
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
	title: __( 'Spacer', i18n ),
	description: __( 'Sometimes you just need some space.', i18n ),
	icon: SpacerIcon,
	category: 'stackable',
	keywords: [
		__( 'Spacer', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},
}
