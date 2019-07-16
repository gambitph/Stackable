/**
 * BLOCK: Divider Block.
 */

import { disabledBlocks, i18n } from 'stackable'
import { __ } from '@wordpress/i18n'
import { DividerIcon } from '@stackable/icons'

const schema = {
	height: {
		default: 1,
		type: 'number',
	},
	width: {
		default: 50,
		type: 'number',
	},
	color: {
		type: 'string',
		default: '#dddddd',
	},
	alignment: {
		type: 'string',
		default: 'center',
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

export const name = 'ugb/divider'

export const settings = {
	title: __( 'Divider', i18n ),
	description: __( 'Add a pause between your content.', i18n ),
	icon: DividerIcon,
	category: 'stackable',
	keywords: [
		__( 'Divider', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},
}
