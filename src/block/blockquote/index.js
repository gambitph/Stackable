/**
 * BLOCK: Blockquote Block
 */
/**
 * Internal dependencies
 */
import variations from './variations'
import metadata from './block.json'
import edit from './edit'
import save from './save'
import schema from './schema'

/**
 * External dependencies
 */
import { BlockquoteIcon } from '~stackable/icons'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const settings = {
	...metadata,
	icon: BlockquoteIcon,
	attributes: schema,
	supports: {
		anchor: true,
		html: false,
		align: true,
	},

	variations,
	edit,
	save,
}
