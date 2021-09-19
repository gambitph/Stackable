/**
 * BLOCK: Spacer Block
 */
/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'

/**
 * External dependencies
 */
import { SpacerIcon } from '~stackable/icons'
import { settings as _settings } from 'stackable'

export const settings = {
	...metadata,
	icon: SpacerIcon,
	attributes: schema,
	supports: {
		inserter: ! _settings.stackable_disabled_blocks.includes( metadata.name ),
		anchor: true,
	},

	edit,
	save,
}
