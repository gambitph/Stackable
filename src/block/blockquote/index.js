/**
 * BLOCK: Container Block
 */
/**
 * Internal dependencies
 */
import metadata from './block.json'
import edit from './edit'
import save from './save'
import schema from './schema'

/**
 * External dependencies
 */
import { BlockquoteIcon } from '~stackable/icons'
import { settings as _settings } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const settings = {
	...metadata,
	icon: BlockquoteIcon,
	attributes: schema,
	supports: {
		inserter: ! _settings.stackable_disabled_blocks.includes( metadata.name ),
		anchor: true,
		html: false,
		align: true,
	},

	edit,
	save,
}
