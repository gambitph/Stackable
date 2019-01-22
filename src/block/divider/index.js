/**
 * BLOCK: Divider Block.
 */

import { __ } from '@wordpress/i18n'
import { disabledBlocks } from 'stackable'
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
}

export const name = 'ugb/divider'

export const settings = {
	title: __( 'Divider' ),
	description: __( 'Add a pause between your content.' ),
	icon: DividerIcon,
	category: 'stackable',
	keywords: [
		__( 'Divider' ),
		__( 'Stackable' ),
	],
	attributes: schema,
	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},
}
