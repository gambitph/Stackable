/**
 * BLOCK: Divider Block.
 */

import { __ } from '@wordpress/i18n'
import { disabledBlocks } from 'stackable'
import { DividerIcon } from '@stackable/icons'
import edit from './edit'
import save from './save'

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
		// eslint-disable-next-line
		inserter: false, // TODO: Remove when ready for v2.
	},

	edit,
	save,
}
