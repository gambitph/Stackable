/**
 * BLOCK: Separator Block.
 */
/**
 * Internal dependencies
 */
import save from './save'
import edit from './edit'
import schema from './schema'
import metadata from './block.json'

/**
 * External dependencies
 */
import { SeparatorIcon } from '~stackable/icons'
import { settings as _settings } from 'stackable'

export const settings = {
	...metadata,
	icon: SeparatorIcon,
	supports: {
		inserter: ! _settings.stackable_disabled_blocks.includes( metadata.name ),
		align: [ 'full' ],
		anchor: true,
	},

	attributes: schema,
	edit,
	save,
}
