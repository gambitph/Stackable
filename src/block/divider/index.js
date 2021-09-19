/**
 * BLOCK: Divider Block
 */
/**
 * External dependencies
 */
import { DividerIcon } from '~stackable/icons'
import { settings as _settings } from 'stackable'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'

export const settings = {
	...metadata,
	icon: DividerIcon,
	attributes: schema,
	supports: {
		inserter: ! _settings.stackable_disabled_blocks.includes( metadata.name ),
		align: [ 'center', 'wide', 'full' ],
		anchor: true,
	},

	edit,
	save,
}

